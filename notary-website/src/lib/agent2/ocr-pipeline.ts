/**
 * Agent 2 — OCR Pipeline
 * Uses Claude Vision API to extract text from scanned documents.
 */

import type { OCRResult, DocumentType } from "./types";
import { DOCUMENT_TYPE_LABELS } from "./constants";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const OCR_SYSTEM_PROMPT = `אתה מומחה OCR למסמכים ישראליים רשמיים. תפקידך לחלץ טקסט מלא ומדויק מתמונות של מסמכים.

חוקים:
1. חלץ את **כל** הטקסט מהמסמך — כולל כותרות, כתוביות, חותמות, תאריכים, מספרים
2. שמור על מבנה המסמך המקורי (כותרות, שדות, טבלאות)
3. אל תדלג על שום פרט — כל מילה חשובה לתרגום נוטריוני
4. אם טקסט לא קריא — סמן [ILLEGIBLE] במקום המתאים
5. מספרי ת.ז., תאריכים, שמות — חייבים להיות מדויקים ב-100%
6. זהה את סוג המסמך (תעודת נישואין, לידה, גירושין וכו')
7. החזר JSON מובנה עם שדות ספציפיים לפי סוג המסמך

החזר JSON בפורמט הבא:
{
  "document_type": "marriage-certificate | birth-certificate | divorce-certificate | death-certificate | diploma | drivers-license | police-clearance | generic",
  "source_language": "he",
  "full_text": "הטקסט המלא של המסמך כפי שהוא מופיע, עם \\n בין שורות",
  "structured_fields": {
    "title": "כותרת המסמך",
    "certificate_no": "מספר תעודה",
    "or_number": "מספר OR (אם קיים)",
    "issued_by": "גורם מנפיק",
    "date_of_issue": "תאריך הנפקה",
    // שדות ספציפיים לסוג המסמך
  },
  "estimated_word_count": 200,
  "confidence": 0.95,
  "notes": "הערות על קריאות, חלקים לא ברורים וכו'"
}`;

export async function ocrDocument(imageBase64: string, mimeType: string = "image/png"): Promise<OCRResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const resp = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: OCR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "חלץ את כל הטקסט מהמסמך הזה. החזר JSON מובנה כפי שהוגדר.",
            },
          ],
        },
      ],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic OCR error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
  const rawText = textBlock?.text || "";

  // Parse JSON from Claude's response
  let parsed;
  try {
    // Extract JSON from response (may be wrapped in markdown code block)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in OCR response");
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("OCR JSON parse error:", e, "Raw:", rawText.slice(0, 500));
    // Fallback: treat entire response as text
    parsed = {
      document_type: "generic",
      source_language: "he",
      full_text: rawText,
      structured_fields: {},
      estimated_word_count: rawText.split(/\s+/).length,
      confidence: 0.5,
    };
  }

  return {
    documentType: parsed.document_type as DocumentType,
    sourceLanguage: parsed.source_language || "he",
    extractedText: parsed.full_text,
    structuredFields: parsed.structured_fields || {},
    estimatedWordCount: parsed.estimated_word_count || 0,
    confidence: parsed.confidence || 0.5,
  };
}

// Detect document type from text if OCR didn't identify it
export function detectDocumentType(text: string): DocumentType {
  const lower = text.toLowerCase();
  if (/תעודת נישואין|marriage/i.test(text)) return "marriage-certificate";
  if (/תעודת לידה|birth/i.test(text)) return "birth-certificate";
  if (/תעודת גירושין|גט|divorce/i.test(text)) return "divorce-certificate";
  if (/תעודת פטירה|death/i.test(text)) return "death-certificate";
  if (/דיפלומה|תואר|bachelor|master|degree/i.test(text)) return "diploma";
  if (/רישיון נהיגה|driving|driver/i.test(text)) return "drivers-license";
  if (/אישור משטרה|תעודת יושר|police|criminal/i.test(text)) return "police-clearance";
  return "generic";
}

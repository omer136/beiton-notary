/**
 * Agent 2 — Translation Engine
 * Translates documents using Claude API with learned corrections and glossaries.
 */

import type { OCRResult, TranslationResult, TargetLanguage, LearnedCorrectionsDB, DocumentGlossary } from "./types";
import { DOCUMENT_TYPE_LABELS, LANGUAGE_LABELS } from "./constants";
import * as fs from "fs";
import * as path from "path";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const CORRECTIONS_PATH = path.join(process.cwd(), "data/agent2/learned_corrections.json");
const GLOSSARIES_DIR = path.join(process.cwd(), "data/agent2/glossaries");

function loadCorrections(): LearnedCorrectionsDB | null {
  try {
    if (fs.existsSync(CORRECTIONS_PATH)) {
      return JSON.parse(fs.readFileSync(CORRECTIONS_PATH, "utf-8"));
    }
  } catch (e) {
    console.error("Error loading corrections:", e);
  }
  return null;
}

function loadGlossary(docType: string): DocumentGlossary | null {
  try {
    const p = path.join(GLOSSARIES_DIR, `${docType}.json`);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    }
  } catch (e) {
    console.error("Error loading glossary:", e);
  }
  return null;
}

function buildTranslationPrompt(
  ocr: OCRResult,
  targetLang: TargetLanguage,
  corrections: LearnedCorrectionsDB | null,
  glossary: DocumentGlossary | null,
): string {
  const langInfo = LANGUAGE_LABELS[targetLang];
  const docLabel = DOCUMENT_TYPE_LABELS[ocr.documentType];

  let prompt = `את מתרגמת נוטריונית מקצועית. תרגמי את המסמך הבא מ${ocr.sourceLanguage === "he" ? "עברית" : ocr.sourceLanguage} ל${langInfo.he}.

סוג המסמך: ${docLabel.he} (${docLabel.en})

## כללי תרגום נוטריוני:
1. **דיוק מוחלט** — כל מילה, מספר, תאריך, שם — חייב להיות מדויק ב-100%
2. **שמות אישיים** — תעתיק לפי הנוהג הישראלי המקובל (Cohen לא Kohen, Yafo לא Jaffa)
3. **תאריכים** — הצג גם לועזי וגם עברי: "May 2, 2022 (1 Iyar 5782)"
4. **מספרי ת.ז.** — העתק כמות שהם, ללא שינוי
5. **מוסדות רשמיים** — תרגם לשם הרשמי המקובל בינלאומית
6. **חותמות ופרטים לא קריאים** — סמן [Seal] או [Illegible]
7. **אל תוסיפי ואל תשמיטי** — תרגום נאמן ומלא בלבד
8. **מבנה** — שמרי על מבנה המסמך המקורי (טבלאות, שורות, שדות)

## פורמט נדרש:
החזירי JSON בפורמט:
{
  "translated_text": "הטקסט המתורגם המלא, עם \\n בין שורות",
  "structured_translation": {
    "title": "...",
    // שדות מתורגמים בהתאם לסוג המסמך
  },
  "word_count": 200,
  "notes": "הערות על בחירות תרגום, מונחים שנויים במחלוקת וכו'"
}`;

  // Add learned corrections
  if (corrections && Object.keys(corrections.patterns).length > 0) {
    prompt += `\n\n## תיקונים נלמדים — חובה ליישם:
הנוטריון תיקן את התרגומים הבאים בעבר. **חובה** להשתמש בגרסה הנכונה:
`;
    for (const [wrong, correct] of Object.entries(corrections.patterns)) {
      prompt += `- "${wrong}" ← שגוי. השתמשי ב: "${correct}"\n`;
    }
  }

  // Add glossary
  if (glossary && Object.keys(glossary.terminology).length > 0) {
    prompt += `\n\n## מילון מונחים ל${docLabel.he}:
`;
    for (const [he, translation] of Object.entries(glossary.terminology)) {
      prompt += `- ${he} = ${translation}\n`;
    }
  }

  if (glossary?.structural_notes?.length) {
    prompt += `\n\n## הערות מבניות:
`;
    for (const note of glossary.structural_notes) {
      prompt += `- ${note}\n`;
    }
  }

  prompt += `\n\n## המסמך המקורי:\n${ocr.extractedText}`;

  return prompt;
}

export async function translateDocument(
  ocr: OCRResult,
  targetLang: TargetLanguage,
): Promise<TranslationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const corrections = loadCorrections();
  const glossary = loadGlossary(ocr.documentType);
  const prompt = buildTranslationPrompt(ocr, targetLang, corrections, glossary);

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
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic translation error ${resp.status}: ${err}`);
  }

  const data = await resp.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
  const rawText = textBlock?.text || "";

  let parsed;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in translation response");
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    // Fallback: use raw text as translation
    parsed = {
      translated_text: rawText,
      structured_translation: {},
      word_count: rawText.split(/\s+/).length,
    };
  }

  // Apply pattern corrections post-translation
  let translatedText = parsed.translated_text || "";
  const appliedCorrections: string[] = [];
  if (corrections?.patterns) {
    for (const [wrong, correct] of Object.entries(corrections.patterns)) {
      if (translatedText.includes(wrong)) {
        translatedText = translatedText.replace(new RegExp(escapeRegex(wrong), "g"), correct);
        appliedCorrections.push(`"${wrong}" → "${correct}"`);
      }
    }
  }

  return {
    originalText: ocr.extractedText,
    translatedText,
    structuredTranslation: parsed.structured_translation || {},
    wordCount: parsed.word_count || translatedText.split(/\s+/).length,
    corrections_applied: appliedCorrections,
    targetLanguage: targetLang,
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Agent 2 — DOCX Generator
 * Creates notarial translation Word documents using the `docx` npm package.
 * 7-part structure. Notary details always blank (underscores).
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, HeadingLevel,
  Header, Footer, PageNumber, NumberFormat,
} from "docx";
import type { OCRResult, TranslationResult, TargetLanguage } from "./types";
import { DOCUMENT_TYPE_LABELS, LANGUAGE_LABELS, NOTARY_DECLARATION, FEE_REFERENCE, TRANSLATION_PRICING } from "./constants";

function separator(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "─".repeat(55), size: 20, color: "999999" })],
    spacing: { before: 100, after: 100 },
  });
}

function bilingualHeading(he: string, en: string): Paragraph[] {
  return [
    new Paragraph({
      children: [new TextRun({ text: he, bold: true, size: 26, font: "David" })],
      spacing: { before: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: en, bold: true, size: 26, font: "Times New Roman" })],
      spacing: { after: 100 },
    }),
  ];
}

function textParagraph(text: string, opts?: { bold?: boolean; size?: number; font?: string; align?: typeof AlignmentType[keyof typeof AlignmentType] }): Paragraph {
  return new Paragraph({
    alignment: opts?.align,
    children: [new TextRun({
      text,
      bold: opts?.bold,
      size: (opts?.size || 12) * 2,
      font: opts?.font || "Times New Roman",
    })],
    spacing: { after: 80 },
  });
}

function calculateFees(wordCount: number): { label: string; amount: number }[] {
  const p = TRANSLATION_PRICING;
  const lines: { label: string; amount: number }[] = [];

  // First 100 words
  lines.push({ label: "עד 100 מילים ראשונות / First 100 words", amount: p.first100words });

  // 100-1000
  const remaining = Math.max(0, wordCount - 100);
  const blocksTo1000 = remaining > 0 ? Math.min(Math.ceil(remaining / 100), 9) : 0;
  if (blocksTo1000 > 0) {
    lines.push({
      label: `${blocksTo1000} × 100 מילים נוספות / Additional 100-word blocks`,
      amount: blocksTo1000 * p.per100wordsTo1000,
    });
  }

  // Above 1000
  const above1000 = Math.max(0, wordCount - 1000);
  if (above1000 > 0) {
    const blocks = Math.ceil(above1000 / 100);
    lines.push({
      label: `${blocks} × 100 מילים מעל 1,000 / Blocks above 1,000 words`,
      amount: blocks * p.per100wordsAbove1000,
    });
  }

  return lines;
}

export async function generateNotarialDOCX(
  ocr: OCRResult,
  translation: TranslationResult,
  targetLang: TargetLanguage,
  clientName: string,
  certificateNo?: string,
): Promise<Buffer> {
  const docLabel = DOCUMENT_TYPE_LABELS[ocr.documentType];
  const langInfo = LANGUAGE_LABELS[targetLang];
  const fields = ocr.structuredFields;
  const fees = calculateFees(translation.wordCount);
  const feeTotal = fees.reduce((s, f) => s + f.amount, 0);

  const sections: (Paragraph | Table)[] = [];

  // ═══════ TITLE ═══════
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `אישור נכונות תרגום מס׳ ${certificateNo || "____/____"}`, bold: true, size: 28, font: "David" })],
      spacing: { before: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Certificate of Translation Accuracy No. ${certificateNo || "____/____"}`, bold: true, size: 28, font: "Times New Roman" })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "═".repeat(55), size: 20, color: "333333" })],
    }),
  );

  // ═══════ PART A — NOTARY DETAILS (BLANK) ═══════
  sections.push(...bilingualHeading("חלק א׳ — פרטי הנוטריון", "Part A — Notary Details"));
  sections.push(
    textParagraph("אני, __________________________, נוטריון מס׳ __________, מאשר/ת בזאת כי:", { font: "David" }),
    textParagraph("I, __________________________, Notary Public No. __________, hereby certify that:"),
  );
  sections.push(separator());

  // ═══════ PART B — ORIGINAL DOCUMENT DESCRIPTION ═══════
  sections.push(...bilingualHeading("חלק ב׳ — תיאור המסמך המקורי", "Part B — Original Document Description"));

  const descRows = [
    ["סוג המסמך / Document Type", `${docLabel.he} / ${docLabel.en}`],
    ["מספר תעודה / Certificate No.", fields.certificate_no || fields.or_number || "—"],
    ["מונפק ע\"י / Issued by", fields.issued_by || "—"],
    ["תאריך הנפקה / Date of Issue", fields.date_of_issue || "—"],
    ["שפת המקור / Source Language", "עברית / Hebrew"],
    ["שפת התרגום / Target Language", `${langInfo.he} / ${langInfo.native}`],
  ];

  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: descRows.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22 })] })],
          borders: { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } },
        }),
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: value, size: 22 })] })],
          borders: { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } },
        }),
      ],
    })),
  }));
  sections.push(separator());

  // ═══════ PART C — ORIGINAL DOCUMENT ═══════
  sections.push(...bilingualHeading("חלק ג׳ — המסמך המקורי", "Part C — Original Document"));
  for (const line of ocr.extractedText.split("\n")) {
    if (line.trim()) {
      sections.push(textParagraph(line.trim(), { font: "David" }));
    }
  }
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "— סוף המקור / End of Original —", bold: true, size: 22 })],
      spacing: { before: 200, after: 200 },
    }),
  );
  sections.push(separator());

  // ═══════ PART D — TRANSLATION ═══════
  sections.push(...bilingualHeading("חלק ד׳ — התרגום", "Part D — Translation"));
  for (const line of translation.translatedText.split("\n")) {
    if (line.trim()) {
      sections.push(textParagraph(line.trim(), { font: langInfo.font }));
    }
  }
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "— End of Translation / סוף התרגום —", bold: true, size: 22 })],
      spacing: { before: 200, after: 200 },
    }),
  );
  sections.push(separator());

  // ═══════ PART E — NOTARY DECLARATION ═══════
  sections.push(...bilingualHeading("חלק ה׳ — הצהרת הנוטריון", "Part E — Notary Declaration"));
  sections.push(
    textParagraph(NOTARY_DECLARATION.he("עברית", langInfo.he), { font: "David" }),
    textParagraph(NOTARY_DECLARATION.en("Hebrew", langInfo.native)),
  );
  sections.push(separator());

  // ═══════ PART F — WORD COUNT & FEE ═══════
  sections.push(...bilingualHeading("חלק ו׳ — ספירת מילים ושכר נוטריוני", "Part F — Word Count & Notarial Fee"));
  sections.push(textParagraph(FEE_REFERENCE.he, { font: "David", size: 11 }));
  sections.push(textParagraph(FEE_REFERENCE.en, { size: 11 }));

  const feeRows = [
    ...fees.map(f => [f.label, `${f.amount} ₪`]),
    [`מספר מילים בתרגום / Translation word count`, String(translation.wordCount)],
    ["סה\"כ שכר נוטריוני / Total notarial fee", `${feeTotal} ₪`],
  ];

  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: feeRows.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: label, size: 22 })] })],
          borders: { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: value, bold: true, size: 22 })] })],
          borders: { top: { style: BorderStyle.SINGLE, size: 1 }, bottom: { style: BorderStyle.SINGLE, size: 1 }, left: { style: BorderStyle.SINGLE, size: 1 }, right: { style: BorderStyle.SINGLE, size: 1 } },
          width: { size: 20, type: WidthType.PERCENTAGE },
        }),
      ],
    })),
  }));
  sections.push(separator());

  // ═══════ PART G — SIGNATURE & SEAL (BLANK) ═══════
  sections.push(...bilingualHeading("חלק ז׳ — חתימה וחותמת", "Part G — Signature & Seal"));
  sections.push(
    textParagraph("תאריך / Date: _________________________"),
    new Paragraph({ spacing: { before: 400 } }),
    textParagraph("________________________"),
    textParagraph("שם הנוטריון / Notary Name: _________________________", { font: "David" }),
    textParagraph("מספר רישיון / License No.: _________________________"),
    new Paragraph({ spacing: { before: 200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "[חותמת הנוטריון / Notary Seal]", size: 22, color: "999999" })],
    }),
  );

  // Build the document
  const doc = new Document({
    sections: [{
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "BEITON & Co  |  ", font: "Arial", size: 18, bold: true }),
                new TextRun({ text: "Notarial Translation", font: "Arial", size: 18, color: "666666" }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "מסמך חסוי — יחסי עו\"ד-לקוח  |  Confidential — Attorney-Client Privilege  |  Page ", size: 16, color: "999999" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "999999" }),
              ],
            }),
          ],
        }),
      },
      children: sections,
    }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

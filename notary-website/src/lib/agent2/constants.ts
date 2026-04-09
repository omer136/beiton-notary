import type { DocumentType } from "./types";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, { he: string; en: string }> = {
  "marriage-certificate": { he: "תעודת נישואין", en: "Marriage Certificate" },
  "birth-certificate": { he: "תעודת לידה", en: "Birth Certificate" },
  "divorce-certificate": { he: "תעודת גירושין", en: "Divorce Certificate" },
  "death-certificate": { he: "תעודת פטירה", en: "Death Certificate" },
  "diploma": { he: "דיפלומה / תעודה אקדמית", en: "Diploma / Academic Degree" },
  "drivers-license": { he: "רישיון נהיגה", en: "Driver's License" },
  "police-clearance": { he: "אישור משטרה / תעודת יושר", en: "Police Clearance Certificate" },
  "generic": { he: "מסמך כללי", en: "General Document" },
};

export const LANGUAGE_LABELS: Record<string, { he: string; native: string; font: string; direction: "ltr" | "rtl" }> = {
  en: { he: "אנגלית", native: "English", font: "Times New Roman", direction: "ltr" },
  ru: { he: "רוסית", native: "Русский", font: "Times New Roman", direction: "ltr" },
  ar: { he: "ערבית", native: "العربية", font: "Traditional Arabic", direction: "rtl" },
  fr: { he: "צרפתית", native: "Français", font: "Times New Roman", direction: "ltr" },
  es: { he: "ספרדית", native: "Español", font: "Times New Roman", direction: "ltr" },
};

// Expected word counts for common document types (for QA validation)
export const EXPECTED_WORD_RANGES: Record<DocumentType, { min: number; max: number }> = {
  "marriage-certificate": { min: 100, max: 350 },
  "birth-certificate": { min: 80, max: 250 },
  "divorce-certificate": { min: 150, max: 500 },
  "death-certificate": { min: 70, max: 200 },
  "diploma": { min: 60, max: 300 },
  "drivers-license": { min: 50, max: 150 },
  "police-clearance": { min: 60, max: 250 },
  "generic": { min: 30, max: 10000 },
};

// Notary declaration text — bilingual
export const NOTARY_DECLARATION = {
  he: (sourceLang: string, targetLang: string) =>
    `אני, הח"מ __________________, נוטריון מס׳ ______, מאשר/ת בזאת כי התרגום דלעיל מ${sourceLang} ל${targetLang} הינו תרגום נאמן ומלא של המסמך המקורי שהוצג בפניי, בהתאם לסעיף 13 לחוק הנוטריונים, תשל"ו-1976 ותקנות הנוטריונים, תשל"ז-1977.`,
  en: (sourceLang: string, targetLang: string) =>
    `I, the undersigned __________________, Notary Public No. ______, hereby certify that the above is a true and faithful translation from ${sourceLang} to ${targetLang} of the original document presented before me, in accordance with Section 13 of the Notaries Law, 5736-1976 and the Notaries Regulations, 5737-1977.`,
};

// Fee reference
export const FEE_REFERENCE = {
  he: "בהתאם לתקנות הנוטריונים (שכר שירותים), תשל״ט-1978, פרט 3",
  en: "In accordance with the Notaries Regulations (Service Fees), 5739-1978, Item 3",
};

// Pricing (from regulations 2026)
export const TRANSLATION_PRICING = {
  first100words: 289,
  per100wordsTo1000: 228,
  per100wordsAbove1000: 113,
  notaryTranslatesSurcharge: 0.5,  // +50%
};

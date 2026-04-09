/**
 * Agent 2 — Notarial Translation Document Production System
 * Type definitions
 */

export type DocumentType =
  | "marriage-certificate"
  | "birth-certificate"
  | "divorce-certificate"
  | "death-certificate"
  | "diploma"
  | "drivers-license"
  | "police-clearance"
  | "generic";

export type TargetLanguage = "en" | "ru" | "ar" | "fr" | "es";

export interface CaseData {
  itemId: string;
  clientName: string;
  sourceFileUrl: string;
  sourceFileName: string;
  documentType?: DocumentType;
  languagePair: string;         // "עברית→אנגלית"
  targetLanguage: TargetLanguage;
  wordCount?: number;
  urgency: string;
  needsApostille: boolean;
  apostilleType?: string;
}

export interface OCRResult {
  documentType: DocumentType;
  sourceLanguage: string;
  extractedText: string;
  structuredFields: Record<string, string>;  // e.g. { husband_name: "עומר בית און", ... }
  estimatedWordCount: number;
  confidence: number;           // 0-1
  rawImageBase64?: string;      // for passing to translation
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  structuredTranslation: Record<string, string>;
  wordCount: number;
  corrections_applied: string[];  // learned patterns that were applied
  targetLanguage: TargetLanguage;
}

export interface DOCXSections {
  partA_notaryDetails: string;  // blank — notary fills in
  partB_description: {
    documentType: string;
    certificateNo: string;
    issuedBy: string;
    dateOfIssue: string;
    sourceLanguage: string;
    targetLanguage: string;
  };
  partC_original: string;       // full Hebrew text
  partD_translation: string;    // full translated text
  partE_declaration: { he: string; en: string };
  partF_wordCountAndFee: {
    wordCount: number;
    feeBreakdown: { label: string; amount: number }[];
  };
  partG_signature: string;      // blank — notary signs
}

export interface QACheck {
  name: string;
  passed: boolean;
  details?: string;
}

export interface QAReport {
  checks: QACheck[];
  passedCount: number;
  totalCount: number;
  overallScore: number;         // 0-100
  warnings: string[];
}

export interface LearningCorrection {
  id: string;
  category: string;
  severity: "cosmetic" | "minor" | "moderate" | "major" | "critical";
  wrong_text: string;
  correct_text: string;
  word_corrections: { wrong: string; correct: string }[];
  analysis: {
    root_cause: string;
    lesson: string;
    prevention: string;
  };
  source: string;               // case item ID
  learned_at: string;
  occurrences: number;
  last_seen: string;
}

export interface LearnedCorrectionsDB {
  _meta: {
    schema_version: number;
    total_rules: number;
    last_updated: string;
  };
  rules: LearningCorrection[];
  patterns: Record<string, string>;  // fast lookup: wrong → correct
}

export interface DocumentGlossary {
  documentType: DocumentType;
  terminology: Record<string, string>;  // Hebrew → target language
  structural_notes: string[];
  common_fields: { field: string; translation: string }[];
  last_updated: string;
}

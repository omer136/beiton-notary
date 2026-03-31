/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Single source of truth for notary pricing.
 * Prices from Monday board 18406291217 — תקנות הנוטריונים (שכר שירותים) תשל״ט-1978, עדכון 2026.
 * All prices before VAT (18%).
 */
export const PRICING_CONFIG: Record<string, any> = {
  translation: { type: "words", label: { he: "תרגום נוטריוני", en: "Notarial Translation", ru: "Нотариальный перевод", ar: "ترجمة توثيقية", fr: "Traduction Notariale", es: "Traduccion Notarial" }, base: 251, per100to1000: 197, per100above1000: 99, fields: ["words"] },
  signature: { type: "stamp", label: { he: "אימות חתימה", en: "Signature Authentication", ru: "Заверение подписи", ar: "توثيق التوقيع", fr: "Authentification de Signature", es: "Autenticacion de Firma" }, firstStamp: 197, additionalStamp: 77, fields: ["signatories"] },
  poa: { type: "stamp", label: { he: "ייפוי כוח נוטריוני", en: "Notarial Power of Attorney", ru: "Нотариальная доверенность", ar: "توكيل رسمي", fr: "Procuration notariale", es: "Poder notarial" }, firstStamp: 197, additionalStamp: 77, fields: ["signatories", "copies"] },
  affidavit: { type: "stamp", label: { he: "תצהיר נוטריוני", en: "Notarial Affidavit", ru: "Аффидевит", ar: "إفادة خطية", fr: "Affidavit Notarial", es: "Declaracion Jurada" }, firstStamp: 200, additionalStamp: 80, fields: ["signatories"] },
  will: { type: "stamp", label: { he: "צוואה נוטריונית", en: "Notarial Will", ru: "Нотариальное завещание", ar: "وصية توثيقية", fr: "Testament Notarial", es: "Testamento Notarial" }, firstStamp: 293, additionalStamp: 147, fields: ["signatories"] },
  prenup: { type: "fixed", label: { he: "הסכם ממון", en: "Prenuptial Agreement", ru: "Брачный договор", ar: "اتفاقية مالية", fr: "Contrat de Mariage", es: "Acuerdo Prenupcial" }, base: 446, perCopy: 74, fields: ["copies"] },
  certifiedCopy: { type: "page", label: { he: "העתק נאמן למקור", en: "Certified True Copy", ru: "Заверенная копия", ar: "نسخة طبق الأصل", fr: "Copie certifiee conforme", es: "Copia certificada" }, firstPage: 77, additionalPage: 13, fields: ["pages"] },
  lifeCertificate: { type: "fixed", label: { he: "אישור חיים", en: "Life Certificate", ru: "Свидетельство о жизни", ar: "شهادة حياة", fr: "Certificat de vie", es: "Certificado de vida" }, base: 197, fields: [] },
};

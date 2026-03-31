"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AgentChat from "./AgentChat";
import { PRICING_CONFIG } from "@/data/pricing-config";
import { trackContactClick, trackServiceExplored } from "@/lib/analytics";
import SiteFooter from "./SiteFooter";

/* ═══════════════════════════════════════════════════════════
   BEITON & Co — Notary Website v2
   All fixes applied per Omer's feedback
   ═══════════════════════════════════════════════════════════ */

const LANGS: Record<string, { label: string; dir: string; font: string }> = {
  he: { label: "עברית", dir: "rtl", font: "'Noto Sans Hebrew', sans-serif" },
  en: { label: "English", dir: "ltr", font: "'DM Sans', sans-serif" },
  ru: { label: "Русский", dir: "ltr", font: "'DM Sans', sans-serif" },
  ar: { label: "العربية", dir: "rtl", font: "'Noto Sans Arabic', sans-serif" },
  fr: { label: "Français", dir: "ltr", font: "'DM Sans', sans-serif" },
  es: { label: "Español", dir: "ltr", font: "'DM Sans', sans-serif" },
};

/* ══ תקנות הנוטריונים (שכר שירותים), תשל"ט-1978 — תעריפים 2026 ══
   המחשבון מציג אך ורק שירותים המוסדרים בתקנות.
   שירותים נלווים (אפוסטיל, משלוח, איסוף) מנוהלים ע"י סוכן 1. */
// PRICING_CONFIG imported from @/data/pricing-config

// Slug for each use case item — same order as items arrays in all languages
const UC_SLUGS = [
  "birth-certificate-translation", "diploma-translation", "drivers-license-translation", "marriage-certificate-translation", "divorce-certificate-translation", "portuguese-citizenship-package",
  "contract-signature-authentication", "nda-signature-authentication", "consent-minor-travel",
  "general-power-of-attorney", "poa-property-sale", "continuing-power-of-attorney", "mortgage-poa",
  "single-status-affidavit", "residency-affidavit", "translator-declaration",
  "personal-will", "mutual-will-spouses",
  "prenuptial-agreement", "postnuptial-agreement",
  "passport-certified-copy", "academic-diploma-copy", "company-documents-copy",
  "life-certificate-pension", "life-certificate-retirees",
];

/* ══ קונפיג לסוכן 1 (תקשורת) — שירותים נלווים ואפשרויות קבלה ══ */
const AGENT_SERVICE_CONFIG = {
  deliveryOptions: {
    digital: { he: "דיגיטלי (וואטסאפ/מייל)", en: "Digital (WhatsApp/Email)", price: 0, availableFor: ["translation", "certifiedCopy"] },
    courier: { he: "שליח (איסוף והחזרה)", en: "Courier (pickup & return)", pricePerDirection: 100, note: "100₪+מע״מ לכיוון. מחיר BEITON — לא בתקנות.", availableFor: ["translation", "certifiedCopy", "signature", "poa", "affidavit"] },
    office: { he: "קבלה במשרד", en: "At the office", price: 0, availableFor: ["translation", "signature", "poa", "affidavit", "will", "prenup", "certifiedCopy"] },
    homeVisit: { he: "נוטריון עד הבית", en: "Notary home visit", price: null, note: "הצעת מחיר לפי מקרה. לפי התקנות: 645₪/שעה + נסיעות, אך BEITON מתמחר לפי מקרה.", availableFor: ["signature", "poa", "affidavit", "will"] },
  },
  ancillaryServices: {
    apostille_court: { he: "אפוסטיל בית משפט", en: "Apostille (Court)", govFee: 41, included: true, note: "אגרה 41₪ למסמך. כלול בשירות הנוטריוני. נדרש למסמכים נוטריוניים שמיועדים למדינות חברות באמנת האג." },
    apostille_mofa: { he: "אפוסטיל משרד החוץ", en: "Apostille (Foreign Ministry)", govFee: 40, orderLink: "https://beta.delawvery.co.il/he/forms/ForeignApostille?mode=continueAsGuest", note: "אגרה ממשלתית 40₪ למסמך. למסמכים ציבוריים (תעודת לידה, נישואין וכו׳). ניתן להזמין דרך דלוברי." },
    urgentTranslation: { he: "תרגום דחוף (24 שעות)", en: "Urgent translation (24h)", surcharge: "50%", note: "תוספת 50% על שכר התרגום לפי התקנות" },
    foreignLanguageSurcharge: { he: "תוספת שפה (לא עברית/אנגלית/ערבית)", en: "Foreign language surcharge", amount: 104, note: "תוספת 104₪ לאישור בשפה שאינה עברית, אנגלית או ערבית — קבוע בתקנות" },
    afterHoursSurcharge: { he: "תוספת שעות חריגות", en: "After-hours surcharge", surcharge: "50%", note: "תוספת 50% לשירות בין 19:00-08:00 או בימי מנוחה — קבוע בתקנות" },
  },
};

// Keep AGENT_SERVICE_CONFIG in scope for potential agent use
void AGENT_SERVICE_CONFIG;

const T: Record<string, any> = {
  he: {
    nav: { home: "ראשי", services: "שירותים", usecases: "מקרי שימוש", pricing: "מחירון", track: "מעקב הזמנה", blog: "בלוג", about: "אודות", contact: "יצירת קשר" },
    hero: { h1: "שירותי נוטריון בישראל", chatGreeting: "היי! אני נועה מצוות הנוטריון. איך אפשר לעזור?", chatPlaceholder: "מה את/ה צריך/ה? (תרגום, אימות חתימה, צוואה...)", chatSend: "שלח" },
    services: { tag: "NOTARY SERVICES", h2: "שירותים נוטריוניים בישראל", subtitle: "כל הפעולות הנוטריוניות במקום אחד", items: [
      { id: "translation", name: "תרגום נוטריוני", desc: "תרגום מסמכים רשמי עם אימות נוטריוני — מוכר בכל הרשויות.", icon: "translate" },
      { id: "signature", name: "אימות חתימה", desc: "הנוטריון מאשר שפלוני חתם על מסמך בפניו — נדרש לייפוי כוח, NDA, ועוד.", icon: "signature" },
      { id: "affidavit", name: "תצהיר נוטריוני", desc: "הצהרה בכתב שנחתמת בפני נוטריון לאחר אזהרה — לבתי משפט ורשויות.", icon: "affidavit" },
      { id: "will", name: "צוואה נוטריונית", desc: "צוואה שנערכת ונחתמת בפני נוטריון לפי חוק הירושה — הבטוחה ביותר.", icon: "will" },
      { id: "prenup", name: "הסכם ממון", desc: "הסכם בין בני זוג לפי חוק יחסי ממון — מחייב אישור נוטריוני.", icon: "prenup" },
      { id: "poa", name: "ייפוי כוח נוטריוני", desc: "ייפוי כוח כללי, למקרקעין, בלתי חוזר או למשכנתא — חתימה בפני נוטריון.", icon: "poa" },
      { id: "certifiedCopy", name: "העתק נאמן למקור", desc: "אישור שהעתק מסמך זהה למקור — לדרכונים, תעודות ומסמכי חברה.", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "אישור חיים", desc: "אישור נוטריוני שאדם נמצא בחיים — לקצבאות ופנסיה מחו״ל.", icon: "lifeCertificate" },
    ], calcBtn: "חישוב מחיר" },
    useCases: { tag: "USE CASES", h2: "שירותי נוטריון נפוצים", subtitle: "חיפוש לפי הצורך שלך", allFilter: "הכל", items: [
      { name: "תרגום תעודת לידה", tag: "תרגום נוטריוני" }, { name: "תרגום דיפלומה", tag: "תרגום נוטריוני" }, { name: "תרגום רישיון נהיגה", tag: "תרגום נוטריוני" }, { name: "תרגום תעודת נישואין", tag: "תרגום נוטריוני" }, { name: "תרגום תעודת גירושין", tag: "תרגום נוטריוני" }, { name: "חבילת מסמכים לאזרחות פורטוגזית", tag: "תרגום נוטריוני" },
      { name: "אימות חתימה על חוזה", tag: "אימות חתימה" }, { name: "אימות חתימה על NDA", tag: "אימות חתימה" }, { name: "הסכמה להוצאת קטין לחו״ל", tag: "אימות חתימה" },
      { name: "ייפוי כוח כללי", tag: "ייפוי כוח נוטריוני" }, { name: "ייפוי כוח למכירת דירה", tag: "ייפוי כוח נוטריוני" }, { name: "ייפוי כוח מתמשך", tag: "ייפוי כוח נוטריוני" }, { name: "ייפוי כוח למשכנתא", tag: "ייפוי כוח נוטריוני" },
      { name: "תצהיר רווקות", tag: "תצהיר נוטריוני" }, { name: "תצהיר מגורים", tag: "תצהיר נוטריוני" }, { name: "הצהרת מתרגם", tag: "תצהיר נוטריוני" },
      { name: "צוואה אישית", tag: "צוואה נוטריונית" }, { name: "צוואה הדדית (בני זוג)", tag: "צוואה נוטריונית" },
      { name: "הסכם ממון לפני נישואין", tag: "הסכם ממון" }, { name: "הסכם ממון אחרי נישואין", tag: "הסכם ממון" },
      { name: "העתק נאמן לדרכון", tag: "העתק נאמן למקור" }, { name: "העתק נאמן לתעודה אקדמית", tag: "העתק נאמן למקור" }, { name: "העתק נאמן למסמכי חברה", tag: "העתק נאמן למקור" },
      { name: "אישור חיים לפנסיה מחו״ל", tag: "אישור חיים" }, { name: "אישור חיים לגמלאים", tag: "אישור חיים" },
    ] },
    pricing: { tag: "PRICING", h2: "מחשבון שירותי נוטריון", subtitle: "התעריף קבוע בתקנות הנוטריונים (שכר שירותים), תשל״ט-1978 — אותו מחיר אצל כל נוטריון.", selectService: "בחרו שירות", pages: "מספר עמודים", signatories: "מספר חותמים", documents: "מספר מסמכים", copies: "מספר עותקים", words: "מספר מילים במסמך", wordsFirst: "עד 100 מילים", firstPage: "עמוד ראשון", firstStamp: "חותם ראשון", additionalPages: "עמודים נוספים", perSignatory: "לכל חותם נוסף", basePrice: "תעריף בסיס", total: "סה״כ לפני מע״מ", vat: "מע״מ (18%)", totalVat: "סה״כ כולל מע״מ", currency: "₪", delivery: "אפשרויות קבלת השירות", deliveryOptions: ["דיגיטלי (וואטסאפ/מייל)", "שליח (איסוף והחזרה)", "קבלה במשרד", "נוטריון עד הבית"], regulationNote: "המחירים נקבעים בתקנות ואינם ניתנים לשינוי." },
    track: { h2: "מעקב הזמנה", subtitle: "הזינו את מספר התיק ובדקו את סטטוס ההזמנה.", placeholder: "מספר תיק (לדוגמה: BN-2026-0042)", btn: "בדיקת סטטוס" },
    faq: { tag: "FAQ", h2: "שאלות נפוצות על שירותי נוטריון", items: [
      { q: "כמה עולה אימות חתימה אצל נוטריון בישראל?", a: "תעריפי נוטריון קבועים בתקנות משרד המשפטים ואחידים בכל הארץ. אימות חתימה לחותם ראשון עולה 197 ₪ + מע״מ, ולכל חותם נוסף — 77 ₪. ייפוי כוח — 197 ₪, תצהיר — 200 ₪, אישור העתק — 77 ₪. נוטריון אינו רשאי לגבות מעל או מתחת לתעריף. חשבו מחיר מדויק במחשבון שלנו." },
      { q: "מה זה תרגום נוטריוני וכמה הוא עולה?", a: "תרגום נוטריוני הוא אישור רשמי של נוטריון שהתרגום נאמן למקור. נדרש למסמכים רשמיים כגון תעודות לימודים, תעודות לידה ומסמכים לשימוש בחו״ל. העלות: 251 ₪ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות + מע״מ. אצלנו ניתן לשלוח מסמך בוואטסאפ ולקבל תרגום נוטריוני תוך 1-3 ימי עסקים." },
      { q: "איך מוציאים חותמת אפוסטיל על מסמך בישראל?", a: "אפוסטיל הוא אישור בינלאומי לפי אמנת האג המאפשר שימוש במסמך ישראלי בחו״ל. ראשית הנוטריון מאמת את המסמך, ואז מזכירות בית המשפט מנפיקה את חותמת האפוסטיל. אנחנו מטפלים בתהליך המלא — מהאישור הנוטריוני ועד האפוסטיל — בלי שתצטרכו לנסוע לבית המשפט." },
      { q: "האם אפשר לקבל שירות נוטריון אונליין בלי להגיע למשרד?", a: "חלק מהשירותים ניתנים מרחוק: תרגום נוטריוני, אישור העתק ואפוסטיל — שלחו מסמכים בוואטסאפ וקבלו אישור חתום בשליח. לעומת זאת, אימות חתימה, תצהיר וייפוי כוח מחייבים התייצבות בפני הנוטריון. במקרים אלה ניתן לתאם שירות נוטריון עד הבית." },
      { q: "מה ההבדל בין ייפוי כוח נוטריוני לייפוי כוח מתמשך?", a: "ייפוי כוח נוטריוני מאפשר לאדם אחר לפעול בשמכם לעניין מסוים (מכירת נכס, ניהול חשבון בנק) ונערך בפני נוטריון. ייפוי כוח מתמשך נועד למצב עתידי של אובדן כשירות ונערך בפני עורך דין מוסמך מטעם האפוטרופוס הכללי. שני המסמכים שונים במהות — אנו עורכים את שניהם." },
      { q: "באילו שפות ניתן לקבל שירותי נוטריון?", a: "אצלנו השירות ניתן בעברית, אנגלית וערבית — כולל ייעוץ, תרגום ועריכת מסמכים. תרגומים נוטריוניים מבוצעים מכל שפה ולכל שפה, כולל רוסית, צרפתית, ספרדית, גרמנית ועוד. לתושבים זרים ועולים חדשים — הצוות שלנו מלווה את התהליך בשפה שנוחה לכם." },
      { q: "אילו מסמכים דורשים אישור נוטריון?", a: "החוק מחייב אישור נוטריוני לייפוי כוח למקרקעין, הסכם ממון, צוואה בפני נוטריון ותצהירים לבתי משפט ורשויות. מסמכים לשימוש בחו״ל דורשים תרגום נוטריוני ואפוסטיל. תעודות אקדמיות, רישיונות, תעודות לידה ונישואין — כל אלה צריכים אישור נוטריוני כשמוגשים לרשויות זרות." },
    ] },
    blog: { tag: "BLOG", h2: "מדריכים ומאמרים בנושא נוטריון", subtitle: "כתבות מקצועיות על תרגום, ייפוי כוח, אפוסטיל ועוד", items: [
      { title: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים", tag: "מחירון", excerpt: "תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים. כל המחירים לאימות חתימה, תרגום, צוואה, הסכם ממון ועוד.", slug: "notary-pricing-2026" },
      { title: "ייפוי כוח נוטריוני — המדריך המלא: סוגים, מסמכים ועלויות", tag: "ייפוי כוח", excerpt: "כל הסוגים, המסמכים הנדרשים, התעריפים המעודכנים ל-2026 והתהליך המלא.", slug: "notarial-power-of-attorney" },
      { title: "אפוסטיל בישראל — מה זה, מתי צריך ואיך מוציאים?", tag: "אפוסטיל", excerpt: "מדריך מעודכן 2026: מה זה אפוסטיל, שני הסוגים, תעריפים ותהליך מלא.", slug: "apostille-israel" },
      { title: "תרגום נוטריוני — כל מה שצריך לדעת לפני שמתרגמים", tag: "תרגום", excerpt: "מה זה תרגום נוטריוני, כמה עולה, שני המסלולים ואיך מקבלים שירות דיגיטלי.", slug: "notarial-translation" },
      { title: "אימות חתימה נוטריוני — מתי חובה, איך עושים וכמה עולה?", tag: "אימות חתימה", excerpt: "מתי נדרש אימות חתימה, מה התהליך, כמה עולה ואילו מסמכים צריך להביא.", slug: "signature-authentication" },
      { title: "צוואה נוטריונית — למה חשוב ומה ההבדל מצוואה רגילה?", tag: "צוואה", excerpt: "מהי צוואה נוטריונית, מה היתרונות, כמה עולה ומתי חייבים לערוך אחת.", slug: "notarial-will" },
      { title: "תצהיר נוטריוני — מתי נדרש, איך מכינים וכמה עולה?", tag: "תצהיר", excerpt: "מתי חייבים תצהיר נוטריוני, ההבדל מתצהיר בפני עו״ד, סוגים נפוצים ותעריפים.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON & Co", slogan: "BEYOND LAW", desc: "אנחנו לא רק עורכי דין — אנחנו שותפים לדרך. BEYOND LAW אומר שאנחנו חושבים מעבר למשפט: חשיבה עסקית, ליווי מקיף, ופתרונות מותאמים שמשלבים מקצועיות משפטית עם ראייה מסחרית. כל שירות נוטריוני אצלנו הוא דיגיטלי, שקוף ומהיר — כי פעולה משפטית לא צריכה להיות מסובכת." },
    contact: { h2: "יצירת קשר", whatsapp: "פנייה בוואטסאפ", email: "פנייה במייל" },
    footer: { rights: "כל הזכויות שמורות", privacy: "מדיניות פרטיות", terms: "תנאי שימוש", accessibility: "נגישות" },
    cookie: { text: "אתר זה משתמש בעוגיות לצורך שיפור חוויית הגלישה. בהמשך הגלישה הינך מסכים/ה לשימוש בעוגיות.", accept: "מסכים/ה", decline: "דחייה" },
  },
  en: {
    nav: { home: "Home", services: "Services", usecases: "Use Cases", pricing: "Pricing", track: "Track Order", blog: "Blog", about: "About", contact: "Contact" },
    hero: { h1: "Notary Services in Israel", chatGreeting: "Hi! I'm Noa from the notary team. How can I help?", chatPlaceholder: "What do you need? (translation, signature, will...)", chatSend: "Send" },
    services: { tag: "NOTARY SERVICES", h2: "Notary Services in Israel", subtitle: "All notarial actions in one place", items: [
      { id: "translation", name: "Notarial Translation", desc: "Official document translation with notarial certification — recognized worldwide.", icon: "translate" },
      { id: "signature", name: "Signature Authentication", desc: "The notary certifies a person signed in their presence — for POA, NDA, and more.", icon: "signature" },
      { id: "affidavit", name: "Notarial Affidavit", desc: "A written statement signed before a notary after a warning — for courts and authorities.", icon: "affidavit" },
      { id: "will", name: "Notarial Will", desc: "A will drafted and signed before a notary — the most secure option.", icon: "will" },
      { id: "prenup", name: "Prenuptial Agreement", desc: "An agreement between spouses — requires notarial or court approval.", icon: "prenup" },
      { id: "poa", name: "Power of Attorney", desc: "General, real estate, irrevocable, or mortgage POA — signed before a notary.", icon: "poa" },
      { id: "certifiedCopy", name: "Certified True Copy", desc: "Certification that a copy is identical to the original — for passports, diplomas, and company documents.", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Life Certificate", desc: "Notarial certification that a person is alive — for pensions and benefits from abroad.", icon: "lifeCertificate" },
    ], calcBtn: "Calculate Price" },
    useCases: { tag: "USE CASES", h2: "Common Notary Use Cases", subtitle: "Search by your need", allFilter: "All", items: [
      { name: "Birth Certificate Translation", tag: "Translation" }, { name: "Diploma Translation", tag: "Translation" }, { name: "Driver's License Translation", tag: "Translation" }, { name: "Marriage Certificate Translation", tag: "Translation" }, { name: "Divorce Certificate Translation", tag: "Translation" }, { name: "Portuguese Citizenship Package", tag: "Translation" },
      { name: "Contract Signature Auth", tag: "Signature Authentication" }, { name: "NDA Signature Auth", tag: "Signature Authentication" }, { name: "Consent for Minor Travel", tag: "Signature Authentication" },
      { name: "General Power of Attorney", tag: "Power of Attorney" }, { name: "POA for Property Sale", tag: "Power of Attorney" }, { name: "Continuing Power of Attorney", tag: "Power of Attorney" }, { name: "Mortgage POA", tag: "Power of Attorney" },
      { name: "Single Status Affidavit", tag: "Affidavit" }, { name: "Residency Affidavit", tag: "Affidavit" }, { name: "Translator Declaration", tag: "Affidavit" },
      { name: "Personal Will", tag: "Notarial Will" }, { name: "Mutual Will (Spouses)", tag: "Notarial Will" },
      { name: "Prenuptial Agreement", tag: "Prenuptial Agreement" }, { name: "Postnuptial Agreement", tag: "Prenuptial Agreement" },
      { name: "Passport Certified Copy", tag: "Certified Copy" }, { name: "Academic Diploma Copy", tag: "Certified Copy" }, { name: "Company Documents Copy", tag: "Certified Copy" },
      { name: "Life Certificate for Pension", tag: "Life Certificate" }, { name: "Life Certificate for Retirees", tag: "Life Certificate" },
    ] },
    pricing: { tag: "PRICING", h2: "Notary Services Calculator", subtitle: "Fees are fixed by the Notaries Regulations (Service Fees), 1978 — same price at every notary in Israel.", selectService: "Select a service", pages: "Number of pages", signatories: "Number of signatories", documents: "Number of documents", copies: "Number of copies", words: "Number of words in document", wordsFirst: "Up to 100 words", firstPage: "First page", firstStamp: "First signatory", additionalPages: "Additional pages", perSignatory: "Per additional signatory", basePrice: "Base fee", total: "Total before VAT", vat: "VAT (18%)", totalVat: "Total incl. VAT", currency: "ILS", delivery: "Service delivery options", deliveryOptions: ["Digital (WhatsApp/Email)", "Courier (pickup & return)", "At the office", "Notary home visit"], regulationNote: "Prices are set by regulation and cannot be changed." },
    track: { h2: "Track Your Order", subtitle: "Enter your case number to check the status.", placeholder: "Case number (e.g. BN-2026-0042)", btn: "Check Status" },
    faq: { tag: "FAQ", h2: "Frequently Asked Questions About Notary Services", items: [
      { q: "How much does signature authentication cost at a notary in Israel?", a: "Notary fees are fixed by the Ministry of Justice and uniform nationwide. Signature authentication: 197 ₪ + VAT for the first signer, 77 ₪ each additional. Power of attorney — 197 ₪, affidavit — 200 ₪, certified copy — 77 ₪. No notary may charge above or below the regulated tariff. Use our price calculator for an exact quote." },
      { q: "What is a notarial translation and how much does it cost?", a: "A notarial translation is an official certification by a notary that a translation is faithful to the original. Required for academic certificates, birth certificates, and documents for use abroad. Cost: 251 ₪ for up to 100 words, 197 ₪ per additional 100 words + VAT. Send your document via WhatsApp and receive a certified translation within 1-3 business days." },
      { q: "How do I get an apostille stamp on a document in Israel?", a: "An apostille is an international certification under the Hague Convention allowing Israeli documents to be used abroad. First the notary certifies the document, then the court clerk issues the apostille stamp. We handle the entire process — from notarial certification to apostille — so you don't have to visit the court." },
      { q: "Can I get notary services online without visiting the office?", a: "Some services are fully remote: notarial translation, certified copies, and apostille — send documents via WhatsApp and receive signed documents by courier. However, signature authentication, affidavits, and powers of attorney require physical presence before the notary. In those cases, we offer notary home visit service." },
      { q: "What is the difference between a notarial power of attorney and a continuing power of attorney?", a: "A notarial power of attorney authorizes someone to act on your behalf for a specific matter (property sale, bank account) and is prepared before a notary. A continuing power of attorney is for a future situation where you cannot make decisions — it takes effect only upon incapacity and is prepared before a specially trained attorney. We prepare both." },
      { q: "What languages are notary services available in?", a: "Our services are available in Hebrew, English, and Arabic — including consultation, translation, and document preparation. Notarial translations are performed from and to any language, including Russian, French, Spanish, German, and more. For foreign residents and new immigrants, our team guides you through the process in your preferred language." },
      { q: "Which documents require notary certification?", a: "The law requires notarial certification for real estate powers of attorney, prenuptial agreements, notarial wills, and affidavits for courts. Documents for use abroad typically require notarial translation and apostille. Academic diplomas, licenses, birth and marriage certificates all need notarial certification when submitted to foreign authorities." },
    ] },
    blog: { tag: "BLOG", h2: "Notary guides and articles", subtitle: "Professional guides on translation, power of attorney, apostille and more", items: [
      { title: "Notary Pricing 2026 — Updated Ministry of Justice Rates", tag: "Pricing", excerpt: "Updated notary fees for 2026. Full pricing for all notary services.", slug: "notary-pricing-2026" },
      { title: "Notarial Power of Attorney — Complete Guide", tag: "POA", excerpt: "Types, required documents, costs and process for notarial POA.", slug: "notarial-power-of-attorney" },
      { title: "Apostille in Israel — What, When and How", tag: "Apostille", excerpt: "Complete guide: two types, pricing, Hague Convention, step-by-step.", slug: "apostille-israel" },
      { title: "Notarial Translation — Everything You Need to Know", tag: "Translation", excerpt: "What it is, how much it costs, two tracks, digital service.", slug: "notarial-translation" },
      { title: "Signature Authentication — When Required and How", tag: "Signature", excerpt: "When required, process, pricing and documents needed.", slug: "signature-authentication" },
      { title: "Notarial Will — Why It Matters", tag: "Will", excerpt: "Advantages over regular will, pricing, Section 22 Inheritance Law.", slug: "notarial-will" },
      { title: "Notarial Affidavit — When Required and How to Prepare", tag: "Affidavit", excerpt: "When needed, difference from lawyer affidavit, types and pricing.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON & Co", slogan: "BEYOND LAW", desc: "We're not just lawyers — we're partners. BEYOND LAW means we think beyond legal practice: business strategy, comprehensive support, and tailored solutions that combine legal expertise with commercial insight. Every notary service is digital, transparent, and fast." },
    contact: { h2: "Get in Touch", whatsapp: "Message on WhatsApp", email: "Send an Email" },
    footer: { rights: "All rights reserved", privacy: "Privacy Policy", terms: "Terms of Use", accessibility: "Accessibility" },
    cookie: { text: "This site uses cookies to improve your experience. By continuing, you agree to their use.", accept: "Accept", decline: "Decline" },
  },
  ru: {
    nav: { home: "Главная", services: "Услуги", usecases: "Примеры", pricing: "Цены", track: "Отслеживание", blog: "Блог", about: "О нас", contact: "Контакты" },
    hero: { h1: "Нотариальные услуги в Израиле", chatGreeting: "Привет! Я Ноа из нотариальной команды. Чем помочь?", chatPlaceholder: "Что нужно? (перевод, подпись, завещание...)", chatSend: "Отправить" },
    services: { tag: "NOTARY SERVICES", h2: "Нотариальные услуги в Израиле", subtitle: "Все нотариальные действия в одном месте", items: [
      { id: "translation", name: "Нотариальный перевод", desc: "Официальный перевод с нотариальным заверением.", icon: "translate" },
      { id: "signature", name: "Заверение подписи", desc: "Нотариус подтверждает подписание в его присутствии.", icon: "signature" },
      { id: "affidavit", name: "Аффидевит", desc: "Письменное заявление перед нотариусом после предупреждения.", icon: "affidavit" },
      { id: "will", name: "Нотариальное завещание", desc: "Завещание, составленное перед нотариусом.", icon: "will" },
      { id: "prenup", name: "Брачный договор", desc: "Соглашение между супругами.", icon: "prenup" },
      { id: "poa", name: "Доверенность", desc: "Генеральная, на недвижимость, безотзывная или ипотечная — подписание у нотариуса.", icon: "poa" },
      { id: "certifiedCopy", name: "Заверенная копия", desc: "Подтверждение идентичности копии оригиналу — паспорта, дипломы, документы компании.", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Свидетельство о жизни", desc: "Нотариальное подтверждение, что лицо находится в живых — для пенсий из-за рубежа.", icon: "lifeCertificate" },
    ], calcBtn: "Рассчитать" },
    useCases: { tag: "USE CASES", h2: "Популярные нотариальные услуги", subtitle: "Ищите по потребности", allFilter: "Все", items: [
      { name: "Перевод свидетельства о рождении", tag: "Перевод" }, { name: "Перевод диплома", tag: "Перевод" }, { name: "Перевод прав", tag: "Перевод" }, { name: "Перевод свидетельства о браке", tag: "Перевод" }, { name: "Перевод свидетельства о разводе", tag: "Перевод" }, { name: "Пакет для Португалии", tag: "Перевод" },
      { name: "Заверение подписи на договоре", tag: "Заверение подписи" }, { name: "Заверение NDA", tag: "Заверение подписи" }, { name: "Согласие на выезд ребёнка", tag: "Заверение подписи" },
      { name: "Генеральная доверенность", tag: "Доверенность" }, { name: "Доверенность на продажу", tag: "Доверенность" }, { name: "Постоянная доверенность", tag: "Доверенность" }, { name: "Доверенность для ипотеки", tag: "Доверенность" },
      { name: "Аффидевит о статусе", tag: "Аффидевит" }, { name: "Аффидевит о проживании", tag: "Аффидевит" }, { name: "Декларация переводчика", tag: "Аффидевит" },
      { name: "Личное завещание", tag: "Завещание" }, { name: "Взаимное завещание (супруги)", tag: "Завещание" },
      { name: "Брачный договор до свадьбы", tag: "Брачный договор" }, { name: "Брачный договор после свадьбы", tag: "Брачный договор" },
      { name: "Заверенная копия паспорта", tag: "Заверенная копия" }, { name: "Заверенная копия диплома", tag: "Заверенная копия" }, { name: "Заверенная копия документов компании", tag: "Заверенная копия" },
      { name: "Свидетельство для пенсии", tag: "Свидетельство о жизни" }, { name: "Свидетельство для пенсионеров", tag: "Свидетельство о жизни" },
    ] },
    pricing: { tag: "PRICING", h2: "Калькулятор нотариальных услуг", subtitle: "Тарифы установлены Правилами о нотариусах, 1978 — одинаковая цена у всех.", selectService: "Выберите услугу", pages: "Страниц", signatories: "Подписантов", documents: "Документов", copies: "Копий", firstPage: "Первая страница", additionalPages: "Доп. страницы", perSignatory: "За подписанта", total: "Итого", currency: "₪", delivery: "Способы получения", deliveryOptions: ["Цифровой", "Курьер", "В офисе", "На дом"], regulationNote: "Цены установлены правилами." },
    track: { h2: "Отслеживание заказа", subtitle: "Введите номер дела.", placeholder: "Номер дела (BN-2026-0042)", btn: "Проверить" },
    faq: { tag: "FAQ", h2: "Часто задаваемые вопросы о нотариальных услугах", items: [
      { q: "Сколько стоит заверение подписи у нотариуса в Израиле?", a: "Тарифы установлены Министерством юстиции и едины по всей стране. Заверение подписи: 197 ₪ + НДС за первого подписанта, 77 ₪ за каждого дополнительного. Доверенность — 197 ₪, аффидевит — 200 ₪, заверенная копия — 77 ₪. Рассчитайте точную стоимость в нашем калькуляторе." },
      { q: "Что такое нотариальный перевод и сколько он стоит?", a: "Нотариальный перевод — это заверение нотариусом точности перевода документа. Требуется для дипломов, свидетельств о рождении и документов для использования за рубежом. Стоимость: 251 ₪ за первые 100 слов, 197 ₪ за каждые 100 дополнительных + НДС. Отправьте документ в WhatsApp — перевод за 1-3 рабочих дня." },
      { q: "Как получить апостиль на документ в Израиле?", a: "Апостиль — международное подтверждение по Гаагской конвенции для использования документов за рубежом. Сначала нотариус заверяет документ, затем канцелярия суда ставит апостиль. Мы ведём весь процесс — от нотариального заверения до апостиля — без вашего визита в суд." },
      { q: "Можно ли получить нотариальные услуги онлайн без визита в офис?", a: "Часть услуг доступна удалённо: нотариальный перевод, заверенные копии и апостиль — отправьте документы в WhatsApp, получите заверенные документы курьером. Заверение подписи, аффидевит и доверенность требуют личного присутствия. В таких случаях нотариус может приехать к вам." },
      { q: "В чём разница между нотариальной доверенностью и постоянной доверенностью?", a: "Нотариальная доверенность позволяет другому лицу действовать от вашего имени (продажа недвижимости, банковские операции) и оформляется у нотариуса. Постоянная доверенность предназначена для ситуации утраты дееспособности и оформляется у специально обученного адвоката. Мы оформляем оба документа." },
      { q: "На каких языках доступны нотариальные услуги?", a: "Наши услуги доступны на иврите, английском и арабском. Нотариальные переводы выполняются с любого языка и на любой язык — русский, французский, испанский, немецкий и др. Для иностранных резидентов и репатриантов — сопровождение на удобном для вас языке." },
      { q: "Какие документы требуют нотариального заверения?", a: "Закон требует нотариального заверения для доверенностей на недвижимость, брачных договоров, завещаний и аффидевитов для судов. Документы для использования за рубежом требуют нотариального перевода и апостиля. Дипломы, свидетельства о рождении и браке — всё это требует заверения при подаче в зарубежные органы." },
    ] },
    blog: { tag: "BLOG", h2: "Статьи и руководства по нотариальным услугам", subtitle: "Профессиональные материалы о переводах, доверенностях и апостиле", items: [
      { title: "Тарифы нотариуса 2026", tag: "Тарифы", excerpt: "Актуальные тарифы на все нотариальные услуги.", slug: "notary-pricing-2026" },
      { title: "Нотариальная доверенность — полное руководство", tag: "Доверенность", excerpt: "Виды, документы, стоимость и процесс.", slug: "notarial-power-of-attorney" },
      { title: "Апостиль в Израиле — что, когда и как", tag: "Апостиль", excerpt: "Два вида, тарифы, Гаагская конвенция.", slug: "apostille-israel" },
      { title: "Нотариальный перевод — всё, что нужно знать", tag: "Перевод", excerpt: "Стоимость, два варианта, цифровой сервис.", slug: "notarial-translation" },
      { title: "Заверение подписи — когда требуется", tag: "Подпись", excerpt: "Когда нужно, процесс и стоимость.", slug: "signature-authentication" },
      { title: "Нотариальное завещание — почему это важно", tag: "Завещание", excerpt: "Преимущества, стоимость, закон о наследовании.", slug: "notarial-will" },
      { title: "Нотариальный аффидевит — когда нужен", tag: "Аффидевит", excerpt: "Когда требуется, виды, стоимость.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON & Co", slogan: "BEYOND LAW", desc: "Мы не просто юристы — мы партнёры. BEYOND LAW означает мышление за рамками права: бизнес-стратегия, комплексное сопровождение и индивидуальные решения. Каждая нотариальная услуга — цифровая, прозрачная и быстрая." },
    contact: { h2: "Связаться", whatsapp: "WhatsApp", email: "Email" },
    footer: { rights: "Все права защищены", privacy: "Конфиденциальность", terms: "Условия", accessibility: "Доступность" },
    cookie: { text: "Сайт использует cookie. Продолжая, вы соглашаетесь.", accept: "Принять", decline: "Отклонить" },
  },
  ar: {
    nav: { home: "الرئيسية", services: "الخدمات", usecases: "حالات الاستخدام", pricing: "الأسعار", track: "تتبع الطلب", blog: "مدونة", about: "عن المكتب", contact: "تواصل معنا" },
    hero: { h1: "خدمات كاتب العدل في إسرائيل", chatGreeting: "مرحباً! أنا نوعة من فريق كاتب العدل. كيف أساعدك؟", chatPlaceholder: "ماذا تحتاج/ين؟ (ترجمة، توثيق، وصية...)", chatSend: "إرسال" },
    services: { tag: "NOTARY SERVICES", h2: "خدمات كاتب العدل في إسرائيل", subtitle: "جميع الإجراءات في مكان واحد", items: [
      { id: "translation", name: "ترجمة توثيقية", desc: "ترجمة رسمية مع تصديق كاتب العدل.", icon: "translate" },
      { id: "signature", name: "توثيق التوقيع", desc: "يشهد كاتب العدل على التوقيع أمامه.", icon: "signature" },
      { id: "affidavit", name: "إفادة خطية", desc: "بيان مكتوب يُوقّع أمام كاتب العدل.", icon: "affidavit" },
      { id: "will", name: "وصية توثيقية", desc: "وصية تُعَدّ أمام كاتب العدل.", icon: "will" },
      { id: "prenup", name: "اتفاقية مالية", desc: "اتفاق بين الزوجين.", icon: "prenup" },
      { id: "poa", name: "توكيل رسمي", desc: "توكيل عام أو عقاري أو غير قابل للإلغاء — توقيع أمام كاتب العدل.", icon: "poa" },
      { id: "certifiedCopy", name: "نسخة مصدّقة", desc: "تصديق أن النسخة مطابقة للأصل — جوازات سفر، شهادات، مستندات شركة.", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "شهادة حياة", desc: "تصديق نوتاريوني بأن الشخص على قيد الحياة — للمعاشات من الخارج.", icon: "lifeCertificate" },
    ], calcBtn: "احسب السعر" },
    useCases: { tag: "USE CASES", h2: "خدمات كاتب عدل شائعة", subtitle: "ابحث/ي حسب احتياجك", allFilter: "الكل", items: [
      { name: "ترجمة شهادة ميلاد", tag: "ترجمة موثقة" }, { name: "ترجمة شهادة جامعية", tag: "ترجمة موثقة" }, { name: "ترجمة رخصة قيادة", tag: "ترجمة موثقة" }, { name: "ترجمة عقد زواج", tag: "ترجمة موثقة" }, { name: "ترجمة وثيقة طلاق", tag: "ترجمة موثقة" }, { name: "حزمة جنسية برتغالية", tag: "ترجمة موثقة" },
      { name: "توثيق توقيع على عقد", tag: "توثيق التوقيع" }, { name: "توثيق NDA", tag: "توثيق التوقيع" }, { name: "موافقة سفر قاصر", tag: "توثيق التوقيع" },
      { name: "توكيل عام", tag: "توكيل رسمي" }, { name: "توكيل لبيع عقار", tag: "توكيل رسمي" }, { name: "توكيل مستمر", tag: "توكيل رسمي" }, { name: "توكيل للرهن العقاري", tag: "توكيل رسمي" },
      { name: "إفادة عدم زواج", tag: "إفادة خطية" }, { name: "إفادة سكن", tag: "إفادة خطية" }, { name: "إفادة مترجم", tag: "إفادة خطية" },
      { name: "وصية شخصية", tag: "وصية توثيقية" }, { name: "وصية متبادلة (زوجين)", tag: "وصية توثيقية" },
      { name: "اتفاقية مالية قبل الزواج", tag: "اتفاقية مالية" }, { name: "اتفاقية مالية بعد الزواج", tag: "اتفاقية مالية" },
      { name: "نسخة مصدّقة لجواز سفر", tag: "نسخة مصدّقة" }, { name: "نسخة مصدّقة لشهادة جامعية", tag: "نسخة مصدّقة" }, { name: "نسخة مصدّقة لمستندات شركة", tag: "نسخة مصدّقة" },
      { name: "شهادة حياة للتقاعد", tag: "شهادة حياة" }, { name: "شهادة حياة للمتقاعدين", tag: "شهادة حياة" },
    ] },
    pricing: { tag: "PRICING", h2: "حاسبة خدمات كاتب العدل", subtitle: "الأسعار محددة بأنظمة كتّاب العدل (أجور الخدمات)، 1978 — نفس السعر لدى الجميع.", selectService: "اختر/ي خدمة", pages: "عدد الصفحات", signatories: "عدد الموقعين", documents: "عدد المستندات", copies: "عدد النسخ", firstPage: "الصفحة الأولى", additionalPages: "صفحات إضافية", perSignatory: "لكل موقّع إضافي", total: "المجموع", currency: "₪", delivery: "خيارات الاستلام", deliveryOptions: ["رقمي (واتساب/بريد)", "بريد سريع", "في المكتب", "كاتب عدل للمنزل"], regulationNote: "الأسعار محددة بالقانون." },
    track: { h2: "تتبع الطلب", subtitle: "أدخل/ي رقم الملف.", placeholder: "رقم الملف (BN-2026-0042)", btn: "تحقق" },
    faq: { tag: "FAQ", h2: "أسئلة شائعة حول خدمات كاتب العدل", items: [
      { q: "كم يكلف توثيق التوقيع لدى كاتب العدل في إسرائيل؟", a: "الرسوم محددة بأنظمة وزارة العدل وموحدة في كل البلاد. توثيق التوقيع: 197 ₪ + ض.ق.م للموقّع الأول، 77 ₪ لكل إضافي. التوكيل — 197 ₪، الإفادة — 200 ₪، النسخة المصدّقة — 77 ₪. احسبوا السعر الدقيق بالحاسبة." },
      { q: "ما هي الترجمة التوثيقية وكم تكلّف؟", a: "الترجمة التوثيقية هي تصديق رسمي من كاتب العدل بأن الترجمة مطابقة للأصل. مطلوبة للشهادات الأكاديمية وشهادات الميلاد والمستندات للاستخدام بالخارج. التكلفة: 251 ₪ حتى 100 كلمة، 197 ₪ لكل 100 كلمة إضافية + ض.ق.م. أرسلوا المستند عبر واتساب واحصلوا على ترجمة توثيقية خلال 1-3 أيام." },
      { q: "كيف أحصل على أبوستيل في إسرائيل؟", a: "الأبوستيل تصديق دولي وفق اتفاقية لاهاي يتيح استخدام المستند الإسرائيلي بالخارج. أولاً كاتب العدل يصادق على المستند، ثم أمانة المحكمة تصدر ختم الأبوستيل. نحن نتولى العملية كاملة — من التصديق حتى الأبوستيل." },
      { q: "هل يمكن الحصول على خدمات كاتب العدل أونلاين؟", a: "بعض الخدمات متاحة عن بُعد: الترجمة التوثيقية والنسخ المصدّقة والأبوستيل — أرسلوا المستندات عبر واتساب واستلموا الوثائق المصدّقة عبر مندوب. توثيق التوقيع والإفادات والتوكيلات تتطلب حضوراً شخصياً. في هذه الحالات يمكن ترتيب زيارة كاتب عدل للمنزل." },
      { q: "ما الفرق بين التوكيل الرسمي والتوكيل المستمر؟", a: "التوكيل الرسمي يخوّل شخصاً آخر بالعمل نيابةً عنكم لأمر محدد (بيع عقار، إدارة حساب بنكي) ويُعدّ أمام كاتب العدل. التوكيل المستمر مخصص لحالة مستقبلية من فقدان الأهلية ويُعدّ أمام محامٍ مؤهل. نحن نعدّ كليهما." },
      { q: "بأي لغات تتوفر خدمات كاتب العدل؟", a: "خدماتنا متاحة بالعبرية والإنجليزية والعربية. الترجمات التوثيقية تُنفذ من وإلى أي لغة — روسية، فرنسية، إسبانية، ألمانية وغيرها. للمقيمين الأجانب والمهاجرين الجدد — فريقنا يرافقكم بلغتكم المفضلة." },
      { q: "أي مستندات تحتاج تصديق كاتب العدل؟", a: "يتطلب القانون تصديقاً توثيقياً للتوكيلات العقارية والاتفاقيات المالية والوصايا والإفادات للمحاكم. المستندات للاستخدام بالخارج تحتاج ترجمة توثيقية وأبوستيل. الشهادات الجامعية والرخص وشهادات الميلاد والزواج تحتاج تصديقاً عند تقديمها لجهات أجنبية." },
    ] },
    blog: { tag: "BLOG", h2: "مقالات وأدلة حول كاتب العدل", subtitle: "مقالات متخصصة حول الترجمة والتوكيلات والأبوستيل", items: [
      { title: "تعرفة كاتب العدل 2026", tag: "تعرفة", excerpt: "جميع الأسعار المحدثة لخدمات كاتب العدل.", slug: "notary-pricing-2026" },
      { title: "التوكيل الرسمي — الدليل الكامل", tag: "توكيل", excerpt: "الأنواع والمستندات والتكاليف.", slug: "notarial-power-of-attorney" },
      { title: "أبوستيل في إسرائيل — ما هو وكيف؟", tag: "أبوستيل", excerpt: "نوعان، التعرفة، اتفاقية لاهاي.", slug: "apostille-israel" },
      { title: "الترجمة التوثيقية — كل ما تحتاج معرفته", tag: "ترجمة", excerpt: "التكلفة، مساران، خدمة رقمية.", slug: "notarial-translation" },
      { title: "توثيق التوقيع — متى مطلوب وكيف؟", tag: "توثيق", excerpt: "متى يُطلب، العملية والتكلفة.", slug: "signature-authentication" },
      { title: "الوصية التوثيقية — لماذا مهمة؟", tag: "وصية", excerpt: "المزايا، التكلفة، قانون الميراث.", slug: "notarial-will" },
      { title: "الإفادة الخطية التوثيقية — متى تحتاجها؟", tag: "إفادة", excerpt: "متى مطلوبة، الأنواع والتكلفة.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON & Co", slogan: "BEYOND LAW", desc: "نحن لسنا مجرد محامين — نحن شركاء. BEYOND LAW يعني التفكير فيما هو أبعد من القانون: استراتيجية تجارية، مرافقة شاملة، وحلول مخصصة. كل خدمة توثيقية لدينا رقمية وشفافة وسريعة." },
    contact: { h2: "تواصل معنا", whatsapp: "واتساب", email: "بريد إلكتروني" },
    footer: { rights: "جميع الحقوق محفوظة", privacy: "الخصوصية", terms: "الشروط", accessibility: "إمكانية الوصول" },
    cookie: { text: "يستخدم الموقع ملفات تعريف الارتباط. بالاستمرار توافق/ين.", accept: "موافق/ة", decline: "رفض" },
  },
  fr: {
    nav: { home: "Accueil", services: "Services", usecases: "Cas d'usage", pricing: "Tarifs", track: "Suivi", blog: "Blog", about: "A propos", contact: "Contact" },
    hero: { h1: "Services Notariaux en Israel", chatGreeting: "Bonjour! Je suis Noa. Comment puis-je aider?", chatPlaceholder: "De quoi avez-vous besoin? (traduction, signature...)", chatSend: "Envoyer" },
    services: { tag: "NOTARY SERVICES", h2: "Services notariaux en Israel", subtitle: "Toutes les actions en un seul endroit", items: [
      { id: "translation", name: "Traduction Notariale", desc: "Traduction officielle avec certification.", icon: "translate" },
      { id: "signature", name: "Authentification de Signature", desc: "Le notaire certifie la signature.", icon: "signature" },
      { id: "affidavit", name: "Affidavit Notarial", desc: "Declaration signee devant notaire.", icon: "affidavit" },
      { id: "will", name: "Testament Notarial", desc: "Testament redige devant notaire.", icon: "will" },
      { id: "prenup", name: "Contrat de Mariage", desc: "Accord entre epoux.", icon: "prenup" },
      { id: "poa", name: "Procuration Notariale", desc: "Generale, immobiliere, irrevocable ou hypothecaire — signee devant notaire.", icon: "poa" },
      { id: "certifiedCopy", name: "Copie Certifiee Conforme", desc: "Certification qu'une copie est identique a l'original — passeports, diplomes, documents d'entreprise.", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Certificat de Vie", desc: "Certification notariale qu'une personne est en vie — pour pensions de l'etranger.", icon: "lifeCertificate" },
    ], calcBtn: "Calculer" },
    useCases: { tag: "USE CASES", h2: "Services notariaux courants", subtitle: "Cherchez selon votre besoin", allFilter: "Tout", items: [
      { name: "Traduction acte de naissance", tag: "Traduction" }, { name: "Traduction diplome", tag: "Traduction" }, { name: "Traduction permis de conduire", tag: "Traduction" }, { name: "Traduction acte de mariage", tag: "Traduction" }, { name: "Traduction acte de divorce", tag: "Traduction" }, { name: "Citoyennete portugaise", tag: "Traduction" },
      { name: "Signature sur contrat", tag: "Authentification de Signature" }, { name: "Signature NDA", tag: "Authentification de Signature" }, { name: "Voyage mineur", tag: "Authentification de Signature" },
      { name: "Procuration generale", tag: "Procuration" }, { name: "Procuration immobiliere", tag: "Procuration" }, { name: "Procuration permanente", tag: "Procuration" }, { name: "Procuration hypothecaire", tag: "Procuration" },
      { name: "Attestation de celibat", tag: "Affidavit" }, { name: "Attestation de residence", tag: "Affidavit" }, { name: "Declaration de traducteur", tag: "Affidavit" },
      { name: "Testament personnel", tag: "Testament" }, { name: "Testament mutuel (epoux)", tag: "Testament" },
      { name: "Contrat prenuptial", tag: "Contrat de Mariage" }, { name: "Contrat postnuptial", tag: "Contrat de Mariage" },
      { name: "Copie certifiee passeport", tag: "Copie Certifiee" }, { name: "Copie certifiee diplome", tag: "Copie Certifiee" }, { name: "Copie certifiee documents", tag: "Copie Certifiee" },
      { name: "Certificat de vie retraite", tag: "Certificat de Vie" }, { name: "Certificat de vie retraites", tag: "Certificat de Vie" },
    ] },
    pricing: { tag: "PRICING", h2: "Calculateur notarial", subtitle: "Tarifs fixes par reglement, 1978 — meme prix partout.", selectService: "Choisissez", pages: "Pages", signatories: "Signataires", documents: "Documents", copies: "Copies", firstPage: "Premiere page", additionalPages: "Pages supp.", perSignatory: "Par signataire", total: "Total", currency: "ILS", delivery: "Livraison", deliveryOptions: ["Numerique", "Coursier", "Au bureau", "A domicile"], regulationNote: "Prix fixes par reglement." },
    track: { h2: "Suivi de commande", subtitle: "Entrez votre numero de dossier.", placeholder: "Numero (BN-2026-0042)", btn: "Verifier" },
    faq: { tag: "FAQ", h2: "Questions frequentes sur les services notariaux", items: [
      { q: "Combien coute l'authentification de signature chez un notaire en Israel?", a: "Les tarifs sont fixes par le Ministere de la Justice et uniformes dans tout le pays. Authentification: 197 ₪ + TVA pour le premier signataire, 77 ₪ par signataire supplementaire. Procuration — 197 ₪, affidavit — 200 ₪, copie certifiee — 77 ₪. Calculez le prix exact avec notre calculateur." },
      { q: "Qu'est-ce qu'une traduction notariee et combien coute-t-elle?", a: "Une traduction notariee est une certification officielle par un notaire de la fidelite de la traduction. Requise pour les diplomes, actes de naissance et documents a usage international. Cout: 251 ₪ jusqu'a 100 mots, 197 ₪ par tranche de 100 mots + TVA. Envoyez votre document par WhatsApp — traduction en 1-3 jours." },
      { q: "Comment obtenir un apostille en Israel?", a: "L'apostille est une certification internationale selon la Convention de La Haye. Le notaire certifie d'abord le document, puis le greffe du tribunal appose l'apostille. Nous gerons tout le processus — de la certification notariale a l'apostille — sans deplacement au tribunal." },
      { q: "Peut-on obtenir des services notariaux en ligne?", a: "Certains services sont disponibles a distance: traduction, copies certifiees et apostille — envoyez vos documents par WhatsApp. L'authentification de signature, les affidavits et procurations necessitent une presence physique. Dans ces cas, nous proposons un service de notaire a domicile." },
      { q: "Quelle difference entre procuration notariale et procuration permanente?", a: "La procuration notariale autorise une personne a agir en votre nom pour un sujet precis (vente immobiliere, compte bancaire). La procuration permanente est prevue pour une incapacite future. Les deux documents sont differents — nous les preparons tous les deux." },
      { q: "En quelles langues les services notariaux sont-ils disponibles?", a: "Nos services sont disponibles en hebreu, anglais et arabe. Les traductions notariees sont realisees de et vers toute langue — russe, francais, espagnol, allemand et plus. Pour les residents etrangers — accompagnement dans votre langue preferee." },
      { q: "Quels documents necessitent une certification notariale?", a: "La loi exige une certification pour les procurations immobilieres, contrats de mariage, testaments et affidavits. Les documents pour l'etranger necessitent traduction notariee et apostille. Diplomes, certificats de naissance et de mariage — tout necessite une certification pour les autorites etrangeres." },
    ] },
    blog: { tag: "BLOG", h2: "Guides et articles notariaux", subtitle: "Articles professionnels sur la traduction, procurations et apostille", items: [
      { title: "Tarifs notariaux 2026", tag: "Tarifs", excerpt: "Tous les tarifs notariaux actualises.", slug: "notary-pricing-2026" },
      { title: "Procuration notariale — guide complet", tag: "Procuration", excerpt: "Types, documents, couts et processus.", slug: "notarial-power-of-attorney" },
      { title: "Apostille en Israel", tag: "Apostille", excerpt: "Deux types, tarifs, Convention de La Haye.", slug: "apostille-israel" },
      { title: "Traduction notariee", tag: "Traduction", excerpt: "Cout, deux options, service digital.", slug: "notarial-translation" },
      { title: "Authentification de signature", tag: "Signature", excerpt: "Quand requise, processus et cout.", slug: "signature-authentication" },
      { title: "Testament notarie", tag: "Testament", excerpt: "Avantages, cout, loi sur la succession.", slug: "notarial-will" },
      { title: "Affidavit notarie", tag: "Affidavit", excerpt: "Quand necessaire, types et cout.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON & Co", slogan: "BEYOND LAW", desc: "Nous ne sommes pas de simples avocats — nous sommes des partenaires. BEYOND LAW signifie penser au-dela du droit: strategie commerciale, accompagnement complet et solutions sur mesure. Chaque service notarial est numerique, transparent et rapide." },
    contact: { h2: "Nous contacter", whatsapp: "WhatsApp", email: "Email" },
    footer: { rights: "Tous droits reserves", privacy: "Confidentialite", terms: "Conditions", accessibility: "Accessibilite" },
    cookie: { text: "Ce site utilise des cookies. En continuant, vous acceptez.", accept: "Accepter", decline: "Refuser" },
  },
  es: {
    nav: { home: "Inicio", services: "Servicios", usecases: "Casos", pricing: "Precios", track: "Seguimiento", blog: "Blog", about: "Acerca de", contact: "Contacto" },
    hero: { h1: "Servicios Notariales en Israel", chatGreeting: "Hola! Soy Noa del equipo notarial. Como puedo ayudar?", chatPlaceholder: "Que necesitas? (traduccion, firma, testamento...)", chatSend: "Enviar" },
    services: { tag: "NOTARY SERVICES", h2: "Servicios notariales en Israel", subtitle: "Todas las acciones en un solo lugar", items: [
      { id: "translation", name: "Traduccion Notarial", desc: "Traduccion oficial con certificacion.", icon: "translate" },
      { id: "signature", name: "Autenticacion de Firma", desc: "El notario certifica la firma.", icon: "signature" },
      { id: "affidavit", name: "Declaracion Jurada", desc: "Declaracion ante notario.", icon: "affidavit" },
      { id: "will", name: "Testamento Notarial", desc: "Testamento ante notario.", icon: "will" },
      { id: "prenup", name: "Acuerdo Prenupcial", desc: "Acuerdo entre conyuges.", icon: "prenup" },
      { id: "poa", name: "Poder Notarial", desc: "General, inmobiliario, irrevocable o hipotecario — firmado ante notario.", icon: "poa" },
      { id: "certifiedCopy", name: "Copia Certificada", desc: "Certificacion de que la copia es identica al original — pasaportes, diplomas, documentos de empresa.", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Certificado de Vida", desc: "Certificacion notarial de que una persona esta viva — para pensiones del exterior.", icon: "lifeCertificate" },
    ], calcBtn: "Calcular" },
    useCases: { tag: "USE CASES", h2: "Servicios notariales comunes", subtitle: "Busca segun tu necesidad", allFilter: "Todo", items: [
      { name: "Traduccion partida de nacimiento", tag: "Traduccion" }, { name: "Traduccion diploma", tag: "Traduccion" }, { name: "Traduccion licencia de conducir", tag: "Traduccion" }, { name: "Traduccion acta de matrimonio", tag: "Traduccion" }, { name: "Traduccion acta de divorcio", tag: "Traduccion" }, { name: "Ciudadania portuguesa", tag: "Traduccion" },
      { name: "Firma en contrato", tag: "Autenticacion de Firma" }, { name: "Firma NDA", tag: "Autenticacion de Firma" }, { name: "Viaje de menor", tag: "Autenticacion de Firma" },
      { name: "Poder general", tag: "Poder Notarial" }, { name: "Poder para venta", tag: "Poder Notarial" }, { name: "Poder permanente", tag: "Poder Notarial" }, { name: "Poder hipotecario", tag: "Poder Notarial" },
      { name: "Declaracion de solteria", tag: "Declaracion Jurada" }, { name: "Declaracion de residencia", tag: "Declaracion Jurada" }, { name: "Declaracion de traductor", tag: "Declaracion Jurada" },
      { name: "Testamento personal", tag: "Testamento" }, { name: "Testamento mutuo (conyuges)", tag: "Testamento" },
      { name: "Acuerdo prenupcial", tag: "Acuerdo Prenupcial" }, { name: "Acuerdo postnupcial", tag: "Acuerdo Prenupcial" },
      { name: "Copia certificada pasaporte", tag: "Copia Certificada" }, { name: "Copia certificada diploma", tag: "Copia Certificada" }, { name: "Copia certificada documentos", tag: "Copia Certificada" },
      { name: "Certificado de vida pension", tag: "Certificado de Vida" }, { name: "Certificado de vida jubilados", tag: "Certificado de Vida" },
    ] },
    pricing: { tag: "PRICING", h2: "Calculadora notarial", subtitle: "Tarifas fijadas por reglamento, 1978 — mismo precio en todos.", selectService: "Selecciona", pages: "Paginas", signatories: "Firmantes", documents: "Documentos", copies: "Copias", firstPage: "Primera pagina", additionalPages: "Paginas adic.", perSignatory: "Por firmante", total: "Total", currency: "ILS", delivery: "Entrega", deliveryOptions: ["Digital", "Mensajero", "En oficina", "A domicilio"], regulationNote: "Precios fijados por reglamento." },
    track: { h2: "Seguimiento", subtitle: "Ingresa tu numero de expediente.", placeholder: "Expediente (BN-2026-0042)", btn: "Verificar" },
    faq: { tag: "FAQ", h2: "Preguntas frecuentes sobre servicios notariales", items: [
      { q: "Cuanto cuesta la autenticacion de firma en un notario en Israel?", a: "Las tarifas son fijadas por el Ministerio de Justicia y uniformes en todo el pais. Autenticacion: 197 ₪ + IVA por el primer firmante, 77 ₪ por cada adicional. Poder notarial — 197 ₪, declaracion jurada — 200 ₪, copia certificada — 77 ₪. Calcule el precio exacto con nuestra calculadora." },
      { q: "Que es una traduccion notarial y cuanto cuesta?", a: "Es una certificacion oficial del notario de que la traduccion es fiel al original. Requerida para diplomas, certificados de nacimiento y documentos internacionales. Costo: 251 ₪ hasta 100 palabras, 197 ₪ por cada 100 palabras adicionales + IVA. Envie su documento por WhatsApp — traduccion en 1-3 dias." },
      { q: "Como se obtiene un apostilla en Israel?", a: "El apostilla es una certificacion internacional segun el Convenio de La Haya. Primero el notario certifica el documento, luego el tribunal emite el sello. Nosotros gestionamos todo el proceso — desde la certificacion hasta el apostilla — sin que usted visite el tribunal." },
      { q: "Se pueden obtener servicios notariales en linea?", a: "Algunos servicios son remotos: traduccion, copias certificadas y apostilla — envie documentos por WhatsApp. La autenticacion de firma, declaraciones juradas y poderes requieren presencia fisica. En esos casos ofrecemos notario a domicilio." },
      { q: "Cual es la diferencia entre poder notarial y poder permanente?", a: "El poder notarial autoriza a otra persona a actuar en su nombre para un asunto especifico (venta de propiedad, cuenta bancaria). El poder permanente es para incapacidad futura. Ambos documentos son diferentes — nosotros preparamos los dos." },
      { q: "En que idiomas estan disponibles los servicios notariales?", a: "Nuestros servicios estan disponibles en hebreo, ingles y arabe. Las traducciones notariales se realizan de y a cualquier idioma — ruso, frances, espanol, aleman y mas. Para residentes extranjeros — acompanamiento en su idioma preferido." },
      { q: "Que documentos requieren certificacion notarial?", a: "La ley exige certificacion para poderes inmobiliarios, acuerdos prenupciales, testamentos y declaraciones juradas. Los documentos para el exterior requieren traduccion notarial y apostilla. Diplomas, certificados de nacimiento y matrimonio requieren certificacion ante autoridades extranjeras." },
    ] },
    blog: { tag: "BLOG", h2: "Guias y articulos notariales", subtitle: "Articulos profesionales sobre traduccion, poderes y apostilla", items: [
      { title: "Tarifas notariales 2026", tag: "Tarifas", excerpt: "Todas las tarifas notariales actualizadas.", slug: "notary-pricing-2026" },
      { title: "Poder notarial — guia completa", tag: "Poder", excerpt: "Tipos, documentos, costos y proceso.", slug: "notarial-power-of-attorney" },
      { title: "Apostilla en Israel", tag: "Apostilla", excerpt: "Dos tipos, tarifas, Convenio de La Haya.", slug: "apostille-israel" },
      { title: "Traduccion notarial", tag: "Traduccion", excerpt: "Costo, dos opciones, servicio digital.", slug: "notarial-translation" },
      { title: "Autenticacion de firma", tag: "Firma", excerpt: "Cuando se requiere, proceso y costo.", slug: "signature-authentication" },
      { title: "Testamento notarial", tag: "Testamento", excerpt: "Ventajas, costo, ley de herencia.", slug: "notarial-will" },
      { title: "Declaracion jurada notarial", tag: "Declaracion", excerpt: "Cuando necesaria, tipos y costo.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON & Co", slogan: "BEYOND LAW", desc: "No somos solo abogados — somos socios. BEYOND LAW significa pensar mas alla del derecho: estrategia comercial, acompanamiento integral y soluciones a medida. Cada servicio notarial es digital, transparente y rapido." },
    contact: { h2: "Contacto", whatsapp: "WhatsApp", email: "Email" },
    footer: { rights: "Todos los derechos reservados", privacy: "Privacidad", terms: "Terminos", accessibility: "Accesibilidad" },
    cookie: { text: "Este sitio usa cookies. Al continuar, aceptas su uso.", accept: "Aceptar", decline: "Rechazar" },
  },
};

const I: Record<string, React.ReactNode> = {
  translate: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M12 5v3M8 8c0 4 3 9 9 12"/><path d="M14 8c-1 4-4.5 8-9 10.5"/><text x="24" y="30" fill="currentColor" stroke="none" fontSize="14" fontFamily="DM Sans" fontWeight="300">A</text><path d="M22 35h12M25 35l3-10 3 10"/></svg>,
  signature: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 34c4-2 6-8 10-8s4 6 8 6 4-4 8-4"/><path d="M28 6l6 6-18 18H10v-6L28 6z"/></svg>,
  affidavit: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="4" width="24" height="32" rx="2"/><path d="M13 12h14M13 18h14M13 24h8"/><circle cx="28" cy="30" r="4"/><path d="M26 30l1.5 1.5 3-3"/></svg>,
  will: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4h16l6 6v26a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M26 4v6h6"/><path d="M14 16h12M14 22h12M14 28h6"/></svg>,
  prenup: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 36s-12-7-12-16c0-5 4-9 8-9a8 8 0 014 1 8 8 0 014-1c4 0 8 4 8 9 0 9-12 16-12 16z"/><path d="M14 20h12M20 14v12"/></svg>,
  poa: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="4" width="24" height="32" rx="2"/><path d="M14 12h12M14 18h12"/><path d="M14 28h5"/><circle cx="28" cy="28" r="5"/><path d="M28 25v3h3"/></svg>,
  certifiedCopy: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="22" height="28" rx="2"/><rect x="12" y="2" width="22" height="28" rx="2"/><path d="M18 12h10M18 18h10M18 24h6"/></svg>,
  lifeCertificate: <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="14" r="8"/><path d="M8 36c0-7 5-12 12-12s12 5 12 12"/><path d="M17 13l2 2 4-4"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  digital: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="22" height="16" rx="2"/><path d="M9 24h10M14 18v6"/></svg>,
  courier: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="16" height="12" rx="1"/><path d="M18 11h5l3 4v3h-4"/><circle cx="8" cy="21" r="2.5"/><circle cx="22" cy="21" r="2.5"/></svg>,
  office: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="18" height="22" rx="1"/><path d="M9 8h4M15 8h4M9 13h4M15 13h4"/><path d="M11 25v-5h6v5"/></svg>,
  homeVisit: <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14l11-11 11 11"/><path d="M5 12v12h7v-7h4v7h7V12"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>,
  attach: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
};
const dIcons = [I.digital, I.courier, I.office, I.homeVisit];
// Keep dIcons in scope
void dIcons;

const Arrow = ({ rtl }: { rtl: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, transform: rtl ? "rotate(180deg)" : "none" }}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const VALID_LANGS = ["he", "en", "ru", "ar", "fr", "es"];

export default function NotaryHome() {
  const pathname = usePathname();
  const router = useRouter();

  // Read language from URL: /he, /en, /ru, /ar, /fr, /es
  const urlLang = pathname.split("/").filter(Boolean)[0];
  const initialLang = VALID_LANGS.includes(urlLang) ? urlLang : "he";

  const [lang, setLangState] = useState(initialLang);
  const [menu, setMenu] = useState(false);
  const [langDrop, setLangDrop] = useState(false);
  const [selSvc, setSelSvc] = useState("");
  const [pages, setPages] = useState(1);
  const [sigs, setSigs] = useState(1);
  const [docs, setDocs] = useState(1);
  const [copies, setCopies] = useState(1);
  const [words, setWords] = useState(100);
  const [notaryTranslates, setNotaryTranslates] = useState(false);
  const [foreignLang, setForeignLang] = useState(false);
  const [faq, setFaq] = useState<number | null>(null);
  const [ucF, setUcF] = useState("all");
  const [cookie, setCookie] = useState(true);
  const [blogF, setBlogF] = useState("all");
  const blogScrollRef = useRef<HTMLDivElement>(null);
  const [trackN, setTrackN] = useState("");

  // Keep docs in scope
  void docs;

  // Switch language and update URL
  const setLang = (newLang: string) => {
    setLangState(newLang);
    router.push(`/${newLang}`);
  };

  // Sync if URL changes externally
  useEffect(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    if (VALID_LANGS.includes(seg) && seg !== lang) {
      setLangState(seg);
    }
  }, [pathname, lang]);

  const t = T[lang]; const cfg = LANGS[lang]; const rtl = cfg.dir === "rtl";
  const svc = selSvc ? PRICING_CONFIG[selSvc] : null;

  const calc = () => {
    if (!svc) return null;
    const lines: { label: string; amount: number }[] = [];
    let total = 0;
    const c = t.pricing.currency;
    const lblPer100to1000 = lang === "he" ? "לכל 100 מילים נוספות (עד 1,000)" : "Per 100 additional words (up to 1,000)";
    const lblPer100above = lang === "he" ? "לכל 100 מילים נוספות (מעל 1,000)" : "Per 100 additional words (over 1,000)";
    const lblNotaryTranslates = lang === "he" ? "תוספת תרגום ע״י הנוטריון (50%)" : "Notary translation surcharge (50%)";
    const lblForeignLang = lang === "he" ? "תוספת שפה לועזית (פרט 10)" : "Foreign language surcharge (Item 10)";
    const lblAdditional = lang === "he" ? "חותמים נוספים" : "Additional signers";
    const lblAddCopies = lang === "he" ? "עותקים נוספים" : "Additional copies";
    // LTR embed for numeric expressions so they render correctly in RTL
    const mul = (qty: number, price: number) => `\u202A${qty} \u00D7 ${price} ${c}\u202C`;
    if (svc.type === "words") {
      const w = words || 0;
      let p = svc.base;
      lines.push({ label: t.pricing.wordsFirst || (lang==="he"?"עד 100 מילים":"Up to 100 words"), amount: svc.base });
      if (w > 100) { const units = Math.ceil(Math.min(w - 100, 900) / 100); const extra = units * svc.per100to1000; p += extra; lines.push({ label: `${lblPer100to1000}: ${mul(units, svc.per100to1000)}`, amount: extra }); }
      if (w > 1000) { const units = Math.ceil((w - 1000) / 100); const extra = units * svc.per100above1000; p += extra; lines.push({ label: `${lblPer100above}: ${mul(units, svc.per100above1000)}`, amount: extra }); }
      total = p;
      if (selSvc === "translation" && notaryTranslates) { const surcharge = Math.round(total * 0.5); total += surcharge; lines.push({ label: lblNotaryTranslates, amount: surcharge }); }
      if (selSvc === "translation" && foreignLang) { total += 104; lines.push({ label: lblForeignLang, amount: 104 }); }
    } else if (svc.type === "stamp") {
      const isWill = selSvc === "will";
      const firstLabel = isWill
        ? (lang === "he" ? "מצווה ראשון" : "First testator")
        : (t.pricing.firstStamp || (lang === "he" ? "חותם ראשון" : "First signatory"));
      const addLabel = isWill
        ? (lang === "he" ? "מצווה נוסף (צוואה הדדית)" : "Additional testator (mutual will)")
        : lblAdditional;
      lines.push({ label: firstLabel, amount: svc.firstStamp });
      total = svc.firstStamp;
      if (sigs > 1) { const add = (sigs - 1) * svc.additionalStamp; total += add; lines.push({ label: `${addLabel}: ${mul(sigs - 1, svc.additionalStamp)}`, amount: add }); }
      if (svc.fields?.includes("copies") && copies > 1) { const add = (copies - 1) * (svc.additionalStamp || 77); total += add; lines.push({ label: `${lblAddCopies}: ${mul(copies - 1, svc.additionalStamp || 77)}`, amount: add }); }
    } else if (svc.type === "fixed") {
      lines.push({ label: t.pricing.basePrice || (lang==="he"?"בסיס":"Base"), amount: svc.base });
      total = svc.base;
      if (svc.perCopy && copies > 1) { const add = (copies - 1) * svc.perCopy; total += add; lines.push({ label: `${lblAddCopies}: ${mul(copies - 1, svc.perCopy)}`, amount: add }); }
    } else if (svc.type === "page") {
      lines.push({ label: t.pricing.firstPage, amount: svc.firstPage });
      total = svc.firstPage;
      if (pages > 1) { const add = (pages - 1) * svc.additionalPage; total += add; lines.push({ label: `${t.pricing.additionalPages}: ${mul(pages - 1, svc.additionalPage)}`, amount: add }); }
    }
    const vat = Math.round(total * 0.18);
    return { lines, total, vat, withVat: total + vat };
  };
  const pr = calc();

  const go = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const S = {
    tag: { fontSize: 11, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase" as const, color: "#999", marginBottom: 10, textAlign: "center" as const },
    h2: { fontSize: "clamp(26px,4vw,38px)", fontWeight: 300, textAlign: "center" as const, marginBottom: 6 },
    sub: { fontSize: 14, fontWeight: 300, color: "#6B6B6B", textAlign: "center" as const, marginBottom: 36, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 },
    lbl: { display: "block" as const, fontSize: 11, fontWeight: 500, color: "#999", marginBottom: 6 },
    inp: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E8E6E1", fontSize: 13, fontFamily: cfg.font, background: "#FAFAF8", marginBottom: 18, direction: "ltr" as const },
  };

  return (
    <div dir={cfg.dir} style={{ fontFamily: cfg.font, color: "#1A1A1A", background: "#fff", minHeight: "100vh", lineHeight: 1.7, WebkitFontSmoothing: "antialiased" }}>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}::selection{background:#1A1A1A;color:#fff}
        @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lg{from{width:0}to{width:50px}}
        .fu{animation:fu .5s ease both}.fd1{animation-delay:.1s}.fd2{animation-delay:.2s}
        .la{animation:lg .7s ease .3s both}
        button,a{cursor:pointer}.sc:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.06)}
        .uc:hover{background:#1A1A1A!important;color:#fff!important}.uc:hover .ut{background:rgba(255,255,255,.15)!important;color:#fff!important}
        .fq:hover{background:#FAFAF8}.nl:hover{opacity:.5}.cb:hover{background:#444!important}.ob:hover{background:#1A1A1A!important;color:#fff!important}.lo:hover{background:#F5F4F1}
        @media(max-width:768px){.dn{display:none!important}.mb{display:flex!important}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8E6E1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "baseline", direction: "ltr" }}>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 500, fontSize: 15, letterSpacing: 5, textTransform: "uppercase" }}>BEITON</span>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: 3, color: "#999", marginLeft: 6 }}>&amp; Co</span>
          </div>
          <div className="dn" style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {Object.entries(t.nav).map(([k, v]: [string, any]) => <a key={k} className="nl" onClick={() => go(k)} style={{ fontSize: 12, color: "#1A1A1A", textDecoration: "none", transition: "opacity .2s" }}>{v}</a>)}
            <div style={{ position: "relative" }}>
              <button onClick={() => setLangDrop(!langDrop)} style={{ background: "none", border: "1px solid #E8E6E1", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#6B6B6B", display: "flex", alignItems: "center", gap: 3, fontFamily: cfg.font }}>{LANGS[lang].label}<span style={{ width: 11, height: 11 }}>{I.chevron}</span></button>
              {langDrop && <div style={{ position: "absolute", top: "110%", [rtl?"right":"left"]: 0, background: "#fff", border: "1px solid #E8E6E1", borderRadius: 8, overflow: "hidden", minWidth: 120, boxShadow: "0 6px 20px rgba(0,0,0,.07)", zIndex: 200 }}>
                {Object.entries(LANGS).map(([c, { label, font }]) => <button key={c} className="lo" onClick={() => { setLang(c); setLangDrop(false); }} style={{ display: "block", width: "100%", textAlign: rtl?"right":"left", padding: "8px 12px", border: "none", background: lang===c?"#F5F4F1":"transparent", fontSize: 12, fontFamily: font, color: "#1A1A1A", transition: "background .15s" }}>{label}</button>)}
              </div>}
            </div>
          </div>
          <button className="mb" onClick={() => setMenu(!menu)} style={{ display: "none", background: "none", border: "none", width: 24, height: 24, color: "#1A1A1A" }}>{menu ? I.close : I.menu}</button>
        </div>
        {menu && <div style={{ background: "#fff", borderTop: "1px solid #E8E6E1", padding: "10px 24px" }}>
          {Object.entries(t.nav).map(([k, v]: [string, any]) => <a key={k} onClick={() => go(k)} style={{ display: "block", padding: "9px 0", fontSize: 14, color: "#1A1A1A", textDecoration: "none", borderBottom: "1px solid #F5F4F1" }}>{v}</a>)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingTop: 10 }}>
            {Object.entries(LANGS).map(([c, { label }]) => <button key={c} onClick={() => { setLang(c); setMenu(false); }} style={{ padding: "4px 11px", borderRadius: 14, border: lang===c?"1px solid #1A1A1A":"1px solid #E8E6E1", background: lang===c?"#1A1A1A":"transparent", color: lang===c?"#fff":"#6B6B6B", fontSize: 10, fontFamily: LANGS[c].font }}>{label}</button>)}
          </div>
        </div>}
      </nav>

      {/* HERO */}
      <section id="home" style={{ padding: "72px 24px 52px", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <p className="fu" style={{ fontSize: 11, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: "#999", marginBottom: 14 }}>BEITON &amp; Co</p>
        <h1 className="fu fd1" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 28 }}>{t.hero.h1}</h1>
        <div className="la" style={{ height: 1, background: "#1A1A1A", margin: "0 auto 28px" }} />
        <div className="fu fd2" style={{ maxWidth: 600, margin: "0 auto" }}>
          <AgentChat lang={lang as "he" | "en" | "ru" | "ar" | "fr" | "es"} />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: "#FAFAF8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={S.tag}>{t.services.tag}</p>
          <h2 style={S.h2}>{t.services.h2}</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", textAlign: "center", marginBottom: 36 }}>{t.services.subtitle}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
            {t.services.items.map((s: any) => (
              <div key={s.id} className="sc" style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #E8E6E1", transition: "all .3s" }}>
                <div style={{ width: 40, height: 40, color: "#1A1A1A", marginBottom: 14 }}>{I[s.icon]}</div>
                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{s.name}</h3>
                <p style={{ fontSize: 12, fontWeight: 300, color: "#6B6B6B", lineHeight: 1.7 }}>{s.desc}</p>
                <button className="ob" onClick={() => { setSelSvc(s.id); go("pricing"); }} style={{ marginTop: 14, width: "100%", background: "transparent", border: "1px solid #E8E6E1", borderRadius: 6, padding: "8px 14px", fontSize: 11, color: "#1A1A1A", fontFamily: cfg.font, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  {t.services.calcBtn} <Arrow rtl={rtl} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="usecases" style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <p style={S.tag}>{t.useCases.tag}</p>
        <h2 style={S.h2}>{t.useCases.h2}</h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", textAlign: "center", marginBottom: 24 }}>{t.useCases.subtitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 24 }}>
          {[t.useCases.allFilter, ...[...new Set(t.useCases.items.map((u: any) => u.tag) as string[])]].map((tag: string) => {
            const isAll = tag === t.useCases.allFilter; const act = isAll ? ucF==="all" : ucF===tag;
            return <button key={tag} onClick={() => setUcF(isAll?"all":tag)} style={{ padding: "4px 14px", borderRadius: 14, border: act?"1px solid #1A1A1A":"1px solid #E8E6E1", background: act?"#1A1A1A":"transparent", color: act?"#fff":"#6B6B6B", fontSize: 11, fontFamily: cfg.font, transition: "all .2s" }}>{tag}</button>;
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 8 }}>
          {t.useCases.items.map((uc: any, origIdx: number) => ({ ...uc, origIdx })).filter((u: any) => ucF==="all"||u.tag===ucF).map((uc: any) => (
            <Link key={uc.origIdx} href={`/${lang}/services/${UC_SLUGS[uc.origIdx] || ""}`} className="uc" style={{ padding: "12px 16px", borderRadius: 7, border: "1px solid #E8E6E1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, transition: "all .2s", cursor: "pointer", textDecoration: "none", color: "inherit" }}>
              <span style={{ fontSize: 13 }}>{uc.name}</span>
              <span className="ut" style={{ fontSize: 10, color: "#999", background: "#F5F4F1", padding: "2px 8px", borderRadius: 8, whiteSpace: "nowrap", transition: "all .2s" }}>{uc.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: "#F5F4F1", padding: "64px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={S.tag}>{t.pricing.tag}</p>
          <h2 style={S.h2}>{t.pricing.h2}</h2>
          <p style={S.sub}>{t.pricing.subtitle}</p>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #E8E6E1" }}>
            <label style={S.lbl}>{t.pricing.selectService}</label>
            <select value={selSvc} onChange={e => { const v = e.target.value; setSelSvc(v); setPages(1); setSigs(1); setDocs(1); setCopies(1); setWords(100); if (v) trackServiceExplored(v); }} style={{ ...S.inp, appearance: "none" as const, direction: cfg.dir as "rtl" | "ltr" }}>
              <option value="">—</option>
              {Object.entries(PRICING_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label[lang]}</option>)}
            </select>
            {svc?.fields?.includes("words") && <><label style={S.lbl}>{t.pricing.words || "מילים"}</label><input type="number" min={1} value={words} onChange={e => setWords(Math.max(1,+e.target.value))} style={S.inp} /><label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B6B6B", marginBottom: 8, cursor: "pointer" }}><input type="checkbox" checked={notaryTranslates} onChange={e => setNotaryTranslates(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1A1A1A" }} />{lang === "he" ? "הנוטריון מתרגם (תוספת 50%)" : "Notary translates (50% surcharge)"}</label><label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B6B6B", marginBottom: 18, cursor: "pointer" }}><input type="checkbox" checked={foreignLang} onChange={e => setForeignLang(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1A1A1A" }} />{lang === "he" ? "שפה לועזית — לא עברית/אנגלית/ערבית (+104 ₪)" : "Foreign language — not Hebrew/English/Arabic (+104 ₪)"}</label></>}
            {svc?.fields?.includes("pages") && <><label style={S.lbl}>{t.pricing.pages}</label><input type="number" min={1} max={50} value={pages} onChange={e => setPages(Math.max(1,+e.target.value))} style={S.inp} /></>}
            {svc?.fields?.includes("signatories") && <><label style={S.lbl}>{t.pricing.signatories}</label><input type="number" min={1} max={10} value={sigs} onChange={e => setSigs(Math.max(1,+e.target.value))} style={S.inp} /></>}
            {svc?.fields?.includes("documents") && <><label style={S.lbl}>{t.pricing.documents}</label><input type="number" min={1} max={20} value={docs} onChange={e => setDocs(Math.max(1,+e.target.value))} style={S.inp} /></>}
            {svc?.fields?.includes("copies") && <><label style={S.lbl}>{t.pricing.copies}</label><input type="number" min={1} max={10} value={copies} onChange={e => setCopies(Math.max(1,+e.target.value))} style={S.inp} /></>}

            {pr && <div style={{ borderTop: "1px solid #E8E6E1", paddingTop: 16, marginTop: 4 }}>
              {pr.lines.map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B6B6B", marginBottom: 4 }}><span>{l.label}</span><span>{l.amount.toLocaleString()} {t.pricing.currency}</span></div>)}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 400, marginTop: 10, paddingTop: 10, borderTop: "1px solid #E8E6E1" }}><span>{t.pricing.total}</span><span>{pr.total.toLocaleString()} {t.pricing.currency}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B6B6B", marginTop: 4 }}><span>{t.pricing.vat || (lang==="he"?"מע״מ (18%)":"VAT (18%)")}</span><span>{pr.vat.toLocaleString()} {t.pricing.currency}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 500, marginTop: 8, paddingTop: 8, borderTop: "1px solid #E8E6E1" }}><span>{t.pricing.totalVat || (lang==="he"?"סה״כ כולל מע״מ":"Total incl. VAT")}</span><span>{pr.withVat.toLocaleString()} {t.pricing.currency}</span></div>
              <p style={{ fontSize: 10, color: "#999", marginTop: 8, fontStyle: "italic" }}>{t.pricing.regulationNote}</p>
            </div>}
          </div>
        </div>
      </section>

      {/* TRACK ORDER */}
      <section id="track" style={{ padding: "64px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ ...S.h2, marginBottom: 8 }}>{t.track.h2}</h2>
        <p style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B", marginBottom: 24 }}>{t.track.subtitle}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={trackN} onChange={e => setTrackN(e.target.value)} placeholder={t.track.placeholder} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #E8E6E1", fontSize: 12, fontFamily: cfg.font, background: "#FAFAF8", direction: "ltr" }} />
          <button className="cb" style={{ background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 500, fontFamily: cfg.font, transition: "background .2s", whiteSpace: "nowrap" }}>{t.track.btn}</button>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#FAFAF8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={S.tag}>{t.faq.tag}</p>
          <h2 style={{ ...S.h2, marginBottom: 32 }}>{t.faq.h2}</h2>
          {t.faq.items.map((item: any, i: number) => (
            <div key={i} className="fq" onClick={() => setFaq(faq===i?null:i)} style={{ borderBottom: "1px solid #E8E6E1", padding: "16px 2px", cursor: "pointer", transition: "background .15s", borderRadius: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 400 }}>{item.q}</p>
                <span style={{ width: 16, height: 16, flexShrink: 0, transform: faq===i?"rotate(180deg)":"none", transition: "transform .3s", color: "#999" }}>{I.chevron}</span>
              </div>
              {faq===i && <p style={{ fontSize: 12, fontWeight: 300, color: "#6B6B6B", marginTop: 8, lineHeight: 1.7 }}>{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* BLOG — Carousel with filter chips */}
      <section id="blog" style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={S.tag}>{t.blog.tag}</p>
          <h2 style={S.h2}>{t.blog.h2}</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", textAlign: "center", marginBottom: 24 }}>{t.blog.subtitle}</p>
          {t.blog.items && t.blog.items.length > 0 && <>
            {/* Filter chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 24 }}>
              {[lang === "he" ? "הכל" : lang === "ar" ? "الكل" : lang === "ru" ? "Все" : lang === "fr" ? "Tout" : lang === "es" ? "Todo" : "All", ...[...new Set(t.blog.items.map((p: any) => p.tag) as string[])]].map((tag: string, ti: number) => {
                const isAll = ti === 0;
                const act = isAll ? blogF === "all" : blogF === tag;
                return <button key={tag} onClick={() => setBlogF(isAll ? "all" : tag)} style={{ padding: "4px 14px", borderRadius: 14, border: act ? "1px solid #1A1A1A" : "1px solid #E8E6E1", background: act ? "#1A1A1A" : "transparent", color: act ? "#fff" : "#6B6B6B", fontSize: 11, fontFamily: cfg.font, transition: "all .2s", cursor: "pointer" }}>{tag}</button>;
              })}
            </div>
            {/* Horizontal scroll carousel with arrows */}
            <div style={{ position: "relative" }}>
              {/* Left arrow */}
              <button onClick={() => blogScrollRef.current?.scrollBy({ left: rtl ? 296 : -296, behavior: "smooth" })} aria-label="Previous" style={{ position: "absolute", [rtl ? "right" : "left"]: -8, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "1px solid #E8E6E1", background: "rgba(255,255,255,.95)", boxShadow: "0 2px 8px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1A1A1A" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, transform: rtl ? "rotate(180deg)" : "none" }}><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              {/* Right arrow */}
              <button onClick={() => blogScrollRef.current?.scrollBy({ left: rtl ? -296 : 296, behavior: "smooth" })} aria-label="Next" style={{ position: "absolute", [rtl ? "left" : "right"]: -8, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "1px solid #E8E6E1", background: "rgba(255,255,255,.95)", boxShadow: "0 2px 8px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1A1A1A" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, transform: rtl ? "rotate(180deg)" : "none" }}><path d="M9 18l6-6-6-6"/></svg>
              </button>
              {/* Scroll container */}
              <style>{`.blog-scroll::-webkit-scrollbar{display:none}`}</style>
              <div ref={blogScrollRef} className="blog-scroll" style={{ display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", paddingInlineStart: 4, paddingInlineEnd: 4, paddingBottom: 8 }}>
                {t.blog.items.filter((p: any) => blogF === "all" || p.tag === blogF).map((post: any, i: number) => (
                  <Link key={i} href={`/${lang}/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit", flex: "0 0 280px", scrollSnapAlign: "start" }}>
                    <article className="sc" style={{ background: "#FAFAF8", borderRadius: 12, padding: 24, border: "1px solid #E8E6E1", transition: "all .3s", cursor: "pointer", height: "100%", minHeight: 180 }}>
                      <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>{post.tag}</p>
                      <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, lineHeight: 1.5 }}>{post.title}</h3>
                      <p style={{ fontSize: 12, fontWeight: 300, color: "#6B6B6B", lineHeight: 1.6 }}>{post.excerpt}</p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </>}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <p style={S.tag}>{t.about.tag}</p>
          <h2 style={{ ...S.h2, direction: "ltr", marginBottom: 4 }}>{t.about.h2}</h2>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "#999", textTransform: "uppercase", marginBottom: 18, direction: "ltr" }}>{t.about.slogan}</p>
          <div style={{ width: 40, height: 1, background: "#1A1A1A", margin: "0 auto 18px" }} />
          <p style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B", lineHeight: 1.9 }}>{t.about.desc}</p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: "#FAFAF8", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ ...S.h2, marginBottom: 24 }}>{t.contact.h2}</h2>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/972500000000" onClick={() => trackContactClick("whatsapp")} className="cb" style={{ background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 500, fontFamily: cfg.font, textDecoration: "none", transition: "background .2s" }}>{t.contact.whatsapp}</a>
          <a href="mailto:office@beiton.co" onClick={() => trackContactClick("email")} className="ob" style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontFamily: cfg.font, textDecoration: "none", transition: "all .2s" }}>{t.contact.email}</a>
        </div>
        <p style={{ fontSize: 11, color: "#999", marginTop: 14 }}>office@beiton.co</p>
      </section>

      {/* FOOTER */}
      <SiteFooter lang={lang} />

      {/* COOKIE */}
      {cookie && <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "#fff", borderTop: "1px solid #E8E6E1", padding: "14px 24px", boxShadow: "0 -4px 16px rgba(0,0,0,.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <p style={{ fontSize: 11, color: "#6B6B6B", flex: 1, minWidth: 180 }}>{t.cookie.text}</p>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setCookie(false)} className="cb" style={{ background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 6, padding: "7px 18px", fontSize: 11, fontWeight: 500, fontFamily: cfg.font, transition: "background .2s" }}>{t.cookie.accept}</button>
            <button onClick={() => setCookie(false)} style={{ background: "transparent", color: "#6B6B6B", border: "1px solid #E8E6E1", borderRadius: 6, padding: "7px 14px", fontSize: 11, fontFamily: cfg.font }}>{t.cookie.decline}</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

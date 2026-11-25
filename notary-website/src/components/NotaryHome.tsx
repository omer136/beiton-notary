"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import HeroWhatsApp from "./HeroWhatsApp";
import { PRICING_CONFIG } from "@/data/pricing-config";
import { trackContactClick, trackServiceExplored, updateConsent } from "@/lib/analytics";
import SiteFooter from "./SiteFooter";
import BrandLogo from "./BrandLogo";
import { ORDER_FLOWS_ENABLED } from "@/lib/site-mode";

/* ═══════════════════════════════════════════════════════════
   BEITON — Notary Website v2
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
    apostille_court: { he: "אפוסטיל בית משפט", en: "Apostille (Court)", govFee: 41, handlingFee: 50, note: "אגרה 41₪ למסמך + דמי טיפול 50₪ + מע\"מ לכל תעודה. נדרש למסמכים נוטריוניים שמיועדים למדינות חברות באמנת האג." },
    apostille_mofa: { he: "אפוסטיל משרד החוץ", en: "Apostille (Foreign Ministry)", govFee: 41, handlingFee: 250, orderLink: "https://beta.delawvery.co.il/he/forms/ForeignApostille?mode=continueAsGuest", note: "אגרה ממשלתית 41₪ למסמך + דמי טיפול 250₪ + מע\"מ לכל תעודה. למסמכים ציבוריים (תעודת לידה, נישואין וכו׳). דרושה תעודה מקורית — הבאה עצמית למשרד ללא עלות או שליח בתוספת." },
    urgentTranslation: { he: "תרגום דחוף (24 שעות)", en: "Urgent translation (24h)", surcharge: "50%", note: "תוספת 50% על שכר התרגום לפי התקנות" },
    foreignLanguageSurcharge: { he: "תוספת שפה (לא עברית/אנגלית/ערבית)", en: "Foreign language surcharge", amount: 104, note: "תוספת 104₪ לאישור בשפה שאינה עברית, אנגלית או ערבית — קבוע בתקנות" },
    afterHoursSurcharge: { he: "תוספת שעות חריגות", en: "After-hours surcharge", surcharge: "50%", note: "תוספת 50% לשירות בין 19:00-08:00 או בימי מנוחה — קבוע בתקנות" },
  },
};

// Keep AGENT_SERVICE_CONFIG in scope for potential agent use
void AGENT_SERVICE_CONFIG;

const T: Record<string, any> = {
  he: {
    nav: { home: "ראשי", services: "פעולות נוטריוניות", usecases: "לפי מסמך", pricing: "השכר בתקנות", blog: "מדריכים", about: "אודות", contact: "יצירת קשר" },
    hero: { h1: "פעולות נוטריוניות בישראל: מה הדין קובע", chatGreeting: "", chatPlaceholder: "", chatSend: "" },
    services: { tag: "NOTARIAL ACTS", h2: "הפעולות הנוטריוניות, אחת אחת", subtitle: "מה כל פעולה, ומה הדין דורש בה, עם הסעיף לכל כלל", items: [
      { id: "translation", name: "תרגום נוטריוני", desc: "אישור של נוטריון שתרגום נכון, רק בשפות שהנוטריון שולט בהן (סעיף 15).", icon: "translate" },
      { id: "signature", name: "אימות חתימה", desc: "נוטריון מאמת חתימה רק אם החותם עמד לפניו, זוהה וחתם בפניו (סעיף 11).", icon: "signature" },
      { id: "affidavit", name: "תצהיר נוטריוני", desc: "נוטריון מוסמך \"לקבל ולאשר תצהיר והצהרה אחרת\" (סעיף 7(5)).", icon: "affidavit" },
      { id: "will", name: "צוואה נוטריונית", desc: "צוואה בפני רשות לפי סעיף 22 לחוק הירושה, שבו \"דין נוטריון כדין שופט\".", icon: "will" },
      { id: "prenup", name: "הסכם ממון", desc: "הסכם ממון שנכרת לפני הנישואין: נוטריון רשאי לאמת אותו. אחרי הנישואין: אישור בית משפט או בית דין.", icon: "prenup" },
      { id: "poa", name: "ייפוי כוח נוטריוני", desc: "ייפוי כוח כללי ולעסקה במקרקעין שטעונה רישום: תקף רק אם נוטריון ערך אותו או אימת את החתימות (סעיף 20(א)).", icon: "poa" },
      { id: "certifiedCopy", name: "העתק נאמן למקור", desc: "אישור שהעתק נכון, רק אחרי שהמקור הוצג לנוטריון והושווה (סעיף 12).", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "אישור חיים", desc: "אישור שאדם היה בחיים ביום פלוני, רק אם עמד לפני הנוטריון באותו יום וזוהה (סעיף 16).", icon: "lifeCertificate" },
    ], calcBtn: "חישוב מחיר" },
    useCases: { tag: "USE CASES", h2: "מדריכים לפי מסמך", subtitle: "חיפוש לפי המסמך", allFilter: "הכל", items: [
      { name: "תרגום תעודת לידה", tag: "תרגום נוטריוני" }, { name: "תרגום דיפלומה", tag: "תרגום נוטריוני" }, { name: "תרגום רישיון נהיגה", tag: "תרגום נוטריוני" }, { name: "תרגום תעודת נישואין", tag: "תרגום נוטריוני" }, { name: "תרגום תעודת גירושין", tag: "תרגום נוטריוני" }, { name: "חבילת מסמכים לאזרחות פורטוגזית", tag: "תרגום נוטריוני" },
      { name: "אימות חתימה על חוזה", tag: "אימות חתימה" }, { name: "אימות חתימה על NDA", tag: "אימות חתימה" }, { name: "הסכמה להוצאת קטין לחו״ל", tag: "אימות חתימה" },
      { name: "ייפוי כוח כללי", tag: "ייפוי כוח נוטריוני" }, { name: "ייפוי כוח למכירת דירה", tag: "ייפוי כוח נוטריוני" }, { name: "ייפוי כוח מתמשך", tag: "ייפוי כוח נוטריוני" }, { name: "ייפוי כוח למשכנתא", tag: "ייפוי כוח נוטריוני" },
      { name: "תצהיר רווקות", tag: "תצהיר נוטריוני" }, { name: "תצהיר מגורים", tag: "תצהיר נוטריוני" }, { name: "הצהרת מתרגם", tag: "תצהיר נוטריוני" },
      { name: "צוואה אישית", tag: "צוואה נוטריונית" }, { name: "צוואה הדדית (בני זוג)", tag: "צוואה נוטריונית" },
      { name: "הסכם ממון לפני נישואין", tag: "הסכם ממון" }, { name: "הסכם ממון אחרי נישואין", tag: "הסכם ממון" },
      { name: "העתק נאמן לדרכון", tag: "העתק נאמן למקור" }, { name: "העתק נאמן לתעודה אקדמית", tag: "העתק נאמן למקור" }, { name: "העתק נאמן למסמכי חברה", tag: "העתק נאמן למקור" },
      { name: "אישור חיים לפנסיה מחו״ל", tag: "אישור חיים" }, { name: "אישור חיים לגמלאים", tag: "אישור חיים" },
    ] },
    pricing: { tag: "PRICING", h2: "מחשבון שירותי נוטריון", subtitle: "השכר קבוע בתקנות הנוטריונים (שכר שירותים), תשל״ט-1978, ואחיד בכל הארץ.", selectService: "בחרו שירות", pages: "מספר עמודים", signatories: "מספר חותמים", documents: "מספר מסמכים", copies: "מספר עותקים", words: "מספר מילים במסמך", wordsFirst: "עד 100 מילים", firstPage: "עמוד ראשון", firstStamp: "חותם ראשון", additionalPages: "עמודים נוספים", perSignatory: "לכל חותם נוסף", basePrice: "תעריף בסיס", total: "סה״כ לפני מע״מ", vat: "מע״מ (18%)", totalVat: "סה״כ כולל מע״מ", currency: "₪", delivery: "", deliveryOptions: [], regulationNote: "נוטריון אינו רשאי לגבות יותר מהשכר שבתקנות; פחות מזה מותר רק במקרים שבתקנה 1א." },
    track: { h2: "מעקב הזמנה", subtitle: "הזינו את מספר התיק ובדקו את סטטוס ההזמנה.", placeholder: "מספר תיק (לדוגמה: BN-2026-0042)", btn: "בדיקת סטטוס" },
    faq: { tag: "FAQ", h2: "שאלות נפוצות על שירותי נוטריון", items: [
      { q: "כמה עולה אימות חתימה אצל נוטריון בישראל?", a: "השכר קבוע בתקנות הנוטריונים (שכר שירותים), תשל״ט-1978, ואחיד בכל הארץ. לשנת 2026: אימות חתימה, 197 ₪ לחותם הראשון ו-77 ₪ לכל חותם נוסף; תצהיר, 200 ₪ למצהיר הראשון; אישור העתק, 77 ₪ לעמוד הראשון; ובנוסף מע״מ. נוטריון אינו רשאי לגבות יותר מהשכר שבתקנות; פחות מזה מותר רק במקרים שבתקנה 1א." },
      { q: "מה זה אישור תרגום נוטריוני וכמה הוא עולה?", a: "נוטריון מאשר שתרגום נכון. לפי סעיף 15 לחוק הנוטריונים, תשל״ו-1976, הוא רשאי לעשות זאת רק אם הוא \"שולט בשפה שבה נערך המקור ובשפה שאליה תורגם, והוא עצמו ערך את התרגום או בדק את נכונותו\". השכר לשנת 2026 (פרט 3(א)): 251 ₪ עד 100 המילים הראשונות, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ לכל 100 מילים מעל 1,000, ובנוסף מע״מ." },
      { q: "מה זה אפוסטיל ואיך מקבלים אותו על מסמך נוטריוני?", a: "אחרי האישור הנוטריוני, חתימת הנוטריון על מסמך שנועד לשימוש מחוץ לישראל מאומתת, לפי בקשה, \"בידי רשם בית־משפט שלום או עובד מדינה שמונו לכך בידי שר המשפטים\" (סעיף 45(א) לחוק הנוטריונים). האימות הזה מכונה אפוסטיל. אם הוא נדרש, קובע הגורם שמקבל את המסמך במדינת היעד." },
      { q: "האם אפשר לבצע פעולה נוטריונית בלי להתייצב בפני נוטריון?", a: "תלוי בפעולה. באימות חתימה החוק דורש ש\"החותם עמד לפניו, זוהה וחתם בפניו על המסמך\" (סעיף 11), ובאישור שאדם בחיים, ש\"עמד לפניו האדם באותו יום וזוהה\" (סעיף 16). גם באישור נוטריוני אלקטרוני, מי שנדרש לחתום חותם בפני הנוטריון (תקנה 19א לתקנות הנוטריונים, תשל״ז-1977). באישור העתק, המקור צריך להיות מוצג לנוטריון (סעיף 12). באישור תרגום, סעיף 15 אינו דורש שמבקש השירות יעמוד לפני הנוטריון." },
      { q: "מה ההבדל בין ייפוי כוח נוטריוני לייפוי כוח מתמשך?", a: "ייפוי כוח כללי וייפוי כוח לעסקה במקרקעין שטעונה רישום תקפים רק אם נוטריון ערך אותם או אימת את החתימות עליהם (סעיף 20(א) לחוק הנוטריונים). ייפוי כוח מתמשך, לעומת זאת, נחתם \"לפני עורך דין שעבר הכשרה לעניין עריכת ייפוי כוח מתמשך\" (סעיף 32יד(א) לחוק הכשרות המשפטית והאפוטרופסות, תשכ״ב-1962), ו\"אינו טעון אישור אחר\" (סעיף 32יג(ט)). הוא אינו פעולה נוטריונית." },
      { q: "באילו שפות נוטריון רשאי לאשר תרגום?", a: "רק בשפות שהנוטריון עצמו שולט בהן: שפת המקור ושפת התרגום (סעיף 15 לחוק הנוטריונים). כשהנוטריון אינו שולט באחת מהן, הדרך המקובלת היא תצהיר של המתרגם בפני נוטריון על נכונות התרגום, שהנוטריון מאשר כתצהיר (סעיף 7(5))." },
      { q: "אילו מסמכים טעונים פעולה של נוטריון?", a: "כמה דוגמאות מהחוק: ייפוי כוח כללי וייפוי כוח לעסקה במקרקעין שטעונה רישום (סעיף 20(א) לחוק הנוטריונים; מאז תיקון מס׳ 12, ייפוי כוח לתאגיד בנקאי לעסקת משכנתה פטור מכך, סעיף 20(א1)); אימות חתימה ואישור העתק כשהמסמך דרוש לשימוש בחוץ לארץ, שייעשו רק בידי נוטריון (סעיף 8). הסכם ממון שנכרת לפני הנישואין יכול שיאומת בידי נוטריון (סעיף 2(ג1) לחוק יחסי ממון בין בני זוג, תשל״ג-1973); הסכם שנכרת אחרי הנישואין טעון אישור בית המשפט לענייני משפחה או בית הדין הדתי (סעיף 2(א))." },
    ] },
    blog: { tag: "BLOG", h2: "מדריכים ומאמרים בנושא נוטריון", subtitle: "כתבות מקצועיות על תרגום, ייפוי כוח, אפוסטיל ועוד", items: [
      { title: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים", tag: "מחירון", excerpt: "תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים. כל המחירים לאימות חתימה, תרגום, צוואה, הסכם ממון ועוד.", slug: "notary-pricing-2026" },
      { title: "ייפוי כוח נוטריוני — המדריך המלא: סוגים, מסמכים ועלויות", tag: "ייפוי כוח", excerpt: "כל הסוגים, המסמכים הנדרשים, התעריפים המעודכנים ל-2026 והתהליך המלא.", slug: "notarial-power-of-attorney" },
      { title: "אפוסטיל בישראל — מה זה, מתי צריך ואיך מוציאים?", tag: "אפוסטיל", excerpt: "מדריך מעודכן 2026: מה זה אפוסטיל, שני הסוגים, תעריפים ותהליך מלא.", slug: "apostille-israel" },
      { title: "תרגום נוטריוני — כל מה שצריך לדעת לפני שמתרגמים", tag: "תרגום", excerpt: "מה זה אישור תרגום, מי רשאי לאשר לפי סעיף 15, ומה השכר.", slug: "notarial-translation" },
      { title: "אימות חתימה נוטריוני — מתי חובה, איך עושים וכמה עולה?", tag: "אימות חתימה", excerpt: "מתי נדרש אימות חתימה, מה התהליך, כמה עולה ואילו מסמכים צריך להביא.", slug: "signature-authentication" },
      { title: "צוואה נוטריונית — למה חשוב ומה ההבדל מצוואה רגילה?", tag: "צוואה", excerpt: "מהי צוואה נוטריונית, מה היתרונות, כמה עולה ומתי חייבים לערוך אחת.", slug: "notarial-will" },
      { title: "תצהיר נוטריוני — מתי נדרש, איך מכינים וכמה עולה?", tag: "תצהיר", excerpt: "מתי חייבים תצהיר נוטריוני, ההבדל מתצהיר בפני עו״ד, סוגים נפוצים ותעריפים.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON", slogan: "BEYOND LAW", desc: "BEITON הוא משרד עורכי דין. האתר הזה מסביר את הפעולות הנוטריוניות בישראל: מה כל פעולה, מה הדין דורש ומה השכר שקבוע בתקנות, עם המקור לכל כלל. הוא אינו מציע ביצוע של פעולה נוטריונית, ואינו ייעוץ משפטי." },
    contact: { h2: "יצירת קשר", whatsapp: "פנייה בוואטסאפ", email: "פנייה במייל", phone: "חיוג טלפוני", address: "נח מוזס 2, ראשון לציון", hours: "ימים א׳–ה׳, 09:00–18:00" },
    footer: { rights: "כל הזכויות שמורות", privacy: "מדיניות פרטיות", terms: "תנאי שימוש", accessibility: "נגישות" },
    cookie: { text: "אתר זה משתמש בעוגיות לצורך שיפור חוויית הגלישה. בהמשך הגלישה הינך מסכים/ה לשימוש בעוגיות.", accept: "מסכים/ה", decline: "דחייה" },
  },
  en: {
    nav: { home: "Home", services: "Notarial acts", usecases: "By document", pricing: "Fees", blog: "Guides", about: "About", contact: "Contact" },
    hero: { h1: "Notarial acts in Israel: what the law says", chatGreeting: "", chatPlaceholder: "", chatSend: "" },
    services: { tag: "NOTARIAL ACTS", h2: "The notarial acts, one by one", subtitle: "What each act is and what the law requires, with the section for each rule", items: [
      { id: "translation", name: "Notarial Translation", desc: "A notary's certificate that a translation is correct, only in languages the notary masters (section 15).", icon: "translate" },
      { id: "signature", name: "Signature Authentication", desc: "A notary authenticates a signature only if the signatory stood before the notary, was identified and signed in the notary's presence (section 11).", icon: "signature" },
      { id: "affidavit", name: "Notarial Affidavit", desc: "A notary may receive and certify an affidavit or another declaration (section 7(5)).", icon: "affidavit" },
      { id: "will", name: "Notarial Will", desc: "A will before an authority under section 22 of the Succession Law, where a notary is like a judge.", icon: "will" },
      { id: "prenup", name: "Prenuptial Agreement", desc: "A property agreement made before marriage may be certified by a notary. After marriage, it needs court approval.", icon: "prenup" },
      { id: "poa", name: "Power of Attorney", desc: "A general POA and a POA for a registrable real-estate transaction are valid only if a notary prepared it or authenticated the signatures (section 20(a)).", icon: "poa" },
      { id: "certifiedCopy", name: "Certified True Copy", desc: "A notary certifies a copy only after the original was presented and compared (section 12).", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Life Certificate", desc: "A certificate that a person was alive on a given day, only if they stood before the notary that day and were identified (section 16).", icon: "lifeCertificate" },
    ], calcBtn: "Calculate Price" },
    useCases: { tag: "USE CASES", h2: "Guides by document", subtitle: "Find the guide for your document", allFilter: "All", items: [
      { name: "Birth Certificate Translation", tag: "Translation" }, { name: "Diploma Translation", tag: "Translation" }, { name: "Driver's License Translation", tag: "Translation" }, { name: "Marriage Certificate Translation", tag: "Translation" }, { name: "Divorce Certificate Translation", tag: "Translation" }, { name: "Portuguese Citizenship Package", tag: "Translation" },
      { name: "Contract Signature Auth", tag: "Signature Authentication" }, { name: "NDA Signature Auth", tag: "Signature Authentication" }, { name: "Consent for Minor Travel", tag: "Signature Authentication" },
      { name: "General Power of Attorney", tag: "Power of Attorney" }, { name: "POA for Property Sale", tag: "Power of Attorney" }, { name: "Continuing Power of Attorney", tag: "Power of Attorney" }, { name: "Mortgage POA", tag: "Power of Attorney" },
      { name: "Single Status Affidavit", tag: "Affidavit" }, { name: "Residency Affidavit", tag: "Affidavit" }, { name: "Translator Declaration", tag: "Affidavit" },
      { name: "Personal Will", tag: "Notarial Will" }, { name: "Mutual Will (Spouses)", tag: "Notarial Will" },
      { name: "Prenuptial Agreement", tag: "Prenuptial Agreement" }, { name: "Postnuptial Agreement", tag: "Prenuptial Agreement" },
      { name: "Passport Certified Copy", tag: "Certified Copy" }, { name: "Academic Diploma Copy", tag: "Certified Copy" }, { name: "Company Documents Copy", tag: "Certified Copy" },
      { name: "Life Certificate for Pension", tag: "Life Certificate" }, { name: "Life Certificate for Retirees", tag: "Life Certificate" },
    ] },
    pricing: { tag: "PRICING", h2: "Notary Services Calculator", subtitle: "The fees are fixed by the Notaries (Service Fees) Regulations, 1978, and are uniform nationwide.", selectService: "Select a service", pages: "Number of pages", signatories: "Number of signatories", documents: "Number of documents", copies: "Number of copies", words: "Number of words in document", wordsFirst: "Up to 100 words", firstPage: "First page", firstStamp: "First signatory", additionalPages: "Additional pages", perSignatory: "Per additional signatory", basePrice: "Base fee", total: "Total before VAT", vat: "VAT (18%)", totalVat: "Total incl. VAT", currency: "ILS", delivery: "", deliveryOptions: [], regulationNote: "A notary may not charge more than the regulated fee; charging less is allowed only in the cases in regulation 1A." },
    track: { h2: "Track Your Order", subtitle: "Enter your case number to check the status.", placeholder: "Case number (e.g. BN-2026-0042)", btn: "Check Status" },
    faq: { tag: "FAQ", h2: "Frequently Asked Questions About Notary Services", items: [
      { q: "How much does signature authentication cost at a notary in Israel?", a: "The fees are fixed by the Notaries (Service Fees) Regulations, 1978, and are uniform nationwide. For 2026: signature authentication, 197 ₪ for the first signer and 77 ₪ for each additional signer; an affidavit, 200 ₪ for the first declarant; a certified copy, 77 ₪ for the first page; plus VAT. A notary may not charge more than the regulated fee; charging less is allowed only in the cases in regulation 1A." },
      { q: "What is a notarial certificate of translation and what does it cost?", a: "A notary certifies that a translation is correct. Under section 15 of the Notaries Law, 1976, the notary may do so only if the notary masters the language of the original and the language of the translation, and personally made the translation or checked it. The 2026 fee (item 3(a)): 251 ₪ for the first 100 words, 197 ₪ per additional 100 words up to 1,000, and 99 ₪ per 100 words above 1,000, plus VAT." },
      { q: "What is an apostille and how is it obtained on a notarial document?", a: "After the notarial certificate, the notary's signature on a document intended for use outside Israel is authenticated, on request, by a magistrates' court registrar or a state employee appointed by the Minister of Justice (section 45(a) of the Notaries Law). That authentication is known as the apostille. Whether it is needed is decided by the body that receives the document in the destination country." },
      { q: "Can a notarial act be done without standing before a notary?", a: "It depends on the act. For signature authentication the law requires that the signatory stood before the notary, was identified and signed in the notary's presence (section 11); for a life certificate, that the person stood before the notary that day and was identified (section 16). Even with an electronic notarial certificate, the person signs before the notary (regulation 19A of the Notaries Regulations, 1977). For a certified copy, the original must be presented to the notary (section 12). For a certificate of translation, section 15 does not require the applicant to stand before the notary." },
      { q: "What is the difference between a notarial power of attorney and a continuing power of attorney?", a: "A general power of attorney and one for a real-estate transaction that requires registration are valid only if a notary prepared it or authenticated the signatures (section 20(a) of the Notaries Law). A continuing power of attorney is signed before a lawyer who completed the required training (section 32יד(א) of the Legal Capacity and Guardianship Law, 1962) and needs no other approval (section 32יג(ט)). It is not a notarial act." },
      { q: "In which languages may a notary certify a translation?", a: "Only in languages the notary personally masters, both the language of the original and that of the translation (section 15 of the Notaries Law). Where the notary does not master one of them, the usual route is a translator's affidavit before a notary on the accuracy of the translation, which the notary certifies as an affidavit (section 7(5))." },
      { q: "Which documents require a notary?", a: "Some examples from the law: a general power of attorney and one for a registrable real-estate transaction (section 20(a) of the Notaries Law; since Amendment No. 12, a power of attorney to a banking corporation for a mortgage transaction is exempt, section 20(a1)); signature authentication and certified copies of a document required for use abroad, which only a notary may do (section 8). A property agreement made before marriage may be certified by a notary (section 2(c1) of the Spousal Property Relations Law, 1973); one made after the marriage needs the approval of the family court or the religious court (section 2(a))." },
    ] },
    blog: { tag: "BLOG", h2: "Notary guides and articles", subtitle: "Professional guides on translation, power of attorney, apostille and more", items: [
      { title: "Notary Pricing 2026 — Updated Ministry of Justice Rates", tag: "Pricing", excerpt: "Updated notary fees for 2026. Full pricing for all notary services.", slug: "notary-pricing-2026" },
      { title: "Notarial Power of Attorney — Complete Guide", tag: "POA", excerpt: "Types, required documents, costs and process for notarial POA.", slug: "notarial-power-of-attorney" },
      { title: "Apostille in Israel — What, When and How", tag: "Apostille", excerpt: "Complete guide: two types, pricing, Hague Convention, step-by-step.", slug: "apostille-israel" },
      { title: "Notarial Translation — Everything You Need to Know", tag: "Translation", excerpt: "What it is, who may certify it under section 15, and the fee.", slug: "notarial-translation" },
      { title: "Signature Authentication — When Required and How", tag: "Signature", excerpt: "When required, process, pricing and documents needed.", slug: "signature-authentication" },
      { title: "Notarial Will — Why It Matters", tag: "Will", excerpt: "Advantages over regular will, pricing, Section 22 Inheritance Law.", slug: "notarial-will" },
      { title: "Notarial Affidavit — When Required and How to Prepare", tag: "Affidavit", excerpt: "When needed, difference from lawyer affidavit, types and pricing.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON", slogan: "BEYOND LAW", desc: "BEITON is a law office. This site explains the notarial acts in Israel: what each act is, what the law requires and what the regulated fee is, with the source for each rule. It does not offer to perform a notarial act, and it is not legal advice." },
    contact: { h2: "Get in Touch", whatsapp: "Message on WhatsApp", email: "Send an Email", phone: "Call us", address: "2 Noach Mozes St., Rishon LeZion", hours: "Sun–Thu, 09:00–18:00" },
    footer: { rights: "All rights reserved", privacy: "Privacy Policy", terms: "Terms of Use", accessibility: "Accessibility" },
    cookie: { text: "This site uses cookies to improve your experience. By continuing, you agree to their use.", accept: "Accept", decline: "Decline" },
  },
  ru: {
    nav: { home: "Главная", services: "Нотариальные действия", usecases: "По документу", pricing: "Тарифы", blog: "Статьи", about: "О нас", contact: "Контакты" },
    hero: { h1: "Нотариальные действия в Израиле: что говорит закон", chatGreeting: "", chatPlaceholder: "", chatSend: "" },
    services: { tag: "NOTARIAL ACTS", h2: "Нотариальные действия по порядку", subtitle: "Что такое каждое действие и чего требует закон, со статьёй для каждого правила", items: [
      { id: "translation", name: "Нотариальный перевод", desc: "Нотариус удостоверяет верность перевода только на языках, которыми он владеет (статья 15).", icon: "translate" },
      { id: "signature", name: "Заверение подписи", desc: "Нотариус удостоверяет подпись, только если подписавший явился к нему, был идентифицирован и подписал в его присутствии (статья 11).", icon: "signature" },
      { id: "affidavit", name: "Аффидевит", desc: "Нотариус вправе принимать и удостоверять аффидевит и иное заявление (статья 7(5)).", icon: "affidavit" },
      { id: "will", name: "Нотариальное завещание", desc: "Завещание перед органом власти по статье 22 Закона о наследовании, где нотариус приравнивается к судье.", icon: "will" },
      { id: "prenup", name: "Брачный договор", desc: "Имущественный договор, заключённый до брака, может удостоверить нотариус. После брака нужно утверждение суда.", icon: "prenup" },
      { id: "poa", name: "Доверенность", desc: "Генеральная доверенность и доверенность на сделку с недвижимостью, подлежащую регистрации, действительны, только если их составил нотариус или он удостоверил подписи (статья 20(א)).", icon: "poa" },
      { id: "certifiedCopy", name: "Заверенная копия", desc: "Нотариус удостоверяет копию только после того, как ему представили оригинал и он их сравнил (статья 12).", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Свидетельство о жизни", desc: "Удостоверение того, что лицо было живо в определённый день, только если оно явилось к нотариусу в тот день и было идентифицировано (статья 16).", icon: "lifeCertificate" },
    ], calcBtn: "Рассчитать" },
    useCases: { tag: "USE CASES", h2: "Статьи по документу", subtitle: "Найдите статью о вашем документе", allFilter: "Все", items: [
      { name: "Перевод свидетельства о рождении", tag: "Перевод" }, { name: "Перевод диплома", tag: "Перевод" }, { name: "Перевод прав", tag: "Перевод" }, { name: "Перевод свидетельства о браке", tag: "Перевод" }, { name: "Перевод свидетельства о разводе", tag: "Перевод" }, { name: "Пакет для Португалии", tag: "Перевод" },
      { name: "Заверение подписи на договоре", tag: "Заверение подписи" }, { name: "Заверение NDA", tag: "Заверение подписи" }, { name: "Согласие на выезд ребёнка", tag: "Заверение подписи" },
      { name: "Генеральная доверенность", tag: "Доверенность" }, { name: "Доверенность на продажу", tag: "Доверенность" }, { name: "Постоянная доверенность", tag: "Доверенность" }, { name: "Доверенность для ипотеки", tag: "Доверенность" },
      { name: "Аффидевит о статусе", tag: "Аффидевит" }, { name: "Аффидевит о проживании", tag: "Аффидевит" }, { name: "Декларация переводчика", tag: "Аффидевит" },
      { name: "Личное завещание", tag: "Завещание" }, { name: "Взаимное завещание (супруги)", tag: "Завещание" },
      { name: "Брачный договор до свадьбы", tag: "Брачный договор" }, { name: "Брачный договор после свадьбы", tag: "Брачный договор" },
      { name: "Заверенная копия паспорта", tag: "Заверенная копия" }, { name: "Заверенная копия диплома", tag: "Заверенная копия" }, { name: "Заверенная копия документов компании", tag: "Заверенная копия" },
      { name: "Свидетельство для пенсии", tag: "Свидетельство о жизни" }, { name: "Свидетельство для пенсионеров", tag: "Свидетельство о жизни" },
    ] },
    pricing: { tag: "PRICING", h2: "Калькулятор нотариальных услуг", subtitle: "Оплата установлена Правилами о нотариусах (оплата услуг) 1978 года и одинакова по всей стране.", selectService: "Выберите услугу", pages: "Страниц", signatories: "Подписантов", documents: "Документов", copies: "Копий", firstPage: "Первая страница", additionalPages: "Доп. страницы", perSignatory: "За подписанта", total: "Итого", currency: "₪", delivery: "", deliveryOptions: [], regulationNote: "Нотариус не вправе взимать больше установленной платы; меньше разрешено только в случаях из правила 1А." },
    track: { h2: "Отслеживание заказа", subtitle: "Введите номер дела.", placeholder: "Номер дела (BN-2026-0042)", btn: "Проверить" },
    faq: { tag: "FAQ", h2: "Часто задаваемые вопросы о нотариальных услугах", items: [
      { q: "Сколько стоит удостоверение подписи у нотариуса в Израиле?", a: "Оплата установлена Правилами о нотариусах (оплата услуг) 1978 года и одинакова по всей стране. На 2026 год: удостоверение подписи, 197 ₪ за первого подписанта и 77 ₪ за каждого следующего; аффидевит, 200 ₪ за первого заявителя; заверенная копия, 77 ₪ за первую страницу; плюс НДС. Нотариус не вправе взимать больше установленной платы; меньше разрешено только в случаях из правила 1А." },
      { q: "Что такое нотариальное удостоверение перевода и сколько оно стоит?", a: "Нотариус удостоверяет, что перевод верен. По статье 15 Закона о нотариусах 1976 года он вправе сделать это, только если владеет языком оригинала и языком перевода и сам выполнил перевод или проверил его. Оплата на 2026 год (пункт 3(א)): 251 ₪ за первые 100 слов, 197 ₪ за каждые следующие 100 слов до 1 000 и 99 ₪ за каждые 100 слов свыше 1 000, плюс НДС." },
      { q: "Что такое апостиль и как его получить на нотариальный документ?", a: "После нотариального акта подпись нотариуса на документе, предназначенном для использования за пределами Израиля, удостоверяется по просьбе регистратором мирового суда или государственным служащим, назначенным министром юстиции (статья 45(א) Закона о нотариусах). Это удостоверение называют апостилем. Нужен ли он, решает организация, которая принимает документ в стране назначения." },
      { q: "Можно ли совершить нотариальное действие, не являясь к нотариусу?", a: "Зависит от действия. Для удостоверения подписи закон требует, чтобы подписавший явился к нотариусу, был идентифицирован и подписал в его присутствии (статья 11); для свидетельства о том, что лицо живо, чтобы лицо явилось к нотариусу в тот же день и было идентифицировано (статья 16). Даже при электронном нотариальном акте человек подписывает перед нотариусом (правило 19א Правил о нотариусах 1977 года). Для заверения копии нотариусу должен быть представлен оригинал (статья 12). Для удостоверения перевода статья 15 не требует, чтобы заявитель явился к нотариусу." },
      { q: "Чем нотариальная доверенность отличается от длящейся доверенности?", a: "Генеральная доверенность и доверенность на сделку с недвижимостью, подлежащую регистрации, действительны, только если их составил нотариус или он удостоверил подписи (статья 20(א) Закона о нотариусах). Длящаяся доверенность подписывается перед адвокатом, прошедшим установленную подготовку (статья 32יד(א) Закона о правоспособности и опеке 1962 года), и не требует иного удостоверения (статья 32יג(ט)). Это не нотариальное действие." },
      { q: "На каких языках нотариус вправе удостоверить перевод?", a: "Только на языках, которыми нотариус сам владеет: и языком оригинала, и языком перевода (статья 15 Закона о нотариусах). Если нотариус не владеет одним из них, обычный путь такой: переводчик подаёт перед нотариусом аффидевит о верности перевода, и нотариус удостоверяет аффидевит (статья 7(5))." },
      { q: "Для каких документов нужен нотариус?", a: "Несколько примеров из закона: генеральная доверенность и доверенность на сделку с недвижимостью, подлежащую регистрации (статья 20(א) Закона о нотариусах; после поправки № 12 доверенность банковской корпорации на ипотечную сделку от этого освобождена, статья 20(א1)); удостоверение подписи и заверение копии документа для использования за границей, которые совершает только нотариус (статья 8). Имущественный договор, заключённый до брака, может удостоверить нотариус (статья 2(ג1) Закона об имущественных отношениях супругов 1973 года); договор, заключённый после брака, требует утверждения суда по семейным делам или религиозного суда (статья 2(א))." },
    ] },
    blog: { tag: "BLOG", h2: "Статьи и руководства по нотариальным услугам", subtitle: "Профессиональные материалы о переводах, доверенностях и апостиле", items: [
      { title: "Тарифы нотариуса 2026", tag: "Тарифы", excerpt: "Актуальные тарифы на все нотариальные услуги.", slug: "notary-pricing-2026" },
      { title: "Нотариальная доверенность — полное руководство", tag: "Доверенность", excerpt: "Виды, документы, стоимость и процесс.", slug: "notarial-power-of-attorney" },
      { title: "Апостиль в Израиле — что, когда и как", tag: "Апостиль", excerpt: "Два вида, тарифы, Гаагская конвенция.", slug: "apostille-israel" },
      { title: "Нотариальный перевод — всё, что нужно знать", tag: "Перевод", excerpt: "Что это такое, кто вправе удостоверить перевод по статье 15, и сколько это стоит.", slug: "notarial-translation" },
      { title: "Заверение подписи — когда требуется", tag: "Подпись", excerpt: "Когда нужно, процесс и стоимость.", slug: "signature-authentication" },
      { title: "Нотариальное завещание — почему это важно", tag: "Завещание", excerpt: "Преимущества, стоимость, закон о наследовании.", slug: "notarial-will" },
      { title: "Нотариальный аффидевит — когда нужен", tag: "Аффидевит", excerpt: "Когда требуется, виды, стоимость.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON", slogan: "BEYOND LAW", desc: "BEITON является адвокатской конторой. Этот сайт объясняет нотариальные действия в Израиле: что представляет собой каждое действие, чего требует закон и какова установленная плата, с источником для каждого правила. Сайт не предлагает совершить нотариальное действие и не является юридической консультацией." },
    contact: { h2: "Связаться", whatsapp: "WhatsApp", email: "Email", phone: "Позвонить", address: "ул. Ноах Мозес 2, Ришон-ле-Цион", hours: "Вс–Чт, 09:00–18:00" },
    footer: { rights: "Все права защищены", privacy: "Конфиденциальность", terms: "Условия", accessibility: "Доступность" },
    cookie: { text: "Сайт использует cookie. Продолжая, вы соглашаетесь.", accept: "Принять", decline: "Отклонить" },
  },
  ar: {
    nav: { home: "الرئيسية", services: "الأعمال التوثيقية", usecases: "حسب المستند", pricing: "الأجور", blog: "مقالات", about: "عن المكتب", contact: "تواصل معنا" },
    hero: { h1: "الأعمال التوثيقية في إسرائيل: ماذا يقول القانون", chatGreeting: "", chatPlaceholder: "", chatSend: "" },
    services: { tag: "NOTARIAL ACTS", h2: "الأعمال التوثيقية واحدًا واحدًا", subtitle: "ما هو كل عمل وما يشترطه القانون، مع البند لكل قاعدة", items: [
      { id: "translation", name: "ترجمة توثيقية", desc: "مصادقة كاتب العدل على صحة ترجمة، فقط في اللغات التي يتقنها (البند 15).", icon: "translate" },
      { id: "signature", name: "توثيق التوقيع", desc: "يصادق كاتب العدل على توقيع فقط إذا مثل الموقّع أمامه وتم التحقق من هويته ووقّع بحضوره (البند 11).", icon: "signature" },
      { id: "affidavit", name: "إفادة خطية", desc: "كاتب العدل مخوّل بتلقّي إفادة مشفوعة بالقسم وتصريح آخر والمصادقة عليهما (البند 7(5)).", icon: "affidavit" },
      { id: "will", name: "وصية توثيقية", desc: "وصية أمام سلطة وفق البند 22 من قانون الإرث، حيث حكم كاتب العدل كحكم القاضي.", icon: "will" },
      { id: "prenup", name: "اتفاقية مالية", desc: "يجوز لكاتب العدل المصادقة على اتفاقية مالية أُبرمت قبل الزواج. بعد الزواج تلزم مصادقة المحكمة.", icon: "prenup" },
      { id: "poa", name: "توكيل رسمي", desc: "التوكيل العام والتوكيل لصفقة عقارية تتطلب التسجيل ساريان فقط إذا حرّرهما كاتب عدل أو صادق على التواقيع (البند 20(أ)).", icon: "poa" },
      { id: "certifiedCopy", name: "نسخة مصدّقة", desc: "يصادق كاتب العدل على نسخة فقط بعد أن يُعرض عليه الأصل ويقارن بينهما (البند 12).", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "شهادة حياة", desc: "مصادقة على أن شخصًا كان حيًا في يوم معين، فقط إذا مثل أمام كاتب العدل في ذلك اليوم وتم التحقق من هويته (البند 16).", icon: "lifeCertificate" },
    ], calcBtn: "احسب السعر" },
    useCases: { tag: "USE CASES", h2: "مقالات حسب المستند", subtitle: "ابحث عن المقال الخاص بمستندك", allFilter: "الكل", items: [
      { name: "ترجمة شهادة ميلاد", tag: "ترجمة موثقة" }, { name: "ترجمة شهادة جامعية", tag: "ترجمة موثقة" }, { name: "ترجمة رخصة قيادة", tag: "ترجمة موثقة" }, { name: "ترجمة عقد زواج", tag: "ترجمة موثقة" }, { name: "ترجمة وثيقة طلاق", tag: "ترجمة موثقة" }, { name: "حزمة جنسية برتغالية", tag: "ترجمة موثقة" },
      { name: "توثيق توقيع على عقد", tag: "توثيق التوقيع" }, { name: "توثيق NDA", tag: "توثيق التوقيع" }, { name: "موافقة سفر قاصر", tag: "توثيق التوقيع" },
      { name: "توكيل عام", tag: "توكيل رسمي" }, { name: "توكيل لبيع عقار", tag: "توكيل رسمي" }, { name: "توكيل مستمر", tag: "توكيل رسمي" }, { name: "توكيل للرهن العقاري", tag: "توكيل رسمي" },
      { name: "إفادة عدم زواج", tag: "إفادة خطية" }, { name: "إفادة سكن", tag: "إفادة خطية" }, { name: "إفادة مترجم", tag: "إفادة خطية" },
      { name: "وصية شخصية", tag: "وصية توثيقية" }, { name: "وصية متبادلة (زوجين)", tag: "وصية توثيقية" },
      { name: "اتفاقية مالية قبل الزواج", tag: "اتفاقية مالية" }, { name: "اتفاقية مالية بعد الزواج", tag: "اتفاقية مالية" },
      { name: "نسخة مصدّقة لجواز سفر", tag: "نسخة مصدّقة" }, { name: "نسخة مصدّقة لشهادة جامعية", tag: "نسخة مصدّقة" }, { name: "نسخة مصدّقة لمستندات شركة", tag: "نسخة مصدّقة" },
      { name: "شهادة حياة للتقاعد", tag: "شهادة حياة" }, { name: "شهادة حياة للمتقاعدين", tag: "شهادة حياة" },
    ] },
    pricing: { tag: "PRICING", h2: "حاسبة خدمات كاتب العدل", subtitle: "الأجور محددة في أنظمة كتّاب العدل (أجور الخدمات) لسنة 1978، وهي موحّدة في كل البلاد.", selectService: "اختر/ي خدمة", pages: "عدد الصفحات", signatories: "عدد الموقعين", documents: "عدد المستندات", copies: "عدد النسخ", firstPage: "الصفحة الأولى", additionalPages: "صفحات إضافية", perSignatory: "لكل موقّع إضافي", total: "المجموع", currency: "₪", delivery: "", deliveryOptions: [], regulationNote: "لا يجوز لكاتب العدل أن يتقاضى أكثر من الأجر المحدد؛ والأقل مسموح فقط في الحالات الواردة في النظام 1أ." },
    track: { h2: "تتبع الطلب", subtitle: "أدخل/ي رقم الملف.", placeholder: "رقم الملف (BN-2026-0042)", btn: "تحقق" },
    faq: { tag: "FAQ", h2: "أسئلة شائعة حول خدمات كاتب العدل", items: [
      { q: "كم تكلف المصادقة على التوقيع لدى كاتب العدل في إسرائيل؟", a: "الأجور محددة في أنظمة كتّاب العدل (أجور الخدمات) لسنة 1978، وهي موحّدة في كل البلاد. لعام 2026: المصادقة على التوقيع 197 ₪ للموقّع الأول و77 ₪ لكل موقّع إضافي؛ الإفادة المشفوعة بالقسم 200 ₪ للمُفيد الأول؛ النسخة المصدّقة 77 ₪ للصفحة الأولى؛ مضافًا إليها ضريبة القيمة المضافة. لا يجوز لكاتب العدل أن يتقاضى أكثر من الأجر المحدد؛ والأقل مسموح فقط في الحالات الواردة في النظام 1أ." },
      { q: "ما هي المصادقة التوثيقية على الترجمة وكم تكلف؟", a: "يصادق كاتب العدل على أن الترجمة صحيحة. وفق البند 15 من قانون كتّاب العدل لسنة 1976، يجوز له ذلك فقط إذا كان يتقن لغة الأصل ولغة الترجمة، وكان هو نفسه قد أعدّ الترجمة أو تحقق منها. الأجر لعام 2026 (البند 3(أ)): 251 ₪ لأول 100 كلمة، 197 ₪ لكل 100 كلمة إضافية حتى 1,000، و99 ₪ لكل 100 كلمة فوق 1,000، مضافًا إليها ضريبة القيمة المضافة." },
      { q: "ما هو الأبوستيل وكيف يُحصل عليه لمستند توثيقي؟", a: "بعد المصادقة التوثيقية، يُصادَق على توقيع كاتب العدل على مستند معدّ للاستعمال خارج إسرائيل، بناءً على طلب، من قِبل مسجّل محكمة صلح أو موظف دولة عيّنه وزير العدل (البند 45(أ) من قانون كتّاب العدل). تُعرف هذه المصادقة بالأبوستيل. وتحدد الجهة التي تستقبل المستند في دولة الوجهة إن كانت مطلوبة." },
      { q: "هل يمكن إنجاز عمل توثيقي دون المثول أمام كاتب عدل؟", a: "يتوقف ذلك على العمل. في المصادقة على التوقيع يشترط القانون أن يمثل الموقّع أمام كاتب العدل وأن يتم التحقق من هويته وأن يوقّع بحضوره (البند 11)؛ وفي شهادة الحياة، أن يمثل الشخص أمامه في اليوم نفسه وأن يتم التحقق من هويته (البند 16). وحتى في المصادقة التوثيقية الإلكترونية يوقّع الشخص أمام كاتب العدل (النظام 19أ من أنظمة كتّاب العدل لسنة 1977). وفي النسخة المصدّقة يجب أن يُعرض الأصل على كاتب العدل (البند 12). أما في المصادقة على الترجمة، فلا يشترط البند 15 أن يمثل مقدّم الطلب أمام كاتب العدل." },
      { q: "ما الفرق بين التوكيل التوثيقي والتوكيل المستمر؟", a: "التوكيل العام والتوكيل لصفقة عقارية تتطلب التسجيل ساريان فقط إذا حرّرهما كاتب عدل أو صادق على التواقيع (البند 20(أ) من قانون كتّاب العدل). أما التوكيل المستمر فيوقَّع أمام محامٍ اجتاز التأهيل المطلوب (البند 32יד(א) من قانون الأهلية القانونية والوصاية لسنة 1962)، ولا يحتاج إلى أي مصادقة أخرى (البند 32יג(ט)). وهو ليس عملًا توثيقيًا." },
      { q: "بأي لغات يجوز لكاتب العدل المصادقة على ترجمة؟", a: "فقط باللغات التي يتقنها كاتب العدل نفسه: لغة الأصل ولغة الترجمة (البند 15 من قانون كتّاب العدل). إذا لم يكن يتقن إحداهما، فالطريق المتبع عادة هو أن يقدّم المترجم أمام كاتب العدل إفادة مشفوعة بالقسم بصحة الترجمة، ويصادق كاتب العدل على الإفادة (البند 7(5))." },
      { q: "أي مستندات تتطلب كاتب عدل؟", a: "أمثلة من القانون: التوكيل العام والتوكيل لصفقة عقارية تتطلب التسجيل (البند 20(أ) من قانون كتّاب العدل؛ ومنذ التعديل رقم 12 يُعفى من ذلك التوكيل لمؤسسة مصرفية لصفقة رهن عقاري، البند 20(أ1))؛ المصادقة على التوقيع والنسخة المصدّقة لمستند مطلوب للاستعمال في الخارج، ولا يُنجزان إلا على يد كاتب عدل (البند 8). ويجوز لكاتب العدل المصادقة على اتفاقية مالية أُبرمت قبل الزواج (البند 2(ج1) من قانون العلاقات المالية بين الزوجين لسنة 1973)؛ أما الاتفاقية بعد الزواج فتتطلب مصادقة محكمة شؤون العائلة أو المحكمة الدينية (البند 2(أ))." },
    ] },
    blog: { tag: "BLOG", h2: "مقالات وأدلة حول كاتب العدل", subtitle: "مقالات متخصصة حول الترجمة والتوكيلات والأبوستيل", items: [
      { title: "تعرفة كاتب العدل 2026", tag: "تعرفة", excerpt: "جميع الأسعار المحدثة لخدمات كاتب العدل.", slug: "notary-pricing-2026" },
      { title: "التوكيل الرسمي — الدليل الكامل", tag: "توكيل", excerpt: "الأنواع والمستندات والتكاليف.", slug: "notarial-power-of-attorney" },
      { title: "أبوستيل في إسرائيل — ما هو وكيف؟", tag: "أبوستيل", excerpt: "نوعان، التعرفة، اتفاقية لاهاي.", slug: "apostille-israel" },
      { title: "الترجمة التوثيقية — كل ما تحتاج معرفته", tag: "ترجمة", excerpt: "ما هي، ومن يحق له المصادقة عليها وفق البند 15، وما الأجر.", slug: "notarial-translation" },
      { title: "توثيق التوقيع — متى مطلوب وكيف؟", tag: "توثيق", excerpt: "متى يُطلب، العملية والتكلفة.", slug: "signature-authentication" },
      { title: "الوصية التوثيقية — لماذا مهمة؟", tag: "وصية", excerpt: "المزايا، التكلفة، قانون الميراث.", slug: "notarial-will" },
      { title: "الإفادة الخطية التوثيقية — متى تحتاجها؟", tag: "إفادة", excerpt: "متى مطلوبة، الأنواع والتكلفة.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON", slogan: "BEYOND LAW", desc: "BEITON مكتب محاماة. يشرح هذا الموقع الأعمال التوثيقية في إسرائيل: ما هو كل عمل، وما يشترطه القانون، وما الأجر المحدد في الأنظمة، مع المصدر لكل قاعدة. وهو لا يعرض تنفيذ عمل توثيقي، وليس استشارة قانونية." },
    contact: { h2: "تواصل معنا", whatsapp: "واتساب", email: "بريد إلكتروني", phone: "اتصل بنا", address: "شارع نوح موزس 2، ראשון לציון", hours: "الأحد–الخميس، 09:00–18:00" },
    footer: { rights: "جميع الحقوق محفوظة", privacy: "الخصوصية", terms: "الشروط", accessibility: "إمكانية الوصول" },
    cookie: { text: "يستخدم الموقع ملفات تعريف الارتباط. بالاستمرار توافق/ين.", accept: "موافق/ة", decline: "رفض" },
  },
  fr: {
    nav: { home: "Accueil", services: "Actes notariés", usecases: "Par document", pricing: "Tarifs", blog: "Guides", about: "À propos", contact: "Contact" },
    hero: { h1: "Les actes notariés en Israël : ce que dit la loi", chatGreeting: "", chatPlaceholder: "", chatSend: "" },
    services: { tag: "NOTARIAL ACTS", h2: "Les actes notariés, un par un", subtitle: "Ce qu'est chaque acte et ce que la loi exige, avec l'article pour chaque règle", items: [
      { id: "translation", name: "Traduction Notariale", desc: "Certificat du notaire attestant qu'une traduction est exacte, seulement dans les langues qu'il maîtrise (article 15).", icon: "translate" },
      { id: "signature", name: "Authentification de Signature", desc: "Le notaire n'authentifie une signature que si le signataire s'est présenté devant lui, a été identifié et a signé en sa présence (article 11).", icon: "signature" },
      { id: "affidavit", name: "Affidavit Notarial", desc: "Le notaire est habilité à recevoir et certifier une déclaration sous serment ou une autre déclaration (article 7(5)).", icon: "affidavit" },
      { id: "will", name: "Testament Notarial", desc: "Un testament devant une autorité selon l'article 22 de la loi sur les successions, où le notaire est assimilé à un juge.", icon: "will" },
      { id: "prenup", name: "Contrat de Mariage", desc: "Un contrat de biens conclu avant le mariage peut être certifié par un notaire. Après le mariage, il faut l'approbation d'un tribunal.", icon: "prenup" },
      { id: "poa", name: "Procuration Notariale", desc: "La procuration générale et la procuration pour une transaction immobilière soumise à inscription ne sont valables que si un notaire l'a rédigée ou a authentifié les signatures (article 20(a)).", icon: "poa" },
      { id: "certifiedCopy", name: "Copie Certifiee Conforme", desc: "Le notaire ne certifie une copie qu'après présentation et comparaison de l'original (article 12).", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Certificat de Vie", desc: "Certificat qu'une personne était en vie un jour donné, seulement si elle s'est présentée devant le notaire ce jour-là et a été identifiée (article 16).", icon: "lifeCertificate" },
    ], calcBtn: "Calculer" },
    useCases: { tag: "USE CASES", h2: "Guides par document", subtitle: "Trouvez le guide de votre document", allFilter: "Tout", items: [
      { name: "Traduction acte de naissance", tag: "Traduction" }, { name: "Traduction diplome", tag: "Traduction" }, { name: "Traduction permis de conduire", tag: "Traduction" }, { name: "Traduction acte de mariage", tag: "Traduction" }, { name: "Traduction acte de divorce", tag: "Traduction" }, { name: "Citoyennete portugaise", tag: "Traduction" },
      { name: "Signature sur contrat", tag: "Authentification de Signature" }, { name: "Signature NDA", tag: "Authentification de Signature" }, { name: "Voyage mineur", tag: "Authentification de Signature" },
      { name: "Procuration generale", tag: "Procuration" }, { name: "Procuration immobiliere", tag: "Procuration" }, { name: "Procuration permanente", tag: "Procuration" }, { name: "Procuration hypothecaire", tag: "Procuration" },
      { name: "Attestation de celibat", tag: "Affidavit" }, { name: "Attestation de residence", tag: "Affidavit" }, { name: "Declaration de traducteur", tag: "Affidavit" },
      { name: "Testament personnel", tag: "Testament" }, { name: "Testament mutuel (epoux)", tag: "Testament" },
      { name: "Contrat prenuptial", tag: "Contrat de Mariage" }, { name: "Contrat postnuptial", tag: "Contrat de Mariage" },
      { name: "Copie certifiee passeport", tag: "Copie Certifiee" }, { name: "Copie certifiee diplome", tag: "Copie Certifiee" }, { name: "Copie certifiee documents", tag: "Copie Certifiee" },
      { name: "Certificat de vie retraite", tag: "Certificat de Vie" }, { name: "Certificat de vie retraites", tag: "Certificat de Vie" },
    ] },
    pricing: { tag: "PRICING", h2: "Calculateur notarial", subtitle: "Les honoraires sont fixés par le règlement sur les notaires (honoraires), 1978, et sont uniformes dans tout le pays.", selectService: "Choisissez", pages: "Pages", signatories: "Signataires", documents: "Documents", copies: "Copies", firstPage: "Premiere page", additionalPages: "Pages supp.", perSignatory: "Par signataire", total: "Total", currency: "ILS", delivery: "", deliveryOptions: [], regulationNote: "Un notaire ne peut pas facturer plus que le tarif réglementé ; facturer moins n'est permis que dans les cas du règlement 1A." },
    track: { h2: "Suivi de commande", subtitle: "Entrez votre numero de dossier.", placeholder: "Numero (BN-2026-0042)", btn: "Verifier" },
    faq: { tag: "FAQ", h2: "Questions frequentes sur les services notariaux", items: [
      { q: "Combien coûte l'authentification d'une signature chez un notaire en Israël ?", a: "Les honoraires sont fixés par le règlement sur les notaires (honoraires), 1978, et sont uniformes dans tout le pays. Pour 2026 : authentification de signature, 197 ₪ pour le premier signataire et 77 ₪ par signataire supplémentaire ; déclaration sous serment, 200 ₪ pour le premier déclarant ; copie certifiée, 77 ₪ pour la première page ; TVA en sus. Un notaire ne peut pas facturer plus que le tarif réglementé ; facturer moins n'est permis que dans les cas du règlement 1A." },
      { q: "Qu'est-ce que la certification notariale d'une traduction et combien coûte-t-elle ?", a: "Le notaire certifie qu'une traduction est exacte. Selon l'article 15 de la loi sur les notaires de 1976, il ne peut le faire que s'il maîtrise la langue de l'original et celle de la traduction, et s'il a lui-même fait la traduction ou l'a vérifiée. Honoraires 2026 (point 3(a)) : 251 ₪ pour les 100 premiers mots, 197 ₪ par tranche de 100 mots supplémentaires jusqu'à 1 000, et 99 ₪ par tranche de 100 mots au-delà de 1 000, TVA en sus." },
      { q: "Qu'est-ce que l'apostille et comment l'obtenir sur un document notarié ?", a: "Après le certificat notarié, la signature du notaire sur un document destiné à être utilisé hors d'Israël est authentifiée, sur demande, par un greffier d'un tribunal de première instance (magistrates' court) ou un fonctionnaire désigné par le ministre de la Justice (article 45(a) de la loi sur les notaires). Cette authentification est appelée apostille. C'est l'organisme qui reçoit le document dans le pays de destination qui décide si elle est nécessaire." },
      { q: "Peut-on accomplir un acte notarié sans se présenter devant un notaire ?", a: "Cela dépend de l'acte. Pour l'authentification d'une signature, la loi exige que le signataire se soit présenté devant le notaire, ait été identifié et ait signé en sa présence (article 11) ; pour un certificat de vie, que la personne se soit présentée devant lui le jour même et ait été identifiée (article 16). Même avec un certificat notarié électronique, la personne signe devant le notaire (règlement 19A du règlement sur les notaires de 1977). Pour une copie certifiée, l'original doit être présenté au notaire (article 12). Pour la certification d'une traduction, l'article 15 n'exige pas que le demandeur se présente devant le notaire." },
      { q: "Quelle différence entre une procuration notariée et une procuration permanente ?", a: "La procuration générale et la procuration pour une transaction immobilière soumise à inscription ne sont valables que si un notaire l'a rédigée ou a authentifié les signatures (article 20(a) de la loi sur les notaires). La procuration permanente est signée devant un avocat ayant suivi la formation requise (article 32יד(א) de la loi sur la capacité juridique et la tutelle de 1962) et ne nécessite aucune autre approbation (article 32יג(ט)). Ce n'est pas un acte notarié." },
      { q: "Dans quelles langues un notaire peut-il certifier une traduction ?", a: "Uniquement dans les langues que le notaire maîtrise lui-même, celle de l'original et celle de la traduction (article 15 de la loi sur les notaires). S'il n'en maîtrise pas une, la voie habituelle est une déclaration sous serment du traducteur devant un notaire sur l'exactitude de la traduction, que le notaire certifie en tant que déclaration (article 7(5))." },
      { q: "Quels documents nécessitent un notaire ?", a: "Quelques exemples tirés de la loi : la procuration générale et la procuration pour une transaction immobilière soumise à inscription (article 20(a) de la loi sur les notaires ; depuis l'amendement n° 12, la procuration donnée à une banque pour une opération hypothécaire en est dispensée, article 20(a1)) ; l'authentification de signature et la copie certifiée d'un document destiné à l'étranger, réservées au notaire (article 8). Un contrat de biens conclu avant le mariage peut être certifié par un notaire (article 2(c1) de la loi sur les relations patrimoniales entre époux de 1973) ; un contrat conclu après le mariage doit être approuvé par le tribunal aux affaires familiales ou le tribunal religieux (article 2(a))." },
    ] },
    blog: { tag: "BLOG", h2: "Guides et articles notariaux", subtitle: "Articles professionnels sur la traduction, procurations et apostille", items: [
      { title: "Tarifs notariaux 2026", tag: "Tarifs", excerpt: "Tous les tarifs notariaux actualises.", slug: "notary-pricing-2026" },
      { title: "Procuration notariale — guide complet", tag: "Procuration", excerpt: "Types, documents, couts et processus.", slug: "notarial-power-of-attorney" },
      { title: "Apostille en Israel", tag: "Apostille", excerpt: "Deux types, tarifs, Convention de La Haye.", slug: "apostille-israel" },
      { title: "Traduction notariee", tag: "Traduction", excerpt: "Ce que c'est, qui peut la certifier selon l'article 15, et les honoraires.", slug: "notarial-translation" },
      { title: "Authentification de signature", tag: "Signature", excerpt: "Quand requise, processus et cout.", slug: "signature-authentication" },
      { title: "Testament notarie", tag: "Testament", excerpt: "Avantages, cout, loi sur la succession.", slug: "notarial-will" },
      { title: "Affidavit notarie", tag: "Affidavit", excerpt: "Quand necessaire, types et cout.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON", slogan: "BEYOND LAW", desc: "BEITON est un cabinet d'avocats. Ce site explique les actes notariés en Israël : ce qu'est chaque acte, ce que la loi exige et quels sont les honoraires réglementés, avec la source de chaque règle. Il ne propose pas d'accomplir un acte notarié et ne constitue pas un conseil juridique." },
    contact: { h2: "Nous contacter", whatsapp: "WhatsApp", email: "Email", phone: "Appelez-nous", address: "2 rue Noach Mozes, Rishon LeZion", hours: "Dim–Jeu, 09h00–18h00" },
    footer: { rights: "Tous droits reserves", privacy: "Confidentialite", terms: "Conditions", accessibility: "Accessibilite" },
    cookie: { text: "Ce site utilise des cookies. En continuant, vous acceptez.", accept: "Accepter", decline: "Refuser" },
  },
  es: {
    nav: { home: "Inicio", services: "Actos notariales", usecases: "Por documento", pricing: "Aranceles", blog: "Guías", about: "Acerca de", contact: "Contacto" },
    hero: { h1: "Los actos notariales en Israel: lo que dice la ley", chatGreeting: "", chatPlaceholder: "", chatSend: "" },
    services: { tag: "NOTARIAL ACTS", h2: "Los actos notariales, uno por uno", subtitle: "Qué es cada acto y qué exige la ley, con el artículo de cada regla", items: [
      { id: "translation", name: "Traduccion Notarial", desc: "Certificado del notario de que una traducción es correcta, solo en los idiomas que domina (artículo 15).", icon: "translate" },
      { id: "signature", name: "Autenticacion de Firma", desc: "El notario autentica una firma solo si el firmante compareció ante él, fue identificado y firmó en su presencia (artículo 11).", icon: "signature" },
      { id: "affidavit", name: "Declaracion Jurada", desc: "El notario está facultado para recibir y certificar una declaración jurada u otra declaración (artículo 7(5)).", icon: "affidavit" },
      { id: "will", name: "Testamento Notarial", desc: "Un testamento ante autoridad según el artículo 22 de la Ley de Sucesiones, donde el notario se equipara a un juez.", icon: "will" },
      { id: "prenup", name: "Acuerdo Prenupcial", desc: "Un acuerdo patrimonial celebrado antes del matrimonio puede certificarlo un notario. Después del matrimonio, requiere aprobación judicial.", icon: "prenup" },
      { id: "poa", name: "Poder Notarial", desc: "El poder general y el poder para una transacción inmobiliaria inscribible solo son válidos si un notario lo redactó o autenticó las firmas (artículo 20(a)).", icon: "poa" },
      { id: "certifiedCopy", name: "Copia Certificada", desc: "El notario certifica una copia solo después de que se le presentó el original y los comparó (artículo 12).", icon: "certifiedCopy" },
      { id: "lifeCertificate", name: "Certificado de Vida", desc: "Certificado de que una persona estaba viva en un día determinado, solo si compareció ante el notario ese día y fue identificada (artículo 16).", icon: "lifeCertificate" },
    ], calcBtn: "Calcular" },
    useCases: { tag: "USE CASES", h2: "Guías por documento", subtitle: "Encuentre la guía de su documento", allFilter: "Todo", items: [
      { name: "Traduccion partida de nacimiento", tag: "Traduccion" }, { name: "Traduccion diploma", tag: "Traduccion" }, { name: "Traduccion licencia de conducir", tag: "Traduccion" }, { name: "Traduccion acta de matrimonio", tag: "Traduccion" }, { name: "Traduccion acta de divorcio", tag: "Traduccion" }, { name: "Ciudadania portuguesa", tag: "Traduccion" },
      { name: "Firma en contrato", tag: "Autenticacion de Firma" }, { name: "Firma NDA", tag: "Autenticacion de Firma" }, { name: "Viaje de menor", tag: "Autenticacion de Firma" },
      { name: "Poder general", tag: "Poder Notarial" }, { name: "Poder para venta", tag: "Poder Notarial" }, { name: "Poder permanente", tag: "Poder Notarial" }, { name: "Poder hipotecario", tag: "Poder Notarial" },
      { name: "Declaracion de solteria", tag: "Declaracion Jurada" }, { name: "Declaracion de residencia", tag: "Declaracion Jurada" }, { name: "Declaracion de traductor", tag: "Declaracion Jurada" },
      { name: "Testamento personal", tag: "Testamento" }, { name: "Testamento mutuo (conyuges)", tag: "Testamento" },
      { name: "Acuerdo prenupcial", tag: "Acuerdo Prenupcial" }, { name: "Acuerdo postnupcial", tag: "Acuerdo Prenupcial" },
      { name: "Copia certificada pasaporte", tag: "Copia Certificada" }, { name: "Copia certificada diploma", tag: "Copia Certificada" }, { name: "Copia certificada documentos", tag: "Copia Certificada" },
      { name: "Certificado de vida pension", tag: "Certificado de Vida" }, { name: "Certificado de vida jubilados", tag: "Certificado de Vida" },
    ] },
    pricing: { tag: "PRICING", h2: "Calculadora notarial", subtitle: "Los aranceles están fijados en el Reglamento de Notarios (Aranceles), 1978, y son uniformes en todo el país.", selectService: "Selecciona", pages: "Paginas", signatories: "Firmantes", documents: "Documentos", copies: "Copias", firstPage: "Primera pagina", additionalPages: "Paginas adic.", perSignatory: "Por firmante", total: "Total", currency: "ILS", delivery: "", deliveryOptions: [], regulationNote: "Un notario no puede cobrar más que el arancel; cobrar menos solo se permite en los casos del reglamento 1A." },
    track: { h2: "Seguimiento", subtitle: "Ingresa tu numero de expediente.", placeholder: "Expediente (BN-2026-0042)", btn: "Verificar" },
    faq: { tag: "FAQ", h2: "Preguntas frecuentes sobre servicios notariales", items: [
      { q: "¿Cuánto cuesta autenticar una firma ante notario en Israel?", a: "Los aranceles están fijados en el Reglamento de Notarios (Aranceles), 1978, y son uniformes en todo el país. Para 2026: autenticación de firma, 197 ₪ por el primer firmante y 77 ₪ por cada firmante adicional; declaración jurada, 200 ₪ por el primer declarante; copia certificada, 77 ₪ por la primera página; más IVA. Un notario no puede cobrar más que el arancel; cobrar menos solo se permite en los casos del reglamento 1A." },
      { q: "¿Qué es la certificación notarial de una traducción y cuánto cuesta?", a: "El notario certifica que una traducción es correcta. Según el artículo 15 de la Ley de Notarios de 1976, solo puede hacerlo si domina el idioma del original y el de la traducción, y si él mismo hizo la traducción o la verificó. Arancel 2026 (punto 3(a)): 251 ₪ por las primeras 100 palabras, 197 ₪ por cada 100 palabras adicionales hasta 1.000, y 99 ₪ por cada 100 palabras por encima de 1.000, más IVA." },
      { q: "¿Qué es la apostilla y cómo se obtiene en un documento notarial?", a: "Después del certificado notarial, la firma del notario en un documento destinado a usarse fuera de Israel se autentica, a solicitud, por un secretario de un tribunal de primera instancia (magistrates' court) o un funcionario designado por el ministro de Justicia (artículo 45(a) de la Ley de Notarios). Esa autenticación se conoce como apostilla. Si es necesaria, lo decide el organismo que recibe el documento en el país de destino." },
      { q: "¿Se puede realizar un acto notarial sin comparecer ante un notario?", a: "Depende del acto. Para autenticar una firma, la ley exige que el firmante haya comparecido ante el notario, haya sido identificado y haya firmado en su presencia (artículo 11); para un certificado de vida, que la persona haya comparecido ese mismo día y haya sido identificada (artículo 16). Incluso con un certificado notarial electrónico, la persona firma ante el notario (reglamento 19A del Reglamento de Notarios de 1977). Para una copia certificada, el original debe presentarse al notario (artículo 12). Para certificar una traducción, el artículo 15 no exige que el solicitante comparezca ante el notario." },
      { q: "¿Qué diferencia hay entre un poder notarial y un poder duradero?", a: "El poder general y el poder para una transacción inmobiliaria inscribible solo son válidos si un notario lo redactó o autenticó las firmas (artículo 20(a) de la Ley de Notarios). El poder duradero se firma ante un abogado que completó la formación exigida (artículo 32יד(א) de la Ley de Capacidad Jurídica y Tutela de 1962) y no requiere ninguna otra aprobación (artículo 32יג(ט)). No es un acto notarial." },
      { q: "¿En qué idiomas puede un notario certificar una traducción?", a: "Solo en los idiomas que el propio notario domina, el del original y el de la traducción (artículo 15 de la Ley de Notarios). Si no domina uno de ellos, la vía habitual es una declaración jurada del traductor ante notario sobre la exactitud de la traducción, que el notario certifica como declaración (artículo 7(5))." },
      { q: "¿Qué documentos requieren un notario?", a: "Algunos ejemplos de la ley: el poder general y el poder para una transacción inmobiliaria inscribible (artículo 20(a) de la Ley de Notarios; desde la enmienda n.º 12, el poder otorgado a un banco para una operación hipotecaria está exento, artículo 20(a1)); la autenticación de firma y la copia certificada de un documento para uso en el extranjero, reservadas al notario (artículo 8). Un acuerdo patrimonial celebrado antes del matrimonio puede certificarlo un notario (artículo 2(c1) de la Ley de Relaciones Patrimoniales entre Cónyuges de 1973); uno celebrado después del matrimonio requiere la aprobación del tribunal de familia o del tribunal religioso (artículo 2(a))." },
    ] },
    blog: { tag: "BLOG", h2: "Guias y articulos notariales", subtitle: "Articulos profesionales sobre traduccion, poderes y apostilla", items: [
      { title: "Tarifas notariales 2026", tag: "Tarifas", excerpt: "Todas las tarifas notariales actualizadas.", slug: "notary-pricing-2026" },
      { title: "Poder notarial — guia completa", tag: "Poder", excerpt: "Tipos, documentos, costos y proceso.", slug: "notarial-power-of-attorney" },
      { title: "Apostilla en Israel", tag: "Apostilla", excerpt: "Dos tipos, tarifas, Convenio de La Haya.", slug: "apostille-israel" },
      { title: "Traduccion notarial", tag: "Traduccion", excerpt: "Qué es, quién puede certificarla según el artículo 15, y el arancel.", slug: "notarial-translation" },
      { title: "Autenticacion de firma", tag: "Firma", excerpt: "Cuando se requiere, proceso y costo.", slug: "signature-authentication" },
      { title: "Testamento notarial", tag: "Testamento", excerpt: "Ventajas, costo, ley de herencia.", slug: "notarial-will" },
      { title: "Declaracion jurada notarial", tag: "Declaracion", excerpt: "Cuando necesaria, tipos y costo.", slug: "notarial-affidavit" },
    ] },
    about: { tag: "ABOUT", h2: "BEITON", slogan: "BEYOND LAW", desc: "BEITON es un despacho de abogados. Este sitio explica los actos notariales en Israel: qué es cada acto, qué exige la ley y cuál es el arancel fijado, con la fuente de cada regla. No ofrece realizar un acto notarial y no constituye asesoramiento jurídico." },
    contact: { h2: "Contacto", whatsapp: "WhatsApp", email: "Email", phone: "Llamar", address: "Calle Noach Mozes 2, Rishon LeZion", hours: "Dom–Jue, 09:00–18:00" },
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
  const [foreignLang, setForeignLang] = useState(false);
  const [faq, setFaq] = useState<number | null>(null);
  const [ucF, setUcF] = useState("all");
  const [cookie, setCookie] = useState(false); // start hidden, show after checking localStorage
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

  // Cookie consent — show banner only if user hasn't decided yet
  // (consent defaults are already set in layout.tsx based on localStorage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("beiton_consent");
      if (!saved) setCookie(true); // no decision yet — show banner
      // if saved is "granted" or "denied", banner stays hidden
    } catch { setCookie(true); }
  }, []);

  const t = T[lang]; const cfg = LANGS[lang]; const rtl = cfg.dir === "rtl";
  const svc = selSvc ? PRICING_CONFIG[selSvc] : null;

  const calc = () => {
    if (!svc) return null;
    const lines: { label: string; amount: number }[] = [];
    let total = 0;
    const c = t.pricing.currency;
    const lblPer100to1000 = lang === "he" ? "לכל 100 מילים נוספות (עד 1,000)" : "Per 100 additional words (up to 1,000)";
    const lblPer100above = lang === "he" ? "לכל 100 מילים נוספות (מעל 1,000)" : "Per 100 additional words (over 1,000)";
    const lblForeignLang = lang === "he" ? "אישור בשפה לועזית שאינה ערבית או אנגלית (פרט 12)" : "Certificate in a foreign language other than Arabic or English (item 12)";
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
      // Policy: never offer the +50% "notary translates" option in the calculator.
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
    inpCenter: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E8E6E1", fontSize: 13, fontFamily: cfg.font, background: "#FAFAF8", direction: "ltr" as const, textAlign: "center" as const, flex: 1 },
    btn: { width: 40, minWidth: 40, height: 40, borderRadius: 8, border: "1px solid #E8E6E1", background: "#FAFAF8", fontSize: 18, fontWeight: 500, color: "#1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1, userSelect: "none" as const },
    selWrap: { position: "relative" as const, marginBottom: 18 },
    chev: { position: "absolute" as const, insetInlineEnd: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" as const, color: "#666", fontSize: 11, lineHeight: 1 },
    numWrap: { display: "flex", alignItems: "stretch", gap: 8, marginBottom: 18 },
  };

  // Stepper component for clearer +/− on numeric inputs
  const stepper = (value: number, set: (n: number) => void, min: number, max: number, step: number) => (
    <div style={S.numWrap}>
      <button type="button" aria-label={lang === "he" ? "הפחתה" : "Decrease"} onClick={() => set(Math.max(min, value - step))} style={S.btn}>−</button>
      <input type="number" min={min} max={max} value={value} onChange={e => set(Math.max(min, Math.min(max, +e.target.value || min)))} style={S.inpCenter} />
      <button type="button" aria-label={lang === "he" ? "הוספה" : "Increase"} onClick={() => set(Math.min(max, value + step))} style={S.btn}>+</button>
    </div>
  );

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
            <BrandLogo size={16} />
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
        <p className="fu" style={{ fontSize: 11, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: "#999", marginBottom: 14 }}>BEITON</p>
        <h1 className="fu fd1" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 300, lineHeight: 1.15, marginBottom: 28 }}>{t.hero.h1}</h1>
        <div className="la" style={{ height: 1, background: "#1A1A1A", margin: "0 auto 28px" }} />
        <div className="fu fd2" style={{ maxWidth: 600, margin: "0 auto" }}>
          <HeroWhatsApp lang={lang as "he" | "en" | "ru" | "ar" | "fr" | "es"} />
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
            <div style={S.selWrap}>
              <select
                value={selSvc}
                onChange={e => { const v = e.target.value; setSelSvc(v); setPages(1); setSigs(1); setDocs(1); setCopies(1); setWords(100); setForeignLang(false); if (v) trackServiceExplored(v); }}
                style={{ ...S.inp, marginBottom: 0, paddingInlineEnd: 36, appearance: "none", WebkitAppearance: "none", MozAppearance: "none", direction: cfg.dir as "rtl" | "ltr", textAlign: cfg.dir === "rtl" ? "right" : "left", cursor: "pointer" } as React.CSSProperties}
              >
                <option value="">—</option>
                {Object.entries(PRICING_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label[lang]}</option>)}
              </select>
              <span style={S.chev} aria-hidden="true">▼</span>
            </div>
            {svc?.fields?.includes("words") && <>
              <label style={S.lbl}>{t.pricing.words || "מילים"}</label>
              {stepper(words, setWords, 1, 50000, 50)}
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B6B6B", marginBottom: 18, cursor: "pointer" }}>
                <input type="checkbox" checked={foreignLang} onChange={e => setForeignLang(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1A1A1A" }} />
                {lang === "he" ? "האישור הנוטריוני בשפה לועזית שאינה ערבית או אנגלית (פרט 12, +104 ₪)" : "Notarial certificate in a foreign language other than Arabic or English (item 12, +104 ₪)"}
              </label>
            </>}
            {svc?.fields?.includes("pages") && <><label style={S.lbl}>{t.pricing.pages}</label>{stepper(pages, setPages, 1, 50, 1)}</>}
            {svc?.fields?.includes("signatories") && <><label style={S.lbl}>{t.pricing.signatories}</label>{stepper(sigs, setSigs, 1, 10, 1)}</>}
            {svc?.fields?.includes("documents") && <><label style={S.lbl}>{t.pricing.documents}</label>{stepper(docs, setDocs, 1, 20, 1)}</>}
            {svc?.fields?.includes("copies") && <><label style={S.lbl}>{t.pricing.copies}</label>{stepper(copies, setCopies, 1, 10, 1)}</>}

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

      {/* TRACK ORDER: רק כשמסלולי ההזמנה פעילים. הכפתור לא היה מחובר לשום דבר */}
      {ORDER_FLOWS_ENABLED && <section id="track" style={{ padding: "64px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ ...S.h2, marginBottom: 8 }}>{t.track.h2}</h2>
        <p style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B", marginBottom: 24 }}>{t.track.subtitle}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={trackN} onChange={e => setTrackN(e.target.value)} placeholder={t.track.placeholder} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #E8E6E1", fontSize: 12, fontFamily: cfg.font, background: "#FAFAF8", direction: "ltr" }} />
          <button className="cb" style={{ background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 500, fontFamily: cfg.font, transition: "background .2s", whiteSpace: "nowrap" }}>{t.track.btn}</button>
        </div>
      </section>}

      {/* FAQ */}
      <section style={{ background: "#FAFAF8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={S.tag}>{t.faq.tag}</p>
          <h2 style={{ ...S.h2, marginBottom: 32 }}>{t.faq.h2}</h2>
          {t.faq.items.map((item: any, i: number) => (
            <details key={i} className="fq" open={faq===i} onToggle={e => { const o = (e.currentTarget as HTMLDetailsElement).open; if (o) setFaq(i); else if (faq===i) setFaq(null); }} style={{ borderBottom: "1px solid #E8E6E1", padding: "16px 2px", transition: "background .15s", borderRadius: 3 }}>
              <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, cursor: "pointer", listStyle: "none" }}>
                <span style={{ fontSize: 13, fontWeight: 400 }}>{item.q}</span>
                <span style={{ width: 16, height: 16, flexShrink: 0, transform: faq===i?"rotate(180deg)":"none", transition: "transform .3s", color: "#999" }}>{I.chevron}</span>
              </summary>
              <p style={{ fontSize: 12, fontWeight: 300, color: "#6B6B6B", marginTop: 8, lineHeight: 1.7 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BLOG — Carousel with filter chips */}
      <section id="blog" style={{ padding: "64px 24px 32px" }}>
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
              <button onClick={() => blogScrollRef.current?.scrollBy({ left: rtl ? 296 : -296, behavior: "smooth" })} aria-label="Previous" style={{ position: "absolute", [rtl ? "right" : "left"]: -8, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "1px solid #E8E6E1", background: "rgba(255,255,255,.95)", boxShadow: "0 2px 8px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1A1A1A" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, transform: rtl ? "rotate(180deg)" : "none" }}><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={() => blogScrollRef.current?.scrollBy({ left: rtl ? -296 : 296, behavior: "smooth" })} aria-label="Next" style={{ position: "absolute", [rtl ? "left" : "right"]: -8, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", border: "1px solid #E8E6E1", background: "rgba(255,255,255,.95)", boxShadow: "0 2px 8px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1A1A1A" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, transform: rtl ? "rotate(180deg)" : "none" }}><path d="M9 18l6-6-6-6"/></svg>
              </button>
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
      <section id="about" style={{ padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <p style={S.tag}>{t.about.tag}</p>
          <h2 style={{ margin: "6px 0 24px" }}><BrandLogo slogan size="clamp(32px,5vw,44px)" /></h2>
          <p style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B", lineHeight: 1.9 }}>{t.about.desc}</p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: "#FAFAF8", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ ...S.h2, marginBottom: 24 }}>{t.contact.h2}</h2>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://wa.me/97233817776" target="_blank" rel="noopener noreferrer" onClick={() => trackContactClick("whatsapp")} className="cb" style={{ background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 500, fontFamily: cfg.font, textDecoration: "none", transition: "background .2s" }}>{t.contact.whatsapp}</a>
          <a href="mailto:office@beiton.co" target="_blank" rel="noopener noreferrer" onClick={() => trackContactClick("email")} className="ob" style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontFamily: cfg.font, textDecoration: "none", transition: "all .2s" }}>{t.contact.email}</a>
          <a href="tel:+97233817776" onClick={() => trackContactClick("phone")} className="ob" style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontFamily: cfg.font, textDecoration: "none", direction: "ltr", transition: "all .2s" }}>03-3817776</a>
        </div>
        <div style={{ marginTop: 20, fontSize: 12, color: "#6B6B6B", lineHeight: 1.9 }}>
          <p style={{ margin: 0 }}>
            <a href="https://maps.google.com/?q=נח+מוזס+2+ראשון+לציון" target="_blank" rel="noopener noreferrer" style={{ color: "#6B6B6B", textDecoration: "none", borderBottom: "1px dotted #B8B8B8" }}>{t.contact.address}</a>
          </p>
          <p style={{ margin: "4px 0 0" }}>office@beiton.co</p>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter lang={lang} />

      {/* COOKIE CONSENT — overlay + banner */}
      {cookie && <>
        {/* Dim overlay */}
        <div style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,.4)", backdropFilter: "blur(2px)" }} />
        {/* Banner */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "#fff", borderTop: "1px solid #E8E6E1", padding: "20px 24px", boxShadow: "0 -4px 24px rgba(0,0,0,.12)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontSize: 12, color: "#6B6B6B", flex: 1, minWidth: 200, lineHeight: 1.6 }}>{t.cookie.text}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { updateConsent(true); try { localStorage.setItem("beiton_consent", "granted"); } catch {} setCookie(false); }} className="cb" style={{ background: "#2C2C2A", color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontSize: 12, fontWeight: 500, fontFamily: cfg.font, transition: "background .2s", cursor: "pointer" }}>{t.cookie.accept}</button>
              <button onClick={() => { updateConsent(false); try { localStorage.setItem("beiton_consent", "denied"); } catch {} setCookie(false); }} style={{ background: "transparent", color: "#6B6B6B", border: "1px solid #E8E6E1", borderRadius: 6, padding: "9px 18px", fontSize: 12, fontFamily: cfg.font, cursor: "pointer" }}>{t.cookie.decline}</button>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
}

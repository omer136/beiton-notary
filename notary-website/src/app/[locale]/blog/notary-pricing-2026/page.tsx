import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים | BEITON & Co",
  description:
    "תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים (שכר שירותים), תשל\"ט-1978. מחירון מלא לאימות חתימה, תרגום, צוואה, הסכם ממון ועוד.",
};

/* ═══ Translations ═══ */

interface T {
  dir: "rtl" | "ltr";
  font: string;
  back: string;
  breadHome: string;
  breadBlog: string;
  breadCurrent: string;
  tag: string;
  title: string;
  meta: string;
  intro: string;
  whoSetsTitle: string;
  whoSetsBody: string;
  tariffsTitle: string;
  rows: { service: string; price: string }[];
  vatNote: string;
  whenTitle: string;
  whenItems: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaBody: string;
  ctaContact: string;
  ctaWhatsapp: string;
  ctaBack: string;
  footerRights: string;
  schemaHeadline: string;
  schemaDesc: string;
  schemaFaq: { q: string; a: string }[];
}

const t: Record<string, T> = {
  he: {
    dir: "rtl",
    font: "'Noto Sans Hebrew', 'DM Sans', sans-serif",
    back: "חזרה לעמוד הראשי",
    breadHome: "ראשי",
    breadBlog: "בלוג",
    breadCurrent: "מחירון נוטריון 2026",
    tag: "מחירון",
    title: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים",
    meta: "BEITON & Co | 30 במרץ 2026",
    intro: 'תעריפי הנוטריון בישראל נקבעים מדי שנה על ידי משרד המשפטים, והם אחידים לכל הנוטריונים ברחבי הארץ ללא יוצא מן הכלל. המחירים מתעדכנים בתחילת כל שנה בהתאם למדד המחירים לצרכן, ואף נוטריון אינו רשאי לגבות מחיר גבוה או נמוך מהתעריף שנקבע בתקנות.',
    whoSetsTitle: "מי קובע את מחירי הנוטריון?",
    whoSetsBody: 'שכר שירותי הנוטריון מוסדר בתקנות הנוטריונים (שכר שירותים), תשל"ט-1978. התעריפים נקבעים על ידי מדינת ישראל באמצעות משרד המשפטים. נוטריון שגובה שכר שונה מהמחיר הקבוע מבצע עבירת משמעת שעלולה להוביל לשלילת רישיונו. המשמעות עבורכם: המחיר שתשלמו יהיה זהה בכל מקום בארץ, אז כדאי לבחור נוטריון לפי מקצועיות, זמינות ונוחות — לא לפי מחיר.',
    tariffsTitle: "תעריפי נוטריון מעודכנים לשנת 2026",
    rows: [
      { service: "אימות חתימה", price: "197 ₪ לחותם ראשון, 77 ₪ לכל חותם נוסף" },
      { service: "ייפוי כוח נוטריוני", price: "197 ₪ לחותם ראשון + 77 ₪ לכל עותק נוסף" },
      { service: "תרגום נוטריוני", price: "251 ₪ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, 99 ₪ מעבר ל-1,000" },
      { service: "אישור העתק", price: "77 ₪ לעמוד ראשון, 13 ₪ לכל עמוד נוסף" },
      { service: "הסכם ממון", price: "446 ₪, 74 ₪ לכל עותק נוסף" },
      { service: "צוואה נוטריונית", price: "293 ₪ לחותם ראשון, 147 ₪ לכל חותם נוסף" },
      { service: "אישור חיים", price: "197 ₪" },
      { service: "תצהיר נוטריוני", price: "200 ₪ למצהיר ראשון, 80 ₪ לכל מצהיר נוסף" },
    ],
    vatNote: 'כל המחירים הנ"ל הם לפני מע"מ (18%). על כל סכום יש להוסיף מע"מ כחוק.',
    whenTitle: "מתי צריכים שירותי נוטריון?",
    whenItems: ["חתימה על ייפוי כוח למשכנתא בבנק", 'אימות מסמכים לצורך שימוש בחו"ל (אפוסטיל)', "תרגום נוטריוני של תעודות (לידה, נישואין, תואר)", "חתימה על הסכם ממון לפני נישואין", "עריכת צוואה נוטריונית", 'אישור חיים לצורך קבלת קצבה מחו"ל'],
    faqTitle: "שאלות נפוצות",
    faq: [
      { q: "כמה עולה אימות חתימה אצל נוטריון?", a: '197 ₪ + מע"מ לחותם ראשון, 77 ₪ + מע"מ לכל חותם נוסף. המחיר קבוע בתקנות.' },
      { q: "כמה עולה תרגום נוטריוני?", a: '251 ₪ + מע"מ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ מעבר ל-1,000.' },
      { q: "האם המחיר זהה אצל כל נוטריון?", a: "כן. התעריפים נקבעים בתקנות הנוטריונים ומחייבים את כל הנוטריונים בישראל." },
    ],
    ctaTitle: "איך BEITON & Co עוזרים?",
    ctaBody: "ב-BEITON & Co אנחנו מציעים את כל שירותי הנוטריון לפי התעריף הרשמי, עם יתרונות ייחודיים: זמינות גבוהה — שירות גם בהתראה קצרה. שירות בשפות רבות — עברית, אנגלית, ערבית. הזמנת תור אונליין — בלי להתקשר. מחשבון מחירים — לדעת בדיוק כמה תשלמו לפני שמגיעים. תהליך דיגיטלי — העלאת מסמכים מראש לחיסכון בזמן.",
    ctaContact: "לתיאום פגישה או שאלות — צרו קשר עכשיו",
    ctaWhatsapp: "פנייה בוואטסאפ",
    ctaBack: "חזרה לעמוד הראשי",
    footerRights: "כל הזכויות שמורות",
    schemaHeadline: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים",
    schemaDesc: 'תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים (שכר שירותים), תשל"ט-1978.',
    schemaFaq: [
      { q: "כמה עולה אימות חתימה אצל נוטריון?", a: '197 ₪ + מע"מ לחותם ראשון, 77 ₪ + מע"מ לכל חותם נוסף. המחיר קבוע בתקנות.' },
      { q: "כמה עולה תרגום נוטריוני?", a: '251 ₪ + מע"מ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ מעבר ל-1,000.' },
      { q: "האם המחיר זהה אצל כל נוטריון?", a: "כן. התעריפים נקבעים בתקנות הנוטריונים ומחייבים את כל הנוטריונים בישראל." },
    ],
  },
  en: {
    dir: "ltr",
    font: "'DM Sans', sans-serif",
    back: "Back to homepage",
    breadHome: "Home",
    breadBlog: "Blog",
    breadCurrent: "Notary Fees 2026",
    tag: "Pricing",
    title: "Notary Fees in Israel 2026 — Official Ministry of Justice Tariffs",
    meta: "BEITON & Co | March 30, 2026",
    intro: "Notary tariffs in Israel are set annually by the Ministry of Justice and are uniform for all notaries across the country. Fees are updated each January according to the Consumer Price Index, and no notary may charge more or less than the regulated tariff.",
    whoSetsTitle: "Who sets notary fees?",
    whoSetsBody: "Notary service fees are regulated by the Notaries Regulations (Service Fees), 1978 (תקנות הנוטריונים). The tariffs are set by the State of Israel through the Ministry of Justice. A notary who charges a different fee commits a disciplinary offense that may lead to license revocation. This means the price you pay will be identical everywhere, so choose a notary based on professionalism, availability, and convenience — not price.",
    tariffsTitle: "Updated Notary Tariffs for 2026",
    rows: [
      { service: "Signature Authentication", price: "197 ₪ first signer, 77 ₪ each additional" },
      { service: "Power of Attorney", price: "197 ₪ first signer + 77 ₪ per additional copy" },
      { service: "Certified Translation", price: "251 ₪ up to 100 words, 197 ₪ per 100 words up to 1,000, 99 ₪ over 1,000" },
      { service: "Certified Copy", price: "77 ₪ first page, 13 ₪ each additional page" },
      { service: "Prenuptial Agreement", price: "446 ₪, 74 ₪ per additional copy" },
      { service: "Notarial Will", price: "293 ₪ first signer, 147 ₪ each additional" },
      { service: "Life Certificate", price: "197 ₪" },
      { service: "Notarial Affidavit", price: "200 ₪ first declarant, 80 ₪ each additional" },
    ],
    vatNote: "All prices above are before VAT (18%). VAT must be added to every amount as required by law.",
    whenTitle: "When do you need notary services?",
    whenItems: ["Signing a power of attorney for a bank mortgage", "Authenticating documents for use abroad (apostille)", "Notarial translation of certificates (birth, marriage, degree)", "Signing a prenuptial agreement", "Preparing a notarial will", "Life certificate for receiving a pension from abroad"],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "How much does signature authentication cost?", a: "197 ₪ + VAT for the first signer, 77 ₪ + VAT for each additional signer. The fee is fixed by regulations." },
      { q: "How much does a notarial translation cost?", a: "251 ₪ + VAT for the first 100 words, 197 ₪ per additional 100 words up to 1,000, and 99 ₪ beyond 1,000." },
      { q: "Is the price the same at every notary?", a: "Yes. Tariffs are set by the Notaries Regulations and are binding for all notaries in Israel." },
    ],
    ctaTitle: "How can BEITON & Co help?",
    ctaBody: "At BEITON & Co we offer all notary services at the official tariff, with unique advantages: high availability — service on short notice. Multilingual — Hebrew, English, Arabic. Online booking — no need to call. Price calculator — know exactly how much you'll pay. Digital process — upload documents in advance to save time.",
    ctaContact: "Schedule a meeting or ask questions — contact us now",
    ctaWhatsapp: "Contact via WhatsApp",
    ctaBack: "Back to homepage",
    footerRights: "All rights reserved",
    schemaHeadline: "Notary Fees in Israel 2026 — Official Ministry of Justice Tariffs",
    schemaDesc: "Updated notary fees in Israel for 2026 per Notaries Regulations (Service Fees), 1978.",
    schemaFaq: [
      { q: "How much does signature authentication cost?", a: "197 ₪ + VAT for the first signer, 77 ₪ + VAT for each additional. Fixed by regulations." },
      { q: "How much does a notarial translation cost?", a: "251 ₪ + VAT up to 100 words, 197 ₪ per 100 additional words up to 1,000, 99 ₪ over 1,000." },
      { q: "Is the price the same at every notary?", a: "Yes. Tariffs are set by the Notaries Regulations and binding for all notaries in Israel." },
    ],
  },
  ru: {
    dir: "ltr",
    font: "'DM Sans', sans-serif",
    back: "На главную",
    breadHome: "Главная",
    breadBlog: "Блог",
    breadCurrent: "Тарифы нотариуса 2026",
    tag: "Прайс-лист",
    title: "Стоимость услуг нотариуса в Израиле 2026 — официальные тарифы",
    meta: "BEITON & Co | 30 марта 2026",
    intro: "Тарифы нотариуса в Израиле устанавливаются ежегодно Министерством юстиции и едины для всех нотариусов страны. Цены обновляются каждый январь в соответствии с индексом потребительских цен, и ни один нотариус не вправе взимать больше или меньше установленного тарифа.",
    whoSetsTitle: "Кто устанавливает тарифы нотариуса?",
    whoSetsBody: "Оплата нотариальных услуг регулируется Правилами о нотариусах (оплата услуг), 1978 (תקנות הנוטריונים). Тарифы устанавливаются государством через Министерство юстиции. Нотариус, взимающий иную плату, совершает дисциплинарное нарушение. Это значит, что цена будет одинаковой везде — выбирайте нотариуса по качеству сервиса, а не по цене.",
    tariffsTitle: "Актуальные тарифы нотариуса на 2026 год",
    rows: [
      { service: "Заверение подписи", price: "197 ₪ первый подписант, 77 ₪ каждый дополнительный" },
      { service: "Доверенность", price: "197 ₪ первый подписант + 77 ₪ за доп. копию" },
      { service: "Заверение перевода", price: "251 ₪ до 100 слов, 197 ₪ за каждые 100 слов до 1 000, 99 ₪ свыше 1 000" },
      { service: "Заверенная копия", price: "77 ₪ первая страница, 13 ₪ каждая дополнительная" },
      { service: "Брачный договор", price: "446 ₪, 74 ₪ за доп. копию" },
      { service: "Завещание", price: "293 ₪ первый подписант, 147 ₪ каждый дополнительный" },
      { service: "Свидетельство о жизни", price: "197 ₪" },
      { service: "Аффидавит", price: "200 ₪ первый заявитель, 80 ₪ каждый дополнительный" },
    ],
    vatNote: "Все цены указаны без НДС (18%). НДС добавляется к каждой сумме по закону.",
    whenTitle: "Когда нужны услуги нотариуса?",
    whenItems: ["Подписание доверенности для ипотеки в банке", "Заверение документов для использования за рубежом (апостиль)", "Нотариальный перевод свидетельств (рождение, брак, диплом)", "Подписание брачного договора", "Составление нотариального завещания", "Свидетельство о жизни для пенсии из-за рубежа"],
    faqTitle: "Часто задаваемые вопросы",
    faq: [
      { q: "Сколько стоит заверение подписи?", a: "197 ₪ + НДС за первого подписанта, 77 ₪ + НДС за каждого дополнительного. Тариф установлен правилами." },
      { q: "Сколько стоит нотариальный перевод?", a: "251 ₪ + НДС до 100 слов, 197 ₪ за каждые 100 дополнительных слов до 1 000, 99 ₪ свыше 1 000." },
      { q: "Одинакова ли цена у всех нотариусов?", a: "Да. Тарифы установлены Правилами о нотариусах и обязательны для всех нотариусов Израиля." },
    ],
    ctaTitle: "Как BEITON & Co может помочь?",
    ctaBody: "В BEITON & Co мы предлагаем все нотариальные услуги по официальному тарифу с уникальными преимуществами: высокая доступность, многоязычный сервис, онлайн-запись, калькулятор цен и цифровой процесс.",
    ctaContact: "Запись или вопросы — свяжитесь с нами",
    ctaWhatsapp: "Написать в WhatsApp",
    ctaBack: "На главную",
    footerRights: "Все права защищены",
    schemaHeadline: "Стоимость услуг нотариуса в Израиле 2026",
    schemaDesc: "Актуальные тарифы нотариуса в Израиле на 2026 год.",
    schemaFaq: [
      { q: "Сколько стоит заверение подписи?", a: "197 ₪ + НДС за первого подписанта, 77 ₪ за каждого дополнительного." },
      { q: "Сколько стоит нотариальный перевод?", a: "251 ₪ + НДС до 100 слов, 197 ₪ за 100 дополнительных до 1 000, 99 ₪ свыше." },
      { q: "Цена одинакова у всех нотариусов?", a: "Да. Тариф един по всему Израилю." },
    ],
  },
  ar: {
    dir: "rtl",
    font: "'Noto Sans Arabic', 'DM Sans', sans-serif",
    back: "العودة للصفحة الرئيسية",
    breadHome: "الرئيسية",
    breadBlog: "المدونة",
    breadCurrent: "رسوم كاتب العدل 2026",
    tag: "التعرفات",
    title: "رسوم كاتب العدل في إسرائيل 2026 — التعرفة الرسمية",
    meta: "BEITON & Co | 30 مارس 2026",
    intro: "تُحدد رسوم كاتب العدل في إسرائيل سنوياً من قبل وزارة العدل وهي موحدة لجميع كتّاب العدل في البلاد. تُحدّث الأسعار في يناير من كل عام وفقاً لمؤشر أسعار المستهلك، ولا يجوز لأي كاتب عدل فرض رسوم أعلى أو أقل من التعرفة المحددة.",
    whoSetsTitle: "من يحدد رسوم كاتب العدل؟",
    whoSetsBody: "أجور خدمات كاتب العدل منظمة بموجب أنظمة كاتب العدل (أجور الخدمات)، 1978 (תקנות הנוטריונים). التعرفات تُحدد من قبل الدولة عبر وزارة العدل. كاتب العدل الذي يفرض رسوماً مختلفة يرتكب مخالفة تأديبية قد تؤدي لسحب ترخيصه. هذا يعني أن السعر سيكون متطابقاً في كل مكان.",
    tariffsTitle: "تعرفات كاتب العدل المحدّثة لعام 2026",
    rows: [
      { service: "توثيق التوقيع", price: "197 ₪ الموقّع الأول، 77 ₪ لكل موقّع إضافي" },
      { service: "توكيل رسمي", price: "197 ₪ الموقّع الأول + 77 ₪ لكل نسخة إضافية" },
      { service: "ترجمة موثقة", price: "251 ₪ حتى 100 كلمة، 197 ₪ لكل 100 كلمة حتى 1,000، 99 ₪ فوق 1,000" },
      { service: "نسخة مصدّقة", price: "77 ₪ الصفحة الأولى، 13 ₪ لكل صفحة إضافية" },
      { service: "اتفاقية مالية", price: "446 ₪، 74 ₪ لكل نسخة إضافية" },
      { service: "وصية توثيقية", price: "293 ₪ الموقّع الأول، 147 ₪ لكل موقّع إضافي" },
      { service: "شهادة حياة", price: "197 ₪" },
      { service: "إفادة خطية", price: "200 ₪ المُقرّ الأول، 80 ₪ لكل مُقرّ إضافي" },
    ],
    vatNote: "جميع الأسعار قبل ضريبة القيمة المضافة (18%). يجب إضافة ض.ق.م لكل مبلغ.",
    whenTitle: "متى تحتاجون خدمات كاتب العدل؟",
    whenItems: ["توقيع توكيل لرهن عقاري في البنك", "توثيق مستندات للاستخدام في الخارج (أبوستيل)", "ترجمة توثيقية لشهادات (ميلاد، زواج، شهادة جامعية)", "توقيع اتفاقية مالية قبل الزواج", "إعداد وصية توثيقية", "شهادة حياة لتلقي معاش من الخارج"],
    faqTitle: "أسئلة شائعة",
    faq: [
      { q: "كم يكلف توثيق التوقيع؟", a: "197 ₪ + ض.ق.م للموقّع الأول، 77 ₪ + ض.ق.م لكل موقّع إضافي. السعر محدد بالأنظمة." },
      { q: "كم تكلفة الترجمة التوثيقية؟", a: "251 ₪ + ض.ق.م حتى 100 كلمة، 197 ₪ لكل 100 كلمة إضافية حتى 1,000، و-99 ₪ فوق 1,000." },
      { q: "هل السعر متطابق عند جميع كتّاب العدل؟", a: "نعم. التعرفات محددة بالأنظمة وملزمة لجميع كتّاب العدل في إسرائيل." },
    ],
    ctaTitle: "كيف يساعدكم BEITON & Co؟",
    ctaBody: "في BEITON & Co نقدم جميع خدمات كاتب العدل بالتعرفة الرسمية مع مزايا فريدة: توفر عالٍ، خدمة بعدة لغات، حجز أونلاين، حاسبة أسعار وعملية رقمية.",
    ctaContact: "لتحديد موعد أو استفسار — تواصلوا معنا الآن",
    ctaWhatsapp: "تواصل عبر واتساب",
    ctaBack: "العودة للصفحة الرئيسية",
    footerRights: "جميع الحقوق محفوظة",
    schemaHeadline: "رسوم كاتب العدل في إسرائيل 2026",
    schemaDesc: "رسوم كاتب العدل المحدّثة لعام 2026 وفقاً للأنظمة.",
    schemaFaq: [
      { q: "كم يكلف توثيق التوقيع؟", a: "197 ₪ + ض.ق.م للموقّع الأول، 77 ₪ لكل إضافي." },
      { q: "كم تكلفة الترجمة التوثيقية؟", a: "251 ₪ + ض.ق.م حتى 100 كلمة، 197 ₪ لكل 100 إضافية حتى 1,000، 99 ₪ فوق." },
      { q: "هل السعر متطابق عند الجميع؟", a: "نعم. التعرفة موحدة في كل إسرائيل." },
    ],
  },
};

// FR and ES fall back to EN
const getT = (locale: string): T => t[locale] || t.en;

/* ═══ Component ═══ */

export default async function NotaryPricing2026Article({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = getT(locale);

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.schemaHeadline,
            inLanguage: locale,
            datePublished: "2026-03-30",
            dateModified: "2026-03-31",
            author: { "@type": "Organization", name: "BEITON & Co", url: "https://notary.beiton.co" },
            publisher: { "@type": "Organization", name: "BEITON & Co", url: "https://notary.beiton.co", logo: { "@type": "ImageObject", url: "https://notary.beiton.co/logo.png" } },
            description: c.schemaDesc,
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://notary.beiton.co/${locale}/blog/notary-pricing-2026` },
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: c.schemaFaq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div
        dir={c.dir}
        style={{
          fontFamily: c.font,
          color: "#1A1A1A",
          background: "#fff",
          minHeight: "100vh",
          lineHeight: 1.8,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <SiteHeader lang={locale} />

        {/* Article */}
        <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
          {/* Breadcrumb */}
          <p style={{ fontSize: 11, color: "#999", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "#999", textDecoration: "none" }}>{c.breadHome}</Link>
            {" / "}
            <Link href={`/${locale}#blog`} style={{ color: "#999", textDecoration: "none" }}>{c.breadBlog}</Link>
            {" / "}
            <span style={{ color: "#1A1A1A" }}>{c.breadCurrent}</span>
          </p>

          {/* Tag */}
          <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>{c.tag}</p>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>{c.title}</h1>

          {/* Meta */}
          <p style={{ fontSize: 12, color: "#999", marginBottom: 32 }}>{c.meta}</p>

          {/* Divider */}
          <div style={{ width: 50, height: 1, background: "#1A1A1A", marginBottom: 32 }} />

          {/* Intro */}
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>{c.intro}</p>

          {/* Who sets */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.whoSetsTitle}</h2>
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>{c.whoSetsBody}</p>

          {/* Tariffs */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.tariffsTitle}</h2>

          {/* Pricing Table */}
          <div style={{ background: "#FAFAF8", borderRadius: 12, border: "1px solid #E8E6E1", padding: 24, marginBottom: 28 }}>
            {c.rows.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "12px 0", borderBottom: i < c.rows.length - 1 ? "1px solid #E8E6E1" : "none" }}>
                <span style={{ fontSize: 14, fontWeight: 500, flexShrink: 0 }}>{row.service}</span>
                <span style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B", textAlign: c.dir === "rtl" ? "left" : "right" }}>{row.price}</span>
              </div>
            ))}
            <p style={{ fontSize: 11, color: "#999", fontStyle: "italic", marginTop: 16 }}>{c.vatNote}</p>
          </div>

          {/* When needed */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.whenTitle}</h2>
          <ul style={{ fontSize: 15, fontWeight: 300, marginBottom: 28, paddingInlineStart: 20 }}>
            {c.whenItems.map((item, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{item}</li>
            ))}
          </ul>

          {/* FAQ */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 16, marginTop: 40 }}>{c.faqTitle}</h2>
          <div style={{ marginBottom: 32 }}>
            {c.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid #E8E6E1", padding: "14px 0" }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{item.q}</p>
                <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B" }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.ctaTitle}</h2>
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>{c.ctaBody}</p>

          <div style={{ background: "#FAFAF8", borderRadius: 12, border: "1px solid #E8E6E1", padding: "28px 24px", textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 15, fontWeight: 400, marginBottom: 16 }}>{c.ctaContact}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://wa.me/97233817776" target="_blank" rel="noopener noreferrer" style={{ background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "background .2s" }}>{c.ctaWhatsapp}</a>
              <Link href={`/${locale}`} style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, textDecoration: "none", transition: "all .2s" }}>{c.ctaBack}</Link>
            </div>
          </div>
        </article>

        <SiteFooter lang={locale} />
      </div>
    </>
  );
}

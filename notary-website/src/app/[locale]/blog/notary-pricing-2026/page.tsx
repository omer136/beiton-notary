import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ORDER_FLOWS_ENABLED } from "@/lib/site-mode";
import { GENERAL_CONTACT } from "@/data/legal-basis";

const BASE = "https://notary.beiton.co";
// בצרפתית ובספרדית העמוד מציג את הטקסט האנגלי: noindex ובלי hreflang אליו, עד שיתורגם
const TRANSLATED = ["he", "en", "ru", "ar"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = getT(locale);
  const translated = TRANSLATED.includes(locale);
  return {
    title: `${c.title} | BEITON`,
    description: c.schemaDesc,
    robots: translated ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${BASE}/${locale}/blog/notary-pricing-2026`,
      languages: translated
        ? { ...Object.fromEntries(TRANSLATED.map((l) => [l, `${BASE}/${l}/blog/notary-pricing-2026`])), "x-default": `${BASE}/he/blog/notary-pricing-2026` }
        : undefined,
    },
  };
}

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
    meta: "BEITON | 30.3.2026, עודכן 25.11.2026",
    intro: "שכר הנוטריון בישראל קבוע בתקנות הנוטריונים (שכר שירותים), תשל\"ט-1978, ואחיד בכל הארץ. הסכומים משתנים ב-1 בינואר של כל שנה לפי מדד המחירים לצרכן (תקנה 4). נוטריון אינו רשאי לגבות יותר מהשכר שבתקנות; פחות מזה מותר רק במקרים שהדין קובע (תקנה 1א, וסעיף 34(5) לחוק הנוטריונים, תשל\"ו-1976).",
    whoSetsTitle: "מי קובע את מחירי הנוטריון?",
    whoSetsBody: "תקנה 1 קובעת: \"בעד שירות מהשירותים המפורטים להלן בטור א׳ יגבה נוטריון שכר בשיעור הנקוב בטור ב׳ לצד אותו שירות, בצירוף סכום השווה למס הערך המוסף שהנוטריון חייב בו בעד מתן השירות\". לפי סעיף 34(5) לחוק הנוטריונים, נוטריון אשם בעבירת משמעת אם \"גבה או דרש בעד שירותיו שכר שהוא למעלה מן הקבוע מכוחו של חוק זה, או גבה או דרש, ללא טעם מספיק, שכר שהוא למטה מן הקבוע\". תקנה 1א(א) קובעת ש\"נוטריון רשאי שלא לגבות שכר, כולו או חלקו\" בשלושה מקרים: מבקש שירות חסר אמצעים; עולה חדש או תושב חוזר שהמציא אישור ממשרד העלייה והקליטה; ושירות שהתבקש עקב טעות של הנוטריון. (הנוסח בוויקיטקסט, נקרא ב-25.11.2026.)",
    tariffsTitle: "תעריפי נוטריון מעודכנים לשנת 2026",
    rows: [
      { service: "אימות חתימה", price: "197 ₪ לחותם ראשון, 77 ₪ לכל חותם נוסף" },
      { service: "ייפוי כוח נוטריוני (אימות חתימה, פרט 1)", price: "197 ₪ לחותם ראשון, 77 ₪ לכל חותם נוסף ולכל העתק שאומת באותו מעמד" },
      { service: "תרגום נוטריוני", price: "251 ₪ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, 99 ₪ מעבר ל-1,000" },
      { service: "אישור העתק", price: "77 ₪ לעמוד ראשון, 13 ₪ לכל עמוד נוסף" },
      { service: "אימות הסכם ממון שנכרת לפני הנישואין (פרט 11)", price: "446 ₪, 74 ₪ לכל אימות נוסף באותו מעמד" },
      { service: "צוואה נוטריונית", price: "293 ₪ לחותם ראשון, 147 ₪ לכל חותם נוסף" },
      { service: "אישור חיים", price: "197 ₪" },
      { service: "תצהיר נוטריוני", price: "200 ₪ למצהיר ראשון, 80 ₪ לכל מצהיר נוסף" },
    ],
    vatNote: 'כל המחירים הנ"ל הם לפני מע"מ (18%). על כל סכום יש להוסיף מע"מ כחוק.',
    whenTitle: "מתי נדרשת פעולה נוטריונית?",
    whenItems: ["ייפוי כוח כללי וייפוי כוח לעסקה במקרקעין שטעונה רישום (סעיף 20(א) לחוק הנוטריונים)", 'מסמך לשימוש בחו"ל: אישור נוטריוני, ואחריו האימות לפי סעיף 45 לחוק (אפוסטיל), כשהגורם המקבל דורש', "תרגום נוטריוני של תעודות (לידה, נישואין, תואר)", "חתימה על הסכם ממון לפני נישואין", "עריכת צוואה נוטריונית", 'אישור חיים לצורך קבלת קצבה מחו"ל'],
    faqTitle: "שאלות נפוצות",
    faq: [
      { q: "כמה עולה אימות חתימה אצל נוטריון?", a: '197 ₪ + מע"מ לחותם ראשון, 77 ₪ + מע"מ לכל חותם נוסף. המחיר קבוע בתקנות.' },
      { q: "כמה עולה תרגום נוטריוני?", a: '251 ₪ + מע"מ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ מעבר ל-1,000.' },
      { q: "האם המחיר זהה אצל כל נוטריון?", a: "השכר שבתקנות מחייב כל נוטריון בישראל. אסור לגבות יותר ממנו; פחות מותר רק במקרים שבתקנה 1א, ולפי סעיף 34(5) לחוק הנוטריונים לא \"ללא טעם מספיק\"." },
    ],
    ctaTitle: "",
    ctaBody: "",
    ctaContact: "לתיאום פגישה או שאלות — צרו קשר עכשיו",
    ctaWhatsapp: "פנייה בוואטסאפ",
    ctaBack: "חזרה לעמוד הראשי",
    footerRights: "כל הזכויות שמורות",
    schemaHeadline: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים",
    schemaDesc: 'תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים (שכר שירותים), תשל"ט-1978.',
    schemaFaq: [
      { q: "כמה עולה אימות חתימה אצל נוטריון?", a: '197 ₪ + מע"מ לחותם ראשון, 77 ₪ + מע"מ לכל חותם נוסף. המחיר קבוע בתקנות.' },
      { q: "כמה עולה תרגום נוטריוני?", a: '251 ₪ + מע"מ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ מעבר ל-1,000.' },
      { q: "האם המחיר זהה אצל כל נוטריון?", a: "השכר שבתקנות מחייב כל נוטריון בישראל. אסור לגבות יותר ממנו; פחות מותר רק במקרים שבתקנה 1א, ולפי סעיף 34(5) לחוק הנוטריונים לא \"ללא טעם מספיק\"." },
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
    meta: "BEITON | 30.3.2026, updated 25.11.2026",
    intro: "Notary fees in Israel are fixed by the Notaries (Service Fees) Regulations, 1978, and are uniform nationwide. The amounts change on 1 January each year according to the Consumer Price Index (regulation 4). A notary may not charge more than the regulated fee; charging less is allowed only in the cases the law sets (regulation 1A, and section 34(5) of the Notaries Law, 1976).",
    whoSetsTitle: "Who sets notary fees?",
    whoSetsBody: "Regulation 1 says that for each listed service a notary shall charge the fee set next to it, plus an amount equal to the VAT the notary owes on the service. Under section 34(5) of the Notaries Law, a notary commits a disciplinary offence by charging or demanding a fee above the one fixed under the Law, or, without sufficient reason, a fee below it. Regulation 1A(a) lets a notary not charge the fee, in whole or in part, in three cases: an applicant without means; a new immigrant or returning resident with a confirmation from the Ministry of Aliyah and Integration; and a service needed because of the notary's own mistake. (Hebrew text on Wikisource, read on 25.11.2026; this summary is an unofficial translation.)",
    tariffsTitle: "Updated Notary Tariffs for 2026",
    rows: [
      { service: "Signature Authentication", price: "197 ₪ first signer, 77 ₪ each additional" },
      { service: "Power of Attorney (signature authentication, item 1)", price: "197 ₪ first signer, 77 ₪ each additional signer and each copy authenticated at the same sitting" },
      { service: "Certified Translation", price: "251 ₪ up to 100 words, 197 ₪ per 100 words up to 1,000, 99 ₪ over 1,000" },
      { service: "Certified Copy", price: "77 ₪ first page, 13 ₪ each additional page" },
      { service: "Certifying a property agreement made before marriage (item 11)", price: "446 ₪, 74 ₪ per additional certification at the same sitting" },
      { service: "Notarial Will", price: "293 ₪ first signer, 147 ₪ each additional" },
      { service: "Life Certificate", price: "197 ₪" },
      { service: "Notarial Affidavit", price: "200 ₪ first declarant, 80 ₪ each additional" },
    ],
    vatNote: "All prices above are before VAT (18%). VAT must be added to every amount as required by law.",
    whenTitle: "When is a notarial act needed?",
    whenItems: ["A general power of attorney, or one for a real-estate transaction that requires registration (section 20(a) of the Notaries Law)", "A document for use abroad: the notarial certificate, then the authentication under section 45 of the Law (apostille), where the receiving body requires it", "Notarial translation of certificates (birth, marriage, degree)", "Signing a prenuptial agreement", "Preparing a notarial will", "Life certificate for receiving a pension from abroad"],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "How much does signature authentication cost?", a: "197 ₪ + VAT for the first signer, 77 ₪ + VAT for each additional signer. The fee is fixed by regulations." },
      { q: "How much does a notarial translation cost?", a: "251 ₪ + VAT for the first 100 words, 197 ₪ per additional 100 words up to 1,000, and 99 ₪ beyond 1,000." },
      { q: "Is the price the same at every notary?", a: "The regulated fee binds every notary in Israel. A notary may not charge more; charging less is allowed only in the cases in regulation 1A, and under section 34(5) of the Notaries Law not without sufficient reason." },
    ],
    ctaTitle: "",
    ctaBody: "",
    ctaContact: "Schedule a meeting or ask questions — contact us now",
    ctaWhatsapp: "Contact via WhatsApp",
    ctaBack: "Back to homepage",
    footerRights: "All rights reserved",
    schemaHeadline: "Notary Fees in Israel 2026 — Official Ministry of Justice Tariffs",
    schemaDesc: "Updated notary fees in Israel for 2026 per Notaries Regulations (Service Fees), 1978.",
    schemaFaq: [
      { q: "How much does signature authentication cost?", a: "197 ₪ + VAT for the first signer, 77 ₪ + VAT for each additional. Fixed by regulations." },
      { q: "How much does a notarial translation cost?", a: "251 ₪ + VAT up to 100 words, 197 ₪ per 100 additional words up to 1,000, 99 ₪ over 1,000." },
      { q: "Is the price the same at every notary?", a: "The regulated fee binds every notary in Israel. A notary may not charge more; charging less is allowed only in the cases in regulation 1A, and under section 34(5) of the Notaries Law not without sufficient reason." },
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
    meta: "BEITON | 30.3.2026, обновлено 25.11.2026",
    intro: "Оплата нотариуса в Израиле установлена Правилами о нотариусах (оплата услуг) 1978 года и одинакова по всей стране. Суммы меняются 1 января каждого года по индексу потребительских цен (правило 4). Нотариус не вправе взимать больше установленной платы; меньше разрешено только в случаях, предусмотренных законом (правило 1А и статья 34(5) Закона о нотариусах 1976 года).",
    whoSetsTitle: "Кто устанавливает тарифы нотариуса?",
    whoSetsBody: "Правило 1 устанавливает, что за каждую указанную услугу нотариус взимает плату в указанном размере плюс сумму, равную НДС, который он должен уплатить за услугу. По статье 34(5) Закона о нотариусах дисциплинарным нарушением является взимание или требование платы выше установленной, а также, без достаточной причины, ниже установленной. Правило 1А(а) позволяет нотариусу не взимать плату полностью или частично в трёх случаях: у заявителя нет средств; новый репатриант или вернувшийся житель с подтверждением Министерства алии и интеграции; услуга потребовалась из-за ошибки самого нотариуса. (Текст на иврите в Викитеке, прочитано 25.11.2026; это неофициальный перевод.)",
    tariffsTitle: "Актуальные тарифы нотариуса на 2026 год",
    rows: [
      { service: "Заверение подписи", price: "197 ₪ первый подписант, 77 ₪ каждый дополнительный" },
      { service: "Доверенность (удостоверение подписи, пункт 1)", price: "197 ₪ первый подписант, 77 ₪ каждый дополнительный подписант и каждая копия, удостоверенная в тот же приём" },
      { service: "Заверение перевода", price: "251 ₪ до 100 слов, 197 ₪ за каждые 100 слов до 1 000, 99 ₪ свыше 1 000" },
      { service: "Заверенная копия", price: "77 ₪ первая страница, 13 ₪ каждая дополнительная" },
      { service: "Удостоверение имущественного договора, заключённого до брака (пункт 11)", price: "446 ₪, 74 ₪ за каждое дополнительное удостоверение в тот же приём" },
      { service: "Завещание", price: "293 ₪ первый подписант, 147 ₪ каждый дополнительный" },
      { service: "Свидетельство о жизни", price: "197 ₪" },
      { service: "Аффидавит", price: "200 ₪ первый заявитель, 80 ₪ каждый дополнительный" },
    ],
    vatNote: "Все цены указаны без НДС (18%). НДС добавляется к каждой сумме по закону.",
    whenTitle: "Когда нужно нотариальное действие?",
    whenItems: ["Генеральная доверенность или доверенность на сделку с недвижимостью, подлежащую регистрации (статья 20(а) Закона о нотариусах)", "Документ для использования за границей: нотариальный акт, затем удостоверение по статье 45 Закона (апостиль), если этого требует принимающая сторона", "Нотариальный перевод свидетельств (рождение, брак, диплом)", "Подписание брачного договора", "Составление нотариального завещания", "Свидетельство о жизни для пенсии из-за рубежа"],
    faqTitle: "Часто задаваемые вопросы",
    faq: [
      { q: "Сколько стоит заверение подписи?", a: "197 ₪ + НДС за первого подписанта, 77 ₪ + НДС за каждого дополнительного. Тариф установлен правилами." },
      { q: "Сколько стоит нотариальный перевод?", a: "251 ₪ + НДС до 100 слов, 197 ₪ за каждые 100 дополнительных слов до 1 000, 99 ₪ свыше 1 000." },
      { q: "Одинакова ли цена у всех нотариусов?", a: "Установленная плата обязательна для каждого нотариуса в Израиле. Брать больше нельзя; меньше можно только в случаях из правила 1А и, по статье 34(5) Закона о нотариусах, не без достаточной причины." },
    ],
    ctaTitle: "",
    ctaBody: "",
    ctaContact: "Запись или вопросы — свяжитесь с нами",
    ctaWhatsapp: "Написать в WhatsApp",
    ctaBack: "На главную",
    footerRights: "Все права защищены",
    schemaHeadline: "Стоимость услуг нотариуса в Израиле 2026",
    schemaDesc: "Актуальные тарифы нотариуса в Израиле на 2026 год.",
    schemaFaq: [
      { q: "Сколько стоит заверение подписи?", a: "197 ₪ + НДС за первого подписанта, 77 ₪ за каждого дополнительного." },
      { q: "Сколько стоит нотариальный перевод?", a: "251 ₪ + НДС до 100 слов, 197 ₪ за 100 дополнительных до 1 000, 99 ₪ свыше." },
      { q: "Цена одинакова у всех нотариусов?", a: "Установленная плата обязательна для каждого нотариуса в Израиле. Брать больше нельзя; меньше можно только в случаях из правила 1А." },
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
    meta: "BEITON | 30.3.2026، حُدّث في 25.11.2026",
    intro: "أجر كاتب العدل في إسرائيل محدد في أنظمة كتّاب العدل (أجور الخدمات) لسنة 1978، وهو موحّد في كل البلاد. تتغير المبالغ في 1 كانون الثاني من كل عام وفق مؤشر أسعار المستهلك (النظام 4). لا يجوز لكاتب العدل أن يتقاضى أكثر من الأجر المحدد؛ أما الأقل فمسموح فقط في الحالات التي يحددها القانون (النظام 1أ، والبند 34(5) من قانون كتّاب العدل لسنة 1976).",
    whoSetsTitle: "من يحدد رسوم كاتب العدل؟",
    whoSetsBody: "ينص النظام 1 على أن كاتب العدل يتقاضى عن كل خدمة مذكورة الأجر المحدد بجانبها، مضافًا إليه مبلغ يساوي ضريبة القيمة المضافة المستحقة عليه عن الخدمة. وفق البند 34(5) من قانون كتّاب العدل، يرتكب كاتب العدل مخالفة تأديبية إذا تقاضى أو طلب أجرًا أعلى من المحدد، أو تقاضى أو طلب، دون سبب كافٍ، أجرًا أقل من المحدد. ويجيز النظام 1أ(أ) لكاتب العدل ألا يتقاضى الأجر كله أو بعضه في ثلاث حالات: مقدّم طلب معدوم الوسائل؛ قادم جديد أو مواطن عائد قدّم مصادقة من وزارة الهجرة والاستيعاب؛ وخدمة طُلبت بسبب خطأ كاتب العدل نفسه. (النص العبري في ويكي مصدر، قُرئ في 25.11.2026؛ هذه ترجمة غير رسمية.)",
    tariffsTitle: "تعرفات كاتب العدل المحدّثة لعام 2026",
    rows: [
      { service: "توثيق التوقيع", price: "197 ₪ الموقّع الأول، 77 ₪ لكل موقّع إضافي" },
      { service: "توكيل (مصادقة على توقيع، البند 1)", price: "197 ₪ الموقّع الأول، 77 ₪ لكل موقّع إضافي ولكل نسخة يُصادق عليها في الجلسة نفسها" },
      { service: "ترجمة موثقة", price: "251 ₪ حتى 100 كلمة، 197 ₪ لكل 100 كلمة حتى 1,000، 99 ₪ فوق 1,000" },
      { service: "نسخة مصدّقة", price: "77 ₪ الصفحة الأولى، 13 ₪ لكل صفحة إضافية" },
      { service: "المصادقة على اتفاقية مالية أُبرمت قبل الزواج (البند 11)", price: "446 ₪، 74 ₪ لكل مصادقة إضافية في الجلسة نفسها" },
      { service: "وصية توثيقية", price: "293 ₪ الموقّع الأول، 147 ₪ لكل موقّع إضافي" },
      { service: "شهادة حياة", price: "197 ₪" },
      { service: "إفادة خطية", price: "200 ₪ المُقرّ الأول، 80 ₪ لكل مُقرّ إضافي" },
    ],
    vatNote: "جميع الأسعار قبل ضريبة القيمة المضافة (18%). يجب إضافة ض.ق.م لكل مبلغ.",
    whenTitle: "متى يلزم عمل توثيقي؟",
    whenItems: ["توكيل عام أو توكيل لصفقة عقارية تتطلب التسجيل (البند 20(أ) من قانون كتّاب العدل)", "مستند للاستعمال في الخارج: المصادقة التوثيقية، ثم المصادقة وفق البند 45 من القانون (أبوستيل)، إذا طلبتها الجهة المستقبِلة", "ترجمة توثيقية لشهادات (ميلاد، زواج، شهادة جامعية)", "توقيع اتفاقية مالية قبل الزواج", "إعداد وصية توثيقية", "شهادة حياة لتلقي معاش من الخارج"],
    faqTitle: "أسئلة شائعة",
    faq: [
      { q: "كم يكلف توثيق التوقيع؟", a: "197 ₪ + ض.ق.م للموقّع الأول، 77 ₪ + ض.ق.م لكل موقّع إضافي. السعر محدد بالأنظمة." },
      { q: "كم تكلفة الترجمة التوثيقية؟", a: "251 ₪ + ض.ق.م حتى 100 كلمة، 197 ₪ لكل 100 كلمة إضافية حتى 1,000، و-99 ₪ فوق 1,000." },
      { q: "هل السعر متطابق عند جميع كتّاب العدل؟", a: "الأجر المحدد ملزم لكل كاتب عدل في إسرائيل. لا يجوز تقاضي أكثر منه؛ والأقل مسموح فقط في الحالات الواردة في النظام 1أ، ووفق البند 34(5) من قانون كتّاب العدل ليس دون سبب كافٍ." },
    ],
    ctaTitle: "",
    ctaBody: "",
    ctaContact: "لتحديد موعد أو استفسار — تواصلوا معنا الآن",
    ctaWhatsapp: "تواصل عبر واتساب",
    ctaBack: "العودة للصفحة الرئيسية",
    footerRights: "جميع الحقوق محفوظة",
    schemaHeadline: "رسوم كاتب العدل في إسرائيل 2026",
    schemaDesc: "رسوم كاتب العدل المحدّثة لعام 2026 وفقاً للأنظمة.",
    schemaFaq: [
      { q: "كم يكلف توثيق التوقيع؟", a: "197 ₪ + ض.ق.م للموقّع الأول، 77 ₪ لكل إضافي." },
      { q: "كم تكلفة الترجمة التوثيقية؟", a: "251 ₪ + ض.ق.م حتى 100 كلمة، 197 ₪ لكل 100 إضافية حتى 1,000، 99 ₪ فوق." },
      { q: "هل السعر متطابق عند الجميع؟", a: "الأجر المحدد ملزم لكل كاتب عدل في إسرائيل. لا يجوز تقاضي أكثر منه؛ والأقل مسموح فقط في الحالات الواردة في النظام 1أ." },
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
            dateModified: "2026-11-25",
            author: { "@type": "Organization", name: "BEITON", url: "https://notary.beiton.co" },
            publisher: { "@type": "Organization", name: "BEITON", url: "https://notary.beiton.co", logo: { "@type": "ImageObject", url: "https://notary.beiton.co/logo.png" } },
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
        lang={t[locale] ? locale : "en"}
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

          {/* CTA: במצב מידע רק פנייה כללית למשרד. "הזמנת תור אונליין" וטענות הזמינות הוסרו */}
          {ORDER_FLOWS_ENABLED && c.ctaTitle && <>
            <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.ctaTitle}</h2>
            <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>{c.ctaBody}</p>
          </>}

          <div style={{ background: "#FAFAF8", borderRadius: 12, border: "1px solid #E8E6E1", padding: "28px 24px", textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 15, fontWeight: 400, marginBottom: 8 }}>{ORDER_FLOWS_ENABLED ? c.ctaContact : (GENERAL_CONTACT[locale] || GENERAL_CONTACT.en).title}</p>
            {!ORDER_FLOWS_ENABLED && <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", marginBottom: 16 }}>{(GENERAL_CONTACT[locale] || GENERAL_CONTACT.en).text}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://wa.me/97233817776" target="_blank" rel="noopener noreferrer" style={{ background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "background .2s" }}>{ORDER_FLOWS_ENABLED ? c.ctaWhatsapp : (GENERAL_CONTACT[locale] || GENERAL_CONTACT.en).whatsapp}</a>
              {!ORDER_FLOWS_ENABLED && <a href="mailto:office@beiton.co" style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, textDecoration: "none" }}>{(GENERAL_CONTACT[locale] || GENERAL_CONTACT.en).email}</a>}
              <Link href={`/${locale}`} style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, textDecoration: "none", transition: "all .2s" }}>{c.ctaBack}</Link>
            </div>
          </div>
        </article>

        <SiteFooter lang={locale} />
      </div>
    </>
  );
}

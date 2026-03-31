/**
 * Use case data for service pages.
 * Each use case maps to a PRICING_CONFIG key and has content in 6 languages.
 */

export interface UseCaseContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whenNeeded: string[];
  processTitle: string;
  processSteps: string[];
  pricingTitle: string;
  deliveryTitle: string;
  deliveryOptions: { name: string; desc: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaWhatsapp: string;
  ctaBack: string;
}

export interface UseCase {
  slug: string;
  pricingKey: string;
  translations: Record<string, UseCaseContent>;
}

export const USE_CASES: UseCase[] = [
  {
    slug: "birth-certificate-translation",
    pricingKey: "translation",
    translations: {
      he: {
        h1: "תרגום נוטריוני של תעודת לידה",
        metaTitle: "תרגום נוטריוני תעודת לידה — מחיר, תהליך וזמנים | BEITON & Co",
        metaDescription: "תרגום תעודת לידה עם אישור נוטריוני — כמה עולה, מה התהליך, ואיך מקבלים את השירות. תעריף קבוע בתקנות, שירות דיגיטלי מהיר.",
        intro: "תרגום נוטריוני של תעודת לידה נדרש כשרשויות בחו״ל, שגרירות, או מוסד אקדמי דורשים תעודת לידה מתורגמת עם אישור רשמי. הנוטריון מאשר שהתרגום נאמן למקור — מה שהופך את המסמך למוכר בינלאומית.",
        whenNeeded: [
          "הגשת בקשה לאזרחות או דרכון זר",
          "הרשמה ללימודים בחו״ל",
          "הגירה או ויזת עבודה",
          "רישום נישואין בחו״ל",
          "הליכי אימוץ בינלאומיים",
          "פתיחת חשבון בנק בחו״ל",
        ],
        processTitle: "מה התהליך?",
        processSteps: [
          "שליחת צילום/סריקה של תעודת הלידה בוואטסאפ או מייל",
          "הנוטריון מתרגם את המסמך (או מאשר תרגום של מתרגם חיצוני)",
          "הנוטריון חותם ומאשר את התרגום בחותמת נוטריונית",
          "קבלת המסמך החתום — סריקה דיגיטלית + מקור בשליח או איסוף",
          "במידת הצורך — אפוסטיל בית משפט על האישור הנוטריוני",
        ],
        pricingTitle: "כמה זה עולה?",
        deliveryTitle: "איך מקבלים את השירות?",
        deliveryOptions: [
          { name: "דיגיטלי", desc: "שליחת המסמך בוואטסאפ/מייל, קבלת סריקה חתומה + מקור בשליח" },
          { name: "שליח", desc: "שליח אוסף את המסמך ומחזיר חתום — 100 ₪ + מע״מ לכיוון" },
          { name: "איסוף עצמי", desc: "איסוף מהמשרד בתיאום מראש" },
        ],
        faqTitle: "שאלות נפוצות",
        faq: [
          { q: "כמה עולה תרגום נוטריוני של תעודת לידה?", a: "תעודת לידה ממוצעת היא כ-200 מילים. אם הנוטריון מתרגם: 251 + 197 + תוספת 50% = 672 ₪ + מע״מ. אם מתרגם חיצוני מאשר: 448 ₪ + מע״מ." },
          { q: "כמה זמן לוקח?", a: "בדרך כלל 1-3 ימי עסקים. תרגום דחוף — תוך 24 שעות (בכפוף לזמינות)." },
          { q: "האם צריך להגיע למשרד?", a: "לא. תרגום נוטריוני הוא שירות דיגיטלי לחלוטין — שלחו צילום בוואטסאפ וקבלו חזרה מסמך חתום." },
          { q: "האם צריך להביא את המקור?", a: "לא. מספיק צילום או סריקה ברורה של תעודת הלידה." },
          { q: "האם התרגום מוכר בחו״ל?", a: "כן. תרגום נוטריוני ישראלי מוכר בכל מדינות אמנת האג (עם אפוסטיל) ובמרבית המדינות האחרות." },
        ],
        ctaTitle: "צריכים תרגום תעודת לידה?",
        ctaText: "שלחו צילום של התעודה בוואטסאפ ונחזור עם הצעת מחיר מדויקת תוך דקות.",
        ctaWhatsapp: "שליחת מסמך בוואטסאפ",
        ctaBack: "חזרה לעמוד הראשי",
      },
      en: {
        h1: "Notarial Translation of Birth Certificate",
        metaTitle: "Birth Certificate Notarial Translation — Price, Process & Timeline | BEITON & Co",
        metaDescription: "Notarial translation of birth certificate in Israel — cost, process, and how to get it. Fixed regulated tariff, fast digital service.",
        intro: "A notarial translation of a birth certificate is required when foreign authorities, embassies, or academic institutions require a translated birth certificate with official certification. The notary certifies the translation is faithful to the original, making the document internationally recognized.",
        whenNeeded: [
          "Applying for foreign citizenship or passport",
          "University enrollment abroad",
          "Immigration or work visa applications",
          "Marriage registration abroad",
          "International adoption proceedings",
          "Opening a bank account abroad",
        ],
        processTitle: "How does it work?",
        processSteps: [
          "Send a photo/scan of the birth certificate via WhatsApp or email",
          "The notary translates the document (or certifies an external translator's work)",
          "The notary signs and stamps the translation with a notarial seal",
          "Receive the signed document — digital scan + original via courier or pickup",
          "If needed — court apostille on the notarial certificate",
        ],
        pricingTitle: "How much does it cost?",
        deliveryTitle: "How to get the service?",
        deliveryOptions: [
          { name: "Digital", desc: "Send the document via WhatsApp/email, receive signed scan + original by courier" },
          { name: "Courier", desc: "Courier picks up and returns the signed document — 100 ₪ + VAT per direction" },
          { name: "Self pickup", desc: "Pick up from the office by appointment" },
        ],
        faq: [
          { q: "How much does a notarial translation of a birth certificate cost?", a: "An average birth certificate is ~200 words. If the notary translates: 251 + 197 + 50% surcharge = 672 ₪ + VAT. If an external translator certifies: 448 ₪ + VAT." },
          { q: "How long does it take?", a: "Usually 1-3 business days. Urgent translation — within 24 hours (subject to availability)." },
          { q: "Do I need to visit the office?", a: "No. Notarial translation is fully digital — send a photo via WhatsApp and receive a signed document back." },
          { q: "Do I need to bring the original?", a: "No. A clear photo or scan of the birth certificate is sufficient." },
          { q: "Is the translation recognized abroad?", a: "Yes. Israeli notarial translation is recognized in all Hague Convention countries (with apostille) and most other countries." },
        ],
        faqTitle: "Frequently Asked Questions",
        ctaTitle: "Need a birth certificate translation?",
        ctaText: "Send a photo of the certificate via WhatsApp and we'll reply with an exact quote within minutes.",
        ctaWhatsapp: "Send document via WhatsApp",
        ctaBack: "Back to homepage",
      },
      ru: {
        h1: "Нотариальный перевод свидетельства о рождении",
        metaTitle: "Нотариальный перевод свидетельства о рождении — цена, процесс | BEITON & Co",
        metaDescription: "Нотариальный перевод свидетельства о рождении в Израиле — стоимость, процесс и способы получения. Фиксированный тариф, быстрый цифровой сервис.",
        intro: "Нотариальный перевод свидетельства о рождении требуется, когда зарубежные органы, посольства или учебные заведения запрашивают переведённое свидетельство с официальным заверением. Нотариус подтверждает точность перевода, что делает документ признанным на международном уровне.",
        whenNeeded: [
          "Подача на иностранное гражданство или паспорт",
          "Поступление в университет за рубежом",
          "Иммиграция или рабочая виза",
          "Регистрация брака за границей",
          "Международные процедуры усыновления",
          "Открытие банковского счёта за рубежом",
        ],
        processTitle: "Как проходит процесс?",
        processSteps: [
          "Отправьте фото/скан свидетельства через WhatsApp или email",
          "Нотариус переводит документ (или заверяет перевод внешнего переводчика)",
          "Нотариус подписывает и ставит нотариальную печать",
          "Получение подписанного документа — цифровой скан + оригинал курьером или самовывозом",
          "При необходимости — апостиль суда на нотариальное заверение",
        ],
        pricingTitle: "Сколько это стоит?",
        deliveryTitle: "Как получить услугу?",
        deliveryOptions: [
          { name: "Цифровой", desc: "Отправка документа через WhatsApp/email, получение подписанного скана + оригинал курьером" },
          { name: "Курьер", desc: "Курьер забирает и возвращает подписанный документ — 100 ₪ + НДС за направление" },
          { name: "Самовывоз", desc: "Забрать из офиса по предварительной записи" },
        ],
        faqTitle: "Часто задаваемые вопросы",
        faq: [
          { q: "Сколько стоит нотариальный перевод свидетельства о рождении?", a: "Среднее свидетельство — ~200 слов. Если нотариус переводит: 251 + 197 + надбавка 50% = 672 ₪ + НДС. Если внешний переводчик: 448 ₪ + НДС." },
          { q: "Сколько времени занимает?", a: "Обычно 1-3 рабочих дня. Срочный перевод — в течение 24 часов." },
          { q: "Нужно ли приходить в офис?", a: "Нет. Нотариальный перевод — полностью цифровая услуга." },
          { q: "Нужно ли приносить оригинал?", a: "Нет. Достаточно чёткой фотографии или скана." },
          { q: "Признаётся ли перевод за рубежом?", a: "Да. Израильский нотариальный перевод признаётся во всех странах Гаагской конвенции (с апостилем)." },
        ],
        ctaTitle: "Нужен перевод свидетельства о рождении?",
        ctaText: "Отправьте фото свидетельства в WhatsApp и мы ответим точной ценой в течение минут.",
        ctaWhatsapp: "Отправить документ в WhatsApp",
        ctaBack: "На главную",
      },
      ar: {
        h1: "ترجمة توثيقية لشهادة الميلاد",
        metaTitle: "ترجمة شهادة ميلاد توثيقية — السعر والعملية | BEITON & Co",
        metaDescription: "ترجمة توثيقية لشهادة الميلاد في إسرائيل — التكلفة والعملية وطريقة الحصول على الخدمة. تعرفة ثابتة، خدمة رقمية سريعة.",
        intro: "الترجمة التوثيقية لشهادة الميلاد مطلوبة عندما تطلب جهات أجنبية أو سفارات أو مؤسسات أكاديمية شهادة ميلاد مترجمة مع تصديق رسمي. يؤكد كاتب العدل أن الترجمة مطابقة للأصل، مما يجعل المستند معترفاً به دولياً.",
        whenNeeded: [
          "طلب جنسية أو جواز سفر أجنبي",
          "التسجيل في جامعة بالخارج",
          "هجرة أو تأشيرة عمل",
          "تسجيل زواج في الخارج",
          "إجراءات تبنّي دولية",
          "فتح حساب بنكي في الخارج",
        ],
        processTitle: "ما هي العملية؟",
        processSteps: [
          "إرسال صورة/مسح ضوئي لشهادة الميلاد عبر واتساب أو بريد إلكتروني",
          "كاتب العدل يترجم المستند (أو يصادق على ترجمة مترجم خارجي)",
          "كاتب العدل يوقّع ويختم بختم توثيقي",
          "استلام المستند الموقّع — مسح رقمي + الأصل عبر مندوب أو استلام ذاتي",
          "عند الحاجة — أبوستيل المحكمة على التصديق التوثيقي",
        ],
        pricingTitle: "كم التكلفة؟",
        deliveryTitle: "كيف تحصلون على الخدمة؟",
        deliveryOptions: [
          { name: "رقمي", desc: "إرسال المستند عبر واتساب/بريد، استلام مسح موقّع + الأصل عبر مندوب" },
          { name: "مندوب", desc: "المندوب يجمع ويعيد المستند الموقّع — 100 ₪ + ض.ق.م لكل اتجاه" },
          { name: "استلام ذاتي", desc: "الاستلام من المكتب بموعد مسبق" },
        ],
        faqTitle: "أسئلة شائعة",
        faq: [
          { q: "كم تكلفة ترجمة شهادة الميلاد التوثيقية؟", a: "شهادة الميلاد المتوسطة ~200 كلمة. إذا ترجم كاتب العدل: 251 + 197 + علاوة 50% = 672 ₪ + ض.ق.م. إذا مترجم خارجي: 448 ₪ + ض.ق.م." },
          { q: "كم يستغرق الأمر؟", a: "عادة 1-3 أيام عمل. ترجمة عاجلة — خلال 24 ساعة." },
          { q: "هل يجب زيارة المكتب؟", a: "لا. الترجمة التوثيقية خدمة رقمية بالكامل." },
          { q: "هل يجب إحضار الأصل؟", a: "لا. تكفي صورة أو مسح واضح لشهادة الميلاد." },
          { q: "هل الترجمة معترف بها في الخارج؟", a: "نعم. الترجمة التوثيقية الإسرائيلية معترف بها في جميع دول اتفاقية لاهاي (مع أبوستيل)." },
        ],
        ctaTitle: "تحتاجون ترجمة شهادة ميلاد؟",
        ctaText: "أرسلوا صورة الشهادة عبر واتساب وسنرد بعرض سعر دقيق خلال دقائق.",
        ctaWhatsapp: "إرسال مستند عبر واتساب",
        ctaBack: "العودة للصفحة الرئيسية",
      },
      // FR and ES fall back to EN for now — will be populated later
    },
  },
];

export const USE_CASE_MAP = Object.fromEntries(USE_CASES.map(uc => [uc.slug, uc]));
export const USE_CASE_SLUGS = USE_CASES.map(uc => uc.slug);

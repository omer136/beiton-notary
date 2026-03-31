/**
 * Use case data for service pages.
 * Each use case maps to a PRICING_CONFIG key and has content in 6 languages.
 * Target: 800-1200 words per page for SEO.
 */

export interface UseCaseContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whatIsTitle: string;
  whatIsBody: string;
  whenNeededTitle: string;
  whenNeeded: string[];
  processTitle: string;
  processSteps: string[];
  docsTitle: string;
  docs: string[];
  pricingTitle: string;
  pricingNote: string;
  deliveryTitle: string;
  deliveryOptions: { name: string; desc: string }[];
  whyUsTitle: string;
  whyUsPoints: string[];
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
        metaDescription: "תרגום תעודת לידה עם אישור נוטריוני — כמה עולה, מה התהליך, מסמכים נדרשים ואיך מקבלים את השירות. תעריף קבוע בתקנות, שירות דיגיטלי מהיר.",
        intro: "תרגום נוטריוני של תעודת לידה הוא אחד השירותים הנפוצים ביותר במשרדי נוטריון בישראל. כשרשויות בחו״ל, שגרירויות, מוסדות אקדמיים או גורמים ממשלתיים דורשים תעודת לידה ישראלית מתורגמת — הם דורשים שהתרגום יהיה מאושר על ידי נוטריון מוסמך. האישור הנוטריוני מעניק למסמך תוקף משפטי בינלאומי ומבטיח שהתרגום נאמן למקור.",
        whatIsTitle: "מה זה תרגום נוטריוני של תעודת לידה?",
        whatIsBody: "תרגום נוטריוני הוא תרגום מסמך רשמי שמלווה באישור של נוטריון מוסמך לפי חוק הנוטריונים, תשל״ו-1976. הנוטריון מאשר שהתרגום נאמן ומדויק ביחס למסמך המקורי. ישנם שני מסלולים: (1) הנוטריון עצמו מתרגם את המסמך — אם הוא דובר את שתי השפות (עברית ↔ אנגלית), ובמקרה זה מתווספת תוספת של 50% על שכר האישור; (2) מתרגם חיצוני מתרגם ומגיש הצהרת מתרגם, והנוטריון מאשר את ההצהרה — מתאים לכל שפה. בשני המקרים המסמך מקבל חותמת נוטריונית רשמית שמוכרת בכל הארץ ובחו״ל.",
        whenNeededTitle: "מתי צריך תרגום נוטריוני של תעודת לידה?",
        whenNeeded: [
          "הגשת בקשה לאזרחות זרה — פורטוגלית, רומנית, פולנית, גרמנית ועוד",
          "הגשת בקשה לדרכון זר או חידוש דרכון",
          "הרשמה ללימודים אקדמיים בחו״ל",
          "הגירה או ויזת עבודה — ארה״ב, קנדה, אוסטרליה, גרמניה ועוד",
          "רישום נישואין בחו״ל",
          "הליכי אימוץ בינלאומיים",
          "פתיחת חשבון בנק במדינה זרה",
          "הוכחת זהות מול גורמים בינלאומיים",
        ],
        processTitle: "מה התהליך?",
        processSteps: [
          "שלחו צילום או סריקה ברורה של תעודת הלידה בוואטסאפ או במייל — לא צריך להגיע למשרד",
          "אנחנו בודקים את המסמך, סופרים מילים ונותנים הצעת מחיר מדויקת תוך דקות",
          "לאחר אישור — הנוטריון מתרגם את המסמך (או מאשר תרגום של מתרגם חיצוני)",
          "הנוטריון חותם, חותמת ומאשר את התרגום בחותמת נוטריונית רשמית",
          "תקבלו סריקה דיגיטלית של המסמך החתום מיד + המקור בשליח או באיסוף עצמי",
          "במידת הצורך — נטפל גם באפוסטיל בית משפט על האישור הנוטריוני (41 ₪ אגרה + 150 ₪ טיפול)",
        ],
        docsTitle: "מסמכים נדרשים",
        docs: [
          "צילום או סריקה ברורה של תעודת הלידה (לא חייבים מקור פיזי)",
          "צילום תעודת זהות או דרכון של מבקש השירות",
          "ציון שפת היעד לתרגום",
          "ציון אם נדרש אפוסטיל (ואם כן — לאיזו מדינה)",
        ],
        pricingTitle: "כמה זה עולה?",
        pricingNote: "תעודת לידה ממוצעת היא כ-200 מילים. תעריפי התרגום קבועים בתקנות הנוטריונים (שכר שירותים), תשל״ט-1978 ואחידים אצל כל הנוטריונים בישראל. חשבו את המחיר המדויק במחשבון:",
        deliveryTitle: "איך מקבלים את השירות?",
        deliveryOptions: [
          { name: "דיגיטלי (הכי מהיר)", desc: "שלחו את המסמך בוואטסאפ או מייל. נחזיר סריקה חתומה + מקור בשליח. לא צריך להגיע למשרד." },
          { name: "שליח עד הבית", desc: "שליח אוסף את המסמך המקורי (אם נדרש) ומחזיר את המסמך החתום. 100 ₪ + מע״מ לכיוון." },
          { name: "איסוף עצמי מהמשרד", desc: "ניתן לאסוף את המסמך החתום ממשרדנו בתיאום מראש." },
        ],
        whyUsTitle: "למה BEITON & Co?",
        whyUsPoints: [
          "שירות דיגיטלי מלא — שלחו מסמך בוואטסאפ וקבלו תרגום חתום בחזרה, בלי להגיע למשרד",
          "מענה תוך דקות — צוות זמין לשאלות ולהצעות מחיר",
          "תרגום בכל השפות — עברית, אנגלית, רוסית, ערבית, צרפתית, ספרדית, גרמנית ועוד",
          "מחשבון מחירים שקוף — דעו בדיוק כמה תשלמו לפני שמתחילים",
          "טיפול באפוסטיל — אנחנו מטפלים גם בחותמת בית משפט, בלי שתצטרכו לנסוע",
          "זמני אספקה מהירים — תרגום רגיל 1-3 ימי עסקים, דחוף תוך 24 שעות",
        ],
        faqTitle: "שאלות נפוצות על תרגום תעודת לידה",
        faq: [
          { q: "כמה עולה תרגום נוטריוני של תעודת לידה?", a: "תעודת לידה ממוצעת היא כ-200 מילים. עלות אישור התרגום: 251 + 197 = 448 ₪. אם הנוטריון מתרגם בעצמו — תוספת 50% = 672 ₪. כל המחירים לפני מע״מ (18%). חשבו מחיר מדויק במחשבון למעלה." },
          { q: "כמה זמן לוקח תרגום תעודת לידה?", a: "תרגום רגיל — 1-3 ימי עסקים. תרגום דחוף — תוך 24 שעות, בכפוף לזמינות. זמני הטיפול מתחילים מרגע אישור ההזמנה." },
          { q: "האם צריך להגיע למשרד?", a: "לא. תרגום נוטריוני הוא שירות דיגיטלי לחלוטין — שלחו צילום ברור בוואטסאפ וקבלו חזרה מסמך חתום. המקור נשלח בשליח או נאסף מהמשרד." },
          { q: "האם צריך להביא את תעודת הלידה המקורית?", a: "לא. מספיק צילום או סריקה ברורה של תעודת הלידה. הנוטריון עובד מול הצילום." },
          { q: "האם התרגום מוכר בחו״ל?", a: "כן. תרגום נוטריוני ישראלי מוכר בכל מדינות אמנת האג (עם אפוסטיל בית משפט) ובמרבית המדינות האחרות. אם נדרש אפוסטיל — אנחנו מטפלים גם בזה." },
          { q: "לאילו שפות אפשר לתרגם?", a: "לכל שפה. הנוטריון שלנו דובר עברית ואנגלית ומתרגם ישירות. לשפות אחרות (רוסית, צרפתית, גרמנית, ספרדית ועוד) — מתרגם חיצוני מתרגם והנוטריון מאשר את הצהרת המתרגם." },
          { q: "מה ההבדל בין אישור תרגום לבין תרגום ע״י הנוטריון?", a: "אישור תרגום — הנוטריון מאשר תרגום שביצע מתרגם חיצוני (מחיר רגיל). תרגום ע״י הנוטריון — הנוטריון מתרגם בעצמו כי הוא דובר את שתי השפות (תוספת 50%). התוצאה המשפטית זהה." },
        ],
        ctaTitle: "צריכים תרגום נוטריוני של תעודת לידה?",
        ctaText: "שלחו צילום של התעודה בוואטסאפ ונחזור עם הצעת מחיר מדויקת תוך דקות. השירות דיגיטלי — לא צריך להגיע למשרד.",
        ctaWhatsapp: "שליחת מסמך בוואטסאפ",
        ctaBack: "חזרה לעמוד הראשי",
      },
      en: {
        h1: "Notarial Translation of a Birth Certificate",
        metaTitle: "Birth Certificate Notarial Translation in Israel — Price, Process & Timeline | BEITON & Co",
        metaDescription: "Notarial translation of birth certificate in Israel — cost, process, required documents and delivery options. Fixed regulated tariff, fast digital service.",
        intro: "Notarial translation of a birth certificate is one of the most common notary services in Israel. When foreign authorities, embassies, academic institutions, or government agencies require a translated Israeli birth certificate, they require the translation to be certified by a licensed notary. The notarial certification gives the document international legal validity and ensures the translation is faithful to the original.",
        whatIsTitle: "What is a notarial translation of a birth certificate?",
        whatIsBody: "A notarial translation is an official document translation accompanied by the certification of a licensed notary under the Notaries Law, 1976 (חוק הנוטריונים, תשל״ו-1976). The notary certifies that the translation is accurate and faithful to the original document. There are two paths: (1) The notary translates the document personally — if fluent in both languages (Hebrew ↔ English), with a 50% surcharge on the certification fee; (2) An external translator translates and submits a translator's declaration, and the notary certifies the declaration — suitable for any language. In both cases, the document receives an official notarial stamp recognized domestically and internationally.",
        whenNeededTitle: "When do you need a notarial translation of a birth certificate?",
        whenNeeded: [
          "Applying for foreign citizenship — Portuguese, Romanian, Polish, German, and more",
          "Applying for or renewing a foreign passport",
          "University enrollment abroad",
          "Immigration or work visa — USA, Canada, Australia, Germany, and more",
          "Marriage registration abroad",
          "International adoption proceedings",
          "Opening a bank account in a foreign country",
          "Identity verification with international entities",
        ],
        processTitle: "How does the process work?",
        processSteps: [
          "Send a clear photo or scan of the birth certificate via WhatsApp or email — no need to visit the office",
          "We review the document, count words, and provide an exact quote within minutes",
          "After confirmation — the notary translates the document (or certifies an external translator's work)",
          "The notary signs, stamps, and certifies the translation with an official notarial seal",
          "You receive a digital scan of the signed document immediately + the original via courier or self-pickup",
          "If needed — we also handle the court apostille on the notarial certificate (41 ₪ government fee + 150 ₪ processing)",
        ],
        docsTitle: "Required documents",
        docs: [
          "Clear photo or scan of the birth certificate (physical original not required)",
          "Photo of your ID card or passport",
          "Target language for translation",
          "Whether an apostille is needed (and if so, for which country)",
        ],
        pricingTitle: "How much does it cost?",
        pricingNote: "An average birth certificate is approximately 200 words. Translation fees are fixed by the Notaries Regulations (Service Fees), 1978 and are uniform across all notaries in Israel. Calculate the exact price below:",
        deliveryTitle: "How to get the service?",
        deliveryOptions: [
          { name: "Digital (fastest)", desc: "Send the document via WhatsApp or email. We return a signed scan + original by courier. No need to visit the office." },
          { name: "Courier to your door", desc: "Courier picks up the original document (if needed) and returns the signed document. 100 ₪ + VAT per direction." },
          { name: "Self pickup from office", desc: "Pick up the signed document from our office by appointment." },
        ],
        whyUsTitle: "Why BEITON & Co?",
        whyUsPoints: [
          "Fully digital service — send a document via WhatsApp and receive a signed translation back, no office visit needed",
          "Response within minutes — our team is available for questions and quotes",
          "Translation in all languages — Hebrew, English, Russian, Arabic, French, Spanish, German, and more",
          "Transparent price calculator — know exactly how much you'll pay before starting",
          "Apostille handling — we also handle the court stamp, so you don't have to travel",
          "Fast turnaround — standard translation 1-3 business days, urgent within 24 hours",
        ],
        faqTitle: "Frequently Asked Questions",
        faq: [
          { q: "How much does a notarial translation of a birth certificate cost?", a: "An average birth certificate is ~200 words. Translation certification cost: 251 + 197 = 448 ₪. If the notary translates personally — 50% surcharge = 672 ₪. All prices before VAT (18%). Calculate the exact price using the calculator above." },
          { q: "How long does it take?", a: "Standard translation: 1-3 business days. Urgent translation: within 24 hours, subject to availability. Processing starts upon order confirmation." },
          { q: "Do I need to visit the office?", a: "No. Notarial translation is a fully digital service — send a clear photo via WhatsApp and receive a signed document back. The original is sent by courier or picked up from the office." },
          { q: "Do I need to bring the original birth certificate?", a: "No. A clear photo or scan of the birth certificate is sufficient. The notary works from the copy." },
          { q: "Is the translation recognized abroad?", a: "Yes. Israeli notarial translation is recognized in all Hague Convention countries (with a court apostille) and most other countries. If an apostille is needed, we handle it too." },
          { q: "What languages can you translate to?", a: "Any language. Our notary is fluent in Hebrew and English and translates directly. For other languages (Russian, French, German, Spanish, etc.) — an external translator translates and the notary certifies the translator's declaration." },
          { q: "What's the difference between translation certification and notary translation?", a: "Translation certification — the notary certifies a translation done by an external translator (standard price). Notary translation — the notary translates personally because they speak both languages (50% surcharge). The legal result is identical." },
        ],
        ctaTitle: "Need a birth certificate translation?",
        ctaText: "Send a photo of the certificate via WhatsApp and we'll reply with an exact quote within minutes. Fully digital service — no need to visit the office.",
        ctaWhatsapp: "Send document via WhatsApp",
        ctaBack: "Back to homepage",
      },
      ru: {
        h1: "Нотариальный перевод свидетельства о рождении",
        metaTitle: "Нотариальный перевод свидетельства о рождении в Израиле — цена и процесс | BEITON & Co",
        metaDescription: "Нотариальный перевод свидетельства о рождении в Израиле — стоимость, процесс, необходимые документы и способы получения. Фиксированный тариф, быстрый цифровой сервис.",
        intro: "Нотариальный перевод свидетельства о рождении — одна из самых востребованных нотариальных услуг в Израиле. Когда зарубежные органы, посольства, университеты или государственные учреждения требуют переведённое израильское свидетельство о рождении — они требуют заверение перевода лицензированным нотариусом. Нотариальное заверение придаёт документу международную юридическую силу.",
        whatIsTitle: "Что такое нотариальный перевод свидетельства о рождении?",
        whatIsBody: "Нотариальный перевод — это официальный перевод документа, сопровождаемый заверением лицензированного нотариуса согласно Закону о нотариусах 1976 года (חוק הנוטריונים, תשל״ו-1976). Нотариус подтверждает, что перевод точен и верен оригиналу. Есть два варианта: (1) нотариус переводит лично — если владеет обоими языками (иврит ↔ английский), с надбавкой 50%; (2) внешний переводчик переводит и подаёт декларацию переводчика, нотариус заверяет декларацию — подходит для любого языка. В обоих случаях документ получает официальную нотариальную печать.",
        whenNeededTitle: "Когда нужен нотариальный перевод свидетельства о рождении?",
        whenNeeded: [
          "Подача на иностранное гражданство — португальское, румынское, польское, немецкое и др.",
          "Получение или продление иностранного паспорта",
          "Поступление в зарубежный университет",
          "Иммиграция или рабочая виза — США, Канада, Австралия, Германия и др.",
          "Регистрация брака за рубежом",
          "Международное усыновление",
          "Открытие банковского счёта за границей",
          "Подтверждение личности для международных организаций",
        ],
        processTitle: "Как проходит процесс?",
        processSteps: [
          "Отправьте чёткое фото или скан свидетельства через WhatsApp или email — приходить в офис не нужно",
          "Мы проверяем документ, считаем слова и даём точную цену в течение минут",
          "После подтверждения — нотариус переводит документ (или заверяет перевод внешнего переводчика)",
          "Нотариус подписывает, ставит печать и заверяет перевод официальной нотариальной печатью",
          "Вы получаете цифровой скан подписанного документа сразу + оригинал курьером или самовывозом",
          "При необходимости — мы также оформляем апостиль суда (41 ₪ госпошлина + 150 ₪ обработка)",
        ],
        docsTitle: "Необходимые документы",
        docs: [
          "Чёткое фото или скан свидетельства о рождении (физический оригинал не требуется)",
          "Фото удостоверения личности или паспорта",
          "Целевой язык перевода",
          "Нужен ли апостиль (и для какой страны)",
        ],
        pricingTitle: "Сколько это стоит?",
        pricingNote: "Среднее свидетельство о рождении — около 200 слов. Тарифы на перевод установлены Правилами о нотариусах, 1978 и едины для всех нотариусов Израиля. Рассчитайте точную цену:",
        deliveryTitle: "Как получить услугу?",
        deliveryOptions: [
          { name: "Цифровой (самый быстрый)", desc: "Отправьте документ через WhatsApp или email. Мы вернём подписанный скан + оригинал курьером. Приходить в офис не нужно." },
          { name: "Курьер к двери", desc: "Курьер заберёт оригинал (если нужно) и вернёт подписанный документ. 100 ₪ + НДС за направление." },
          { name: "Самовывоз из офиса", desc: "Забрать подписанный документ из офиса по предварительной записи." },
        ],
        whyUsTitle: "Почему BEITON & Co?",
        whyUsPoints: [
          "Полностью цифровой сервис — отправьте документ в WhatsApp и получите подписанный перевод",
          "Ответ в течение минут — команда доступна для вопросов и расчётов",
          "Перевод на все языки — иврит, английский, русский, арабский, французский, испанский, немецкий",
          "Прозрачный калькулятор цен — узнайте точную стоимость до начала",
          "Оформление апостиля — мы также занимаемся судебной печатью",
          "Быстрые сроки — стандартный перевод 1-3 рабочих дня, срочный за 24 часа",
        ],
        faqTitle: "Часто задаваемые вопросы",
        faq: [
          { q: "Сколько стоит нотариальный перевод свидетельства о рождении?", a: "Среднее свидетельство — ~200 слов. Стоимость заверения: 251 + 197 = 448 ₪. Если нотариус переводит сам — надбавка 50% = 672 ₪. Все цены без НДС (18%). Рассчитайте точную цену в калькуляторе выше." },
          { q: "Сколько времени занимает?", a: "Стандартный перевод: 1-3 рабочих дня. Срочный: в течение 24 часов. Обработка начинается после подтверждения заказа." },
          { q: "Нужно ли приходить в офис?", a: "Нет. Нотариальный перевод — полностью цифровая услуга. Отправьте фото через WhatsApp и получите подписанный документ." },
          { q: "Нужно ли приносить оригинал?", a: "Нет. Достаточно чёткого фото или скана свидетельства." },
          { q: "Признаётся ли перевод за рубежом?", a: "Да. Израильский нотариальный перевод признаётся во всех странах Гаагской конвенции (с апостилем) и в большинстве других стран." },
          { q: "На какие языки можно перевести?", a: "На любой. Наш нотариус владеет ивритом и английским. Для других языков (русский, французский, немецкий и др.) — внешний переводчик переводит, нотариус заверяет декларацию." },
          { q: "В чём разница между заверением перевода и переводом нотариусом?", a: "Заверение — нотариус заверяет перевод внешнего переводчика (стандартная цена). Перевод нотариусом — нотариус переводит сам (надбавка 50%). Юридический результат одинаков." },
        ],
        ctaTitle: "Нужен перевод свидетельства о рождении?",
        ctaText: "Отправьте фото свидетельства в WhatsApp и мы ответим точной ценой в течение минут. Полностью цифровой сервис.",
        ctaWhatsapp: "Отправить документ в WhatsApp",
        ctaBack: "На главную",
      },
      ar: {
        h1: "ترجمة توثيقية لشهادة الميلاد",
        metaTitle: "ترجمة شهادة ميلاد توثيقية في إسرائيل — السعر والعملية | BEITON & Co",
        metaDescription: "ترجمة توثيقية لشهادة الميلاد في إسرائيل — التكلفة والعملية والمستندات المطلوبة وطرق الاستلام. تعرفة ثابتة، خدمة رقمية سريعة.",
        intro: "الترجمة التوثيقية لشهادة الميلاد هي من أكثر الخدمات طلباً في مكاتب كتّاب العدل في إسرائيل. عندما تطلب جهات أجنبية أو سفارات أو مؤسسات أكاديمية أو جهات حكومية شهادة ميلاد إسرائيلية مترجمة — فإنها تشترط أن يكون التصديق من كاتب عدل مرخّص. التصديق التوثيقي يمنح المستند قوة قانونية دولية.",
        whatIsTitle: "ما هي الترجمة التوثيقية لشهادة الميلاد؟",
        whatIsBody: "الترجمة التوثيقية هي ترجمة رسمية لمستند مصحوبة بتصديق كاتب عدل مرخّص وفقاً لقانون كتّاب العدل 1976 (חוק הנוטריונים, תשל״ו-1976). يؤكد كاتب العدل أن الترجمة دقيقة ومطابقة للأصل. هناك مساران: (1) كاتب العدل يترجم شخصياً — إذا كان يتحدث اللغتين (عبرية ↔ إنجليزية)، مع علاوة 50%؛ (2) مترجم خارجي يترجم ويقدم إفادة مترجم، وكاتب العدل يصادق على الإفادة — مناسب لأي لغة.",
        whenNeededTitle: "متى تحتاجون ترجمة توثيقية لشهادة الميلاد؟",
        whenNeeded: [
          "طلب جنسية أجنبية — برتغالية، رومانية، بولندية، ألمانية وغيرها",
          "طلب أو تجديد جواز سفر أجنبي",
          "التسجيل في جامعة بالخارج",
          "هجرة أو تأشيرة عمل — أمريكا، كندا، أستراليا، ألمانيا وغيرها",
          "تسجيل زواج في الخارج",
          "إجراءات تبنّي دولية",
          "فتح حساب بنكي في دولة أجنبية",
          "إثبات هوية أمام جهات دولية",
        ],
        processTitle: "ما هي العملية؟",
        processSteps: [
          "أرسلوا صورة أو مسح واضح لشهادة الميلاد عبر واتساب أو بريد إلكتروني — لا حاجة لزيارة المكتب",
          "نفحص المستند، نعدّ الكلمات ونقدم عرض سعر دقيق خلال دقائق",
          "بعد التأكيد — كاتب العدل يترجم المستند (أو يصادق على ترجمة مترجم خارجي)",
          "كاتب العدل يوقّع ويختم بختم توثيقي رسمي",
          "تحصلون على مسح رقمي للمستند الموقّع فوراً + الأصل عبر مندوب أو استلام ذاتي",
          "عند الحاجة — نتولى أيضاً أبوستيل المحكمة (41 ₪ رسوم حكومية + 150 ₪ معالجة)",
        ],
        docsTitle: "المستندات المطلوبة",
        docs: [
          "صورة أو مسح واضح لشهادة الميلاد (لا يُشترط الأصل)",
          "صورة بطاقة هوية أو جواز سفر",
          "اللغة المطلوبة للترجمة",
          "هل يُحتاج أبوستيل (ولأي دولة)",
        ],
        pricingTitle: "كم التكلفة؟",
        pricingNote: "شهادة الميلاد المتوسطة حوالي 200 كلمة. تعرفات الترجمة محددة بأنظمة كاتب العدل 1978 وموحدة لدى جميع كتّاب العدل في إسرائيل. احسبوا السعر الدقيق:",
        deliveryTitle: "كيف تحصلون على الخدمة؟",
        deliveryOptions: [
          { name: "رقمي (الأسرع)", desc: "أرسلوا المستند عبر واتساب أو بريد. نعيد مسح موقّع + الأصل عبر مندوب. لا حاجة لزيارة المكتب." },
          { name: "مندوب حتى الباب", desc: "المندوب يجمع الأصل (إن لزم) ويعيد المستند الموقّع. 100 ₪ + ض.ق.م لكل اتجاه." },
          { name: "استلام ذاتي من المكتب", desc: "استلام المستند الموقّع من مكتبنا بموعد مسبق." },
        ],
        whyUsTitle: "لماذا BEITON & Co؟",
        whyUsPoints: [
          "خدمة رقمية كاملة — أرسلوا مستند عبر واتساب واحصلوا على ترجمة موقّعة",
          "رد خلال دقائق — فريق متاح للأسئلة وعروض الأسعار",
          "ترجمة بجميع اللغات — عبرية، إنجليزية، روسية، عربية، فرنسية، إسبانية، ألمانية وأكثر",
          "حاسبة أسعار شفافة — اعرفوا التكلفة الدقيقة قبل البدء",
          "معالجة الأبوستيل — نتولى أيضاً ختم المحكمة",
          "أوقات تسليم سريعة — ترجمة عادية 1-3 أيام عمل، عاجلة خلال 24 ساعة",
        ],
        faqTitle: "أسئلة شائعة حول ترجمة شهادة الميلاد",
        faq: [
          { q: "كم تكلفة ترجمة شهادة الميلاد التوثيقية؟", a: "شهادة الميلاد المتوسطة ~200 كلمة. تكلفة التصديق: 251 + 197 = 448 ₪. إذا ترجم كاتب العدل بنفسه — علاوة 50% = 672 ₪. كل الأسعار قبل ض.ق.م (18%)." },
          { q: "كم يستغرق الأمر؟", a: "ترجمة عادية: 1-3 أيام عمل. عاجلة: خلال 24 ساعة. المعالجة تبدأ بعد تأكيد الطلب." },
          { q: "هل يجب زيارة المكتب؟", a: "لا. الترجمة التوثيقية خدمة رقمية بالكامل." },
          { q: "هل يجب إحضار الأصل؟", a: "لا. تكفي صورة أو مسح واضح." },
          { q: "هل الترجمة معترف بها في الخارج؟", a: "نعم. في جميع دول اتفاقية لاهاي (مع أبوستيل) ومعظم الدول الأخرى." },
          { q: "لأي لغات يمكن الترجمة؟", a: "لأي لغة. كاتب العدل يتحدث العبرية والإنجليزية. للغات أخرى — مترجم خارجي يترجم وكاتب العدل يصادق." },
          { q: "ما الفرق بين تصديق ترجمة وترجمة كاتب العدل؟", a: "تصديق — كاتب العدل يصادق على ترجمة مترجم خارجي (سعر عادي). ترجمة كاتب العدل — يترجم بنفسه (علاوة 50%). النتيجة القانونية واحدة." },
        ],
        ctaTitle: "تحتاجون ترجمة شهادة ميلاد؟",
        ctaText: "أرسلوا صورة الشهادة عبر واتساب وسنرد بعرض سعر دقيق خلال دقائق. خدمة رقمية بالكامل.",
        ctaWhatsapp: "إرسال مستند عبر واتساب",
        ctaBack: "العودة للصفحة الرئيسية",
      },
    },
  },
];

export const USE_CASE_MAP = Object.fromEntries(USE_CASES.map(uc => [uc.slug, uc]));
export const USE_CASE_SLUGS = USE_CASES.map(uc => uc.slug);

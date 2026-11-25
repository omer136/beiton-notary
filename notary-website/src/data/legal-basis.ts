/**
 * "מה הדין קובע": ציטוטים מילה במילה, לפי סוג הפעולה בעמודי השירות.
 *
 * המקור: הטקסט הגולמי בוויקיטקסט (action=raw), נקרא ב-25.11.2026. זה אינו הנוסח הרשמי.
 * [[לאימות: כל ציטוט כאן מול הנוסח הרשמי ברשומות, לפני מיזוג]]
 * שינויי צורה בלבד: מקף ארוך בשם חוק הוחלף במקף ("התשל״ו-1976"); השמטה מסומנת [...].
 * התרגומים לאנגלית, לרוסית ולערבית הם תרגום לא רשמי של המשרד, וטעונים בדיקה של דובר השפה.
 */

export const READ_DATE = "25.11.2026";
export const READ_DATE_ISO = "2026-11-25";

const WS = "https://he.wikisource.org/wiki/";
export const SOURCES = {
  notaries: WS + "חוק_הנוטריונים",
  notariesRegs: WS + "תקנות_הנוטריונים",
  property: WS + "חוק_יחסי_ממון_בין_בני_זוג",
  succession: WS + "חוק_הירושה",
  capacity: WS + "חוק_הכשרות_המשפטית_והאפוטרופסות",
  amendment12: "https://fs.knesset.gov.il/25/law/25_lsr_11214668.pdf",
} as const;

type L = "he" | "en" | "ru" | "ar";

export interface LawQuote {
  /** שם הסעיף, בשפת העמוד */
  cite: Record<L, string>;
  /** הנוסח העברי, מילה במילה */
  text: string;
  /** תרגום לא רשמי */
  tr: Record<Exclude<L, "he">, string>;
  url: string;
  /** מקור נוסף (למשל הפרסום ברשומות) */
  url2?: { href: string; label: Record<L, string> };
}

const NOT = { he: "חוק הנוטריונים, תשל״ו-1976", en: "Notaries Law, 1976", ru: "Закон о нотариусах, 1976", ar: "قانون كتّاب العدل، 1976" };
const cite = (law: Record<L, string>, he: string, en: string, ru = en, ar = en): Record<L, string> => ({
  he: `${law.he}, ${he}`, en: `${law.en}, ${en}`, ru: `${law.ru}, ${ru}`, ar: `${law.ar}، ${ar}`,
});

export const Q: Record<string, LawQuote> = {
  n7_5: {
    cite: cite(NOT, "סעיף 7(5)", "section 7(5)", "статья 7(5)", "البند 7(5)"),
    text: "נוטריון מוסמך [...] לקבל ולאשר תצהיר והצהרה אחרת;",
    tr: {
      en: "A notary is competent [...] to receive and certify an affidavit and another declaration;",
      ru: "Нотариус уполномочен [...] принимать и удостоверять аффидевит и иное заявление;",
      ar: "كاتب العدل مخوّل [...] تلقّي إفادة مشفوعة بالقسم وتصريح آخر والمصادقة عليهما؛",
    },
    url: SOURCES.notaries,
  },
  n8: {
    cite: cite(NOT, "סעיף 8", "section 8", "статья 8", "البند 8"),
    text: "פעולה מן הפעולות המפורטות בסעיף 7(1), (3), (7), (8) ו־(9), כשהמסמך הנוטריוני דרוש לצרכי שימוש בחוץ לארץ, לרבות נציגות של מדינת חוץ בישראל, לא תיעשה אלא בידי נוטריון.",
    tr: {
      en: "An act among those listed in section 7(1), (3), (7), (8) and (9), where the notarial document is required for use abroad, including a foreign state's representation in Israel, shall be done only by a notary. (7(1) is signature authentication, 7(3) is certifying a copy.)",
      ru: "Действие из перечисленных в статье 7(1), (3), (7), (8) и (9), когда нотариальный документ нужен для использования за границей, в том числе в представительстве иностранного государства в Израиле, совершается только нотариусом. (7(1): удостоверение подписи, 7(3): удостоверение копии.)",
      ar: "الأعمال المذكورة في البند 7(1)، (3)، (7)، (8) و(9)، عندما يكون المستند التوثيقي مطلوبًا للاستعمال خارج البلاد، بما في ذلك لدى ممثلية دولة أجنبية في إسرائيل، لا تُنجز إلا على يد كاتب عدل. (7(1): المصادقة على التوقيع، 7(3): المصادقة على نسخة.)",
    },
    url: SOURCES.notaries,
  },
  n11: {
    cite: cite(NOT, "סעיף 11", "section 11", "статья 11", "البند 11"),
    text: "לא יאמת נוטריון חתימתו של אדם על מסמך אלא אם החותם עמד לפניו, זוהה וחתם בפניו על המסמך.",
    tr: {
      en: "A notary shall not authenticate a person's signature on a document unless the signatory stood before the notary, was identified and signed the document in the notary's presence.",
      ru: "Нотариус не удостоверяет подпись лица на документе, если подписавший не явился к нему, не был идентифицирован и не подписал документ в его присутствии.",
      ar: "لا يصادق كاتب العدل على توقيع شخص على مستند إلا إذا مثل الموقّع أمامه، وتم التحقق من هويته، ووقّع المستند بحضوره.",
    },
    url: SOURCES.notaries,
  },
  n12: {
    cite: cite(NOT, "סעיף 12", "section 12", "статья 12", "البند 12"),
    text: "לא יאשר נוטריון שמסמך פלוני הוא העתק נכון מהמקור, אלא אם המקור הוצג לפניו והוא השווה זה אל זה ומצאם שווים.",
    tr: {
      en: "A notary shall not certify that a document is a true copy of the original unless the original was presented to the notary and the notary compared the two and found them identical.",
      ru: "Нотариус не удостоверяет, что документ является верной копией оригинала, если оригинал не был ему представлен и он не сравнил их и не нашёл их идентичными.",
      ar: "لا يصادق كاتب العدل على أن مستندًا ما نسخة مطابقة للأصل إلا إذا عُرض عليه الأصل وقارن بينهما ووجدهما متطابقين.",
    },
    url: SOURCES.notaries,
  },
  n15: {
    cite: cite(NOT, "סעיף 15", "section 15", "статья 15", "البند 15"),
    text: "לא יאשר נוטריון נכונותו של תרגום אלא אם הוא שולט בשפה שבה נערך המקור ובשפה שאליה תורגם, והוא עצמו ערך את התרגום או בדק את נכונותו.",
    tr: {
      en: "A notary shall not certify the accuracy of a translation unless the notary masters the language of the original and the language into which it was translated, and the notary personally made the translation or checked its accuracy.",
      ru: "Нотариус не удостоверяет верность перевода, если он не владеет языком оригинала и языком, на который сделан перевод, и если он сам не выполнил перевод или не проверил его верность.",
      ar: "لا يصادق كاتب العدل على صحة ترجمة إلا إذا كان يتقن اللغة التي حُرّر بها الأصل واللغة التي تُرجم إليها، وكان هو نفسه قد أعدّ الترجمة أو تحقق من صحتها.",
    },
    url: SOURCES.notaries,
  },
  n16: {
    cite: cite(NOT, "סעיף 16", "section 16", "статья 16", "البند 16"),
    text: "לא יאשר נוטריון כי ביום פלוני היה אדם פלוני בחיים אלא אם עמד לפניו האדם באותו יום וזוהה.",
    tr: {
      en: "A notary shall not certify that on a certain day a certain person was alive unless that person stood before the notary on that day and was identified.",
      ru: "Нотариус не удостоверяет, что в определённый день определённое лицо было живо, если это лицо не явилось к нему в тот день и не было идентифицировано.",
      ar: "لا يصادق كاتب العدل على أن شخصًا معينًا كان على قيد الحياة في يوم معين إلا إذا مثل ذلك الشخص أمامه في ذلك اليوم وتم التحقق من هويته.",
    },
    url: SOURCES.notaries,
  },
  n20a: {
    cite: cite(NOT, "סעיף 20(א)", "section 20(a)", "статья 20(א)", "البند 20(أ)"),
    text: "יפוי־כוח כללי ויפוי־כוח לביצוע עיסקאות במקרקעין הטעונות רישום במרשם המקרקעין, לא יהיו בני־תוקף אלא אם ערך אותם נוטריון או אימת את החתימות שעליהם, כאמור בחוק זה ובתקנות על פיו; הוראה זו אינה גורעת מסעיף 91 לחוק הלשכה.",
    tr: {
      en: "A general power of attorney and a power of attorney for real-estate transactions that require registration in the land registry shall be valid only if a notary prepared them or authenticated the signatures on them, as provided in this Law and the regulations under it; this provision does not derogate from section 91 of the Bar Law.",
      ru: "Генеральная доверенность и доверенность на сделки с недвижимостью, подлежащие регистрации в реестре недвижимости, действительны, только если их составил нотариус или он удостоверил подписи на них, как предусмотрено настоящим Законом и правилами на его основании; это положение не умаляет статью 91 Закона о коллегии адвокатов.",
      ar: "التوكيل العام والتوكيل لتنفيذ صفقات عقارية تتطلب التسجيل في سجل العقارات لا يكونان ساريي المفعول إلا إذا حرّرهما كاتب عدل أو صادق على التواقيع عليهما، كما ورد في هذا القانون والأنظمة بموجبه؛ ولا ينتقص هذا الحكم من البند 91 من قانون نقابة المحامين.",
    },
    url: SOURCES.notaries,
  },
  n20a1: {
    cite: cite(NOT, "סעיף 20(א1), בנוסח תיקון מס׳ 12, התשפ״ו-2026", "section 20(a1), as enacted by Amendment No. 12, 2026", "статья 20(א1), в редакции поправки № 12, 2026", "البند 20(أ1)، بصيغة التعديل رقم 12، 2026"),
    text: "על אף האמור בסעיף קטן (א), ייפוי כוח שניתן לתאגיד בנקאי כהגדרתו בחוק הבנקאות (שירות ללקוח), התשמ״א-1981, לביצוע עסקת משכנתה, לרבות ביטולה, העברתה, שינוי בתנאיה או כל פעולה אחרת הכרוכה ברישום העסקה, יהיה תקף אף אם לא ערך אותו נוטריון או אימת את החתימות שעליו.",
    tr: {
      en: "Notwithstanding subsection (a), a power of attorney given to a banking corporation as defined in the Banking (Customer Service) Law, 1981, for carrying out a mortgage transaction, including its cancellation, transfer, a change in its terms or any other act involved in registering the transaction, shall be valid even if a notary did not prepare it or authenticate the signatures on it.",
      ru: "Несмотря на сказанное в подстатье (א), доверенность, выданная банковской корпорации, как она определена в Законе о банковском деле (обслуживание клиентов) 1981 года, на совершение ипотечной сделки, включая её отмену, передачу, изменение её условий или любое иное действие, связанное с регистрацией сделки, действительна, даже если её не составил нотариус и он не удостоверил подписи на ней.",
      ar: "على الرغم مما ورد في البند الفرعي (أ)، فإن التوكيل الممنوح لمؤسسة مصرفية وفق تعريفها في قانون المصارف (خدمة الزبائن) لسنة 1981، لتنفيذ صفقة رهن عقاري، بما في ذلك إلغاؤها أو نقلها أو تغيير شروطها أو أي عمل آخر مرتبط بتسجيل الصفقة، يكون ساري المفعول حتى لو لم يحرّره كاتب عدل أو لم يصادق على التواقيع عليه.",
    },
    url: SOURCES.notaries,
    url2: { href: SOURCES.amendment12, label: { he: "ספר החוקים 3495, עמ׳ 280 (3.2.2026)", en: "Sefer HaChukim 3495, p. 280 (3.2.2026)", ru: "Сефер ха-Хуким 3495, с. 280 (3.2.2026)", ar: "كتاب القوانين 3495، ص 280 (3.2.2026)" } },
  },
  n20b: {
    cite: cite(NOT, "סעיף 20(ב)", "section 20(b)", "статья 20(ב)", "البند 20(ب)"),
    text: "סעיף זה אינו חל על יפוי־כוח שניתן בחוץ־לארץ לפי דיני המקום שבו ניתן.",
    tr: {
      en: "This section does not apply to a power of attorney given abroad under the law of the place where it was given.",
      ru: "Настоящая статья не применяется к доверенности, выданной за границей по законам места её выдачи.",
      ar: "لا يسري هذا البند على توكيل مُنح خارج البلاد وفق قوانين المكان الذي مُنح فيه.",
    },
    url: SOURCES.notaries,
  },
  n45a: {
    cite: cite(NOT, "סעיף 45(א) (האימות שאחרי האישור הנוטריוני, המכונה אפוסטיל)", "section 45(a) (the authentication after the notarial certificate, known as the apostille)", "статья 45(א) (удостоверение после нотариального акта, так называемый апостиль)", "البند 45(أ) (المصادقة بعد المصادقة التوثيقية، المعروفة بالأبوستيل)"),
    text: "חתימתו של נוטריון, בתוקף תפקידו לפי חוק זה והתקנות על פיו, על גבי מסמך הנועד לשימוש מחוץ לישראל, תאומת, על פי בקשת מעונין, בידי רשם בית־משפט שלום או עובד מדינה שמונו לכך בידי שר המשפטים.",
    tr: {
      en: "The signature of a notary, given by virtue of the notary's office under this Law and the regulations under it, on a document intended for use outside Israel shall be authenticated, at the request of an interested person, by a registrar of a magistrates' court or a state employee appointed for that purpose by the Minister of Justice.",
      ru: "Подпись нотариуса, поставленная в силу его должности по настоящему Закону и правилам на его основании, на документе, предназначенном для использования за пределами Израиля, удостоверяется по просьбе заинтересованного лица регистратором мирового суда или государственным служащим, назначенным для этого министром юстиции.",
      ar: "يُصادَق على توقيع كاتب العدل، بحكم وظيفته وفق هذا القانون والأنظمة بموجبه، على مستند معدّ للاستعمال خارج إسرائيل، بناءً على طلب صاحب مصلحة، من قِبل مسجّل محكمة صلح أو موظف دولة عيّنه وزير العدل لهذا الغرض.",
    },
    url: SOURCES.notaries,
  },
  r19a: {
    cite: { he: "תקנות הנוטריונים, תשל״ז-1977, תקנה 19א(1) (אישור נוטריוני אלקטרוני)", en: "Notaries Regulations, 1977, regulation 19A(1) (electronic notarial certificate)", ru: "Правила о нотариусах, 1977, правило 19א(1) (электронный нотариальный акт)", ar: "أنظمة كتّاب العدل، 1977، النظام 19أ(1) (مصادقة توثيقية إلكترونية)" },
    text: "נדרש אדם הניצב לפני הנוטריון לחתום בפניו על מסמך, יחתום בפני הנוטריון בחתימה ידנית או בחתימה אלקטרונית;",
    tr: {
      en: "Where a person standing before the notary is required to sign a document before the notary, the person shall sign before the notary by hand or by electronic signature;",
      ru: "Если лицо, явившееся к нотариусу, должно подписать перед ним документ, оно подписывает его перед нотариусом собственноручной или электронной подписью;",
      ar: "إذا طُلب من شخص ماثل أمام كاتب العدل أن يوقّع أمامه على مستند، يوقّع أمام كاتب العدل بتوقيع يدوي أو بتوقيع إلكتروني؛",
    },
    url: SOURCES.notariesRegs,
  },
  succ22a: {
    cite: { he: "חוק הירושה, תשכ״ה-1965, סעיף 22(א)", en: "Succession Law, 1965, section 22(a)", ru: "Закон о наследовании, 1965, статья 22(א)", ar: "قانون الإرث، 1965، البند 22(أ)" },
    text: "צוואה בפני רשות תיעשה על ידי המצווה באמירת דברי הצוואה בעל־פה בפני שופט, רשם של בית משפט או רשם לעניני ירושה, או בפני חבר של בית דין דתי, כמשמעותו בסעיף 155, או בהגשת דברי הצוואה בכתב, על ידי המצווה עצמו, לידי שופט או רשם של בית משפט, רשם לעניני ירושה או חבר בית דין דתי כאמור.",
    tr: {
      en: "A will before an authority shall be made by the testator saying the words of the will orally before a judge, a registrar of a court or a registrar of inheritance matters, or before a member of a religious court within the meaning of section 155, or by the testator personally handing the words of the will in writing to a judge or a registrar of a court, a registrar of inheritance matters or a member of a religious court as aforesaid.",
      ru: "Завещание перед органом власти совершается завещателем путём устного изложения текста завещания перед судьёй, регистратором суда или регистратором по делам наследования, или перед членом религиозного суда в смысле статьи 155, или путём передачи завещателем лично текста завещания в письменном виде судье или регистратору суда, регистратору по делам наследования или члену религиозного суда, как указано выше.",
      ar: "تُعمل الوصية أمام سلطة من قِبل الموصي بأن يتلو كلمات الوصية شفهيًا أمام قاضٍ أو مسجّل محكمة أو مسجّل شؤون الإرث، أو أمام عضو في محكمة دينية بالمعنى الوارد في البند 155، أو بأن يسلّم الموصي بنفسه كلمات الوصية مكتوبةً إلى قاضٍ أو مسجّل محكمة أو مسجّل شؤون الإرث أو عضو في محكمة دينية كما ذُكر.",
    },
    url: SOURCES.succession,
  },
  succ22f: {
    cite: { he: "חוק הירושה, סעיף 22(ו)", en: "Succession Law, section 22(f)", ru: "Закон о наследовании, статья 22(ו)", ar: "قانون الإرث، البند 22(و)" },
    text: "צוואה בפני רשות תהיה ראיה לכאורה שהאדם הנקוב בה כמצווה עשה את הצוואה ושנעשתה ביום ובמקום הנקובים בה כיום העשיה ומקומה.",
    tr: {
      en: "A will before an authority shall be prima facie evidence that the person named in it as the testator made the will and that it was made on the day and at the place stated in it as the day and place of its making.",
      ru: "Завещание перед органом власти является доказательством prima facie того, что лицо, указанное в нём как завещатель, совершило завещание и что оно было совершено в день и в месте, указанных в нём как день и место его совершения.",
      ar: "تكون الوصية أمام سلطة بيّنةً أولية على أن الشخص المذكور فيها كموصٍ هو من عمل الوصية، وأنها عُملت في اليوم والمكان المذكورين فيها كيوم عملها ومكانه.",
    },
    url: SOURCES.succession,
  },
  succ22g: {
    cite: { he: "חוק הירושה, סעיף 22(ז)", en: "Succession Law, section 22(g)", ru: "Закон о наследовании, статья 22(ז)", ar: "قانون الإرث، البند 22(ز)" },
    text: "לענין סעיף זה דין נוטריון כדין שופט.",
    tr: {
      en: "For the purpose of this section, a notary is like a judge.",
      ru: "Для целей настоящей статьи нотариус приравнивается к судье.",
      ar: "لغرض هذا البند، حكم كاتب العدل كحكم القاضي.",
    },
    url: SOURCES.succession,
  },
  prop2a: {
    cite: { he: "חוק יחסי ממון בין בני זוג, תשל״ג-1973, סעיף 2(א)", en: "Spousal Property Relations Law, 1973, section 2(a)", ru: "Закон об имущественных отношениях супругов, 1973, статья 2(א)", ar: "قانون العلاقات المالية بين الزوجين، 1973، البند 2(أ)" },
    text: "הסכם ממון טעון אישור בית המשפט לעניני משפחה [...] או בית הדין הדתי שלו סמכות השיפוט בענייני נישואין וגירושין של בני הזוג [...], וכן טעון שינוי של הסכם כזה אישור כאמור.",
    tr: {
      en: "A property agreement requires the approval of the family court [...] or of the religious court that has jurisdiction over the spouses' marriage and divorce [...], and a change to such an agreement likewise requires that approval.",
      ru: "Имущественный договор требует утверждения суда по семейным делам [...] или религиозного суда, обладающего юрисдикцией по вопросам брака и развода супругов [...]; изменение такого договора также требует такого утверждения.",
      ar: "تتطلب الاتفاقية المالية مصادقة محكمة شؤون العائلة [...] أو المحكمة الدينية صاحبة الصلاحية في شؤون زواج الزوجين وطلاقهما [...]، وكذلك يتطلب تغيير مثل هذه الاتفاقية مصادقة كهذه.",
    },
    url: SOURCES.property,
  },
  prop2c1: {
    cite: { he: "חוק יחסי ממון בין בני זוג, סעיף 2(ג1)", en: "Spousal Property Relations Law, section 2(c1)", ru: "Закон об имущественных отношениях супругов, статья 2(ג1)", ar: "قانون العلاقات المالية بين الزوجين، البند 2(ج1)" },
    text: "הסכם ממון שנכרת לפני הנישואין יכול שיאומת בידי נוטריון לפי חוק הנוטריונים, התשל״ו-1976, ובלבד שהנוטריון נוכח שבני הזוג הניצבים בפניו עשו את ההסכם בהסכמה חופשית ובהבינם את משמעותו ותוצאותיו.",
    tr: {
      en: "A property agreement made before the marriage may be certified by a notary under the Notaries Law, 1976, provided the notary is satisfied that the spouses standing before the notary made the agreement freely and understanding its meaning and consequences.",
      ru: "Имущественный договор, заключённый до брака, может быть удостоверен нотариусом согласно Закону о нотариусах 1976 года, при условии, что нотариус убедился, что явившиеся к нему супруги заключили договор добровольно, понимая его смысл и последствия.",
      ar: "يجوز أن يصادق كاتب عدل، وفق قانون كتّاب العدل لسنة 1976، على اتفاقية مالية أُبرمت قبل الزواج، شريطة أن يقتنع كاتب العدل بأن الزوجين الماثلين أمامه أبرما الاتفاقية بموافقة حرة وهما يدركان معناها ونتائجها.",
    },
    url: SOURCES.property,
  },
  n7_11: {
    cite: cite(NOT, "סעיף 7(11)", "section 7(11)", "статья 7(11)", "البند 7(11)"),
    text: "נוטריון מוסמך [...] לאמת הסכם ממון בין בני זוג, שנכרת לפני הנישואין.",
    tr: {
      en: "A notary is competent [...] to certify a property agreement between spouses that was made before the marriage.",
      ru: "Нотариус уполномочен [...] удостоверять имущественный договор между супругами, заключённый до брака.",
      ar: "كاتب العدل مخوّل [...] المصادقة على اتفاقية مالية بين زوجين أُبرمت قبل الزواج.",
    },
    url: SOURCES.notaries,
  },
  cap32yd: {
    cite: { he: "חוק הכשרות המשפטית והאפוטרופסות, תשכ״ב-1962, סעיף 32יד(א)", en: "Legal Capacity and Guardianship Law, 1962, section 32יד(א)", ru: "Закон о правоспособности и опеке, 1962, статья 32יד(א)", ar: "قانون الأهلية القانونية والوصاية، 1962، البند 32יד(א)" },
    text: "ייפוי כוח מתמשך ייחתם בידי הממנה לפני עורך דין שעבר הכשרה לעניין עריכת ייפוי כוח מתמשך, כפי שתיקבע בתקנות, ואין לו עניין אישי בייפוי הכוח.",
    tr: {
      en: "A continuing power of attorney shall be signed by the appointer before a lawyer who completed training in drawing up continuing powers of attorney, as set in regulations, and who has no personal interest in the power of attorney.",
      ru: "Длящаяся доверенность подписывается доверителем перед адвокатом, прошедшим подготовку по составлению длящихся доверенностей, как будет установлено в правилах, и не имеющим личной заинтересованности в доверенности.",
      ar: "يوقّع المُوكِّل على التوكيل المستمر أمام محامٍ اجتاز تأهيلًا في تحرير التوكيلات المستمرة، كما سيُحدَّد في الأنظمة، ولا مصلحة شخصية له في التوكيل.",
    },
    url: SOURCES.capacity,
  },
  cap32yg: {
    cite: { he: "חוק הכשרות המשפטית והאפוטרופסות, סעיף 32יג(ט)", en: "Legal Capacity and Guardianship Law, section 32יג(ט)", ru: "Закон о правоспособности и опеке, статья 32יג(ט)", ar: "قانون الأهلية القانونية والوصاية، البند 32יג(ט)" },
    text: "על אף האמור בכל דין, ייפוי כוח שנערך לפי חוק זה אינו טעון אישור אחר.",
    tr: {
      en: "Notwithstanding any law, a power of attorney made under this Law does not require any other approval.",
      ru: "Несмотря на положения любого закона, доверенность, составленная по настоящему Закону, не требует иного удостоверения.",
      ar: "على الرغم مما ورد في أي قانون، لا يحتاج التوكيل المحرَّر وفق هذا القانون إلى أي مصادقة أخرى.",
    },
    url: SOURCES.capacity,
  },
};

/** הסעיפים לפי סוג הפעולה (pricingKey) */
const BY_TYPE: Record<string, string[]> = {
  translation: ["n15", "n45a"],
  signature: ["n11", "r19a", "n8", "n45a"],
  poa: ["n20a", "n20b", "n11", "n45a"],
  affidavit: ["n7_5", "n45a"],
  will: ["succ22a", "succ22g", "succ22f"],
  prenup: ["prop2c1", "n7_11", "prop2a"],
  certifiedCopy: ["n12", "n8", "n45a"],
  lifeCertificate: ["n16", "n45a"],
};

/** עמודים שהכלל שלהם שונה מסוג הפעולה */
const BY_SLUG: Record<string, string[]> = {
  "mortgage-poa": ["n20a1", "n20a"],
  "continuing-power-of-attorney": ["cap32yd", "cap32yg"],
  "postnuptial-agreement": ["prop2a", "prop2c1", "n7_11"],
  "translator-declaration": ["n7_5", "n15"],
};

export function quotesFor(slug: string, pricingKey: string): LawQuote[] {
  return (BY_SLUG[slug] || BY_TYPE[pricingKey] || []).map((id) => Q[id]);
}

/**
 * עמודים שבהם הפעולה אינה פעולה נוטריונית (ייפוי כוח מתמשך), או שנוטריון אינו מוסמך לה (הסכם ממון אחרי הנישואין):
 * לא מציגים בהם את מחשבון השכר הנוטריוני.
 */
export const NO_NOTARIAL_FEE = new Set(["continuing-power-of-attorney", "postnuptial-agreement"]);

export const UI: Record<L | "fr" | "es", { title: string; intro: string; source: string; read: string; unofficial: string }> = {
  he: { title: "מה הדין קובע", intro: "הסעיפים שחלים על הפעולה, מילה במילה. הנוסח מוויקיטקסט, שאינו הנוסח הרשמי.", source: "נוסח בוויקיטקסט", read: "נקרא ב-", unofficial: "" },
  en: { title: "What the law says", intro: "The sections that apply, quoted word for word in Hebrew from Wikisource (not the official version), each followed by an unofficial translation.", source: "Hebrew text on Wikisource", read: "read on ", unofficial: "Unofficial translation: " },
  ru: { title: "Что говорит закон", intro: "Применимые статьи дословно на иврите по тексту Викитеки (не официальная редакция), за каждой следует неофициальный перевод.", source: "Текст на иврите в Викитеке", read: "прочитано ", unofficial: "Неофициальный перевод: " },
  ar: { title: "ماذا يقول القانون", intro: "البنود السارية مقتبسة حرفيًا بالعبرية من ويكي مصدر (ليست الصيغة الرسمية)، ويلي كل بند ترجمة غير رسمية.", source: "النص العبري في ويكي مصدر", read: "قُرئ في ", unofficial: "ترجمة غير رسمية: " },
  fr: { title: "What the law says", intro: "The sections that apply, quoted word for word in Hebrew from Wikisource (not the official version), each followed by an unofficial translation.", source: "Hebrew text on Wikisource", read: "read on ", unofficial: "Unofficial translation: " },
  es: { title: "What the law says", intro: "The sections that apply, quoted word for word in Hebrew from Wikisource (not the official version), each followed by an unofficial translation.", source: "Hebrew text on Wikisource", read: "read on ", unofficial: "Unofficial translation: " },
};

/** פנייה כללית למשרד, במקום קריאת הוואטסאפ של כל עמוד */
export const GENERAL_CONTACT: Record<string, { title: string; text: string; whatsapp: string; email: string; back: string }> = {
  he: { title: "שאלה כללית למשרד", text: "האתר מסביר את הדין על פעולות נוטריוניות. הוא אינו מציע ביצוע של פעולה נוטריונית, ואינו ייעוץ משפטי. לשאלה כללית למשרד עורכי הדין BEITON:", whatsapp: "וואטסאפ", email: "מייל", back: "חזרה לעמוד הראשי" },
  en: { title: "A general question to the office", text: "This site explains the law on notarial acts in Israel. It does not offer to perform a notarial act, and it is not legal advice. For a general question to the BEITON law office:", whatsapp: "WhatsApp", email: "Email", back: "Back to home" },
  ru: { title: "Общий вопрос в офис", text: "Этот сайт объясняет законодательство Израиля о нотариальных действиях. Он не предлагает совершить нотариальное действие и не является юридической консультацией. С общим вопросом в адвокатскую контору BEITON:", whatsapp: "WhatsApp", email: "Эл. почта", back: "На главную" },
  ar: { title: "سؤال عام للمكتب", text: "يشرح هذا الموقع القانون المتعلق بالأعمال التوثيقية في إسرائيل. وهو لا يعرض تنفيذ عمل توثيقي، وليس استشارة قانونية. لسؤال عام لمكتب المحاماة BEITON:", whatsapp: "واتساب", email: "البريد الإلكتروني", back: "العودة إلى الصفحة الرئيسية" },
  fr: { title: "Une question générale au cabinet", text: "Ce site explique le droit israélien applicable aux actes notariés. Il ne propose pas d'accomplir un acte notarié et ne constitue pas un conseil juridique. Pour une question générale au cabinet d'avocats BEITON :", whatsapp: "WhatsApp", email: "E-mail", back: "Retour à l'accueil" },
  es: { title: "Una consulta general al despacho", text: "Este sitio explica el derecho israelí sobre los actos notariales. No ofrece realizar un acto notarial y no constituye asesoramiento jurídico. Para una consulta general al despacho de abogados BEITON:", whatsapp: "WhatsApp", email: "Correo electrónico", back: "Volver al inicio" },
};

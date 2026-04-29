/**
 * Monday.com board + column ID registry.
 *
 * Source of truth for all board/column IDs used by the notary website
 * backend (chat API, admin API, lead→case automation).
 *
 * When a column changes on Monday (renamed, moved, deleted) — update this file.
 *
 * Boards:
 * - SALES_FUNNEL: 18406004253 — "פאנל מכירות Agent 1"
 * - CASES: 18405886266 — "תיקי לקוחות"
 */

export const MONDAY_URL = "https://api.monday.com/v2";

// ===========================================================================
// SALES FUNNEL BOARD (18406004253)
// ===========================================================================

export const SALES_BOARD_ID = "18406004253";

export const SALES_GROUPS = {
  active: "group_mm1wxy0k",          // שיחות פעילות
  awaitingQuote: "group_mm1wsgy9",   // ממתינים לשליחת הצעה
  lost: "group_mm1w8dgb",            // לא נסגרו — לניתוח
  won: "group_mm1wskwy",             // נסגרו — עסקאות
} as const;

export const SALES_COLS = {
  // --- existing columns ---
  assignee: "multiple_person_mm1y21bh",     // אחראי
  phone: "phone_mm1y71kv",                  // פלאפון
  email: "email_mm1y3e3",                   // אימייל
  mainStatus: "color_mm1wcc5y",             // שלב בפאנל (was "status")
  lostReason: "color_mm1w6vt8",             // סיבת אי-סגירה
  language: "color_mm1wgvgc",               // שפה
  service: "color_mm1wjcxx",                // שירות מבוקש
  channel: "color_mm1wj0mz",                // ערוץ
  inquiryDate: "date_mm1w6eek",             // תאריך פנייה
  msgCount: "numeric_mm1wtzxs",             // מספר הודעות
  // quoteAmount removed from board — use totalAmount instead
  liveTranscript: "long_text_mm1wcw3e",     // תמלול שיחה — נכתב חי בכל הודעה (idempotent overwrite, repurposed from legacy agentAnalysis)
  futureLesson: "long_text_mm1wq6kg",       // לקח לשיחות הבאות
  transcriptLink: "link_mm1wxe9b",          // תמלול שיחה (link)
  linkedCase: "board_relation_mm1w1vza",    // תיק שנפתח
  followup: "color_mm1wbhmq",               // פולואפ
  // needsAttention removed from board
  utmSource: "text_mm1za260",               // מקור הגעה (UTM)
  landingPage: "text_mm1z9by5",             // Landing Page

  // --- new columns (2026-04-05) ---
  summaryForNotary: "long_text_mm24zb8f",   // סיכום לנוטריון (שורה תחתונה)
  missingInfo: "long_text_mm24vqvw",        // מה חסר מהלקוח להשלמה
  clientQuestions: "long_text_mm24xhyb",    // שאלות וחששות הלקוח
  // fullTranscript column removed — transcript goes as Monday "update" (comment)
  chatFiles: "file_mm24mvk2",               // קבצים מהצ'אט
  clientAddress: "text_mm244awg",             // כתובת הלקוח (renamed from עיר)
  targetCountry: "text_mm24ff9n",           // מדינת יעד
  languagePair: "text_mm24bqv7",            // צמד שפות (לתרגום)
  quantityDescription: "text_mm248sjq",     // כמות ופירוט (טקסט חופשי)
  urgency: "color_mm24rx5f",                // דחיפות
  clientWaitingFor: "color_mm24f7jn",       // הלקוח מחכה ל…
  nextActionDate: "date_mm24863m",          // תאריך פעולה הבאה
  quotePdf: "file_mm24v4de",                // PDF הצעת מחיר
  clientName: "text_mm276sbx",              // שם לקוח

  // --- pricing breakdown (2026-04-08) --- mirrors Cases board structure
  notaryFee: "numeric_mm27qj1d",            // שכר נוטריוני (₪)
  translationFee: "numeric_mm27h68z",        // שכר תרגום (₪)
  govFees: "numeric_mm27gzy7",               // אגרות ממשלתיות (₪)
  handlingFee: "numeric_mm276g3s",           // דמי טיפול (₪)
  surcharges: "numeric_mm278dr5",            // תוספות (₪)
  shippingFee: "numeric_mm27z1g5",           // משלוח / שליחויות (₪)
  subtotalBeforeVat: "numeric_mm2717rs",     // סה״כ לפני מע״מ (₪)
  vatAmount: "numeric_mm27f9zg",             // מע״מ (₪)
  totalAmount: "numeric_mm27a8ce",           // סה״כ לתשלום (₪)
  wordCount: "numeric_mm27t4rf",             // מספר מילים
  documentType: "text_mm27ap4h",             // סוג מסמך
  deliveryMethod: "color_mm27zq45",          // אופן הספקה
  apostilleNeeded: "color_mm27pzft",         // אפוסטיל נדרש
} as const;

// Status labels (must exist on the board — do not invent new ones at runtime)
export const SALES_STATUS_LABELS = {
  mainStatus: {
    initialInquiry: "פנייה ראשונית",
    serviceIdentified: "זיהוי שירות",
    quoteSent: "הצעת מחיר נשלחה",
    quoteApproved: "הצעה אושרה",
    paymentReceived: "תשלום בוצע",
    docsReceived: "קיבל מסמכים",
    abandoned: "נטש באמצע",
    rejected: "סירב להצעה",
  },
  language: {
    he: "עברית", en: "English", ru: "Русский", ar: "العربية", fr: "Français", es: "Español",
  } as Record<string, string>,
  service: {
    translation: "תרגום נוטריוני",
    signature: "אימות חתימה",
    poa: "ייפוי כוח",
    affidavit: "תצהיר",
    certifiedCopy: "העתק נאמן למקור",
    will: "צוואה",
    prenup: "הסכם ממון",
    apostille: "אפוסטיל",
    lifeCertificate: "אישור חיים",
    notIdentified: "לא זוהה",
  },
  channel: {
    website: "אתר",
    whatsapp: "WhatsApp",
    phone: "טלפון",
    email: "מייל",
  },
  urgency: {
    standard: "רגיל",
    urgent: "דחוף (+50%)",
    immediate: "מיידי (+100%)",
  },
  clientWaitingFor: {
    firstResponse: "למענה ראשוני של נוטריון",
    quote: "להצעת מחיר",
    docCoordination: "לתיאום מסמכים",
    meeting: "לתיאום פגישה",
    quoteApproval: "לאישור הצעה",
    payment: "לתשלום",
    execution: "לביצוע השירות",
  },
} as const;

// ===========================================================================
// CASES BOARD (18405886266)
// ===========================================================================

export const CASES_BOARD_ID = "18405886266";

export const CASES_GROUPS = {
  newCases: "group_mm1v8nwp",         // תיקים חדשים
  inProgress: "group_mm1v52f8",       // בעבודה
  awaitingReview: "group_mm1v87gh",   // ממתינים לבדיקת נוטריון
  readyForDelivery: "group_mm1vj63v", // מוכן למסירה
  completed: "group_mm1v8a79",        // הושלם ונמסר
} as const;

export const CASES_COLS = {
  // --- existing columns ---
  caseStatus: "color_mm1vcxzr",             // סטטוס תיק
  service: "color_mm1vbk8y",                // סוג שירות
  language: "color_mm1vc851",               // שפת לקוח
  phone: "phone_mm1vthye",                  // טלפון
  email: "email_mm1v554r",                  // אימייל
  notaryFee: "numeric_mm1vza1d",            // שכר נוטריוני (₪)
  translationFee: "numeric_mm1vzx90",       // שכר תרגום (₪)
  total: "numeric_mm1vw4jg",                // סה״כ ללקוח (₪)
  intakeDate: "date_mm1v7c05",              // תאריך קליטה
  targetCompletion: "date_mm1vdfn3",        // צפי סיום
  assignedNotary: "multiple_person_mm1vc6wg", // נוטריון אחראי
  transcriptLink: "link_mm1v756d",          // תמלול שיחה
  sourceFiles: "file_mm1vm9b2",             // מסמכי מקור
  deliverables: "file_mm1v2e49",            // תוצרים
  languageText: "text_mm1vh4e8",            // שפות (text)
  deliveryMethod: "color_mm1vk3aa",         // אופן הספקה
  wordCount: "numeric_mm1vwfe4",            // מספר מילים
  urgency: "color_mm1vt8mc",                // דחיפות
  needsApostille: "boolean_mm1vsf4d",       // אפוסטיל נדרש
  notes: "long_text_mm1vehrv",              // הערות
  qaResult: "color_mm1wmaxr",               // תוצאת QA
  revisionCount: "numeric_mm1wgesk",        // מספר תיקונים
  finalDocument: "file_mm1wyttx",           // מסמך סופי מאושר
  govFees: "numeric_mm1yja2r",              // אגרות ממשלתיות (₪)
  shippingFee: "numeric_mm1ywac8",          // שליחות (₪)
  surcharges: "numeric_mm1ysyx1",           // תוספות (₪)
  subtotalBeforeVat: "numeric_mm1y26b2",    // סה"כ לפני מע"מ (₪)
  vat: "numeric_mm1y8bjw",                  // מע"מ (₪)
  chargesBreakdown: "long_text_mm1ykrqb",   // פירוט חיובים

  // --- new columns (2026-04-05) ---
  clientName: "text_mm24x1ax",              // שם לקוח
  address: "text_mm24qsz1",                 // כתובת
  targetCountry: "text_mm24rbz3",           // מדינת יעד
  sourceLeadLink: "link_mm24qz7j",          // קישור לליד מקורי
  paymentDate: "date_mm24qesf",             // תאריך תשלום
  amountPaid: "numeric_mm24kq7t",           // שולם בפועל (₪)
  invoiceNumber: "text_mm24bdwm",           // מספר חשבונית עסקה
  taxInvoiceNumber: "text_mm24a0ek",        // מספר חשבונית מס
  paymentMethod: "color_mm24aghb",          // אמצעי תשלום
  apostilleStatus: "color_mm24rc23",        // סטטוס אפוסטיל
  shippingStatus: "color_mm24jmbc",         // סטטוס משלוח
  clientCommStatus: "color_mm24d99g",       // סטטוס תקשורת לקוח
  lastClientUpdate: "date_mm24faw5",        // עדכון אחרון ללקוח
  satisfactionRating: "numeric_mm24s3q4",   // דירוג שביעות רצון
} as const;

export const CASES_STATUS_LABELS = {
  caseStatus: {
    newInquiry: "פנייה חדשה",
    quoteStage: "הצעת מחיר",
    awaitingDocs: "ממתין למסמכים",
    missingDocs: "חסרים מסמכים",
    inProgress: "בעבודה",
    awaitingReview: "ממתין לבדיקה",
    notarySignature: "חתימת נוטריון",
    readyForDelivery: "מוכן למסירה",
    awaitingPayment: "ממתין לתשלום",
    delivered: "נמסר",
  },
  paymentMethod: {
    bankTransfer: "העברה בנקאית",
    creditCard: "אשראי",
    bit: "ביט",
    payBox: "PayBox",
    cash: "מזומן",
    check: "המחאה",
  },
  apostilleStatus: {
    notNeeded: "לא נדרש",
    awaitingOriginal: "ממתין לתעודה מקורית",
    atCourt: "בבית משפט",
    atMfa: "במשרד החוץ",
    completed: "הושלם",
  },
  shippingStatus: {
    digital: "דיגיטלי",
    atOffice: "במשרד — ממתין לאיסוף",
    courierOut: "שליח יוצא",
    courierEnRoute: "שליח בדרך",
    delivered: "נמסר",
  },
  clientCommStatus: {
    updated: "עודכן",
    awaitingResponse: "ממתין לתשובה",
    requestedChange: "ביקש שינוי",
    noResponse: "לא ענה",
  },
  deliveryMethod: {
    digital: "דיגיטלי",
    officeMeeting: "פגישה במשרד",
    selfPickup: "איסוף עצמי",
    delivery: "שליח דלוורי",
    homeVisit: "נוטריון עד הבית",
  },
} as const;

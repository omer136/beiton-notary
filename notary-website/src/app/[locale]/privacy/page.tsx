import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | Privacy Policy — BEITON & Co",
  robots: "noindex, follow",
};

const he = {
  title: "מדיניות פרטיות",
  subtitle: "אתר notary.beiton.co",
  lastUpdated: "עדכון אחרון: מרץ 2026",
  sections: [
    {
      heading: "1. כללי",
      body: 'מדיניות פרטיות זו חלה על אתר notary.beiton.co המופעל על ידי משרד עורכי דין BEITON & Co (להלן: "המשרד"). המדיניות מפרטת כיצד המשרד אוסף, משתמש ושומר מידע אודות משתמשי האתר, בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, ותקנות הגנת הפרטיות (אבטחת מידע), התשע"ז-2017.\nמסירת מידע אישי באתר נעשית מרצונך החופשי. אינך חייב/ת על פי חוק למסור מידע, אולם ללא מסירת פרטים מסוימים לא ניתן יהיה לספק את השירות המבוקש.',
    },
    {
      heading: "2. מידע שנאסף",
      body: "מידע שנמסר ביוזמת המשתמש: שם, טלפון, דוא\"ל, כתובת (לצורך שליחות) ופרטי הפנייה — הנמסרים בטופס יצירת קשר, בצ'אט או בוואטסאפ.\n\nמסמכים אישיים שנמסרים ביוזמת המשתמש: לצורך מתן השירות הנוטריוני, המשתמש עשוי למסור למשרד מסמכים אישיים, לרבות צילומי תעודת זהות או דרכון, תעודות ציבוריות (לידה, נישואין, גירושין, פטירה, תעודות אקדמיות), מסמכים משפטיים, עסקיים או רפואיים, וכל מסמך אחר הנדרש לביצוע הפעולה הנוטריונית. מסמכים אלה נמסרים ביוזמת המשתמש ומרצונו החופשי, ומשמשים אך ורק לצורך מתן השירות המבוקש.\n\nמידע שנאסף באופן אוטומטי: כתובת IP, סוג דפדפן ומערכת הפעלה, דפי האתר בהם צפית, מקור ההגעה לאתר ומשך הגלישה — באמצעות עוגיות (Cookies) וכלי ניתוח (Google Analytics, Meta Pixel).",
    },
    {
      heading: "3. מטרות השימוש במידע",
      body: "המשרד משתמש במידע שנאסף למטרות הבאות בלבד: טיפול בפנייה ומתן שירות נוטריוני, תיאום מול נוטריונים ושליחים הפועלים מטעם המשרד לצורך מתן השירות, שיפור חוויית השימוש באתר, ניתוח סטטיסטי של תנועת הגולשים (ללא זיהוי אישי), ושליחת הודעות הקשורות לשירות שהתבקש — בכפוף להסכמת המשתמש.",
    },
    {
      heading: "4. עוגיות (Cookies)",
      body: "האתר משתמש בעוגיות לצורך תפעול תקין, זכירת העדפות שפה וניתוח שימוש. ניתן לחסום עוגיות בהגדרות הדפדפן, אך הדבר עלול לפגוע בתפקוד האתר. בכניסה הראשונה לאתר מוצגת הודעת עוגיות עם אפשרות לקבל או לדחות.",
    },
    {
      heading: "5. העברת מידע לצדדים שלישיים",
      body: "נותני שירות מטעם המשרד: שירותי הנוטריון ניתנים על ידי המשרד ו/או על ידי נוטריונים מוסמכים הפועלים מטעמו. שירותי שליחות ואיסוף מסמכים מתבצעים באמצעות שליחים חיצוניים. לצורך מתן השירות, המשרד מעביר לנותני שירות אלה את המידע והמסמכים הנדרשים להם בלבד — לרבות פרטי זיהוי (שם, כתובת), מסמכים אישיים שנמסרו על ידי המשתמש, וכל מידע אחר הדרוש לביצוע הפעולה הנוטריונית. כל נותני השירות מחויבים לסודיות מקצועית ולשימוש במידע ובמסמכים אך ורק למטרת מתן השירות.\n\nכלי ניתוח: האתר משתמש בשירותי צד שלישי לניתוח נתונים (Google Analytics, Meta Pixel) אשר עשויים לאסוף מידע לא מזהה. לפירוט מדיניות הפרטיות של שירותים אלה, יש לעיין באתריהם.\n\nהעברה לפי דין: המשרד לא ימכור, ישכיר או יעביר מידע אישי לצדדים שלישיים שלא פורטו לעיל, למעט מילוי חובה חוקית או צו שיפוטי.",
    },
    {
      heading: "6. מערכת ניהול לקוחות",
      body: "פרטי הפנייה, המסמכים שנמסרו והתקשורת עם המשרד נשמרים במערכת ניהול לקוחות מאובטחת. מערכת זו נגישה לצוות המשרד ולנותני השירות הרלוונטיים בלבד, לצורך טיפול בפנייה ומעקב אחר ההזמנה. מסמכים אישיים יישמרו לתקופה הנדרשת למתן השירות ולעמידה בחובות לפי דין, ולאחר מכן יימחקו.",
    },
    {
      heading: "7. אבטחת מידע",
      body: "המשרד נוקט אמצעי אבטחה סבירים להגנה על המידע, לרבות שימוש בפרוטוקול HTTPS, אחסון מאובטח והגבלת גישה למורשים בלבד. עם זאת, אין באפשרות המשרד להבטיח הגנה מוחלטת מפני חדירה בלתי מורשית.",
    },
    {
      heading: "8. זכויות המשתמש",
      body: "בהתאם לחוק הגנת הפרטיות, זכותך לעיין במידע השמור אודותיך, לבקש לתקנו או למחקו. לשם כך, ניתן לפנות למשרד בדוא\"ל office@beiton.co. המשרד יטפל בפנייה בתוך 30 ימים. מידע הנדרש למשרד לפי דין ימשיך להישמר גם לאחר בקשת מחיקה.",
    },
    {
      heading: "9. קטינים",
      body: "האתר אינו מיועד לשימוש על ידי קטינים מתחת לגיל 18. המשרד אינו אוסף ביודעין מידע אישי מקטינים.",
    },
    {
      heading: "10. שינויים במדיניות",
      body: "המשרד רשאי לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו בעמוד הראשי של האתר. המשך שימוש באתר לאחר עדכון מהווה הסכמה למדיניות המעודכנת.",
    },
    {
      heading: "11. יצירת קשר",
      body: "לשאלות בנוגע למדיניות הפרטיות ניתן לפנות: office@beiton.co",
    },
  ],
};

const en = {
  title: "Privacy Policy",
  subtitle: "notary.beiton.co",
  lastUpdated: "Last updated: March 2026",
  sections: [
    {
      heading: "1. General",
      body: 'This Privacy Policy applies to notary.beiton.co, operated by BEITON & Co, Law Firm (the "Firm"). This policy describes how the Firm collects, uses, and stores information about Website users, in accordance with the Protection of Privacy Law, 1981, and the Protection of Privacy Regulations (Data Security), 2017.\nProviding personal information on the Website is voluntary. You are not required by law to provide information; however, without certain details, the Firm may be unable to provide the requested service.',
    },
    {
      heading: "2. Information Collected",
      body: "Information provided voluntarily by the user: name, phone number, email address, physical address (for courier services), and inquiry details — submitted via the contact form, chat, or WhatsApp.\n\nPersonal documents provided voluntarily by the user: for the purpose of providing the notary service, the user may submit personal documents to the Firm, including copies of identity cards or passports, public certificates (birth, marriage, divorce, death, academic diplomas), legal, business, or medical documents, and any other document required to perform the notarial action. These documents are submitted voluntarily and are used solely for the purpose of providing the requested service.\n\nInformation collected automatically: IP address, browser type and operating system, pages viewed, referral source, and browsing duration — via cookies and analytics tools (Google Analytics, Meta Pixel).",
    },
    {
      heading: "3. Purposes of Use",
      body: "The Firm uses collected information solely for the following purposes: processing inquiries and providing notary services, coordination with notaries and couriers acting on behalf of the Firm, improving the Website user experience, statistical analysis of visitor traffic (without personal identification), and sending service-related notifications — subject to user consent.",
    },
    {
      heading: "4. Cookies",
      body: "The Website uses cookies for proper operation, remembering language preferences, and usage analysis. Cookies may be blocked in browser settings, though this may impair Website functionality. A cookie notice with options to accept or decline is displayed upon first visit.",
    },
    {
      heading: "5. Transfer of Information to Third Parties",
      body: "Service providers on behalf of the Firm: notary services are provided by the Firm and/or by licensed notaries acting on its behalf. Courier and document collection services are performed by external couriers. For the purpose of providing the service, the Firm transfers to these service providers only the information and documents required — including identification details (name, address), personal documents submitted by the user, and any other information necessary to perform the notarial action. All service providers are bound by professional confidentiality and may use the information and documents solely for the purpose of providing the service.\n\nAnalytics tools: the Website uses third-party analytics services (Google Analytics, Meta Pixel) that may collect non-identifying information. For details on their privacy policies, please refer to their respective websites.\n\nTransfer by law: the Firm will not sell, rent, or transfer personal information to third parties not specified above, except to comply with a legal obligation or court order.",
    },
    {
      heading: "6. Client Management System",
      body: "Inquiry details, submitted documents, and communications with the Firm are stored in a secure client management system. This system is accessible only to the Firm's team and relevant service providers, for the purpose of processing inquiries and tracking orders. Personal documents are retained for the period required to provide the service and comply with legal obligations, and are deleted thereafter.",
    },
    {
      heading: "7. Data Security",
      body: "The Firm takes reasonable security measures to protect information, including the use of HTTPS protocol, secure storage, and access restricted to authorized personnel only. However, the Firm cannot guarantee absolute protection against unauthorized access.",
    },
    {
      heading: "8. User Rights",
      body: "Under the Protection of Privacy Law, you have the right to review information stored about you, request its correction, or request its deletion. To do so, please contact the Firm at office@beiton.co. The Firm will process your request within 30 days. Information required by the Firm under law will continue to be retained even after a deletion request.",
    },
    {
      heading: "9. Minors",
      body: "The Website is not intended for use by minors under the age of 18. The Firm does not knowingly collect personal information from minors.",
    },
    {
      heading: "10. Changes to This Policy",
      body: "The Firm may update this policy from time to time. Material changes will be published on the Website's homepage. Continued use of the Website after an update constitutes acceptance of the updated policy.",
    },
    {
      heading: "11. Contact",
      body: "For questions regarding this Privacy Policy, please contact: office@beiton.co",
    },
  ],
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = locale === "he" ? he : en;

  return <LegalPage locale={locale as Locale} content={content} />;
}

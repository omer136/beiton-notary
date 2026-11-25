import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "תנאי שימוש | Terms of Use — BEITON",
  robots: "noindex, follow",
};

const he = {
  title: "תנאי שימוש",
  subtitle: "אתר notary.beiton.co",
  lastUpdated: "עדכון אחרון: 25.11.2026",
  sections: [
    {
      heading: "1. כללי",
      body: 'ברוכים הבאים לאתר notary.beiton.co (להלן: "האתר"), המופעל על ידי משרד עו״ד עומר בית און, BEITON (להלן: "המשרד"). השימוש באתר מהווה הסכמה לתנאים המפורטים להלן. אם אינך מסכים/ה לתנאים אלה, נא להימנע משימוש באתר.\nתנאי שימוש אלה מנוסחים בלשון זכר לצורכי נוחות בלבד, אולם הם מיועדים לכל אדם ללא הבדלי מגדר.',
    },
    {
      heading: "2. מהות האתר",
      body: 'האתר הוא אתר מידע של המשרד על פעולות נוטריוניות בישראל: מה כל פעולה, מה הדין דורש בה ומה השכר שקבוע בתקנות הנוטריונים (שכר שירותים), תשל"ט-1978, לרבות מחשבון המבוסס על התקנות. האתר אינו מציע ביצוע של פעולה נוטריונית, ואין בו הזמנה של שירות.\nהמידע באתר הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי, חוות דעת או תחליף לייעוץ משפטי פרטני. יחסי עורך דין-לקוח נוצרים אך ורק לאחר חתימה על הסכם שכר טרחה.',
    },
    {
      heading: "3. פנייה למשרד",
      body: "פנייה למשרד מהאתר, בוואטסאפ, במייל או בטלפון, היא פנייה כללית למשרד עורכי הדין. היא אינה הזמנה של פעולה נוטריונית, ואינה יוצרת יחסי עורך דין ולקוח.",
    },
    {
      heading: "4. מחשבון מחירים",
      body: 'המחשבון המוצג באתר מבוסס על תקנות הנוטריונים (שכר שירותים), תשל"ט-1978 כפי שעודכנו לשנת 2026. התעריפים קבועים בחוק ואחידים לכל הנוטריונים בישראל. הסכומים משתנים ב-1 בינואר של כל שנה (תקנה 4), והמשרד אינו אחראי לשינוי שנכנס לתוקף לפני שהאתר עודכן. הנוסח המחייב הוא הנוסח שפורסם ברשומות.',
    },
    {
      heading: "5. צ'אט",
      body: "שירות הצ'אט באתר אינו פעיל.",
    },
    {
      heading: "6. קניין רוחני",
      body: 'כל התכנים באתר, לרבות טקסטים, עיצוב, לוגו, אייקונים וקוד מקור, הם קניינו של המשרד ומוגנים בזכויות יוצרים לפי חוק זכות יוצרים, תשס"ח-2007. אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור בכתב מהמשרד.',
    },
    {
      heading: "7. הגבלת אחריות",
      body: "המשרד אינו אחראי לנזק ישיר או עקיף שייגרם כתוצאה משימוש באתר או מהסתמכות על המידע המוצג בו, לרבות טעויות, השמטות או אי-עדכון. האתר מסופק במצבו כמות שהוא (AS IS). המשרד אינו מתחייב לזמינות רציפה של האתר.",
    },
    {
      heading: "8. קישורים חיצוניים",
      body: "האתר עשוי לכלול קישורים לאתרים חיצוניים. המשרד אינו אחראי לתוכנם, מדיניות הפרטיות שלהם או לכל נזק הנובע משימוש בהם.",
    },
    {
      heading: "9. שינויים בתנאי השימוש",
      body: "המשרד רשאי לעדכן תנאים אלה מעת לעת. המשך השימוש באתר לאחר עדכון מהווה הסכמה לתנאים המעודכנים. מועד העדכון האחרון יצוין בראש המסמך.",
    },
    {
      heading: "10. דין חל וסמכות שיפוט",
      body: "על תנאי שימוש אלה יחול הדין הישראלי בלבד. סמכות השיפוט הבלעדית בכל סכסוך הנוגע לשימוש באתר מוקנית לבתי המשפט המוסמכים במחוז תל אביב-יפו.",
    },
    {
      heading: "11. יצירת קשר",
      body: "לשאלות בנוגע לתנאי שימוש אלה ניתן לפנות למשרד: office@beiton.co",
    },
  ],
};

const en = {
  title: "Terms of Use",
  subtitle: "notary.beiton.co",
  lastUpdated: "Last updated: 25.11.2026",
  sections: [
    {
      heading: "1. General",
      body: 'Welcome to notary.beiton.co (the "Website"), operated by the law office of Adv. Omer Beit-On, BEITON (the "Firm"). Use of the Website constitutes acceptance of these terms. If you do not agree, please refrain from using the Website.',
    },
    {
      heading: "2. Nature of the Website",
      body: "The Website is the Firm's information site on notarial acts in Israel: what each act is, what the law requires and what fee is fixed by the Notaries (Service Fees) Regulations, 1978, including a calculator based on those regulations. The Website does not offer to perform a notarial act, and no service can be ordered through it.\nThe information on the Website is general only and does not constitute legal advice, an opinion, or a substitute for individual legal counsel. An attorney-client relationship is created only upon signing a fee agreement.",
    },
    {
      heading: "3. Contacting the Firm",
      body: "Contacting the Firm from the Website, by WhatsApp, email or phone, is a general inquiry to the law office. It is not an order of a notarial act and does not create an attorney-client relationship.",
    },
    {
      heading: "4. Pricing Calculator",
      body: "The calculator displayed on the Website is based on the Notaries Regulations (Service Fees), 1978, as updated for 2026. Fees are fixed by law and uniform for all notaries in Israel. The amounts change on 1 January each year (regulation 4), and the Firm is not responsible for a change that takes effect before the Website is updated. The binding text is the one published in the official gazette (Reshumot).",
    },
    {
      heading: "5. Chat",
      body: "The Website's chat service is not active.",
    },
    {
      heading: "6. Intellectual Property",
      body: "All content on the Website, including text, design, logo, icons, and source code, is the property of the Firm and protected by copyright under the Copyright Act, 2007. No copying, reproduction, distribution, or commercial use of the content is permitted without written consent from the Firm.",
    },
    {
      heading: "7. Limitation of Liability",
      body: "The Firm shall not be liable for any direct or indirect damage resulting from use of the Website or reliance on the information presented therein, including errors, omissions, or failure to update. The Website is provided on an AS IS basis. The Firm does not guarantee continuous availability of the Website.",
    },
    {
      heading: "8. External Links",
      body: "The Website may contain links to external websites. The Firm is not responsible for their content, privacy policies, or any damage arising from their use.",
    },
    {
      heading: "9. Amendments",
      body: "The Firm may update these terms from time to time. Continued use of the Website after an update constitutes acceptance of the updated terms. The date of the last update is noted at the top of this document.",
    },
    {
      heading: "10. Governing Law and Jurisdiction",
      body: "These Terms of Use shall be governed exclusively by the laws of the State of Israel. Exclusive jurisdiction for any dispute relating to the Website is vested in the competent courts of the Tel Aviv-Jaffa district.",
    },
    {
      heading: "11. Contact",
      body: "For questions regarding these Terms of Use, please contact the Firm at: office@beiton.co",
    },
  ],
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = locale === "he" ? he : en;

  return <LegalPage locale={locale as Locale} content={content} />;
}

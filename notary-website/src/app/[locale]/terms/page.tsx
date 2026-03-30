import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "תנאי שימוש | Terms of Use — BEITON & Co",
  robots: "noindex, follow",
};

const he = {
  title: "תנאי שימוש",
  subtitle: "אתר notary.beiton.co",
  lastUpdated: "עדכון אחרון: מרץ 2026",
  sections: [
    {
      heading: "1. כללי",
      body: 'ברוכים הבאים לאתר notary.beiton.co (להלן: "האתר"), המופעל על ידי משרד עורכי דין BEITON & Co (להלן: "המשרד"). השימוש באתר מהווה הסכמה לתנאים המפורטים להלן. אם אינך מסכים/ה לתנאים אלה, נא להימנע משימוש באתר.\nתנאי שימוש אלה מנוסחים בלשון זכר לצורכי נוחות בלבד, אולם הם מיועדים לכל אדם ללא הבדלי מגדר.',
    },
    {
      heading: "2. מהות האתר והשירותים",
      body: 'האתר מספק מידע על שירותי נוטריון הניתנים על ידי המשרד, לרבות מחשבון תעריפים המבוסס על תקנות הנוטריונים (שכר שירותים), תשל"ט-1978, מידע על מקרי שימוש נפוצים, כלי צ\'אט לפניות ראשוניות ומעקב הזמנות.\nהמידע באתר הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי, חוות דעת או תחליף לייעוץ משפטי פרטני. יחסי עורך דין-לקוח נוצרים אך ורק לאחר חתימה על הסכם שכר טרחה.',
    },
    {
      heading: "3. נותני שירות מטעם המשרד",
      body: "שירותי הנוטריון המוצעים באמצעות האתר ניתנים על ידי המשרד ו/או על ידי נוטריונים מוסמכים הפועלים מטעמו, בהתאם לשפת המסמך ולאופי השירות הנדרש. בנוסף, שירותי שליחות ואיסוף מסמכים עשויים להתבצע באמצעות שליחים חיצוניים הפועלים מטעם המשרד. כל נותני השירות מחויבים לסודיות מקצועית.",
    },
    {
      heading: "4. מחשבון מחירים",
      body: 'המחשבון המוצג באתר מבוסס על תקנות הנוטריונים (שכר שירותים), תשל"ט-1978 כפי שעודכנו לשנת 2026. התעריפים קבועים בחוק ואחידים לכל הנוטריונים בישראל. המשרד אינו אחראי לשינויים בתעריפים שייכנסו לתוקף לאחר עדכון האתר. יש לוודא את התעריף העדכני מול המשרד.',
    },
    {
      heading: "5. צ'אט ופניות",
      body: "שירות הצ'אט באתר מופעל באמצעות בינה מלאכותית ונועד לסייע במתן מידע ראשוני בלבד. תשובות הצ'אט אינן מהוות ייעוץ משפטי ואינן יוצרות יחסי עורך דין-לקוח. פרטים שיימסרו בצ'אט ישמשו ליצירת קשר ולטיפול בפנייה בלבד.",
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
  lastUpdated: "Last updated: March 2026",
  sections: [
    {
      heading: "1. General",
      body: 'Welcome to notary.beiton.co (the "Website"), operated by BEITON & Co, Law Firm (the "Firm"). Use of the Website constitutes acceptance of these terms. If you do not agree, please refrain from using the Website.',
    },
    {
      heading: "2. Nature of the Website and Services",
      body: "The Website provides information about notary services offered by the Firm, including a pricing calculator based on the Notaries Regulations (Service Fees), 1978, information on common use cases, a chat tool for initial inquiries, and order tracking.\nThe information on the Website is general only and does not constitute legal advice, an opinion, or a substitute for individual legal counsel. An attorney-client relationship is created only upon signing a fee agreement.",
    },
    {
      heading: "3. Service Providers on Behalf of the Firm",
      body: "Notary services offered through the Website are provided by the Firm and/or by licensed notaries acting on its behalf, according to document language and the nature of the service required. Courier and document collection services may be performed by external couriers acting on behalf of the Firm. All service providers are bound by professional confidentiality.",
    },
    {
      heading: "4. Pricing Calculator",
      body: "The calculator displayed on the Website is based on the Notaries Regulations (Service Fees), 1978, as updated for 2026. Fees are fixed by law and uniform for all notaries in Israel. The Firm is not responsible for fee changes that take effect after the Website is updated. Please verify current fees with the Firm.",
    },
    {
      heading: "5. Chat and Inquiries",
      body: "The Website's chat service is powered by artificial intelligence and is intended to provide preliminary information only. Chat responses do not constitute legal advice and do not create an attorney-client relationship. Details provided in the chat will be used solely for contacting you and processing your inquiry.",
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

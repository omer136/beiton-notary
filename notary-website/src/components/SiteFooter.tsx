import Link from "next/link";

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

interface CategoryItem { name: string; slugIdx: number }
interface Category { title: string; items: CategoryItem[] }

const CATEGORIES: Record<string, Category[]> = {
  he: [
    { title: "תרגום נוטריוני", items: [{ name: "תעודת לידה", slugIdx: 0 }, { name: "דיפלומה", slugIdx: 1 }, { name: "רישיון נהיגה", slugIdx: 2 }, { name: "תעודת נישואין", slugIdx: 3 }, { name: "תעודת גירושין", slugIdx: 4 }, { name: "אזרחות פורטוגזית", slugIdx: 5 }] },
    { title: "אימות חתימה", items: [{ name: "חתימה על חוזה", slugIdx: 6 }, { name: "חתימה על NDA", slugIdx: 7 }, { name: "הוצאת קטין לחו״ל", slugIdx: 8 }] },
    { title: "ייפוי כוח", items: [{ name: "ייפוי כוח כללי", slugIdx: 9 }, { name: "מכירת דירה", slugIdx: 10 }, { name: "ייפוי כוח מתמשך", slugIdx: 11 }, { name: "משכנתא", slugIdx: 12 }] },
    { title: "תצהיר נוטריוני", items: [{ name: "תצהיר רווקות", slugIdx: 13 }, { name: "תצהיר מגורים", slugIdx: 14 }, { name: "הצהרת מתרגם", slugIdx: 15 }] },
    { title: "צוואה והסכם ממון", items: [{ name: "צוואה אישית", slugIdx: 16 }, { name: "צוואה הדדית", slugIdx: 17 }, { name: "הסכם ממון לפני נישואין", slugIdx: 18 }, { name: "הסכם ממון אחרי נישואין", slugIdx: 19 }] },
    { title: "העתק נאמן ואישור חיים", items: [{ name: "העתק דרכון", slugIdx: 20 }, { name: "העתק תעודה אקדמית", slugIdx: 21 }, { name: "מסמכי חברה", slugIdx: 22 }, { name: "אישור חיים לפנסיה", slugIdx: 23 }, { name: "אישור חיים לגמלאים", slugIdx: 24 }] },
  ],
  en: [
    { title: "Translation", items: [{ name: "Birth Certificate", slugIdx: 0 }, { name: "Diploma", slugIdx: 1 }, { name: "Driver's License", slugIdx: 2 }, { name: "Marriage Certificate", slugIdx: 3 }, { name: "Divorce Certificate", slugIdx: 4 }, { name: "Portuguese Citizenship", slugIdx: 5 }] },
    { title: "Signature Auth", items: [{ name: "Contract Signature", slugIdx: 6 }, { name: "NDA Signature", slugIdx: 7 }, { name: "Minor Travel Consent", slugIdx: 8 }] },
    { title: "Power of Attorney", items: [{ name: "General POA", slugIdx: 9 }, { name: "Property Sale POA", slugIdx: 10 }, { name: "Continuing POA", slugIdx: 11 }, { name: "Mortgage POA", slugIdx: 12 }] },
    { title: "Affidavit", items: [{ name: "Single Status", slugIdx: 13 }, { name: "Residency", slugIdx: 14 }, { name: "Translator Declaration", slugIdx: 15 }] },
    { title: "Will & Prenup", items: [{ name: "Personal Will", slugIdx: 16 }, { name: "Mutual Will", slugIdx: 17 }, { name: "Prenuptial Agreement", slugIdx: 18 }, { name: "Postnuptial Agreement", slugIdx: 19 }] },
    { title: "Copy & Life Cert", items: [{ name: "Passport Copy", slugIdx: 20 }, { name: "Diploma Copy", slugIdx: 21 }, { name: "Company Docs", slugIdx: 22 }, { name: "Pension Life Cert", slugIdx: 23 }, { name: "Retiree Life Cert", slugIdx: 24 }] },
  ],
};

const FOOTER_LABELS: Record<string, { rights: string; privacy: string; terms: string; accessibility: string }> = {
  he: { rights: "כל הזכויות שמורות", privacy: "מדיניות פרטיות", terms: "תנאי שימוש", accessibility: "הצהרת נגישות" },
  en: { rights: "All rights reserved", privacy: "Privacy Policy", terms: "Terms of Use", accessibility: "Accessibility" },
  ru: { rights: "Все права защищены", privacy: "Конфиденциальность", terms: "Условия", accessibility: "Доступность" },
  ar: { rights: "جميع الحقوق محفوظة", privacy: "الخصوصية", terms: "الشروط", accessibility: "إمكانية الوصول" },
  fr: { rights: "Tous droits reserves", privacy: "Confidentialite", terms: "Conditions", accessibility: "Accessibilite" },
  es: { rights: "Todos los derechos reservados", privacy: "Privacidad", terms: "Terminos", accessibility: "Accesibilidad" },
};

export default function SiteFooter({ lang }: { lang: string }) {
  const categories = CATEGORIES[lang] || CATEGORIES.en;
  const fl = FOOTER_LABELS[lang] || FOOTER_LABELS.en;

  return (
    <footer style={{ borderTop: "1px solid #E8E6E1" }}>
      {/* Service links by category */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "24px 16px" }}>
          {categories.map((cat, ci) => (
            <div key={ci}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>{cat.title}</p>
              {cat.items.map((item, ii) => (
                <Link key={ii} href={`/${lang}/services/${UC_SLUGS[item.slugIdx]}`} style={{ display: "block", fontSize: 11, color: "#999", textDecoration: "none", marginBottom: 4, transition: "color .2s" }}>
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #E8E6E1", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", direction: "ltr" }}>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: 5, textTransform: "uppercase" }}>BEITON</span>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: 3, color: "#999", marginLeft: 6 }}>&amp; Co</span>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#999" }}>
            <Link href={`/${lang}/privacy`} style={{ color: "#999", textDecoration: "none" }}>{fl.privacy}</Link>
            <Link href={`/${lang}/terms`} style={{ color: "#999", textDecoration: "none" }}>{fl.terms}</Link>
            <Link href={`/${lang}/accessibility`} style={{ color: "#999", textDecoration: "none" }}>{fl.accessibility}</Link>
          </div>
          <p style={{ fontSize: 11, color: "#999" }}>&copy; 2026 BEITON &amp; Co — {fl.rights}</p>
        </div>
      </div>
    </footer>
  );
}

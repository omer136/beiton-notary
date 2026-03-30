import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים | BEITON & Co",
  description:
    "תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים (שכר שירותים), תשל\"ט-1978. מחירון מלא לאימות חתימה, תרגום, צוואה, הסכם ממון ועוד.",
};

export default function NotaryPricing2026Article() {
  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים",
            datePublished: "2026-03-30",
            dateModified: "2026-03-30",
            author: {
              "@type": "Organization",
              name: "BEITON & Co",
              url: "https://notary.beiton.co",
            },
            publisher: {
              "@type": "Organization",
              name: "BEITON & Co",
              url: "https://notary.beiton.co",
              logo: {
                "@type": "ImageObject",
                url: "https://notary.beiton.co/logo.png",
              },
            },
            description:
              'תעריפי נוטריון מעודכנים לשנת 2026 לפי תקנות הנוטריונים (שכר שירותים), תשל"ט-1978. מחירון מלא לאימות חתימה, תרגום, צוואה, הסכם ממון ועוד.',
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://notary.beiton.co/blog/notary-pricing-2026",
            },
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
            mainEntity: [
              {
                "@type": "Question",
                name: "כמה עולה אימות חתימה אצל נוטריון?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: '197 ₪ + מע"מ לחותם ראשון, 77 ₪ + מע"מ לכל חותם נוסף. המחיר קבוע בתקנות.',
                },
              },
              {
                "@type": "Question",
                name: "כמה עולה תרגום נוטריוני?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: '251 ₪ + מע"מ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ מעבר ל-1,000.',
                },
              },
              {
                "@type": "Question",
                name: "האם המחיר זהה אצל כל נוטריון?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "כן. התעריפים נקבעים בתקנות הנוטריונים ומחייבים את כל הנוטריונים בישראל.",
                },
              },
            ],
          }),
        }}
      />

      <div
        dir="rtl"
        style={{
          fontFamily: "'Noto Sans Hebrew', 'DM Sans', sans-serif",
          color: "#1A1A1A",
          background: "#fff",
          minHeight: "100vh",
          lineHeight: 1.8,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Header */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(255,255,255,.96)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #E8E6E1",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 56,
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "baseline",
                direction: "ltr",
                textDecoration: "none",
                color: "#1A1A1A",
              }}
            >
              <span
                style={{
                  fontFamily:
                    "'Helvetica Neue',Helvetica,Arial,sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                }}
              >
                BEITON
              </span>
              <span
                style={{
                  fontFamily:
                    "'Helvetica Neue',Helvetica,Arial,sans-serif",
                  fontWeight: 300,
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "#999",
                  marginLeft: 6,
                }}
              >
                &amp; Co
              </span>
            </Link>
            <Link
              href="/"
              style={{
                fontSize: 12,
                color: "#6B6B6B",
                textDecoration: "none",
                transition: "opacity .2s",
              }}
            >
              חזרה לעמוד הראשי
            </Link>
          </div>
        </nav>

        {/* Article */}
        <article
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "48px 24px 80px",
          }}
        >
          {/* Breadcrumb */}
          <p
            style={{
              fontSize: 11,
              color: "#999",
              marginBottom: 24,
            }}
          >
            <Link
              href="/"
              style={{ color: "#999", textDecoration: "none" }}
            >
              ראשי
            </Link>
            {" / "}
            <Link
              href="/#blog"
              style={{ color: "#999", textDecoration: "none" }}
            >
              בלוג
            </Link>
            {" / "}
            <span style={{ color: "#1A1A1A" }}>מחירון נוטריון 2026</span>
          </p>

          {/* Tag */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#999",
              marginBottom: 12,
            }}
          >
            מחירון
          </p>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(26px,4vw,38px)",
              fontWeight: 300,
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            מחירון נוטריון 2026 — תעריפי משרד המשפטים המעודכנים
          </h1>

          {/* Meta line */}
          <p
            style={{
              fontSize: 12,
              color: "#999",
              marginBottom: 32,
            }}
          >
            BEITON &amp; Co | 30 במרץ 2026
          </p>

          {/* Divider */}
          <div
            style={{
              width: 50,
              height: 1,
              background: "#1A1A1A",
              marginBottom: 32,
            }}
          />

          {/* Intro */}
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>
            תעריפי הנוטריון בישראל נקבעים מדי שנה על ידי משרד המשפטים,
            והם אחידים לכל הנוטריונים ברחבי הארץ ללא יוצא מן הכלל.
            המחירים מתעדכנים בתחילת כל שנה בהתאם למדד המחירים לצרכן, ואף
            נוטריון אינו רשאי לגבות מחיר גבוה או נמוך מהתעריף שנקבע
            בתקנות.
          </p>

          {/* Section: מי קובע */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 12,
              marginTop: 40,
            }}
          >
            מי קובע את מחירי הנוטריון?
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>
            שכר שירותי הנוטריון מוסדר בתקנות הנוטריונים (שכר שירותים),
            תשל&quot;ט-1978. התעריפים נקבעים על ידי מדינת ישראל באמצעות משרד
            המשפטים. נוטריון שגובה שכר שונה מהמחיר הקבוע מבצע עבירת משמעת
            שעלולה להוביל לשלילת רישיונו. המשמעות עבורכם: המחיר שתשלמו
            יהיה זהה בכל מקום בארץ, אז כדאי לבחור נוטריון לפי מקצועיות,
            זמינות ונוחות — לא לפי מחיר.
          </p>

          {/* Section: תעריפים */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 12,
              marginTop: 40,
            }}
          >
            תעריפי נוטריון מעודכנים לשנת 2026
          </h2>

          {/* Pricing Table */}
          <div
            style={{
              background: "#FAFAF8",
              borderRadius: 12,
              border: "1px solid #E8E6E1",
              padding: 24,
              marginBottom: 28,
            }}
          >
            {[
              {
                service: "תרגום נוטריוני",
                price: "251 ₪ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, 99 ₪ מעבר ל-1,000",
                legalRef: "ס׳ 7(4) לחוק | פרט 3 לתקנות שכ״ש",
                presence: "לא נדרשת",
                delivery: "דיגיטלי / שליח / איסוף עצמי",
                aiRole: "AI-first — AI מתרגם, נוטריון חותם",
                docs: "סריקת מקור, צילום ת.ז.",
                languages: "עברית ↔ אנגלית (נוטריון דובר); שאר השפות — הצהרת מתרגם",
              },
              {
                service: "אימות חתימה",
                price: "197 ₪ לחותם ראשון, 77 ₪ לכל חותם נוסף",
                legalRef: "ס׳ 7(1)-(2) לחוק | פרט 1 לתקנות שכ״ש",
                presence: "נדרשת — חתימה בפני הנוטריון",
                delivery: "פגישה במשרד / נוטריון עד הבית",
                aiRole: "קביעת תור + הכנת מסמך",
                docs: "ת.ז./דרכון מקורי, המסמך לחתימה",
                languages: "",
              },
              {
                service: "ייפוי כוח נוטריוני",
                price: "197 ₪ לחותם ראשון + 77 ₪ לכל עותק נוסף",
                legalRef: "ס׳ 20א לחוק | פרט 1 לתקנות שכ״ש",
                presence: "נדרשת — חתימה בפני הנוטריון",
                delivery: "פגישה במשרד / נוטריון עד הבית",
                aiRole: "ניסוח טיוטה + קביעת תור",
                docs: "ת.ז./דרכון מקורי, פרטי מיופה הכוח",
                languages: "",
              },
              {
                service: "אישור העתק נאמן למקור",
                price: "77 ₪ לעמוד ראשון, 13 ₪ לכל עמוד נוסף",
                legalRef: "ס׳ 7(3) לחוק | פרט 2 לתקנות שכ״ש",
                presence: "לא נדרשת (חובה להעביר מקור פיזי)",
                delivery: "שליח / פגישה במשרד / איסוף עצמי",
                aiRole: "קליטה בלבד — הנוטריון רואה מקור בעיניו",
                docs: "מסמך מקורי פיזי, צילום ת.ז.",
                languages: "",
              },
              {
                service: "תצהיר נוטריוני",
                price: "200 ₪ למצהיר ראשון, 80 ₪ לכל מצהיר נוסף",
                legalRef: "ס׳ 7(5) לחוק | פרט 5 לתקנות שכ״ש",
                presence: "נדרשת — הצהרה בשבועה בפני הנוטריון",
                delivery: "פגישה במשרד",
                aiRole: "ניסוח טיוטה + קביעת תור",
                docs: "ת.ז./דרכון מקורי, טיוטה או פרטי התצהיר",
                languages: "",
              },
              {
                service: "צוואה נוטריונית",
                price: "293 ₪ לחותם ראשון, 147 ₪ לכל חותם נוסף",
                legalRef: "ס׳ 22 לחוק הירושה תשכ״ה-1965 | פרט 4 לתקנות שכ״ש",
                presence: "נדרשת — הנוטריון משמש כרשות",
                delivery: "פגישה במשרד / נוטריון עד הבית",
                aiRole: "ניסוח טיוטה + קביעת תור",
                docs: "ת.ז./דרכון מקורי, פרטי יורשים ונכסים",
                languages: "",
              },
              {
                service: "הסכם ממון",
                price: "446 ₪, 74 ₪ לכל עותק נוסף",
                legalRef: "ס׳ 7(11) לחוק | פרט 6 לתקנות שכ״ש | חוק יחסי ממון תשל״ג-1973",
                presence: "נדרשת — שני בני הזוג יחד",
                delivery: "פגישה במשרד",
                aiRole: "ניסוח טיוטה + קביעת תור",
                docs: "ת.ז./דרכון של שני בני הזוג, טיוטת הסכם",
                languages: "",
              },
              {
                service: "אישור חיים",
                price: "197 ₪",
                legalRef: "ס׳ 7(6) לחוק | פרט 4 לתקנות שכ״ש",
                presence: "נדרשת — זיהוי אישי",
                delivery: "פגישה במשרד / נוטריון עד הבית",
                aiRole: "קביעת תור",
                docs: "ת.ז./דרכון מקורי",
                languages: "",
              },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 0",
                  borderBottom: i < 7 ? "1px solid #E8E6E1" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
                    {row.service}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 300,
                      color: "#6B6B6B",
                      textAlign: "left",
                    }}
                  >
                    {row.price}
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "2px 10px",
                    fontSize: 11,
                    color: "#999",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>מקור:</span>
                  <span>{row.legalRef}</span>
                  <span style={{ fontWeight: 500 }}>נוכחות:</span>
                  <span>{row.presence}</span>
                  <span style={{ fontWeight: 500 }}>הספקה:</span>
                  <span>{row.delivery}</span>
                  <span style={{ fontWeight: 500 }}>תפקיד AI:</span>
                  <span>{row.aiRole}</span>
                  <span style={{ fontWeight: 500 }}>מסמכים נדרשים:</span>
                  <span>{row.docs}</span>
                  {row.languages && (
                    <>
                      <span style={{ fontWeight: 500 }}>שפות:</span>
                      <span>{row.languages}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
            <p
              style={{
                fontSize: 11,
                color: "#999",
                fontStyle: "italic",
                marginTop: 16,
              }}
            >
              כל המחירים הנ&quot;ל הם לפני מע&quot;מ (18%). על כל סכום יש
              להוסיף מע&quot;מ כחוק.
            </p>
          </div>

          {/* Section: מתי צריכים */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 12,
              marginTop: 40,
            }}
          >
            מתי צריכים שירותי נוטריון?
          </h2>
          <ul
            style={{
              fontSize: 15,
              fontWeight: 300,
              marginBottom: 28,
              paddingRight: 20,
            }}
          >
            <li style={{ marginBottom: 6 }}>
              חתימה על ייפוי כוח למשכנתא בבנק
            </li>
            <li style={{ marginBottom: 6 }}>
              אימות מסמכים לצורך שימוש בחו&quot;ל (אפוסטיל)
            </li>
            <li style={{ marginBottom: 6 }}>
              תרגום נוטריוני של תעודות (לידה, נישואין, תואר)
            </li>
            <li style={{ marginBottom: 6 }}>
              חתימה על הסכם ממון לפני נישואין
            </li>
            <li style={{ marginBottom: 6 }}>עריכת צוואה נוטריונית</li>
            <li style={{ marginBottom: 6 }}>
              אישור חיים לצורך קבלת קצבה מחו&quot;ל
            </li>
          </ul>

          {/* Section: FAQ */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 16,
              marginTop: 40,
            }}
          >
            שאלות נפוצות
          </h2>
          <div style={{ marginBottom: 32 }}>
            {[
              {
                q: "כמה עולה אימות חתימה אצל נוטריון?",
                a: '197 ₪ + מע"מ לחותם ראשון, 77 ₪ + מע"מ לכל חותם נוסף. המחיר קבוע בתקנות.',
              },
              {
                q: "כמה עולה תרגום נוטריוני?",
                a: '251 ₪ + מע"מ עד 100 מילים, 197 ₪ לכל 100 מילים נוספות עד 1,000, ו-99 ₪ מעבר ל-1,000.',
              },
              {
                q: "האם המחיר זהה אצל כל נוטריון?",
                a: "כן. התעריפים נקבעים בתקנות הנוטריונים ומחייבים את כל הנוטריונים בישראל.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #E8E6E1",
                  padding: "14px 0",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
                  {item.q}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#6B6B6B",
                  }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          {/* Section: BEITON CTA */}
          <h2
            style={{
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 12,
              marginTop: 40,
            }}
          >
            איך BEITON &amp; Co עוזרים?
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 28 }}>
            ב-BEITON &amp; Co אנחנו מציעים את כל שירותי הנוטריון לפי
            התעריף הרשמי, עם יתרונות ייחודיים: זמינות גבוהה — שירות גם
            בהתראה קצרה. שירות בשפות רבות — עברית, אנגלית, ערבית. הזמנת
            תור אונליין — בלי להתקשר. מחשבון מחירים — לדעת בדיוק כמה
            תשלמו לפני שמגיעים. תהליך דיגיטלי — העלאת מסמכים מראש לחיסכון
            בזמן.
          </p>

          {/* CTA */}
          <div
            style={{
              background: "#FAFAF8",
              borderRadius: 12,
              border: "1px solid #E8E6E1",
              padding: "28px 24px",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                marginBottom: 16,
              }}
            >
              לתיאום פגישה או שאלות — צרו קשר עכשיו
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://wa.me/972500000000"
                style={{
                  background: "#1A1A1A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background .2s",
                }}
              >
                פנייה בוואטסאפ
              </a>
              <Link
                href="/"
                style={{
                  background: "transparent",
                  color: "#1A1A1A",
                  border: "1px solid #E8E6E1",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "all .2s",
                }}
              >
                חזרה לעמוד הראשי
              </Link>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid #E8E6E1",
            padding: "28px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                direction: "ltr",
              }}
            >
              <span
                style={{
                  fontFamily:
                    "'Helvetica Neue',Helvetica,Arial,sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                }}
              >
                BEITON
              </span>
              <span
                style={{
                  fontFamily:
                    "'Helvetica Neue',Helvetica,Arial,sans-serif",
                  fontWeight: 300,
                  fontSize: 9,
                  letterSpacing: 3,
                  color: "#999",
                  marginLeft: 6,
                }}
              >
                &amp; Co
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#999" }}>
              © 2026 BEITON &amp; Co — כל הזכויות שמורות
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

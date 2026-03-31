import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import SiteFooter from "./SiteFooter";

interface Section {
  heading: string;
  body: string;
}

interface LegalContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}


export default function LegalPage({
  locale,
  content,
}: {
  locale: Locale;
  content: LegalContent;
}) {
  const isRtl = locale === "he" || locale === "ar";
  const backLabel = locale === "he" ? "חזרה לעמוד הראשי" : "Back to homepage";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      style={{
        fontFamily: locale === "he"
          ? "'Noto Sans Hebrew', sans-serif"
          : locale === "ar"
            ? "'Noto Sans Arabic', sans-serif"
            : "'DM Sans', sans-serif",
        color: "#1A1A1A",
        background: "#fff",
        minHeight: "100vh",
        lineHeight: 1.7,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* NAV — identical to NotaryHome */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8E6E1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href={`/${locale}`} style={{ display: "flex", alignItems: "baseline", direction: "ltr", textDecoration: "none", color: "#1A1A1A" }}>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 500, fontSize: 15, letterSpacing: 5, textTransform: "uppercase" }}>BEITON</span>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: 3, color: "#999", marginLeft: 6 }}>&amp; Co</span>
          </Link>
          <Link
            href={`/${locale}`}
            style={{ fontSize: 12, color: "#6B6B6B", textDecoration: "none", transition: "opacity .2s" }}
          >
            {backLabel}
          </Link>
        </div>
      </nav>

      <article
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(26px,4vw,38px)",
            fontWeight: 300,
            lineHeight: 1.3,
            color: "#1A1A1A",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {content.title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 13,
            color: "#999",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          {content.subtitle}
        </p>

        {/* Last updated */}
        <p
          style={{
            fontSize: 11,
            color: "#999",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {content.lastUpdated}
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#E8E6E1",
            marginBottom: 32,
          }}
        />

        {/* Sections */}
        {content.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#1A1A1A",
                marginTop: i > 0 ? 32 : 0,
                marginBottom: 10,
              }}
            >
              {section.heading}
            </h2>
            <p
              style={{
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "#6B6B6B",
                whiteSpace: "pre-line",
              }}
            >
              {section.body}
            </p>
          </div>
        ))}
      </article>

      <SiteFooter lang={locale} />
    </div>
  );
}

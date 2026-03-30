import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import type { Locale } from "@/lib/i18n";

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
    <>
      <Header locale={locale} />

      <article
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "64px 24px",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* Back link */}
        <Link
          href={`/${locale}`}
          style={{
            display: "inline-block",
            fontSize: 12,
            color: "#999",
            textDecoration: "none",
            marginBottom: 32,
            transition: "opacity .2s",
          }}
        >
          {backLabel}
        </Link>

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

      <Footer />
    </>
  );
}

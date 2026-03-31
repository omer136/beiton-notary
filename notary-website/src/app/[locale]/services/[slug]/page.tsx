import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { USE_CASE_MAP, USE_CASE_SLUGS, type UseCaseContent } from "@/data/use-cases";
import { locales } from "@/lib/i18n";
import PricingCalculator from "@/components/PricingCalculator";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    USE_CASE_SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const uc = USE_CASE_MAP[slug];
  if (!uc) return {};
  const c = (uc.translations[locale] || uc.translations.en) as UseCaseContent;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: `https://notary.beiton.co/${locale}/services/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `https://notary.beiton.co/${l}/services/${slug}`])
      ),
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const uc = USE_CASE_MAP[slug];
  if (!uc) notFound();

  const c = (uc.translations[locale] || uc.translations.en) as UseCaseContent;
  const isRtl = locale === "he" || locale === "ar";
  const font =
    locale === "he"
      ? "'Noto Sans Hebrew', 'DM Sans', sans-serif"
      : locale === "ar"
        ? "'Noto Sans Arabic', 'DM Sans', sans-serif"
        : "'DM Sans', sans-serif";

  const breadHome = locale === "he" ? "ראשי" : "Home";
  const breadServices = locale === "he" ? "שירותים" : "Services";

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: c.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: c.h1,
            description: c.intro,
            provider: {
              "@type": "LegalService",
              name: "BEITON & Co",
              url: "https://notary.beiton.co",
            },
            areaServed: { "@type": "Country", name: "Israel" },
            url: `https://notary.beiton.co/${locale}/services/${slug}`,
          }),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: breadHome, item: `https://notary.beiton.co/${locale}` },
              { "@type": "ListItem", position: 2, name: breadServices, item: `https://notary.beiton.co/${locale}#services` },
              { "@type": "ListItem", position: 3, name: c.h1 },
            ],
          }),
        }}
      />

      <div
        dir={isRtl ? "rtl" : "ltr"}
        style={{
          fontFamily: font,
          color: "#1A1A1A",
          background: "#fff",
          minHeight: "100vh",
          lineHeight: 1.8,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Nav */}
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
              href={`/${locale}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                direction: "ltr",
                textDecoration: "none",
                color: "#1A1A1A",
              }}
            >
              <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 500, fontSize: 15, letterSpacing: 5, textTransform: "uppercase" }}>BEITON</span>
              <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: 3, color: "#999", marginLeft: 6 }}>&amp; Co</span>
            </Link>
            <Link href={`/${locale}`} style={{ fontSize: 12, color: "#6B6B6B", textDecoration: "none" }}>
              {c.ctaBack}
            </Link>
          </div>
        </nav>

        {/* Content */}
        <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
          {/* Breadcrumb */}
          <p style={{ fontSize: 11, color: "#999", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "#999", textDecoration: "none" }}>{breadHome}</Link>
            {" / "}
            <Link href={`/${locale}#services`} style={{ color: "#999", textDecoration: "none" }}>{breadServices}</Link>
            {" / "}
            <span style={{ color: "#1A1A1A" }}>{c.h1}</span>
          </p>

          {/* H1 */}
          <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>
            {c.h1}
          </h1>

          <div style={{ width: 50, height: 1, background: "#1A1A1A", marginBottom: 32 }} />

          {/* Intro */}
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 40 }}>{c.intro}</p>

          {/* When needed */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12 }}>
            {locale === "he" ? "מתי צריך את זה?" : locale === "ar" ? "متى تحتاجون لذلك؟" : locale === "ru" ? "Когда это нужно?" : "When do you need this?"}
          </h2>
          <ul style={{ fontSize: 15, fontWeight: 300, marginBottom: 40, paddingInlineStart: 20 }}>
            {c.whenNeeded.map((item, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{item}</li>
            ))}
          </ul>

          {/* Process */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12 }}>{c.processTitle}</h2>
          <ol style={{ fontSize: 15, fontWeight: 300, marginBottom: 40, paddingInlineStart: 20 }}>
            {c.processSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{step}</li>
            ))}
          </ol>

          {/* Pricing */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 16 }}>{c.pricingTitle}</h2>
          <div style={{ marginBottom: 40 }}>
            <PricingCalculator lang={locale} initialService={uc.pricingKey} />
          </div>

          {/* Delivery */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12 }}>{c.deliveryTitle}</h2>
          <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
            {c.deliveryOptions.map((opt, i) => (
              <div key={i} style={{ padding: "14px 18px", borderRadius: 10, border: "1px solid #E8E6E1", background: "#FAFAF8" }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{opt.name}</p>
                <p style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B" }}>{opt.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 16 }}>{c.faqTitle}</h2>
          <div style={{ marginBottom: 40 }}>
            {c.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid #E8E6E1", padding: "14px 0" }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{item.q}</p>
                <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B" }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "#FAFAF8", borderRadius: 12, border: "1px solid #E8E6E1", padding: "28px 24px", textAlign: "center" }}>
            <h2 style={{ fontSize: 20, fontWeight: 400, marginBottom: 8 }}>{c.ctaTitle}</h2>
            <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", marginBottom: 16 }}>{c.ctaText}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
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
                }}
              >
                {c.ctaWhatsapp}
              </a>
              <Link
                href={`/${locale}`}
                style={{
                  background: "transparent",
                  color: "#1A1A1A",
                  border: "1px solid #E8E6E1",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                {c.ctaBack}
              </Link>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #E8E6E1", padding: "28px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "baseline", direction: "ltr" }}>
              <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 500, fontSize: 13, letterSpacing: 5, textTransform: "uppercase" }}>BEITON</span>
              <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: 3, color: "#999", marginLeft: 6 }}>&amp; Co</span>
            </div>
            <p style={{ fontSize: 11, color: "#999" }}>&copy; 2026 BEITON &amp; Co</p>
          </div>
        </footer>
      </div>
    </>
  );
}

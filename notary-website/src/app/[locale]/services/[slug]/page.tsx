import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { USE_CASE_MAP, USE_CASE_SLUGS, type UseCaseContent } from "@/data/use-cases";
import { locales } from "@/lib/i18n";
import PricingCalculator from "@/components/PricingCalculator";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

  const breadHome = locale === "he" ? "ראשי" : locale === "ar" ? "الرئيسية" : locale === "ru" ? "Главная" : "Home";
  const breadServices = locale === "he" ? "שירותים" : locale === "ar" ? "الخدمات" : locale === "ru" ? "Услуги" : "Services";
  const textAlign = isRtl ? "right" as const : "left" as const;

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
        <SiteHeader lang={locale} />

        {/* Article */}
        <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", textAlign }}>
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

          {/* What is */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.whatIsTitle}</h2>
          <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 40 }}>{c.whatIsBody}</p>

          {/* When needed */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.whenNeededTitle}</h2>
          <ul style={{ fontSize: 15, fontWeight: 300, marginBottom: 40, paddingInlineStart: 20 }}>
            {c.whenNeeded.map((item, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{item}</li>
            ))}
          </ul>

          {/* Process */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.processTitle}</h2>
          <ol style={{ fontSize: 15, fontWeight: 300, marginBottom: 40, paddingInlineStart: 20 }}>
            {c.processSteps.map((step, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{step}</li>
            ))}
          </ol>

          {/* Required documents */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.docsTitle}</h2>
          <ul style={{ fontSize: 15, fontWeight: 300, marginBottom: 40, paddingInlineStart: 20 }}>
            {c.docs.map((doc, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{doc}</li>
            ))}
          </ul>

          {/* Pricing */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 8, marginTop: 40 }}>{c.pricingTitle}</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", marginBottom: 16 }}>{c.pricingNote}</p>
          <div style={{ marginBottom: 40 }}>
            <PricingCalculator lang={locale} initialService={uc.pricingKey} />
          </div>

          {/* Delivery */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.deliveryTitle}</h2>
          <div style={{ display: "grid", gap: 10, marginBottom: 40 }}>
            {c.deliveryOptions.map((opt, i) => (
              <div key={i} style={{ padding: "14px 18px", borderRadius: 10, border: "1px solid #E8E6E1", background: "#FAFAF8" }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{opt.name}</p>
                <p style={{ fontSize: 13, fontWeight: 300, color: "#6B6B6B" }}>{opt.desc}</p>
              </div>
            ))}
          </div>

          {/* Why us (E-E-A-T) */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{c.whyUsTitle}</h2>
          <ul style={{ fontSize: 15, fontWeight: 300, marginBottom: 40, paddingInlineStart: 20 }}>
            {c.whyUsPoints.map((point, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{point}</li>
            ))}
          </ul>

          {/* FAQ */}
          <h2 style={{ fontSize: 22, fontWeight: 400, marginBottom: 16, marginTop: 40 }}>{c.faqTitle}</h2>
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
              <a href="https://wa.me/972500000000" style={{ background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>{c.ctaWhatsapp}</a>
              <Link href={`/${locale}`} style={{ background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 8, padding: "10px 22px", fontSize: 13, textDecoration: "none" }}>{c.ctaBack}</Link>
            </div>
          </div>
        </article>

        <SiteFooter lang={locale} />
      </div>
    </>
  );
}

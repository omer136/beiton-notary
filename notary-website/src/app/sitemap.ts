import type { MetadataRoute } from "next";
import { BLOG_SLUGS } from "@/data/blog-articles";
import { USE_CASE_SLUGS } from "@/data/use-cases";

const BASE = "https://notary.beiton.co";
const LOCALES = ["he", "en", "ru", "ar", "fr", "es"];
// עמודי השירות ומאמר המחירון בצרפתית ובספרדית מציגים טקסט אנגלי: noindex ומחוץ ל-sitemap עד שיתורגמו
const TRANSLATED = ["he", "en", "ru", "ar"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage per locale
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // Blog: notary-pricing-2026 (dedicated route)
  for (const locale of TRANSLATED) {
    entries.push({
      url: `${BASE}/${locale}/blog/notary-pricing-2026`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Blog: dynamic articles
  for (const slug of BLOG_SLUGS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  // Service use case pages
  for (const slug of USE_CASE_SLUGS) {
    for (const locale of TRANSLATED) {
      entries.push({
        url: `${BASE}/${locale}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // העמודים המשפטיים (תנאי שימוש, פרטיות, נגישות) הם noindex, ולכן אינם ב-sitemap

  return entries;
}

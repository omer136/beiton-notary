import type { MetadataRoute } from "next";
import { BLOG_SLUGS } from "@/data/blog-articles";
import { USE_CASE_SLUGS } from "@/data/use-cases";

const BASE = "https://notary.beiton.co";
const LOCALES = ["he", "en", "ru", "ar", "fr", "es"];

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
  for (const locale of LOCALES) {
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
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Legal pages
  for (const page of ["terms", "privacy", "accessibility"]) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
      });
    }
  }

  return entries;
}

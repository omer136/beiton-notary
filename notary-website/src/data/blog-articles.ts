/**
 * Blog article registry — maps slugs to MDX file paths and metadata.
 * The notary-pricing-2026 article has its own dedicated route with translated content.
 * All other articles use the dynamic [slug] route.
 */

export interface BlogArticle {
  slug: string;
  file: string; // relative to content/blog/
}

export const BLOG_ARTICLES: BlogArticle[] = [
  { slug: "notarial-power-of-attorney", file: "notarial-power-of-attorney.mdx" },
  { slug: "apostille-israel", file: "apostille-israel.mdx" },
  { slug: "notarial-translation", file: "notarial-translation.mdx" },
  { slug: "signature-authentication", file: "signature-authentication.mdx" },
  { slug: "notarial-will", file: "notarial-will.mdx" },
  { slug: "notarial-affidavit", file: "notarial-affidavit.mdx" },
];

export const BLOG_SLUGS = BLOG_ARTICLES.map(a => a.slug);
export const BLOG_MAP = Object.fromEntries(BLOG_ARTICLES.map(a => [a.slug, a]));

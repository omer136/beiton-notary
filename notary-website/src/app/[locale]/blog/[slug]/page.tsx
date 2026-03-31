import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { BLOG_MAP, BLOG_SLUGS } from "@/data/blog-articles";
import { locales } from "@/lib/i18n";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {} as Record<string, string>, body: content };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (m) meta[m[1]] = m[2];
  }
  return { meta, body: match[2] };
}

function mdxToSections(body: string) {
  const sections: { type: "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "table" | "blockquote" | "hr"; content: string; items?: string[]; rows?: string[][] }[] = [];
  const lines = body.split("\n");
  let i = 0;
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      sections.push({ type: listType, content: "", items: [...listItems] });
      listItems = [];
      listType = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) { flushList(); sections.push({ type: "h1", content: line.slice(2) }); }
    else if (line.startsWith("## ")) { flushList(); sections.push({ type: "h2", content: line.slice(3) }); }
    else if (line.startsWith("### ")) { flushList(); sections.push({ type: "h3", content: line.slice(4) }); }
    else if (line.startsWith("> ")) { flushList(); sections.push({ type: "blockquote", content: line.slice(2) }); }
    else if (line.startsWith("---") && line.trim() === "---") { flushList(); sections.push({ type: "hr", content: "" }); }
    else if (line.startsWith("- ")) { listType = "ul"; listItems.push(line.slice(2)); }
    else if (/^\d+\.\s/.test(line)) { listType = "ol"; listItems.push(line.replace(/^\d+\.\s/, "")); }
    else if (line.startsWith("|") && lines[i + 1]?.match(/^\|[-\s|]+\|$/)) {
      flushList();
      const headers = line.split("|").filter(Boolean).map(s => s.trim());
      i++; // skip separator
      const rows: string[][] = [headers];
      while (i + 1 < lines.length && lines[i + 1].startsWith("|")) {
        i++;
        rows.push(lines[i].split("|").filter(Boolean).map(s => s.trim()));
      }
      sections.push({ type: "table", content: "", rows });
    }
    else if (line.trim() === "") { flushList(); }
    else { flushList(); sections.push({ type: "p", content: line }); }

    i++;
  }
  flushList();
  return sections;
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#1A1A1A;text-decoration:underline">$1</a>')
    .replace(/&quot;/g, '"');
}

export function generateStaticParams() {
  return locales.flatMap(locale => BLOG_SLUGS.map(slug => ({ locale, slug })));
}

function resolveFile(locale: string, slug: string): string | null {
  const article = BLOG_MAP[slug];
  if (!article) return null;
  // Try locale-specific file first, then fall back to Hebrew (root)
  const localePath = path.join(process.cwd(), "content/blog", locale, article.file);
  if (fs.existsSync(localePath)) return localePath;
  const rootPath = path.join(process.cwd(), "content/blog", article.file);
  if (fs.existsSync(rootPath)) return rootPath;
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const filePath = resolveFile(locale, slug);
  if (!filePath) return {};
  const { meta } = parseFrontmatter(fs.readFileSync(filePath, "utf8"));
  return {
    title: (meta.title || slug) + " | BEITON & Co",
    description: meta.description || "",
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const filePath = resolveFile(locale, slug);
  if (!filePath) notFound();

  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const sections = mdxToSections(body);

  const isRtl = locale === "he" || locale === "ar";
  const font = locale === "he" ? "'Noto Sans Hebrew','DM Sans',sans-serif" : locale === "ar" ? "'Noto Sans Arabic','DM Sans',sans-serif" : "'DM Sans',sans-serif";
  const textAlign = isRtl ? "right" as const : "left" as const;
  const breadHome = locale === "he" ? "ראשי" : "Home";
  const breadBlog = locale === "he" ? "בלוג" : "Blog";

  return (
    <>
      {/* Article Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: meta.title, description: meta.description, inLanguage: meta.lang || locale,
        datePublished: meta.date, author: { "@type": "Organization", name: "BEITON & Co", url: "https://notary.beiton.co" },
        publisher: { "@type": "Organization", name: "BEITON & Co", logo: { "@type": "ImageObject", url: "https://notary.beiton.co/logo.png" } },
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://notary.beiton.co/${locale}/blog/${slug}` },
      })}} />

      <div dir={isRtl ? "rtl" : "ltr"} style={{ fontFamily: font, color: "#1A1A1A", background: "#fff", minHeight: "100vh", lineHeight: 1.8, WebkitFontSmoothing: "antialiased" }}>
        <SiteHeader lang={locale} />

        <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", textAlign }}>
          {/* Breadcrumb */}
          <p style={{ fontSize: 11, color: "#999", marginBottom: 24 }}>
            <Link href={`/${locale}`} style={{ color: "#999", textDecoration: "none" }}>{breadHome}</Link>
            {" / "}
            <Link href={`/${locale}#blog`} style={{ color: "#999", textDecoration: "none" }}>{breadBlog}</Link>
            {" / "}
            <span style={{ color: "#1A1A1A" }}>{meta.title}</span>
          </p>

          {/* Meta */}
          <p style={{ fontSize: 12, color: "#999", marginBottom: 32 }}>BEITON &amp; Co | {meta.date}</p>

          {/* Content */}
          {sections.map((sec, i) => {
            switch (sec.type) {
              case "h1": return <h1 key={i} style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>{sec.content}</h1>;
              case "h2": return <h2 key={i} style={{ fontSize: 22, fontWeight: 400, marginBottom: 12, marginTop: 40 }}>{sec.content}</h2>;
              case "h3": return <h3 key={i} style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, marginTop: 24 }}>{sec.content}</h3>;
              case "p": return <p key={i} style={{ fontSize: 15, fontWeight: 300, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(sec.content) }} />;
              case "blockquote": return <p key={i} style={{ fontSize: 14, fontWeight: 300, color: "#6B6B6B", fontStyle: "italic", borderInlineStart: "3px solid #E8E6E1", paddingInlineStart: 16, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(sec.content) }} />;
              case "hr": return <div key={i} style={{ width: 50, height: 1, background: "#1A1A1A", marginBottom: 32 }} />;
              case "ul": return <ul key={i} style={{ fontSize: 15, fontWeight: 300, marginBottom: 16, paddingInlineStart: 20 }}>{sec.items?.map((item, j) => <li key={j} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />)}</ul>;
              case "ol": return <ol key={i} style={{ fontSize: 15, fontWeight: 300, marginBottom: 16, paddingInlineStart: 20 }}>{sec.items?.map((item, j) => <li key={j} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />)}</ol>;
              case "table": return (
                <div key={i} style={{ background: "#FAFAF8", borderRadius: 12, border: "1px solid #E8E6E1", padding: 20, marginBottom: 20, overflowX: "auto" }}>
                  {sec.rows?.map((row, ri) => (
                    <div key={ri} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: ri < (sec.rows?.length || 1) - 1 ? "1px solid #E8E6E1" : "none", fontSize: ri === 0 ? 13 : 14, fontWeight: ri === 0 ? 600 : 300, color: ri === 0 ? "#1A1A1A" : "#6B6B6B" }}>
                      {row.map((cell, ci) => <span key={ci} style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(cell) }} />)}
                    </div>
                  ))}
                </div>
              );
              default: return null;
            }
          })}
        </article>

        <SiteFooter lang={locale} />
      </div>
    </>
  );
}

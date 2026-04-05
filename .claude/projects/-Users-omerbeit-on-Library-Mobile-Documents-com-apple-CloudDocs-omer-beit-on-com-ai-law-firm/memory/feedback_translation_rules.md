---
name: Translation rules for all content
description: Every article/page/content must be translated to all 6 languages (HE, EN, RU, AR, FR, ES) with localized SEO keywords — never publish content in one language only
type: feedback
---

Every piece of content (blog articles, service pages, use cases) MUST be translated to all 6 languages before considering it "done".

**Why:** The site targets 6 language audiences. Content in only one language misses 5/6 of the potential organic traffic. Omer has corrected this multiple times.

**How to apply:**
- When writing a blog article → immediately translate to EN, RU, AR, FR, ES
- When creating service pages → content in all 6 languages
- Translation is NOT literal — adapt keywords, FAQs, CTAs to each language
- Follow SEO-AGENT.md translation guidelines:
  - Keywords in target language (not transliterated Hebrew)
  - H1/H2 adapted for natural search queries in that language
  - Law names in Hebrew with translation in parentheses
  - Prices always in ₪ — amounts don't change
  - CTA adapted per language
  - Frontmatter: lang code, translatedFrom: "he", same slug
- Save to content/blog/{lang}/{slug}.mdx
- File structure: he/ (or root), en/, ru/, ar/, fr/, es/

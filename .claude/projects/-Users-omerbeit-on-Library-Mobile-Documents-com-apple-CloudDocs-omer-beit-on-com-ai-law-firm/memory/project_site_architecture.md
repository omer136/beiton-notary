---
name: Website architecture and key files
description: notary.beiton.co site structure — Next.js App Router, key components, data sources
type: reference
---

**Stack:** Next.js 16 (App Router) + Vercel + next-intl (6 locales)
**Repo:** github.com/omer136/beiton-notary

## Key files:
- `src/app/layout.tsx` — Root layout with GTM + consent defaults
- `src/app/[locale]/layout.tsx` — Locale layout with RTL/LTR + fonts
- `src/components/NotaryHome.tsx` — Main homepage (client component, ~720 lines, all 6 language translations inline)
- `src/components/SiteHeader.tsx` — Shared header with full nav + language switcher
- `src/components/SiteFooter.tsx` — Shared footer with 25 service links by category
- `src/components/AgentChat.tsx` — Chat widget with Agent 1
- `src/components/PricingCalculator.tsx` — Reusable pricing calculator
- `src/lib/agent1-system-prompt.ts` — Agent 1 system prompt + tools
- `src/data/pricing-config.ts` — Single source of truth for pricing (from Monday board 18406291217)
- `src/data/use-cases.ts` — 25 use case pages data (HE/EN/RU/AR)
- `src/data/blog-articles.ts` — Blog article registry
- `src/app/api/chat/route.ts` — Chat API (Anthropic + Monday lead capture)
- `src/app/api/chat/save-transcript/route.ts` — Auto-save transcript to Monday

## Pages:
- `/[locale]` — Homepage (NotaryHome)
- `/[locale]/blog/notary-pricing-2026` — Pricing article (translated TSX)
- `/[locale]/blog/[slug]` — Dynamic blog articles from MDX
- `/[locale]/services/[slug]` — 25 service use case pages
- `/[locale]/terms`, `/privacy`, `/accessibility` — Legal pages
- `/sitemap.xml`, `/robots.txt` — SEO

## Content:
- `content/blog/*.mdx` — Hebrew articles
- `content/blog/{en,ru,ar,fr,es}/*.mdx` — Translated articles
- 7 blog articles × 6 languages = 42 MDX files
- 25 use case pages × 6 locales = 150 service pages

**Why:** This map helps navigate the codebase quickly without re-exploring.
**How to apply:** Reference when looking for where to make changes.

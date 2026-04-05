---
name: Analytics Implementation Spec
description: GTM + GA4 + Meta Pixel implementation for notary.beiton.co — board 18406184083, consent mode, language tracking from URL, dataLayer only
type: project
---

Analytics board: 18406184083
Sales funnel board: 18406004253
GTM is the single source — code only does dataLayer.push()
Language = current URL pathname segment (/he/, /en/, /ru/, /ar/, /fr/, /es/)
Consent Mode V2 defaults before GTM loads
UTM captured to sessionStorage for Agent 1 to save to Monday

**Why:** Multi-language ads targeting requires language-based audiences in GA4 and Meta. ROI tracking per language closes the loop via Monday.
**How to apply:** All analytics code must include `language` param from URL. Never use fbq() or gtag() directly in code — only dataLayer.push.

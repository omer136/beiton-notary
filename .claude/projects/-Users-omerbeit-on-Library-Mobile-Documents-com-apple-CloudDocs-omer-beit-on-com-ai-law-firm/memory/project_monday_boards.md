---
name: Monday.com board IDs and structure
description: All Monday boards used in the project — sales funnel, pricing, SEO, analytics, and their column IDs
type: reference
---

**Workspace:** Omer (ID: 1830846)

**Monday API Token:** stored in Vercel env as MONDAY_API_TOKEN (JWT token provided by Omer)

## Boards:

### Sales Funnel — 18406004253
Leads from chat agent. Group: group_mm1wxy0k
Key columns: color_mm1wcc5y (status), color_mm1wgvgc (language), color_mm1wjcxx (service), color_mm1wj0mz (channel), date_mm1w6eek (date+time), phone_mm1y71kv, email_mm1y3e3, long_text_mm1wcw3e (details), color_mm1yj27y (needs human), text_mm1za260 (utm_source)
Status labels: "פנייה ראשונית", "ממתין להצעת מחיר", "מבקש נציג"

### Pricing Table — 18406291217
Source of truth for all notary pricing. 36 items in 8 groups.
Groups: signature/POA (פרט 1), certified copy (פרט 2), translation (פרט 3), will/life cert/affidavit (פרט 4-6), prenup/POA cancel (פרט 7א,8), regulated surcharges (9-11), government fees, BEITON prices.

### SEO Articles — 18406184070
Blog articles planning and tracking.
Key columns: text_mm1xwv3x (keyword), color_mm1x29xv (status), date_mm1xmg5z (publish date), link_mm1xjyv1 (URL)

### Analytics — 18406184083
GTM/GA4/Meta implementation tracking.

### Pre-authentication reference — 6180884939
Which documents need pre-authentication before Foreign Ministry apostille.

**Why:** These board IDs are used in API calls from the website, chat agent, and automation scripts.
**How to apply:** Always use the correct board ID when reading/writing to Monday. Never hardcode IDs that might change — reference this memory.

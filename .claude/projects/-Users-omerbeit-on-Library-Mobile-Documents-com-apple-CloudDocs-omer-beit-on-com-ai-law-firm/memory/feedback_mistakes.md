---
name: Mistakes to never repeat
description: Common errors I've made that Omer corrected — never do these again
type: feedback
---

1. **Never load GA4 gtag.js directly alongside GTM.** GA4 must load ONLY through GTM. Adding a direct `<Script src="gtag/js?id=G-xxx">` causes duplicate tracking and conflicts with consent mode.

2. **Never use backticks inside template literal strings.** The agent system prompt is inside a template literal (backtick string). Using markdown code blocks with triple backticks inside it breaks the build. Use plain text instead.

3. **Apostille fee (41₪) is VAT-exempt.** Calculate VAT only on service fees and processing fees, then add the government fee separately. Never multiply 41₪ by 1.18.

4. **Apostille service is ALWAYS done** when a document goes abroad. The 41₪ government fee only applies if the destination country is a Hague Convention member. If not a member — no fee, but apostille is still done.

5. **Always translate content to all 6 languages.** Never publish a blog article or page in only one language.

6. **localStorage values for consent: use "granted"/"denied"**, not "true"/"false".

7. **.env.local doesn't upload to Vercel.** Environment variables must be set in Vercel Dashboard separately. Always remind the user to check Vercel env vars.

**Why:** These mistakes waste time and require multiple correction cycles.
**How to apply:** Check against this list before committing any related change.

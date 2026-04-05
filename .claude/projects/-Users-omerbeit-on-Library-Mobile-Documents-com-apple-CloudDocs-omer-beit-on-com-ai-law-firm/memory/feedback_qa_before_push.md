---
name: QA before pushing code changes
description: Always run build + local runtime smoke tests before committing/pushing any chat, API, or user-facing changes
type: feedback
---

Before every `git push` that touches the chat widget, `/api/*` routes, or any user-facing flow:

1. **Build** — `npm run build` (passes type + lint)
2. **Kill stale dev servers** — `lsof -ti:3000 | xargs kill -9` before running `npm run start`, otherwise curl tests hit old code
3. **Runtime smoke test** — `npm run start` locally, then hit:
   - `GET /` → expect 307 to locale
   - `GET /he` → expect 200
   - `POST /api/chat` with empty `messages:[]` → expect 400
   - `POST /api/chat` with missing messages field → expect 400
   - `POST /api/chat` with a valid user message → expect 200 + non-error reply
4. **Visual check** — open localhost:3000 in a browser, send a test message in the chat widget, confirm reply arrives and no "מצטערים, אירעה שגיאה"
5. **Only then** commit + push

**Why:** A recent refactor used functional `setMessages` and then read a captured variable immediately after — React doesn't guarantee synchronous execution of the updater, so `snapshot` stayed `[]`, an empty messages array was POSTed to Anthropic, and every chat reply became an error. `npm run build` passed because it only checks types. Without runtime testing the bug reached production and the user had to catch it.

**How to apply:** Any edit to `AgentChat.tsx`, `/api/chat/**`, `agent1-system-prompt.ts`, or middleware — assume nothing, run the full QA checklist locally before pushing. Prefer small, testable changes over large refactors.

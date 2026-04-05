---
name: Agent 1 conversation flow and pipeline
description: The 7-step chat conversation flow, what to collect, and the lead-to-quote pipeline
type: project
---

## Agent 1 — 7-step conversation flow:

1. **Identify need + name** (messages 1-2): Ask name naturally, suggest attaching document
2. **Targeted questions** (messages 2-3): Per service card — quantities, language, type, urgency
3. **Full quote** (message 3-4): Price breakdown + VAT + gov fees separate, estimated time (sum all components), presence required?, documents to prepare, delivery options
4. **Collect contact** (message 4-5): Phone or email with clear reason, offer safety net
5. **Close + next step** (message 5-6): Digital→send doc, presence→schedule, courier→address
6. **Final summary + handoff** (message 6): Summarize everything, tell client quote will be sent, capture_lead with ready_for_quote=true
7. **Retry** (message 5+ if no contact): Different phrasing, last attempt

## Key rules:
- Prices: always "before VAT (18%)" + total with VAT. Gov fees (apostille 41₪) are VAT-exempt — add separately.
- Apostille: ALWAYS done for documents going abroad. Fee only if Hague Convention member.
- Show only relevant pricing (birth cert ~200 words → don't show 1000+ rates)
- Gender-neutral language in Hebrew
- Lead enters Monday ONLY at end of conversation with full transcript
- 5min inactivity → nudge message, 10min → auto-save

## Pipeline after chat:
Lead (Monday) → Notary reviews → iCount quote (חשבון עסקה) with fee agreement → Client pays → Case board → Agent 2 produces documents → Notary signs → Done → Tax invoice (iCount)

**Why:** This is the core business flow. Agent 1 must follow this exactly.
**How to apply:** When updating agent1-system-prompt.ts, ensure all 7 steps and rules are preserved.

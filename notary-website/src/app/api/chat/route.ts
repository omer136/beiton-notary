import { NextRequest, NextResponse } from "next/server";
import {
  AGENT1_SYSTEM_PROMPT,
  AGENT1_TOOLS,
} from "@/lib/agent1-system-prompt";
import {
  MONDAY_URL,
  SALES_BOARD_ID,
  SALES_GROUPS,
  SALES_COLS,
  SALES_STATUS_LABELS,
} from "@/lib/monday-boards";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// Send error alert via email using Resend (if RESEND_API_KEY is set)
async function sendErrorAlert(subject: string, details: string) {
  console.error("[CHAT ERROR ALERT]", subject, details);
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "alerts@notary.beiton.co",
          to: "office@beiton.co",
          subject: `[BEITON Chat Alert] ${subject}`,
          html: `<h3>${subject}</h3><pre>${details}</pre><p>Time: ${new Date().toISOString()}</p>`,
        }),
      });
    } catch (e) {
      console.error("Resend alert failed:", e);
    }
  }
}

// ---------------------------------------------------------------------------
// Monday.com: upsert lead (create if new, update if existing)
// ---------------------------------------------------------------------------

interface LeadArgs {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  target_country?: string;
  service?: string;
  language?: string;
  language_pair?: string;
  quantity_description?: string;
  urgency?: string;
  summary_for_notary?: string;
  missing_info?: string;
  client_questions?: string;
  full_transcript?: string;
  estimated_price?: number;
  notary_fee?: number;
  translation_fee?: number;
  gov_fees?: number;
  handling_fee?: number;
  surcharges?: number;
  shipping_fee?: number;
  word_count?: number;
  document_type?: string;
  delivery_method?: string;
  apostille_needed?: string;
  msg_count?: number;
  needs_human?: boolean;
  ready_for_quote?: boolean;
  utm_source?: string;
}

async function mondayRequest(query: string, variables: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    console.warn("MONDAY_API_TOKEN not set — skipping Monday call");
    return null;
  }
  const resp = await fetch(MONDAY_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await resp.json();
  if (data.errors) {
    console.error("Monday API error:", JSON.stringify(data.errors));
    sendErrorAlert(
      "Monday API error",
      `Variables: ${JSON.stringify(variables).slice(0, 500)}\nErrors: ${JSON.stringify(data.errors).slice(0, 800)}`
    ).catch(() => {});
  }
  if (!resp.ok) {
    console.error("Monday HTTP error:", resp.status);
    sendErrorAlert(`Monday HTTP ${resp.status}`, JSON.stringify(variables).slice(0, 500)).catch(() => {});
  }
  return data;
}

function buildColumnValues(args: LeadArgs): Record<string, unknown> {
  const cols: Record<string, unknown> = {};

  if (args.language) {
    const langLabel = SALES_STATUS_LABELS.language[args.language];
    if (langLabel) cols[SALES_COLS.language] = { label: langLabel };
  }

  if (args.service && args.service !== "לא זוהה") {
    cols[SALES_COLS.service] = { label: args.service };
  } else if (args.service === "לא זוהה") {
    cols[SALES_COLS.service] = { label: "לא זוהה" };
  }

  if (args.phone) {
    cols[SALES_COLS.phone] = { phone: args.phone, countryShortName: "IL" };
  }
  if (args.email) {
    cols[SALES_COLS.email] = { email: args.email, text: args.email };
  }

  if (args.address) cols[SALES_COLS.clientAddress] = args.address;
  if (args.name) cols[SALES_COLS.clientName] = args.name;
  if (args.target_country) cols[SALES_COLS.targetCountry] = args.target_country;
  if (args.language_pair) cols[SALES_COLS.languagePair] = args.language_pair;
  if (args.quantity_description) cols[SALES_COLS.quantityDescription] = args.quantity_description;
  if (args.utm_source) cols[SALES_COLS.utmSource] = args.utm_source;

  if (args.summary_for_notary) {
    cols[SALES_COLS.summaryForNotary] = { text: args.summary_for_notary };
  }
  if (args.missing_info) {
    cols[SALES_COLS.missingInfo] = { text: args.missing_info };
  }
  if (args.client_questions) {
    cols[SALES_COLS.clientQuestions] = { text: args.client_questions };
  }
  // full_transcript no longer written to a column — it goes as a single Monday
  // "update" (comment) via save-transcript at end of conversation, with no char limit.

  if (args.urgency) {
    cols[SALES_COLS.urgency] = { label: args.urgency };
  }

  if (args.estimated_price !== undefined && args.estimated_price !== null) {
    cols[SALES_COLS.totalAmount] = String(args.estimated_price);
  }

  // Pricing breakdown
  if (args.notary_fee !== undefined) cols[SALES_COLS.notaryFee] = String(args.notary_fee);
  if (args.translation_fee !== undefined) cols[SALES_COLS.translationFee] = String(args.translation_fee);
  if (args.gov_fees !== undefined) cols[SALES_COLS.govFees] = String(args.gov_fees);
  if (args.handling_fee !== undefined) cols[SALES_COLS.handlingFee] = String(args.handling_fee);
  if (args.surcharges !== undefined) cols[SALES_COLS.surcharges] = String(args.surcharges);
  if (args.shipping_fee !== undefined) cols[SALES_COLS.shippingFee] = String(args.shipping_fee);
  if (args.word_count !== undefined) cols[SALES_COLS.wordCount] = String(args.word_count);
  if (args.document_type) cols[SALES_COLS.documentType] = args.document_type;
  if (args.delivery_method) cols[SALES_COLS.deliveryMethod] = { label: args.delivery_method };
  if (args.apostille_needed) cols[SALES_COLS.apostilleNeeded] = { label: args.apostille_needed };

  if (args.msg_count !== undefined) {
    cols[SALES_COLS.msgCount] = String(args.msg_count);
  }

  // needs_human flag — surfaced via summary_for_notary and clientWaitingFor

  // When ready for quote — flag the client as waiting for a quote
  if (args.ready_for_quote) {
    cols[SALES_COLS.clientWaitingFor] = { label: SALES_STATUS_LABELS.clientWaitingFor.quote };
  }

  return cols;
}

async function upsertMondayLead(
  args: LeadArgs,
  existingItemId?: string | null
): Promise<string | null> {
  const cols = buildColumnValues(args);

  if (existingItemId) {
    // UPDATE existing item — only writes fields provided in args
    const result = await mondayRequest(
      `mutation ($board: ID!, $item: ID!, $cols: JSON!) {
        change_multiple_column_values(board_id: $board, item_id: $item, column_values: $cols) { id }
      }`,
      {
        board: SALES_BOARD_ID,
        item: existingItemId,
        cols: JSON.stringify(cols),
      }
    );
    return result?.data?.change_multiple_column_values?.id || existingItemId;
  }

  // CREATE new item — add default status + channel + inquiry date
  cols[SALES_COLS.mainStatus] = { label: SALES_STATUS_LABELS.mainStatus.initialInquiry };
  cols[SALES_COLS.channel] = { label: SALES_STATUS_LABELS.channel.website };
  const now = new Date();
  cols[SALES_COLS.inquiryDate] = {
    date: now.toISOString().split("T")[0],
    time: now.toTimeString().slice(0, 8),
  };

  const name = args.name && args.name.trim()
    ? args.name.trim()
    : `שיחה ${now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" })} — ${args.service || "לא זוהה"}`;

  const result = await mondayRequest(
    `mutation ($board: ID!, $group: String!, $name: String!, $cols: JSON!) {
      create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $cols) { id }
    }`,
    {
      board: SALES_BOARD_ID,
      group: SALES_GROUPS.active,
      name,
      cols: JSON.stringify(cols),
    }
  );

  return result?.data?.create_item?.id || null;
}

// ---------------------------------------------------------------------------
// Anthropic: call Claude with tool loop
// ---------------------------------------------------------------------------

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function callClaude(
  messages: Message[],
  language: string,
  utmSource: string | undefined,
  existingItemId: string | null | undefined
): Promise<{ text: string; mondayItemId: string | null }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set!");
    sendErrorAlert("ANTHROPIC_API_KEY missing", "The API key is not configured in Vercel env vars. Chat is completely broken.").catch(() => {});
    return {
      text: language === "he"
        ? "מצטערים, השירות אינו זמין כרגע. אנא נסו שוב מאוחר יותר."
        : "Sorry, the service is temporarily unavailable. Please try again later.",
      mondayItemId: existingItemId || null,
    };
  }

  const anthropicMessages = messages.map((m) => ({ role: m.role, content: m.content }));

  let assistantText = "";
  let mondayItemId: string | null = existingItemId || null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loopMessages: any[] = [...anthropicMessages];

  for (let iterations = 0; iterations < 3; iterations++) {
    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1536,
        system: AGENT1_SYSTEM_PROMPT,
        tools: AGENT1_TOOLS,
        messages: loopMessages,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Anthropic API error:", resp.status, err);
      sendErrorAlert(
        `Anthropic API error ${resp.status}`,
        `Status: ${resp.status}\nError: ${err}\nLanguage: ${language}\nLast user message: ${messages[messages.length - 1]?.content || "N/A"}`
      ).catch(() => {});
      return {
        text: language === "he"
          ? "מצטערים, אירעה שגיאה. אנא נסו שוב."
          : "Sorry, an error occurred. Please try again.",
        mondayItemId,
      };
    }

    const data = await resp.json();
    const content = data.content as Array<{
      type: string;
      text?: string;
      id?: string;
      name?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input?: Record<string, any>;
    }>;

    for (const block of content) {
      if (block.type === "text" && block.text) {
        assistantText += block.text;
      }
    }

    const toolUse = content.find((b) => b.type === "tool_use");
    if (!toolUse || data.stop_reason !== "tool_use") break;

    // Execute capture_lead — upsert semantics
    let toolResult = "";
    if (toolUse.name === "capture_lead" && toolUse.input) {
      console.log("capture_lead called:", JSON.stringify(toolUse.input).slice(0, 200));
      try {
        const input = toolUse.input;
        const leadArgs: LeadArgs = {
          name: input.name,
          phone: input.phone,
          email: input.email,
          address: input.address || input.city,
          target_country: input.target_country,
          service: input.service,
          language: input.language || language,
          language_pair: input.language_pair,
          quantity_description: input.quantity_description,
          urgency: input.urgency,
          summary_for_notary: input.summary_for_notary,
          missing_info: input.missing_info,
          client_questions: input.client_questions,
          estimated_price: typeof input.estimated_price === "number" ? input.estimated_price : undefined,
          notary_fee: typeof input.notary_fee === "number" ? input.notary_fee : undefined,
          translation_fee: typeof input.translation_fee === "number" ? input.translation_fee : undefined,
          gov_fees: typeof input.gov_fees === "number" ? input.gov_fees : undefined,
          handling_fee: typeof input.handling_fee === "number" ? input.handling_fee : undefined,
          surcharges: typeof input.surcharges === "number" ? input.surcharges : undefined,
          shipping_fee: typeof input.shipping_fee === "number" ? input.shipping_fee : undefined,
          word_count: typeof input.word_count === "number" ? input.word_count : undefined,
          document_type: input.document_type,
          delivery_method: input.delivery_method,
          apostille_needed: input.apostille_needed,
          needs_human: input.needs_human === true || input.needs_human === "true",
          ready_for_quote: input.ready_for_quote === true || input.ready_for_quote === "true",
          utm_source: utmSource,
        };
        const resultId = await upsertMondayLead(leadArgs, mondayItemId);
        if (resultId) {
          mondayItemId = resultId;
          toolResult = JSON.stringify({
            success: true,
            message: existingItemId ? "Lead updated" : "Lead saved",
            itemId: resultId,
          });
        } else {
          sendErrorAlert("capture_lead: upsert returned no id", `Args: ${JSON.stringify(leadArgs).slice(0, 500)}`).catch(() => {});
          toolResult = JSON.stringify({ success: false, message: "Monday save failed" });
        }
      } catch (e) {
        console.error("capture_lead error:", e);
        toolResult = JSON.stringify({ success: false, message: String(e) });
      }
    }

    loopMessages = [
      ...loopMessages,
      { role: "assistant" as const, content },
      {
        role: "user" as const,
        content: [
          { type: "tool_result", tool_use_id: toolUse.id, content: toolResult },
        ],
      },
    ];
  }

  return { text: assistantText || "...", mondayItemId };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language, utm, existingItemId } = body as {
      messages: Message[];
      language: string;
      utm?: { utm_source?: string } | null;
      existingItemId?: string | null;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn("Chat API called with empty/invalid messages", { messages });
      return NextResponse.json(
        { error: "messages array required and cannot be empty" },
        { status: 400 }
      );
    }

    const { text: reply, mondayItemId } = await callClaude(
      messages,
      language || "he",
      utm?.utm_source,
      existingItemId
    );

    // Alert if response is empty or error-like
    if (!reply || reply === "..." || reply.includes("מצטערים") || reply.toLowerCase().includes("sorry, an error")) {
      sendErrorAlert(
        "Chat returned empty/error response",
        `Reply: ${reply}\nLanguage: ${language}\nMessages count: ${messages.length}\nLast user msg: ${messages[messages.length - 1]?.content || "N/A"}`
      ).catch(() => {});
    }

    let itemId: string | null = mondayItemId;

    // Safety net: ensure a Monday item exists for this conversation.
    // If the agent already called capture_lead and we have an itemId — skip.
    // Only create a MINIMAL item on the first message so there's something in the board.
    // Don't write transcript/count here — that happens once via save-transcript at end.
    if (!itemId) {
      const allText = messages.map((m) => m.content).join(" ");
      const heuristicService =
        /תרגום|translat/i.test(allText) ? "תרגום נוטריוני"
        : /חתימה|signature/i.test(allText) ? "אימות חתימה"
        : /ייפוי כוח|power of attorney/i.test(allText) ? "ייפוי כוח"
        : /צוואה|will/i.test(allText) ? "צוואה"
        : /תצהיר|affidavit/i.test(allText) ? "תצהיר"
        : /הסכם ממון|prenup/i.test(allText) ? "הסכם ממון"
        : /אפוסטיל|apostil/i.test(allText) ? "אפוסטיל"
        : /העתק|copy/i.test(allText) ? "העתק נאמן למקור"
        : "לא זוהה";
      try {
        itemId = await upsertMondayLead(
          {
            service: heuristicService,
            language: language || "he",
            utm_source: utm?.utm_source,
          },
          null // force create
        );
      } catch (e) {
        console.error("Safety-net create error:", e);
      }
    }

    return NextResponse.json({ reply, itemId });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

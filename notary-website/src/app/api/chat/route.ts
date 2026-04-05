import { NextRequest, NextResponse } from "next/server";
import {
  AGENT1_SYSTEM_PROMPT,
  AGENT1_TOOLS,
} from "@/lib/agent1-system-prompt";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MONDAY_URL = "https://api.monday.com/v2";
const BOARD_ID = "18406004253";
const GROUP_ID = "group_mm1wxy0k";

const LANG_LABELS: Record<string, string> = {
  he: "עברית",
  en: "English",
  ru: "Русский",
  ar: "العربية",
  fr: "Français",
  es: "Español",
};

// Send error alert via email using Resend (if RESEND_API_KEY is set)
// and also log as Monday update on an alert board
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
// Monday.com: create lead
// ---------------------------------------------------------------------------

async function createMondayLead(lead: {
  name: string;
  phone?: string;
  email?: string;
  service: string;
  language: string;
  details?: string;
  needs_human?: boolean;
  ready_for_quote?: boolean;
  utm_source?: string;
}) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    console.warn("MONDAY_API_TOKEN not set — skipping lead capture");
    return null;
  }

  const colValues: Record<string, unknown> = {
    color_mm1wcc5y: { label: "פנייה ראשונית" },
    color_mm1wgvgc: { label: LANG_LABELS[lead.language] || "עברית" },
    color_mm1wjcxx: { label: lead.service || "לא זוהה" },
    color_mm1wj0mz: { label: "אתר" },
    date_mm1w6eek: { date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5) },
    numeric_mm1wtzxs: "1",
    long_text_mm1wcw3e: { text: lead.details || "" },
  };

  if (lead.phone) {
    colValues.phone_mm1y71kv = {
      phone: lead.phone,
      countryShortName: "IL",
    };
  }
  if (lead.email) {
    colValues.email_mm1y3e3 = {
      email: lead.email,
      text: lead.email,
    };
  }
  if (lead.needs_human) {
    colValues.color_mm1yj27y = { label: "מבקש נציג" };
  }
  if (lead.ready_for_quote) {
    colValues.color_mm1wcc5y = { label: "ממתין להצעת מחיר" };
  }
  if (lead.utm_source) {
    colValues.text_mm1za260 = lead.utm_source;
  }

  const query = `mutation ($board: ID!, $group: String!, $name: String!, $cols: JSON!) {
    create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $cols) { id }
  }`;

  const resp = await fetch(MONDAY_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2024-10",
    },
    body: JSON.stringify({
      query,
      variables: {
        board: BOARD_ID,
        group: GROUP_ID,
        name: lead.name || "לקוח אנונימי — " + new Date().toLocaleDateString("he-IL") + " " + new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
        cols: JSON.stringify(colValues),
      },
    }),
  });

  const data = await resp.json();
  if (data.errors) {
    console.error("Monday API error:", JSON.stringify(data.errors));
    sendErrorAlert(
      "Monday API error on lead save",
      `Lead: ${JSON.stringify(lead).slice(0, 400)}\nErrors: ${JSON.stringify(data.errors).slice(0, 500)}`
    ).catch(() => {});
  }
  if (!resp.ok) {
    console.error("Monday HTTP error:", resp.status);
    sendErrorAlert(
      `Monday HTTP ${resp.status}`,
      `Lead: ${JSON.stringify(lead).slice(0, 400)}`
    ).catch(() => {});
  }
  return data;
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
  utmSource?: string
): Promise<{ text: string; leadCaptured: boolean; mondayItemId: string | null }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set!");
    sendErrorAlert("ANTHROPIC_API_KEY missing", "The API key is not configured in Vercel env vars. Chat is completely broken.").catch(() => {});
    return { text: language === "he"
      ? "מצטערים, השירות אינו זמין כרגע. אנא נסו שוב מאוחר יותר."
      : "Sorry, the service is temporarily unavailable. Please try again later.", leadCaptured: false, mondayItemId: null };
  }

  // Build Anthropic messages format
  const anthropicMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let assistantText = "";
  let leadCaptured = false;
  let mondayItemId: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let loopMessages: any[] = [...anthropicMessages];
  let iterations = 0;

  // Tool use loop — max 3 iterations
  while (iterations < 3) {
    iterations++;

    const resp = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
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
      return { text: language === "he"
        ? "מצטערים, אירעה שגיאה. אנא נסו שוב."
        : "Sorry, an error occurred. Please try again.", leadCaptured: false, mondayItemId: null };
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

    // Collect text blocks
    for (const block of content) {
      if (block.type === "text" && block.text) {
        assistantText += block.text;
      }
    }

    // Check for tool use
    const toolUse = content.find((b) => b.type === "tool_use");
    if (!toolUse || data.stop_reason !== "tool_use") {
      break; // No tool call — done
    }

    // Execute tool
    let toolResult = "";
    if (toolUse.name === "capture_lead" && toolUse.input) {
      console.log("capture_lead called:", JSON.stringify(toolUse.input).slice(0, 200));
      try {
        const result = await createMondayLead({
          name: toolUse.input.name || "",
          phone: toolUse.input.phone,
          email: toolUse.input.email,
          service: toolUse.input.service || "",
          language: toolUse.input.language || language,
          details: toolUse.input.details,
          needs_human: toolUse.input.needs_human === "true" || toolUse.input.needs_human === true,
          ready_for_quote: toolUse.input.ready_for_quote === "true" || toolUse.input.ready_for_quote === true,
          utm_source: utmSource,
        });
        mondayItemId = result?.data?.create_item?.id || null;
        console.log("Monday lead result:", mondayItemId || JSON.stringify(result?.errors || "no response").slice(0, 200));
        if (mondayItemId) {
          leadCaptured = true;
        } else {
          sendErrorAlert(
            "capture_lead: Monday returned no itemId",
            `Result: ${JSON.stringify(result).slice(0, 500)}`
          ).catch(() => {});
        }
        toolResult = JSON.stringify({
          success: !!mondayItemId,
          message: mondayItemId ? "Lead saved to Monday.com" : "Monday save failed",
          itemId: mondayItemId,
        });
      } catch (e) {
        console.error("capture_lead error:", e);
        toolResult = JSON.stringify({
          success: false,
          message: String(e),
        });
      }
    }

    // Add assistant response + tool result to messages for next iteration
    loopMessages = [
      ...loopMessages,
      { role: "assistant" as const, content },
      {
        role: "user" as const,
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: toolResult,
          },
        ],
      },
    ];

    // Don't reset text — keep any text that came with the tool use
    // The next iteration will append the final response on top
  }

  return { text: assistantText || "...", leadCaptured, mondayItemId };
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

    const { text: reply, leadCaptured, mondayItemId } = await callClaude(messages, language || "he", utm?.utm_source);

    // Alert if response is empty or error-like
    if (!reply || reply === "..." || reply.includes("מצטערים") || reply.toLowerCase().includes("sorry, an error")) {
      sendErrorAlert(
        "Chat returned empty/error response",
        `Reply: ${reply}\nLanguage: ${language}\nMessages count: ${messages.length}\nLast user msg: ${messages[messages.length - 1]?.content || "N/A"}`
      ).catch(() => {});
    }

    let itemId = mondayItemId || existingItemId || null;

    // Build full transcript including the just-generated reply
    const fullMessages: Message[] = [...messages, { role: "assistant", content: reply }];
    const transcript = fullMessages
      .map(m => (m.role === "user" ? "לקוח: " : "נועה: ") + m.content)
      .join("\n");
    const msgCount = fullMessages.filter(m => m.role === "user").length;

    const allText = fullMessages.map(m => m.content).join(" ");
    const service = /תרגום|translat/i.test(allText) ? "תרגום נוטריוני"
      : /חתימה|signature/i.test(allText) ? "אימות חתימה"
      : /ייפוי כוח|power of attorney/i.test(allText) ? "ייפוי כוח"
      : /צוואה|will/i.test(allText) ? "צוואה"
      : /תצהיר|affidavit/i.test(allText) ? "תצהיר"
      : /הסכם ממון|prenup/i.test(allText) ? "הסכם ממון"
      : /אפוסטיל|apostil/i.test(allText) ? "אפוסטיל"
      : /העתק|copy/i.test(allText) ? "העתק נאמן"
      : "לא זוהה";

    // Case 1: no item yet + user sent at least 1 message → create item with full transcript
    if (!itemId && msgCount >= 1) {
      console.log("Creating Monday lead (no itemId yet), service:", service);
      try {
        const fallbackResult = await createMondayLead({
          name: "",
          service,
          language: language || "he",
          details: transcript.slice(0, 2000),
          utm_source: utm?.utm_source,
        });
        itemId = fallbackResult?.data?.create_item?.id || null;
      } catch (e) { console.error("Fallback lead save error:", e); }
    }
    // Case 2: item already exists → update its transcript column so every turn is persisted server-side
    else if (itemId && msgCount >= 1) {
      try {
        const token = process.env.MONDAY_API_TOKEN;
        if (token) {
          await fetch(MONDAY_URL, {
            method: "POST",
            headers: { Authorization: token, "Content-Type": "application/json", "API-Version": "2024-10" },
            body: JSON.stringify({
              query: `mutation ($board: ID!, $item: ID!, $cols: JSON!) { change_multiple_column_values(board_id: $board, item_id: $item, column_values: $cols) { id } }`,
              variables: {
                board: BOARD_ID,
                item: itemId,
                cols: JSON.stringify({
                  long_text_mm1wcw3e: { text: transcript.slice(0, 2000) },
                  numeric_mm1wtzxs: String(msgCount),
                }),
              },
            }),
          });
        }
      } catch (e) { console.error("Transcript update error:", e); }
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

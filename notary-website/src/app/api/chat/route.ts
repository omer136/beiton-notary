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
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return language === "he"
      ? "מצטערים, השירות אינו זמין כרגע. אנא נסו שוב מאוחר יותר."
      : "Sorry, the service is temporarily unavailable. Please try again later.";
  }

  // Build Anthropic messages format
  const anthropicMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let assistantText = "";
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
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: AGENT1_SYSTEM_PROMPT,
        tools: AGENT1_TOOLS,
        messages: loopMessages,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Anthropic API error:", resp.status, err);
      return language === "he"
        ? "מצטערים, אירעה שגיאה. אנא נסו שוב."
        : "Sorry, an error occurred. Please try again.";
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
      try {
        await createMondayLead({
          name: toolUse.input.name || "",
          phone: toolUse.input.phone,
          email: toolUse.input.email,
          service: toolUse.input.service || "",
          language: toolUse.input.language || language,
          details: toolUse.input.details,
          needs_human: toolUse.input.needs_human === "true" || toolUse.input.needs_human === true,
          utm_source: utmSource,
        });
        toolResult = JSON.stringify({
          success: true,
          message: "Lead saved to Monday.com",
        });
      } catch (e) {
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

    // Reset text — the final response comes in the next iteration
    assistantText = "";
  }

  return assistantText || "...";
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language, utm } = body as {
      messages: Message[];
      language: string;
      utm?: { utm_source?: string } | null;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array required" },
        { status: 400 }
      );
    }

    const reply = await callClaude(messages, language || "he", utm?.utm_source);

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

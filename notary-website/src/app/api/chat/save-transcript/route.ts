import { NextRequest, NextResponse } from "next/server";
import {
  MONDAY_URL,
  SALES_BOARD_ID,
  SALES_COLS,
} from "@/lib/monday-boards";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function mondayMutation(query: string, variables: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    console.error("MONDAY_API_TOKEN not set — cannot save to Monday");
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
  }
  return data;
}

function formatTranscript(messages: ChatMessage[], language: string): string {
  const roleLabel = language === "he" || language === "ar"
    ? { user: "לקוח", assistant: "נועה" }
    : { user: "Client", assistant: "Noa" };
  return messages
    .map((m) => `${roleLabel[m.role]}: ${m.content}`)
    .join("\n\n");
}

/**
 * Called ONCE at end of conversation (page leave / 10-min inactivity).
 * Creates a single Monday "update" (comment) on the item with the full
 * transcript, and sets the final message count.
 *
 * Idempotent: if an update already exists on the item, we skip.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language, itemId } = body as {
      messages: ChatMessage[];
      language: string;
      itemId?: string;
    };

    if (!messages || messages.length < 2 || !itemId) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Check if we already posted an update on this item — prevent duplicates
    const existingUpdates = await mondayMutation(
      `query ($id: [ID!]!) { items(ids: $id) { updates(limit: 1) { id } } }`,
      { id: [itemId] }
    );
    const hasUpdates = (existingUpdates?.data?.items?.[0]?.updates?.length || 0) > 0;
    if (hasUpdates) {
      console.log("save-transcript: update already exists for", itemId, "— skipping");
      return NextResponse.json({ ok: true, skipped: true, reason: "update_exists" });
    }

    const transcript = formatTranscript(messages, language);
    const msgCount = messages.filter((m) => m.role === "user").length;

    // Create ONE update with full transcript (no char limit on updates)
    await mondayMutation(
      `mutation ($id: ID!, $body: String!) { create_update(item_id: $id, body: $body) { id } }`,
      { id: itemId, body: `<h3>תמלול שיחה</h3><pre>${transcript}</pre>` }
    );

    // Set final message count
    await mondayMutation(
      `mutation ($board: ID!, $item: ID!, $cols: JSON!) {
        change_multiple_column_values(board_id: $board, item_id: $item, column_values: $cols) { id }
      }`,
      {
        board: SALES_BOARD_ID,
        item: itemId,
        cols: JSON.stringify({
          [SALES_COLS.msgCount]: String(msgCount),
        }),
      }
    );

    return NextResponse.json({ ok: true, updated: itemId });
  } catch (e) {
    console.error("Save transcript error:", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

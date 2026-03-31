import { NextRequest, NextResponse } from "next/server";

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function mondayMutation(query: string, variables: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) return null;

  const resp = await fetch(MONDAY_URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables }),
  });
  return resp.json();
}

function formatTranscript(messages: ChatMessage[], language: string): string {
  const roleLabel = language === "he" || language === "ar"
    ? { user: "לקוח", assistant: "נועה" }
    : { user: "Client", assistant: "Noa" };

  return messages
    .map((m) => `${roleLabel[m.role]}: ${m.content}`)
    .join("\n\n");
}

function detectService(messages: ChatMessage[]): string {
  const all = messages.map((m) => m.content).join(" ").toLowerCase();
  if (/תרגום|translat|перевод|ترجم|traduct/i.test(all)) return "תרגום נוטריוני";
  if (/חתימה|signature|подпись|توقيع|firma/i.test(all)) return "אימות חתימה";
  if (/ייפוי כוח|power of attorney|доверенност|توكيل|procurat|poder/i.test(all)) return "ייפוי כוח";
  if (/צוואה|will|завещани|وصي|testament/i.test(all)) return "צוואה";
  if (/תצהיר|affidavit|аффидевит|إفاد|declarati/i.test(all)) return "תצהיר";
  if (/הסכם ממון|prenup|брачн|اتفاقية مال|contrat de mariage/i.test(all)) return "הסכם ממון";
  if (/אפוסטיל|apostil|апостил|أبوستيل/i.test(all)) return "אפוסטיל";
  if (/העתק|copy|копи|نسخ|copie/i.test(all)) return "העתק נאמן למקור";
  if (/אישור חיים|life certif|свидетельство о жизни|شهادة حياة/i.test(all)) return "אישור חיים";
  return "לא זוהה";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language, itemId } = body as {
      messages: ChatMessage[];
      language: string;
      itemId?: string;
    };

    if (!messages || messages.length < 2) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const transcript = formatTranscript(messages, language);
    const service = detectService(messages);
    const msgCount = messages.filter((m) => m.role === "user").length;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const timeStr = now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" });

    // If we already have an item from capture_lead — add transcript as update
    if (itemId) {
      await mondayMutation(
        `mutation ($id: ID!, $body: String!) { create_update(item_id: $id, body: $body) { id } }`,
        { id: itemId, body: `<h3>תמלול שיחה</h3><pre>${transcript}</pre>` }
      );

      // Update message count
      await mondayMutation(
        `mutation ($board: ID!, $item: ID!, $cols: JSON!) { change_multiple_column_values(board_id: $board, item_id: $item, column_values: $cols) { id } }`,
        {
          board: BOARD_ID,
          item: itemId,
          cols: JSON.stringify({ numeric_mm1wtzxs: String(msgCount) }),
        }
      );

      return NextResponse.json({ ok: true, updated: itemId });
    }

    // No existing item — create one with transcript
    const colValues: Record<string, unknown> = {
      color_mm1wcc5y: { label: "פנייה ראשונית" },
      color_mm1wgvgc: { label: LANG_LABELS[language] || "עברית" },
      color_mm1wjcxx: { label: service },
      color_mm1wj0mz: { label: "אתר" },
      date_mm1w6eek: { date: today, time: timeStr },
      numeric_mm1wtzxs: String(msgCount),
      long_text_mm1wcw3e: { text: transcript.slice(0, 2000) },
    };

    const result = await mondayMutation(
      `mutation ($board: ID!, $group: String!, $name: String!, $cols: JSON!) {
        create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $cols) { id }
      }`,
      {
        board: BOARD_ID,
        group: GROUP_ID,
        name: `שיחה ${timeStr} — ${service} (${LANG_LABELS[language] || language})`,
        cols: JSON.stringify(colValues),
      }
    );

    const newId = result?.data?.create_item?.id;

    // Add full transcript as update
    if (newId) {
      await mondayMutation(
        `mutation ($id: ID!, $body: String!) { create_update(item_id: $id, body: $body) { id } }`,
        { id: String(newId), body: `<h3>תמלול שיחה</h3><pre>${transcript}</pre>` }
      );
    }

    return NextResponse.json({ ok: true, created: newId });
  } catch (e) {
    console.error("Save transcript error:", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

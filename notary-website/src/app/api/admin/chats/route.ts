import { NextRequest, NextResponse } from "next/server";

const MONDAY_URL = "https://api.monday.com/v2";
const BOARD_ID = "18406004253";

// Column IDs on sales funnel board
const COL = {
  status: "color_mm1wcc5y",      // status label
  language: "color_mm1wgvgc",    // language
  service: "color_mm1wjcxx",     // service type
  source: "color_mm1wj0mz",      // acquisition source
  date: "date_mm1w6eek",         // date + time
  msgCount: "numeric_mm1wtzxs",  // user message count
  transcript: "long_text_mm1wcw3e",
  phone: "phone_mm1y71kv",
  email: "email_mm1y3e3",
  needsHuman: "color_mm1yj27y",
  utmSource: "text_mm1za260",
};

interface Filters {
  from?: string;       // YYYY-MM-DD
  to?: string;         // YYYY-MM-DD
  language?: string;   // "he" | "en" | ...
  service?: string;    // substring match
  status?: string;     // substring match
  minMsgs?: number;
  hasContact?: boolean;  // only items with phone or email
  searchText?: string;   // substring in transcript
  limit?: number;        // default 50, max 500
}

const LANG_LABELS: Record<string, string> = {
  he: "עברית", en: "English", ru: "Русский",
  ar: "العربية", fr: "Français", es: "Español",
};

// GET /api/admin/chats?secret=...&lang=he&from=2026-04-01&minMsgs=2&hasContact=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Auth
  const secret = searchParams.get("secret");
  const expected = process.env.ADMIN_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "MONDAY_API_TOKEN not set" }, { status: 500 });
  }

  const filters: Filters = {
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    language: searchParams.get("language") || undefined,
    service: searchParams.get("service") || undefined,
    status: searchParams.get("status") || undefined,
    minMsgs: searchParams.get("minMsgs") ? Number(searchParams.get("minMsgs")) : undefined,
    hasContact: searchParams.get("hasContact") === "true" ? true : undefined,
    searchText: searchParams.get("searchText") || undefined,
    limit: Math.min(Number(searchParams.get("limit") || "50"), 500),
  };

  // Fetch items from Monday (paginate through all items on board, up to a safe max)
  const allItems: Array<Record<string, unknown>> = [];
  let cursor: string | null = null;
  const MAX_PAGES = 10; // 10 * 100 = 1000 items max per query

  for (let page = 0; page < MAX_PAGES; page++) {
    const query: string = cursor
      ? `query { next_items_page(limit: 100, cursor: "${cursor}") { cursor items { id name created_at updated_at column_values { id text value } } } }`
      : `query { boards(ids: ${BOARD_ID}) { items_page(limit: 100) { cursor items { id name created_at updated_at column_values { id text value } } } } }`;

    const resp = await fetch(MONDAY_URL, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json", "API-Version": "2024-10" },
      body: JSON.stringify({ query }),
    });
    const data = await resp.json();
    if (data.errors) {
      return NextResponse.json({ error: "Monday error", details: data.errors }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page_data: { cursor: string | null; items: any[] } | undefined = cursor
      ? data.data?.next_items_page
      : data.data?.boards?.[0]?.items_page;
    if (!page_data) break;

    allItems.push(...(page_data.items || []));
    cursor = page_data.cursor;
    if (!cursor) break;
  }

  // Normalize items
  const normalized = allItems.map((raw) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = raw as any;
    const cols: Record<string, { text: string; value: string | null }> = {};
    for (const cv of item.column_values || []) {
      cols[cv.id] = { text: cv.text || "", value: cv.value };
    }
    return {
      id: item.id,
      name: item.name,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      status: cols[COL.status]?.text || "",
      language: cols[COL.language]?.text || "",
      service: cols[COL.service]?.text || "",
      source: cols[COL.source]?.text || "",
      date: cols[COL.date]?.text || "",
      msgCount: Number(cols[COL.msgCount]?.text || "0"),
      transcript: cols[COL.transcript]?.text || "",
      phone: cols[COL.phone]?.text || "",
      email: cols[COL.email]?.text || "",
      needsHuman: cols[COL.needsHuman]?.text || "",
      utmSource: cols[COL.utmSource]?.text || "",
    };
  });

  // Apply filters
  let filtered = normalized;

  if (filters.from) filtered = filtered.filter((i) => i.date >= filters.from!);
  if (filters.to) filtered = filtered.filter((i) => i.date <= filters.to!);
  if (filters.language) {
    const label = LANG_LABELS[filters.language] || filters.language;
    filtered = filtered.filter((i) => i.language === label);
  }
  if (filters.service) {
    filtered = filtered.filter((i) => i.service.toLowerCase().includes(filters.service!.toLowerCase()));
  }
  if (filters.status) {
    filtered = filtered.filter((i) => i.status.toLowerCase().includes(filters.status!.toLowerCase()));
  }
  if (filters.minMsgs !== undefined) {
    filtered = filtered.filter((i) => i.msgCount >= filters.minMsgs!);
  }
  if (filters.hasContact) {
    filtered = filtered.filter((i) => i.phone || i.email);
  }
  if (filters.searchText) {
    const needle = filters.searchText.toLowerCase();
    filtered = filtered.filter((i) => i.transcript.toLowerCase().includes(needle));
  }

  // Sort newest first, apply limit
  filtered.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  const result = filtered.slice(0, filters.limit);

  // Aggregate stats for the learning loop
  const stats = {
    total_matched: filtered.length,
    total_on_board: normalized.length,
    returned: result.length,
    by_language: {} as Record<string, number>,
    by_service: {} as Record<string, number>,
    by_status: {} as Record<string, number>,
    with_contact: filtered.filter((i) => i.phone || i.email).length,
    without_contact: filtered.filter((i) => !i.phone && !i.email).length,
    needs_human: filtered.filter((i) => i.needsHuman).length,
    avg_msgs: filtered.length ? Math.round(filtered.reduce((s, i) => s + i.msgCount, 0) / filtered.length * 10) / 10 : 0,
  };
  for (const i of filtered) {
    stats.by_language[i.language || "unknown"] = (stats.by_language[i.language || "unknown"] || 0) + 1;
    stats.by_service[i.service || "unknown"] = (stats.by_service[i.service || "unknown"] || 0) + 1;
    stats.by_status[i.status || "unknown"] = (stats.by_status[i.status || "unknown"] || 0) + 1;
  }

  return NextResponse.json({ filters, stats, items: result });
}

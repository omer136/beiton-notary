#!/usr/bin/env node
/**
 * sync-conversations.js
 *
 * One-way mirror: Monday board → ../conversations/ folder on disk.
 *
 * For every item on the sales board, finds the most recent .txt attachment
 * in the chat_files column ("קבצים מהצ'אט") and writes it locally as
 * `BEI-yyyymmdd-XXXXXX.txt` (or `legacy-{itemId}.txt` for items predating
 * the session-id feature).
 *
 * Run from the notary-website directory:
 *
 *   npm run sync-chats
 *
 * Idempotent — files that already match are skipped.
 *
 * Reads MONDAY_API_TOKEN from .env.local. Writes nothing to Monday.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CONVERSATIONS_DIR = path.join(REPO_ROOT, "conversations");
const ENV_FILE = path.join(__dirname, "..", ".env.local");

const BOARD_ID = "18406004253";
const SESSION_ID_COL = "text_mm2xd0ca";
const CHAT_FILES_COL = "file_mm24mvk2";
const INQUIRY_DATE_COL = "date_mm1w6eek";

const MONDAY_URL = "https://api.monday.com/v2";

// ---------------------------------------------------------------------------
// Read MONDAY_API_TOKEN from .env.local without bringing in dotenv
// ---------------------------------------------------------------------------
function loadToken() {
  if (process.env.MONDAY_API_TOKEN) return process.env.MONDAY_API_TOKEN;
  if (!fs.existsSync(ENV_FILE)) {
    console.error(`Could not find ${ENV_FILE}. Set MONDAY_API_TOKEN in env or that file.`);
    process.exit(1);
  }
  const lines = fs.readFileSync(ENV_FILE, "utf-8").split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*MONDAY_API_TOKEN\s*=\s*(.+?)\s*$/);
    if (m) {
      let val = m[1];
      // Strip surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      return val;
    }
  }
  console.error(`MONDAY_API_TOKEN not found in ${ENV_FILE}`);
  process.exit(1);
}

const TOKEN = loadToken();

// ---------------------------------------------------------------------------
// Monday GraphQL helper
// ---------------------------------------------------------------------------
async function gql(query, variables = {}) {
  const resp = await fetch(MONDAY_URL, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await resp.json();
  if (data.errors) {
    throw new Error(`Monday error: ${JSON.stringify(data.errors)}`);
  }
  return data.data;
}

// ---------------------------------------------------------------------------
// Page through all items on the board with the columns we need.
// ---------------------------------------------------------------------------
async function fetchAllItems() {
  const all = [];
  let cursor = null;
  while (true) {
    const data = cursor
      ? await gql(
          `query ($cursor: String!) {
            next_items_page(cursor: $cursor, limit: 100) {
              cursor
              items {
                id name created_at
                column_values(ids: ["${SESSION_ID_COL}", "${CHAT_FILES_COL}", "${INQUIRY_DATE_COL}"]) {
                  id text value
                }
              }
            }
          }`,
          { cursor }
        )
      : await gql(
          `query ($board: ID!) {
            boards(ids: [$board]) {
              items_page(limit: 100) {
                cursor
                items {
                  id name created_at
                  column_values(ids: ["${SESSION_ID_COL}", "${CHAT_FILES_COL}", "${INQUIRY_DATE_COL}"]) {
                    id text value
                  }
                }
              }
            }
          }`,
          { board: BOARD_ID }
        );
    const page = cursor ? data.next_items_page : data.boards[0].items_page;
    all.push(...page.items);
    if (!page.cursor) break;
    cursor = page.cursor;
  }
  return all;
}

// ---------------------------------------------------------------------------
// Pull asset metadata so we can find the most recent .txt attached to an
// item's chat_files column, and download its contents.
// ---------------------------------------------------------------------------
async function fetchAssetUrls(assetIds) {
  if (assetIds.length === 0) return {};
  const data = await gql(
    `query ($ids: [ID!]!) {
      assets(ids: $ids) { id name public_url created_at }
    }`,
    { ids: assetIds }
  );
  const map = {};
  for (const a of data.assets || []) map[a.id] = a;
  return map;
}

async function downloadFile(url) {
  // We use Monday's `public_url` which is an AWS S3 signed URL. The signature
  // is encoded in the query string — passing an Authorization header would
  // make S3 reject the request as "InvalidArgument: Cannot specify both X-Amz
  // params and Authorization header". So: NO custom headers for S3.
  const isS3 = /amazonaws\.com/.test(url);
  const resp = await fetch(url, {
    headers: isS3
      ? { "User-Agent": "Mozilla/5.0 (compatible; beiton-sync/1.0)" }
      : {
          Authorization: TOKEN,
          Accept: "*/*",
          "User-Agent": "Mozilla/5.0 (compatible; beiton-sync/1.0)",
        },
  });
  if (!resp.ok) throw new Error(`Download failed (${resp.status}) for ${url}`);
  return await resp.text();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  fs.mkdirSync(CONVERSATIONS_DIR, { recursive: true });

  console.log(`Fetching items from Monday board ${BOARD_ID}...`);
  const items = await fetchAllItems();
  console.log(`Got ${items.length} items.`);

  // Collect every asset ID referenced by chat_files columns so we can fetch
  // their URLs in one batch.
  const assetIds = new Set();
  const itemAssetMap = new Map();
  for (const it of items) {
    const fileCol = it.column_values.find((c) => c.id === CHAT_FILES_COL);
    if (!fileCol || !fileCol.value) continue;
    let parsed;
    try { parsed = JSON.parse(fileCol.value); } catch { continue; }
    const files = parsed.files || [];
    if (files.length === 0) continue;
    // We only care about .txt files (the transcript). If multiple, take the
    // most recent .txt (highest createdAt or last in the array).
    const txts = files.filter((f) => (f.name || "").toLowerCase().endsWith(".txt"));
    if (txts.length === 0) continue;
    const latest = txts[txts.length - 1];
    assetIds.add(String(latest.assetId));
    itemAssetMap.set(it.id, { assetId: String(latest.assetId), filename: latest.name });
  }

  console.log(`Resolving ${assetIds.size} attachment URLs...`);
  const assetMap = await fetchAssetUrls(Array.from(assetIds));

  let nNew = 0, nUpdated = 0, nUnchanged = 0, nSkipped = 0;

  for (const it of items) {
    const sessionCol = it.column_values.find((c) => c.id === SESSION_ID_COL);
    const sessionId = sessionCol?.text?.trim() || "";
    const localName = sessionId
      ? `${sessionId}.txt`
      : `legacy-${it.id}.txt`;
    const localPath = path.join(CONVERSATIONS_DIR, localName);

    const ref = itemAssetMap.get(it.id);
    if (!ref) {
      nSkipped++;
      continue;
    }
    const asset = assetMap[ref.assetId];
    if (!asset?.public_url) {
      nSkipped++;
      continue;
    }

    let body;
    try {
      body = await downloadFile(asset.public_url);
    } catch (e) {
      console.warn(`  ! failed to download for item ${it.id}: ${e.message}`);
      nSkipped++;
      continue;
    }

    if (fs.existsSync(localPath)) {
      const existing = fs.readFileSync(localPath, "utf-8");
      if (existing === body) {
        nUnchanged++;
        continue;
      }
      fs.writeFileSync(localPath, body, "utf-8");
      nUpdated++;
    } else {
      fs.writeFileSync(localPath, body, "utf-8");
      nNew++;
    }
  }

  console.log("");
  console.log(`Done. Wrote ${nNew} new, updated ${nUpdated}, unchanged ${nUnchanged}, skipped ${nSkipped} (no .txt yet).`);
  console.log(`Folder: ${CONVERSATIONS_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

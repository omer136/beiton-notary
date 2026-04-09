/**
 * POST /api/agent2/trigger-learning
 *
 * Compares Agent 2's draft translation with the notary's approved final version.
 * Extracts corrections, updates learned_corrections.json and glossaries.
 *
 * Body: { itemId: string }
 * Auth: ADMIN_SECRET query param
 */

import { NextRequest, NextResponse } from "next/server";
import {
  MONDAY_URL,
  CASES_BOARD_ID,
  CASES_COLS,
} from "@/lib/monday-boards";
import * as fs from "fs";
import * as path from "path";
import type { LearnedCorrectionsDB, LearningCorrection } from "@/lib/agent2/types";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const CORRECTIONS_PATH = path.join(process.cwd(), "data/agent2/learned_corrections.json");

async function mondayQuery(query: string, variables: Record<string, unknown> = {}) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) throw new Error("MONDAY_API_TOKEN not set");
  const resp = await fetch(MONDAY_URL, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json", "API-Version": "2024-10" },
    body: JSON.stringify({ query, variables }),
  });
  return resp.json();
}

async function downloadAsset(assetUrl: string): Promise<Buffer> {
  const resp = await fetch(assetUrl);
  if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
  return Buffer.from(await resp.arrayBuffer());
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  // Simple text extraction from docx — parse the XML
  const AdmZip = (await import("adm-zip")).default;
  const zip = new AdmZip(buffer);
  const content = zip.readAsText("word/document.xml");
  // Extract text between <w:t> tags
  const texts = [...content.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(m => m[1]);
  return texts.join(" ");
}

interface RawCorrection {
  category: string;
  severity: string;
  wrong_text: string;
  correct_text: string;
  root_cause: string;
  lesson: string;
  prevention: string;
}

async function compareWithClaude(draftText: string, finalText: string): Promise<RawCorrection[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const prompt = `השווה בין שני תרגומים נוטריוניים:

## טיוטה (Agent 2):
${draftText.slice(0, 6000)}

## גרסה סופית (מאושרת ע"י נוטריון):
${finalText.slice(0, 6000)}

מצא את כל ההבדלים בין הטיוטה לגרסה הסופית. לכל הבדל, החזר:
- category: אחד מ: name_translit / halachic / legal_term / date_format / institutional / address / structural / stylistic / factual
- severity: cosmetic / minor / moderate / major / critical
- wrong_text: הטקסט מהטיוטה
- correct_text: הטקסט הנכון מהגרסה הסופית
- root_cause: מה הסיבה לטעות
- lesson: מה ללמוד לפעם הבאה
- prevention: איך למנוע

החזר JSON array:
[
  {
    "category": "...",
    "severity": "...",
    "wrong_text": "...",
    "correct_text": "...",
    "root_cause": "...",
    "lesson": "...",
    "prevention": "..."
  }
]

אם אין הבדלים — החזר מערך ריק [].`;

  const resp = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) throw new Error(`Anthropic error: ${resp.status}`);
  const data = await resp.json();
  const rawText = data.content?.find((b: { type: string }) => b.type === "text")?.text || "[]";

  try {
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }
}

function loadCorrections(): LearnedCorrectionsDB {
  try {
    if (fs.existsSync(CORRECTIONS_PATH)) {
      return JSON.parse(fs.readFileSync(CORRECTIONS_PATH, "utf-8"));
    }
  } catch {}
  return {
    _meta: { schema_version: 2, total_rules: 0, last_updated: new Date().toISOString() },
    rules: [],
    patterns: {},
  };
}

function saveCorrections(db: LearnedCorrectionsDB) {
  const dir = path.dirname(CORRECTIONS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  db._meta.last_updated = new Date().toISOString();
  db._meta.total_rules = db.rules.length;
  fs.writeFileSync(CORRECTIONS_PATH, JSON.stringify(db, null, 2));
}

export async function POST(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { itemId } = await req.json();
    if (!itemId) return NextResponse.json({ error: "itemId required" }, { status: 400 });

    console.log(`[Learning Loop] Processing case ${itemId}`);

    // Get assets from the case
    const data = await mondayQuery(
      `query($id: [ID!]!) { items(ids: $id) {
        assets { id name url public_url }
        column_values { id text }
      } }`,
      { id: [itemId] }
    );
    const item = data.data?.items?.[0];
    if (!item) return NextResponse.json({ error: "Case not found" }, { status: 404 });

    // Find draft (in deliverables) and final (in finalDocument) assets
    const assets = item.assets || [];
    const draftAsset = assets.find((a: { name: string }) => a.name.includes("notary_translation"));
    const finalAsset = assets.find((a: { name: string }) =>
      a.name !== draftAsset?.name && (a.name.includes("final") || a.name.includes("approved") || a.name.endsWith(".docx"))
    );

    if (!draftAsset || !finalAsset) {
      return NextResponse.json({
        error: "Need both draft and final documents",
        found: { draft: draftAsset?.name, final: finalAsset?.name },
      }, { status: 400 });
    }

    console.log(`[Learning Loop] Draft: ${draftAsset.name}, Final: ${finalAsset.name}`);

    // Download both
    const [draftBuffer, finalBuffer] = await Promise.all([
      downloadAsset(draftAsset.public_url || draftAsset.url),
      downloadAsset(finalAsset.public_url || finalAsset.url),
    ]);

    // Extract text from both DOCX files
    const [draftText, finalText] = await Promise.all([
      extractTextFromDocx(draftBuffer),
      extractTextFromDocx(finalBuffer),
    ]);

    // Compare using Claude
    console.log(`[Learning Loop] Comparing texts (draft: ${draftText.length} chars, final: ${finalText.length} chars)`);
    const corrections = await compareWithClaude(draftText, finalText);
    console.log(`[Learning Loop] Found ${corrections.length} corrections`);

    // Merge into corrections DB
    const db = loadCorrections();
    const now = new Date().toISOString();
    let newRulesCount = 0;

    for (const correction of corrections) {
      // Check if similar rule exists
      const existing = db.rules.find(r => r.wrong_text === correction.wrong_text);
      if (existing) {
        existing.occurrences++;
        existing.last_seen = now;
      } else {
        const id = Math.random().toString(36).slice(2, 14);
        db.rules.push({
          id,
          category: correction.category,
          severity: correction.severity as LearningCorrection["severity"],
          wrong_text: correction.wrong_text,
          correct_text: correction.correct_text,
          word_corrections: [{ wrong: correction.wrong_text, correct: correction.correct_text }],
          analysis: {
            root_cause: correction.root_cause,
            lesson: correction.lesson,
            prevention: correction.prevention,
          },
          source: itemId,
          learned_at: now,
          occurrences: 1,
          last_seen: now,
        });
        newRulesCount++;

        // Add to patterns for fast lookup
        db.patterns[correction.wrong_text] = correction.correct_text;
      }
    }

    saveCorrections(db);

    // Update Monday
    const revisionCount = corrections.length;
    const qualityScore = corrections.length === 0 ? 100
      : Math.max(0, 100 - corrections.reduce((s, c) => {
          const w = { cosmetic: 2, minor: 5, moderate: 10, major: 20, critical: 30 };
          return s + (w[c.severity as keyof typeof w] || 10);
        }, 0));

    await mondayQuery(
      `mutation($b: ID!, $i: ID!, $c: JSON!) { change_multiple_column_values(board_id: $b, item_id: $i, column_values: $c) { id } }`,
      {
        b: CASES_BOARD_ID,
        i: itemId,
        c: JSON.stringify({
          [CASES_COLS.revisionCount]: String(revisionCount),
          [CASES_COLS.qaResult]: {
            label: revisionCount === 0 ? "אושר ללא תיקון"
              : revisionCount <= 3 ? "אושר עם תיקונים קלים"
              : revisionCount <= 8 ? "אושר עם תיקונים מהותיים"
              : "הוחזר לתיקון",
          },
        }),
      }
    );

    // Add summary update
    const summaryLines = [
      `לופ למידה — השוואת טיוטה מול גרסה סופית`,
      `תיקונים שנמצאו: ${corrections.length}`,
      `כללים חדשים: ${newRulesCount}`,
      `ציון איכות: ${qualityScore}/100`,
      ``,
      ...corrections.map((c, i) => `${i + 1}. [${c.severity}] "${c.wrong_text}" → "${c.correct_text}" (${c.category})`),
    ].join("\n");

    await mondayQuery(
      `mutation($id: ID!, $body: String!) { create_update(item_id: $id, body: $body) { id } }`,
      { id: itemId, body: `<h3>Learning Loop Report</h3><pre>${summaryLines}</pre>` }
    );

    return NextResponse.json({
      ok: true,
      corrections: corrections.length,
      newRules: newRulesCount,
      qualityScore,
      totalRulesInDB: db.rules.length,
    });
  } catch (e) {
    console.error("[Learning Loop] Error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

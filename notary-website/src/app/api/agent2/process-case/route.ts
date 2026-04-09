/**
 * POST /api/agent2/process-case
 *
 * Main Agent 2 pipeline: downloads source document from Monday case,
 * runs OCR, translates, generates DOCX, uploads back to Monday.
 *
 * Body: { itemId: string, targetLanguage?: "en"|"ru"|"ar"|"fr"|"es" }
 * Auth: ADMIN_SECRET query param
 */

import { NextRequest, NextResponse } from "next/server";
import {
  MONDAY_URL,
  CASES_BOARD_ID,
  CASES_COLS,
} from "@/lib/monday-boards";
import { ocrDocument } from "@/lib/agent2/ocr-pipeline";
import { translateDocument } from "@/lib/agent2/translation-engine";
import { generateNotarialDOCX } from "@/lib/agent2/docx-generator";
import type { TargetLanguage } from "@/lib/agent2/types";

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

async function uploadFileToMonday(itemId: string, columnId: string, fileBuffer: Buffer, fileName: string) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) throw new Error("MONDAY_API_TOKEN not set");

  const fileBlob = new File([new Uint8Array(fileBuffer)], fileName, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const form = new FormData();
  form.append("query", `mutation($file: File!) { add_file_to_column(item_id: "${itemId}", column_id: "${columnId}", file: $file) { id name url } }`);
  form.append("map", JSON.stringify({ image: "variables.file" }));
  form.append("image", fileBlob);

  const resp = await fetch("https://api.monday.com/v2/file", {
    method: "POST",
    headers: { Authorization: token, "API-Version": "2024-10" },
    body: form,
  });
  return resp.json();
}

async function downloadMondayFile(itemId: string): Promise<{ buffer: Buffer; fileName: string; mimeType: string } | null> {
  // Get file URL from Monday
  const data = await mondayQuery(
    `query($id: [ID!]!) { items(ids: $id) { assets { id name url public_url } } }`,
    { id: [itemId] }
  );

  const assets = data.data?.items?.[0]?.assets;
  if (!assets || assets.length === 0) return null;

  const asset = assets[0];
  const fileUrl = asset.public_url || asset.url;
  if (!fileUrl) return null;

  const resp = await fetch(fileUrl);
  if (!resp.ok) throw new Error(`File download failed: ${resp.status}`);

  const buffer = Buffer.from(await resp.arrayBuffer());
  const mimeType = resp.headers.get("content-type") || "application/pdf";
  return { buffer, fileName: asset.name, mimeType };
}

async function pdfToImages(pdfBuffer: Buffer): Promise<{ base64: string; mimeType: string }[]> {
  // For scanned PDFs, we convert pages to PNG images for Claude Vision
  // Since we can't use poppler on Vercel, we send the PDF directly to Claude
  // as a base64 image (Claude can read PDFs as images natively)
  return [{
    base64: pdfBuffer.toString("base64"),
    mimeType: "application/pdf",
  }];
}

export async function POST(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { itemId, targetLanguage = "en" } = body as {
      itemId: string;
      targetLanguage?: TargetLanguage;
    };

    if (!itemId) {
      return NextResponse.json({ error: "itemId required" }, { status: 400 });
    }

    console.log(`[Agent 2] Processing case ${itemId}, target: ${targetLanguage}`);

    // Step 1: Get case data from Monday
    const caseData = await mondayQuery(
      `query($id: [ID!]!) { items(ids: $id) { id name column_values { id text } assets { id name url public_url } } }`,
      { id: [itemId] }
    );
    const caseItem = caseData.data?.items?.[0];
    if (!caseItem) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const cols: Record<string, string> = {};
    for (const cv of caseItem.column_values) {
      if (cv.text) cols[cv.id] = cv.text;
    }
    const clientName = cols[CASES_COLS.clientName] || caseItem.name;

    // Step 2: Download source file
    console.log(`[Agent 2] Downloading source file...`);
    const file = await downloadMondayFile(itemId);
    if (!file) {
      return NextResponse.json({ error: "No source file found on case item" }, { status: 404 });
    }

    // Step 3: OCR
    console.log(`[Agent 2] Running OCR on ${file.fileName}...`);
    const imageBase64 = file.buffer.toString("base64");
    const mimeType = file.mimeType.includes("pdf") ? "application/pdf" : file.mimeType;

    // For PDFs, Claude can handle them directly with image type
    const ocrResult = await ocrDocument(imageBase64, mimeType);
    console.log(`[Agent 2] OCR complete: ${ocrResult.documentType}, ~${ocrResult.estimatedWordCount} words, confidence: ${ocrResult.confidence}`);

    // Step 4: Translate
    console.log(`[Agent 2] Translating to ${targetLanguage}...`);
    const translation = await translateDocument(ocrResult, targetLanguage);
    console.log(`[Agent 2] Translation complete: ${translation.wordCount} words, ${translation.corrections_applied.length} corrections applied`);

    // Step 5: Generate DOCX
    console.log(`[Agent 2] Generating DOCX...`);
    const docxBuffer = await generateNotarialDOCX(
      ocrResult,
      translation,
      targetLanguage,
      clientName,
    );

    // Step 6: Upload to Monday
    const fileName = `notary_translation_${ocrResult.documentType}_he-${targetLanguage}_${new Date().toISOString().split("T")[0]}.docx`;
    console.log(`[Agent 2] Uploading ${fileName} to Monday...`);

    const uploadResult = await uploadFileToMonday(itemId, CASES_COLS.deliverables, docxBuffer, fileName);
    const uploadedFileId = uploadResult.data?.add_file_to_column?.id;

    // Step 7: Update case columns
    const colUpdates: Record<string, unknown> = {
      [CASES_COLS.caseStatus]: { label: "ממתין לבדיקה" },
      [CASES_COLS.wordCount]: String(translation.wordCount),
    };

    await mondayQuery(
      `mutation($b: ID!, $i: ID!, $c: JSON!) { change_multiple_column_values(board_id: $b, item_id: $i, column_values: $c) { id } }`,
      { b: CASES_BOARD_ID, i: itemId, c: JSON.stringify(colUpdates) }
    );

    // Add update comment with summary
    const summary = [
      `סוכן 2 — תרגום הושלם`,
      `סוג מסמך: ${ocrResult.documentType}`,
      `שפת יעד: ${targetLanguage}`,
      `מילים: ${translation.wordCount}`,
      `ביטחון OCR: ${Math.round(ocrResult.confidence * 100)}%`,
      translation.corrections_applied.length > 0
        ? `תיקונים נלמדים שיושמו: ${translation.corrections_applied.join(", ")}`
        : "לא היו תיקונים נלמדים ליישום",
      `קובץ: ${fileName}`,
    ].join("\n");

    await mondayQuery(
      `mutation($id: ID!, $body: String!) { create_update(item_id: $id, body: $body) { id } }`,
      { id: itemId, body: `<h3>Agent 2 — Translation Draft</h3><pre>${summary}</pre>` }
    );

    console.log(`[Agent 2] Done! File: ${uploadedFileId}`);

    return NextResponse.json({
      ok: true,
      itemId,
      documentType: ocrResult.documentType,
      wordCount: translation.wordCount,
      ocrConfidence: ocrResult.confidence,
      correctionsApplied: translation.corrections_applied,
      uploadedFileId,
      fileName,
    });
  } catch (e) {
    console.error("[Agent 2] Error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

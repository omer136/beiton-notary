import { NextRequest, NextResponse } from "next/server";
import { SALES_COLS } from "@/lib/monday-boards";

/**
 * POST /api/chat/save-transcript
 *
 * Called once at the end of a chat session (page leave / visibilitychange / 10-min
 * inactivity). Saves the full transcript as a .txt FILE attached to the lead's
 * "קבצים מהצ'אט" column on Monday.
 *
 * (We previously created a Monday "update" / comment with the transcript inline.
 * That was removed per Omer's request 2026-04-30 — it cluttered the item view and
 * duplicated data already in the תמלול שיחה long_text column. The .txt file
 * gives a download-able artifact that the learning-loop agent and humans can both
 * open from Monday.)
 */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function formatTranscript(messages: ChatMessage[], language: string, sessionId: string): string {
  const roleLabel = language === "he" || language === "ar"
    ? { user: "לקוח", assistant: "נועה" }
    : { user: "Client", assistant: "Noa" };
  const header = [
    `Session ID: ${sessionId || "(unknown)"}`,
    `Language: ${language}`,
    `Saved: ${new Date().toISOString()}`,
    `Message count: ${messages.length}`,
    "",
    "—".repeat(40),
    "",
  ].join("\n");
  const body = messages.map((m) => `${roleLabel[m.role]}:\n${m.content}`).join("\n\n");
  return header + body + "\n";
}

async function uploadToMondayFiles(
  itemId: string,
  filename: string,
  content: string
): Promise<{ ok: boolean; error?: string; fileId?: string }> {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) return { ok: false, error: "MONDAY_API_TOKEN not set" };

  // Build a File from the transcript text
  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const fileObj = new File([blob], filename, { type: "text/plain; charset=utf-8" });

  const form = new FormData();
  form.append(
    "query",
    `mutation($file: File!) {
      add_file_to_column(
        item_id: "${itemId}",
        column_id: "${SALES_COLS.chatFiles}",
        file: $file
      ) { id name url }
    }`
  );
  form.append("map", JSON.stringify({ image: "variables.file" }));
  form.append("image", fileObj);

  const resp = await fetch("https://api.monday.com/v2/file", {
    method: "POST",
    headers: { Authorization: token, "API-Version": "2024-10" },
    body: form,
  });
  const data = await resp.json();
  if (data.errors) {
    return { ok: false, error: JSON.stringify(data.errors).slice(0, 500) };
  }
  return { ok: true, fileId: data.data?.add_file_to_column?.id };
}

/**
 * Upload to Google Drive — gated on env vars. If unset, silently skipped.
 *
 * Setup (do once):
 *   1. Google Cloud Console → create service account
 *   2. Download JSON key → set GOOGLE_SERVICE_ACCOUNT_KEY env var (whole JSON)
 *   3. Create a Drive folder, share with the service account email
 *   4. Set GOOGLE_DRIVE_FOLDER_ID env var (folder ID from URL)
 */
async function uploadToGoogleDrive(
  filename: string,
  content: string
): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!keyJson || !folderId) return { ok: true, skipped: true };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sa = JSON.parse(keyJson) as any;

    // 1. Get an access token via JWT (no external deps)
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = { alg: "RS256", typ: "JWT" };
    const jwtPayload = {
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/drive.file",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };
    const b64url = (s: string) => Buffer.from(s).toString("base64url");
    const headerEnc = b64url(JSON.stringify(jwtHeader));
    const payloadEnc = b64url(JSON.stringify(jwtPayload));
    const signInput = `${headerEnc}.${payloadEnc}`;

    const { createSign, createPrivateKey } = await import("node:crypto");
    const privateKey = createPrivateKey(sa.private_key);
    const signer = createSign("RSA-SHA256");
    signer.update(signInput);
    const signature = signer.sign(privateKey).toString("base64url");
    const jwt = `${signInput}.${signature}`;

    const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=${encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")}&assertion=${jwt}`,
    });
    const tokenData = await tokenResp.json();
    if (!tokenData.access_token) {
      return { ok: false, error: `Token error: ${JSON.stringify(tokenData).slice(0, 300)}` };
    }

    // 2. Upload file using multipart upload
    const boundary = "----beiton-" + Math.random().toString(36).slice(2);
    const metadata = { name: filename, parents: [folderId], mimeType: "text/plain" };
    const body =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) +
      `\r\n--${boundary}\r\n` +
      `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
      content +
      `\r\n--${boundary}--`;

    const uploadResp = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      }
    );
    const uploadData = await uploadResp.json();
    if (!uploadResp.ok) {
      return { ok: false, error: JSON.stringify(uploadData).slice(0, 300) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 300) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language, itemId, sessionId } = body as {
      messages: ChatMessage[];
      language: string;
      itemId?: string;
      sessionId?: string;
    };

    if (!messages || messages.length < 2 || !itemId) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const sid = sessionId || "unknown";
    const filename = `${sid}.txt`;
    const transcript = formatTranscript(messages, language || "he", sid);

    // A. Monday Files column — primary, always-on
    const mondayResult = await uploadToMondayFiles(itemId, filename, transcript);

    // B. Google Drive — gated on env vars, fire-and-forget
    const driveResult = await uploadToGoogleDrive(filename, transcript);

    return NextResponse.json({
      ok: true,
      monday: mondayResult,
      drive: driveResult,
    });
  } catch (e) {
    console.error("Save transcript error:", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { SALES_COLS } from "@/lib/monday-boards";

/**
 * POST /api/monday/upload-file
 *
 * Receives a file from the chat widget and uploads it to the Monday
 * item's "קבצים מהצ'אט" file column.
 *
 * Body: multipart/form-data with:
 *   - file: the actual file (required)
 *   - itemId: Monday item ID (required)
 */
export async function POST(req: NextRequest) {
  try {
    const token = process.env.MONDAY_API_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: "MONDAY_API_TOKEN not set" }, { status: 500 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ ok: false, error: "multipart/form-data required" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const itemId = formData.get("itemId") as string | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "file is required" }, { status: 400 });
    }
    if (!itemId) {
      return NextResponse.json({ ok: false, error: "itemId is required" }, { status: 400 });
    }

    // Validate file size (max 100 MB for our use case)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "File too large (max 100 MB)" }, { status: 400 });
    }

    // Convert incoming File to a proper File object with preserved name
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileObj = new File([fileBuffer], file.name, {
      type: file.type || "application/octet-stream",
    });

    // Build the multipart request for Monday's /v2/file endpoint
    // Monday requires: query + map + the file field
    const mondayForm = new FormData();
    mondayForm.append(
      "query",
      `mutation($file: File!) {
        add_file_to_column(
          item_id: "${itemId}",
          column_id: "${SALES_COLS.chatFiles}",
          file: $file
        ) { id name url }
      }`
    );
    mondayForm.append("map", JSON.stringify({ image: "variables.file" }));
    mondayForm.append("image", fileObj);

    const resp = await fetch("https://api.monday.com/v2/file", {
      method: "POST",
      headers: {
        Authorization: token,
        "API-Version": "2024-10",
        // DO NOT set Content-Type — fetch sets multipart boundary automatically
      },
      body: mondayForm,
    });

    const result = await resp.json();

    if (result.errors) {
      console.error("Monday file upload error:", JSON.stringify(result.errors));
      return NextResponse.json(
        { ok: false, error: result.errors[0]?.message || "Upload failed" },
        { status: 500 }
      );
    }

    const fileData = result.data?.add_file_to_column;
    console.log("File uploaded to Monday:", fileData?.name, "item:", itemId);

    return NextResponse.json({
      ok: true,
      file: {
        id: fileData?.id,
        name: fileData?.name,
        url: fileData?.url,
      },
    });
  } catch (e) {
    console.error("File upload error:", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

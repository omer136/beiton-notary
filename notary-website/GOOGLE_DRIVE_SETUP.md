# Google Drive integration — setup (one-time, ~15 min)

The `/api/chat/save-transcript` endpoint will upload each completed chat
transcript as a `.txt` to a Google Drive folder of your choice — _in addition_
to the Monday Files column. This document explains how to enable it.

The integration is **disabled by default**. It activates only when both env
vars below are set on Vercel.

## Why a service account (and not your personal Google account)

A serverless function can't run an interactive OAuth flow. Service accounts
authenticate non-interactively with a private key — this is the standard
Google-recommended pattern for server-to-Drive uploads.

The service account is just a "robot user" that you give write access to one
specific folder. It has no other permissions.

## Steps

### 1. Create a Google Cloud project (or reuse one)

1. Go to https://console.cloud.google.com/projectcreate
2. Project name: `beiton-notary-transcripts` (or anything)
3. Click **Create**

### 2. Enable the Drive API

1. https://console.cloud.google.com/apis/library/drive.googleapis.com
2. Make sure your new project is selected (top-left dropdown)
3. Click **Enable**

### 3. Create a service account

1. https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Create service account**
3. Name: `beiton-notary-uploader`
4. Click **Create and continue**, then **Done** (no roles needed at the project
   level — we'll grant access at the folder level only).
5. On the service-accounts list, click the new account → **Keys** tab → **Add
   key → Create new key → JSON**.
6. A `.json` file downloads. **This is sensitive** — treat it like a password.

### 4. Create the destination folder in your Drive

1. Open https://drive.google.com
2. Create a folder, e.g. `BEITON / שיחות צ'אט`
3. Open the folder. The URL looks like
   `https://drive.google.com/drive/folders/1AbC2DeFgH3IjKLmNoPqRsTuVwXyZ` —
   the part after `/folders/` is the **folder ID**.

### 5. Share the folder with the service account

1. Right-click the folder → **Share**
2. Paste the service account email (from the JSON file, field `client_email` —
   looks like `beiton-notary-uploader@your-project.iam.gserviceaccount.com`)
3. Permission: **Editor**
4. **Send** (uncheck "Notify people").

### 6. Add env vars on Vercel

1. https://vercel.com/omer136s-projects/beiton-notary/settings/environment-variables
2. Add **two** variables, both **Sensitive**, applied to **Production +
   Preview + Development**:

   | Name | Value |
   |------|-------|
   | `GOOGLE_DRIVE_FOLDER_ID` | the folder ID from step 4 |
   | `GOOGLE_SERVICE_ACCOUNT_KEY` | the **entire** JSON contents from step 3 (paste as a single-line string; Vercel preserves newlines) |

3. **Redeploy** the project for the env vars to take effect (or wait for the
   next push).

### 7. Verify

After the next chat session ends, check:
- Monday item → `קבצים מהצ'אט` column should contain `BEI-yyyymmdd-XXXXXX.txt`
- Google Drive folder should contain the same file

If only Monday has the file, check Vercel logs for errors from
`uploadToGoogleDrive` — most common issues:
- `client_email` not shared on the folder (HTTP 403)
- Drive API not enabled on the project (HTTP 403 with `accessNotConfigured`)
- Malformed `private_key` in the JSON (escaped newlines lost — paste exactly
  as Google gave it)

## Disabling

Just remove either env var and redeploy. The endpoint will silently skip the
Drive upload and continue uploading to Monday Files.

## Security notes

- The service account has access **only** to folders you explicitly share with
  it. It cannot see anything else in your Drive.
- The private key is in `process.env` server-side only — never sent to the
  browser, never logged, never committed to git.
- If the key leaks, revoke it from the **Keys** tab in step 3 and create a new
  one. Update the env var on Vercel.

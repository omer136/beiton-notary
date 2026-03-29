#!/usr/bin/env python3
"""
Funnel Tracker — תיעוד שיחות מכירה בבורד monday.com 18406004253.

תפקידים:
  1. track   — תיעוד שיחה חדשה / עדכון שלב בפאנל
  2. analyze — ניתוח שיחה שלא נסגרה + שמירת לקח
  3. followup — סימון שיחות שצריכות פולואפ
  4. stats   — סטטיסטיקות פאנל

שימוש:
    python funnel_tracker.py track --client "יוסי כהן" --service translation_approval \
        --language he --stage quote_sent --amount 1377.65 --messages 6

    python funnel_tracker.py analyze --item-id 123456 --reason price \
        --analysis "הלקוח אמר יקר" --lesson "להציג ערך לפני מחיר"

    python funnel_tracker.py followup --list
    python funnel_tracker.py stats

    python funnel_tracker.py --demo
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, date
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = BASE_DIR / "config"
SALES_LESSONS_FILE = CONFIG_DIR / "sales_lessons.json"

MONDAY_API_URL = "https://api.monday.com/v2"
BOARD_ID = "18406004253"

COLUMNS = {
    "stage":           "color_mm1wcc5y",
    "rejection_reason":"color_mm1w6vt8",
    "language":        "color_mm1wgvgc",
    "service":         "color_mm1wjcxx",
    "channel":         "color_mm1wj0mz",
    "date":            "date_mm1w6eek",
    "messages_count":  "numeric_mm1wtzxs",
    "quote_amount":    "numeric_mm1wgak1",
    "analysis":        "long_text_mm1wcw3e",
    "lesson":          "long_text_mm1wq6kg",
    "transcript_link": "link_mm1wxe9b",
    "case_relation":   "board_relation_mm1w1vza",
    "followup_status": "color_mm1wbhmq",
}

GROUPS = {
    "active":           "group_mm1wxy0k",
    "awaiting_followup":"group_mm1wsgy9",
    "lost":             "group_mm1w8dgb",
    "closed":           "group_mm1wskwy",
}

STAGE_LABELS = {
    "new_lead":            {"label": "פנייה חדשה",       "index": 0},
    "qualified":           {"label": "זוהה שירות",       "index": 1},
    "quote_sent":          {"label": "הצעה נשלחה",       "index": 2},
    "quote_approved":      {"label": "הצעה אושרה",       "index": 3},
    "documents_received":  {"label": "מסמכים התקבלו",     "index": 4},
    "completed":           {"label": "נסגר בהצלחה",      "index": 5},
    "lost_price":          {"label": "נטש — מחיר",       "index": 6},
    "lost_timing":         {"label": "נטש — תזמון",      "index": 7},
    "lost_competitor":     {"label": "נטש — מתחרה",      "index": 8},
    "lost_no_response":    {"label": "נטש — אין תגובה",  "index": 9},
    "lost_other":          {"label": "נטש — אחר",        "index": 10},
}

REJECTION_LABELS = {
    "price":          {"label": "מחיר",         "index": 0},
    "timing":         {"label": "תזמון",         "index": 1},
    "info_gathering": {"label": "איסוף מידע",    "index": 2},
    "competitor":     {"label": "מתחרה",         "index": 3},
    "complexity":     {"label": "מורכבות",       "index": 4},
    "not_needed":     {"label": "לא צריך",       "index": 5},
    "technical":      {"label": "טכני",          "index": 6},
    "no_response":    {"label": "אין תגובה",     "index": 7},
    "other":          {"label": "אחר",           "index": 8},
}

LANGUAGE_LABELS = {
    "he": {"label": "עברית",   "index": 0},
    "en": {"label": "English", "index": 1},
    "ru": {"label": "Русский", "index": 2},
    "ar": {"label": "العربية", "index": 3},
    "fr": {"label": "Français","index": 4},
    "es": {"label": "Español", "index": 5},
}

SERVICE_LABELS = {
    "translation_approval":    {"label": "תרגום נוטריוני",  "index": 0},
    "translator_declaration":  {"label": "הצהרת מתרגם",     "index": 1},
    "certified_copy":          {"label": "העתק נאמן",       "index": 2},
    "signature_authentication":{"label": "אימות חתימה",     "index": 3},
    "power_of_attorney":       {"label": "ייפוי כוח",       "index": 4},
    "affidavit":               {"label": "תצהיר",          "index": 5},
    "life_certificate":        {"label": "אישור חיים",      "index": 6},
    "prenuptial_agreement":    {"label": "הסכם ממון",       "index": 7},
    "notarial_will":           {"label": "צוואה",           "index": 8},
    "negotiable_instrument":   {"label": "מסמך סחיר",       "index": 9},
    "apostille":               {"label": "אפוסטיל",        "index": 10},
    "poa_cancellation":        {"label": "ביטול ייפוי כוח", "index": 11},
}

CHANNEL_LABELS = {
    "whatsapp":  {"label": "WhatsApp", "index": 0},
    "phone":     {"label": "טלפון",    "index": 1},
    "email":     {"label": "אימייל",   "index": 2},
    "website":   {"label": "אתר",      "index": 3},
    "referral":  {"label": "הפניה",    "index": 4},
}

FOLLOWUP_LABELS = {
    "pending":   {"label": "ממתין",      "index": 0},
    "sent_1":    {"label": "נשלח פולואפ 1","index": 1},
    "sent_2":    {"label": "נשלח פולואפ 2","index": 2},
    "sent_3":    {"label": "נשלח פולואפ 3","index": 3},
    "responded": {"label": "הגיב",       "index": 4},
    "closed":    {"label": "סגור",       "index": 5},
}


# ---------------------------------------------------------------------------
# monday.com API
# ---------------------------------------------------------------------------

def _api(query: str, variables: dict) -> dict:
    api_key = os.environ.get("MONDAY_API_KEY", "")
    if not api_key:
        raise RuntimeError("MONDAY_API_KEY לא מוגדר")

    payload = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        MONDAY_API_URL, data=payload,
        headers={"Authorization": api_key, "Content-Type": "application/json",
                 "API-Version": "2024-10"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"monday.com {e.code}: {e.read().decode()[:200]}") from e
    if "errors" in body:
        raise RuntimeError(json.dumps(body["errors"], ensure_ascii=False)[:300])
    return body


def _label_index(mapping: dict, key: str) -> int | None:
    entry = mapping.get(key)
    return entry["index"] if entry else None


# ---------------------------------------------------------------------------
# Track: create or update a conversation in the funnel board
# ---------------------------------------------------------------------------

def track_conversation(
    client_name: str,
    service: str | None = None,
    language: str = "he",
    stage: str = "new_lead",
    channel: str = "whatsapp",
    quote_amount: float | None = None,
    messages_count: int | None = None,
    transcript_link: str | None = None,
) -> dict:
    """Create a new conversation item on the funnel board."""

    group_id = GROUPS["active"]
    if stage.startswith("lost"):
        group_id = GROUPS["lost"]
    elif stage == "completed":
        group_id = GROUPS["closed"]

    col_values = {}

    idx = _label_index(STAGE_LABELS, stage)
    if idx is not None:
        col_values[COLUMNS["stage"]] = {"index": idx}

    idx = _label_index(LANGUAGE_LABELS, language)
    if idx is not None:
        col_values[COLUMNS["language"]] = {"index": idx}

    if service:
        idx = _label_index(SERVICE_LABELS, service)
        if idx is not None:
            col_values[COLUMNS["service"]] = {"index": idx}

    idx = _label_index(CHANNEL_LABELS, channel)
    if idx is not None:
        col_values[COLUMNS["channel"]] = {"index": idx}

    col_values[COLUMNS["date"]] = {"date": date.today().isoformat()}

    if messages_count is not None:
        col_values[COLUMNS["messages_count"]] = str(messages_count)

    if quote_amount is not None:
        col_values[COLUMNS["quote_amount"]] = str(quote_amount)

    if transcript_link:
        col_values[COLUMNS["transcript_link"]] = {"url": transcript_link, "text": "תמלול"}

    col_json = json.dumps(col_values, ensure_ascii=False)

    result = _api("""
        mutation ($board: ID!, $group: String!, $name: String!, $cols: JSON!) {
          create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $cols) {
            id name
          }
        }
    """, {"board": BOARD_ID, "group": group_id, "name": client_name, "cols": col_json})

    item = result["data"]["create_item"]
    return {"item_id": item["id"], "item_name": item["name"]}


# ---------------------------------------------------------------------------
# Analyze: record rejection analysis + save lesson
# ---------------------------------------------------------------------------

def analyze_lost(
    item_id: str,
    reason: str,
    analysis_text: str,
    lesson_text: str,
    followup: bool = True,
) -> dict:
    """Update a conversation item with rejection analysis and save the lesson."""

    col_values = {}

    idx = _label_index(REJECTION_LABELS, reason)
    if idx is not None:
        col_values[COLUMNS["rejection_reason"]] = {"index": idx}

    col_values[COLUMNS["analysis"]] = {"text": analysis_text}
    col_values[COLUMNS["lesson"]] = {"text": lesson_text}

    if followup:
        col_values[COLUMNS["followup_status"]] = {"index": FOLLOWUP_LABELS["pending"]["index"]}

    col_json = json.dumps(col_values, ensure_ascii=False)

    _api("""
        mutation ($board: ID!, $item: ID!, $cols: JSON!) {
          change_multiple_column_values(board_id: $board, item_id: $item, column_values: $cols) { id }
        }
    """, {"board": BOARD_ID, "item": str(item_id), "cols": col_json})

    # Move to appropriate group
    target_group = GROUPS["awaiting_followup"] if followup else GROUPS["lost"]
    _api("""
        mutation ($item: ID!, $group: String!) {
          move_item_to_group(item_id: $item, group_id: $group) { id }
        }
    """, {"item": str(item_id), "group": target_group})

    # Save lesson to sales_lessons.json
    _save_lesson(reason, analysis_text, lesson_text)

    return {"updated": True, "followup": followup}


def _save_lesson(reason: str, analysis: str, lesson: str):
    """Append a lesson to config/sales_lessons.json."""
    db = _load_sales_db()

    lesson_entry = {
        "id": len(db["lessons"]) + 1,
        "reason": reason,
        "reason_he": REJECTION_LABELS.get(reason, {}).get("label", reason),
        "analysis": analysis,
        "lesson": lesson,
        "learned_at": datetime.utcnow().isoformat() + "Z",
        "applied_count": 0,
    }
    db["lessons"].append(lesson_entry)

    # Update statistics
    rc = db["statistics"]["by_rejection_reason"]
    rc[reason] = rc.get(reason, 0) + 1

    db["_meta"]["total_lessons"] = len(db["lessons"])
    db["_meta"]["total_conversations_analyzed"] += 1
    db["_meta"]["last_updated"] = datetime.utcnow().isoformat() + "Z"

    _save_sales_db(db)


def _load_sales_db() -> dict:
    if SALES_LESSONS_FILE.exists():
        with open(SALES_LESSONS_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {
        "_meta": {"total_lessons": 0, "total_conversations_analyzed": 0, "last_updated": None},
        "lessons": [], "patterns": {"objection_handlers": {}, "successful_phrases": [], "phrases_to_avoid": []},
        "statistics": {"by_rejection_reason": {}, "by_language": {}, "by_service": {}, "conversion_rate": None},
    }


def _save_sales_db(db: dict):
    with open(SALES_LESSONS_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Dry-run / Demo
# ---------------------------------------------------------------------------

def run_demo():
    print()
    print("═" * 60)
    print("  Funnel Tracker — דמו מדומה (dry-run)")
    print("═" * 60)
    print()

    # Simulate 3 conversations
    conversations = [
        {
            "client": "יוסי כהן — תרגום תעודת לידה",
            "service": "translation_approval", "language": "he",
            "stage": "completed", "amount": 1028.96, "messages": 8,
        },
        {
            "client": "Elena Kozlova — перевод св-ва о рождении",
            "service": "translation_approval", "language": "ru",
            "stage": "quote_sent", "amount": 1377.65, "messages": 6,
            "lost": True, "reason": "price",
            "analysis": "הלקוחה קיבלה הצעת מחיר ואמרה 'дорого'. לא הסברתי שהתעריף קבוע בחוק.",
            "lesson": "ללקוחות רוסים — להקדים ולהסביר שהתעריף קבוע בתקנות לפני שליחת המחיר. להדגיש שזה אותו מחיר בכל מקום.",
        },
        {
            "client": "Marie Dupont — traduction acte de naissance",
            "service": "translation_approval", "language": "fr",
            "stage": "quote_sent", "amount": 1028.96, "messages": 5,
            "lost": True, "reason": "no_response",
            "analysis": "הלקוחה הפסיקה להגיב אחרי שהצעת המחיר נשלחה. לא שלחתי פולואפ.",
            "lesson": "תמיד לשלוח פולואפ תוך 4 שעות אם אין תגובה אחרי הצעת מחיר.",
        },
    ]

    for i, conv in enumerate(conversations):
        print(f"  {'─'*55}")
        is_lost = conv.get("lost", False)
        stage_he = STAGE_LABELS.get(conv["stage"], {}).get("label", conv["stage"])
        status = "🔴 נטש" if is_lost else "✅ נסגר"

        print(f"  {status}  {conv['client']}")
        print(f"        שירות: {conv['service']}")
        print(f"        שפה: {conv['language']}")
        print(f"        שלב: {stage_he}")
        print(f"        סכום: {conv['amount']:,.2f} ₪")
        print(f"        הודעות: {conv['messages']}")

        if is_lost:
            reason_he = REJECTION_LABELS.get(conv["reason"], {}).get("label", conv["reason"])
            print(f"        סיבת נטישה: {reason_he}")
            print(f"        ניתוח: {conv['analysis'][:80]}...")
            print(f"        לקח: {conv['lesson'][:80]}...")
            _save_lesson(conv["reason"], conv["analysis"], conv["lesson"])

        print()

    # Show saved lessons
    db = _load_sales_db()
    print(f"  {'═'*55}")
    print(f"  💾 sales_lessons.json: {db['_meta']['total_lessons']} לקחים נשמרו")
    print()
    if db["lessons"]:
        print("  📖 לקחים:")
        for les in db["lessons"]:
            print(f"    [{les['reason_he']}] {les['lesson'][:75]}")
    print()
    print("  📊 סיבות נטישה:")
    for reason, count in db["statistics"]["by_rejection_reason"].items():
        reason_he = REJECTION_LABELS.get(reason, {}).get("label", reason)
        print(f"    {reason_he}: {count}")
    print()

    has_key = bool(os.environ.get("MONDAY_API_KEY"))
    if has_key:
        print("  ✅ MONDAY_API_KEY מוגדר — ניתן להריץ בלי --demo")
    else:
        print("  ⚠️  MONDAY_API_KEY לא מוגדר — הדמו רק שמר ל-sales_lessons.json")
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Funnel Tracker — בורד 18406004253")
    sub = parser.add_subparsers(dest="command")

    # track
    p_track = sub.add_parser("track", help="תיעוד שיחה חדשה")
    p_track.add_argument("--client", required=True)
    p_track.add_argument("--service")
    p_track.add_argument("--language", default="he")
    p_track.add_argument("--stage", default="new_lead")
    p_track.add_argument("--channel", default="whatsapp")
    p_track.add_argument("--amount", type=float)
    p_track.add_argument("--messages", type=int)
    p_track.add_argument("--transcript")

    # analyze
    p_analyze = sub.add_parser("analyze", help="ניתוח שיחה שנטשה")
    p_analyze.add_argument("--item-id", required=True)
    p_analyze.add_argument("--reason", required=True)
    p_analyze.add_argument("--analysis", required=True)
    p_analyze.add_argument("--lesson", required=True)
    p_analyze.add_argument("--no-followup", action="store_true")

    # demo
    sub.add_parser("demo", help="הרץ דוגמה מדומה")

    args = parser.parse_args()

    if args.command == "demo" or (not args.command and "--demo" in sys.argv):
        run_demo()

    elif args.command == "track":
        result = track_conversation(
            client_name=args.client,
            service=args.service,
            language=args.language,
            stage=args.stage,
            channel=args.channel,
            quote_amount=args.amount,
            messages_count=args.messages,
            transcript_link=args.transcript,
        )
        print(f"✅ נוצר: #{result['item_id']} — {result['item_name']}")

    elif args.command == "analyze":
        result = analyze_lost(
            item_id=args.item_id,
            reason=args.reason,
            analysis_text=args.analysis,
            lesson_text=args.lesson,
            followup=not args.no_followup,
        )
        print(f"✅ עודכן. פולואפ: {'כן' if result['followup'] else 'לא'}")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()

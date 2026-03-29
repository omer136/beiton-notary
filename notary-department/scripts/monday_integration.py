#!/usr/bin/env python3
"""
monday.com Integration — מחלקת נוטריון

שלוש פעולות עיקריות:
  1. create_case   — יצירת תיק חדש בבורד הנוטריון
  2. update_status — עדכון סטטוס של תיק קיים
  3. add_update    — הוספת סיכום/עדכון לתיק

שימוש כמודול:
    from monday_integration import MondayNotary
    mn = MondayNotary()
    item_id = mn.create_case(...)
    mn.update_status(item_id, "in_progress")
    mn.add_update(item_id, "התרגום הושלם")

שימוש ב-CLI:
    python monday_integration.py create --name "אנה קוזלוב — תרגום תעודת לידה" ...
    python monday_integration.py status --item-id 123456 --status in_progress
    python monday_integration.py update --item-id 123456 --body "התרגום הושלם"

דרישות סביבה:
    MONDAY_API_KEY — מפתח API של monday.com
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

import urllib.request
import urllib.error

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"
MONDAY_CONFIG = CONFIG_DIR / "monday_config.json"
PRICING_FILE = CONFIG_DIR / "notary_pricing_2026.json"

MONDAY_API_URL = "https://api.monday.com/v2"


def load_config() -> dict:
    with open(MONDAY_CONFIG, encoding="utf-8") as f:
        return json.load(f)


def load_pricing() -> dict:
    with open(PRICING_FILE, encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Pricing calculator (inline — keeps this module self-contained)
# ---------------------------------------------------------------------------

def calc_notary_fee(service_type: str, word_count: int = 0,
                    notary_translates: bool = False,
                    extra_signers: int = 0,
                    with_apostille: bool = False) -> dict:
    """Calculate notary fee from pricing config. Returns dict with fee breakdown."""
    pricing = load_pricing()
    vat_rate = pricing["_meta"]["vat_rate"]
    result = {"notary_fee": 0, "translation_fee": 0, "apostille_fee": 0, "vat_rate": vat_rate}

    if service_type == "translation_approval":
        items = pricing["pricing"]["translation_approval"]["items"]
        fee = items[0]["amount"]  # first 100 words
        remaining = max(0, word_count - 100)
        blocks_up_to_1000 = min(math.ceil(remaining / 100), 9) if remaining > 0 else 0
        fee += blocks_up_to_1000 * items[1]["amount"]
        words_above_1000 = max(0, word_count - 1000)
        if words_above_1000 > 0:
            fee += math.ceil(words_above_1000 / 100) * items[2]["amount"]
        if notary_translates:
            surcharge_rate = pricing["pricing"]["translation_approval"]["translation_by_notary_surcharge"]["surcharge_rate"]
            fee += fee * surcharge_rate
        result["notary_fee"] = fee

        # Translation fee (free-market, not regulated)
        tf = pricing["translation_fee"]
        result["translation_fee"] = max(word_count * tf["per_word_rate"], tf["minimum_fee"])

    elif service_type == "signature_authentication":
        items = pricing["pricing"]["signature_authentication"]["items"]
        result["notary_fee"] = items[0]["amount"] + extra_signers * items[1]["amount"]

    elif service_type == "certified_copy":
        items = pricing["pricing"]["certified_copy"]["items"]
        result["notary_fee"] = items[0]["amount"]

    elif service_type == "power_of_attorney":
        items = pricing["pricing"]["signature_authentication"]["items"]
        result["notary_fee"] = items[0]["amount"]

    elif service_type == "affidavit":
        items = pricing["pricing"]["affidavit"]["items"]
        result["notary_fee"] = items[0]["amount"] + extra_signers * items[1]["amount"]

    elif service_type == "life_certificate":
        result["notary_fee"] = pricing["pricing"]["will_and_life_certificate"]["life_certificate"][0]["amount"]

    elif service_type == "prenuptial_agreement":
        result["notary_fee"] = pricing["pricing"]["prenuptial_agreement"]["items"][0]["amount"]

    elif service_type == "notarial_will":
        items = pricing["pricing"]["will_and_life_certificate"]["will"]
        result["notary_fee"] = items[0]["amount"] + extra_signers * items[1]["amount"]

    elif service_type == "negotiable_instrument":
        result["notary_fee"] = pricing["pricing"]["negotiable_instrument"]["items"][0]["amount"]

    elif service_type == "poa_cancellation":
        result["notary_fee"] = pricing["pricing"]["poa_cancellation"]["items"][0]["amount"]

    elif service_type == "apostille":
        result["apostille_fee"] = pricing["apostille_fee"]["court_fee"] + pricing["apostille_fee"]["handling_fee"]

    if with_apostille and service_type != "apostille":
        result["apostille_fee"] = pricing["apostille_fee"]["court_fee"] + pricing["apostille_fee"]["handling_fee"]

    subtotal = result["notary_fee"] + result["translation_fee"] + result["apostille_fee"]
    result["before_vat"] = round(subtotal, 2)
    result["vat_amount"] = round(subtotal * vat_rate, 2)
    result["total"] = round(subtotal * (1 + vat_rate), 2)
    return result


# ---------------------------------------------------------------------------
# monday.com API client
# ---------------------------------------------------------------------------

class MondayNotary:
    """Client for monday.com notary board operations."""

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.environ.get("MONDAY_API_KEY", "")
        self.config = load_config()
        self.board_id = self.config["board_id"]
        self.columns = self.config["columns"]
        self.groups = self.config["groups"]

    # -- Low-level API call -------------------------------------------------

    def _call_api(self, query: str, variables: dict | None = None) -> dict:
        """Execute a GraphQL query against monday.com API."""
        if not self.api_key:
            raise RuntimeError(
                "MONDAY_API_KEY לא מוגדר. הגדר משתנה סביבה או העבר api_key."
            )

        payload = json.dumps({"query": query, "variables": variables or {}}).encode()
        req = urllib.request.Request(
            MONDAY_API_URL,
            data=payload,
            headers={
                "Authorization": self.api_key,
                "Content-Type": "application/json",
                "API-Version": "2024-10",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else ""
            raise RuntimeError(f"monday.com API error {e.code}: {error_body}") from e

        if "errors" in body:
            raise RuntimeError(f"monday.com GraphQL errors: {json.dumps(body['errors'], ensure_ascii=False)}")
        return body

    # -- Helpers ------------------------------------------------------------

    def _label_index(self, mapping_key: str, value: str) -> int | None:
        """Look up the label index for a status/dropdown column."""
        mapping = self.config.get(mapping_key, {})
        entry = mapping.get(value)
        return entry["index"] if entry else None

    def _build_column_values(self, **kwargs) -> str:
        """Build the column_values JSON string for monday.com mutations."""
        col = self.columns
        values = {}

        if "status" in kwargs and kwargs["status"] is not None:
            idx = self._label_index("status_labels", kwargs["status"])
            if idx is not None:
                values[col["status"]] = {"index": idx}

        if "service_type" in kwargs and kwargs["service_type"] is not None:
            idx = self._label_index("service_type_labels", kwargs["service_type"])
            if idx is not None:
                values[col["service_type"]] = {"index": idx}

        if "language" in kwargs and kwargs["language"] is not None:
            idx = self._label_index("language_labels", kwargs["language"])
            if idx is not None:
                values[col["language"]] = {"index": idx}

        if "urgency" in kwargs and kwargs["urgency"] is not None:
            idx = self._label_index("urgency_labels", kwargs["urgency"])
            if idx is not None:
                values[col["urgency"]] = {"index": idx}

        if "delivery_method" in kwargs and kwargs["delivery_method"] is not None:
            idx = self._label_index("delivery_method_labels", kwargs["delivery_method"])
            if idx is not None:
                values[col["delivery_method"]] = {"index": idx}

        if "phone" in kwargs and kwargs["phone"]:
            values[col["phone"]] = {"phone": kwargs["phone"], "countryShortName": "IL"}

        if "email" in kwargs and kwargs["email"]:
            values[col["email"]] = {"email": kwargs["email"], "text": kwargs["email"]}

        for num_field in ("notary_fee", "translation_fee", "total_price", "word_count"):
            if num_field in kwargs and kwargs[num_field] is not None:
                values[col[num_field]] = str(kwargs[num_field])

        if "intake_date" in kwargs and kwargs["intake_date"]:
            values[col["intake_date"]] = {"date": kwargs["intake_date"]}

        if "expected_completion" in kwargs and kwargs["expected_completion"]:
            values[col["expected_completion"]] = {"date": kwargs["expected_completion"]}

        if "languages_text" in kwargs and kwargs["languages_text"]:
            values[col["languages_text"]] = kwargs["languages_text"]

        if "apostille_needed" in kwargs and kwargs["apostille_needed"] is not None:
            values[col["apostille_needed"]] = {"checked": "true" if kwargs["apostille_needed"] else "false"}

        if "notes" in kwargs and kwargs["notes"]:
            values[col["notes"]] = {"text": kwargs["notes"]}

        return json.dumps(values, ensure_ascii=False)

    # -- Public methods -----------------------------------------------------

    def create_case(
        self,
        item_name: str,
        group: str = "new",
        status: str = "new_inquiry",
        service_type: str | None = None,
        language: str | None = None,
        phone: str | None = None,
        email: str | None = None,
        notary_fee: float | None = None,
        translation_fee: float | None = None,
        total_price: float | None = None,
        word_count: int | None = None,
        urgency: str = "standard",
        delivery_method: str | None = None,
        languages_text: str | None = None,
        apostille_needed: bool = False,
        notes: str | None = None,
        intake_date: str | None = None,
        expected_completion: str | None = None,
    ) -> dict:
        """Create a new case item on the notary board.

        Returns dict with item id and name.
        """
        group_id = self.groups.get(group, self.groups["new"])

        if not intake_date:
            intake_date = date.today().isoformat()

        col_values = self._build_column_values(
            status=status,
            service_type=service_type,
            language=language,
            phone=phone,
            email=email,
            notary_fee=notary_fee,
            translation_fee=translation_fee,
            total_price=total_price,
            word_count=word_count,
            urgency=urgency,
            delivery_method=delivery_method,
            languages_text=languages_text,
            apostille_needed=apostille_needed,
            notes=notes,
            intake_date=intake_date,
            expected_completion=expected_completion,
        )

        query = """
        mutation ($boardId: ID!, $groupId: String!, $itemName: String!, $colValues: JSON!) {
          create_item(
            board_id: $boardId
            group_id: $groupId
            item_name: $itemName
            column_values: $colValues
          ) {
            id
            name
          }
        }
        """
        variables = {
            "boardId": self.board_id,
            "groupId": group_id,
            "itemName": item_name,
            "colValues": col_values,
        }

        result = self._call_api(query, variables)
        item = result["data"]["create_item"]
        return {"item_id": item["id"], "item_name": item["name"]}

    def update_status(self, item_id: str | int, status: str) -> dict:
        """Update the status column of an existing case.

        Args:
            item_id: monday.com item ID
            status: one of the keys in status_labels (e.g. "in_progress", "delivered")
        """
        idx = self._label_index("status_labels", status)
        if idx is None:
            raise ValueError(
                f"סטטוס לא מוכר: '{status}'. "
                f"אפשרויות: {list(self.config['status_labels'].keys())}"
            )

        col_id = self.columns["status"]
        col_values = json.dumps({col_id: {"index": idx}})

        query = """
        mutation ($boardId: ID!, $itemId: ID!, $colValues: JSON!) {
          change_multiple_column_values(
            board_id: $boardId
            item_id: $itemId
            column_values: $colValues
          ) {
            id
            name
          }
        }
        """
        variables = {
            "boardId": self.board_id,
            "itemId": str(item_id),
            "colValues": col_values,
        }

        result = self._call_api(query, variables)
        return result["data"]["change_multiple_column_values"]

    def update_columns(self, item_id: str | int, **kwargs) -> dict:
        """Update any set of columns on an existing case."""
        col_values = self._build_column_values(**kwargs)

        query = """
        mutation ($boardId: ID!, $itemId: ID!, $colValues: JSON!) {
          change_multiple_column_values(
            board_id: $boardId
            item_id: $itemId
            column_values: $colValues
          ) {
            id
            name
          }
        }
        """
        variables = {
            "boardId": self.board_id,
            "itemId": str(item_id),
            "colValues": col_values,
        }

        result = self._call_api(query, variables)
        return result["data"]["change_multiple_column_values"]

    def add_update(self, item_id: str | int, body: str) -> dict:
        """Add an update (comment/summary) to an existing case.

        Args:
            item_id: monday.com item ID
            body: the update text (supports monday.com markdown)
        """
        query = """
        mutation ($itemId: ID!, $body: String!) {
          create_update(
            item_id: $itemId
            body: $body
          ) {
            id
            created_at
          }
        }
        """
        variables = {
            "itemId": str(item_id),
            "body": body,
        }

        result = self._call_api(query, variables)
        return result["data"]["create_update"]

    def move_to_group(self, item_id: str | int, group: str) -> dict:
        """Move an item to a different group (stage)."""
        group_id = self.groups.get(group)
        if not group_id:
            raise ValueError(
                f"קבוצה לא מוכרת: '{group}'. "
                f"אפשרויות: {list(self.groups.keys())}"
            )

        query = """
        mutation ($itemId: ID!, $groupId: String!) {
          move_item_to_group(
            item_id: $itemId
            group_id: $groupId
          ) {
            id
          }
        }
        """
        variables = {"itemId": str(item_id), "groupId": group_id}
        result = self._call_api(query, variables)
        return result["data"]["move_item_to_group"]


# ---------------------------------------------------------------------------
# Dry-run mode (no API key needed)
# ---------------------------------------------------------------------------

def dry_run_create(case_data: dict):
    """Simulate case creation — prints the GraphQL mutation without sending."""
    config = load_config()
    print(f"\n{'='*60}")
    print(f"  DRY RUN — יצירת תיק חדש ב-monday.com")
    print(f"{'='*60}")
    print(f"  Board ID:  {config['board_id']}")
    print(f"  Group:     {case_data.get('group', 'new')} → {config['groups'].get(case_data.get('group', 'new'))}")
    print(f"  Item Name: {case_data['item_name']}")
    print()
    print(f"  ┌─ פרטי לקוח ─────────────────────────────────┐")
    print(f"  │ שם:      {case_data.get('item_name', ''):<40}│")
    print(f"  │ טלפון:   {case_data.get('phone', ''):<40}│")
    print(f"  │ אימייל:  {case_data.get('email', ''):<40}│")
    print(f"  │ שפה:     {case_data.get('language', ''):<40}│")
    print(f"  └─────────────────────────────────────────────┘")
    print()
    print(f"  ┌─ פרטי שירות ────────────────────────────────┐")
    print(f"  │ סוג:     {case_data.get('service_type', ''):<40}│")
    print(f"  │ שפות:    {case_data.get('languages_text', ''):<40}│")
    print(f"  │ מילים:   {str(case_data.get('word_count', '')):<40}│")
    print(f"  │ דחיפות:  {case_data.get('urgency', ''):<40}│")
    print(f"  │ מסירה:   {case_data.get('delivery_method', ''):<40}│")
    print(f"  │ אפוסטיל: {str(case_data.get('apostille_needed', False)):<40}│")
    print(f"  └─────────────────────────────────────────────┘")
    print()
    print(f"  ┌─ תמחור ────────────────────────────────────┐")
    print(f"  │ שכ״ט נוטריוני:  {str(case_data.get('notary_fee', '')):>10} ₪{'':>18}│")
    print(f"  │ שכר תרגום:      {str(case_data.get('translation_fee', '')):>10} ₪{'':>18}│")
    print(f"  │ סה״כ כולל מע״מ: {str(case_data.get('total_price', '')):>10} ₪{'':>18}│")
    print(f"  └─────────────────────────────────────────────┘")
    print()
    print(f"  ┌─ תאריכים ──────────────────────────────────┐")
    print(f"  │ תאריך קליטה: {case_data.get('intake_date', ''):<34}│")
    print(f"  │ צפי סיום:    {case_data.get('expected_completion', ''):<34}│")
    print(f"  └─────────────────────────────────────────────┘")

    if case_data.get("notes"):
        print()
        print(f"  ┌─ הערות ─────────────────────────────────────┐")
        print(f"  │ {case_data['notes']:<47}│")
        print(f"  └─────────────────────────────────────────────┘")

    # Build and display column_values JSON
    mn = MondayNotary.__new__(MondayNotary)
    mn.config = config
    mn.columns = config["columns"]
    mn.groups = config["groups"]
    col_values = mn._build_column_values(**{k: v for k, v in case_data.items() if k != "item_name" and k != "group"})

    print()
    print(f"  ┌─ column_values JSON ────────────────────────┐")
    parsed = json.loads(col_values)
    for col_id, val in parsed.items():
        col_name = next((k for k, v in config["columns"].items() if v == col_id), col_id)
        val_str = json.dumps(val, ensure_ascii=False)
        print(f"  │ {col_name:<20} → {val_str:<25}│")
    print(f"  └─────────────────────────────────────────────┘")

    # GraphQL mutation preview
    print()
    print(f"  ┌─ GraphQL Mutation ──────────────────────────┐")
    print(f"  │ mutation {{                                   │")
    print(f"  │   create_item(                               │")
    print(f"  │     board_id: {config['board_id']:<32}│")
    print(f"  │     group_id: \"{config['groups'].get(case_data.get('group', 'new'))}\"{'':>10}│")
    print(f"  │     item_name: \"{case_data['item_name'][:28]}...\"│") if len(case_data['item_name']) > 28 else print(f"  │     item_name: \"{case_data['item_name']}\"{'':>{max(0, 28-len(case_data['item_name']))}}│")
    print(f"  │     column_values: <JSON>                    │")
    print(f"  │   ) {{ id name }}                              │")
    print(f"  │ }}                                             │")
    print(f"  └─────────────────────────────────────────────┘")
    print()

    has_key = bool(os.environ.get("MONDAY_API_KEY"))
    if has_key:
        print(f"  ✅ MONDAY_API_KEY נמצא — אפשר להריץ בלי --dry-run")
    else:
        print(f"  ⚠️  MONDAY_API_KEY לא מוגדר — הרצה בפועל תיכשל")
    print()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="monday.com Integration — מחלקת נוטריון",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # -- create -------------------------------------------------------------
    p_create = sub.add_parser("create", help="יצירת תיק חדש")
    p_create.add_argument("--name", required=True, help="שם הפריט (לקוח + שירות)")
    p_create.add_argument("--phone", help="טלפון לקוח")
    p_create.add_argument("--email", help="אימייל לקוח")
    p_create.add_argument("--service-type", help="סוג שירות (translation_approval, ...)")
    p_create.add_argument("--language", help="שפת תקשורת (he/en/ru/ar)")
    p_create.add_argument("--languages-text", help="שפות תרגום, למשל he→en")
    p_create.add_argument("--word-count", type=int, help="מספר מילים")
    p_create.add_argument("--urgency", default="standard", help="standard/urgent/immediate")
    p_create.add_argument("--delivery", help="digital/courier/office_visit/home_visit/pickup")
    p_create.add_argument("--apostille", action="store_true", help="צריך אפוסטיל")
    p_create.add_argument("--notes", help="הערות")
    p_create.add_argument("--auto-price", action="store_true", help="חשב מחיר אוטומטית")
    p_create.add_argument("--notary-translates", action="store_true", help="הנוטריון מתרגם בעצמו")
    p_create.add_argument("--expected-days", type=int, default=3, help="ימי עבודה עד סיום")
    p_create.add_argument("--dry-run", action="store_true", help="הדפס בלי לשלוח ל-API")

    # -- status -------------------------------------------------------------
    p_status = sub.add_parser("status", help="עדכון סטטוס תיק")
    p_status.add_argument("--item-id", required=True, help="מזהה הפריט ב-monday")
    p_status.add_argument("--status", required=True, help="סטטוס חדש")
    p_status.add_argument("--group", help="העבר לקבוצה (new/in_progress/...)")

    # -- update -------------------------------------------------------------
    p_update = sub.add_parser("update", help="הוספת עדכון לתיק")
    p_update.add_argument("--item-id", required=True, help="מזהה הפריט ב-monday")
    p_update.add_argument("--body", required=True, help="תוכן העדכון")

    args = parser.parse_args()

    # -- Execute command ----------------------------------------------------

    if args.command == "create":
        # Calculate pricing if requested
        notary_fee = None
        translation_fee = None
        total_price = None

        if args.auto_price and args.service_type:
            fees = calc_notary_fee(
                service_type=args.service_type,
                word_count=args.word_count or 0,
                notary_translates=args.notary_translates,
                with_apostille=args.apostille,
            )
            notary_fee = fees["notary_fee"]
            translation_fee = fees["translation_fee"]
            total_price = fees["total"]

        today = date.today()
        expected = today + timedelta(days=args.expected_days)

        case_data = {
            "item_name": args.name,
            "group": "new",
            "status": "new_inquiry",
            "service_type": args.service_type,
            "language": args.language,
            "phone": args.phone,
            "email": args.email,
            "notary_fee": notary_fee,
            "translation_fee": translation_fee,
            "total_price": total_price,
            "word_count": args.word_count,
            "urgency": args.urgency,
            "delivery_method": args.delivery,
            "languages_text": args.languages_text,
            "apostille_needed": args.apostille,
            "notes": args.notes,
            "intake_date": today.isoformat(),
            "expected_completion": expected.isoformat(),
        }

        if args.dry_run:
            dry_run_create(case_data)
        else:
            mn = MondayNotary()
            result = mn.create_case(**case_data)
            print(f"✅ תיק נוצר בהצלחה!")
            print(f"   Item ID: {result['item_id']}")
            print(f"   Name:    {result['item_name']}")

    elif args.command == "status":
        mn = MondayNotary()
        result = mn.update_status(args.item_id, args.status)
        print(f"✅ סטטוס עודכן: {args.status}")
        if args.group:
            mn.move_to_group(args.item_id, args.group)
            print(f"✅ הועבר לקבוצה: {args.group}")

    elif args.command == "update":
        mn = MondayNotary()
        result = mn.add_update(args.item_id, args.body)
        print(f"✅ עדכון נוסף (ID: {result['id']})")


if __name__ == "__main__":
    main()

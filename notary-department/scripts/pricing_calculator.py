#!/usr/bin/env python3
"""
מחשבון מחירי שירותי נוטריון
קורא מתוך config/notary_pricing_2026.json ומחשב מחיר סופי כולל מע״מ.
"""

import json
import math
from pathlib import Path

CONFIG_DIR = Path(__file__).resolve().parent.parent / "config"
PRICING_FILE = CONFIG_DIR / "notary_pricing_2026.json"


def load_pricing() -> dict:
    with open(PRICING_FILE, encoding="utf-8") as f:
        return json.load(f)


def calc_translation_approval(data: dict, word_count: int, notary_translates: bool = False) -> dict:
    """חישוב עלות אישור נכונות תרגום לפי מספר מילים."""
    items = data["pricing"]["translation_approval"]["items"]
    first_100_fee = items[0]["amount"]       # עד 100 מילים ראשונות
    per_100_up_to_1000 = items[1]["amount"]  # כל 100 נוספות עד 1,000
    per_100_above_1000 = items[2]["amount"]  # כל 100 נוספות מעל 1,000

    total = first_100_fee
    remaining = max(0, word_count - 100)

    blocks_up_to_1000 = min(math.ceil(remaining / 100), 9) if remaining > 0 else 0
    total += blocks_up_to_1000 * per_100_up_to_1000

    words_above_1000 = max(0, word_count - 1000)
    if words_above_1000 > 0:
        blocks_above_1000 = math.ceil(words_above_1000 / 100)
        total += blocks_above_1000 * per_100_above_1000

    surcharge = 0
    if notary_translates:
        rate = data["pricing"]["translation_approval"]["translation_by_notary_surcharge"]["surcharge_rate"]
        surcharge = total * rate

    base = total + surcharge
    return {"base": total, "surcharge": surcharge, "before_vat": base}


def calc_signature_authentication(data: dict, extra_signers: int = 0, with_apostille: bool = False) -> dict:
    """חישוב עלות אימות חתימה."""
    items = data["pricing"]["signature_authentication"]["items"]
    first_signer = items[0]["amount"]
    extra_fee = items[1]["amount"]

    base = first_signer + extra_signers * extra_fee

    apostille = 0
    if with_apostille:
        apostille = data["apostille_fee"]["court_fee"] + data["apostille_fee"]["handling_fee"]

    before_vat = base + apostille
    return {"base": base, "apostille": apostille, "before_vat": before_vat}


def calc_notarial_will(data: dict, extra_signers: int = 0) -> dict:
    """חישוב עלות צוואה נוטריונית."""
    items = data["pricing"]["will_and_life_certificate"]["will"]
    first = items[0]["amount"]
    extra_fee = items[1]["amount"]

    base = first + extra_signers * extra_fee
    return {"base": base, "before_vat": base}


def add_vat(amount: float, vat_rate: float) -> float:
    return round(amount * (1 + vat_rate), 2)


def format_price(label: str, result: dict, vat_rate: float):
    print(f"\n{'='*50}")
    print(f"  {label}")
    print(f"{'='*50}")
    for key, val in result.items():
        if key == "before_vat":
            continue
        nice_key = {
            "base": "שכ״ט בסיסי",
            "surcharge": "תוספת תרגום ע״י נוטריון",
            "apostille": "אפוסטיל (אגרה + טיפול)",
        }.get(key, key)
        if val > 0:
            print(f"  {nice_key}: {val:,.2f} ₪")

    before = result["before_vat"]
    vat_amount = round(before * vat_rate, 2)
    total = add_vat(before, vat_rate)
    print(f"  ───────────────────────────")
    print(f"  לפני מע״מ: {before:,.2f} ₪")
    print(f"  מע״מ ({int(vat_rate*100)}%): {vat_amount:,.2f} ₪")
    print(f"  סה״כ לתשלום: {total:,.2f} ₪")


def main():
    data = load_pricing()
    vat_rate = data["_meta"]["vat_rate"]

    # דוגמה 1: תרגום 450 מילים עברית-אנגלית (הנוטריון מתרגם בעצמו)
    r1 = calc_translation_approval(data, word_count=450, notary_translates=True)
    format_price("תרגום 450 מילים עברית→אנגלית (נוטריון מתרגם)", r1, vat_rate)

    # דוגמה 2: אימות חתימה + אפוסטיל
    r2 = calc_signature_authentication(data, extra_signers=0, with_apostille=True)
    format_price("אימות חתימה + אפוסטיל", r2, vat_rate)

    # דוגמה 3: צוואה נוטריונית (חותם אחד)
    r3 = calc_notarial_will(data, extra_signers=0)
    format_price("צוואה נוטריונית", r3, vat_rate)


if __name__ == "__main__":
    main()

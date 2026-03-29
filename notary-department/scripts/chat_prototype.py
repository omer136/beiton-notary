#!/usr/bin/env python3
"""
Agent 1 Prototype — צ'אט אינטראקטיבי עם סוכן התקשורת של מחלקת הנוטריון.

מריץ שיחה בטרמינל מול Claude Sonnet עם ה-system prompt של Agent 1,
כולל גישה לקבצי הקונפיגורציה ולמחשבון המחירים כ-tools.

שימוש:
    export ANTHROPIC_API_KEY=sk-ant-...
    python chat_prototype.py

    # או עם דוגמה מוכנה:
    python chat_prototype.py --demo
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from pathlib import Path

import anthropic

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_DIR = BASE_DIR / "config"
AGENTS_DIR = BASE_DIR / "agents"

SERVICES_FILE = CONFIG_DIR / "notary_services.json"
PRICING_FILE = CONFIG_DIR / "notary_pricing_2026.json"
SYSTEM_PROMPT_FILE = AGENTS_DIR / "agent1_communication.md"

# ---------------------------------------------------------------------------
# Load data
# ---------------------------------------------------------------------------

def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_system_prompt() -> str:
    agent_prompt = SYSTEM_PROMPT_FILE.read_text(encoding="utf-8")
    services = load_json(SERVICES_FILE)
    pricing = load_json(PRICING_FILE)

    # Inject live data into the system prompt
    data_section = f"""

---

## נתונים חיים (נטענו אוטומטית)

### config/notary_services.json — רשימת שירותים
```json
{json.dumps(services["services"], ensure_ascii=False, indent=2)[:6000]}
```

### config/notary_pricing_2026.json — תעריפים
```json
{json.dumps(pricing["pricing"], ensure_ascii=False, indent=2)}
```

### שכר תרגום (חופשי)
```json
{json.dumps(pricing["translation_fee"], ensure_ascii=False, indent=2)}
```

### אפוסטיל
```json
{json.dumps(pricing["apostille_fee"], ensure_ascii=False, indent=2)}
```

### שיעור מע״מ: {pricing["_meta"]["vat_rate"] * 100:.0f}%

---

## הוראות tool use

יש לך גישה ל-tool בשם `calculate_price`. כשאתה יודע את סוג השירות ומספר המילים (לתרגום) — **חייב** להשתמש ב-tool לחישוב מחיר מדויק. אל תחשב ידנית.

תאריך היום: 2026-03-27
"""
    return agent_prompt + data_section


# ---------------------------------------------------------------------------
# Tool: calculate_price
# ---------------------------------------------------------------------------

TOOL_DEFINITION = {
    "name": "calculate_price",
    "description": (
        "מחשב מחיר שירות נוטריוני לפי התעריפים הרשמיים. "
        "מחזיר פירוט מלא כולל מע״מ."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "service_type": {
                "type": "string",
                "description": "סוג השירות",
                "enum": [
                    "translation_approval", "translator_declaration",
                    "certified_copy", "signature_authentication",
                    "power_of_attorney", "affidavit", "life_certificate",
                    "prenuptial_agreement", "notarial_will",
                    "negotiable_instrument", "apostille", "poa_cancellation",
                ],
            },
            "word_count": {
                "type": "integer",
                "description": "מספר מילים (רלוונטי לתרגום)",
                "default": 0,
            },
            "notary_translates": {
                "type": "boolean",
                "description": "האם הנוטריון מתרגם בעצמו (he↔en)",
                "default": False,
            },
            "extra_signers": {
                "type": "integer",
                "description": "מספר חותמים/מצהירים נוספים (מעבר לראשון)",
                "default": 0,
            },
            "with_apostille": {
                "type": "boolean",
                "description": "האם נדרש אפוסטיל",
                "default": False,
            },
            "urgency": {
                "type": "string",
                "description": "דחיפות — משפיע על שכר תרגום בלבד",
                "enum": ["standard", "urgent", "immediate"],
                "default": "standard",
            },
            "extra_copies": {
                "type": "integer",
                "description": "מספר עותקים נוספים",
                "default": 0,
            },
        },
        "required": ["service_type"],
    },
}


def execute_calculate_price(params: dict) -> dict:
    """Execute the calculate_price tool and return result."""
    pricing = load_json(PRICING_FILE)
    vat_rate = pricing["_meta"]["vat_rate"]

    service = params["service_type"]
    word_count = params.get("word_count", 0)
    notary_translates = params.get("notary_translates", False)
    extra_signers = params.get("extra_signers", 0)
    with_apostille = params.get("with_apostille", False)
    urgency = params.get("urgency", "standard")
    extra_copies = params.get("extra_copies", 0)

    lines = []
    notary_fee = 0
    translation_fee = 0
    apostille_fee = 0
    copies_fee = 0

    # --- Translation approval ---
    if service == "translation_approval":
        items = pricing["pricing"]["translation_approval"]["items"]
        fee = items[0]["amount"]
        lines.append(f"עד 100 מילים ראשונות: {items[0]['amount']} ₪")
        remaining = max(0, word_count - 100)
        blocks = min(math.ceil(remaining / 100), 9) if remaining > 0 else 0
        if blocks > 0:
            block_fee = blocks * items[1]["amount"]
            fee += block_fee
            lines.append(f"100 מילים נוספות × {blocks}: {block_fee} ₪")
        above_1000 = max(0, word_count - 1000)
        if above_1000 > 0:
            b2 = math.ceil(above_1000 / 100)
            f2 = b2 * items[2]["amount"]
            fee += f2
            lines.append(f"100 מילים נוספות (מעל 1,000) × {b2}: {f2} ₪")
        if notary_translates:
            rate = pricing["pricing"]["translation_approval"]["translation_by_notary_surcharge"]["surcharge_rate"]
            surcharge = fee * rate
            lines.append(f"תוספת תרגום ע״י נוטריון ({int(rate*100)}%): {surcharge:.2f} ₪")
            fee += surcharge
        notary_fee = fee

        # Translation fee (free market)
        tf = pricing["translation_fee"]
        raw = word_count * tf["per_word_rate"]
        base_tf = max(raw, tf["minimum_fee"])
        if urgency == "urgent":
            base_tf *= tf["urgent_multiplier"]
        elif urgency == "immediate":
            base_tf *= tf["immediate_multiplier"]
        translation_fee = base_tf
        lines.append(f"שכר תרגום ({word_count} מילים, {urgency}): {translation_fee:.2f} ₪")

        if extra_copies > 0:
            copies_fee = extra_copies * items[3]["amount"]
            lines.append(f"עותקים נוספים × {extra_copies}: {copies_fee} ₪")

    # --- Signature authentication ---
    elif service == "signature_authentication":
        items = pricing["pricing"]["signature_authentication"]["items"]
        notary_fee = items[0]["amount"]
        lines.append(f"חותם ראשון: {items[0]['amount']} ₪")
        if extra_signers > 0:
            extra = extra_signers * items[1]["amount"]
            notary_fee += extra
            lines.append(f"חותמים נוספים × {extra_signers}: {extra} ₪")

    # --- Certified copy ---
    elif service == "certified_copy":
        items = pricing["pricing"]["certified_copy"]["items"]
        notary_fee = items[0]["amount"]
        lines.append(f"עמוד ראשון: {items[0]['amount']} ₪")
        if extra_copies > 0:
            extra = extra_copies * items[1]["amount"]
            notary_fee += extra
            lines.append(f"עמודים נוספים × {extra_copies}: {extra} ₪")

    # --- Power of attorney ---
    elif service == "power_of_attorney":
        items = pricing["pricing"]["signature_authentication"]["items"]
        notary_fee = items[0]["amount"]
        lines.append(f"אימות חתימה (ייפוי כוח): {items[0]['amount']} ₪")
        if extra_signers > 0:
            extra = extra_signers * items[1]["amount"]
            notary_fee += extra
            lines.append(f"חותמים נוספים × {extra_signers}: {extra} ₪")

    # --- Affidavit ---
    elif service == "affidavit":
        items = pricing["pricing"]["affidavit"]["items"]
        notary_fee = items[0]["amount"]
        lines.append(f"מצהיר ראשון: {items[0]['amount']} ₪")
        if extra_signers > 0:
            extra = extra_signers * items[1]["amount"]
            notary_fee += extra
            lines.append(f"מצהירים נוספים × {extra_signers}: {extra} ₪")

    # --- Life certificate ---
    elif service == "life_certificate":
        fee = pricing["pricing"]["will_and_life_certificate"]["life_certificate"][0]["amount"]
        notary_fee = fee
        lines.append(f"אישור חיים: {fee} ₪")

    # --- Prenuptial ---
    elif service == "prenuptial_agreement":
        fee = pricing["pricing"]["prenuptial_agreement"]["items"][0]["amount"]
        notary_fee = fee
        lines.append(f"אימות הסכם ממון: {fee} ₪")

    # --- Notarial will ---
    elif service == "notarial_will":
        items = pricing["pricing"]["will_and_life_certificate"]["will"]
        notary_fee = items[0]["amount"]
        lines.append(f"צוואה — חותם ראשון: {items[0]['amount']} ₪")
        if extra_signers > 0:
            extra = extra_signers * items[1]["amount"]
            notary_fee += extra
            lines.append(f"חותמים נוספים × {extra_signers}: {extra} ₪")

    # --- Negotiable instrument ---
    elif service == "negotiable_instrument":
        items = pricing["pricing"]["negotiable_instrument"]["items"]
        notary_fee = items[0]["amount"]
        lines.append(f"העדה (עד 80,700 ₪): {items[0]['amount']} ₪")

    # --- Apostille ---
    elif service == "apostille":
        court = pricing["apostille_fee"]["court_fee"]
        handling = pricing["apostille_fee"]["handling_fee"]
        apostille_fee = court + handling
        lines.append(f"אגרת ביהמ״ש: {court} ₪")
        lines.append(f"שכר טיפול: {handling} ₪")

    # --- POA cancellation ---
    elif service == "poa_cancellation":
        items = pricing["pricing"]["poa_cancellation"]["items"]
        notary_fee = items[0]["amount"]
        lines.append(f"קבלת הודעת ביטול: {items[0]['amount']} ₪")

    # --- Apostille add-on ---
    if with_apostille and service != "apostille":
        court = pricing["apostille_fee"]["court_fee"]
        handling = pricing["apostille_fee"]["handling_fee"]
        apostille_fee = court + handling
        lines.append(f"אפוסטיל — אגרה: {court} ₪ + טיפול: {handling} ₪")

    subtotal = notary_fee + translation_fee + apostille_fee + copies_fee
    vat_amount = round(subtotal * vat_rate, 2)
    total = round(subtotal * (1 + vat_rate), 2)

    lines.append(f"───────────────────")
    lines.append(f"שכ״ט נוטריוני: {notary_fee:.2f} ₪")
    if translation_fee > 0:
        lines.append(f"שכר תרגום: {translation_fee:.2f} ₪")
    if apostille_fee > 0:
        lines.append(f"אפוסטיל: {apostille_fee:.2f} ₪")
    if copies_fee > 0:
        lines.append(f"עותקים נוספים: {copies_fee:.2f} ₪")
    lines.append(f"סה״כ לפני מע״מ: {subtotal:.2f} ₪")
    lines.append(f"מע״מ ({int(vat_rate*100)}%): {vat_amount:.2f} ₪")
    lines.append(f"סה״כ לתשלום: {total:.2f} ₪")

    return {
        "breakdown": lines,
        "notary_fee": notary_fee,
        "translation_fee": translation_fee,
        "apostille_fee": apostille_fee,
        "copies_fee": copies_fee,
        "subtotal": subtotal,
        "vat_rate": vat_rate,
        "vat_amount": vat_amount,
        "total": total,
    }


# ---------------------------------------------------------------------------
# Chat loop
# ---------------------------------------------------------------------------

MODEL = "claude-sonnet-4-20250514"
MAX_TURNS = 50


def run_chat(demo_messages: list[str] | None = None):
    """Run the interactive chat loop."""
    client = anthropic.Anthropic()
    system_prompt = load_system_prompt()
    messages: list[dict] = []
    tools = [TOOL_DEFINITION]

    demo_idx = 0

    print()
    print("╔══════════════════════════════════════════════════════╗")
    print("║   🏛️  מחלקת נוטריון — צ'אט עם נועה (Prototype)     ║")
    print("║   הקלד/י הודעה בכל שפה. 'exit' ליציאה.             ║")
    print("╚══════════════════════════════════════════════════════╝")
    print()

    for turn in range(MAX_TURNS):
        # Get user input
        if demo_messages and demo_idx < len(demo_messages):
            user_input = demo_messages[demo_idx]
            demo_idx += 1
            print(f"\033[36m👤 לקוח:\033[0m {user_input}")
        else:
            if demo_messages and demo_idx >= len(demo_messages):
                print("\n--- סוף הדמו. המשך ידני או 'exit' ליציאה ---\n")
                demo_messages = None
            try:
                user_input = input("\033[36m👤 לקוח:\033[0m ")
            except (EOFError, KeyboardInterrupt):
                print("\n\nלהתראות! 👋")
                break

        if user_input.strip().lower() in ("exit", "quit", "יציאה", "ביי"):
            print("\nלהתראות! 👋")
            break

        messages.append({"role": "user", "content": user_input})

        # Call Claude — loop to handle tool use
        while True:
            response = client.messages.create(
                model=MODEL,
                max_tokens=2048,
                system=system_prompt,
                tools=tools,
                messages=messages,
            )

            # Collect assistant content blocks
            assistant_content = response.content
            messages.append({"role": "assistant", "content": assistant_content})

            # Check if there are tool calls
            tool_calls = [b for b in assistant_content if b.type == "tool_use"]

            if not tool_calls:
                # No tool calls — print text response
                for block in assistant_content:
                    if hasattr(block, "text"):
                        print(f"\n\033[33m🤖 נועה:\033[0m {block.text}\n")
                break

            # Process tool calls
            tool_results = []
            for tc in tool_calls:
                # Print any text before tool call
                for block in assistant_content:
                    if hasattr(block, "text") and block.text.strip():
                        print(f"\n\033[33m🤖 נועה:\033[0m {block.text}")
                        break

                if tc.name == "calculate_price":
                    print(f"\033[90m   ⚙️  מחשב מחיר ({tc.input.get('service_type', '?')})...\033[0m")
                    result = execute_calculate_price(tc.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tc.id,
                        "content": json.dumps(result, ensure_ascii=False),
                    })
                else:
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tc.id,
                        "content": json.dumps({"error": f"Unknown tool: {tc.name}"}),
                    })

            messages.append({"role": "user", "content": tool_results})
            # Continue loop — Claude will now respond with the price quote


# ---------------------------------------------------------------------------
# Demo mode
# ---------------------------------------------------------------------------

DEMO_MESSAGES = [
    "היי, אני צריך לתרגם תעודת לידה לאנגלית",
    "יוסי כהן, זה לויזה לקנדה, לא דחוף",
    "בסביבות 200 מילים",
    "מאשר",
]


# ---------------------------------------------------------------------------
# Offline simulation (no API key)
# ---------------------------------------------------------------------------

DEMO_SCENARIOS = {
    "he": {
        "name": "דמו עברית — יוסי כהן, תרגום תעודת לידה",
        "turns": [
            # (client_msg, noa_response_lines)
            (
                "היי, אני צריך לתרגם תעודת לידה לאנגלית",
                [
                    "שלום! אני נועה מצוות הנוטריון של המשרד 😊",
                    "תרגום תעודת לידה לאנגלית — בשמחה!",
                    "כמה שאלות קצרות:",
                    "1. מה השם המלא שלך?",
                    "2. זה לצורך ויזה / לימודים / עבודה?",
                    "3. יש דחיפות מיוחדת?",
                ],
            ),
            (
                "יוסי כהן, זה לויזה לקנדה, לא דחוף",
                [
                    "תודה יוסי! כמה מילים יש בערך בתעודה?",
                    "(תעודת לידה סטנדרטית היא בד״כ 150-250 מילים)",
                ],
            ),
        ],
        "price_prompt": "בסביבות 200 מילים",
        "price_params": {
            "service_type": "translation_approval",
            "word_count": 200,
            "notary_translates": True,
            "urgency": "standard",
        },
        "quote_header": "📋 **הצעת מחיר — אישור תרגום נוטריוני**",
        "quote_service": "**שירות:** תרגום תעודת לידה עברית → אנגלית",
        "quote_client": "**לקוח:** יוסי כהן",
        "quote_time": "⏱ זמן טיפול: 3 ימי עבודה",
        "quote_delivery": "📦 מסירה: סריקה דיגיטלית + מקור בשליח",
        "confirm_prompt": "מאשר",
        "confirm_cta": ['✅ לאישור — "מאשר"', '❌ לביטול — "לא תודה"', "❓ שאלות — אני כאן"],
        "after_confirm": [
            "מעולה! ✅ כדי להתחיל אני צריכה:",
            "1. 📄 צילום/סריקה של תעודת הלידה (ברור וקריא)",
            "2. 🪪 צילום תעודת זהות",
            "",
            "אפשר לשלוח ישירות לכאן בוואטסאפ, או למייל: notary@firm.co.il",
        ],
    },
    "ru": {
        "name": "Демо на русском — Елена Козлова, перевод свидетельства о рождении",
        "turns": [
            (
                "Здравствуйте, мне нужно перевести свидетельство о рождении на английский",
                [
                    "Здравствуйте! Меня зовут Ноа, я из нотариального отдела 😊",
                    "Нотариальный перевод свидетельства о рождении (תעודת לידה)",
                    "на английский — конечно поможем!",
                    "",
                    "Несколько вопросов:",
                    "1. Как вас зовут?",
                    "2. Для чего нужен перевод? (виза, учёба, работа за рубежом)",
                    "3. Есть срочность?",
                ],
            ),
            (
                "Елена Козлова, мне нужно для рабочей визы в Канаду, не срочно",
                [
                    "Спасибо, Елена! Сколько примерно слов в документе?",
                    "(Стандартное свидетельство о рождении — обычно 150-250 слов)",
                    "",
                    "Если не знаете — можете отправить фото документа, и я посчитаю.",
                ],
            ),
            (
                "Примерно 220 слов",
                None,  # → trigger price calculation
            ),
        ],
        "price_prompt": "Примерно 220 слов",
        "price_params": {
            "service_type": "translation_approval",
            "word_count": 220,
            "notary_translates": True,
            "urgency": "standard",
        },
        "quote_header": "📋 **Ценовое предложение — Нотариальный перевод**",
        "quote_service": "**Услуга:** Перевод свидетельства о рождении (אישור נכונות תרגום) иврит → английский",
        "quote_client": "**Клиент:** Елена Козлова",
        "quote_time": "⏱ Срок выполнения: 3 рабочих дня",
        "quote_delivery": "📦 Получение: цифровая копия + оригинал курьером",
        "confirm_prompt": "подтверждаю",
        "confirm_cta": [
            '✅ Для подтверждения — напишите «подтверждаю»',
            '❌ Для отмены — напишите «нет, спасибо»',
            "❓ Вопросы — я здесь",
        ],
        "after_confirm": [
            "Отлично! ✅ Для начала мне нужны:",
            "1. 📄 Скан/фото свидетельства о рождении (чёткое и читаемое)",
            "2. 🪪 Копия удостоверения личности (теудат зеут) или загранпаспорт",
            "",
            "Можете отправить прямо сюда в WhatsApp или на email: notary@firm.co.il",
            "",
            "После получения документов я открою дело и сообщу о статусе.",
            "Спасибо, что обратились к нам, Елена! 🙏",
        ],
    },
    "en": {
        "name": "English demo — John Smith, birth certificate translation",
        "turns": [
            (
                "Hi, I need to translate a birth certificate to English",
                [
                    "Hi! I'm Noa from the notary department 😊",
                    "Certified translation of a birth certificate — happy to help!",
                    "",
                    "A few quick questions:",
                    "1. What's your full name?",
                    "2. What's the translation for? (visa, studies, work abroad)",
                    "3. Any urgency?",
                ],
            ),
            (
                "John Smith, it's for a work visa to Germany, standard timing is fine",
                [
                    "Thanks John! How many words approximately in the document?",
                    "(A standard birth certificate is usually 150-250 words)",
                ],
            ),
        ],
        "price_prompt": "About 180 words",
        "price_params": {
            "service_type": "translation_approval",
            "word_count": 180,
            "notary_translates": True,
            "urgency": "standard",
        },
        "quote_header": "📋 **Price Quote — Certified Notarial Translation**",
        "quote_service": "**Service:** Birth certificate translation Hebrew → English",
        "quote_client": "**Client:** John Smith",
        "quote_time": "⏱ Processing time: 3 business days",
        "quote_delivery": "📦 Delivery: digital scan + original by courier",
        "confirm_prompt": "approved",
        "confirm_cta": [
            '✅ To confirm — reply "approved"',
            '❌ To cancel — reply "no thanks"',
            "❓ Questions — I'm here to help",
        ],
        "after_confirm": [
            "Great! ✅ To get started, I'll need:",
            "1. 📄 Scan/photo of the birth certificate (clear and readable)",
            "2. 🪪 Copy of your ID (teudat zehut) or passport",
            "",
            "You can send them right here on WhatsApp or email: notary@firm.co.il",
        ],
    },
    "ar": {
        "name": "عرض تجريبي بالعربية — أحمد محمود، ترجمة شهادة ميلاد",
        "turns": [
            (
                "مرحبا، بدي أترجم شهادة ميلاد للإنجليزي",
                [
                    "مرحباً! أنا نوا من قسم كاتب العدل 😊",
                    "ترجمة موثقة لشهادة الميلاد (תעודת לידה) للإنجليزية — بكل سرور!",
                    "",
                    "عندي كم سؤال:",
                    "1. شو اسمك الكامل؟",
                    "2. لأي غرض الترجمة؟ (فيزا، دراسة، عمل بالخارج)",
                    "3. في استعجال؟",
                ],
            ),
            (
                "أحمد محمود، لفيزا عمل لكندا، مش مستعجل",
                [
                    "شكراً أحمد! كم كلمة تقريباً بالمستند؟",
                    "(شهادة ميلاد عادية — عادة 150-250 كلمة)",
                ],
            ),
        ],
        "price_prompt": "حوالي 190 كلمة",
        "price_params": {
            "service_type": "translation_approval",
            "word_count": 190,
            "notary_translates": True,
            "urgency": "standard",
        },
        "quote_header": "📋 **عرض سعر — ترجمة موثقة من كاتب العدل**",
        "quote_service": "**الخدمة:** ترجمة شهادة ميلاد (אישור נכונות תרגום) عبري ← إنجليزي",
        "quote_client": "**العميل:** أحمد محمود",
        "quote_time": "⏱ مدة المعالجة: 3 أيام عمل",
        "quote_delivery": "📦 التسليم: نسخة رقمية + الأصل عبر مندوب",
        "confirm_prompt": "موافق",
        "confirm_cta": [
            '✅ للتأكيد — أرسل "موافق"',
            '❌ للإلغاء — أرسل "لا شكراً"',
            "❓ أسئلة — أنا هنا",
        ],
        "after_confirm": [
            "ممتاز! ✅ للبدء، بحتاج منك:",
            "1. 📄 صورة/سكان لشهادة الميلاد (واضحة ومقروءة)",
            "2. 🪪 صورة هوية أصلية أو جواز سفر",
            "",
            "ممكن ترسلهم هون بالواتساب أو على الإيميل: notary@firm.co.il",
        ],
    },
}


def run_offline_demo(scenario_key: str = "he"):
    """Run a fully scripted demo without calling the API — for testing the
    tool execution, pricing logic, and display flow."""

    scenario = DEMO_SCENARIOS.get(scenario_key)
    if not scenario:
        print(f"תרחיש לא מוכר: {scenario_key}")
        print(f"אפשרויות: {', '.join(DEMO_SCENARIOS.keys())}")
        sys.exit(1)

    lang_flag = {"he": "🇮🇱", "ru": "🇷🇺", "en": "🇬🇧", "ar": "🇸🇦"}.get(scenario_key, "")

    print()
    print("╔══════════════════════════════════════════════════════════════╗")
    print(f"║  🏛️  מחלקת נוטריון — דמו מדומה {lang_flag}  (ללא API)             ║")
    print(f"║  {scenario['name'][:56]:<56}  ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print()

    # Conversation turns before pricing
    for client_msg, noa_lines in scenario["turns"]:
        print(f"\033[36m👤 לקוח:\033[0m {client_msg}")
        print()
        if noa_lines:
            first = True
            for line in noa_lines:
                prefix = "\033[33m🤖 נועה:\033[0m " if first else "      "
                print(f"{prefix}{line}")
                first = False
            print()

    # Pricing turn
    params = scenario["price_params"]
    print(f"\033[90m   ⚙️  מחשב מחיר ({params['service_type']}, {params['word_count']} words)...\033[0m")
    result = execute_calculate_price(params)

    print()
    print(f"\033[33m🤖 נועה:\033[0m")
    print()
    print(f"      {scenario['quote_header']}")
    print()
    print(f"      {scenario['quote_service']}")
    print(f"      {scenario['quote_client']}")
    print()

    # Price breakdown table
    breakdown = result["breakdown"]
    # Find the separator line to split into detail vs totals
    sep_idx = None
    for i, line in enumerate(breakdown):
        if line.startswith("───"):
            sep_idx = i
            break

    if sep_idx is not None:
        # Detail lines
        for line in breakdown[:sep_idx]:
            print(f"      │ {line}")
        print(f"      ├{'─'*44}")
        # Total lines
        for line in breakdown[sep_idx + 1:]:
            bold = line.startswith("סה״כ לתשלום")
            if bold:
                print(f"      │ \033[1m{line}\033[0m")
            else:
                print(f"      │ {line}")
    else:
        for line in breakdown:
            print(f"      │ {line}")

    print()
    print(f"      {scenario['quote_time']}")
    print(f"      {scenario['quote_delivery']}")
    print()
    for cta in scenario["confirm_cta"]:
        print(f"      {cta}")
    print()

    # Confirm turn
    print(f"\033[36m👤 לקוח:\033[0m {scenario['confirm_prompt']}")
    print()
    first = True
    for line in scenario["after_confirm"]:
        prefix = "\033[33m🤖 נועה:\033[0m " if first else "      "
        print(f"{prefix}{line}")
        first = False
    print()

    # Summary
    print("═" * 62)
    print()
    print("  📊 סיכום הדמו / Demo Summary:")
    print(f"     שפה / Language:      {scenario_key}")
    print(f"     שירות / Service:     translation_approval")
    print(f"     מילים / Words:       {params['word_count']}")
    print(f"     שכ״ט נוטריוני:       {result['notary_fee']:.2f} ₪")
    print(f"     שכר תרגום:           {result['translation_fee']:.2f} ₪")
    print(f"     סה״כ לפני מע״מ:     {result['subtotal']:.2f} ₪")
    print(f"     מע״מ (18%):          {result['vat_amount']:.2f} ₪")
    print(f"     סה״כ לתשלום:        \033[1m{result['total']:.2f} ₪\033[0m")
    print()
    print("  💡 להרצה עם Claude API:")
    print("     export ANTHROPIC_API_KEY=sk-ant-...")
    print("     python chat_prototype.py        # אינטראקטיבי")
    print("     python chat_prototype.py --demo # דמו אוטומטי")
    print()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Agent 1 Chat Prototype")
    parser.add_argument("--demo", action="store_true", help="הרץ דמו עם הודעות מוכנות")
    parser.add_argument("--offline", action="store_true", help="דמו מדומה ללא API")
    parser.add_argument("--lang", default="he", choices=["he", "en", "ru", "ar"],
                        help="שפת הדמו (he/en/ru/ar)")
    args = parser.parse_args()

    has_key = bool(os.environ.get("ANTHROPIC_API_KEY"))

    if args.offline or (args.demo and not has_key):
        run_offline_demo(scenario_key=args.lang)
    else:
        if not has_key:
            print("\n⚠️  ANTHROPIC_API_KEY לא מוגדר.")
            print("   להרצה ללא API:  python chat_prototype.py --offline --lang ru")
            print("   להרצה עם API:   export ANTHROPIC_API_KEY=sk-ant-...\n")
            sys.exit(1)
        demo = DEMO_MESSAGES if args.demo else None
        run_chat(demo_messages=demo)


if __name__ == "__main__":
    main()

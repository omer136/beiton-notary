# מחלקת נוטריון AI — תוכנית הקמה ב-Claude Code

## סקירה כללית

מערכת של 2 סוכני AI למחלקת נוטריון:
- **Agent 1 (Communication)** — תקשורת עם לקוחות ב-4 שפות, זיהוי שירות, תמחור, תיאום לוגיסטיקה
- **Agent 2 (Expert Notary)** — תרגום מרובה-AI, הפקת DOCX, בקרת איכות

## מבנה הפרויקט

```
~/ai-law-firm/notary-department/
├── config/
│   ├── notary_services.json       # כל השירותים — Agent 1 קורא מכאן
│   ├── notary_pricing_2026.json   # תמחור רשמי — Agent 1 קורא מכאן
│   └── monday_config.json         # Board ID, Column IDs — לחיבור monday
├── agents/
│   ├── agent1_communication.md    # System prompt של Agent 1
│   └── agent2_expert_notary.md    # System prompt של Agent 2
├── templates/
│   ├── translation_docx/          # תבניות DOCX לתרגומים נוטריוניים
│   ├── price_quotes/              # תבניות הצעות מחיר
│   └── chat_transcripts/         # תמלולי שיחות
└── scripts/
    ├── pricing_calculator.py      # מחשבון תמחור
    ├── monday_integration.py      # חיבור ל-monday API
    └── whatsapp_handler.py        # חיבור ל-WhatsApp Business API
```

## שלב 1 — התקנה ראשונית

### 1.1 יצירת מבנה הפרויקט
```bash
cd ~/ai-law-firm
mkdir -p notary-department/{config,agents,templates/{translation_docx,price_quotes,chat_transcripts},scripts}
```

### 1.2 העתקת קבצי הקונפיגורציה
העתק את `notary_services.json` ו-`notary_pricing_2026.json` לתיקיית `config/`.

אלו הקבצים שהסוכן קורא מהם בכל אינטראקציה. כשמעדכנים מחירים (1 בינואר) — פשוט עורכים את ה-JSON ושומרים.

### 1.3 קובץ monday_config.json
```json
{
  "board_id": "18405886266",
  "board_url": "https://delawvery-team.monday.com/boards/18405886266",
  "workspace_id": "1830846",
  "columns": {
    "status": "color_mm1vcxzr",
    "service_type": "color_mm1vbk8y",
    "language": "color_mm1vc851",
    "phone": "phone_mm1vthye",
    "email": "email_mm1v554r",
    "notary_fee": "numeric_mm1vza1d",
    "translation_fee": "numeric_mm1vzx90",
    "total_price": "numeric_mm1vw4jg",
    "intake_date": "date_mm1v7c05",
    "expected_completion": "date_mm1vdfn3",
    "notary_person": "multiple_person_mm1vc6wg",
    "chat_transcript_link": "link_mm1v756d",
    "source_files": "file_mm1vm9b2",
    "output_files": "file_mm1v2e49",
    "languages_text": "text_mm1vh4e8",
    "delivery_method": "color_mm1vk3aa",
    "word_count": "numeric_mm1vwfe4",
    "urgency": "color_mm1vt8mc",
    "apostille_needed": "boolean_mm1vsf4d",
    "notes": "long_text_mm1vehrv"
  },
  "groups": {
    "new": "group_mm1v8nwp",
    "in_progress": "group_mm1v52f8",
    "pending_review": "group_mm1v87gh",
    "ready_for_delivery": "group_mm1vj63v",
    "completed": "group_mm1v8a79"
  }
}
```

## שלב 2 — Agent 1 (Communication)

### 2.1 System Prompt

Agent 1 צריך system prompt שכולל:
1. הזהות: "אתה העוזר הדיגיטלי של משרד עורכי דין בית-און, מחלקת נוטריון"
2. שפות: עברית, אנגלית, רוסית, ערבית — זהה אוטומטית ודבר בשפת הלקוח
3. קריאה מ-config: בתחילת כל שיחה, טען את `notary_services.json` ו-`notary_pricing_2026.json`
4. עץ החלטות לזיהוי שירות (ראה בהמשך)
5. חישוב מחיר אוטומטי
6. יצירת תיק ב-monday
7. עדכון סטטוס ושליחת סיכום

### 2.2 עץ ההחלטות (לשלב ב-system prompt)

```
שאלה 1: "מה השירות?" →
├─ תרגום מסמך → service=translation_approval
│   └─ שאלה: "מאיזו שפה לאיזו?" →
│       ├─ HE↔EN → type=translation_approval (נוטריון דובר)
│       └─ HE↔RU/AR/FR... → type=translator_declaration
├─ חתימה על מסמך → service=signature_authentication
│   └─ שאלה: "איזה מסמך?" →
│       ├─ ייפוי כוח → service=power_of_attorney
│       └─ מסמך כללי → service=signature_authentication
├─ העתק מאושר → service=certified_copy
├─ צוואה → service=notarial_will
├─ הסכם ממון → service=prenuptial_agreement
├─ תצהיר → service=affidavit
├─ אישור חיים → service=life_certificate
├─ ביטול ייפוי כוח → service=poa_cancellation
└─ לא בטוח → שאלות הבהרה

שאלה 2: "המסמך מיועד לחו״ל?" →
├─ כן → apostille=true (מוסיף לחבילה)
└─ לא → apostille=false
```

### 2.3 לוגיקת תמחור (לבנות כ-tool ב-Claude Code)

```python
import json

def calculate_price(service_id, word_count=0, copies=1, 
                    foreign_language=False, urgency="standard",
                    apostille=False, home_visit=False):
    """
    מחשב מחיר לפי התקנות. קורא מ-notary_pricing_2026.json.
    """
    with open("config/notary_pricing_2026.json") as f:
        pricing = json.load(f)
    
    total = 0
    breakdown = []
    
    # שכר נוטריוני (קבוע בתקנות)
    if service_id == "translation_approval":
        p = pricing["pricing"]["translation_approval"]["items"]
        if word_count <= 100:
            fee = p[0]["amount"]  # 251
        elif word_count <= 1000:
            fee = p[0]["amount"] + ((word_count - 100 + 99) // 100) * p[1]["amount"]
        else:
            fee = p[0]["amount"] + 9 * p[1]["amount"]
            fee += ((word_count - 1000 + 99) // 100) * p[2]["amount"]
        total += fee
        breakdown.append(f"שכר נוטריוני (אישור תרגום): {fee} ₪")
        
        # תוספת תרגום ע״י הנוטריון
        surcharge = fee * 0.5
        total += surcharge
        breakdown.append(f"תוספת תרגום ע״י נוטריון: {surcharge} ₪")
    
    # ... (pattern for each service - read from JSON)
    
    # תוספות
    if foreign_language:
        fl = pricing["pricing"]["foreign_language_surcharge"]["items"][0]["amount"]
        total += fl
        breakdown.append(f"תוספת שפה זרה: {fl} ₪")
    
    if home_visit:
        hv = pricing["pricing"]["out_of_office"]["items"][0]["amount"]
        total += hv
        breakdown.append(f"יציאה מהמשרד (שעה ראשונה): {hv} ₪")
    
    if apostille:
        ap = pricing["apostille_fee"]
        total += ap["court_fee"] + ap["handling_fee"]
        breakdown.append(f"אפוסטיל: {ap['court_fee'] + ap['handling_fee']} ₪")
    
    # שכר תרגום (חופשי)
    if service_id in ["translation_approval", "translator_declaration"]:
        tf = pricing["translation_fee"]
        translation_fee = max(word_count * tf["per_word_rate"], tf["minimum_fee"])
        if urgency == "urgent":
            translation_fee *= tf["urgent_multiplier"]
        elif urgency == "immediate":
            translation_fee *= tf["immediate_multiplier"]
        total += translation_fee
        breakdown.append(f"שכר תרגום: {translation_fee} ₪")
    
    # עותקים נוספים
    if copies > 1:
        copy_fee = (copies - 1) * 77  # generic; adjust per service
        total += copy_fee
        breakdown.append(f"עותקים נוספים ({copies-1}): {copy_fee} ₪")
    
    # מע״מ
    vat = total * pricing["_meta"]["vat_rate"]
    total_with_vat = total + vat
    
    return {
        "subtotal": round(total, 2),
        "vat": round(vat, 2),
        "total": round(total_with_vat, 2),
        "breakdown": breakdown
    }
```

## שלב 3 — Agent 2 (Expert Notary)

### 3.1 תהליך תרגום מרובה-AI

```
1. קבל מסמך מ-Agent 1
2. OCR אם צריך (pytesseract / Document AI)
3. ספור מילים → שלח ל-Agent 1 לתמחור
4. שלח לתרגום במקביל:
   a. Claude (Anthropic API) — model: claude-sonnet-4-20250514
   b. GPT-4 (OpenAI API)
   c. DeepL API
5. השווה תוצאות:
   - דיוק מונחים משפטיים
   - עקביות בין חלקי המסמך
   - תחביר ושטף
   - שמות פרטיים / תאריכים / מספרים
6. בחר/מזג את התרגום הטוב ביותר
7. הפק DOCX בפורמט נוטריוני
8. שמור בתיק ב-monday
9. עדכן סטטוס ל"ממתין לבדיקה"
```

### 3.2 הפקת DOCX

התרגום מופק כ-DOCX בפורמט נוטריוני:
- כותרת: "אישור נכונות תרגום" / "Certificate of Translation Accuracy"
- פרטי הנוטריון
- המסמך המקורי (או תיאורו)
- התרגום
- מקום לחתימה + חותמת
- מספר מילים ושכר שנגבה

להפקת DOCX, להשתמש ב-docx-js (npm install -g docx) עם הסקיל של docx.

## שלב 4 — חיבור WhatsApp

### אפשרויות:
1. **Twilio WhatsApp API** — הכי מוכר, תמיכה מלאה
2. **360dialog** — זול יותר, ישראלי
3. **WATI** — ממשק נוח, מבוסס 360dialog

### זרימה:
```
הודעה נכנסת בוואטסאפ
  → Webhook מקבל את ההודעה
  → שולח ל-Agent 1 (Claude API) עם context:
    - היסטוריית שיחה
    - תיק קיים (אם לקוח חוזר)
    - notary_services.json
    - notary_pricing_2026.json
  → Agent 1 מחזיר תשובה
  → שולח בוואטסאפ בחזרה ללקוח
  → מעדכן monday
```

## שלב 5 — עדכון תמחור

### תהליך עדכון שנתי (1 בינואר):
1. בדוק את אתר נבו (nevo.co.il) — גרסה עדכנית של התקנות
2. בדוק את קובץ התקנות ברשומות (rfa.justice.gov.il)
3. עדכן את `notary_pricing_2026.json` → שנה ל-`notary_pricing_2027.json`
4. עדכן `effective_date` ו-`next_update_date`
5. Agent 1 קורא אוטומטית את הקובץ העדכני

### טיפ: שמור את כל הגרסאות הישנות (pricing_2025.json, pricing_2026.json) — לתיעוד.

## monday.com — פרטי הבורד

- **Board ID**: 18405886266
- **Board URL**: https://delawvery-team.monday.com/boards/18405886266
- **Workspace**: Omer (ID: 1830846)
- **Column IDs**: ראה monday_config.json למעלה
- **Groups**: תיקים חדשים → בעבודה → ממתינים לבדיקה → מוכן למסירה → הושלם ונמסר

## סדר בנייה מומלץ ב-Claude Code

```
שלב א (יום 1-2):
  1. צור את מבנה הפרויקט
  2. העתק את קבצי ה-config
  3. בנה את pricing_calculator.py ובדוק שמחשב נכון

שלב ב (יום 3-5):
  4. בנה את Agent 1 system prompt
  5. בנה tool ליצירת תיק ב-monday (API)
  6. בנה tool לעדכון סטטוס
  7. בדוק שיחה מדומה מקצה לקצה

שלב ג (יום 6-8):
  8. בנה את Agent 2 system prompt
  9. בנה tool לתרגום מרובה-AI
  10. בנה tool להפקת DOCX
  11. בדוק תרגום מדומה

שלב ד (יום 9-12):
  12. חבר WhatsApp Business API
  13. בנה webhook handler
  14. בנה דף סטטוס ללקוח
  15. בדיקות אינטגרציה

שלב ה (יום 13-15):
  16. pilot עם לקוח אמיתי
  17. תיקונים
  18. הרצה
```

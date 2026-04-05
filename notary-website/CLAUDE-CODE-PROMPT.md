# פרומפט ל-Claude Code — הפעלת סוכן תקשורת (Agent 1) באתר

העתק והדבק את כל הטקסט הזה ל-Claude Code בתיקיית הפרויקט של notary.beiton.co.

---

## המשימה

הוסף לאתר notary.beiton.co סוכן תקשורת AI (Agent 1) — צ'אט חי שמדבר עם לקוחות ב-6 שפות, מזהה מה הם צריכים, מתמחר, ושומר לידים ל-Monday.com.

## מה לבנות — 3 קבצים

### קובץ 1: `lib/agent1-system-prompt.ts`

צור את הקובץ הזה עם export של שני דברים:
1. `AGENT1_SYSTEM_PROMPT` — string עם ה-system prompt המלא
2. `AGENT1_TOOLS` — מערך tool definitions

**ה-system prompt:**

```
אתה הנציג הדיגיטלי של משרד BEITON & Co — שירותי נוטריון מקצועיים.
שם המשרד: BEITON & Co
הסלוגן: BEYOND LAW
אתר: notary.beiton.co
מייל: office@beiton.co

## זיהוי שפה
זהה את שפת הפנייה הראשונה של הלקוח וענה באותה שפה לאורך כל השיחה.
שפות נתמכות: עברית, English, Русский, العربية, Français, Español.
אם הלקוח עובר שפה — עבור איתו.

## אישיות ותקשורת
- מקצועי, חם, ישיר — בלי ז'רגון מיותר
- תשובות קצרות וברורות. לא יותר מ-3-4 משפטים בתגובה רגילה
- אל תמציא מידע משפטי. אם לא בטוח — אמור שתבדוק ותחזור
- אל תשתמש באימוג'י
- פנה בגוף שני ללא הנחת מגדר (בעברית: "ניתן", "אפשר", "מוזמן/ת")

## שירותים — 5 פעולות נוטריוניות עיקריות
1. תרגום נוטריוני — תרגום מסמכים עם אישור נוטריוני
2. אימות חתימה — אימות זהות החותם ואישור חתימתו
3. אישור תוכן מסמך — אישור נוטריוני לנכונות תוכן (תצהיר, הצהרה, צוואה, הסכם ממון)
4. העתק מתאים למקור (נאמן למקור) — אישור שהעתק זהה למקור
5. אפוסטיל — חותמת בינלאומית לפי אמנת האג 1961

## מקרי שימוש נפוצים

### תרגום נוטריוני:
- תעודות אישיות (לידה, נישואין, גירושין, פטירה)
- מסמכים אקדמיים (תעודות, גיליונות ציונים, דיפלומות)
- מסמכים עסקיים (חוזים, תקנונים, דוחות כספיים)
- מסמכים רפואיים
- רישיונות ואישורים ממשלתיים
- מסמכי הגירה ואזרחות

### אימות חתימה:
- ייפוי כוח (כללי, מכירת נכס, ניהול חשבון בנק, ייצוג בהליך משפטי)
- ביטול ייפוי כוח
- הסכמה להוצאת קטין לחו"ל
- מסמכים בנקאיים ועסקיים

### אישור תוכן מסמך:
- תצהיר (רווקות, מגורים, החזקת ילדים, כל נושא)
- הצהרת מתרגם
- צוואה נוטריונית
- הסכם ממון (לפני/אחרי נישואין)
- אישור חיים (לגמלאים, פנסיה מחו"ל)

### העתק מתאים למקור:
- צילום דרכון
- תעודות אקדמיות
- רישיונות מקצועיים
- מסמכי חברה

### אפוסטיל:
- אפוסטיל בית משפט — על מסמכים נוטריוניים (41 ₪ למסמך, פטור ממע"מ)
- אפוסטיל משרד החוץ — על מסמכים ציבוריים (40 ₪ למסמך, פטור ממע"מ)
- אפוסטיל הוא שירות נלווה — לא פעולה נוטריונית בפני עצמה

## תמחור — תקנות הנוטריונים (שכר שירותים) תשל"ט-1978
כל המחירים לפני מע"מ (18%) אלא אם צוין אחרת.

### תרגום נוטריוני:
- עד 200 מילה (עמוד ראשון): 197 ₪
- כל 200 מילים נוספות: 138 ₪
- שפות מיוחדות (לא אירופאיות): תוספת 50%

### אימות חתימה:
- חתימה ראשונה: 197 ₪
- כל חתימה נוספת באותו מסמך: 138 ₪

### אישור תוכן מסמך:
- תצהיר / צוואה / הסכם ממון / אישור חיים / הצהרת מתרגם: 197 ₪

### העתק מתאים למקור:
- עמוד ראשון: 197 ₪
- כל עמוד נוסף: 138 ₪

### אפוסטיל:
- בית משפט: 41 ₪ (פטור ממע"מ)
- משרד החוץ: 40 ₪ (פטור ממע"מ)

### תוספות:
- שירות מחוץ לשעות (19:00-08:00 / שבת וחג): תוספת 50%
- שליח: 100 ₪ + מע"מ לכיוון
- אין "תוספת דחיפות" בתקנות

## אפשרויות קבלת שירות
1. במשרד — הלקוח מגיע פיזית
2. שליח — שליח אוסף/מוסר מסמכים
3. דיגיטלי — הלקוח שולח בוואטסאפ/מייל (לא לכל שירות)

שירותים שדורשים נוכחות: אימות חתימה, צוואה, הסכם ממון, תצהיר, אישור חיים.
שירותים דיגיטליים: תרגום נוטריוני, העתק מתאים למקור.

## תהליך שיחה
1. זהה מה הלקוח צריך
2. שאל שאלות ממוקדות (סוג מסמך, שפות, כמות)
3. תן הערכת מחיר (ציין: לפי תקנות הנוטריונים + מע"מ)
4. הצע אפשרויות קבלת שירות
5. כשהלקוח מעוניין — בקש: שם מלא, טלפון, מייל
6. כשיש פרטים — השתמש בכלי capture_lead

## כללים חשובים
- אל תבטיח זמני אספקה מדויקים — "בדרך כלל 1-3 ימי עסקים לתרגום"
- אל תתן ייעוץ משפטי — אתה נציג שירות
- אל תציע הנחות — המחיר קבוע בתקנות (עבירת משמעת)
- אם שואלים שאלה שלא קשורה לנוטריון — הפנה בנימוס

## הודעות פתיחה
- עברית: "שלום, איך אוכל לעזור? ניתן לשאול על תרגום, אימות חתימה, אפוסטיל או כל שירות נוטריוני אחר."
- English: "Hello, how can I help? Feel free to ask about translation, signature authentication, apostille, or any other notary service."
- Русский: "Здравствуйте, чем могу помочь? Спрашивайте о переводе, заверении подписи, апостиле или любой другой нотариальной услуге."
- العربية: "مرحبا، كيف يمكنني مساعدتك؟ يمكنك السؤال عن الترجمة أو توثيق التوقيع أو الأبوستيل أو أي خدمة توثيقية أخرى."
- Français: "Bonjour, comment puis-je vous aider? N'hésitez pas à poser vos questions sur nos services notariés."
- Español: "Hola, ¿cómo puedo ayudarle? Pregunte sobre traducción, autenticación o cualquier servicio notarial."
```

**Tool definition — `capture_lead`:**
```json
{
  "name": "capture_lead",
  "description": "שמור פרטי לקוח מעוניין. השתמש כשהלקוח מביע עניין ומוסר פרטים.",
  "input_schema": {
    "type": "object",
    "properties": {
      "name": { "type": "string", "description": "שם הלקוח" },
      "phone": { "type": "string", "description": "מספר טלפון" },
      "email": { "type": "string", "description": "כתובת מייל" },
      "service": { "type": "string", "description": "סוג השירות המבוקש" },
      "language": { "type": "string", "description": "שפת השיחה (he/en/ru/ar/fr/es)" },
      "details": { "type": "string", "description": "פרטים נוספים" }
    },
    "required": ["name", "service", "language"]
  }
}
```

---

### קובץ 2: `app/api/chat/route.ts`

API route שעושה:
1. מקבל POST עם `{ messages, language }`
2. שולח ל-Anthropic API (`https://api.anthropic.com/v1/messages`) עם model `claude-sonnet-4-20250514`, ה-system prompt, וה-tools
3. אם Claude מחזיר `tool_use` עם `capture_lead` — יוצר שורה ב-Monday.com
4. מחזיר את תגובת הטקסט כ-JSON

**Monday.com integration — column IDs אמיתיים:**

```
Board ID: 18406004253
Group ID: "group_mm1wxy0k" (שיחות פעילות)

Column mapping:
- phone_mm1y71kv → טלפון הלקוח (type: phone, format: { "phone": "0501234567", "countryShortName": "IL" })
- email_mm1y3e3 → מייל הלקוח (type: email, format: { "email": "x@y.com", "text": "x@y.com" })
- color_mm1wcc5y → שלב בפאנל: { "label": "פנייה ראשונית" }
- color_mm1wgvgc → שפה: { "label": "עברית" / "English" / "Русский" / "العربية" / "Français" / "Español" }
- color_mm1wjcxx → שירות מבוקש: { "label": "תרגום נוטריוני" / "אימות חתימה" / "העתק נאמן למקור" / "ייפוי כוח" / "צוואה" / "הסכם ממון" / "אפוסטיל" / "תצהיר" / "אישור חיים" / "לא זוהה" }
- color_mm1wj0mz → ערוץ: { "label": "אתר" }
- date_mm1w6eek → תאריך פנייה: { "date": "YYYY-MM-DD" }
- numeric_mm1wtzxs → מספר הודעות: "1"
- long_text_mm1wcw3e → ניתוח הסוכן (פרטי הבקשה): { "text": "..." }
```

**Monday API call:**
```
POST https://api.monday.com/v2
Header: Authorization: MONDAY_API_TOKEN (from env)
Header: Content-Type: application/json
Body: { "query": "mutation { create_item(board_id: 18406004253, group_id: \"group_mm1wxy0k\", item_name: \"...\", column_values: \"...\") { id } }" }
```

**Environment variables needed:**
- `ANTHROPIC_API_KEY` — מ-console.anthropic.com
- `MONDAY_API_TOKEN` — מ-monday.com → Administration → API

**Handle tool loop:** אם `stop_reason === "tool_use"`, הרץ את הכלי, שלח `tool_result` בחזרה ל-API, וחזור עד שמקבלים `stop_reason === "end_turn"`.

---

### קובץ 3: `components/ChatWidget.tsx`

קומפוננטת React client-side ("use client") שמציגה את הצ'אט.

**Props:** `{ lang?: "he" | "en" | "ru" | "ar" | "fr" | "es" }` (default: "he")

**מה הקומפוננטה עושה:**
- מציגה חלון צ'אט עם הודעת פתיחה בשפת הממשק
- שדה קלט + כפתור שליחה
- שולחת POST ל-`/api/chat` עם כל היסטוריית ההודעות
- מציגה תגובות ב-bubbles (משתמש = שחור, סוכן = אפור בהיר)
- אנימציית "מקליד..." בזמן המתנה
- RTL/LTR אוטומטי לפי השפה (he/ar = RTL, שאר = LTR)
- מתאפסת כשמשנים שפה

**עיצוב — BEITON brand:**
- רקע: #ffffff, גבול: 1px solid #e8e6e1, border-radius: 12px
- בועות משתמש: רקע #1a1a1a, טקסט לבן
- בועות סוכן: רקע #f5f4f1, טקסט #1a1a1a
- פונט: DM Sans, Noto Sans Hebrew, Noto Sans Arabic
- כפתור שליחה: רקע #1a1a1a, טקסט לבן, border-radius: 8px
- גובה אזור הודעות: 280px עם scroll
- max-width: 600px, margin: 0 auto

**Placeholder לכל שפה:**
- he: "מה אתה צריך? תרגום, אימות חתימה, אפוסטיל..."
- en: "What do you need? Translation, authentication, apostille..."
- ru: "Что вам нужно? Перевод, заверение, апостиль..."
- ar: "ما الذي تحتاجه؟ ترجمة، توثيق، أبوستيل..."
- fr: "De quoi avez-vous besoin? Traduction, authentification, apostille..."
- es: "¿Qué necesita? Traducción, autenticación, apostilla..."

---

## שילוב בעמוד הבית

מצא את הקומפוננטה הראשית של עמוד הבית (כנראה `app/page.tsx` או קומפוננטה שהוא מייבא).
מצא את ה-Hero section — שם צריך לשבת הצ'אט.
הוסף:

```tsx
import ChatWidget from "@/components/ChatWidget";
// ...
<ChatWidget lang={currentLanguage} />
```

כאשר `currentLanguage` הוא ה-state של השפה הנבחרת באתר.

אם אין state של שפה — צור אחד עם default "he".

---

## קובץ `.env.local`

צור אם לא קיים:

```
ANTHROPIC_API_KEY=sk-ant-PLACEHOLDER
MONDAY_API_TOKEN=eyJ-PLACEHOLDER
```

(עומר ימלא את הערכים האמיתיים)

---

## אחרי שסיימת

1. ודא שאין שגיאות TypeScript: `npx tsc --noEmit`
2. ודא שהאתר עולה: `npm run dev`
3. עשה commit: `git add . && git commit -m "feat: add Agent 1 chat — Anthropic API + Monday.com integration"`
4. דווח מה נעשה ואם יש בעיות

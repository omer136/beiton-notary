<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:seo-agent -->
# סוכן SEO | BEITON & Co Notary
## notary.beiton.co | BEYOND LAW

סוכן SEO אוטונומי. כשמבקשים משימה — בצע עד הסוף, עדכן Monday, דווח.

---

## פקודות

| פקודה | מה לעשות |
|--------|----------|
| `כתוב מאמר [מספר]` | קרא בורד → כתוב MDX → שמור בפרויקט → עדכן Monday |
| `כתוב מאמרים [X-Y]` | כתוב כמה מאמרים ברצף |
| `עדכן מאמר [שם]` | מצא קובץ → ערוך → עדכן Monday |
| `ניתוח שבועי` | קרא בורד → זהה מאמרים לשיפור → דווח המלצות |
| `בדוק מתחרים` | סרוק אתרי מתחרים → דווח שינויים |
| `סטטוס` | הצג כמה מאמרים בכל שלב, מה הבא בתור |
| `הוסף מאמר [כותרת] [מילת מפתח]` | צור פריט חדש בבורד |
| `עדכן GSC` + נתונים | עדכן חשיפות/קליקים/CTR/מיקום בבורד |

---

## Monday.com

**Board ID:** 18406184070
**Workspace:** Omer (ID: 1830846)

### עמודות:
```
name                  → כותרת H1 של המאמר
text_mm1xwv3x         → מילת מפתח ראשית
long_text_mm1x6p2b    → מילות מפתח משניות
color_mm1x29xv        → סטטוס
                         Working on it = טיוטה
                         Done = פורסם
                         Stuck = צריך עדכון
color_mm1xpjba        → סוג תוכן
color_mm1x5y7c        → עדיפות
                         Stuck = גבוהה (אדום)
                         Working on it = בינונית (כתום)
                         Done = נמוכה (ירוק)
date_mm1xmg5z         → תאריך פרסום
numeric_mm1x3g7w      → שבוע פרסום
numeric_mm1xgfeh      → חשיפות GSC
numeric_mm1x8amb      → קליקים GSC
numeric_mm1x6gj       → CTR (אחוז)
numeric_mm1x1h7n      → מיקום ממוצע GSC
long_text_mm1xqg4r    → הערות
link_mm1xjyv1         → URL של המאמר באתר
```

### קבוצות:
```
group_mm1xgsnf → 🔴 עדיפות גבוהה — שבועות 1-8
group_mm1xgtf6 → 🟠 עדיפות בינונית — שבועות 9-18
group_mm1x2mvj → 🔵 עדיפות נמוכה — שבועות 19-30
```

---

## איפה לשמור מאמרים

```
content/blog/[slug].mdx              ← עברית
content/blog/en/[slug].mdx           ← אנגלית
components/schemas/ArticleSchema.tsx
components/schemas/FAQSchema.tsx
components/schemas/LocalBusinessSchema.tsx
components/schemas/BreadcrumbSchema.tsx
```

---

## תבנית מאמר MDX

```mdx
---
title: "[כותרת H1 — כוללת מילת מפתח ראשית]"
description: "[150-155 תווים, מילת מפתח + CTA]"
keywords: ["ראשית", "משנית 1", "משנית 2"]
date: "YYYY-MM-DD"
author: "BEITON & Co"
slug: "english-slug"
lang: "he"
---

# {frontmatter.title}

[פתיחה — 2-3 משפטים. מילת מפתח ראשית. מה הקורא ילמד.]

## [H2 עם מילת מפתח משנית]

[150-300 מילים. מידע מדויק.]

## [H2 נוסף]

[150-300 מילים.]

## שאלות נפוצות

**שאלה: [שאלה שמחפשים בגוגל]?**
תשובה: [2-3 משפטים]

**שאלה: [...]?**
תשובה: [...]

**שאלה: [...]?**
תשובה: [...]

## איך BEITON & Co עוזרים?

[יתרונות: שפות רבות, הזמנה אונליין, מחשבון מחירים, זמינות, דיגיטלי]

**[צרו קשר דרך notary.beiton.co](https://notary.beiton.co/contact)**
```

### כללי כתיבה:
- 800-1500 מילים
- מילת מפתח ראשית: ב-H1, פסקה ראשונה, 2-3 H2, פסקה אחרונה
- שפה מקצועית אך נגישה
- מידע מדויק — חוק הנוטריונים תשל"ו-1976
- מחירים רק מהמחירון למטה + "לפני מע"מ (18%)"
- מינימום 3 שאלות FAQ
- 2-3 קישורים פנימיים למאמרים אחרים
- CTA בסוף כל מאמר
- פסקאות קצרות (מובייל)

### סוגי תוכן:
- **מדריך** → צעד-אחר-צעד, מחירים, מסמכים נדרשים
- **שאלה-תשובה** → תשובה ישירה בפסקה ראשונה, הרחבה אח"כ
- **SEO מקומי** → שירות באזור, כתובת, נגישות
- **השוואה** → טבלה, יתרונות/חסרונות, מסקנה
- **אנגלית** → קהל אנגלופוני בישראל

---

## Schema Markup

### ArticleSchema (לכל מאמר)
```tsx
export function ArticleSchema({ title, description, slug, date, dateModified }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      author: { "@type": "Organization", name: "BEITON & Co", url: "https://notary.beiton.co" },
      publisher: { "@type": "Organization", name: "BEITON & Co",
        logo: { "@type": "ImageObject", url: "https://notary.beiton.co/logo.png" } },
      datePublished: date,
      dateModified: dateModified || date,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://notary.beiton.co/blog/${slug}` }
    })}} />
  );
}
```

### FAQSchema
```tsx
export function FAQSchema({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions.map(({ q, a }) => ({
        "@type": "Question", name: q,
        acceptedAnswer: { "@type": "Answer", text: a }
      }))
    })}} />
  );
}
```

### LocalBusinessSchema
```tsx
export function LocalBusinessSchema() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LegalService",
      name: "BEITON & Co — שירותי נוטריון",
      url: "https://notary.beiton.co",
      areaServed: { "@type": "Country", name: "Israel" },
      priceRange: "$$",
      hasOfferCatalog: {
        "@type": "OfferCatalog", name: "שירותי נוטריון",
        itemListElement: [
          "אימות חתימה","ייפוי כוח נוטריוני","תרגום נוטריוני",
          "אפוסטיל","צוואה נוטריונית","תצהיר נוטריוני",
          "הסכם ממון","אישור העתק","אישור חיים",
          "רשימת מצאי","מסמך סחיר","נוטריון אונליין"
        ].map(name => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }))
      }
    })}} />
  );
}
```

### BreadcrumbSchema
```tsx
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem", position: i + 1, name: item.name, item: item.url
      }))
    })}} />
  );
}
```

---

## מחירון נוטריון 2026

**תמיד ציין: "לפני מע"מ (18%). תעריפים אחידים ע"י משרד המשפטים."**

| שירות | ₪ |
|--------|-----|
| אימות חתימה — חותם ראשון | 197 |
| אימות חתימה — חותם נוסף | 77 |
| ייפוי כוח — חותם ראשון | 197 |
| ייפוי כוח — עותק נוסף | 77 |
| תרגום — עד 100 מילים | 251 |
| תרגום — כל 100 מילים נוספות (עד 1000) | 197 |
| תרגום — כל 100 מילים מעל 1000 | 99 |
| אישור העתק — עמוד ראשון | 77 |
| אישור העתק — עמוד נוסף | 13 |
| הסכם ממון | 446 |
| הסכם ממון — עותק נוסף | 74 |
| צוואה — חותם ראשון | 293 |
| צוואה — חותם נוסף | 147 |
| צוואה — אישור נוסף | 101 |
| אישור חיים | 197 |
| תצהיר — חותם ראשון | 200 |
| תצהיר — אישור נוסף | 80 |
| אפוסטיל | 35 |
| העדה מסמך סחיר — שעה ראשונה | 743 |
| העדה — חצי שעה נוספת | 228 |

---

## מתחרים

| אתר | SEO | חולשות |
|------|-----|--------|
| notary-israel.com (רחל שחר) | 9/10 | אין מחשבון, אין צ'אט, עיצוב ישן |
| best-notary.co.il (ניר טולדנו) | 7/10 | ממוקד פ"ת, אין אנגלית |
| israelnotary.co.il (משה אלפסי) | 4/10 | מעט תוכן, בלוג לא פעיל |
| notary-online.co.il | 3/10 | תוכן דליל |
| notaryil.co.il | 2/10 | אין בלוג, אין Schema |
| notaryon-online.com (אירנה פיין) | 2/10 | אתר ישן |
| onlinenotary.co.il (יהודה אלרם) | 2/10 | מעט תוכן |
| digital-notary.co.il | 1/10 | תוכן מינימלי |

---

## לופ למידה — כל יום ראשון

1. **אסוף** — בקש מהמפקח נתוני GSC
2. **נתח** — חשיפות גבוהות + CTR נמוך = שפר כותרת. מיקום 5-20 = שפר תוכן
3. **עדכן בורד** — חשיפות, קליקים, CTR, מיקום
4. **דווח** — ממצאים + המלצות
5. **בצע** — אחרי אישור המפקח

### יעדים:
| מדד | חודש 1 | חודש 3 | חודש 6 |
|------|--------|--------|--------|
| חשיפות/שבוע/מאמר | 50+ | 200+ | 500+ |
| CTR | 2%+ | 3%+ | 4%+ |
| מיקום ממוצע | <20 | <10 | <5 |

---

## יתרונות BEITON (להדגיש בכל תוכן)

1. שפות — עברית, אנגלית, ערבית
2. מחשבון מחירים אינטראקטיבי
3. הזמנת תור אונליין
4. תהליך דיגיטלי — העלאת מסמכים מראש
5. זמינות גבוהה
6. AI chatbot

---

## כללי ברזל

1. לא להמציא מידע משפטי
2. מחירים רק מהטבלה למעלה
3. ערך אמיתי, לא ספאם
4. עדכן Monday אחרי כל פעולה
5. 2-3 קישורים פנימיים בכל מאמר
6. Schema בכל עמוד
7. CTA בכל מאמר
8. מיקום 1-3 + CTR גבוה = אל תשנה
9. סיים בדיווח קצר למפקח

---

## חוקים משפטיים

- חוק הנוטריונים, תשל"ו-1976
- תקנות הנוטריונים (שכר שירותים), תשל"ט-1978
- נוטריון = עו"ד + 10 שנות ותק + הסמכה
- אישור נוטריון = ראיה מספקת ללא ראיה נוספת (ס' 19)
- אסור לסטות מהתעריף (עבירת משמעת)
- אמנת האג 1961 = בסיס לאפוסטיל
<!-- END:seo-agent -->

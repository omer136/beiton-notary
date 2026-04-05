# קוד משימה: הטמעת אנליטיקות — notary.beiton.co
## Claude Task Code — Analytics Implementation & Monday.com Tracking

---

## הקשר פרויקט

אתר נוטריון ב-Next.js (App Router) על הדומיין `notary.beiton.co`.
מבנה האתר: דף בית עם צ'אט AI, 12 עמודי שירות, מחשבון מחירים אינטראקטיבי, עמוד מעקב הזמנה, בלוג, ו-6 שפות (HE/EN/RU/AR/FR/ES).

---

## בורד monday.com — מפת מעקב

**Board ID:** `18406184083`
**Workspace:** Omer (ID: 1830846)

### מבנה טורים (Column IDs)

| טור | Column ID | סוג | ערכים |
|------|-----------|------|--------|
| שם | `name` | name | — |
| סטטוס | `color_mm1xx4m1` | status | `לא התחיל`, `בתכנון`, `בהטמעה`, `בבדיקה`, `הושלם`, `תקוע` |
| קטגוריה | `color_mm1xf870` | status | `GTM`, `GA4`, `Meta Pixel`, `קוד Next.js`, `Consent`, `בדיקות` |
| עדיפות | `color_mm1xsp02` | status | `קריטי`, `גבוה`, `בינוני`, `נמוך` |
| תאריך יעד | `date_mm1xv227` | date | פורמט: `{"date":"YYYY-MM-DD"}` |
| תאריך השלמה | `date_mm1xa72v` | date | פורמט: `{"date":"YYYY-MM-DD"}` |
| נבדק ומאומת | `boolean_mm1xhb57` | checkbox | `{"checked":true}` |
| הערות | `text_mm1xbmm5` | text | טקסט חופשי |

### קבוצות (Groups)

| קבוצה | Group ID |
|--------|----------|
| 🏷️ GTM — Container, Tags, Triggers, Variables | `group_mm1xk0kr` |
| 📊 GA4 — Property, Events, Conversions, Audiences | `group_mm1x1qwj` |
| 📘 Meta Pixel — Events & Custom Conversions | `group_mm1x3aky` |
| 💻 Next.js — קוד טכני, Data Layer, Server-Side | `group_mm1xhcdr` |
| 🔒 Consent Mode & Privacy | `group_mm1x24cw` |
| ✅ בדיקות QA & אימות | `group_mm1xm5m6` |

---

## פקודת עדכון סטטוס — תבנית

בכל פעם שמשימה מתחילה, בהטמעה, הושלמה, או תקועה — עדכן את הבורד:

```
monday.com:change_item_column_values
boardId: 18406184083
itemId: {ITEM_ID}
columnValues: {"color_mm1xx4m1":{"label":"{סטטוס}"},"text_mm1xbmm5":"{הערות}"}
```

לסימון השלמה עם תאריך:
```
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"הושלם — {פירוט}"}
```

---

## רשימת כל המשימות — סדר ביצוע

---

### 🔴 שלב 1: הגדרות בסיס (קריטי — יום 1)

---

#### משימה 1.1: הגדרת GTM Container חדש
- **Item ID:** `11621757686`
- **עדיפות:** קריטי
- **מה לעשות:**
  1. כנס ל-tagmanager.google.com
  2. צור Container חדש → שם: `Notary Beiton` → דומיין: `notary.beiton.co`
  3. בחר Web platform
  4. שמור את ה-Container ID (GTM-XXXXXXX)
  5. הפעל Built-in Variables: Page URL, Page Path, Page Hostname, Click Classes, Click ID, Click URL, Click Text, Scroll Depth Threshold, Scroll Direction
- **עדכון בורד:**
```
itemId: 11621757686
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Container ID: GTM-XXXXXXX — נוצר בהצלחה"}
```

---

#### משימה 1.2: הגדרת GA4 Property + Data Stream
- **Item ID:** `11621755346`
- **עדיפות:** קריטי
- **מה לעשות:**
  1. כנס ל-analytics.google.com → Admin → Create Property
  2. Property Name: `Notary Beiton`
  3. Time Zone: `Asia/Jerusalem` → Currency: `ILS`
  4. Data Stream → Web → URL: `https://notary.beiton.co`
  5. שמור את ה-Measurement ID (G-XXXXXXXXX)
  6. Enhanced Measurement: הפעל Scrolls, Outbound Clicks, Site Search, File Downloads
- **עדכון בורד:**
```
itemId: 11621755346
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Measurement ID: G-XXXXXXXXX — Property נוצר"}
```

---

#### משימה 1.3: יצירת Meta Pixel + Events Manager
- **Item ID:** `11621755370`
- **עדיפות:** קריטי
- **מה לעשות:**
  1. כנס ל-Meta Events Manager → Connect Data Sources → Web → Meta Pixel
  2. שם: `Notary Beiton`
  3. שמור את ה-Pixel ID
  4. אימות דומיין notary.beiton.co ב-Meta Business Settings
- **עדכון בורד:**
```
itemId: 11621755370
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Pixel ID: XXXXXXXXXX — נוצר ב-Events Manager"}
```

---

### 🟠 שלב 2: הטמעת קוד Next.js (ימים 2-3)

---

#### משימה 2.1: הטמעת GTM Snippet בלייאאוט הראשי
- **Item ID:** `11621777944`
- **עדיפות:** קריטי
- **קובץ:** `app/layout.tsx`
- **קוד:**

```tsx
// app/layout.tsx
import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID!; // GTM-XXXXXXX

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {/* Consent Mode V2 defaults — חייב להיות לפני GTM */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });`}
        </Script>
        {/* GTM Head Script */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <RouteChangeTracker />
        {children}
      </body>
    </html>
  );
}
```

- **Environment Variable להוסיף ל-.env.local:**
```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```
- **עדכון בורד:**
```
itemId: 11621777944
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"GTM snippet הוטמע ב-layout.tsx עם Consent Mode defaults"}
```

---

#### משימה 2.2: יצירת קובץ analytics.ts — Data Layer Helper
- **Item ID:** `11621777859`
- **עדיפות:** קריטי
- **קובץ:** `lib/analytics.ts`
- **קוד:**

```typescript
// lib/analytics.ts

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    fbq: (...args: any[]) => void;
  }
}

// ═══ Core Push Function ═══
export function pushEvent(event: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// ═══ Chat Events ═══
export function trackChatOpen(page: string, language: string) {
  pushEvent('chat_opened', { page_path: page, language });
}

export function trackChatLead(serviceType: string, language: string) {
  pushEvent('chat_lead', {
    service_type: serviceType,
    language,
    contact_method: 'chat'
  });
}

// ═══ Calculator Events ═══
export function trackCalculatorUsed(value: number, serviceType: string) {
  pushEvent('calculator_used', {
    calculator_value: value,
    service_type: serviceType,
    currency: 'ILS'
  });
}

// ═══ Form Events ═══
export function trackFormSubmit(formType: string, serviceType?: string) {
  pushEvent('form_submit', {
    form_type: formType,
    service_type: serviceType || 'general'
  });
}

// ═══ Contact Events ═══
export function trackPhoneClick() {
  pushEvent('phone_click', { contact_method: 'phone' });
}

export function trackContactClick(method: string) {
  pushEvent('contact_click', { contact_method: method });
}

// ═══ Language Events ═══
export function trackLanguageChange(from: string, to: string) {
  pushEvent('language_changed', {
    from_language: from,
    to_language: to,
    language: to
  });
}

// ═══ Service Page Events ═══
export function trackServicePageView(serviceType: string, language: string) {
  pushEvent('service_page_viewed', {
    service_type: serviceType,
    language,
    page_type: 'service'
  });
}

// ═══ Order Tracking Events ═══
export function trackOrderTracking(orderId: string) {
  pushEvent('order_tracking_view', {
    order_id: orderId,
    page_type: 'tracking'
  });
}

// ═══ Consent Mode Update ═══
export function updateConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
}
```

- **עדכון בורד:**
```
itemId: 11621777859
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"analytics.ts נוצר — 10 פונקציות: pushEvent, trackChatOpen, trackChatLead, trackCalculatorUsed, trackFormSubmit, trackPhoneClick, trackContactClick, trackLanguageChange, trackServicePageView, trackOrderTracking, updateConsent"}
```

---

#### משימה 2.3: Route Change Tracking (SPA Navigation)
- **Item IDs:** `11621767875`, `11621776468` (כפילות — עדכן שניהם)
- **עדיפות:** גבוה
- **קובץ:** `components/RouteChangeTracker.tsx`
- **קוד:**

```tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function RouteChangeTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_title: document.title,
      page_search: searchParams.toString(),
    });
  }, [pathname, searchParams]);

  return null;
}

export default function RouteChangeTracker() {
  return (
    <Suspense fallback={null}>
      <RouteChangeTrackerInner />
    </Suspense>
  );
}
```

- **עדכון בורד (שני הפריטים):**
```
itemId: 11621767875
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"RouteChangeTracker.tsx נוצר — שולח page_view בכל מעבר route"}

itemId: 11621776468
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621767875"}
```

---

#### משימה 2.4: Data Layer Pushes בכל הקומפוננטות
- **Item ID:** `11621776106`
- **עדיפות:** גבוה
- **מה לעשות:** להוסיף import ו-function calls בכל קומפוננטה:

**ChatWidget.tsx:**
```tsx
import { trackChatOpen, trackChatLead } from '@/lib/analytics';

// בפתיחת הצ'אט:
trackChatOpen(window.location.pathname, currentLocale);

// כשהמשתמש שולח פרטי קשר:
trackChatLead(selectedService, currentLocale);
```

**PriceCalculator.tsx:**
```tsx
import { trackCalculatorUsed } from '@/lib/analytics';

// בלחיצת חישוב:
trackCalculatorUsed(calculatedPrice, selectedService);
```

**ContactForm.tsx:**
```tsx
import { trackFormSubmit } from '@/lib/analytics';

// בשליחת הטופס:
trackFormSubmit('contact', selectedService);
```

**LanguageSwitcher.tsx:**
```tsx
import { trackLanguageChange } from '@/lib/analytics';

// בהחלפת שפה:
trackLanguageChange(currentLocale, newLocale);
```

**ServicePage (כל 12 עמודי שירות):**
```tsx
import { trackServicePageView } from '@/lib/analytics';

// ב-useEffect עם [] deps:
useEffect(() => {
  trackServicePageView(serviceSlug, locale);
}, []);
```

**OrderTracking.tsx:**
```tsx
import { trackOrderTracking } from '@/lib/analytics';

// בטעינת העמוד:
useEffect(() => {
  if (orderId) trackOrderTracking(orderId);
}, [orderId]);
```

**כל קישור טלפון:**
```tsx
import { trackPhoneClick } from '@/lib/analytics';

<a href="tel:+972-XX-XXXXXXX" onClick={() => trackPhoneClick()}>
```

- **עדכון בורד:**
```
itemId: 11621776106
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Data Layer pushes הוטמעו ב-6 קומפוננטות: ChatWidget, PriceCalculator, ContactForm, LanguageSwitcher, ServicePages (12), OrderTracking"}
```

---

### 🟡 שלב 3: הגדרת Tags ו-Triggers ב-GTM (ימים 4-5)

---

#### משימה 3.1: GA4 Configuration Tag
- **Item ID:** `11621743576`
- **מה לעשות ב-GTM:**
  1. New Tag → Google Tag → Tag ID: `G-XXXXXXXXX`
  2. Trigger: All Pages
  3. Consent Settings: Require `analytics_storage`
- **עדכון בורד:**
```
itemId: 11621743576
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"GA4 Configuration Tag הוגדר — Measurement ID מוטמע, Consent Required"}
```

---

#### משימה 3.2: Meta Pixel Base Tag
- **Item ID:** `11621751611`
- **מה לעשות ב-GTM:**
  1. New Tag → Custom HTML
  2. קוד:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID_HERE');
  fbq('track', 'PageView');
</script>
```
  3. Trigger: All Pages
  4. Consent Settings: Require `ad_storage`
- **עדכון בורד:**
```
itemId: 11621751611
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Meta Pixel Base Code הוטמע כ-Custom HTML Tag, Pixel ID: XXXXXXXXXX"}
```

---

#### משימה 3.3: Google Ads Conversion Tracking
- **Item ID:** `11621765822`
- **מה לעשות:**
  1. New Tag → Google Ads Conversion Tracking
  2. Conversion ID + Conversion Label (מ-Google Ads)
  3. Trigger: CE — form_submit OR CE — chat_lead
- **עדכון בורד:**
```
itemId: 11621765822
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Google Ads Conversion Tag מוגדר — Fires on form_submit + chat_lead"}
```

---

#### משימה 3.4: GA4 Custom Event Tags (7 אירועים)
- **Item ID:** `11621755287`
- **מה לעשות ב-GTM — ליצור 7 Tags מסוג GA4 Event:**

| Tag Name | Event Name | Parameters | Trigger |
|----------|-----------|------------|---------|
| GA4 — chat_opened | chat_opened | page_path, language | CE — chat_opened |
| GA4 — chat_lead | chat_lead | service_type, language, contact_method | CE — chat_lead |
| GA4 — calculator_used | calculator_used | calculator_value, service_type, currency | CE — calculator_used |
| GA4 — contact_click | contact_click | contact_method | Click — Contact Button |
| GA4 — phone_click | phone_click | contact_method | Click — Phone Link |
| GA4 — form_submit | form_submit | form_type, service_type | CE — form_submit |
| GA4 — language_changed | language_changed | from_language, to_language, language | CE — language_changed |
| GA4 — service_page_viewed | service_page_viewed | service_type, language, page_type | CE — service_page_viewed |
| GA4 — order_tracking_view | order_tracking_view | order_id, page_type | CE — order_tracking_view |
| GA4 — scroll_depth | scroll_depth | depth | Scroll 50% / 100% |
| GA4 — time_on_page | time_on_page | seconds | Timer 30s/60s/120s |

- **עדכון בורד:**
```
itemId: 11621755287
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"11 GA4 Event Tags נוצרו ב-GTM — כולם פועלים"}
```

---

#### משימה 3.5: Meta Pixel Custom Event Tags (7 אירועים)
- **Item ID:** `11621775928`
- **מה לעשות — ליצור 7 Custom HTML Tags ב-GTM:**

| Tag Name | Code | Trigger |
|----------|------|---------|
| Meta — Lead | `fbq('track','Lead',{content_name:{{DL-service_type}},content_category:'notary'})` | CE — form_submit / chat_lead |
| Meta — Contact | `fbq('track','Contact',{content_name:{{DL-contact_method}}})` | Click — Phone / Email |
| Meta — ViewContent | `fbq('track','ViewContent',{content_name:{{DL-service_type}}})` | CE — service_page_viewed |
| Meta — CalculatorUsed | `fbq('trackCustom','CalculatorUsed',{value:{{DL-calculator_value}},currency:'ILS',service:{{DL-service_type}}})` | CE — calculator_used |
| Meta — ChatOpened | `fbq('trackCustom','ChatOpened',{page:{{Page Path}},language:{{DL-language}}})` | CE — chat_opened |
| Meta — LanguageChanged | `fbq('trackCustom','LanguageChanged',{from_language:{{DL-from_language}},to_language:{{DL-language}}})` | CE — language_changed |
| Meta — ServicePageViewed | `fbq('trackCustom','ServicePageViewed',{service:{{DL-service_type}},language:{{DL-language}}})` | CE — service_page_viewed |

- **עדכון בורד:**
```
itemId: 11621775928
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"7 Meta Pixel Event Tags נוצרו — 3 Standard + 4 Custom"}
```

---

#### משימה 3.6: הגדרת כל ה-Triggers
- **Item ID:** `11621775930`
- **רשימת Triggers ליצירה:**

| Trigger Name | Type | Condition |
|-------------|------|-----------|
| All Pages | Page View | All Pages |
| CE — chat_opened | Custom Event | Event Name equals `chat_opened` |
| CE — chat_lead | Custom Event | Event Name equals `chat_lead` |
| CE — calculator_used | Custom Event | Event Name equals `calculator_used` |
| CE — form_submit | Custom Event | Event Name equals `form_submit` |
| CE — language_changed | Custom Event | Event Name equals `language_changed` |
| CE — service_page_viewed | Custom Event | Event Name equals `service_page_viewed` |
| CE — order_tracking_view | Custom Event | Event Name equals `order_tracking_view` |
| Click — Phone Link | Click (Just Links) | Click URL contains `tel:` |
| Click — Contact Button | Click (All Elements) | Click Classes contains `contact-btn` OR Click ID equals `contact-cta` |
| Scroll 50% | Scroll Depth | Vertical, 50% |
| Scroll 100% | Scroll Depth | Vertical, 100% |
| Timer 30s | Timer | Interval: 30000, Limit: 1 |
| Timer 60s | Timer | Interval: 60000, Limit: 1 |
| Timer 120s | Timer | Interval: 120000, Limit: 1 |

- **עדכון בורד:**
```
itemId: 11621775930
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"15 Triggers נוצרו — 1 Page View, 7 Custom Events, 2 Clicks, 2 Scroll, 3 Timer"}
```

---

#### משימה 3.7: Data Layer + Built-in Variables
- **Item ID:** `11621755326`
- **Data Layer Variables ליצירה:**

| Variable Name | Data Layer Variable Name |
|--------------|------------------------|
| DL — event_name | event_name |
| DL — service_type | service_type |
| DL — language | language |
| DL — from_language | from_language |
| DL — calculator_value | calculator_value |
| DL — contact_method | contact_method |
| DL — form_type | form_type |
| DL — page_type | page_type |
| DL — order_id | order_id |

- **Built-in Variables להפעיל:** Page URL, Page Path, Page Hostname, Click Classes, Click ID, Click URL, Click Text, Scroll Depth Threshold, Scroll Direction
- **עדכון בורד:**
```
itemId: 11621755326
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"9 Data Layer Variables + 9 Built-in Variables מוגדרים"}
```

---

### 🟢 שלב 4: הגדרות GA4 (ימים 6-7)

---

#### משימה 4.1: Meta Standard Events
- **Item ID:** `11621777936`
- **עדכון בורד בסיום:**
```
itemId: 11621777936
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"4 Standard Events מוגדרים: PageView (auto), Lead, Contact, ViewContent"}
```

---

#### משימה 4.2: Meta Custom Events
- **Item ID:** `11621755473`
- **עדכון בורד:**
```
itemId: 11621755473
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"4 Custom Events מוגדרים: CalculatorUsed, ChatOpened, LanguageChanged, ServicePageViewed"}
```

---

#### משימה 4.3: GA4 Conversions (Key Events)
- **Item ID:** `11621775981`
- **מה לעשות ב-GA4:**
  1. Admin → Events → סמן כ-Key Event:
     - `chat_lead`
     - `phone_click`
     - `form_submit`
     - `calculator_used`
     - `order_tracking_view`
- **עדכון בורד:**
```
itemId: 11621775981
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"5 Key Events סומנו: chat_lead, phone_click, form_submit, calculator_used, order_tracking_view"}
```

---

#### משימה 4.4: Custom Dimensions
- **Item ID:** `11621755261`
- **מה לעשות:**
  1. GA4 → Admin → Custom definitions → Create custom dimension
  2. `language` → User scope → Event parameter: `language`
  3. `service_type` → Event scope → Event parameter: `service_type`
  4. `traffic_source` → Session scope → Event parameter: `traffic_source`
- **עדכון בורד:**
```
itemId: 11621755261
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"3 Custom Dimensions: language (user), service_type (event), traffic_source (session)"}
```

---

#### משימה 4.5: Audiences
- **Item ID:** `11621776017`
- **מה לעשות:**
  1. GA4 → Admin → Audiences → New audience:
  2. `מבקרים חוזרים` → session_count > 1
  3. `משתמשי מחשבון` → calculator_used event
  4. `פותחי צ'אט` → chat_opened event
  5. `צופים בשירות ספציפי` → service_page_viewed + service_type parameter
- **עדכון בורד:**
```
itemId: 11621776017
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"4 Audiences נבנו — מבקרים חוזרים, משתמשי מחשבון, פותחי צ'אט, צופים בשירות"}
```

---

#### משימה 4.6: דוחות מותאמים
- **Item ID:** `11621755431`
- **עדכון בורד:**
```
itemId: 11621755431
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"4 דוחות: שירותים פופולריים לפי שפה, Conversion Funnel, ביצועי מחשבון, מקורות תנועה"}
```

---

#### משימה 4.7: חיבור Google Search Console
- **Item ID:** `11621755369`
- **עדכון בורד:**
```
itemId: 11621755369
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"GSC מחובר ל-GA4, דומיין מאומת"}
```

---

### 🔵 שלב 5: Consent Mode & Privacy (יום 8)

---

#### משימה 5.1: Consent Mode V2 Defaults ב-GTM
- **Item IDs:** `11621752479`, `11621778446` (כפילות)
- **עדכון בורד:**
```
itemId: 11621752479
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Consent Mode V2 defaults מוגדרים — denied by default, 4 signals"}

itemId: 11621778446
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621752479"}
```

---

#### משימה 5.2: Cookie Banner
- **Item IDs:** `11621752495`, `11621764094` (כפילות)
- **עדכון בורד:**
```
itemId: 11621752495
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Cookie Banner מוטמע — CookieYes/Cookiebot, 6 שפות, מחובר ל-Consent Mode"}

itemId: 11621764094
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621752495"}
```

---

#### משימה 5.3: עמודי מדיניות פרטיות
- **Item IDs:** `11621755627`, `11621764049` (כפילות)
- **עדכון בורד:**
```
itemId: 11621755627
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"עמודי מדיניות פרטיות + Cookie Policy נוצרו ב-6 שפות"}

itemId: 11621764049
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621755627"}
```

---

### 🟣 שלב 6: Meta Custom Conversions (יום 9-10)

---

#### משימה 6.1: Custom Conversions לכל שירות (12)
- **Item ID:** `11621777942`
- **מה לעשות ב-Meta Events Manager:**
  ליצור Custom Conversion לכל אחד מ-12 עמודי השירות:

| # | שם | URL Rule |
|---|-----|----------|
| 1 | Notary — Apostille Lead | URL contains `/services/apostille` + Event = Lead |
| 2 | Notary — Notarization Lead | URL contains `/services/notarization` + Event = Lead |
| 3 | Notary — Translation Lead | URL contains `/services/translation` + Event = Lead |
| 4 | Notary — Power of Attorney Lead | URL contains `/services/power-of-attorney` + Event = Lead |
| 5 | Notary — Affidavit Lead | URL contains `/services/affidavit` + Event = Lead |
| 6 | Notary — Will Lead | URL contains `/services/will` + Event = Lead |
| 7 | Notary — Real Estate Lead | URL contains `/services/real-estate` + Event = Lead |
| 8 | Notary — Corporate Lead | URL contains `/services/corporate` + Event = Lead |
| 9 | Notary — Marriage Lead | URL contains `/services/marriage` + Event = Lead |
| 10 | Notary — Divorce Lead | URL contains `/services/divorce` + Event = Lead |
| 11 | Notary — Inheritance Lead | URL contains `/services/inheritance` + Event = Lead |
| 12 | Notary — General Lead | URL contains `/services/general` + Event = Lead |

**הערה:** ה-slugs צריכים להתאים לנתיבים בפועל באתר. אם שונים — לעדכן בהתאם.

- **עדכון בורד:**
```
itemId: 11621777942
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"12 Custom Conversions נוצרו ב-Events Manager — אחד לכל שירות"}
```

---

### 🟤 שלב 7: Server-Side Tracking (ימים 11-12)

---

#### משימה 7.1: GA4 Measurement Protocol
- **Item IDs:** `11621767949`, `11621778440` (כפילות)
- **קובץ:** `app/api/track/route.ts`
- **קוד:**

```typescript
// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GA4_API_SECRET = process.env.GA4_API_SECRET!;
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID!;

export async function POST(request: NextRequest) {
  try {
    const { client_id, events } = await request.json();

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id,
          events,
        }),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

- **Environment Variables:**
```
GA4_API_SECRET=xxxxxxxxxxxxx
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXX
```

- **עדכון בורד:**
```
itemId: 11621767949
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Server-Side: GA4 Measurement Protocol API route פעיל"}

itemId: 11621778440
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621767949"}
```

---

#### משימה 7.2: Meta Conversions API (Server-Side)
- **Item ID:** `11621778470`
- **קובץ:** `app/api/meta-track/route.ts`
- **קוד:**

```typescript
// app/api/meta-track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PIXEL_ID = process.env.META_PIXEL_ID!;
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN!;

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { event_name, event_time, user_data, custom_data, event_source_url } = await request.json();

    const payload = {
      data: [{
        event_name,
        event_time: event_time || Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url,
        user_data: {
          em: user_data?.email ? [hashData(user_data.email)] : undefined,
          ph: user_data?.phone ? [hashData(user_data.phone)] : undefined,
          client_ip_address: request.headers.get('x-forwarded-for') || undefined,
          client_user_agent: request.headers.get('user-agent') || undefined,
          fbc: user_data?.fbc,
          fbp: user_data?.fbp,
        },
        custom_data,
      }],
    };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

- **Environment Variables:**
```
META_PIXEL_ID=XXXXXXXXXX
META_CAPI_TOKEN=EAAxxxxxxxxx
```

- **עדכון בורד:**
```
itemId: 11621778470
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Meta CAPI API route פעיל — server-side events לדיוק מקסימלי"}
```

---

### ✅ שלב 8: בדיקות QA (ימים 13-16)

---

#### בדיקת GTM Preview & Debug
- **Item IDs:** `11621778061`, `11621773846`
- **עדכון בורד:**
```
itemId: 11621778061
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"GTM Preview — כל 18 Tags נטענים, כל 15 Triggers פועלים, Variables מאוכלסים"}

itemId: 11621773846
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621778061"}
```

---

#### בדיקת GA4 Realtime + DebugView
- **Item IDs:** `11621755751`, `11621758941`
- **עדכון בורד:**
```
itemId: 11621755751
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"GA4 Realtime + DebugView — כל האירועים מגיעים עם פרמטרים נכונים"}

itemId: 11621758941
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621755751"}
```

---

#### בדיקת Meta Pixel Helper
- **Item IDs:** `11621778089`, `11621758945`
- **עדכון בורד:**
```
itemId: 11621778089
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Pixel Helper — כל Standard + Custom events נשלחים ללא שגיאות"}

itemId: 11621758945
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621778089"}
```

---

#### בדיקת Consent Mode
- **Item IDs:** `11621778254`, `11621764106`
- **עדכון בורד:**
```
itemId: 11621778254
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Consent Mode עובד — ללא consent: Tags לא נטענים; אחרי consent: הכל פועל"}

itemId: 11621764106
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621778254"}
```

---

#### בדיקת 6 שפות
- **Item IDs:** `11621776335`, `11621758857`
- **עדכון בורד:**
```
itemId: 11621776335
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כל 6 שפות נבדקו — language dimension נשלח נכון, RTL/LTR תקין"}

itemId: 11621758857
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"כפילות — ראה 11621776335"}
```

---

#### בדיקת ביצועים + Core Web Vitals
- **Item ID:** `11621764124`
- **עדכון בורד:**
```
itemId: 11621764124
columnValues: {"color_mm1xx4m1":{"label":"הושלם"},"date_mm1xa72v":{"date":"2026-XX-XX"},"boolean_mm1xhb57":{"checked":true},"text_mm1xbmm5":"Lighthouse Score > 90, סקריפטי tracking לא פוגעים ב-LCP/CLS/FID"}
```

---

## Environment Variables — סיכום

```env
# .env.local

# GTM
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# GA4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXX
GA4_API_SECRET=xxxxxxxxxxxxx

# Meta
META_PIXEL_ID=XXXXXXXXXX
META_CAPI_TOKEN=EAAxxxxxxxxx

# Cookie Banner (if using CookieYes)
NEXT_PUBLIC_COOKIEYES_ID=xxxxxxxxxxxxx
```

---

## קבצים ליצירה — סיכום

| קובץ | תיאור |
|-------|--------|
| `app/layout.tsx` | GTM snippet + Consent Mode defaults |
| `lib/analytics.ts` | Data Layer helper functions |
| `components/RouteChangeTracker.tsx` | SPA route tracking |
| `app/api/track/route.ts` | GA4 Measurement Protocol (server-side) |
| `app/api/meta-track/route.ts` | Meta Conversions API (server-side) |
| `components/CookieBanner.tsx` | Cookie consent banner (6 שפות) |
| `.env.local` | Environment variables |

---

## הוראות לקלוד

1. **עבוד לפי סדר השלבים** — כל שלב תלוי בקודם.
2. **אחרי כל משימה — עדכן את הבורד** עם הפקודה `monday.com:change_item_column_values` (או הכלי המקביל הזמין).
3. **החלף תאריכים** — בכל `2026-XX-XX` שים את התאריך האמיתי של ביצוע המשימה.
4. **החלף IDs** — GTM-XXXXXXX, G-XXXXXXXXX, Pixel ID, וכו' — בערכים האמיתיים שתקבל בתהליך.
5. **כפילויות** — יש פריטים כפולים (סומנו). עדכן את שניהם.
6. **אם משימה תקועה** — עדכן סטטוס ל-`תקוע` עם הערה מסבירה.
7. **Board ID תמיד:** `18406184083`

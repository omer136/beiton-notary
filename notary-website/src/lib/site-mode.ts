/**
 * מצב האתר: אתר מידע של משרד עורכי דין על פעולות נוטריוניות.
 *
 * כש-ORDER_FLOWS_ENABLED הוא false: אין הזמנה של פעולה נוטריונית, אין הצעת מחיר, ואף אדם אינו מוצג כנוטריון.
 * - עמודי השירות לא מציגים את "מה התהליך", "איך מקבלים את השירות", "למה BEITON", את קריאת הוואטסאפ
 *   של העמוד ואת נתוני ה-Service המובנים (הנתונים נשארים ב-src/data, לא נמחקו);
 * - דף הבית לא מציג "מעקב הזמנה";
 * - נקודות הקצה הציבוריות שקולטות פניות (/api/chat, /api/chat/save-transcript, /api/monday/upload-file)
 *   מחזירות 503 בלי לגעת ב-Monday, בדרייב, במייל או ב-Anthropic.
 *
 * שינוי ל-true הוא שינוי קוד שעובר בדיקה ומיזוג, ורק אחרי שהנוסח של הקטעים המוסתרים נבדק מחדש.
 */
export const ORDER_FLOWS_ENABLED: boolean = false;

/** התשובה של נקודת קצה שקולטת פניות, כשהאתר במצב מידע. */
export function inactiveResponse() {
  return Response.json(
    { error: "inactive", message: "This endpoint is not active." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

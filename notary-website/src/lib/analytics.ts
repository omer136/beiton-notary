// lib/analytics.ts — ONLY dataLayer.push. GTM handles GA4, Meta, Google Ads.

declare global {
  interface Window { dataLayer: Record<string, unknown>[]; }
}

const LANGS = ["he", "en", "ru", "ar", "fr", "es"];

function currentLang(): string {
  if (typeof window === "undefined") return "he";
  const seg = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  return LANGS.includes(seg) ? seg : "he";
}

function push(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, language: currentLang(), ...params });
}

// ═══ Services & Calculator ═══
export const trackServiceExplored = (serviceType: string, value?: number) =>
  push("service_explored", {
    service_type: serviceType,
    ...(value ? { calculator_value: value, currency: "ILS" } : {}),
  });

// ═══ Chat ═══
export const trackChatInteraction = (action: "opened" | "message_sent", messageCount?: number) =>
  push("chat_interaction", {
    chat_action: action,
    ...(messageCount ? { message_count: messageCount } : {}),
  });

export const trackLeadCaptured = (serviceType: string, method: string) =>
  push("lead_captured", {
    service_type: serviceType,
    contact_method: method,
  });

// ═══ Contact ═══
export const trackContactClick = (method: string) =>
  push("contact_click", { contact_method: method });

// ═══ Order Tracking ═══
export const trackOrderTracking = (orderId: string) =>
  push("order_tracking_view", { order_id: orderId, page_type: "tracking" });

// ═══ Consent Mode ═══
export function updateConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dl: any[] = (window.dataLayer = window.dataLayer || []);
  const val = granted ? "granted" : "denied";
  dl.push(["consent", "update", {
    ad_storage: val, ad_user_data: val, ad_personalization: val, analytics_storage: val,
  }]);
}

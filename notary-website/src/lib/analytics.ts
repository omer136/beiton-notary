// lib/analytics.ts — ONLY dataLayer.push. GTM handles GA4, Meta, Google Ads.

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { dataLayer: Record<string, any>[]; }
}

const LANGS = ["he", "en", "ru", "ar", "fr", "es"];

function currentLang(): string {
  if (typeof window === "undefined") return "he";
  const seg = window.location.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  return LANGS.includes(seg) ? seg : "he";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function push(event: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, language: currentLang(), ...params });
}

export const trackServiceExplored = (serviceType: string, value?: number) =>
  push("service_explored", {
    service_type: serviceType,
    ...(value ? { calculator_value: value, currency: "ILS" } : {}),
  });

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

export const trackContactClick = (method: string) =>
  push("contact_click", { contact_method: method });

export const trackOrderTracking = (orderId: string) =>
  push("order_tracking_view", { order_id: orderId, page_type: "tracking" });

export function updateConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(..._args: any[]) { window.dataLayer.push(arguments as any); }
  const state = granted ? "granted" : "denied";
  gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  // Send event so GTM can use it as additional trigger for GA4/Meta init
  if (granted) {
    window.dataLayer.push({ event: "consent_granted" });
  }
}

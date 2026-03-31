// lib/utm.ts — Capture UTM parameters from URL and store for Agent 1

export function captureUTM() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  if (!source) return;

  const utm = {
    utm_source: source,
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };

  try { sessionStorage.setItem("beiton_utm", JSON.stringify(utm)); } catch { /* private browsing */ }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "utm_captured", ...utm });
}

export function getStoredUTM(): Record<string, string> | null {
  try {
    const s = sessionStorage.getItem("beiton_utm");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

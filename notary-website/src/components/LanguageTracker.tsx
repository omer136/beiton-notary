"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const LANGS = ["he", "en", "ru", "ar", "fr", "es"] as const;
type Lang = (typeof LANGS)[number];

function langFromPath(p: string): Lang {
  const seg = p.split("/").filter(Boolean)[0]?.toLowerCase();
  return LANGS.includes(seg as Lang) ? (seg as Lang) : "he";
}

export default function LanguageTracker() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const lang = langFromPath(pathname);
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "page_language_set",
      language: lang,
      page_path: pathname,
    });

    if (prev.current && prev.current !== lang) {
      window.dataLayer.push({
        event: "language_changed",
        from_language: prev.current,
        to_language: lang,
        language: lang,
      });
    }
    prev.current = lang;

    // UTM capture
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    if (source) {
      const utm = {
        utm_source: source,
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_content: params.get("utm_content") || "",
        utm_term: params.get("utm_term") || "",
      };
      try { sessionStorage.setItem("beiton_utm", JSON.stringify(utm)); } catch { /* private browsing */ }
      window.dataLayer.push({ event: "utm_captured", ...utm });
    }
  }, [pathname]);

  return null;
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { captureUTM } from "@/lib/utm";

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

    captureUTM();
  }, [pathname]);

  return null;
}

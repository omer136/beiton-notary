"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const LANGS = ["he", "en", "ru", "ar", "fr", "es"];

function Inner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seg = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    const lang = LANGS.includes(seg) ? seg : "he";

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pathname,
      page_title: document.title,
      language: lang,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function RouteChangeTracker() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

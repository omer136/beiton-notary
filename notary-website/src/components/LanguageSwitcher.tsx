"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(locale: Locale) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className={`px-2.5 py-1 text-xs rounded transition-colors ${
            loc === current
              ? "bg-brand-dark text-white"
              : "text-brand-gray hover:bg-brand-border/50"
          }`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function OrderTracker() {
  const t = useTranslations("track");
  const [caseNumber, setCaseNumber] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function handleCheck() {
    if (!caseNumber.trim()) return;
    // Placeholder — will connect to monday.com API
    setStatus(t("not_found"));
  }

  return (
    <section className="py-16 px-6 border-t border-brand-border">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-medium text-brand-dark mb-2">
          {t("title")}
        </h2>
        <p className="text-sm text-brand-muted mb-8">{t("subtitle")}</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder={t("placeholder")}
            className="flex-1 px-4 py-2.5 text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-gray"
          />
          <button
            onClick={handleCheck}
            className="px-6 py-2.5 bg-brand-dark text-white text-sm rounded-xl hover:bg-brand-dark/90 transition-colors"
          >
            {t("check")}
          </button>
        </div>

        {status && (
          <div className="mt-6 p-4 rounded-xl border border-brand-border bg-brand-white text-sm text-brand-gray">
            {status}
          </div>
        )}
      </div>
    </section>
  );
}

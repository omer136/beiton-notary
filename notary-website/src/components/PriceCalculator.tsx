"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateTranslation,
  calculateSignature,
  calculateWill,
  calculateAffidavit,
  calculateCertifiedCopy,
  calculatePrenuptial,
  calculateLifeCertificate,
  type PriceBreakdown,
} from "@/lib/pricing";

const SERVICE_OPTIONS = [
  { id: "translation_approval", inputs: ["wordCount", "notaryTranslates"] },
  { id: "signature_authentication", inputs: ["extraSigners", "withApostille"] },
  { id: "notarial_will", inputs: ["extraSigners"] },
  { id: "affidavit", inputs: ["extraSigners"] },
  { id: "certified_copy", inputs: ["extraPages"] },
  { id: "prenuptial_agreement", inputs: [] },
  { id: "life_certificate", inputs: [] },
];

const SERVICE_NAMES: Record<string, string> = {
  translation_approval: "אישור נכונות תרגום",
  signature_authentication: "אימות חתימה",
  notarial_will: "צוואה נוטריונית",
  affidavit: "תצהיר נוטריוני",
  certified_copy: "העתק נאמן למקור",
  prenuptial_agreement: "הסכם ממון",
  life_certificate: "אישור חיים",
};

export default function PriceCalculator() {
  const t = useTranslations("calculator");
  const [serviceId, setServiceId] = useState("translation_approval");
  const [wordCount, setWordCount] = useState(200);
  const [extraSigners, setExtraSigners] = useState(0);
  const [extraPages, setExtraPages] = useState(0);
  const [withApostille, setWithApostille] = useState(false);
  const [notaryTranslates, setNotaryTranslates] = useState(true);

  const service = SERVICE_OPTIONS.find((s) => s.id === serviceId)!;

  let result: PriceBreakdown;
  switch (serviceId) {
    case "translation_approval":
      result = calculateTranslation(wordCount, notaryTranslates);
      break;
    case "signature_authentication":
      result = calculateSignature(extraSigners, withApostille);
      break;
    case "notarial_will":
      result = calculateWill(extraSigners);
      break;
    case "affidavit":
      result = calculateAffidavit(extraSigners);
      break;
    case "certified_copy":
      result = calculateCertifiedCopy(extraPages);
      break;
    case "prenuptial_agreement":
      result = calculatePrenuptial();
      break;
    case "life_certificate":
      result = calculateLifeCertificate();
      break;
    default:
      result = calculateTranslation(wordCount, notaryTranslates);
  }

  return (
    <section className="py-16 px-6 bg-brand-white border-t border-brand-border">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium text-brand-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-brand-muted">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 space-y-5">
          {/* Service select */}
          <div>
            <label className="block text-xs text-brand-gray mb-1.5">
              {t("select_service")}
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:border-brand-gray"
            >
              {SERVICE_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {SERVICE_NAMES[s.id]}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic inputs */}
          {service.inputs.includes("wordCount") && (
            <div>
              <label className="block text-xs text-brand-gray mb-1.5">
                {t("word_count")}
              </label>
              <input
                type="number"
                min={50}
                max={5000}
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:border-brand-gray"
              />
            </div>
          )}

          {service.inputs.includes("notaryTranslates") && (
            <label className="flex items-center gap-2 text-sm text-brand-dark cursor-pointer">
              <input
                type="checkbox"
                checked={notaryTranslates}
                onChange={(e) => setNotaryTranslates(e.target.checked)}
                className="rounded"
              />
              {t("notary_translates")}
            </label>
          )}

          {service.inputs.includes("extraSigners") && (
            <div>
              <label className="block text-xs text-brand-gray mb-1.5">
                {t("extra_signers")}
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={extraSigners}
                onChange={(e) => setExtraSigners(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:border-brand-gray"
              />
            </div>
          )}

          {service.inputs.includes("extraPages") && (
            <div>
              <label className="block text-xs text-brand-gray mb-1.5">
                {t("extra_pages")}
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={extraPages}
                onChange={(e) => setExtraPages(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:border-brand-gray"
              />
            </div>
          )}

          {service.inputs.includes("withApostille") && (
            <label className="flex items-center gap-2 text-sm text-brand-dark cursor-pointer">
              <input
                type="checkbox"
                checked={withApostille}
                onChange={(e) => setWithApostille(e.target.checked)}
                className="rounded"
              />
              {t("with_apostille")}
            </label>
          )}

          {/* Breakdown */}
          <div className="border-t border-brand-border pt-4 space-y-2">
            {result.lines.map((line, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-brand-gray">{line.label}</span>
                <span className="text-brand-dark">{line.amount.toFixed(2)} ₪</span>
              </div>
            ))}
            <div className="border-t border-brand-border pt-2 mt-2 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">{t("subtotal")}</span>
                <span>{result.subtotal.toFixed(2)} ₪</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray">{t("vat")}</span>
                <span>{result.vat.toFixed(2)} ₪</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-1">
                <span>{t("total")}</span>
                <span className="text-brand-green">{result.total.toFixed(2)} ₪</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-brand-muted text-center pt-2">
            {t("regulated")}
          </p>
        </div>
      </div>
    </section>
  );
}

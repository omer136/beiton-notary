"use client";

import { useState, useEffect, useRef } from "react";
import { PRICING_CONFIG } from "@/data/pricing-config";
import { trackServiceExplored } from "@/lib/analytics";

const LABELS: Record<string, Record<string, string>> = {
  he: { selectService: "בחרו שירות", words: "מספר מילים במסמך", pages: "מספר עמודים", signatories: "מספר חותמים", copies: "מספר עותקים", documents: "מספר מסמכים", wordsFirst: "עד 100 מילים", firstPage: "עמוד ראשון", firstStamp: "חותם ראשון", total: "סה״כ לפני מע״מ", vat: "מע״מ (18%)", totalVat: "סה״כ כולל מע״מ", note: "המחירים נקבעים בתקנות ואינם ניתנים לשינוי.", additionalPages: "עמודים נוספים", basePrice: "תעריף בסיס", per100to1000: "לכל 100 מילים נוספות (עד 1,000)", per100above: "לכל 100 מילים נוספות (מעל 1,000)", foreignLang: "שפה לועזית — לא עברית/אנגלית/ערבית (+104 ₪)", foreignSurcharge: "תוספת שפה לועזית (פרט 10)", addSigners: "חותמים נוספים", addCopies: "עותקים נוספים", willFirst: "מצווה ראשון", willAdd: "מצווה נוסף (צוואה הדדית)", decrease: "הפחתה", increase: "הוספה" },
  en: { selectService: "Select service", words: "Word count", pages: "Number of pages", signatories: "Number of signers", copies: "Number of copies", documents: "Number of documents", wordsFirst: "Up to 100 words", firstPage: "First page", firstStamp: "First signatory", total: "Subtotal before VAT", vat: "VAT (18%)", totalVat: "Total incl. VAT", note: "Fees are regulated and cannot be changed.", additionalPages: "Additional pages", basePrice: "Base fee", per100to1000: "Per 100 additional words (up to 1,000)", per100above: "Per 100 additional words (over 1,000)", foreignLang: "Foreign language — not Hebrew/English/Arabic (+104 ₪)", foreignSurcharge: "Foreign language surcharge (Item 10)", addSigners: "Additional signers", addCopies: "Additional copies", willFirst: "First testator", willAdd: "Additional testator (mutual will)", decrease: "Decrease", increase: "Increase" },
};

const getL = (lang: string) => LABELS[lang] || LABELS.en;

// Step size for the +/− buttons. Words go in 50-unit steps so it's not painful
// to drag from 100 → 500. Other counters go in 1.
const STEP_FOR = (field: string) => (field === "words" ? 50 : 1);

export default function PricingCalculator({ lang, initialService }: { lang: string; initialService?: string }) {
  const l = getL(lang);
  const isRtl = lang === "he" || lang === "ar";
  const font = lang === "he" ? "'Noto Sans Hebrew', sans-serif" : lang === "ar" ? "'Noto Sans Arabic', sans-serif" : "'DM Sans', sans-serif";
  const c = "₪";

  const [selSvc, setSelSvc] = useState(initialService || "");
  const [words, setWords] = useState(100);
  const [pages, setPages] = useState(1);
  const [sigs, setSigs] = useState(1);
  const [copies, setCopies] = useState(1);
  const [foreignLang, setForeignLang] = useState(false);

  const svc = selSvc ? PRICING_CONFIG[selSvc] : null;

  const mul = (qty: number, price: number) => `‪${qty} × ${price} ${c}‬`;

  const calc = () => {
    if (!svc) return null;
    const lines: { label: string; amount: number }[] = [];
    let total = 0;

    if (svc.type === "words") {
      const w = words || 0;
      let p = svc.base;
      lines.push({ label: l.wordsFirst, amount: svc.base });
      if (w > 100) { const units = Math.ceil(Math.min(w - 100, 900) / 100); const extra = units * svc.per100to1000; p += extra; lines.push({ label: `${l.per100to1000}: ${mul(units, svc.per100to1000)}`, amount: extra }); }
      if (w > 1000) { const units = Math.ceil((w - 1000) / 100); const extra = units * svc.per100above1000; p += extra; lines.push({ label: `${l.per100above}: ${mul(units, svc.per100above1000)}`, amount: extra }); }
      total = p;
      // Policy: never offer the +50% "notary translates" option in the calculator.
      if (selSvc === "translation" && foreignLang) { total += 104; lines.push({ label: l.foreignSurcharge, amount: 104 }); }
    } else if (svc.type === "stamp") {
      const isWill = selSvc === "will";
      lines.push({ label: isWill ? l.willFirst : l.firstStamp, amount: svc.firstStamp });
      total = svc.firstStamp;
      if (sigs > 1) { const add = (sigs - 1) * svc.additionalStamp; total += add; lines.push({ label: `${isWill ? l.willAdd : l.addSigners}: ${mul(sigs - 1, svc.additionalStamp)}`, amount: add }); }
      if (svc.fields?.includes("copies") && copies > 1) { const add = (copies - 1) * (svc.additionalStamp || 77); total += add; lines.push({ label: `${l.addCopies}: ${mul(copies - 1, svc.additionalStamp || 77)}`, amount: add }); }
    } else if (svc.type === "fixed") {
      lines.push({ label: l.basePrice, amount: svc.base });
      total = svc.base;
      if (svc.perCopy && copies > 1) { const add = (copies - 1) * svc.perCopy; total += add; lines.push({ label: `${l.addCopies}: ${mul(copies - 1, svc.perCopy)}`, amount: add }); }
    } else if (svc.type === "page") {
      lines.push({ label: l.firstPage, amount: svc.firstPage });
      total = svc.firstPage;
      if (pages > 1) { const add = (pages - 1) * svc.additionalPage; total += add; lines.push({ label: `${l.additionalPages}: ${mul(pages - 1, svc.additionalPage)}`, amount: add }); }
    }

    const vat = Math.round(total * 0.18);
    return { lines, total, vat, withVat: total + vat };
  };

  const pr = calc();

  // Track service explored when calculator shows a result
  const trackedRef = useRef("");
  useEffect(() => {
    if (pr && selSvc && selSvc !== trackedRef.current) {
      trackServiceExplored(selSvc, pr.withVat);
      trackedRef.current = selSvc;
    }
  }, [pr, selSvc]);

  const S = {
    lbl: { display: "block" as const, fontSize: 11, fontWeight: 500, color: "#999", marginBottom: 6 },
    inp: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E8E6E1", fontSize: 13, fontFamily: font, background: "#FAFAF8", direction: "ltr" as const, textAlign: "center" as const },
    btn: { width: 40, minWidth: 40, height: 40, borderRadius: 8, border: "1px solid #E8E6E1", background: "#FAFAF8", fontSize: 18, fontWeight: 500, color: "#1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1, userSelect: "none" as const, transition: "background 120ms" },
    selWrap: { position: "relative" as const, marginBottom: 18 },
    chevron: { position: "absolute" as const, insetInlineEnd: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" as const, color: "#666", fontSize: 11, lineHeight: 1 },
    numWrap: { display: "flex", alignItems: "stretch", gap: 8, marginBottom: 18 },
  };

  const Stepper = ({
    field, value, set, min, max,
  }: { field: string; value: number; set: (n: number) => void; min: number; max: number; }) => {
    const step = STEP_FOR(field);
    const dec = () => set(Math.max(min, value - step));
    const inc = () => set(Math.min(max, value + step));
    return (
      <div style={S.numWrap}>
        <button type="button" aria-label={l.decrease} onClick={dec} style={S.btn}>−</button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={e => set(Math.max(min, Math.min(max, +e.target.value || min)))}
          style={{ ...S.inp, flex: 1 }}
        />
        <button type="button" aria-label={l.increase} onClick={inc} style={S.btn}>+</button>
      </div>
    );
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ fontFamily: font }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 28, border: "1px solid #E8E6E1" }}>
        <label style={S.lbl}>{l.selectService}</label>
        <div style={S.selWrap}>
          <select
            value={selSvc}
            onChange={e => { setSelSvc(e.target.value); setPages(1); setSigs(1); setCopies(1); setWords(100); setForeignLang(false); }}
            style={{ ...S.inp, textAlign: isRtl ? "right" : "left", paddingInlineEnd: 36, appearance: "none", WebkitAppearance: "none", MozAppearance: "none", direction: isRtl ? "rtl" : "ltr", cursor: "pointer" } as React.CSSProperties}
          >
            <option value="">—</option>
            {Object.entries(PRICING_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label[lang] || v.label.en}</option>)}
          </select>
          <span style={S.chevron} aria-hidden="true">▼</span>
        </div>

        {svc?.fields?.includes("words") && <>
          <label style={S.lbl}>{l.words}</label>
          <Stepper field="words" value={words} set={setWords} min={1} max={50000} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B6B6B", marginBottom: 18, cursor: "pointer" }}>
            <input type="checkbox" checked={foreignLang} onChange={e => setForeignLang(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1A1A1A" }} />
            {l.foreignLang}
          </label>
        </>}

        {svc?.fields?.includes("pages") && <>
          <label style={S.lbl}>{l.pages}</label>
          <Stepper field="pages" value={pages} set={setPages} min={1} max={50} />
        </>}

        {svc?.fields?.includes("signatories") && <>
          <label style={S.lbl}>{l.signatories}</label>
          <Stepper field="signatories" value={sigs} set={setSigs} min={1} max={10} />
        </>}

        {svc?.fields?.includes("copies") && <>
          <label style={S.lbl}>{l.copies}</label>
          <Stepper field="copies" value={copies} set={setCopies} min={1} max={10} />
        </>}

        {pr && <div style={{ borderTop: "1px solid #E8E6E1", paddingTop: 16, marginTop: 4 }}>
          {pr.lines.map((line, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B6B6B", marginBottom: 4 }}><span>{line.label}</span><span>{line.amount.toLocaleString()} {c}</span></div>)}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 400, marginTop: 10, paddingTop: 10, borderTop: "1px solid #E8E6E1" }}><span>{l.total}</span><span>{pr.total.toLocaleString()} {c}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B6B6B", marginTop: 4 }}><span>{l.vat}</span><span>{pr.vat.toLocaleString()} {c}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 500, marginTop: 8, paddingTop: 8, borderTop: "1px solid #E8E6E1" }}><span>{l.totalVat}</span><span>{pr.withVat.toLocaleString()} {c}</span></div>
          <p style={{ fontSize: 10, color: "#999", marginTop: 8, fontStyle: "italic" }}>{l.note}</p>
        </div>}
      </div>
    </div>
  );
}

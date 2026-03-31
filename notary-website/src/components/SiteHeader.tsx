"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LANGS: Record<string, { label: string; dir: string; font: string }> = {
  he: { label: "עברית", dir: "rtl", font: "'Noto Sans Hebrew', sans-serif" },
  en: { label: "English", dir: "ltr", font: "'DM Sans', sans-serif" },
  ru: { label: "Русский", dir: "ltr", font: "'DM Sans', sans-serif" },
  ar: { label: "العربية", dir: "rtl", font: "'Noto Sans Arabic', sans-serif" },
  fr: { label: "Français", dir: "ltr", font: "'DM Sans', sans-serif" },
  es: { label: "Español", dir: "ltr", font: "'DM Sans', sans-serif" },
};

const NAV: Record<string, Record<string, string>> = {
  he: { home: "ראשי", services: "שירותים", usecases: "מקרי שימוש", pricing: "מחירון", track: "מעקב הזמנה", blog: "בלוג", about: "אודות", contact: "יצירת קשר" },
  en: { home: "Home", services: "Services", usecases: "Use Cases", pricing: "Pricing", track: "Track Order", blog: "Blog", about: "About", contact: "Contact" },
  ru: { home: "Главная", services: "Услуги", usecases: "Примеры", pricing: "Цены", track: "Отслеживание", blog: "Блог", about: "О нас", contact: "Контакты" },
  ar: { home: "الرئيسية", services: "الخدمات", usecases: "حالات الاستخدام", pricing: "الأسعار", track: "تتبع الطلب", blog: "مدونة", about: "عن المكتب", contact: "تواصل معنا" },
  fr: { home: "Accueil", services: "Services", usecases: "Cas d'usage", pricing: "Tarifs", track: "Suivi", blog: "Blog", about: "A propos", contact: "Contact" },
  es: { home: "Inicio", services: "Servicios", usecases: "Casos de uso", pricing: "Precios", track: "Seguimiento", blog: "Blog", about: "Nosotros", contact: "Contacto" },
};

export default function SiteHeader({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [langDrop, setLangDrop] = useState(false);

  const nav = NAV[lang] || NAV.en;
  const cfg = LANGS[lang] || LANGS.en;
  const rtl = cfg.dir === "rtl";

  const setLang = (newLang: string) => {
    // Replace locale segment in current path
    const segments = pathname.split("/");
    segments[1] = newLang;
    router.push(segments.join("/"));
  };

  return (
    <>
      <style>{`
        .sh-nl:hover{opacity:.5}
        .sh-lo:hover{background:#F5F4F1!important}
        @media(max-width:768px){.sh-dn{display:none!important}.sh-mb{display:flex!important}}
      `}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8E6E1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "baseline", direction: "ltr", textDecoration: "none", color: "#1A1A1A" }}>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 500, fontSize: 15, letterSpacing: 5, textTransform: "uppercase" }}>BEITON</span>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: 3, color: "#999", marginLeft: 6 }}>&amp; Co</span>
          </Link>
          <div className="sh-dn" style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {Object.entries(nav).map(([k, v]) => (
              <Link key={k} href={`/${lang}#${k}`} className="sh-nl" style={{ fontSize: 12, color: "#1A1A1A", textDecoration: "none", transition: "opacity .2s" }}>{v}</Link>
            ))}
            <div style={{ position: "relative" }}>
              <button onClick={() => setLangDrop(!langDrop)} style={{ background: "none", border: "1px solid #E8E6E1", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#6B6B6B", display: "flex", alignItems: "center", gap: 3, fontFamily: cfg.font, cursor: "pointer" }}>
                {cfg.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {langDrop && <div style={{ position: "absolute", top: "110%", [rtl ? "right" : "left"]: 0, background: "#fff", border: "1px solid #E8E6E1", borderRadius: 8, overflow: "hidden", minWidth: 120, boxShadow: "0 6px 20px rgba(0,0,0,.07)", zIndex: 200 }}>
                {Object.entries(LANGS).map(([c, { label, font }]) => (
                  <button key={c} className="sh-lo" onClick={() => { setLang(c); setLangDrop(false); }} style={{ display: "block", width: "100%", textAlign: rtl ? "right" : "left", padding: "8px 12px", border: "none", background: lang === c ? "#F5F4F1" : "transparent", fontSize: 12, fontFamily: font, color: "#1A1A1A", transition: "background .15s", cursor: "pointer" }}>{label}</button>
                ))}
              </div>}
            </div>
          </div>
          <button className="sh-mb" onClick={() => setMenu(!menu)} style={{ display: "none", background: "none", border: "none", width: 24, height: 24, color: "#1A1A1A", cursor: "pointer" }}>
            {menu
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            }
          </button>
        </div>
        {menu && <div style={{ background: "#fff", borderTop: "1px solid #E8E6E1", padding: "10px 24px" }}>
          {Object.entries(nav).map(([k, v]) => (
            <Link key={k} href={`/${lang}#${k}`} onClick={() => setMenu(false)} style={{ display: "block", padding: "9px 0", fontSize: 14, color: "#1A1A1A", textDecoration: "none", borderBottom: "1px solid #F5F4F1" }}>{v}</Link>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingTop: 10 }}>
            {Object.entries(LANGS).map(([c, { label }]) => (
              <button key={c} onClick={() => { setLang(c); setMenu(false); }} style={{ padding: "4px 11px", borderRadius: 14, border: lang === c ? "1px solid #1A1A1A" : "1px solid #E8E6E1", background: lang === c ? "#1A1A1A" : "transparent", color: lang === c ? "#fff" : "#6B6B6B", fontSize: 10, fontFamily: LANGS[c].font, cursor: "pointer" }}>{label}</button>
            ))}
          </div>
        </div>}
      </nav>
    </>
  );
}

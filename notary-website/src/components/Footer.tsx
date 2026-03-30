import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-brand-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
        <div className="flex items-baseline gap-1">
          <span
            className="text-sm font-medium tracking-[0.15em] text-brand-dark"
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            BEITON
          </span>
          <span
            className="text-[10px] tracking-[0.1em] text-brand-gray"
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            &amp; Co
          </span>
          <span className="ms-3">© {new Date().getFullYear()} {t("rights")}</span>
        </div>
        <div className="flex gap-4">
          <span>{t("address")}</span>
          <span>☎ 03-1234567</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-3 flex flex-col items-center gap-2">
        <div className="flex gap-4 text-[11px] text-brand-muted">
          <Link href={`/${locale}/privacy`} className="hover:text-brand-dark transition-colors">{t("privacy")}</Link>
          <Link href={`/${locale}/terms`} className="hover:text-brand-dark transition-colors">{t("terms")}</Link>
          <Link href={`/${locale}/accessibility`} className="hover:text-brand-dark transition-colors">{t("accessibility")}</Link>
        </div>
        <p className="text-[10px] text-brand-muted/60">{t("confidential")}</p>
      </div>
    </footer>
  );
}

import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

export default function Header({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-brand-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <LanguageSwitcher current={locale} />
      </div>
    </header>
  );
}

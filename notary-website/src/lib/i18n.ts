export const locales = ["he", "en", "ru", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";
export const rtlLocales: Locale[] = ["he", "ar"];

export const localeNames: Record<Locale, string> = {
  he: "עב",
  en: "EN",
  ru: "РУ",
  ar: "عر",
};

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

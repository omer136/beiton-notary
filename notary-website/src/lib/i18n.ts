export const locales = ["he", "en", "ru", "ar", "fr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";
export const rtlLocales: Locale[] = ["he", "ar"];

export const localeNames: Record<Locale, string> = {
  he: "עב",
  en: "EN",
  ru: "РУ",
  ar: "عر",
  fr: "FR",
  es: "ES",
};

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

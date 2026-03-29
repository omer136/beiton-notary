import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isRtl } from "@/lib/i18n";
import { dmSans, notoHebrew, notoArabic } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const rtl = isRtl(locale as Locale);

  const fontClass =
    locale === "he"
      ? notoHebrew.variable
      : locale === "ar"
        ? notoArabic.variable
        : "";

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${dmSans.variable} ${fontClass} antialiased`}
    >
      <body
        className="min-h-screen bg-white"
        style={{
          fontFamily:
            locale === "he"
              ? "var(--font-noto-hebrew), var(--font-dm-sans), sans-serif"
              : locale === "ar"
                ? "var(--font-noto-arabic), var(--font-dm-sans), sans-serif"
                : "var(--font-dm-sans), 'Helvetica Neue', sans-serif",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

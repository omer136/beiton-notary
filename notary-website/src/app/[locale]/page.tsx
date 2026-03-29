import { getTranslations } from "next-intl/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import PriceCalculator from "@/components/PriceCalculator";
import OrderTracker from "@/components/OrderTracker";
import Footer from "@/components/Footer";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale as Locale} />
      <main>
        <Hero />
        <ServicesGrid locale={locale as Locale} />
        <PriceCalculator />
        <OrderTracker />
      </main>
      <Footer />
    </>
  );
}

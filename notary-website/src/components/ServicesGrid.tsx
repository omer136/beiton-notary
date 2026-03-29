import { useTranslations } from "next-intl";
import { getServices } from "@/lib/services";
import ServiceCard from "./ServiceCard";
import type { Locale } from "@/lib/i18n";

export default function ServicesGrid({ locale }: { locale: Locale }) {
  const t = useTranslations("services");
  const services = getServices();

  return (
    <section className="py-16 px-6 border-t border-brand-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-medium text-brand-dark mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-brand-muted">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              locale={locale}
              presenceLabel={t("presence_required")}
              digitalLabel={t("digital_available")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

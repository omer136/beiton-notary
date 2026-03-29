import { useTranslations } from "next-intl";
import ChatWidget from "./ChatWidget";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-brand-muted mb-4">
          BEYOND LAW
        </p>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-brand-dark mb-4">
          {t("tagline")}
        </h1>
        <p className="text-base text-brand-gray leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
      <ChatWidget />
    </section>
  );
}

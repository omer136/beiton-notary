import { getServiceName, getServiceIcon, type NotaryService } from "@/lib/services";
import type { Locale } from "@/lib/i18n";

export default function ServiceCard({
  service,
  locale,
  presenceLabel,
  digitalLabel,
}: {
  service: NotaryService;
  locale: Locale;
  presenceLabel: string;
  digitalLabel: string;
}) {
  const name = getServiceName(service, locale);
  const icon = getServiceIcon(service.id);
  const needsPresence = service.requires_presence === true;
  const isDigital = service.delivery_options.includes("digital");

  return (
    <div className="group p-5 rounded-xl border border-brand-border bg-brand-white hover:border-brand-gray/30 hover:shadow-sm transition-all">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-sm font-medium text-brand-dark mb-1.5">{name}</h3>
      <p className="text-xs text-brand-muted leading-relaxed mb-3">
        {service.description_he}
      </p>
      <div className="flex gap-2 flex-wrap">
        {isDigital && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green">
            {digitalLabel}
          </span>
        )}
        {needsPresence && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-border text-brand-gray">
            {presenceLabel}
          </span>
        )}
      </div>
    </div>
  );
}

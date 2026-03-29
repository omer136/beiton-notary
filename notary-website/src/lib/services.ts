import servicesData from "@/../public/data/notary_services.json";
import type { Locale } from "./i18n";

export interface NotaryService {
  id: string;
  name_he: string;
  name_en: string;
  name_ru: string;
  name_ar: string;
  name_fr?: string;
  name_es?: string;
  description_he: string;
  legal_ref: string;
  requires_presence: boolean | string;
  delivery_options: string[];
  ai_role: string;
  documents_required: string[];
}

const SERVICE_ICONS: Record<string, string> = {
  translation_approval: "🌐",
  translator_declaration: "📝",
  certified_copy: "📋",
  signature_authentication: "✍️",
  power_of_attorney: "📜",
  affidavit: "⚖️",
  life_certificate: "❤️",
  prenuptial_agreement: "💍",
  notarial_will: "📖",
  negotiable_instrument: "💰",
  apostille: "🌍",
  poa_cancellation: "❌",
};

export function getServices(): NotaryService[] {
  return servicesData.services as NotaryService[];
}

export function getServiceName(service: NotaryService, locale: Locale): string {
  const key = `name_${locale}` as keyof NotaryService;
  return (service[key] as string) || service.name_en;
}

export function getServiceIcon(serviceId: string): string {
  return SERVICE_ICONS[serviceId] || "📄";
}

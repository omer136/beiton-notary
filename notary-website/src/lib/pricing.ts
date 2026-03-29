import pricingData from "@/../public/data/notary_pricing_2026.json";

const VAT_RATE = pricingData._meta.vat_rate;

export interface PriceBreakdown {
  lines: { label: string; amount: number }[];
  subtotal: number;
  vat: number;
  total: number;
}

export function calculateTranslation(
  wordCount: number,
  notaryTranslates: boolean = true
): PriceBreakdown {
  const items = pricingData.pricing.translation_approval.items;
  const lines: { label: string; amount: number }[] = [];

  let fee = items[0].amount;
  lines.push({ label: items[0].description_he, amount: items[0].amount });

  const remaining = Math.max(0, wordCount - 100);
  const blocks = remaining > 0 ? Math.min(Math.ceil(remaining / 100), 9) : 0;
  if (blocks > 0) {
    const blockFee = blocks * items[1].amount;
    fee += blockFee;
    lines.push({ label: `${items[1].description_he} ×${blocks}`, amount: blockFee });
  }

  const above1000 = Math.max(0, wordCount - 1000);
  if (above1000 > 0) {
    const b2 = Math.ceil(above1000 / 100);
    const f2 = b2 * items[2].amount;
    fee += f2;
    lines.push({ label: `${items[2].description_he} ×${b2}`, amount: f2 });
  }

  if (notaryTranslates) {
    const surchargeRate =
      pricingData.pricing.translation_approval.translation_by_notary_surcharge
        .surcharge_rate;
    const surcharge = fee * surchargeRate;
    fee += surcharge;
    lines.push({ label: "תוספת תרגום ע״י נוטריון (50%)", amount: surcharge });
  }

  // Translation fee (free market)
  const tf = pricingData.translation_fee;
  const transFee = Math.max(wordCount * tf.per_word_rate, tf.minimum_fee);
  lines.push({ label: "שכר תרגום", amount: transFee });

  const subtotal = fee + transFee;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  return { lines, subtotal, vat, total: Math.round((subtotal + vat) * 100) / 100 };
}

export function calculateSignature(
  extraSigners: number = 0,
  withApostille: boolean = false
): PriceBreakdown {
  const items = pricingData.pricing.signature_authentication.items;
  const lines: { label: string; amount: number }[] = [];

  lines.push({ label: items[0].description_he, amount: items[0].amount });
  let fee = items[0].amount;

  if (extraSigners > 0) {
    const extra = extraSigners * items[1].amount;
    fee += extra;
    lines.push({ label: `${items[1].description_he} ×${extraSigners}`, amount: extra });
  }

  if (withApostille) {
    const ap = pricingData.apostille_fee.court_fee + pricingData.apostille_fee.handling_fee;
    fee += ap;
    lines.push({ label: "אפוסטיל (אגרה + טיפול)", amount: ap });
  }

  const vat = Math.round(fee * VAT_RATE * 100) / 100;
  return { lines, subtotal: fee, vat, total: Math.round((fee + vat) * 100) / 100 };
}

export function calculateWill(extraSigners: number = 0): PriceBreakdown {
  const items = pricingData.pricing.will_and_life_certificate.will;
  const lines: { label: string; amount: number }[] = [];

  lines.push({ label: items[0].description_he, amount: items[0].amount });
  let fee = items[0].amount;

  if (extraSigners > 0) {
    const extra = extraSigners * items[1].amount;
    fee += extra;
    lines.push({ label: `${items[1].description_he} ×${extraSigners}`, amount: extra });
  }

  const vat = Math.round(fee * VAT_RATE * 100) / 100;
  return { lines, subtotal: fee, vat, total: Math.round((fee + vat) * 100) / 100 };
}

export function calculateAffidavit(extraDeclarants: number = 0): PriceBreakdown {
  const items = pricingData.pricing.affidavit.items;
  const lines: { label: string; amount: number }[] = [];

  lines.push({ label: items[0].description_he, amount: items[0].amount });
  let fee = items[0].amount;

  if (extraDeclarants > 0) {
    const extra = extraDeclarants * items[1].amount;
    fee += extra;
    lines.push({ label: `${items[1].description_he} ×${extraDeclarants}`, amount: extra });
  }

  const vat = Math.round(fee * VAT_RATE * 100) / 100;
  return { lines, subtotal: fee, vat, total: Math.round((fee + vat) * 100) / 100 };
}

export function calculateCertifiedCopy(extraPages: number = 0): PriceBreakdown {
  const items = pricingData.pricing.certified_copy.items;
  const lines: { label: string; amount: number }[] = [];

  lines.push({ label: items[0].description_he, amount: items[0].amount });
  let fee = items[0].amount;

  if (extraPages > 0) {
    const extra = extraPages * items[1].amount;
    fee += extra;
    lines.push({ label: `${items[1].description_he} ×${extraPages}`, amount: extra });
  }

  const vat = Math.round(fee * VAT_RATE * 100) / 100;
  return { lines, subtotal: fee, vat, total: Math.round((fee + vat) * 100) / 100 };
}

export function calculatePrenuptial(): PriceBreakdown {
  const fee = pricingData.pricing.prenuptial_agreement.items[0].amount;
  const lines = [{ label: pricingData.pricing.prenuptial_agreement.items[0].description_he, amount: fee }];
  const vat = Math.round(fee * VAT_RATE * 100) / 100;
  return { lines, subtotal: fee, vat, total: Math.round((fee + vat) * 100) / 100 };
}

export function calculateLifeCertificate(): PriceBreakdown {
  const fee = pricingData.pricing.will_and_life_certificate.life_certificate[0].amount;
  const lines = [{ label: pricingData.pricing.will_and_life_certificate.life_certificate[0].description_he, amount: fee }];
  const vat = Math.round(fee * VAT_RATE * 100) / 100;
  return { lines, subtotal: fee, vat, total: Math.round((fee + vat) * 100) / 100 };
}

export { VAT_RATE };

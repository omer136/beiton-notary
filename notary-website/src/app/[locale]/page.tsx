import type { Metadata } from "next";
import NotaryHome from "@/components/NotaryHome";

const BASE = "https://notary.beiton.co";
const LOCALES = ["he", "en", "ru", "ar", "fr", "es"];

// כותרת ותיאור לכל שפה. עד 25.11.2026 היו זהים בכל השפות, עם "Online calculator. Digital process."
const META: Record<string, { title: string; description: string }> = {
  he: { title: "פעולות נוטריוניות בישראל: מה הדין קובע | BEITON", description: "מידע של משרד עורכי דין על פעולות נוטריוניות בישראל: אימות חתימה, אישור תרגום, ייפוי כוח, צוואה, הסכם ממון ואפוסטיל, עם הסעיף בחוק לכל כלל." },
  en: { title: "Notarial acts in Israel: what the law says | BEITON", description: "Information from a law office on notarial acts in Israel: signature authentication, certified translation, powers of attorney, wills, property agreements and the apostille, with the section of the law for each rule." },
  ru: { title: "Нотариальные действия в Израиле: что говорит закон | BEITON", description: "Информация адвокатской конторы о нотариальных действиях в Израиле: удостоверение подписи, перевод, доверенности, завещание, имущественный договор и апостиль, со статьёй закона для каждого правила." },
  ar: { title: "الأعمال التوثيقية في إسرائيل: ماذا يقول القانون | BEITON", description: "معلومات من مكتب محاماة عن الأعمال التوثيقية في إسرائيل: المصادقة على التوقيع والترجمة والتوكيلات والوصية والاتفاقية المالية والأبوستيل، مع بند القانون لكل قاعدة." },
  fr: { title: "Les actes notariés en Israël : ce que dit la loi | BEITON", description: "Informations d'un cabinet d'avocats sur les actes notariés en Israël : authentification de signature, traduction, procurations, testament, contrat de biens et apostille, avec l'article de loi pour chaque règle." },
  es: { title: "Los actos notariales en Israel: lo que dice la ley | BEITON", description: "Información de un despacho de abogados sobre los actos notariales en Israel: autenticación de firma, traducción, poderes, testamento, acuerdo patrimonial y apostilla, con el artículo de la ley de cada regla." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] || META.he;
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}`])), "x-default": `${BASE}/he` },
    },
  };
}

export default function HomePage() {
  return <NotaryHome />;
}

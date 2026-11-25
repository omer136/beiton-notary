"use client";

import { trackContactClick } from "@/lib/analytics";

type Lang = "he" | "en" | "ru" | "ar" | "fr" | "es";

// WhatsApp business number — same as the contact section (03-3817776).
const WHATSAPP_NUMBER = "97233817776";

// הכותרת היא מידע, והקישור הוא פנייה כללית למשרד עורכי הדין (25.11.2026).
// קודם היה כאן "קבלו הצעת מחיר מהירה ושירות אישי מנציג", עם הודעה מוכנה שמבקשת "שירות נוטריוני".
const TITLE: Record<Lang, string> = {
  he: "מה הדין קובע לכל פעולה נוטריונית: מי רשאי, מה נדרש, ומה השכר שבתקנות",
  en: "What the law says about each notarial act: who may do it, what it requires, and the regulated fee",
  ru: "Что закон говорит о каждом нотариальном действии: кто вправе, что требуется и какова установленная плата",
  ar: "ماذا يقول القانون عن كل عمل توثيقي: من يحق له، وما المطلوب، وما الأجر المحدد",
  fr: "Ce que dit la loi sur chaque acte notarié : qui peut l'accomplir, ce qu'il exige et les honoraires réglementés",
  es: "Lo que dice la ley sobre cada acto notarial: quién puede realizarlo, qué exige y el arancel fijado",
};

const SUBTITLE: Record<Lang, string> = {
  he: "מידע של משרד עורכי הדין BEITON, עם ציטוט וקישור לכל סעיף. האתר אינו מציע ביצוע של פעולה נוטריונית, ואינו ייעוץ משפטי.",
  en: "Information from the BEITON law office, with a quote and a link for each section. The site does not offer to perform a notarial act, and it is not legal advice.",
  ru: "Информация адвокатской конторы BEITON, с цитатой и ссылкой для каждой статьи. Сайт не предлагает совершить нотариальное действие и не является юридической консультацией.",
  ar: "معلومات من مكتب المحاماة BEITON، مع اقتباس ورابط لكل بند. لا يعرض الموقع تنفيذ عمل توثيقي، وليس استشارة قانونية.",
  fr: "Informations du cabinet d'avocats BEITON, avec une citation et un lien pour chaque article. Le site ne propose pas d'accomplir un acte notarié et ne constitue pas un conseil juridique.",
  es: "Información del despacho de abogados BEITON, con una cita y un enlace para cada artículo. El sitio no ofrece realizar un acto notarial y no constituye asesoramiento jurídico.",
};

const ACTS: Record<Lang, string> = {
  he: "לפעולות הנוטריוניות",
  en: "The notarial acts",
  ru: "Нотариальные действия",
  ar: "الأعمال التوثيقية",
  fr: "Les actes notariés",
  es: "Los actos notariales",
};

const BUTTON: Record<Lang, string> = {
  he: "שאלה כללית למשרד",
  en: "A general question to the office",
  ru: "Общий вопрос в офис",
  ar: "سؤال عام للمكتب",
  fr: "Une question générale au cabinet",
  es: "Una consulta general al despacho",
};

const PREFILL: Record<Lang, string> = {
  he: "שלום, הגעתי מאתר המידע על פעולות נוטריוניות, ויש לי שאלה כללית למשרד.",
  en: "Hello, I came from the information site on notarial acts and have a general question for the office.",
  ru: "Здравствуйте, я с информационного сайта о нотариальных действиях, и у меня общий вопрос к офису.",
  ar: "مرحبًا، وصلت من موقع المعلومات عن الأعمال التوثيقية، ولدي سؤال عام للمكتب.",
  fr: "Bonjour, je viens du site d'information sur les actes notariés et j'ai une question générale pour le cabinet.",
  es: "Hola, vengo del sitio de información sobre actos notariales y tengo una consulta general para el despacho.",
};

export default function HeroWhatsApp({ lang = "he" }: { lang?: Lang }) {
  const rtl = lang === "he" || lang === "ar";
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL[lang])}`;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        maxWidth: 600,
        margin: "0 auto",
        border: "1px solid #e8e6e1",
        borderRadius: 12,
        background: "#f5f4f1",
        padding: "28px 24px",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 500, color: "#1a1a1a", lineHeight: 1.6, marginBottom: 8 }}>
        {TITLE[lang]}
      </p>
      <p style={{ fontSize: 13, fontWeight: 300, color: "#6b6b6b", lineHeight: 1.7, marginBottom: 22 }}>
        {SUBTITLE[lang]}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <a
          href={`/${lang}#services`}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#1A1A1A", color: "#fff", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 500, textDecoration: "none" }}
        >
          {ACTS[lang]}
        </a>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContactClick("whatsapp")}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "transparent", color: "#1A1A1A", border: "1px solid #E8E6E1", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 400, textDecoration: "none" }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }} aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {BUTTON[lang]}
        </a>
      </div>
    </div>
  );
}

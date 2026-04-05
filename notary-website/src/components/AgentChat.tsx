"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { trackChatInteraction } from "@/lib/analytics";
import { getStoredUTM } from "@/lib/utm";

type Lang = "he" | "en" | "ru" | "ar" | "fr" | "es";

const PLACEHOLDERS: Record<Lang, string> = {
  he: "למשל: כמה עולה תרגום תעודת נישואין לאנגלית",
  en: "e.g.: How much to translate a marriage certificate to English",
  ru: "напр.: сколько стоит перевод свидетельства о браке на английский",
  ar: "مثال: كم تكلفة ترجمة شهادة زواج للإنجليزية",
  fr: "ex: combien pour traduire un acte de mariage en anglais",
  es: "ej: cuanto cuesta traducir un certificado de matrimonio al ingles",
};

const PLACEHOLDERS_ACTIVE: Record<Lang, string> = {
  he: "כתוב הודעה...",
  en: "Type a message...",
  ru: "Напишите сообщение...",
  ar: "اكتب رسالة...",
  fr: "Ecrire un message...",
  es: "Escribe un mensaje...",
};

const GREETINGS: Record<Lang, string> = {
  he: "היי! אני נועה מצוות הנוטריון. איך אפשר לעזור?",
  en: "Hello, how can I help? Feel free to ask about translation, signature authentication, apostille, or any other notary service.",
  ru: "Здравствуйте, чем могу помочь? Спрашивайте о переводе, заверении подписи, апостиле или любой другой нотариальной услуге.",
  ar: "مرحبا، كيف يمكنني مساعدتك؟ يمكنك السؤال عن الترجمة أو توثيق التوقيع أو الأبوستيل أو أي خدمة توثيقية أخرى.",
  fr: "Bonjour, comment puis-je vous aider? N'hesitez pas a poser vos questions sur nos services notaries.",
  es: "Hola, como puedo ayudarle? Pregunte sobre traduccion, autenticacion o cualquier servicio notarial.",
};

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function AgentChat({ lang = "he" }: { lang?: Lang }) {
  const rtl = lang === "he" || lang === "ar";
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETINGS[lang] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLang = useRef(lang);
  const savedRef = useRef(false);
  const mondayItemIdRef = useRef<string | null>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save transcript to Monday.com
  const saveTranscript = useCallback(() => {
    // Only save if there are user messages and not already saved
    const userMsgs = messages.filter((m) => m.role === "user");
    if (userMsgs.length === 0 || savedRef.current) return;
    savedRef.current = true;

    // Use sendBeacon for reliability (works even when page is closing)
    const payload = JSON.stringify({ messages, language: lang, itemId: mondayItemIdRef.current });
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/chat/save-transcript", blob);
    } else {
      fetch("/api/chat/save-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [messages, lang]);

  const nudgedRef = useRef(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset inactivity timer on every new message
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    nudgedRef.current = false;

    // After 5 min inactivity — send a proactive nudge message
    nudgeTimer.current = setTimeout(() => {
      if (nudgedRef.current || savedRef.current) return;
      nudgedRef.current = true;
      const nudgeMsg = lang === "he" ? "היי, עדיין כאן? אם תצטרך לעזוב — תשאיר טלפון ונציג יחזור אליך עם כל הפרטים."
        : lang === "ar" ? "مرحبا، لا تزال هنا؟ إذا احتجت للمغادرة — اترك رقم هاتف وسنعاود الاتصال بك."
        : lang === "ru" ? "Привет, вы ещё здесь? Если нужно уйти — оставьте телефон и мы перезвоним."
        : "Hi, are you still there? If you need to go, leave your phone number and we'll follow up with all the details.";
      setMessages(prev => [...prev, { role: "assistant", content: nudgeMsg }]);
    }, 5 * 60 * 1000); // 5 minutes

    // After 10 min total inactivity — save transcript
    inactivityTimer.current = setTimeout(() => {
      saveTranscript();
    }, 10 * 60 * 1000); // 10 minutes
  }, [saveTranscript, lang]);

  // Save on page leave / tab close
  useEffect(() => {
    const handleLeave = () => saveTranscript();
    window.addEventListener("beforeunload", handleLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleLeave();
    });
    return () => {
      window.removeEventListener("beforeunload", handleLeave);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    };
  }, [saveTranscript]);

  // Reset on language change (save current conversation first)
  useEffect(() => {
    if (lang !== prevLang.current) {
      saveTranscript();
      prevLang.current = lang;
      savedRef.current = false;
      setMessages([{ role: "assistant", content: GREETINGS[lang] }]);
      setInput("");
    }
  }, [lang, saveTranscript]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Msg = { role: "user", content: text };
    // Use functional update so concurrent sends always see the latest history
    let snapshot: Msg[] = [];
    setMessages((prev) => {
      snapshot = [...prev, userMsg];
      return snapshot;
    });
    const userMsgCount = snapshot.filter(m => m.role === "user").length;
    if (userMsgCount === 1) trackChatInteraction("opened");
    trackChatInteraction("message_sent", userMsgCount);

    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: snapshot, language: lang, utm: getStoredUTM() }),
      });
      const data = await resp.json();
      if (data.itemId) mondayItemIdRef.current = data.itemId;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "..." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            lang === "he"
              ? "מצטערים, אירעה שגיאה. אנא נסו שוב."
              : "Sorry, an error occurred. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      savedRef.current = false; // New messages added — allow re-save
      resetInactivityTimer();
    }
  }

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        maxWidth: 600,
        margin: "0 auto",
        border: "1px solid #e8e6e1",
        borderRadius: 12,
        overflow: "hidden",
        background: "#f5f4f1",
      }}
    >
      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          height: 280,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user"
                  ? rtl
                    ? "flex-start"
                    : "flex-end"
                  : rtl
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 16px",
                borderRadius: 12,
                fontSize: 13,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                ...(msg.role === "user"
                  ? {
                      background: "#1a1a1a",
                      color: "#fff",
                      borderBottomLeftRadius: rtl ? 12 : 4,
                      borderBottomRightRadius: rtl ? 4 : 12,
                    }
                  : {
                      background: "#f5f4f1",
                      color: "#1a1a1a",
                      borderBottomLeftRadius: rtl ? 4 : 12,
                      borderBottomRightRadius: rtl ? 12 : 4,
                    }),
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: rtl ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: "#f5f4f1",
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 13,
                color: "#999",
              }}
            >
              ...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: "1px solid #e8e6e1",
          padding: "10px 14px",
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "#ffffff",
        }}
      >
        {/* File upload button */}
        <label
          style={{
            background: "none",
            border: "none",
            padding: 4,
            color: "#999",
            flexShrink: 0,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: 6,
          }}
          title={rtl ? "העלאת קובץ" : "Upload file"}
        >
          <input
            type="file"
            accept="image/*,.pdf"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const name = file.name;
                setInput((prev) =>
                  prev ? `${prev} [${name}]` : `[${name}]`
                );
              }
              e.target.value = "";
            }}
          />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </label>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={messages.some(m => m.role === "user") ? PLACEHOLDERS_ACTIVE[lang] : PLACEHOLDERS[lang]}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 16, // 16px prevents iOS Safari auto-zoom on focus
            fontFamily: "inherit",
            color: "#1a1a1a",
            outline: "none",
            direction: rtl ? "rtl" : "ltr",
            padding: "7px 0",
          }}
        />

        {/* Send button */}
        <button
          onClick={send}
          disabled={!input.trim()}
          style={{
            background: "#1a1a1a",
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            opacity: !input.trim() ? 0.4 : 1,
            transition: "opacity .2s",
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, transform: rtl ? "scaleX(-1)" : "none" }}>
            <path d="M22 2L11 13" stroke="#fff" strokeWidth="1.5"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

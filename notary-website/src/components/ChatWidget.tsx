"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ChatWidget() {
  const t = useTranslations("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "assistant", text: t("greeting") },
  ]);

  function handleSend() {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setMessage("");
    // Placeholder — will connect to Agent 1 API
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "תודה! אני בודקת את הפרטים ואחזור אליך מיד 😊" },
      ]);
    }, 800);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="border border-brand-border rounded-2xl bg-brand-white overflow-hidden shadow-sm">
        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-dark text-white rounded-br-md"
                    : "bg-white border border-brand-border rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="border-t border-brand-border p-3 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("placeholder")}
            className="flex-1 px-4 py-2.5 text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-gray transition-colors"
          />
          <button
            onClick={handleSend}
            className="px-5 py-2.5 bg-brand-dark text-white text-sm rounded-xl hover:bg-brand-dark/90 transition-colors"
          >
            {t("send")}
          </button>
        </div>
      </div>
    </div>
  );
}

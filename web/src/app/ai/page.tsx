"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Laptop untuk Teknik Informatika budget 10 juta",
  "Laptop ringan untuk mahasiswa DKV",
  "Laptop gaming tapi bisa buat kuliah juga",
  "Laptop paling murah tapi cukup untuk kuliah",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, top_n: 10 }),
      });
      const data = await res.json();

      if (data.success && data.recommendation) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.recommendation }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.error || "Maaf, tidak bisa memproses permintaan. Pastikan database sudah ada laptop.",
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Gagal terhubung ke server." }]);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">AI Rekomendasi</h1>
      <p className="mb-6 text-gray-600">Tanyakan apa saja tentang laptop. AI kami bantu cari yang tepat.</p>

      {/* Quick prompts */}
      {messages.length === 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">Coba tanyakan:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="mb-4 min-h-[300px] space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              m.role === "user"
                ? "bg-primary-600 text-white"
                : "border border-gray-200 bg-white text-gray-900"
            }`}>
              <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
              Sedang berpikir...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Tulis pertanyaan kamu..."
          className="flex-1 rounded-xl border-0 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

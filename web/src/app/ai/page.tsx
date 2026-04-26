"use client";

import { useState, useEffect, useRef } from "react";
import { ErrorBoundary } from "@/components/ui";
import {
  isPuterLoaded,
  waitForPuter,
  chatWithPuter,
  isSignedInPuter,
  signInPuter,
  RECOMMENDED_MODELS,
} from "@/lib/puter";

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
  return (
    <ErrorBoundary>
      <AIPageContent />
    </ErrorBoundary>
  );
}

function AIPageContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [puterReady, setPuterReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-5-nano");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Puter status
  useEffect(() => {
    const checkPuter = async () => {
      const ready = await waitForPuter(15000);
      setPuterReady(ready);
      if (ready) {
        const isSignedIn = await isSignedInPuter();
        setSignedIn(isSignedIn);
      }
    };
    checkPuter();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignIn = async () => {
    try {
      await signInPuter();
      setSignedIn(true);
    } catch (e) {
      // Sign in failed silently
    }
  };

  const buildPrompt = (userQuery: string): string => {
    return `Kamu adalah asisten rekomendasi laptop untuk mahasiswa Indonesia bernama KulPik.

User bertanya: "${userQuery}"

Berikan rekomendasi laptop yang sesuai dengan format berikut:
1. Nama laptop lengkap
2. Alasan mengapa cocok untuk kebutuhan user
3. Kisaran harga dalam Rupiah (Rp)
4. Spesifikasi penting (CPU, RAM, Storage, GPU jika relevan)

Tips:
- Jika user menyebutkan jurusan, sesuaikan dengan kebutuhan software jurusan tersebut
- Jika user menyebutkan budget, rekomendasikan laptop dalam range budget tersebut
- Jika tidak ada budget yang disebutkan, berikan beberapa pilihan di berbagai range harga
- Sebutkan brand yang umum di Indonesia: ASUS, Lenovo, HP, Acer, Dell, MSI, Apple

Jawab dalam Bahasa Indonesia yang santai dan mudah dipahami. Maksimal 3-4 rekomendasi.`;
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (puterReady) {
        // Use Puter.js
        const prompt = buildPrompt(text);
        const response = await chatWithPuter(prompt, selectedModel);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      } else {
        // Fallback to API
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text, top_n: 10 }),
        });
        const data = await res.json();

        if (data.success && data.recommendation) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.recommendation }]);
        } else if (data.success && data.laptops?.length > 0) {
          const laptopList = data.laptops
            .slice(0, 5)
            .map(
              (l: any, i: number) =>
                `${i + 1}. ${l.full_name || l.name} (${l.brand}) - Rp ${(l.price_tokopedia || l.price || 0).toLocaleString("id-ID")}`
            )
            .join("\n");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Berikut beberapa laptop yang mungkin cocok:\n\n${laptopList}\n\nKlik "Lihat Detail" pada kartu laptop untuk info lebih lengkap.`,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.error || "Maaf, tidak bisa memproses permintaan. Coba lagi ya.",
            },
          ]);
        }
      }
    } catch (e: any) {
      // Chat error silently
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Terjadi kesalahan. Pastikan koneksi internet stabil dan coba lagi.",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">🤖</div>
        <h1 className="text-2xl font-bold text-white">Tanya AI KulPik</h1>
        <p className="mt-1 text-sm text-dark-300">
          Tanyakan kebutuhan laptop kamu, AI akan bantu rekomendasikan
        </p>

        {/* Puter Status */}
        <div className="mt-3 flex items-center justify-center gap-3">
          {!puterReady && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
              Memuat AI...
            </span>
          )}
          {puterReady && !signedIn && (
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary-500/30 bg-primary-600/20 px-3 py-1 text-xs text-primary-300 transition-colors hover:bg-primary-600/30"
            >
              🔑 Sign in untuk akses penuh
            </button>
          )}
          {puterReady && signedIn && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              ✅ Siap digunakan
            </span>
          )}

          {/* Model Selector */}
          {puterReady && (
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dark-600 bg-dark-800 px-3 py-1 text-xs text-dark-200 transition-colors hover:bg-dark-700"
              >
                🧠 {RECOMMENDED_MODELS.find((m) => m.id === selectedModel)?.name || selectedModel}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showModelSelector && (
                <div className="absolute right-0 top-full z-10 mt-1 w-56 overflow-hidden rounded-xl border border-dark-600 bg-dark-800 shadow-xl">
                  {RECOMMENDED_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelSelector(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-xs transition-colors hover:bg-dark-700 ${
                        selectedModel === model.id ? "text-primary-400" : "text-dark-200"
                      }`}
                    >
                      <span className="font-medium">{model.name}</span>
                      <span className="ml-1 text-dark-400">({model.provider})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        role="log"
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto pb-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 text-5xl opacity-50">💬</div>
            <p className="text-dark-300">Belum ada percakapan</p>
            <p className="mt-1 text-sm text-dark-400">Coba salah satu pertanyaan di bawah</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex animate-message-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "rounded-br-sm bg-primary-600 text-white"
                  : "rounded-bl-sm bg-dark-700 text-dark-100"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-dark-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-dark-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-dark-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-dark-400" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-dark-400">AI sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="mb-4" aria-label="Pertanyaan cepat">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dark-400">Pertanyaan cepat</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 rounded-full border border-dark-600 bg-dark-800 px-4 py-2 text-xs text-dark-200 transition-colors hover:border-primary-500 hover:bg-dark-700 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 rounded-2xl border border-dark-600 bg-dark-800 p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Tulis pertanyaan kamu..."
          className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder-dark-400 outline-none focus:ring-2 focus:ring-primary-500/50"
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          aria-label="Kirim pesan"
          className="rounded-xl bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

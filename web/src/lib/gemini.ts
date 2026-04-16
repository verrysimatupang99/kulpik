const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.0-flash";

interface GeminiResponse {
  candidates: {
    content: { parts: { text: string }[]; role: string };
    finishReason: string;
    index: number;
  }[];
}

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 2000
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Gemini API error: ${resp.status} - ${err}`);
    }
    const data: GeminiResponse = await resp.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak dapat menghasilkan rekomendasi.";
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

const SYSTEM_PROMPT = `Kamu adalah KulPik, asisten rekomendasi laptop untuk mahasiswa Indonesia.
Berikan 3-5 rekomendasi berdasarkan data yang diberikan. Jelaskan alasan, sertakan harga.
Gunakan bahasa Indonesia santai tapi informatif. Hanya rekomendasikan laptop dari data yang ada.`;

export async function generateRecommendation(userQuery: string, laptopContext: string): Promise<string> {
  return callGemini(SYSTEM_PROMPT, `Data laptop:\n${laptopContext}\n\nPertanyaan: ${userQuery}`, 2000);
}

export async function generateRecommendationForJurusan(params: {
  userQuery: string; jurusan?: string; budgetMin?: number; budgetMax?: number; laptopContext: string;
}): Promise<string> {
  const { userQuery, jurusan, budgetMin, budgetMax, laptopContext } = params;
  let q = userQuery;
  if (jurusan) q = `Laptop untuk mahasiswa ${jurusan}. ${q}`;
  if (budgetMax) q += ` Budget maksimal ${Math.round(budgetMax / 1_000_000)} juta.`;
  return generateRecommendation(q, laptopContext);
}

export async function checkGeminiHealth(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}?key=${GEMINI_API_KEY}`);
    return r.ok ? { available: true, model: GEMINI_MODEL } : { available: false, model: GEMINI_MODEL, error: `Status ${r.status}` };
  } catch (e) { return { available: false, model: GEMINI_MODEL, error: String(e) }; }
}

export { GEMINI_MODEL };

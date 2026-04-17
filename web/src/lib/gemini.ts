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
    if (!resp.ok) throw new Error(`Gemini API error: ${resp.status}`);
    const data: GeminiResponse = await resp.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak dapat menghasilkan rekomendasi.";
  } catch (e) {
    clearTimeout(timeoutId);
    throw e;
  }
}

// Build system prompt with database context
function buildSystemPrompt(stats?: { totalLaptops: number; totalBrands: number; priceMin: number; priceMax: number }): string {
  const dbInfo = stats
    ? `\nDatabase KulPik berisi ${stats.totalLaptops} laptop dari ${stats.totalBrands} brand.\nHarga range: Rp ${stats.priceMin.toLocaleString('id-ID')} - Rp ${stats.priceMax.toLocaleString('id-ID')}.`
    : '';

  return `Kamu adalah KulPik, asisten rekomendasi laptop untuk mahasiswa Indonesia.${dbInfo}

Aturan:
1. HANYA rekomendasikan laptop dari data yang diberikan
2. Jangan rekomendasikan laptop yang tidak ada di data
3. Jelaskan alasan rekomendasi dengan jelas
4. Sertakan harga dalam Rupiah
5. Gunakan bahasa Indonesia santai dan mudah dipahami
6. Maksimal 3-5 rekomendasi per respons

Format respons:
1. Nama laptop
2. Alasan cocok untuk kebutuhan user
3. Harga (dari data)
4. Spesifikasi penting (CPU, RAM, Storage, GPU)`;
}

// Build user prompt with laptop context
function buildUserPrompt(
  query: string,
  laptops: any[],
  jurusan?: string,
  budgetMin?: number,
  budgetMax?: number
): string {
  const laptopList = laptops.map((l, i) => {
    const price = l.price_tokopedia || l.price || 0;
    const specs = [
      l.cpu_model ? `CPU: ${l.cpu_model}` : '',
      l.ram_gb ? `RAM: ${l.ram_gb}GB` : '',
      l.storage_gb ? `Storage: ${l.storage_gb}GB` : '',
      l.gpu_model ? `GPU: ${l.gpu_model}` : (l.gpu_type === 'dedicated' ? 'GPU: Dedicated' : ''),
      l.screen_inches ? `Screen: ${l.screen_inches}"` : '',
    ].filter(Boolean).join(' | ');

    return `${i + 1}. ${l.full_name || l.name} (${l.brand || 'Unknown'})
   Harga: Rp ${price.toLocaleString('id-ID')}
   ${specs}`;
  }).join('\n\n');

  let context = '';
  if (jurusan) context += `\nJurusan: ${jurusan}`;
  if (budgetMin || budgetMax) {
    context += `\nBudget: ${budgetMin ? `Rp ${budgetMin.toLocaleString('id-ID')}` : 'min'} - ${budgetMax ? `Rp ${budgetMax.toLocaleString('id-ID')}` : 'max'}`;
  }

  return `Data laptop dari database KulPik:
${laptopList}
${context}

Pertanyaan user: "${query}"

Berikan rekomendasi berdasarkan data di atas. Jelaskan mengapa laptop tersebut cocok untuk kebutuhan user.`;
}

export async function generateRecommendation(
  userQuery: string,
  laptopContext: string,
  stats?: { totalLaptops: number; totalBrands: number; priceMin: number; priceMax: number }
): Promise<string> {
  const systemPrompt = buildSystemPrompt(stats);
  return callGemini(systemPrompt, `Data laptop:\n${laptopContext}\n\nPertanyaan: ${userQuery}`, 2000);
}

export async function generateRecommendationForJurusan(params: {
  userQuery: string;
  jurusan?: string;
  budgetMin?: number;
  budgetMax?: number;
  laptopContext: string;
  stats?: { totalLaptops: number; totalBrands: number; priceMin: number; priceMax: number };
}): Promise<string> {
  const { userQuery, jurusan, budgetMin, budgetMax, laptopContext, stats } = params;
  const systemPrompt = buildSystemPrompt(stats);
  const userPrompt = buildUserPrompt(userQuery, [], jurusan, budgetMin, budgetMax);
  return callGemini(systemPrompt, `Data laptop:\n${laptopContext}\n\n${userPrompt}`, 2500);
}

// Export helper functions for use in API routes
export { buildSystemPrompt, buildUserPrompt };

// Health check
export async function checkGeminiHealth(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}?key=${GEMINI_API_KEY}`);
    return r.ok ? { available: true, model: GEMINI_MODEL } : { available: false, model: GEMINI_MODEL, error: `Status ${r.status}` };
  } catch (e) {
    return { available: false, model: GEMINI_MODEL, error: String(e) };
  }
}

export { GEMINI_MODEL };

/**
 * NanoGPT Client for KulPik
 * Uses OpenAI-compatible API with custom header for trial access.
 * 
 * IMPORTANT: Always include 'x-client: goose' header for trial token access.
 * Without this header, trial users get 402 "Insufficient USD balance".
 */

const NANOGPT_API_KEY = process.env.NANOGPT_API_KEY || process.env.OPENAI_API_KEY || "";
const NANOGPT_BASE_URL = process.env.NANOGPT_BASE_URL || "https://nano-gpt.com/api/v1";
const NANOGPT_MODEL = process.env.NANOGPT_MODEL || "zai-org/glm-5";

interface NanoGPTMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface NanoGPTChoice {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
  index: number;
}

interface NanoGPTResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: NanoGPTChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface RecommendationParams {
  userQuery: string;
  jurusan?: string;
  budgetMin?: number;
  budgetMax?: number;
  laptopContext: string;
  model?: string;
}

interface LaptopData {
  name: string;
  brand: string;
  price: number;
  specs: {
    cpu_model?: string;
    cpu_benchmark?: number;
    ram_gb?: number;
    storage_gb?: number;
    gpu_model?: string;
    gpu_type?: string;
    screen_inches?: number;
    weight_kg?: number;
  };
  source_url?: string;
}

/**
 * Generate recommendation using NanoGPT
 */
export async function generateRecommendation(
  userQuery: string,
  laptopContext: string,
  model: string = NANOGPT_MODEL
): Promise<string> {
  const messages: NanoGPTMessage[] = [
    {
      role: "system",
      content: `Kamu adalah KulPik, asisten rekomendasi laptop untuk mahasiswa Indonesia.

Tugasmu:
- Berikan 3 rekomendasi laptop berdasarkan data yang diberikan
- Jelaskan alasan setiap rekomendasi (cocok untuk jurusan apa, kenapa)
- Sertakan harga dan link beli jika ada
- Gunakan bahasa Indonesia yang santai tapi informatif
- Format output dengan numbering yang jelas

Format output:
1. [Nama Laptop]
   - Harga: Rp X.XXX.XXX
   - Keunggulan: ...
   - Cocok untuk: [jurusan/penggunaan]
   - Link: [url jika ada]

2. [dst...]

Penting: Hanya rekomendasikan laptop yang ada dalam data yang diberikan. Jangan mengarang laptop yang tidak ada.`,
    },
    {
      role: "user",
      content: `Data laptop yang tersedia:
${laptopContext}

Pertanyaan user: ${userQuery}`,
    },
  ];

  try {
    // Add 30 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`${NANOGPT_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NANOGPT_API_KEY}`,
        "x-client": "goose", // REQUIRED for trial token access
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error(`NanoGPT API error: ${response.status} - ${error}`);
      throw new Error(`NanoGPT API error: ${response.status} - ${error}`);
    }

    const data: NanoGPTResponse = await response.json();
    return data.choices[0]?.message?.content || "Tidak dapat menghasilkan rekomendasi.";
  } catch (error) {
    console.error("NanoGPT generation failed:", error);
    throw error;
  }
}

/**
 * Generate recommendation with structured parameters
 */
export async function generateRecommendationForJurusan(
  params: RecommendationParams
): Promise<string> {
  const { userQuery, jurusan, budgetMin, budgetMax, laptopContext, model } = params;

  // Build query from parameters
  let fullQuery = userQuery;
  if (jurusan) {
    fullQuery = `Laptop untuk mahasiswa ${jurusan}. ${fullQuery}`;
  }
  if (budgetMax) {
    const budgetJuta = Math.round(budgetMax / 1000000);
    fullQuery += ` Budget maksimal ${budgetJuta} juta rupiah.`;
  }
  if (budgetMin) {
    const budgetJuta = Math.round(budgetMin / 1000000);
    fullQuery += ` Budget minimal ${budgetJuta} juta rupiah.`;
  }

  return generateRecommendation(fullQuery, laptopContext, model);
}

/**
 * Generate quick comparison between laptops
 */
export async function generateComparison(
  laptops: LaptopData[],
  criteria: string = "performa dan harga"
): Promise<string> {
  const laptopContext = laptops
    .map((l, i) => {
      const specs = Object.entries(l.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      return `${i + 1}. ${l.name} (${l.brand}) - Rp ${l.price?.toLocaleString("id-ID") || "N/A"} - ${specs}`;
    })
    .join("\n");

  const messages: NanoGPTMessage[] = [
    {
      role: "system",
      content: `Kamu adalah KulPik, asisten perbandingan laptop.

Tugasmu:
- Bandingkan laptop yang diberikan berdasarkan kriteria
- Berikan kelebihan dan kekurangan masing-masing
- Berikan rekomendasi akhir
- Gunakan bahasa Indonesia yang jelas dan informatif`,
    },
    {
      role: "user",
      content: `Bandingkan laptop berikut berdasarkan ${criteria}:

${laptopContext}

Berikan analisis perbandingan yang detail.`,
    },
  ];

  try {
    const response = await fetch(`${NANOGPT_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NANOGPT_API_KEY}`,
        "x-client": "goose",
      },
      body: JSON.stringify({
        model: NANOGPT_MODEL,
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`NanoGPT API error: ${response.status} - ${error}`);
    }

    const data: NanoGPTResponse = await response.json();
    return data.choices[0]?.message?.content || "Tidak dapat menghasilkan perbandingan.";
  } catch (error) {
    console.error("NanoGPT comparison failed:", error);
    throw error;
  }
}

/**
 * Generate explanation for why a laptop fits a jurusan
 */
export async function generateJurusanExplanation(
  laptop: LaptopData,
  jurusan: string,
  requirements: {
    minRam?: number;
    minStorage?: number;
    needGpu?: boolean;
    needColorAccuracy?: boolean;
    needLightweight?: boolean;
  } = {}
): Promise<string> {
  const specs = Object.entries(laptop.specs)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const requirementsText = Object.entries(requirements)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const messages: NanoGPTMessage[] = [
    {
      role: "system",
      content: `Kamu adalah KulPik, asisten rekomendasi laptop.

Tugasmu:
- Jelaskan mengapa laptop ini cocok/tidak cocok untuk jurusan tertentu
- Pertimbangkan spesifikasi laptop dengan kebutuhan jurusan
- Berikan saran jika ada yang perlu ditingkatkan
- Gunakan bahasa Indonesia yang mudah dipahami`,
    },
    {
      role: "user",
      content: `Laptop:
- Nama: ${laptop.name}
- Brand: ${laptop.brand}
- Harga: Rp ${laptop.price?.toLocaleString("id-ID") || "N/A"}
- Spesifikasi: ${specs}

Jurusan: ${jurusan}

Kebutuhan jurusan:
${requirementsText || "Tidak ada kebutuhan khusus"}

Apakah laptop ini cocok untuk jurusan ${jurusan}? Jelaskan mengapa.`,
    },
  ];

  try {
    const response = await fetch(`${NANOGPT_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NANOGPT_API_KEY}`,
        "x-client": "goose",
      },
      body: JSON.stringify({
        model: NANOGPT_MODEL,
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`NanoGPT API error: ${response.status} - ${error}`);
    }

    const data: NanoGPTResponse = await response.json();
    return data.choices[0]?.message?.content || "Tidak dapat menghasilkan penjelasan.";
  } catch (error) {
    console.error("NanoGPT explanation failed:", error);
    throw error;
  }
}

/**
 * Check if NanoGPT is available
 */
export async function checkNanoGPTHealth(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    const response = await fetch(`${NANOGPT_BASE_URL}/models`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${NANOGPT_API_KEY}`,
        "x-client": "goose",
      },
    });

    if (!response.ok) {
      return {
        available: false,
        model: NANOGPT_MODEL,
        error: `API returned ${response.status}`,
      };
    }

    return {
      available: true,
      model: NANOGPT_MODEL,
    };
  } catch (error) {
    return {
      available: false,
      model: NANOGPT_MODEL,
      error: String(error),
    };
  }
}

export { NANOGPT_MODEL, NANOGPT_BASE_URL };
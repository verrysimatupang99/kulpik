/**
 * Vector Search Client for KulPik
 * Uses Supabase pgvector for semantic search
 */

import { supabase } from "./supabase";

const COHERE_API_KEY = process.env.COHERE_API_KEY || "";
const COHERE_EMBED_MODEL = "embed-v4.0";

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: number;
  specs: Record<string, unknown>;
  similarity: number;
}

interface EmbeddingResponse {
  embeddings: {
    float: number[][];
  };
}

/**
 * Generate embedding for a text query using Cohere API
 */
export async function generateQueryEmbedding(text: string): Promise<number[] | null> {
  if (!COHERE_API_KEY) {
    console.error("COHERE_API_KEY not set");
    return null;
  }

  try {
    const response = await fetch("https://api.cohere.ai/v2/embed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${COHERE_API_KEY}`,
      },
      body: JSON.stringify({
        texts: [text],
        model: COHERE_EMBED_MODEL,
        input_type: "search_query",
        embedding_types: ["float"],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Cohere API error: ${response.status} - ${error}`);
      return null;
    }

    const data: EmbeddingResponse = await response.json();
    return data.embeddings.float[0] || null;
  } catch (error) {
    console.error("Failed to generate embedding:", error);
    return null;
  }
}

/**
 * Search laptops using vector similarity
 * Requires pgvector extension and embeddings to be generated
 */
export async function searchLaptopsByVector(
  query: string,
  options: {
    matchCount?: number;
    similarityThreshold?: number;
  } = {}
): Promise<SearchResult[]> {
  const { matchCount = 20, similarityThreshold = 0.5 } = options;

  // Generate embedding for query
  const embedding = await generateQueryEmbedding(query);
  if (!embedding) {
    console.warn("Failed to generate embedding, falling back to text search");
    return searchLaptopsByText(query, matchCount);
  }

  try {
    // Call the pgvector search function
    const { data, error } = await supabase.rpc("search_laptops_by_embedding", {
      query_embedding: embedding,
      match_count: matchCount,
      similarity_threshold: similarityThreshold,
    });

    if (error) {
      console.error("Vector search error:", error);
      // Fall back to text search
      return searchLaptopsByText(query, matchCount);
    }

    return data || [];
  } catch (error) {
    console.error("Vector search failed:", error);
    return searchLaptopsByText(query, matchCount);
  }
}

/**
 * Search laptops using text matching (fallback)
 */
export async function searchLaptopsByText(
  query: string,
  limit: number = 20
): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.rpc("search_laptops_by_text", {
      search_text: query,
      match_count: limit,
    });

    if (error) {
      console.error("Text search error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Text search failed:", error);
    return [];
  }
}

/**
 * Hybrid search combining vector and keyword search
 */
export async function hybridSearchLaptops(
  query: string,
  keywords: string[],
  options: {
    matchCount?: number;
    vectorWeight?: number;
  } = {}
): Promise<SearchResult[]> {
  const { matchCount = 20, vectorWeight = 0.7 } = options;

  // Generate embedding
  const embedding = await generateQueryEmbedding(query);
  if (!embedding) {
    return searchLaptopsByText(query, matchCount);
  }

  try {
    const { data, error } = await supabase.rpc("hybrid_search_laptops", {
      query_embedding: embedding,
      search_keywords: keywords,
      match_count: matchCount,
      vector_weight: vectorWeight,
    });

    if (error) {
      console.error("Hybrid search error:", error);
      return searchLaptopsByText(query, matchCount);
    }

    return data || [];
  } catch (error) {
    console.error("Hybrid search failed:", error);
    return searchLaptopsByText(query, matchCount);
  }
}

/**
 * Get similar laptops to a specific laptop
 */
export async function getSimilarLaptops(
  laptopId: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.rpc("get_similar_laptops", {
      laptop_id: laptopId,
      match_count: limit,
    });

    if (error) {
      console.error("Similar laptops error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Get similar laptops failed:", error);
    return [];
  }
}

/**
 * Check if vector search is available
 */
export async function checkVectorSearchAvailability(): Promise<{
  available: boolean;
  totalLaptops: number;
  laptopsWithEmbeddings: number;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.rpc("count_laptops_with_embeddings");

    if (error) {
      return {
        available: false,
        totalLaptops: 0,
        laptopsWithEmbeddings: 0,
        error: error.message,
      };
    }

    const result = data?.[0] || { total_laptops: 0, with_embeddings: 0 };

    return {
      available: result.with_embeddings > 0,
      totalLaptops: result.total_laptops,
      laptopsWithEmbeddings: result.with_embeddings,
    };
  } catch (error) {
    return {
      available: false,
      totalLaptops: 0,
      laptopsWithEmbeddings: 0,
      error: String(error),
    };
  }
}

export type { SearchResult };
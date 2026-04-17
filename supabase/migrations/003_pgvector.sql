-- KulPik pgvector Migration
-- PostgreSQL via Supabase
-- Migration: 003_pgvector
-- Stack v2: Enable vector embeddings for semantic search

-- ============================================
-- 1. Enable pgvector Extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 2. Add Embedding Column to Laptops Table
-- ============================================
ALTER TABLE laptops ADD COLUMN IF NOT EXISTS embedding vector(1024);

-- ============================================
-- 3. Create Vector Index for Fast Similarity Search
-- ============================================
-- IVFFlat index is good for larger datasets (>1000 rows)
-- For smaller datasets, you can use hnsw which is faster
CREATE INDEX IF NOT EXISTS laptops_embedding_idx 
ON laptops USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Comment on the index
COMMENT ON INDEX laptops_embedding_idx IS 
'Index for fast cosine similarity search on laptop embeddings (1024-dim Cohere embed-v4.0)';

-- ============================================
-- 4. Function: Search Laptops by Embedding
-- ============================================
CREATE OR REPLACE FUNCTION search_laptops_by_embedding(
    query_embedding vector(1024),
    match_count int DEFAULT 20,
    similarity_threshold float DEFAULT 0.7
)
RETURNS TABLE (
    id uuid,
    name text,
    brand text,
    price integer,
    specs jsonb,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.full_name as name,
        l.brand,
        COALESCE(l.price_tokopedia, l.price_shopee, l.price_official, 0)::integer as price,
        jsonb_build_object(
            'cpu_model', l.cpu_model,
            'cpu_benchmark', l.cpu_benchmark,
            'ram_gb', l.ram_gb,
            'storage_gb', l.storage_gb,
            'gpu_model', l.gpu_model,
            'gpu_type', l.gpu_type,
            'screen_inches', l.screen_inches,
            'weight_kg', l.weight_kg
        ) as specs,
        (1 - (l.embedding <=> query_embedding))::float AS similarity
    FROM laptops l
    WHERE l.embedding IS NOT NULL
      AND (1 - (l.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY l.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_laptops_by_embedding IS 
'Search laptops using vector similarity. Returns laptops with similarity >= threshold, sorted by relevance.';

-- ============================================
-- 5. Function: Search Laptops by Text (via embedding)
-- ============================================
CREATE OR REPLACE FUNCTION search_laptops_by_text(
    search_text text,
    match_count int DEFAULT 20
)
RETURNS TABLE (
    id uuid,
    name text,
    brand text,
    price integer,
    specs jsonb,
    similarity float
) AS $$
BEGIN
    -- This function expects the embedding to be generated client-side
    -- For now, we fall back to full-text search if no embedding is provided
    RETURN QUERY
    SELECT 
        l.id,
        l.full_name as name,
        l.brand,
        COALESCE(l.price_tokopedia, l.price_shopee, l.price_official, 0)::integer as price,
        jsonb_build_object(
            'cpu_model', l.cpu_model,
            'cpu_benchmark', l.cpu_benchmark,
            'ram_gb', l.ram_gb,
            'storage_gb', l.storage_gb,
            'gpu_model', l.gpu_model,
            'gpu_type', l.gpu_type,
            'screen_inches', l.screen_inches,
            'weight_kg', l.weight_kg
        ) as specs,
        0.0::float AS similarity
    FROM laptops l
    WHERE 
        l.full_name ILIKE '%' || search_text || '%'
        OR l.brand ILIKE '%' || search_text || '%'
        OR l.cpu_model ILIKE '%' || search_text || '%'
        OR l.gpu_model ILIKE '%' || search_text || '%'
    ORDER BY l.full_name
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Function: Hybrid Search (Vector + Keyword)
-- ============================================
CREATE OR REPLACE FUNCTION hybrid_search_laptops(
    query_embedding vector(1024),
    search_keywords text[],
    match_count int DEFAULT 20,
    vector_weight float DEFAULT 0.7
)
RETURNS TABLE (
    id uuid,
    name text,
    brand text,
    price integer,
    specs jsonb,
    vector_similarity float,
    keyword_score float,
    combined_score float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.full_name as name,
        l.brand,
        COALESCE(l.price_tokopedia, l.price_shopee, l.price_official, 0)::integer as price,
        jsonb_build_object(
            'cpu_model', l.cpu_model,
            'cpu_benchmark', l.cpu_benchmark,
            'ram_gb', l.ram_gb,
            'storage_gb', l.storage_gb,
            'gpu_model', l.gpu_model,
            'gpu_type', l.gpu_type,
            'screen_inches', l.screen_inches,
            'weight_kg', l.weight_kg
        ) as specs,
        (1 - (l.embedding <=> query_embedding))::float AS vector_similarity,
        (
            -- Simple keyword matching score
            CASE 
                WHEN l.full_name ILIKE ANY(search_keywords) THEN 1.0
                WHEN l.brand ILIKE ANY(search_keywords) THEN 0.8
                WHEN l.cpu_model ILIKE ANY(search_keywords) THEN 0.6
                WHEN l.gpu_model ILIKE ANY(search_keywords) THEN 0.6
                ELSE 0.0
            END
        )::float AS keyword_score,
        (
            -- Combined weighted score
            vector_weight * (1 - (l.embedding <=> query_embedding)) +
            (1 - vector_weight) * (
                CASE 
                    WHEN l.full_name ILIKE ANY(search_keywords) THEN 1.0
                    WHEN l.brand ILIKE ANY(search_keywords) THEN 0.8
                    WHEN l.cpu_model ILIKE ANY(search_keywords) THEN 0.6
                    WHEN l.gpu_model ILIKE ANY(search_keywords) THEN 0.6
                    ELSE 0.0
                END
            )
        )::float AS combined_score
    FROM laptops l
    WHERE l.embedding IS NOT NULL
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. Function: Get Similar Laptops
-- ============================================
CREATE OR REPLACE FUNCTION get_similar_laptops(
    laptop_id uuid,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    name text,
    brand text,
    price integer,
    similarity float
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l2.id,
        l2.full_name as name,
        l2.brand,
        COALESCE(l2.price_tokopedia, l2.price_shopee, l2.price_official, 0)::integer as price,
        (1 - (l2.embedding <=> l1.embedding))::float AS similarity
    FROM laptops l1
    JOIN laptops l2 ON l1.id != l2.id
    WHERE l1.id = laptop_id
      AND l1.embedding IS NOT NULL
      AND l2.embedding IS NOT NULL
    ORDER BY l2.embedding <=> l1.embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. Grant Permissions
-- ============================================
-- Allow authenticated users to use vector search functions
GRANT EXECUTE ON FUNCTION search_laptops_by_embedding TO authenticated;
GRANT EXECUTE ON FUNCTION search_laptops_by_text TO authenticated;
GRANT EXECUTE ON FUNCTION hybrid_search_laptops TO authenticated;
GRANT EXECUTE ON FUNCTION get_similar_laptops TO authenticated;

-- Allow anon users (public) to search
GRANT EXECUTE ON FUNCTION search_laptops_by_embedding TO anon;
GRANT EXECUTE ON FUNCTION search_laptops_by_text TO anon;
GRANT EXECUTE ON FUNCTION hybrid_search_laptops TO anon;
GRANT EXECUTE ON FUNCTION get_similar_laptops TO anon;

-- ============================================
-- 9. Add RLS Policy for Embedding Updates
-- ============================================
-- Allow authenticated users to update embeddings
CREATE POLICY "Allow authenticated users to update embeddings"
    ON laptops FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 10. Utility: Count Laptops with Embeddings
-- ============================================
CREATE OR REPLACE FUNCTION count_laptops_with_embeddings()
RETURNS TABLE (
    total_laptops bigint,
    with_embeddings bigint,
    without_embeddings bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_laptops,
        COUNT(embedding)::bigint as with_embeddings,
        COUNT(*) - COUNT(embedding)::bigint as without_embeddings
    FROM laptops;
END;
$$ LANGUAGE plpgsql;

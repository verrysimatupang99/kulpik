#!/usr/bin/env python3
"""
Test script for KulPik Vector Search
Tests the end-to-end vector search flow
"""

import os
import sys
from dotenv import load_dotenv

# Load environment
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")

def test_vector_search():
    """Test vector search end-to-end"""
    print("=" * 60)
    print("🔍 KulPik Vector Search Test")
    print("=" * 60)
    print()

    # Check environment
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set")
        return False

    if not COHERE_API_KEY:
        print("❌ COHERE_API_KEY not set")
        return False

    print("✅ Environment variables OK")
    print()

    try:
        from supabase import create_client
        import cohere
        import requests
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip install supabase cohere")
        return False

    # Connect to Supabase
    print("📡 Connecting to Supabase...")
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Connected to Supabase")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return False

    # Check if laptops table has data
    print()
    print("📊 Checking laptops table...")
    try:
        result = supabase.table("laptops").select("id, full_name, embedding").execute()
        laptops = result.data or []
        total = len(laptops)
        with_embeddings = len([l for l in laptops if l.get("embedding") is not None])
        print(f"   Total laptops: {total}")
        print(f"   With embeddings: {with_embeddings}")
        print(f"   Without embeddings: {total - with_embeddings}")
    except Exception as e:
        print(f"❌ Failed to query laptops: {e}")
        return False

    # Test embedding generation with Cohere
    print()
    print("🧠 Testing Cohere embedding generation...")
    try:
        co = cohere.Client(COHERE_API_KEY)
        test_query = "laptop untuk mahasiswa teknik informatika budget 10 juta"
        response = co.embed(
            texts=[test_query],
            model="embed-v4.0",
            input_type="search_query",
            embedding_types=["float"]
        )
        embedding = response.embeddings.float_[0]
        print(f"   Query: {test_query}")
        print(f"   Embedding dimensions: {len(embedding)}")
        print("✅ Embedding generation works")
    except Exception as e:
        print(f"❌ Cohere embedding failed: {e}")
        return False

    # Test vector search RPC
    print()
    print("🔎 Testing vector search RPC...")
    try:
        # First check if the RPC function exists
        rpc_result = supabase.rpc(
            "search_laptops_by_embedding",
            {
                "query_embedding": embedding,
                "match_count": 5,
                "similarity_threshold": 0.5
            }
        ).execute()

        results = rpc_result.data or []
        print(f"   Found {len(results)} results")

        for i, r in enumerate(results[:3]):
            name = r.get("name", "Unknown")
            similarity = r.get("similarity", 0)
            print(f"   {i+1}. {name} (similarity: {similarity:.3f})")

        print("✅ Vector search RPC works")
    except Exception as e:
        print(f"❌ Vector search RPC failed: {e}")
        print("   Make sure the RPC function exists in Supabase")
        print("   Run migration: 003_pgvector.sql")
        return False

    # Test hybrid search if available
    print()
    print("🔀 Testing hybrid search...")
    try:
        hybrid_result = supabase.rpc(
            "hybrid_search_laptops",
            {
                "query_text": test_query,
                "query_embedding": embedding,
                "match_count": 5,
                "vector_weight": 0.7
            }
        ).execute()

        hybrid_results = hybrid_result.data or []
        print(f"   Found {len(hybrid_results)} hybrid results")

        for i, r in enumerate(hybrid_results[:3]):
            name = r.get("name", "Unknown")
            vs = r.get("vector_similarity", 0)
            ks = r.get("keyword_score", 0)
            print(f"   {i+1}. {name} (vector: {vs:.3f}, keyword: {ks:.3f})")

        print("✅ Hybrid search works")
    except Exception as e:
        print(f"⚠️  Hybrid search not available: {e}")
        print("   This is optional, vector search still works")

    print()
    print("=" * 60)
    print("✅ Vector Search Test Complete!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_vector_search()
    sys.exit(0 if success else 1)

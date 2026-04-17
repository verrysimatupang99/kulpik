"""
KulPik Vector Search Module
Provides semantic search functionality using pgvector and Cohere embeddings
"""

import os
from typing import Optional

from loguru import logger

# Try to import supabase
try:
    from supabase import create_client, Client
    from supabase.client import ClientOptions
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    logger.warning("supabase not installed. Run: pip install supabase")

# Try to import Cohere for query embedding
try:
    import cohere
    COHERE_AVAILABLE = True
except ImportError:
    COHERE_AVAILABLE = False
    logger.warning("cohere not installed. Run: pip install cohere")


class VectorSearch:
    """
    Vector search implementation using pgvector and Cohere.
    
    Features:
    - Semantic search using embeddings
    - Hybrid search (vector + keyword)
    - Similar laptop recommendations
    """
    
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        """Initialize with Supabase credentials."""
        self.supabase: Optional[Client] = None
        
        # Try to load from environment if not provided
        supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        supabase_key = supabase_key or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if supabase_url and supabase_key:
            if SUPABASE_AVAILABLE:
                self.supabase = create_client(supabase_url, supabase_key)
                logger.info(f"✅ Connected to Supabase: {supabase_url}")
            else:
                logger.error("Supabase client not available")
        else:
            logger.warning("Supabase credentials not provided. Some features may not work.")
        
        # Initialize Cohere client for query embeddings
        self.cohere_client = None
        if COHERE_AVAILABLE:
            cohere_key = os.getenv("COHERE_API_KEY")
            if cohere_key:
                self.cohere_client = cohere.Client(cohere_key)
                logger.info("✅ Cohere client initialized for query embeddings")
            else:
                logger.warning("COHERE_API_KEY not set. Query embeddings will fail.")
        else:
            logger.warning("Cohere not available. Query embeddings will fail.")
    
    def embed_query(self, query: str) -> Optional[list[float]]:
        """Generate embedding for a search query."""
        if not self.cohere_client:
            logger.error("❌ Cohere client not available")
            return None
        
        try:
            response = self.cohere_client.embed(
                texts=[query],
                model="embed-v4.0",
                input_type="search_query",
                embedding_types=["float"],
            )
            
            embedding = response.embeddings.float_[0] if response.embeddings.float_ else None
            
            if embedding:
                logger.success(f"✅ Generated query embedding ({len(embedding)} dimensions)")
                return embedding
            else:
                logger.error("❌ Failed to generate query embedding")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error generating query embedding: {e}")
            return None
    
    def search_by_embedding(
        self, 
        query_embedding: list[float], 
        match_count: int = 20,
        similarity_threshold: float = 0.7
    ) -> list[dict]:
        """
        Search laptops by embedding using pgvector.
        
        Args:
            query_embedding: Embedding vector from query
            match_count: Max number of results
            similarity_threshold: Minimum similarity (0-1)
        
        Returns:
            List of laptops with similarity scores
        """
        if not self.supabase:
            logger.error("❌ Supabase client not available")
            return []
        
        try:
            # Use the PostgreSQL function for vector search
            result = self.supabase.rpc(
                "search_laptops_by_embedding",
                {
                    "query_embedding": query_embedding,
                    "match_count": match_count,
                    "similarity_threshold": similarity_threshold
                }
            ).execute()
            
            laptops = result.data or []
            logger.info(f"✅ Search by embedding found {len(laptops)} laptops")
            
            return laptops
            
        except Exception as e:
            logger.error(f"❌ Error searching by embedding: {e}")
            return []
    
    def search_by_text(
        self, 
        query: str, 
        match_count: int = 20,
        use_hybrid: bool = True
    ) -> list[dict]:
        """
        Search laptops by natural language text.
        
        Args:
            query: Natural language search query
            match_count: Max number of results
            use_hybrid: Use hybrid search (vector + keyword) if True
        
        Returns:
            List of laptops with relevance scores
        """
        # Step 1: Generate query embedding
        query_embedding = self.embed_query(query)
        if not query_embedding:
            # Fallback to keyword search
            logger.warning("⚠️  Falling back to keyword search")
            return self._keyword_search(query, match_count)
        
        # Step 2: Search
        if use_hybrid:
            return self._hybrid_search(query_embedding, query, match_count)
        else:
            return self.search_by_embedding(query_embedding, match_count)
    
    def _hybrid_search(
        self, 
        query_embedding: list[float], 
        query_text: str,
        match_count: int = 20,
        vector_weight: float = 0.7
    ) -> list[dict]:
        """
        Hybrid search combining vector and keyword search.
        
        Usespostgresql function for hybrid search.
        """
        if not self.supabase:
            logger.error("❌ Supabase client not available")
            return []
        
        try:
            # Prepare keywords for PostgreSQL full-text search
            keywords = query_text.lower().split()
            
            result = self.supabase.rpc(
                "hybrid_search_laptops",
                {
                    "query_embedding": query_embedding,
                    "search_keywords": keywords,
                    "match_count": match_count,
                    "vector_weight": vector_weight
                }
            ).execute()
            
            laptops = result.data or []
            logger.info(f"✅ Hybrid search found {len(laptops)} laptops")
            
            return laptops
            
        except Exception as e:
            logger.error(f"❌ Error in hybrid search: {e}")
            return []
    
    def _keyword_search(self, query: str, match_count: int = 20) -> list[dict]:
        """Fallback keyword search when vector search is not available."""
        if not self.supabase:
            logger.error("❌ Supabase client not available")
            return []
        
        try:
            # Simple keyword search using ILIKE
            result = self.supabase.rpc(
                "search_laptops_by_text",
                {
                    "search_text": query,
                    "match_count": match_count
                }
            ).execute()
            
            laptops = result.data or []
            logger.info(f"✅ Keyword search found {len(laptops)} laptops")
            
            return laptops
            
        except Exception as e:
            logger.error(f"❌ Error in keyword search: {e}")
            return []
    
    def get_similar_laptops(self, laptop_id: str, match_count: int = 5) -> list[dict]:
        """Find similar laptops to a given laptop."""
        if not self.supabase:
            logger.error("❌ Supabase client not available")
            return []
        
        try:
            result = self.supabase.rpc(
                "get_similar_laptops",
                {
                    "laptop_id": laptop_id,
                    "match_count": match_count
                }
            ).execute()
            
            similar = result.data or []
            logger.info(f"✅ Found {len(similar)} similar laptops")
            
            return similar
            
        except Exception as e:
            logger.error(f"❌ Error getting similar laptops: {e}")
            return []
    
    def format_results(self, laptops: list[dict], format_type: str = "brief") -> list[dict]:
        """
        Format search results for API response.
        
        Args:
            laptops: Raw search results from pgvector
            format_type: "brief" or "detailed"
        
        Returns:
            Formatted results ready for API response
        """
        results = []
        
        for laptop in laptops:
            # Extract fields from pgvector stored procedure response
            result = {
                "id": laptop.get("id"),
                "name": laptop.get("name"),
                "brand": laptop.get("brand"),
                "price": laptop.get("price"),
                "specs": laptop.get("specs", {}),
                "similarity": laptop.get("similarity", 0)
            }
            
            # Extract price fields for compatibility
            if laptop.get("specs"):
                result["price_tokopedia"] = laptop["specs"].get("price_tokopedia")
                result["price_shopee"] = laptop["specs"].get("price_shopee")
                result["price_official"] = laptop["specs"].get("price_official")
            
            # Remove similarity key from specs if present
            if isinstance(result.get("specs"), dict):
                result["specs"].pop("similarity", None)
            
            results.append(result)
        
        # Sort by similarity
        results.sort(key=lambda x: x.get("similarity", 0), reverse=True)
        
        return results


def search_laptops(
    query: str,
    supabase_url: Optional[str] = None,
    supabase_key: Optional[str] = None,
    match_count: int = 20,
    use_hybrid: bool = True
) -> dict:
    """
    High-level search function for API routes.
    
    Args:
        query: Natural language search query
        supabase_url: Supabase project URL
        supabase_key: Supabase service role key
        match_count: Max number of results
        use_hybrid: Use hybrid search if True
    
    Returns:
        API response dict with success, laptops, count, and search_query
    """
    search = VectorSearch(supabase_url, supabase_key)
    
    if not search.supabase:
        return {
            "success": False,
            "error": "Supabase client not available. Check environment variables.",
            "laptops": [],
            "count": 0
        }
    
    try:
        # Perform search
        laptops = search.search_by_text(
            query,
            match_count=match_count,
            use_hybrid=use_hybrid
        )
        
        # Format results
        formatted = search.format_results(laptops)
        
        return {
            "success": True,
            "laptops": formatted,
            "count": len(formatted),
            "search_query": query
        }
        
    except Exception as e:
        logger.error(f"❌ Search failed: {e}")
        return {
            "success": False,
            "error": str(e),
            "laptops": [],
            "count": 0
        }


def get_recommendations(
    query: str,
    laptop_id: Optional[str] = None,
    supabase_url: Optional[str] = None,
    supabase_key: Optional[str] = None
) -> dict:
    """
    Get recommendations based on query or similar laptops.
    
    Args:
        query: Search query (if laptop_id not provided)
        laptop_id: Laptop ID to find similar to (if query not provided)
        supabase_url: Supabase project URL
        supabase_key: Supabase service role key
    
    Returns:
        API response dict
    """
    search = VectorSearch(supabase_url, supabase_key)
    
    if not search.supabase:
        return {
            "success": False,
            "error": "Supabase client not available. Check environment variables.",
            "recommendations": []
        }
    
    try:
        recommendations = []
        
        if laptop_id:
            # Get similar laptops
            similar = search.get_similar_laptops(laptop_id, match_count=5)
            recommendations = search.format_results(similar)
        elif query:
            # Search by query
            result = search.search_by_text(query, match_count=10)
            recommendations = search.format_results(result)
        else:
            return {
                "success": False,
                "error": "Either query or laptop_id must be provided",
                "recommendations": []
            }
        
        return {
            "success": True,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
        
    except Exception as e:
        logger.error(f"❌ Recommendations failed: {e}")
        return {
            "success": False,
            "error": str(e),
            "recommendations": []
        }


# Example usage
if __name__ == "__main__":
    import argparse
    from dotenv import load_dotenv
    
    parser = argparse.ArgumentParser(description="Vector Search for KulPik")
    parser.add_argument("--query", "-q", type=str, help="Search query")
    parser.add_argument("--laptop-id", "-l", type=str, help="Laptop ID for similar recommendations")
    parser.add_argument("--count", "-c", type=int, default=20, help="Max results")
    
    args = parser.parse_args()
    
    load_dotenv()
    
    # Initialize search
    search = VectorSearch()
    
    if not search.supabase:
        print("❌ Supabase client not available. Check your .env file.")
        exit(1)
    
    # Perform search
    if args.query:
        result = search.search_by_text(args.query, match_count=args.count)
        formatted = search.format_results(result)
        
        print(f"\n🔍 Search results for: '{args.query}'")
        print(f"📊 Found: {len(formatted)} laptops\n")
        
        for i, laptop in enumerate(formatted[:10], 1):
            print(f"{i}. {laptop['name']} ({laptop['brand']})")
            print(f"   Price: Rp {laptop['price']:,}")
            print(f"   Similarity: {laptop['similarity']:.2%}")
            print(f"   Specs: {laptop['specs']}")
            print()
    
    elif args.laptop_id:
        result = search.get_similar_laptops(args.laptop_id, match_count=5)
        formatted = search.format_results(result)
        
        print(f"\n💡 Similar laptops to: {args.laptop_id}")
        print(f"📊 Found: {len(formatted)} laptops\n")
        
        for i, laptop in enumerate(formatted, 1):
            print(f"{i}. {laptop['name']} ({laptop['brand']})")
            print(f"   Similarity: {laptop['similarity']:.2%}")
            print()

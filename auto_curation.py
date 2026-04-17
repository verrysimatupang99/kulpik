#!/usr/bin/env python3
"""
KulPik Auto-Curation System
Fetch laptop specs from EXA Search API, enrich with Cohere, and upsert to Supabase
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime, timezone

from dotenv import load_dotenv

# Load environment FIRST
load_dotenv()

from loguru import logger
from supabase import create_client, Client

# Configuration
EXA_API_KEY = os.getenv("EXA_API_KEY", "")
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Default laptop brands to search
BRANDS = [
    "ASUS", "Lenovo", "HP", "Acer", "Apple",
    "Dell", "MSI", "Xiaomi", "Microsoft", "Samsung",
    "Toshiba", "Panasonic", "LG", "Sony", "Google"
]

# Common laptop searches
QUERY_PATTERNS = [
    "Best laptop for students 2024",
    "Student laptop recommendations",
    "Budget laptop for coding",
    "Laptop for graphic design",
    "Lightweight laptop for university",
    "Gaming laptop for students",
    "MacBook Air vs Windows laptops",
    "Laptop with long battery life",
    "Best laptop for programming",
    "Affordable laptop for college"
]


class LaptopCurationSystem:
    """Auto-curation system using EXA + Cohere + Supabase."""
    
    def __init__(self):
        """Initialize all components."""
        self.supabase = None
        self.exa_client = None
        self.cohere_client = None
        
        # Initialize Supabase
        if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
            self.supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
            logger.info(f"✅ Connected to Supabase: {SUPABASE_URL}")
        
        # Initialize Cohere
        if COHERE_API_KEY:
            try:
                import cohere
                self.cohere_client = cohere.Client(COHERE_API_KEY)
                logger.info("✅ Cohere client initialized")
            except ImportError:
                logger.warning("Cohere not installed. pip install cohere")
        else:
            logger.warning("COHERE_API_KEY not set")
    
    def search_exa(self, query: str, limit: int = 10) -> list[dict]:
        """Search EXA API for laptop information."""
        try:
            # Using EXA API
            import requests
            
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "Authorization": f"Bearer {EXA_API_KEY}"
            }
            
            payload = {
                "query": query,
                "num_results": limit,
                "auto_prompt": True,
                "text": True,
                "highlights": True,
                "use_autoprompt": True
            }
            
            response = requests.post("https://api.exa.ai/search", headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                return data.get("results", [])
            else:
                logger.error(f"EXA search failed: {response.status_code}")
                return []
            
        except Exception as e:
            logger.error(f"EXA search error: {e}")
            return []
    
    def extract_laptop_specs(self, text: str) -> dict:
        """Extract laptop specs from text using Cohere extract."""
        if not self.cohere_client:
            logger.warning("Cohere client not available for extraction")
            return {}

        try:
            # Use generate/chat method instead of extract (Cohere SDK version 5+)
            prompt = f"""
Extract laptop specifications from this text:

Text: "{text}"

Return JSON with these fields:
- brand: manufacturer name (ASUS, Lenovo, HP, Dell, etc.)
- model: laptop model name
- cpu: processor name
- ram_gb: RAM in GB (integer)
- ram_type: RAM type (DDR4, DDR5, etc.)
- storage_gb: storage in GB (integer)
- storage_type: storage type (SSD, NVMe SSD, etc.)
- gpu: graphics processor
- screen_inches: screen size in inches (float)
- weight_kg: weight in kg (float)
- price: price in Indonesian Rupiah (integer)
            """

            response = self.cohere_client.chat(
                message=prompt,
                model="command",
                max_tokens=200,
                temperature=0.3
            )

            # Parse the chat response as JSON
            try:
                # Extract JSON from response
                result_text = response.text.strip()
                # Try to find JSON content
                import json
                # Look for JSON-like structure
                if "{" in result_text and "}" in result_text:
                    json_start = result_text.find("{")
                    json_end = result_text.find("}", json_start) + 1
                    json_str = result_text[json_start:json_end]
                    extracted_data = json.loads(json_str)
                    return extracted_data
                else:
                    logger.warning(f"No JSON found in response: {result_text[:200]}")
                    return {}
            except Exception as parse_error:
                logger.error(f"JSON parsing error: {parse_error}")
                return {}

        except Exception as e:
            logger.error(f"Cohere extraction error: {e}")
            return {}
    
    def generate_embedding(self, laptop: dict) -> list[float]:
        """Generate embedding for laptop using Cohere."""
        if not self.cohere_client:
            logger.error("Cohere client not available for embedding")
            return []
        
        # Format laptop for embedding
        embedding_text = self.format_laptop_for_embedding(laptop)
        
        try:
            # Cohere SDK version 6+ uses different API
            response = self.cohere_client.embed(
                texts=[embedding_text],
                model="embed-english-v3.0",
                input_type="search_document"
            )

            if response.embeddings:
                logger.success(f"✅ Generated embedding for: {laptop.get('full_name', 'Unknown')}")
                return response.embeddings[0]
            else:
                logger.error("❌ Failed to generate embedding")
                return []

        except Exception as e:
            logger.error(f"Cohere embedding error: {e}")
            return []
    
    def format_laptop_for_embedding(self, laptop: dict) -> str:
        """Format laptop into text for embedding."""
        parts = []
        
        # Basic info
        if laptop.get("full_name"):
            parts.append(f"Nama: {laptop['full_name']}")
        elif laptop.get("model") and laptop.get("brand"):
            parts.append(f"Nama: {laptop['brand']} {laptop['model']}")
        
        if laptop.get("brand"):
            parts.append(f"Brand: {laptop['brand']}")
        
        if laptop.get("model"):
            parts.append(f"Model: {laptop['model']}")
        
        # CPU
        if laptop.get("cpu"):
            parts.append(f"Processor: {laptop['cpu']}")
        elif laptop.get("cpu_model"):
            parts.append(f"Processor: {laptop['cpu_model']}")
        
        # RAM
        if laptop.get("ram_gb"):
            ram_info = f"RAM: {laptop['ram_gb']}GB"
            if laptop.get("ram_type"):
                ram_info += f" {laptop['ram_type']}"
            parts.append(ram_info)
        
        # Storage
        if laptop.get("storage_gb"):
            storage_info = f"Storage: {laptop['storage_gb']}GB"
            if laptop.get("storage_type"):
                storage_info += f" {laptop['storage_type']}"
            parts.append(storage_info)
        
        # GPU
        if laptop.get("gpu"):
            parts.append(f"GPU: {laptop['gpu']}")
        elif laptop.get("gpu_model"):
            parts.append(f"GPU: {laptop['gpu_model']}")
        
        # Display
        if laptop.get("screen_inches"):
            parts.append(f"Display: {laptop['screen_inches']} inch")
        
        # Weight
        if laptop.get("weight_kg"):
            parts.append(f"Berat: {laptop['weight_kg']} kg")
        
        # Price
        if laptop.get("price"):
            parts.append(f"Harga: Rp {laptop['price']:,}")
        
        # Use case keywords
        keywords = []
        if laptop.get("gpu_type") == "dedicated":
            keywords.extend(["gaming", "desain grafis", "video editing", "3D rendering"])
        
        if laptop.get("cpu_benchmark") and laptop["cpu_benchmark"] > 20000:
            keywords.append("performa tinggi")
        
        if laptop.get("weight_kg") and laptop["weight_kg"] < 1.5:
            keywords.append("ringan portable")
        
        if laptop.get("ram_gb") and laptop["ram_gb"] >= 16:
            keywords.append("multitasking berat")
        
        if keywords:
            parts.append(f"Cocok untuk: {', '.join(keywords)}")
        
        return " | ".join(parts)
    
    def upsert_laptop(self, laptop: dict) -> bool:
        """Insert or update laptop in Supabase."""
        if not self.supabase:
            logger.error("Supabase client not available")
            return False
        
        try:
            # Generate slug
            name = laptop.get("full_name", laptop.get("model", ""))
            slug = self.generate_slug(name)
            
            # Prepare laptop data
            laptop_data = {
                "slug": slug,
                "brand": laptop.get("brand", ""),
                "model": laptop.get("model", ""),
                "full_name": laptop.get("full_name", ""),
                "cpu_brand": laptop.get("cpu", "").split(" ")[0],
                "cpu_model": laptop.get("cpu", ""),
                "cpu_benchmark": laptop.get("cpu_benchmark", 0),
"ram_gb": laptop.get("ram_gb", 0),
                "ram_type": laptop.get("ram_type", ""),
                "storage_gb": laptop.get("storage_gb", 0),
                "storage_type": laptop.get("storage_type", ""),
                "gpu_model": laptop.get("gpu", ""),
                "gpu_type": laptop.get("gpu_type", "integrated"),
                "screen_inches": laptop.get("screen_inches", 0),
                "weight_kg": laptop.get("weight_kg", 0),
                "price_tokopedia": laptop.get("price", 0),
                "price_currency": "IDR",
                "last_scraped_at": datetime.now(timezone.utc).isoformat(),
            }
            
            # Update embedding if available
            embedding = laptop.get("embedding")
            if embedding:
                laptop_data["embedding"] = embedding
            
            # Upsert based on slug
            result = self.supabase.table("laptops").upsert(laptop_data, on_conflict="slug").execute()
            
            if result.data:
                logger.success(f"✅ Upserted laptop: {name}")
                return True
            else:
                logger.error(f"❌ Failed to upsert laptop: {name}")
                return False
            
        except Exception as e:
            logger.error(f"❌ Upsert error for laptop: {e}")
            return False
    
    def generate_slug(self, name: str) -> str:
        """Generate slug from laptop name."""
        import re
        
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = re.sub(r'^-+', '', slug)  # Remove leading dash
        slug = re.sub(r'-+$', '', slug)  # Remove trailing dash
        slug = slug.strip('-')
        
        return slug
    
    def enrich_laptop_from_search(self, search_results: list[dict], brand: str = "") -> dict:
        """Enrich laptop data from EXA search results."""
        if not search_results:
            return {}
        
        # Take the first result
        result = search_results[0]
        
        # Extract text highlights for analysis
        text_content = result.get("text", "")
        highlights = result.get("highlights", [])
        
        # Use highlights or text
        extraction_text = ""
        if highlights:
            extraction_text = " ".join(highlights)
        else:
            extraction_text = text_content[:2000]  # Limit text length
        
        # Extract specs using Cohere
        specs = self.extract_laptop_specs(extraction_text)
        
        # Build laptop object
        laptop = {
            "full_name": result.get("title", ""),
            "brand": brand or specs.get("brand", ""),
            "model": specs.get("model", ""),
            "cpu": specs.get("cpu", ""),
            "cpu_benchmark": self.estimate_cpu_benchmark(specs.get("cpu", "")),
            "ram_gb": specs.get("ram_gb", 0),
            "ram_type": specs.get("ram_type", ""),
            "storage_gb": specs.get("storage_gb", 0),
            "storage_type": specs.get("storage_type", ""),
            "gpu": specs.get("gpu", ""),
            "gpu_type": self.gpu_type_from_name(specs.get("gpu", "")),
            "screen_inches": specs.get("screen_inches", 0),
            "weight_kg": specs.get("weight_kg", 0),
            "price": specs.get("price", 0),
            "source_url": result.get("url", ""),
        }
        
        # Generate embedding
        embedding = self.generate_embedding(laptop)
        if embedding:
            laptop["embedding"] = embedding
        
        return laptop
    
    def estimate_cpu_benchmark(self, cpu_name: str) -> int:
        """Estimate CPU benchmark score from CPU name."""
        if not cpu_name:
            return 10000
        
        # Rough estimation based on CPU tier
        cpu_lower = cpu_name.lower()
        
        if "m3" in cpu_lower or "ryzen 9" in cpu_lower or "core i9" in cpu_lower:
            return 25000
        elif "m2" in cpu_lower or "ryzen 7" in cpu_lower or "core i7" in cpu_lower:
            return 20000
        elif "m1" in cpu_lower or "ryzen 5" in cpu_lower or "core i5" in cpu_lower:
            return 15000
        elif "ryzen 3" in cpu_lower or "core i3" in cpu_lower:
            return 10000
        else:
            return 8000
    
    def gpu_type_from_name(self, gpu_name: str) -> str:
        """Determine GPU type from GPU name."""
        if not gpu_name:
            return "integrated"
        
        gpu_lvertical_name = gpu_name.lower()
        
        if any(word in gpu_lower for word in ["rtx", "gtx", "radeon", "geforce"]):
            return "dedicated"
        elif any(word in gpu_lower for word in ["iris", "xe", "amd graphics", "intel graphics"]):
            return "integrated"
        else:
            return "integrated"
    
    def run_curation(self, num_laptops: int = 100):
        """Run auto-curation for specified number of laptops."""
        if not EXA_API_KEY:
            logger.error("EXA_API_KEY not set")
            return
        
        logger.info(f"🚀 Starting auto-curation for {num_laptops} laptops")
        
        success_count = 0
        fail_count = 0
        
        # Mix queries
        queries = []
        for brand in BRANDS[:10]:  # Use 10 brands
            queries.append(f"{brand} laptop for students")
        
        for pattern in QUERY_PATTERNS[:10]:
            queries.append(pattern)
        
        logger.info(f"📋 Using {len(queries)} search queries")
        
        # Process each query
        for i, query in enumerate(queries):
            logger.info(f"🔍 [{i+1}/{len(queries)}] Searching: {query}")
            
            try:
                # Search EXA
                results = self.search_exa(query, limit=3)
                
                if not results:
                    logger.warning(f"⚠️  No results for: {query}")
                    continue
                
                # Enrich laptop data
                laptop = self.enrich_laptop_from_search(results)
                
                if not laptop.get("full_name"):
                    logger.warning(f"⚠️  Could not extract laptop from: {query}")
                    continue
                
                # Upsert to database
                if self.upsert_laptop(laptop):
                    success_count += 1
                    logger.success(f"✅ Added: {laptop.get('full_name', 'Unknown')}")
                else:
                    fail_count += 1
                
                # Sleep to avoid rate limiting
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"❌ Error processing {query}: {e}")
                fail_count += 1
        
        # Summary
        logger.info(f"📊 Curation complete!")
        logger.info(f"   ✅ Success: {success_count}")
        logger.info(f"   ❌ Failed: {fail_count}")
        logger.info(f"   📝 Total attempted: {len(queries)}")
        
        # Check database count
        if self.supabase:
            result = self.supabase.table("laptops").select("id").execute()
            logger.info(f"📊 Total laptops in database: {len(result.data or [])}")
    
    def update_embeddings(self, limit: int = 100):
        """Update embeddings for laptops without embeddings."""
        if not self.supabase:
            logger.error("Supabase client not available")
            return
        
        logger.info("🔍 Finding laptops without embeddings...")
        
        # Get laptops without embeddings
        result = self.supabase.table("laptops").select("*").is_("embedding", None).limit(limit).execute()
        laptops = result.data or []
        
        if not laptops:
            logger.info("✅ All laptops have embeddings!")
            return
        
        logger.info(f"📋 Found {len(laptops)} laptops without embeddings")
        
        success_count = 0
        
        for i, laptop in enumerate(laptops):
            logger.info(f"📝 [{i+1}/{len(laptops)}] Processing: {laptop.get('full_name', 'Unknown')}")
            
            # Generate embedding
            embedding = self.generate_embedding(laptop)
            
            if embedding:
                # Update database
                update_result = self.supabase.table("laptops").update({
                    "embedding": embedding,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }).eq("id", laptop["id"]).execute()
                
                if update_result.data:
                    success_count += 1
                    logger.success(f"✅ Updated embedding for: {laptop.get('full_name', 'Unknown')}")
            
            # Sleep to avoid rate limiting
            time.sleep(0.5)
        
        logger.info(f"📊 Embedding update complete!")
        logger.info(f"   ✅ Updated: {success_count}")
        logger.info(f"   📝 Total processed: {len(laptops)}")


def main():
    parser = argparse.ArgumentParser(description="KulPik Auto-Curation System")
    parser.add_argument("--curate", "-c", type=int, default=20, help="Number of laptops to curate")
    parser.add_argument("--update-embeddings", "-u", action="store_true", help="Update embeddings for laptops")
    parser.add_argument("--limit", "-l", type=int, default=100, help="Limit for embedding updates")
    
    args = parser.parse_args()
    
    # Load environment
    load_dotenv()
    
    # Check environment variables
    if not EXA_API_KEY:
        logger.error("❌ EXA_API_KEY not set. Please add to environment.")
        sys.exit(1)
    
    if not COHERE_API_KEY:
        logger.error("❌ COHERE_API_KEY not set. Please add to environment.")
        sys.exit(1)
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not set.")
        sys.exit(1)
    
    # Initialize system
    system = LaptopCurationSystem()
    
    # Run curation
    if args.curate > 0:
        logger.info(f"🚀 Starting curation for {args.curate} laptops")
        system.run_curation(num_laptops=args.curate)
    
    # Update embeddings
    if args.update_embeddings:
        logger.info(f"🚀 Updating embeddings (limit: {args.limit})")
        system.update_embeddings(limit=args.limit)


if __name__ == "__main__":
    main()
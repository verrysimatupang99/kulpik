#!/usr/bin/env python3
"""
KulPik Manual Curator
Backend untuk manual laptop entry dengan semantic embeddings
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone

from dotenv import load_dotenv
from loguru import logger
from supabase import create_client, Client


class ManualCurator:
    """Manual laptop curator with Cohere embeddings."""
    
    def __init__(self):
        """Initialize with Supabase credentials."""
        load_dotenv()
        
        SUPABASE_URL = os.getenv("SUPABASE_URL", "")
        SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
        
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            logger.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
            sys.exit(1)
        
        self.supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        logger.info(f"✅ Connected to Supabase: {SUPABASE_URL}")
        
        # Initialize Cohere
        if COHERE_API_KEY:
            try:
                import cohere
                self.cohere_client = cohere.Client(COHERE_API_KEY)
                logger.info("✅ Cohere client initialized")
            except ImportError:
                logger.warning("Cohere not installed")
                self.cohere_client = None
        else:
            logger.warning("❌ COHERE_API_KEY not set")
            self.cohere_client = None
    
    def generate_slug(self, name: str) -> str:
        """Generate slug from laptop name."""
        import re
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = re.sub(r'^-+', '', slug)  # Remove leading dash
        slug = re.sub(r'-+$', '', slug)  # Remove trailing dash
        return slug.strip('-')
    
    def generate_embedding(self, laptop: dict) -> list[float]:
        """Generate embedding for laptop using Cohere."""
        if not self.cohere_client:
            logger.error("❌ Cohere client not available")
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
            logger.error(f"❌ Error generating embedding: {e}")
            return []
    
    def format_laptop_for_embedding(self, laptop: dict) -> str:
        """Format laptop into text for embedding."""
        parts = []
        
        # Basic info
        if laptop.get("full_name"):
            parts.append(f"Nama: {laptop['full_name']}")
        if laptop.get("brand"):
            parts.append(f"Brand: {laptop['brand']}")
        if laptop.get("model"):
            parts.append(f"Model: {laptop['model']}")
        
        # CPU
        if laptop.get("cpu_model"):
            cpu_info = f"Processor: {laptop['cpu_model']}"
            if laptop.get("cpu_benchmark"):
                cpu_info += f" (benchmark: {laptop['cpu_benchmark']})"
            parts.append(cpu_info)
        
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
        if laptop.get("gpu_model"):
            gpu_info = f"GPU: {laptop['gpu_model']}"
            if laptop.get("gpu_type"):
                gpu_info += f" ({laptop['gpu_type']})"
            parts.append(gpu_info)
        
        # Display
        if laptop.get("screen_inches"):
            parts.append(f"Display: {laptop['screen_inches']} inch")
        
        # Weight
        if laptop.get("weight_kg"):
            parts.append(f"Berat: {laptop['weight_kg']} kg")
        
        # Price
        price = laptop.get("price_tokopedia") or laptop.get("price_shopee") or laptop.get("price_official") or 0
        if price:
            parts3.append(f"Harga: Rp {price:,}")
        
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
            
            # Generate embedding
            embedding = self.generate_embedding(laptop)
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
    
    def batch_insert_from_file(self, file_path: str):
        """Batch insert laptops from JSON file."""
        if not os.path.exists(file_path):
            logger.error(f"❌ File not found: {file_path}")
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            laptops = json.load(f)
        
        logger.info(f"📋 Found {len(laptops)} laptops in {file_path}")
        
        success_count = 0
        fail_count = 0
        
        for i, laptop in enumerate(laptops):
            logger.info(f"📝 [{i+1}/{len(laptops)}] Processing: {laptop.get('full_name', 'Unknown')}")
            
            if self.upsert_laptop(laptop):
                success_count += 1
            else:
                fail_count += 1
            
            # Small delay
            import time
            time.sleep(0.3)
        
        logger.info(f"📊 Batch insert complete!")
        logger.info(f"   ✅ Success: {success_count}")
        logger.info(f"   ❌ Failed: {fail_count}")
        
        # Generate embeddings for new laptops
        self.update_embeddings()
    
    def update_embeddings(self, limit: int = 100):
        """Update embeddings for laptops without embeddings."""
        logger.info("🔍 Finding laptops without embeddings...")
        
        result = self.supabase.table("laptops").select("*").is_("embedding", None).limit(limit).execute()
        laptops = result.data or []
        
        if not laptops:
            logger.info("✅ All laptops have embeddings!")
            return
        
        logger.info(f"📋 Found {len(laptops)} laptops without embeddings")
        
        success_count = 0
        
        for i, laptop in enumerate(laptops):
            logger.info(f"📝 [{i+1}/{len(laptops)}] Processing: {laptop.get('full_name', 'Unknown')}")
            
            embedding = self.generate_embedding(laptop)
            
            if embedding:
                update_result = self.supabase.table("laptops").update({
                    "embedding": embedding,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }).eq("id", laptop["id"]).execute()
                
                if update_result.data:
                    success_count += 1
                    logger.success(f"✅ Updated embedding for: {laptop.get('full_name', 'Unknown')}")
            
            time.sleep(0.5)
        
        logger.info(f"📊 Embedding update complete!")
        logger.info(f"   ✅ Updated: {success_count}")
        logger.info(f"   📝 Total processed: {len(laptops)}")
    
    def count_laptops(self):
        """Count laptops in database."""
        result = self.supabase.table("laptops").select("id").execute()
        total = len(result.data or [])

        result_with_embeddings = self.supabase.table("laptops").select("id, embedding").execute()
        with_embeddings = len([laptop for laptop in result_with_embeddings.data or [] if laptop.get("embedding") is not None])

        logger.info(f"📊 Database status:")
        logger.info(f"   Total laptops: {total}")
        logger.info(f"   Laptops with embeddings: {with_embeddings}")
        logger.info(f"   Laptops without embeddings: {total - with_embeddings}")


def main():
    parser = argparse.ArgumentParser(description="KulPik Manual Curator")
    parser.add_argument("--batch", "-b", type=str, help="JSON file with laptops to insert")
    parser.add_argument("--update-embeddings", "-u", action="store_true", help="Update embeddings")
    parser.add_argument("--limit", "-l", type=int, default=100, help="Limit for embedding updates")
    parser.add_argument("--count", "-c", action="store_true", help="Count laptops")
    
    args = parser.parse_args()
    
    curator = ManualCurator()
    
    if args.batch:
        curator.batch_insert_from_file(args.batch)
    
    if args.update_embeddings:
        curator.update_embeddings(args.limit)
    
    if args.count:
        curator.count_laptops()
    
    if not args.batch and not args.update_embeddings and not args.count:
        print("Usage: python3 manual_curator.py --batch laptops.json")
        print("       python3 manual_curator.py --update-embeddings")
        print("       python3 manual_curator.py --count")
        print("\nExample: python3 manual_curator.py --batch laptops.json --update-embeddings")


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""KulPik Database Seeder - Insert 46 laptops into Supabase"""

import os
import json
import time
import re
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

from loguru import logger
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

VALID_COLS = {'id','slug','brand','model','full_name','price_tokopedia','price_shopee','price_official','price_currency','cpu_brand','cpu_model','cpu_generation','cpu_benchmark','ram_gb','ram_type','ram_upgradable','ram_max_gb','ram_slots','storage_gb','storage_type','storage_upgradable','gpu_model','gpu_type','gpu_vram_gb','screen_inches','screen_resolution','screen_type','screen_srgb','screen_refresh','weight_kg','battery_wh','battery_hours','os','wifi','bluetooth','ports','images','source_url','rating','review_count','last_scraped_at','created_at','updated_at'}

LAPTOPS = [
    {"full_name":"ASUS VivoBook 14 A1404ZA","brand":"ASUS","price_tokopedia":8999000,"price_shopee":8700000,"price_official":9499000,"cpu_model":"Intel Core i5-1235U","cpu_benchmark":14000,"ram_gb":8,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.5,"source_url":"https://www.asus.com/vivobook"},
    {"full_name":"ASUS VivoBook 15 A1504ZA","brand":"ASUS","price_tokopedia":9499000,"price_shopee":9200000,"price_official":9999000,"cpu_model":"Intel Core i5-1235U","cpu_benchmark":14000,"ram_gb":8,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.7,"source_url":"https://www.asus.com/vivobook"},
    {"full_name":"ASUS VivoBook Go 14 E1404FA","brand":"ASUS","price_tokopedia":5999000,"price_shopee":5800000,"price_official":6499000,"cpu_model":"AMD Ryzen 3 7320U","cpu_benchmark":8000,"ram_gb":8,"ram_type":"DDR5","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"AMD Radeon Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.38,"source_url":"https://www.asus.com/vivobook-go"},
    {"full_name":"ASUS VivoBook 16X M1603QA","brand":"ASUS","price_tokopedia":11999000,"price_shopee":11500000,"price_official":12499000,"cpu_model":"AMD Ryzen 5 5600H","cpu_benchmark":16000,"ram_gb":16,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"AMD Radeon Graphics","gpu_type":"integrated","screen_inches":16.0,"weight_kg":1.88,"source_url":"https://www.asus.com/vivobook-16x"},
    {"full_name":"ASUS ZenBook 14 UX3402ZA","brand":"ASUS","price_tokopedia":15999000,"price_shopee":15500000,"price_official":16499000,"cpu_model":"Intel Core i5-1240P","cpu_benchmark":16000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.39,"source_url":"https://www.asus.com/zenbook"},
    {"full_name":"ASUS ZenBook 14 OLED UX3405MA","brand":"ASUS","price_tokopedia":17999000,"price_shopee":17500000,"price_official":18499000,"cpu_model":"Intel Core Ultra 5 125H","cpu_benchmark":19000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Arc Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.28,"source_url":"https://www.asus.com/zenbook"},
    {"full_name":"ASUS ROG Strix G16 G614JV","brand":"ASUS","price_tokopedia":18999000,"price_shopee":18500000,"price_official":19999000,"cpu_model":"Intel Core i7-13650HX","cpu_benchmark":28000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4060","gpu_type":"dedicated","screen_inches":16.0,"weight_kg":2.5,"source_url":"https://www.asus.com/rog"},
    {"full_name":"ASUS TUF Gaming F15 FX507ZC","brand":"ASUS","price_tokopedia":13999000,"price_shopee":13500000,"price_official":14499000,"cpu_model":"Intel Core i5-12500H","cpu_benchmark":19000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 3050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":2.2,"source_url":"https://www.asus.com/tuf"},
    {"full_name":"ASUS ROG Zephyrus G14 GA402NJ","brand":"ASUS","price_tokopedia":22999000,"price_shopee":22500000,"price_official":23999000,"cpu_model":"AMD Ryzen 7 7735HS","cpu_benchmark":25000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4060","gpu_type":"dedicated","screen_inches":14.0,"weight_kg":1.72,"source_url":"https://www.asus.com/rog-zephyrus"},
    {"full_name":"ASUS Chromebook Plus CX34","brand":"ASUS","price_tokopedia":6999000,"price_shopee":6800000,"price_official":7499000,"cpu_model":"Intel Core i3-1215U","cpu_benchmark":8500,"ram_gb":8,"ram_type":"DDR4","storage_gb":128,"storage_type":"eMMC","gpu_model":"Intel UHD Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.44,"source_url":"https://www.asus.com/chromebook"},
    {"full_name":"Lenovo IdeaPad Slim 3 14IRU8","brand":"Lenovo","price_tokopedia":7499000,"price_shopee":7200000,"price_official":7999000,"cpu_model":"Intel Core i3-1315U","cpu_benchmark":9000,"ram_gb":8,"ram_type":"DDR4","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"Intel UHD Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.4,"source_url":"https://www.lenovo.com/ideapad"},
    {"full_name":"Lenovo IdeaPad Slim 5 14IRU9","brand":"Lenovo","price_tokopedia":11999000,"price_shopee":11500000,"price_official":12499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.46,"source_url":"https://www.lenovo.com/ideapad"},
    {"full_name":"Lenovo IdeaPad 1 14AMN7","brand":"Lenovo","price_tokopedia":5499000,"price_shopee":5300000,"price_official":5999000,"cpu_model":"AMD Ryzen 3 7320U","cpu_benchmark":8000,"ram_gb":8,"ram_type":"DDR5","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"AMD Radeon Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.38,"source_url":"https://www.lenovo.com/ideapad-1"},
    {"full_name":"Lenovo IdeaPad Flex 5 14IRU8","brand":"Lenovo","price_tokopedia":11999000,"price_shopee":11500000,"price_official":12499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.5,"source_url":"https://www.lenovo.com/flex"},
    {"full_name":"Lenovo IdeaPad Gaming 3 15IHU6","brand":"Lenovo","price_tokopedia":12499000,"price_shopee":12000000,"price_official":12999000,"cpu_model":"Intel Core i5-11320H","cpu_benchmark":15000,"ram_gb":8,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 3050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":2.25,"source_url":"https://www.lenovo.com/ideapad-gaming"},
    {"full_name":"Lenovo LOQ 15IRH8","brand":"Lenovo","price_tokopedia":13999000,"price_shopee":13500000,"price_official":14499000,"cpu_model":"Intel Core i5-13420H","cpu_benchmark":18000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":2.4,"source_url":"https://www.lenovo.com/loq"},
    {"full_name":"Lenovo ThinkPad E14 Gen 5","brand":"Lenovo","price_tokopedia":13999000,"price_shopee":13500000,"price_official":14499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.41,"source_url":"https://www.lenovo.com/thinkpad"},
    {"full_name":"Lenovo ThinkPad E16 Gen 1","brand":"Lenovo","price_tokopedia":14999000,"price_shopee":14500000,"price_official":15499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":16.0,"weight_kg":1.81,"source_url":"https://www.lenovo.com/thinkpad"},
    {"full_name":"Lenovo ThinkBook 14 G6 IRL","brand":"Lenovo","price_tokopedia":12999000,"price_shopee":12500000,"price_official":13499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.4,"source_url":"https://www.lenovo.com/thinkbook"},
    {"full_name":"Lenovo Yoga Slim 7 14IMH9","brand":"Lenovo","price_tokopedia":19999000,"price_shopee":19500000,"price_official":20999000,"cpu_model":"Intel Core Ultra 5 125H","cpu_benchmark":19000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Arc Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.31,"source_url":"https://www.lenovo.com/yoga"},
    {"full_name":"HP 14s-dq5139TU","brand":"HP","price_tokopedia":6999000,"price_shopee":6800000,"price_official":7499000,"cpu_model":"Intel Core i3-1215U","cpu_benchmark":8500,"ram_gb":8,"ram_type":"DDR4","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"Intel UHD Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.46,"source_url":"https://www.hp.com/14s"},
    {"full_name":"HP 15-fd0082TU","brand":"HP","price_tokopedia":7999000,"price_shopee":7700000,"price_official":8499000,"cpu_model":"Intel Core i3-1315U","cpu_benchmark":9000,"ram_gb":8,"ram_type":"DDR4","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"Intel UHD Graphics","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.59,"source_url":"https://www.hp.com/15"},
    {"full_name":"HP Pavilion 15-eh3003AU","brand":"HP","price_tokopedia":10999000,"price_shopee":10500000,"price_official":11499000,"cpu_model":"AMD Ryzen 5 7530U","cpu_benchmark":15000,"ram_gb":16,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"AMD Radeon Graphics","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.75,"source_url":"https://www.hp.com/pavilion"},
    {"full_name":"HP Pavilion x360 14-ek1017TU","brand":"HP","price_tokopedia":12999000,"price_shopee":12500000,"price_official":13499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.51,"source_url":"https://www.hp.com/pavilion-x360"},
    {"full_name":"HP Victus 15-fa1006TX","brand":"HP","price_tokopedia":13499000,"price_shopee":13000000,"price_official":13999000,"cpu_model":"Intel Core i5-13420H","cpu_benchmark":18000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":2.29,"source_url":"https://www.hp.com/victus"},
    {"full_name":"HP 245 G10","brand":"HP","price_tokopedia":6499000,"price_shopee":6200000,"price_official":6999000,"cpu_model":"AMD Ryzen 3 7320U","cpu_benchmark":8000,"ram_gb":8,"ram_type":"DDR5","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"AMD Radeon Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.44,"source_url":"https://www.hp.com/245"},
    {"full_name":"HP ProBook 450 G10","brand":"HP","price_tokopedia":14999000,"price_shopee":14500000,"price_official":15499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.74,"source_url":"https://www.hp.com/probook"},
    {"full_name":"HP Envy x360 14-es1000TU","brand":"HP","price_tokopedia":16999000,"price_shopee":16500000,"price_official":17499000,"cpu_model":"Intel Core Ultra 5 125H","cpu_benchmark":19000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Arc Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.39,"source_url":"https://www.hp.com/envy"},
    {"full_name":"Acer Aspire 5 A515-58M","brand":"Acer","price_tokopedia":9999000,"price_shopee":9700000,"price_official":10499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.78,"source_url":"https://www.acer.com/aspire"},
    {"full_name":"Acer Aspire 3 A315-510P","brand":"Acer","price_tokopedia":6499000,"price_shopee":6200000,"price_official":6999000,"cpu_model":"Intel Core i3-N305","cpu_benchmark":8000,"ram_gb":8,"ram_type":"DDR4","storage_gb":256,"storage_type":"NVMe SSD","gpu_model":"Intel UHD Graphics","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.78,"source_url":"https://www.acer.com/aspire"},
    {"full_name":"Acer Aspire 5 A515-58GM","brand":"Acer","price_tokopedia":12999000,"price_shopee":12500000,"price_official":13499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 2050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":1.78,"source_url":"https://www.acer.com/aspire"},
    {"full_name":"Acer Nitro V 15 ANV15-51","brand":"Acer","price_tokopedia":14999000,"price_shopee":14500000,"price_official":15499000,"cpu_model":"Intel Core i5-13420H","cpu_benchmark":18000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":2.1,"source_url":"https://www.acer.com/nitro"},
    {"full_name":"Acer Swift Go 14 SFG14-73","brand":"Acer","price_tokopedia":14999000,"price_shopee":14500000,"price_official":15499000,"cpu_model":"Intel Core Ultra 5 125H","cpu_benchmark":19000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Arc Graphics","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.3,"source_url":"https://www.acer.com/swift"},
    {"full_name":"Acer Swift 3 SF314-71","brand":"Acer","price_tokopedia":13999000,"price_shopee":13500000,"price_official":14499000,"cpu_model":"Intel Core i5-1240P","cpu_benchmark":16000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.25,"source_url":"https://www.acer.com/swift"},
    {"full_name":"Acer Chromebook Plus 515","brand":"Acer","price_tokopedia":5999000,"price_shopee":5800000,"price_official":6499000,"cpu_model":"Intel Core i3-1215U","cpu_benchmark":8500,"ram_gb":8,"ram_type":"DDR4","storage_gb":128,"storage_type":"eMMC","gpu_model":"Intel UHD Graphics","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.68,"source_url":"https://www.acer.com/chromebook"},
    {"full_name":"MacBook Air M1 2020","brand":"Apple","price_tokopedia":12999000,"price_shopee":12500000,"price_official":13999000,"cpu_model":"Apple M1","cpu_benchmark":15000,"ram_gb":8,"ram_type":"Unified","storage_gb":256,"storage_type":"SSD","gpu_model":"Apple M1 GPU","gpu_type":"integrated","screen_inches":13.3,"weight_kg":1.29,"source_url":"https://www.apple.com/macbook-air-m1"},
    {"full_name":"MacBook Air M2 2022","brand":"Apple","price_tokopedia":16999000,"price_shopee":16500000,"price_official":17999000,"cpu_model":"Apple M2","cpu_benchmark":20000,"ram_gb":8,"ram_type":"Unified","storage_gb":256,"storage_type":"SSD","gpu_model":"Apple M2 GPU","gpu_type":"integrated","screen_inches":13.6,"weight_kg":1.24,"source_url":"https://www.apple.com/macbook-air"},
    {"full_name":"MacBook Air M3 2024","brand":"Apple","price_tokopedia":19999000,"price_shopee":19500000,"price_official":21999000,"cpu_model":"Apple M3","cpu_benchmark":23000,"ram_gb":8,"ram_type":"Unified","storage_gb":256,"storage_type":"SSD","gpu_model":"Apple M3 GPU","gpu_type":"integrated","screen_inches":13.6,"weight_kg":1.24,"source_url":"https://www.apple.com/macbook-air"},
    {"full_name":"Dell Inspiron 14 5430","brand":"Dell","price_tokopedia":11499000,"price_shopee":11000000,"price_official":11999000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.53,"source_url":"https://www.dell.com/inspiron"},
    {"full_name":"Dell Vostro 3530","brand":"Dell","price_tokopedia":8499000,"price_shopee":8200000,"price_official":8999000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":8,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":15.6,"weight_kg":1.66,"source_url":"https://www.dell.com/vostro"},
    {"full_name":"Dell XPS 13 9340","brand":"Dell","price_tokopedia":24999000,"price_shopee":24500000,"price_official":25999000,"cpu_model":"Intel Core Ultra 7 155H","cpu_benchmark":22000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Arc Graphics","gpu_type":"integrated","screen_inches":13.4,"weight_kg":1.19,"source_url":"https://www.dell.com/xps"},
    {"full_name":"MSI GF63 Thin 12VE","brand":"MSI","price_tokopedia":12999000,"price_shopee":12500000,"price_official":13499000,"cpu_model":"Intel Core i5-12450H","cpu_benchmark":17000,"ram_gb":16,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":1.86,"source_url":"https://www.msi.com/gf63"},
    {"full_name":"MSI Modern 14 C13M","brand":"MSI","price_tokopedia":8999000,"price_shopee":8700000,"price_official":9499000,"cpu_model":"Intel Core i5-1335U","cpu_benchmark":14500,"ram_gb":8,"ram_type":"DDR4","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"Intel Iris Xe","gpu_type":"integrated","screen_inches":14.0,"weight_kg":1.4,"source_url":"https://www.msi.com/modern"},
    {"full_name":"MSI Cyborg 15 A12VE","brand":"MSI","price_tokopedia":15999000,"price_shopee":15500000,"price_official":16499000,"cpu_model":"Intel Core i5-12450H","cpu_benchmark":17000,"ram_gb":16,"ram_type":"DDR5","storage_gb":512,"storage_type":"NVMe SSD","gpu_model":"NVIDIA RTX 4050","gpu_type":"dedicated","screen_inches":15.6,"weight_kg":1.98,"source_url":"https://www.msi.com/cyborg"},
]


def generate_slug(name):
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')


def insert_laptops(supabase, laptops):
    inserted = 0
    for laptop in laptops:
        try:
            laptop['slug'] = generate_slug(laptop['full_name'])
            laptop['updated_at'] = datetime.now(timezone.utc).isoformat()
            clean = {k: v for k, v in laptop.items() if v is not None and k in VALID_COLS}
            result = supabase.table('laptops').upsert(clean, on_conflict='slug').execute()
            if result.data:
                inserted += 1
                logger.info(f"  OK: {laptop['full_name']}")
        except Exception as e:
            logger.error(f"  FAIL: {laptop.get('full_name')}: {e}")
    return inserted


def main():
    logger.info("=== KulPik Database Seeder ===")
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.error("Supabase credentials not set!")
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    existing = supabase.table('laptops').select("id").execute()
    logger.info(f"Existing laptops in DB: {len(existing.data or [])}")

    logger.info(f"Inserting {len(LAPTOPS)} laptops...")
    count = insert_laptops(supabase, LAPTOPS)
    logger.info(f"\nDone! Inserted {count}/{len(LAPTOPS)} laptops")

    final = supabase.table('laptops').select("id").execute()
    logger.info(f"Total laptops in DB: {len(final.data or [])}")


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
KulPik Health Check Script
Run this to verify all services are working correctly.
"""

import os
import sys
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

def print_status(service: str, status: bool, message: str = ""):
    """Print formatted status message."""
    icon = "✅" if status else "❌"
    color_start = "\033[92m" if status else "\033[91m"
    color_end = "\033[0m"
    print(f"{icon} {color_start}{service:30}{color_end} {message}")

def check_environment():
    """Check if required environment variables are set."""
    load_dotenv('.env.local')
    
    required = [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'EXA_API_KEY',
        'COHERE_API_KEY'
    ]
    
    print("\n🔧 Environment Check:")
    print("-" * 50)
    
    all_set = True
    for var in required:
        value = os.getenv(var, '')
        if value:
            masked = value[:10] + "..." + value[-5:] if len(value) > 15 else "***"
            print_status(var, True, f"Set ({masked})")
        else:
            print_status(var, False, "Not set")
            all_set = False
    
    return all_set

def check_backend():
    """Check if backend server is running and healthy."""
    print("\n🌐 Backend Server Check:")
    print("-" * 50)
    
    endpoints = [
        ("/api/curation/health", "Basic Health"),
        ("/api/curation/status", "System Status"),
    ]
    
    all_healthy = True
    base_url = "http://localhost:5000"
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status = data.get('success', False) or data.get('status') == 'healthy'
                message = f"HTTP {response.status_code}"
                print_status(name, status, message)
                if not status:
                    all_healthy = False
            else:
                print_status(name, False, f"HTTP {response.status_code}")
                all_healthy = False
        except requests.exceptions.ConnectionError:
            print_status(name, False, "Connection refused")
            all_healthy = False
        except Exception as e:
            print_status(name, False, str(e))
            all_healthy = False
    
    return all_healthy

def check_database():
    """Check database connectivity."""
    print("\n🗄️  Database Check:")
    print("-" * 50)
    
    try:
        from supabase import create_client
        
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            print_status("Supabase Config", False, "Missing URL or key")
            return False
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Try to query laptops table
        try:
            result = supabase.table("laptops").select("id").limit(1).execute()
            print_status("Connection", True, f"Connected to {supabase_url[:30]}...")
            
            # Try to count
            count_result = supabase.table("laptops").select("id", count='exact').execute()
            count = len(count_result.data) if count_result.data else 0
            print_status("Table Access", True, f"Found {count} laptops")
            
            return True
        except Exception as e:
            print_status("Table Query", False, f"Error: {str(e)}")
            return False
            
    except ImportError:
        print_status("Supabase Library", False, "supabase-py not installed")
        return False
    except Exception as e:
        print_status("Connection", False, f"Error: {str(e)[:50]}")
        return False

def check_api_keys():
    """Validate API keys (without making actual calls)."""
    print("\n🔑 API Key Validation:")
    print("-" * 50)
    
    keys = [
        ('EXA_API_KEY', 'EXA Search'),
        ('COHERE_API_KEY', 'Cohere AI'),
        ('GEMINI_API_KEY', 'Google Gemini')
    ]
    
    all_valid = True
    for env_key, service_name in keys:
        key = os.getenv(env_key, '')
        if key:
            # Basic format validation
            if service_name == 'Google Gemini' and key.startswith('AIza'):
                print_status(service_name, True, "Key format appears valid")
            elif len(key) > 10:  # Basic length check
                print_status(service_name, True, f"Key length: {len(key)} chars")
            else:
                print_status(service_name, False, "Key appears too short")
                all_valid = False
        else:
            print_status(service_name, False, "Not set (optional)")
            if service_name != 'Google Gemini':  # Gemini is optional
                all_valid = False
    
    return all_valid

def generate_report():
    """Generate health check report."""
    print("\n" + "=" * 60)
    print("🏥 KULPIK HEALTH CHECK REPORT")
    print("=" * 60)
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"Timestamp: {timestamp}")
    
    checks = [
        ("Environment", check_environment),
        ("Backend Server", check_backend),
        ("Database", check_database),
        ("API Keys", check_api_keys)
    ]
    
    results = {}
    all_passed = True
    
    for check_name, check_func in checks:
        try:
            passed = check_func()
            results[check_name] = passed
            if not passed:
                all_passed = False
        except Exception as e:
            print(f"\n⚠️  Error running {check_name}: {e}")
            results[check_name] = False
            all_passed = False
    
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    for check_name, passed in results.items():
        status = "PASS" if passed else "FAIL"
        color = "\033[92m" if passed else "\033[91m"
        print(f"{color}{status:6}\033[0m {check_name}")
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL CHECKS PASSED! System is ready.")
        return 0
    else:
        print("⚠️  SOME CHECKS FAILED. Review the issues above.")
        return 1

def quick_check():
    """Quick health check for automation."""
    try:
        response = requests.get("http://localhost:5000/api/curation/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'healthy':
                return True
        return False
    except:
        return False

if __name__ == "__main__":
    # Check if running as quick check
    if len(sys.argv) > 1 and sys.argv[1] == "--quick":
        if quick_check():
            print("✅ Healthy")
            sys.exit(0)
        else:
            print("❌ Unhealthy")
            sys.exit(1)
    
    # Run full health check
    sys.exit(generate_report())
"""
KulPik Auto-Curation Dashboard API
Backend API endpoints for auto-curation dashboard
Production-ready with proper error handling and logging
"""

import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Import our auto-curation system
from auto_curation import LaptopCurationSystem

# Initialize Flask app
app = Flask(__name__)


# CORS configuration - restrict origins from environment
def parse_cors_origins():
    """Parse and validate CORS origins from environment variables."""
    raw_origins = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://localhost:3001"
    )
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    if "*" in origins and os.getenv("FLASK_ENV") == "production":
        raise ValueError("Wildcard CORS origin is not allowed in production")

    return origins


CORS_ORIGINS = parse_cors_origins()
CORS(
    app,
    origins=CORS_ORIGINS,
    methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=False,
    max_age=600,
)

# Rate limiting configuration
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# Configuration from environment variables
EXA_API_KEY = os.getenv("EXA_API_KEY", "")
COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
DEBUG_MODE = os.getenv("DEBUG", "false").lower() == "true"
SERVER_PORT = int(os.getenv("PORT", 5000))

# Global curation system
curation_system = None


def get_json_body(required=True):
    """Safely parse JSON request body."""
    if not request.is_json:
        if required:
            return None, (
                jsonify({"success": False, "error": "Request body must be JSON"}),
                400,
            )
        return {}, None

    data = request.get_json(silent=True)

    if data is None:
        if required:
            return None, (
                jsonify({"success": False, "error": "Invalid JSON body"}),
                400,
            )
        return {}, None

    if not isinstance(data, dict):
        return None, (
            jsonify({"success": False, "error": "JSON body must be an object"}),
            400,
        )

    return data, None


def sanitize_string(value, max_length=500):
    """Sanitize user-controlled string input."""
    if not isinstance(value, str):
        return ""

    blocked_chars = "<>;&#|\\"
    sanitized = "".join(char for char in value if char not in blocked_chars)
    return " ".join(sanitized.split())[:max_length]


def parse_int(value, default=0, minimum=None, maximum=None):
    """Parse integer input with safe defaults and optional bounds."""
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        parsed = default

    if minimum is not None:
        parsed = max(minimum, parsed)

    if maximum is not None:
        parsed = min(maximum, parsed)

    return parsed


def initialize_curation():
    """Initialize the curation system."""
    global curation_system

    if (
        not EXA_API_KEY
        or not COHERE_API_KEY
        or not SUPABASE_URL
        or not SUPABASE_SERVICE_ROLE_KEY
    ):
        return {"error": "Missing environment variables"}

    try:
        curation_system = LaptopCurationSystem()
        return {
            "status": "initialized",
            "exa_available": bool(EXA_API_KEY),
            "cohere_available": bool(COHERE_API_KEY),
        }
    except Exception as e:
        return {"error": f"Initialization failed: {str(e)}"}


@app.route("/api/curation/status", methods=["GET"])
@limiter.limit("30/minute")
def curation_status():
    """Get status of curation system."""
    status = initialize_curation()
    if "error" in status:
        return jsonify(status)

    # Count laptops in database
    try:
        if curation_system.supabase:
            result = curation_system.supabase.table("laptops").select("id").execute()
            laptop_count = len(result.data or [])

            # Supabase syntax: .not() expects the first parameter to be column name,
            # but we need to use is_null() for checking null values
            result_with_embeddings = (
                curation_system.supabase.table("laptops").select("id").execute()
            )
            embedding_count = len(
                [
                    laptop
                    for laptop in result_with_embeddings.data or []
                    if laptop.get("embedding") is not None
                ]
            )

            status["laptop_count"] = laptop_count
            status["embedding_count"] = embedding_count
    except Exception as e:
        status["database_error"] = str(e)

    status["success"] = True
    return jsonify(status)


@app.route("/api/curation/search", methods=["POST"])
@limiter.limit("30/minute")
def curation_search():
    """Search for laptops via EXA."""
    data, error_response = get_json_body()
    if error_response:
        return error_response

    query = sanitize_string(data.get("query", ""), max_length=200)
    limit = parse_int(data.get("limit", 10), default=10, minimum=1, maximum=50)

    if not query:
        return jsonify({"error": "Query is required"}), 400

    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        results = curation_system.search_exa(query, limit=limit)
        return jsonify(
            {"success": True, "query": query, "results": results, "count": len(results)}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/extract", methods=["POST"])
@limiter.limit("30/minute")
def curation_extract():
    """Extract laptop specs from EXA results."""
    data, error_response = get_json_body()
    if error_response:
        return error_response

    result_data = data.get("result", {})
    brand = sanitize_string(data.get("brand", ""), max_length=80)

    if not result_data or not isinstance(result_data, dict):
        return jsonify({"error": "EXA result is required"}), 400

    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        # Simulate extraction from EXA result
        extraction_text = ""

        if result_data.get("highlights"):
            extraction_text = " ".join(result_data.get("highlights", []))
        elif result_data.get("text"):
            extraction_text = result_data.get("text", "")

        # Enrich laptop data
        laptop = curation_system.enrich_laptop_from_search([result_data], brand)

        return jsonify(
            {
                "success": True,
                "result": result_data,
                "extracted": laptop,
                "embedding_ready": "embedding" in laptop,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/add", methods=["POST"])
@limiter.limit("30/minute")
def curation_add():
    """Add laptop to database."""
    data, error_response = get_json_body()
    if error_response:
        return error_response

    laptop = data.get("laptop", {})

    if not laptop or not isinstance(laptop, dict):
        return jsonify({"error": "Laptop data is required"}), 400

    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        success = curation_system.upsert_laptop(laptop)

        if success:
            return jsonify(
                {
                    "success": True,
                    "message": "Laptop added successfully",
                    "laptop": laptop,
                }
            )
        else:
            return jsonify({"error": "Failed to add laptop to database"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/bulk", methods=["POST"])
@limiter.limit("30/minute")
def curation_bulk():
    """Bulk curation of laptops."""
    data, error_response = get_json_body()
    if error_response:
        return error_response

    num_laptops = parse_int(
        data.get("num_laptops", 20), default=20, minimum=1, maximum=100
    )
    queries = data.get("queries", [])

    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        curation_system.run_curation(num_laptops)

        return jsonify(
            {
                "success": True,
                "message": f"Bulk curation started for {num_laptops} laptops",
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/update_embeddings", methods=["POST"])
@limiter.limit("30/minute")
def update_embeddings():
    """Update embeddings for laptops."""
    data, error_response = get_json_body()
    if error_response:
        return error_response

    limit = parse_int(data.get("limit", 100), default=100, minimum=1, maximum=500)

    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        curation_system.update_embeddings(limit)

        return jsonify(
            {"success": True, "message": f"Embeddings updated for {limit} laptops"}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/laptops", methods=["GET"])
@limiter.limit("30/minute")
def get_laptops():
    """Get laptops from database."""
    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        # Get laptops with pagination - validate and clamp limit/offset
        limit = parse_int(
            request.args.get("limit", 20), default=20, minimum=1, maximum=100
        )
        offset = parse_int(
            request.args.get("offset", 0), default=0, minimum=0, maximum=1000000
        )

        # Fetch laptops
        result = (
            curation_system.supabase.table("laptops")
            .select("*")
            .limit(limit)
            .offset(offset)
            .execute()
        )
        laptops = result.data or []

        # Get total count
        count_result = (
            curation_system.supabase.table("laptops")
            .select("id", count="exact")
            .execute()
        )
        total_count = (
            count_result.count if hasattr(count_result, "count") else len(laptops)
        )

        return jsonify(
            {
                "success": True,
                "laptops": laptops,
                "count": len(laptops),
                "total": total_count,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/delete/<slug>", methods=["DELETE"])
@limiter.limit("30/minute")
def delete_laptop(slug):
    """Delete laptop by slug."""
    slug = sanitize_string(slug, max_length=160)

    if not slug:
        return jsonify(
            {"success": False, "error": "Valid laptop slug is required"}
        ), 400

    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        result = (
            curation_system.supabase.table("laptops")
            .delete()
            .eq("slug", slug)
            .execute()
        )

        return jsonify({"success": True, "message": f"Deleted laptop with slug {slug}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/clean", methods=["POST"])
@limiter.limit("30/minute")
def clean_duplicates():
    """Clean duplicate laptops."""
    status = initialize_curation()
    if "error" in status:
        return jsonify(status), 500

    try:
        # Find duplicates (same slug)
        result = curation_system.supabase.table("laptops").select("slug").execute()
        slugs = result.data or []

        duplicate_count = 0

        for laptop in slugs:
            # Check for duplicates (by slug)
            duplicates = (
                curation_system.supabase.table("laptops")
                .select("*")
                .eq("slug", laptop["slug"])
                .execute()
            )

            if len(duplicates.data) > 1:
                # Keep the latest one
                latest = max(
                    duplicates.data, key=lambda x: x.get("last_scraped_at", "")
                )

                # Delete others
                for dup in duplicates.data:
                    if dup["id"] != latest["id"]:
                        curation_system.supabase.table("laptops").delete().eq(
                            "id", dup["id"]
                        ).execute()
                        duplicate_count += 1

        return jsonify(
            {"success": True, "message": f"Cleaned {duplicate_count} duplicate laptops"}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/curation/health", methods=["GET"])
@limiter.limit("30/minute")
def health_check():
    """Health check endpoint for monitoring."""
    status = initialize_curation()

    # Add timestamp
    status["timestamp"] = datetime.now().isoformat()
    status["server_port"] = SERVER_PORT
    status["debug_mode"] = DEBUG_MODE
    status["success"] = True

    return jsonify(status)


# ============================================
# NEW PUBLIC API ENDPOINTS
# ============================================


@app.route("/api/laptops/<id>", methods=["GET"])
def get_laptop(id):
    """Get single laptop detail by ID."""
    id = sanitize_string(id, max_length=80)

    if not id:
        return jsonify({"success": False, "error": "Valid laptop ID is required"}), 400

    try:
        global curation_system
        if not curation_system or not curation_system.supabase:
            init_result = initialize_curation()
            if "error" in init_result:
                return jsonify(
                    {"success": False, "error": "Database not initialized"}
                ), 500

        result = (
            curation_system.supabase.table("laptops").select("*").eq("id", id).execute()
        )
        if not result.data:
            return jsonify({"success": False, "error": "Laptop not found"}), 404

        return jsonify({"success": True, "laptop": result.data[0]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/jurusan/<slug>", methods=["GET"])
def get_jurusan(slug):
    """Get jurusan data by slug."""
    slug = sanitize_string(slug, max_length=120)

    if not slug:
        return jsonify(
            {"success": False, "error": "Valid jurusan slug is required"}
        ), 400

    try:
        global curation_system
        if not curation_system or not curation_system.supabase:
            init_result = initialize_curation()
            if "error" in init_result:
                return jsonify(
                    {"success": False, "error": "Database not initialized"}
                ), 500

        result = (
            curation_system.supabase.table("jurusan")
            .select("*")
            .eq("slug", slug)
            .execute()
        )
        if not result.data:
            return jsonify({"success": False, "error": "Jurusan not found"}), 404

        return jsonify({"success": True, "jurusan": result.data[0]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/compare", methods=["POST"])
def compare_laptops():
    """Compare up to 3 laptops side by side."""
    try:
        data, error_response = get_json_body()
        if error_response:
            return error_response

        laptop_ids = data.get("laptop_ids", [])

        if not isinstance(laptop_ids, list):
            return jsonify(
                {"success": False, "error": "laptop_ids must be an array"}
            ), 400

        laptop_ids = [
            sanitize_string(lid, max_length=80)
            for lid in laptop_ids
            if sanitize_string(lid, max_length=80)
        ]

        if len(laptop_ids) > 3:
            return jsonify(
                {"success": False, "error": "Maximum 3 laptops for comparison"}
            ), 400

        global curation_system
        if not curation_system or not curation_system.supabase:
            init_result = initialize_curation()
            if "error" in init_result:
                return jsonify(
                    {"success": False, "error": "Database not initialized"}
                ), 500

        laptops = []
        for lid in laptop_ids:
            result = (
                curation_system.supabase.table("laptops")
                .select("*")
                .eq("id", lid)
                .execute()
            )
            if result.data:
                laptops.append(result.data[0])

        return jsonify({"success": True, "laptops": laptops, "count": len(laptops)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/search/suggestions", methods=["GET"])
@limiter.limit("30/minute")
def search_suggestions():
    """Autocomplete suggestions for search."""
    try:
        q = sanitize_string(request.args.get("q", ""), max_length=120)
        if len(q) < 2:
            return jsonify({"success": True, "suggestions": []})

        global curation_system
        if not curation_system or not curation_system.supabase:
            init_result = initialize_curation()
            if "error" in init_result:
                return jsonify(
                    {"success": False, "error": "Database not initialized"}
                ), 500

        result = (
            curation_system.supabase.table("laptops")
            .select("full_name,brand")
            .ilike("full_name", f"%{q}%")
            .limit(10)
            .execute()
        )
        suggestions = list(set([l["full_name"] for l in (result.data or [])]))

        return jsonify({"success": True, "suggestions": suggestions[:10]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Dashboard statistics."""
    try:
        global curation_system
        if not curation_system or not curation_system.supabase:
            init_result = initialize_curation()
            if "error" in init_result:
                return jsonify(
                    {"success": False, "error": "Database not initialized"}
                ), 500

        laptops_result = (
            curation_system.supabase.table("laptops")
            .select("id,brand,price_tokopedia")
            .execute()
        )
        laptops = laptops_result.data or []

        brands = {}
        prices = []
        for l in laptops:
            brand = l.get("brand", "Unknown")
            brands[brand] = brands.get(brand, 0) + 1
            if l.get("price_tokopedia"):
                prices.append(l["price_tokopedia"])

        return jsonify(
            {
                "success": True,
                "total_laptops": len(laptops),
                "total_brands": len(brands),
                "brands": brands,
                "price_min": min(prices) if prices else 0,
                "price_max": max(prices) if prices else 0,
                "price_avg": sum(prices) // len(prices) if prices else 0,
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    # Validate environment before starting
    print("=" * 60)
    print("🚀 KulPik Auto-Curation Server Starting...")
    print("=" * 60)
    print()

    try:
        from scripts.validate_env import validate_environment

        if not validate_environment():
            print()
            print("⚠️  Environment validation failed!")
            print("The server will start but some features may not work properly.")
            print("Please fix the environment variables as soon as possible.")
            print()
    except ImportError:
        # Validation script not available, continue anyway
        print("⚠️  Environment validation script not found, skipping...")
        print()

    # Initialize on startup
    init_result = initialize_curation()

    if "error" in init_result:
        print(f"⚠️  Warning: {init_result['error']}")
        print("The server will start but curation features may be limited.")
    else:
        print("✅ Curation system initialized successfully")

    print()
    print(f"🌐 Server running on http://0.0.0.0:{SERVER_PORT}")
    print(f"🏥 Health check: http://0.0.0.0:{SERVER_PORT}/api/curation/health")
    print("=" * 60)
    print()

    # Start server (production-ready configuration)
    # Never use debug=True in production!
    app.run(
        host="0.0.0.0",
        port=SERVER_PORT,
        debug=DEBUG_MODE,  # Only enable debug in development
    )

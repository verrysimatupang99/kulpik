# KulPik Procfile for production deployment
# Used by Railway, Heroku, and similar platforms

# Web server (API backend)
web: gunicorn curation_server:app --bind 0.0.0.0:$PORT --workers 2

# Worker for auto-curation (runs daily)
worker: python auto_curation.py --curate 30

# Optional: Embedding update worker
embeddings: python auto_curation.py --update-embeddings --limit 100

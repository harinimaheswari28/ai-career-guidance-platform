import os
import sys

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.app import create_app, db
from backend.config import Config

app = create_app(Config)

@app.cli.command("init-db")
def init_db_command():
    """Create all database tables."""
    with app.app_context():
        db.create_all()
        print("Database tables created successfully.")

@app.cli.command("seed-db")
def seed_db_command():
    """Seed the database with default questions, careers, roadmaps, and admin account."""
    from database.seed import seed_database
    seed_database()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Run in threaded mode
    print(f"Starting AI Career Guidance Backend API on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)

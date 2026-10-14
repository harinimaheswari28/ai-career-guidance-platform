import os
from datetime import timedelta
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'ai-career-dev-secret-key-998244353')
    
    # Database URL: Supports MySQL (e.g. mysql+pymysql://root:password@localhost:3306/ai_career_db)
    # Defaults to SQLite for immediate zero-config development when MySQL is not locally running
    DATABASE_URL = os.environ.get('DATABASE_URL')
    if DATABASE_URL:
        # Some platforms provide postgres:// or mysql:// without driver
        if DATABASE_URL.startswith('mysql://'):
            DATABASE_URL = DATABASE_URL.replace('mysql://', 'mysql+pymysql://', 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Default SQLite database path
        default_db_path = os.path.join(BASE_DIR, 'ai_career.db').replace('\\', '/')
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{default_db_path}'
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 280,
        'pool_pre_ping': True
    }
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-career-guide-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # CORS Configuration
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    CORS_ORIGINS = [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000']
    
    # Initial Admin Setup Defaults (can be customized via environment variables)
    ADMIN_INIT_NAME = os.environ.get('ADMIN_INIT_NAME', 'System Administrator')
    ADMIN_INIT_EMAIL = os.environ.get('ADMIN_INIT_EMAIL', 'admin@aicareer.edu')
    ADMIN_INIT_PASSWORD = os.environ.get('ADMIN_INIT_PASSWORD', 'AdminPass@2026')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)

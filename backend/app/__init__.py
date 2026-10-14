import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from backend.config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app, origins=app.config.get('CORS_ORIGINS'), supports_credentials=True)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # JWT Error handlers for user-friendly responses
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({
            'status': 'error',
            'message': 'Missing or invalid authentication token. Please log in.'
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'status': 'error',
            'message': 'Authentication session expired. Please log in again.'
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({
            'status': 'error',
            'message': 'Signature verification failed. Invalid token.'
        }), 401

    # Register API blueprints
    from backend.app.routes.auth_routes import auth_bp
    from backend.app.routes.profile_routes import profile_bp
    from backend.app.routes.career_routes import career_bp
    from backend.app.routes.assessment_routes import assessment_bp
    from backend.app.routes.course_routes import course_bp
    from backend.app.routes.roadmap_routes import roadmap_bp
    from backend.app.routes.dashboard_routes import dashboard_bp
    from backend.app.routes.admin_routes import admin_bp
    from backend.app.routes.notification_routes import notification_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(career_bp, url_prefix='/api/careers')
    app.register_blueprint(assessment_bp, url_prefix='/api/assessments')
    app.register_blueprint(course_bp, url_prefix='/api/courses')
    app.register_blueprint(roadmap_bp, url_prefix='/api/roadmaps')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')

    # Global health and 404 handlers
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'AI Career Guidance REST API',
            'version': '1.0.0'
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'status': 'error', 'message': 'Requested resource was not found'}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'status': 'error', 'message': 'Internal server error occurred'}), 500

    return app

import secrets
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.app import db
from backend.app.models.user import User, UserProfile
from backend.app.models.activity import Notification
from backend.app.utils.validators import validate_email, validate_password
from backend.app.services.recommendation_engine import CareerRecommendationEngine

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''
    education_level = (data.get('education_level') or "Bachelor's Degree").strip()
    interests = (data.get('interests') or '').strip()

    if not name:
        return jsonify({'status': 'error', 'message': 'Full name is required.'}), 400

    if not validate_email(email):
        return jsonify({'status': 'error', 'message': 'A valid email address is required.'}), 400

    is_valid, err_msg = validate_password(password)
    if not is_valid:
        return jsonify({'status': 'error', 'message': err_msg}), 400

    if password != confirm_password:
        return jsonify({'status': 'error', 'message': 'Passwords do not match.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'An account with this email already exists.'}), 409

    # Create user
    user = User(name=name, email=email, role='student')
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    # Create user profile
    profile = UserProfile(
        user_id=user.id,
        education_level=education_level,
        interests=interests
    )
    db.session.add(profile)

    # Initial welcome notification
    welcome_notif = Notification(
        user_id=user.id,
        title='Welcome to AI Career Guidance!',
        message='Start by taking the Skills Assessment to discover your ideal tech career path.',
        type='info'
    )
    db.session.add(welcome_notif)
    db.session.commit()

    # Generate baseline recommendations
    try:
        CareerRecommendationEngine.generate_recommendations_for_user(user.id)
    except Exception:
        pass

    token = create_access_token(identity=str(user.id))

    return jsonify({
        'status': 'success',
        'message': 'Account registered successfully.',
        'token': token,
        'user': user.to_dict(),
        'profile': profile.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'status': 'error', 'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'status': 'error', 'message': 'Invalid email or password.'}), 401

    if not user.is_active:
        return jsonify({'status': 'error', 'message': 'This account has been deactivated.'}), 403

    token = create_access_token(identity=str(user.id))
    profile_data = user.profile.to_dict() if user.profile else {}

    return jsonify({
        'status': 'success',
        'message': 'Logged in successfully.',
        'token': token,
        'user': user.to_dict(),
        'profile': profile_data
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user_info():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found.'}), 404

    profile_data = user.profile.to_dict() if user.profile else {}

    return jsonify({
        'status': 'success',
        'user': user.to_dict(),
        'profile': profile_data
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()

    if not validate_email(email):
        return jsonify({'status': 'error', 'message': 'Valid email is required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        # Avoid user enumeration by returning a friendly response
        return jsonify({
            'status': 'success',
            'message': 'If that email is registered, password reset instructions have been generated.'
        }), 200

    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Password reset token generated successfully.',
        'reset_token': reset_token
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    token = data.get('token') or ''
    new_password = data.get('new_password') or ''

    if not token:
        return jsonify({'status': 'error', 'message': 'Reset token is required.'}), 400

    is_valid, err_msg = validate_password(new_password)
    if not is_valid:
        return jsonify({'status': 'error', 'message': err_msg}), 400

    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.reset_token_expires:
        return jsonify({'status': 'error', 'message': 'Invalid or expired password reset token.'}), 400

    now_utc = datetime.now(timezone.utc)
    # Handle timezone-naive / aware datetime
    exp = user.reset_token_expires
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)

    if now_utc > exp:
        return jsonify({'status': 'error', 'message': 'Password reset token has expired.'}), 400

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Your password has been successfully reset. You can now log in.'
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({
        'status': 'success',
        'message': 'Successfully logged out.'
    }), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.app.models.user import User, UserProfile
from backend.app.models.career import Skill, UserSkill
from backend.app.utils.validators import validate_password
from backend.app.services.recommendation_engine import CareerRecommendationEngine

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    profile = user.profile
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.session.add(profile)
        db.session.commit()

    skills = [us.to_dict() for us in user.skills.all()]

    return jsonify({
        'status': 'success',
        'user': user.to_dict(),
        'profile': profile.to_dict(),
        'skills': skills
    }), 200

@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    data = request.get_json() or {}
    
    # Update user basic info
    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()

    profile = user.profile
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.session.add(profile)

    if 'education_level' in data:
        profile.education_level = data['education_level']
    if 'interests' in data:
        profile.interests = data['interests']
    if 'bio' in data:
        profile.bio = data['bio']
    if 'avatar_url' in data:
        profile.avatar_url = data['avatar_url']
    if 'preferred_work_env' in data:
        profile.preferred_work_env = data['preferred_work_env']
    if 'career_goals' in data:
        profile.career_goals = data['career_goals']
    if 'notification_email' in data:
        profile.notification_email = bool(data['notification_email'])
    if 'notification_in_app' in data:
        profile.notification_in_app = bool(data['notification_in_app'])
    if 'theme_preference' in data:
        profile.theme_preference = data['theme_preference']

    db.session.commit()

    # Recalculate recommendations in case interests or education changed
    try:
        CareerRecommendationEngine.generate_recommendations_for_user(user.id)
    except Exception:
        pass

    return jsonify({
        'status': 'success',
        'message': 'Profile updated successfully.',
        'user': user.to_dict(),
        'profile': profile.to_dict()
    }), 200

@profile_bp.route('/skills', methods=['POST'])
@jwt_required()
def add_user_skill():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    skill_name = (data.get('skill_name') or '').strip()
    proficiency = data.get('proficiency_level', 'Intermediate')

    if not skill_name:
        return jsonify({'status': 'error', 'message': 'Skill name is required.'}), 400

    # Find or create skill
    skill = Skill.query.filter(Skill.name.ilike(skill_name)).first()
    if not skill:
        skill = Skill(name=skill_name, category=data.get('category', 'technical'))
        db.session.add(skill)
        db.session.flush()

    user_skill = UserSkill.query.filter_by(user_id=user_id, skill_id=skill.id).first()
    if user_skill:
        user_skill.proficiency_level = proficiency
    else:
        user_skill = UserSkill(user_id=user_id, skill_id=skill.id, proficiency_level=proficiency)
        db.session.add(user_skill)

    db.session.commit()

    # Recalculate recommendations
    try:
        CareerRecommendationEngine.generate_recommendations_for_user(user_id)
    except Exception:
        pass

    return jsonify({
        'status': 'success',
        'message': f"Skill '{skill.name}' saved.",
        'skill': user_skill.to_dict()
    }), 200

@profile_bp.route('/skills/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def delete_user_skill(skill_id):
    user_id = int(get_jwt_identity())
    user_skill = UserSkill.query.filter_by(user_id=user_id, skill_id=skill_id).first()
    if not user_skill:
        return jsonify({'status': 'error', 'message': 'Skill not found on user profile.'}), 404

    db.session.delete(user_skill)
    db.session.commit()

    try:
        CareerRecommendationEngine.generate_recommendations_for_user(user_id)
    except Exception:
        pass

    return jsonify({'status': 'success', 'message': 'Skill removed.'}), 200

@profile_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    data = request.get_json() or {}
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    if not user.check_password(current_password):
        return jsonify({'status': 'error', 'message': 'Current password is incorrect.'}), 400

    is_valid, err_msg = validate_password(new_password)
    if not is_valid:
        return jsonify({'status': 'error', 'message': err_msg}), 400

    user.set_password(new_password)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Password changed successfully.'}), 200

@profile_bp.route('/account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Your account has been deleted.'}), 200

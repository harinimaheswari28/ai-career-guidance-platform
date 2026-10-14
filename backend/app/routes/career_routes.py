import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from backend.app import db
from backend.app.models.career import Career, Skill, UserSkill, CareerSkill, CareerRecommendation, CareerComparison
from backend.app.models.activity import SavedCareer
from backend.app.services.recommendation_engine import CareerRecommendationEngine

career_bp = Blueprint('careers', __name__)

@career_bp.route('', methods=['GET'])
def get_careers():
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    difficulty = request.args.get('difficulty', '').strip()
    skill_filter = request.args.get('skill', '').strip()

    query = Career.query

    if search:
        query = query.filter(
            (Career.title.ilike(f'%{search}%')) |
            (Career.description.ilike(f'%{search}%'))
        )
    if category:
        query = query.filter(Career.category.ilike(f'%{category}%'))
    if difficulty:
        query = query.filter(Career.difficulty.ilike(difficulty))
    if skill_filter:
        query = query.join(CareerSkill).join(Skill).filter(Skill.name.ilike(f'%{skill_filter}%'))

    careers = query.all()
    return jsonify({
        'status': 'success',
        'count': len(careers),
        'careers': [c.to_dict() for c in careers]
    }), 200

@career_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Career.category).distinct().all()
    cat_list = [c[0] for c in categories if c[0]]
    return jsonify({
        'status': 'success',
        'categories': sorted(cat_list)
    }), 200

@career_bp.route('/<int:career_id>', methods=['GET'])
def get_career_detail(career_id):
    career = db.session.get(Career, career_id)
    if not career:
        return jsonify({'status': 'error', 'message': 'Career path not found.'}), 404

    data = career.to_dict(include_skills=True)

    # Attach courses
    courses = [cc.course.to_dict() for cc in career.career_courses if cc.course]
    data['courses'] = courses

    # Attach roadmap summary if available
    if career.roadmap:
        data['roadmap'] = career.roadmap.to_dict()
    else:
        data['roadmap'] = None

    # If user is logged in, attach user matching skills and compatibility
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            rec = CareerRecommendation.query.filter_by(user_id=int(user_id), career_id=career.id).first()
            if rec:
                data['user_compatibility'] = rec.to_dict()
            is_saved = SavedCareer.query.filter_by(user_id=int(user_id), career_id=career.id).first() is not None
            data['is_saved'] = is_saved
    except Exception:
        pass

    return jsonify({
        'status': 'success',
        'career': data
    }), 200

@career_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_user_recommendations():
    user_id = int(get_jwt_identity())
    recs = CareerRecommendation.query.filter_by(user_id=user_id).order_by(CareerRecommendation.rank_order.asc()).all()
    
    # If no recommendations have been generated yet, auto-generate them
    if not recs:
        recs = CareerRecommendationEngine.generate_recommendations_for_user(user_id)

    return jsonify({
        'status': 'success',
        'count': len(recs),
        'recommendations': [r.to_dict() for r in recs]
    }), 200

@career_bp.route('/recommendations/generate', methods=['POST'])
@jwt_required()
def regenerate_recommendations():
    user_id = int(get_jwt_identity())
    recs = CareerRecommendationEngine.generate_recommendations_for_user(user_id)
    return jsonify({
        'status': 'success',
        'message': 'Career recommendations recalculated based on your latest profile and assessment results.',
        'recommendations': [r.to_dict() for r in recs]
    }), 200

@career_bp.route('/compare', methods=['POST'])
def compare_careers():
    data = request.get_json() or {}
    career_ids = data.get('career_ids', [])

    if not isinstance(career_ids, list) or len(career_ids) < 2 or len(career_ids) > 3:
        return jsonify({
            'status': 'error',
            'message': 'Please select between 2 and 3 careers to compare.'
        }), 400

    careers = Career.query.filter(Career.id.in_(career_ids)).all()
    if len(careers) != len(career_ids):
        return jsonify({'status': 'error', 'message': 'One or more selected careers were not found.'}), 404

    # Calculate user skill gaps if logged in
    user_skill_names = set()
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            uskills = UserSkill.query.filter_by(user_id=int(user_id)).all()
            user_skill_names = set(us.skill.name.lower() for us in uskills if us.skill)
    except Exception:
        pass

    comparison_items = []
    for c in careers:
        item = c.to_dict(include_skills=True)
        all_req = item.get('required_skills', [])
        item['matched_skills'] = [s for s in all_req if s.lower() in user_skill_names]
        item['missing_skills'] = [s for s in all_req if s.lower() not in user_skill_names]
        comparison_items.append(item)

    return jsonify({
        'status': 'success',
        'careers': comparison_items
    }), 200

@career_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_careers():
    user_id = int(get_jwt_identity())
    saved = SavedCareer.query.filter_by(user_id=user_id).order_by(SavedCareer.created_at.desc()).all()
    return jsonify({
        'status': 'success',
        'saved_careers': [s.to_dict() for s in saved]
    }), 200

@career_bp.route('/save/<int:career_id>', methods=['POST'])
@jwt_required()
def toggle_save_career(career_id):
    user_id = int(get_jwt_identity())
    career = db.session.get(Career, career_id)
    if not career:
        return jsonify({'status': 'error', 'message': 'Career not found.'}), 404

    existing = SavedCareer.query.filter_by(user_id=user_id, career_id=career_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'status': 'success', 'is_saved': False, 'message': 'Career removed from saved list.'}), 200
    else:
        new_save = SavedCareer(user_id=user_id, career_id=career_id)
        db.session.add(new_save)
        db.session.commit()
        return jsonify({'status': 'success', 'is_saved': True, 'message': 'Career saved to your list.'}), 201

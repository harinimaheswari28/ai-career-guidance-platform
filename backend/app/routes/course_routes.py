from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from backend.app import db
from backend.app.models.course import Course, SavedCourse

course_bp = Blueprint('courses', __name__)

@course_bp.route('', methods=['GET'])
def get_courses():
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    difficulty = request.args.get('difficulty', '').strip()
    free_only = request.args.get('is_free')

    query = Course.query

    if search:
        query = query.filter(
            (Course.title.ilike(f'%{search}%')) |
            (Course.description.ilike(f'%{search}%')) |
            (Course.provider.ilike(f'%{search}%'))
        )
    if category:
        query = query.filter(Course.category.ilike(f'%{category}%'))
    if difficulty:
        query = query.filter(Course.difficulty.ilike(difficulty))
    if free_only is not None and free_only.lower() in ['true', '1']:
        query = query.filter(Course.is_free == True)

    courses = query.all()
    
    # Check bookmarks if user logged in
    user_saved_ids = set()
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            saved = SavedCourse.query.filter_by(user_id=int(user_id)).all()
            user_saved_ids = set(s.course_id for s in saved)
    except Exception:
        pass

    results = []
    for c in courses:
        data = c.to_dict()
        data['is_saved'] = c.id in user_saved_ids
        results.append(data)

    return jsonify({
        'status': 'success',
        'count': len(results),
        'courses': results
    }), 200

@course_bp.route('/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    course = db.session.get(Course, course_id)
    if not course:
        return jsonify({'status': 'error', 'message': 'Course not found.'}), 404

    return jsonify({
        'status': 'success',
        'course': course.to_dict()
    }), 200

@course_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_courses():
    user_id = int(get_jwt_identity())
    saved = SavedCourse.query.filter_by(user_id=user_id).order_by(SavedCourse.created_at.desc()).all()
    return jsonify({
        'status': 'success',
        'saved_courses': [s.to_dict() for s in saved]
    }), 200

@course_bp.route('/save/<int:course_id>', methods=['POST'])
@jwt_required()
def toggle_save_course(course_id):
    user_id = int(get_jwt_identity())
    course = db.session.get(Course, course_id)
    if not course:
        return jsonify({'status': 'error', 'message': 'Course not found.'}), 404

    existing = SavedCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'status': 'success', 'is_saved': False, 'message': 'Course removed from bookmarks.'}), 200
    else:
        new_save = SavedCourse(user_id=user_id, course_id=course_id, status='saved')
        db.session.add(new_save)
        db.session.commit()
        return jsonify({'status': 'success', 'is_saved': True, 'message': 'Course bookmarked successfully.'}), 201

@course_bp.route('/progress/<int:course_id>', methods=['PUT'])
@jwt_required()
def update_course_progress(course_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    status = data.get('status', 'in-progress') # 'saved', 'in-progress', 'completed'

    saved = SavedCourse.query.filter_by(user_id=user_id, course_id=course_id).first()
    if not saved:
        saved = SavedCourse(user_id=user_id, course_id=course_id, status=status)
        db.session.add(saved)
    else:
        saved.status = status

    db.session.commit()
    return jsonify({
        'status': 'success',
        'message': f'Course status updated to {status}.',
        'course': saved.to_dict()
    }), 200

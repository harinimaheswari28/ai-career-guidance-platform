import json
from flask import Blueprint, request, jsonify
from backend.app import db
from backend.app.models.user import User, UserProfile
from backend.app.models.career import Career, Skill, CareerSkill
from backend.app.models.assessment import AssessmentQuestion, AssessmentOption, AssessmentAttempt
from backend.app.models.course import Course, CareerCourse
from backend.app.models.roadmap import LearningRoadmap, RoadmapStep, UserRoadmapProgress
from backend.app.utils.auth_helpers import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
@admin_required()
def get_admin_stats():
    total_users = User.query.count()
    total_students = User.query.filter_by(role='student').count()
    total_assessments = AssessmentAttempt.query.count()
    total_careers = Career.query.count()
    total_courses = Course.query.count()
    total_roadmap_milestones = UserRoadmapProgress.query.filter_by(is_completed=True).count()

    # Recent assessment attempts
    recent_attempts = AssessmentAttempt.query.order_by(AssessmentAttempt.completed_at.desc()).limit(5).all()
    recent_attempts_data = []
    for a in recent_attempts:
        user_name = a.user.name if a.user else 'Unknown'
        user_email = a.user.email if a.user else 'Unknown'
        recent_attempts_data.append({
            'id': a.id,
            'user_name': user_name,
            'user_email': user_email,
            'score': round(a.total_score, 1),
            'completed_at': a.completed_at.isoformat() if a.completed_at else None
        })

    # Recent user signups
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    recent_users_data = [u.to_dict() for u in recent_users]

    return jsonify({
        'status': 'success',
        'stats': {
            'total_users': total_users,
            'total_students': total_students,
            'total_assessments': total_assessments,
            'total_careers': total_careers,
            'total_courses': total_courses,
            'total_roadmap_milestones': total_roadmap_milestones
        },
        'recent_assessments': recent_attempts_data,
        'recent_users': recent_users_data
    }), 200

# User Management
@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_all_users():
    search = request.args.get('search', '').strip()
    role = request.args.get('role', '').strip()

    query = User.query
    if search:
        query = query.filter((User.name.ilike(f'%{search}%')) | (User.email.ilike(f'%{search}%')))
    if role:
        query = query.filter_by(role=role)

    users = query.order_by(User.created_at.desc()).all()
    user_list = []
    for u in users:
        d = u.to_dict()
        d['education_level'] = u.profile.education_level if u.profile else ''
        d['assessments_count'] = u.assessment_attempts.count()
        user_list.append(d)

    return jsonify({
        'status': 'success',
        'count': len(user_list),
        'users': user_list
    }), 200

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@admin_required()
def update_user_role(user_id):
    data = request.get_json() or {}
    new_role = data.get('role')
    if new_role not in ['student', 'admin']:
        return jsonify({'status': 'error', 'message': 'Role must be student or admin.'}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found.'}), 404

    user.role = new_role
    db.session.commit()
    return jsonify({'status': 'success', 'message': f'User role updated to {new_role}.', 'user': user.to_dict()}), 200

@admin_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@admin_required()
def toggle_user_status(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found.'}), 404

    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({
        'status': 'success',
        'message': f"User account {'activated' if user.is_active else 'deactivated'}.",
        'user': user.to_dict()
    }), 200

# Career Management
@admin_bp.route('/careers', methods=['POST'])
@admin_required()
def create_career():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    category = (data.get('category') or '').strip()
    description = (data.get('description') or '').strip()

    if not title or not category or not description:
        return jsonify({'status': 'error', 'message': 'Title, category, and description are required.'}), 400

    slug = title.lower().replace(' ', '-').replace('/', '-').replace('&', 'and')
    existing = Career.query.filter_by(title=title).first()
    if existing:
        return jsonify({'status': 'error', 'message': 'A career with this title already exists.'}), 409

    career = Career(
        title=title,
        slug=slug,
        category=category,
        description=description,
        education_req=data.get('education_req', "Bachelor's degree in Computer Science, IT, or related field"),
        difficulty=data.get('difficulty', 'Intermediate'),
        growth_outlook=data.get('growth_outlook', 'High Growth Potential'),
        typical_responsibilities=json.dumps(data.get('typical_responsibilities', [])),
        prerequisites=data.get('prerequisites', ''),
        example_projects=json.dumps(data.get('example_projects', []))
    )
    db.session.add(career)
    db.session.flush()

    # Add default roadmap
    roadmap = LearningRoadmap(career_id=career.id, title=f"{career.title} Mastery Roadmap", description=f"Comprehensive roadmap for becoming a {career.title}.")
    db.session.add(roadmap)

    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Career created successfully.', 'career': career.to_dict()}), 201

@admin_bp.route('/careers/<int:career_id>', methods=['PUT'])
@admin_required()
def update_career(career_id):
    career = db.session.get(Career, career_id)
    if not career:
        return jsonify({'status': 'error', 'message': 'Career not found.'}), 404

    data = request.get_json() or {}
    if 'title' in data and data['title'].strip():
        career.title = data['title'].strip()
        career.slug = career.title.lower().replace(' ', '-').replace('/', '-')
    if 'category' in data:
        career.category = data['category']
    if 'description' in data:
        career.description = data['description']
    if 'education_req' in data:
        career.education_req = data['education_req']
    if 'difficulty' in data:
        career.difficulty = data['difficulty']
    if 'growth_outlook' in data:
        career.growth_outlook = data['growth_outlook']
    if 'prerequisites' in data:
        career.prerequisites = data['prerequisites']

    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Career updated successfully.', 'career': career.to_dict()}), 200

@admin_bp.route('/careers/<int:career_id>', methods=['DELETE'])
@admin_required()
def delete_career(career_id):
    career = db.session.get(Career, career_id)
    if not career:
        return jsonify({'status': 'error', 'message': 'Career not found.'}), 404

    db.session.delete(career)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Career deleted successfully.'}), 200

# Assessment Questions Management
@admin_bp.route('/questions', methods=['POST'])
@admin_required()
def create_question():
    data = request.get_json() or {}
    section = data.get('section', 'technical')
    question_text = (data.get('question_text') or '').strip()
    options_data = data.get('options', [])

    if not question_text or not options_data:
        return jsonify({'status': 'error', 'message': 'Question text and options are required.'}), 400

    q = AssessmentQuestion(
        section=section,
        question_text=question_text,
        order_num=AssessmentQuestion.query.count() + 1
    )
    db.session.add(q)
    db.session.flush()

    for opt in options_data:
        o = AssessmentOption(
            question_id=q.id,
            option_text=opt.get('option_text', ''),
            score_weight=float(opt.get('score_weight', 1.0)),
            trait_tags=opt.get('trait_tags', '')
        )
        db.session.add(o)

    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Assessment question created.', 'question': q.to_dict()}), 201

@admin_bp.route('/questions/<int:question_id>', methods=['DELETE'])
@admin_required()
def delete_question(question_id):
    q = db.session.get(AssessmentQuestion, question_id)
    if not q:
        return jsonify({'status': 'error', 'message': 'Question not found.'}), 404

    db.session.delete(q)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Question deleted.'}), 200

# Course Management
@admin_bp.route('/courses', methods=['POST'])
@admin_required()
def create_course():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    provider = (data.get('provider') or '').strip()
    course_url = (data.get('course_url') or '').strip()

    if not title or not provider or not course_url:
        return jsonify({'status': 'error', 'message': 'Title, provider, and course URL are required.'}), 400

    course = Course(
        title=title,
        provider=provider,
        description=data.get('description', ''),
        category=data.get('category', 'Computer Science'),
        difficulty=data.get('difficulty', 'Beginner'),
        duration=data.get('duration', '4 weeks'),
        course_url=course_url,
        is_free=bool(data.get('is_free', True)),
        rating=float(data.get('rating', 4.8))
    )
    db.session.add(course)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Course created.', 'course': course.to_dict()}), 201

@admin_bp.route('/courses/<int:course_id>', methods=['DELETE'])
@admin_required()
def delete_course(course_id):
    course = db.session.get(Course, course_id)
    if not course:
        return jsonify({'status': 'error', 'message': 'Course not found.'}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Course deleted.'}), 200

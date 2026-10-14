import json
from datetime import datetime, timezone, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.app.models.user import User
from backend.app.models.career import CareerRecommendation, Career
from backend.app.models.assessment import AssessmentAttempt
from backend.app.models.course import Course, SavedCourse
from backend.app.models.roadmap import UserRoadmapProgress, LearningRoadmap
from backend.app.models.activity import SavedCareer, LearningGoal, Notification
from backend.app.services.recommendation_engine import CareerRecommendationEngine

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found.'}), 404

    profile = user.profile

    # 1. Profile Completion Percentage
    profile_fields = [
        bool(user.name),
        bool(user.email),
        bool(profile and profile.education_level),
        bool(profile and profile.interests),
        bool(profile and profile.bio),
        bool(profile and profile.career_goals),
        bool(user.skills.count() > 0)
    ]
    profile_completion = round((sum(1 for f in profile_fields if f) / len(profile_fields)) * 100)

    # 2. Latest Assessment
    latest_attempt = AssessmentAttempt.query.filter_by(user_id=user_id).order_by(AssessmentAttempt.completed_at.desc()).first()
    latest_score = latest_attempt.total_score if latest_attempt else None

    # 3. Recommendations
    recs = CareerRecommendation.query.filter_by(user_id=user_id).order_by(CareerRecommendation.rank_order.asc()).limit(4).all()
    if not recs:
        recs = CareerRecommendationEngine.generate_recommendations_for_user(user_id)[:4]

    # 4. Recommended Courses based on top recommendation missing skills or career
    top_courses = []
    if recs:
        top_career_id = recs[0].career_id
        top_career = db.session.get(Career, top_career_id)
        if top_career:
            for cc in top_career.career_courses[:4]:
                if cc.course:
                    top_courses.append(cc.course.to_dict())

    if not top_courses:
        # Fallback to top featured courses
        all_courses = Course.query.limit(4).all()
        top_courses = [c.to_dict() for c in all_courses]

    # 5. Career Readiness Progress (average of profile completion, top compatibility score, and roadmap completion)
    top_compat = recs[0].compatibility_score if recs else 40.0
    completed_steps_count = UserRoadmapProgress.query.filter_by(user_id=user_id, is_completed=True).count()
    roadmap_readiness = min(completed_steps_count * 15.0, 100.0)
    
    career_readiness = round(
        (profile_completion * 0.25) +
        (top_compat * 0.45) +
        (roadmap_readiness * 0.30)
    )

    # 6. Saved Careers
    saved_careers = [sc.to_dict() for sc in SavedCareer.query.filter_by(user_id=user_id).order_by(SavedCareer.created_at.desc()).limit(3).all()]

    # 7. Learning Goals
    goals = [g.to_dict() for g in LearningGoal.query.filter_by(user_id=user_id).order_by(LearningGoal.created_at.desc()).limit(5).all()]

    # 8. Weekly Activity Data for Recharts chart
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    today_weekday = datetime.now(timezone.utc).weekday()
    
    # Generate realistic activity data anchored to real user events
    activity_chart = []
    base_activity = 1 if latest_attempt else 0
    for idx, day in enumerate(days):
        val = 0
        if idx <= today_weekday:
            val = base_activity + (completed_steps_count if idx == today_weekday else 1)
        activity_chart.append({
            'day': day,
            'hours': max(val * 0.8, 0.5 if idx <= today_weekday else 0.0),
            'tasks': val
        })

    return jsonify({
        'status': 'success',
        'welcome_message': f"Welcome back, {user.name}!",
        'user': user.to_dict(),
        'profile_completion': profile_completion,
        'latest_assessment_score': latest_score,
        'career_readiness': career_readiness,
        'top_recommendations': [r.to_dict() for r in recs],
        'recommended_courses': top_courses,
        'saved_careers': saved_careers,
        'learning_goals': goals,
        'weekly_activity': activity_chart
    }), 200

@dashboard_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress_data():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found.'}), 404

    # 1. Assessment History
    attempts = [a.to_dict() for a in AssessmentAttempt.query.filter_by(user_id=user_id).order_by(AssessmentAttempt.completed_at.asc()).all()]

    # 2. Compatibility Scores
    recs = [r.to_dict() for r in CareerRecommendation.query.filter_by(user_id=user_id).order_by(CareerRecommendation.rank_order.asc()).all()]

    # 3. Roadmap Progress
    completed_progress = UserRoadmapProgress.query.filter_by(user_id=user_id, is_completed=True).all()
    completed_steps_count = len(completed_progress)

    # 4. Course Progress
    saved_courses = [sc.to_dict() for sc in SavedCourse.query.filter_by(user_id=user_id).all()]
    completed_courses_count = sum(1 for c in saved_courses if c.get('status') == 'completed')

    # 5. Goals
    goals = [g.to_dict() for g in LearningGoal.query.filter_by(user_id=user_id).all()]
    completed_goals_count = sum(1 for g in goals if g.get('is_completed'))

    # 6. Milestone Badges
    badges = [
        {
            'id': 'badge_signup',
            'title': 'Explorer Initiated',
            'description': 'Joined the AI Career Guidance platform',
            'icon': 'Compass',
            'unlocked': True,
            'date': user.created_at.strftime('%Y-%m-%d') if user.created_at else '2026-10-13'
        },
        {
            'id': 'badge_assessment',
            'title': 'Self-Discovery Master',
            'description': 'Completed the comprehensive skills assessment',
            'icon': 'Brain',
            'unlocked': len(attempts) > 0,
            'date': attempts[-1]['completed_at'][:10] if attempts else None
        },
        {
            'id': 'badge_roadmap',
            'title': 'Roadmap Pioneer',
            'description': 'Completed your first roadmap milestone',
            'icon': 'MapPin',
            'unlocked': completed_steps_count >= 1,
            'date': None
        },
        {
            'id': 'badge_course',
            'title': 'Knowledge Seeker',
            'description': 'Bookmarked 3 or more recommended courses',
            'icon': 'BookOpen',
            'unlocked': len(saved_courses) >= 3,
            'date': None
        },
        {
            'id': 'badge_goal',
            'title': 'Goal Crusher',
            'description': 'Completed at least one target learning goal',
            'icon': 'Target',
            'unlocked': completed_goals_count >= 1,
            'date': None
        }
    ]

    return jsonify({
        'status': 'success',
        'assessment_history': attempts,
        'recommendations': recs,
        'completed_steps_count': completed_steps_count,
        'completed_courses_count': completed_courses_count,
        'completed_goals_count': completed_goals_count,
        'goals': goals,
        'badges': badges
    }), 200

from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from backend.app import db
from backend.app.models.career import Career
from backend.app.models.roadmap import LearningRoadmap, RoadmapStep, UserRoadmapProgress
from backend.app.models.activity import Notification

roadmap_bp = Blueprint('roadmaps', __name__)

@roadmap_bp.route('/<int:career_id>', methods=['GET'])
def get_career_roadmap(career_id):
    career = db.session.get(Career, career_id)
    if not career:
        return jsonify({'status': 'error', 'message': 'Career not found.'}), 404

    roadmap = LearningRoadmap.query.filter_by(career_id=career_id).first()
    if not roadmap:
        return jsonify({
            'status': 'success',
            'roadmap': None,
            'message': 'No roadmap defined yet for this career.'
        }), 200

    data = roadmap.to_dict()

    # If user logged in, check user's completed steps
    completed_step_ids = set()
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            progress_records = UserRoadmapProgress.query.filter_by(user_id=int(user_id), is_completed=True).all()
            completed_step_ids = set(p.step_id for p in progress_records)
    except Exception:
        pass

    total_steps = len(data['steps'])
    user_completed_count = 0

    for step in data['steps']:
        is_done = step['id'] in completed_step_ids
        step['is_completed'] = is_done
        if is_done:
            user_completed_count += 1

    completion_percentage = round((user_completed_count / total_steps * 100.0) if total_steps > 0 else 0.0, 1)

    return jsonify({
        'status': 'success',
        'career_title': career.title,
        'roadmap': data,
        'total_steps': total_steps,
        'completed_steps': user_completed_count,
        'completion_percentage': completion_percentage
    }), 200

@roadmap_bp.route('/steps/<int:step_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_step_progress(step_id):
    user_id = int(get_jwt_identity())
    step = db.session.get(RoadmapStep, step_id)
    if not step:
        return jsonify({'status': 'error', 'message': 'Roadmap step not found.'}), 404

    progress = UserRoadmapProgress.query.filter_by(user_id=user_id, step_id=step_id).first()
    if not progress:
        progress = UserRoadmapProgress(
            user_id=user_id,
            step_id=step_id,
            is_completed=True,
            completed_at=datetime.now(timezone.utc)
        )
        db.session.add(progress)
        is_now_completed = True
        
        # Add notification for milestone
        notif = Notification(
            user_id=user_id,
            title='Roadmap Milestone Achieved!',
            message=f"You marked Stage {step.stage_number}: '{step.stage_title}' as completed.",
            type='success'
        )
        db.session.add(notif)
    else:
        progress.is_completed = not progress.is_completed
        progress.completed_at = datetime.now(timezone.utc) if progress.is_completed else None
        is_now_completed = progress.is_completed

    db.session.commit()

    return jsonify({
        'status': 'success',
        'step_id': step_id,
        'is_completed': is_now_completed,
        'message': f"Step marked as {'completed' if is_now_completed else 'incomplete'}."
    }), 200

@roadmap_bp.route('/my-progress', methods=['GET'])
@jwt_required()
def get_user_roadmap_stats():
    user_id = int(get_jwt_identity())
    completed_steps = UserRoadmapProgress.query.filter_by(user_id=user_id, is_completed=True).all()
    completed_ids = set(p.step_id for p in completed_steps)

    all_roadmaps = LearningRoadmap.query.all()
    roadmap_stats = []

    for r in all_roadmaps:
        steps = r.steps
        total = len(steps)
        done = sum(1 for s in steps if s.id in completed_ids)
        pct = round((done / total * 100.0) if total > 0 else 0.0, 1)
        roadmap_stats.append({
            'roadmap_id': r.id,
            'career_id': r.career_id,
            'career_title': r.career.title if r.career else 'Career Path',
            'total_steps': total,
            'completed_steps': done,
            'completion_percentage': pct
        })

    return jsonify({
        'status': 'success',
        'roadmaps': roadmap_stats,
        'total_completed_steps': len(completed_steps)
    }), 200

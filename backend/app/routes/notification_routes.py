from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.app.models.activity import Notification, LearningGoal

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = int(get_jwt_identity())
    notifs = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    unread_count = sum(1 for n in notifs if not n.is_read)
    return jsonify({
        'status': 'success',
        'notifications': [n.to_dict() for n in notifs],
        'unread_count': unread_count
    }), 200

@notification_bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notif_id):
    user_id = int(get_jwt_identity())
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if not notif:
        return jsonify({'status': 'error', 'message': 'Notification not found.'}), 404

    notif.is_read = True
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Marked as read.'}), 200

@notification_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())
    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'All notifications marked as read.'}), 200

@notification_bp.route('/<int:notif_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notif_id):
    user_id = int(get_jwt_identity())
    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if not notif:
        return jsonify({'status': 'error', 'message': 'Notification not found.'}), 404

    db.session.delete(notif)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Notification removed.'}), 200

# Learning Goals CRUD endpoints
@notification_bp.route('/goals', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = int(get_jwt_identity())
    goals = LearningGoal.query.filter_by(user_id=user_id).order_by(LearningGoal.created_at.desc()).all()
    return jsonify({
        'status': 'success',
        'goals': [g.to_dict() for g in goals]
    }), 200

@notification_bp.route('/goals', methods=['POST'])
@jwt_required()
def create_goal():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    target_date = data.get('target_date', '')

    if not title:
        return jsonify({'status': 'error', 'message': 'Goal title is required.'}), 400

    goal = LearningGoal(
        user_id=user_id,
        title=title,
        target_date=target_date,
        is_completed=False
    )
    db.session.add(goal)
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Learning goal created.',
        'goal': goal.to_dict()
    }), 201

@notification_bp.route('/goals/<int:goal_id>/toggle', methods=['PUT'])
@jwt_required()
def toggle_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = LearningGoal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({'status': 'error', 'message': 'Goal not found.'}), 404

    goal.is_completed = not goal.is_completed
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': f"Goal marked as {'completed' if goal.is_completed else 'active'}.",
        'goal': goal.to_dict()
    }), 200

@notification_bp.route('/goals/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = LearningGoal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({'status': 'error', 'message': 'Goal not found.'}), 404

    db.session.delete(goal)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Goal deleted.'}), 200

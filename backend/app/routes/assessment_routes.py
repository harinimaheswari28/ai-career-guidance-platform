from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.app.models.assessment import (
    AssessmentQuestion, AssessmentOption, AssessmentAttempt, AssessmentAnswer
)
from backend.app.services.scoring_service import AssessmentScoringService

assessment_bp = Blueprint('assessments', __name__)

@assessment_bp.route('', methods=['GET'])
def get_assessment_meta():
    questions_count = AssessmentQuestion.query.count()
    sections = [
        {'id': 'technical', 'title': 'Technical Skills', 'description': 'Programming, architectures, frameworks, and system building aptitude.'},
        {'id': 'logical', 'title': 'Logical Reasoning', 'description': 'Algorithmic deduction, analytical patterns, and problem decomposition.'},
        {'id': 'communication', 'title': 'Communication & Collaboration', 'description': 'Cross-functional teamwork, presenting ideas, and documentation.'},
        {'id': 'problem_solving', 'title': 'Problem-Solving Ability', 'description': 'Debugging, handling ambiguity, and root cause analysis.'},
        {'id': 'creativity', 'title': 'Creativity & Design', 'description': 'User-centric visual aesthetics, innovative UX ideas, and product sense.'},
        {'id': 'work_preferences', 'title': 'Interests & Work Preferences', 'description': 'Focus areas from data science, frontend, systems, to cloud.'},
        {'id': 'work_env', 'title': 'Preferred Work Environment', 'description': 'Startup agility, research environments, or enterprise stability.'},
        {'id': 'education_exp', 'title': 'Education Level & Background', 'description': 'Academic preparation, self-study milestones, and coursework.'}
    ]

    return jsonify({
        'status': 'success',
        'title': 'Comprehensive AI Engineering Aptitude & Career Guidance Assessment',
        'disclaimer': 'This assessment is an algorithmic career guidance tool designed for educational planning, not an officially certified psychological or clinical evaluation.',
        'total_questions': questions_count,
        'sections': sections
    }), 200

@assessment_bp.route('/questions', methods=['GET'])
def get_assessment_questions():
    questions = AssessmentQuestion.query.order_by(AssessmentQuestion.order_num.asc()).all()
    return jsonify({
        'status': 'success',
        'count': len(questions),
        'questions': [q.to_dict() for q in questions]
    }), 200

@assessment_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_assessment():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    answers = data.get('answers', {})

    if not answers:
        return jsonify({'status': 'error', 'message': 'No answers provided for submission.'}), 400

    attempt = AssessmentScoringService.evaluate_submission(user_id, answers)
    if not attempt:
        return jsonify({'status': 'error', 'message': 'Failed to process assessment submission.'}), 500

    return jsonify({
        'status': 'success',
        'message': 'Assessment submitted and scored successfully.',
        'result': attempt.to_dict()
    }), 201

@assessment_bp.route('/history', methods=['GET'])
@jwt_required()
def get_assessment_history():
    user_id = int(get_jwt_identity())
    attempts = AssessmentAttempt.query.filter_by(user_id=user_id).order_by(AssessmentAttempt.completed_at.desc()).all()
    return jsonify({
        'status': 'success',
        'count': len(attempts),
        'attempts': [a.to_dict() for a in attempts]
    }), 200

@assessment_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_assessment():
    user_id = int(get_jwt_identity())
    attempt = AssessmentAttempt.query.filter_by(user_id=user_id).order_by(AssessmentAttempt.completed_at.desc()).first()
    if not attempt:
        return jsonify({'status': 'success', 'attempt': None}), 200

    return jsonify({
        'status': 'success',
        'attempt': attempt.to_dict()
    }), 200

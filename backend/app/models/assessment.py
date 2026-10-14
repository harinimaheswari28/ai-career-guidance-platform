import json
from datetime import datetime, timezone
from backend.app import db

def utc_now():
    return datetime.now(timezone.utc)

class AssessmentQuestion(db.Model):
    __tablename__ = 'assessment_questions'

    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(50), nullable=False, index=True) 
    # sections: 'technical', 'logical', 'communication', 'problem_solving', 
    #           'creativity', 'work_preferences', 'work_env', 'education_exp'
    question_text = db.Column(db.Text, nullable=False)
    order_num = db.Column(db.Integer, default=0)

    options = db.relationship('AssessmentOption', backref='question', cascade='all, delete-orphan', order_by='AssessmentOption.id')

    def to_dict(self):
        return {
            'id': self.id,
            'section': self.section,
            'question_text': self.question_text,
            'order_num': self.order_num,
            'options': [opt.to_dict() for opt in self.options]
        }

class AssessmentOption(db.Model):
    __tablename__ = 'assessment_options'

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('assessment_questions.id', ondelete='CASCADE'), nullable=False)
    option_text = db.Column(db.Text, nullable=False)
    score_weight = db.Column(db.Float, default=1.0) # weight: 0.25 to 1.0 (or 1 to 5)
    trait_tags = db.Column(db.String(255), nullable=True) # e.g. "coding,system_design,analytical"

    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'option_text': self.option_text,
            'score_weight': self.score_weight,
            'trait_tags': self.trait_tags or ''
        }

class AssessmentAttempt(db.Model):
    __tablename__ = 'assessment_attempts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    total_score = db.Column(db.Float, nullable=False)
    section_scores = db.Column(db.Text, nullable=False) # JSON: {"technical": 85, ...}
    strengths = db.Column(db.Text, nullable=True) # JSON list
    improvement_areas = db.Column(db.Text, nullable=True) # JSON list
    suggested_next_steps = db.Column(db.Text, nullable=True) # JSON list
    completed_at = db.Column(db.DateTime, default=utc_now)

    answers = db.relationship('AssessmentAnswer', backref='attempt', cascade='all, delete-orphan')

    def to_dict(self):
        def parse_json(field):
            if not field:
                return []
            try:
                return json.loads(field)
            except Exception:
                return [field]

        sec_scores = {}
        try:
            sec_scores = json.loads(self.section_scores)
        except Exception:
            sec_scores = {}

        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_score': round(self.total_score, 1),
            'section_scores': sec_scores,
            'strengths': parse_json(self.strengths),
            'improvement_areas': parse_json(self.improvement_areas),
            'suggested_next_steps': parse_json(self.suggested_next_steps),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class AssessmentAnswer(db.Model):
    __tablename__ = 'assessment_answers'

    id = db.Column(db.Integer, primary_key=True)
    attempt_id = db.Column(db.Integer, db.ForeignKey('assessment_attempts.id', ondelete='CASCADE'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('assessment_questions.id', ondelete='CASCADE'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('assessment_options.id', ondelete='CASCADE'), nullable=False)

    option = db.relationship('AssessmentOption')
    question = db.relationship('AssessmentQuestion')

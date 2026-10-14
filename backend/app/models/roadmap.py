import json
from datetime import datetime, timezone
from backend.app import db

def utc_now():
    return datetime.now(timezone.utc)

class LearningRoadmap(db.Model):
    __tablename__ = 'learning_roadmaps'

    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), unique=True, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)

    steps = db.relationship('RoadmapStep', backref='roadmap', cascade='all, delete-orphan', order_by='RoadmapStep.stage_number')

    def to_dict(self):
        return {
            'id': self.id,
            'career_id': self.career_id,
            'title': self.title,
            'description': self.description or '',
            'steps': [s.to_dict() for s in self.steps]
        }

class RoadmapStep(db.Model):
    __tablename__ = 'roadmap_steps'

    id = db.Column(db.Integer, primary_key=True)
    roadmap_id = db.Column(db.Integer, db.ForeignKey('learning_roadmaps.id', ondelete='CASCADE'), nullable=False)
    stage_number = db.Column(db.Integer, nullable=False)
    stage_title = db.Column(db.String(150), nullable=False)
    topics = db.Column(db.Text, nullable=False) # JSON list of topics
    skills_covered = db.Column(db.Text, nullable=True) # JSON list of skills
    practical_exercises = db.Column(db.Text, nullable=True)
    mini_project = db.Column(db.Text, nullable=True)
    capstone_project = db.Column(db.Text, nullable=True)
    resource_url = db.Column(db.String(500), nullable=True)
    checklist = db.Column(db.Text, nullable=True) # JSON list of actionable items

    def to_dict(self):
        def parse_json_or_lines(val):
            if not val:
                return []
            try:
                return json.loads(val)
            except Exception:
                return [x.strip() for x in val.split('\n') if x.strip()]

        return {
            'id': self.id,
            'roadmap_id': self.roadmap_id,
            'stage_number': self.stage_number,
            'stage_title': self.stage_title,
            'topics': parse_json_or_lines(self.topics),
            'skills_covered': parse_json_or_lines(self.skills_covered),
            'practical_exercises': self.practical_exercises or '',
            'mini_project': self.mini_project or '',
            'capstone_project': self.capstone_project or '',
            'resource_url': self.resource_url or '',
            'checklist': parse_json_or_lines(self.checklist)
        }

class UserRoadmapProgress(db.Model):
    __tablename__ = 'user_roadmap_progress'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    step_id = db.Column(db.Integer, db.ForeignKey('roadmap_steps.id', ondelete='CASCADE'), nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)

    step = db.relationship('RoadmapStep')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'step_id': self.step_id,
            'is_completed': self.is_completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

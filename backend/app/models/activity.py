from datetime import datetime, timezone
from backend.app import db

def utc_now():
    return datetime.now(timezone.utc)

class SavedCareer(db.Model):
    __tablename__ = 'saved_careers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    career = db.relationship('Career')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'career_id': self.career_id,
            'career': self.career.to_dict(include_skills=True) if self.career else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class LearningGoal(db.Model):
    __tablename__ = 'learning_goals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    target_date = db.Column(db.String(50), nullable=True) # YYYY-MM-DD or description
    is_completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'target_date': self.target_date or '',
            'is_completed': self.is_completed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(30), default='info') # 'info', 'success', 'warning'
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

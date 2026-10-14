from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app import db

def utc_now():
    return datetime.now(timezone.utc)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='student', nullable=False) # 'student', 'admin'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now, nullable=False)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    profile = db.relationship('UserProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    skills = db.relationship('UserSkill', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    assessment_attempts = db.relationship('AssessmentAttempt', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    recommendations = db.relationship('CareerRecommendation', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    roadmap_progress = db.relationship('UserRoadmapProgress', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    saved_careers = db.relationship('SavedCareer', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    saved_courses = db.relationship('SavedCourse', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    comparisons = db.relationship('CareerComparison', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    learning_goals = db.relationship('LearningGoal', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    education_level = db.Column(db.String(100), nullable=True, default='Bachelor of Computer Science / IT')
    interests = db.Column(db.Text, nullable=True) # e.g. "Web Development, Machine Learning, UI Design"
    bio = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    preferred_work_env = db.Column(db.String(100), nullable=True, default='Remote & Hybrid')
    career_goals = db.Column(db.Text, nullable=True)
    notification_email = db.Column(db.Boolean, default=True)
    notification_in_app = db.Column(db.Boolean, default=True)
    theme_preference = db.Column(db.String(20), default='light')
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'education_level': self.education_level or '',
            'interests': self.interests or '',
            'bio': self.bio or '',
            'avatar_url': self.avatar_url or '',
            'preferred_work_env': self.preferred_work_env or '',
            'career_goals': self.career_goals or '',
            'notification_email': self.notification_email,
            'notification_in_app': self.notification_in_app,
            'theme_preference': self.theme_preference or 'light',
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

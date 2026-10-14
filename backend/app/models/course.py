from datetime import datetime, timezone
from backend.app import db

def utc_now():
    return datetime.now(timezone.utc)

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    provider = db.Column(db.String(100), nullable=False) # Coursera, edX, freeCodeCamp, MIT OpenCourseWare, etc.
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=False) # Web Dev, AI/ML, Cloud, Data Science, etc.
    difficulty = db.Column(db.String(50), default='Beginner') # Beginner, Intermediate, Advanced
    duration = db.Column(db.String(50), default='6 weeks (4 hrs/week)')
    course_url = db.Column(db.String(500), nullable=False)
    is_free = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=4.8)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'provider': self.provider,
            'description': self.description or '',
            'category': self.category,
            'difficulty': self.difficulty,
            'duration': self.duration,
            'course_url': self.course_url,
            'is_free': self.is_free,
            'rating': round(self.rating, 1)
        }

class CareerCourse(db.Model):
    __tablename__ = 'career_courses'

    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)

    course = db.relationship('Course')

class SavedCourse(db.Model):
    __tablename__ = 'saved_courses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    status = db.Column(db.String(30), default='saved') # 'saved', 'in-progress', 'completed'
    created_at = db.Column(db.DateTime, default=utc_now)

    course = db.relationship('Course')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'course': self.course.to_dict() if self.course else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

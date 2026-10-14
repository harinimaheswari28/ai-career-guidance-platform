import json
from datetime import datetime, timezone
from backend.app import db

def utc_now():
    return datetime.now(timezone.utc)

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), default='technical') # 'technical', 'soft', 'tool'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category
        }

class UserSkill(db.Model):
    __tablename__ = 'user_skills'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False)
    proficiency_level = db.Column(db.String(30), default='Beginner') # 'Beginner', 'Intermediate', 'Advanced'

    skill = db.relationship('Skill')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name if self.skill else '',
            'category': self.skill.category if self.skill else 'technical',
            'proficiency_level': self.proficiency_level
        }

class Career(db.Model):
    __tablename__ = 'careers'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(100), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    education_req = db.Column(db.String(255), default="Bachelor's degree in Computer Science, IT, or related field")
    difficulty = db.Column(db.String(50), default='Intermediate') # 'Beginner', 'Intermediate', 'Advanced'
    growth_outlook = db.Column(db.String(255), default='Rapid Growth - 22% estimated industry expansion')
    typical_responsibilities = db.Column(db.Text, nullable=True) # JSON list
    prerequisites = db.Column(db.Text, nullable=True)
    example_projects = db.Column(db.Text, nullable=True) # JSON list
    created_at = db.Column(db.DateTime, default=utc_now)

    # Relationships
    career_skills = db.relationship('CareerSkill', backref='career', cascade='all, delete-orphan')
    roadmap = db.relationship('LearningRoadmap', backref='career', uselist=False, cascade='all, delete-orphan')
    career_courses = db.relationship('CareerCourse', backref='career', cascade='all, delete-orphan')

    def to_dict(self, include_skills=True):
        resp_list = []
        if self.typical_responsibilities:
            try:
                resp_list = json.loads(self.typical_responsibilities)
            except Exception:
                resp_list = [r.strip() for r in self.typical_responsibilities.split('\n') if r.strip()]

        proj_list = []
        if self.example_projects:
            try:
                proj_list = json.loads(self.example_projects)
            except Exception:
                proj_list = [p.strip() for p in self.example_projects.split('\n') if p.strip()]

        data = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'category': self.category,
            'description': self.description,
            'education_req': self.education_req,
            'difficulty': self.difficulty,
            'growth_outlook': self.growth_outlook,
            'typical_responsibilities': resp_list,
            'prerequisites': self.prerequisites or '',
            'example_projects': proj_list,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

        if include_skills:
            data['required_skills'] = [cs.skill.name for cs in self.career_skills if cs.skill and cs.skill_type == 'required']
            data['preferred_skills'] = [cs.skill.name for cs in self.career_skills if cs.skill and cs.skill_type == 'preferred']
            data['soft_skills'] = [cs.skill.name for cs in self.career_skills if cs.skill and cs.skill_type == 'soft']
        return data

class CareerSkill(db.Model):
    __tablename__ = 'career_skills'

    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False)
    skill_type = db.Column(db.String(20), default='required') # 'required', 'preferred', 'soft'
    weight = db.Column(db.Float, default=1.0)

    skill = db.relationship('Skill')

class CareerRecommendation(db.Model):
    __tablename__ = 'career_recommendations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    compatibility_score = db.Column(db.Float, nullable=False) # 0 to 100
    rank_order = db.Column(db.Integer, nullable=False)
    match_reason = db.Column(db.Text, nullable=False)
    matching_skills = db.Column(db.Text, nullable=True) # JSON list
    missing_skills = db.Column(db.Text, nullable=True) # JSON list
    actionable_steps = db.Column(db.Text, nullable=True) # JSON list
    calculated_at = db.Column(db.DateTime, default=utc_now)

    career = db.relationship('Career')

    def to_dict(self):
        def parse_json_or_list(field):
            if not field:
                return []
            try:
                return json.loads(field)
            except Exception:
                return [x.strip() for x in field.split(',') if x.strip()]

        return {
            'id': self.id,
            'user_id': self.user_id,
            'career_id': self.career_id,
            'career': self.career.to_dict(include_skills=False) if self.career else None,
            'compatibility_score': round(self.compatibility_score, 1),
            'rank_order': self.rank_order,
            'match_reason': self.match_reason,
            'matching_skills': parse_json_or_list(self.matching_skills),
            'missing_skills': parse_json_or_list(self.missing_skills),
            'actionable_steps': parse_json_or_list(self.actionable_steps),
            'calculated_at': self.calculated_at.isoformat() if self.calculated_at else None
        }

class CareerComparison(db.Model):
    __tablename__ = 'career_comparisons'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    comparison_title = db.Column(db.String(200), default='Career Comparison')
    career_ids = db.Column(db.Text, nullable=False) # JSON list of IDs
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        ids = []
        try:
            ids = json.loads(self.career_ids)
        except Exception:
            ids = [int(x) for x in self.career_ids.split(',') if x.isdigit()]

        return {
            'id': self.id,
            'user_id': self.user_id,
            'comparison_title': self.comparison_title,
            'career_ids': ids,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

import unittest
from backend.app import create_app, db
from backend.config import TestingConfig
from backend.app.models.user import User, UserProfile
from backend.app.models.career import Career, Skill, UserSkill, CareerSkill
from backend.app.services.recommendation_engine import CareerRecommendationEngine

class TestRecommendationEngine(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Create skills
        self.python_skill = Skill(name='Python', category='technical')
        self.react_skill = Skill(name='React.js', category='technical')
        self.sql_skill = Skill(name='SQL / MySQL', category='technical')
        db.session.add_all([self.python_skill, self.react_skill, self.sql_skill])
        db.session.flush()

        # Create career
        self.career = Career(
            title='Full Stack Developer',
            slug='full-stack-developer',
            category='Web & Software Engineering',
            description='Test description'
        )
        db.session.add(self.career)
        db.session.flush()

        # Add skills to career
        cs1 = CareerSkill(career_id=self.career.id, skill_id=self.python_skill.id, skill_type='required')
        cs2 = CareerSkill(career_id=self.career.id, skill_id=self.react_skill.id, skill_type='required')
        db.session.add_all([cs1, cs2])

        # Create user
        self.user = User(name='Test User', email='test@example.com', role='student')
        self.user.set_password('Pass1234')
        db.session.add(self.user)
        db.session.flush()

        profile = UserProfile(
            user_id=self.user.id,
            interests='Web Development, React, Python',
            education_level="Bachelor's Degree"
        )
        db.session.add(profile)

        # Add user skill
        us = UserSkill(user_id=self.user.id, skill_id=self.python_skill.id, proficiency_level='Advanced')
        db.session.add(us)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_recommendation_generation(self):
        recs = CareerRecommendationEngine.generate_recommendations_for_user(self.user.id)
        self.assertTrue(len(recs) >= 1)
        top_rec = recs[0]
        self.assertGreaterEqual(top_rec.compatibility_score, 0.0)
        self.assertLessEqual(top_rec.compatibility_score, 100.0)
        self.assertIn('Python', top_rec.matching_skills)
        self.assertIn('React.js', top_rec.missing_skills)
        self.assertTrue(len(top_rec.match_reason) > 0)

if __name__ == '__main__':
    unittest.main()

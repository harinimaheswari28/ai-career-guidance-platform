import unittest
import json
from backend.app import create_app, db
from backend.config import TestingConfig
from backend.app.models.user import User
from backend.app.models.career import Career
from backend.app.models.assessment import AssessmentQuestion, AssessmentOption
from flask_jwt_extended import create_access_token

class TestAssessmentAndAdmin(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        # Create student user
        self.student = User(name='Student', email='student@test.com', role='student')
        self.student.set_password('pass1234')
        
        # Create admin user
        self.admin = User(name='Admin', email='admin@test.com', role='admin')
        self.admin.set_password('adminpass1234')
        db.session.add_all([self.student, self.admin])
        db.session.flush()

        # Create career
        self.career = Career(title='Full Stack Developer', slug='fsd', category='Web', description='Desc')
        db.session.add(self.career)
        db.session.flush()

        # Create assessment question & options
        self.q = AssessmentQuestion(section='technical', question_text='How do you write code?', order_num=1)
        db.session.add(self.q)
        db.session.flush()

        self.opt1 = AssessmentOption(question_id=self.q.id, option_text='Full stack with React and Flask', score_weight=1.0)
        self.opt2 = AssessmentOption(question_id=self.q.id, option_text='Beginner scripting', score_weight=0.5)
        db.session.add_all([self.opt1, self.opt2])
        db.session.commit()

        self.student_token = create_access_token(identity=str(self.student.id))
        self.admin_token = create_access_token(identity=str(self.admin.id))

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_assessment_flow(self):
        # 1. Fetch questions
        resp = self.client.get('/api/assessments/questions')
        self.assertEqual(resp.status_code, 200)
        q_data = resp.get_json()['questions']
        self.assertEqual(len(q_data), 1)

        # 2. Submit answers
        answers_payload = {
            'answers': {
                str(self.q.id): self.opt1.id
            }
        }
        submit_resp = self.client.post(
            '/api/assessments/submit',
            data=json.dumps(answers_payload),
            content_type='application/json',
            headers={'Authorization': f'Bearer {self.student_token}'}
        )
        self.assertEqual(submit_resp.status_code, 201)
        res = submit_resp.get_json()['result']
        self.assertEqual(res['total_score'], 100.0)
        self.assertIn('technical', res['section_scores'])

        # 3. Fetch history
        hist_resp = self.client.get(
            '/api/assessments/history',
            headers={'Authorization': f'Bearer {self.student_token}'}
        )
        self.assertEqual(hist_resp.status_code, 200)
        self.assertEqual(len(hist_resp.get_json()['attempts']), 1)

    def test_admin_route_protection(self):
        # Student attempting to access admin route must be 403 Forbidden
        resp_forbidden = self.client.get(
            '/api/admin/stats',
            headers={'Authorization': f'Bearer {self.student_token}'}
        )
        self.assertEqual(resp_forbidden.status_code, 403)

        # Admin accessing admin route must be 200 OK
        resp_admin = self.client.get(
            '/api/admin/stats',
            headers={'Authorization': f'Bearer {self.admin_token}'}
        )
        self.assertEqual(resp_admin.status_code, 200)
        self.assertIn('stats', resp_admin.get_json())

if __name__ == '__main__':
    unittest.main()

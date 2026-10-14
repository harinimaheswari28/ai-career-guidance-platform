import unittest
import json
from backend.app import create_app, db
from backend.config import TestingConfig
from backend.app.models.user import User

class TestAuthAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_user_registration(self):
        payload = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'SecurePassword123',
            'confirm_password': 'SecurePassword123',
            'education_level': 'B.Tech IT',
            'interests': 'Artificial Intelligence'
        }
        response = self.client.post('/api/auth/register', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data['status'], 'success')
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], 'john@example.com')

        # Confirm password is not stored in plain text
        user = User.query.filter_by(email='john@example.com').first()
        self.assertNotEqual(user.password_hash, 'SecurePassword123')
        self.assertTrue(user.check_password('SecurePassword123'))

    def test_user_login_success_and_failure(self):
        # Register user
        user = User(name='Jane Doe', email='jane@example.com', role='student')
        user.set_password('MySecretPass@1')
        db.session.add(user)
        db.session.commit()

        # Success login
        resp = self.client.post('/api/auth/login', data=json.dumps({
            'email': 'jane@example.com',
            'password': 'MySecretPass@1'
        }), content_type='application/json')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('token', resp.get_json())

        # Failed login
        resp_fail = self.client.post('/api/auth/login', data=json.dumps({
            'email': 'jane@example.com',
            'password': 'WrongPassword'
        }), content_type='application/json')
        self.assertEqual(resp_fail.status_code, 401)

    def test_protected_route_without_token(self):
        resp = self.client.get('/api/auth/me')
        self.assertEqual(resp.status_code, 401)

if __name__ == '__main__':
    unittest.main()

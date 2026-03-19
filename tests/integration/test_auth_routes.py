import unittest
from unittest.mock import patch, MagicMock
from app import create_app, db
from app.models.user import User

class TestAuthRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_login_page_loads(self):
        response = self.client.get('/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login', response.data)

    def test_register_page_loads(self):
        response = self.client.get('/register')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Register', response.data)

    @patch('app.services.auth_service.AuthService.authenticate')
    def test_login_success(self, mock_authenticate):
        # Set up mock user and successful authentication
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.username = 'testuser'
        mock_authenticate.return_value = (mock_user, 'Login successful')

        # Test login with valid credentials
        response = self.client.post('/login', data={
            'email': 'test@example.com',
            'password': 'password123'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login successful', response.data)

    @patch('app.services.auth_service.AuthService.authenticate')
    def test_login_failure(self, mock_authenticate):
        # Set up failed authentication
        mock_authenticate.return_value = (None, 'Invalid email or password')

        # Test login with invalid credentials
        response = self.client.post('/login', data={
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Invalid email or password', response.data)

    @patch('app.services.auth_service.AuthService.register_user')
    def test_register_success(self, mock_register_user):
        # Set up successful registration
        mock_register_user.return_value = (True, 'Registration successful')

        # Test registration with valid data
        response = self.client.post('/register', data={
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Registration successful', response.data)

    def test_register_validation_error(self):
        # Test registration with mismatched passwords
        response = self.client.post('/register', data={
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password123',
            'confirm_password': 'different123'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Passwords do not match', response.data)

    def test_logout(self):
        # First login to set session
        with self.client.session_transaction() as session:
            session['user_id'] = 1
            session['username'] = 'testuser'

        # Test logout
        response = self.client.get('/logout', follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'You have been logged out', response.data)

        # Verify session is cleared
        with self.client.session_transaction() as session:
            self.assertNotIn('user_id', session)
            self.assertNotIn('username', session)

if __name__ == '__main__':
    unittest.main()

import unittest
from unittest.mock import patch, MagicMock
from app.services.auth_service import AuthService
from werkzeug.security import generate_password_hash

class TestAuthService(unittest.TestCase):
    def setUp(self):
        self.auth_service = AuthService()

    @patch('app.models.user.User.query')
    def test_authenticate_success(self, mock_query):
        # Create a mock user with known password
        password = 'correct_password'
        mock_user = MagicMock()
        mock_user.password_hash = generate_password_hash(password)

        # Set up the query to return our mock user
        mock_query.filter_by.return_value.first.return_value = mock_user

        # Test authentication with correct password
        user, message = self.auth_service.authenticate('test@example.com', password)

        self.assertEqual(user, mock_user)
        self.assertEqual(message, 'Login successful')

    @patch('app.models.user.User.query')
    def test_authenticate_invalid_email(self, mock_query):
        # Set up the query to return None (no user found)
        mock_query.filter_by.return_value.first.return_value = None

        # Test authentication with invalid email
        user, message = self.auth_service.authenticate('nonexistent@example.com', 'any_password')

        self.assertIsNone(user)
        self.assertEqual(message, 'Invalid email or password')

    @patch('app.models.user.User.query')
    def test_authenticate_wrong_password(self, mock_query):
        # Create a mock user with known password
        password = 'correct_password'
        mock_user = MagicMock()
        mock_user.password_hash = generate_password_hash(password)

        # Set up the query to return our mock user
        mock_query.filter_by.return_value.first.return_value = mock_user

        # Test authentication with wrong password
        user, message = self.auth_service.authenticate('test@example.com', 'wrong_password')

        self.assertIsNone(user)
        self.assertEqual(message, 'Invalid email or password')

    @patch('app.models.user.User.query')
    @patch('app.db.session')
    def test_register_user_success(self, mock_session, mock_query):
        # Set up query to indicate user doesn't exist
        mock_query.filter.return_value.first.return_value = None

        # Test user registration
        success, message = self.auth_service.register_user('newuser', 'new@example.com', 'password123')

        self.assertTrue(success)
        self.assertEqual(message, 'Registration successful')
        mock_session.add.assert_called_once()
        mock_session.commit.assert_called_once()

    @patch('app.models.user.User.query')
    def test_register_user_existing_email(self, mock_query):
        # Create a mock existing user with the same email
        mock_user = MagicMock()
        mock_user.email = 'existing@example.com'
        mock_user.username = 'existinguser'

        # Set up query to return our mock user
        mock_query.filter.return_value.first.return_value = mock_user

        # Test registration with existing email
        success, message = self.auth_service.register_user('newuser', 'existing@example.com', 'password123')

        self.assertFalse(success)
        self.assertEqual(message, 'Email already registered')

if __name__ == '__main__':
    unittest.main()

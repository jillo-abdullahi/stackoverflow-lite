# Test for user signup
import unittest
import json

from app import create_app


class TestUserCanSignup(unittest.TestCase):
    """Class to test user login"""

    def setUp(self):
        """Method to create app and set up test client"""
        self.app = create_app("testing")
        self.app = self.app.test_client()

    def test_user_can_signup(self):
        """Method to test if user can register"""
        signup_response = self.register_user()
        self.assertEqual(signup_response.status_code, 201)

        # Test message
        message = json.loads(signup_response.get_data(as_text=True))['message']
        self.assertEqual(message, 'User registered successfully')

    def register_user(self):
        """Method to try to register a new user"""
        new_user_details = {
            "username": "jdoe",
            "full-name": "John Doe",
            "email": "john.doe@gmail.com",
            "password": "johndoe95"
        }

        response = self.app.post(
            '/stackoverflowlite/api/v1/auth/signup',
            data=json.dumps(new_user_details),
            content_type='application/json'
        )

        return response

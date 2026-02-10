from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class LoginLockoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = 'testuser'
        self.password = 'testpass123'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
            email='test@example.com'
        )
        self.login_url = '/api/users/login/'

    def test_lockout_after_three_failed_attempts(self):
        # 1st failed attempt
        response = self.client.post(self.login_url, {'username': self.username, 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 1)

        # 2nd failed attempt
        response = self.client.post(self.login_url, {'username': self.username, 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 2)

        # 3rd failed attempt - should trigger lockout
        response = self.client.post(self.login_url, {'username': self.username, 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('Account locked', response.data['error'])
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 3)
        self.assertIsNotNone(self.user.lockout_until)

        # 4th attempt with correct password - should still be locked out
        response = self.client.post(self.login_url, {'username': self.username, 'password': self.password})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('Account locked', response.data['error'])

    def test_successful_login_resets_counter(self):
        # 1st failed attempt
        self.client.post(self.login_url, {'username': self.username, 'password': 'wrongpassword'})
        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 1)

        # Successful login
        response = self.client.post(self.login_url, {'username': self.username, 'password': self.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 0)
        self.assertIsNone(self.user.lockout_until)

    def test_lockout_expiration(self):
        # Manually lock out the user
        self.user.failed_login_attempts = 3
        # Set lockout_until to 1 second ago (expired)
        self.user.lockout_until = timezone.now() - timedelta(seconds=1)
        self.user.save()

        # Login should now succeed
        response = self.client.post(self.login_url, {'username': self.username, 'password': self.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.failed_login_attempts, 0)
        self.assertIsNone(self.user.lockout_until)

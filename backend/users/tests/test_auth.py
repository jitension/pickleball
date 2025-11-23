import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestAuthentication:
    def setup_method(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('token_obtain_pair')
        self.user_me_url = reverse('user_me')

    def test_register_user(self):
        data = {
            'email': 'new@example.com',
            'username': 'newuser',
            'password': 'password123',
            'first_name': 'New',
            'last_name': 'User',
            'skill_level': 'ADVANCED'
        }
        response = self.client.post(self.register_url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.count() == 1
        assert User.objects.get().email == 'new@example.com'
        assert User.objects.get().profile.skill_level == 'ADVANCED'

    def test_login_user(self):
        user = User.objects.create_user(
            email='login@example.com',
            username='loginuser',
            password='password123'
        )
        data = {
            'email': 'login@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.login_url, data)
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_get_user_profile(self):
        user = User.objects.create_user(
            email='profile@example.com',
            username='profileuser',
            password='password123'
        )
        self.client.force_authenticate(user=user)
        response = self.client.get(self.user_me_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == 'profile@example.com'
        assert 'profile' in response.data

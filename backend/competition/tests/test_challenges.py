import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from competition.models import Challenge

User = get_user_model()

@pytest.mark.django_db
class TestCompetition:
    def setup_method(self):
        self.client = APIClient()
        self.challenger_1 = User.objects.create_user(email='c1@example.com', username='c1', password='password123')
        self.challenger_2 = User.objects.create_user(email='c2@example.com', username='c2', password='password123')
        self.client.force_authenticate(user=self.challenger_1)
        self.challenge_list_url = reverse('challenge_list')

    def test_create_challenge(self):
        data = {'challenger_2': self.challenger_2.id}
        response = self.client.post(self.challenge_list_url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Challenge.objects.count() == 1
        challenge = Challenge.objects.get()
        assert challenge.challenger_1 == self.challenger_1
        assert challenge.challenger_2 == self.challenger_2
        assert challenge.status == 'OPEN'

    def test_list_challenges(self):
        Challenge.objects.create(challenger_1=self.challenger_1, challenger_2=self.challenger_2)
        response = self.client.get(self.challenge_list_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1

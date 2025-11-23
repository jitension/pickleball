import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from scheduling.models import Poll, RSVP

User = get_user_model()

@pytest.mark.django_db
class TestScheduling:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='poll@example.com',
            username='polluser',
            password='password123'
        )
        self.user.profile.skill_level = 'ADVANCED'
        self.user.profile.save()
        self.client.force_authenticate(user=self.user)
        
        self.poll = Poll.objects.create(
            date='2025-12-01',
            time_start='08:00:00',
            time_end='10:00:00'
        )
        self.poll_list_url = reverse('poll_list')
        self.rsvp_url = reverse('poll_rsvp', kwargs={'pk': self.poll.pk})

    def test_list_polls(self):
        response = self.client.get(self.poll_list_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['counts']['total'] == 0

    def test_rsvp_in(self):
        data = {'status': 'IN'}
        response = self.client.post(self.rsvp_url, data)
        assert response.status_code == status.HTTP_200_OK
        assert RSVP.objects.count() == 1
        assert RSVP.objects.get().status == 'IN'
        
        # Check counts
        response = self.client.get(self.poll_list_url)
        counts = response.data['results'][0]['counts']
        assert counts['total'] == 1
        assert counts['advanced'] == 1
        assert counts['intermediate'] == 0

    def test_rsvp_out(self):
        data = {'status': 'OUT'}
        response = self.client.post(self.rsvp_url, data)
        assert response.status_code == status.HTTP_200_OK
        
        # Check counts
        response = self.client.get(self.poll_list_url)
        counts = response.data['results'][0]['counts']
        assert counts['total'] == 0

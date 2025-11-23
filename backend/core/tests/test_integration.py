import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from competition.models import Challenge
from community.models import Post
from scheduling.models import Poll, RSVP
from users.models import Profile

User = get_user_model()

@pytest.mark.django_db
class TestIntegration:
    def setup_method(self):
        self.client = APIClient()
        
        # Users
        self.u1 = User.objects.create_user(username='u1', email='u1@t.com', password='pw')
        self.u2 = User.objects.create_user(username='u2', email='u2@t.com', password='pw')
        self.u3 = User.objects.create_user(username='u3', email='u3@t.com', password='pw')
        self.u4 = User.objects.create_user(username='u4', email='u4@t.com', password='pw')
        
        # Poll
        self.poll = Poll.objects.create(date='2025-01-01', time_start='10:00', time_end='12:00')

    def test_tipping_point_notification(self):
        # 3 Users RSVP IN
        RSVP.objects.create(poll=self.poll, user=self.u1, status='IN')
        RSVP.objects.create(poll=self.poll, user=self.u2, status='IN')
        RSVP.objects.create(poll=self.poll, user=self.u3, status='IN')
        
        # No post yet (Threshold is 4)
        assert Post.objects.filter(post_type='SYSTEM').count() == 0
        
        # 4th User RSVP IN -> Trigger
        RSVP.objects.create(poll=self.poll, user=self.u4, status='IN')
        
        assert Post.objects.filter(post_type='SYSTEM').count() == 1
        post = Post.objects.first()
        assert "GAME ON" in post.content

    def test_challenge_validation_self(self):
        self.client.force_authenticate(user=self.u1)
        # Try to challenge self
        data = {'challenger_2': self.u1.id} 
        response = self.client.post('/api/competition/challenges/', data)
        assert response.status_code == 400
        assert "cannot challenge yourself" in str(response.data)

    def test_promotion_workflow(self):
        # Setup tiers
        self.u1.profile.skill_level = 'EMERGING'
        self.u1.profile.save()
        self.u2.profile.skill_level = 'EMERGING'
        self.u2.profile.save()
        
        d1 = User.objects.create_user(username='d1', email='d1@t.com', password='pw')
        d1.profile.skill_level = 'INTERMEDIATE'
        d1.profile.save()
        
        # Create Challenge
        challenge = Challenge.objects.create(
            challenger_1=self.u1, challenger_2=self.u2,
            defender_1=d1, status='OPEN'
        )
        
        # Win
        challenge.status = 'PLAYED'
        challenge.result = 'PASS'
        challenge.save()
        
        # Verify
        self.u1.refresh_from_db()
        assert self.u1.profile.skill_level == 'INTERMEDIATE'
        assert Post.objects.filter(content__contains="CONGRATULATIONS").exists()

    def test_reciprocal_rsvp(self):
        self.client.force_authenticate(user=self.u1)
        data = {'status': 'IN', 'partner_id': self.u2.id}
        
        response = self.client.post(f'/api/scheduling/polls/{self.poll.id}/rsvp/', data)
        assert response.status_code == 200
        
        # Check U1 RSVP
        assert RSVP.objects.filter(poll=self.poll, user=self.u1, status='IN').exists()
        
        # Check U2 RSVP (Should be auto-created)
        assert RSVP.objects.filter(poll=self.poll, user=self.u2, status='IN').exists()
        u2_rsvp = RSVP.objects.get(poll=self.poll, user=self.u2)
        assert u2_rsvp.partner == self.u1
        assert "Added by u1" in u2_rsvp.note

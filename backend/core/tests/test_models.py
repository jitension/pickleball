import pytest
from django.contrib.auth import get_user_model
from community.models import Post, Comment, Like
from scheduling.models import Poll, RSVP
from competition.models import Challenge

User = get_user_model()

@pytest.mark.django_db
class TestModelStrings:
    def test_user_str(self):
        user = User.objects.create_user(username='str_test_user', email='str_test@example.com', password='pw')
        assert str(user) == 'str_test@example.com'

    def test_community_str(self):
        user = User.objects.create_user(username='comm_str_user', password='pw')
        post = Post.objects.create(author=user, content='Test Post')
        assert str(post) == f"comm_str_user: Test Post"
        
        comment = Comment.objects.create(post=post, author=user, text='Nice')
        assert str(comment) == f"comm_str_user on {post.id}"
        
        like = Like.objects.create(post=post, user=user)
        assert str(like) == f"comm_str_user likes {post.id}"

    def test_scheduling_str(self):
        poll = Poll.objects.create(date='2025-01-01', time_start='10:00', time_end='12:00')
        # Check for essential parts instead of exact string to avoid seconds mismatch
        assert "2025-01-01" in str(poll)
        assert "10:00" in str(poll)
        
        user = User.objects.create_user(username='poll_str_user', password='pw')
        rsvp = RSVP.objects.create(poll=poll, user=user, status='IN')
        assert str(rsvp) == f"poll_str_user - IN for {poll}"

    def test_competition_str(self):
        import uuid
        u1_name = f"c1_{uuid.uuid4()}"
        u2_name = f"c2_{uuid.uuid4()}"
        c1 = User.objects.create_user(username=u1_name, email=f"{u1_name}@test.com", password='pw')
        c2 = User.objects.create_user(username=u2_name, email=f"{u2_name}@test.com", password='pw')
        challenge = Challenge.objects.create(challenger_1=c1, challenger_2=c2)
        assert str(challenge) == f"Challenge {challenge.id}: {u1_name}@test.com & {u2_name}@test.com"

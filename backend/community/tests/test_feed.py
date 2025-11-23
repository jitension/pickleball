import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from community.models import Post, Like

User = get_user_model()

@pytest.mark.django_db
class TestFeed:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='feed@example.com',
            username='feeduser',
            password='password123'
        )
        self.client.force_authenticate(user=self.user)
        self.feed_url = reverse('feed_list')

    def test_create_post(self):
        data = {'content': 'Hello Pickleball!'}
        response = self.client.post(self.feed_url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Post.objects.count() == 1
        assert Post.objects.get().content == 'Hello Pickleball!'

    def test_list_feed(self):
        Post.objects.create(author=self.user, content='Post 1')
        Post.objects.create(author=self.user, content='Post 2')
        
        response = self.client.get(self.feed_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2 # Pagination default

    def test_like_post(self):
        post = Post.objects.create(author=self.user, content='Like me')
        like_url = reverse('post_like', kwargs={'pk': post.pk})
        
        # Like
        response = self.client.post(like_url)
        assert response.status_code == status.HTTP_201_CREATED
        assert post.likes.count() == 1
        
        # Unlike
        response = self.client.post(like_url)
        assert response.status_code == status.HTTP_200_OK
        assert post.likes.count() == 0

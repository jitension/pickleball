from django.urls import path
from .views import FeedListView, PostLikeView, CommentListCreateView

urlpatterns = [
    path('feed/', FeedListView.as_view(), name='feed'),
    path('posts/<int:pk>/like/', PostLikeView.as_view(), name='post_like'),
    path('posts/<int:pk>/comments/', CommentListCreateView.as_view(), name='post_comments'),
]

from django.urls import path
from .views import ChallengeListView, ChallengeDetailView

urlpatterns = [
    path('challenges/', ChallengeListView.as_view(), name='challenge_list'),
    path('challenges/<int:pk>/', ChallengeDetailView.as_view(), name='challenge_detail'),
]

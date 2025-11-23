from django.urls import path
from .views import PollListCreateView, RSVPCreateView, LocationListView

urlpatterns = [
    path('locations/', LocationListView.as_view(), name='location_list'),
    path('polls/', PollListCreateView.as_view(), name='poll_list'),
    path('polls/<int:pk>/rsvp/', RSVPCreateView.as_view(), name='rsvp_create'),
]

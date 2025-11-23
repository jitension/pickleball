from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Challenge
from .serializers import ChallengeSerializer, ChallengeCreateSerializer

class ChallengeListView(generics.ListCreateAPIView):
    queryset = Challenge.objects.all().order_by('-created')
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChallengeCreateSerializer
        return ChallengeSerializer

class ChallengeDetailView(generics.RetrieveUpdateAPIView):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_update(self, serializer):
        # Logic for accepting challenge or reporting score would go here
        # For MVP, we just allow updating fields
        serializer.save()

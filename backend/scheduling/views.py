from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Poll, RSVP, Location
from .serializers import PollSerializer, RSVPSerializer, LocationSerializer

class LocationListView(generics.ListAPIView):
    queryset = Location.objects.filter(is_active=True)
    serializer_class = LocationSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class PollListCreateView(generics.ListCreateAPIView):
    queryset = Poll.objects.filter(is_active=True).order_by('date', 'time_start')
    serializer_class = PollSerializer
    permission_classes = (permissions.IsAuthenticated,)

class RSVPCreateView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        poll = generics.get_object_or_404(Poll, pk=pk)
        rsvp, created = RSVP.objects.update_or_create(
            user=request.user,
            poll=poll,
            defaults={'status': request.data.get('status'), 'note': request.data.get('note', '')}
        )
        serializer = RSVPSerializer(rsvp)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

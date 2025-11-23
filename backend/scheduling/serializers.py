from rest_framework import serializers
from django.db.models import Count, Q
from .models import Poll, RSVP, Location
from users.serializers import UserSerializer

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'is_active']

class RSVPSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    partner = UserSerializer(read_only=True)

    class Meta:
        model = RSVP
        fields = ['id', 'poll', 'user', 'status', 'partner', 'note', 'created']
        read_only_fields = ['user']

class PollSerializer(serializers.ModelSerializer):
    rsvp_counts = serializers.SerializerMethodField()
    skill_counts = serializers.SerializerMethodField()
    user_rsvp = serializers.SerializerMethodField()
    rsvps = serializers.SerializerMethodField()
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = Poll
        fields = ['id', 'date', 'time_start', 'time_end', 'location', 'location_name', 'is_active', 'created', 'rsvp_counts', 'skill_counts', 'user_rsvp', 'rsvps']

    def get_rsvp_counts(self, obj):
        return {
            'IN': obj.rsvps.filter(status='IN').count(),
            'OUT': obj.rsvps.filter(status='OUT').count(),
            'MAYBE': obj.rsvps.filter(status='MAYBE').count(),
            'LATE': obj.rsvps.filter(status='LATE').count(),
        }

    def get_skill_counts(self, obj):
        rsvps = obj.rsvps.filter(status__in=['IN', 'MAYBE', 'LATE'])
        return {
            'EMERGING': rsvps.filter(user__profile__skill_level='EMERGING').count(),
            'INTERMEDIATE': rsvps.filter(user__profile__skill_level='INTERMEDIATE').count(),
            'ADVANCED': rsvps.filter(user__profile__skill_level='ADVANCED').count(),
        }

    def get_user_rsvp(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                rsvp = obj.rsvps.get(user=request.user)
                return RSVPSerializer(rsvp).data
            except RSVP.DoesNotExist:
                return None
        return None

    def get_rsvps(self, obj):
        rsvps = obj.rsvps.all().order_by('created')
        return RSVPSerializer(rsvps, many=True).data



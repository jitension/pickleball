from django.db import models
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel

User = get_user_model()

class Location(TimeStampedModel):
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Poll(TimeStampedModel):
    date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='polls')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['date', 'time_start']

    def __str__(self):
        return f"{self.date} {self.time_start}-{self.time_end}"

class RSVP(TimeStampedModel):
    class Status(models.TextChoices):
        IN = 'IN', 'In'
        OUT = 'OUT', 'Out'
        LATE = 'LATE', 'Late'
        MAYBE = 'MAYBE', 'Maybe'

    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rsvps')
    status = models.CharField(max_length=10, choices=Status.choices)
    partner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='partner_rsvps')
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('poll', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.status} for {self.poll}"


from django.db import models
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel

User = get_user_model()

class Challenge(TimeStampedModel):
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        PLAYED = 'PLAYED', 'Played'
        CANCELLED = 'CANCELLED', 'Cancelled'

    class Result(models.TextChoices):
        PASS = 'PASS', 'Pass'
        FAIL = 'FAIL', 'Fail'

    # Challengers (Lower Tier)
    challenger_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='challenges_as_c1')
    challenger_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='challenges_as_c2')
    
    # Defenders (Higher Tier)
    defender_1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='challenges_as_d1')
    defender_2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='challenges_as_d2')

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    result = models.CharField(max_length=10, choices=Result.choices, null=True, blank=True)
    score = models.CharField(max_length=50, blank=True) # e.g., "11-9, 11-5"

    def __str__(self):
        return f"Challenge {self.id}: {self.challenger_1} & {self.challenger_2}"

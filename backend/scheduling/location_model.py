from django.db import models
from core.models import TimeStampedModel

class Location(TimeStampedModel):
    name = models.CharField(max_length=255, unique=True)
    address = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

from django.contrib import admin
from .models import Challenge

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('id', 'challenger_1', 'challenger_2', 'defender_1', 'defender_2', 'status', 'result')
    list_filter = ('status', 'result', 'created')
    search_fields = ('challenger_1__username', 'challenger_2__username', 'defender_1__username')

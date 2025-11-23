from django.contrib import admin
from .models import Poll, RSVP

class RSVPInline(admin.TabularInline):
    model = RSVP
    extra = 0

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ('date', 'time_start', 'time_end', 'location', 'is_active')
    list_filter = ('date', 'is_active')
    inlines = [RSVPInline]

@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ('user', 'poll', 'status', 'partner')
    list_filter = ('status', 'poll__date')
    search_fields = ('user__username', 'partner__username')

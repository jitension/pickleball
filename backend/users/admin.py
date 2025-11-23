from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_skill_level')
    
    def get_skill_level(self, obj):
        return obj.profile.skill_level
    get_skill_level.short_description = 'Skill Level'

admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)

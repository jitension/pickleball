from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from core.models import TimeStampedModel

class User(AbstractUser):
    """
    Custom User model for Pickleball App.
    """
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Profile(TimeStampedModel):
    class SkillLevel(models.TextChoices):
        EMERGING = 'EMERGING', _('Emerging')
        INTERMEDIATE = 'INTERMEDIATE', _('Intermediate')
        ADVANCED = 'ADVANCED', _('Advanced')

    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        ACTIVE = 'ACTIVE', _('Active')
        BANNED = 'BANNED', _('Banned')
    
    class AuthProvider(models.TextChoices):
        EMAIL = 'EMAIL', _('Email/Password')
        GOOGLE = 'GOOGLE', _('Google OAuth')
        APPLE = 'APPLE', _('Apple Sign In')  # Ready for future
        FACEBOOK = 'FACEBOOK', _('Facebook Login')  # Ready for future

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    skill_level = models.CharField(
        max_length=20,
        choices=SkillLevel.choices,
        default=SkillLevel.EMERGING
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    stats = models.JSONField(default=dict, blank=True)
    
    # Generic OAuth fields (works with any provider)
    auth_provider = models.CharField(
        max_length=20,
        choices=AuthProvider.choices,
        default=AuthProvider.EMAIL,
        help_text="Authentication provider used for this account"
    )
    oauth_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        db_index=True,
        help_text="OAuth provider's unique user ID (e.g., Google 'sub', Apple 'sub', etc.)"
    )
    oauth_picture = models.URLField(
        null=True,
        blank=True,
        help_text="URL to user's profile picture from OAuth provider"
    )
    oauth_data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional OAuth provider-specific data"
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

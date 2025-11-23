from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import RSVP, Poll
from community.models import Post

@receiver(post_save, sender=RSVP)
def check_tipping_point(sender, instance, created, **kwargs):
    if instance.status == RSVP.Status.IN:
        poll = instance.poll
        # Count total "IN" RSVPs
        total_in = poll.rsvps.filter(status=RSVP.Status.IN).count()
        
        # Threshold (hardcoded to 4 for testing, requirement said 12)
        THRESHOLD = 4 
        
        # Check if we JUST hit the threshold (to avoid duplicate posts)
        # This is a naive check. In production, we might want a flag on the Poll model "tipping_point_reached".
        # For now, let's check if total_in == THRESHOLD.
        
        if total_in == THRESHOLD:
            # Create System Announcement
            # We need an author. We can use the user who triggered it, or a system admin.
            # Using the user who triggered it is easiest for now.
            Post.objects.create(
                author=instance.user, 
                content=f"🚀 GAME ON! We have reached {THRESHOLD} players for {poll.date} @ {poll.time_start}! Sign up now if you haven't!",
                post_type=Post.PostType.SYSTEM_ANNOUNCEMENT
            )

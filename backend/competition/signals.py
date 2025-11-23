from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Challenge
from community.models import Post
from users.models import Profile

@receiver(post_save, sender=Challenge)
def handle_challenge_result(sender, instance, created, **kwargs):
    if instance.status == Challenge.Status.PLAYED and instance.result == Challenge.Result.PASS:
        # Logic: Challengers won and passed the assessment
        
        # 1. Determine new skill level
        # Assuming challengers are moving up one tier. 
        # We need to know their CURRENT level to know what they are moving TO.
        # For simplicity in this MVP, let's assume if they challenge 'Intermediate', they become 'Intermediate'.
        # But the Challenge model doesn't explicitly store "Target Level".
        # We can infer it from the Defenders' level or just hardcode logic for now.
        # Let's assume the Defenders represent the Target Level.
        
        target_level = None
        if instance.defender_1:
            target_level = instance.defender_1.profile.skill_level
        
        if target_level:
            # Update Challenger 1
            c1_profile = instance.challenger_1.profile
            c1_profile.skill_level = target_level
            c1_profile.save()

            # Update Challenger 2
            c2_profile = instance.challenger_2.profile
            c2_profile.skill_level = target_level
            c2_profile.save()

            # 2. Create System Announcement
            Post.objects.create(
                author=instance.defender_1, # Or a system user, but defender makes sense as "verifier"
                content=f"🎉 CONGRATULATIONS! {instance.challenger_1.username} and {instance.challenger_2.username} have successfully passed their challenge and are now {target_level}!",
                post_type=Post.PostType.SYSTEM_ANNOUNCEMENT
            )

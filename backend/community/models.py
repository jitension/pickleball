from django.db import models
from django.contrib.auth import get_user_model
from core.models import TimeStampedModel

User = get_user_model()

class Post(TimeStampedModel):
    class PostType(models.TextChoices):
        USER_POST = 'USER', 'User Post'
        SYSTEM_ANNOUNCEMENT = 'SYSTEM', 'System Announcement'

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(blank=True)
    image = models.ImageField(upload_to='posts/', null=True, blank=True)
    post_type = models.CharField(
        max_length=10,
        choices=PostType.choices,
        default=PostType.USER_POST
    )

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"

    @property
    def like_count(self):
        return self.likes.count()

    @property
    def comment_count(self):
        return self.comments.count()

class Comment(TimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()

    def __str__(self):
        return f"{self.author.username} on {self.post.id}"

class Like(TimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')

    class Meta:
        unique_together = ('post', 'user')

    def __str__(self):
        return f"{self.user.username} likes {self.post.id}"

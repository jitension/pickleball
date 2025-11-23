from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from community.models import Post, Comment, Like
from scheduling.models import Poll, RSVP
from competition.models import Challenge

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        self.stdout.write('Clearing existing test data...')
        Post.objects.all().delete()
        Poll.objects.all().delete()
        Challenge.objects.all().delete()
        
        # Create test users
        self.stdout.write('Creating test users...')
        users = []
        
        # Create 5 test users with different skill levels
        user_data = [
            {'email': 'alice@example.com', 'username': 'alice', 'first_name': 'Alice', 'last_name': 'Johnson', 'skill': 'ADVANCED'},
            {'email': 'bob@example.com', 'username': 'bob', 'first_name': 'Bob', 'last_name': 'Smith', 'skill': 'INTERMEDIATE'},
            {'email': 'carol@example.com', 'username': 'carol', 'first_name': 'Carol', 'last_name': 'Williams', 'skill': 'EMERGING'},
            {'email': 'dave@example.com', 'username': 'dave', 'first_name': 'Dave', 'last_name': 'Brown', 'skill': 'INTERMEDIATE'},
            {'email': 'eve@example.com', 'username': 'eve', 'first_name': 'Eve', 'last_name': 'Davis', 'skill': 'ADVANCED'},
        ]
        
        for data in user_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'username': data['username'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                user.profile.skill_level = data['skill']
                user.profile.save()
                self.stdout.write(f'  Created user: {user.email}')
            else:
                self.stdout.write(f'  User already exists: {user.email}')
            users.append(user)
        
        # Create posts
        self.stdout.write('Creating posts...')
        posts = []
        
        post_data = [
            {'author': users[0], 'type': 'USER', 'content': 'Anyone up for a game at Riverside Park this Saturday at 10 AM? Looking for 3 more players!'},
            {'author': users[1], 'type': 'USER', 'content': 'Just bought new paddles! Can\'t wait to try them out this weekend 🏓'},
            {'author': users[2], 'type': 'USER', 'content': 'Won my first tournament today! So excited! Thanks to everyone who helped me improve.'},
            {'author': users[3], 'type': 'USER', 'content': 'Doubles game tonight at 7 PM. Two spots available. Intermediate level preferred.'},
            {'author': users[4], 'type': 'USER', 'content': 'The weather is perfect for pickleball today! Who else is hitting the courts?'},
            {'author': users[0], 'type': 'USER', 'content': 'Just reached Advanced level! Time to find some challenging opponents 💪'},
        ]
        
        for data in post_data:
            post = Post.objects.create(
                author=data['author'],
                post_type=data['type'],
                content=data['content']
            )
            posts.append(post)
            self.stdout.write(f'  Created post by {post.author.username}')
        
        # Create comments
        self.stdout.write('Creating comments...')
        comments = [
            {'post': posts[0], 'author': users[1], 'text': 'I\'m in! Count me in for Saturday.'},
            {'post': posts[0], 'author': users[2], 'text': 'I can make it too! See you there.'},
            {'post': posts[2], 'author': users[0], 'text': 'Congratulations! Well deserved!'},
            {'post': posts[2], 'author': users[4], 'text': 'Amazing! You\'ve come so far!'},
            {'post': posts[3], 'author': users[2], 'text': 'I might be able to join. Let me check my schedule.'},
            {'post': posts[5], 'author': users[3], 'text': 'Awesome! Looking forward to playing with you!'},
        ]
        
        for data in comments:
            comment = Comment.objects.create(**data)
            self.stdout.write(f'  Created comment by {comment.author.username}')
        
        # Create likes
        self.stdout.write('Creating likes...')
        like_data = [
            {'post': posts[0], 'user': users[1]},
            {'post': posts[0], 'user': users[2]},
            {'post': posts[0], 'user': users[3]},
            {'post': posts[1], 'user': users[0]},
            {'post': posts[2], 'user': users[0]},
            {'post': posts[2], 'user': users[1]},
            {'post': posts[2], 'user': users[4]},
            {'post': posts[3], 'user': users[2]},
            {'post': posts[4], 'user': users[0]},
            {'post': posts[4], 'user': users[1]},
            {'post': posts[5], 'user': users[3]},
        ]
        
        for data in like_data:
            Like.objects.get_or_create(**data)
        self.stdout.write(f'  Created {len(like_data)} likes')
        
        # Create polls
        self.stdout.write('Creating polls...')
        polls = []
        
        # Poll for tomorrow
        tomorrow = timezone.now().date() + timedelta(days=1)
        poll1 = Poll.objects.create(
            date=tomorrow,
            time_start='18:00:00',
            time_end='20:00:00',
            location='Riverside Park Courts',
            is_active=True
        )
        polls.append(poll1)
        
        # Poll for next week
        next_week = timezone.now().date() + timedelta(days=7)
        poll2 = Poll.objects.create(
            date=next_week,
            time_start='10:00:00',
            time_end='12:00:00',
            location='Community Center Courts',
            is_active=True
        )
        polls.append(poll2)
        
        self.stdout.write(f'  Created {len(polls)} polls')
        
        # Create RSVPs
        self.stdout.write('Creating RSVPs...')
        rsvp_data = [
            {'poll': poll1, 'user': users[0], 'status': 'YES'},
            {'poll': poll1, 'user': users[1], 'status': 'YES', 'partner': users[2]},
            {'poll': poll1, 'user': users[2], 'status': 'YES'},
            {'poll': poll1, 'user': users[3], 'status': 'MAYBE'},
            {'poll': poll2, 'user': users[0], 'status': 'YES'},
            {'poll': poll2, 'user': users[4], 'status': 'YES'},
        ]
        
        for data in rsvp_data:
            RSVP.objects.get_or_create(
                poll=data['poll'],
                user=data['user'],
                defaults={
                    'status': data['status'],
                    'partner': data.get('partner')
                }
            )
        self.stdout.write(f'  Created {len(rsvp_data)} RSVPs')
        
        # Create challenges
        self.stdout.write('Creating challenges...')
        challenges = [
            {
                'challenger_1': users[0],
                'challenger_2': users[1],
                'defender_1': users[2],
                'defender_2': users[3],
                'status': 'PENDING'
            },
            {
                'challenger_1': users[4],
                'challenger_2': users[0],
                'defender_1': users[1],
                'defender_2': users[2],
                'status': 'ACCEPTED'
            },
        ]
        
        for data in challenges:
            Challenge.objects.create(**data)
        self.stdout.write(f'  Created {len(challenges)} challenges')
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
        self.stdout.write('')
        self.stdout.write('Test credentials:')
        self.stdout.write('  Email: alice@example.com, bob@example.com, carol@example.com, etc.')
        self.stdout.write('  Password: password123')

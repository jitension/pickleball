from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['skill_level', 'status', 'avatar', 'stats']
        read_only_fields = ['status', 'stats']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'profile']
        read_only_fields = ['email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    skill_level = serializers.ChoiceField(choices=Profile.SkillLevel.choices, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name', 'skill_level']

    def create(self, validated_data):
        skill_level = validated_data.pop('skill_level')
        
        user = User.objects.create_user(**validated_data)

        # Update profile with requested skill level
        user.profile.skill_level = skill_level
        user.profile.save()
        
        return user

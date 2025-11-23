from rest_framework import serializers
from .models import Challenge
from users.serializers import UserSerializer

class ChallengeSerializer(serializers.ModelSerializer):
    challenger_1 = UserSerializer(read_only=True)
    challenger_2 = UserSerializer(read_only=True)
    defender_1 = UserSerializer(read_only=True)
    defender_2 = UserSerializer(read_only=True)

    class Meta:
        model = Challenge
        fields = ['id', 'challenger_1', 'challenger_2', 'defender_1', 'defender_2', 'status', 'result', 'score', 'created']
        read_only_fields = ['challenger_1', 'status', 'result', 'score']

    def create(self, validated_data):
        validated_data['challenger_1'] = self.context['request'].user
        # challenger_2 is passed in validated_data (it's a required field in model, but we need to handle it in serializer)
        # Wait, challenger_2 is a ForeignKey. If I pass ID, DRF handles it if I don't use UserSerializer(read_only=True).
        # But I used UserSerializer(read_only=True), so I need to handle input manually or use a separate write serializer.
        # For simplicity, I'll use PrimaryKeyRelatedField for input and UserSerializer for output.
        return super().create(validated_data)

class ChallengeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['challenger_2']

    def create(self, validated_data):
        validated_data['challenger_1'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, data):
        challenger_1 = self.context['request'].user
        challenger_2 = data.get('challenger_2')

        if challenger_1 == challenger_2:
            raise serializers.ValidationError("You cannot challenge yourself.")

        return data

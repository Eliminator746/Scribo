from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model

# ============ User Serializers ============

User = get_user_model()

class CreateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "bio",
            "job_title",
            "profile_picture",
            "profile_picture_url",
            "facebook",
            "youtube",
            "instagram",
            "twitter",
            "linkedin",
        ]
        
        extra_kwargs = {
            "email": {"required": True},
            "password": {"write_only": True}
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "bio",
            "job_title",
            "profile_picture",
            "profile_picture_url",
            "linkedin",
            "twitter",
        ]

class PrivateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ["password", "groups", "user_permissions"]


# Public author serializer
from .models import Blog
from rest_framework import serializers
from django.contrib.auth import get_user_model


class SimpleAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "profile_picture",
        ]

# Blog READ serializer (detail)
class BlogReadSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer(read_only=True)

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "author",
            "category",
            "content",
            "featured_image",
            "published_date",
            "created_at",
            "updated_at",
        ]

# Blog WRITE serializer (create/update)
class BlogWriteSerializer(serializers.ModelSerializer):
    """
    Used for create & update.
    """
    class Meta:
        model = Blog
        fields = [
            "title",
            "content",
            "category",
            "featured_image",
            "is_draft",
        ]

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value
from django.contrib import admin
from .models import Blog


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "author",
        "category",
        "is_draft",
        "published_date",
        "created_at",
    )

    list_filter = (
        "category",
        "is_draft",
        "published_date",
    )

    search_fields = (
        "title",
        "content",
        "author__username",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    ordering = ("-published_date",)

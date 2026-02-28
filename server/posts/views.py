from rest_framework import generics, status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from .pagination import BlogListLOPagination

from .permissions import IsBlogAuthor
from .models import Blog
from .serializers import (
    BlogReadSerializer,
    BlogWriteSerializer,
)


class BlogListCreateView(ListCreateAPIView):
    """
    GET  /blogs/        -> list published blogs
    POST /blogs/        -> create blog (auth required)
    """
    queryset = Blog.objects.all()
    pagination_class = BlogListLOPagination

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()

        # Authenticated users see published blogs + their own drafts
        # Unauthenticated users see only published blogs
        if not self.request.user.is_authenticated:
            qs = qs.filter(is_draft=False)
        else:
            # Show published blogs OR (draft blogs authored by current user)
            qs = qs.filter(
                Q(is_draft=False) | Q(is_draft=True, author=self.request.user)
            )

        return qs.order_by("-published_date", "-created_at")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BlogWriteSerializer
        return BlogReadSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogRetrieveView(generics.RetrieveAPIView):
    """
    GET /blogs/<slug>/
    """
    
    queryset = Blog.objects.all()
    serializer_class = BlogReadSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]
    
    def get_object(self):
        blog = super().get_object()

        # Hide drafts from non-authors
        user = self.request.user
        if blog.is_draft and (
            not user.is_authenticated or blog.author != user
        ):
            raise NotFound()

        return blog

class BlogUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    PATCH /blogs/<pk>/manage/
    DELETE /blogs/<pk>/manage/
    """
    serializer_class = BlogWriteSerializer
    queryset = Blog.objects.all()
    permission_classes = [IsAuthenticated, IsBlogAuthor]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Capture data BEFORE delete
        blog_id = instance.id
        blog_title = instance.title

        self.perform_destroy(instance)

        return Response(
            {
                "message": "Blog deleted successfully.",
                "id": blog_id,
                "title": blog_title,
            },
            status=status.HTTP_200_OK,
        )

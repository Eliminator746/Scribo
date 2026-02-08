# posts/urls.py
from django.urls import path
from .views import (
    BlogListCreateView,
    BlogRetrieveView,
    BlogUpdateDeleteView,
)

urlpatterns = [
    path("", BlogListCreateView.as_view(), name="blog-list-create"),                       # collection
    path("<slug:slug>/", BlogRetrieveView.as_view(), name="blog-detail"),                   # public read
    path("<int:pk>/manage/", BlogUpdateDeleteView.as_view(), name="blog-update-delete"),    # author-only actions
]

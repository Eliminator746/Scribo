# users/urls.py
from django.urls import path
from .views import (
    LoginView,
    LogoutView,
    RegisterUserView,
    CurrentUserView,
    PublicUserProfileView,
    UserByEmailView,
)

urlpatterns = [
    path("auth/register/", RegisterUserView.as_view()),  # POST /auth/register/
    path("users/me/", CurrentUserView.as_view()),        # GET/PATCH /users/me/
    path("users/", UserByEmailView.as_view()),          # GET /users/?email=
    path("users/<str:username>/", PublicUserProfileView.as_view()), # GET /users/<username>/
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
]

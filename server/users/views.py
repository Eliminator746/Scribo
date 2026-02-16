# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .permissions import IsSelf
from .serializers import CreateUserSerializer, PrivateUserSerializer, PublicUserSerializer
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response

User = get_user_model()

# Register user: POST /auth/register/
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]  # allows profile_picture upload, JSONParser -> for no file 

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "User registered successfully",
                "user": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    GET /users/me/  -> get current user's details
    PATCH /users/me/ -> partial update current user's profile
    """
    # queryset = User.objects.all()
    serializer_class = PrivateUserSerializer
    permission_classes = [IsAuthenticated, IsSelf]
    
    def get_object(self):
        return self.request.user

    
class PublicUserProfileView(generics.RetrieveAPIView):
    """
    GET /users/<username>/  -> public profile by username
    """
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer
    lookup_field = "username"


class UserByEmailView(generics.ListAPIView):
    """
    GET /users/?email=foo@example.com  -> admin only 
    """
    serializer_class = PublicUserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        email = self.request.query_params.get("email")
        if not email:
            return User.objects.none()
        return User.objects.filter(email=email)
    
    

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            
        user = authenticate(username=user_obj.username, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        login(request, user)
        return Response(
            {"detail": "Login successful"},
            status=status.HTTP_200_OK,
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"detail": "Logout successful"},
            status=status.HTTP_200_OK,
        )

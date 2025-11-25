from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserDetailView, UserListView
from .authentication import EmailTokenObtainPairView
from .google_auth import GoogleLoginView, GoogleCallbackView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/google/login/', GoogleLoginView.as_view(), name='google_login'),
    path('auth/google/callback/', GoogleCallbackView.as_view(), name='google_callback'),
    path('users/me/', UserDetailView.as_view(), name='user_me'),
    path('users/', UserListView.as_view(), name='user_list'),
]

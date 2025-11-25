from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model
import os

User = get_user_model()

# These should be set in environment variables
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_OAUTH_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_OAUTH_CLIENT_SECRET', '')
GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_OAUTH_REDIRECT_URI', 'http://localhost:8011/api/auth/google/callback/')

class GoogleLoginView(APIView):
    """Initiate Google OAuth flow"""
    permission_classes = []
    
    def get(self, request):
        # Construct Google OAuth URL
        google_oauth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={GOOGLE_CLIENT_ID}&"
            f"redirect_uri={GOOGLE_REDIRECT_URI}&"
            f"response_type=code&"
            f"scope=openid email profile&"
            f"access_type=offline&"
            f"prompt=select_account"
        )
        return redirect(google_oauth_url)


class GoogleCallbackView(APIView):
    """Handle Google OAuth callback"""
    permission_classes = []
    
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response(
                {'error': 'Authorization code not provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Exchange code for tokens
            import requests
            token_url = 'https://oauth2.googleapis.com/token'
            token_data = {
                'code': code,
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'redirect_uri': GOOGLE_REDIRECT_URI,
                'grant_type': 'authorization_code',
            }
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
            
            # Verify the ID token
            idinfo = id_token.verify_oauth2_token(
                tokens['id_token'],
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
            
            # Extract user info
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            google_id = idinfo.get('sub')
            picture = idinfo.get('picture', '')
            
            if not email:
                return Response(
                    {'error': 'Email not provided by Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )
            
            # Update profile with Google OAuth data
            profile = user.profile
            profile.auth_provider = 'GOOGLE'
            profile.oauth_id = google_id
            if picture:
                profile.oauth_picture = picture
            profile.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Determine frontend URL for final redirect
            frontend_base = os.getenv('FRONTEND_URL', 'http://localhost:8011')
            redirect_url = f"{frontend_base}/auth/callback?access={str(refresh.access_token)}&refresh={str(refresh)}"
            return redirect(redirect_url)
            
        except Exception as e:
            print(f"Google OAuth error: {str(e)}")
            return Response(
                {'error': f'Authentication failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

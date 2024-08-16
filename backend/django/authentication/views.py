from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import SiteUser
from django.views import View
from rest_framework_simplejwt.authentication import JWTAuthentication
import jwt
from users.models import SiteUser
from django.utils.decorators import method_decorator
import pyotp
import qrcode
import base64
from io import BytesIO



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['username'] = self.user.username
        
        return data

class LoginView(View):
    # serializer_class = CustomTokenObtainPairSerializer
    @csrf_exempt
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({
                'isAuthenticated': True,
                'username': request.user.username
            })
        else:
            return JsonResponse({
                'isAuthenticated': False,
                'username': None
        })

def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Successfully logged out'})

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response({"error": "Please provide all required fields"}, status=status.HTTP_400_BAD_REQUEST)

        if SiteUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if SiteUser.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = SiteUser.objects.create_user(username=username, password=password, email=email)
        user.save()

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)



class GenerateQRCodeView(View):
    def get(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({'error': 'User is not authenticated'}, status=403)

            key = "django-insecure-bq^l6js&*iwr+e&zpvt3toh*66ol1edrh*3m4x@h#jck7sa#^l"  # Replace this with the actual key generation logic
            totp = pyotp.TOTP(key)
            uri = totp.provisioning_uri(name=request.user.username, issuer_name="ft_transcendance")

            img = qrcode.make(uri)
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            return JsonResponse({'qrcode': img_str})

        except Exception as e:
            # Log the error message for debugging
            print(f"Error generating QR code: {e}")
            return JsonResponse({'error': 'Internal Server Error'}, status=500)
        

import os
import pyotp # OTP
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.exceptions import ValidationError  #check email format
from django.core.validators import validate_email  #check email format
from django.http import JsonResponse
from django.contrib.auth import authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from users.models import SiteUser   # used for RegisterView


class LoginView(TokenObtainPairView):
	def post(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		otp = request.data.get('otp')
		user = authenticate(request, username=username, password=password)
		if user is not None:
			if user.otp_secret and user.otp_verified and not pyotp.TOTP(user.otp_secret).verify(otp):
				return Response({"error": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)
			return super().post(request)
		return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
def login_status(request):
	try:
		if request.user.is_authenticated:
			return JsonResponse({
				'isAuthenticated': True,
				'username': request.user.username,
				'otp_verified': request.user.otp_verified
			})
		else:
			return JsonResponse({
				'isAuthenticated': False,
				'username': None
			})
	except Exception as e:
		return JsonResponse({'error': str(e)}, status=400)


def logout_view(request):
	logout(request)
	return JsonResponse({'message': 'Successfully logged out'})


class RegisterView(APIView):
	def post(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		email = request.data.get('email')
		otp_secret = pyotp.random_base32()

		if not username or not password or not email:
			return Response({"error": "Please provide all required fields"}, status=status.HTTP_400_BAD_REQUEST)

		# check username length
		if len(username) > 30 or len(username) < 3:
			return Response({"error": "Username must be between 3 and 30 characters"}, status=status.HTTP_400_BAD_REQUEST)

		# check email format
		try:
			validate_email(email)
		except ValidationError:
			return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

		# check if username or email already exists
		if SiteUser.objects.filter(username=username).exists():
			return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

		if SiteUser.objects.filter(email=email).exists():
			return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
	
		user = SiteUser.objects.create_user(username=username,
											password=password,
											email=email,
											otp_secret=otp_secret)
		user.avatar = os.getenv("DEFAULT_AVATAR_URL")
		user.save()

		return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


class OtpProvisioningView(APIView):
	def get(self, request):
		if request.user.is_authenticated:
			if request.user.otp_verified:
				return JsonResponse({'error': 'OTP already verified'}, status=400)

			if not request.user.otp_secret:
				request.user.otp_secret = pyotp.random_base32()
				request.user.save()

			secret = request.user.otp_secret
			email = request.user.email
			uri = pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name="Transcendence")
			return JsonResponse({'uri': uri, "user": email})
		return JsonResponse({'error': 'Unauthorized'}, status=401)


class OtpVerifyView(APIView):
	def post(self, request):
		if request.method != 'POST':
			return JsonResponse({'error': 'Invalid request'}, status=400)
		if request.user.is_authenticated:
			otp = request.data.get('otp')
			secret = request.user.otp_secret
			if pyotp.TOTP(secret).verify(otp):
				request.user.otp_verified = True
				request.user.save()
				return JsonResponse({'message': 'OTP verified successfully'})
			return JsonResponse({'error': 'Invalid OTP'}, status=400)
		return JsonResponse({'error': 'Unauthorized'}, status=401)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from users.models import SiteUser   # used for RegisterView


class LoginView(APIView):
	def post(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
		return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
def login_status(request):
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


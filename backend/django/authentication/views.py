from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from . import forms


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
        return JsonResponse({'isAuthenticated': True})
    else:
        return JsonResponse({'isAuthenticated': False})


# def register_view(request):
# 	return HttpResponse("<h1> Hello World! </h1><p> this is the register page </p>")


def logout_view(request):
	logout(request)
	return JsonResponse({'message': 'Successfully logged out'})
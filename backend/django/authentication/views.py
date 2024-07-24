from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
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
	

class LoginPageView(View):
	template_name = 'authentication/login.html'
	form_class = forms.LoginForm

	def get(self, request):
		form = self.form_class()
		message = ''
		return render(request, self.template_name, context={'form': form, 'message': message})

	def post(self, request):
		form = self.form_class(request.POST)
		if form.is_valid():
			user = authenticate(
				username=form.cleaned_data['username'],
				password=form.cleaned_data['password'],
				)
			if user is not None:
				login(request, user)
				return redirect('auth_index')
		message = "invalid credentials"
		return render(request, self.template_name, context={'form': form, 'message': message})


def register_view(request):
	return HttpResponse("<h1> Hello World! </h1><p> this is the register page </p>")


def logout_view(request):
	logout(request)
	return redirect('login')

@login_required
def base_view(request):
	return render(request, 'authentication/base.html')
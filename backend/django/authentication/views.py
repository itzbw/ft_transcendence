from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from . import forms


# Create your views here.
def login_view(request):
	form = forms.LoginForm()
	message = ''
	if request.method == 'POST':
		form = forms.LoginForm(request.POST)
		if form.is_valid():
			user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
			if user is not None:
				login(request, user)
				message = f'Welcome, {user.username}!'
			else:
				message = "invalid credentials"
	return render(request, 'authentication/login.html', context={'form': form, 'message': message})


def register_view(request):
	return HttpResponse("<h1> Hello World! </h1><p> this is the register page </p>")


def logout_view(request):
	logout(request)
	return redirect('login')

@login_required
def base_view(request):
	return render(request, 'authentication/base.html')
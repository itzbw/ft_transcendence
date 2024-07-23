from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .forms import CustomUserCreationForm, CustomAuthenticationForm


def register(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			return redirect('home')  # Redirige vers une page d'accueil ou tableau de bord après l'inscription
	else:
		form = CustomUserCreationForm()
	return render(request, 'authentification/register.html', {'form': form})


def login_view(request):
	if request.method == 'POST':
		form = CustomAuthenticationForm(data=request.POST)
		if form.is_valid():
			user = form.get_user()
			login(request, user)
			return redirect('home')  # Redirige vers une page d'accueil ou tableau de bord après la connexion
	else:
		form = CustomAuthenticationForm()
	return render(request, 'authentification/login.html', {'form': form})
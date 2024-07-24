from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse



# Create your views here.
def login_view(request):
	return HttpResponse("<h1> Hello World! </h1><p> this is the login page </p>")


def register_view(request):
	return HttpResponse("<h1> Hello World! </h1><p> this is the register page </p>")


def logout_view(request):
	return HttpResponse("<h1> Hello World! </h1><p> this is the logout </p>")
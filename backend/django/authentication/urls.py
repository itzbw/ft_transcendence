from django.urls import path
from .views import register_view, LoginPageView, logout_view, base_view

urlpatterns = [
	path('register/', register_view, name='register'),
	path('login/', LoginPageView.as_view(), name='login'),
	path('logout/', logout_view, name='logout'),
	path('',  base_view, name="auth_index"),
]

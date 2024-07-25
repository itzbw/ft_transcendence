from django.urls import path
from .views import LoginView, logout_view, login_status

urlpatterns = [
	path('status/', login_status, name='login-status'),
	# path('register/', register_view, name='register'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', logout_view, name='logout'),
]

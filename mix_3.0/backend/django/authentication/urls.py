from django.urls import path
from .views import LoginView, logout_view, login_status, RegisterView

urlpatterns = [
	path('status/', login_status, name='login-status'),
	path('register/', RegisterView.as_view(), name='register'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', logout_view, name='logout'),
]

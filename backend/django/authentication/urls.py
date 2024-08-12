from django.urls import path
from .views import LoginView, logout_view, login_status, RegisterView
from two_factor.views import SetupView

urlpatterns = [
	path('status/', login_status, name='login-status'),
	path('register/', RegisterView.as_view(), name='register'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', logout_view, name='logout'),
    path('login2/', SetupView.as_view(), name='login2'), #to do to redirect
]

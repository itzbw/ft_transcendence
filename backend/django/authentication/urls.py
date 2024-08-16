from django.urls import path
from .views import LoginView, logout_view, login_status, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
	path('register/', RegisterView.as_view(), name='register'),
	path('logout/', logout_view, name='logout'),
	path('status/', login_status, name='login-status'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Utilisation du JWT pour le login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

from django.urls import path
from .views import LoginView, logout_view, RegisterView
from two_factor.views import SetupView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import GenerateQRCodeView

urlpatterns = [
	path('status/', LoginView.as_view(), name='login-status'),
	path('register/', RegisterView.as_view(), name='register'),
	path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Utilisation du JWT pour le login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('logout/', logout_view, name='logout'),
    path('login2/', SetupView.as_view(), name='login2'), #to do to redirect
    path('generate-qrcode/', GenerateQRCodeView.as_view(), name='generate_qrcode'),
]

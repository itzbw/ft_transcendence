from django.urls import path
from .views import LoginView, logout_view, login_status, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
	path('status/', login_status, name='login-status'),
	path('register/', RegisterView.as_view(), name='register'),
	path('logout/', logout_view, name='logout'),
	path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	# path('login/', LoginView.as_view(), name='login'),   [DEPRECATED : no JWT]
]

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
	LoginView,
	logout_view,
	login_status,
	RegisterView,
	OtpProvisioningView,
	OtpVerifyView
)

urlpatterns = [
	path('status/', login_status, name='login-status'),
	path('register/', RegisterView.as_view(), name='register'),
	path('logout/', logout_view, name='logout'),
	path('login/', LoginView.as_view(), name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('otp/provisioning/', OtpProvisioningView.as_view(), name='otp_provisioning'),
	path('otp/verify/', OtpVerifyView.as_view(), name='otp_verify'),
]

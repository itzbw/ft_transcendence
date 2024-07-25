from django.urls import path
from .views import register_view, LoginView, logout_view, base_view, login_status

urlpatterns = [
	path('status/', login_status),
	# path('register/', register_view, name='register'),
	path('login/', LoginView.as_view(), name='login'),
	path('logout/', logout_view, name='logout'),
	# path('',  base_view, name="auth_index"),
]

from django.urls import path
from .views import user_profile_view

urlpatterns = [
	path('user_profile/', user_profile_view, name="user-profile"),
	# path('users/<str:profile_username>/', user_profile_view, name='user-profile'),
]

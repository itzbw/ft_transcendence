from django.urls import path
from .views import UserProfileView, upload_avatar

urlpatterns = [
	path('<str:profile_username>/', UserProfileView.as_view(), name='user-profile'),
	path('upload_avatar/', upload_avatar, name='upload-avatar'),
]

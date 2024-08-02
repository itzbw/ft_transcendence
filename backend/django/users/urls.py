from django.urls import path
from .views import UserProfileView, upload_avatar

urlpatterns = [
	path('upload_avatar/', upload_avatar, name='upload-avatar'),
	path('<str:profile_username>/', UserProfileView.as_view(), name='user-profile'),
]

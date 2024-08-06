from django.urls import path
from .views import UserProfileView, upload_avatar, AddFriend, RemoveFriend

urlpatterns = [
	path('upload_avatar/<str:profile_username>/', upload_avatar, name='upload-avatar'),
	path('add_friend/', AddFriend.as_view(), name="add-friend"),
	path('remove_friend/', RemoveFriend.as_view(), name="add-friend"),
	path('<str:profile_username>/', UserProfileView.as_view(), name='user-profile'),

]

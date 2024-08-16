from django.urls import path
from .views import (
	UserProfileView,
	upload_avatar,
	FriendsListView,
	AddFriendView,
	RemoveFriendView,
	CheckFriendshipView,
	leaderboard,
	update_last_active,
	SaveGameView
)


urlpatterns = [
	path('upload_avatar/<str:profile_username>/', upload_avatar, name='upload-avatar'),
	path('check_friendship/<str:username>/', CheckFriendshipView.as_view(), name="check-friendship"),
	path('get_friends_list/', FriendsListView.as_view(), name='frieds-list'),
	path('add_friend/', AddFriendView.as_view(), name="add-friend"),
	path('remove_friend/', RemoveFriendView.as_view(), name="remove-friend"),
	path('leaderboard/', leaderboard, name='leaderboard'),
	path('update_status/', update_last_active, name="update-status"),
	path('save_game/', SaveGameView.as_view(), name="save-game"),
	path('<str:profile_username>/', UserProfileView.as_view(), name='user-profile'),
]

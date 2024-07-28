import os
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import SiteUser


def user_profile_view(request):
	user = request.user

	if not isinstance(user, SiteUser):
		return JsonResponse({'error': 'Invalid user type'}, status=400)
	if not user.avatar:
		user.avatar = os.getenv("DEFAULT_AVATAR_URL")
	data = {
		"username": user.username,
		"email": user.email,
		"avatar": user.avatar,
		"dateCreated": user.dateCreated.strftime('%Y-%m-%d'),
		"totalPlayed": user.totalPlayed,
		"totalWon": user.totalWon,
		"totalLost": user.totalLost,
	}
	return JsonResponse(data)



# def change_avatar()

# def delete_account_view()

# def user_history()
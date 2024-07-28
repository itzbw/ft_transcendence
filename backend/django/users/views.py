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
		"datecreated": user.datecreated.strftime('%Y-%m-%d'),
		"totalplayed": user.totalplayed,
		"totalwin": user.totalwin,
		"totaldefait": user.totaldefait,
	}
	return JsonResponse(data)



# def change_avatar()

# def delete_account_view()

# def user_history()
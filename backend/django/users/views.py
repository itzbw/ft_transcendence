import os
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from django.views import View
from django.http import JsonResponse
from urllib.parse import quote
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from .models import SiteUser


class UserProfileView(View):

	def get_user(self, profile_username):
		user = get_object_or_404(SiteUser, username=profile_username)
		if not user.avatar:
			user.avatar = os.getenv("DEFAULT_AVATAR_URL")
		return user

	def get(self, request, profile_username):
		user = self.get_user(profile_username)
		
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

	def post(self, request, profile_username):
		user = self.get_user(profile_username)
		
		data = request.POST
		
		if 'username' in data:
			if SiteUser.objects.filter(username=data['username']).exclude(username=profile_username).exists():
				return JsonResponse({"error": "already in use"}, status=400)
			user.username = data['username']

		if 'email' in data:
			if SiteUser.objects.filter(username=data['username']).exclude(username=profile_username).exists():
				return JsonResponse({"error": "already in use"}, status=400)
			user.email = data['email']
		
		try:
			user.save()
		except ValidationError as e:
			return JsonResponse({"error": str(e)}, status=400)

		response_data = {
			"username": user.username,
			"email": user.email,
			"avatar": user.avatar,
			"dateCreated": user.dateCreated.strftime('%Y-%m-%d'),
			"totalPlayed": user.totalPlayed,
			"totalWon": user.totalWon,
			"totalLost": user.totalLost,
		}
		return JsonResponse(response_data)


@require_POST
def upload_avatar(request):
	user = request.user

	# Check if user is authenticated
	if not user.is_authenticated:
		return JsonResponse({'error': 'User not authenticated'}, status=401)
	
	# Check if there is an 'avatar' in the request
	if 'avatar' not in request.FILES:
		return JsonResponse({'error': 'No file uploaded'}, status=400)
	
	# Check file's extension
	avatar_file = request.FILES['avatar']
	if not avatar_file.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
		return JsonResponse({'error': 'Invalid file type'}, status=400)

	# Save the file in /shared_media/
	file_name = f"{user.username}{os.path.splitext(avatar_file.name)[-1]}"
	file_path = os.path.join('shared_media', file_name)
	file_url = quote(file_path)

	with default_storage.open(file_path, 'wb+') as destination:
		for chunk in avatar_file.chunks():
			destination.write(chunk)

	# Update user's avatar field
	user.avatar = file_url
	user.save()

	return JsonResponse({'avatar_url': file_url})

# def delete_account_view()

# def user_history()
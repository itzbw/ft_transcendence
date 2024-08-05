import os
from django.conf import settings   
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from django.views import View
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import SiteUser


@csrf_exempt
def add_friend(request):
    if request.method == 'POST':
        user = request.user
        friend_username = request.POST.get('friend_username')

        if not friend_username:
            return JsonResponse({'error': 'No friend username provided'}, status=400)

        try:
            friend = SiteUser.objects.get(username=friend_username)
            user.friends.add(friend)
            return JsonResponse({'message': 'Friend added successfully'}, status=200)
        except SiteUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_friends(request, profile_username):
    user = get_object_or_404(SiteUser, username=profile_username)
    friends = user.friends.all()
    friends_data = [{'username': friend.username, 'email': friend.email} for friend in friends]
    return JsonResponse(friends_data, safe=False)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

class UserProfileView(View):
    
    def get_user(self, profile_username):
        user = get_object_or_404(SiteUser, username=profile_username)
        if not user.avatar:
            user.avatar = os.getenv("DEFAULT_AVATAR_URL")
        return user

    def get(self, request, profile_username):
        user = self.get_user(profile_username)
        
        # Fetch friends
        friends = user.friends.all().values('username', 'email')

        data = {
            "username": user.username,
            "email": user.email,
            "avatar": user.avatar,
            "dateCreated": user.dateCreated.strftime('%Y-%m-%d'),
            "totalPlayed": user.totalPlayed,
            "totalWon": user.totalWon,
            "totalLost": user.totalLost,
            "friends": list(friends)  # Add friends to response data
        }
        return JsonResponse(data)

    def post(self, request, profile_username):
        user = self.get_user(profile_username)
        data = request.POST

        if 'username' in data:
            if SiteUser.objects.filter(username=data['username']).exclude(username=profile_username).exists():
                return JsonResponse({"error": "Username already in use"}, status=400)
            user.username = data['username']

        if 'email' in data:
            if SiteUser.objects.filter(email=data['email']).exclude(email=user.email).exists():
                return JsonResponse({"error": "Email already in use"}, status=400)
            user.email = data['email']

        try:
            user.save()
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)

        response_data = {
            "username": user.username,
            "email": user.email,
        }
        return JsonResponse(response_data)

    def delete(self, request, profile_username):
        user = self.get_user(profile_username)
        user.delete()
        return JsonResponse({'message': 'Account deleted successfully.'})

@csrf_exempt
def upload_avatar(request, profile_username):
	if request.method == 'POST':
		if 'avatar' in request.FILES:
			avatar_file = request.FILES['avatar']
			file_extension = os.path.splitext(avatar_file.name)[1]
			new_file_name = f"{profile_username}{file_extension}"
			file_path = os.path.join(settings.MEDIA_ROOT, new_file_name)

			user = SiteUser.objects.get(username=profile_username)
			old_avatar_name = user.avatar
			if user.avatar:
				old_file_path = os.path.join(settings.MEDIA_ROOT, old_avatar_name)

			with default_storage.open(file_path, 'wb+') as destination:
				for chunk in avatar_file.chunks():
					destination.write(chunk)

			user.avatar = file_path
			user.save()

			if old_avatar_name and old_file_path != file_path and default_storage.exists(old_file_path):
				default_storage.delete(old_file_path)

			return JsonResponse({'message': 'Avatar uploaded successfully!'})

	return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def delete_account(request):
	if request.method == 'POST':
		try:
			user = request.user
			username = user.username
			user.delete()
			return JsonResponse({'message': 'Account deleted successfully.'}, status=200)
		except Exception as e:
			return JsonResponse({'error': str(e)}, status=500)
	return JsonResponse({'error': 'Invalid request method.'}, status=405)

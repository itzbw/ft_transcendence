import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from django.conf import settings   # upload_avatar
from django.core.files.storage import default_storage  # upload_avatar
from django.core.exceptions import ValidationError  # UserProfileView -> post
from django.utils import timezone # Regular ping
from django.views import View
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import SiteUser, Game


class UserProfileView(View):

	def get_user(self, profile_username):
		user = get_object_or_404(SiteUser, username=profile_username)
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
			"is_online": user.is_online(),
			"games": user.games(),
		}
		return JsonResponse(data)

	def post(self, request, profile_username):
		user = self.get_user(profile_username)
		message = ""
		data = request.POST

		if 'username' in data:
			if SiteUser.objects.filter(username=data['username']).exclude(username=profile_username).exists():
				return JsonResponse({"error": "already in use"}, status=400)
				message = "already in use"
			user.username = data['username']

		if 'email' in data:
			if SiteUser.objects.filter(email=data['email']).exclude(email=user.email).exists():
				return JsonResponse({"error": "already in use"}, status=400)
				message = "already in use"
			user.email = data['email']

		try:
			user.save()
		except ValidationError as e:
			return JsonResponse({"error": str(e)}, status=400)

		response_data = {
			"username": user.username,
			"email": user.email,
			"message": message,
		}
		return JsonResponse(response_data)

	def delete(self, request, profile_username):
		user = self.get_user(profile_username)
		user.delete()
		return JsonResponse({'message': 'Account deleted successfully.'})


def upload_avatar(request, profile_username):
	if request.method == 'POST':
		# Ensure the request contains a file
		if 'avatar' in request.FILES:
			avatar_file = request.FILES['avatar']
			
			# Extract the file extension (include the dot)
			file_extension = os.path.splitext(avatar_file.name)[1]

			#  create the new filename : username.ext
			new_file_name = f"{profile_username}{file_extension}"

			# Define the path to save the file
			file_path = os.path.join(settings.MEDIA_ROOT, new_file_name)
			
			# get user's old avatar file path 
			user = SiteUser.objects.get(username=profile_username)
			old_avatar_name = user.avatar
			if (user.avatar):
				old_file_path = os.path.join(settings.MEDIA_ROOT, old_avatar_name)

			# Save the file
			with default_storage.open(file_path, 'wb+') as destination:
				for chunk in avatar_file.chunks():
					destination.write(chunk)
			
			# Here you could update the user's avatar field with the file path
			user.avatar = file_path
			user.save()

			# Delete the old avatar file if it exists and is different from the new one
			if old_avatar_name and old_file_path != file_path and old_file_path != '/img/default_avatar.jpg' and default_storage.exists(old_file_path):
				default_storage.delete(old_file_path)
			
			return JsonResponse({'message': 'Avatar uploaded successfully!'})

	return JsonResponse({'error': 'Invalid request'}, status=400)


class CheckFriendshipView(APIView):
	def get(self, request, username):
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

		try:
			friend = SiteUser.objects.get(username=username)
			if friend in user.friends.all():
				return Response({'is_friend': True}, status=status.HTTP_200_OK)
			return Response({'is_friend': False}, status=status.HTTP_200_OK)
		except SiteUser.DoesNotExist:
			return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class FriendsListView(APIView):

	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		user = request.user
		friends_list = [{'username': friend.username} for friend in user.friends.all()]
		return Response(friends_list, status=status.HTTP_200_OK)


class AddFriendView(APIView):
	def post(self, request):
		user = request.user
		if not user.is_authenticated:
			return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

		username = request.data.get('username')
		try:
			friend = SiteUser.objects.get(username=username)
			if friend != user and friend not in user.friends.all():
				user.friends.add(friend)
				user.save()
				return Response({'message': 'Friend added successfully'}, status=status.HTTP_201_CREATED)
			return Response({'error': 'Invalid friend'}, status=status.HTTP_400_BAD_REQUEST)
		except SiteUser.DoesNotExist:
			return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class RemoveFriendView(APIView):
    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        username = request.data.get('username')
        try:
            friend = SiteUser.objects.get(username=username)
            if friend in user.friends.all():
                user.friends.remove(friend)
                user.save()
                return Response({'message': 'Friend removed successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Friend not found'}, status=status.HTTP_404_NOT_FOUND)
        except SiteUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


def leaderboard(request):
	users = SiteUser.objects.all().order_by('-totalWon')[:20]  # sorted by total won, max 20
	data = [
		{
			'username': user.username,
			'avatar': user.avatar,
			'totalPlayed': user.totalPlayed,
			'totalWon': user.totalWon,
			'totalLost': user.totalLost
		}
		for user in users
	]
	return JsonResponse(data, safe=False)


def update_last_active(request):
	user = request.user
	user.last_active = timezone.now()
	user.save()
	return JsonResponse({'status': 'success', 'last_active': user.last_active})


class SaveGameView(APIView):
	def post(self, request):
		data = request.data

		# Extract data from the request
		player1_name = data.get('player1Name')
		player1_score = data.get('player1Score')
		player2_name = data.get('player2Name')
		player2_score = data.get('player2Score')

		# Check if users exist
		player1 = SiteUser.objects.filter(username=player1_name).first()
		player2 = SiteUser.objects.filter(username=player2_name).first()

		# If no existing user, saving game is not needed
		if not player1 and not player2:
			return Response({'message': data}, status=status.HTTP_201_CREATED)

		# Create and save the "Game"
		game = Game.objects.create(
			player1=player1,
			player1_name=player1_name if not player1 else '',
			player1_score=player1_score,
			player2=player2,
			player2_name=player2_name if not player2 else '',
			player2_score=player2_score
		)

		# Update the overall stats if the players exist
		if player1:
			player1.totalPlayed += 1
			if player1_score > player2_score:
				player1.totalWon += 1
			else:
				player1.totalLost += 1
			player1.save()

		if player2:
			player2.totalPlayed += 1
			if player2_score > player1_score:
				player2.totalWon += 1
			else:
				player2.totalLost += 1
			player2.save()

		return Response({'message': 'Game saved successfully!'}, status=status.HTTP_201_CREATED)
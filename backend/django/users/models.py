from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class SiteUser(AbstractUser):
	username = models.CharField(max_length=30, unique=True)
	email = models.EmailField(unique=True)
	avatar = models.CharField(max_length=100, null=True, blank=True)
	dateCreated = models.DateField(null=True, blank=True)

	# OTP
	otp_secret = models.CharField(max_length=32, null=True, blank=True)
	otp_verified = models.BooleanField(default=False)	

	# Overall stats
	totalPlayed = models.IntegerField(default=0)
	totalWon = models.IntegerField(default=0)
	totalLost = models.IntegerField(default=0)

	# Friends
	friends = models.ManyToManyField('self', symmetrical=False, blank=True)

	# Field to track last activity
	last_active = models.DateTimeField(null=True, blank=True)

	# Override SiteUser.save() to get the date creation
	def save(self, *args, **kwargs):
		if not self.id:  # If user is new
			self.dateCreated = timezone.now().date()
		super(SiteUser, self).save(*args, **kwargs)

	# Add a new friend
	def addFriend(self, friend):
		if friend != self and friend not in self.friends.all():
			self.friends.add(friend)
			self.save()
		else:
			raise ValueError("Cannot add this user as a friend")
		
	# Remove a friend
	def remove_friend(self, friend):
		if friend in self.friends.all():
			self.friends.remove(friend)
			self.save()
		else:
			raise ValueError("This user is not in your friends list")
		
	def is_online(self):
		if self.last_active:
			now = timezone.now()
			# Considered online if last activity was within 60 seconds
			return (now - self.last_active).total_seconds() < 60
		return False

	def games(self):

		games_as_player1 = self.games_as_player1.all()
		games_as_player2 = self.games_as_player2.all()
		
		all_games = games_as_player1.union(games_as_player2).order_by('-date_played')

		games_list = []
		for game in all_games:
			games_list.append({
				'player1_name': game.player1_name if game.player1 is None else game.player1.username,
				'player1_score': game.player1_score,
				'player2_name': game.player2_name if game.player2 is None else game.player2.username,
				'player2_score': game.player2_score,
				'date_played': game.date_played.strftime('%Y-%m-%d %H:%M:%S')
			})
		return games_list


class Game(models.Model):
	player1 = models.ForeignKey(SiteUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='games_as_player1')
	player1_name = models.CharField(max_length=100, blank=True)  # store the name if player1 is None
	player1_score = models.IntegerField()
	
	player2 = models.ForeignKey(SiteUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='games_as_player2')
	player2_name = models.CharField(max_length=100, blank=True)  # store the name if player2 is None
	player2_score = models.IntegerField()

	# Stores the date the game was played
	date_played = models.DateTimeField(auto_now_add=True)


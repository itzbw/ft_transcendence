from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class SiteUser(AbstractUser):
	username = models.CharField(max_length=30, unique=True)
	email = models.EmailField(unique=True)
	avatar = models.CharField(max_length=100, null=True, blank=True)
	dateCreated = models.DateField(null=True, blank=True)

	# Overall stats
	totalPlayed = models.IntegerField(default=0)
	totalWon = models.IntegerField(default=0)
	totalLost = models.IntegerField(default=0)

	# Friends
	friends = models.ManyToManyField('self', symmetrical=False, blank=True)

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
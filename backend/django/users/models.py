from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# Create your models here.
class SiteUser(AbstractUser):
	username = models.CharField(max_length=30, unique=True)
	email = models.EmailField(unique=True)
	avatar = models.CharField(null=True, blank=True)
	datecreated = models.DateField(null=True, blank=True)

	# Override SiteUser.save() to get the date creation
	def save(self, *args, **kwargs):
		if not self.id:  # Si l'utilisateur est nouveau
			self.datecreated = timezone.now().date()
		super(SiteUser, self).save(*args, **kwargs)

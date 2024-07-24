from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class SiteUser(AbstractUser):
	name = models.CharField(max_length=30, unique=True)
	email = models.EmailField(unique=True)
	# avatar = models.ImageField()

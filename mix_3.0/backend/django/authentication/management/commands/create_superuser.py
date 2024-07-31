import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import SiteUser

class Command(BaseCommand):
	help = 'Create a superuser'

	def handle(self, *args, **options):
		username = os.environ.get('DJANGO_SUPERUSER_NAME')
		password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

		if not username or not password:
			self.stdout.write(self.style.ERROR('Environment variables DJANGO_SUPERUSER_NAME and DJANGO_SUPERUSER_PASSWORD are required'))
			return
		if not SiteUser.objects.filter(username=username).exists():
			SiteUser.objects.create_superuser(username, '', password)
			self.stdout.write(self.style.SUCCESS('Superuser created successfully'))

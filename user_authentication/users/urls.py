# users/urls.py

from django.urls import include, path
from users.views import dashboard

urlpatterns = [
	path('accounts/', include('django.contrib.auth.urls')),
    path('dashboard/', dashboard, name='dashboard'),
]

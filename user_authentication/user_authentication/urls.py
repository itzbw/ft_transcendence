# user_authentication/urls.py

from django.urls import include, path
from django.contrib import admin

urlpatterns = [
    path('', include("users.urls")),
    path('admin/', admin.site.urls),
]

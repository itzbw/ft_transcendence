from django.urls import path
from . import views

urlpatterns = [
	path('', views.coucou),
	path('get-data/', views.get_data, name='get-data'),
]
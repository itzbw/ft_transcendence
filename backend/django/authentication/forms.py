# from django import forms

from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm


class SignupForm(UserCreationForm):
	class Meta(UserCreationForm.Meta):
		model = get_user_model()
		fields = ['username', 'email']


# class LoginForm(forms.Form):
# 	username = forms.CharField(max_length=30, label='Username')

# 	# widget PasswordInput hide the password when the user type it
# 	password = forms.CharField(max_length=63, widget=forms.PasswordInput, label = 'Password')
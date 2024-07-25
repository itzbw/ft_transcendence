from django import forms


class LoginForm(forms.Form):
	username = forms.CharField(max_length=30, label='Username')

	# widget PasswordInput hide the password when the user type it
	password = forms.CharField(max_length=63, widget=forms.PasswordInput, label = 'Password')
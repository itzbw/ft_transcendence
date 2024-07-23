# ft_transcendence

Postgresql with django : https://docs.djangoproject.com/fr/5.0/intro/tutorial02/

To do : 

- settings.py -> CsRF_TRUSTED requiers https://localhost  format instead of localhost

- settings.py -> SECRET_KEY must be replaced by SECRET_KEY = os.environ["SECRET_KEY"]
	(to create a new key : ```echo "export SECRET_KEY='$(openssl rand -hex 40)'" > .DJANGO_SECRET_KEY```
	then copy it in .env file)

- CORS ?

- auth/admin.py -> remove once project is done
- Remove admin/ when finished ?




## Dictionary

CORS = Cross-Origin Resource Sharing

CSRF = Cross-Site Request Forgery
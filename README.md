
# ft_transcendence

  

## To do :

### Mandatory global

[ ] Tournament

[ ] back & forward buttons in browser must work (??)

  

### User Management

  

[ ] Passwords mut be encrypted

[ ] Users can update their info

[ ] Users can upload an avatar (bu hey have a default one if none is provided)

[ ] Add a friend and see user status (online or offline) is a mandatory part of the module.

[ ] User profile must display stats (wins, losses,...)

[ ] Users have a match history, including dates and other relevant details

 [x] User's avatar display size must be set + can be changed + default avatar must be set by JS if backend->none

 [ ] User must be able to delete its account

  
  

### Miscellaneous

[ ] settings.py -> SECRET_KEY must be replaced by SECRET_KEY = os.environ["SECRET_KEY"]

(to create a new key : ```echo "export SECRET_KEY='$(openssl rand -hex 40)'" > .DJANGO_SECRET_KEY```

then copy it in .env file)

  
[ ] auth/admin.py -> remove once project is done
[ ] Remove admin/ when finished ?
[ ] When project finished, remove dir /backend/django/authentication/management

  
  
  

## Dictionary

  

CORS = Cross-Origin Resource Sharing

  

CSRF = Cross-Site Request Forgery

  

REST = Representational State Transfer

  

URI = Uniform Resource Identifier
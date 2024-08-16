import jwt
from users.models import SiteUser
from ft_transcendence import settings


class JwtAuthMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		# One-time configuration and initialization.

	def __call__(self, request):
		# Code to be executed for each request before
		# the view (and later middleware) are called.

		authorization = request.headers.get('Authorization')
		if authorization is not None and 'Bearer' in authorization:
			token = authorization.replace('Bearer', '').strip()
			try:
				decoded = jwt.decode(token, settings.SIMPLE_JWT.get('SIGNING_KEY'), algorithms=[settings.SIMPLE_JWT.get('ALGORITHM')])
				user = SiteUser.objects.get(id=decoded.get('user_id'))
				request.user = user
			except jwt.ExpiredSignatureError:
				print('JWT expired, not populating user.')

		response = self.get_response(request)

		# Code to be executed for each request/response after
		# the view is called.

		return response
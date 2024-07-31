from django.http import HttpResponse, JsonResponse
import datetime
	
	
def coucou(request):
	now = datetime.datetime.now()
	html = "<html><body>It is now %s.</body></html>" % now
	return HttpResponse(html)

def get_data(request):
	data = {
		'message': 'Hello from Django!'
	}
	return JsonResponse(data)

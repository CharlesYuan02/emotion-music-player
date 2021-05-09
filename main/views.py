from django.shortcuts import render
from django.http.response import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from main.detect import getExpression

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def getExpression(request):
    uri = request.POST.get('image_uri', '')
    expression = getExpression(uri)
    return JsonResponse({"mood": mood})



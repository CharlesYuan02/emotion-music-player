from django.shortcuts import render
from django.http.response import HttpResponse
#from main.detect import getExpression

def index(request):
    return render(request, 'index.html')

def getExpression(request):
    photo = response.POST.get('photo')
    expression = getExpression(photo)
    return HttpResponse(expression)



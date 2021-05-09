from django.urls import path, include
from main import views

urlpatterns = [
    path('', views.index, name="index"),
    path("expression", views.expression, name="expression")
]

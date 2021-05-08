from django.urls import path, include
from main import views


urlpatterns = [
    path('', views.index, name="index"),
    path("video_feed", views.video_feed, name="video_feed"),

    # Why doesn't this pass the expression value to the js script?
    path("expression", views.index, name="express")
]

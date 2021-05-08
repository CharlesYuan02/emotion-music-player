from django.shortcuts import render
from django.http.response import StreamingHttpResponse
from main.detect import VideoCamera

def index(response):
    expression = VideoCamera().get_frame()[1]
    return render(response, 'index.html', {"exp": expression})


def gen(cap):
    while True:
        frame = cap.get_frame()[0]
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


def video_feed(response):
    return StreamingHttpResponse(gen(VideoCamera()), content_type="multipart/x-mixed-replace; boundary=frame")


def express(response):
    while True:
        expression = cap.get_frame()[1]
        return render(response, 'templates/index.html', expression=expression)

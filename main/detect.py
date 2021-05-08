import cv2
from django.conf import settings
from django.shortcuts import render
from imutils.video import VideoStream
import numpy as np
import os
import urllib.request
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.preprocessing import image

haar_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
classifier = load_model("emotion_classifier.h5")
classes = ["Angry", "Happy", "Neutral", "Sad", "Surprise"]
expression = "None"


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        global expression

        ret1, frame = self.video.read()
        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        detected = haar_cascade.detectMultiScale(
            gray, scaleFactor=1.3, minNeighbors=5)
        expression = ""

        for (x, y, w, h) in detected:
            # Draws blue rectangle around face
            cv2.rectangle(frame, pt1=(x, y), pt2=(x+w, y+h),
                          color=(255, 0, 0), thickness=2)

            # Stores only face from the image
            roi_gray = gray[y:y+h, x:x+w]

            # Resize to 224x224 using interpolation to calculate pixel values for new image
            roi_gray = cv2.resize(roi_gray, (48, 48),
                                  interpolation=cv2.INTER_AREA)

            # If a face is detected in the ROI by the classifier
            if np.sum([roi_gray]) != 0:

                # Normalized, converted to array to be used by model
                roi = roi_gray.astype("float")/255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)
                predict = classifier.predict(roi)[0]
                label = classes[predict.argmax()]
                label_position = (x, y)
                expression = label.lower()

                # Puts prediction as text above the ROI, in green
                cv2.putText(frame, label, label_position,
                            cv2.FONT_HERSHEY_COMPLEX, 2, (0, 255, 0), 3)
            else:
                cv2.putText(frame, "No Face Detected", (20, 20),
                            cv2.FONT_HERSHEY_COMPLEX, 2, (0, 255, 0), 3)

        # Convert to jpeg to pass to website feed
        ret2, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes(), expression

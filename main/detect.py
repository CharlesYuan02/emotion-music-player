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
import base64
from imageio import imread
import io

haar_cascade = cv2.CascadeClassifier(
cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# Pass in app path because Heroku is dumb
classifier = load_model("main/emotion_classifier.h5")
classes = ["Angry", "Happy", "Calm", "Sad", "Surprise"]
expression = "None"

# converts a base64 encoded image string to a numpy array
def uri_to_cv2_img(uri):
    header, encoded = uri.split(",", 1)
    img = imread(io.BytesIO(base64.b64decode(encoded)))
    return img

# determines the person's mood based on the image of the face
def getExpression(uri):
    img = uri_to_cv2_img(uri)
    frame = cv2.flip(img, 1)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    print(gray)
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
    
    if expression == '':
        expression = 'Calm'
    return expression

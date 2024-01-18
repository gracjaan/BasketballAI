import uuid
from flask import Flask, render_template, session

import base64

import cv2
import numpy as np
from flask_socketio import SocketIO, emit

from shot_detector import ShotDetector

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, async_mode="threading")

detectors = {}

# This will be the home page
@app.route('/')
def home():
    return render_template("index.html")


@app.route('/statistics')
def statistics():
    return render_template("statistics.html")

@app.route('/dynamic')
def dynamic():
    return render_template("dynamic.html")


def base64_to_image(base64_string):
    """
    The base64_to_image function accepts a base64 encoded string and returns an image.
    The function extracts the base64 binary data from the input string, decodes it, converts 
    the bytes to numpy array, and then decodes the numpy array as an image using OpenCV.
    
    :param base64_string: Pass the base64 encoded image string to the function
    :return: An image
    """
    base64_data = base64_string.split(",")[1]
    image_bytes = base64.b64decode(base64_data)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    return image


@socketio.on("connect")
def test_connect():
    """
    The test_connect function is used to test the connection between the client and server.
    It sends a message to the client letting it know that it has successfully connected.
    
    :return: A 'connected' string
    """
    print("Connected")
    emit("my response", {"data": "Connected"})
    
@socketio.on("gen_id")
def gen_id(id):
    if (id in detectors):
        emit("gen_id", {"data": "Connected", "id": id})
        return

    id = str(uuid.uuid4())
    while (id in detectors):
        id = str(uuid.uuid4())

    detectors[id] = ShotDetector()
    emit("gen_id", {"id": id})
    
@socketio.on("image")
def receive_image(data):
    """
    The receive_image function takes in an image from the webcam, converts it to grayscale, and then emits
    the processed image back to the client.


    :param image: Pass the image data to the receive_image function
    :return: The image that was received from the client
    """
    # Decode the base64-encoded image data
    image = base64_to_image(data['data'])

    # Process the image
    # gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # frame_resized = cv2.resize(gray, (400, 300))

    id = data['id']
    if (id not in detectors):
        return

    frame_encoded = detectors[id].run_once(image)

    # Encode the image data to jpg
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
    result, frame_encoded = cv2.imencode(".jpg", frame_encoded, encode_param)

    # Encode the image data to base64
    processed_img_data = base64.b64encode(frame_encoded).decode()
    b64_src = "data:image/jpg;base64,"
    processed_img_data = b64_src + processed_img_data
    emit("processed_image", {"data": processed_img_data, "score": detectors[id].makes, "attempts": detectors[id].attempts})
    
@socketio.on("stats")
def receive_stats(id):
    if (id not in detectors):
        return

    emit("stats_data", { "score": detectors[id].makes, "attempts": detectors[id].attempts})


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')

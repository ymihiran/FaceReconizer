import base64
from flask import Flask, request, jsonify, send_file
import cv2
import os
from imgbeddings import imgbeddings
import numpy as np
from PIL import Image
from pymongo import MongoClient
from bson.binary import Binary
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Loading the pre-trained Haar cascade for face detection
alg = "haarcascade_frontalface_default.xml"
haar_cascade = cv2.CascadeClassifier(alg)
ibed = imgbeddings()

# MongoDB configuration
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['faces']
collection = db['detected_faces']

# Function to detect faces in an image and return the cropped faces
def detect_faces(image_path):
    img = cv2.imread(image_path)
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = haar_cascade.detectMultiScale(gray_img, scaleFactor=1.05, minNeighbors=2, minSize=(100, 100))
    cropped_faces = []
    for x, y, w, h in faces:
        cropped_faces.append(img[y:y+h, x:x+w])
    return cropped_faces

# Function to detect faces in an image and store them in MongoDB
def detect_and_store_faces(image_data):
    nparr = np.fromstring(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = haar_cascade.detectMultiScale(gray_img, scaleFactor=1.05, minNeighbors=2, minSize=(100, 100))

    saved_faces = []
    for i, (x, y, w, h) in enumerate(faces):
        face_img = img[y:y+h, x:x+w]
        _, img_encoded = cv2.imencode('.png', face_img)
        face_base64 = base64.b64encode(img_encoded).decode('utf-8')
        saved_faces.append(face_base64)
    return saved_faces

@app.route('/detect_faces', methods=['POST'])
def detect_faces2():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in the request'}), 400
    
    image = request.files['image']
    image_data = image.read()
    detected_faces = detect_and_store_faces(image_data)
    
    return jsonify({'detected_faces': detected_faces}), 200

@app.route('/save_face', methods=['POST'])
def save_face():
    print(request.form)

    images = request.form.getlist('images')
    names = request.form.getlist('names')

    if len(images) != len(names):
        return jsonify({'error': 'Number of images and names do not match'}), 400

    for image_data, name in zip(images, names):
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400

        # Decode base64 image data
        image_bytes = base64.b64decode(image_data)
        face_data = Binary(image_bytes)
        collection.insert_one({'name': name, 'face_data': face_data})

    return jsonify({'message': 'Faces saved to MongoDB'}), 200

# Function to calculate embeddings for a list of face images
def calculate_embeddings(face_images):
    embeddings = []
    for face_img in face_images:
        face_pil_image = Image.fromarray(cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB))
        embedding = ibed.to_embeddings(face_pil_image)
        embeddings.append(embedding)
    return embeddings

# Function to find similar faces in a database of embeddings
def find_similar_faces(query_embedding, database_embeddings):
    similarity_scores = []
    for db_embedding in database_embeddings:
        similarity_score = np.dot(query_embedding, db_embedding.T)
        similarity_scores.append(similarity_score)
    most_similar_index = np.argmax(similarity_scores)
    return most_similar_index

@app.route('/select_image', methods=['POST'])
def select_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    image_path = "temp_image.jpg"
    file.save(image_path)

    query_faces = detect_faces(image_path)
    query_embeddings = calculate_embeddings(query_faces)

    stored_face_embeddings = []
    for stored_face_data in collection.find():
        stored_face_img = cv2.imdecode(np.frombuffer(stored_face_data['face_data'], np.uint8), cv2.IMREAD_COLOR)
        stored_face_embedding = calculate_embeddings([stored_face_img])[0]
        stored_face_embeddings.append(stored_face_embedding)

    most_similar_index = find_similar_faces(query_embeddings[0], stored_face_embeddings)

    most_similar_face_data = list(collection.find())[most_similar_index]

    most_similar_face_img = cv2.imdecode(np.frombuffer(most_similar_face_data['face_data'], np.uint8), cv2.IMREAD_COLOR)
    
    # Save the selected image temporarily
    selected_image_path = 'selected_image.jpg'
    cv2.imwrite(selected_image_path, most_similar_face_img)

    # Read the selected image and encode it as base64
    with open(selected_image_path, 'rb') as f:
        image_data = f.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')

    # Delete the temporary image file
    os.remove(selected_image_path)

    return jsonify({'selected_image': encoded_image, 'name': most_similar_face_data['name']})

if __name__ == '__main__':
    app.run(debug=True, port=8075)

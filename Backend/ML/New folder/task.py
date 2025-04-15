from flask import Flask, render_template, request, jsonify
import pytesseract
from PIL import Image
import re
import os
from werkzeug.utils import secure_filename
import pickle
from collections import defaultdict
import pandas as pd
import json

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
# Load the custom user prediction model
def load_custom_model():
    with open('association_model.pkl', 'rb') as f:
        return pickle.load(f)

# Load once at the beginning
model = load_custom_model()


# Load historical data from JSON file
with open('data.json', 'r') as f:
    historical_data = json.load(f)

# Global variables
predicted_users = []
extracted_products = []

# Check if the file is allowed (png, jpg, jpeg)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the pickled model
def load_model():
    with open('association_model.pkl', 'rb') as f:
        rules = pickle.load(f)
    return rules

# Extract text from image
def extract_text_from_image(image_path):
    return pytesseract.image_to_string(Image.open(image_path))

def clean_ocr_text(text):
    text = text.replace(',', '.')
    text = re.sub(r'[—«–]', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9.\s]', '', text)
    return text.strip()

# Extract product information from OCR text
def extract_products(ocr_text):
    lines = [line.strip() for line in ocr_text.split('\n') if line.strip()]
    products = []
    reading_items = False

    ignore_keywords = ['total', 'round', 'payment', 'wallet', 'tax', 'gst', 'balance', 'tender',
                       'eoe', 'cust id', 'points', 'earned', 'closing', 'opening']

    for line in lines:
        line_clean = clean_ocr_text(line)

        if any(kw in line_clean.lower() for kw in ignore_keywords):
            continue

        if re.search(r'Description.*MRP.*Rate.*(Qty|Oty).*Amt', line_clean, re.IGNORECASE):
            reading_items = True
            continue

        if not reading_items:
            continue

        if re.match(r'^\d', line_clean):
            continue

        numbers = re.findall(r'\d+\.\d+', line_clean)
        if len(numbers) < 2:
            continue

        try:
            amt = float(numbers[-1])
            qty = float(numbers[-2]) if len(numbers) >= 3 else 1.0
            rate = float(numbers[-3]) if len(numbers) >= 3 else float(numbers[-2])
            mrp = float(numbers[-4]) if len(numbers) >= 4 else rate

            mrp_str = re.escape(str(mrp))
            match = re.search(mrp_str, line_clean)
            description = line_clean[:match.start()].strip() if match else "Unknown"

            products.append({
                "Description": description,
                "MRP": round(mrp, 2),
                "Rate": round(rate, 2),
                "Qty": round(qty, 2),
                "Amt": round(amt, 2)
            })

        except Exception:
            continue

    return products

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        global extracted_products
        raw_text = extract_text_from_image(file_path)
        extracted_products = extract_products(raw_text)

        return render_template('extract.html', products=extracted_products)
    return jsonify({"error": "Invalid file type"}), 400

# Prediction endpoint
@app.route('/predict', methods=['GET'])
def prediction():
    if not extracted_products:
        return jsonify({"error": "No products extracted. Please upload an image first."}), 400

    # Use your pickled model
    global model
    predictions_by_user = {}

    for product in extracted_products:
        users = model.predict_users_for_product(product['Description'])  # Assuming this method exists
        for user in users:
            if user not in predictions_by_user:
                predictions_by_user[user] = []
            predictions_by_user[user].append({
                "product": product['Description'],
                "rate": product["Rate"]
            })

    return render_template('predict.html',
                           products=extracted_products,
                           predictions=predictions_by_user)


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
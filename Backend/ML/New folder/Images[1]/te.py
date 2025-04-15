from flask import Flask, render_template, request, jsonify
import pytesseract
from PIL import Image
import re
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# OPTIONAL: Set Tesseract path if needed
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract_text_from_image(image_path):
    return pytesseract.image_to_string(Image.open(image_path))


def clean_ocr_text(text):
    text = text.replace(',', '.')
    text = re.sub(r'[—«–]', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9.\s]', '', text)
    return text.strip()


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


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'image' not in request.files:
            return jsonify({"error": "No file part"})

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No selected file"})

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            raw_text = extract_text_from_image(file_path)
            products = extract_products(raw_text)
            return jsonify(products)

    return render_template('index.html')


if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)

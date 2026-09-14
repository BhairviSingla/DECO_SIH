"""
Minimal Flask API to expose the fish disease image classifier to your frontend.

Run:
    pip install flask flask-cors --break-system-packages
    python3 api_image.py

Your frontend sends a POST request with a multipart image file:
    POST http://localhost:5001/predict-image
    (form-data, field name: "image")

Response:
    {
      "predicted_class": "Fungal diseases Saprolegniasis",
      "confidence": 46.05,
      "top_predictions": [
        {"class": "Fungal diseases Saprolegniasis", "confidence": 46.05},
        {"class": "Healthy Fish", "confidence": 40.29}
      ],
      "low_confidence_warning": true
    }

NOTE: low_confidence_warning=true means the model is not sure -- your
frontend should visibly flag this to the user (e.g. "uncertain, please
verify manually") rather than presenting the top prediction as certain.
"""

import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from predict_image import predict_disease

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/predict-image", methods=["POST"])
def predict_image_route():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided (expected form field 'image')"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"Unsupported file type. Allowed: {ALLOWED_EXTENSIONS}"}), 400

    # Save to a temp file since the model loader expects a file path
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        result = predict_disease(tmp_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500
    finally:
        os.remove(tmp_path)


if __name__ == "__main__":
    app.run(debug=True, port=5001)

"""
Fish Disease Image Prediction Script
--------------------------------------
Loads the trained model and predicts fish disease class from an image.

Usage from command line:
    python3 predict_image.py <path_to_image>

Or import predict_disease() directly into your backend API.

Note on reliability: this model correctly classifies ~86% of fish images
overall, and is very reliable for Healthy Fish (97% recall) and most
bacterial/viral diseases. It sometimes confuses "Bacterial Red disease"
and "Parasitic diseases" with "Fungal diseases" -- when confidence is
low or two classes are close, treat it as uncertain and flag for human
review rather than trusting the top prediction blindly.
"""

import sys
import json
import numpy as np
import tensorflow as tf

MODEL_PATH = "fish_disease_model.keras"
CLASS_NAMES_PATH = "class_names.json"
IMG_SIZE = (224, 224)

_model = None
_class_names = None


def load_model():
    global _model, _class_names
    if _model is None:
        _model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASS_NAMES_PATH) as f:
            _class_names = json.load(f)
    return _model, _class_names


def predict_disease(image_path, top_k=2):
    """
    Returns a dict:
    {
        "predicted_class": str,
        "confidence": float (0-100),
        "top_predictions": [ {"class": str, "confidence": float}, ... ],
        "low_confidence_warning": bool
    }
    """
    model, class_names = load_model()

    img = tf.keras.utils.load_img(image_path, target_size=IMG_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    preds = model.predict(img_array, verbose=0)[0]

    top_indices = np.argsort(preds)[::-1][:top_k]
    top_predictions = [
        {"class": class_names[i], "confidence": round(float(preds[i]) * 100, 2)}
        for i in top_indices
    ]

    top1_confidence = top_predictions[0]["confidence"]
    top2_confidence = top_predictions[1]["confidence"] if len(top_predictions) > 1 else 0

    # Flag as low-confidence if the top prediction isn't clearly ahead,
    # or if it's below 50% -- this matches the model's known confusion
    # cases (e.g. Bacterial Red disease vs Fungal diseases)
    low_confidence_warning = (top1_confidence < 50) or (top1_confidence - top2_confidence < 15)

    return {
        "predicted_class": top_predictions[0]["class"],
        "confidence": top1_confidence,
        "top_predictions": top_predictions,
        "low_confidence_warning": low_confidence_warning
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 predict_image.py <path_to_image>")
        sys.exit(1)

    result = predict_disease(sys.argv[1])
    print(f"Predicted class: {result['predicted_class']}")
    print(f"Confidence: {result['confidence']}%")
    print("\nTop predictions:")
    for p in result["top_predictions"]:
        print(f"  {p['class']}: {p['confidence']}%")
    if result["low_confidence_warning"]:
        print("\n⚠️  LOW CONFIDENCE -- recommend flagging for manual review")

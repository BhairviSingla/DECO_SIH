"""
Fish Disease Image Classifier
-------------------------------
Trains a CNN (transfer learning on MobileNetV2) to classify a single-fish photo
into one of 7 classes: 6 disease types + healthy.

Dataset: "Freshwater Fish Disease Aquaculture in south asia"
  Train/<class_name>/*.jpg   (250 images per class)
  Test/<class_name>/*.jpg    (100 images per class, held out)
"""

import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import json

DATA_DIR = "Freshwater Fish Disease Aquaculture in south asia"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42

# ------------------------------------------------------------------
# 1. Load data (Train -> train/val split, Test -> held-out test set)
# ------------------------------------------------------------------
train_ds = tf.keras.utils.image_dataset_from_directory(
    f"{DATA_DIR}/Train",
    validation_split=0.15,
    subset="training",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    f"{DATA_DIR}/Train",
    validation_split=0.15,
    subset="validation",
    seed=SEED,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    f"{DATA_DIR}/Test",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False,
)

class_names = train_ds.class_names
print("Classes:", class_names)
with open("class_names.json", "w") as f:
    json.dump(class_names, f)

# Performance: prefetch only (no .cache() -- avoids holding all decoded
# images in memory at once, which caused an OOM kill on this 3.9GB machine)
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)
test_ds = test_ds.prefetch(buffer_size=AUTOTUNE)

# ------------------------------------------------------------------
# 2. Data augmentation (important with only ~210 images/class in training)
# ------------------------------------------------------------------
data_augmentation = models.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(0.15),
    layers.RandomContrast(0.15),
    layers.RandomBrightness(0.15),
])

# ------------------------------------------------------------------
# 3. Build transfer-learning model (MobileNetV2 backbone)
# ------------------------------------------------------------------
preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

base_model = tf.keras.applications.MobileNetV2(
    input_shape=IMG_SIZE + (3,),
    include_top=False,
    weights="imagenet"
)
base_model.trainable = False  # freeze for phase 1

inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
x = data_augmentation(inputs)
x = preprocess_input(x)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(len(class_names), activation="softmax")(x)
model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ------------------------------------------------------------------
# 4. Phase 1: train the classification head only (base frozen)
# ------------------------------------------------------------------
print("\n=== PHASE 1: Training classification head (base frozen) ===")
early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=4, restore_best_weights=True
)

history1 = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=15,
    callbacks=[early_stop]
)

# ------------------------------------------------------------------
# 5. Phase 2: fine-tune the top layers of the base model
# ------------------------------------------------------------------
print("\n=== PHASE 2: Fine-tuning top layers of MobileNetV2 ===")
base_model.trainable = True
# Freeze all but the last ~30 layers
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),  # very low LR for fine-tuning
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

history2 = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=10,
    callbacks=[early_stop]
)

# ------------------------------------------------------------------
# 6. Save model IMMEDIATELY after training (before evaluation),
#    so we don't lose the trained weights if evaluation hits an issue
# ------------------------------------------------------------------
model.save("fish_disease_model.keras")
print("\nModel saved to fish_disease_model.keras")

import gc
gc.collect()

# ------------------------------------------------------------------
# 7. Evaluate on the held-out Test set
# ------------------------------------------------------------------
print("\n=== FINAL EVALUATION ON HELD-OUT TEST SET ===")
test_loss, test_acc = model.evaluate(test_ds)
print(f"Test accuracy: {test_acc*100:.2f}%")
print(f"Test loss: {test_loss:.4f}")

# Per-class report (process batch by batch, discard images immediately to save memory)
y_true = []
y_pred = []
for images, labels in test_ds:
    preds = model.predict(images, verbose=0)
    y_true.extend(labels.numpy().tolist())
    y_pred.extend(np.argmax(preds, axis=1).tolist())
    del images, preds
    gc.collect()

from sklearn.metrics import classification_report, confusion_matrix
print("\n=== Per-class classification report ===")
print(classification_report(y_true, y_pred, target_names=class_names))

print("=== Confusion matrix ===")
print("Rows = actual, Columns = predicted")
print(class_names)
print(confusion_matrix(y_true, y_pred))

# ------------------------------------------------------------------
# 8. DEMO: run a prediction on one real test image
# ------------------------------------------------------------------
import os
demo_class = class_names[0]
demo_dir = f"{DATA_DIR}/Test/{demo_class}"
demo_file = os.listdir(demo_dir)[0]
demo_path = os.path.join(demo_dir, demo_file)

img = tf.keras.utils.load_img(demo_path, target_size=IMG_SIZE)
img_array = tf.keras.utils.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)

pred = model.predict(img_array, verbose=0)[0]
pred_class = class_names[np.argmax(pred)]
pred_confidence = float(np.max(pred)) * 100

print("\n=== DEMO PREDICTION ===")
print(f"Image: {demo_path}")
print(f"Actual class: {demo_class}")
print(f"Predicted class: {pred_class}")
print(f"Confidence: {pred_confidence:.2f}%")
print("\nFull probability breakdown:")
for cls, prob in zip(class_names, pred):
    print(f"  {cls}: {prob*100:.2f}%")

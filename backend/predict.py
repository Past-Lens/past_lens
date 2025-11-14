import onnxruntime as ort
import numpy as np
from PIL import Image
import sys, os, json
import torch

# --- Load class mapping ---
def load_mapping(file_path):
    with open(file_path, "r") as f:
        return json.load(f)

# --- Preprocess image based on model input shape ---
def preprocess_image(image_path, input_shape):
    """
    Automatically preprocess image to match model input shape.
    input_shape: list or tuple, e.g. [1,3,224,224] or [1,224,224,3]
    """
    image = Image.open(image_path).convert("RGB")
    
    # Determine target height, width
    if len(input_shape) == 4:
        if input_shape[1] == 3:
            # NCHW
            H, W = input_shape[2], input_shape[3]
            nhwc = False
        elif input_shape[3] == 3:
            # NHWC
            H, W = input_shape[1], input_shape[2]
            nhwc = True
        else:
            raise ValueError(f"Unexpected input shape: {input_shape}")
    else:
        raise ValueError(f"Unexpected input shape length: {len(input_shape)}")
    
    image = image.resize((W, H))
    img_data = np.array(image).astype(np.float32) / 255.0

    if nhwc:
        img_data = np.expand_dims(img_data, axis=0)  # 1,H,W,3
    else:
        img_data = np.transpose(img_data, (2,0,1))   # C,H,W
        img_data = np.expand_dims(img_data, axis=0)  # 1,C,H,W

    return img_data

# --- Predict function ---
def predict(model_path, mapping_path, image_path):
    try:
        ort_session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
        input_shape = ort_session.get_inputs()[0].shape
        input_tensor = preprocess_image(image_path, input_shape)
        input_name = ort_session.get_inputs()[0].name

        outputs = ort_session.run(None, {input_name: input_tensor})
        preds = torch.tensor(outputs[0][0])
        probs = torch.softmax(preds, dim=0)
        pred_idx = int(torch.argmax(probs))
        confidence = float(probs[pred_idx]) * 100

        mapping = load_mapping(mapping_path)
        label = list(mapping.keys())[pred_idx]

        return {"label": label, "confidence": round(confidence, 2)}

    except Exception as e:
        return {"label": "error", "message": str(e)}

# --- CLI ---
if __name__ == "__main__":
    model_type = sys.argv[1]  # 'kikuyu' or 'maasai'
    image_path = sys.argv[2]

    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, f"models/{model_type}_culture_resnet50.onnx")
    mapping_path = os.path.join(base_dir, f"models/{model_type}_class_mapping.json")

    result = predict(model_path, mapping_path, image_path)
    print(json.dumps(result))

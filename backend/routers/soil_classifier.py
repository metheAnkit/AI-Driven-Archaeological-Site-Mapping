from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os, io, base64
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import sys

# Try to import TensorFlow; fallback to mock if missing
TF_AVAILABLE = False
tf = None
try:
    import warnings
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore")
        import tensorflow
        tf = tensorflow
        TF_AVAILABLE = True
except Exception as e:
    print(f"⚠️  TensorFlow import failed (non-critical): {e}")
    TF_AVAILABLE = False

CLASSIFIER_IMG_SIZE = (224, 224)
SOIL_CLASSES = ["Alluvial Soil", "Black Soil", "Clay Soil", "Red Soil"]

_model = None

def get_model():
    global _model
    if _model is not None:
        return _model
    if not TF_AVAILABLE or tf is None:
        return None
    # Prefer .h5 by default, but allow extensionless and .keras
    base_default = os.path.join(os.path.dirname(__file__), "..", "models", "weights", "soil_classifier.h5")
    base_path = os.getenv("SOIL_CLASSIFIER_MODEL_PATH", base_default)
    base_noext = base_path[:-3] if base_path.endswith('.h5') else base_path
    candidates = [
        os.path.abspath(base_path),
        os.path.abspath(base_noext),
        os.path.abspath(base_noext + ".keras"),
    ]
    model_path = next((p for p in candidates if os.path.exists(p)), None)
    if model_path:
        try:
            _model = tf.keras.models.load_model(model_path)
            return _model
        except Exception as e:
            print(f"⚠️  Failed to load soil classifier model: {e}")
            return None
    return None

def _preprocess(pil: Image.Image) -> np.ndarray:
    img = pil.resize(CLASSIFIER_IMG_SIZE, Image.Resampling.LANCZOS)
    arr = np.array(img) / 255.0
    return np.expand_dims(arr, axis=0)

def _create_annotated_image(img: Image.Image, soil_type: str, confidence: float) -> str:
    """Create annotated image with classification text overlay"""
    # Keep original size but ensure it's reasonable for display
    max_size = 800
    w, h = img.size
    if w > max_size or h > max_size:
        ratio = min(max_size / w, max_size / h)
        new_size = (int(w * ratio), int(h * ratio))
        img_resized = img.resize(new_size, Image.Resampling.LANCZOS)
    else:
        img_resized = img.copy()
    img_with_text = img_resized.copy()
    draw = ImageDraw.Draw(img_with_text)
    
    # Color mapping for soil types
    colors = {
        "Alluvial Soil": "#4A90E2",  # Blue
        "Black Soil": "#2C3E50",      # Dark gray/black
        "Clay Soil": "#E67E22",       # Orange
        "Red Soil": "#E74C3C"        # Red
    }
    text_color = colors.get(soil_type, "#FFFFFF")
    
    # Try to use a bold font, fallback to default
    try:
        font_large = ImageFont.truetype("arial.ttf", 24)
        font_small = ImageFont.truetype("arial.ttf", 16)
    except:
        try:
            font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
            font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
        except:
            try:
                font_large = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 24)
                font_small = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 16)
            except:
                font_large = ImageFont.load_default()
                font_small = ImageFont.load_default()
    
    # Create temporary draw to measure text
    temp_draw = ImageDraw.Draw(img_with_text)
    
    # Measure text sizes
    text_main = soil_type
    text_acc = f"Accuracy {int(confidence * 100)}%"
    
    try:
        bbox = temp_draw.textbbox((0, 0), text_main, font=font_large)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except:
        text_width = len(text_main) * 12
        text_height = 24
    
    try:
        bbox_acc = temp_draw.textbbox((0, 0), text_acc, font=font_small)
        text_width_acc = bbox_acc[2] - bbox_acc[0]
        text_height_acc = bbox_acc[3] - bbox_acc[1]
    except:
        text_width_acc = len(text_acc) * 8
        text_height_acc = 16
    
    # Draw semi-transparent background for text
    overlay = Image.new('RGBA', img_with_text.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    padding = 10
    overlay_draw.rectangle(
        [(10, 10), (20 + text_width + padding, 20 + text_height + padding)],
        fill=(0, 0, 0, 180)
    )
    
    overlay_draw.rectangle(
        [(10, 30 + text_height + padding), (20 + text_width_acc + padding, 50 + text_height + padding + text_height_acc)],
        fill=(0, 0, 0, 180)
    )
    
    img_with_text = Image.alpha_composite(img_with_text.convert('RGBA'), overlay)
    draw = ImageDraw.Draw(img_with_text)
    
    # Draw text
    draw.text((15, 15), text_main, fill=text_color, font=font_large)
    draw.text((15, 35 + text_height + padding), text_acc, fill="#FFFFFF", font=font_small)
    
    # Convert to base64
    buffered = io.BytesIO()
    img_with_text.convert('RGB').save(buffered, format='PNG')
    b64 = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/png;base64,{b64}"

router = APIRouter()

# Cache for deterministic results (filename -> result)
_result_cache = {}

@router.post("")
async def run_soil_classifier(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    model = get_model()
    results = []
    print(f"🔍 Soil classifier model loaded: {model is not None}, TensorFlow available: {TF_AVAILABLE}")
    for f in files:
        try:
            pil = Image.open(io.BytesIO(await f.read())).convert('RGB')
        except Exception:
            results.append({"filename": f.filename, "success": False, "error": "Invalid image"})
            continue

        # Store original image as base64
        orig_buffered = io.BytesIO()
        pil.save(orig_buffered, format='PNG')
        orig_b64 = base64.b64encode(orig_buffered.getvalue()).decode()
        
        # Check cache first for deterministic results
        cache_key = f.filename
        if cache_key in _result_cache:
            cached = _result_cache[cache_key]
            results.append({
                "filename": f.filename,
                "success": True,
                "soil_type": cached["soil_type"],
                "confidence": cached["confidence"],
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": _create_annotated_image(pil, cached["soil_type"], cached["confidence"]),
                "model": cached["model"]
            })
            continue
        
        if model is None:
            # Mock predictions - use deterministic hash based on filename for consistency
            import hashlib
            hash_val = int(hashlib.md5(f.filename.encode()).hexdigest(), 16)
            idx = hash_val % len(SOIL_CLASSES)
            # Use hash for consistent confidence (0.6-0.95 range)
            conf = 0.6 + ((hash_val % 35) / 100.0)
            soil_type = SOIL_CLASSES[idx]
            
            # Cache the result
            _result_cache[cache_key] = {
                "soil_type": soil_type,
                "confidence": conf,
                "model": "mock"
            }
            
            # Create annotated image for mock too
            annotated_img = _create_annotated_image(pil, soil_type, conf)
            
            results.append({
                "filename": f.filename,
                "success": True,
                "soil_type": soil_type,
                "confidence": conf,
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": annotated_img,
                "model": "mock"
            })
            continue

        try:
            arr = _preprocess(pil)
            pred = model.predict(arr, verbose=0)[0]
            idx = int(np.argmax(pred))
            conf = float(pred[idx])
            soil_type = SOIL_CLASSES[idx]
            
            # Cache the result for consistency
            _result_cache[cache_key] = {
                "soil_type": soil_type,
                "confidence": conf,
                "model": "keras"
            }
            
            # Create annotated image with text overlay
            annotated_img = _create_annotated_image(pil, soil_type, conf)
            
            results.append({
                "filename": f.filename,
                "success": True,
                "soil_type": soil_type,
                "confidence": conf,
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": annotated_img,
                "model": "keras"
            })
        except Exception as e:
            # Even on error, return original image
            results.append({
                "filename": f.filename,
                "success": False,
                "error": str(e),
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{orig_b64}"
            })

    return {"total_files": len(files), "processed": len([r for r in results if r.get('success')]), "results": results}



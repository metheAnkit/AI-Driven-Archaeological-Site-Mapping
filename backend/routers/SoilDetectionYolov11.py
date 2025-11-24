from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os, io, base64
from PIL import Image

TARGET_SIZE = (244, 244)

def _load_model():
    global _model_path_tried, _load_error
    try:
        from ultralytics import YOLO
        import torch
        
        # Fix for PyTorch 2.6+ weights_only requirement
        try:
            import ultralytics.nn.tasks
            torch.serialization.add_safe_globals([ultralytics.nn.tasks.DetectionModel])
        except Exception:
            pass
        
        model_path = os.getenv("SOIL_DETECTION_MODEL_PATH", os.path.join(os.path.dirname(__file__), "..", "models", "weights", "soil_detection_best.pt"))
        model_path = os.path.abspath(model_path)
        _model_path_tried = model_path
        
        if not os.path.exists(model_path):
            print(f"⚠️ Soil detection model file not found at: {model_path}")
            alt_paths = [
                os.path.join(os.path.dirname(__file__), "..", "..", "models", "weights", "soil_detection_best.pt"),
                "models/weights/soil_detection_best.pt",
                "soil_detection_best.pt"
            ]
            for alt in alt_paths:
                alt_abs = os.path.abspath(alt)
                if os.path.exists(alt_abs):
                    model_path = alt_abs
                    _model_path_tried = model_path
                    print(f"✅ Found soil model at: {model_path}")
                    break
            else:
                _load_error = f"Soil model not found (tried: {model_path} and alternatives)"
                print(f"❌ Soil model not found.")
                return None
        
        print(f"✅ Loading soil detection model from: {model_path}")
        
        # Try loading with explicit weights_only=False handling
        try:
            from contextlib import contextmanager
            
            @contextmanager
            def torch_load_patch():
                original_load = torch.load
                def patched_load(*args, **kwargs):
                    kwargs['weights_only'] = False
                    return original_load(*args, **kwargs)
                torch.load = patched_load
                try:
                    yield
                finally:
                    torch.load = original_load
            
            with torch_load_patch():
                model = YOLO(model_path)
            
            print(f"✅ Soil model loaded successfully!")
            return model
        except Exception as load_err:
            print(f"⚠️ Failed with patched load, trying direct load...")
            try:
                model = YOLO(model_path)
                print(f"✅ Soil model loaded successfully (direct)!")
                return model
            except Exception:
                _load_error = str(load_err)
                raise load_err
        
    except Exception as e:
        _load_error = str(e)
        print(f"❌ Error loading soil model: {str(e)}")
        return None

router = APIRouter()
_model = None
_load_error = None
_model_path_tried = None

def get_model():
    global _model, _load_error, _model_path_tried
    if _model is None:
        try:
            _model = _load_model()
        except Exception as e:
            _load_error = str(e)
            _model = None
    return _model

@router.get('/status')
async def model_status():
    """Return status about soil detection model loading for diagnostics."""
    loaded = _model is not None
    return {
        "model_loaded": loaded,
        "model_path": _model_path_tried,
        "load_error": _load_error
    }

@router.post("")
async def run_soil_detection(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    model = get_model()
    results_payload = []
    
    print(f"🔍 Soil detection model loaded: {model is not None}")

    for f in files:
        image_bytes = await f.read()
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            # Store original image
            orig_buffered = io.BytesIO()
            img.save(orig_buffered, format='PNG')
            orig_b64 = base64.b64encode(orig_buffered.getvalue()).decode()
        except Exception as e:
            results_payload.append({"filename": f.filename, "success": False, "error": f"Invalid image: {str(e)}"})
            continue

        original_size = img.size
        img_resized = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

        if model is None:
            buffered = io.BytesIO()
            img_resized.save(buffered, format='PNG')
            b64 = base64.b64encode(buffered.getvalue()).decode()
            results_payload.append({
                "filename": f.filename,
                "success": True,
                "segments": [],
                "segment_count": 0,
                "original_size": original_size,
                "processed_size": TARGET_SIZE,
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{b64}",
                "note": "Model not available, returned resized image"
            })
            continue

        try:
            pred = model.predict(img_resized, conf=0.25, imgsz=640, save=False, verbose=False)
            r0 = pred[0]
            segments = []
            if getattr(r0, 'masks', None) is not None and getattr(r0, 'boxes', None) is not None:
                for i, _ in enumerate(r0.masks):
                    segments.append({
                        "class": int(r0.boxes.cls[i]),
                        "confidence": float(r0.boxes.conf[i]),
                    })
            
            # Get annotated image with overlays
            annotated = r0.plot()
            annotated_pil = Image.fromarray(annotated).resize(original_size, Image.Resampling.LANCZOS)
            buffered = io.BytesIO()
            annotated_pil.save(buffered, format='PNG')
            b64 = base64.b64encode(buffered.getvalue()).decode()
            
            results_payload.append({
                "filename": f.filename,
                "success": True,
                "segments": segments,
                "segment_count": len(segments),
                "original_size": original_size,
                "processed_size": TARGET_SIZE,
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{b64}",
            })
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"❌ Soil detection error for {f.filename}: {str(e)}")
            results_payload.append({
                "filename": f.filename,
                "success": False,
                "error": str(e),
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{orig_b64}"
            })

    return {"total_files": len(files), "processed": len([r for r in results_payload if r.get("success")]), "results": results_payload}



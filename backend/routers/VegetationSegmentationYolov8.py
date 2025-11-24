from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os, io, base64
from PIL import Image, ImageDraw
import numpy as np

# Lazy import ultralytics and handle missing gracefully
def _load_model():
    # We'll capture the path tried and any load error to module-level vars for diagnostics
    global _model_path_tried, _load_error
    try:
        from ultralytics import YOLO
        import torch

        # Fix for PyTorch 2.6+ weights_only requirement
        # Add ultralytics classes to safe globals for torch.load
        try:
            import ultralytics.nn.tasks
            torch.serialization.add_safe_globals([ultralytics.nn.tasks.DetectionModel])
        except Exception:
            # not critical; continue
            pass

        # determine model path and record it
        model_path = os.getenv(
            "VEGETATION_MODEL_PATH",
            os.path.join(os.path.dirname(__file__), "..", "models", "weights", "vegetation_best.pt")
        )
        model_path = os.path.abspath(model_path)
        _model_path_tried = model_path

        if not os.path.exists(model_path):
            print(f"⚠️ Model file not found at: {model_path}")
            # Try alternative paths
            alt_paths = [
                os.path.join(os.path.dirname(__file__), "..", "..", "models", "weights", "vegetation_best.pt"),
                "models/weights/vegetation_best.pt",
                "vegetation_best.pt"
            ]
            for alt in alt_paths:
                alt_abs = os.path.abspath(alt)
                if os.path.exists(alt_abs):
                    model_path = alt_abs
                    _model_path_tried = model_path
                    print(f"✅ Found model at: {model_path}")
                    break
            else:
                _load_error = f"Model not found in any location (tried: {model_path} and alternatives)"
                print(f"❌ Model not found in any location.")
                return None

        print(f"✅ Loading vegetation model from: {model_path}")

        # Try loading with explicit weights_only=False handling
        # PyTorch 2.6+ requires weights_only=False for custom models
        try:
            # Use context manager approach if available
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

            print(f"✅ Model loaded successfully!")
            return model
        except Exception as load_err:
            print(f"⚠️ Failed with patched load, trying direct load...")
            # Try direct load as fallback
            try:
                model = YOLO(model_path)
                print(f"✅ Model loaded successfully (direct)!")
                return model
            except Exception:
                _load_error = str(load_err)
                raise load_err

    except Exception as e:
        _load_error = str(e)
        print(f"❌ Error loading model: {str(e)}")
        return None

router = APIRouter()
_model = None
_load_error = None
_model_path_tried = None

def get_model():
    global _model, _load_error
    if _model is None:
        try:
            _model = _load_model()
        except Exception as e:
            _load_error = str(e)
            _model = None
    return _model


@router.get('/status')
async def model_status():
    """Return status about vegetation model loading for diagnostics."""
    loaded = _model is not None
    return {
        "model_loaded": loaded,
        "model_path": _model_path_tried,
        "load_error": _load_error
    }

@router.post("")
async def run_vegetation(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    model = get_model()
    results_payload = []

    for f in files:
        image_bytes = await f.read()
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            # Store original image as base64
            orig_buffered = io.BytesIO()
            img.save(orig_buffered, format='PNG')
            orig_b64 = base64.b64encode(orig_buffered.getvalue()).decode()
        except Exception as e:
            results_payload.append({"filename": f.filename, "success": False, "error": f"Invalid image: {str(e)}"})
            continue

        if model is None:
            # Graceful fallback - return original image and diagnostic info
            results_payload.append({
                "filename": f.filename,
                "success": False,
                "segments": [],
                "segment_count": 0,
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{orig_b64}",
                "note": "Model not available, returned original image",
                "model_loaded": False,
                "model_error": _load_error,
                "model_path": _model_path_tried
            })
            continue

        try:
            # Try segmentation first, fallback to detection
            print(f"🔄 Processing {f.filename} with vegetation model...")
            pred = model.predict(img, conf=0.25, imgsz=640, save=False, verbose=False)
            r0 = pred[0]
            print(f"✅ Prediction done for {f.filename}")
            
            # Check for segmentation masks (semantic segmentation)
            segments = []
            segment_count = 0
            
            # Use YOLO's plot method which automatically handles bounding boxes, labels, and masks
            try:
                # Use plot() with line width for better visibility
                base_annotated = r0.plot(line_width=2, labels=True, boxes=True)
                if isinstance(base_annotated, np.ndarray):
                    annotated_pil = Image.fromarray(base_annotated).convert('RGB')
                elif hasattr(base_annotated, 'convert'):
                    annotated_pil = base_annotated.convert('RGB')
                else:
                    annotated_pil = Image.fromarray(np.array(base_annotated)).convert('RGB')
            except Exception as plot_err:
                print(f"⚠️ Plot method failed: {plot_err}")
                annotated_pil = img.copy()
            
            # Extract segment information
            if getattr(r0, 'masks', None) is not None and len(r0.masks) > 0:
                # Semantic segmentation mode - enhance with yellow overlays
                boxes = r0.boxes if hasattr(r0, 'boxes') and r0.boxes is not None else None
                
                # Convert to RGBA for overlay work
                annotated_pil = annotated_pil.convert('RGBA')
                
                for i, mask in enumerate(r0.masks):
                    cls_val = int(boxes.cls[i]) if boxes is not None and len(boxes.cls) > i else 0
                    conf_val = float(boxes.conf[i]) if boxes is not None and len(boxes.conf) > i else 0.0
                    
                    # Get mask data and resize to image size
                    try:
                        mask_data = mask.data.cpu().numpy() if hasattr(mask.data, 'cpu') else mask.data
                        mask_array = mask_data[0] if len(mask_data.shape) > 2 else mask_data
                        
                        # Resize mask to image dimensions
                        mask_img = Image.fromarray((mask_array * 255).astype(np.uint8), mode='L')
                        mask_img = mask_img.resize(img.size, Image.Resampling.LANCZOS)
                        mask_array = np.array(mask_img) > 127
                        
                        # Draw yellow overlay on vegetation masks
                        if np.any(mask_array):
                            # Create yellow overlay
                            mask_rgba = np.zeros((*mask_array.shape, 4), dtype=np.uint8)
                            mask_rgba[mask_array] = [255, 255, 0, 100]  # Yellow with transparency
                            mask_overlay = Image.fromarray(mask_rgba, 'RGBA')
                            annotated_pil = Image.alpha_composite(annotated_pil, mask_overlay)
                            
                            # Draw bright yellow outline
                            try:
                                h, w = mask_array.shape
                                edges = np.zeros_like(mask_array, dtype=bool)
                                if h > 1:
                                    edges[:-1, :] |= (mask_array[:-1, :] != mask_array[1:, :])
                                    edges[1:, :] |= (mask_array[:-1, :] != mask_array[1:, :])
                                if w > 1:
                                    edges[:, :-1] |= (mask_array[:, :-1] != mask_array[:, 1:])
                                    edges[:, 1:] |= (mask_array[:, :-1] != mask_array[:, 1:])
                                
                                # Create outline overlay
                                outline_rgba = np.zeros((h, w, 4), dtype=np.uint8)
                                edge_mask = edges & mask_array
                                outline_rgba[edge_mask] = [255, 255, 0, 255]  # Bright yellow outline
                                
                                outline_overlay = Image.fromarray(outline_rgba, 'RGBA')
                                annotated_pil = Image.alpha_composite(annotated_pil, outline_overlay)
                            except:
                                pass
                        
                        segments.append({
                            "class": cls_val,
                            "confidence": conf_val,
                            "area": float(mask_array.sum()) if hasattr(mask_array, 'sum') else 0,
                        })
                        segment_count += 1
                    except Exception as mask_err:
                        pass
                
                # Convert back to RGB
                annotated_pil = annotated_pil.convert('RGB')
                        
            if getattr(r0, 'boxes', None) is not None and len(r0.boxes) > 0:
                # Extract box information (plot() already drew them)
                try:
                    class_names = r0.names if hasattr(r0, 'names') else {}
                except:
                    class_names = {0: "vegetation"}
                
                for b in r0.boxes:
                    cls_id = int(b.cls[0])
                    conf = float(b.conf[0])
                    bbox = [float(x) for x in b.xyxy[0].tolist()]
                    class_name = class_names.get(cls_id, "vegetation")
                    
                    segments.append({
                        "class": cls_id,
                        "class_name": class_name,
                        "confidence": conf,
                        "bbox": bbox,
                    })
                    segment_count += 1
            
            # If no segments detected, add indicator
            if segment_count == 0:
                try:
                    draw = ImageDraw.Draw(annotated_pil)
                    # Draw text in corner to show processing occurred
                    draw.text((10, 10), "No vegetation detected", fill=(255, 255, 0), stroke_width=2, stroke_fill=(0, 0, 0))
                except:
                    pass
                
            annotated_buffered = io.BytesIO()
            annotated_pil.save(annotated_buffered, format='PNG')
            annotated_b64 = base64.b64encode(annotated_buffered.getvalue()).decode()

            results_payload.append({
                "filename": f.filename,
                "success": True,
                "segments": segments,
                "segment_count": segment_count,
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{annotated_b64}",
            })
        except Exception as e:
            # Even on error, return original image and print full traceback
            import traceback
            traceback.print_exc()
            print(f"❌ Error processing {f.filename}: {str(e)}")
            results_payload.append({
                "filename": f.filename,
                "success": False,
                "error": str(e),
                "original_image": f"data:image/png;base64,{orig_b64}",
                "annotated_image": f"data:image/png;base64,{orig_b64}"
            })

    return {"total_files": len(files), "processed": len([r for r in results_payload if r.get("success")]), "results": results_payload}



# ArchaiMap Backend

FastAPI backend for the ArchaiMap archaeological mapping platform.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create models directory and add trained weights:
```bash
mkdir -p models/weights
# Copy your trained models to models/weights/
```

3. Run the server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Model Paths

Set environment variables to customize model paths:
- `VEGETATION_MODEL_PATH` - Path to YOLOv8 vegetation model
- `SOIL_DETECTION_MODEL_PATH` - Path to YOLOv11 soil detection model
- `SOIL_CLASSIFIER_MODEL_PATH` - Path to TensorFlow soil classifier

## Endpoints

- `/api/sites/` - Archaeological sites
- `/api/uploads/vegetation` - Vegetation segmentation
- `/api/uploads/soil-detection` - Soil anomaly detection
- `/api/uploads/soil-classify` - Soil classification


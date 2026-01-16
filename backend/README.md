# ArchaiMap Backend

FastAPI backend for the ArchaiMap archaeological mapping platform. Provides REST API endpoints for AI-powered image analysis using trained YOLOv8 and YOLOv11 models.

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Running the Server](#-running-the-server)
- [API Endpoints](#-api-endpoints)
- [Model Configuration](#-model-configuration)
- [Environment Variables](#-environment-variables)

## Overview

The ArchaiMap backend is built with **FastAPI** and provides:

✅ **Vegetation Segmentation** - Detect vegetation patterns in aerial imagery using YOLOv8
✅ **Soil Detection & Classification** - Classify soil types using YOLOv11 with 4 soil categories
✅ **Archaeological Site Data** - Integration with Wikipedia API for site information
✅ **Image Processing** - Support for multiple image formats with real-time processing
✅ **RESTful API** - Clean, well-documented endpoints with automatic Swagger UI
✅ **CORS Support** - Enable cross-origin requests for frontend integration
✅ **Error Handling** - Comprehensive error messages and validation

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **FastAPI** | REST API framework |
| **Uvicorn** | ASGI application server |
| **Python 3.12** | Programming language |
| **PyTorch** | Deep learning framework |
| **Ultralytics** | YOLO model implementations |
| **Pillow (PIL)** | Image processing |
| **NumPy** | Numerical computing |
| **Python-dotenv** | Environment variable management |
| **CORS Middleware** | Cross-origin resource sharing |

## 📁 Project Structure

```
backend/
├── main.py                          # FastAPI application entry point
├── routers/                         # API route handlers
│   ├── VegetationSegmentationYolov8.py    # YOLOv8 vegetation segmentation
│   ├── soil_classifier.py                 # YOLOv11 soil detection & classification
│   └── __init__.py
├── models/
│   └── weights/                     # Trained model weights
│       ├── vegetation_best.pt             # YOLOv8 model (~100MB)
│       └── soil_detection_best.pt        # YOLOv11 model (~150MB)
├── api/
│   └── (optional) Additional API modules
├── requirements.txt                 # Python dependencies
├── requirements-minimal.txt         # Minimal dependencies
├── .env.example                     # Environment variables template
├── README.md                        # This file
└── Datasets/
    └── dataset.txt                  # Dataset information
```

## 📦 Setup Instructions

### 1. Create Virtual Environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Or for minimal installation** (without ML dependencies):
```bash
pip install -r requirements-minimal.txt
```

### 3. Create Model Weights Directory

```bash
mkdir -p models/weights
```

Place your trained models in this directory:
```
backend/models/weights/
├── vegetation_best.pt        (YOLOv8 model)
└── soil_detection_best.pt    (YOLOv11 model)
```

### 4. Set Up Environment Variables (Optional)

Create `.env` file in backend directory:
```env
# Model paths (optional - defaults to models/weights/)
VEGETATION_MODEL_PATH=models/weights/vegetation_best.pt
SOIL_DETECTION_MODEL_PATH=models/weights/soil_detection_best.pt

# Server configuration (optional)
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
LOG_LEVEL=info
```

Or copy from template:
```bash
cp .env.example .env
```

## 🚀 Running the Server

### Development Mode

```bash
python main.py
```

The server will start at: **http://localhost:8000**

### With Auto-reload (Development)

```bash
uvicorn main:app --reload
```

### With Custom Port

```bash
uvicorn main:app --port 8001
```

### Production Mode (Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Interactive Testing in Swagger UI

1. Go to http://localhost:8000/docs
2. Expand the endpoint you want to test
3. Click "Try it out"
4. Upload image files
5. Click "Execute" to see the response

## 📡 API Endpoints

### Health Check

**Endpoint**: `GET /health`

Returns server health status.

```json
{
  "status": "healthy"
}
```

### Vegetation Segmentation

**Endpoint**: `POST /api/vegetation/`

Detects vegetation patterns and segments in aerial imagery.

**Request**:
- Content-Type: multipart/form-data
- Field: `files` (multiple image files)

**Response**:
```json
{
  "total_files": 1,
  "processed": 1,
  "results": [
    {
      "filename": "aerial_image.jpg",
      "success": true,
      "segment_count": 5,
      "original_image": "data:image/png;base64,...",
      "annotated_image": "data:image/png;base64,..."
    }
  ]
}
```

**Parameters**:
- `confidence`: Detection confidence threshold (default: 0.25)
- `imgsz`: Input image size (default: 640)

### Soil Classification

**Endpoint**: `POST /api/soil-classify/`

Classifies soil type and detects soil anomalies.

**Request**:
- Content-Type: multipart/form-data
- Field: `files` (multiple image files)

**Response**:
```json
{
  "total_files": 1,
  "processed": 1,
  "results": [
    {
      "filename": "soil_image.jpg",
      "success": true,
      "soil_type": "Red Soil",
      "confidence": 0.87,
      "segment_count": 2,
      "segments": [
        {
          "class": 3,
          "class_name": "Red Soil",
          "confidence": 0.87
        }
      ],
      "original_image": "data:image/png;base64,...",
      "annotated_image": "data:image/png;base64,..."
    }
  ]
}
```

**Soil Classes**:
- 0: Alluvial Soil
- 1: Black Soil
- 2: Clay Soil
- 3: Red Soil

### Model Status

**Endpoint**: `GET /api/vegetation/status`

Check if vegetation model is loaded.

**Response**:
```json
{
  "model_loaded": true,
  "model_path": "C:\\path\\to\\models\\weights\\vegetation_best.pt",
  "load_error": null
}
```

## 🤖 Model Configuration

### YOLOv8 Vegetation Segmentation

**File**: `routers/VegetationSegmentationYolov8.py`

```python
# Model parameters
TARGET_SIZE = (640, 640)
CONFIDENCE_THRESHOLD = 0.25

# Model loading
model = YOLO("models/weights/vegetation_best.pt")

# Inference
results = model.predict(image, conf=0.25, imgsz=640)
```

### YOLOv11 Soil Detection

**File**: `routers/soil_classifier.py`

```python
# Model parameters
TARGET_SIZE = (244, 244)
SOIL_CLASSES = ["Alluvial Soil", "Black Soil", "Clay Soil", "Red Soil"]
CONFIDENCE_THRESHOLD = 0.25

# Model loading
model = YOLO("models/weights/soil_detection_best.pt")

# Inference
results = model.predict(image, conf=0.25, imgsz=640)
```

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VEGETATION_MODEL_PATH` | `models/weights/vegetation_best.pt` | Path to YOLOv8 model |
| `SOIL_DETECTION_MODEL_PATH` | `models/weights/soil_detection_best.pt` | Path to YOLOv11 model |
| `BACKEND_PORT` | `8000` | Server port |
| `BACKEND_HOST` | `0.0.0.0` | Server host |
| `LOG_LEVEL` | `info` | Logging level |
| `TF_CPP_MIN_LOG_LEVEL` | `3` | TensorFlow logging level |

## 🔒 CORS Configuration

By default, CORS is enabled for all origins. For production, update in `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com", "https://app.yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Use different port
python -m uvicorn main:app --port 8001
```

### Model Not Loading

1. Check model file exists:
   ```bash
   ls -la models/weights/
   ```

2. Check environment variables:
   ```bash
   echo $VEGETATION_MODEL_PATH
   echo $SOIL_DETECTION_MODEL_PATH
   ```

3. Check file permissions:
   ```bash
   chmod 644 models/weights/*.pt
   ```

### Memory Issues

- Reduce batch size
- Use smaller input images
- Enable GPU acceleration (if available)
- Close other applications

### Slow Inference

- Warm up model with test image
- Use GPU if available
- Check system resources

## 📊 Performance Benchmarks

| Model | Task | Input Size | Inference Time | Memory |
|-------|------|-----------|-----------------|--------|
| YOLOv8 | Vegetation | 640x640 | ~50-150ms | 2-3GB |
| YOLOv11 | Soil | 244x244 | ~30-100ms | 2-3GB |

*Benchmarks on CPU; GPU performance varies by hardware*

## 🚀 Production Deployment

### Using Gunicorn + Uvicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t archaimap-backend .
docker run -p 8000:8000 archaimap-backend
```

### Environment Variables for Production

```env
LOG_LEVEL=warning
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Ultralytics YOLO**: https://github.com/ultralytics/ultralytics
- **PyTorch Documentation**: https://pytorch.org/docs/
- **Uvicorn Documentation**: https://www.uvicorn.org/

## 📝 Notes

- Models are loaded on first request (lazy loading)
- Images are processed in memory without saving to disk
- Maximum file size depends on available RAM
- Supports batch processing (multiple files per request)
- All responses include base64-encoded images for frontend display

## 🤝 Contributing

For bug reports or feature requests, please create an issue in the main repository.

## 📄 License

This project is for archaeological research and educational purposes.


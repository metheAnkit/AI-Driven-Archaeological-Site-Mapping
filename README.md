# ArchaiMap - Archaeological Mapping Platform

AI-powered archaeological site detection and mapping platform using advanced computer vision models for vegetation segmentation, soil detection, and soil classification. Built with modern web technologies and trained deep learning models.

## 📋 Table of Contents
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [AI Models](#-ai-models)
- [Configuration](#-configuration)

## ✨ Features

- **🌾 Vegetation Segmentation**: AI-powered detection of vegetation patterns and crop marks using YOLOv8
- **🌍 Soil Detection**: Advanced soil anomaly detection using trained YOLOv11 model with segmentation masks
- **🧪 Soil Classification**: Classify soil into 4 types (Alluvial, Black, Clay, Red) with confidence scores
- **🗺️ Archaeological Site Search**: Search and explore archaeological sites using Wikipedia API
- **📱 Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **🎨 Modern UI**: Professional hero cards with gradient effects and smooth animations
- **🖼️ Real-time Image Processing**: Drag-and-drop image upload with instant AI analysis
- **📊 Detailed Results**: Annotated images with detection overlays and confidence metrics
- **🔐 Full-Stack Security**: CORS enabled, proper error handling, and data validation

## 🏗️ Project Structure

```
ArchaiMap/
├── backend/                          # FastAPI Python backend
│   ├── main.py                      # FastAPI application entry point
│   ├── routers/                     # API route handlers
│   │   ├── VegetationSegmentationYolov8.py    # YOLOv8 vegetation model
│   │   ├── soil_classifier.py                 # YOLOv11 soil detection model
│   │   └── SoilDetectionYolov11.py           # Alternative soil detection
│   ├── models/
│   │   └── weights/                 # Trained model weights
│   │       ├── vegetation_best.pt             # YOLOv8 model
│   │       └── soil_detection_best.pt        # YOLOv11 model
│   ├── requirements.txt              # Python dependencies
│   ├── requirements-minimal.txt      # Minimal dependencies
│   ├── .env.example                  # Environment variables template
│   └── README.md                     # Backend documentation
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── Navbar.jsx           # Navigation bar with active state
│   │   │   ├── Footer.jsx           # Footer with links
│   │   │   └── Icons.jsx            # SVG icon components
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Upload.jsx           # Image upload & processing
│   │   │   ├── Explore.jsx          # Archaeological site search
│   │   │   ├── About.jsx            # About page
│   │   │   ├── Privacy.jsx          # Privacy policy
│   │   │   └── Terms.jsx            # Terms of service
│   │   ├── services/
│   │   │   └── api.js               # Axios HTTP client
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global Tailwind styles
│   ├── public/                       # Static assets
│   ├── package.json                  # NPM dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.cjs            # PostCSS configuration
│   └── .env.local                    # Frontend environment variables
│
├── Soildetection.v2i.yolov11/       # YOLOv11 soil dataset
│   ├── data.yaml                    # Dataset configuration
│   ├── train/                       # Training images
│   ├── val/                         # Validation images
│   └── test/                        # Test images
│
├── SoilDetectionYolov11.ipynb       # Soil detection training notebook
├── VegetationSegmentationYolov8.ipynb # Vegetation segmentation notebook
├── ENVIRONMENT_SETUP.md             # Environment setup guide
├── QUICKSTART.md                    # Quick start guide
└── README.md                        # This file
```

## �️ Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.12 | Core language |
| **FastAPI** | Latest | REST API framework |
| **Uvicorn** | Latest | ASGI web server |
| **PyTorch** | Latest | Deep learning framework |
| **Ultralytics** | Latest | YOLO model implementations |
| **Pillow (PIL)** | Latest | Image processing |
| **NumPy** | Latest | Numerical computing |
| **OpenCV** | Latest | Computer vision operations |
| **Python-dotenv** | Latest | Environment variable management |

### AI/ML Models
| Model | Framework | Task | Training Data |
|-------|-----------|------|---------------|
| **YOLOv8** | PyTorch/Ultralytics | Vegetation Segmentation | Aerial/satellite imagery |
| **YOLOv11** | PyTorch/Ultralytics | Soil Detection & Classification | Soil images (4 classes) |
| **Classes** | - | Soil Types | Alluvial, Black, Clay, Red |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **React Router** | 6.20.0 | Client-side routing |
| **Vite** | 7.2.4 | Build tool & dev server |
| **Axios** | Latest | HTTP client |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS |
| **PostCSS** | Latest | CSS processing |
| **JavaScript (ES6+)** | - | Programming language |

### Third-Party APIs & Services
| Service | Purpose | Status |
|---------|---------|--------|
| **Wikipedia API** | Fetch archaeological site information | ✅ Integrated |
| **Wikipedia Pageimages** | Get site-specific images | ✅ Integrated |
| **Google Custom Search** | Site search capability (optional) | Configured |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **npm** | JavaScript package management |
| **pip** | Python package management |
| **Jupyter Notebook** | Model training & experimentation |
| **VS Code** | Code editor |

## 📋 Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **RAM**: 8GB minimum (16GB recommended for ML)
- **Storage**: 5GB free space for models and datasets

### Software Requirements
- **Python**: 3.10 or higher (3.12 recommended)
- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher
- **Git**: Latest version

### Recommended Setup
```bash
# Check versions
python --version      # Should be 3.10+
node --version       # Should be 16+
npm --version        # Should be 8+
git --version        # Any version
```

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ArchaiMap
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### Install Python Dependencies
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

#### Set Up Model Weights
```bash
# Create models directory
mkdir -p models/weights

# Copy your trained model weights:
# - vegetation_best.pt       → models/weights/
# - soil_detection_best.pt   → models/weights/
```

#### Environment Variables (Optional)
Create `backend/.env`:
```env
VEGETATION_MODEL_PATH=models/weights/vegetation_best.pt
SOIL_DETECTION_MODEL_PATH=models/weights/soil_detection_best.pt
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Frontend Environment Variables
Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
REACT_APP_SEARCH_ENGINE_ID=your_search_engine_id_here
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
python main.py
```

The API will start at: **http://localhost:8000**

- Swagger UI Docs: http://localhost:8000/docs
- ReDoc Docs: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

### Start Frontend Development Server

In a new terminal:
```bash
cd frontend
npm run dev
```

The frontend will be available at: **http://localhost:5174** (or http://localhost:5173)

### Access the Application
Open your browser and navigate to: **http://localhost:5174**

## 📡 API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health status check

### Vegetation Segmentation
- **Endpoint**: `POST /api/vegetation/`
- **Purpose**: Detect vegetation patterns and segmentation
- **Input**: Multiple image files
- **Output**: Annotated images with segment count

**Example Response**:
```json
{
  "total_files": 1,
  "processed": 1,
  "results": [{
    "filename": "image.jpg",
    "success": true,
    "segment_count": 5,
    "annotated_image": "data:image/png;base64,..."
  }]
}
```

### Soil Classification
- **Endpoint**: `POST /api/soil-classify/`
- **Purpose**: Classify soil type and detect anomalies
- **Input**: Multiple image files
- **Output**: Soil type, confidence, and annotated images

**Example Response**:
```json
{
  "total_files": 1,
  "processed": 1,
  "results": [{
    "filename": "soil.jpg",
    "success": true,
    "soil_type": "Red Soil",
    "confidence": 0.87,
    "annotated_image": "data:image/png;base64,..."
  }]
}
```

### Archaeological Sites Search
- `GET /api/sites/` - Get all sites
- `GET /api/sites/{site_id}` - Get specific site
- Uses Wikipedia API for site data

## 🤖 AI Models Overview

### 1. Vegetation Segmentation (YOLOv8)
```
Model: YOLOv8 (Detection)
Task: Vegetation & crop mark segmentation
Input Size: Auto-scaled to 640px
Confidence: 0.25
Output: Bounding boxes with class predictions
```

**Features**:
- Detects vegetation patterns in aerial imagery
- Returns segment count and coordinates
- Provides annotated images with overlays
- Fast inference (~50-200ms per image)

### 2. Soil Detection (YOLOv11)
```
Model: YOLOv11 (Detection & Segmentation)
Task: Soil type detection & classification
Classes: 4 soil types (Alluvial, Black, Clay, Red)
Input Size: 244x244px
Confidence: 0.25
Output: Class predictions with masks
```

**Classes**:
- 0: Alluvial Soil
- 1: Black Soil
- 2: Clay Soil
- 3: Red Soil

**Features**:
- Trained on annotated soil images
- Returns soil type with confidence score
- Provides segmentation masks
- Annotated images with class labels

## ⚙️ Configuration

### Backend Configuration

Edit `backend/main.py`:
```python
# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Server Configuration
uvicorn.run(
    app,
    host="0.0.0.0",  # Change to "127.0.0.1" for local only
    port=8000,
    log_level="info"
)
```

### Frontend Configuration

Edit `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true
  }
})
```

Edit `frontend/tailwind.config.js`:
```javascript
// Customize color palette, spacing, etc.
```

## 📊 Supported Image Formats

- **JPG** / **JPEG**: .jpg, .jpeg
- **PNG**: .png
- **WebP**: .webp

## 🔍 Troubleshooting

### Backend Issues

**Port Already in Use**:
```bash
# Change port in main.py or use environment variable
python -m uvicorn main:app --port 8001
```

**Model Not Found**:
```bash
# Ensure models exist in backend/models/weights/
# Check paths in environment variables or source code
```

**Memory Issues**:
```bash
# Reduce batch size or use GPU
# Ensure 8GB+ RAM or use inference-only mode
```

### Frontend Issues

**Port Conflict**:
```bash
npm run dev -- --port 3000
```

**Module Not Found**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**API Connection Failed**:
- Ensure backend is running on localhost:8000
- Check VITE_API_URL in .env.local
- Check CORS settings in backend/main.py

## 📝 Development Notes

### Adding New Models

1. Train model using Jupyter notebooks provided
2. Save weights to `backend/models/weights/`
3. Create router file in `backend/routers/`
4. Include router in `main.py`
5. Update API documentation

### Modifying Frontend

1. Edit components in `src/components/`
2. Add pages in `src/pages/`
3. Update `src/App.jsx` for routing
4. Rebuild with `npm run build`

## 🚢 Deployment

### Production Backend
```bash
# Use Gunicorn for production
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Production Frontend
```bash
# Build optimized bundle
npm run build

# Deploy dist/ folder to static hosting
```

## 📚 Additional Resources

- **ENVIRONMENT_SETUP.md** - Detailed environment setup guide
- **QUICKSTART.md** - Quick start guide
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Ultralytics YOLO**: https://github.com/ultralytics/ultralytics


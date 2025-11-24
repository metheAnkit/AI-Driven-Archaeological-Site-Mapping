# ArchaiMap - Archaeological Mapping Platform

AI-powered archaeological site detection and mapping platform using computer vision models for vegetation segmentation, soil detection, and soil classification.

## 🏗️ Project Structure

```
ArchaiMap/
├── backend/                 # FastAPI backend
│   ├── api/                # API endpoints
│   │   ├── sites.py       # Archaeological sites API
│   │   └── uploads.py     # Image upload & AI processing endpoints
│   ├── models/             # AI model integration
│   │   ├── vegetation_segmentation.py  # YOLOv8 model
│   │   ├── soil_detection.py           # YOLOv11 model
│   │   └── soil_classifier.py           # TensorFlow/Keras model
│   ├── main.py            # FastAPI application entry point
│   └── requirements.txt   # Python dependencies
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx       # Homepage with hero card
│   │   │   ├── Upload.jsx     # Image upload page (rounded card)
│   │   │   ├── Explore.jsx    # Site exploration page (rounded card)
│   │   │   ├── About.jsx      # About page (rounded card)
│   │   │   ├── Privacy.jsx    # Privacy Policy page
│   │   │   └── Terms.jsx      # Terms of Use page
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
│
├── models/                 # Model weights directory (create this)
│   └── weights/           # Place your trained model weights here
│       ├── vegetation_best.pt      # YOLOv8 vegetation model
│       ├── soil_detection_best.pt  # YOLOv11 soil detection model
│       └── soil_classifier.h5     # TensorFlow soil classifier
│
├── vegetationsegmentationyolov8.py  # Original training script
├── soildetectionyolov11.py         # Original training script
└── soil_classifier.py              # Original training script
```

## 🚀 Getting Started

### Recent UI/UX Changes

- All main pages (Home, Upload, Explore, About) now use a modern rounded orange hero card for visual consistency.
- Added a responsive footer with Privacy Policy and Terms of Use links (see `Footer.jsx`).
- Privacy Policy and Terms of Use are now full pages (`Privacy.jsx`, `Terms.jsx`).
- Improved vertical stacking for result images in Upload page for mobile-friendliness.
- All pages are fully responsive and use the custom orange palette.

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended: Python 3.12):
```bash
python -m venv tfenv
# On Windows:
tfenv\Scripts\activate
# On Mac/Linux:
source tfenv/bin/activate
```

3. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

4. Create the models directory and add your trained weights:
```bash
mkdir -p models/weights
# Copy your trained model files to models/weights/
# - vegetation_best.pt (YOLOv8 model)
# - soil_detection_best.pt (YOLOv11 model)
# - soil_classifier.h5 (TensorFlow model)
```

5. Update model paths in the model files if needed (or set environment variables):
   - `VEGETATION_MODEL_PATH`
   - `SOIL_DETECTION_MODEL_PATH`
   - `SOIL_CLASSIFIER_MODEL_PATH`

6. Run the backend server:
```bash
# Always use the tfenv Python interpreter:
python main.py
# Or explicitly:
C:\Users\...\backend\tfenv\Scripts\python.exe main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port)

## 📡 API Endpoints

### Sites
- `GET /api/sites/` - Get all archaeological sites (with optional filters)
- `GET /api/sites/{site_id}` - Get specific site by ID
- `GET /api/sites/stats/summary` - Get site statistics

### Image Uploads
- `POST /api/uploads/vegetation` - Upload images for vegetation segmentation
- `POST /api/uploads/soil-detection` - Upload images for soil anomaly detection
- `POST /api/uploads/soil-classify` - Upload images for soil classification
- `POST /api/uploads/combined` - Upload images for combined analysis

## 🤖 AI Models

### 1. Vegetation Segmentation (YOLOv8)
- **Model**: YOLOv8 (detection task)
- **Purpose**: Detects crop marks and vegetation anomalies
- **Input**: Aerial/satellite imagery
- **Output**: Bounding boxes and annotated images

### 2. Soil Detection (YOLOv11)
- **Model**: YOLOv11 (segmentation task)
- **Purpose**: Detects soil anomalies and variations
- **Input**: Images (auto-resized to 244x244px)
- **Output**: Segmentation masks and annotated images

### 3. Soil Classification (TensorFlow/Keras)
- **Model**: Custom CNN
- **Purpose**: Classifies soil into 4 types: Alluvial, Black, Clay, Red
- **Input**: Images (resized to 224x224px)
- **Output**: Soil type predictions with confidence scores

## 🎨 Features

- **Modern Hero Cards**: All main pages use a rounded orange hero card for a unified look
- **Responsive Footer**: Includes Privacy Policy and Terms of Use links
- **Interactive Map**: Leaflet.js integration showing archaeological sites worldwide
- **Image Upload**: Support for multiple image uploads with drag-and-drop
- **AI Processing**: Real-time image analysis with visualization
- **Site Exploration**: Search and filter archaeological sites
- **Responsive Design**: Modern UI with Tailwind CSS

## 🔧 Configuration

### Environment Variables

You can set these environment variables to customize model paths:

```bash
export VEGETATION_MODEL_PATH="models/weights/vegetation_best.pt"
export SOIL_DETECTION_MODEL_PATH="models/weights/soil_detection_best.pt"
export SOIL_CLASSIFIER_MODEL_PATH="models/weights/soil_classifier.h5"
```

### CORS Configuration

Update CORS origins in `backend/main.py` if deploying to different domains:

```python
allow_origins=["http://localhost:3000", "https://yourdomain.com"]
```


## 📝 Notes

- The models will use default/pretrained weights if trained weights are not found
- Mock predictions are provided for the soil classifier if TensorFlow model is unavailable
- All image processing handles JPG, PNG, and WebP formats
- Soil detection automatically resizes images to 244x244px as specified

## 🛠️ Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## 📄 License

This project is for archaeological research and educational purposes.


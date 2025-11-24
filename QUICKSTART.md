# ArchaiMap Quick Start Guide

## 🚀 Quick Setup

### Backend (FastAPI)

**Windows:**
```bash
start_backend.bat
```

**Linux/Mac:**
```bash
chmod +x start_backend.sh
./start_backend.sh
```

**Manual:**
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend (React)

**Windows:**
```bash
start_frontend.bat
```

**Linux/Mac:**
```bash
chmod +x start_frontend.sh
./start_frontend.sh
```

**Manual:**
```bash
cd frontend
npm install
npm run dev
```

## 📍 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📦 Adding Your Trained Models

1. Create the models directory:
```bash
mkdir -p models/weights
```

2. Copy your trained model files:
   - `vegetation_best.pt` → `models/weights/vegetation_best.pt`
   - `soil_detection_best.pt` → `models/weights/soil_detection_best.pt`
   - `soil_classifier.h5` → `models/weights/soil_classifier.h5`

3. The app will automatically use these models. If not found, it will use default/pretrained models or mock predictions.

## ✅ Verify Setup

1. Backend is running: Check http://localhost:8000/api/health
2. Frontend is running: Check http://localhost:3000
3. Upload an image: Go to http://localhost:3000/upload

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 already in use**: Change port in `backend/main.py`
- **Model not found**: Models will use defaults - ensure weights are in `models/weights/`
- **Import errors**: Make sure virtual environment is activated and dependencies are installed

### Frontend Issues
- **Port 3000 already in use**: Change port in `frontend/vite.config.js`
- **Dependencies error**: Delete `node_modules` and run `npm install` again
- **CORS errors**: Make sure backend is running and CORS settings in `backend/main.py` are correct

## 📝 Notes

- First run may take time to download default models
- Soil classifier uses mock predictions if TensorFlow model is not available
- All image formats: JPG, PNG, WebP are supported


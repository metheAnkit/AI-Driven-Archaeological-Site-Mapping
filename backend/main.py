from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.VegetationSegmentationYolov8 import router as vegetation_router
from routers.SoilDetectionYolov11 import router as soil_detection_router
from routers.soil_classifier import router as soil_classifier_router
import uvicorn

app = FastAPI(title="ArchaiMap API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main API endpoints
app.include_router(vegetation_router, prefix="/api/vegetation", tags=["Vegetation"])
app.include_router(soil_detection_router, prefix="/api/soil-detection", tags=["Soil Detection"])
app.include_router(soil_classifier_router, prefix="/api/soil-classify", tags=["Soil Classifier"])

# Render-style predict aliases
app.include_router(vegetation_router, prefix="/predict/vegetation", tags=["Vegetation Predict"])
app.include_router(soil_detection_router, prefix="/predict/soil", tags=["Soil Predict"])

@app.get("/")
def root():
    return {"name": "ArchaiMap API", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


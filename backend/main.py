# ArchaiMap Backend API
import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import routers
from routers.VegetationSegmentationYolov8 import router as veg_router
from routers.soil_classifier import router as soil_router

# Create app instance
app = FastAPI(title="ArchaiMap API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define basic routes
@app.get("/")
def root():
    return {"name": "ArchaiMap API", "status": "ok", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Include routers
app.include_router(veg_router, prefix="/api/vegetation", tags=["vegetation"])
app.include_router(soil_router, prefix="/api/soil-classify", tags=["soil"])

# Start server
if __name__ == "__main__":
    print("Starting FastAPI backend on http://0.0.0.0:8000", flush=True)
    sys.stdout.flush()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

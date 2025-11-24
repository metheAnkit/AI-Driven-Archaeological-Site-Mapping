"""
API endpoints for image uploads and AI processing
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
from datetime import datetime

from models.vegetation_segmentation import process_vegetation_segmentation
from models.soil_detection import process_soil_detection
from models.soil_classifier import classify_soil

router = APIRouter()

# Supported image formats
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def validate_image_file(file: UploadFile) -> bool:
    """Validate that the uploaded file is an image"""
    if not file.filename:
        return False
    
    ext = os.path.splitext(file.filename.lower())[1]
    return ext in ALLOWED_EXTENSIONS

@router.post("/vegetation")
async def upload_vegetation_image(files: List[UploadFile] = File(...)):
    """
    Upload images for vegetation segmentation analysis
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    
    for file in files:
        if not validate_image_file(file):
            results.append({
                "filename": file.filename,
                "success": False,
                "error": "Invalid file type. Supported: JPG, PNG, WebP"
            })
            continue
        
        try:
            # Read image bytes
            image_bytes = await file.read()
            
            # Process with vegetation segmentation model
            result = process_vegetation_segmentation(image_bytes)
            result["filename"] = file.filename
            result["uploaded_at"] = datetime.now().isoformat()
            
            results.append(result)
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total_files": len(files),
        "processed": len([r for r in results if r.get("success", False)]),
        "results": results
    }

@router.post("/soil-detection")
async def upload_soil_detection_image(files: List[UploadFile] = File(...)):
    """
    Upload images for soil anomaly detection
    Images are automatically resized to 244x244px
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    
    for file in files:
        if not validate_image_file(file):
            results.append({
                "filename": file.filename,
                "success": False,
                "error": "Invalid file type. Supported: JPG, PNG, WebP"
            })
            continue
        
        try:
            # Read image bytes
            image_bytes = await file.read()
            
            # Process with soil detection model
            result = process_soil_detection(image_bytes)
            result["filename"] = file.filename
            result["uploaded_at"] = datetime.now().isoformat()
            
            results.append(result)
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total_files": len(files),
        "processed": len([r for r in results if r.get("success", False)]),
        "results": results
    }

@router.post("/soil-classify")
async def upload_soil_classify_image(files: List[UploadFile] = File(...)):
    """
    Upload images for soil type classification
    Classifies into: Alluvial, Black, Clay, Red
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    
    for file in files:
        if not validate_image_file(file):
            results.append({
                "filename": file.filename,
                "success": False,
                "error": "Invalid file type. Supported: JPG, PNG, WebP"
            })
            continue
        
        try:
            # Read image bytes
            image_bytes = await file.read()
            
            # Process with soil classifier model
            result = classify_soil(image_bytes)
            result["filename"] = file.filename
            result["uploaded_at"] = datetime.now().isoformat()
            
            results.append(result)
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total_files": len(files),
        "processed": len([r for r in results if r.get("success", False)]),
        "results": results
    }

@router.post("/combined")
async def upload_combined_analysis(files: List[UploadFile] = File(...)):
    """
    Upload images for combined analysis (all three models)
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    
    for file in files:
        if not validate_image_file(file):
            results.append({
                "filename": file.filename,
                "success": False,
                "error": "Invalid file type. Supported: JPG, PNG, WebP"
            })
            continue
        
        try:
            # Read image bytes once
            image_bytes = await file.read()
            
            # Run all three analyses
            vegetation_result = process_vegetation_segmentation(image_bytes)
            soil_detection_result = process_soil_detection(image_bytes)
            soil_classify_result = classify_soil(image_bytes)
            
            results.append({
                "filename": file.filename,
                "uploaded_at": datetime.now().isoformat(),
                "vegetation_analysis": vegetation_result,
                "soil_detection_analysis": soil_detection_result,
                "soil_classification": soil_classify_result,
                "success": all([
                    vegetation_result.get("success", False),
                    soil_detection_result.get("success", False),
                    soil_classify_result.get("success", False)
                ])
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total_files": len(files),
        "processed": len([r for r in results if r.get("success", False)]),
        "results": results
    }


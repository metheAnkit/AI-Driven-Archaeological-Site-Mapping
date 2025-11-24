"""
API endpoints for archaeological sites
"""
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter()

# Mock archaeological sites data
# In production, this would come from a database
ARCHAEOLOGICAL_SITES = [
    {
        "id": 1,
        "name": "Barhut",
        "description": "Buddhist stupa with sculptures",
        "latitude": 24.0994,
        "longitude": 80.7564,
        "category": "Classical",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 2,
        "name": "Uxmal",
        "description": "Ancient Maya city",
        "latitude": 20.3597,
        "longitude": -89.7714,
        "category": "Classical",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1544966503-7cc75cbd3b89?w=400"
    },
    {
        "id": 3,
        "name": "Easter Island Moai",
        "description": "Monolithic statues",
        "latitude": -27.1127,
        "longitude": -109.3497,
        "category": "Medieval",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 4,
        "name": "Chaco Canyon",
        "description": "Ancestral Puebloan center",
        "latitude": 36.06,
        "longitude": -107.96,
        "category": "Medieval",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 5,
        "name": "Sannati",
        "description": "Buddhist site with stupas",
        "latitude": 17.06,
        "longitude": 77.08,
        "category": "Classical",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 6,
        "name": "Olduvai Gorge",
        "description": "Cradle of mankind",
        "latitude": -2.99,
        "longitude": 35.35,
        "category": "Paleolithic",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 7,
        "name": "Nagarjunakonda",
        "description": "Buddhist archaeological site",
        "latitude": 16.53,
        "longitude": 79.24,
        "category": "Classical",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 8,
        "name": "Dholavira",
        "description": "Harappan archaeological site",
        "latitude": 23.8886,
        "longitude": 70.2167,
        "category": "Classical",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 9,
        "name": "Petra",
        "description": "Nabatean rock-cut city",
        "latitude": 30.3285,
        "longitude": 35.4444,
        "category": "Classical",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
        "id": 10,
        "name": "Machu Picchu",
        "description": "Inca citadel",
        "latitude": -13.1631,
        "longitude": -72.5450,
        "category": "Medieval",
        "status": "active",
        "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    }
]

@router.get("/")
async def get_all_sites(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name or location")
):
    """Get all archaeological sites with optional filters"""
    sites = ARCHAEOLOGICAL_SITES.copy()
    
    # Apply filters
    if category:
        sites = [s for s in sites if s["category"].lower() == category.lower()]
    
    if status:
        sites = [s for s in sites if s["status"].lower() == status.lower()]
    
    if search:
        search_lower = search.lower()
        sites = [
            s for s in sites
            if search_lower in s["name"].lower() or 
               search_lower in s["description"].lower()
        ]
    
    return {
        "total": len(sites),
        "sites": sites
    }

@router.get("/{site_id}")
async def get_site(site_id: int):
    """Get a specific site by ID"""
    site = next((s for s in ARCHAEOLOGICAL_SITES if s["id"] == site_id), None)
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site

@router.get("/stats/summary")
async def get_stats():
    """Get summary statistics"""
    total_sites = len(ARCHAEOLOGICAL_SITES)
    categories = {}
    for site in ARCHAEOLOGICAL_SITES:
        cat = site["category"]
        categories[cat] = categories.get(cat, 0) + 1
    
    return {
        "total_sites": total_sites,
        "categories": categories,
        "active_sites": len([s for s in ARCHAEOLOGICAL_SITES if s["status"] == "active"])
    }


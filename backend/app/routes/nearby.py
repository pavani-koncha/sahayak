from fastapi import APIRouter, Query, Depends, HTTPException
from app.services.nearby_service import fetch_nearby_places
from app.models.user import User
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/nearby", tags=["Nearby Help"])

@router.get("")
async def get_nearby_services(
    lat: float = Query(..., description="User latitude"),
    lng: float = Query(..., description="User longitude"),
    category: str = Query("hospitals", description="Category: hospitals, police, fire_stations"),
    radius: int = Query(15000, description="Search radius in meters"),
    current_user: User = Depends(get_current_user)
):
    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        raise HTTPException(status_code=400, detail="Invalid GPS coordinates.")

    allowed_categories = ["hospitals", "police", "fire_stations"]
    normalized_category = category.lower().strip()
    if normalized_category not in allowed_categories:
        normalized_category = "hospitals"

    result = await fetch_nearby_places(
        latitude=lat,
        longitude=lng,
        category=normalized_category,
        radius_meters=radius
    )
    return result

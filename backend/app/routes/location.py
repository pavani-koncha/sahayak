from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationResponse
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/location", tags=["Location"])

@router.post("", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def record_location(
    loc_in: LocationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    loc = Location(
        user_id=current_user.id,
        latitude=loc_in.latitude,
        longitude=loc_in.longitude,
        accuracy=loc_in.accuracy,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc

@router.get("/latest", response_model=Optional[LocationResponse])
def get_latest_location(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    loc = db.query(Location).filter(
        Location.user_id == current_user.id
    ).order_by(Location.timestamp.desc()).first()

    if not loc:
        return None
    return loc

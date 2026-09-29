from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class LocationCreate(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None

class LocationResponse(BaseModel):
    id: int
    user_id: int
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    timestamp: datetime

    class Config:
        from_attributes = True

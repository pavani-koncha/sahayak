from typing import Optional, List
from pydantic import BaseModel

class NearbyPlace(BaseModel):
    id: str
    name: str
    category: str # hospital, police, fire_station
    distance_km: float
    address: Optional[str] = None
    latitude: float
    longitude: float
    phone: Optional[str] = None

class NearbyResponse(BaseModel):
    category: str
    count: int
    user_latitude: float
    user_longitude: float
    places: List[NearbyPlace]

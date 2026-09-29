from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class EmergencyActivate(BaseModel):
    alert_type: str = Field(default="SOS", max_length=50) # SOS, MEDICAL, ACCIDENT, FIRE, UNSAFE
    latitude: float
    longitude: float
    accuracy: Optional[float] = None

class EmergencyAlertResponse(BaseModel):
    id: int
    user_id: int
    alert_type: str
    status: str # ACTIVE, CANCELLED, RESOLVED
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    user_name: Optional[str] = None
    user_phone: Optional[str] = None

    class Config:
        from_attributes = True

class EmergencyStatusUpdate(BaseModel):
    status: str # CANCELLED, RESOLVED

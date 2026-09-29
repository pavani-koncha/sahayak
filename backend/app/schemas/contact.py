from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class EmergencyContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    relationship: str = Field(..., min_length=2, max_length=50)
    is_primary: bool = False

class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, min_length=7, max_length=20)
    relationship: Optional[str] = Field(None, min_length=2, max_length=50)
    is_primary: Optional[bool] = None

class EmergencyContactResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone: str
    relationship: str
    is_primary: bool
    created_at: datetime

    class Config:
        from_attributes = True

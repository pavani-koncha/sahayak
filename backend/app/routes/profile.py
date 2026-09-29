from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserProfileUpdate
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("", response_model=UserResponse)
def update_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.name is not None:
        current_user.name = profile_in.name.strip()
    if profile_in.phone is not None:
        current_user.phone = profile_in.phone.strip()
    if profile_in.blood_group is not None:
        current_user.blood_group = profile_in.blood_group.strip().upper()
    if profile_in.medical_information is not None:
        current_user.medical_information = profile_in.medical_information.strip()
    if profile_in.address is not None:
        current_user.address = profile_in.address.strip()

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

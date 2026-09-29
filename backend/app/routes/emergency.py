from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.alert import EmergencyAlert
from app.models.location import Location
from app.schemas.alert import EmergencyActivate, EmergencyAlertResponse
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/emergency", tags=["Emergency Alerts"])

def enrich_alert(alert: EmergencyAlert, user: User) -> dict:
    return {
        "id": alert.id,
        "user_id": alert.user_id,
        "alert_type": alert.alert_type,
        "status": alert.status,
        "latitude": alert.latitude,
        "longitude": alert.longitude,
        "accuracy": alert.accuracy,
        "created_at": alert.created_at,
        "resolved_at": alert.resolved_at,
        "user_name": user.name if user else None,
        "user_phone": user.phone if user else None
    }

@router.post("/activate", response_model=EmergencyAlertResponse, status_code=status.HTTP_201_CREATED)
def activate_emergency(
    alert_in: EmergencyActivate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create new emergency alert in database
    alert = EmergencyAlert(
        user_id=current_user.id,
        alert_type=alert_in.alert_type.upper(),
        status="ACTIVE",
        latitude=alert_in.latitude,
        longitude=alert_in.longitude,
        accuracy=alert_in.accuracy,
        created_at=datetime.now(timezone.utc)
    )
    db.add(alert)

    # Also log current location to Locations table
    loc = Location(
        user_id=current_user.id,
        latitude=alert_in.latitude,
        longitude=alert_in.longitude,
        accuracy=alert_in.accuracy,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(loc)

    db.commit()
    db.refresh(alert)
    return enrich_alert(alert, current_user)

@router.get("/active", response_model=Optional[EmergencyAlertResponse])
def get_active_emergency(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(EmergencyAlert).filter(
        EmergencyAlert.user_id == current_user.id,
        EmergencyAlert.status == "ACTIVE"
    ).order_by(EmergencyAlert.created_at.desc()).first()

    if not alert:
        return None
    return enrich_alert(alert, current_user)

@router.post("/{alert_id}/cancel", response_model=EmergencyAlertResponse)
def cancel_emergency(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(EmergencyAlert).filter(
        EmergencyAlert.id == alert_id,
        EmergencyAlert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency alert not found."
        )

    alert.status = "CANCELLED"
    alert.resolved_at = datetime.now(timezone.utc)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return enrich_alert(alert, current_user)

@router.post("/{alert_id}/resolve", response_model=EmergencyAlertResponse)
def resolve_emergency(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(EmergencyAlert).filter(
        EmergencyAlert.id == alert_id,
        EmergencyAlert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency alert not found."
        )

    alert.status = "RESOLVED"
    alert.resolved_at = datetime.now(timezone.utc)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return enrich_alert(alert, current_user)

@router.get("/history", response_model=List[EmergencyAlertResponse])
def get_emergency_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alerts = db.query(EmergencyAlert).filter(
        EmergencyAlert.user_id == current_user.id
    ).order_by(EmergencyAlert.created_at.desc()).all()
    return [enrich_alert(a, current_user) for a in alerts]

@router.get("/{alert_id}", response_model=EmergencyAlertResponse)
def get_emergency_by_id(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(EmergencyAlert).filter(
        EmergencyAlert.id == alert_id,
        EmergencyAlert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency alert not found."
        )
    return enrich_alert(alert, current_user)

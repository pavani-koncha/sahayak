from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.contact import EmergencyContact
from app.schemas.contact import EmergencyContactCreate, EmergencyContactUpdate, EmergencyContactResponse
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/contacts", tags=["Emergency Contacts"])

@router.get("", response_model=List[EmergencyContactResponse])
def get_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contacts = db.query(EmergencyContact).filter(
        EmergencyContact.user_id == current_user.id
    ).order_by(EmergencyContact.is_primary.desc(), EmergencyContact.created_at.desc()).all()
    return contacts

@router.post("", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(
    contact_in: EmergencyContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # If set as primary, unset other contacts as primary
    if contact_in.is_primary:
        db.query(EmergencyContact).filter(
            EmergencyContact.user_id == current_user.id
        ).update({"is_primary": False})
        db.commit()

    contact = EmergencyContact(
        user_id=current_user.id,
        name=contact_in.name.strip(),
        phone=contact_in.phone.strip(),
        relationship=contact_in.relationship.strip(),
        is_primary=contact_in.is_primary
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.put("/{contact_id}", response_model=EmergencyContactResponse)
def update_contact(
    contact_id: int,
    contact_in: EmergencyContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency contact not found."
        )

    if contact_in.is_primary is True:
        # Unset others
        db.query(EmergencyContact).filter(
            EmergencyContact.user_id == current_user.id,
            EmergencyContact.id != contact_id
        ).update({"is_primary": False})

    if contact_in.name is not None:
        contact.name = contact_in.name.strip()
    if contact_in.phone is not None:
        contact.phone = contact_in.phone.strip()
    if contact_in.relationship is not None:
        contact.relationship = contact_in.relationship.strip()
    if contact_in.is_primary is not None:
        contact.is_primary = contact_in.is_primary

    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{contact_id}", status_code=status.HTTP_200_OK)
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.user_id == current_user.id
    ).first()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency contact not found."
        )

    db.delete(contact)
    db.commit()
    return {"message": "Emergency contact deleted successfully.", "id": contact_id}

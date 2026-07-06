from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter(tags=["Contact"])


@router.post("/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(form: ContactCreate, db: Session = Depends(get_db)):
    db.add(
        ContactMessage(
            name=form.name.strip(),
            email=form.email,
            subject=form.subject.strip(),
            message=form.message.strip(),
        )
    )
    db.commit()
    return ContactResponse()

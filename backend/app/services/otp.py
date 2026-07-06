import random
import re
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.config import settings
from app.models.otp import OtpCode


def normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"+91{digits}"
    if len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"
    if len(digits) == 13 and digits.startswith("91"):
        return f"+{digits}"
    raise ValueError("Enter a valid 10-digit mobile number")


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def create_otp(db: Session, phone: str) -> tuple[str, OtpCode]:
    normalized = normalize_phone(phone)
    db.query(OtpCode).filter(
        OtpCode.phone == normalized,
        OtpCode.is_used.is_(False),
    ).update({"is_used": True})

    code = generate_otp()
    otp = OtpCode(
        phone=normalized,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=settings.otp_expire_minutes),
    )
    db.add(otp)
    db.commit()
    db.refresh(otp)
    return normalized, otp


def verify_otp(db: Session, phone: str, code: str) -> bool:
    normalized = normalize_phone(phone)
    otp = (
        db.query(OtpCode)
        .filter(
            OtpCode.phone == normalized,
            OtpCode.code == code,
            OtpCode.is_used.is_(False),
            OtpCode.expires_at > datetime.utcnow(),
        )
        .order_by(OtpCode.created_at.desc())
        .first()
    )
    if not otp:
        return False
    otp.is_used = True
    db.commit()
    return True

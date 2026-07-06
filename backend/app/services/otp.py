import secrets
import re
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.models.otp import OtpCode


def normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"+91{digits}"
    if len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"
    raise ValueError("Enter a valid 10-digit mobile number")


def generate_otp() -> str:
    return f"{secrets.randbelow(900000) + 100000:06d}"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _check_send_rate_limit(db: Session, phone: str) -> None:
    since = _utcnow() - timedelta(minutes=1)
    recent_count = (
        db.query(OtpCode)
        .filter(OtpCode.phone == phone, OtpCode.created_at >= since)
        .count()
    )
    if recent_count >= settings.otp_rate_limit_per_minute:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please wait a minute and try again.",
        )


def create_otp(db: Session, phone: str) -> tuple[str, OtpCode]:
    normalized = normalize_phone(phone)
    _check_send_rate_limit(db, normalized)

    db.query(OtpCode).filter(
        OtpCode.phone == normalized,
        OtpCode.is_used.is_(False),
    ).update({"is_used": True})

    code = generate_otp()
    otp = OtpCode(
        phone=normalized,
        code=code,
        expires_at=_utcnow() + timedelta(minutes=settings.otp_expire_minutes),
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
            OtpCode.expires_at > _utcnow(),
        )
        .order_by(OtpCode.created_at.desc())
        .first()
    )
    if not otp:
        return False
    otp.is_used = True
    db.commit()
    return True

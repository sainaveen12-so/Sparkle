from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    SendOtpRequest,
    SendOtpResponse,
    Token,
    UserResponse,
    UserUpdate,
    VerifyOtpRequest,
)
from app.services.otp import create_otp, normalize_phone, verify_otp

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/send-otp", response_model=SendOtpResponse)
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    try:
        phone = normalize_phone(payload.phone)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    is_new_user = db.query(User).filter(User.phone == phone).first() is None
    _, otp = create_otp(db, phone)

    response = SendOtpResponse(
        message="OTP sent successfully",
        phone=phone,
        is_new_user=is_new_user,
    )

    if settings.otp_dev_mode:
        response.dev_otp = otp.code
        print(f"[DEV OTP] {phone} -> {otp.code}")

    return response


@router.post("/verify-otp", response_model=Token)
def verify_otp_login(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    try:
        phone = normalize_phone(payload.phone)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not verify_otp(db, phone, payload.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.phone == phone).first()

    if not user:
        if not payload.full_name:
            raise HTTPException(
                status_code=400,
                detail="Full name is required for new users",
            )
        user = User(
            phone=phone,
            full_name=payload.full_name.strip(),
            email=None,
            hashed_password=None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif payload.full_name and not user.full_name:
        user.full_name = payload.full_name.strip()
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in user_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

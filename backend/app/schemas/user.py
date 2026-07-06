from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class SendOtpRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=15)


class SendOtpResponse(BaseModel):
    message: str
    phone: str
    is_new_user: bool
    dev_otp: Optional[str] = None


class VerifyOtpRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=15)
    otp: str = Field(min_length=6, max_length=6)
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    full_name: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

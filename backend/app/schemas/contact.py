from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=255)
    message: str = Field(min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    message: str = "Thank you! We will get back to you within 24 hours."

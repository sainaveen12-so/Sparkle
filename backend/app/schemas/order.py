from decimal import Decimal
from typing import List, Literal

from pydantic import BaseModel, Field, field_validator

from app.schemas.product import ProductResponse


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1, default=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse

    model_config = {"from_attributes": True}


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class OrderCreate(BaseModel):
    shipping_address: str = Field(min_length=5, max_length=500)
    shipping_city: str = Field(min_length=2, max_length=100)
    shipping_phone: str = Field(min_length=10, max_length=20)
    payment_method: Literal["cod"] = "cod"
    items: List[OrderItemCreate]

    @field_validator("shipping_address", "shipping_city", "shipping_phone")
    @classmethod
    def strip_whitespace(cls, value: str) -> str:
        return value.strip()


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal
    product: ProductResponse

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    status: str
    subtotal: Decimal
    shipping_amount: Decimal
    total_amount: Decimal
    shipping_address: str
    shipping_city: str
    shipping_phone: str
    payment_method: str
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}

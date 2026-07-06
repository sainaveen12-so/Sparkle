from decimal import Decimal
from typing import List

from pydantic import BaseModel, Field

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

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class OrderCreate(BaseModel):
    shipping_address: str
    shipping_city: str
    shipping_phone: str
    payment_method: str = "cod"
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    status: str
    total_amount: Decimal
    shipping_address: str
    shipping_city: str
    shipping_phone: str
    payment_method: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

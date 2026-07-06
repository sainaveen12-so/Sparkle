from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from app.schemas.category import CategoryResponse


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: Decimal
    sale_price: Optional[Decimal] = None
    material: Optional[str] = None
    weight: Optional[str] = None
    stock: int
    image_url: Optional[str] = None
    is_featured: bool
    is_new: bool
    category_id: int
    category: Optional[CategoryResponse] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

from typing import Optional

from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

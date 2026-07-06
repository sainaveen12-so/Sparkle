from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    sale_price = Column(Numeric(10, 2), nullable=True)
    material = Column(String(100), nullable=True)
    weight = Column(String(50), nullable=True)
    stock = Column(Integer, default=0)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    is_new = Column(Boolean, default=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    category = relationship("Category", backref="products")

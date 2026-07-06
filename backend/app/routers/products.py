from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryResponse
from app.schemas.product import ProductResponse

router = APIRouter(tags=["Products"])


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()


@router.get("/products", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    is_new: Optional[bool] = None,
    search: Optional[str] = None,
    sort: str = Query("newest", pattern="^(newest|price_asc|price_desc|name)$"),
    skip: int = 0,
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category))

    if category:
        query = query.join(Category).filter(Category.slug == category)
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
    if is_new is not None:
        query = query.filter(Product.is_new == is_new)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "name":
        query = query.order_by(Product.name.asc())
    else:
        query = query.order_by(Product.created_at.desc())

    return query.offset(skip).limit(limit).all()


@router.get("/products/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.slug == slug)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

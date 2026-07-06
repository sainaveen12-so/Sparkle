from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.auth import get_current_user
from app.config import settings
from app.constants import calculate_shipping
from app.database import get_db
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import (
    CartItemCreate,
    CartItemResponse,
    CartItemUpdate,
    OrderCreate,
    OrderResponse,
)

router = APIRouter(tags=["Cart & Orders"])

ALLOWED_PAYMENT_METHODS = {"cod"}


def _load_cart_item(db: Session, item_id: int) -> CartItem | None:
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.id == item_id)
        .first()
    )


@router.get("/cart", response_model=List[CartItemResponse])
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(CartItem)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )


@router.post("/cart", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == item.product_id,
        )
        .first()
    )

    new_quantity = item.quantity if not existing else existing.quantity + item.quantity
    if product.stock < new_quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    if existing:
        existing.quantity = new_quantity
        db.commit()
        return _load_cart_item(db, existing.id)

    cart_item = CartItem(
        user_id=current_user.id,
        product_id=item.product_id,
        quantity=item.quantity,
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return _load_cart_item(db, cart_item.id)


@router.put("/cart/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_item = (
        db.query(CartItem)
        .options(joinedload(CartItem.product))
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if cart_item.product.stock < item_data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    cart_item.quantity = item_data.quantity
    db.commit()
    return _load_cart_item(db, item_id)


@router.delete("/cart/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(cart_item)
    db.commit()


@router.delete("/cart", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()


@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")
    if order_data.payment_method not in ALLOWED_PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail="Only Cash on Delivery is available right now",
        )

    subtotal = Decimal("0")
    order_items: list[tuple[Product, int, Decimal]] = []

    try:
        for item in order_data.items:
            query = db.query(Product).filter(Product.id == item.product_id)
            if not settings.database_url.startswith("sqlite"):
                query = query.with_for_update()
            product = query.first()
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found",
                )
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}",
                )

            price = product.sale_price or product.price
            subtotal += price * item.quantity
            order_items.append((product, item.quantity, price))

        shipping_amount = calculate_shipping(subtotal)
        total_amount = subtotal + shipping_amount

        order = Order(
            user_id=current_user.id,
            subtotal=subtotal,
            shipping_amount=shipping_amount,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address.strip(),
            shipping_city=order_data.shipping_city.strip(),
            shipping_phone=order_data.shipping_phone.strip(),
            payment_method=order_data.payment_method,
        )
        db.add(order)
        db.flush()

        for product, quantity, price in order_items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=quantity,
                    price=price,
                )
            )
            product.stock -= quantity

        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to place order")

    return (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
            .joinedload(Product.category)
        )
        .filter(Order.id == order.id)
        .first()
    )


@router.get("/orders", response_model=List[OrderResponse])
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
            .joinedload(Product.category)
        )
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

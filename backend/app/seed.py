from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.category import Category
from app.models.product import Product

CATEGORIES = [
    {
        "name": "Necklaces",
        "slug": "necklaces",
        "description": "Elegant necklaces crafted with precision and grace.",
        "image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
    },
    {
        "name": "Earrings",
        "slug": "earrings",
        "description": "Stunning earrings to complement every occasion.",
        "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
    },
    {
        "name": "Rings",
        "slug": "rings",
        "description": "Timeless rings symbolizing love and elegance.",
        "image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
    },
    {
        "name": "Bracelets",
        "slug": "bracelets",
        "description": "Delicate bracelets that adorn your wrist beautifully.",
        "image_url": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    },
    {
        "name": "Bridal Sets",
        "slug": "bridal-sets",
        "description": "Exquisite bridal jewelry sets for your special day.",
        "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    },
]

PRODUCTS = [
    {
        "name": "Golden Radiance Necklace",
        "slug": "golden-radiance-necklace",
        "description": "A stunning 22K gold-plated necklace featuring intricate filigree work with sparkling cubic zirconia stones.",
        "price": 24999,
        "sale_price": 19999,
        "material": "22K Gold Plated",
        "weight": "12g",
        "stock": 15,
        "image_url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
        "is_featured": True,
        "is_new": True,
        "category_slug": "necklaces",
    },
    {
        "name": "Celestial Drop Earrings",
        "slug": "celestial-drop-earrings",
        "description": "Elegant drop earrings with pearl accents and gold finish, perfect for evening wear.",
        "price": 8999,
        "sale_price": None,
        "material": "Sterling Silver, Gold Plated",
        "weight": "6g",
        "stock": 25,
        "image_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
        "is_featured": True,
        "is_new": True,
        "category_slug": "earrings",
    },
    {
        "name": "Eternal Love Ring",
        "slug": "eternal-love-ring",
        "description": "A beautiful solitaire ring with a brilliant-cut stone set in rose gold.",
        "price": 15999,
        "sale_price": 12999,
        "material": "Rose Gold Plated",
        "weight": "4g",
        "stock": 20,
        "image_url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
        "is_featured": True,
        "is_new": False,
        "category_slug": "rings",
    },
    {
        "name": "Lotus Charm Bracelet",
        "slug": "lotus-charm-bracelet",
        "description": "Delicate bracelet with lotus charms and adjustable chain for a perfect fit.",
        "price": 6999,
        "sale_price": None,
        "material": "Gold Plated Brass",
        "weight": "8g",
        "stock": 30,
        "image_url": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
        "is_featured": False,
        "is_new": True,
        "category_slug": "bracelets",
    },
    {
        "name": "Royal Bridal Set",
        "slug": "royal-bridal-set",
        "description": "Complete bridal set including necklace, earrings, maang tikka, and bangles.",
        "price": 89999,
        "sale_price": 74999,
        "material": "22K Gold Plated",
        "weight": "85g",
        "stock": 5,
        "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
        "is_featured": True,
        "is_new": False,
        "category_slug": "bridal-sets",
    },
    {
        "name": "Pearl Cascade Necklace",
        "slug": "pearl-cascade-necklace",
        "description": "Multi-strand freshwater pearl necklace with gold clasp.",
        "price": 18999,
        "sale_price": None,
        "material": "Freshwater Pearls, Gold",
        "weight": "18g",
        "stock": 12,
        "image_url": "https://images.unsplash.com/photo-1617032213625-75e550f4d0c4?w=600",
        "is_featured": False,
        "is_new": True,
        "category_slug": "necklaces",
    },
    {
        "name": "Starlight Stud Earrings",
        "slug": "starlight-stud-earrings",
        "description": "Minimalist star-shaped stud earrings with micro pave stones.",
        "price": 4999,
        "sale_price": 3999,
        "material": "Sterling Silver",
        "weight": "3g",
        "stock": 40,
        "image_url": "https://images.unsplash.com/photo-1588444837495-c6cfeb53f920?w=600",
        "is_featured": False,
        "is_new": True,
        "category_slug": "earrings",
    },
    {
        "name": "Infinity Band Ring",
        "slug": "infinity-band-ring",
        "description": "Sleek infinity symbol band ring in polished gold finish.",
        "price": 7999,
        "sale_price": None,
        "material": "Gold Plated",
        "weight": "3g",
        "stock": 35,
        "image_url": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600",
        "is_featured": False,
        "is_new": False,
        "category_slug": "rings",
    },
]


def seed_database():
    db: Session = SessionLocal()
    try:
        if db.query(Category).count() > 0:
            return

        category_map = {}
        for cat_data in CATEGORIES:
            category = Category(**cat_data)
            db.add(category)
            db.flush()
            category_map[cat_data["slug"]] = category.id

        for prod_data in PRODUCTS:
            category_slug = prod_data["category_slug"]
            product_fields = {k: v for k, v in prod_data.items() if k != "category_slug"}
            product = Product(**product_fields, category_id=category_map[category_slug])
            db.add(product)

        db.commit()
    finally:
        db.close()

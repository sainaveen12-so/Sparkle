from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, cart_orders, products
from app.seed import seed_database

app = FastAPI(
    title="Sparkle by Saranya API",
    description="Luxury jewelry e-commerce backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(cart_orders.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "brand": "Sparkle by Saranya"}

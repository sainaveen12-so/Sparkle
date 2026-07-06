from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db_migrate import init_database
from app.routers import auth, cart_orders, contact, products
from app.seed import seed_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_database()
    seed_database()
    yield


app = FastAPI(
    title="Sparkle by Saranya API",
    description="Luxury jewelry e-commerce backend",
    version="1.0.0",
    lifespan=lifespan,
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
app.include_router(contact.router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "brand": "Sparkle by Saranya"}

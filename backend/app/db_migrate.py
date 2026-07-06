from sqlalchemy import inspect

from app.config import settings
from app.database import Base, engine


def _needs_sqlite_rebuild() -> bool:
    if not settings.database_url.startswith("sqlite"):
        return False

    inspector = inspect(engine)
    table_names = inspector.get_table_names()

    if "users" not in table_names:
        return False

    columns = {col["name"]: col for col in inspector.get_columns("users")}

    email_col = columns.get("email")
    phone_col = columns.get("phone")
    password_col = columns.get("hashed_password")

    if email_col and not email_col.get("nullable", True):
        return True
    if phone_col and phone_col.get("nullable", True):
        return True
    if password_col and not password_col.get("nullable", True):
        return True
    if "otp_codes" not in table_names:
        return True
    if "contact_messages" not in table_names:
        return True

    if "orders" in table_names:
        order_cols = {col["name"] for col in inspector.get_columns("orders")}
        if "subtotal" not in order_cols or "shipping_amount" not in order_cols:
            return True

    return False


def init_database():
    if _needs_sqlite_rebuild():
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

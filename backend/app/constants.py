from decimal import Decimal

FREE_SHIPPING_THRESHOLD = Decimal("5000")
SHIPPING_FEE = Decimal("199")


def calculate_shipping(subtotal: Decimal) -> Decimal:
    return Decimal("0") if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FEE

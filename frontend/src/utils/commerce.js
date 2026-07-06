export const FREE_SHIPPING_THRESHOLD = 5000
export const SHIPPING_FEE = 199

export function calculateShipping(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

export function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

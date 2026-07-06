import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { calculateShipping } from '../utils/commerce'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { user } = useAuth()
  const { items, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    shipping_address: user?.address || '',
    shipping_city: user?.city || '',
    shipping_phone: user?.phone || '',
    payment_method: 'cod',
  })

  if (!user) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Checkout</h2>
          <p style={{ margin: '1.5rem 0' }}>Please login to checkout.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">No Items to Checkout</h2>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Shop Now</Link>
        </div>
      </div>
    )
  }

  const shipping = calculateShipping(cartTotal)
  const total = cartTotal + shipping

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/orders', {
        ...form,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      })
      await clearCart()
      navigate('/account', { state: { orderSuccess: true } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">Checkout</h1>
        <div className="star-divider">✦</div>

        <div className="cart-layout">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Shipping Address</label>
              <textarea
                rows={3}
                required
                value={form.shipping_address}
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                required
                value={form.shipping_city}
                onChange={(e) => setForm({ ...form, shipping_city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                required
                value={form.shipping_phone}
                onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              >
                <option value="cod">Cash on Delivery</option>
              </select>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                UPI and card payments coming soon.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            {items.map((item) => {
              const price = Number(item.product.sale_price || item.product.price)
              return (
                <div key={item.id} className="summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              )
            })}
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

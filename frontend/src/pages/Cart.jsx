import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { user } = useAuth()
  const { items, loading, cartTotal, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Your Cart</h2>
          <p style={{ margin: '1.5rem 0', color: 'var(--text-muted)' }}>
            Please login to view your cart.
          </p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="loading">Loading cart...</div>

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Your Cart is Empty</h2>
          <div className="star-divider">✦</div>
          <p style={{ margin: '1.5rem 0', color: 'var(--text-muted)' }}>
            Discover our beautiful collection and add something special.
          </p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <h1 className="section-title">Shopping Cart</h1>
        <div className="star-divider">✦</div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const price = Number(item.product.sale_price || item.product.price)
              return (
                <div key={item.id} className="cart-item">
                  <img src={item.product.image_url} alt={item.product.name} />
                  <div className="cart-item-info">
                    <Link to={`/product/${item.product.slug}`}>
                      <h3>{item.product.name}</h3>
                    </Link>
                    <p className="cart-item-price">₹{price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item-total">₹{(price * item.quantity).toLocaleString('en-IN')}</p>
                  <button className="cart-remove" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{cartTotal >= 5000 ? 'Free' : '₹199'}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(cartTotal + (cartTotal >= 5000 ? 0 : 199)).toLocaleString('en-IN')}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
            <Link to="/shop" className="btn btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

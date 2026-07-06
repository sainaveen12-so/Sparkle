import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Header.css'

export default function Header() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-inner">
          <span>Free shipping on orders above ₹5,000</span>
          <div className="header-top-links">
            {user ? (
              <>
                <span className="header-user-name">Hi, {user.full_name}</span>
                <Link to="/account">My Account</Link>
                <button onClick={logout} className="link-btn">Logout</button>
              </>
            ) : (
              <Link to="/login">Login / Sign Up</Link>
            )}
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Sparkle by Saranya" />
          </Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/shop?category=necklaces">Necklaces</Link>
            <Link to="/shop?category=earrings">Earrings</Link>
            <Link to="/shop?category=rings">Rings</Link>
            <Link to="/shop?category=bridal-sets">Bridal</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            <Link
              to="/cart"
              className="cart-link"
              aria-label={cartCount > 0 ? `Shopping cart, ${cartCount} items` : 'Shopping cart'}
              data-tooltip={cartCount > 0 ? `Cart (${cartCount} item${cartCount > 1 ? 's' : ''})` : 'View cart'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

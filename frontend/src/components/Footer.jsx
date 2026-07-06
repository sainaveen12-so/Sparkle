import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo.png" alt="Sparkle by Saranya" className="footer-logo" />
          <p>Handcrafted luxury jewelry that celebrates your unique sparkle. Each piece is designed with love and precision.</p>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/shop?category=necklaces">Necklaces</Link>
          <Link to="/shop?category=earrings">Earrings</Link>
          <Link to="/shop?category=rings">Rings</Link>
          <Link to="/shop?category=bridal-sets">Bridal Sets</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/account">My Account</Link>
        </div>

        <div className="footer-links">
          <h4>Contact</h4>
          <p>hello@sparklebysaranya.com</p>
          <p>+91 98765 43210</p>
          <p>Chennai, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Sparkle by Saranya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import './About.css'

export default function About() {
  return (
    <div className="page about-page">
      <div className="container">
        <div className="about-hero">
          <img src="/logo.png" alt="Sparkle by Saranya" />
          <h1>Our Story</h1>
          <div className="star-divider">✦</div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h2>Crafted with Love & Passion</h2>
            <p>
              Sparkle by Saranya was born from a deep passion for creating beautiful, timeless jewelry
              that celebrates the unique sparkle in every woman. Founded by Saranya, each piece in our
              collection is thoughtfully designed and meticulously crafted to bring elegance and joy
              to your everyday life.
            </p>
            <p>
              From delicate everyday pieces to stunning bridal collections, we believe that jewelry
              is more than an accessory — it's a reflection of your personality, your milestones,
              and your dreams.
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600" alt="Jewelry craftsmanship" />
          </div>
        </div>

        <div className="about-values">
          <div className="value-card">
            <span className="feature-icon">✦</span>
            <h3>Artisan Craftsmanship</h3>
            <p>Every piece is handcrafted by skilled artisans using traditional techniques passed down through generations.</p>
          </div>
          <div className="value-card">
            <span className="feature-icon">✦</span>
            <h3>Premium Materials</h3>
            <p>We source only the finest gold, silver, pearls, and gemstones to ensure lasting beauty and quality.</p>
          </div>
          <div className="value-card">
            <span className="feature-icon">✦</span>
            <h3>Timeless Design</h3>
            <p>Our designs blend classic elegance with contemporary style, creating pieces you'll treasure forever.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/shop" className="btn btn-primary">Explore Our Collection</Link>
        </div>
      </div>
    </div>
  )
}

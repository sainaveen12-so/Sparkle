import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true&limit=4'),
      api.get('/products?is_new=true&limit=4'),
      api.get('/categories'),
    ])
      .then(([featuredRes, newRes, catRes]) => {
        setFeatured(featuredRes.data)
        setNewArrivals(newRes.data)
        setCategories(catRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <img src="/logo.png" alt="Sparkle by Saranya" className="hero-logo" />
          <p className="hero-tagline">Handcrafted Luxury Jewelry</p>
          <p className="hero-desc">
            Discover exquisite pieces that capture elegance, tradition, and timeless beauty.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
            <Link to="/about" className="btn btn-outline">Our Story</Link>
          </div>
        </div>
      </section>

      <section className="container categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="star-divider">✦</div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="category-card">
              <img src={cat.image_url} alt={cat.name} />
              <div className="category-overlay">
                <h3>{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container">
        <h2 className="section-title">Featured Collection</h2>
        <p className="section-subtitle">Our most loved pieces, crafted to perfection</p>
        <div className="products-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="banner">
        <div className="container banner-inner">
          <div className="banner-text">
            <h2>Bridal Collection</h2>
            <p>Make your special day unforgettable with our exquisite bridal jewelry sets.</p>
            <Link to="/shop?category=bridal-sets" className="btn btn-primary">Explore Bridal</Link>
          </div>
        </div>
      </section>

      <section className="container">
        <h2 className="section-title">New Arrivals</h2>
        <p className="section-subtitle">Fresh designs just added to our collection</p>
        <div className="products-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/shop" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          <div className="feature">
            <span className="feature-icon">✦</span>
            <h3>Premium Quality</h3>
            <p>Finest materials and expert craftsmanship in every piece</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✦</span>
            <h3>Free Shipping</h3>
            <p>Complimentary delivery on orders above ₹5,000</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✦</span>
            <h3>Secure Payment</h3>
            <p>Safe and encrypted checkout process</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✦</span>
            <h3>Easy Returns</h3>
            <p>7-day hassle-free return policy</p>
          </div>
        </div>
      </section>
    </div>
  )
}

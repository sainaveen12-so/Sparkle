import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [slug, navigate])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setAdding(true)
    setMessage('')
    try {
      await addToCart(product.id, quantity)
      setMessage('Added to cart successfully!')
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!product) return null

  const price = Number(product.sale_price || product.price)
  const originalPrice = product.sale_price ? Number(product.price) : null

  return (
    <div className="page product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.image_url} alt={product.name} />
            {product.is_new && <span className="badge badge-new">New</span>}
            {product.sale_price && <span className="badge badge-sale">Sale</span>}
          </div>

          <div className="product-detail-info">
            <p className="product-category">{product.category?.name}</p>
            <h1>{product.name}</h1>
            <div className="product-prices">
              <span className="price">₹{price.toLocaleString('en-IN')}</span>
              {originalPrice && (
                <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              {product.material && <p><strong>Material:</strong> {product.material}</p>}
              {product.weight && <p><strong>Weight:</strong> {product.weight}</p>}
              <p><strong>Availability:</strong> {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</p>
            </div>

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
                <button className="btn btn-primary" onClick={handleAddToCart} disabled={adding}>
                  {adding ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

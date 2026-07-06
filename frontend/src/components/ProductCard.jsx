import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const price = Number(product.sale_price || product.price)
  const originalPrice = product.sale_price ? Number(product.price) : null

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image_url} alt={product.name} loading="lazy" />
        {product.is_new && <span className="badge badge-new">New</span>}
        {product.sale_price && <span className="badge badge-sale">Sale</span>}
        <div className="product-card-overlay">
          <span>View Details</span>
        </div>
      </div>
      <div className="product-card-info">
        <p className="product-category">{product.category?.name}</p>
        <h3>{product.name}</h3>
        <div className="product-prices">
          <span className="price">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

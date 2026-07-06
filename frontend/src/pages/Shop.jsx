import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/client'
import ProductCard from '../components/ProductCard'
import './Shop.css'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setError('Unable to load categories.'))
  }, [])

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    params.set('limit', '50')

    api.get(`/products?${params}`)
      .then((res) => setProducts(res.data))
      .catch(() => setError('Unable to load products. Please try again.'))
      .finally(() => setLoading(false))
  }, [category, search, sort])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  return (
    <div className="page shop-page">
      <div className="container">
        <h1 className="section-title">Our Collection</h1>
        <div className="star-divider">✦</div>

        <div className="shop-layout">
          <aside className="shop-filters">
            <h3>Categories</h3>
            <button
              className={`filter-btn ${!category ? 'active' : ''}`}
              onClick={() => updateFilter('category', '')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${category === cat.slug ? 'active' : ''}`}
                onClick={() => updateFilter('category', cat.slug)}
              >
                {cat.name}
              </button>
            ))}

            <h3 style={{ marginTop: '2rem' }}>Sort By</h3>
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </aside>

          <div className="shop-content">
            <div className="shop-search">
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateFilter('search', e.target.value)
                }}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="loading">No products found.</div>
            ) : (
              <div className="shop-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

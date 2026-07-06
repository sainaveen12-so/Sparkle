import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, updateProfile } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')
  const [orderSuccess] = useState(location.state?.orderSuccess)

  useEffect(() => {
    if (!user) return
    setForm({
      full_name: user.full_name || '',
      email: user.email || '',
      address: user.address || '',
      city: user.city || '',
    })
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">My Account</h2>
          <p style={{ margin: '1.5rem 0' }}>Please login to view your account.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(form)
      setMessage('Profile updated successfully!')
      setEditing(false)
    } catch {
      setMessage('Failed to update profile')
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">My Account</h1>
        <div className="star-divider">✦</div>

        {orderSuccess && (
          <div className="alert alert-success" style={{ maxWidth: 600, margin: '0 auto 2rem' }}>
            Your order has been placed successfully! Thank you for shopping with us.
          </div>
        )}

        <div className="cart-layout">
          <div>
            <div style={{ background: 'var(--white)', padding: '1.75rem', borderRadius: 4, boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Profile</h3>
                {!editing && (
                  <button className="btn btn-ghost" onClick={() => setEditing(true)}>Edit</button>
                )}
              </div>

              {message && <div className="alert alert-success">{message}</div>}

              {editing ? (
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email (optional)</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  <p><strong>Name:</strong> {user.full_name}</p>
                  <p><strong>Mobile:</strong> {user.phone}</p>
                  <p><strong>Email:</strong> {user.email || '—'}</p>
                  <p><strong>Address:</strong> {user.address || '—'}</p>
                  <p><strong>City:</strong> {user.city || '—'}</p>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Order History</h3>
            {loading ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} style={{ background: 'var(--white)', padding: '1.25rem', borderRadius: 4, boxShadow: 'var(--shadow)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <strong>Order #{order.id}</strong>
                    <span style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{order.status}</span>
                  </div>
                  {order.items.map((item) => (
                    <p key={item.id} style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {item.product.name} × {item.quantity} — ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  ))}
                  <p style={{ marginTop: '0.5rem', fontWeight: 700 }}>
                    Total: ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

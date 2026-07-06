import { useState } from 'react'
import api from '../api/client'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', form)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page contact-page">
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We'd love to hear from you</p>
        <div className="star-divider">✦</div>

        <div className="contact-layout">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>Have a question about our jewelry or need help with an order? Reach out to us and we'll get back to you within 24 hours.</p>

            <div className="contact-detail">
              <strong>Email</strong>
              <p>hello@sparklebysaranya.com</p>
            </div>
            <div className="contact-detail">
              <strong>Phone</strong>
              <p>+91 98765 43210</p>
            </div>
            <div className="contact-detail">
              <strong>Address</strong>
              <p>12, Jewelry Lane, T Nagar<br />Chennai, Tamil Nadu 600017</p>
            </div>
            <div className="contact-detail">
              <strong>Hours</strong>
              <p>Mon – Sat: 10:00 AM – 8:00 PM<br />Sunday: 11:00 AM – 6:00 PM</p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="alert alert-success">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

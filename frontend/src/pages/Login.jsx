import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [devOtp, setDevOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await sendOtp(phone)
      setIsNewUser(res.is_new_user)
      setDevOtp(res.dev_otp || '')
      setStep(2)
      setCountdown(30)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (isNewUser && !fullName.trim()) {
      setError('Please enter your name')
      return
    }
    setLoading(true)
    setError('')
    try {
      await verifyOtp(phone, otp, isNewUser ? fullName : undefined)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setLoading(true)
    setError('')
    try {
      const res = await sendOtp(phone)
      setDevOtp(res.dev_otp || '')
      setCountdown(30)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <img src="/logo.png" alt="Sparkle" className="auth-logo" />
        <h2>{step === 1 ? 'Login with Mobile' : 'Verify OTP'}</h2>
        <p className="auth-subtitle">
          {step === 1
            ? 'Enter your mobile number to receive OTP'
            : `OTP sent to +91 ${phone.replace(/\D/g, '').slice(-10)}`}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="phone-input">
                <span className="phone-prefix">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            {devOtp && (
              <div className="alert alert-success dev-otp">
                Dev OTP: <strong>{devOtp}</strong>
              </div>
            )}

            {isNewUser && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="6-digit OTP"
                className="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setStep(1); setOtp(''); setError('') }}
              >
                Change Number
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleResend}
                disabled={countdown > 0 || loading}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Key, ArrowRight, Shield, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TradingBackground from './TradingBackground'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { sendVerificationCode, login } = useAuth()
  const navigate = useNavigate()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await sendVerificationCode(email)

    if (success) {
      setStep('code')
    } else {
      setError('Invalid email address. Please try again.')
    }

    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(email, code)

    if (success) {
      navigate('/journal')
    } else {
      setError('Invalid or expired verification code. Please try again.')
    }

    setLoading(false)
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    setError('')
  }

  return (
    <div className="login-page">
      <TradingBackground variant="home" />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Shield size={48} />
            </div>
            <h1>Welcome to Tradee</h1>
            <p>Passwordless authentication - secure and simple</p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  'Sending Code...'
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="login-features">
                <div className="feature">
                  <Zap size={16} />
                  <span>No password required</span>
                </div>
                <div className="feature">
                  <Shield size={16} />
                  <span>Secure email verification</span>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="login-form">
              <div className="email-display">
                <Mail size={18} />
                <span>{email}</span>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="change-email-btn"
                >
                  Change
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="code">
                  <Key size={18} />
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  disabled={loading}
                  maxLength={6}
                  className="code-input"
                />
                <p className="input-hint">Enter the 6-digit code sent to your email</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={loading || code.length !== 6}>
                {loading ? (
                  'Verifying...'
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendCode}
                className="resend-button"
                disabled={loading}
              >
                Resend Code
              </button>
            </form>
          )}
        </div>

        <div className="login-info">
          <h3>Why Passwordless?</h3>
          <ul>
            <li>No passwords to remember or forget</li>
            <li>More secure than traditional passwords</li>
            <li>Quick and easy access to your trading journal</li>
            <li>One-time codes ensure account security</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Calculator, TrendingUp, Target, Menu, X, BookOpen, LogIn, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/calculator', label: 'Calculator', icon: <Calculator size={20} /> },
    { path: '/market-structure', label: 'Market Structure', icon: <TrendingUp size={20} /> },
    { path: '/price-action', label: 'Price Action', icon: <Target size={20} /> },
    { path: '/journal', label: 'Trading Journal', icon: <BookOpen size={20} />, authRequired: true }
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Logo size={24} />
          </div>
          <span className="logo-text">Tradee</span>
        </Link>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems
            .filter(item => !item.authRequired || isAuthenticated)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <User size={18} />
                <span>{user?.email}</span>
              </div>
              <button onClick={handleLogout} className="auth-btn logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="auth-btn login">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navigation

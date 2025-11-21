import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Target, Shield, Zap, BarChart3, AlertTriangle, DollarSign, BookOpen } from 'lucide-react'
import TradingBackground from './TradingBackground'
import TradingCharts from './TradingCharts'
import LiveTradingChart from './LiveTradingChart'
import './LandingPage.css'

const LandingPage = () => {
  const features = [
    {
      icon: <Calculator size={40} />,
      title: 'Position Size Calculator',
      description: 'Essential for protecting your capital. Calculate exact position sizes based on your account balance, risk percentage, and stop-loss distance. Prevent overleveraging and blown accounts.',
      benefits: ['Risk-based position sizing with leverage', 'Liquidation price calculator', 'Multiple take-profit target planning', 'Breakeven price calculation'],
      usage: 'Use before every trade to determine how much to invest',
      importance: 'Critical for risk management and capital preservation',
      link: '/calculator',
      color: '#667eea'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Market Structure Analysis',
      description: 'Identify the current market trend and key price levels. Understand whether the market is bullish, bearish, or ranging to align your strategy with market conditions.',
      benefits: ['Higher-high and higher-low trend analysis', 'Support & resistance level identification', 'Market bias determination (bullish/bearish/neutral)', 'Break of structure detection'],
      usage: 'Analyze before entering trades to trade with the trend',
      importance: 'Essential for timing entries and understanding market context',
      link: '/market-structure',
      color: '#ec4899'
    },
    {
      icon: <Target size={40} />,
      title: 'Price Action Analysis',
      description: 'Master candlestick patterns for precise entry and exit timing. Recognize reversal and continuation patterns to predict price movements based on historical behavior.',
      benefits: ['23+ candlestick pattern recognition', 'Real-time price action signals', 'Pattern reliability and probability data', 'Entry/exit timing optimization'],
      usage: 'Check patterns on your timeframe to confirm trade setups',
      importance: 'Improves entry timing and increases win rate',
      link: '/price-action',
      color: '#f093fb'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Trading Journal',
      description: 'Track every trade with detailed metrics. Analyze your performance over time to identify what works and what doesn\'t. Data-driven improvement for consistent profitability.',
      benefits: ['Complete trade history logging', 'Win rate and P&L tracking', 'Performance analytics dashboard', 'CSV export for advanced analysis'],
      usage: 'Log all trades to track performance and find patterns',
      importance: 'Crucial for continuous improvement and accountability',
      link: '/journal',
      color: '#10b981'
    }
  ]

  const whyUseIt = [
    {
      icon: <Shield size={32} />,
      title: 'Risk Management',
      description: 'Protect your capital with precise position sizing and stop-loss calculations'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      description: 'Get instant calculations and analysis without leaving your browser'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Professional Tools',
      description: 'Access institutional-grade trading tools completely free'
    },
    {
      icon: <DollarSign size={32} />,
      title: 'Maximize Profits',
      description: 'Optimize your risk-reward ratio for consistent profitability'
    }
  ]

  return (
    <div className="landing-page">
      <TradingBackground variant="home" />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>Professional Trading Tools</span>
          </div>
          <h1 className="hero-title">
            Professional Crypto Trading Tools for
            <span className="gradient-text"> Consistent Profitability</span>
          </h1>
          <p className="hero-subtitle">
            Complete toolkit for serious traders: Calculate position sizes, analyze market structure, identify price action patterns, and track your performance. Everything you need to trade with discipline and precision.
          </p>
          <div className="hero-cta">
            <Link to="/calculator" className="btn-primary">
              Start Calculating
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href="#features" className="btn-secondary">
              Explore Features
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-badge">
              <span className="stat-number">4</span>
              <span className="stat-text">Tools</span>
            </div>
            <div className="stat-badge">
              <span className="stat-number">∞</span>
              <span className="stat-text">Access</span>
            </div>
            <div className="stat-badge">
              <span className="stat-number">24/7</span>
              <span className="stat-text">Available</span>
            </div>
          </div>
        </div>
        <div className="hero-illustration">
          <TradingCharts />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Complete Trading Toolkit</h2>
          <p className="section-subtitle">
            Four essential tools that professional traders use daily. Each tool serves a specific purpose in your trading workflow.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ '--card-color': feature.color } as React.CSSProperties}>
              <div className="feature-icon" style={{ backgroundColor: `${feature.color}15` }}>
                <div style={{ color: feature.color }}>{feature.icon}</div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>

              <div className="feature-meta">
                <div className="feature-usage">
                  <strong>When to Use:</strong> {feature.usage}
                </div>
                <div className="feature-importance">
                  <strong>Why It Matters:</strong> {feature.importance}
                </div>
              </div>

              <div className="feature-divider"></div>

              <ul className="feature-benefits">
                {feature.benefits.map((benefit, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4L6 11.5L2.5 8" stroke={feature.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link to={feature.link} className="feature-link" style={{ color: feature.color }}>
                Open Tool
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Use Section */}
      <section className="why-section">
        <div className="section-header">
          <h2 className="section-title">Why Traders Choose Our Tools</h2>
          <p className="section-subtitle">
            Built by traders, for traders
          </p>
        </div>
        <div className="why-grid">
          {whyUseIt.map((item, index) => (
            <div key={index} className="why-card">
              <div className="why-icon">{item.icon}</div>
              <h3 className="why-title">{item.title}</h3>
              <p className="why-description">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Warning */}
      <section className="warning-section">
        <div className="warning-card">
          <AlertTriangle size={32} color="#ff9800" />
          <div className="warning-content">
            <h3>Important Risk Disclosure</h3>
            <p>
              Trading cryptocurrencies carries a high level of risk and may not be suitable for all investors.
              Always use proper risk management and never risk more than you can afford to lose.
              These tools are for educational purposes and should not be considered financial advice.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-header">
            <h2 className="cta-title">Ready to Level Up Your Trading?</h2>
            <p className="cta-subtitle">Watch live market action with real-time buy and sell signals</p>
          </div>

          <div className="cta-chart-wrapper">
            <LiveTradingChart />
          </div>

          <div className="cta-actions">
            <div className="cta-buttons">
              <Link to="/calculator" className="btn-cta-primary">
                <Zap size={20} />
                Start Trading Smarter
              </Link>
              <Link to="/journal" className="btn-cta-secondary">
                <BarChart3 size={20} />
                Track Your Trades
              </Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L12.2451 7.75486L20 10L12.2451 12.2451L10 20L7.75486 12.2451L0 10L7.75486 7.75486L10 0Z" fill="white"/>
                </svg>
                <span>No Registration Required</span>
              </div>
              <div className="cta-feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L12.2451 7.75486L20 10L12.2451 12.2451L10 20L7.75486 12.2451L0 10L7.75486 7.75486L10 0Z" fill="white"/>
                </svg>
                <span>Real-Time Signals</span>
              </div>
              <div className="cta-feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 0L12.2451 7.75486L20 10L12.2451 12.2451L10 20L7.75486 12.2451L0 10L7.75486 7.75486L10 0Z" fill="white"/>
                </svg>
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section footer-brand">
              <h3 className="footer-logo">Tradee</h3>
              <p className="footer-description">
                Professional crypto trading tools for consistent profitability.
                Risk management, market analysis, and performance tracking - all free forever.
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Tools</h4>
              <ul className="footer-links">
                <li><Link to="/calculator">Position Calculator</Link></li>
                <li><Link to="/market-structure">Market Structure</Link></li>
                <li><Link to="/price-action">Price Action</Link></li>
                <li><Link to="/journal">Trading Journal</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><Link to="/support">Support</Link></li>
                <li><a href="mailto:tradee444@gmail.com">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-links">
                <li><span className="footer-text">Not Financial Advice</span></li>
                <li><span className="footer-text">Educational Purpose Only</span></li>
                <li><span className="footer-text">Use at Your Own Risk</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; 2025 Tradee. All rights reserved.</p>
            </div>
            <div className="footer-tagline">
              <p>Trade Smart. Trade Safe. Trade Profitably.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

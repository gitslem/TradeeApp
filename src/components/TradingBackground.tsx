import './TradingBackground.css'

interface TradingBackgroundProps {
  variant?: 'calculator' | 'market' | 'price-action' | 'home'
}

const TradingBackground = ({ variant = 'home' }: TradingBackgroundProps) => {
  return (
    <div className={`trading-background trading-background-${variant}`}>
      {/* Floating candlesticks */}
      <div className="floating-element candle candle-1">
        <div className="candle-body bullish"></div>
        <div className="candle-wick"></div>
      </div>
      <div className="floating-element candle candle-2">
        <div className="candle-body bearish"></div>
        <div className="candle-wick"></div>
      </div>
      <div className="floating-element candle candle-3">
        <div className="candle-body bullish"></div>
        <div className="candle-wick"></div>
      </div>

      {/* Chart lines */}
      <svg className="floating-element chart-line chart-line-1" viewBox="0 0 200 100">
        <path d="M 0 80 Q 50 20, 100 40 T 200 30" fill="none" stroke="url(#gradient1)" strokeWidth="3" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="floating-element chart-line chart-line-2" viewBox="0 0 200 100">
        <path d="M 0 30 Q 50 80, 100 60 T 200 70" fill="none" stroke="url(#gradient2)" strokeWidth="3" />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Trend arrows */}
      <div className="floating-element trend-arrow arrow-up-1">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="floating-element trend-arrow arrow-down-1">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M17 7L7 17M7 17H15M7 17V9" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="floating-element trend-arrow arrow-up-2">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Coins */}
      <div className="floating-element coin coin-1">
        <div className="coin-inner">₿</div>
      </div>
      <div className="floating-element coin coin-2">
        <div className="coin-inner">Ξ</div>
      </div>
      <div className="floating-element coin coin-3">
        <div className="coin-inner">$</div>
      </div>

      {/* Price tags */}
      <div className="floating-element price-tag price-tag-1">
        <span className="price-value">$45,678</span>
        <span className="price-change positive">+5.2%</span>
      </div>
      <div className="floating-element price-tag price-tag-2">
        <span className="price-value">$3,421</span>
        <span className="price-change negative">-2.1%</span>
      </div>

      {/* Support/Resistance levels */}
      <div className="floating-element level-line level-1">
        <div className="level-indicator">Support</div>
        <div className="level-line-graphic"></div>
      </div>
      <div className="floating-element level-line level-2">
        <div className="level-indicator">Resistance</div>
        <div className="level-line-graphic"></div>
      </div>

      {/* Geometric shapes */}
      <div className="floating-element geometric-shape shape-1">
        <div className="triangle"></div>
      </div>
      <div className="floating-element geometric-shape shape-2">
        <div className="circle"></div>
      </div>
      <div className="floating-element geometric-shape shape-3">
        <div className="square"></div>
      </div>

      {/* Particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>

      {/* Gradient orbs */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
    </div>
  )
}

export default TradingBackground

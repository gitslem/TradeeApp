import './TradingCharts.css'

const TradingCharts = () => {
  return (
    <div className="trading-charts-container">
      <svg
        width="600"
        height="400"
        viewBox="0 0 600 400"
        className="trading-chart-svg"
      >
        <defs>
          <linearGradient id="bullishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="bearishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(102, 126, 234, 0.1)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="600" height="400" fill="url(#chartBg)" rx="10" />

        {/* Grid lines */}
        <g className="grid-lines" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1">
          {[80, 140, 200, 260, 320].map((y) => (
            <line key={`h-${y}`} x1="60" y1={y} x2="560" y2={y} />
          ))}
          {[100, 180, 260, 340, 420, 500].map((x) => (
            <line key={`v-${x}`} x1={x} y1="40" x2={x} y2="320" />
          ))}
        </g>

        {/* Moving Average Lines */}
        <g className="moving-averages">
          {/* MA 1 - Fast (Purple) */}
          <path
            className="ma-line ma-fast"
            d="M 60 180 Q 140 160, 180 170 T 260 150 T 340 140 T 420 155 T 500 145 L 560 140"
            stroke="#667eea"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* MA 2 - Slow (Pink) */}
          <path
            className="ma-line ma-slow"
            d="M 60 200 Q 140 190, 180 185 T 260 175 T 340 165 T 420 170 T 500 160 L 560 155"
            stroke="#ec4899"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Candlesticks */}
        <g className="candlesticks">
          {/* Candle 1 - Bearish */}
          <g className="candle candle-1">
            <line x1="100" y1="160" x2="100" y2="220" stroke="#ef4444" strokeWidth="2" />
            <rect x="90" y="180" width="20" height="30" fill="url(#bearishGradient)" rx="2" />
          </g>

          {/* Candle 2 - Bullish */}
          <g className="candle candle-2">
            <line x1="180" y1="140" x2="180" y2="200" stroke="#10b981" strokeWidth="2" />
            <rect x="170" y="150" width="20" height="40" fill="url(#bullishGradient)" rx="2" />
          </g>

          {/* Candle 3 - Bullish */}
          <g className="candle candle-3">
            <line x1="260" y1="120" x2="260" y2="180" stroke="#10b981" strokeWidth="2" />
            <rect x="250" y="135" width="20" height="35" fill="url(#bullishGradient)" rx="2" />
          </g>

          {/* Candle 4 - Bearish */}
          <g className="candle candle-4">
            <line x1="340" y1="130" x2="340" y2="190" stroke="#ef4444" strokeWidth="2" />
            <rect x="330" y="145" width="20" height="35" fill="url(#bearishGradient)" rx="2" />
          </g>

          {/* Candle 5 - Bullish */}
          <g className="candle candle-5">
            <line x1="420" y1="110" x2="420" y2="170" stroke="#10b981" strokeWidth="2" />
            <rect x="410" y="125" width="20" height="35" fill="url(#bullishGradient)" rx="2" />
          </g>

          {/* Candle 6 - Bullish (Strong) */}
          <g className="candle candle-6">
            <line x1="500" y1="100" x2="500" y2="170" stroke="#10b981" strokeWidth="2" />
            <rect x="490" y="115" width="20" height="45" fill="url(#bullishGradient)" rx="2" />
          </g>
        </g>

        {/* Volume Bars */}
        <g className="volume-bars">
          <rect className="volume-bar vol-1" x="90" y="340" width="20" height="30" fill="rgba(239, 68, 68, 0.6)" rx="2" />
          <rect className="volume-bar vol-2" x="170" y="330" width="20" height="40" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="volume-bar vol-3" x="250" y="325" width="20" height="45" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="volume-bar vol-4" x="330" y="335" width="20" height="35" fill="rgba(239, 68, 68, 0.6)" rx="2" />
          <rect className="volume-bar vol-5" x="410" y="320" width="20" height="50" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="volume-bar vol-6" x="490" y="315" width="20" height="55" fill="rgba(16, 185, 129, 0.6)" rx="2" />
        </g>

        {/* Price Labels */}
        <g className="price-labels" fill="rgba(255, 255, 255, 0.7)" fontSize="12">
          <text x="570" y="145" className="current-price">$45,230</text>
          <text x="570" y="165" className="price-change" fill="#10b981">+2.4%</text>
        </g>

        {/* Trend Indicators */}
        <g className="trend-indicators">
          {/* Uptrend Arrow */}
          <path
            className="trend-arrow"
            d="M 480 100 L 520 80 L 520 95 L 550 95 L 550 65 L 520 65 L 520 80 Z"
            fill="#10b981"
            opacity="0.8"
          />

          {/* Buy Signal Marker */}
          <circle className="signal-marker buy-signal" cx="500" cy="160" r="8" fill="none" stroke="#10b981" strokeWidth="3" />
          <text x="485" y="185" fontSize="10" fill="#10b981" fontWeight="bold">BUY</text>
        </g>

        {/* Chart Title */}
        <text x="60" y="30" fill="white" fontSize="16" fontWeight="bold">BTC/USDT</text>
        <text x="160" y="30" fill="rgba(255, 255, 255, 0.6)" fontSize="12">1D</text>
      </svg>

      {/* Stats Panel */}
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">24h High</span>
          <span className="stat-value positive">$45,890</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">24h Low</span>
          <span className="stat-value">$43,120</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Volume</span>
          <span className="stat-value">2.4B</span>
        </div>
      </div>
    </div>
  )
}

export default TradingCharts

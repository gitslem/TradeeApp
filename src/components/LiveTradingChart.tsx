import './LiveTradingChart.css'

const LiveTradingChart = () => {
  return (
    <div className="live-trading-chart">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="trading-svg"
      >
        <defs>
          <linearGradient id="buyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="sellGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Price Grid Lines */}
        <g className="price-grid" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1">
          {[80, 140, 200, 260, 320].map((y) => (
            <line key={`h-${y}`} x1="50" y1={y} x2="750" y2={y} />
          ))}
        </g>

        {/* Candlesticks with Live Animation */}
        <g className="candlesticks-live">
          {/* Candle 1 - Bullish */}
          <g className="live-candle candle-anim-1">
            <line x1="120" y1="160" x2="120" y2="220" stroke="#10b981" strokeWidth="2" className="wick-anim" />
            <rect x="108" y="180" width="24" height="30" fill="url(#buyGradient)" rx="2" className="body-anim" />
          </g>

          {/* Candle 2 - Bearish */}
          <g className="live-candle candle-anim-2">
            <line x1="200" y1="140" x2="200" y2="200" stroke="#ef4444" strokeWidth="2" className="wick-anim" />
            <rect x="188" y="150" width="24" height="40" fill="url(#sellGradient)" rx="2" className="body-anim" />
          </g>

          {/* Candle 3 - Bullish (Strong) */}
          <g className="live-candle candle-anim-3">
            <line x1="280" y1="120" x2="280" y2="190" stroke="#10b981" strokeWidth="2" className="wick-anim" />
            <rect x="268" y="135" width="24" height="45" fill="url(#buyGradient)" rx="2" className="body-anim" />
          </g>

          {/* Candle 4 - Bullish */}
          <g className="live-candle candle-anim-4">
            <line x1="360" y1="110" x2="360" y2="170" stroke="#10b981" strokeWidth="2" className="wick-anim" />
            <rect x="348" y="125" width="24" height="35" fill="url(#buyGradient)" rx="2" className="body-anim" />
          </g>

          {/* Candle 5 - Doji (Indecision) */}
          <g className="live-candle candle-anim-5">
            <line x1="440" y1="105" x2="440" y2="165" stroke="#6b7280" strokeWidth="2" className="wick-anim" />
            <rect x="428" y="133" width="24" height="4" fill="#6b7280" rx="1" className="body-anim" />
          </g>

          {/* Candle 6 - Bullish (Breakout) */}
          <g className="live-candle candle-anim-6">
            <line x1="520" y1="85" x2="520" y2="155" stroke="#10b981" strokeWidth="2" className="wick-anim" />
            <rect x="508" y="100" width="24" height="50" fill="url(#buyGradient)" rx="2" className="body-anim" />
          </g>

          {/* Candle 7 - Bullish (Continuation) */}
          <g className="live-candle candle-anim-7">
            <line x1="600" y1="75" x2="600" y2="135" stroke="#10b981" strokeWidth="2" className="wick-anim" />
            <rect x="588" y="90" width="24" height="40" fill="url(#buyGradient)" rx="2" className="body-anim" />
          </g>

          {/* Candle 8 - Current (Forming) */}
          <g className="live-candle candle-anim-8 current-candle">
            <line x1="680" y1="70" x2="680" y2="120" stroke="#10b981" strokeWidth="2" className="wick-anim current-wick" />
            <rect x="668" y="80" width="24" height="35" fill="url(#buyGradient)" rx="2" className="body-anim current-body" />
          </g>
        </g>

        {/* Volume Bars */}
        <g className="volume-bars-live">
          <rect className="vol-bar vol-anim-1" x="108" y="340" width="24" height="35" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-2" x="188" y="330" width="24" height="45" fill="rgba(239, 68, 68, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-3" x="268" y="320" width="24" height="55" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-4" x="348" y="325" width="24" height="50" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-5" x="428" y="335" width="24" height="40" fill="rgba(107, 114, 128, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-6" x="508" y="310" width="24" height="65" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-7" x="588" y="315" width="24" height="60" fill="rgba(16, 185, 129, 0.6)" rx="2" />
          <rect className="vol-bar vol-anim-8 current-vol" x="668" y="320" width="24" height="55" fill="rgba(16, 185, 129, 0.8)" rx="2" />
        </g>

        {/* Buy Signal Markers */}
        <g className="buy-signals">
          <circle className="buy-marker buy-marker-1" cx="280" cy="195" r="10" fill="none" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />
          <text x="280" y="220" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle" className="signal-text">BUY</text>
          <path d="M 280 205 L 280 180 L 290 190 L 280 180 L 270 190 Z" fill="#10b981" className="buy-arrow" />

          <circle className="buy-marker buy-marker-2" cx="520" cy="165" r="10" fill="none" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />
          <text x="520" y="190" fontSize="12" fontWeight="bold" fill="#10b981" textAnchor="middle" className="signal-text">BUY</text>
          <path d="M 520 175 L 520 150 L 530 160 L 520 150 L 510 160 Z" fill="#10b981" className="buy-arrow" />
        </g>

        {/* Sell Signal Marker */}
        <g className="sell-signals">
          <circle className="sell-marker" cx="440" cy="150" r="10" fill="none" stroke="#ef4444" strokeWidth="3" filter="url(#glow)" />
          <text x="440" y="140" fontSize="12" fontWeight="bold" fill="#ef4444" textAnchor="middle" className="signal-text">SELL</text>
          <path d="M 440 160 L 440 185 L 450 175 L 440 185 L 430 175 Z" fill="#ef4444" className="sell-arrow" />
        </g>

        {/* Trend Line */}
        <path
          className="trend-line"
          d="M 100 230 Q 280 200, 400 160 T 700 85"
          fill="none"
          stroke="#667eea"
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.6"
        />

        {/* Price Labels */}
        <g className="price-labels-live" fill="white" fontSize="14" fontWeight="bold">
          <rect x="720" y="70" width="70" height="30" fill="rgba(16, 185, 129, 0.9)" rx="4" className="price-tag" />
          <text x="755" y="90" textAnchor="middle">$48,520</text>

          <rect x="720" y="110" width="70" height="20" fill="rgba(16, 185, 129, 0.8)" rx="4" className="change-tag" />
          <text x="755" y="124" fontSize="12" textAnchor="middle">+8.4%</text>
        </g>

        {/* Support/Resistance Lines */}
        <g className="sr-lines">
          <line x1="50" y1="200" x2="750" y2="200" stroke="#10b981" strokeWidth="2" strokeDasharray="6 3" opacity="0.5" className="support-line" />
          <text x="60" y="195" fontSize="12" fill="#10b981" fontWeight="bold">Support</text>

          <line x1="50" y1="100" x2="750" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" opacity="0.5" className="resistance-line" />
          <text x="60" y="95" fontSize="12" fill="#ef4444" fontWeight="bold">Resistance</text>
        </g>

        {/* Chart Title */}
        <text x="50" y="35" fill="white" fontSize="20" fontWeight="bold">ETH/USDT</text>
        <text x="170" y="35" fill="rgba(255, 255, 255, 0.6)" fontSize="14">Live Trading</text>
        <circle cx="260" cy="30" r="5" fill="#10b981" className="live-indicator">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

export default LiveTradingChart

import { useState, useEffect } from 'react'
import { EXCHANGES } from '../config/exchanges'
import type { ExchangeConfig } from '../config/exchanges'
import './FloatingExchangeSelector.css'

interface FloatingExchangeSelectorProps {
  selectedExchange: string
  onSelectExchange: (exchangeId: string) => void
}

const FloatingExchangeSelector = ({ selectedExchange, onSelectExchange }: FloatingExchangeSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const exchanges = Object.values(EXCHANGES)
  const selectedExchangeData = EXCHANGES[selectedExchange] || exchanges[0]

  // Auto-cycle through exchanges
  useEffect(() => {
    if (!showAll) {
      const interval = setInterval(() => {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % exchanges.length)
          setIsAnimating(false)
        }, 300)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [exchanges.length, showAll])

  const handleSelectExchange = (exchange: ExchangeConfig) => {
    onSelectExchange(exchange.id)
    setShowAll(false)
  }

  const getVisibleExchanges = () => {
    if (showAll) return exchanges

    const visible = []
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + exchanges.length) % exchanges.length
      visible.push(exchanges[index])
    }
    return visible
  }

  const visibleExchanges = getVisibleExchanges()

  return (
    <div className="floating-exchange-selector">
      <div className="exchange-header">
        <h3>Select Exchange Platform</h3>
        <button
          className="toggle-view-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Carousel View' : 'View All'}
        </button>
      </div>

      <div className="selected-exchange-display">
        <div
          className="selected-exchange-logo"
          style={{ backgroundColor: selectedExchangeData.color }}
        >
          {selectedExchangeData.logo}
        </div>
        <div className="selected-exchange-info">
          <h4>{selectedExchangeData.displayName}</h4>
          <p className="exchange-tagline">Current Platform</p>
        </div>
      </div>

      <div className={`exchange-carousel ${showAll ? 'show-all' : ''}`}>
        {visibleExchanges.map((exchange, idx) => {
          const isSelected = exchange.id === selectedExchange
          const isCurrent = !showAll && idx === 1

          return (
            <div
              key={exchange.id}
              className={`exchange-card ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''} ${isAnimating && isCurrent ? 'animating' : ''}`}
              onClick={() => handleSelectExchange(exchange)}
              style={{
                transform: showAll
                  ? 'none'
                  : `translateX(${(idx - 1) * 120}%) scale(${isCurrent ? 1 : 0.8})`,
                opacity: showAll ? 1 : (isCurrent ? 1 : 0.5),
                zIndex: showAll ? 1 : (isCurrent ? 10 : 1)
              }}
            >
              <div
                className="exchange-logo-circle"
                style={{ backgroundColor: exchange.color }}
              >
                <span className="exchange-logo-text">{exchange.logo}</span>
              </div>
              <div className="exchange-name">{exchange.displayName}</div>
              {isSelected && <div className="selected-badge">✓ Active</div>}
              <div className="exchange-features">
                {exchange.accountTypes.spot && <span className="feature-tag">Spot</span>}
                {exchange.accountTypes.futures && <span className="feature-tag">Futures</span>}
                {exchange.accountTypes.margin && <span className="feature-tag">Margin</span>}
              </div>
              <div className="exchange-leverage">
                Max Leverage: {exchange.maxLeverage.futures}x
              </div>
            </div>
          )
        })}
      </div>

      <div className="exchange-quick-stats">
        <div className="quick-stat">
          <span className="stat-label">Maker Fee</span>
          <span className="stat-value">{selectedExchangeData.fees.futures.maker}%</span>
        </div>
        <div className="quick-stat">
          <span className="stat-label">Taker Fee</span>
          <span className="stat-value">{selectedExchangeData.fees.futures.taker}%</span>
        </div>
        <div className="quick-stat">
          <span className="stat-label">Max Leverage</span>
          <span className="stat-value">{selectedExchangeData.maxLeverage.futures}x</span>
        </div>
        <div className="quick-stat">
          <span className="stat-label">Min Trade</span>
          <span className="stat-value">${selectedExchangeData.minTradeAmount}</span>
        </div>
      </div>
    </div>
  )
}

export default FloatingExchangeSelector

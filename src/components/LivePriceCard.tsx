import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { getCryptoPrice } from '../services/cryptoPrice'
import type { CryptoPrice } from '../services/cryptoPrice'
import './LivePriceCard.css'

interface LivePriceCardProps {
  pair: string
  onUsePrice?: (price: number) => void
}

const LivePriceCard = ({ pair, onUsePrice }: LivePriceCardProps) => {
  const [priceData, setPriceData] = useState<CryptoPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPrice = async () => {
    try {
      setError(null)
      const data = await getCryptoPrice(pair)
      if (data) {
        setPriceData(data)
      } else {
        setError('Failed to fetch price')
      }
    } catch (err) {
      setError('Error fetching price')
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPrice()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [pair])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchPrice()
  }

  const handleUsePrice = () => {
    if (priceData && onUsePrice) {
      onUsePrice(priceData.price)
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toFixed(2)
    if (price >= 1) return price.toFixed(4)
    return price.toFixed(6)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="live-price-card loading">
        <div className="spinner"></div>
        <p>Loading price data...</p>
      </div>
    )
  }

  if (error || !priceData) {
    return (
      <div className="live-price-card error">
        <p>{error || 'No data available'}</p>
        <button onClick={handleRefresh} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  const isPositive = priceData.priceChangePercent >= 0

  return (
    <div className={`live-price-card ${isPositive ? 'positive' : 'negative'}`}>
      <div className="price-header">
        <div className="price-title">
          <h3>{priceData.symbol}</h3>
          <span className="live-indicator">
            <span className="pulse"></span>
            LIVE
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          disabled={refreshing}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="price-main">
        <div className="current-price">
          <span className="price-label">Current Price</span>
          <h2>${formatPrice(priceData.price)}</h2>
        </div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="change-percent">
            {isPositive ? '+' : ''}{priceData.priceChangePercent.toFixed(2)}%
          </span>
          <span className="change-amount">
            {isPositive ? '+' : ''}${Math.abs(priceData.priceChange).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="price-stats">
        <div className="stat-item">
          <span className="stat-label">
            <ArrowUpRight size={14} />
            24h High
          </span>
          <span className="stat-value">${formatPrice(priceData.high24h)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">
            <ArrowDownRight size={14} />
            24h Low
          </span>
          <span className="stat-value">${formatPrice(priceData.low24h)}</span>
        </div>
      </div>

      <div className="price-actions">
        {onUsePrice && (
          <button onClick={handleUsePrice} className="use-price-btn">
            Use as Entry Price
          </button>
        )}
        <span className="last-update">
          Updated: {formatTime(priceData.lastUpdate)}
        </span>
      </div>
    </div>
  )
}

export default LivePriceCard

import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { getOHLCVData, identifyCandlePattern, INTERVALS } from '../services/ohlcvService'
import type { OHLCVData } from '../services/ohlcvService'
import './CandleDataCard.css'

interface CandleDataCardProps {
  pair: string
  onUseCandleData?: (data: OHLCVData) => void
}

const CandleDataCard = ({ pair, onUseCandleData }: CandleDataCardProps) => {
  const [candleData, setCandleData] = useState<OHLCVData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState('15m')

  const fetchCandleData = async () => {
    try {
      setError(null)
      const data = await getOHLCVData(pair, selectedInterval)
      if (data) {
        setCandleData(data)
      } else {
        setError('Failed to fetch candle data')
      }
    } catch (err) {
      setError('Error fetching candle data')
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCandleData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCandleData, 30000)
    return () => clearInterval(interval)
  }, [pair, selectedInterval])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCandleData()
  }

  const handleUseData = () => {
    if (candleData && onUseCandleData) {
      onUseCandleData(candleData)
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) return price.toFixed(2)
    if (price >= 1) return price.toFixed(4)
    return price.toFixed(6)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`
    return volume.toFixed(2)
  }

  if (loading) {
    return (
      <div className="candle-data-card loading">
        <div className="spinner"></div>
        <p>Loading candle data...</p>
      </div>
    )
  }

  if (error || !candleData) {
    return (
      <div className="candle-data-card error">
        <p>{error || 'No data available'}</p>
        <button onClick={handleRefresh} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  const pattern = identifyCandlePattern(candleData.current)
  const isUp = candleData.priceChangePercent >= 0

  return (
    <div className={`candle-data-card ${isUp ? 'bullish' : 'bearish'}`}>
      <div className="candle-header">
        <div className="candle-title">
          <Clock size={18} />
          <span>Candle Data</span>
          <select
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            className="interval-selector"
          >
            {Object.entries(INTERVALS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRefresh}
          className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          disabled={refreshing}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Current Candle */}
      <div className="candle-section">
        <h4>Current Candle</h4>
        <div className="ohlcv-grid">
          <div className="ohlcv-item">
            <span className="label">Open</span>
            <span className="value">${formatPrice(candleData.current.open)}</span>
          </div>
          <div className="ohlcv-item">
            <span className="label">High</span>
            <span className="value highlight">${formatPrice(candleData.current.high)}</span>
          </div>
          <div className="ohlcv-item">
            <span className="label">Low</span>
            <span className="value highlight">${formatPrice(candleData.current.low)}</span>
          </div>
          <div className="ohlcv-item">
            <span className="label">Close</span>
            <span className="value">${formatPrice(candleData.current.close)}</span>
          </div>
          <div className="ohlcv-item">
            <span className="label">Volume</span>
            <span className="value">{formatVolume(candleData.current.volume)}</span>
          </div>
          <div className="ohlcv-item">
            <span className="label">Trades</span>
            <span className="value">{candleData.current.trades.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Price Change */}
      <div className="change-section">
        <div className={`change-indicator ${isUp ? 'up' : 'down'}`}>
          {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="change-percent">
            {isUp ? '+' : ''}{candleData.priceChangePercent.toFixed(2)}%
          </span>
          <span className="change-amount">
            {isUp ? '+' : ''}${Math.abs(candleData.priceChange).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Pattern Recognition */}
      <div className="pattern-section">
        <div className="pattern-badge">{pattern}</div>
      </div>

      {/* Previous Candle (Compact) */}
      <div className="previous-section">
        <h4>Previous Candle</h4>
        <div className="previous-compact">
          <span>O: ${formatPrice(candleData.previous.open)}</span>
          <span>H: ${formatPrice(candleData.previous.high)}</span>
          <span>L: ${formatPrice(candleData.previous.low)}</span>
          <span>C: ${formatPrice(candleData.previous.close)}</span>
          <span>Vol: {formatVolume(candleData.previous.volume)}</span>
        </div>
      </div>

      {/* Volume Change */}
      <div className="volume-section">
        <span className="volume-label">Volume Change:</span>
        <span className={`volume-change ${candleData.volumeChangePercent >= 0 ? 'up' : 'down'}`}>
          {candleData.volumeChangePercent >= 0 ? '+' : ''}{candleData.volumeChangePercent.toFixed(1)}%
        </span>
      </div>

      {/* Action Button */}
      {onUseCandleData && (
        <button onClick={handleUseData} className="use-data-btn">
          Auto-Fill Data
        </button>
      )}
    </div>
  )
}

export default CandleDataCard

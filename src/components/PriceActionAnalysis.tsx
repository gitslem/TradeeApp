import { useState } from 'react'
import './PriceActionAnalysis.css'
import CandleDataCard from './CandleDataCard'
import CollapsibleSection from './CollapsibleSection'
import TradingBackground from './TradingBackground'
import type { OHLCVData } from '../services/ohlcvService'

interface CandleData {
  open: string
  high: string
  low: string
  close: string
}

const PriceActionAnalysis = () => {
  const [cryptoPair, setCryptoPair] = useState<string>('ETH/USDT')
  const [candle, setCandle] = useState<CandleData>({
    open: '3500',
    high: '3550',
    low: '3480',
    close: '3520'
  })

  const [volume, setVolume] = useState<string>('1000000')
  const [prevVolume, setPrevVolume] = useState<string>('800000')
  const [timeframe, setTimeframe] = useState<string>('1H')

  const handleUseCandleData = (ohlcv: OHLCVData) => {
    setCandle({
      open: ohlcv.current.open.toString(),
      high: ohlcv.current.high.toString(),
      low: ohlcv.current.low.toString(),
      close: ohlcv.current.close.toString()
    })
    setVolume(ohlcv.current.volume.toString())
    setPrevVolume(ohlcv.previous.volume.toString())
  }

  const analyzeCandlestick = () => {
    const open = parseFloat(candle.open)
    const high = parseFloat(candle.high)
    const low = parseFloat(candle.low)
    const close = parseFloat(candle.close)

    const body = Math.abs(close - open)
    const range = high - low
    const upperWick = high - Math.max(open, close)
    const lowerWick = Math.min(open, close) - low

    const bodyPercent = (body / range) * 100
    const upperWickPercent = (upperWick / range) * 100
    const lowerWickPercent = (lowerWick / range) * 100

    const isBullish = close > open
    const patterns: string[] = []
    const signals: string[] = []

    // Pattern Recognition
    if (bodyPercent < 10 && range > 0) {
      patterns.push('Doji - Indecision in the market')
      signals.push('⚠️ Potential reversal or continuation - wait for confirmation')
    }

    if (bodyPercent > 80) {
      patterns.push(isBullish ? 'Strong Bullish Marubozu' : 'Strong Bearish Marubozu')
      signals.push(isBullish ? '🟢 Strong buying pressure' : '🔴 Strong selling pressure')
    }

    if (upperWickPercent > 60 && bodyPercent < 30) {
      patterns.push('Shooting Star / Inverted Hammer')
      signals.push('⚠️ Potential bearish reversal - sellers rejected higher prices')
    }

    if (lowerWickPercent > 60 && bodyPercent < 30) {
      patterns.push('Hammer / Hanging Man')
      signals.push('⚠️ Potential bullish reversal - buyers rejected lower prices')
    }

    if (bodyPercent > 50 && upperWickPercent < 20 && lowerWickPercent < 20) {
      patterns.push(isBullish ? 'Bullish Engulfing Candidate' : 'Bearish Engulfing Candidate')
      signals.push(isBullish ? '🟢 Strong bullish momentum' : '🔴 Strong bearish momentum')
    }

    if (upperWickPercent > 40 && lowerWickPercent > 40) {
      patterns.push('Spinning Top - High volatility and indecision')
      signals.push('⚠️ Market is uncertain - avoid trading or use tight stops')
    }

    return { patterns, signals, bodyPercent, upperWickPercent, lowerWickPercent, isBullish }
  }

  const analyzeVolume = () => {
    const currentVol = parseFloat(volume)
    const prevVol = parseFloat(prevVolume)
    const volChange = ((currentVol - prevVol) / prevVol) * 100

    const analysis: string[] = []

    if (volChange > 50) {
      analysis.push('📊 Very high volume - strong conviction')
      analysis.push('✅ Price move is more reliable with high volume')
    } else if (volChange > 20) {
      analysis.push('📊 Above average volume - good participation')
    } else if (volChange < -20) {
      analysis.push('📊 Low volume - weak conviction')
      analysis.push('⚠️ Price move may lack follow-through')
    } else {
      analysis.push('📊 Average volume - normal market activity')
    }

    return { analysis, volChange }
  }

  const getEntrySignals = () => {
    const candleAnalysis = analyzeCandlestick()
    const volumeAnalysis = analyzeVolume()
    const signals: string[] = []

    if (candleAnalysis.isBullish && volumeAnalysis.volChange > 20) {
      signals.push('🟢 BULLISH SETUP: Strong bullish candle with high volume')
      signals.push('Consider LONG entry on pullback or breakout confirmation')
    } else if (!candleAnalysis.isBullish && volumeAnalysis.volChange > 20) {
      signals.push('🔴 BEARISH SETUP: Strong bearish candle with high volume')
      signals.push('Consider SHORT entry on rally or breakdown confirmation')
    }

    if (candleAnalysis.patterns.length === 0) {
      signals.push('📊 No clear pattern - wait for better setup')
    }

    return signals
  }

  const candleAnalysis = analyzeCandlestick()
  const volumeAnalysis = analyzeVolume()
  const entrySignals = getEntrySignals()

  return (
    <div className="price-action">
      <TradingBackground variant="price-action" />
      <h1>Price Action Analysis</h1>
      <p>Identify candlestick patterns and price action signals for better entry and exit timing</p>

      <div className="price-action-grid">
        <div className="input-section">
          <h3>Candlestick Data</h3>

          {/* Crypto Pair Selector */}
          <div className="form-group">
            <label>Crypto Pair</label>
            <select value={cryptoPair} onChange={(e) => setCryptoPair(e.target.value)}>
              <option>BTC/USDT</option>
              <option>ETH/USDT</option>
              <option>BNB/USDT</option>
              <option>SOL/USDT</option>
              <option>XRP/USDT</option>
              <option>ADA/USDT</option>
              <option>DOGE/USDT</option>
              <option>MATIC/USDT</option>
              <option>DOT/USDT</option>
              <option>AVAX/USDT</option>
            </select>
          </div>

          {/* Live Candle Data */}
          <CandleDataCard pair={cryptoPair} onUseCandleData={handleUseCandleData} />

          {/* Manual Input - Collapsible */}
          <CollapsibleSection title="Manual Input (Optional)" defaultOpen={false} badge="Advanced">
            <div className="form-group">
              <label>Timeframe</label>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                <option>1M</option>
                <option>5M</option>
                <option>15M</option>
                <option>30M</option>
                <option>1H</option>
                <option>4H</option>
                <option>1D</option>
                <option>1W</option>
              </select>
            </div>

          <div className="form-group">
            <label>Open Price</label>
            <input
              type="number"
              value={candle.open}
              onChange={(e) => setCandle({ ...candle, open: e.target.value })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>High Price</label>
            <input
              type="number"
              value={candle.high}
              onChange={(e) => setCandle({ ...candle, high: e.target.value })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Low Price</label>
            <input
              type="number"
              value={candle.low}
              onChange={(e) => setCandle({ ...candle, low: e.target.value })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Close Price</label>
            <input
              type="number"
              value={candle.close}
              onChange={(e) => setCandle({ ...candle, close: e.target.value })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Volume (Current)</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Volume (Previous)</label>
            <input
              type="number"
              value={prevVolume}
              onChange={(e) => setPrevVolume(e.target.value)}
            />
          </div>

          <div className="candle-visual">
            <h4>Candle Visualization</h4>
            <div className="candle-container">
              <div className={`candle ${candleAnalysis.isBullish ? 'bullish' : 'bearish'}`}>
                <div
                  className="wick upper"
                  style={{ height: `${candleAnalysis.upperWickPercent}%` }}
                />
                <div
                  className="body"
                  style={{ height: `${candleAnalysis.bodyPercent}%` }}
                />
                <div
                  className="wick lower"
                  style={{ height: `${candleAnalysis.lowerWickPercent}%` }}
                />
              </div>
            </div>
            <div className="candle-stats">
              <p>Body: {candleAnalysis.bodyPercent.toFixed(1)}%</p>
              <p>Upper Wick: {candleAnalysis.upperWickPercent.toFixed(1)}%</p>
              <p>Lower Wick: {candleAnalysis.lowerWickPercent.toFixed(1)}%</p>
            </div>
          </div>
        </CollapsibleSection>
        </div>

        <div className="analysis-section">
          <h3>Pattern Recognition</h3>

          <div className="analysis-card">
            <h4>Detected Patterns</h4>
            {candleAnalysis.patterns.length > 0 ? (
              candleAnalysis.patterns.map((pattern, index) => (
                <p key={index} className="pattern-item">📍 {pattern}</p>
              ))
            ) : (
              <p>No specific pattern detected</p>
            )}
          </div>

          <div className="analysis-card">
            <h4>Price Action Signals</h4>
            {candleAnalysis.signals.length > 0 ? (
              candleAnalysis.signals.map((signal, index) => (
                <p key={index} className="signal-item">{signal}</p>
              ))
            ) : (
              <p>No clear signals at this time</p>
            )}
          </div>

          <div className="analysis-card">
            <h4>Volume Analysis</h4>
            <p className="volume-change">
              Volume change: <strong>{volumeAnalysis.volChange > 0 ? '+' : ''}{volumeAnalysis.volChange.toFixed(1)}%</strong>
            </p>
            {volumeAnalysis.analysis.map((item, index) => (
              <p key={index} className="volume-item">{item}</p>
            ))}
          </div>

          <div className="analysis-card highlight">
            <h4>🎯 Entry Signals</h4>
            {entrySignals.length > 0 ? (
              entrySignals.map((signal, index) => (
                <p key={index} className="entry-signal">{signal}</p>
              ))
            ) : (
              <p>No clear entry signal - wait for better opportunity</p>
            )}
          </div>

          <div className="trading-checklist">
            <h4>✅ Pre-Trade Checklist</h4>
            <ul>
              <li>Is the pattern confirmed on higher timeframe?</li>
              <li>Is price near key support/resistance?</li>
              <li>Is volume supporting the move?</li>
              <li>Do you have a clear stop loss level?</li>
              <li>Is the risk/reward ratio at least 1:2?</li>
              <li>Are you following your trading plan?</li>
            </ul>
          </div>

          <div className="tips-section">
            <h4>💡 Price Action Tips</h4>
            <ul>
              <li><strong>Context matters:</strong> Always check higher timeframes</li>
              <li><strong>Confirm with volume:</strong> Strong moves need volume</li>
              <li><strong>Wait for confirmation:</strong> Don't predict, react</li>
              <li><strong>Use support/resistance:</strong> Best entries near key levels</li>
              <li><strong>Multiple timeframe analysis:</strong> Align signals across timeframes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceActionAnalysis

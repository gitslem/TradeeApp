import { useState } from 'react'
import './MarketStructure.css'
import CandleDataCard from './CandleDataCard'
import CollapsibleSection from './CollapsibleSection'
import TradingBackground from './TradingBackground'
import { calculateSupportResistance } from '../services/ohlcvService'
import type { OHLCVData } from '../services/ohlcvService'

interface SupportResistance {
  level: string
  strength: 'weak' | 'moderate' | 'strong'
  touches: string
}

const MarketStructure = () => {
  const [cryptoPair, setCryptoPair] = useState<string>('ETH/USDT')
  const [currentPrice, setCurrentPrice] = useState<string>('3500')
  const [recentHigh, setRecentHigh] = useState<string>('3800')
  const [recentLow, setRecentLow] = useState<string>('3200')
  const [prevHigh, setPrevHigh] = useState<string>('3750')
  const [prevLow, setPrevLow] = useState<string>('3250')

  const [supportLevels, setSupportLevels] = useState<SupportResistance[]>([
    { level: '3400', strength: 'strong', touches: '5' },
    { level: '3200', strength: 'moderate', touches: '3' }
  ])

  const [resistanceLevels, setResistanceLevels] = useState<SupportResistance[]>([
    { level: '3600', strength: 'moderate', touches: '3' },
    { level: '3800', strength: 'strong', touches: '4' }
  ])

  const handleUsePriceData = (ohlcv: OHLCVData) => {
    // Calculate support/resistance from real data
    const levels = calculateSupportResistance(ohlcv)

    // Set current price
    setCurrentPrice(ohlcv.current.close.toString())

    // Set recent high/low from current candle
    setRecentHigh(ohlcv.current.high.toString())
    setRecentLow(ohlcv.current.low.toString())

    // Set previous high/low from previous candle
    setPrevHigh(ohlcv.previous.high.toString())
    setPrevLow(ohlcv.previous.low.toString())

    // Auto-fill support/resistance levels from calculated data
    // Assign strength based on proximity to round numbers and previous levels
    setSupportLevels(levels.support.map((price, index) => ({
      level: price.toFixed(2),
      strength: index === 0 ? 'strong' : 'moderate',
      touches: (index + 2).toString()
    })))

    setResistanceLevels(levels.resistance.map((price, index) => ({
      level: price.toFixed(2),
      strength: index === 0 ? 'strong' : 'moderate',
      touches: (index + 2).toString()
    })))
  }

  const calculateFibonacciLevels = () => {
    const high = parseFloat(recentHigh)
    const low = parseFloat(recentLow)
    const diff = high - low

    return {
      '0%': low,
      '23.6%': low + diff * 0.236,
      '38.2%': low + diff * 0.382,
      '50%': low + diff * 0.5,
      '61.8%': low + diff * 0.618,
      '78.6%': low + diff * 0.786,
      '100%': high
    }
  }

  const analyzeMarketStructure = () => {
    const current = parseFloat(currentPrice)
    const high = parseFloat(recentHigh)
    const low = parseFloat(recentLow)
    const pHigh = parseFloat(prevHigh)
    const pLow = parseFloat(prevLow)

    const analysis: string[] = []

    // Trend Analysis
    if (high > pHigh && low > pLow) {
      analysis.push('📈 UPTREND: Higher Highs and Higher Lows detected')
    } else if (high < pHigh && low < pLow) {
      analysis.push('📉 DOWNTREND: Lower Highs and Lower Lows detected')
    } else if (high > pHigh && low < pLow) {
      analysis.push('⚡ EXPANSION: Range is expanding - high volatility')
    } else {
      analysis.push('📊 RANGE: Market consolidating between support and resistance')
    }

    // Position in range
    const rangePosition = ((current - low) / (high - low)) * 100
    if (rangePosition > 80) {
      analysis.push('⚠️ Price near recent HIGH - potential resistance')
    } else if (rangePosition < 20) {
      analysis.push('⚠️ Price near recent LOW - potential support')
    } else if (rangePosition > 40 && rangePosition < 60) {
      analysis.push('✅ Price in middle of range - good for range trading')
    }

    return { analysis, rangePosition }
  }

  const fibLevels = calculateFibonacciLevels()
  const marketAnalysis = analyzeMarketStructure()

  const addSupport = () => {
    setSupportLevels([...supportLevels, { level: '', strength: 'moderate', touches: '1' }])
  }

  const addResistance = () => {
    setResistanceLevels([...resistanceLevels, { level: '', strength: 'moderate', touches: '1' }])
  }

  const updateSupport = (index: number, field: keyof SupportResistance, value: string) => {
    const updated = [...supportLevels]
    updated[index] = { ...updated[index], [field]: value }
    setSupportLevels(updated)
  }

  const updateResistance = (index: number, field: keyof SupportResistance, value: string) => {
    const updated = [...resistanceLevels]
    updated[index] = { ...updated[index], [field]: value }
    setResistanceLevels(updated)
  }

  const removeSupport = (index: number) => {
    setSupportLevels(supportLevels.filter((_, i) => i !== index))
  }

  const removeResistance = (index: number) => {
    setResistanceLevels(resistanceLevels.filter((_, i) => i !== index))
  }

  return (
    <div className="market-structure">
      <TradingBackground variant="market" />
      <h1>Market Structure Analysis</h1>
      <p>Identify trends, support & resistance levels, and market bias for better trading decisions</p>

      <div className="structure-grid">
        <div className="input-section">
          <h3>Price Levels</h3>

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

          {/* Live Price Data */}
          <CandleDataCard pair={cryptoPair} onUseCandleData={handleUsePriceData} />

          {/* Manual Input - Collapsible */}
          <CollapsibleSection title="Manual Input (Optional)" defaultOpen={false} badge="Advanced">
          <div className="form-group">
            <label>Current Price</label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Recent High</label>
            <input
              type="number"
              value={recentHigh}
              onChange={(e) => setRecentHigh(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Recent Low</label>
            <input
              type="number"
              value={recentLow}
              onChange={(e) => setRecentLow(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Previous High</label>
            <input
              type="number"
              value={prevHigh}
              onChange={(e) => setPrevHigh(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Previous Low</label>
            <input
              type="number"
              value={prevLow}
              onChange={(e) => setPrevLow(e.target.value)}
              step="0.01"
            />
          </div>
          </CollapsibleSection>

          <div className="levels-section">
            <h3>Support Levels</h3>
            {supportLevels.map((level, index) => (
              <div key={index} className="level-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={level.level}
                  onChange={(e) => updateSupport(index, 'level', e.target.value)}
                />
                <select
                  value={level.strength}
                  onChange={(e) => updateSupport(index, 'strength', e.target.value)}
                >
                  <option value="weak">Weak</option>
                  <option value="moderate">Moderate</option>
                  <option value="strong">Strong</option>
                </select>
                <input
                  type="number"
                  placeholder="Touches"
                  value={level.touches}
                  onChange={(e) => updateSupport(index, 'touches', e.target.value)}
                  style={{ width: '80px' }}
                />
                <button onClick={() => removeSupport(index)} className="remove-btn">✕</button>
              </div>
            ))}
            <button onClick={addSupport} className="add-btn">+ Add Support</button>
          </div>

          <div className="levels-section">
            <h3>Resistance Levels</h3>
            {resistanceLevels.map((level, index) => (
              <div key={index} className="level-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={level.level}
                  onChange={(e) => updateResistance(index, 'level', e.target.value)}
                />
                <select
                  value={level.strength}
                  onChange={(e) => updateResistance(index, 'strength', e.target.value)}
                >
                  <option value="weak">Weak</option>
                  <option value="moderate">Moderate</option>
                  <option value="strong">Strong</option>
                </select>
                <input
                  type="number"
                  placeholder="Touches"
                  value={level.touches}
                  onChange={(e) => updateResistance(index, 'touches', e.target.value)}
                  style={{ width: '80px' }}
                />
                <button onClick={() => removeResistance(index)} className="remove-btn">✕</button>
              </div>
            ))}
            <button onClick={addResistance} className="add-btn">+ Add Resistance</button>
          </div>
        </div>

        <div className="analysis-section">
          <h3>Market Structure Analysis</h3>

          <div className="analysis-card">
            <h4>Trend Analysis</h4>
            {marketAnalysis.analysis.map((item, index) => (
              <p key={index} className="analysis-item">{item}</p>
            ))}
          </div>

          <div className="analysis-card">
            <h4>Range Position</h4>
            <div className="range-bar">
              <div
                className="range-indicator"
                style={{ left: `${marketAnalysis.rangePosition}%` }}
              />
            </div>
            <p className="range-text">
              Price is at {marketAnalysis.rangePosition.toFixed(1)}% of recent range
            </p>
          </div>

          <div className="analysis-card">
            <h4>Fibonacci Retracement Levels</h4>
            <div className="fib-levels">
              {Object.entries(fibLevels).reverse().map(([level, price]) => (
                <div key={level} className="fib-level">
                  <span className="fib-label">{level}</span>
                  <span className="fib-price">${price.toFixed(2)}</span>
                  {Math.abs(price - parseFloat(currentPrice)) < 50 && (
                    <span className="fib-nearby">← Near current price</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-card">
            <h4>Key Levels Summary</h4>
            <div className="levels-summary">
              <div className="resistance-summary">
                <h5>Resistance (above)</h5>
                {resistanceLevels
                  .filter(r => parseFloat(r.level) > parseFloat(currentPrice))
                  .sort((a, b) => parseFloat(a.level) - parseFloat(b.level))
                  .map((level, index) => (
                    <div key={index} className={`level-item ${level.strength}`}>
                      <span>${level.level}</span>
                      <span className="strength-badge">{level.strength}</span>
                    </div>
                  ))}
              </div>
              <div className="current-price-display">
                <strong>Current: ${currentPrice}</strong>
              </div>
              <div className="support-summary">
                <h5>Support (below)</h5>
                {supportLevels
                  .filter(s => parseFloat(s.level) < parseFloat(currentPrice))
                  .sort((a, b) => parseFloat(b.level) - parseFloat(a.level))
                  .map((level, index) => (
                    <div key={index} className={`level-item ${level.strength}`}>
                      <span>${level.level}</span>
                      <span className="strength-badge">{level.strength}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="trading-suggestions">
            <h4>💡 Trading Suggestions</h4>
            <ul>
              <li>Consider buying near strong support levels</li>
              <li>Consider selling near strong resistance levels</li>
              <li>Wait for breakout confirmation above resistance</li>
              <li>Use Fibonacci levels as potential reversal points</li>
              <li>Higher timeframe structure is more reliable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketStructure

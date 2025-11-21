import { useState } from 'react'
import './PositionCalculator.css'
import LivePriceCard from './LivePriceCard'
import FloatingExchangeSelector from './FloatingExchangeSelector'
import CollapsibleSection from './CollapsibleSection'
import TradingBackground from './TradingBackground'
import { getExchangeFees, getMaxLeverage, getMaintenanceMargin, calculateFundingCost, EXCHANGES } from '../config/exchanges'
import type { AccountType } from '../config/exchanges'

interface TakeProfitResult {
  name: string
  price: number
  percentGain: number
  profit: number
  rrRatio: number
}

interface CalculationResults {
  stopLossDistance: number
  riskAmount: number
  positionSize: number
  positionValue: number
  quantity: number
  potentialProfit: number
  riskRewardRatio: number
  liquidationPrice: number
  marginRequired: number
  distanceToLiquidation: number
  leveragedPositionSize: number
  breakevenPrice: number
  winRateNeeded: number
  takeProfitResults: TakeProfitResult[]
  maintenanceMargin: number
  maintenanceMarginRate: number
  totalFees: number
  fundingCost: number
}

const PositionCalculator = () => {
  const [accountBalance, setAccountBalance] = useState<string>('10000')
  const [riskPercentage, setRiskPercentage] = useState<string>('1')
  const [entryPrice, setEntryPrice] = useState<string>('3500')
  const [stopPrice, setStopPrice] = useState<string>('3400')
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('3800')
  const [tp2Price, setTp2Price] = useState<string>('')
  const [tp3Price, setTp3Price] = useState<string>('')
  const [cryptoPair, setCryptoPair] = useState<string>('ETH/USDT')
  const [positionType, setPositionType] = useState<'long' | 'short'>('long')
  const [leverage, setLeverage] = useState<string>('1')
  const [useLeverage, setUseLeverage] = useState<boolean>(false)
  const [selectedExchange, setSelectedExchange] = useState<string>('binance')
  const [accountType, setAccountType] = useState<AccountType>('futures')

  // Get exchange-specific fees
  const exchangeFees = getExchangeFees(selectedExchange, accountType)
  const maxLeverageAllowed = getMaxLeverage(selectedExchange, accountType)

  const calculatePosition = (): CalculationResults | null => {
    const balance = parseFloat(accountBalance)
    const risk = parseFloat(riskPercentage)
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopPrice)
    const takeProfit = parseFloat(takeProfitPrice)
    const tp2 = parseFloat(tp2Price)
    const tp3 = parseFloat(tp3Price)
    const lev = useLeverage ? parseFloat(leverage) : 1
    const feePercent = exchangeFees.taker / 100 // Use exchange-specific taker fee

    if (isNaN(balance) || isNaN(risk) || isNaN(entry) || isNaN(stop) || isNaN(lev)) {
      return null
    }

    // Stop-Loss % Distance = |Entry Price – Stop Price| ÷ Entry Price
    const stopLossDistance = Math.abs(entry - stop) / entry

    // Risk Amount = Account Balance × Risk % per Trade
    const riskAmount = balance * (risk / 100)

    // Position Size = (Account Balance × Risk % per Trade) ÷ Stop Loss % Distance
    const positionSize = riskAmount / stopLossDistance

    // Position Value in base currency (Quantity)
    const positionValue = positionSize / entry
    const quantity = positionValue

    // Leveraged Position Size (total notional value)
    const leveragedPositionSize = positionSize * lev

    // Margin Required (collateral needed for leveraged position)
    const marginRequired = leveragedPositionSize / lev

    // Liquidation Price Calculation
    // For LONG: Liquidation Price = Entry Price × (1 - 1/Leverage)
    // For SHORT: Liquidation Price = Entry Price × (1 + 1/Leverage)
    let liquidationPrice = 0
    if (useLeverage && lev > 1) {
      if (positionType === 'long') {
        liquidationPrice = entry * (1 - 1 / lev)
      } else {
        liquidationPrice = entry * (1 + 1 / lev)
      }
    }

    // Distance to liquidation (as percentage)
    const distanceToLiquidation = liquidationPrice > 0
      ? (Math.abs(entry - liquidationPrice) / entry) * 100
      : 0

    // Breakeven Price (accounting for trading fees)
    const breakevenDistance = entry * feePercent * 2 // Entry + Exit fee
    const breakevenPrice = positionType === 'long'
      ? entry + breakevenDistance
      : entry - breakevenDistance

    // Take Profit Results
    const takeProfitResults: TakeProfitResult[] = []

    if (!isNaN(takeProfit)) {
      const tpDistance = Math.abs(takeProfit - entry)
      const tpPercentDistance = (tpDistance / entry) * 100
      const potentialProfit = quantity * tpDistance * lev
      const rrRatio = tpDistance / Math.abs(entry - stop)

      takeProfitResults.push({
        name: 'TP1',
        price: takeProfit,
        percentGain: tpPercentDistance,
        profit: potentialProfit,
        rrRatio: rrRatio
      })
    }

    if (!isNaN(tp2)) {
      const tpDistance = Math.abs(tp2 - entry)
      const tpPercentDistance = (tpDistance / entry) * 100
      const potentialProfit = quantity * tpDistance * lev
      const rrRatio = tpDistance / Math.abs(entry - stop)

      takeProfitResults.push({
        name: 'TP2',
        price: tp2,
        percentGain: tpPercentDistance,
        profit: potentialProfit,
        rrRatio: rrRatio
      })
    }

    if (!isNaN(tp3)) {
      const tpDistance = Math.abs(tp3 - entry)
      const tpPercentDistance = (tpDistance / entry) * 100
      const potentialProfit = quantity * tpDistance * lev
      const rrRatio = tpDistance / Math.abs(entry - stop)

      takeProfitResults.push({
        name: 'TP3',
        price: tp3,
        percentGain: tpPercentDistance,
        profit: potentialProfit,
        rrRatio: rrRatio
      })
    }

    // Primary Potential Profit and R:R
    const potentialProfit = takeProfitResults.length > 0 ? takeProfitResults[0].profit : 0
    const riskRewardRatio = takeProfitResults.length > 0 ? takeProfitResults[0].rrRatio : 0

    // Win Rate Needed (to break even)
    const winRateNeeded = riskRewardRatio > 0 ? (1 / (1 + riskRewardRatio)) * 100 : 0

    // Maintenance Margin Calculation
    const maintenanceMarginRate = getMaintenanceMargin(selectedExchange, lev)
    const maintenanceMargin = (leveragedPositionSize * maintenanceMarginRate) / 100

    // Fee Calculations
    const entryFee = positionSize * (exchangeFees.taker / 100)
    const exitFee = positionSize * (exchangeFees.taker / 100)
    const totalFees = entryFee + exitFee

    // Funding Cost (24 hours for futures)
    const fundingCost = accountType === 'futures'
      ? calculateFundingCost(selectedExchange, accountType, leveragedPositionSize, 24)
      : 0

    return {
      stopLossDistance: stopLossDistance * 100,
      riskAmount,
      positionSize,
      positionValue,
      quantity,
      potentialProfit,
      riskRewardRatio,
      liquidationPrice,
      marginRequired,
      distanceToLiquidation,
      leveragedPositionSize,
      breakevenPrice,
      winRateNeeded,
      takeProfitResults,
      maintenanceMargin,
      maintenanceMarginRate,
      totalFees,
      fundingCost
    }
  }

  const results = calculatePosition()

  const validatePosition = (): string[] => {
    const warnings: string[] = []
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopPrice)
    const takeProfit = parseFloat(takeProfitPrice)
    const risk = parseFloat(riskPercentage)
    const lev = useLeverage ? parseFloat(leverage) : 1

    if (positionType === 'long') {
      if (stop >= entry) {
        warnings.push('⚠️ For LONG positions, stop loss should be below entry price')
      }
      if (!isNaN(takeProfit) && takeProfit <= entry) {
        warnings.push('⚠️ For LONG positions, take profit should be above entry price')
      }
    } else {
      if (stop <= entry) {
        warnings.push('⚠️ For SHORT positions, stop loss should be above entry price')
      }
      if (!isNaN(takeProfit) && takeProfit >= entry) {
        warnings.push('⚠️ For SHORT positions, take profit should be below entry price')
      }
    }

    if (risk > 2) {
      warnings.push('⚠️ Risk per trade > 2% is considered aggressive')
    }

    if (results && results.riskRewardRatio < 2 && results.riskRewardRatio > 0) {
      warnings.push('⚠️ Risk/Reward ratio below 2:1 - consider better entry/exit')
    }

    if (results && results.riskRewardRatio < 1.5 && results.riskRewardRatio > 0) {
      warnings.push('⚠️ LOW R:R: Risk/reward ratio below 1:1.5. Consider better TP target or tighter stop-loss')
    }

    if (results && results.positionSize > parseFloat(accountBalance) * 0.5) {
      warnings.push(`⚠️ LARGE POSITION: This is ${((results.positionSize / parseFloat(accountBalance)) * 100).toFixed(1)}% of your account`)
    }

    // Leverage warnings
    if (useLeverage && lev > 1) {
      // Check exchange leverage limit
      if (lev > maxLeverageAllowed) {
        warnings.push(`🚨 INVALID: ${selectedExchange} ${accountType} max leverage is ${maxLeverageAllowed}x`)
      }

      if (lev >= 20) {
        warnings.push('🚨 EXTREME RISK: Leverage ≥20x can lead to instant liquidation')
      } else if (lev >= 10) {
        warnings.push('⚠️ HIGH RISK: Leverage ≥10x is extremely dangerous')
      } else if (lev >= 5) {
        warnings.push('⚠️ Leverage ≥5x increases liquidation risk significantly')
      }

      // Check if stop loss is beyond liquidation price
      if (results && results.liquidationPrice > 0) {
        if (positionType === 'long' && stop < results.liquidationPrice) {
          warnings.push('🚨 CRITICAL: Stop loss is beyond liquidation price - you\'ll be liquidated first!')
        } else if (positionType === 'short' && stop > results.liquidationPrice) {
          warnings.push('🚨 CRITICAL: Stop loss is beyond liquidation price - you\'ll be liquidated first!')
        }
      }

      // Distance to liquidation warnings
      if (results && results.distanceToLiquidation < 5 && results.distanceToLiquidation > 0) {
        warnings.push('🚨 DANGER: Liquidation price is within 5% of entry - very risky!')
      }
    }

    return warnings
  }

  const warnings = validatePosition()

  const handleUseCurrentPrice = (price: number) => {
    setEntryPrice(price.toString())
  }

  return (
    <div className="position-calculator">
      <TradingBackground variant="calculator" />
      <h1>Position Calculator</h1>
      <p>Calculate optimal position sizes based on your risk tolerance and trading strategy</p>

      <FloatingExchangeSelector
        selectedExchange={selectedExchange}
        onSelectExchange={setSelectedExchange}
      />

      <div className="calculator-grid">
        <div className="input-section">
          <h2>Trading Setup</h2>

          {/* Account Type Selector */}
          <div className="form-group">
            <label>Account Type</label>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}>
              {EXCHANGES[selectedExchange].accountTypes.spot && <option value="spot">Spot Trading</option>}
              {EXCHANGES[selectedExchange].accountTypes.futures && <option value="futures">Futures Trading</option>}
              {EXCHANGES[selectedExchange].accountTypes.margin && <option value="margin">Margin Trading</option>}
            </select>
          </div>

          {/* Basic Setup - Always Visible */}
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

          <LivePriceCard pair={cryptoPair} onUsePrice={handleUseCurrentPrice} />

          <div className="form-group">
            <label>Position Type</label>
            <div className="radio-group">
              <label className={positionType === 'long' ? 'active' : ''}>
                <input
                  type="radio"
                  checked={positionType === 'long'}
                  onChange={() => setPositionType('long')}
                />
                Long (Buy)
              </label>
              <label className={positionType === 'short' ? 'active' : ''}>
                <input
                  type="radio"
                  checked={positionType === 'short'}
                  onChange={() => setPositionType('short')}
                />
                Short (Sell)
              </label>
            </div>
          </div>

          {/* Risk Management Section - Collapsible, Default Open */}
          <CollapsibleSection title="Risk Management" defaultOpen={true} badge="Essential">
            <div className="form-group">
              <label>Account Balance (USDT)</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                placeholder="10000"
              />
            </div>

            <div className="form-group">
              <label>Risk Per Trade (%)</label>
              <input
                type="number"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(e.target.value)}
                placeholder="1"
                step="0.1"
              />
              <small>Recommended: 1-2% per trade</small>
            </div>

            <div className="form-group">
              <label>Entry Price (USDT)</label>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="3500"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Stop Loss Price (USDT)</label>
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="3400"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Take Profit 1 (USDT)</label>
              <input
                type="number"
                value={takeProfitPrice}
                onChange={(e) => setTakeProfitPrice(e.target.value)}
                placeholder="3800"
                step="0.01"
              />
            </div>
          </CollapsibleSection>

          {/* Leverage Settings - Collapsible */}
          <CollapsibleSection title="Leverage Settings" defaultOpen={useLeverage} badge={useLeverage ? `${leverage}x` : 'Optional'}>
            <div className="form-group leverage-toggle">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useLeverage}
                  onChange={(e) => setUseLeverage(e.target.checked)}
                />
                <span>Use Leverage Trading</span>
              </label>
              <small>⚠️ Leverage increases both profit potential and risk of liquidation</small>
            </div>

            {useLeverage && (
              <div className="form-group leverage-section">
                <label>Leverage (Max: {maxLeverageAllowed}x for {selectedExchange})</label>
                <select value={leverage} onChange={(e) => setLeverage(e.target.value)}>
                  <option value="1">1x (No Leverage)</option>
                  {[2, 3, 5, 10, 20, 25, 50, 75, 100, 125].map((lev) =>
                    lev <= maxLeverageAllowed ? (
                      <option key={lev} value={lev}>{lev}x</option>
                    ) : null
                  )}
                </select>
                <small>Higher leverage = Higher liquidation risk | Max for this platform: {maxLeverageAllowed}x</small>
              </div>
            )}
          </CollapsibleSection>

          {/* Advanced Options - Collapsible */}
          <CollapsibleSection title="Advanced Options" defaultOpen={false} badge="Optional">
            <div className="form-group">
              <label>Take Profit 2 (USDT) - Optional</label>
              <input
                type="number"
                value={tp2Price}
                onChange={(e) => setTp2Price(e.target.value)}
                placeholder="4000"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Take Profit 3 (USDT) - Optional</label>
              <input
                type="number"
                value={tp3Price}
                onChange={(e) => setTp3Price(e.target.value)}
                placeholder="4200"
                step="0.01"
              />
            </div>
          </CollapsibleSection>
        </div>

        <div className="results-section">
          <h2>Position Details</h2>

          {results ? (
            <>
              <div className="result-card highlight">
                <h3>Position Size</h3>
                <div className="result-value">${results.positionSize.toFixed(2)}</div>
                <div className="result-subtext">Total position value</div>
              </div>

              <div className="result-card">
                <h3>Quantity to Trade</h3>
                <div className="result-value">{results.quantity.toFixed(6)}</div>
                <div className="result-subtext">{cryptoPair.split('/')[0]} to {positionType === 'long' ? 'buy' : 'sell'}</div>
              </div>

              <div className="result-card">
                <h3>Risk Amount</h3>
                <div className="result-value">${results.riskAmount.toFixed(2)}</div>
                <div className="result-subtext">{riskPercentage}% of account</div>
              </div>

              <div className="result-card">
                <h3>Stop Loss Distance</h3>
                <div className="result-value">{results.stopLossDistance.toFixed(2)}%</div>
                <div className="result-subtext">${Math.abs(parseFloat(entryPrice) - parseFloat(stopPrice)).toFixed(2)} per unit</div>
              </div>

              {useLeverage && parseFloat(leverage) > 1 && (
                <>
                  <div className="result-card leverage-info">
                    <h3>Leverage Position</h3>
                    <div className="result-value">{leverage}x</div>
                    <div className="result-subtext">Total notional: ${results.leveragedPositionSize.toFixed(2)}</div>
                  </div>

                  <div className="result-card">
                    <h3>Margin Required</h3>
                    <div className="result-value">${results.marginRequired.toFixed(2)}</div>
                    <div className="result-subtext">Collateral needed</div>
                  </div>

                  <div className="result-card">
                    <h3>Maintenance Margin</h3>
                    <div className="result-value">${results.maintenanceMargin.toFixed(2)}</div>
                    <div className="result-subtext">{results.maintenanceMarginRate.toFixed(2)}% of position</div>
                  </div>

                  <div className="result-card danger">
                    <h3>Liquidation Price</h3>
                    <div className="result-value">${results.liquidationPrice.toFixed(2)}</div>
                    <div className="result-subtext">
                      {results.distanceToLiquidation.toFixed(2)}% from entry
                      {results.distanceToLiquidation < 10 ? ' ⚠️ VERY CLOSE!' : ''}
                    </div>
                  </div>

                  {accountType === 'futures' && results.fundingCost > 0 && (
                    <div className="result-card">
                      <h3>Funding Cost (24h)</h3>
                      <div className="result-value">${results.fundingCost.toFixed(2)}</div>
                      <div className="result-subtext">{exchangeFees.funding}% per funding</div>
                    </div>
                  )}
                </>
              )}

              <div className="result-card">
                <h3>Total Trading Fees</h3>
                <div className="result-value">${results.totalFees.toFixed(2)}</div>
                <div className="result-subtext">Entry + Exit ({exchangeFees.taker}% each)</div>
              </div>

              <div className="result-card">
                <h3>Breakeven Price</h3>
                <div className="result-value">${results.breakevenPrice.toFixed(2)}</div>
                <div className="result-subtext">Including {exchangeFees.taker}% fees</div>
              </div>

              {results.takeProfitResults.length > 0 && (
                <>
                  <div className="result-card">
                    <h3>Win Rate Needed</h3>
                    <div className="result-value">{results.winRateNeeded.toFixed(1)}%</div>
                    <div className="result-subtext">To break even with this R:R ratio</div>
                  </div>

                  <div className="tp-targets-section">
                    <h3 className="tp-section-title">Take Profit Targets</h3>
                    {results.takeProfitResults.map((tp, index) => (
                      <div key={index} className="result-card success tp-target">
                        <h3>{tp.name} - ${tp.price.toFixed(2)}</h3>
                        <div className="result-value">${tp.profit.toFixed(2)}</div>
                        <div className="result-subtext">
                          +{tp.percentGain.toFixed(2)}% gain | R:R = 1:{tp.rrRatio.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {warnings.length > 0 && (
                <div className="warnings">
                  <h3>⚠️ Warnings</h3>
                  {warnings.map((warning, index) => (
                    <p key={index}>{warning}</p>
                  ))}
                </div>
              )}

              <div className="quick-stats">
                <h3>Quick Stats</h3>
                <ul>
                  <li>
                    <strong>Pair:</strong> {cryptoPair} - {positionType.toUpperCase()}
                  </li>
                  <li>
                    <strong>Entry:</strong> ${parseFloat(entryPrice).toFixed(2)}
                  </li>
                  <li>
                    <strong>Stop Loss:</strong> ${parseFloat(stopPrice).toFixed(2)}
                  </li>
                  <li>
                    <strong>Breakeven:</strong> ${results.breakevenPrice.toFixed(2)}
                  </li>
                  {results.takeProfitResults.map((tp, index) => (
                    <li key={index}>
                      <strong>{tp.name}:</strong> ${tp.price.toFixed(2)} (+{tp.percentGain.toFixed(2)}%)
                    </li>
                  ))}
                  {useLeverage && parseFloat(leverage) > 1 && (
                    <li className="liquidation-stat">
                      <strong>Liquidation:</strong> ${results.liquidationPrice.toFixed(2)}
                    </li>
                  )}
                  <li>
                    <strong>Quantity:</strong> {results.quantity.toFixed(6)} {cryptoPair.split('/')[0]}
                  </li>
                  <li>
                    <strong>Max Loss:</strong> ${results.riskAmount.toFixed(2)} ({riskPercentage}%)
                  </li>
                  {useLeverage && parseFloat(leverage) > 1 && (
                    <li>
                      <strong>Leverage:</strong> {leverage}x
                    </li>
                  )}
                  {results.takeProfitResults.length > 0 && (
                    <li>
                      <strong>Win Rate Needed:</strong> {results.winRateNeeded.toFixed(1)}%
                    </li>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>Enter valid values to calculate position size</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PositionCalculator

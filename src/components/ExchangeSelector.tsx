import { useState } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import { EXCHANGES, getExchangeConfig } from '../config/exchanges'
import type { AccountType } from '../config/exchanges'
import './ExchangeSelector.css'

interface ExchangeSelectorProps {
  selectedExchange: string
  selectedAccountType: AccountType
  onExchangeChange: (exchangeId: string) => void
  onAccountTypeChange: (accountType: AccountType) => void
}

const ExchangeSelector = ({
  selectedExchange,
  selectedAccountType,
  onExchangeChange,
  onAccountTypeChange
}: ExchangeSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const currentExchange = getExchangeConfig(selectedExchange)
  const currentFees = currentExchange.fees[selectedAccountType]
  const maxLev = currentExchange.maxLeverage[selectedAccountType]

  const accountTypeLabels = {
    spot: 'Spot Trading',
    futures: 'Futures Trading',
    margin: 'Margin Trading'
  }

  const accountTypeDescriptions = {
    spot: 'Buy/sell crypto directly without leverage',
    futures: 'Trade perpetual contracts with high leverage',
    margin: 'Borrow funds to trade with moderate leverage'
  }

  return (
    <div className="exchange-selector">
      <div className="selector-header">
        <h3>Exchange Platform</h3>
        <div className="info-tooltip">
          <Info size={16} />
          <span className="tooltip-text">
            Select your trading platform to use accurate fees and limits
          </span>
        </div>
      </div>

      {/* Exchange Selection */}
      <div className="exchange-grid">
        {Object.values(EXCHANGES).map((exchange) => (
          <button
            key={exchange.id}
            className={`exchange-card ${selectedExchange === exchange.id ? 'active' : ''}`}
            onClick={() => onExchangeChange(exchange.id)}
          >
            <span className="exchange-icon">{exchange.icon}</span>
            <span className="exchange-name">{exchange.displayName}</span>
          </button>
        ))}
      </div>

      {/* Account Type Selection */}
      <div className="account-type-section">
        <h4>Account Type</h4>
        <div className="account-type-grid">
          {(Object.keys(currentExchange.accountTypes) as AccountType[]).map((type) => {
            const isAvailable = currentExchange.accountTypes[type]
            return (
              <button
                key={type}
                className={`account-type-card ${selectedAccountType === type ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                onClick={() => isAvailable && onAccountTypeChange(type)}
                disabled={!isAvailable}
              >
                <div className="account-type-header">
                  <span className="account-type-label">{accountTypeLabels[type]}</span>
                  {!isAvailable && <span className="unavailable-badge">N/A</span>}
                </div>
                <p className="account-type-desc">{accountTypeDescriptions[type]}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Fee Information */}
      <div className="fee-info-card">
        <div className="fee-info-header">
          <h4>Fee Structure - {currentExchange.displayName}</h4>
          <span className="account-badge">{accountTypeLabels[selectedAccountType]}</span>
        </div>

        <div className="fee-stats">
          <div className="fee-stat">
            <span className="fee-label">Maker Fee</span>
            <span className="fee-value">{currentFees.maker}%</span>
          </div>
          <div className="fee-stat">
            <span className="fee-label">Taker Fee</span>
            <span className="fee-value">{currentFees.taker}%</span>
          </div>
          {selectedAccountType === 'futures' && (
            <div className="fee-stat">
              <span className="fee-label">Funding Rate</span>
              <span className="fee-value">{currentFees.funding}%</span>
            </div>
          )}
          <div className="fee-stat">
            <span className="fee-label">Max Leverage</span>
            <span className="fee-value">{maxLev}x</span>
          </div>
        </div>

        {selectedAccountType === 'futures' && (
          <div className="funding-note">
            <Info size={14} />
            <span>Funding every {currentExchange.fundingInterval} hours</span>
          </div>
        )}
      </div>

      {/* Quick Tips - Collapsible */}
      <button
        className="tips-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span>Platform Tips & Details</span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="exchange-tips">
          <ul>
            {selectedExchange === 'binance' && (
              <>
                <li>Largest exchange with highest liquidity</li>
                <li>Lowest fees for high-volume traders</li>
                <li>Up to 125x leverage on futures</li>
              </>
            )}
            {selectedExchange === 'bybit' && (
              <>
                <li>Popular for derivatives trading</li>
                <li>User-friendly interface for beginners</li>
                <li>Up to 100x leverage on perpetuals</li>
              </>
            )}
            {selectedExchange === 'kucoin' && (
              <>
                <li>Wide selection of altcoins</li>
                <li>Good for margin trading</li>
                <li>Competitive futures fees</li>
              </>
            )}
            {selectedExchange === 'coinbase' && (
              <>
                <li>Most regulated US exchange</li>
                <li>Best for spot trading only</li>
                <li>No leverage trading available</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ExchangeSelector

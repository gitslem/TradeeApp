import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, TrendingUp, TrendingDown, Calendar, DollarSign, Target,
  Download, Edit2, Trash2, CheckCircle, Clock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { tradeService } from '../services/tradeService'
import { EXCHANGES } from '../config/exchanges'
import TradingBackground from './TradingBackground'
import type { Trade, TradeStats } from '../services/tradeService'
import './TradingJournal.css'

const TradingJournal = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const [trades, setTrades] = useState<Trade[]>([])
  const [stats, setStats] = useState<TradeStats | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'wins' | 'losses'>('all')

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (loading) return

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user) {
      loadTrades()
    }
  }, [user, isAuthenticated, loading, navigate])

  const loadTrades = () => {
    if (!user) return
    const userTrades = tradeService.getAllTrades(user.email)
    setTrades(userTrades)
    const userStats = tradeService.calculateStats(user.email)
    setStats(userStats)
  }

  const handleAddTrade = () => {
    setEditingTrade(null)
    setShowAddModal(true)
  }

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade)
    setShowAddModal(true)
  }

  const handleDeleteTrade = (tradeId: string) => {
    if (!user) return
    if (confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
      const success = tradeService.deleteTrade(user.email, tradeId)
      if (success) {
        loadTrades()
        alert('Trade deleted successfully!')
      } else {
        alert('Failed to delete trade. Please try again.')
      }
    }
  }

  const handleCloseTrade = (trade: Trade) => {
    if (!user || trade.status === 'closed') return

    const exitPrice = prompt(`Enter exit price for ${trade.pair}:`)
    if (!exitPrice) return

    const price = parseFloat(exitPrice)
    if (isNaN(price) || price <= 0) {
      alert('Invalid price. Please enter a valid positive number.')
      return
    }

    const closedTrade = tradeService.closeTrade(user.email, trade.id, price, new Date().toISOString())
    if (closedTrade) {
      loadTrades()
      const isProfitable = closedTrade.profitLoss > 0
      alert(`Trade closed successfully!\n\nP&L: ${isProfitable ? '+' : ''}$${closedTrade.profitLoss.toFixed(2)} (${isProfitable ? '+' : ''}${closedTrade.profitLossPercent.toFixed(2)}%)`)
    } else {
      alert('Failed to close trade. Please try again.')
    }
  }

  const handleExportCSV = () => {
    if (!user) return

    if (trades.length === 0) {
      alert('No trades to export. Add some trades first!')
      return
    }

    try {
      const csv = tradeService.exportToCSV(user.email)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trading-journal-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      alert(`Successfully exported ${trades.length} trade${trades.length === 1 ? '' : 's'} to CSV!`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export trades. Please try again.')
    }
  }

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true
    if (filter === 'open') return trade.status === 'open'
    if (filter === 'closed') return trade.status === 'closed'
    if (filter === 'wins') return trade.outcome === 'win'
    if (filter === 'losses') return trade.outcome === 'loss'
    return true
  })

  if (loading) {
    return (
      <div className="trading-journal">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.2rem',
          color: '#6b7280'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="trading-journal">
      <TradingBackground variant="home" />

      <div className="journal-header">
        <div>
          <h1>Trading Journal</h1>
          <p>Track, analyze, and improve your trading performance</p>
        </div>
        <div className="journal-actions">
          <button onClick={handleExportCSV} className="action-btn secondary">
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={handleAddTrade} className="action-btn primary">
            <Plus size={18} />
            Add Trade
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Trades</span>
              <span className="stat-value">{stats.totalTrades}</span>
            </div>
          </div>

          <div className="stat-card win">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Win Rate</span>
              <span className="stat-value">{stats.winRate.toFixed(1)}%</span>
              <span className="stat-detail">{stats.wins}W / {stats.losses}L</span>
            </div>
          </div>

          <div className={`stat-card ${stats.totalProfitLoss >= 0 ? 'profit' : 'loss'}`}>
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total P&L</span>
              <span className="stat-value">
                {stats.totalProfitLoss >= 0 ? '+' : ''}${stats.totalProfitLoss.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Profit Factor</span>
              <span className="stat-value">
                {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="stat-card open">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Open Trades</span>
              <span className="stat-value">{stats.openTrades}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Best Pair</span>
              <span className="stat-value stat-text">{stats.bestPair}</span>
            </div>
          </div>
        </div>
      )}

      <div className="journal-content">
        <div className="trades-header">
          <h2>Your Trades</h2>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({trades.length})
            </button>
            <button
              className={filter === 'open' ? 'active' : ''}
              onClick={() => setFilter('open')}
            >
              Open ({trades.filter(t => t.status === 'open').length})
            </button>
            <button
              className={filter === 'closed' ? 'active' : ''}
              onClick={() => setFilter('closed')}
            >
              Closed ({trades.filter(t => t.status === 'closed').length})
            </button>
            <button
              className={filter === 'wins' ? 'active' : ''}
              onClick={() => setFilter('wins')}
            >
              Wins ({trades.filter(t => t.outcome === 'win').length})
            </button>
            <button
              className={filter === 'losses' ? 'active' : ''}
              onClick={() => setFilter('losses')}
            >
              Losses ({trades.filter(t => t.outcome === 'loss').length})
            </button>
          </div>
        </div>

        {filteredTrades.length === 0 ? (
          <div className="empty-state">
            <TrendingUp size={64} />
            <h3>No trades yet</h3>
            <p>Start tracking your trades to analyze your performance</p>
            <button onClick={handleAddTrade} className="action-btn primary">
              <Plus size={18} />
              Add Your First Trade
            </button>
          </div>
        ) : (
          <div className="trades-list">
            {filteredTrades.map(trade => (
              <TradeCard
                key={trade.id}
                trade={trade}
                onEdit={handleEditTrade}
                onDelete={handleDeleteTrade}
                onClose={handleCloseTrade}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <TradeModal
          trade={editingTrade}
          onClose={() => {
            setShowAddModal(false)
            setEditingTrade(null)
          }}
          onSave={(tradeData) => {
            if (!user) return
            try {
              if (editingTrade) {
                const updated = tradeService.updateTrade(user.email, editingTrade.id, tradeData)
                if (updated) {
                  alert('Trade updated successfully!')
                } else {
                  alert('Failed to update trade. Please try again.')
                  return
                }
              } else {
                tradeService.addTrade(user.email, tradeData as any)
                alert('Trade added successfully!')
              }
              loadTrades()
              setShowAddModal(false)
              setEditingTrade(null)
            } catch (error) {
              console.error('Save error:', error)
              alert('Failed to save trade. Please try again.')
            }
          }}
        />
      )}
    </div>
  )
}

// Trade Card Component
interface TradeCardProps {
  trade: Trade
  onEdit: (trade: Trade) => void
  onDelete: (tradeId: string) => void
  onClose: (trade: Trade) => void
}

const TradeCard = ({ trade, onEdit, onDelete, onClose }: TradeCardProps) => {
  const isProfitable = trade.profitLoss > 0
  const isOpen = trade.status === 'open'

  // Get currency from pair (default to 'base' for backward compatibility)
  const [baseCurrency, quoteCurrency] = trade.pair.split('/')
  const quantityType = trade.quantityType || 'base'
  const currency = quantityType === 'base' ? baseCurrency : quoteCurrency

  return (
    <div className={`trade-card ${trade.status} ${trade.outcome}`}>
      <div className="trade-card-header">
        <div className="trade-pair">
          <span className="pair-name">{trade.pair}</span>
          <span className={`trade-type ${trade.type}`}>{trade.type.toUpperCase()}</span>
          <span className="trade-leverage">{trade.leverage}x</span>
        </div>
        <div className="trade-actions">
          {isOpen && (
            <button onClick={() => onClose(trade)} className="action-icon close-trade" title="Close Trade">
              <Target size={16} />
            </button>
          )}
          <button onClick={() => onEdit(trade)} className="action-icon" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => onDelete(trade.id)} className="action-icon delete" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="trade-card-body">
        <div className="trade-info-grid">
          <div className="info-item">
            <span className="info-label">Entry</span>
            <span className="info-value">${trade.entryPrice.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Exit</span>
            <span className="info-value">
              {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : 'Open'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Quantity</span>
            <span className="info-value">{trade.quantity} {currency || ''}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Exchange</span>
            <span className="info-value">{trade.exchange}</span>
          </div>
        </div>

        {!isOpen && (
          <div className={`pnl-display ${isProfitable ? 'profit' : 'loss'}`}>
            <div className="pnl-amount">
              {isProfitable ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span>
                {isProfitable ? '+' : ''}${trade.profitLoss.toFixed(2)}
              </span>
            </div>
            <div className="pnl-percent">
              {isProfitable ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%
            </div>
          </div>
        )}

        {trade.notes && (
          <div className="trade-notes">
            <p>{trade.notes}</p>
          </div>
        )}

        <div className="trade-date">
          <Calendar size={14} />
          {new Date(trade.entryDate).toLocaleDateString()}
          {trade.exitDate && ` - ${new Date(trade.exitDate).toLocaleDateString()}`}
        </div>
      </div>
    </div>
  )
}

// Simplified Trade Modal - We'll expand this later
interface TradeModalProps {
  trade: Trade | null
  onClose: () => void
  onSave: (trade: Partial<Trade>) => void
}

const TradeModal = ({ trade, onClose, onSave }: TradeModalProps) => {
  const [formData, setFormData] = useState({
    pair: trade?.pair || 'BTC/USDT',
    type: trade?.type || 'long' as 'long' | 'short',
    entryPrice: trade?.entryPrice.toString() || '',
    exitPrice: trade?.exitPrice?.toString() || '',
    quantity: trade?.quantity.toString() || '',
    quantityType: trade?.quantityType || 'base' as 'base' | 'quote',
    entryDate: trade?.entryDate ? trade.entryDate.split('T')[0] : new Date().toISOString().split('T')[0],
    exitDate: trade?.exitDate ? trade.exitDate.split('T')[0] : '',
    stopLoss: trade?.stopLoss?.toString() || '',
    takeProfit: trade?.takeProfit?.toString() || '',
    leverage: trade?.leverage.toString() || '1',
    exchange: trade?.exchange || 'binance',
    notes: trade?.notes || '',
    tags: trade?.tags?.join(', ') || ''
  })

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Get currency names from pair
  const getCurrencies = (pair: string) => {
    const [base, quote] = pair.split('/')
    return { base, quote }
  }

  const currencies = getCurrencies(formData.pair)

  // Calculate actual quantity in base currency for P&L
  const getBaseQuantity = () => {
    const qty = parseFloat(formData.quantity)
    const price = parseFloat(formData.entryPrice)
    if (isNaN(qty) || isNaN(price)) return 0

    if (formData.quantityType === 'base') {
      return qty
    } else {
      // Convert quote to base: if 1000 USDT at $3000/ETH = 0.333 ETH
      return qty / price
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const entryPrice = parseFloat(formData.entryPrice)
    const inputQuantity = parseFloat(formData.quantity)
    const leverage = parseFloat(formData.leverage)

    if (isNaN(entryPrice) || entryPrice <= 0) {
      alert('Please enter a valid entry price')
      return
    }

    if (isNaN(inputQuantity) || inputQuantity <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    if (isNaN(leverage) || leverage < 1 || leverage > 125) {
      alert('Leverage must be between 1x and 125x')
      return
    }

    const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : null
    if (exitPrice !== null && (isNaN(exitPrice) || exitPrice <= 0)) {
      alert('Please enter a valid exit price or leave it empty')
      return
    }

    const baseQuantity = getBaseQuantity() // Always use base quantity for calculations

    let profitLoss = 0
    let profitLossPercent = 0
    let status: 'open' | 'closed' = 'open'
    let outcome: 'win' | 'loss' | 'pending' = 'pending'

    if (exitPrice) {
      // P&L calculations always use base quantity
      profitLoss = formData.type === 'long'
        ? (exitPrice - entryPrice) * baseQuantity
        : (entryPrice - exitPrice) * baseQuantity

      profitLossPercent = formData.type === 'long'
        ? ((exitPrice - entryPrice) / entryPrice) * 100 * leverage
        : ((entryPrice - exitPrice) / entryPrice) * 100 * leverage

      status = 'closed'
      outcome = profitLoss > 0 ? 'win' : 'loss'
    }

    const tradeData: Partial<Trade> = {
      pair: formData.pair,
      type: formData.type,
      entryPrice,
      exitPrice,
      quantity: inputQuantity, // Store the user's input quantity
      quantityType: formData.quantityType, // Store which type they entered
      entryDate: new Date(formData.entryDate).toISOString(),
      exitDate: formData.exitDate ? new Date(formData.exitDate).toISOString() : null,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : null,
      leverage,
      exchange: formData.exchange,
      status,
      outcome,
      profitLoss,
      profitLossPercent,
      fees: 0,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      screenshots: trade?.screenshots || []
    }

    onSave(tradeData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{trade ? 'Edit Trade' : 'Add New Trade'}</h2>
          <button onClick={onClose} className="close-modal">×</button>
        </div>

        <form onSubmit={handleSubmit} className="trade-form">
          <div className="form-row">
            <div className="form-group">
              <label>Trading Pair</label>
              <select
                value={formData.pair}
                onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
              >
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

            <div className="form-group">
              <label>Trade Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'long' | 'short' })}
              >
                <option value="long">Long (Buy)</option>
                <option value="short">Short (Sell)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Entry Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Exit Price (optional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity Type</label>
              <select
                value={formData.quantityType}
                onChange={(e) => setFormData({ ...formData, quantityType: e.target.value as 'base' | 'quote' })}
              >
                <option value="base">{currencies.base} (Base Currency)</option>
                <option value="quote">{currencies.quote} (Quote Currency)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity ({formData.quantityType === 'base' ? currencies.base : currencies.quote})</label>
              <input
                type="number"
                step="0.00000001"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder={formData.quantityType === 'base' ? `Amount in ${currencies.base}` : `Amount in ${currencies.quote}`}
                required
              />
              {formData.entryPrice && formData.quantity && (
                <small className="conversion-hint">
                  ≈ {formData.quantityType === 'base'
                    ? `${(parseFloat(formData.quantity) * parseFloat(formData.entryPrice)).toFixed(2)} ${currencies.quote}`
                    : `${(parseFloat(formData.quantity) / parseFloat(formData.entryPrice)).toFixed(8)} ${currencies.base}`
                  }
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Leverage (1-125x)</label>
              <input
                type="number"
                step="1"
                min="1"
                max="125"
                value={formData.leverage}
                onChange={(e) => setFormData({ ...formData, leverage: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Exchange</label>
              <select
                value={formData.exchange}
                onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
              >
                {Object.values(EXCHANGES).map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.displayName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Entry Date</label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stop Loss (optional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Take Profit (optional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.takeProfit}
                onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Add any notes about this trade (strategy, market conditions, emotions, etc.)"
            />
          </div>

          <div className="form-group full-width">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="breakout, trend-following, scalp"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {trade ? 'Update Trade' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TradingJournal

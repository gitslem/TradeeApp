export interface Trade {
  id: string
  userId: string
  pair: string
  type: 'long' | 'short'
  entryPrice: number
  exitPrice: number | null
  quantity: number
  quantityType: 'base' | 'quote' // 'base' = ETH in ETH/USDT, 'quote' = USDT in ETH/USDT
  entryDate: string
  exitDate: string | null
  stopLoss: number | null
  takeProfit: number | null
  leverage: number
  exchange: string
  status: 'open' | 'closed'
  outcome: 'win' | 'loss' | 'pending'
  profitLoss: number
  profitLossPercent: number
  fees: number
  notes: string
  tags: string[]
  screenshots: string[]
  createdAt: string
  updatedAt: string
}

export interface TradeStats {
  totalTrades: number
  openTrades: number
  closedTrades: number
  wins: number
  losses: number
  winRate: number
  totalProfitLoss: number
  avgWin: number
  avgLoss: number
  largestWin: number
  largestLoss: number
  profitFactor: number
  bestPair: string
  worstPair: string
  bestExchange: string
}

class TradeService {
  private storageKey = 'tradee_trades'

  private getTrades(userId: string): Trade[] {
    try {
      const allTrades = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      return allTrades.filter((trade: Trade) => trade.userId === userId)
    } catch (error) {
      console.error('Error getting trades:', error)
      return []
    }
  }

  private saveTrades(trades: Trade[]): void {
    try {
      const allTrades = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
      const otherTrades = allTrades.filter((t: Trade) =>
        !trades.find(trade => trade.id === t.id)
      )
      const updatedTrades = [...otherTrades, ...trades]
      localStorage.setItem(this.storageKey, JSON.stringify(updatedTrades))
    } catch (error) {
      console.error('Error saving trades:', error)
    }
  }

  getAllTrades(userId: string): Trade[] {
    return this.getTrades(userId)
  }

  getTradeById(userId: string, tradeId: string): Trade | undefined {
    const trades = this.getTrades(userId)
    return trades.find(trade => trade.id === tradeId)
  }

  addTrade(userId: string, tradeData: Omit<Trade, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Trade {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const trades = this.getTrades(userId)
    trades.push(newTrade)
    this.saveTrades(trades)

    return newTrade
  }

  updateTrade(userId: string, tradeId: string, updates: Partial<Trade>): Trade | null {
    const trades = this.getTrades(userId)
    const index = trades.findIndex(trade => trade.id === tradeId)

    if (index === -1) return null

    trades[index] = {
      ...trades[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveTrades(trades)
    return trades[index]
  }

  deleteTrade(userId: string, tradeId: string): boolean {
    const trades = this.getTrades(userId)
    const filteredTrades = trades.filter(trade => trade.id !== tradeId)

    if (trades.length === filteredTrades.length) return false

    this.saveTrades(filteredTrades)
    return true
  }

  closeTrade(userId: string, tradeId: string, exitPrice: number, exitDate: string): Trade | null {
    const trade = this.getTradeById(userId, tradeId)
    if (!trade || trade.status === 'closed') return null

    const profitLoss = trade.type === 'long'
      ? (exitPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - exitPrice) * trade.quantity

    const profitLossPercent = trade.type === 'long'
      ? ((exitPrice - trade.entryPrice) / trade.entryPrice) * 100 * trade.leverage
      : ((trade.entryPrice - exitPrice) / trade.entryPrice) * 100 * trade.leverage

    const outcome = profitLoss > 0 ? 'win' : 'loss'

    return this.updateTrade(userId, tradeId, {
      exitPrice,
      exitDate,
      status: 'closed',
      outcome,
      profitLoss,
      profitLossPercent
    })
  }

  calculateStats(userId: string): TradeStats {
    const trades = this.getTrades(userId)
    const closedTrades = trades.filter(t => t.status === 'closed')
    const wins = closedTrades.filter(t => t.outcome === 'win')
    const losses = closedTrades.filter(t => t.outcome === 'loss')

    const totalProfitLoss = closedTrades.reduce((sum, t) => sum + t.profitLoss, 0)
    const totalWins = wins.reduce((sum, t) => sum + t.profitLoss, 0)
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.profitLoss, 0))

    const avgWin = wins.length > 0 ? totalWins / wins.length : 0
    const avgLoss = losses.length > 0 ? totalLosses / losses.length : 0

    const largestWin = wins.length > 0
      ? Math.max(...wins.map(t => t.profitLoss))
      : 0

    const largestLoss = losses.length > 0
      ? Math.min(...losses.map(t => t.profitLoss))
      : 0

    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0

    // Calculate best/worst pairs
    const pairStats = new Map<string, number>()
    closedTrades.forEach(t => {
      const current = pairStats.get(t.pair) || 0
      pairStats.set(t.pair, current + t.profitLoss)
    })

    const sortedPairs = Array.from(pairStats.entries()).sort((a, b) => b[1] - a[1])
    const bestPair = sortedPairs.length > 0 ? sortedPairs[0][0] : 'N/A'
    const worstPair = sortedPairs.length > 0 ? sortedPairs[sortedPairs.length - 1][0] : 'N/A'

    // Calculate best exchange
    const exchangeStats = new Map<string, number>()
    closedTrades.forEach(t => {
      const current = exchangeStats.get(t.exchange) || 0
      exchangeStats.set(t.exchange, current + t.profitLoss)
    })

    const sortedExchanges = Array.from(exchangeStats.entries()).sort((a, b) => b[1] - a[1])
    const bestExchange = sortedExchanges.length > 0 ? sortedExchanges[0][0] : 'N/A'

    return {
      totalTrades: trades.length,
      openTrades: trades.filter(t => t.status === 'open').length,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0,
      totalProfitLoss,
      avgWin,
      avgLoss,
      largestWin,
      largestLoss,
      profitFactor,
      bestPair,
      worstPair,
      bestExchange
    }
  }

  exportToCSV(userId: string): string {
    const trades = this.getTrades(userId)
    const headers = [
      'Date',
      'Pair',
      'Type',
      'Entry Price',
      'Exit Price',
      'Quantity',
      'Leverage',
      'Exchange',
      'Status',
      'Outcome',
      'P&L',
      'P&L %',
      'Notes'
    ].join(',')

    const rows = trades.map(t => [
      t.entryDate,
      t.pair,
      t.type,
      t.entryPrice,
      t.exitPrice || '',
      t.quantity,
      t.leverage,
      t.exchange,
      t.status,
      t.outcome,
      t.profitLoss.toFixed(2),
      t.profitLossPercent.toFixed(2),
      `"${t.notes.replace(/"/g, '""')}"`
    ].join(','))

    return [headers, ...rows].join('\n')
  }
}

export const tradeService = new TradeService()

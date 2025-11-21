import axios from 'axios'

export interface CryptoPrice {
  symbol: string
  price: number
  priceChange: number
  priceChangePercent: number
  high24h: number
  low24h: number
  volume24h: number
  lastUpdate: number
}

// Map display names to Binance symbols
const symbolMap: Record<string, string> = {
  'BTC/USDT': 'BTCUSDT',
  'ETH/USDT': 'ETHUSDT',
  'BNB/USDT': 'BNBUSDT',
  'SOL/USDT': 'SOLUSDT',
  'XRP/USDT': 'XRPUSDT',
  'ADA/USDT': 'ADAUSDT',
  'DOGE/USDT': 'DOGEUSDT',
  'MATIC/USDT': 'MATICUSDT',
  'DOT/USDT': 'DOTUSDT',
  'AVAX/USDT': 'AVAXUSDT'
}

const BINANCE_API = 'https://api.binance.com/api/v3'

export const getCryptoPrice = async (pair: string): Promise<CryptoPrice | null> => {
  try {
    const binanceSymbol = symbolMap[pair]
    if (!binanceSymbol) {
      console.error('Symbol not found:', pair)
      return null
    }

    // Fetch 24hr ticker data
    const response = await axios.get(`${BINANCE_API}/ticker/24hr`, {
      params: { symbol: binanceSymbol },
      timeout: 5000
    })

    const data = response.data

    return {
      symbol: pair,
      price: parseFloat(data.lastPrice),
      priceChange: parseFloat(data.priceChange),
      priceChangePercent: parseFloat(data.priceChangePercent),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      volume24h: parseFloat(data.volume),
      lastUpdate: Date.now()
    }
  } catch (error) {
    console.error('Error fetching crypto price:', error)
    return null
  }
}

// Get multiple prices at once
export const getMultiplePrices = async (pairs: string[]): Promise<Record<string, CryptoPrice>> => {
  const prices: Record<string, CryptoPrice> = {}

  await Promise.all(
    pairs.map(async (pair) => {
      const price = await getCryptoPrice(pair)
      if (price) {
        prices[pair] = price
      }
    })
  )

  return prices
}

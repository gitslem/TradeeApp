import axios from 'axios'

export interface CandleData {
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number
  quoteVolume: number
  trades: number
  takerBuyBaseVolume: number
  takerBuyQuoteVolume: number
}

export interface OHLCVData {
  symbol: string
  interval: string
  current: CandleData
  previous: CandleData
  priceChange: number
  priceChangePercent: number
  volumeChange: number
  volumeChangePercent: number
  highLow: {
    high: number
    low: number
    range: number
  }
}

const BINANCE_API = 'https://api.binance.com/api/v3'

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

// Interval options
export const INTERVALS = {
  '1m': '1 Minute',
  '5m': '5 Minutes',
  '15m': '15 Minutes',
  '1h': '1 Hour',
  '4h': '4 Hours',
  '1d': '1 Day'
}

/**
 * Fetch OHLCV data for a trading pair
 */
export const getOHLCVData = async (pair: string, interval: string = '15m'): Promise<OHLCVData | null> => {
  try {
    const binanceSymbol = symbolMap[pair]
    if (!binanceSymbol) {
      console.error('Symbol not found:', pair)
      return null
    }

    // Fetch last 2 candles (current + previous)
    const response = await axios.get(`${BINANCE_API}/klines`, {
      params: {
        symbol: binanceSymbol,
        interval: interval,
        limit: 2
      },
      timeout: 5000
    })

    const candles = response.data

    if (!candles || candles.length < 2) {
      return null
    }

    // Parse previous candle (completed)
    const prevCandle = candles[0]
    const previous: CandleData = {
      openTime: prevCandle[0],
      open: parseFloat(prevCandle[1]),
      high: parseFloat(prevCandle[2]),
      low: parseFloat(prevCandle[3]),
      close: parseFloat(prevCandle[4]),
      volume: parseFloat(prevCandle[5]),
      closeTime: prevCandle[6],
      quoteVolume: parseFloat(prevCandle[7]),
      trades: prevCandle[8],
      takerBuyBaseVolume: parseFloat(prevCandle[9]),
      takerBuyQuoteVolume: parseFloat(prevCandle[10])
    }

    // Parse current candle (in progress)
    const currCandle = candles[1]
    const current: CandleData = {
      openTime: currCandle[0],
      open: parseFloat(currCandle[1]),
      high: parseFloat(currCandle[2]),
      low: parseFloat(currCandle[3]),
      close: parseFloat(currCandle[4]),
      volume: parseFloat(currCandle[5]),
      closeTime: currCandle[6],
      quoteVolume: parseFloat(currCandle[7]),
      trades: currCandle[8],
      takerBuyBaseVolume: parseFloat(currCandle[9]),
      takerBuyQuoteVolume: parseFloat(currCandle[10])
    }

    // Calculate changes
    const priceChange = current.close - previous.close
    const priceChangePercent = (priceChange / previous.close) * 100
    const volumeChange = current.volume - previous.volume
    const volumeChangePercent = previous.volume > 0 ? (volumeChange / previous.volume) * 100 : 0

    // Calculate high/low range across both candles
    const allPrices = [
      previous.high, previous.low,
      current.high, current.low
    ]
    const high = Math.max(...allPrices)
    const low = Math.min(...allPrices)

    return {
      symbol: pair,
      interval,
      current,
      previous,
      priceChange,
      priceChangePercent,
      volumeChange,
      volumeChangePercent,
      highLow: {
        high,
        low,
        range: high - low
      }
    }
  } catch (error) {
    console.error('Error fetching OHLCV data:', error)
    return null
  }
}

/**
 * Determine candle pattern based on OHLC data
 */
export const identifyCandlePattern = (candle: CandleData): string => {
  const { open, high, low, close } = candle
  const body = Math.abs(close - open)
  const range = high - low
  const bodyPercent = range > 0 ? (body / range) * 100 : 0

  const upperWick = high - Math.max(open, close)
  const lowerWick = Math.min(open, close) - low

  const isBullish = close > open

  // Doji patterns
  if (bodyPercent < 5) {
    if (upperWick > body * 3 && lowerWick < body) return 'Dragonfly Doji'
    if (lowerWick > body * 3 && upperWick < body) return 'Gravestone Doji'
    return 'Doji'
  }

  // Hammer and Hanging Man
  if (lowerWick > body * 2 && upperWick < body * 0.3) {
    return isBullish ? 'Hammer (Bullish)' : 'Hanging Man (Bearish)'
  }

  // Inverted Hammer and Shooting Star
  if (upperWick > body * 2 && lowerWick < body * 0.3) {
    return isBullish ? 'Inverted Hammer' : 'Shooting Star (Bearish)'
  }

  // Marubozu
  if (bodyPercent > 90) {
    return isBullish ? 'Bullish Marubozu' : 'Bearish Marubozu'
  }

  // Spinning Top
  if (bodyPercent < 30 && upperWick > body && lowerWick > body) {
    return 'Spinning Top (Indecision)'
  }

  // Regular candles
  return isBullish ? 'Bullish Candle' : 'Bearish Candle'
}

/**
 * Calculate support and resistance levels based on recent price action
 */
export const calculateSupportResistance = (ohlcv: OHLCVData): { support: number[], resistance: number[] } => {
  const { current, previous, highLow } = ohlcv

  const support: number[] = []
  const resistance: number[] = []

  // Add previous low as support
  support.push(previous.low)

  // Add previous high as resistance
  resistance.push(previous.high)

  // Add current levels
  const currentPrice = current.close

  // Psychological levels (round numbers)
  const roundLevel = Math.round(currentPrice / 100) * 100
  if (roundLevel > currentPrice) {
    resistance.push(roundLevel)
  } else {
    support.push(roundLevel)
  }

  // Add high/low from the range
  if (highLow.high > currentPrice) {
    resistance.push(highLow.high)
  }
  if (highLow.low < currentPrice) {
    support.push(highLow.low)
  }

  return {
    support: [...new Set(support)].sort((a, b) => b - a), // Descending
    resistance: [...new Set(resistance)].sort((a, b) => a - b) // Ascending
  }
}

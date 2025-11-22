# Crypto Trading Position Calculator

A comprehensive web-based trading tool for cryptocurrency traders to calculate position sizes, manage risk, and analyze market structure and price action.


https://traddii.web.app



## Features

### 1. Position Calculator
- **Risk Management Calculations**:
  - Stop-Loss % Distance = |Entry Price – Stop Price| ÷ Entry Price
  - Risk Amount = Account Balance × Risk % per Trade
  - Position Size = (Account Balance × Risk % per Trade) ÷ Stop Loss % Distance
- **Support for Multiple Crypto Pairs**: BTC/USDT, ETH/USDT, BNB/USDT, SOL/USDT, and more
- **Long & Short Positions**: Calculate for both buy and sell positions
- **Risk/Reward Ratio**: Automatic R:R calculation with recommendations
- **Position Validation**: Smart warnings for improper stop loss and take profit levels
- **Real-time Calculations**: Instant updates as you adjust parameters

### 2. Market Structure Analysis
- **Trend Detection**:
  - Higher Highs & Higher Lows (Uptrend)
  - Lower Highs & Lower Lows (Downtrend)
  - Range-bound market identification
- **Fibonacci Retracement Levels**: Automatic calculation of key Fib levels (23.6%, 38.2%, 50%, 61.8%, 78.6%)
- **Support & Resistance Levels**:
  - Add multiple S/R levels
  - Mark strength (weak, moderate, strong)
  - Track number of touches
- **Range Position Indicator**: Visual representation of current price within range
- **Trading Suggestions**: Context-aware recommendations based on market structure

### 3. Price Action Analysis
- **Candlestick Pattern Recognition**:
  - Doji (indecision)
  - Marubozu (strong momentum)
  - Hammer/Hanging Man (reversal patterns)
  - Shooting Star/Inverted Hammer
  - Spinning Top (volatility/indecision)
  - Engulfing patterns
- **Volume Analysis**:
  - Volume change percentage
  - Volume confirmation for price moves
  - Conviction analysis
- **Visual Candle Representation**: See body and wick percentages
- **Entry Signal Generation**: Combined price action and volume signals
- **Pre-Trade Checklist**: Essential checks before entering a trade
- **Multiple Timeframe Support**: 1M, 5M, 15M, 30M, 1H, 4H, 1D, 1W

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Tradee

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Position Calculator Tab**:
   - Enter your account balance
   - Set your risk percentage (recommended: 1-2%)
   - Input entry price, stop loss, and take profit
   - View calculated position size and risk details

2. **Market Structure Tab**:
   - Input current price and recent highs/lows
   - Add support and resistance levels
   - Analyze trend direction and Fibonacci levels
   - Get trading suggestions based on market structure

3. **Price Action Tab**:
   - Enter candlestick OHLC data
   - Input volume information
   - Get pattern recognition and signals
   - Review pre-trade checklist

## Risk Warning

⚠️ **Trading cryptocurrencies carries significant risk. This tool is for educational purposes only.**

- Always use proper risk management
- Never risk more than you can afford to lose
- Do your own research before making any trades
- Past performance does not guarantee future results
- Consider consulting with a financial advisor

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Custom CSS with gradient themes
- **State Management**: React Hooks (useState)

## Key Calculations

### Position Sizing
```
Stop-Loss % Distance = |Entry Price – Stop Price| ÷ Entry Price
Risk Amount = Account Balance × Risk % per Trade
Position Size = Risk Amount ÷ Stop Loss % Distance
```

### Risk/Reward Ratio
```
R:R = |Take Profit - Entry Price| ÷ |Entry Price - Stop Loss|
```

### Fibonacci Levels
```
Fib Level = Low + (High - Low) × Fibonacci %
```

## Best Practices

1. **Risk Management**:
   - Keep risk per trade at 1-2% of account balance
   - Always use stop losses
   - Aim for minimum 1:2 risk/reward ratio

2. **Market Structure**:
   - Trade in the direction of the trend
   - Wait for confirmations at key levels
   - Use higher timeframe structure for context

3. **Price Action**:
   - Confirm patterns with volume
   - Multiple timeframe analysis
   - Wait for clear signals before entering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this tool for your trading analysis.

## Disclaimer

This software is provided "as is" without warranty of any kind. The authors are not responsible for any trading losses incurred while using this tool. Always do your own research and trade responsibly.

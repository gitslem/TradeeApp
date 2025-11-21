# Leverage Toggle Location Guide

## Where to Find the Leverage Toggle

The leverage/liquidation toggle is located in the **Position Calculator** tab under the input section.

### Step-by-Step Instructions:

1. **Open the Application**
   ```bash
   npm run dev
   # OR for production
   npm run build && npm run start
   ```

2. **Navigate to Position Calculator Tab**
   - Click on the "📊 Position Calculator" tab (should be active by default)

3. **Scroll Down in the Left Panel (Input Section)**
   - The toggle is located AFTER the "Trading Fee (%)" input
   - It appears as a prominent orange/yellow highlighted box

### Visual Location:

```
┌─────────────────────────────────────────┐
│      📊 Position Calculator             │
├─────────────────────────────────────────┤
│ Trading Setup                           │
│                                         │
│ [Crypto Pair]                           │
│ [Position Type: Long/Short]             │
│ [Account Balance]                       │
│ [Risk Per Trade %]                      │
│ [Entry Price]                           │
│ [Stop Loss Price]                       │
│ [Take Profit 1]                         │
│ [Take Profit 2]                         │
│ [Take Profit 3]                         │
│ [Trading Fee %]                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☑ Use Leverage Trading              │ │ ← HERE!
│ │ ⚠️ Leverage increases both profit   │ │
│ │    potential and risk of liquidation │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Leverage Dropdown] (appears when checked)
│                                         │
└─────────────────────────────────────────┘
```

## Enhanced Visual Features:

The toggle now has these prominent visual features:
- **Orange/Yellow gradient background** (very noticeable)
- **3px solid orange border**
- **Large checkbox** (24x24 pixels)
- **Box shadow** for depth
- **Hover effect** - border glows when you hover
- **Bold orange text** saying "Use Leverage Trading"
- **Red warning text** below

## What Happens When You Check It:

When you check the "Use Leverage Trading" box:

1. **A new dropdown appears** immediately below with leverage options:
   - 1x (No Leverage)
   - 2x, 3x, 5x, 10x, 20x, 25x, 50x, 75x, 100x, 125x

2. **New result cards appear** on the right side showing:
   - **Leverage Position** - Shows your leverage multiplier
   - **Margin Required** - How much collateral you need
   - **Liquidation Price** - The price at which you'll be liquidated (in RED)
   - **Distance to Liquidation** - How far away the liquidation price is

3. **Additional warnings** will appear if:
   - Leverage is ≥5x, ≥10x, or ≥20x
   - Your stop loss is beyond the liquidation price
   - Liquidation price is within 5% of entry

## Example:

### Before Checking Toggle:
- Standard position size calculations
- No liquidation information
- No margin requirements

### After Checking Toggle and Setting 10x Leverage:
- Entry Price: $3,500
- **Liquidation Price: $3,150** (appears in RED card)
- **Margin Required: Shows your collateral**
- **Warnings appear:**
  - "⚠️ HIGH RISK: Leverage ≥10x is extremely dangerous"
  - "🚨 DANGER: Liquidation price is within X% of entry - very risky!"

## Testing the Feature:

Run this test to see the liquidation calculations:

```
Account Balance: 10000
Risk Per Trade: 1%
Entry Price: 3500
Stop Loss: 3400
Take Profit: 3800

1. Leave leverage UNCHECKED → No liquidation info appears
2. CHECK the leverage toggle → Orange box should be very visible
3. Select 10x leverage → See liquidation price appear on right side
4. Try different leverage levels (5x, 20x, 50x) → Watch liquidation price change
```

## Troubleshooting:

**If you still don't see the toggle:**

1. Make sure you're on the **Position Calculator** tab (not Market Structure or Price Action)
2. Check you've scrolled down past all the price inputs
3. Clear browser cache and reload
4. The toggle is RIGHT AFTER "Trading Fee (%)" input field
5. Look for the orange/yellow gradient box - it's very prominent!

**Browser Console Check:**
Open browser DevTools (F12) and search for "leverage-toggle" class to verify it's in the DOM.

## File Locations:

- **Toggle Component:** `src/components/PositionCalculator.tsx` (lines 378-408)
- **Toggle Styling:** `src/components/PositionCalculator.css` (lines 194-239)
- **Liquidation Calculations:** `src/components/PositionCalculator.tsx` (lines 78-92)

---

**Note:** The toggle is definitely implemented and should be very visible with the new enhanced styling (orange gradient, thick border, large checkbox). If you still can't see it after following these instructions, please let me know and we can troubleshoot further!

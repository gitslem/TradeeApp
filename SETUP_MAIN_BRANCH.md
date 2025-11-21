# How to Set Up Main Branch on GitHub

Your React app with all features is on: `claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK`

## Option 1: Set Current Branch as Default (Recommended)

1. Go to your GitHub repository: https://github.com/gitslem/Tradee
2. Click on **Settings** (gear icon)
3. Click on **Branches** in the left sidebar
4. Under "Default branch", click the switch icon
5. Select `claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK`
6. Click "Update" and confirm

Now this branch will be the main branch everyone sees!

## Option 2: Create Main Branch Manually on GitHub

1. Go to: https://github.com/gitslem/Tradee
2. Click the branch dropdown (currently shows the branch name)
3. Type "main" in the search box
4. Click "Create branch: main from claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK"
5. Go to Settings → Branches and set "main" as default

## Option 3: Merge Using GitHub Web Interface

1. Go to: https://github.com/gitslem/Tradee/compare
2. Select:
   - **base**: main (or create it first)
   - **compare**: claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK
3. Click "Create pull request"
4. Add title: "Merge complete React app with all features"
5. Click "Create pull request"
6. Click "Merge pull request"
7. Click "Confirm merge"

## What's on the Current Branch

Your `claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK` branch has:

✅ Complete React + TypeScript app
✅ Position calculator with risk management
✅ Leverage & liquidation calculator
✅ Multiple take profit targets (TP1, TP2, TP3)
✅ Breakeven price calculator
✅ Win rate needed metric
✅ Market structure analysis
✅ Price action analysis
✅ Render deployment config
✅ All features from the old HTML version

## Deploy to Render

Once you set the default branch, you can deploy:

1. Go to https://render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repo: gitslem/Tradee
4. Select your default branch
5. Render will auto-detect `render.yaml` and deploy

Your app will be live in 2-3 minutes!

## Why Can't We Push to 'main' Directly?

This repository requires branches to start with `claude/` for the current session. This is by design for the development environment you're using.

The solution is to use GitHub's web interface to create the main branch or set your current branch as the default.

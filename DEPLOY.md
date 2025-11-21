# Deployment Guide - Crypto Trading Position Calculator

This guide covers deploying the application to Render (and other platforms).

## 🚀 Deploy to Render

### Option 1: Auto-Deploy with Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign up or log in
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository: `gitslem/Tradee`
   - Select branch: `claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK`
   - Render will automatically detect `render.yaml` and configure everything

3. **Deploy**
   - Click "Apply"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at: `https://tradee-crypto-calculator.onrender.com`

### Option 2: Manual Deployment

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect GitHub and select `gitslem/Tradee`
   - Select branch: `claude/trading-position-calculator-014BFsXT5UMcepkCChREQ7UK`

3. **Configure Settings**
   - **Name**: `tradee-crypto-calculator`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid)

4. **Environment Variables** (Optional)
   - `NODE_VERSION`: `18.17.0`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

## 🔧 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Serve production build locally
npm start

# Preview production build (Vite's preview)
npm run preview
```

## 📦 What Gets Deployed

- Built static files from `dist/` folder
- Served using `serve` package on port 3000
- Optimized React production build
- Minified CSS and JavaScript

## 🌐 Alternative Deployment Options

### Deploy to Vercel

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

3. Follow prompts and your app will be live

### Deploy to Netlify

1. Install Netlify CLI
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy
   ```bash
   netlify deploy --prod
   ```

3. Build directory: `dist`

### Deploy to GitHub Pages

1. Install gh-pages
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/Tradee",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy
   ```bash
   npm run deploy
   ```

## 🔍 Testing Production Build Locally

Before deploying, test the production build:

```bash
# Build the app
npm run build

# Serve it locally
npm start

# Open browser to http://localhost:3000
```

## 🐛 Troubleshooting

### Build Fails on Render

- Check that Node version is 18.x or higher
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

### App Shows Blank Page

- Check browser console for errors
- Ensure all environment variables are set
- Verify `dist/` folder contains files after build

### Port Issues

- Render automatically assigns a port
- The `serve` command uses port 3000 by default
- Render will map this to external port 443 (HTTPS)

## 📝 Post-Deployment

After deployment:

1. **Test all features**
   - Position Calculator
   - Market Structure Analysis
   - Price Action Analysis

2. **Check mobile responsiveness**
   - Open on phone/tablet
   - Test all tabs and inputs

3. **Monitor performance**
   - Check Render dashboard for metrics
   - Monitor for any crashes or errors

## 🔒 Security Notes

- App runs entirely in browser (no backend)
- No sensitive data is stored or transmitted
- All calculations done client-side
- No API keys or secrets needed

## 💰 Cost Estimate

**Render Free Tier:**
- Free for static sites
- Automatic SSL
- Custom domain support
- 100 GB bandwidth/month

**Render Paid Plans:**
- Start at $7/month for more bandwidth
- No sleep/spindown time
- Better performance

## 🔄 Continuous Deployment

Once connected to GitHub, Render will automatically:
- Deploy on every push to the branch
- Run build commands
- Update the live site
- Send notifications on deployment status

## 📧 Support

If you encounter issues:
1. Check Render logs in dashboard
2. Review build output for errors
3. Consult [Render documentation](https://render.com/docs)
4. Check repository issues page

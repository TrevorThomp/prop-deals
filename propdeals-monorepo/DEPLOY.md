# PropDeals - Single Repo Deployment Guide

**Goal:** Deploy everything from one GitHub repository

---

## Quick Setup (5 Minutes)

### Step 1: Update Extension URL (1 min)

Edit `extension/scripts/background.js` line 5:

```javascript
// BEFORE
const REMOTE_DISCOUNTS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/propdeals-api/main/v1/discounts.json';

// AFTER (for monorepo)
const REMOTE_DISCOUNTS_URL = 'https://YOUR_USERNAME.github.io/propdeals/v1/discounts.json';
```

**Replace `YOUR_USERNAME` with your GitHub username!**

### Step 2: Create GitHub Repository (2 min)

```bash
# Navigate to monorepo folder
cd propdeals-monorepo

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial PropDeals commit"

# Create repo on GitHub.com
# - Name: propdeals
# - Description: "Automatic prop firm discount codes for traders"
# - Public: YES (required for GitHub Pages)

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/propdeals.git

# Push
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages (1 min)

1. Go to your repository on GitHub.com
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** **/api** ⬅️ IMPORTANT: Select /api folder!
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 4: Verify Deployment (1 min)

Visit these URLs:

**API Endpoint:**
```
https://YOUR_USERNAME.github.io/propdeals/v1/discounts.json
```

Should show JSON data ✅

**Landing Page:**
```
https://YOUR_USERNAME.github.io/propdeals/
```

Should show API documentation page ✅

### Step 5: Test Extension (2 min)

1. Reload extension in `chrome://extensions/`
2. Open PropDeals popup
3. Right-click → Inspect → Console
4. Look for:
   ```
   Fetching remote discounts...
   ✓ Remote discounts fetched successfully (v1.0.0)
   ```
5. Click ↻ refresh button - should work!

---

## ✅ Done!

**You now have:**
- ✅ Single GitHub repository for everything
- ✅ Remote API hosted on GitHub Pages
- ✅ Extension source code in version control
- ✅ All documentation in one place

---

## Updating Discounts

### Method 1: GitHub Web UI (Easiest)

1. Navigate to `api/v1/discounts.json` on GitHub.com
2. Click **Edit** (pencil icon)
3. Make changes
4. Increment `version` number
5. Update `updated_at` timestamp
6. Click **Commit changes**
7. Wait 1-2 minutes for GitHub Pages to deploy
8. Users get update within 24 hours (or click refresh button)

### Method 2: Git Command Line

```bash
# Edit discount file
vim api/v1/discounts.json

# Commit and push
git add api/v1/discounts.json
git commit -m "Update FTMO discount to 20%"
git push

# GitHub Pages auto-deploys in 1-2 minutes
```

### Method 3: GitHub Desktop

1. Open propdeals repository in GitHub Desktop
2. Edit `api/v1/discounts.json` in your text editor
3. Return to GitHub Desktop
4. Add commit message
5. Click **Commit to main**
6. Click **Push origin**

---

## Folder Structure Explained

```
propdeals/                    (GitHub repo root)
├── extension/                (Chrome extension code)
│   ├── manifest.json
│   ├── scripts/
│   ├── pages/
│   ├── styles/
│   ├── icons/
│   └── data/
│       └── discounts.json    (Bundled fallback)
│
├── api/                      ⬅️ GitHub Pages serves THIS folder
│   ├── v1/
│   │   └── discounts.json    (Remote source of truth)
│   └── index.html            (API landing page)
│
├── docs/                     (Documentation)
│   └── *.md
│
├── README.md                 (Main readme)
├── .gitignore
└── DEPLOY.md                 (This file)
```

**Key point:** GitHub Pages is configured to serve the `/api` folder only!

---

## How It Works

### When you push to GitHub:

```
git push
    ↓
GitHub receives commit
    ↓
GitHub Pages builds from /api folder
    ↓
Deploys to: YOUR_USERNAME.github.io/propdeals/
    ↓
Extension fetches: /v1/discounts.json
```

### When extension loads:

```
Extension starts
    ↓
Background script fetches from GitHub Pages
    ↓
Caches for 24 hours
    ↓
Shows deals in popup
```

---

## URLs Breakdown

**Repository:**
```
https://github.com/YOUR_USERNAME/propdeals
```

**GitHub Pages Site (API):**
```
https://YOUR_USERNAME.github.io/propdeals/
```

**Discounts Endpoint:**
```
https://YOUR_USERNAME.github.io/propdeals/v1/discounts.json
```

**Raw File (alternative, not used):**
```
https://raw.githubusercontent.com/YOUR_USERNAME/propdeals/main/api/v1/discounts.json
```

---

## Troubleshooting

### GitHub Pages not working?

**Check 1:** Is it enabled?
- Settings → Pages → Should show deployment URL

**Check 2:** Is folder set correctly?
- Source should be: main branch, **/api** folder

**Check 3:** Is repo public?
- GitHub Pages free tier requires public repos

**Check 4:** Wait 2 minutes
- First deployment takes a bit longer

### Extension not fetching?

**Check 1:** Is URL correct in `background.js`?
```javascript
const REMOTE_DISCOUNTS_URL = 'https://YOUR_USERNAME.github.io/propdeals/v1/discounts.json';
```

**Check 2:** Reload extension
- `chrome://extensions/` → Click reload

**Check 3:** Check console
- Open popup → Right-click → Inspect → Console
- Look for error messages

**Check 4:** Test URL manually
- Visit the URL in browser
- Should show JSON (not 404)

### Changes not appearing?

**Wait for deployment:**
- GitHub Pages takes 1-2 minutes to deploy
- Check deployment status: Settings → Pages

**Clear extension cache:**
- Click ↻ button in popup, OR
- Reload extension in `chrome://extensions/`

---

## Chrome Web Store Submission

### Creating ZIP File

```bash
# Navigate to extension folder
cd extension

# Create ZIP (exclude dev files)
zip -r ../propdeals-extension-v1.0.0.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.DS_Store" \
  -x "generate_icons.py"

# ZIP file created: propdeals-extension-v1.0.0.zip
```

### What to Submit

1. **ZIP file** - The extension code
2. **Screenshots** - 1280x800 or 640x400 (5 max)
3. **Promotional images** - Optional but recommended
4. **Store listing** - Use copy from `docs/README.md`

### Source Code Disclosure

Chrome Web Store may ask for source code access:

**Provide:**
```
GitHub Repository: https://github.com/YOUR_USERNAME/propdeals
Source Location: /extension folder
```

---

## Benefits of Monorepo

### Before (Multiple Repos)
- ❌ Manage 2 separate repositories
- ❌ Keep versions in sync manually
- ❌ Push to multiple places

### After (Monorepo)
- ✅ Everything in one place
- ✅ Single source of truth
- ✅ One `git push` updates everything
- ✅ Easier collaboration
- ✅ Simpler version control

---

## Next Steps

1. ✅ Deploy to GitHub (done if you followed above)
2. ⏰ Update `YOUR_USERNAME` in background.js
3. ⏰ Test remote fetching works
4. ⏰ Apply to prop firm affiliate programs
5. ⏰ Update with real affiliate codes
6. ⏰ Create Chrome Web Store assets
7. ⏰ Submit to Chrome Web Store

---

## Support

- **Issues:** https://github.com/YOUR_USERNAME/propdeals/issues
- **Discussions:** https://github.com/YOUR_USERNAME/propdeals/discussions
- **Email:** support@propdeals.com

---

**Ready to deploy?** Follow steps 1-5 above!

**Last Updated:** October 23, 2025

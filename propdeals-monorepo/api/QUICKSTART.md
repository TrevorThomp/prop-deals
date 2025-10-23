# PropDeals API - Quick Start Guide

Get your remote discount API running in **5 minutes**.

## Prerequisites

- GitHub account
- Git installed (or use GitHub Desktop)

## Step-by-Step Setup

### 1. Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `propdeals-api`
   - **Description:** "Remote API for PropDeals Chrome extension"
   - **Visibility:** ✅ Public (required for GitHub Pages)
3. Click **"Create repository"**

### 2. Push This Folder to GitHub (2 minutes)

#### Option A: Command Line

```bash
# Navigate to this folder
cd propdeals-api-setup

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial API setup"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/propdeals-api.git

# Push
git branch -M main
git push -u origin main
```

#### Option B: GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose this `propdeals-api-setup` folder
4. Click "Create a Repository"
5. Click "Publish repository"
6. Choose your account
7. Name: `propdeals-api`
8. ✅ Keep public
9. Click "Publish"

### 3. Enable GitHub Pages (1 minute)

1. Go to your repository on GitHub.com
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes ⏰

### 4. Get Your API URL

After deployment (1-2 min), your URL will be:

```
https://YOUR_USERNAME.github.io/propdeals-api/v1/discounts.json
```

**Test it:**
- Visit the URL in your browser
- You should see JSON data

### 5. Update Extension

Open `propdeals-extension/scripts/background.js` and update line 5:

```javascript
// BEFORE
const REMOTE_DISCOUNTS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/propdeals-api/main/v1/discounts.json';

// AFTER (replace YOUR_USERNAME with your actual username)
const REMOTE_DISCOUNTS_URL = 'https://YOUR_USERNAME.github.io/propdeals-api/v1/discounts.json';
```

**Example:**
```javascript
const REMOTE_DISCOUNTS_URL = 'https://trevor.github.io/propdeals-api/v1/discounts.json';
```

### 6. Reload Extension

1. Go to `chrome://extensions/`
2. Find PropDeals
3. Click reload icon (↻)
4. Open extension popup
5. Check console (right-click → Inspect) for:
   ```
   Fetching remote discounts...
   ✓ Remote discounts fetched successfully (v1.0.0)
   ```

## ✅ You're Done!

Your extension now fetches discounts from GitHub Pages!

## How to Update Discounts

### Method 1: Edit on GitHub (Easiest)

1. Go to your repository on GitHub.com
2. Navigate to `v1/discounts.json`
3. Click ✏️ **Edit**
4. Make changes
5. Click **Commit changes**
6. ⏰ Wait 1-2 minutes for deployment
7. Users get update within 24 hours!

### Method 2: Edit Locally

```bash
# Edit the file
vim v1/discounts.json

# Save and push
git add v1/discounts.json
git commit -m "Update FTMO discount to 20%"
git push
```

## Testing Your Updates

### Test immediately (don't wait 24 hours):

1. Open extension popup
2. Click the **↻ refresh button** (top right)
3. Check if changes appear

### Or reload extension:

1. `chrome://extensions/`
2. Click reload on PropDeals
3. Open popup

## Troubleshooting

### "Failed to fetch remote discounts"

**Check 1:** Is GitHub Pages deployed?
- Visit `https://YOUR_USERNAME.github.io/propdeals-api/`
- Should show the index page

**Check 2:** Is the JSON valid?
- Visit `https://YOUR_USERNAME.github.io/propdeals-api/v1/discounts.json`
- Should show JSON (not 404)

**Check 3:** Is the URL correct in background.js?
- Open `scripts/background.js`
- Line 5 should have YOUR actual username

**Check 4:** Are host_permissions set?
- Open `manifest.json`
- Line 13 should include `"https://raw.githubusercontent.com/*"`

### "Extension uses old data"

The extension caches for 24 hours. To force refresh:
1. Click ↻ button in popup, OR
2. Reload extension in `chrome://extensions/`

### JSON syntax error

Validate your JSON at https://jsonlint.com/ before pushing

## Next Steps

### Add More Firms

Edit `v1/discounts.json` and add more firm objects:

```json
{
  "firms": [
    {
      "id": "newfirm",
      "name": "New Prop Firm",
      ...
    }
  ]
}
```

### Set Up Automatic Validation

See `README.md` for GitHub Actions setup

### Schedule Regular Updates

Set calendar reminders:
- **Weekly:** Check all firms for new deals
- **Monthly:** Review expiration dates
- **As needed:** Update flash sales immediately

## Support

- **Extension Issues:** https://github.com/YOUR_USERNAME/propdeals-extension/issues
- **API Issues:** https://github.com/YOUR_USERNAME/propdeals-api/issues

---

**Need help? Email:** support@propdeals.com

**Last Updated:** October 23, 2025

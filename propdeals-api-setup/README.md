# PropDeals API - GitHub Pages Setup

This repository hosts the remote `discounts.json` file for the PropDeals Chrome extension.

## Quick Setup

### 1. Create GitHub Repository

```bash
# Create new repo on GitHub.com
# Name: propdeals-api
# Description: API endpoint for PropDeals extension discount data
# Visibility: Public (required for GitHub Pages)
```

### 2. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/propdeals-api.git
cd propdeals-api

# Create directory structure
mkdir -p v1
```

### 3. Copy Initial Discount Data

Copy your `discounts.json` file to the `v1/` directory:

```bash
# From your extension directory
cp ../propdeals-extension/data/discounts.json v1/discounts.json
```

### 4. Create Index Page (Optional)

Create `index.html` in the root:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PropDeals API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f9fafb;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #10B981;
    }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
    a {
      color: #10B981;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>PropDeals API</h1>
    <p>Remote discount data for the PropDeals Chrome extension</p>

    <h2>Endpoints</h2>
    <ul>
      <li>
        <strong>Latest Discounts:</strong>
        <a href="v1/discounts.json" target="_blank">v1/discounts.json</a>
      </li>
    </ul>

    <h2>Usage</h2>
    <p>This endpoint is consumed by the PropDeals Chrome extension to fetch the latest prop firm discount codes.</p>

    <h2>Update Frequency</h2>
    <p>Discounts are updated as new deals become available. Extensions check for updates every 24 hours.</p>

    <h2>Links</h2>
    <ul>
      <li><a href="https://github.com/YOUR_USERNAME/propdeals-extension">Chrome Extension Source</a></li>
      <li><a href="https://github.com/YOUR_USERNAME/propdeals-api">API Repository</a></li>
    </ul>
  </div>
</body>
</html>
```

### 5. Push to GitHub

```bash
git add .
git commit -m "Initial API setup with v1 discounts"
git push origin main
```

### 6. Enable GitHub Pages

1. Go to your repository on GitHub.com
2. Click **Settings**
3. Scroll to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### 7. Get Your API URL

Your API endpoint will be:
```
https://YOUR_USERNAME.github.io/propdeals-api/v1/discounts.json
```

Example:
```
https://trevor.github.io/propdeals-api/v1/discounts.json
```

### 8. Update Extension

Update `scripts/background.js` in your extension:

```javascript
const REMOTE_DISCOUNTS_URL = 'https://YOUR_USERNAME.github.io/propdeals-api/v1/discounts.json';
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Updating Discounts

### Method 1: Direct Edit on GitHub

1. Go to `v1/discounts.json` on GitHub.com
2. Click **Edit** (pencil icon)
3. Make your changes
4. Click **Commit changes**
5. Changes deploy automatically in 1-2 minutes

### Method 2: Git Command Line

```bash
# Edit v1/discounts.json locally
vim v1/discounts.json

# Commit and push
git add v1/discounts.json
git commit -m "Update FTMO discount to 20%"
git push

# Changes deploy automatically in 1-2 minutes
```

### Method 3: GitHub Desktop

1. Open GitHub Desktop
2. Select propdeals-api repository
3. Edit `v1/discounts.json` in your text editor
4. Return to GitHub Desktop
5. Add commit message
6. Click **Commit to main**
7. Click **Push origin**

## Example discounts.json Structure

```json
{
  "version": "1.0.1",
  "updated_at": "2025-10-23T15:30:00Z",
  "firms": [
    {
      "id": "ftmo",
      "name": "FTMO",
      "logo_url": "https://www.ftmo.com/favicon.ico",
      "site_url": "https://www.ftmo.com",
      "affiliate_url": "https://www.ftmo.com/?ref=propdeals",
      "affiliate_code": "PROPDEALS15",
      "discount": {
        "type": "percentage",
        "amount": 15,
        "expires_at": "2025-11-01T00:00:00Z",
        "description": "15% off all challenges"
      },
      "checkout_urls": [
        "https://www.ftmo.com/checkout",
        "https://trader.ftmo.com/checkout"
      ],
      "selectors": {
        "code_field": "#discount-code",
        "apply_button": "button.apply-coupon"
      }
    }
  ]
}
```

## Update Checklist

When updating discounts:

- [ ] Increment `version` number
- [ ] Update `updated_at` timestamp to current UTC time
- [ ] Verify `expires_at` dates are in the future
- [ ] Test affiliate URLs work
- [ ] Commit with descriptive message

## Troubleshooting

### Changes not appearing in extension?

1. **Check GitHub Pages deployed:**
   - Visit your API URL in browser
   - Verify JSON shows your latest changes

2. **Check browser cache:**
   - Extension caches for 24 hours
   - Use refresh button in popup
   - Or reload extension in `chrome://extensions/`

3. **Check console for errors:**
   - Open extension popup
   - Right-click → Inspect
   - Check Console tab for fetch errors

### Getting CORS errors?

GitHub Pages handles CORS automatically. If you still see errors:
- Verify URL uses `https://` not `http://`
- Check host_permissions in manifest.json includes `raw.githubusercontent.com`

## Best Practices

### Version Numbering

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (v2.0.0)
- **MINOR**: New firms added (v1.1.0)
- **PATCH**: Discount updates (v1.0.1)

### Commit Messages

Be descriptive:

```bash
# Good
git commit -m "Update FTMO discount from 15% to 20% for November flash sale"

# Bad
git commit -m "Update"
```

### Testing

Before pushing major changes:

1. Validate JSON syntax: https://jsonlint.com/
2. Test in local extension first
3. Push to GitHub
4. Verify in production extension

## Security

### Do NOT commit:

- ❌ Actual affiliate tracking IDs (use placeholders)
- ❌ API keys or secrets
- ❌ Personal information

### Safe to commit:

- ✅ Public discount codes
- ✅ Firm names and URLs
- ✅ Public configuration data

## Automation (Optional)

### Auto-update with GitHub Actions

Create `.github/workflows/validate.yml`:

```yaml
name: Validate JSON

on:
  push:
    paths:
      - 'v1/discounts.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate JSON
        run: |
          python -m json.tool v1/discounts.json > /dev/null
          echo "✓ JSON is valid"
```

This validates JSON syntax on every push.

## Support

- **Issues:** https://github.com/YOUR_USERNAME/propdeals-api/issues
- **Extension:** https://github.com/YOUR_USERNAME/propdeals-extension
- **Email:** support@propdeals.com

---

**Last Updated:** October 23, 2025

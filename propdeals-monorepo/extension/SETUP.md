# PropDeals Extension - Setup Guide

This guide will help you get the PropDeals extension up and running for development and testing.

## Quick Start (5 Minutes)

### 1. Prerequisites

Make sure you have:
- Chrome, Edge, or Brave browser (v90+)
- A text editor (VS Code recommended)
- Basic JavaScript knowledge

### 2. Clone or Download

```bash
# Option 1: Clone repository
git clone https://github.com/yourusername/propdeals.git
cd propdeals/propdeals-extension

# Option 2: Download ZIP and extract
# Then navigate to propdeals-extension folder
```

### 3. Create Extension Icons

You need to create icon files. For testing, you can use placeholder icons:

```bash
# Option A: Use online tool to generate icons
# Visit https://www.favicon-generator.org/
# Upload a logo and download sizes: 16x16, 32x32, 48x48, 128x128
# Place them in the icons/ folder

# Option B: Use ImageMagick to create from a source image
convert source-logo.png -resize 16x16 icons/icon16.png
convert source-logo.png -resize 32x32 icons/icon32.png
convert source-logo.png -resize 48x48 icons/icon48.png
convert source-logo.png -resize 128x128 icons/icon128.png

# Option C: Create simple placeholder icons (for development only)
# You can use any 16x16, 32x32, 48x48, and 128x128 PNG images temporarily
```

**Important**: For production, create professional icons that represent the PropDeals brand.

### 4. Load Extension in Chrome

1. Open Chrome/Edge/Brave
2. Navigate to `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`)
3. Enable **"Developer mode"** (toggle in top right corner)
4. Click **"Load unpacked"**
5. Select the `propdeals-extension` folder
6. Extension is now installed!

### 5. Verify Installation

- Look for the PropDeals icon in your browser toolbar
- Click the icon - you should see the popup with deals
- Click the settings icon (gear) to open settings page
- Check the browser console for any errors

## Configuration

### Update Affiliate Codes

Before going live, you need to get actual affiliate codes from each prop firm:

1. **Apply to Affiliate Programs**
   - FTMO: Visit https://www.ftmo.com/affiliate
   - Apex: Contact support for affiliate program
   - TopStep: Visit https://www.topstepfx.com/affiliate
   - MyFundedFutures: Check their website for affiliate info
   - The5ers: Visit https://www.the5ers.com/affiliate

2. **Update discounts.json**

   Edit `data/discounts.json` and replace placeholder codes:

   ```json
   {
     "affiliate_code": "YOUR_ACTUAL_CODE_HERE",
     "affiliate_url": "https://firm.com/?ref=YOUR_AFFILIATE_ID"
   }
   ```

3. **Test Attribution**

   - Click "Get Deal" buttons in the popup
   - Verify tracking parameters are in the URL
   - Complete a test purchase (if possible)
   - Check affiliate dashboard for attribution

### Configure Discount Expiration Dates

Update expiration dates in `data/discounts.json`:

```json
{
  "discount": {
    "expires_at": "2025-12-31T00:00:00Z"  // Update to actual expiration
  }
}
```

### Customize Branding

1. **Extension Name & Description**

   Edit `manifest.json`:
   ```json
   {
     "name": "Your Extension Name",
     "description": "Your description"
   }
   ```

2. **Colors**

   Edit `styles/popup.css` and `styles/settings.css`:
   ```css
   /* Primary color (currently green #10B981) */
   background: linear-gradient(135deg, #10B981 0%, #059669 100%);

   /* Update to your brand colors */
   background: linear-gradient(135deg, #YOUR_COLOR 0%, #DARKER_SHADE 100%);
   ```

3. **Links**

   Update external links in:
   - `pages/settings.html` (privacy policy, terms, support)
   - `README.md` (GitHub, Twitter, website)

## Testing

### Test Checklist

After setup, verify everything works:

- [ ] Extension loads without console errors
- [ ] Popup displays correctly with all firms
- [ ] Settings page opens and saves preferences
- [ ] Clicking "Get Deal" opens correct URL with affiliate params
- [ ] Copy code button works in popup
- [ ] Notification toggle works in settings
- [ ] Badge shows correct count of active deals

### Test on Real Prop Firm Sites

1. **FTMO**
   - Visit https://www.ftmo.com
   - Navigate to checkout
   - Verify code auto-application works

2. **Apex Trader Funding**
   - Visit https://www.apextraderfunding.com
   - Navigate to checkout
   - Verify code auto-application works

3. Repeat for all supported firms

**Note**: You may need to add items to cart or start signup to reach checkout pages.

### Testing Content Scripts

Open browser console on checkout pages to see logs:

```
[PropDeals:FTMO] Content script loaded
[PropDeals:FTMO] Waiting for checkout page...
[PropDeals:FTMO] Checkout detected!
[PropDeals:FTMO] Code applied successfully: PROPDEALS15
```

## Troubleshooting

### Extension won't load

- **Error**: "Manifest file is missing or unreadable"
  - **Fix**: Ensure `manifest.json` is in the root of `propdeals-extension/` folder

- **Error**: "Invalid manifest version"
  - **Fix**: You need Chrome 90+ for Manifest V3

- **Error**: Icons not found
  - **Fix**: Create placeholder icon files (see step 3 above)

### Popup is blank

- **Check**: Open DevTools (right-click popup → Inspect)
- **Look for**: JavaScript errors in console
- **Common issue**: `discounts.json` not loading
  - **Fix**: Verify file exists at `data/discounts.json`

### Content scripts not working

- **Check**: Visit `chrome://extensions/`
- **Click**: "Errors" button on PropDeals extension
- **Common issues**:
  - Host permissions not granted → Add to `manifest.json`
  - Selector not found → Inspect checkout page and update selectors in `discounts.json`

### Notifications not showing

- **Check**: Chrome notification permissions
  - Visit `chrome://settings/content/notifications`
  - Ensure Chrome extensions can show notifications
- **Check**: Settings page → Notifications toggle is ON
- **Test**: Open background service worker console
  - `chrome://extensions/` → PropDeals → "service worker"
  - Run: `chrome.alarms.create('test', {when: Date.now() + 1000})`

### Codes not applying automatically

1. **Verify checkout URL**
   - Check if current URL matches `checkout_urls` in `discounts.json`

2. **Inspect checkout form**
   - Right-click discount input → Inspect
   - Check if selector matches `selectors.code_field` in `discounts.json`

3. **Update selectors**
   - Edit `discounts.json` with correct CSS selectors
   - Reload extension

## Building for Production

### 1. Update Version

Edit `manifest.json`:
```json
{
  "version": "1.0.0"  // Increment for each release
}
```

### 2. Remove Development Code

- Remove `console.log()` statements (optional)
- Remove debug features
- Verify all placeholder data is replaced with real data

### 3. Create Icons

Create professional icons (required for Chrome Web Store):
- 16x16 px
- 32x32 px
- 48x48 px
- 128x128 px
- 1400x560 px (promotional banner)

### 4. Create ZIP Package

```bash
# Navigate to parent directory
cd ..

# Create ZIP (exclude development files)
zip -r propdeals-extension-v1.0.0.zip propdeals-extension/ \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.DS_Store" \
  -x "*SETUP.md" \
  -x "*scripts/content/README.md" \
  -x "*scripts/content/TESTING_CHECKLIST.md"
```

### 5. Submit to Chrome Web Store

1. Visit https://chrome.google.com/webstore/devconsole
2. Pay one-time $5 developer fee
3. Click "New Item"
4. Upload `propdeals-extension-v1.0.0.zip`
5. Fill out store listing (see README.md for copy)
6. Upload screenshots and promotional images
7. Submit for review (usually takes 1-3 days)

## Next Steps

After setup:

1. **Join Affiliate Programs** - Apply to each prop firm's affiliate program
2. **Update Codes** - Replace placeholder codes with real affiliate codes
3. **Test Thoroughly** - See `scripts/content/TESTING_CHECKLIST.md`
4. **Create Marketing Materials** - Screenshots, demo video, landing page
5. **Soft Launch** - Share with beta testers before public release
6. **Monitor Performance** - Check affiliate dashboards and user feedback

## Support

Need help?
- **Email**: support@propdeals.com
- **GitHub Issues**: https://github.com/yourusername/propdeals/issues
- **Discord**: [Join our community](#) (coming soon)

---

**Ready to launch? Follow the Chrome Web Store submission guide in README.md**

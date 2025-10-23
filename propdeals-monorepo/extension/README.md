# PropDeals Chrome Extension

> Automatically apply discount codes to prop trading firm purchases and never miss a deal.

PropDeals is a Chrome extension that helps traders save money on prop firm evaluations by automatically applying the best available discount codes at checkout. Built on the Honey/Rakuten affiliate model, it generates revenue through prop firm affiliate commissions while providing genuine value to traders.

## Features

### ✨ Core Features

- **🤖 Automatic Code Application** - Detects checkout pages and automatically applies discount codes
- **🔔 Deal Alerts** - Get notified when new discounts become available
- **💰 Best Price Guarantee** - Always applies the highest available discount
- **🎯 Smart Detection** - Works seamlessly with dynamic checkout forms
- **🔒 Privacy First** - No data collection, all preferences stored locally

### 🏢 Supported Prop Firms

- **FTMO** - Up to 15% off all challenges
- **Apex Trader Funding** - Up to 10% off evaluations
- **TopStepFX** - Up to 20% off first month
- **MyFundedFutures** - Up to 12% off all accounts
- **The5ers** - Up to 8% off instant funding

## Installation

### From Chrome Web Store (Recommended)

1. Visit the [PropDeals Chrome Web Store page](#) (coming soon)
2. Click "Add to Chrome"
3. Confirm the installation
4. Click the PropDeals icon to see active deals

### Manual Installation (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/propdeals.git
   cd propdeals/propdeals-extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `propdeals-extension` folder

6. The extension is now installed! Look for the PropDeals icon in your toolbar.

## How It Works

### For Users

1. **Install the extension** - One-time setup from Chrome Web Store
2. **Browse normally** - Visit any supported prop firm website
3. **Automatic savings** - Codes are applied automatically at checkout
4. **Get notified** - Receive alerts when new deals become available

### Technical Flow

1. **Content Script Detection** - When you visit a checkout page, the content script activates
2. **Code Injection** - The best available discount code is found and applied
3. **Success Notification** - You see a toast confirming your savings
4. **Background Monitoring** - Daily checks for new discount updates
5. **Push Notifications** - Alerts when better deals become available

## Project Structure

```
propdeals-extension/
├── manifest.json                    # Extension configuration
├── data/
│   └── discounts.json              # Discount database
├── icons/
│   ├── icon16.png                  # Extension icons (16x16)
│   ├── icon32.png                  # (32x32)
│   ├── icon48.png                  # (48x48)
│   └── icon128.png                 # (128x128)
├── pages/
│   ├── popup.html                  # Main popup UI
│   └── settings.html               # Settings page
├── scripts/
│   ├── background.js               # Service worker
│   ├── popup.js                    # Popup logic
│   ├── settings.js                 # Settings logic
│   └── content/
│       ├── shared-utils.js         # Shared utilities
│       ├── ftmo-content.js         # FTMO integration
│       ├── apex-content.js         # Apex integration
│       ├── topstep-content.js      # TopStep integration
│       ├── myfundedfutures-content.js  # MFF integration
│       └── the5ers-content.js      # The5ers integration
└── styles/
    ├── popup.css                   # Popup styles
    └── settings.css                # Settings styles
```

## Development

### Prerequisites

- Chrome/Edge/Brave browser (v90+)
- Basic knowledge of JavaScript and Chrome Extensions
- Text editor (VS Code recommended)

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/propdeals.git
   cd propdeals/propdeals-extension
   ```

2. **Install the extension in developer mode**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `propdeals-extension` folder

3. **Make changes**
   - Edit files as needed
   - Refresh the extension in `chrome://extensions/`
   - Test changes on actual prop firm websites

### Adding a New Prop Firm

1. **Update discounts.json**
   ```json
   {
     "id": "newfirm",
     "name": "New Prop Firm",
     "logo_url": "https://newfirm.com/favicon.ico",
     "site_url": "https://newfirm.com",
     "affiliate_url": "https://newfirm.com/?ref=propdeals",
     "affiliate_code": "PROPDEALS15",
     "discount": {
       "type": "percentage",
       "amount": 15,
       "expires_at": "2025-12-31T00:00:00Z",
       "description": "15% off all accounts"
     },
     "checkout_urls": [
       "https://newfirm.com/checkout"
     ],
     "selectors": {
       "code_field": "#discount_code",
       "apply_button": "button.apply-code"
     }
   }
   ```

2. **Create content script**
   ```bash
   # Create scripts/content/newfirm-content.js
   # Base it on existing firm scripts
   ```

3. **Update manifest.json**
   ```json
   {
     "matches": ["https://newfirm.com/*"],
     "js": ["scripts/content/shared-utils.js", "scripts/content/newfirm-content.js"],
     "run_at": "document_idle"
   }
   ```

4. **Add host permissions**
   ```json
   "host_permissions": [
     "https://newfirm.com/*"
   ]
   ```

5. **Test thoroughly** - See `scripts/content/TESTING_CHECKLIST.md`

### Updating Discount Codes

Discounts are managed in `data/discounts.json`:

1. Edit the `discount` object for the relevant firm
2. Update `amount`, `expires_at`, and `description`
3. Increment the `version` field at the top level
4. Update `updated_at` timestamp
5. Reload the extension
6. The background script will detect changes and notify users

## Testing

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup displays all active deals
- [ ] Settings page opens and saves preferences
- [ ] Notifications toggle works
- [ ] Code auto-application works on each firm's checkout
- [ ] Toast notifications appear on successful application
- [ ] Fallback to clipboard copy works when auto-apply fails
- [ ] Badge count shows correct number of active deals
- [ ] Daily discount check alarm is set
- [ ] "How It Works" modal displays correctly

### Automated Testing

```bash
# No automated tests yet - MVP uses manual testing
# Future: Add Jest for unit tests, Puppeteer for E2E tests
```

### Testing on Real Sites

1. Visit each prop firm's website
2. Add an item to cart / start checkout
3. Verify discount code is automatically applied
4. Check console for any errors
5. Verify success toast appears
6. Test with slow connections (throttle in DevTools)

## Monetization

PropDeals operates on an affiliate commission model:

- **Revenue Source**: Affiliate commissions from prop firms (5-15% per purchase)
- **User Cost**: $0 - users actually save money with discount codes
- **Transparency**: Full disclosure in popup footer and settings page
- **Ethics**: Only promote legitimate firms with real discounts

### Affiliate Program Setup

1. Apply to each firm's affiliate program separately
2. Get unique affiliate tracking codes/URLs
3. Update `affiliate_code` and `affiliate_url` in `discounts.json`
4. Test attribution (some use cookies, some use URL params)
5. Monitor conversions via affiliate dashboards

## Privacy & Legal

### Data Collection

**We collect ZERO personal data.**

- ✅ No tracking pixels
- ✅ No analytics (optional for future)
- ✅ No personal information
- ✅ No browsing history
- ✅ Settings stored locally only

### Permissions Used

- `storage` - Save user notification preferences locally
- `notifications` - Show new deal alerts
- `activeTab` - Apply codes on checkout pages
- `alarms` - Check for discount updates daily
- `host_permissions` - Access checkout pages of supported firms only

### Compliance

- Full affiliate disclosure in UI
- Privacy policy available at settings
- Terms of service link provided
- Chrome Web Store policies followed
- No trademark infringement (descriptive use only)

## Chrome Web Store Listing

### Store Listing Copy

**Name**: PropDeals - Prop Firm Discounts

**Short Description**:
Automatically apply discount codes to prop trading firm purchases. Never miss a deal on FTMO, Apex, TopStep, and more.

**Detailed Description**:
PropDeals helps traders save money on prop firm evaluations by automatically finding and applying the best discount codes at checkout.

**✨ Key Features:**
• Automatic code application at checkout
• Real-time deal alerts for new discounts
• Support for top prop firms (FTMO, Apex, TopStep, MyFundedFutures, The5ers)
• Privacy-first (no data collection)
• 100% free to use

**💰 How It Works:**
1. Install the extension
2. Visit any supported prop firm
3. Codes are automatically applied at checkout
4. Save money - it's that simple!

**🔒 Your Privacy:**
We don't collect, store, or sell your data. Period. Your notification preferences are stored locally on your device only.

**💡 Affiliate Disclosure:**
PropDeals earns affiliate commissions when you purchase through our links. This costs you nothing extra - you actually save money with our exclusive discount codes!

**Category**: Shopping
**Language**: English
**Pricing**: Free

### Screenshots Needed

1. **Main Popup** - Showing active deals for all firms
2. **Code Applied** - Toast notification on checkout page
3. **Settings Page** - Full settings interface
4. **Deal Alert** - Browser notification example
5. **Promo Image** - 1400x560px promotional banner

## Roadmap

### Version 1.0 (Current - MVP)
- [x] 5 supported prop firms
- [x] Automatic code application
- [x] Discount notifications
- [x] Settings panel
- [x] Chrome extension

### Version 1.1 (Next)
- [ ] 10+ supported firms
- [ ] Price comparison tool
- [ ] Deal history tracking
- [ ] Analytics dashboard
- [ ] Firefox extension

### Version 2.0 (Future)
- [ ] User accounts (optional)
- [ ] Social sharing features
- [ ] Community-voted deals
- [ ] Mobile app
- [ ] Safari extension

## Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** (see Testing section)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on all supported firms
- Update documentation
- Don't break existing functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Email**: support@propdeals.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/propdeals/issues)
- **Twitter**: [@propdeals](https://twitter.com/propdeals)

## Acknowledgments

- Inspired by Honey and Rakuten
- Built for the prop trading community
- Special thanks to all beta testers

## Disclaimer

PropDeals is an independent tool and is not affiliated with, endorsed by, or sponsored by any of the prop firms mentioned. All firm names and logos are property of their respective owners and are used for identification purposes only.

Discount codes and offers are subject to change. PropDeals makes best efforts to keep information up-to-date but cannot guarantee accuracy. Always verify final pricing at checkout.

---

**Made with ❤️ by Trevor for the prop trading community**

*Last updated: October 23, 2025*

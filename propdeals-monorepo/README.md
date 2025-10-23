# PropDeals - Prop Firm Discount Extension

> Automatically apply discount codes to prop trading firm purchases and never miss a deal.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/API-GitHub%20Pages-success)](https://YOUR_USERNAME.github.io/propdeals/v1/discounts.json)

## 🎯 What is PropDeals?

PropDeals is a Chrome extension that automatically finds and applies the best discount codes for prop trading firm evaluations. Built on the Honey/Rakuten affiliate model, it helps traders save money while generating revenue through affiliate commissions.

### Key Features

- 🤖 **Automatic Code Application** - Detects checkout pages and applies codes automatically
- 🔔 **Deal Alerts** - Get notified when new discounts become available
- 💰 **Best Price Guarantee** - Always applies the highest available discount
- 🔄 **Real-time Updates** - Discounts update via GitHub Pages (no extension update needed)
- 🔒 **Privacy First** - Zero data collection, all preferences stored locally

### Supported Prop Firms

- **FTMO** - Up to 15% off
- **Apex Trader Funding** - Up to 10% off
- **TopStepFX** - Up to 20% off
- **MyFundedFutures** - Up to 12% off
- **The5ers** - Up to 8% off

---

## 📁 Repository Structure

```
propdeals/
├── extension/              # Chrome extension source code
│   ├── manifest.json      # Extension configuration
│   ├── scripts/           # Background & content scripts
│   ├── pages/             # Popup and settings UI
│   ├── styles/            # CSS stylesheets
│   ├── icons/             # Extension icons
│   └── data/              # Bundled discount data (fallback)
│
├── api/                   # GitHub Pages API (remote discounts)
│   ├── v1/
│   │   └── discounts.json # Remote discount database
│   └── index.html         # API landing page
│
├── docs/                  # Documentation
│   ├── SETUP.md
│   ├── DISCOUNT_UPDATE_STRATEGY.md
│   ├── WHITE_LABEL_STRATEGY.md
│   └── REMOTE_FETCH_IMPLEMENTATION_SUMMARY.md
│
└── README.md              # This file
```

---

## 🚀 Quick Start

### For Users (Install Extension)

1. Visit the [Chrome Web Store](#) (coming soon)
2. Click "Add to Chrome"
3. Visit any supported prop firm's checkout page
4. Discount automatically applies!

### For Developers (Run Locally)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/propdeals.git
   cd propdeals
   ```

2. **Load extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

3. **Set up GitHub Pages API** (for remote fetching)
   - Follow `docs/SETUP.md` for detailed instructions
   - Or use the bundled `extension/data/discounts.json` (fallback mode)

---

## 🛠️ Development

### Prerequisites

- Chrome/Edge/Brave browser (v90+)
- Git
- Text editor (VS Code recommended)
- GitHub account (for API hosting)

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/propdeals.git
cd propdeals

# Generate extension icons (optional)
cd extension
python generate_icons.py

# Load extension in Chrome
# chrome://extensions/ → Load unpacked → select extension/ folder
```

### Project Architecture

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks (lightweight)
- **Remote API** - GitHub Pages for discount updates
- **Service Worker** - Background script for notifications
- **Content Scripts** - Per-firm code injection

### Key Technologies

- Chrome Extensions Manifest V3
- GitHub Pages (API hosting)
- JavaScript (ES6+)
- CSS3
- HTML5

---

## 📊 How It Works

### Architecture Flow

```
User visits checkout
    ↓
Content script detects page
    ↓
Checks for discount code
    ↓
Applies code automatically
    ↓
Shows success notification
```

### Remote Discount Updates

```
You update api/v1/discounts.json
    ↓
git push to GitHub
    ↓
GitHub Pages deploys (1-2 min)
    ↓
Extensions fetch update (24h or manual)
    ↓
Users see new deals automatically!
```

**No Chrome Web Store resubmission needed!**

---

## 💰 Monetization

PropDeals uses an affiliate commission model:

- **Revenue**: 5-15% commission per prop firm signup
- **User Cost**: $0 (users save money with discount codes)
- **Business Model**: Honey/Rakuten for prop trading

### Revenue Projections

- **Month 3**: $1,000 MRR (target)
- **Month 12**: $5,000 MRR (target)
- **Profit Margin**: 95%+

See `docs/WHITE_LABEL_STRATEGY.md` for scaling plans.

---

## 🔄 Updating Discounts

### Method 1: GitHub Web Interface (Easiest)

1. Navigate to `api/v1/discounts.json` on GitHub.com
2. Click **Edit** (pencil icon)
3. Make changes
4. Increment version number
5. Click **Commit changes**
6. ✅ Live in 1-2 minutes!

### Method 2: Git Command Line

```bash
# Edit discount file
vim api/v1/discounts.json

# Commit and push
git add api/v1/discounts.json
git commit -m "Update FTMO discount to 20%"
git push

# Auto-deploys to GitHub Pages
```

### Update Checklist

- [ ] Increment `version` number
- [ ] Update `updated_at` timestamp
- [ ] Verify `expires_at` dates
- [ ] Test affiliate URLs
- [ ] Commit with descriptive message

---

## 🧪 Testing

### Manual Testing

```bash
# Load extension in Chrome
# Visit prop firm checkout page
# Verify code applies automatically
# Check console for errors
```

### Test Checklist

- [ ] Extension loads without errors
- [ ] Popup displays all firms
- [ ] Settings page opens
- [ ] Notifications toggle works
- [ ] Code auto-applies on each firm
- [ ] Remote fetch works
- [ ] Refresh button works
- [ ] Offline mode works (cached data)

See `extension/scripts/content/TESTING_CHECKLIST.md` for detailed tests.

---

## 📝 Documentation

Comprehensive docs available in `/docs`:

- **SETUP.md** - Complete setup guide
- **DISCOUNT_UPDATE_STRATEGY.md** - How to keep deals fresh
- **WHITE_LABEL_STRATEGY.md** - Scale with partners
- **REMOTE_FETCH_IMPLEMENTATION_SUMMARY.md** - Technical details
- **THEME_COLORS.md** - Color scheme reference

---

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Contribution Ideas

- Add support for more prop firms
- Improve UI/UX
- Add new features (price comparison, deal history)
- Write tests
- Improve documentation
- Fix bugs

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Chrome Web Store**: [Coming soon](#)
- **Website**: [propdeals.com](#) (coming soon)
- **Support**: support@propdeals.com
- **Twitter**: [@propdeals](#)
- **Discord**: [Join community](#)

---

## 🎓 Learn More

### Related Projects

- [Honey](https://www.joinhoney.com/) - Inspiration for auto-apply coupons
- [Rakuten](https://www.rakuten.com/) - Cashback browser extension

### Prop Trading Resources

- [FTMO](https://www.ftmo.com)
- [Apex Trader Funding](https://www.apextraderfunding.com)
- [TopStepFX](https://www.topstepfx.com)

---

## ⭐ Support the Project

If you find PropDeals useful:

- ⭐ Star this repository
- 🐛 Report bugs via [Issues](https://github.com/YOUR_USERNAME/propdeals/issues)
- 💡 Suggest features
- 📢 Share with other traders
- 🤝 Contribute code

---

## 🙏 Acknowledgments

- Chrome Extensions documentation
- Prop trading community
- Open source contributors
- Beta testers

---

## 📈 Roadmap

### Version 1.0 (Current)
- [x] 5 supported prop firms
- [x] Automatic code application
- [x] Remote discount updates
- [x] Notifications
- [x] Settings panel

### Version 1.1 (Next)
- [ ] 10+ supported firms
- [ ] Price comparison tool
- [ ] Deal history tracking
- [ ] Firefox extension
- [ ] Analytics dashboard

### Version 2.0 (Future)
- [ ] User accounts (optional)
- [ ] Social features
- [ ] Mobile app
- [ ] White-label platform
- [ ] API for partners

---

**Made with ❤️ for the prop trading community**

*Last updated: October 23, 2025*

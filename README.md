# PropDeals Project

**Automated prop firm discount extension with dynamic influencer branding**

---

## 📁 Structure

This repository contains the **PropDeals Monorepo** - a unified codebase for the Chrome extension, API, and documentation.

```
prop-deals/
├── .claude/              # Claude Code configuration
├── .git/                 # Git repository
└── propdeals-monorepo/   # MAIN PROJECT FOLDER ⭐
    ├── extension/        # Chrome extension source code
    ├── api/              # API data (discounts, influencers)
    ├── docs/             # Documentation
    └── white-label/      # Legacy white-label builder (deprecated)
```

---

## 🚀 Quick Start

### Load Extension in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: `propdeals-monorepo/extension`

### Test the Influencer System

1. Load extension (opens onboarding automatically)
2. Select an influencer (Trade With John or Prop Academy)
3. Extension rebrands to their theme
4. See their custom deals and codes

---

## 📖 Documentation

- **[Influencer Guide](propdeals-monorepo/docs/INFLUENCER_GUIDE.md)** - For influencers joining the program
- **[Dynamic System](propdeals-monorepo/docs/DYNAMIC_INFLUENCER_SYSTEM.md)** - Technical architecture
- **[Branding Customization](propdeals-monorepo/docs/BRANDING_CUSTOMIZATION.md)** - How extension rebranding works
- **[Tracking System](propdeals-monorepo/docs/TRACKING_SYSTEM.md)** - How extension vs manual code tracking works
- **[Deployment](propdeals-monorepo/DEPLOY.md)** - How to deploy to production
- **[Summary](propdeals-monorepo/INFLUENCER_SYSTEM_SUMMARY.md)** - Quick reference

---

## 🎯 Key Features

### Dynamic Influencer System
- Single extension for all influencers
- Users select their favorite influencer during onboarding
- Extension dynamically rebrands (colors, name, logo, codes)
- Influencers earn 70% commission on sales

### Supported Prop Firms
- FTMO
- Apex Trader Funding
- TopStepFX
- MyFundedFutures
- The5ers

### Auto-Apply Discount Codes
- Content scripts detect checkout pages
- Automatically apply influencer's affiliate codes
- Toast notifications on success
- Works with single-page apps

### Remote Updates
- Discounts fetched from API
- 24-hour caching with force refresh
- No Chrome Web Store resubmission needed
- Graceful fallback to bundled data

---

## 🛠️ Development

### Current Status
✅ Extension fully functional
✅ Onboarding flow complete
✅ Dynamic branding working
✅ Influencer system operational
✅ Local fallback mode enabled

### Next Steps
1. Deploy API to GitHub Pages
2. Update `USE_LOCAL_FALLBACK = false` in background.js
3. Submit to Chrome Web Store
4. Recruit first influencers
5. Launch!

---

## 📊 System Architecture

```
User Installs Extension
    ↓
Onboarding Flow (4 steps)
    ↓
Selects Influencer (or skips)
    ↓
Extension Stores Selection
    ↓
Popup Opens → Applies Branding
    ↓
Fetches Discounts → Merges Influencer Codes
    ↓
Shows Branded Deals
    ↓
User Clicks Deal → Visits Prop Firm
    ↓
Content Script Auto-Applies Code
    ↓
Purchase → Influencer Gets 70% Commission
```

---

## 🎨 Example: How Influencer Branding Works

**Default (No Influencer Selected):**
```
Extension Name: "PropDeals"
Header: "PropDeals"
Colors: Green (#10B981)
Deals: Default codes
```

**After Selecting "John's Trading Deals":**
```
Extension Name: "John's Trading Deals"  ✨
Header: "John's Deals"                  ✨
Colors: Blue (#3B82F6)                  ✨
Deals: John's codes (JOHN15, JOHN10)    ✨
```

---

## 📞 Contact

- **Development**: dev@propdeals.com
- **Partnerships**: partners@propdeals.com
- **Support**: support@propdeals.com

---

**Last Updated:** October 23, 2025
**Version:** 2.0.0 (Dynamic Influencer System)

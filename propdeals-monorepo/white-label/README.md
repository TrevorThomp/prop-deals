# PropDeals White Label System

**Create branded extensions for partners in minutes**

---

## 🎯 Overview

The PropDeals White Label System allows affiliate partners, influencers, and trading communities to create their own branded versions of the PropDeals extension with:

- ✅ Custom branding (colors, logos, text)
- ✅ Partner-specific affiliate codes
- ✅ Selective firm inclusion
- ✅ Custom messaging
- ✅ Revenue tracking

---

## 📁 Structure

```
white-label/
├── partner-builder.html       # Web-based configuration builder
├── partner-builder.js          # Builder JavaScript logic
├── partner-config-schema.json  # JSON schema for validation
│
├── builder/
│   ├── build-extension.js     # CLI tool to generate extensions
│   ├── package.json           # Node.js dependencies
│   └── server.js              # Optional: Web server for builder
│
├── examples/
│   ├── tradewith-john.json    # Example: YouTube influencer
│   └── prop-academy.json      # Example: Trading course
│
├── partners/                  # Generated partner extensions
│   ├── tradewithJohn/
│   │   ├── extension/         # Built extension files
│   │   └── tradewithJohn-extension-v1.0.0.zip
│   └── propAcademy/
│       └── ...
│
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Option 1: Web Interface (Easiest)

1. **Open the builder**
   ```bash
   # Open in browser
   open white-label/partner-builder.html
   ```

2. **Fill in partner details**
   - Partner info (name, email, website)
   - Extension details (name, description)
   - Branding (colors, logo, tagline)
   - Select prop firms to include
   - Add affiliate codes

3. **Preview in real-time**
   - See how the extension looks
   - Adjust colors and text

4. **Download configuration**
   - Click "Download Config JSON"
   - Saves `partner-config.json`

5. **Build extension**
   ```bash
   cd white-label/builder
   npm install
   node build-extension.js partner-config.json
   ```

### Option 2: Manual Configuration

1. **Create config file**
   ```bash
   cp white-label/examples/tradewith-john.json my-partner-config.json
   ```

2. **Edit configuration**
   ```json
   {
     "partner": {
       "id": "mypartner",
       "name": "My Partner Name",
       "email": "support@mypartner.com"
     },
     "extension": {
       "name": "MyDeals",
       "description": "Exclusive prop firm discounts"
     },
     "branding": {
       "primary_color": "#3B82F6",
       "logo_text": "MyDeals"
     },
     "firms": [...]
   }
   ```

3. **Build extension**
   ```bash
   cd white-label/builder
   node build-extension.js ../my-partner-config.json
   ```

---

## 🎨 Configuration Guide

### Partner Information

```json
{
  "partner": {
    "id": "unique_id",              // Lowercase, no spaces
    "name": "Display Name",          // Public-facing name
    "email": "support@partner.com",  // Support email
    "website": "https://partner.com", // Optional
    "social": {
      "youtube": "https://youtube.com/@partner",
      "twitter": "https://twitter.com/partner",
      "discord": "https://discord.gg/partner"
    }
  }
}
```

### Extension Details

```json
{
  "extension": {
    "name": "BrandDeals by Partner",    // Max 45 chars
    "short_name": "BrandDeals",         // Max 12 chars
    "description": "Description here",  // Max 132 chars
    "version": "1.0.0"                  // Semver format
  }
}
```

### Branding & Theme

```json
{
  "branding": {
    "theme_name": "Trading Blue",
    "primary_color": "#3B82F6",    // Main brand color
    "secondary_color": "#1E40AF",  // Darker shade
    "accent_color": "#60A5FA",     // Highlights
    "logo_text": "BrandDeals",     // Shown in popup
    "tagline": "Save with Partner" // Under logo
  }
}
```

**Available Themes:**
- **Profit Green** - `#10B981` (default PropDeals)
- **Trading Blue** - `#3B82F6`
- **Gold Rush** - `#F59E0B`
- **Royal Purple** - `#8B5CF6`
- **Custom** - Use your own hex colors

### Firm Selection

```json
{
  "firms": [
    {
      "firm_id": "ftmo",
      "enabled": true,
      "affiliate_code": "PARTNER15",
      "affiliate_url": "https://www.ftmo.com/?ref=partner"
    },
    {
      "firm_id": "apex",
      "enabled": true,
      "affiliate_code": "PARTNER10",
      "affiliate_url": "https://www.apextraderfunding.com/?ref=partner",
      "custom_discount": {
        "amount": 15,
        "description": "15% off - Partner exclusive!",
        "expires_at": "2025-12-31T23:59:59Z"
      }
    },
    {
      "firm_id": "topstep",
      "enabled": false  // Exclude this firm
    }
  ]
}
```

**Available Firms:**
- `ftmo` - FTMO
- `apex` - Apex Trader Funding
- `topstep` - TopStepFX
- `myfundedfutures` - MyFundedFutures
- `the5ers` - The5ers

### Customization

```json
{
  "customization": {
    "welcome_message": "Welcome! Thanks for supporting...",
    "footer_text": "Made with ❤️ by Partner",
    "show_partner_branding": true,
    "custom_features": {
      "notifications_default": true,
      "show_expiration_countdown": true
    }
  }
}
```

---

## 🛠️ Builder Tool Usage

### Installation

```bash
cd white-label/builder
npm install
```

### Build Extension

```bash
# Build from config file
node build-extension.js <config.json>

# Example
node build-extension.js ../examples/tradewith-john.json

# Output
# partners/tradewithJohn/extension/
# partners/tradewithJohn/tradewithJohn-extension-v1.0.0.zip
```

### What Gets Generated

```
partners/tradewithJohn/
├── extension/                    # Ready to load in Chrome
│   ├── manifest.json            # Customized manifest
│   ├── pages/
│   │   ├── popup.html           # Branded popup
│   │   └── settings.html        # Branded settings
│   ├── styles/
│   │   ├── popup.css            # Custom colors applied
│   │   └── settings.css
│   ├── scripts/                 # Extension logic (unchanged)
│   ├── icons/                   # Custom icons (if generated)
│   ├── data/
│   │   └── discounts.json       # Filtered to enabled firms only
│   └── README.md                # Partner-specific readme
│
└── tradewithJohn-extension-v1.0.0.zip  # Ready for Chrome Web Store
```

---

## 📋 Partner Onboarding Workflow

### Step 1: Application

Partner fills out application:
- Name, email, social media
- Audience size
- Current affiliate partnerships
- Desired firms

### Step 2: Approval

Review criteria:
- ✅ 5,000+ engaged followers
- ✅ Trading-related content
- ✅ Good community reputation
- ✅ Active affiliate participation

### Step 3: Configuration

Partner uses web builder to create config:
1. Open `partner-builder.html`
2. Fill in details
3. Choose branding
4. Select firms
5. Download config JSON

### Step 4: Extension Generation

You build extension for them:
```bash
node build-extension.js partner-config.json
```

Or partner can build themselves if given access.

### Step 5: Testing

Partner tests extension:
1. Load unpacked in Chrome
2. Verify branding looks correct
3. Test on prop firm websites
4. Confirm affiliate codes work

### Step 6: Chrome Web Store Submission

**Option A: Partner submits**
- They pay $5 developer fee
- They own the listing
- You provide support

**Option B: You submit under master account**
- You control updates
- Easier for partner
- Requires agreement

### Step 7: Launch

- Extension goes live
- Partner promotes to audience
- You track conversions
- Revenue share begins

---

## 💰 Revenue Tracking

### Monetization Models

**Model 1: Revenue Share (Recommended)**
```json
{
  "monetization": {
    "model": "revenue_share",
    "platform_share": 0.30,  // 30% to PropDeals
    "partner_share": 0.70    // 70% to Partner
  }
}
```

**Model 2: Flat Fee**
- One-time: $200-500
- Partner keeps 100% of revenue

**Model 3: SaaS Subscription**
- Monthly: $50-100/month
- Partner keeps 100% of revenue

### Attribution Tracking

Each partner gets unique tracking:

```
https://ftmo.com/?ref=tradewithJohn_JOHN15

Format: {firm_url}/?ref={partner_id}_{code}
```

This allows you to track:
- Which partner drove the sale
- Which firm was purchased
- Revenue per partner

---

## 🎯 Examples

### Example 1: YouTube Influencer (tradewith-john.json)

**Profile:**
- 25K YouTube subscribers
- Trading education content
- Active Discord community

**Configuration:**
- Theme: Trading Blue (`#3B82F6`)
- Firms: FTMO, Apex, TopStep (3 firms)
- Exclusive 25% TopStep deal
- Custom welcome message

**Result:**
- 850 installs in first 30 days
- 18 conversions
- $476 partner revenue

### Example 2: Trading Course (prop-academy.json)

**Profile:**
- 10K course students
- Comprehensive prop trading curriculum
- Premium community

**Configuration:**
- Theme: Gold Rush (`#F59E0B`)
- Firms: All 5 firms enabled
- Student-exclusive discounts
- Academy branding

**Result:**
- 1,200 installs
- 24 conversions
- $680 partner revenue

---

## 🔧 Advanced Customization

### Custom Icons

Generate icons with brand colors:

```bash
# Edit extension/generate_icons.py
# Update colors to match brand
python generate_icons.py
```

Or use online tool: https://www.favicon-generator.org/

### Custom Features

Add partner-specific features in config:

```json
{
  "custom_features": {
    "show_partner_message": true,
    "custom_notification_sound": "partner-sound.mp3",
    "exclusive_deals_only": true
  }
}
```

Then implement in builder script.

### A/B Testing

Test different configurations:

```json
{
  "ab_test": {
    "enabled": true,
    "variants": [
      {"theme": "blue", "tagline": "Save money"},
      {"theme": "green", "tagline": "Get discounts"}
    ]
  }
}
```

---

## 📊 Analytics & Reporting

### Metrics to Track

**Per Partner:**
- Extension installs
- Daily active users
- Clicks per firm
- Conversions
- Revenue generated
- Partner share owed

### Dashboard Ideas

Create partner dashboard showing:
- Real-time stats
- Revenue breakdown by firm
- Top performing codes
- Payout status
- User demographics (if available)

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Configuration validation failed"
- Check all required fields are filled
- Verify partner ID is lowercase with no spaces
- Ensure at least one firm is enabled

**Error**: "Cannot find module 'archiver'"
- Run `npm install` in `white-label/builder/`

### Extension Not Loading

**Issue**: Chrome shows errors
- Check `manifest.json` syntax
- Verify all file paths exist
- Test with original PropDeals extension first

### Colors Not Applying

**Issue**: Still shows green
- Check CSS files were updated
- Verify hex colors are valid (#RRGGBB format)
- Clear Chrome cache and reload extension

---

## 🚀 Scaling to 50+ Partners

### Automation

**Auto-build on config upload:**
```javascript
// Set up webhook
// When partner uploads config to dashboard
// Automatically trigger build
// Email download link when ready
```

**Scheduled builds:**
```bash
# Cron job to rebuild all partners weekly
# Ensures they get latest bug fixes
0 0 * * 0 node rebuild-all-partners.js
```

### Template Updates

When you update the core extension:

1. Test changes in main extension
2. Rebuild all partner extensions
3. Notify partners of updates
4. They resubmit to Chrome Web Store (or you do)

---

## 📞 Support

**For Partners:**
- Partner documentation: `partner-builder.html` (built-in help)
- Video tutorial: Record screen walkthrough
- Email support: partners@propdeals.com

**For You:**
- Technical docs: This README
- Schema reference: `partner-config-schema.json`
- Examples: `examples/` folder

---

## ✅ Checklist for New Partner

- [ ] Partner applies and is approved
- [ ] Partner uses `partner-builder.html` to create config
- [ ] Partner provides affiliate codes for desired firms
- [ ] You build extension using CLI tool
- [ ] Partner tests extension locally
- [ ] Partner submits to Chrome Web Store
- [ ] Extension approved and goes live
- [ ] Partner promotes to audience
- [ ] You set up analytics tracking
- [ ] Revenue tracking begins
- [ ] Monthly payout system established

---

## 🎓 Next Steps

1. **Test the builder**: Open `partner-builder.html` and create a test config
2. **Build example**: Run `node build-extension.js examples/tradewith-john.json`
3. **Test extension**: Load the built extension in Chrome
4. **Recruit partners**: Reach out to trading influencers
5. **Scale**: Automate onboarding and builds

---

**Ready to onboard your first partner? Start with the web builder!**

```bash
open white-label/partner-builder.html
```

---

**Last Updated:** October 23, 2025
**Version:** 1.0.0

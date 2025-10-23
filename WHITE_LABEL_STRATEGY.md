# PropDeals White Label Strategy

**Version:** 1.0
**Date:** October 23, 2025
**Purpose:** Enable affiliate influencers to brand and monetize the extension

---

## Executive Summary

Transform PropDeals into a white-label platform that allows trading influencers, YouTubers, and affiliate marketers to create branded versions of the extension with their own affiliate codes and branding.

**Revenue Model:**
- **Option A**: One-time setup fee ($200-500) + revenue share (20-30%)
- **Option B**: Monthly SaaS fee ($50-100/month) with full revenue to partner
- **Option C**: Free to partners, 50/50 revenue split

**Target Partners:**
- Trading YouTubers (10K+ subscribers)
- Prop trading educators
- Trading Discord/Telegram communities
- Affiliate marketing agencies

---

## Technical Architecture

### Current Extension Structure

```
propdeals-extension/
├── manifest.json                    # Hard-coded branding
├── data/discounts.json             # Hard-coded affiliate codes
├── pages/popup.html                # Hard-coded text/links
├── scripts/                        # Generic logic ✅
└── styles/                         # Hard-coded colors
```

### White Label Architecture (Proposed)

```
white-label-platform/
├── core/                           # Shared core code
│   ├── manifest.template.json      # Template with variables
│   ├── scripts/                    # Generic scripts (no changes needed)
│   ├── pages/
│   │   ├── popup.template.html     # Variables for branding
│   │   └── settings.template.html
│   └── styles/
│       ├── popup.template.css      # CSS variables for theming
│       └── settings.template.css
│
├── builder/                        # White label builder tool
│   ├── web-app/                    # Web interface for partners
│   │   ├── dashboard.html          # Partner dashboard
│   │   ├── branding-editor.html    # Visual branding editor
│   │   └── generate-extension.js   # Build extension
│   └── cli/                        # Command-line builder
│       └── build-extension.js      # Automated builds
│
├── partners/                       # Partner configurations
│   ├── partner-1/
│   │   ├── config.json            # Partner branding & codes
│   │   ├── icons/                 # Custom icons
│   │   └── generated/             # Built extension
│   └── partner-2/
│       └── ...
│
└── shared/
    └── analytics.js               # Revenue tracking & attribution
```

---

## White Label Configuration System

### 1. Partner Config File (`config.json`)

Each partner gets a configuration file that customizes everything:

```json
{
  "version": "1.0.0",
  "partner": {
    "id": "tradewithJohn",
    "name": "John's Trading Tools",
    "email": "support@johntrades.com",
    "website": "https://johntrades.com",
    "affiliate_id": "JOHN123"
  },

  "extension": {
    "name": "TradeDeals by John",
    "short_name": "TradeDeals",
    "description": "John's exclusive prop firm discount finder",
    "version": "1.0.0"
  },

  "branding": {
    "primary_color": "#3B82F6",
    "secondary_color": "#1E40AF",
    "accent_color": "#F59E0B",
    "logo_text": "TradeDeals",
    "tagline": "Save on prop firms with John"
  },

  "affiliate_codes": {
    "ftmo": {
      "code": "JOHN15",
      "url": "https://ftmo.com/?ref=john123",
      "commission_rate": 10,
      "revenue_share": 0.3
    },
    "apex": {
      "code": "JOHNAPEX10",
      "url": "https://apextraderfunding.com/?ref=john123",
      "commission_rate": 8,
      "revenue_share": 0.3
    }
  },

  "features": {
    "notifications_enabled": true,
    "auto_updates": true,
    "analytics_tracking": true,
    "partner_branding": true
  },

  "monetization": {
    "model": "revenue_share",
    "platform_share": 0.3,
    "partner_share": 0.7,
    "minimum_payout": 50
  },

  "links": {
    "support": "https://johntrades.com/support",
    "privacy": "https://johntrades.com/privacy",
    "terms": "https://johntrades.com/terms",
    "social": {
      "youtube": "https://youtube.com/@johntrades",
      "twitter": "https://twitter.com/johntrades",
      "discord": "https://discord.gg/johntrades"
    }
  }
}
```

### 2. Template System

Convert existing files to templates with placeholders:

**manifest.template.json:**
```json
{
  "manifest_version": 3,
  "name": "{{extension.name}}",
  "short_name": "{{extension.short_name}}",
  "version": "{{extension.version}}",
  "description": "{{extension.description}}",
  "author": "{{partner.name}}",
  ...
}
```

**popup.template.html:**
```html
<div class="header" style="background: {{branding.primary_color}};">
  <h1>{{branding.logo_text}}</h1>
  <p>{{branding.tagline}}</p>
</div>

<footer>
  <p>Powered by <a href="{{partner.website}}">{{partner.name}}</a></p>
</footer>
```

**popup.template.css:**
```css
:root {
  --primary-color: {{branding.primary_color}};
  --secondary-color: {{branding.secondary_color}};
  --accent-color: {{branding.accent_color}};
}

.header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}
```

### 3. Builder Script

Automated extension generator:

```javascript
// builder/cli/build-extension.js

const fs = require('fs');
const path = require('path');

function buildExtension(partnerId) {
  const config = loadPartnerConfig(partnerId);

  // 1. Create output directory
  const outputDir = `partners/${partnerId}/generated/`;
  fs.mkdirSync(outputDir, { recursive: true });

  // 2. Process templates
  processTemplate('manifest.template.json', config, outputDir);
  processTemplate('pages/popup.template.html', config, outputDir);
  processTemplate('styles/popup.template.css', config, outputDir);

  // 3. Copy static files (scripts - unchanged)
  copyDirectory('core/scripts/', `${outputDir}/scripts/`);

  // 4. Generate discounts.json with partner codes
  generateDiscountsFile(config, outputDir);

  // 5. Copy partner icons
  copyDirectory(`partners/${partnerId}/icons/`, `${outputDir}/icons/`);

  // 6. Create ZIP package
  createZipPackage(outputDir, `${partnerId}-extension-v${config.version}.zip`);

  console.log(`✓ Extension built for ${config.partner.name}`);
}

function processTemplate(templatePath, config, outputDir) {
  let content = fs.readFileSync(`core/${templatePath}`, 'utf8');

  // Replace all {{variable.path}} with values from config
  content = content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    return getNestedValue(config, path);
  });

  const outputPath = path.join(outputDir, templatePath.replace('.template', ''));
  fs.writeFileSync(outputPath, content);
}

function generateDiscountsFile(config, outputDir) {
  const discounts = {
    version: config.extension.version,
    updated_at: new Date().toISOString(),
    firms: []
  };

  Object.entries(config.affiliate_codes).forEach(([firmId, data]) => {
    discounts.firms.push({
      id: firmId,
      affiliate_code: data.code,
      affiliate_url: data.url,
      // ... rest of firm data
    });
  });

  fs.writeFileSync(
    path.join(outputDir, 'data/discounts.json'),
    JSON.stringify(discounts, null, 2)
  );
}
```

---

## Partner Onboarding Flow

### Step 1: Application & Approval

**Partner applies through web form:**
- Name, email, social media links
- Audience size (YouTube subscribers, Discord members, etc.)
- Current affiliate partnerships
- Traffic estimates

**Approval criteria:**
- 5,000+ engaged followers/subscribers
- Active trading-related content
- Good reputation in community
- Existing affiliate program participation

### Step 2: Branding Setup

**Partner dashboard allows customization:**

1. **Extension Info**
   - Extension name
   - Description
   - Support email

2. **Visual Branding**
   - Primary color picker
   - Upload logo/icons (auto-resize)
   - Custom tagline
   - Preview in real-time

3. **Affiliate Codes**
   - Enter codes for each prop firm
   - Verify codes work (API check)
   - Set custom discount messaging

4. **Links & Support**
   - Support page URL
   - Privacy policy URL
   - Social media links

### Step 3: Extension Generation

**Automated build process:**
```
1. Partner clicks "Generate Extension"
2. System validates all inputs
3. Templates are processed
4. Icons are resized (if needed)
5. Extension ZIP is created
6. Partner downloads .zip file
7. Email sent with installation instructions
```

### Step 4: Chrome Web Store Submission

**Two options:**

**Option A: Partner submits under their account**
- We provide step-by-step guide
- Partner pays $5 Chrome developer fee
- Partner owns the listing
- More work for partner, but full control

**Option B: We submit under master account**
- We handle submission
- Partner doesn't need Chrome developer account
- We control updates
- Easier for partner, less control

### Step 5: Go Live

**Launch checklist:**
- Chrome Web Store approval received
- Partner tests extension
- We verify analytics tracking
- Partner announces to audience
- We track first conversions

---

## Revenue Tracking & Attribution

### Attribution System

**Every conversion needs proper tracking:**

```javascript
// Unique partner identifier in all affiliate URLs
const affiliateUrl = `https://ftmo.com/?ref=${partnerId}_${firmCode}`;

// Example: https://ftmo.com/?ref=tradewithJohn_JOHN15
```

### Analytics Dashboard

**Partner sees real-time stats:**
- Extension installs
- Active users (DAU/MAU)
- Clicks per firm
- Conversions (if prop firm provides API)
- Revenue earned
- Payout status

**Platform sees:**
- All partner metrics aggregated
- Revenue per partner
- Top performing partners
- Churn rates

### Revenue Split Calculation

```javascript
// Example calculation
const conversionRevenue = 60; // $60 from FTMO sale
const platformShare = 0.3;    // 30%
const partnerShare = 0.7;     // 70%

const platformEarns = conversionRevenue * platformShare; // $18
const partnerEarns = conversionRevenue * partnerShare;   // $42

// Store in database
recordRevenue({
  partnerId: 'tradewithJohn',
  firm: 'ftmo',
  amount: conversionRevenue,
  platformShare: platformEarns,
  partnerShare: partnerEarns,
  timestamp: Date.now()
});
```

### Payout System

**Monthly payouts via:**
- PayPal (preferred - automated)
- Stripe transfers
- Wire transfer (for large amounts)

**Payout rules:**
- Minimum: $50
- Frequency: Monthly (1st of each month)
- 30-day hold period (account for refunds)

---

## Pricing Models

### Model 1: Revenue Share (Recommended)

**Free to join, share revenue:**
- No upfront cost for partners
- Platform takes 20-30% of all revenue
- Partner keeps 70-80%
- Lowest barrier to entry
- Scales with partner success

**Pros:**
- Easy to recruit partners
- Aligned incentives
- No financial risk for partners

**Cons:**
- Complex tracking needed
- Depends on prop firm attribution

### Model 2: SaaS Subscription

**Monthly fee, partner keeps all revenue:**
- $50-100/month subscription
- Partner keeps 100% of affiliate revenue
- Access to platform & updates
- Premium support

**Pros:**
- Predictable recurring revenue
- Easier accounting
- No revenue tracking needed

**Cons:**
- Harder to recruit partners
- Partners bear more risk

### Model 3: One-Time Setup Fee

**Pay once, own forever:**
- $200-500 one-time fee
- Includes branding, icons, submission help
- Partner keeps 100% of revenue
- Optional $20/month for hosting & updates

**Pros:**
- Immediate revenue
- Simple transaction
- Appeals to established influencers

**Cons:**
- No recurring revenue
- Less ongoing relationship

### Model 4: Hybrid (Best of Both)

**Small setup fee + revenue share:**
- $99 setup fee (covers Chrome submission)
- 10-15% ongoing revenue share
- Lower than pure revenue share
- Commitment from both sides

**Pros:**
- Filters out non-serious partners
- Covers initial costs
- Still has recurring component

**Cons:**
- Slightly higher barrier to entry

---

## Partner Dashboard (Web App)

### Key Features

**Dashboard Homepage:**
```
┌─────────────────────────────────────────────┐
│  Welcome back, John! 👋                     │
├─────────────────────────────────────────────┤
│  📊 Quick Stats (Last 30 Days)              │
│  ┌─────────┬─────────┬─────────┬─────────┐ │
│  │ Installs│  Active │ Clicks  │ Revenue │ │
│  │   247   │   189   │  1,450  │  $342   │ │
│  └─────────┴─────────┴─────────┴─────────┘ │
├─────────────────────────────────────────────┤
│  💰 Revenue Breakdown                       │
│  FTMO:              $180 (8 sales)          │
│  Apex:              $96  (12 sales)         │
│  TopStep:           $66  (3 sales)          │
│  ────────────────────────                   │
│  Total:             $342                    │
│  Your Share (70%):  $239.40                 │
│  Next Payout:       Nov 1, 2025             │
├─────────────────────────────────────────────┤
│  🚀 Quick Actions                           │
│  [Edit Branding] [Update Codes]            │
│  [Download Extension] [View Analytics]     │
└─────────────────────────────────────────────┘
```

**Branding Editor:**
- Visual WYSIWYG editor
- Live preview of popup
- Color picker with presets
- Icon uploader with auto-resize
- Font selection (from safe list)

**Analytics Page:**
- Daily/weekly/monthly charts
- Conversion funnel
- Top performing firms
- Geographic distribution (if available)
- Cohort retention analysis

**Support Center:**
- Knowledge base
- Video tutorials
- Email support
- Partner community forum

---

## Technical Implementation Roadmap

### Phase 1: MVP (2-3 weeks)

**Week 1: Templating System**
- [ ] Convert manifest.json to template
- [ ] Convert HTML files to templates
- [ ] Convert CSS to use CSS variables
- [ ] Create config.json schema
- [ ] Build CLI builder script

**Week 2: Partner Dashboard (Basic)**
- [ ] Simple web form for config
- [ ] Partner authentication (login)
- [ ] Extension generator endpoint
- [ ] Download generated ZIP
- [ ] Basic analytics (Google Analytics)

**Week 3: Testing & Docs**
- [ ] Test with 2-3 beta partners
- [ ] Write partner documentation
- [ ] Create onboarding guide
- [ ] Fix bugs found in beta

### Phase 2: Advanced Features (2-4 weeks)

**Revenue Tracking:**
- [ ] Database schema for conversions
- [ ] Webhook from prop firms (if available)
- [ ] Manual conversion entry (fallback)
- [ ] Revenue dashboard

**Visual Editor:**
- [ ] Live preview iframe
- [ ] Color picker UI
- [ ] Icon uploader
- [ ] Real-time template rendering

**Automation:**
- [ ] Auto-submit to Chrome Web Store (via API)
- [ ] Auto-update all partner extensions
- [ ] Email notifications (new install, sale, etc.)

### Phase 3: Scale (Ongoing)

**Marketing:**
- [ ] Partner referral program
- [ ] Affiliate program for recruiters
- [ ] SEO for partner landing pages
- [ ] Success stories & case studies

**Features:**
- [ ] A/B testing for partners
- [ ] Custom features per tier
- [ ] White-label mobile app
- [ ] API access for advanced partners

---

## Partner Acquisition Strategy

### Target Partner Profiles

**Tier 1: Mega Influencers (100K+ followers)**
- Trading YouTubers (TradingRush, ICT, etc.)
- High revenue potential ($10K+/month)
- Custom deal: 80/20 split + dedicated support
- Approach: Direct outreach, custom pitch

**Tier 2: Mid-Tier Creators (10K-100K followers)**
- Growing YouTubers, educators
- Revenue: $500-5K/month
- Standard deal: 70/30 split
- Approach: Email campaign, webinars

**Tier 3: Micro-Influencers (5K-10K followers)**
- Discord communities, Twitter accounts
- Revenue: $100-500/month
- Standard deal: 60/40 split
- Approach: Self-service signup

### Outreach Campaign

**Email Template:**
```
Subject: Turn your audience into revenue - PropDeals White Label

Hi [Name],

I noticed you have a strong following in the prop trading space and
already promote firms like FTMO and Apex.

We built a tool that could help you monetize better: a white-label
Chrome extension that auto-applies YOUR affiliate codes when your
audience checks out.

Key benefits:
- 24/7 passive affiliate revenue
- Branded as YOUR tool (not ours)
- No development work needed
- Free to set up, 70/30 revenue split

Creators like [Example] are earning an extra $XXX/month with zero effort.

Interested in a quick call to discuss?

[Your Name]
PropDeals Platform
```

### Partner Incentives

**Launch bonus:**
- First 100 installs: Bonus $100
- First conversion: Bonus $50
- 1,000 installs milestone: Bonus $500

**Referral program:**
- Refer another creator: 5% of their revenue for 12 months
- Create viral growth loop

**Leaderboard:**
- Monthly top earner gets featured
- Social proof attracts more partners

---

## Legal & Compliance

### Partner Agreement (Key Terms)

**Licensing:**
- Non-exclusive license to use PropDeals platform
- Partner owns their branding assets
- We own core technology

**Revenue Split:**
- Defined percentage split
- Payment terms (NET 30)
- Dispute resolution process

**Termination:**
- Either party can terminate with 30 days notice
- Partner keeps existing installs
- No access to platform after termination

**Restrictions:**
- Partner cannot resell/sub-license
- Cannot reverse engineer core code
- Must comply with Chrome Web Store policies

### Chrome Web Store Compliance

**Each partner extension must:**
- Have unique name (not "PropDeals")
- Unique description
- Different icons/branding
- Disclosure of white-label nature (optional)

**Avoid:**
- Multiple submissions of identical code
- Spammy listings
- Deceptive practices

---

## Success Metrics

### Platform-Level KPIs

**Growth:**
- Partners onboarded per month: Target 10-20
- Total extensions live: Target 50 by Month 6
- Total active users across all partners: Target 50K by Month 12

**Revenue:**
- Platform revenue (share): Target $5K/month by Month 6
- Average revenue per partner: Target $500/month
- Partner payout total: Target $15K/month by Month 12

**Quality:**
- Average partner rating: 4.5+ stars
- Partner retention: 80%+ after 6 months
- Support ticket response time: <24 hours

### Partner-Level KPIs

**For partner success:**
- Install rate: >5% of audience
- Daily active users: >40% of installs
- Conversion rate: >2% of active users
- Revenue per install: >$5 lifetime value

---

## Example Partner Case Study

### "TradeWithJohn" - Mid-Tier YouTuber

**Profile:**
- 25K YouTube subscribers
- 5K Discord members
- Already promotes FTMO, Apex

**Setup:**
- Joined white-label program: Oct 1
- Branded extension as "John's Trade Tools"
- Custom blue theme matching YouTube branding
- Announced in video + Discord

**Results (First 30 Days):**
- Installs: 850 (3.4% of audience)
- Active users: 620 (73% retention)
- Conversions: 18 sales
- Revenue generated: $680
- John's share (70%): $476
- Platform share (30%): $204

**ROI:**
- Setup time: 2 hours
- Passive income: $476/month
- Scales with audience growth
- Happy to refer other creators

---

## Next Steps to Implement

### Immediate (This Week)

1. **Create template system**
   - Convert current files to templates
   - Test with 2 different configs manually

2. **Build simple CLI tool**
   - Node.js script to generate extensions
   - Test with sample partner config

3. **Recruit beta partner**
   - Reach out to 1-2 friendly creators
   - Offer free custom setup
   - Get feedback

### Short-Term (This Month)

1. **Build partner dashboard MVP**
   - Simple login system
   - Config form
   - Extension download

2. **Set up analytics tracking**
   - Unique partner IDs in URLs
   - Basic conversion tracking
   - Google Sheets dashboard (MVP)

3. **Onboard 3-5 beta partners**
   - Refine process
   - Document pain points
   - Improve builder

### Long-Term (Next 3-6 Months)

1. **Scale to 50+ partners**
2. **Automate payouts**
3. **Build full analytics platform**
4. **Launch partner referral program**
5. **Consider venture funding if traction is strong**

---

## Conclusion

White-labeling PropDeals can transform it from a single affiliate tool into a **platform business** with:

- **Higher revenue**: 50+ partners × $200/month share = $10K+/month
- **Network effects**: Partners recruit other partners
- **Defensibility**: Switching costs (audience knows their brand)
- **Scalability**: Automated builds, minimal support needed

**Recommended approach**: Start with revenue share model (70/30 split), recruit 5 beta partners manually, then automate once proven.

---

**Questions? Need help implementing? Let's build this! 🚀**

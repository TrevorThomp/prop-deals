# Dynamic Influencer System - Technical Overview

**Single Extension, Multiple Influencers**

---

## 🎯 Concept

Instead of building separate white-label extensions for each influencer, PropDeals now uses a **single unified extension** with dynamic influencer selection and branding.

### Key Benefits

1. **For PropDeals:**
   - Maintain one codebase
   - One Chrome Web Store listing
   - Instant updates for all users
   - Centralized analytics
   - Easier bug fixes and features

2. **For Influencers:**
   - No Chrome Web Store submission required
   - Instant setup (hours, not days)
   - Easy to update affiliate codes
   - Custom branding without separate extension
   - Professional dashboard access

3. **For Users:**
   - One extension for all their favorite influencers
   - Can switch influencers if needed
   - Always up-to-date with latest deals
   - Better extension quality (more development resources)

---

## 🏗️ Architecture

### Data Flow

```
User Installs Extension
    ↓
Opens Extension → Check onboarding_completed
    ↓ (if not completed)
Onboarding Page Loads
    ↓
Fetch Influencers from API
    ↓
User Selects Influencer (or skips)
    ↓
Store influencer_data in chrome.storage
    ↓
Apply Branding Dynamically
    ↓
Merge Influencer's Affiliate Codes
    ↓
Extension Shows Influencer-Specific Deals
```

### Components

**1. API Layer (`/api/v1/influencers.json`)**
```json
{
  "version": "1.0.0",
  "updated_at": "2025-10-23T00:00:00Z",
  "influencers": [
    {
      "id": "tradewithJohn",
      "name": "Trade With John",
      "display_name": "John's Community",
      "branding": {
        "primary_color": "#3B82F6",
        "secondary_color": "#1E40AF",
        ...
      },
      "affiliate_codes": {
        "ftmo": {
          "code": "JOHN15",
          "url": "https://www.ftmo.com/?ref=tradewithJohn"
        },
        ...
      },
      "enabled_firms": ["ftmo", "apex", "topstep"],
      "custom_discounts": {
        "topstep": {
          "amount": 25,
          "description": "25% off - John's exclusive!",
          ...
        }
      }
    }
  ]
}
```

**2. Onboarding Flow (`pages/onboarding.html`)**

4-step wizard:
- Step 1: Welcome & features
- Step 2: Influencer selection (or skip)
- Step 3: Notification preferences
- Step 4: Success confirmation

Features:
- Beautiful, polished UI
- Real-time influencer cards with avatars
- Theme preview
- Skip option for direct users
- Responsive design

**3. Dynamic Branding System (`scripts/popup.js`)**

```javascript
async function applyInfluencerBranding() {
  const { influencer_data } = await chrome.storage.local.get(['influencer_data']);

  if (!influencer_data) return;

  // Apply CSS custom properties
  document.documentElement.style.setProperty('--primary-color', influencer_data.branding.primary_color);
  document.documentElement.style.setProperty('--secondary-color', influencer_data.branding.secondary_color);
  document.documentElement.style.setProperty('--accent-color', influencer_data.branding.accent_color);

  // Update text content
  document.querySelector('.header-text h1').textContent = influencer_data.branding.logo_text;
  document.querySelector('.header-text p').textContent = influencer_data.branding.tagline;
}
```

**4. Affiliate Code Merging (`scripts/background.js`)**

```javascript
function mergeInfluencerData(discountData, influencer) {
  const mergedData = JSON.parse(JSON.stringify(discountData));

  // Filter to enabled firms only
  if (influencer.enabled_firms?.length > 0) {
    mergedData.firms = mergedData.firms.filter(firm =>
      influencer.enabled_firms.includes(firm.id)
    );
  }

  // Apply influencer's codes and custom discounts
  mergedData.firms = mergedData.firms.map(firm => {
    const influencerCodes = influencer.affiliate_codes?.[firm.id];
    if (influencerCodes) {
      firm.affiliate_code = influencerCodes.code;
      firm.affiliate_url = influencerCodes.url;
    }

    const customDiscount = influencer.custom_discounts?.[firm.id];
    if (customDiscount) {
      firm.discount = { ...firm.discount, ...customDiscount };
    }

    return firm;
  });

  return mergedData;
}
```

**5. CSS Custom Properties (`styles/popup.css`)**

```css
:root {
  --primary-color: #10B981;
  --secondary-color: #065F46;
  --accent-color: #34D399;
}

.header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.discount-badge {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.copy-btn {
  background: var(--primary-color);
}

.copy-btn:hover {
  background: var(--secondary-color);
}
```

---

## 🔄 User Flows

### Flow 1: New User from Influencer Link

```
1. User clicks: https://chromewebstore.google.com/propdeals?ref=tradewithJohn
2. Installs extension from Chrome Web Store
3. Extension opens onboarding with ?ref=tradewithJohn
4. Onboarding detects ref param
5. Pre-selects "Trade With John"
6. User confirms (or changes)
7. Extension applies John's branding + codes
8. Done!
```

### Flow 2: New User Without Ref

```
1. User finds extension organically
2. Installs extension
3. Onboarding shows all influencers
4. User can:
   a) Select an influencer manually
   b) Skip and use default PropDeals
5. Extension applies selected branding
6. Done!
```

### Flow 3: Existing User Switches Influencer

```
1. User opens extension
2. Goes to Settings
3. Clicks "Change Influencer"
4. Sees influencer selection screen
5. Selects new influencer
6. Extension re-applies branding
7. Future purchases use new codes
```

---

## 📊 Attribution System

### How Attribution Works

**Install Attribution:**
```javascript
// URL param approach
const refParam = new URLSearchParams(window.location.search).get('ref');
if (refParam) {
  // Attribute install to this influencer
  analytics.track('install', { influencer_id: refParam });
}
```

**Purchase Attribution:**
```javascript
// When user buys from a firm
const { influencer_data } = await chrome.storage.local.get(['influencer_data']);
if (influencer_data) {
  // Purchase attributed to influencer
  analytics.track('purchase', {
    influencer_id: influencer_data.id,
    firm_id: 'ftmo',
    code_used: 'JOHN15',
    amount: 100
  });
}
```

**Switching Handling:**
```javascript
// When user switches influencers
await chrome.storage.local.set({
  influencer_data: newInfluencer,
  influencer_switched_at: Date.now()
});

analytics.track('influencer_switched', {
  from: oldInfluencer.id,
  to: newInfluencer.id
});
```

### Revenue Calculation

```
PropDeals receives commission from firm: $100
Platform fee (30%): $30
Influencer share (70%): $70

Lookup: Which influencer was selected when purchase happened?
Credit: $70 to that influencer's account
```

---

## 🎨 Branding System

### Levels of Customization

**Level 1: Theme Preset (Easy)**
- Influencer selects: "Trading Blue"
- We apply: Pre-defined color palette
- Result: Instant custom look

**Level 2: Custom Colors (Medium)**
- Influencer provides: Hex codes
- We apply: Dynamic CSS variables
- Result: Fully custom color scheme

**Level 3: Full Branding (Advanced)**
- Custom colors
- Logo text replacement
- Custom tagline
- Welcome message
- Footer text
- Result: Fully branded experience

### CSS Variable System

All brand-dependent styles use CSS custom properties:

```css
:root {
  /* These get dynamically updated via JavaScript */
  --primary-color: #10B981;
  --secondary-color: #065F46;
  --accent-color: #34D399;
}

/* All brand-specific elements use the variables */
.header { background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); }
.btn-primary { background: var(--primary-color); }
.discount-badge { background: var(--primary-color); }
a { color: var(--accent-color); }
```

Benefits:
- ✅ No CSS file rewriting needed
- ✅ Instant theme switching
- ✅ No page reload required
- ✅ Minimal JavaScript overhead

---

## 🔐 Security Considerations

### Data Storage

**Stored Locally (chrome.storage.local):**
- `onboarding_completed`: boolean
- `selected_influencer`: string (influencer ID)
- `influencer_data`: object (full influencer profile)
- `remote_influencers`: object (cached influencer list)

**Never Stored:**
- User's personal information
- Purchase details
- Credit card info
- Browsing history

### API Security

**influencers.json:**
- Served via GitHub Pages (HTTPS only)
- Public data (no secrets)
- Read-only for extension
- Cached for 24 hours

**Authentication:**
- No user authentication required
- Influencer dashboard: Separate system with OAuth
- Extension → API: No API keys needed (public data)

### Privacy

**What We Track:**
- Extension installs (aggregate count)
- Influencer selections (for attribution)
- Button clicks (for UX improvements)
- Purchase events (for commission calculation)

**What We DON'T Track:**
- Individual user identity
- Browsing history
- Personal information
- Financial details

---

## 📈 Scaling Considerations

### Current Capacity

**Extension:**
- Supports: Unlimited influencers
- API call: 1 per 24 hours (cached)
- Storage: ~50KB per influencer profile

**API:**
- File size: ~10KB per influencer
- GitHub Pages: 1GB total, 100GB bandwidth/month
- Load time: <100ms

### Growth Projections

**10 Influencers:**
- API file size: ~100KB
- Extension storage: ~500KB
- Load time: <200ms
- ✅ No issues

**100 Influencers:**
- API file size: ~1MB
- Extension storage: ~5MB
- Load time: <500ms
- ✅ Minor optimization needed (pagination)

**1,000+ Influencers:**
- API file size: ~10MB
- Extension storage: ~50MB
- Load time: >2s
- ❌ Needs architecture change

**Optimization for 1,000+:**
1. Paginated influencer API
2. Search/filter on server side
3. Popular influencers loaded first
4. Lazy loading for remaining
5. CDN for faster delivery

---

## 🛠️ Development Workflow

### Adding a New Influencer

**1. Create Profile in API:**
```bash
cd api/v1
# Edit influencers.json
```

Add:
```json
{
  "id": "newinfluencer",
  "name": "New Influencer",
  "display_name": "New's Community",
  "status": "active",
  "branding": { ... },
  "affiliate_codes": { ... },
  "enabled_firms": [ ... ]
}
```

**2. Push to GitHub:**
```bash
git add api/v1/influencers.json
git commit -m "Add new influencer: newinfluencer"
git push origin main
```

**3. Done!**
- Changes live in <2 minutes
- All extensions fetch updated list within 24 hours
- Or users can force refresh in extension

### Updating Influencer Profile

Same process:
1. Edit `api/v1/influencers.json`
2. Commit and push
3. Changes propagate within 24 hours

### Removing Influencer

Change status:
```json
{
  "id": "oldinfluencer",
  "status": "inactive",  // Was "active"
  ...
}
```

- Influencer won't appear in new selections
- Existing users keep their selection (until they switch)
- Attribution continues for existing users

---

## 🧪 Testing

### Test Scenarios

**1. New Install - With Ref:**
```
1. Use URL: chrome-extension://[id]/pages/onboarding.html?ref=tradewithJohn
2. Verify: John is pre-selected
3. Complete onboarding
4. Verify: Extension shows John's branding
5. Verify: Deals show John's codes
```

**2. New Install - Without Ref:**
```
1. Use URL: chrome-extension://[id]/pages/onboarding.html
2. Verify: All influencers shown
3. Select an influencer
4. Complete onboarding
5. Verify: Correct branding applied
```

**3. Switch Influencer:**
```
1. Open extension (already onboarded)
2. Go to Settings
3. Find "Change Influencer" option
4. Select different influencer
5. Verify: Branding updates immediately
6. Verify: New codes appear in deals
```

**4. Skip Influencer:**
```
1. Start onboarding
2. Click "Skip - Use Default Deals"
3. Complete onboarding
4. Verify: Default PropDeals branding
5. Verify: Default affiliate codes
```

**5. API Failure:**
```
1. Disconnect internet
2. Open onboarding
3. Verify: Graceful error message
4. Verify: Retry button available
5. Reconnect internet
6. Click retry
7. Verify: Influencers load
```

---

## 📝 Migration from White-Label System

### Old System (White-Label)

**Process:**
1. Influencer fills out partner-builder.html
2. Downloads config JSON
3. Runs build-extension.js
4. Gets separate extension ZIP
5. Submits to Chrome Web Store
6. Waits 3-7 days for approval
7. Gets unique extension ID
8. Distributes link to followers

**Maintenance:**
- To update codes: Rebuild entire extension
- To change branding: Rebuild entire extension
- Updates require Chrome Web Store resubmission
- Each update takes 3-7 days

**Problems:**
- High friction for influencers
- Slow update cycle
- Multiple extensions to maintain
- Fragmented user base
- Difficult to push bug fixes

### New System (Dynamic)

**Process:**
1. Influencer applies
2. We add profile to API (2 hours)
3. Influencer gets ref link
4. Shares with audience
5. Done!

**Maintenance:**
- To update codes: Edit API JSON (2 minutes)
- To change branding: Edit API JSON (2 minutes)
- Updates live immediately
- No resubmission needed

**Benefits:**
- ✅ Zero friction for influencers
- ✅ Instant updates
- ✅ One extension to maintain
- ✅ Unified user base
- ✅ Easy bug fixes for everyone

### Why We Changed

**User Feedback:**
> "Do I need to create a whole new extension for each influencer?"
> "Can't they just share a link to the same extension?"

**Technical Reality:**
- White-label system was over-engineered
- Solving the wrong problem
- Users don't care about separate extensions
- They care about supporting their influencer

**The Insight:**
The influencer's branding doesn't need to be baked into the extension.
It can be applied dynamically based on who they selected.

This is simpler, faster, and better for everyone.

---

## 🚀 Future Enhancements

### Phase 2: Advanced Features

**Influencer Dashboard:**
- Real-time analytics
- Revenue tracking
- User retention metrics
- A/B testing support

**Enhanced Attribution:**
- Sub-influencer codes (for team members)
- Campaign tracking (different URLs for different videos)
- Geographic attribution

**Advanced Branding:**
- Custom fonts
- Animated backgrounds
- Video welcome messages
- Profile pictures/logos

**Community Features:**
- Influencer leaderboard (opt-in)
- Cross-promotion opportunities
- Collaboration tools

### Phase 3: Scaling

**Pagination:**
- Load popular influencers first
- Search/filter functionality
- Categories (Forex, Futures, Stocks, etc.)

**CDN Integration:**
- CloudFront for API files
- Faster global delivery
- Better reliability

**Advanced Analytics:**
- Machine learning for fraud detection
- Predictive revenue modeling
- Churn analysis

---

## 🎯 Success Metrics

### For PropDeals

- Number of active influencers
- Total extension installs
- Conversion rate (installs → purchases)
- Revenue per influencer
- Platform retention rate

### For Influencers

- Install attribution (their link clicks)
- Conversion rate (installs → purchases)
- Revenue generated
- Commission earned
- User retention (how long users keep them selected)

### For Users

- Deals claimed
- Money saved
- Notification engagement
- Extension rating/reviews

---

**System Status:** ✅ Fully Implemented
**Last Updated:** October 23, 2025
**Version:** 2.0.0

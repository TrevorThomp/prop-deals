# PropDeals - Discount Update Strategy

**Problem:** Extension currently uses static `discounts.json` - deals can become stale
**Goal:** Keep users informed of the latest, most accurate prop firm discounts

---

## Current Architecture (MVP)

### How It Works Now

```
Extension Package
└── data/discounts.json (bundled, static)
    └── Updated only when extension is updated
    └── Users must reinstall to get new deals
```

**Limitations:**
- ❌ Deals expire without users knowing
- ❌ New deals require full extension update
- ❌ Can't react quickly to time-sensitive promotions
- ❌ Manual update process is slow

---

## Solution Options (Ranked by Complexity)

### Option 1: Remote JSON File (Simplest, Recommended for MVP+)

**How it works:**
1. Host `discounts.json` on a static file server/CDN
2. Extension fetches latest version daily
3. Cache locally, fallback to bundled version if offline

**Architecture:**
```
Chrome Extension                    Remote Server
├── data/                          https://api.propdeals.com/
│   └── discounts.json (fallback)  └── v1/discounts.json
└── scripts/
    └── background.js
        └── fetchRemoteDiscounts()
```

**Pros:**
- ✅ Simple to implement (1-2 hours)
- ✅ Update deals instantly without extension update
- ✅ No backend code needed (static hosting)
- ✅ Works offline (uses cached version)
- ✅ Fast and cheap (CDN)

**Cons:**
- ⚠️ Requires hosting ($0-5/month)
- ⚠️ Manual updates still (but instant deployment)

**Cost:** $0-5/month (Cloudflare Pages, GitHub Pages, or Vercel free tier)

### Option 2: Simple REST API (Recommended for Scale)

**How it works:**
1. Build lightweight API to serve discount data
2. API reads from database or CMS
3. Extension polls API for updates
4. Add versioning and caching headers

**Architecture:**
```
Chrome Extension → API Server → Database/CMS
                      ↓
                  Caching Layer (Redis/CDN)
```

**Pros:**
- ✅ Centralized control
- ✅ Can add admin dashboard for easy updates
- ✅ Analytics on which deals are popular
- ✅ A/B testing capabilities
- ✅ User-specific deals (future feature)

**Cons:**
- ⚠️ Requires backend development (1-2 weeks)
- ⚠️ Monthly hosting costs ($10-20/month)
- ⚠️ More complexity to maintain

**Cost:** $10-20/month (Vercel, Railway, Render)

### Option 3: Automated Web Scraping (Complex, Not Recommended Initially)

**How it works:**
1. Automated scripts scrape prop firm websites daily
2. Extract current discount codes and promotions
3. Update database automatically
4. Extension fetches from API

**Pros:**
- ✅ Fully automated
- ✅ Always has latest deals
- ✅ Can discover unadvertised codes

**Cons:**
- ❌ Legal gray area (check terms of service)
- ❌ Brittle (breaks when sites change)
- ❌ Can get IP banned
- ❌ High maintenance
- ❌ Ethical concerns

**Not recommended for PropDeals - stick with official affiliate codes**

### Option 4: Hybrid: Manual Updates via CMS + Remote Hosting

**How it works:**
1. Build admin dashboard (or use headless CMS like Strapi/Sanity)
2. You manually update deals through nice UI
3. Changes auto-publish to CDN
4. Extension fetches updated JSON

**Pros:**
- ✅ Best of both worlds
- ✅ Easy to update deals (no code changes)
- ✅ Instant deployment to users
- ✅ Can delegate updates to team member
- ✅ Audit trail of changes

**Cons:**
- ⚠️ Requires CMS setup (1 week)
- ⚠️ Monthly CMS costs ($0-15/month)

**Cost:** $0-15/month (Sanity/Strapi free tier + CDN)

---

## Recommended Implementation: Option 1 + Option 4 Hybrid

**Phase 1 (Now - Week 1):** Remote JSON File
**Phase 2 (Month 2):** Add CMS for easier updates

---

## Implementation: Remote JSON File (Option 1)

### Step 1: Set Up Hosting

**Best Free Options:**

#### Option A: GitHub Pages (Recommended)
```bash
# Create new repo: propdeals-api
# Create file: discounts.json
# Enable GitHub Pages
# URL: https://yourusername.github.io/propdeals-api/discounts.json
```

**Pros:**
- Free forever
- Auto-deploys on git push
- Fast CDN
- Version control built-in

**Cons:**
- Public (anyone can see your codes - but they're public anyway)
- Requires manual git push

#### Option B: Cloudflare Workers KV
```javascript
// Serverless edge storage
// URL: https://api.propdeals.workers.dev/discounts
```

**Pros:**
- Free tier (100K reads/day)
- Global CDN
- Can add update API later

**Cons:**
- Requires Cloudflare account
- Slight learning curve

#### Option C: Firebase Hosting
```bash
# Firebase free tier
# URL: https://propdeals-api.web.app/discounts.json
```

**Pros:**
- Free tier (10GB/month)
- Google infrastructure
- Easy to upgrade to Firestore later

**Cons:**
- Requires Google account
- Overkill for just JSON

### Step 2: Update Extension Code

**Modify `scripts/background.js`:**

```javascript
// Configuration
const REMOTE_DISCOUNTS_URL = 'https://yourusername.github.io/propdeals-api/v1/discounts.json';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
const STORAGE_KEYS = {
  REMOTE_DISCOUNTS: 'remoteDiscounts',
  LAST_FETCH: 'lastFetchTimestamp',
  DISCOUNT_VERSION: 'discountVersion'
};

// Fetch remote discounts
async function fetchRemoteDiscounts() {
  try {
    console.log('Fetching remote discounts...');

    const response = await fetch(REMOTE_DISCOUNTS_URL, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!data.version || !data.firms || !Array.isArray(data.firms)) {
      throw new Error('Invalid data structure');
    }

    // Store in local storage
    await chrome.storage.local.set({
      [STORAGE_KEYS.REMOTE_DISCOUNTS]: data,
      [STORAGE_KEYS.LAST_FETCH]: Date.now(),
      [STORAGE_KEYS.DISCOUNT_VERSION]: data.version
    });

    console.log(`✓ Remote discounts fetched (v${data.version})`);

    // Check for new deals
    await checkForNewDeals(data);

    return data;

  } catch (error) {
    console.error('Failed to fetch remote discounts:', error);

    // Fallback to bundled version
    return await loadBundledDiscounts();
  }
}

// Load bundled discounts (fallback)
async function loadBundledDiscounts() {
  try {
    const response = await fetch(chrome.runtime.getURL('data/discounts.json'));
    const data = await response.json();
    console.log('Using bundled discounts (fallback)');
    return data;
  } catch (error) {
    console.error('Failed to load bundled discounts:', error);
    return null;
  }
}

// Get current discounts (cached or fresh)
async function getCurrentDiscounts() {
  const storage = await chrome.storage.local.get([
    STORAGE_KEYS.REMOTE_DISCOUNTS,
    STORAGE_KEYS.LAST_FETCH
  ]);

  const lastFetch = storage[STORAGE_KEYS.LAST_FETCH] || 0;
  const timeSinceLastFetch = Date.now() - lastFetch;

  // Check if cache is still fresh
  if (storage[STORAGE_KEYS.REMOTE_DISCOUNTS] && timeSinceLastFetch < CACHE_DURATION) {
    console.log('Using cached discounts');
    return storage[STORAGE_KEYS.REMOTE_DISCOUNTS];
  }

  // Cache expired or doesn't exist - fetch fresh
  return await fetchRemoteDiscounts();
}

// Check if we should fetch (called on alarm)
async function shouldFetchRemoteDiscounts() {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.LAST_FETCH);
  const lastFetch = storage[STORAGE_KEYS.LAST_FETCH] || 0;
  const timeSinceLastFetch = Date.now() - lastFetch;

  return timeSinceLastFetch >= CACHE_DURATION;
}

// Update alarm listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkDiscounts') {
    console.log('Alarm: Checking for discount updates...');

    if (await shouldFetchRemoteDiscounts()) {
      await fetchRemoteDiscounts();
    } else {
      console.log('Cache still fresh, skipping fetch');
    }
  }
});

// Fetch on install/update
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    await fetchRemoteDiscounts();
  }

  // Set up daily check
  chrome.alarms.create('checkDiscounts', {
    periodInMinutes: 60, // Check every hour (will use cache if fresh)
    delayInMinutes: 1
  });
});

// Fetch on startup
chrome.runtime.onStartup.addListener(async () => {
  await getCurrentDiscounts();
});

// Listen for manual refresh requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'refresh_discounts') {
    fetchRemoteDiscounts()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open
  }

  if (request.type === 'get_discounts') {
    getCurrentDiscounts()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open
  }
});
```

**Update `scripts/popup.js`:**

```javascript
// Load deals with remote data
async function loadDeals() {
  try {
    loading.style.display = 'flex';

    // Request discounts from background script
    const response = await chrome.runtime.sendMessage({ type: 'get_discounts' });

    if (!response.success) {
      throw new Error(response.error);
    }

    const data = response.data;

    loading.style.display = 'none';

    if (!data || !data.firms || data.firms.length === 0) {
      showEmptyState();
      return;
    }

    // Show last update time
    showLastUpdateTime(data.updated_at);

    // Render deals
    renderDeals(data.firms);

  } catch (error) {
    console.error('Error loading deals:', error);
    showErrorState();
  }
}

// Add refresh button to popup
function showLastUpdateTime(updatedAt) {
  const header = document.querySelector('.header-content');

  // Remove existing update info
  const existingInfo = header.querySelector('.update-info');
  if (existingInfo) existingInfo.remove();

  const updateInfo = document.createElement('div');
  updateInfo.className = 'update-info';
  updateInfo.style.cssText = `
    font-size: 10px;
    opacity: 0.9;
    margin-top: 4px;
  `;

  const date = new Date(updatedAt);
  const timeAgo = getTimeAgo(date);

  updateInfo.innerHTML = `
    Last updated ${timeAgo}
    <button class="refresh-btn" style="
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      cursor: pointer;
      margin-left: 6px;
    ">↻ Refresh</button>
  `;

  header.querySelector('.header-text').appendChild(updateInfo);

  // Add refresh functionality
  updateInfo.querySelector('.refresh-btn').addEventListener('click', async () => {
    const btn = updateInfo.querySelector('.refresh-btn');
    btn.textContent = 'Refreshing...';
    btn.disabled = true;

    const response = await chrome.runtime.sendMessage({ type: 'refresh_discounts' });

    if (response.success) {
      btn.textContent = '✓ Updated!';
      setTimeout(() => loadDeals(), 500);
    } else {
      btn.textContent = '✗ Failed';
      setTimeout(() => btn.textContent = '↻ Refresh', 2000);
    }

    btn.disabled = false;
  });
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

### Step 3: Add Manifest Permissions

**Update `manifest.json`:**

```json
{
  "permissions": [
    "storage",
    "notifications",
    "activeTab",
    "alarms"
  ],
  "host_permissions": [
    "https://yourusername.github.io/*",
    "https://www.ftmo.com/*",
    ...
  ]
}
```

### Step 4: Create Remote Discounts Repository

**Option: GitHub Pages Setup**

```bash
# 1. Create new GitHub repo
git init propdeals-api
cd propdeals-api

# 2. Create directory structure
mkdir -p v1
touch v1/discounts.json

# 3. Copy your current discounts.json
cp ../propdeals-extension/data/discounts.json v1/discounts.json

# 4. Create index.html (optional landing page)
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>PropDeals API</title>
</head>
<body>
  <h1>PropDeals Discount API</h1>
  <p>Latest version: <a href="v1/discounts.json">v1/discounts.json</a></p>
</body>
</html>
EOF

# 5. Push to GitHub
git add .
git commit -m "Initial API setup"
git remote add origin https://github.com/yourusername/propdeals-api.git
git push -u origin main

# 6. Enable GitHub Pages in repo settings
# Settings → Pages → Source: main branch → Save
```

**Access at:** `https://yourusername.github.io/propdeals-api/v1/discounts.json`

### Step 5: Update Process

**When you want to update deals:**

```bash
# 1. Edit v1/discounts.json
# 2. Increment version number
# 3. Update expires_at dates
# 4. Update discount amounts

# 5. Commit and push
git add v1/discounts.json
git commit -m "Update FTMO discount to 20%"
git push

# 6. Wait 1-2 minutes for GitHub Pages to deploy
# 7. All users get update within 24 hours automatically!
```

---

## Advanced Features (Phase 2)

### 1. Version Checking with ETag

**Optimize bandwidth:**

```javascript
// Store ETag from last fetch
let lastETag = null;

async function fetchRemoteDiscounts() {
  const headers = {
    'Accept': 'application/json'
  };

  if (lastETag) {
    headers['If-None-Match'] = lastETag;
  }

  const response = await fetch(REMOTE_DISCOUNTS_URL, { headers });

  if (response.status === 304) {
    console.log('Discounts unchanged (304 Not Modified)');
    return null; // No update needed
  }

  lastETag = response.headers.get('ETag');
  return await response.json();
}
```

### 2. User-Specific Deals (Personalization)

**Based on user preferences:**

```javascript
// Track which firms user interacts with
async function recordUserInterest(firmId) {
  const storage = await chrome.storage.local.get('userPreferences');
  const prefs = storage.userPreferences || {};

  prefs.interests = prefs.interests || {};
  prefs.interests[firmId] = (prefs.interests[firmId] || 0) + 1;

  await chrome.storage.local.set({ userPreferences: prefs });
}

// Prioritize deals for preferred firms
function sortDealsByUserInterest(deals, userPreferences) {
  const interests = userPreferences.interests || {};

  return deals.sort((a, b) => {
    const aInterest = interests[a.id] || 0;
    const bInterest = interests[b.id] || 0;
    return bInterest - aInterest;
  });
}
```

### 3. Push Notifications for Hot Deals

**Notify immediately when big deals drop:**

```javascript
// In remote discounts.json, add urgency flag
{
  "urgent": true,
  "notification_title": "🔥 FLASH SALE: FTMO 30% OFF!",
  "notification_message": "Limited time - expires in 24 hours"
}

// In background.js
async function checkForUrgentDeals(data) {
  const urgentDeals = data.firms.filter(f => f.urgent);

  for (const deal of urgentDeals) {
    await showNotification({
      title: deal.notification_title || `🔥 HOT DEAL: ${deal.name}`,
      message: deal.notification_message || `${deal.discount.amount}% OFF`,
      requireInteraction: true,
      priority: 2
    });
  }
}
```

### 4. A/B Testing Different Discounts

**Test which codes perform better:**

```javascript
// Randomly assign users to test groups
async function getAssignedDiscount(firm) {
  const userId = await getUserId(); // Generate stable user ID
  const testVariant = hashCode(userId) % 2; // 0 or 1

  if (firm.ab_test && firm.ab_test.enabled) {
    return firm.ab_test.variants[testVariant];
  }

  return firm.discount;
}

// In discounts.json
{
  "ab_test": {
    "enabled": true,
    "variants": [
      { "code": "PROPDEALS15", "amount": 15 },
      { "code": "PROPDEALS20", "amount": 20 }
    ]
  }
}
```

---

## Monitoring & Analytics

### Track Update Success Rate

```javascript
// Log fetch attempts
async function fetchRemoteDiscounts() {
  const startTime = Date.now();

  try {
    const data = await fetch(REMOTE_DISCOUNTS_URL);
    const latency = Date.now() - startTime;

    // Log success
    trackEvent('remote_fetch_success', {
      latency,
      version: data.version
    });

    return data;
  } catch (error) {
    // Log failure
    trackEvent('remote_fetch_failed', {
      error: error.message,
      fallback: 'bundled'
    });

    return loadBundledDiscounts();
  }
}
```

### Dashboard Metrics to Track

1. **Fetch success rate** - % of successful remote fetches
2. **Average latency** - Time to fetch discounts
3. **Cache hit rate** - % of requests served from cache
4. **Fallback rate** - % using bundled version
5. **Version distribution** - Which versions users have

---

## Security Considerations

### 1. Validate Remote Data

```javascript
function validateDiscountData(data) {
  // Schema validation
  if (!data.version || typeof data.version !== 'string') {
    throw new Error('Invalid version');
  }

  if (!Array.isArray(data.firms)) {
    throw new Error('Firms must be array');
  }

  // Sanitize each firm
  data.firms.forEach(firm => {
    if (!firm.id || !firm.name) {
      throw new Error('Invalid firm data');
    }

    // Prevent XSS
    firm.name = sanitizeHTML(firm.name);
    firm.description = sanitizeHTML(firm.description);
  });

  return data;
}
```

### 2. Use HTTPS Only

```javascript
if (!REMOTE_DISCOUNTS_URL.startsWith('https://')) {
  throw new Error('Remote URL must use HTTPS');
}
```

### 3. Rate Limiting

```javascript
// Don't fetch too often (prevent DDoS)
const MIN_FETCH_INTERVAL = 60 * 60 * 1000; // 1 hour

async function fetchRemoteDiscounts() {
  const lastFetch = await getLastFetchTime();

  if (Date.now() - lastFetch < MIN_FETCH_INTERVAL) {
    console.log('Rate limited - fetch too soon');
    return getCurrentCachedDiscounts();
  }

  // Proceed with fetch
}
```

---

## Cost Analysis

### Option 1: GitHub Pages
- **Cost:** $0/month
- **Bandwidth:** Unlimited
- **Requests:** Unlimited
- **Updates:** Manual (git push)

### Option 2: Cloudflare Workers
- **Cost:** $0-5/month
- **Bandwidth:** 100K requests/day free
- **Requests:** Unlimited
- **Updates:** API or dashboard

### Option 3: Firebase
- **Cost:** $0-25/month
- **Bandwidth:** 10GB/month free
- **Requests:** 50K/day free
- **Updates:** API or console

**Recommendation: Start with GitHub Pages (free), upgrade if needed**

---

## Implementation Checklist

**Week 1: Basic Remote Hosting**
- [ ] Create GitHub repo for API
- [ ] Copy discounts.json to repo
- [ ] Enable GitHub Pages
- [ ] Update background.js with fetch logic
- [ ] Add remote URL to manifest permissions
- [ ] Test fetch and fallback
- [ ] Add refresh button to popup

**Week 2: Polish**
- [ ] Add last updated timestamp
- [ ] Implement caching strategy
- [ ] Add loading states
- [ ] Handle offline gracefully
- [ ] Add manual refresh option
- [ ] Test on slow connections

**Month 2: Advanced Features**
- [ ] Set up CMS (Sanity/Strapi)
- [ ] Build admin dashboard
- [ ] Add A/B testing
- [ ] Implement push notifications for urgent deals
- [ ] Add analytics tracking

---

## Recommended Update Frequency

**How often to update discounts:**

1. **Daily check:** Extension checks for updates daily
2. **Weekly review:** You manually review all deals weekly
3. **Immediate updates:** When new deals drop, push within hours
4. **Expiration alerts:** Set calendar reminders 3 days before expiration

**Suggested workflow:**

```
Monday: Review all 5 firms for new deals
Wednesday: Spot check top 2 firms
Friday: Review all 5 firms, plan next week's updates
As needed: Update immediately for flash sales
```

---

## Migration Plan

**Step 1:** Implement remote fetching (users still have fallback)
**Step 2:** Deploy remote JSON file (users start receiving updates)
**Step 3:** Monitor for 1 week (check logs, error rates)
**Step 4:** Deprecate bundled version (remove from next extension update)

---

## Conclusion

**Best immediate solution:** GitHub Pages + Remote JSON
- Zero cost
- Update deals in seconds (git push)
- Users get updates within 24 hours
- Graceful fallback if offline
- Easy to implement (2-4 hours)

**Future enhancement:** Add CMS for non-technical team members to update deals through web UI.

---

**Questions? Ready to implement? Let me know and I can build this for you!**

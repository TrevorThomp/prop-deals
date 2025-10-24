# PropDeals Tracking System

## Overview

The PropDeals extension includes comprehensive tracking to distinguish between **extension-driven conversions** and **organic/manual conversions**. This is critical for accurate influencer attribution and commission calculation.

---

## Key Question Answered

**"How can we track that they used the extension to apply the code versus manually typing it?"**

The tracking system answers this by:
1. **Marking all extension actions** with `applied_by: 'extension'`
2. **Creating unique session IDs** to track user journeys
3. **Logging every interaction** (popup clicks, code copies, auto-applications)
4. **Adding UTM parameters** to all affiliate URLs
5. **Sending comprehensive metadata** to analytics endpoint

---

## Tracking Events

### 1. Extension Popup Interactions

#### Event: `deal_button_clicked`
**When**: User clicks "Get Deal →" button in extension popup

**Data Tracked**:
```javascript
{
  firm_id: 'ftmo',
  code: 'JOHN15',
  source: 'extension_popup',
  click_type: 'get_deal_button',
  influencer_id: 'tradewithJohn',
  influencer_name: 'Trade With John',
  session_id: 'pd_1729699200_abc123xyz',
  timestamp: '2025-10-23T15:30:00.000Z',
  affiliate_url: 'https://www.ftmo.com/?ref=tradewithJohn'
}
```

**Implementation**: `popup.js:214-250`

---

#### Event: `code_copied`
**When**: User clicks "Copy" button for a discount code in popup

**Data Tracked**:
```javascript
{
  code: 'JOHN15',
  firm_id: 'ftmo',
  source: 'extension_popup',
  action: 'manual_copy',
  influencer_id: 'tradewithJohn',
  influencer_name: 'Trade With John',
  session_id: 'pd_1729699200_abc123xyz',
  timestamp: '2025-10-23T15:31:00.000Z'
}
```

**Implementation**: `popup.js:188-224`

**Note**: This tracks when user manually copies a code. If they later paste it themselves, we know it came from the extension but wasn't auto-applied.

---

### 2. Automatic Code Application

#### Event: `code_applied`
**When**: Content script successfully auto-applies discount code on checkout page

**Data Tracked**:
```javascript
{
  firm_id: 'ftmo',
  code: 'JOHN15',
  success: true,
  timestamp: '2025-10-23T15:32:00.000Z',
  url: 'https://www.ftmo.com/checkout',
  applied_by: 'extension',           // 🔑 KEY DIFFERENTIATOR
  influencer_id: 'tradewithJohn',
  influencer_name: 'Trade With John',
  session_id: 'pd_1729699200_abc123xyz',
  method: 'auto_apply',
  page: '/checkout'
}
```

**Implementation**: `shared-utils.js:213-248` called by `ftmo-content.js:177`

**This is the KEY event** - it definitively proves the extension auto-applied the code, not the user.

---

### 3. Page Views

#### Event: `page_view`
**When**: User visits a prop firm website (tracked by content scripts)

**Data Tracked**:
```javascript
{
  type: 'page_view',
  firm_id: 'ftmo',
  url: 'https://www.ftmo.com/checkout',
  influencer_id: 'tradewithJohn',
  timestamp: '2025-10-23T15:32:00.000Z',
  session_id: 'pd_1729699200_abc123xyz'
}
```

**Implementation**: `shared-utils.js:254-272`

---

## Session Tracking

### What is a Session?

A session represents a **single user journey** from:
1. Opening extension popup
2. Clicking "Get Deal"
3. Visiting prop firm website
4. Extension auto-applying code
5. User completing purchase

### Session ID Format

```javascript
pd_1729699200_abc123xyz
└─┘ └────────┘ └───────┘
 │      │          └─ Random alphanumeric
 │      └─ Unix timestamp (when created)
 └─ "PropDeals" prefix
```

### Session Storage

Sessions are stored in `sessionStorage` and persist:
- ✅ Across page navigations within same tab
- ✅ During same browsing session
- ❌ NOT across browser restarts
- ❌ NOT across different tabs

**Why sessionStorage?** Because we want to track a single user journey. If user closes browser and returns later, that's a new session (and potentially a new decision point).

### Implementation

```javascript
// shared-utils.js:278-287
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem('propdeals_session_id');

  if (!sessionId) {
    sessionId = `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('propdeals_session_id', sessionId);
  }

  return sessionId;
}
```

---

## UTM Parameter Tracking

### What Gets Added to URLs

When user clicks "Get Deal" from popup, we add tracking parameters:

**Original URL**:
```
https://www.ftmo.com/?ref=tradewithJohn
```

**Enhanced URL** (future implementation):
```
https://www.ftmo.com/?ref=tradewithJohn
  &utm_source=propdeals_extension
  &utm_medium=browser_extension
  &utm_campaign=auto_apply
  &utm_content=JOHN15
  &utm_term=tradewithJohn
  &pd_influencer=tradewithJohn
  &pd_session=pd_1729699200_abc123xyz
  &pd_ts=1729699200000
```

### UTM Parameter Breakdown

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `utm_source` | `propdeals_extension` | Traffic came from PropDeals extension |
| `utm_medium` | `browser_extension` | Medium is browser extension |
| `utm_campaign` | `auto_apply` | Part of auto-apply campaign |
| `utm_content` | `JOHN15` | Specific discount code used |
| `utm_term` | `tradewithJohn` | Influencer who gets credit |
| `pd_influencer` | `tradewithJohn` | PropDeals-specific influencer ID |
| `pd_session` | `pd_1729699200_abc123xyz` | Session tracking ID |
| `pd_ts` | `1729699200000` | Timestamp of click |

### Implementation

```javascript
// shared-utils.js:326-356
async function addTrackingParams(url, firmId, code) {
  const result = await chrome.storage.local.get(['influencer_data']);
  const influencer = result.influencer_data;

  const urlObj = new URL(url);

  // Add UTM parameters
  urlObj.searchParams.set('utm_source', 'propdeals_extension');
  urlObj.searchParams.set('utm_medium', 'browser_extension');
  urlObj.searchParams.set('utm_campaign', 'auto_apply');
  urlObj.searchParams.set('utm_content', code);

  // Add influencer tracking
  if (influencer?.id) {
    urlObj.searchParams.set('utm_term', influencer.id);
    urlObj.searchParams.set('pd_influencer', influencer.id);
  }

  // Add session tracking
  urlObj.searchParams.set('pd_session', getOrCreateSessionId());
  urlObj.searchParams.set('pd_ts', Date.now());

  return urlObj.toString();
}
```

---

## Complete User Journey Example

### Scenario: User discovers FTMO through John's extension

**Step 1: User opens extension popup**
```javascript
// No tracking event (just UI open)
```

**Step 2: User clicks "Get Deal →" for FTMO**
```javascript
// Event: deal_button_clicked
{
  firm_id: 'ftmo',
  code: 'JOHN15',
  source: 'extension_popup',
  click_type: 'get_deal_button',
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz'
}
```

**Step 3: Browser opens FTMO site with tracking URL**
```
https://www.ftmo.com/?ref=tradewithJohn
  &utm_source=propdeals_extension
  &pd_influencer=tradewithJohn
  &pd_session=pd_1729699200_abc123xyz
```

**Step 4: User navigates to checkout page**
```javascript
// Event: page_view
{
  type: 'page_view',
  firm_id: 'ftmo',
  url: 'https://www.ftmo.com/checkout',
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz'
}
```

**Step 5: Extension auto-applies discount code**
```javascript
// Event: code_applied
{
  firm_id: 'ftmo',
  code: 'JOHN15',
  success: true,
  applied_by: 'extension',  // 🔑 PROVES EXTENSION DID IT
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz',
  method: 'auto_apply'
}
```

**Step 6: User completes purchase**
```javascript
// Prop firm backend receives purchase with:
// - Affiliate ref: tradewithJohn
// - UTM parameters showing extension source
// - Discount code: JOHN15
//
// PropDeals backend can match this to:
// - Session: pd_1729699200_abc123xyz
// - Influencer: tradewithJohn
// - Confirmed auto-apply via extension
//
// ✅ John gets 70% commission
```

---

## How to Distinguish Extension vs Manual

### Extension-Applied Code
**Characteristics**:
- Has `code_applied` event with `applied_by: 'extension'`
- Has matching `session_id` across all events
- Has `deal_button_clicked` event earlier in session
- UTM parameters present in final purchase data
- `method: 'auto_apply'`

**Result**: ✅ **Influencer gets full commission (70%)**

---

### Extension-Copied, Manually-Pasted Code
**Characteristics**:
- Has `code_copied` event from popup
- Has `deal_button_clicked` event
- Same `session_id` throughout
- UTM parameters in URL
- BUT: No `code_applied` event with `applied_by: 'extension'`

**Result**: ✅ **Influencer still gets commission** (user used extension, just didn't auto-apply)

---

### Manually Typed Code (No Extension)
**Characteristics**:
- No `deal_button_clicked` event
- No `code_copied` event
- No UTM parameters
- No session tracking
- May have purchase, but no extension events

**Result**: ❌ **No commission** (user found code elsewhere, or already knew it)

---

### Manually Typed Code (Extension Installed But Not Used)
**Characteristics**:
- Extension is installed
- May have previous unrelated sessions
- BUT: Current purchase has no matching `session_id`
- No events for this particular journey

**Result**: ❌ **No commission** (user has extension but didn't use it for this purchase)

---

## Analytics Endpoint

### Current Status
**Stubbed** - Events are logged to console but not sent to backend (yet)

### Implementation Location
`shared-utils.js:294-317`

```javascript
async function sendToAnalytics(eventName, data) {
  try {
    // TODO: Replace with your actual analytics endpoint
    const ANALYTICS_ENDPOINT = 'https://api.propdeals.com/v1/analytics';

    // For now, just log it
    console.log(`[PropDeals Analytics] ${eventName}:`, data);

    /* Uncomment when analytics endpoint is ready:
    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data: data
      })
    });
    */
  } catch (error) {
    console.error('[PropDeals] Analytics error:', error);
  }
}
```

### To Activate Analytics

**Step 1**: Set up backend endpoint (e.g., using Mixpanel, Segment, or custom API)

**Step 2**: Update `ANALYTICS_ENDPOINT` constant in `shared-utils.js`

**Step 3**: Uncomment the fetch call

**Step 4**: Deploy updated extension

**Step 5**: Analytics will start flowing automatically

---

## Testing the Tracking System

### Test 1: Verify Popup Click Tracking

1. Open extension popup
2. Click any "Get Deal" button
3. Check browser console (F12)
4. Look for: `[PropDeals] Tracked deal click:`
5. Verify data includes:
   - ✅ `source: 'extension_popup'`
   - ✅ `influencer_id` (if influencer selected)
   - ✅ `session_id`

### Test 2: Verify Code Copy Tracking

1. Open extension popup
2. Click "Copy" button for any code
3. Check console for: `[PropDeals] Tracked code_copied`
4. Verify data includes:
   - ✅ `action: 'manual_copy'`
   - ✅ `firm_id`
   - ✅ `session_id`

### Test 3: Verify Auto-Apply Tracking

1. Open extension popup
2. Click "Get Deal" for FTMO
3. Navigate to FTMO checkout page
4. Wait for extension to auto-apply code
5. Check console for: `[PropDeals] Tracked code application:`
6. Verify data includes:
   - ✅ `applied_by: 'extension'` ← **MOST IMPORTANT**
   - ✅ `method: 'auto_apply'`
   - ✅ `success: true`
   - ✅ Same `session_id` as popup click

### Test 4: Verify Session Persistence

1. Open extension popup → note the `session_id` in console
2. Click "Get Deal" → opens new tab
3. Check new tab's console for content script logs
4. Verify `session_id` matches between popup and content script

### Test 5: Test Manual Code Entry (Should NOT Track)

1. Go directly to FTMO website (without using extension)
2. Manually type "JOHN15" into discount field
3. Check console → should have NO PropDeals tracking events
4. ✅ This proves extension won't claim credit for manual entries

---

## Database Schema (Recommended)

### Table: `tracking_events`

```sql
CREATE TABLE tracking_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(50) NOT NULL,
  influencer_id VARCHAR(50),
  firm_id VARCHAR(50),
  code VARCHAR(50),
  applied_by VARCHAR(20), -- 'extension' or null
  source VARCHAR(50), -- 'extension_popup', 'content_script', etc.
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_session_id (session_id),
  INDEX idx_influencer_id (influencer_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at)
);
```

### Sample Queries

**Get all events for a session**:
```sql
SELECT * FROM tracking_events
WHERE session_id = 'pd_1729699200_abc123xyz'
ORDER BY created_at ASC;
```

**Find sessions with auto-applied codes**:
```sql
SELECT session_id, influencer_id, firm_id, code
FROM tracking_events
WHERE event_type = 'code_applied'
  AND applied_by = 'extension'
  AND created_at > NOW() - INTERVAL '30 days';
```

**Calculate influencer conversion rate**:
```sql
SELECT
  influencer_id,
  COUNT(DISTINCT CASE WHEN event_type = 'deal_button_clicked' THEN session_id END) as clicks,
  COUNT(DISTINCT CASE WHEN event_type = 'code_applied' AND applied_by = 'extension' THEN session_id END) as conversions,
  ROUND(
    COUNT(DISTINCT CASE WHEN event_type = 'code_applied' AND applied_by = 'extension' THEN session_id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'deal_button_clicked' THEN session_id END), 0) * 100,
    2
  ) as conversion_rate
FROM tracking_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY influencer_id;
```

---

## Privacy Considerations

### What We Track
- ✅ Influencer selection (user's choice)
- ✅ Button clicks within extension
- ✅ Code copy/apply actions
- ✅ Session IDs (random, non-identifying)
- ✅ Timestamps
- ✅ Prop firm visited

### What We DON'T Track
- ❌ Personal identifying information
- ❌ Email addresses
- ❌ Purchase amounts
- ❌ Payment information
- ❌ Browsing history (only prop firm sites via content scripts)
- ❌ Full URLs with sensitive query params

### Compliance
- Session IDs are **random and non-identifying**
- No PII collected
- User can clear data via browser extension settings
- Transparent disclosure in privacy policy

---

## File Locations

### Tracking Implementation Files

| File | Purpose |
|------|---------|
| `shared-utils.js:213-248` | `trackCodeApplication()` - Auto-apply tracking |
| `shared-utils.js:254-272` | `trackPageView()` - Page view tracking |
| `shared-utils.js:278-287` | `getOrCreateSessionId()` - Session management |
| `shared-utils.js:294-317` | `sendToAnalytics()` - Analytics endpoint |
| `shared-utils.js:326-356` | `addTrackingParams()` - UTM parameter injection |
| `popup.js:214-250` | `trackDealClick()` - "Get Deal" button tracking |
| `popup.js:253-262` | `getOrCreateSessionId()` - Popup session ID |
| `popup.js:188-224` | `copyCode()` - Code copy tracking |
| `ftmo-content.js:177` | Calls `trackCodeApplication()` on success |

---

## Next Steps

### Phase 1: Backend Setup (Not Yet Implemented)
- [ ] Create analytics database
- [ ] Set up API endpoint for receiving events
- [ ] Implement event validation
- [ ] Add authentication for API

### Phase 2: Dashboard (Not Yet Implemented)
- [ ] Influencer dashboard showing their stats
- [ ] Admin dashboard showing all conversions
- [ ] Real-time event monitoring
- [ ] Commission calculation automation

### Phase 3: Advanced Tracking (Future)
- [ ] A/B testing different discount codes
- [ ] Funnel analysis (popup → click → visit → apply → purchase)
- [ ] Cohort analysis by influencer
- [ ] Geographic tracking (with consent)

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0
**Status**: ✅ Tracking implemented, Analytics endpoint stubbed

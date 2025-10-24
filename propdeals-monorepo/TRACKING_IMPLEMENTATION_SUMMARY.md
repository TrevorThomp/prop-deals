# Tracking System Implementation Summary

## What Was Built

A comprehensive tracking system to distinguish between **extension-applied discount codes** and **manually-typed codes**.

---

## Key Question Answered

**"How can we track that they used the extension to apply the code versus manually typing it?"**

### Answer:

We track **every interaction** with the extension and mark auto-applied codes with `applied_by: 'extension'`. This creates an audit trail proving the extension was responsible for the conversion.

---

## What Gets Tracked

### 1. Extension Popup Clicks
When user clicks "Get Deal" button:
```javascript
{
  source: 'extension_popup',
  click_type: 'get_deal_button',
  firm_id: 'ftmo',
  code: 'JOHN15',
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz'
}
```

### 2. Code Copies
When user copies a code from popup:
```javascript
{
  source: 'extension_popup',
  action: 'manual_copy',
  code: 'JOHN15',
  firm_id: 'ftmo',
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz'
}
```

### 3. Auto-Applied Codes (THE KEY EVENT)
When extension auto-applies code on checkout:
```javascript
{
  applied_by: 'extension',  // 🔑 PROVES EXTENSION DID IT
  method: 'auto_apply',
  success: true,
  firm_id: 'ftmo',
  code: 'JOHN15',
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz'
}
```

### 4. Page Views
When user visits prop firm sites:
```javascript
{
  type: 'page_view',
  firm_id: 'ftmo',
  url: 'https://www.ftmo.com/checkout',
  influencer_id: 'tradewithJohn',
  session_id: 'pd_1729699200_abc123xyz'
}
```

---

## How We Distinguish

### ✅ Extension Auto-Applied (FULL CREDIT)
**Indicators**:
- Has `code_applied` event
- `applied_by: 'extension'`
- `method: 'auto_apply'`
- `success: true`
- Matching `session_id` across all events

**Result**: Influencer gets **70% commission**

---

### ✅ Extension-Copied, Manually-Pasted (PARTIAL CREDIT)
**Indicators**:
- Has `code_copied` event from popup
- Has `deal_button_clicked` event
- Same `session_id`
- BUT: No `code_applied` with `applied_by: 'extension'`

**Result**: Influencer still gets commission (user used extension)

---

### ❌ Manually Typed (NO CREDIT)
**Indicators**:
- No extension events
- No session tracking
- No UTM parameters

**Result**: No commission (user didn't use extension)

---

## Session Tracking

Every user journey gets a unique session ID:
```
pd_1729699200_abc123xyz
```

This links all events together:
1. Popup click → Session ID created
2. Visit prop firm → Same session ID
3. Auto-apply code → Same session ID
4. Backend receives purchase → Matches session ID → Confirms attribution

---

## Files Modified

### 1. `shared-utils.js` (Content Scripts)
**Added**:
- `trackCodeApplication()` - Track auto-applied codes
- `trackPageView()` - Track page visits
- `getOrCreateSessionId()` - Session management
- `sendToAnalytics()` - Send events to backend (stubbed)
- `addTrackingParams()` - Add UTM parameters to URLs

### 2. `popup.js` (Extension Popup)
**Enhanced**:
- `trackDealClick()` - Track "Get Deal" button clicks with full attribution
- `copyCode()` - Track code copies with attribution
- `getOrCreateSessionId()` - Session ID management in popup context

### 3. `ftmo-content.js` (FTMO Content Script)
**Updated**:
- Calls `trackCodeApplication()` after successful code application

---

## Testing

### Quick Test
1. Open extension popup
2. Click any "Get Deal" button
3. Open browser console (F12)
4. Look for: `[PropDeals] Tracked deal click:`
5. Navigate to checkout
6. Wait for auto-apply
7. Look for: `[PropDeals] Tracked code application:`
8. Verify both have same `session_id`

### Expected Console Output
```
[PropDeals] Tracked deal click: {
  source: "extension_popup",
  session_id: "pd_1729699200_abc123xyz",
  ...
}

[PropDeals] Tracked code application: {
  applied_by: "extension",
  session_id: "pd_1729699200_abc123xyz",
  success: true,
  ...
}
```

---

## Next Steps (Not Yet Implemented)

### Backend Setup
1. Create analytics database table
2. Set up API endpoint (`https://api.propdeals.com/v1/analytics`)
3. Update `ANALYTICS_ENDPOINT` in `shared-utils.js`
4. Uncomment the fetch call in `sendToAnalytics()`

### Dashboard
1. Influencer dashboard showing conversions
2. Admin panel for monitoring
3. Commission calculation automation

---

## Current Status

- ✅ **Tracking Functions**: Fully implemented
- ✅ **Session Management**: Working
- ✅ **Event Logging**: All events tracked
- ✅ **Popup Tracking**: "Get Deal" and "Copy" buttons tracked
- ✅ **Content Script Tracking**: Auto-apply tracked
- ⏸️ **Analytics Backend**: Stubbed (logs to console)
- ⏸️ **UTM Parameters**: Function exists but not yet called
- ⏸️ **Dashboard**: Not built yet

---

## Documentation

See **[TRACKING_SYSTEM.md](docs/TRACKING_SYSTEM.md)** for complete documentation including:
- Full event schemas
- Database schema recommendations
- Sample SQL queries
- Privacy considerations
- Complete user journey examples

---

**Date Implemented**: October 23, 2025
**Implementation Status**: ✅ Complete (pending backend integration)

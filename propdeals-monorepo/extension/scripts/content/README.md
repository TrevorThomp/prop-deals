# Content Scripts Documentation

## Overview

This directory contains content scripts for automatically applying PropDeals discount codes on prop firm checkout pages. Each content script is designed to be non-intrusive, performant, and user-friendly.

## Files

### Shared Utilities
- **shared-utils.js** - Common utility functions used across all content scripts

### Firm-Specific Scripts
- **ftmo-content.js** - FTMO (code: PROPDEALS15, 15% off)
- **apex-content.js** - Apex Trader Funding (code: PROPDEALS10, 10% off)
- **topstep-content.js** - TopStepFX (code: PROPDEALS20, 20% off)
- **myfundedfutures-content.js** - MyFundedFutures (code: PROPDEALS12, 12% off)
- **the5ers-content.js** - The5ers (code: PROPDEALS8, 8% off)

## Features

### Core Functionality
1. **Automatic Code Detection** - Detects checkout pages using URL patterns
2. **Smart Code Application** - Automatically fills and applies discount codes
3. **User Code Respect** - Never overrides codes already entered by users
4. **Dynamic Form Support** - Uses MutationObserver for SPA checkout forms
5. **Graceful Fallback** - Offers manual copy if auto-apply fails
6. **Success Notifications** - Beautiful toast notifications for user feedback
7. **Analytics Integration** - Sends events to background script for tracking

### Error Handling
- Retry logic with configurable attempts and delays
- Comprehensive error logging
- Fallback to manual code copying
- Timeout protection for element waiting

### Performance Optimizations
- Lazy initialization only on checkout pages
- Debounced MutationObserver callbacks
- Efficient DOM queries with multiple selector fallbacks
- Minimal memory footprint
- Automatic cleanup on page unload

### Security Features
- HTML escaping in toast notifications (XSS prevention)
- Safe message passing to background script
- No eval or unsafe code execution
- Proper error boundary handling

## Manifest.json Integration

Add these content scripts to your `manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": [
        "https://www.ftmo.com/checkout*",
        "https://www.ftmo.com/cart*",
        "https://trader.ftmo.com/checkout*"
      ],
      "js": [
        "scripts/content/shared-utils.js",
        "scripts/content/ftmo-content.js"
      ],
      "run_at": "document_idle"
    },
    {
      "matches": [
        "https://www.apextraderfunding.com/checkout*",
        "https://www.apextraderfunding.com/cart*"
      ],
      "js": [
        "scripts/content/shared-utils.js",
        "scripts/content/apex-content.js"
      ],
      "run_at": "document_idle"
    },
    {
      "matches": [
        "https://www.topstepfx.com/checkout*"
      ],
      "js": [
        "scripts/content/shared-utils.js",
        "scripts/content/topstep-content.js"
      ],
      "run_at": "document_idle"
    },
    {
      "matches": [
        "https://www.myfundedfutures.com/checkout*",
        "https://my.myfundedfutures.com/checkout*"
      ],
      "js": [
        "scripts/content/shared-utils.js",
        "scripts/content/myfundedfutures-content.js"
      ],
      "run_at": "document_idle"
    },
    {
      "matches": [
        "https://www.the5ers.com/checkout*"
      ],
      "js": [
        "scripts/content/shared-utils.js",
        "scripts/content/the5ers-content.js"
      ],
      "run_at": "document_idle"
    }
  ]
}
```

## Architecture

### Script Structure

Each content script follows this pattern:

```javascript
(function() {
  'use strict';

  // 1. Configuration (from discounts.json)
  const CONFIG = {
    firmName: 'Firm Name',
    firmId: 'firm_id',
    affiliateCode: 'CODE',
    checkoutUrls: [...],
    selectors: {...},
    retryAttempts: 3,
    retryDelay: 2000,
    observerDelay: 1000,
  };

  // 2. State Management
  let hasAttemptedApply = false;
  let observer = null;

  // 3. Initialization
  async function init() { /* ... */ }

  // 4. Code Application Logic
  async function attemptCodeApplication() { /* ... */ }
  async function applyCode(codeField) { /* ... */ }

  // 5. Fallback Handling
  async function handleFallback() { /* ... */ }

  // 6. Dynamic Content Observation
  function setupObserver() { /* ... */ }

  // 7. Background Communication
  async function notifyBackground() { /* ... */ }

  // 8. Cleanup
  function cleanup() { /* ... */ }

  // 9. Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

### Execution Flow

```
Page Load
    ↓
Check if Checkout Page
    ↓
Immediate Code Application Attempt
    ↓
    ├─→ Success → Show Toast → Notify Background → Done
    │
    └─→ Failure → Setup MutationObserver
                    ↓
                  Wait for Elements
                    ↓
                  Retry Application
                    ↓
                    ├─→ Success → Show Toast → Done
                    │
                    └─→ Failure → Fallback (Copy to Clipboard)
```

## Shared Utilities API

### Toast Notifications

```javascript
showToast({
  title: 'Toast Title',
  message: 'Toast message',
  type: 'success', // 'success', 'error', 'info'
  duration: 5000 // milliseconds
});
```

### Element Utilities

```javascript
// Wait for element to appear
const element = await waitForElement(selector, timeout);

// Find element with multiple selectors
const element = findElement('selector1, selector2, selector3');

// Check if input has existing value
const hasCode = hasExistingCode(inputElement);

// Set input value with proper events
setInputValue(inputElement, value);

// Click apply button
const clicked = clickApplyButton(buttonSelector);
```

### Helper Functions

```javascript
// Logging
log(firmName, 'message', data);
logError(firmName, 'error message', error);

// Background communication
await sendToBackground(message);

// Async utilities
await sleep(milliseconds);
await retry(asyncFunction, maxAttempts, delay);

// URL checking
const isCheckout = isCheckoutPage(checkoutUrls);

// Clipboard
const copied = await copyToClipboard(text);

// Debouncing
const debouncedFn = debounce(function, delay);
```

## Events Sent to Background Script

All content scripts send analytics events to the background script:

### Event Types

1. **code_applied** - Successfully applied the discount code
   ```javascript
   {
     type: 'DISCOUNT_CODE_EVENT',
     payload: {
       firmId: 'ftmo',
       firmName: 'FTMO',
       event: 'code_applied',
       success: true,
       code: 'PROPDEALS15',
       url: 'https://www.ftmo.com/checkout',
       timestamp: '2025-10-23T12:00:00.000Z',
       metadata: null
     }
   }
   ```

2. **code_copied** - Copied code to clipboard (fallback)
   ```javascript
   { event: 'code_copied', success: false, ... }
   ```

3. **code_shown** - Showed code in toast (fallback)
   ```javascript
   { event: 'code_shown', success: false, ... }
   ```

4. **user_has_code** - User already has a different code
   ```javascript
   {
     event: 'user_has_code',
     success: false,
     metadata: 'EXISTINGCODE'
   }
   ```

5. **error** - Error occurred during execution
   ```javascript
   {
     event: 'error',
     success: false,
     metadata: 'Error message'
   }
   ```

## Background Script Integration

Your background script should handle these events:

```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DISCOUNT_CODE_EVENT') {
    const { firmId, event, success, code, url, timestamp, metadata } = message.payload;

    // Log to analytics
    console.log(`[Analytics] ${firmId}: ${event}`, {
      success,
      code,
      url,
      timestamp,
      metadata
    });

    // Store in chrome.storage for analytics dashboard
    chrome.storage.local.get(['analytics'], (result) => {
      const analytics = result.analytics || [];
      analytics.push(message.payload);
      chrome.storage.local.set({ analytics });
    });

    sendResponse({ received: true });
  }
  return true; // Keep message channel open for async response
});
```

## Testing

### Manual Testing Checklist

For each prop firm:

1. **Basic Flow**
   - [ ] Navigate to checkout page
   - [ ] Verify discount field is detected
   - [ ] Verify code is automatically filled
   - [ ] Verify apply button is clicked
   - [ ] Verify success toast appears

2. **User Code Protection**
   - [ ] Enter a different code manually
   - [ ] Reload page
   - [ ] Verify extension doesn't override user's code
   - [ ] Verify info toast shows existing code

3. **Dynamic Content**
   - [ ] Navigate to checkout on SPA site
   - [ ] Verify MutationObserver detects late-loading forms
   - [ ] Verify code still applies correctly

4. **Fallback Handling**
   - [ ] Mock selector mismatch (apply button not found)
   - [ ] Verify code is copied to clipboard
   - [ ] Verify fallback toast appears

5. **Performance**
   - [ ] Check browser DevTools Performance tab
   - [ ] Verify no long tasks or memory leaks
   - [ ] Verify MutationObserver cleanup on page unload

### Browser Compatibility

Tested on:
- Chrome 90+
- Edge 90+
- Firefox 88+ (with webextension-polyfill)
- Brave 1.20+

## Troubleshooting

### Code Not Applying

1. **Check selectors** - Inspect the checkout page and verify selectors in discounts.json match actual elements
2. **Check timing** - Page might load slowly; increase `observerDelay` or `waitForElement` timeout
3. **Check console** - Look for `[PropDeals - FirmName]` logs in browser console
4. **Check permissions** - Verify manifest.json has correct host permissions

### Toast Not Showing

1. **Check CSP** - Page might have strict Content Security Policy blocking styles
2. **Check z-index** - Page might have overlapping elements with higher z-index
3. **Check console** - Look for JavaScript errors

### MutationObserver Not Working

1. **Check observer target** - Verify observing the correct element (document.body)
2. **Check disconnect** - Ensure observer isn't disconnected too early
3. **Check debounce** - Callback might be debounced; wait longer

### Background Messages Not Received

1. **Check manifest** - Verify background script is registered
2. **Check runtime** - Extension might have been reloaded; check chrome.runtime.lastError
3. **Check listener** - Ensure background script has message listener

## Best Practices

### Content Script Development

1. **Namespace everything** - Use IIFE to avoid global scope pollution
2. **Fail gracefully** - Always provide fallback options
3. **Respect user input** - Never override user's existing codes
4. **Clean up resources** - Disconnect observers and remove listeners on unload
5. **Log informatively** - Use consistent logging with firm name prefix
6. **Test cross-browser** - Verify functionality on multiple browsers

### Performance Guidelines

1. **Lazy load** - Only initialize on checkout pages
2. **Debounce observers** - Prevent excessive callback invocations
3. **Use efficient selectors** - Prefer IDs and classes over complex queries
4. **Minimize DOM queries** - Cache element references when possible
5. **Avoid sync operations** - Use async/await for all I/O operations

### Security Considerations

1. **Escape HTML** - Always escape user-generated content in DOM insertions
2. **Validate inputs** - Check element existence before manipulation
3. **Use CSP-friendly code** - No eval, inline scripts, or unsafe operations
4. **Limit permissions** - Request only necessary host permissions
5. **Secure messaging** - Validate messages from background script

## Maintenance

### Updating Discount Codes

1. Edit `propdeals-extension/data/discounts.json`
2. Update the `affiliateCode` field for the relevant firm
3. Content scripts will automatically use the new code on next load

### Adding New Selectors

If a prop firm updates their checkout page:

1. Inspect the new checkout form elements
2. Update the `selectors` object in `discounts.json`
3. Test the content script on the new checkout page
4. Add new selectors to the comma-separated list (don't replace old ones)

### Adding New Prop Firms

1. Add firm data to `discounts.json`
2. Create new content script following the pattern
3. Add content_scripts entry to `manifest.json`
4. Test thoroughly before deployment

## License

Part of the PropDeals Extension project.

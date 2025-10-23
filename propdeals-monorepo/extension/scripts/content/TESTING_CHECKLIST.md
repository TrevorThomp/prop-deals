# Content Scripts Testing Checklist

## Pre-Testing Setup

- [ ] Extension loaded in browser with manifest.json updated
- [ ] Browser DevTools console open (F12)
- [ ] Network tab open to monitor requests
- [ ] Clear browser cache and storage

---

## FTMO Testing

**Code:** PROPDEALS15 (15% off)
**Checkout URLs:**
- https://www.ftmo.com/checkout
- https://www.ftmo.com/cart
- https://trader.ftmo.com/checkout

### Test Cases

- [ ] **TC1.1:** Navigate to checkout - code auto-fills
- [ ] **TC1.2:** Code auto-applies (apply button clicked)
- [ ] **TC1.3:** Success toast notification appears
- [ ] **TC1.4:** Console shows success logs
- [ ] **TC1.5:** Background script receives 'code_applied' event
- [ ] **TC1.6:** Pre-filled user code is NOT overridden
- [ ] **TC1.7:** Info toast shown when user has different code
- [ ] **TC1.8:** MutationObserver detects late-loading forms
- [ ] **TC1.9:** Fallback to clipboard copy works
- [ ] **TC1.10:** No console errors or warnings

**Notes:**
```
[Add testing notes here]
```

---

## Apex Trader Funding Testing

**Code:** PROPDEALS10 (10% off)
**Checkout URLs:**
- https://www.apextraderfunding.com/checkout
- https://www.apextraderfunding.com/cart

### Test Cases

- [ ] **TC2.1:** Navigate to checkout - code auto-fills
- [ ] **TC2.2:** Code auto-applies (apply button clicked)
- [ ] **TC2.3:** Success toast notification appears
- [ ] **TC2.4:** Console shows success logs
- [ ] **TC2.5:** Background script receives 'code_applied' event
- [ ] **TC2.6:** Pre-filled user code is NOT overridden
- [ ] **TC2.7:** Info toast shown when user has different code
- [ ] **TC2.8:** MutationObserver detects late-loading forms
- [ ] **TC2.9:** Fallback to clipboard copy works
- [ ] **TC2.10:** No console errors or warnings

**Notes:**
```
[Add testing notes here]
```

---

## TopStepFX Testing

**Code:** PROPDEALS20 (20% off)
**Checkout URLs:**
- https://www.topstepfx.com/checkout

### Test Cases

- [ ] **TC3.1:** Navigate to checkout - code auto-fills
- [ ] **TC3.2:** Code auto-applies (apply button clicked)
- [ ] **TC3.3:** Success toast notification appears
- [ ] **TC3.4:** Console shows success logs
- [ ] **TC3.5:** Background script receives 'code_applied' event
- [ ] **TC3.6:** Pre-filled user code is NOT overridden
- [ ] **TC3.7:** Info toast shown when user has different code
- [ ] **TC3.8:** MutationObserver detects late-loading forms
- [ ] **TC3.9:** Fallback to clipboard copy works
- [ ] **TC3.10:** No console errors or warnings

**Notes:**
```
[Add testing notes here]
```

---

## MyFundedFutures Testing

**Code:** PROPDEALS12 (12% off)
**Checkout URLs:**
- https://www.myfundedfutures.com/checkout
- https://my.myfundedfutures.com/checkout

### Test Cases

- [ ] **TC4.1:** Navigate to checkout - code auto-fills
- [ ] **TC4.2:** Code auto-applies (apply button clicked)
- [ ] **TC4.3:** Success toast notification appears
- [ ] **TC4.4:** Console shows success logs
- [ ] **TC4.5:** Background script receives 'code_applied' event
- [ ] **TC4.6:** Pre-filled user code is NOT overridden
- [ ] **TC4.7:** Info toast shown when user has different code
- [ ] **TC4.8:** MutationObserver detects late-loading forms
- [ ] **TC4.9:** Fallback to clipboard copy works
- [ ] **TC4.10:** No console errors or warnings

**Notes:**
```
[Add testing notes here]
```

---

## The5ers Testing

**Code:** PROPDEALS8 (8% off)
**Checkout URLs:**
- https://www.the5ers.com/checkout

### Test Cases

- [ ] **TC5.1:** Navigate to checkout - code auto-fills
- [ ] **TC5.2:** Code auto-applies (apply button clicked)
- [ ] **TC5.3:** Success toast notification appears
- [ ] **TC5.4:** Console shows success logs
- [ ] **TC5.5:** Background script receives 'code_applied' event
- [ ] **TC5.6:** Pre-filled user code is NOT overridden
- [ ] **TC5.7:** Info toast shown when user has different code
- [ ] **TC5.8:** MutationObserver detects late-loading forms
- [ ] **TC5.9:** Fallback to clipboard copy works
- [ ] **TC5.10:** No console errors or warnings

**Notes:**
```
[Add testing notes here]
```

---

## Cross-Browser Testing

### Chrome
- [ ] All FTMO test cases pass
- [ ] All Apex test cases pass
- [ ] All TopStepFX test cases pass
- [ ] All MyFundedFutures test cases pass
- [ ] All The5ers test cases pass

### Firefox
- [ ] All FTMO test cases pass
- [ ] All Apex test cases pass
- [ ] All TopStepFX test cases pass
- [ ] All MyFundedFutures test cases pass
- [ ] All The5ers test cases pass

### Edge
- [ ] All FTMO test cases pass
- [ ] All Apex test cases pass
- [ ] All TopStepFX test cases pass
- [ ] All MyFundedFutures test cases pass
- [ ] All The5ers test cases pass

### Brave
- [ ] All FTMO test cases pass
- [ ] All Apex test cases pass
- [ ] All TopStepFX test cases pass
- [ ] All MyFundedFutures test cases pass
- [ ] All The5ers test cases pass

---

## Performance Testing

### Memory Usage
- [ ] Initial memory footprint < 5MB per script
- [ ] No memory leaks after 10 page reloads
- [ ] MutationObserver properly disconnected on unload
- [ ] No lingering event listeners

### Execution Time
- [ ] Initial code detection < 100ms
- [ ] Code application < 500ms
- [ ] Toast rendering < 50ms
- [ ] MutationObserver callback < 50ms (debounced)

### Network Impact
- [ ] No unnecessary network requests
- [ ] Background messages sent efficiently
- [ ] No polling or repeated requests

---

## Edge Cases Testing

### Slow Loading Pages
- [ ] Code applies even with 5+ second load times
- [ ] waitForElement timeout works correctly
- [ ] Retry logic handles transient failures

### Dynamic Content
- [ ] Works with React-based checkout forms
- [ ] Works with Vue-based checkout forms
- [ ] Works with Angular-based checkout forms
- [ ] Works with plain JavaScript SPAs

### User Interactions
- [ ] Doesn't interfere with user typing
- [ ] Doesn't break form validation
- [ ] Doesn't trigger multiple submissions
- [ ] Doesn't conflict with other extensions

### Error Scenarios
- [ ] Handles missing code input field
- [ ] Handles missing apply button
- [ ] Handles disabled apply button
- [ ] Handles CSP restrictions
- [ ] Handles disconnected extension context

---

## Security Testing

### XSS Prevention
- [ ] HTML properly escaped in toast messages
- [ ] No eval or unsafe code execution
- [ ] No inline script injection
- [ ] Proper CSP compliance

### Message Security
- [ ] Background messages validated
- [ ] No sensitive data in console logs
- [ ] Proper error message handling
- [ ] Safe clipboard operations

---

## Accessibility Testing

### Toast Notifications
- [ ] Toasts are keyboard accessible
- [ ] Screen reader compatible
- [ ] Proper ARIA labels
- [ ] Sufficient color contrast (WCAG AA)

### Form Interactions
- [ ] Doesn't break form focus
- [ ] Preserves tab order
- [ ] Works with keyboard navigation
- [ ] Announces changes to screen readers

---

## Regression Testing

After any code changes:

- [ ] All basic functionality still works
- [ ] No new console errors
- [ ] Performance hasn't degraded
- [ ] All browsers still supported
- [ ] Analytics events still firing

---

## Test Results Summary

**Date:** _______________
**Tester:** _______________
**Browser:** _______________
**Version:** _______________

**Overall Status:**
- [ ] Pass
- [ ] Fail (details below)

**Issues Found:**
```
[Document any issues here]
```

**Recommendations:**
```
[Add recommendations here]
```

---

## Common Issues & Solutions

### Issue: Code field not found
**Solution:**
1. Inspect the checkout page HTML
2. Update selectors in discounts.json
3. Add new selector to comma-separated list
4. Test with updated selectors

### Issue: Apply button not clickable
**Solution:**
1. Check if button is disabled (validation required)
2. Wait longer before clicking (increase delay)
3. Try alternative button selectors
4. Check for JavaScript event listeners that prevent clicks

### Issue: Toast not visible
**Solution:**
1. Check for CSP violations in console
2. Verify z-index isn't being overridden
3. Check for conflicting CSS from page
4. Try injecting styles earlier in page load

### Issue: MutationObserver not firing
**Solution:**
1. Verify correct element is being observed
2. Check observer configuration (childList, subtree)
3. Ensure observer isn't disconnected prematurely
4. Add logging to observer callback for debugging

### Issue: Background messages not received
**Solution:**
1. Verify background script is running
2. Check chrome.runtime.lastError in console
3. Ensure message listener is registered
4. Test with chrome.runtime.id to verify context

---

## Debugging Tips

1. **Enable verbose logging:**
   - Open DevTools Console
   - Filter by "[PropDeals"
   - Watch for timing and state changes

2. **Monitor MutationObserver:**
   - Add console.log in observer callback
   - Check mutation records
   - Verify debounce timing

3. **Test with Network throttling:**
   - DevTools > Network tab
   - Enable "Slow 3G"
   - Verify retry logic works

4. **Profile performance:**
   - DevTools > Performance tab
   - Record during checkout
   - Look for long tasks or memory spikes

5. **Test error paths:**
   - Temporarily rename selectors to cause failures
   - Verify fallback mechanisms work
   - Check error messages are helpful

---

## Sign-off

**QA Lead:** _______________
**Date:** _______________
**Signature:** _______________

**Product Owner:** _______________
**Date:** _______________
**Signature:** _______________

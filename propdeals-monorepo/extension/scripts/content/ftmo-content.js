/**
 * FTMO Content Script
 * Automatically applies PropDeals discount code on FTMO checkout pages
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    firmName: 'FTMO',
    firmId: 'ftmo',
    affiliateCode: 'PROPDEALS15',
    checkoutUrls: [
      'https://www.ftmo.com/checkout',
      'https://www.ftmo.com/cart',
      'https://trader.ftmo.com/checkout'
    ],
    selectors: {
      codeField: "#discount-code, input[name='discount'], input[placeholder*='discount' i], input[placeholder*='coupon' i], input[placeholder*='promo' i]",
      applyButton: "button[type='submit'].apply-coupon, button:has-text('Apply'), .coupon-apply-button, button.btn-apply"
    },
    retryAttempts: 3,
    retryDelay: 2000,
    observerDelay: 1000,
  };

  // State
  let hasAttemptedApply = false;
  let observer = null;

  /**
   * Main initialization function
   */
  async function init() {
    // Check if we're on a checkout page
    if (!isCheckoutPage(CONFIG.checkoutUrls)) {
      log(CONFIG.firmName, 'Not on checkout page, skipping');
      return;
    }

    log(CONFIG.firmName, 'Detected checkout page, initializing...');

    // Try immediate application
    const immediateSuccess = await attemptCodeApplication();

    if (immediateSuccess) {
      log(CONFIG.firmName, 'Successfully applied code immediately');
      return;
    }

    // Set up MutationObserver for dynamic content
    setupObserver();

    // Also try with delay for slower-loading pages
    setTimeout(async () => {
      if (!hasAttemptedApply) {
        await attemptCodeApplication();
      }
    }, CONFIG.observerDelay);
  }

  /**
   * Attempt to apply the discount code
   */
  async function attemptCodeApplication() {
    try {
      log(CONFIG.firmName, 'Attempting to apply discount code...');

      // Find the discount code input field
      const codeField = await findCodeField();

      if (!codeField) {
        log(CONFIG.firmName, 'Code field not found');
        return false;
      }

      // Check if user already has a code entered
      if (hasExistingCode(codeField)) {
        const existingCode = codeField.value.trim();
        log(CONFIG.firmName, `User already has code entered: ${existingCode}`);

        // Don't override user's code
        if (existingCode !== CONFIG.affiliateCode) {
          showToast({
            title: 'Discount Code Detected',
            message: `You already have a code applied: ${existingCode}`,
            type: 'info',
            duration: 4000
          });

          await notifyBackground('user_has_code', false, existingCode);
          return false;
        }

        // Code is already our affiliate code
        log(CONFIG.firmName, 'Our code is already applied');
        return true;
      }

      // Apply the code
      const applied = await applyCode(codeField);

      if (applied) {
        hasAttemptedApply = true;
        return true;
      }

      return false;

    } catch (error) {
      logError(CONFIG.firmName, 'Error in attemptCodeApplication:', error);
      await notifyBackground('error', false, error.message);
      return false;
    }
  }

  /**
   * Find the discount code input field
   */
  async function findCodeField() {
    // First try immediate find
    let codeField = findElement(CONFIG.selectors.codeField);

    if (codeField) {
      return codeField;
    }

    // Wait for element to appear
    log(CONFIG.firmName, 'Code field not immediately found, waiting...');
    codeField = await waitForElement(CONFIG.selectors.codeField, 5000);

    return codeField;
  }

  /**
   * Apply the discount code
   */
  async function applyCode(codeField) {
    try {
      // Set the input value
      log(CONFIG.firmName, `Filling code field with: ${CONFIG.affiliateCode}`);
      const inputSet = setInputValue(codeField, CONFIG.affiliateCode);

      if (!inputSet) {
        throw new Error('Failed to set input value');
      }

      // Wait a moment for any validation
      await sleep(500);

      // Try to click the apply button
      const buttonClicked = await retry(
        () => {
          const clicked = clickApplyButton(CONFIG.selectors.applyButton);
          if (!clicked) {
            throw new Error('Apply button not found or not clickable');
          }
          return clicked;
        },
        CONFIG.retryAttempts,
        CONFIG.retryDelay
      );

      if (buttonClicked) {
        log(CONFIG.firmName, 'Successfully clicked apply button');

        // Show success toast
        showToast({
          title: 'Discount Code Applied!',
          message: `${CONFIG.affiliateCode} has been applied to your FTMO checkout.`,
          type: 'success',
          duration: 5000
        });

        // Track the code application
        await trackCodeApplication('ftmo', CONFIG.affiliateCode, true, {
          method: 'auto_apply',
          page: window.location.pathname
        });

        // Notify background script
        await notifyBackground('code_applied', true);

        return true;
      } else {
        // Fallback: show manual copy option
        await handleFallback();
        return false;
      }

    } catch (error) {
      logError(CONFIG.firmName, 'Error applying code:', error);
      await handleFallback();
      return false;
    }
  }

  /**
   * Handle fallback when auto-apply fails
   */
  async function handleFallback() {
    log(CONFIG.firmName, 'Auto-apply failed, offering manual copy');

    // Copy code to clipboard
    const copied = await copyToClipboard(CONFIG.affiliateCode);

    if (copied) {
      showToast({
        title: 'Discount Code Copied!',
        message: `${CONFIG.affiliateCode} has been copied to your clipboard. Please paste it manually.`,
        type: 'info',
        duration: 7000
      });

      await notifyBackground('code_copied', false);
    } else {
      showToast({
        title: 'Discount Code Available',
        message: `Use code ${CONFIG.affiliateCode} for your discount.`,
        type: 'info',
        duration: 7000
      });

      await notifyBackground('code_shown', false);
    }
  }

  /**
   * Set up MutationObserver to watch for dynamic content changes
   */
  function setupObserver() {
    if (observer) {
      return; // Observer already set up
    }

    log(CONFIG.firmName, 'Setting up MutationObserver for dynamic content...');

    observer = new MutationObserver(debounce(async (mutations) => {
      // Check if we've already successfully applied the code
      if (hasAttemptedApply) {
        return;
      }

      // Check if discount field appeared
      const codeField = findElement(CONFIG.selectors.codeField);
      if (codeField && !hasExistingCode(codeField)) {
        log(CONFIG.firmName, 'Code field appeared via MutationObserver');
        await attemptCodeApplication();
      }
    }, 500));

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    log(CONFIG.firmName, 'MutationObserver active');
  }

  /**
   * Notify background script of events
   */
  async function notifyBackground(event, success, metadata = null) {
    try {
      await sendToBackground({
        type: 'DISCOUNT_CODE_EVENT',
        payload: {
          firmId: CONFIG.firmId,
          firmName: CONFIG.firmName,
          event: event,
          success: success,
          code: CONFIG.affiliateCode,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          metadata: metadata
        }
      });
    } catch (error) {
      logError(CONFIG.firmName, 'Failed to notify background script:', error);
    }
  }

  /**
   * Cleanup on page unload
   */
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Listen for page unload
  window.addEventListener('beforeunload', cleanup);

  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

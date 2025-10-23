/**
 * Shared Utilities for Content Scripts
 * Common functions used across all prop firm content scripts
 */

// Toast notification styles
const TOAST_STYLES = `
  .propdeals-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    max-width: 350px;
    animation: slideInUp 0.3s ease-out;
  }

  .propdeals-toast.success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  .propdeals-toast.error {
    background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  }

  .propdeals-toast.info {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  .propdeals-toast-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .propdeals-toast-message {
    font-size: 13px;
    opacity: 0.95;
  }

  .propdeals-toast-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .propdeals-toast-close:hover {
    opacity: 1;
  }

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`;

/**
 * Show a toast notification
 * @param {Object} options - Toast options
 * @param {string} options.title - Toast title
 * @param {string} options.message - Toast message
 * @param {string} options.type - Toast type: 'success', 'error', 'info'
 * @param {number} options.duration - Duration in ms (default: 5000)
 */
function showToast({ title, message, type = 'info', duration = 5000 }) {
  // Inject styles if not already present
  if (!document.getElementById('propdeals-toast-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'propdeals-toast-styles';
    styleEl.textContent = TOAST_STYLES;
    document.head.appendChild(styleEl);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `propdeals-toast ${type}`;
  toast.innerHTML = `
    <button class="propdeals-toast-close" aria-label="Close">&times;</button>
    <div class="propdeals-toast-title">${escapeHtml(title)}</div>
    <div class="propdeals-toast-message">${escapeHtml(message)}</div>
  `;

  document.body.appendChild(toast);

  // Close button handler
  const closeBtn = toast.querySelector('.propdeals-toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  // Auto-remove after duration
  setTimeout(() => removeToast(toast), duration);
}

/**
 * Remove toast with animation
 */
function removeToast(toast) {
  toast.style.animation = 'slideOutDown 0.3s ease-out';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Wait for element to appear in DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<Element|null>}
 */
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve) => {
    // Check if element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // Set up observer
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Timeout handler
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

/**
 * Try multiple selectors and return first matching element
 * @param {string} selectors - Comma-separated CSS selectors
 * @returns {Element|null}
 */
function findElement(selectors) {
  const selectorList = selectors.split(',').map(s => s.trim());

  for (const selector of selectorList) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    } catch (e) {
      console.warn(`[PropDeals] Invalid selector: ${selector}`, e);
    }
  }

  return null;
}

/**
 * Check if an input field already has a value
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function hasExistingCode(input) {
  if (!input) return false;

  const value = input.value.trim();
  return value.length > 0;
}

/**
 * Safely set input value and trigger events
 * @param {HTMLInputElement} input
 * @param {string} value
 */
function setInputValue(input, value) {
  if (!input) return false;

  // Set value
  input.value = value;

  // Trigger events for frameworks (React, Vue, etc.)
  const events = [
    new Event('input', { bubbles: true }),
    new Event('change', { bubbles: true }),
    new KeyboardEvent('keydown', { bubbles: true }),
    new KeyboardEvent('keyup', { bubbles: true }),
  ];

  events.forEach(event => input.dispatchEvent(event));

  return true;
}

/**
 * Try to click the apply button
 * @param {string} buttonSelector
 * @returns {boolean}
 */
function clickApplyButton(buttonSelector) {
  const button = findElement(buttonSelector);

  if (!button) {
    console.warn('[PropDeals] Apply button not found');
    return false;
  }

  // Check if button is disabled
  if (button.disabled || button.hasAttribute('disabled')) {
    console.warn('[PropDeals] Apply button is disabled');
    return false;
  }

  try {
    button.click();
    return true;
  } catch (e) {
    console.error('[PropDeals] Error clicking apply button:', e);
    return false;
  }
}

/**
 * Log message with PropDeals prefix
 */
function log(firmName, ...args) {
  console.log(`[PropDeals - ${firmName}]`, ...args);
}

/**
 * Log error with PropDeals prefix
 */
function logError(firmName, ...args) {
  console.error(`[PropDeals - ${firmName}]`, ...args);
}

/**
 * Send message to background script
 * @param {Object} message
 * @returns {Promise<any>}
 */
function sendToBackground(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function multiple times
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delay - Delay between attempts in ms
 */
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === maxAttempts) {
        throw e;
      }
      await sleep(delay);
    }
  }
}

/**
 * Check if current URL matches any of the checkout URLs
 * @param {string[]} checkoutUrls
 * @returns {boolean}
 */
function isCheckoutPage(checkoutUrls) {
  const currentUrl = window.location.href;

  return checkoutUrls.some(url => {
    // Simple contains check
    if (currentUrl.includes(url)) {
      return true;
    }

    // Try pattern matching
    try {
      const pattern = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(pattern);
      return regex.test(currentUrl);
    } catch (e) {
      return false;
    }
  });
}

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback method
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (fallbackError) {
      console.error('[PropDeals] Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export utilities (for ES6 modules, if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    waitForElement,
    findElement,
    hasExistingCode,
    setInputValue,
    clickApplyButton,
    log,
    logError,
    sendToBackground,
    sleep,
    retry,
    isCheckoutPage,
    copyToClipboard,
    debounce,
  };
}

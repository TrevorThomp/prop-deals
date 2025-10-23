// PropDeals Popup Script
// Handles the main popup UI and user interactions

// DOM Elements
const dealsContainer = document.getElementById('dealsContainer');
const loading = document.getElementById('loading');
const settingsBtn = document.getElementById('settingsBtn');
const howItWorksLink = document.getElementById('howItWorksLink');
const howItWorksModal = document.getElementById('howItWorksModal');
const closeModal = document.getElementById('closeModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadDeals();
  setupEventListeners();
});

// Load and display deals
async function loadDeals() {
  try {
    loading.style.display = 'flex';

    // Request discounts from background script
    const response = await chrome.runtime.sendMessage({ type: 'get_discounts' });

    if (!response || !response.success) {
      throw new Error(response?.error || 'Failed to load discounts');
    }

    const data = response.data;

    // Hide loading spinner
    loading.style.display = 'none';

    if (!data || !data.firms || data.firms.length === 0) {
      showEmptyState();
      return;
    }

    // Show last update time and refresh button
    if (data.updated_at) {
      showLastUpdateInfo(data.updated_at);
    }

    // Render deals
    renderDeals(data.firms);
  } catch (error) {
    console.error('Error loading deals:', error);
    loading.style.display = 'none';
    showErrorState();
  }
}

// Render deals in the UI
function renderDeals(firms) {
  dealsContainer.innerHTML = '';

  firms.forEach(firm => {
    const card = createDealCard(firm);
    dealsContainer.appendChild(card);
  });
}

// Create individual deal card
function createDealCard(firm) {
  const card = document.createElement('div');
  card.className = 'deal-card';

  const hasDiscount = firm.discount && firm.discount.amount > 0;

  if (!hasDiscount) {
    card.classList.add('no-discount');
  }

  // Calculate expiration info
  const expirationHTML = hasDiscount ? getExpirationHTML(firm.discount.expires_at) : '';

  card.innerHTML = `
    <div class="deal-header">
      <div class="firm-info">
        <img src="${firm.logo_url}" alt="${firm.name}" class="firm-logo" onerror="this.src='../icons/icon48.png'">
        <div class="firm-details">
          <div class="firm-name">${firm.name}</div>
          <div class="discount-description">
            ${hasDiscount ? firm.discount.description : 'No active discount'}
          </div>
        </div>
      </div>
      <div class="discount-badge ${hasDiscount ? '' : 'no-deal'}">
        ${hasDiscount ? `${firm.discount.amount}% OFF` : 'No Deal'}
      </div>
    </div>

    ${hasDiscount ? `
      <div class="deal-body">
        ${expirationHTML}
        <div class="code-box">
          <span class="code-text">${firm.affiliate_code}</span>
          <button class="copy-btn" data-code="${firm.affiliate_code}">Copy</button>
        </div>
      </div>
    ` : ''}

    <div class="deal-footer">
      ${hasDiscount ? `
        <a href="${firm.affiliate_url}&code=${firm.affiliate_code}"
           class="btn btn-primary"
           target="_blank"
           data-firm="${firm.id}">
          Get Deal →
        </a>
      ` : `
        <a href="${firm.site_url}"
           class="btn btn-secondary"
           target="_blank">
          Visit Site
        </a>
      `}
    </div>
  `;

  // Add event listeners
  const copyBtn = card.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => copyCode(firm.affiliate_code, copyBtn));
  }

  const dealLink = card.querySelector('[data-firm]');
  if (dealLink) {
    dealLink.addEventListener('click', () => trackDealClick(firm.id));
  }

  return card;
}

// Get expiration HTML with countdown
function getExpirationHTML(expiresAt) {
  if (!expiresAt) return '';

  const now = new Date();
  const expiration = new Date(expiresAt);
  const daysLeft = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));

  let expirationText = '';
  let urgentClass = '';

  if (daysLeft < 0) {
    expirationText = '⚠️ Expired';
    urgentClass = 'urgent';
  } else if (daysLeft === 0) {
    expirationText = '⏰ Expires today!';
    urgentClass = 'urgent';
  } else if (daysLeft === 1) {
    expirationText = '⏰ Expires tomorrow';
    urgentClass = 'urgent';
  } else if (daysLeft <= 3) {
    expirationText = `⏰ Expires in ${daysLeft} days`;
    urgentClass = 'urgent';
  } else if (daysLeft <= 7) {
    expirationText = `⏱️ Expires in ${daysLeft} days`;
  } else {
    const formattedDate = expiration.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    expirationText = `📅 Valid until ${formattedDate}`;
  }

  return `<div class="expiration ${urgentClass}">${expirationText}</div>`;
}

// Copy discount code to clipboard
async function copyCode(code, button) {
  try {
    await navigator.clipboard.writeText(code);

    // Visual feedback
    const originalText = button.textContent;
    button.textContent = '✓ Copied';
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);

    // Track copy event
    trackEvent('code_copied', { code });
  } catch (error) {
    console.error('Failed to copy code:', error);
    button.textContent = 'Failed';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  }
}

// Track deal click
function trackDealClick(firmId) {
  trackEvent('deal_clicked', { firm: firmId });
}

// Track events (for analytics)
function trackEvent(eventName, properties = {}) {
  chrome.runtime.sendMessage({
    type: 'track_event',
    event: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString()
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Settings button
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // How it works modal
  howItWorksLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeModal.addEventListener('click', closeModalHandler);
  closeModalBtn.addEventListener('click', closeModalHandler);

  // Close modal when clicking outside
  howItWorksModal.addEventListener('click', (e) => {
    if (e.target === howItWorksModal) {
      closeModalHandler();
    }
  });
}

// Modal handlers
function openModal() {
  howItWorksModal.classList.add('active');
  trackEvent('how_it_works_opened');
}

function closeModalHandler() {
  howItWorksModal.classList.remove('active');
}

// Show last update info and refresh button
function showLastUpdateInfo(updatedAt) {
  const headerText = document.querySelector('.header-text');
  if (!headerText) return;

  // Remove existing update info
  const existingInfo = headerText.querySelector('.update-info');
  if (existingInfo) existingInfo.remove();

  const updateInfo = document.createElement('div');
  updateInfo.className = 'update-info';
  updateInfo.style.cssText = `
    font-size: 10px;
    opacity: 0.9;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  `;

  const date = new Date(updatedAt);
  const timeAgo = getTimeAgo(date);

  updateInfo.innerHTML = `
    <span>Updated ${timeAgo}</span>
    <button class="refresh-btn" style="
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      cursor: pointer;
      transition: background 0.2s;
    " title="Refresh discounts">↻</button>
  `;

  headerText.appendChild(updateInfo);

  // Add refresh functionality
  const refreshBtn = updateInfo.querySelector('.refresh-btn');
  refreshBtn.addEventListener('click', handleRefresh);
  refreshBtn.addEventListener('mouseenter', () => {
    refreshBtn.style.background = 'rgba(255,255,255,0.3)';
  });
  refreshBtn.addEventListener('mouseleave', () => {
    refreshBtn.style.background = 'rgba(255,255,255,0.2)';
  });
}

// Handle manual refresh
async function handleRefresh() {
  const refreshBtn = document.querySelector('.refresh-btn');
  if (!refreshBtn) return;

  const originalText = refreshBtn.textContent;
  refreshBtn.textContent = '↻';
  refreshBtn.disabled = true;
  refreshBtn.style.opacity = '0.5';
  refreshBtn.style.animation = 'spin 1s linear infinite';

  // Add spin animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  try {
    // Request fresh discounts from background
    const response = await chrome.runtime.sendMessage({ type: 'refresh_discounts' });

    if (response.success) {
      refreshBtn.textContent = '✓';
      refreshBtn.style.animation = 'none';

      // Track refresh event
      trackEvent('manual_refresh', { success: true });

      // Reload deals
      setTimeout(() => {
        loadDeals();
      }, 500);
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('Refresh failed:', error);
    refreshBtn.textContent = '✗';
    refreshBtn.style.animation = 'none';

    // Track failure
    trackEvent('manual_refresh', { success: false, error: error.message });

    // Restore button after delay
    setTimeout(() => {
      refreshBtn.textContent = originalText;
      refreshBtn.disabled = false;
      refreshBtn.style.opacity = '1';
    }, 2000);
  }
}

// Get time ago string
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Show empty state
function showEmptyState() {
  dealsContainer.innerHTML = `
    <div class="empty-state">
      <h3>No Deals Available</h3>
      <p>We're currently updating our discount database. Check back soon!</p>
    </div>
  `;
}

// Show error state
function showErrorState() {
  loading.style.display = 'none';
  dealsContainer.innerHTML = `
    <div class="empty-state">
      <h3>Oops! Something went wrong</h3>
      <p>Failed to load deals. Please try closing and reopening the extension.</p>
    </div>
  `;
}

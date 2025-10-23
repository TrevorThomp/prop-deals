// PropDeals Settings Script
// Handles user preferences and settings management

// DOM Elements
const notificationsToggle = document.getElementById('notificationsToggle');
const firmsList = document.getElementById('firmsList');
const versionNumber = document.getElementById('versionNumber');
const privacyPolicyLink = document.getElementById('privacyPolicyLink');
const termsLink = document.getElementById('termsLink');
const supportLink = document.getElementById('supportLink');

// Storage keys
const STORAGE_KEYS = {
  NOTIFICATIONS_ENABLED: 'notificationsEnabled'
};

// Initialize settings page
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadSupportedFirms();
  loadVersionInfo();
  setupEventListeners();
});

// Load user settings
async function loadSettings() {
  try {
    const storage = await chrome.storage.sync.get(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    const notificationsEnabled = storage[STORAGE_KEYS.NOTIFICATIONS_ENABLED] !== false;

    notificationsToggle.checked = notificationsEnabled;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Load supported firms
async function loadSupportedFirms() {
  try {
    // Fetch discount data
    const response = await fetch(chrome.runtime.getURL('data/discounts.json'));
    const data = await response.json();

    if (!data.firms || data.firms.length === 0) {
      firmsList.innerHTML = '<p style="color: #6B7280; padding: 16px;">No firms configured</p>';
      return;
    }

    // Render firms
    firmsList.innerHTML = '';
    data.firms.forEach(firm => {
      const firmItem = createFirmItem(firm);
      firmsList.appendChild(firmItem);
    });
  } catch (error) {
    console.error('Error loading firms:', error);
    firmsList.innerHTML = '<p style="color: #EF4444; padding: 16px;">Failed to load firms</p>';
  }
}

// Create firm list item
function createFirmItem(firm) {
  const item = document.createElement('div');
  item.className = 'firm-item';

  const hostname = new URL(firm.site_url).hostname.replace('www.', '');

  item.innerHTML = `
    <img src="${firm.logo_url}" alt="${firm.name}" class="firm-logo-small" onerror="this.src='../icons/icon48.png'">
    <div class="firm-details">
      <div class="firm-name-text">${firm.name}</div>
      <div class="firm-url">${hostname}</div>
    </div>
    <div class="firm-status">✓ Active</div>
  `;

  return item;
}

// Load version information
function loadVersionInfo() {
  const manifest = chrome.runtime.getManifest();
  versionNumber.textContent = manifest.version;
}

// Setup event listeners
function setupEventListeners() {
  // Notifications toggle
  notificationsToggle.addEventListener('change', async (e) => {
    const enabled = e.target.checked;

    try {
      await chrome.storage.sync.set({
        [STORAGE_KEYS.NOTIFICATIONS_ENABLED]: enabled
      });

      // Show feedback
      showToast(
        enabled ? 'Notifications enabled' : 'Notifications disabled',
        enabled ? 'success' : 'info'
      );

      // Request notification permission if enabling
      if (enabled) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          // Revert toggle if permission denied
          e.target.checked = false;
          await chrome.storage.sync.set({
            [STORAGE_KEYS.NOTIFICATIONS_ENABLED]: false
          });
          showToast('Notification permission denied', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving notification preference:', error);
      showToast('Failed to save preference', 'error');
    }
  });

  // External links
  privacyPolicyLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://propdeals.com/privacy', '_blank');
  });

  termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://propdeals.com/terms', '_blank');
  });

  supportLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('mailto:support@propdeals.com', '_blank');
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6B7280'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape key to close
  if (e.key === 'Escape') {
    window.close();
  }
});

// PropDeals Background Service Worker
// Handles discount updates, notifications, and extension lifecycle

// Constants
// TODO: Update these URLs when you deploy to GitHub Pages
const REMOTE_DISCOUNTS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/propdeals-api/main/v1/discounts.json';
const REMOTE_INFLUENCERS_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/propdeals-api/main/v1/influencers.json';
const USE_LOCAL_FALLBACK = true; // Set to false when GitHub API is ready
const DISCOUNT_CHECK_INTERVAL = 24 * 60; // 24 hours in minutes
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MIN_FETCH_INTERVAL = 60 * 60 * 1000; // 1 hour minimum between fetches

const STORAGE_KEYS = {
  LAST_CHECK: 'lastDiscountCheck',
  DISCOUNT_VERSION: 'discountVersion',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
  SEEN_DEALS: 'seenDeals',
  REMOTE_DISCOUNTS: 'remoteDiscounts',
  REMOTE_INFLUENCERS: 'remoteInfluencers',
  LAST_FETCH: 'lastFetchTimestamp',
  LAST_INFLUENCER_FETCH: 'lastInfluencerFetch',
  FETCH_ERROR_COUNT: 'fetchErrorCount',
  SELECTED_INFLUENCER: 'selected_influencer',
  INFLUENCER_DATA: 'influencer_data'
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await handleFirstInstall();
  } else if (details.reason === 'update') {
    await handleUpdate(details.previousVersion);
  }

  // Set up periodic discount check alarm
  chrome.alarms.create('checkDiscounts', {
    periodInMinutes: DISCOUNT_CHECK_INTERVAL,
    delayInMinutes: 1 // First check after 1 minute
  });
});

// Handle first install
async function handleFirstInstall() {
  console.log('PropDeals installed!');

  // Set default preferences
  await chrome.storage.sync.set({
    [STORAGE_KEYS.NOTIFICATIONS_ENABLED]: true,
    [STORAGE_KEYS.SEEN_DEALS]: []
  });

  await chrome.storage.local.set({
    [STORAGE_KEYS.LAST_CHECK]: Date.now(),
    [STORAGE_KEYS.DISCOUNT_VERSION]: '1.0.0',
    onboarding_completed: false
  });

  // Fetch remote data on first install
  await fetchRemoteDiscounts();
  await fetchRemoteInfluencers();

  // Open onboarding page
  chrome.tabs.create({ url: chrome.runtime.getURL('pages/onboarding.html') });
}

// Handle extension update
async function handleUpdate(previousVersion) {
  console.log(`PropDeals updated from ${previousVersion}`);

  // Fetch fresh discounts on update
  await fetchRemoteDiscounts();
}

// ============================================
// REMOTE DISCOUNT FETCHING
// ============================================

// Fetch discounts from remote URL
async function fetchRemoteDiscounts(force = false) {
  // If using local fallback, skip remote fetch
  if (USE_LOCAL_FALLBACK) {
    console.log('Using local discounts (USE_LOCAL_FALLBACK = true)');
    return await loadBundledDiscounts();
  }

  try {
    // Check rate limiting (unless forced)
    if (!force) {
      const storage = await chrome.storage.local.get(STORAGE_KEYS.LAST_FETCH);
      const lastFetch = storage[STORAGE_KEYS.LAST_FETCH] || 0;
      const timeSinceLastFetch = Date.now() - lastFetch;

      if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
        console.log('Rate limited - fetch too soon, using cache');
        return await getCachedDiscounts();
      }
    }

    console.log('Fetching remote discounts...');

    const response = await fetch(REMOTE_DISCOUNTS_URL, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate data structure
    if (!validateDiscountData(data)) {
      throw new Error('Invalid data structure');
    }

    // Store in local storage
    await chrome.storage.local.set({
      [STORAGE_KEYS.REMOTE_DISCOUNTS]: data,
      [STORAGE_KEYS.LAST_FETCH]: Date.now(),
      [STORAGE_KEYS.DISCOUNT_VERSION]: data.version,
      [STORAGE_KEYS.FETCH_ERROR_COUNT]: 0
    });

    console.log(`✓ Remote discounts fetched successfully (v${data.version})`);

    // Check for new deals and notify
    await checkForNewDeals(data);

    // Update badge
    await updateBadge(data.firms);

    return data;

  } catch (error) {
    console.error('Failed to fetch remote discounts:', error.message);

    // Increment error count
    const storage = await chrome.storage.local.get(STORAGE_KEYS.FETCH_ERROR_COUNT);
    const errorCount = (storage[STORAGE_KEYS.FETCH_ERROR_COUNT] || 0) + 1;
    await chrome.storage.local.set({
      [STORAGE_KEYS.FETCH_ERROR_COUNT]: errorCount
    });

    // Fallback to cached or bundled version
    const cachedData = await getCachedDiscounts();
    if (cachedData) {
      console.log('Using cached discounts (remote fetch failed)');
      return cachedData;
    }

    console.log('Using bundled discounts (fallback)');
    return await loadBundledDiscounts();
  }
}

// Load bundled discounts (fallback)
async function loadBundledDiscounts() {
  try {
    const response = await fetch(chrome.runtime.getURL('data/discounts.json'));
    const data = await response.json();
    console.log('Loaded bundled discounts (v' + data.version + ')');
    return data;
  } catch (error) {
    console.error('Failed to load bundled discounts:', error);
    return null;
  }
}

// Get cached discounts
async function getCachedDiscounts() {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.REMOTE_DISCOUNTS);
  return storage[STORAGE_KEYS.REMOTE_DISCOUNTS] || null;
}

// Get current discounts (smart caching)
async function getCurrentDiscounts() {
  const storage = await chrome.storage.local.get([
    STORAGE_KEYS.REMOTE_DISCOUNTS,
    STORAGE_KEYS.LAST_FETCH,
    STORAGE_KEYS.INFLUENCER_DATA
  ]);

  const cachedData = storage[STORAGE_KEYS.REMOTE_DISCOUNTS];
  const lastFetch = storage[STORAGE_KEYS.LAST_FETCH] || 0;
  const timeSinceLastFetch = Date.now() - lastFetch;

  let discountData;

  // If cache exists and is fresh, use it
  if (cachedData && timeSinceLastFetch < CACHE_DURATION) {
    console.log('Using cached discounts (fresh)');
    discountData = cachedData;
  } else {
    // Cache is stale or doesn't exist - fetch fresh
    console.log('Cache stale or missing - fetching fresh data');
    discountData = await fetchRemoteDiscounts();
  }

  // Merge with influencer-specific codes and discounts if influencer is selected
  const influencer = storage[STORAGE_KEYS.INFLUENCER_DATA];
  if (influencer) {
    discountData = mergeInfluencerData(discountData, influencer);
  }

  return discountData;
}

// Merge influencer-specific affiliate codes and custom discounts
function mergeInfluencerData(discountData, influencer) {
  // Clone the data to avoid mutation
  const mergedData = JSON.parse(JSON.stringify(discountData));

  // Filter to only enabled firms if influencer has enabled_firms
  if (influencer.enabled_firms && influencer.enabled_firms.length > 0) {
    mergedData.firms = mergedData.firms.filter(firm =>
      influencer.enabled_firms.includes(firm.id)
    );
  }

  // Apply influencer's affiliate codes and custom discounts
  mergedData.firms = mergedData.firms.map(firm => {
    const influencerCodes = influencer.affiliate_codes?.[firm.id];
    const customDiscount = influencer.custom_discounts?.[firm.id];

    // Use influencer's affiliate code and URL if available
    if (influencerCodes) {
      firm.affiliate_code = influencerCodes.code;
      firm.affiliate_url = influencerCodes.url;
    }

    // Override discount with influencer's custom discount if available
    if (customDiscount) {
      firm.discount = {
        ...firm.discount,
        amount: customDiscount.amount,
        description: customDiscount.description,
        expires_at: customDiscount.expires_at
      };
    }

    return firm;
  });

  return mergedData;
}

// Validate discount data structure
function validateDiscountData(data) {
  try {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || typeof data.version !== 'string') return false;
    if (!data.firms || !Array.isArray(data.firms)) return false;
    if (data.firms.length === 0) return false;

    // Validate each firm has required fields
    for (const firm of data.firms) {
      if (!firm.id || !firm.name) return false;
    }

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Listen for alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkDiscounts') {
    console.log('Alarm: Checking for discount updates...');
    await fetchRemoteDiscounts();
  }
});

// Check for new deals in fresh data
async function checkForNewDeals(newData) {
  try {
    const data = newData;

    // Get stored version and seen deals
    const storage = await chrome.storage.local.get([
      STORAGE_KEYS.DISCOUNT_VERSION,
      STORAGE_KEYS.SEEN_DEALS
    ]);

    const storedVersion = storage[STORAGE_KEYS.DISCOUNT_VERSION];
    const seenDeals = storage[STORAGE_KEYS.SEEN_DEALS] || [];

    // Check if version has changed or new deals exist
    const newDeals = findNewDeals(data.firms, seenDeals);

    if (data.version !== storedVersion || newDeals.length > 0) {
      console.log('New discounts found!', newDeals);

      // Update stored version
      await chrome.storage.local.set({
        [STORAGE_KEYS.DISCOUNT_VERSION]: data.version,
        [STORAGE_KEYS.LAST_CHECK]: Date.now()
      });

      // Notify about new deals
      await notifyNewDeals(newDeals);

      // Update badge
      await updateBadge(data.firms);
    } else {
      console.log('No new discounts');
    }
  } catch (error) {
    console.error('Error checking for discount updates:', error);
  }
}

// Find new deals that haven't been seen
function findNewDeals(firms, seenDeals) {
  const newDeals = [];

  firms.forEach(firm => {
    if (!firm.discount || firm.discount.amount <= 0) {
      return; // Skip firms without active discounts
    }

    const dealId = `${firm.id}_${firm.affiliate_code}_${firm.discount.amount}`;

    if (!seenDeals.includes(dealId)) {
      newDeals.push({
        ...firm,
        dealId
      });
    }
  });

  return newDeals;
}

// Notify about new deals
async function notifyNewDeals(newDeals) {
  if (newDeals.length === 0) return;

  // Check if notifications are enabled
  const storage = await chrome.storage.sync.get(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
  const notificationsEnabled = storage[STORAGE_KEYS.NOTIFICATIONS_ENABLED] !== false;

  if (!notificationsEnabled) return;

  // Mark deals as seen
  const seenStorage = await chrome.storage.local.get(STORAGE_KEYS.SEEN_DEALS);
  const seenDeals = seenStorage[STORAGE_KEYS.SEEN_DEALS] || [];
  const updatedSeenDeals = [...seenDeals, ...newDeals.map(d => d.dealId)];

  await chrome.storage.local.set({
    [STORAGE_KEYS.SEEN_DEALS]: updatedSeenDeals
  });

  // Show notifications for new deals
  for (const deal of newDeals.slice(0, 3)) { // Limit to 3 notifications at once
    await showDealNotification(deal);
  }

  // If more than 3 deals, show summary notification
  if (newDeals.length > 3) {
    await showNotification({
      title: 'PropDeals Alert!',
      message: `${newDeals.length} new discounts available! Click to view all.`,
      iconUrl: 'icons/icon128.png',
      type: 'basic'
    });
  }
}

// Show notification for a specific deal
async function showDealNotification(deal) {
  const expirationText = getExpirationText(deal.discount.expires_at);

  await showNotification({
    title: `New Deal: ${deal.name}`,
    message: `${deal.discount.amount}% OFF - ${deal.discount.description}${expirationText}`,
    iconUrl: deal.logo_url || 'icons/icon128.png',
    type: 'basic',
    requireInteraction: false,
    contextMessage: `Code: ${deal.affiliate_code}`
  });
}

// Get expiration text for notification
function getExpirationText(expiresAt) {
  if (!expiresAt) return '';

  const now = new Date();
  const expiration = new Date(expiresAt);
  const daysLeft = Math.ceil((expiration - now) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) return ' (Expired)';
  if (daysLeft === 1) return ' - Expires tomorrow!';
  if (daysLeft <= 3) return ` - Expires in ${daysLeft} days`;
  if (daysLeft <= 7) return ` - Valid for ${daysLeft} more days`;

  return '';
}

// Show notification
async function showNotification(options) {
  try {
    await chrome.notifications.create({
      type: options.type || 'basic',
      iconUrl: options.iconUrl || 'icons/icon128.png',
      title: options.title,
      message: options.message,
      contextMessage: options.contextMessage || '',
      requireInteraction: options.requireInteraction || false,
      priority: 1
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Update extension badge
async function updateBadge(firms) {
  const activeDeals = firms.filter(f => f.discount && f.discount.amount > 0);

  if (activeDeals.length > 0) {
    await chrome.action.setBadgeText({
      text: activeDeals.length.toString()
    });

    await chrome.action.setBadgeBackgroundColor({
      color: '#10B981' // Green color
    });
  } else {
    await chrome.action.setBadgeText({ text: '' });
  }
}

// Listen for notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Open popup when notification is clicked
  chrome.action.openPopup();
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'track_event') {
    handleAnalyticsEvent(request.event, request.properties);
  } else if (request.type === 'code_applied') {
    handleCodeApplied(request.firm, request.code, request.success, request.metadata);
  } else if (request.type === 'deal_button_clicked') {
    handleDealButtonClicked(request.firm, request.code, request.metadata);
  } else if (request.type === 'get_discounts') {
    handleGetDiscounts(sendResponse);
    return true; // Keep channel open for async response
  } else if (request.type === 'refresh_discounts') {
    handleRefreshDiscounts(sendResponse);
    return true; // Keep channel open for async response
  } else if (request.type === 'get_influencers') {
    handleGetInfluencers(sendResponse);
    return true; // Keep channel open for async response
  } else if (request.type === 'set_influencer') {
    handleSetInfluencer(request.influencer, sendResponse);
    return true; // Keep channel open for async response
  }
});

// Handle analytics events (simple logging for MVP)
function handleAnalyticsEvent(eventName, properties) {
  console.log('Analytics Event:', eventName, properties);
  // In production, this could send to Google Analytics, Mixpanel, etc.

  // TODO: When analytics backend is ready, send data here
  // Example:
  // fetch('https://api.propdeals.com/v1/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ event: eventName, properties })
  // });
}

// Handle code application result from content script
function handleCodeApplied(firm, code, success, metadata = null) {
  console.log(`Code application ${success ? 'succeeded' : 'failed'}:`, firm, code);

  if (metadata) {
    console.log('Code application metadata:', metadata);
  }

  if (success) {
    // Track successful conversion with full metadata
    handleAnalyticsEvent('code_applied_success', {
      firm,
      code,
      applied_by: metadata?.applied_by || 'unknown',
      influencer_id: metadata?.influencer_id,
      session_id: metadata?.session_id,
      ...metadata
    });
  } else {
    // Track failure for monitoring
    handleAnalyticsEvent('code_applied_failure', { firm, code, metadata });
  }
}

// Handle deal button click from popup
function handleDealButtonClicked(firm, code, metadata = null) {
  console.log('Deal button clicked:', firm, code);

  if (metadata) {
    console.log('Deal click metadata:', metadata);
  }

  // Track the click with full attribution data
  handleAnalyticsEvent('deal_button_clicked', {
    firm,
    code,
    source: metadata?.source || 'unknown',
    influencer_id: metadata?.influencer_id,
    session_id: metadata?.session_id,
    ...metadata
  });
}

// Handle discount data request
async function handleGetDiscounts(sendResponse) {
  try {
    const data = await getCurrentDiscounts();
    sendResponse({ success: true, data });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle manual refresh request from popup
async function handleRefreshDiscounts(sendResponse) {
  try {
    console.log('Manual refresh requested');
    const data = await fetchRemoteDiscounts(true); // Force fetch
    sendResponse({ success: true, data });
  } catch (error) {
    console.error('Error refreshing discounts:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// ============================================
// INFLUENCER MANAGEMENT
// ============================================

// Load bundled influencers (local fallback)
async function loadBundledInfluencers() {
  try {
    const response = await fetch(chrome.runtime.getURL('api/v1/influencers.json'));
    const data = await response.json();
    console.log('Loaded bundled influencers');
    return data;
  } catch (error) {
    console.error('Failed to load bundled influencers:', error);
    return { version: '1.0.0', influencers: [] };
  }
}

// Fetch influencers from remote URL
async function fetchRemoteInfluencers(force = false) {
  // If using local fallback, use bundled influencers
  if (USE_LOCAL_FALLBACK) {
    console.log('Using local influencers (USE_LOCAL_FALLBACK = true)');
    return await loadBundledInfluencers();
  }

  try {
    // Check rate limiting (unless forced)
    if (!force) {
      const storage = await chrome.storage.local.get(STORAGE_KEYS.LAST_INFLUENCER_FETCH);
      const lastFetch = storage[STORAGE_KEYS.LAST_INFLUENCER_FETCH] || 0;
      const timeSinceLastFetch = Date.now() - lastFetch;

      if (timeSinceLastFetch < MIN_FETCH_INTERVAL) {
        console.log('Rate limited - influencer fetch too soon, using cache');
        return await getCachedInfluencers();
      }
    }

    console.log('Fetching remote influencers...');

    const response = await fetch(REMOTE_INFLUENCERS_URL, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!validateInfluencerData(data)) {
      throw new Error('Invalid influencer data format');
    }

    // Cache the data
    await chrome.storage.local.set({
      [STORAGE_KEYS.REMOTE_INFLUENCERS]: data,
      [STORAGE_KEYS.LAST_INFLUENCER_FETCH]: Date.now()
    });

    console.log('Influencers fetched and cached successfully');
    return data;

  } catch (error) {
    console.error('Failed to fetch remote influencers:', error);

    // Fallback to cached data
    const cached = await getCachedInfluencers();
    if (cached) {
      console.log('Using cached influencers after fetch failure');
      return cached;
    }

    // If no cache, return empty data
    return { version: '1.0.0', influencers: [] };
  }
}

// Get cached influencers
async function getCachedInfluencers() {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.REMOTE_INFLUENCERS);
  return storage[STORAGE_KEYS.REMOTE_INFLUENCERS] || null;
}

// Get current influencers with caching logic
async function getCurrentInfluencers() {
  const storage = await chrome.storage.local.get([
    STORAGE_KEYS.REMOTE_INFLUENCERS,
    STORAGE_KEYS.LAST_INFLUENCER_FETCH
  ]);

  const timeSinceLastFetch = Date.now() - (storage[STORAGE_KEYS.LAST_INFLUENCER_FETCH] || 0);

  // Use cache if recent (24 hours)
  if (storage[STORAGE_KEYS.REMOTE_INFLUENCERS] && timeSinceLastFetch < CACHE_DURATION) {
    return storage[STORAGE_KEYS.REMOTE_INFLUENCERS];
  }

  // Otherwise fetch fresh data
  return await fetchRemoteInfluencers();
}

// Validate influencer data structure
function validateInfluencerData(data) {
  try {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || !Array.isArray(data.influencers)) return false;

    // Validate each influencer has required fields
    for (const influencer of data.influencers) {
      if (!influencer.id || !influencer.name || !influencer.branding) return false;
    }

    return true;
  } catch (error) {
    console.error('Influencer validation error:', error);
    return false;
  }
}

// Handle influencer data request
async function handleGetInfluencers(sendResponse) {
  try {
    const data = await getCurrentInfluencers();

    // Merge with selected influencer's custom discounts
    const storage = await chrome.storage.local.get([STORAGE_KEYS.INFLUENCER_DATA]);
    const selectedInfluencer = storage[STORAGE_KEYS.INFLUENCER_DATA];

    sendResponse({ success: true, data, selectedInfluencer });
  } catch (error) {
    console.error('Error fetching influencers:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle set influencer
async function handleSetInfluencer(influencer, sendResponse) {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SELECTED_INFLUENCER]: influencer.id,
      [STORAGE_KEYS.INFLUENCER_DATA]: influencer
    });

    // Track influencer selection
    handleAnalyticsEvent('influencer_selected', {
      influencer_id: influencer.id,
      influencer_name: influencer.name
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error('Error setting influencer:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener(async () => {
  // Fetch latest discounts when icon is clicked
  await getCurrentDiscounts();
});

// Initialize on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('PropDeals started');

  // Fetch latest discount data and update badge
  try {
    const data = await getCurrentDiscounts();
    if (data && data.firms) {
      await updateBadge(data.firms);
    }
  } catch (error) {
    console.error('Error loading discounts on startup:', error);
  }
});

console.log('PropDeals background service worker loaded');

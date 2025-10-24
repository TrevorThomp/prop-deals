// Onboarding flow script

let currentStep = 1;
let selectedInfluencer = null;
let influencers = [];

// Initialize onboarding
document.addEventListener('DOMContentLoaded', async () => {
  // Check URL for ref parameter
  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');

  if (refParam) {
    // Pre-select influencer from ref parameter
    await loadInfluencers();
    const influencer = influencers.find(inf => inf.id === refParam);
    if (influencer) {
      selectedInfluencer = influencer;
      // Skip to step 3 if influencer found
      currentStep = 3;
      showStep(3);
      return;
    }
  }

  showStep(1);
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Step 1 - Get Started
  document.getElementById('btnGetStarted')?.addEventListener('click', () => {
    if (currentStep === 1) {
      loadInfluencers();
    }
    currentStep++;
    showStep(currentStep);
  });

  // Step 2 - Skip Influencer
  document.getElementById('btnSkipInfluencer')?.addEventListener('click', () => {
    selectedInfluencer = null;
    currentStep++;
    showStep(currentStep);
  });

  // Step 3 - Complete Onboarding
  document.getElementById('btnCompleteOnboarding')?.addEventListener('click', completeOnboarding);
  document.getElementById('btnSkipNotifications')?.addEventListener('click', completeOnboarding);

  // Step 4 - Start Saving
  document.getElementById('btnStartSaving')?.addEventListener('click', () => {
    window.close();
  });

  // Progress dots
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const targetStep = parseInt(dot.dataset.step);
      if (targetStep <= currentStep) {
        showStep(targetStep);
      }
    });
  });
}

function showStep(stepNum) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });

  // Show target step
  document.getElementById(`step${stepNum}`).classList.add('active');

  // Update progress dots
  document.querySelectorAll('.dot').forEach((dot, index) => {
    if (index < stepNum) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  currentStep = stepNum;
}

// Load influencers from API
async function loadInfluencers() {
  const listElement = document.getElementById('influencerList');

  try {
    // Request influencers from background script
    const response = await chrome.runtime.sendMessage({ type: 'get_influencers' });

    if (!response || !response.success) {
      throw new Error(response?.error || 'Failed to load influencers');
    }

    influencers = response.data.influencers;
    renderInfluencers(influencers);

  } catch (error) {
    console.error('Failed to load influencers:', error);
    listElement.innerHTML = `
      <div class="influencer-loading">
        <p style="color: #EF4444;">Failed to load influencers. Please try again.</p>
        <button class="btn-secondary" onclick="loadInfluencers()" style="margin-top: 15px; max-width: 200px;">Retry</button>
      </div>
    `;
  }
}

// Render influencer cards
function renderInfluencers(influencers) {
  const listElement = document.getElementById('influencerList');

  if (influencers.length === 0) {
    listElement.innerHTML = `
      <div class="influencer-loading">
        <p>No influencers available yet.</p>
      </div>
    `;
    return;
  }

  listElement.innerHTML = influencers
    .filter(inf => inf.status === 'active')
    .map(influencer => {
      const initials = influencer.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const firmCount = influencer.enabled_firms?.length || 0;

      return `
        <div class="influencer-card" data-influencer-id="${influencer.id}">
          <div class="influencer-avatar" style="background: linear-gradient(135deg, ${influencer.branding.primary_color} 0%, ${influencer.branding.secondary_color} 100%);">
            ${initials}
          </div>
          <div class="influencer-info">
            <div class="influencer-name">${influencer.display_name}</div>
            <div class="influencer-meta">${firmCount} firms • ${influencer.branding.theme_name}</div>
          </div>
          <div class="influencer-check">✓</div>
        </div>
      `;
    })
    .join('');

  // Add click listeners to influencer cards
  document.querySelectorAll('.influencer-card').forEach(card => {
    card.addEventListener('click', () => {
      const influencerId = card.dataset.influencerId;
      selectInfluencer(influencerId);
    });
  });
}

// Select influencer
function selectInfluencer(influencerId) {
  selectedInfluencer = influencers.find(inf => inf.id === influencerId);

  // Update UI
  document.querySelectorAll('.influencer-card').forEach(card => {
    card.classList.remove('selected');
  });

  const selectedCard = document.querySelector(`[data-influencer-id="${influencerId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  // Auto-advance after selection
  setTimeout(() => {
    currentStep++;
    showStep(currentStep);
  }, 500);
}

// Complete onboarding
async function completeOnboarding() {
  const notifyNewDeals = document.getElementById('notifyNewDeals').checked;
  const notifyExpiring = document.getElementById('notifyExpiring').checked;

  // Save settings
  await chrome.storage.local.set({
    onboarding_completed: true,
    selected_influencer: selectedInfluencer?.id || null,
    influencer_data: selectedInfluencer || null,
    notifications_new_deals: notifyNewDeals,
    notifications_expiring: notifyExpiring
  });

  // Apply influencer branding if selected
  if (selectedInfluencer) {
    await chrome.runtime.sendMessage({
      type: 'set_influencer',
      influencer: selectedInfluencer
    });

    // Update success message
    document.getElementById('successMessage').textContent =
      selectedInfluencer.welcome_message ||
      `You're now supporting ${selectedInfluencer.display_name}!`;

    // Update supported firms to show only influencer's firms
    if (selectedInfluencer.enabled_firms?.length > 0) {
      const firmsHtml = selectedInfluencer.enabled_firms.map(firmId => {
        const firmNames = {
          'ftmo': 'FTMO',
          'apex': 'Apex',
          'topstep': 'TopStep',
          'myfundedfutures': 'MyFundedFutures',
          'the5ers': 'The5ers'
        };
        return `<span class="firm-badge">${firmNames[firmId]}</span>`;
      }).join('');

      document.getElementById('supportedFirms').innerHTML = firmsHtml;
    }
  }

  // Show success step
  currentStep++;
  showStep(currentStep);
}

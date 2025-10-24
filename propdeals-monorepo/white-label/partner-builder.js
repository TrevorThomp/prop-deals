// PropDeals White Label Partner Builder - JavaScript

// Available prop firms
const AVAILABLE_FIRMS = [
  {
    id: 'ftmo',
    name: 'FTMO',
    default_discount: 15,
    description: 'Largest prop firm globally'
  },
  {
    id: 'apex',
    name: 'Apex Trader Funding',
    default_discount: 10,
    description: 'Fast-growing US prop firm'
  },
  {
    id: 'topstep',
    name: 'TopStepFX',
    default_discount: 20,
    description: 'Established forex prop firm'
  },
  {
    id: 'myfundedfutures',
    name: 'MyFundedFutures',
    default_discount: 12,
    description: 'Popular US futures firm'
  },
  {
    id: 'the5ers',
    name: 'The5ers',
    default_discount: 8,
    description: 'International forex prop firm'
  }
];

// Theme presets
const THEME_PRESETS = {
  'Profit Green': {
    primary: '#10B981',
    secondary: '#065F46',
    accent: '#34D399'
  },
  'Trading Blue': {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA'
  },
  'Gold Rush': {
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FCD34D'
  },
  'Royal Purple': {
    primary: '#8B5CF6',
    secondary: '#6D28D9',
    accent: '#A78BFA'
  }
};

// State
let config = {
  firms: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeFirmsGrid();
  setupEventListeners();
  applyThemePreset('Profit Green');
  updatePreview();
});

// Initialize firms grid
function initializeFirmsGrid() {
  const grid = document.getElementById('firmsGrid');

  AVAILABLE_FIRMS.forEach(firm => {
    const card = document.createElement('div');
    card.className = 'firm-card';
    card.id = `firm-${firm.id}`;

    card.innerHTML = `
      <div class="firm-header">
        <span class="firm-name">${firm.name}</span>
        <label class="toggle-switch">
          <input type="checkbox" onchange="toggleFirm('${firm.id}', this.checked)">
          <span class="slider"></span>
        </label>
      </div>
      <div class="firm-inputs hidden" id="inputs-${firm.id}">
        <input type="text" placeholder="Affiliate Code (e.g., JOHN15)"
               id="code-${firm.id}" onchange="updatePreview()">
        <input type="url" placeholder="Affiliate URL"
               id="url-${firm.id}" onchange="updatePreview()">
        <input type="number" placeholder="Custom Discount % (optional)"
               id="discount-${firm.id}" min="0" max="100" onchange="updatePreview()">
      </div>
    `;

    grid.appendChild(card);
  });
}

// Toggle firm enabled/disabled
function toggleFirm(firmId, enabled) {
  const card = document.getElementById(`firm-${firmId}`);
  const inputs = document.getElementById(`inputs-${firmId}`);

  if (enabled) {
    card.classList.add('enabled');
    inputs.classList.remove('hidden');
  } else {
    card.classList.remove('enabled');
    inputs.classList.add('hidden');
  }

  updatePreview();
}

// Setup event listeners
function setupEventListeners() {
  // Partner info
  document.getElementById('partnerId').addEventListener('input', updatePreview);
  document.getElementById('partnerName').addEventListener('input', updatePreview);

  // Extension info
  document.getElementById('extensionName').addEventListener('input', updatePreview);
  document.getElementById('extensionShortName').addEventListener('input', updatePreview);

  // Branding
  document.getElementById('themeName').addEventListener('change', (e) => {
    if (e.target.value !== 'Custom') {
      applyThemePreset(e.target.value);
    }
  });

  // Color pickers
  const primaryColor = document.getElementById('primaryColor');
  const primaryColorText = document.getElementById('primaryColorText');
  primaryColor.addEventListener('input', (e) => {
    primaryColorText.value = e.target.value;
    updatePreview();
  });
  primaryColorText.addEventListener('input', (e) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
      primaryColor.value = e.target.value;
      updatePreview();
    }
  });

  const secondaryColor = document.getElementById('secondaryColor');
  const secondaryColorText = document.getElementById('secondaryColorText');
  secondaryColor.addEventListener('input', (e) => {
    secondaryColorText.value = e.target.value;
    updatePreview();
  });
  secondaryColorText.addEventListener('input', (e) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
      secondaryColor.value = e.target.value;
      updatePreview();
    }
  });

  document.getElementById('logoText').addEventListener('input', updatePreview);
  document.getElementById('tagline').addEventListener('input', updatePreview);
}

// Apply theme preset
function applyThemePreset(themeName) {
  const preset = THEME_PRESETS[themeName];
  if (!preset) return;

  document.getElementById('primaryColor').value = preset.primary;
  document.getElementById('primaryColorText').value = preset.primary;
  document.getElementById('secondaryColor').value = preset.secondary;
  document.getElementById('secondaryColorText').value = preset.secondary;

  updatePreview();
}

// Update live preview
function updatePreview() {
  // Update header colors
  const primaryColor = document.getElementById('primaryColor').value;
  const secondaryColor = document.getElementById('secondaryColor').value;
  const previewHeader = document.getElementById('previewHeader');
  previewHeader.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

  // Update logo text
  const logoText = document.getElementById('logoText').value || 'PropDeals';
  document.getElementById('previewLogo').textContent = logoText;

  // Update tagline
  const tagline = document.getElementById('tagline').value || 'Save on prop firms';
  document.getElementById('previewTagline').textContent = tagline;

  // Update extension name
  const extName = document.getElementById('extensionName').value || 'PropDeals';
  document.getElementById('previewExtName').textContent = extName;

  // Update partner name
  const partnerName = document.getElementById('partnerName').value || '-';
  document.getElementById('previewPartner').textContent = partnerName;

  // Update enabled firms count and preview
  const enabledFirms = getEnabledFirms();
  document.getElementById('previewFirmCount').textContent = enabledFirms.length;

  // Update preview deals
  const previewDeals = document.getElementById('previewDeals');
  previewDeals.innerHTML = '';

  if (enabledFirms.length === 0) {
    previewDeals.innerHTML = '<p style="color:#6B7280;text-align:center;padding:20px;">No firms selected</p>';
  } else {
    enabledFirms.slice(0, 3).forEach(firm => {
      const firmData = AVAILABLE_FIRMS.find(f => f.id === firm.firm_id);
      const discount = firm.custom_discount?.amount || firmData.default_discount;

      const deal = document.createElement('div');
      deal.className = 'preview-deal';
      deal.innerHTML = `
        <div class="preview-firm-name">${firmData.name}</div>
        <span class="preview-badge" style="background:${primaryColor};">${discount}% OFF</span>
      `;
      previewDeals.appendChild(deal);
    });

    if (enabledFirms.length > 3) {
      const more = document.createElement('p');
      more.style.cssText = 'text-align:center;color:#6B7280;font-size:12px;margin-top:10px;';
      more.textContent = `+${enabledFirms.length - 3} more firms`;
      previewDeals.appendChild(more);
    }
  }
}

// Get enabled firms from form
function getEnabledFirms() {
  const firms = [];

  AVAILABLE_FIRMS.forEach(firm => {
    const checkbox = document.querySelector(`#firm-${firm.id} input[type="checkbox"]`);
    if (checkbox && checkbox.checked) {
      const code = document.getElementById(`code-${firm.id}`).value;
      const url = document.getElementById(`url-${firm.id}`).value;
      const customDiscount = document.getElementById(`discount-${firm.id}`).value;

      const firmConfig = {
        firm_id: firm.id,
        enabled: true
      };

      if (code) firmConfig.affiliate_code = code;
      if (url) firmConfig.affiliate_url = url;
      if (customDiscount) {
        firmConfig.custom_discount = {
          amount: parseInt(customDiscount),
          description: `${customDiscount}% off`,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
        };
      }

      firms.push(firmConfig);
    } else {
      firms.push({
        firm_id: firm.id,
        enabled: false
      });
    }
  });

  return firms.filter(f => f.enabled);
}

// Generate configuration object
function generateConfigObject() {
  const enabledFirms = getEnabledFirms();

  // Add disabled firms
  const allFirms = [...enabledFirms];
  AVAILABLE_FIRMS.forEach(firm => {
    if (!enabledFirms.find(f => f.firm_id === firm.id)) {
      allFirms.push({
        firm_id: firm.id,
        enabled: false
      });
    }
  });

  const config = {
    partner: {
      id: document.getElementById('partnerId').value || 'partner',
      name: document.getElementById('partnerName').value || 'Partner Name',
      email: document.getElementById('partnerEmail').value || 'support@partner.com',
      website: document.getElementById('partnerWebsite').value || undefined
    },
    extension: {
      name: document.getElementById('extensionName').value || 'PropDeals',
      short_name: document.getElementById('extensionShortName').value || 'PropDeals',
      description: document.getElementById('extensionDescription').value || 'Prop firm discount finder',
      version: '1.0.0'
    },
    branding: {
      theme_name: document.getElementById('themeName').value,
      primary_color: document.getElementById('primaryColor').value,
      secondary_color: document.getElementById('secondaryColor').value,
      accent_color: document.getElementById('secondaryColor').value,
      logo_text: document.getElementById('logoText').value || 'PropDeals',
      tagline: document.getElementById('tagline').value || 'Save on prop firms'
    },
    firms: allFirms,
    customization: {
      welcome_message: document.getElementById('welcomeMessage').value || undefined,
      footer_text: document.getElementById('footerText').value || undefined,
      show_partner_branding: true,
      custom_features: {
        notifications_default: true,
        show_expiration_countdown: true
      }
    },
    monetization: {
      model: 'revenue_share',
      platform_share: 0.30,
      partner_share: 0.70
    },
    generated: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      build_version: '1.0.0'
    }
  };

  // Remove undefined values
  Object.keys(config.partner).forEach(key => {
    if (config.partner[key] === undefined) delete config.partner[key];
  });

  Object.keys(config.customization).forEach(key => {
    if (config.customization[key] === undefined) delete config.customization[key];
  });

  return config;
}

// Generate and download config
function generateConfig() {
  const config = generateConfigObject();
  const json = JSON.stringify(config, null, 2);

  // Show in output
  const output = document.getElementById('jsonOutput');
  output.textContent = json;
  output.style.display = 'block';

  // Download file
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.partner.id}-config.json`;
  a.click();
  URL.revokeObjectURL(url);

  // Scroll to output
  output.scrollIntoView({ behavior: 'smooth' });
}

// Copy config to clipboard
async function copyConfig() {
  const config = generateConfigObject();
  const json = JSON.stringify(config, null, 2);

  try {
    await navigator.clipboard.writeText(json);
    alert('✓ Configuration copied to clipboard!');
  } catch (err) {
    // Fallback
    const output = document.getElementById('jsonOutput');
    output.textContent = json;
    output.style.display = 'block';
    output.scrollIntoView({ behavior: 'smooth' });
  }
}

// Load example configuration
function loadExample() {
  // Load Trade With John example
  document.getElementById('partnerId').value = 'tradewithJohn';
  document.getElementById('partnerName').value = 'Trade With John';
  document.getElementById('partnerEmail').value = 'support@tradewithJohn.com';
  document.getElementById('partnerWebsite').value = 'https://tradewithJohn.com';

  document.getElementById('extensionName').value = 'TradeDeals by John';
  document.getElementById('extensionShortName').value = 'TradeDeals';
  document.getElementById('extensionDescription').value = "John's exclusive prop firm discount finder";

  document.getElementById('themeName').value = 'Trading Blue';
  applyThemePreset('Trading Blue');

  document.getElementById('logoText').value = 'TradeDeals';
  document.getElementById('tagline').value = 'Save on prop firms with John';

  document.getElementById('welcomeMessage').value = 'Welcome to TradeDeals! Thanks for supporting my channel.';
  document.getElementById('footerText').value = 'Made with ❤️ by John';

  // Enable first 3 firms
  ['ftmo', 'apex', 'topstep'].forEach((firmId, index) => {
    const checkbox = document.querySelector(`#firm-${firmId} input[type="checkbox"]`);
    checkbox.checked = true;
    toggleFirm(firmId, true);

    document.getElementById(`code-${firmId}`).value = `JOHN${index === 0 ? '15' : index === 1 ? '10' : '20'}`;
    document.getElementById(`url-${firmId}`).value = `https://www.${firmId}.com/?ref=tradewithJohn`;
  });

  updatePreview();

  alert('✓ Example configuration loaded! Customize it and download.');
}

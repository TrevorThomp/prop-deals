#!/usr/bin/env node

/**
 * PropDeals White Label Extension Builder
 *
 * Generates a custom-branded extension from a partner configuration file.
 *
 * Usage:
 *   node build-extension.js <config.json>
 *   node build-extension.js examples/tradewith-john.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TEMPLATE_DIR = path.join(__dirname, '../../extension');
const OUTPUT_BASE_DIR = path.join(__dirname, '../partners');

/**
 * Main build function
 */
async function buildExtension(configPath) {
  console.log('🚀 PropDeals White Label Builder\n');

  // Load and validate configuration
  console.log('📄 Loading configuration...');
  const config = loadConfig(configPath);

  if (!validateConfig(config)) {
    console.error('❌ Configuration validation failed');
    process.exit(1);
  }

  console.log(`✓ Configuration loaded for: ${config.partner.name}\n`);

  // Create output directory
  const outputDir = path.join(OUTPUT_BASE_DIR, config.partner.id, 'extension');
  console.log(`📁 Creating output directory: ${outputDir}`);
  createDirectory(outputDir);

  // Copy template files
  console.log('\n📋 Copying template files...');
  copyTemplateFiles(TEMPLATE_DIR, outputDir);

  // Process templates with partner config
  console.log('\n🎨 Applying customizations...');
  processManifest(outputDir, config);
  processHTML(outputDir, config);
  processCSS(outputDir, config);
  processDiscounts(outputDir, config);

  // Generate icons (if custom colors)
  console.log('\n🎨 Generating icons with brand colors...');
  generateIcons(outputDir, config);

  // Create README
  console.log('\n📝 Creating partner README...');
  createPartnerReadme(outputDir, config);

  // Create ZIP package
  console.log('\n📦 Creating ZIP package...');
  const zipPath = createZipPackage(outputDir, config);

  // Success summary
  console.log('\n✅ Extension built successfully!\n');
  console.log('📊 Summary:');
  console.log(`   Partner: ${config.partner.name}`);
  console.log(`   Extension: ${config.extension.name}`);
  console.log(`   Version: ${config.extension.version}`);
  console.log(`   Firms: ${config.firms.filter(f => f.enabled).length} enabled`);
  console.log(`   Output: ${outputDir}`);
  console.log(`   Package: ${zipPath}`);
  console.log('\n📖 Next steps:');
  console.log(`   1. Test extension: Load ${outputDir} in Chrome`);
  console.log(`   2. Submit to Chrome Web Store: Upload ${zipPath}`);
  console.log(`   3. Share with partner: ${config.partner.name}\n`);
}

/**
 * Load configuration file
 */
function loadConfig(configPath) {
  try {
    const absolutePath = path.resolve(configPath);
    const configData = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`❌ Failed to load config: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Validate configuration
 */
function validateConfig(config) {
  const required = ['partner', 'extension', 'branding', 'firms'];

  for (const field of required) {
    if (!config[field]) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }

  if (!config.partner.id || !config.partner.name) {
    console.error('❌ Partner ID and name are required');
    return false;
  }

  if (!config.extension.name || !config.extension.description) {
    console.error('❌ Extension name and description are required');
    return false;
  }

  const enabledFirms = config.firms.filter(f => f.enabled);
  if (enabledFirms.length === 0) {
    console.error('❌ At least one firm must be enabled');
    return false;
  }

  return true;
}

/**
 * Create directory recursively
 */
function createDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy template files
 */
function copyTemplateFiles(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip certain files/folders
    if (shouldSkip(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      createDirectory(destPath);
      copyTemplateFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`   ✓ ${entry.name}`);
    }
  }
}

/**
 * Check if file/folder should be skipped
 */
function shouldSkip(name) {
  const skipList = [
    '.git',
    'node_modules',
    '.DS_Store',
    'generate_icons.py',
    'README.md',
    'SETUP.md',
    'PROJECT_SUMMARY.md',
    'DISCOUNT_UPDATE_STRATEGY.md'
  ];
  return skipList.includes(name);
}

/**
 * Process manifest.json with partner config
 */
function processManifest(outputDir, config) {
  const manifestPath = path.join(outputDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Update with partner info
  manifest.name = config.extension.name;
  manifest.short_name = config.extension.short_name || config.extension.name;
  manifest.description = config.extension.description;
  manifest.version = config.extension.version;
  manifest.author = config.partner.name;

  // Update homepage URL if provided
  if (config.partner.website) {
    manifest.homepage_url = config.partner.website;
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('   ✓ manifest.json updated');
}

/**
 * Process HTML files with partner config
 */
function processHTML(outputDir, config) {
  const htmlFiles = ['pages/popup.html', 'pages/settings.html'];

  for (const file of htmlFiles) {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace placeholders
    content = content.replace(/PropDeals/g, config.branding.logo_text || config.extension.short_name);
    content = content.replace(/Save on prop firm evaluations/g, config.branding.tagline);

    // Update footer if custom
    if (config.customization && config.customization.footer_text) {
      content = content.replace(/We earn affiliate commissions at no cost to you/g,
        config.customization.footer_text);
    }

    // Add partner branding
    if (config.customization && config.customization.show_partner_branding) {
      content = content.replace(/<\/footer>/g,
        `<p style="font-size:10px;opacity:0.7;margin-top:8px;">Powered by ${config.partner.name}</p></footer>`);
    }

    fs.writeFileSync(filePath, content);
    console.log(`   ✓ ${file} updated`);
  }
}

/**
 * Process CSS files with brand colors
 */
function processCSS(outputDir, config) {
  const cssFiles = ['styles/popup.css', 'styles/settings.css'];
  const colors = config.branding;

  for (const file of cssFiles) {
    const filePath = path.join(outputDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace color variables
    content = content.replace(/#10B981/g, colors.primary_color);

    if (colors.secondary_color) {
      content = content.replace(/#065F46/g, colors.secondary_color);
    }

    if (colors.accent_color) {
      content = content.replace(/#34D399/g, colors.accent_color);
    }

    fs.writeFileSync(filePath, content);
    console.log(`   ✓ ${file} updated with brand colors`);
  }
}

/**
 * Process discounts.json with partner's firms
 */
function processDiscounts(outputDir, config) {
  const discountsPath = path.join(outputDir, 'data/discounts.json');
  const discounts = JSON.parse(fs.readFileSync(discountsPath, 'utf8'));

  // Filter to only enabled firms
  const enabledFirms = config.firms.filter(f => f.enabled);

  // Update firm data with partner's codes
  discounts.firms = discounts.firms.filter(firm => {
    const partnerFirm = enabledFirms.find(f => f.firm_id === firm.id);

    if (!partnerFirm) return false; // Exclude disabled firms

    // Update with partner's affiliate info
    if (partnerFirm.affiliate_code) {
      firm.affiliate_code = partnerFirm.affiliate_code;
    }
    if (partnerFirm.affiliate_url) {
      firm.affiliate_url = partnerFirm.affiliate_url;
    }

    // Override discount if partner has custom deal
    if (partnerFirm.custom_discount) {
      firm.discount = {
        ...firm.discount,
        ...partnerFirm.custom_discount
      };
    }

    return true;
  });

  // Update version and timestamp
  discounts.version = config.extension.version;
  discounts.updated_at = new Date().toISOString();
  discounts.partner_id = config.partner.id;

  fs.writeFileSync(discountsPath, JSON.stringify(discounts, null, 2));
  console.log(`   ✓ discounts.json updated (${discounts.firms.length} firms)`);
}

/**
 * Generate icons with brand colors
 */
function generateIcons(outputDir, config) {
  // Check if Python script exists
  const pythonScript = path.join(TEMPLATE_DIR, 'generate_icons.py');

  if (!fs.existsSync(pythonScript)) {
    console.log('   ⚠ Icon generator not found, using template icons');
    return;
  }

  // For now, just copy template icons
  // TODO: Implement dynamic icon generation with brand colors
  console.log('   ✓ Icons copied (using template colors)');
  console.log('   💡 Tip: Customize icons manually or use icon generator');
}

/**
 * Create partner-specific README
 */
function createPartnerReadme(outputDir, config) {
  const readme = `# ${config.extension.name}

**Partner:** ${config.partner.name}
**Version:** ${config.extension.version}
**Built:** ${new Date().toISOString()}

## About This Extension

${config.extension.description}

## Supported Prop Firms

${config.firms.filter(f => f.enabled).map(f => `- ${f.firm_id.toUpperCase()}`).join('\n')}

## Installation for Testing

1. Open Chrome and go to \`chrome://extensions/\`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this folder

## Customization Applied

- **Theme:** ${config.branding.theme_name}
- **Primary Color:** ${config.branding.primary_color}
- **Logo Text:** ${config.branding.logo_text}
- **Tagline:** ${config.branding.tagline}

## Support

Partner Website: ${config.partner.website || 'N/A'}
Partner Email: ${config.partner.email}

---

Built with PropDeals White Label Platform
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  console.log('   ✓ README.md created');
}

/**
 * Create ZIP package
 */
function createZipPackage(outputDir, config) {
  const archiver = require('archiver');
  const output = fs.createWriteStream(
    path.join(path.dirname(outputDir), `${config.partner.id}-extension-v${config.extension.version}.zip`)
  );
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      resolve(output.path);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();
  });
}

// CLI Entry Point
if (require.main === module) {
  const configPath = process.argv[2];

  if (!configPath) {
    console.error('Usage: node build-extension.js <config.json>');
    console.error('Example: node build-extension.js examples/tradewith-john.json');
    process.exit(1);
  }

  buildExtension(configPath).catch(error => {
    console.error(`\n❌ Build failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { buildExtension };

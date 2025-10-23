# Privacy Policy for PropDeals

**Last Updated: October 23, 2025**

## Introduction

PropDeals ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Chrome extension handles information.

## TL;DR (Short Version)

**We collect ZERO personal data.** Your privacy is our priority.

- ✅ No tracking
- ✅ No analytics
- ✅ No personal information collected
- ✅ No data sold to third parties
- ✅ Settings stored locally only

## Information We Do NOT Collect

We want to be crystal clear about what we DON'T collect:

- ❌ Browsing history
- ❌ Personal information (name, email, etc.)
- ❌ Credit card or payment information
- ❌ Search queries
- ❌ Location data
- ❌ Device identifiers
- ❌ IP addresses
- ❌ Cookies (we don't set any)

## Information We DO Store (Locally Only)

The extension stores minimal data **locally on your device only**:

1. **Notification Preferences**
   - Whether you want discount alerts (on/off)
   - Stored in: Chrome's `chrome.storage.sync` API
   - Synced: Across your Chrome browsers (if you're signed in to Chrome)
   - Never sent to our servers

2. **Discount Database Version**
   - Current version number of discounts database
   - Used to detect when new deals are available
   - Stored locally, never transmitted

3. **Seen Deals List**
   - List of discount codes you've already been notified about
   - Prevents duplicate notifications
   - Stored locally, never transmitted

**None of this data ever leaves your device or is sent to us.**

## How the Extension Works

### Automatic Code Application

When you visit a supported prop firm's checkout page:

1. The content script detects you're on a checkout page (via URL matching)
2. It finds the discount code input field
3. It fills in the affiliate code from our local database
4. It shows you a success notification

**No data is sent to our servers during this process.**

### Discount Updates

Once per day, the extension checks if there are new discounts:

1. The background script reads the local `discounts.json` file
2. It compares the version number with what's stored
3. If there's a new version, it notifies you

**No data is sent to our servers during this process.**

### Affiliate Links

When you click "Get Deal" buttons:

1. You're redirected to the prop firm's website
2. The URL includes affiliate tracking parameters (e.g., `?ref=propdeals`)
3. The prop firm (not us) may set cookies for attribution

**We use standard affiliate links. The prop firm may track this, but we do not.**

## Permissions Explained

The extension requests the following Chrome permissions:

### `storage`
**Why**: To save your notification preferences locally
**Access**: Your device only, never transmitted

### `notifications`
**Why**: To show you browser notifications for new deals
**Access**: Chrome notifications API (local)

### `activeTab`
**Why**: To access checkout pages and apply discount codes
**Access**: Only on supported prop firm websites, only when you visit them

### `alarms`
**Why**: To schedule daily checks for discount updates
**Access**: Chrome alarms API (local)

### `host_permissions`
**Why**: To run content scripts on prop firm checkout pages
**Access**: Only these domains:
- ftmo.com
- apextraderfunding.com
- topstepfx.com
- myfundedfutures.com
- the5ers.com

**We only access these sites to apply discount codes. We don't track your activity.**

## Third-Party Services

### Affiliate Programs

PropDeals earns commissions through affiliate programs with prop firms. When you:

1. Click a "Get Deal" link in the popup, OR
2. Make a purchase after we apply a discount code

The prop firm may track this for attribution purposes. Each firm has their own privacy policy:

- FTMO Privacy Policy: https://www.ftmo.com/privacy-policy
- Apex Privacy Policy: https://www.apextraderfunding.com/privacy-policy
- TopStep Privacy Policy: https://www.topstepfx.com/privacy-policy
- MyFundedFutures Privacy Policy: https://www.myfundedfutures.com/privacy-policy
- The5ers Privacy Policy: https://www.the5ers.com/privacy-policy

**We do not control or have access to their tracking.**

## Data Security

Since we don't collect data, there's no data to secure! Your preferences are stored locally using Chrome's encrypted storage APIs.

## Children's Privacy

PropDeals is not directed at children under 13. We do not knowingly collect information from children (but again, we don't collect information from anyone).

## Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by:

1. Updating the "Last Updated" date at the top
2. Posting a notice in the extension
3. Requiring you to accept the new policy

Continued use of the extension after changes constitutes acceptance.

## Your Rights

Since we don't collect your data, there's nothing to:

- Delete (you can just uninstall the extension)
- Export (no data exists)
- Correct (no data exists)
- Opt out of (no tracking exists)

You can uninstall the extension at any time by:
1. Visiting `chrome://extensions/`
2. Finding PropDeals
3. Clicking "Remove"

All local data will be deleted automatically.

## Open Source

PropDeals is open source! You can review the code yourself:

- GitHub: https://github.com/yourusername/propdeals
- Verify we're not collecting data
- Audit the code yourself
- Contribute improvements

## Contact Us

If you have questions about this privacy policy:

- **Email**: privacy@propdeals.com
- **GitHub Issues**: https://github.com/yourusername/propdeals/issues
- **Website**: https://propdeals.com

## Legal Compliance

PropDeals complies with:

- **GDPR** (General Data Protection Regulation) - EU
- **CCPA** (California Consumer Privacy Act) - California, USA
- **Chrome Web Store Developer Program Policies**

Since we collect no personal data, compliance is straightforward.

## Transparency Commitment

We believe in radical transparency:

1. ✅ Open source code
2. ✅ Clear affiliate disclosures
3. ✅ No hidden tracking
4. ✅ Simple, honest privacy policy
5. ✅ Community-driven development

If you ever find we're not living up to these standards, please contact us immediately.

---

**Summary**: We don't collect your data. We don't track you. We just help you save money on prop firm evaluations through affiliate discounts. That's it.

**Questions?** Read the FAQ or contact us at privacy@propdeals.com

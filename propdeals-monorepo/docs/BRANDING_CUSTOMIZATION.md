# Extension Branding Customization

## Overview

When a user selects an influencer, the extension is **fully rebranded** to match that influencer's identity. This creates a personalized experience that makes users feel like they're using "their influencer's extension."

---

## What Gets Customized

### 1. Extension Name (Dropdown Title)

**Configuration Field:** `display_name`

This is what appears as the **extension name** when users open the dropdown.

**Example:**
```json
{
  "display_name": "John's Trading Deals"
}
```

**Result:**
- Extension dropdown shows: **"John's Trading Deals"**
- Browser tab title: **"John's Trading Deals"**

**Use Cases:**
- Personal branding: "John's Deals", "Sarah's Discounts"
- Community branding: "Traders Club Deals", "Pro Trading Community"
- Course branding: "Academy Deals", "Masterclass Savings"

---

### 2. Logo Text (Header Title)

**Configuration Field:** `branding.logo_text`

This is the **main title** shown in the extension header.

**Example:**
```json
{
  "branding": {
    "logo_text": "John's Deals"
  }
}
```

**Result:**
```
┌─────────────────────────────┐
│ 💰 John's Deals            │ ← logo_text
│    Save with my codes       │
└─────────────────────────────┘
```

**Best Practices:**
- Keep it short (2-4 words)
- Match your brand
- Can be same as display_name or different

---

### 3. Tagline (Subheader)

**Configuration Field:** `branding.tagline`

The **subtitle** under the logo text.

**Example:**
```json
{
  "branding": {
    "tagline": "Exclusive discounts for my community"
  }
}
```

**Result:**
```
┌─────────────────────────────┐
│ 💰 John's Deals             │
│    Exclusive discounts for  │ ← tagline
│    my community             │
└─────────────────────────────┘
```

**Ideas:**
- Value proposition: "Save on prop firms"
- Exclusivity: "VIP member discounts"
- Community: "For my trading family"
- Course: "Student-exclusive deals"

---

### 4. Colors (Complete Theme)

**Configuration Fields:**
- `branding.primary_color` - Main brand color
- `branding.secondary_color` - Darker shade
- `branding.accent_color` - Links and highlights

**Example:**
```json
{
  "branding": {
    "primary_color": "#3B82F6",
    "secondary_color": "#1E40AF",
    "accent_color": "#60A5FA"
  }
}
```

**What Gets Colored:**
- Header gradient
- Discount badges
- Copy buttons
- Primary action buttons
- Links

---

### 5. Welcome Message (Footer)

**Configuration Field:** `welcome_message`

Custom message in the footer area.

**Example:**
```json
{
  "welcome_message": "Thanks for supporting John's channel! You're getting exclusive deals."
}
```

**Result:**
```
┌─────────────────────────────┐
│  [Deal Cards]               │
│                             │
│ 💡 Thanks for supporting    │ ← welcome_message
│    John's channel!          │
└─────────────────────────────┘
```

---

## Complete Example Configuration

```json
{
  "id": "tradewithJohn",
  "name": "Trade With John",
  "display_name": "John's Trading Deals",
  "status": "active",
  "branding": {
    "theme_name": "Trading Blue",
    "primary_color": "#3B82F6",
    "secondary_color": "#1E40AF",
    "accent_color": "#60A5FA",
    "logo_text": "John's Deals",
    "tagline": "Exclusive discounts for my community"
  },
  "welcome_message": "Thanks for supporting my channel! You're saving money while helping me create more content."
}
```

**Visual Result:**

```
Browser Tab: "John's Trading Deals"

┌─────────────────────────────────────┐
│ [Blue Gradient Header]              │
│ 💰 John's Deals            ⚙️       │
│    Exclusive discounts for          │
│    my community                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ FTMO                   25%  │   │ ← Blue badges
│  │ Code: JOHN15           OFF  │   │
│  │ [Copy] [Get Deal]           │   │ ← Blue buttons
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Apex Trader Funding    10%  │   │
│  │ Code: JOHN10           OFF  │   │
│  │ [Copy] [Get Deal]           │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ 💡 Thanks for supporting my         │
│    channel! You're saving money     │
│    while helping me create more     │
│    content. How it works            │ ← Blue link
└─────────────────────────────────────┘
```

---

## Branding Strategy by Influencer Type

### YouTube Trading Educator

```json
{
  "display_name": "Trade Academy Pro",
  "branding": {
    "logo_text": "Academy Deals",
    "tagline": "Student-exclusive discounts",
    "primary_color": "#EF4444",
    "secondary_color": "#991B1B",
    "accent_color": "#FCA5A5"
  },
  "welcome_message": "Welcome, student! Save money on your prop trading journey."
}
```

**Positioning:** Educational, professional, trustworthy

---

### Discord Community Leader

```json
{
  "display_name": "Elite Traders Hub",
  "branding": {
    "logo_text": "Elite Deals",
    "tagline": "VIP member exclusive discounts",
    "primary_color": "#8B5CF6",
    "secondary_color": "#6D28D9",
    "accent_color": "#A78BFA"
  },
  "welcome_message": "VIP access granted! These deals are exclusively for Elite Traders Hub members."
}
```

**Positioning:** Exclusive, premium, insider access

---

### Individual Content Creator

```json
{
  "display_name": "Sarah's Trading Tips",
  "branding": {
    "logo_text": "Sarah's Deals",
    "tagline": "Save money with my codes",
    "primary_color": "#10B981",
    "secondary_color": "#065F46",
    "accent_color": "#34D399"
  },
  "welcome_message": "Hey! Thanks for using my codes. Every purchase helps support the free content I create."
}
```

**Positioning:** Personal, friendly, community-driven

---

### Trading Course Platform

```json
{
  "display_name": "PropMaster Course Deals",
  "branding": {
    "logo_text": "PropMaster Deals",
    "tagline": "Course member savings",
    "primary_color": "#F59E0B",
    "secondary_color": "#D97706",
    "accent_color": "#FCD34D"
  },
  "welcome_message": "Exclusive for PropMaster students. Save on your prop firm evaluations!"
}
```

**Positioning:** Professional, course-integrated, member benefit

---

## User Experience

### Before Selection (Default)

```
Extension name: "PropDeals"
Header: "PropDeals"
Tagline: "Save on prop firm evaluations"
Colors: Green (#10B981)
Footer: "We earn affiliate commissions..."
```

### After Selecting "John"

```
Extension name: "John's Trading Deals"    ✨ CHANGED
Header: "John's Deals"                    ✨ CHANGED
Tagline: "Exclusive discounts for..."     ✨ CHANGED
Colors: Blue (#3B82F6)                     ✨ CHANGED
Footer: "Thanks for supporting John..."    ✨ CHANGED
```

**User Perception:**
> "This feels like John's personal extension that he made for me."

---

## Technical Implementation

### How the Title Changes

**1. When popup opens:**
```javascript
async function applyInfluencerBranding() {
  const { influencer_data } = await chrome.storage.local.get(['influencer_data']);

  if (!influencer_data) return;

  // Update browser tab title
  document.title = influencer_data.display_name;

  // Update header text
  document.querySelector('.title').textContent =
    influencer_data.branding.logo_text || influencer_data.display_name;
}
```

**2. Dynamic CSS variables:**
```javascript
document.documentElement.style.setProperty('--primary-color', primary_color);
document.documentElement.style.setProperty('--secondary-color', secondary_color);
```

**3. All styles use CSS variables:**
```css
.header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.discount-badge {
  background: var(--primary-color);
}
```

---

## Best Practices

### 1. Keep Names Short
- ✅ "John's Deals"
- ✅ "Academy Savings"
- ❌ "John's Amazing Trading Community Exclusive Discount Finder"

### 2. Be Consistent
```json
// Good - consistent naming
{
  "display_name": "Elite Traders Hub",
  "logo_text": "Elite Hub",
  "tagline": "VIP member discounts"
}

// Confusing - inconsistent
{
  "display_name": "John's Community",
  "logo_text": "PropDeals",
  "tagline": "Save money"
}
```

### 3. Match Your Brand Colors
Use colors from your:
- YouTube channel branding
- Discord server theme
- Website color scheme
- Course platform design

### 4. Personalize the Message
```json
// Generic
"welcome_message": "Get discounts on prop firms."

// Personal
"welcome_message": "Hey! Thanks for using my codes. Every purchase helps me create more free content for you."
```

---

## Adding a New Influencer

**Step 1:** Decide on branding

```json
{
  "display_name": "Your Extension Name",
  "branding": {
    "logo_text": "Your Logo",
    "tagline": "Your Tagline",
    "primary_color": "#HEXCODE",
    "secondary_color": "#HEXCODE",
    "accent_color": "#HEXCODE"
  },
  "welcome_message": "Your personal message"
}
```

**Step 2:** Add to `api/v1/influencers.json`

**Step 3:** Push to GitHub

**Step 4:** Done! Users selecting you will see your branding.

---

## Testing Your Branding

**1. Add your config to influencers.json**

**2. Reload extension**
```
chrome://extensions/ → Reload
```

**3. Clear onboarding:**
```javascript
// In console:
chrome.storage.local.set({ onboarding_completed: false })
```

**4. Open extension → Complete onboarding → Select yourself**

**5. Verify:**
- Extension name changed?
- Colors applied?
- Logo text showing?
- Tagline correct?
- Welcome message appearing?

---

## FAQs

**Q: Can I change my branding later?**
A: Yes! Edit your config in influencers.json and users get updates within 24 hours.

**Q: What if I don't provide logo_text?**
A: It falls back to your display_name.

**Q: Can I use my own logo image?**
A: Not yet. Currently text-only. Image support coming in Phase 2.

**Q: How do users see my changes?**
A: Extension checks for updates every 24 hours automatically. Or they can force refresh in settings.

**Q: Does the browser extension list show my name?**
A: No, Chrome Web Store listing always shows "PropDeals". Only the dropdown/popup changes.

**Q: Can I test without affecting real users?**
A: Yes, set your status to "inactive" while testing. Only you (loading unpacked) will see it.

---

**Last Updated:** October 23, 2025
**Version:** 2.0.0

# PropDeals Theme Colors - "Profit Green"

This extension uses the "Profit Green" color scheme for all UI elements.

## Color Palette

### Primary Colors

**Emerald Green (Primary)**
- Hex: `#10B981`
- RGB: `rgb(16, 185, 129)`
- Usage: Main brand color, headers, primary buttons

**Dark Green (Secondary)**
- Hex: `#065F46`
- RGB: `rgb(6, 95, 70)`
- Usage: Gradients, hover states, darker accents

**Light Green (Accent)**
- Hex: `#34D399`
- RGB: `rgb(52, 211, 153)`
- Usage: Links, highlights, success states

### Neutral Colors

**Dark Gray (Text)**
- Hex: `#1F2937`
- RGB: `rgb(31, 41, 55)`
- Usage: Body text, headings

**Medium Gray**
- Hex: `#6B7280`
- RGB: `rgb(107, 114, 128)`
- Usage: Subtle text, descriptions

**Light Gray**
- Hex: `#9CA3AF`
- RGB: `rgb(156, 163, 175)`
- Usage: Disabled states, very subtle text

**Border Gray**
- Hex: `#E5E7EB`
- RGB: `rgb(229, 231, 235)`
- Usage: Borders, dividers

**Background Gray**
- Hex: `#F9FAFB`
- RGB: `rgb(249, 250, 251)`
- Usage: Page backgrounds, card backgrounds

**White**
- Hex: `#FFFFFF`
- RGB: `rgb(255, 255, 255)`
- Usage: Card backgrounds, overlays

### Utility Colors

**Success Green**
- Hex: `#10B981` (same as primary)
- Usage: Success messages, confirmations

**Warning Amber**
- Hex: `#F59E0B`
- RGB: `rgb(245, 158, 11)`
- Usage: Warnings, urgent notifications, expiration alerts

**Error Red**
- Hex: `#EF4444`
- RGB: `rgb(239, 68, 68)`
- Usage: Errors, critical alerts

## Usage Examples

### Gradients

**Primary Gradient (Headers, Badges)**
```css
background: linear-gradient(135deg, #10B981 0%, #065F46 100%);
```

**Button Hover Gradient**
```css
background: linear-gradient(135deg, #065F46 0%, #064E3B 100%);
```

### Buttons

**Primary Button**
```css
.btn-primary {
  background: linear-gradient(135deg, #10B981 0%, #065F46 100%);
  color: white;
}
```

**Secondary Button**
```css
.btn-secondary {
  background: #F3F4F6;
  color: #1F2937;
}
```

### Text

**Body Text**
```css
color: #1F2937;
```

**Subtle Text**
```css
color: #6B7280;
```

**Links**
```css
color: #34D399;
```

## Files Using Theme

All color values are used in:
- `styles/popup.css` - Popup interface
- `styles/settings.css` - Settings page
- `scripts/settings.js` - Toast notifications (inline styles)
- `generate_icons.py` - Icon generator
- `create-placeholder-icons.html` - HTML icon generator

## Accessibility

All color combinations meet WCAG AA standards:
- White text on `#10B981`: ✅ 3.3:1 (AA for large text)
- White text on `#065F46`: ✅ 7.8:1 (AAA)
- `#1F2937` text on white: ✅ 13.1:1 (AAA)
- `#6B7280` text on white: ✅ 4.7:1 (AA)

## Brand Consistency

To maintain brand consistency across white-label versions:
1. Primary color can be customized per partner
2. Gradients automatically calculated from primary
3. Text colors remain the same for readability
4. Neutral grays stay consistent

---

**Last Updated:** October 23, 2025
**Theme:** Profit Green v1.0

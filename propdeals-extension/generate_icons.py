#!/usr/bin/env python3
"""
Simple script to generate placeholder icons for PropDeals extension
Requires: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create a simple gradient icon with 'PD' text"""

    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='#10B981')
    draw = ImageDraw.Draw(img)

    # Draw gradient from #10B981 to #065F46 (Profit Green theme)
    for y in range(size):
        r = int(16 + (6 - 16) * y / size)
        g = int(185 + (95 - 185) * y / size)
        b = int(129 + (70 - 129) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    # Add rounded corners
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(size * 0.2)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)

    # Apply mask
    img.putalpha(mask)

    # Add text
    try:
        # Try to use a nice font
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    text = "PD" if size >= 48 else "$"

    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Center text
    x = (size - text_width) // 2 - bbox[0]
    y = (size - text_height) // 2 - bbox[1]

    # Draw text with shadow for better visibility
    draw.text((x + 2, y + 2), text, fill=(0, 0, 0, 100), font=font)  # shadow
    draw.text((x, y), text, fill='white', font=font)

    # Save
    img.save(output_path, 'PNG')
    print(f"[OK] Created {output_path}")

def main():
    # Create icons directory if it doesn't exist
    icons_dir = 'icons'
    os.makedirs(icons_dir, exist_ok=True)

    # Generate all required sizes
    sizes = [16, 32, 48, 128]

    print("Generating PropDeals icons...")
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)

    print("\n[SUCCESS] All icons generated successfully!")
    print(f"Icons saved to: {os.path.abspath(icons_dir)}")
    print("\nYou can now load the extension in Chrome:")
    print("1. Go to chrome://extensions/")
    print("2. Enable 'Developer mode'")
    print("3. Click 'Load unpacked'")
    print(f"4. Select folder: {os.path.abspath('.')}")

if __name__ == '__main__':
    main()

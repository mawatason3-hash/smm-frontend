#!/usr/bin/env python3
"""Generate PWA icons from the BOASTLIB logo."""

from PIL import Image, ImageDraw
import os
from pathlib import Path

def create_pwa_icon(source_logo_path, output_path, size, with_padding=False):
    """
    Create a PWA icon by scaling and potentially adding padding.
    
    Args:
        source_logo_path: Path to source logo
        output_path: Where to save the icon
        size: Output size (e.g., 192, 512)
        with_padding: If True, add 20% padding for maskable icons
    """
    try:
        # Open the source image
        img = Image.open(source_logo_path)
        
        # Convert to RGBA for consistent handling
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Create transparent background for web icons
        background = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        
        if with_padding:
            # For maskable icons: add 20% padding (safe zone is inner 80%)
            # So we scale logo to 80% of the final size
            logo_size = int(size * 0.8)
            padding = (size - logo_size) // 2
        else:
            # For regular icons: use 90% of space for better appearance
            logo_size = int(size * 0.9)
            padding = (size - logo_size) // 2
        
        # Resize the logo with high quality
        img_resized = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Paste onto transparent background
        background.paste(img_resized, (padding, padding), img_resized)
        
        # Save as PNG with transparency
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        background.save(output_path, 'PNG', quality=95)
        print(f"✓ Created {output_path}")
        
    except Exception as e:
        print(f"✗ Error creating {output_path}: {e}")
        raise

def create_apple_touch_icon(source_logo_path, output_path, size=180):
    """
    Create Apple touch icon with solid background (iOS ignores alpha).
    
    Args:
        source_logo_path: Path to source logo
        output_path: Where to save the icon
        size: Output size (typically 180x180)
    """
    try:
        # Open the source image
        img = Image.open(source_logo_path)
        
        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Create solid dark background (BOASTLIB dark: #0B0B1A)
        background = Image.new('RGB', (size, size), (11, 11, 26))
        
        # Use 85% of space for Apple icon
        logo_size = int(size * 0.85)
        padding = (size - logo_size) // 2
        
        # Resize the logo
        img_resized = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Convert logo to RGB if it has transparency
        if img_resized.mode == 'RGBA':
            # Create a temporary image with white background for paste
            logo_rgb = Image.new('RGB', img_resized.size, (255, 255, 255))
            logo_rgb.paste(img_resized, mask=img_resized.split()[3])
        else:
            logo_rgb = img_resized.convert('RGB')
        
        # Paste onto background
        background.paste(logo_rgb, (padding, padding))
        
        # Save as PNG (no transparency)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        background.save(output_path, 'PNG', quality=95)
        print(f"✓ Created {output_path}")
        
    except Exception as e:
        print(f"✗ Error creating {output_path}: {e}")
        raise

def main():
    """Generate all PWA icons."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    logo_path = project_root / 'public' / 'logo.png'
    icons_dir = project_root / 'public' / 'icons'
    
    if not logo_path.exists():
        print(f"Error: Logo not found at {logo_path}")
        return False
    
    print(f"Using logo: {logo_path}")
    print(f"Generating icons to: {icons_dir}\n")
    
    try:
        # Regular icons (with transparent background)
        create_pwa_icon(str(logo_path), str(icons_dir / 'icon-192x192.png'), 192, with_padding=False)
        create_pwa_icon(str(logo_path), str(icons_dir / 'icon-512x512.png'), 512, with_padding=False)
        
        # Maskable icons (with 20% padding for safe zone)
        create_pwa_icon(str(logo_path), str(icons_dir / 'icon-maskable-192x192.png'), 192, with_padding=True)
        create_pwa_icon(str(logo_path), str(icons_dir / 'icon-maskable-512x512.png'), 512, with_padding=True)
        
        # Apple touch icon (180x180, solid background, no transparency)
        create_apple_touch_icon(str(logo_path), str(icons_dir / 'apple-touch-icon.png'), size=180)
        
        print("\n✓ All PWA icons generated successfully!")
        print("\n⚠️  Important: PWA icons are cached aggressively by browsers.")
        print("   On previously installed PWAs, users will need to:")
        print("   1. Uninstall the app from their device")
        print("   2. Clear browser cache")
        print("   3. Reinstall the PWA to see the new icons")
        return True
        
    except Exception as e:
        print(f"\n✗ Failed to generate icons: {e}")
        return False

if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)

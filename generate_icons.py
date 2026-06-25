"""
GreenScan App Icon Generator
Creates a green leaf icon on light background matching our theme.
Run: python3 generate_icons.py
"""
from PIL import Image, ImageDraw
import os

ASSETS = os.path.join(os.path.dirname(__file__), "assets")

def leaf(draw, cx, cy, rw, rh, color, stem_len=0):
    """Draw an ellipse leaf with optional stem."""
    draw.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=color)
    if stem_len:
        draw.rectangle([cx - 3, cy, cx + 3, cy + stem_len], fill=color)

# Colors matching theme
BG = (248, 250, 240)
PRIMARY = (46, 158, 90)
WHITE = (252, 253, 244)

# ── icon.png (1024×1024) ──
img = Image.new("RGBA", (1024, 1024), BG)
d = ImageDraw.Draw(img)
leaf(d, 512, 480, 340, 420, PRIMARY, 120)
img.save(os.path.join(ASSETS, "icon.png"))
print("✓ icon.png")

# ── splash-icon.png (1284×2778) ──
img = Image.new("RGBA", (1284, 2778), BG)
d = ImageDraw.Draw(img)
leaf(d, 642, 1300, 380, 500, PRIMARY, 160)
img.save(os.path.join(ASSETS, "splash-icon.png"))
print("✓ splash-icon.png")

# ── favicon.png (48×48) ──
img = Image.new("RGBA", (48, 48), BG)
d = ImageDraw.Draw(img)
leaf(d, 24, 22, 16, 20, PRIMARY)
img.save(os.path.join(ASSETS, "favicon.png"))
print("✓ favicon.png")

# ── android-icon-foreground.png (108×108) ──
img = Image.new("RGBA", (108, 108), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
leaf(d, 54, 50, 32, 40, WHITE)
img.save(os.path.join(ASSETS, "android-icon-foreground.png"))
print("✓ android-icon-foreground.png")

# ── android-icon-background.png (108×108) ──
img = Image.new("RGBA", (108, 108), BG)
d = ImageDraw.Draw(img)
leaf(d, 54, 50, 32, 40, PRIMARY)
img.save(os.path.join(ASSETS, "android-icon-background.png"))
print("✓ android-icon-background.png")

# ── android-icon-monochrome.png (108×108) ──
img = Image.new("RGBA", (108, 108), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
leaf(d, 54, 50, 32, 40, (255, 255, 255))
img.save(os.path.join(ASSETS, "android-icon-monochrome.png"))
print("✓ android-icon-monochrome.png")

print("\n✅ All icons generated!")

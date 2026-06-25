"""Generate GreenScan app icons — a green leaf on light background."""
import struct, zlib

def create_png(width, height, bg, fg, leaf_color):
    """Minimal PNG generator without dependencies."""
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))  # RGB

    # Background
    raw = b""
    for y in range(height):
        raw += b"\x00"  # filter none
        for x in range(width):
            # Leaf shape — simple ellipse in center
            cx, cy = width // 2, height // 2
            rx, ry = width * 0.35, height * 0.45
            dx, dy = (x - cx) / rx, (y - cy) / ry
            in_leaf = dx*dx + dy*dy <= 1
            # Stem / leaf vein
            stem_w = width * 0.02
            in_stem = abs(x - cx) < stem_w and y > cy
            in_vein = abs(x - cx) < stem_w and y < cy and abs(y - cy) < height * 0.15

            if in_leaf or in_stem or in_vein:
                raw += bytes(leaf_color)
            else:
                raw += bytes(bg)

    idat = chunk(b"IDAT", zlib.compress(raw))
    iend = chunk(b"IEND", b"")
    return sig + ihdr + idat + iend

# Colors from our theme
BG = (248, 250, 240)        # Colors.background
FG = (46, 158, 90)          # Colors.primary
LEAF = (46, 158, 90)        # primary green
WHITE = (252, 253, 244)     # primary-foreground

# Generate icons
icons = {
    "icon.png": (1024, 1024),
    "splash-icon.png": (1284, 2778),
    "favicon.png": (48, 48),
    "android-icon-foreground.png": (108, 108),
    "android-icon-background.png": (108, 108),
}

for name, (w, h) in icons.items():
    bg = WHITE if "foreground" in name else BG
    fg = FG
    leaf = LEAF
    if "background" in name:
        png = create_png(w, h, BG, BG, LEAF)
    elif "foreground" in name:
        png = create_png(w, h, (0,0,0,0), (0,0,0,0), WHITE)  # transparent bg, white leaf
        # Actually just solid white bg with green leaf for foreground
        png = create_png(w, h, (0,0,0,0), (0,0,0,0), WHITE)
    elif "splash" in name:
        png = create_png(w, h, BG, BG, LEAF)
    elif "favicon" in name:
        png = create_png(w, h, BG, BG, LEAF)
    else:
        png = create_png(w, h, BG, BG, LEAF)

    path = f"/home/vasu/Downloads/greensprout-health-main/greensprout-mobile/assets/{name}"
    with open(path, "wb") as f:
        f.write(png)
    print(f"✓ {name} ({w}x{h})")

print("\nAll icons generated!")

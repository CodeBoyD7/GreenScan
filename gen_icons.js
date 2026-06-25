/**
 * GreenScan app icon generator — pure Node.js, zero dependencies.
 * Generates a green leaf icon as PNG files.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ASSETS = path.join(__dirname, "assets");

// ── Minimal PNG builder ──
function png(width, height, pixels) {
  // pixels: Array of [R,G,B,A] values, row-major
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    const typeBuf = Buffer.from(type, "ascii");
    const crcData = Buffer.concat([typeBuf, data]);
    let c = 0xffffffff;
    for (let i = 0; i < crcData.length; i++) {
      c ^= crcData[i];
      for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
    crc.writeUInt32BE((c ^ 0xffffffff) >>> 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  // Build raw pixel data (RGBA)
  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      raw.push(pixels[idx], pixels[idx + 1], pixels[idx + 2], pixels[idx + 3]);
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const compressed = zlib.deflateSync(Buffer.from(raw));
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdrData),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Draw a leaf shape ──
function makeIcon(w, h, bgColor, leafColor) {
  const px = [];
  const cx = w / 2, cy = h / 2;
  const rx = w * 0.32, ry = h * 0.42;
  const stemW = Math.max(2, w * 0.02);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const inLeaf = dx * dx + dy * dy <= 1;
      const inStem = Math.abs(x - cx) < stemW && y > cy && y < cy + h * 0.12;
      if (inLeaf || inStem) {
        px.push(...leafColor);
      } else {
        px.push(...bgColor);
      }
    }
  }
  return px;
}

// ── Colors ──
const BG = [248, 250, 240, 255];
const PRIMARY = [46, 158, 90, 255];
const WHITE = [252, 253, 244, 255];
const TRANSPARENT = [0, 0, 0, 0];

const icons = [
  { name: "icon.png", w: 1024, h: 1024, bg: BG, leaf: PRIMARY },
  { name: "splash-icon.png", w: 1284, h: 2778, bg: BG, leaf: PRIMARY },
  { name: "favicon.png", w: 48, h: 48, bg: BG, leaf: PRIMARY },
  { name: "android-icon-foreground.png", w: 108, h: 108, bg: TRANSPARENT, leaf: WHITE },
  { name: "android-icon-background.png", w: 108, h: 108, bg: BG, leaf: PRIMARY },
  { name: "android-icon-monochrome.png", w: 108, h: 108, bg: TRANSPARENT, leaf: [255, 255, 255, 255] },
];

for (const icon of icons) {
  const pixels = makeIcon(icon.w, icon.h, icon.bg, icon.leaf);
  const buf = png(icon.w, icon.h, pixels);
  fs.writeFileSync(path.join(ASSETS, icon.name), buf);
  console.log("✓", icon.name, `(${icon.w}×${icon.h})`);
}

console.log("\n✅ All icons generated!");

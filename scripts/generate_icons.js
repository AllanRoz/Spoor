import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // RGBA 8-bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rowLen * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function inRotatedEllipse(px, py, cx, cy, rx, ry, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const tx = px - cx;
  const ty = py - cy;
  const rxCoord = tx * cos + ty * sin;
  const ryCoord = -tx * sin + ty * cos;
  return (rxCoord * rxCoord) / (rx * rx) + (ryCoord * ryCoord) / (ry * ry) <= 1.0;
}

function getPixel(x, y, size, isMaskable) {
  let nx = (x / size) * 100;
  let ny = (y / size) * 100;

  // Dark forest background for Apple and Android icons
  const bg = [16, 33, 25, 255]; // #102119

  if (isMaskable) {
    nx = 50 + (nx - 50) / 0.72;
    ny = 50 + (ny - 50) / 0.72;
  }

  // 1. Central main pad
  const dxMain = nx - 50;
  const dyMain = ny - 64;
  const distMain = Math.sqrt(dxMain * dxMain + dyMain * dyMain * 1.25);
  const inMainPad = distMain <= 20;

  // 2. Four digital toe pads
  const inToe1 = inRotatedEllipse(nx, ny, 28, 35, 7.5, 12, -18);
  const inToe2 = inRotatedEllipse(nx, ny, 44, 25, 8, 13.5, -5);
  const inToe3 = inRotatedEllipse(nx, ny, 63, 26, 8, 13.5, 8);
  const inToe4 = inRotatedEllipse(nx, ny, 78, 37, 7, 11.5, 22);

  if (inMainPad || inToe1 || inToe2 || inToe3 || inToe4) {
    const factor = Math.max(0, Math.min(1, (ny - 20) / 65));
    const r = Math.round(245 - factor * 28); // 245 -> 217
    const g = Math.round(158 - factor * 39); // 158 -> 119
    const b = Math.round(11 - factor * 5);   // 11 -> 6
    return [r, g, b, 255];
  }

  return bg;
}

const sizes = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: true },
  { name: 'apple-touch-icon-152x152.png', size: 152, maskable: true },
  { name: 'apple-touch-icon-167x167.png', size: 167, maskable: true }
];

sizes.forEach(item => {
  const png = createPng(item.size, item.size, (x, y) => getPixel(x, y, item.size, item.maskable));
  const filePath = path.join(iconsDir, item.name);
  fs.writeFileSync(filePath, png);
  console.log(`✓ Generated ${item.name} (${item.size}x${item.size}, ${png.length} bytes)`);
});

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="24" fill="#102119"/>
  <circle cx="50" cy="65" r="20" fill="#d97706"/>
  <ellipse cx="28" cy="35" rx="7.5" ry="12" fill="#d97706" transform="rotate(-18 28 35)"/>
  <ellipse cx="44" cy="25" rx="8" ry="13.5" fill="#d97706" transform="rotate(-5 44 25)"/>
  <ellipse cx="63" cy="26" rx="8" ry="13.5" fill="#d97706" transform="rotate(8 63 26)"/>
  <ellipse cx="78" cy="37" rx="7" ry="11.5" fill="#d97706" transform="rotate(22 78 37)"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
console.log('✓ Generated vector SVG icons');

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcVal = crc32(crcData);
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

function generatePng(size) {
  const width = size;
  const height = size;

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  // Raw pixel buffer (1 byte filter per line + width * 4 bytes)
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowBytes));

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowBytes);
    rawData[rowOffset] = 0; // Filter 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + (x * 4);
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background rounded square / emerald gradient
      const cornerR = width * 0.22;
      const qx = Math.max(0, Math.abs(dx) - (width * 0.42 - cornerR));
      const qy = Math.max(0, Math.abs(dy) - (height * 0.42 - cornerR));
      const cornerDist = Math.sqrt(qx * qx + qy * qy);

      if (cornerDist > cornerR) {
        // Outside rounded rect
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      } else {
        // Gradient from top-left (#054e38) to bottom-right (#022c22)
        const t = (x + y) / (width + height);
        const r1 = 6, g1 = 95, b1 = 70; // #065F46
        const r2 = 2, g2 = 44, b2 = 34; // #022C22
        
        let r = Math.round(r1 + (r2 - r1) * t);
        let g = Math.round(g1 + (g2 - g1) * t);
        let b = Math.round(b1 + (b2 - b1) * t);

        // Gold / Cyan Leaf/Lotus in the center
        // Inner circle/leaf glow
        const innerDist = Math.sqrt((dx * 0.9) * (dx * 0.9) + (dy * 1.1) * (dy * 1.1));
        if (innerDist < width * 0.26) {
          // Leaf shape
          const leafFormula = Math.sin((dy / (width * 0.3)) * Math.PI);
          if (Math.abs(dx) < (width * 0.22) * (1 - Math.abs(dy) / (width * 0.28))) {
            // Bright Gold / Emerald leaf center
            r = Math.min(255, r + 45);
            g = Math.min(255, g + 140);
            b = Math.min(255, b + 90);
          }
        }

        // Inner glowing border
        if (cornerDist > cornerR - (width * 0.025)) {
          r = Math.min(255, r + 40);
          g = Math.min(255, g + 80);
          b = Math.min(255, b + 60);
        }

        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });

  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = writeChunk('IHDR', ihdr);
  const idatChunk = writeChunk('IDAT', compressedData);
  const iendChunk = writeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192, 512, and apple-touch-icon
const png192 = generatePng(192);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
console.log('Created icon-192.png');

const png512 = generatePng(512);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
console.log('Created icon-512.png');

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png192);
console.log('Created apple-touch-icon.png');

// Create favicon.svg
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#022C22"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="24" fill="url(#g)" stroke="#34D399" stroke-width="2"/>
  <path d="M50 18 C30 38 30 65 50 82 C70 65 70 38 50 18 Z" fill="url(#gold)" opacity="0.9"/>
  <circle cx="50" cy="50" r="12" fill="#FDE047" opacity="0.85"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);
console.log('Created favicon.svg');

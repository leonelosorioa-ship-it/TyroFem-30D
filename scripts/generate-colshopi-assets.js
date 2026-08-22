import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Exact ColShopi Tienda By Leps Digital Circular Neon Logo SVG
const colshopiLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgDarkGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020810"/>
      <stop offset="65%" stop-color="#010408"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>

    <!-- Intense Neon Cyan Glow Filter -->
    <filter id="neonRingGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur1"/>
      <feGaussianBlur stdDeviation="15" result="coloredBlur2"/>
      <feGaussianBlur stdDeviation="28" result="coloredBlur3"/>
      <feMerge>
        <feMergeNode in="coloredBlur3"/>
        <feMergeNode in="coloredBlur2"/>
        <feMergeNode in="coloredBlur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="neonTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="glow1"/>
      <feGaussianBlur stdDeviation="12" result="glow2"/>
      <feMerge>
        <feMergeNode in="glow2"/>
        <feMergeNode in="glow1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&amp;family=Montserrat:wght@700&amp;family=Dancing+Script:wght@700&amp;display=swap');
      
      .brand-title {
        font-family: 'Dancing Script', 'Caveat', cursive, sans-serif;
        font-weight: 700;
        fill: #00f0ff;
      }
      .brand-tienda {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        letter-spacing: 7px;
        fill: #ffffff;
        font-size: 26px;
      }
      .brand-leps {
        font-family: 'Dancing Script', 'Caveat', cursive, sans-serif;
        font-weight: 700;
        fill: #ffffff;
        font-size: 40px;
      }
    </style>
  </defs>

  <!-- Black Background Foundation -->
  <rect width="512" height="512" fill="#000000"/>
  <circle cx="256" cy="256" r="250" fill="url(#bgDarkGrad)"/>

  <!-- Subtle Cyan Ambient Room Reflection -->
  <circle cx="256" cy="256" r="235" fill="none" stroke="#00e5ff" stroke-width="2" opacity="0.2"/>
  <circle cx="256" cy="256" r="215" fill="#00e5ff" opacity="0.035"/>

  <!-- High-Intensity Outer Neon Circle -->
  <circle 
    cx="256" 
    cy="256" 
    r="222" 
    fill="none" 
    stroke="#00e5ff" 
    stroke-width="8" 
    filter="url(#neonRingGlow)"
  />
  <!-- Inner White Core of Neon Ring -->
  <circle 
    cx="256" 
    cy="256" 
    r="222" 
    fill="none" 
    stroke="#ffffff" 
    stroke-width="2.5" 
    opacity="0.95"
  />

  <!-- Main Cursive Title: Colshopi -->
  <g filter="url(#neonTextGlow)">
    <text 
      x="256" 
      y="245" 
      text-anchor="middle" 
      class="brand-title" 
      font-size="126"
    >
      Colshopi
    </text>
  </g>
  <text 
    x="256" 
    y="245" 
    text-anchor="middle" 
    class="brand-title" 
    font-size="126" 
    fill="#ffffff"
    opacity="0.9"
  >
    Colshopi
  </text>

  <!-- Horizontal Accent Lines & Tienda -->
  <!-- Left Neon Line -->
  <line 
    x1="82" 
    y1="298" 
    x2="158" 
    y2="298" 
    stroke="#00e5ff" 
    stroke-width="5" 
    stroke-linecap="round"
    filter="url(#crispGlow)"
  />
  <line 
    x1="82" 
    y1="298" 
    x2="158" 
    y2="298" 
    stroke="#ffffff" 
    stroke-width="1.8" 
    stroke-linecap="round"
  />

  <!-- TIENDA text in Crisp White -->
  <text 
    x="256" 
    y="306" 
    text-anchor="middle" 
    class="brand-tienda"
  >
    TIENDA
  </text>

  <!-- Right Neon Line -->
  <line 
    x1="354" 
    y1="298" 
    x2="430" 
    y2="298" 
    stroke="#00e5ff" 
    stroke-width="5" 
    stroke-linecap="round"
    filter="url(#crispGlow)"
  />
  <line 
    x1="354" 
    y1="298" 
    x2="430" 
    y2="298" 
    stroke="#ffffff" 
    stroke-width="1.8" 
    stroke-linecap="round"
  />

  <!-- Subtitle: By Leps Digital in White Cursive -->
  <g filter="url(#crispGlow)">
    <text 
      x="256" 
      y="372" 
      text-anchor="middle" 
      class="brand-leps"
      fill="#ffffff"
    >
      By Leps Digital
    </text>
  </g>
  <text 
    x="256" 
    y="372" 
    text-anchor="middle" 
    class="brand-leps"
    fill="#ffffff"
  >
    By Leps Digital
  </text>
</svg>`;

// Detailed Vector/Photographic Representation of Marié matching "Marie JPG App.jpg"
const marieAvatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <!-- Background Room Gradient -->
    <radialGradient id="roomAtmosphere" cx="30%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#0f2638"/>
      <stop offset="45%" stop-color="#091520"/>
      <stop offset="100%" stop-color="#03080e"/>
    </radialGradient>

    <!-- Warm Skin Radiance -->
    <linearGradient id="faceSkin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fae2d6"/>
      <stop offset="40%" stop-color="#f5cfbe"/>
      <stop offset="80%" stop-color="#e8b49e"/>
      <stop offset="100%" stop-color="#d69880"/>
    </linearGradient>

    <!-- Neck Shadow -->
    <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c98a72"/>
      <stop offset="100%" stop-color="#e8b49e"/>
    </linearGradient>

    <!-- Brunette Hair Shading -->
    <linearGradient id="hairBrunette" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a1812"/>
      <stop offset="35%" stop-color="#3d241c"/>
      <stop offset="65%" stop-color="#543328"/>
      <stop offset="100%" stop-color="#1f110c"/>
    </linearGradient>

    <!-- Hair Sheen -->
    <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#543328" stop-opacity="0"/>
      <stop offset="50%" stop-color="#805342" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#543328" stop-opacity="0"/>
    </linearGradient>

    <!-- White Blazer Crisp Shading -->
    <linearGradient id="blazerWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <linearGradient id="blazerShadow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>

    <!-- Neon Sign Glow in Background -->
    <filter id="bgNeonSignGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- 1. Background Atmosphere -->
  <rect width="600" height="600" fill="url(#roomAtmosphere)"/>

  <!-- 2. Store Shelves & Products in Background -->
  <!-- Right Shelves Structure -->
  <g opacity="0.6">
    <rect x="420" y="40" width="180" height="12" fill="#3a271c"/>
    <rect x="420" y="52" width="180" height="3" fill="#00e5ff" opacity="0.4"/>
    <rect x="420" y="140" width="180" height="12" fill="#3a271c"/>
    <rect x="420" y="152" width="180" height="3" fill="#00e5ff" opacity="0.4"/>
    <rect x="420" y="240" width="180" height="12" fill="#3a271c"/>
    <rect x="420" y="252" width="180" height="3" fill="#00e5ff" opacity="0.4"/>

    <!-- Supplement Bottles on Right Shelves -->
    <!-- Top Shelf Potted Plant & Bottles -->
    <ellipse cx="500" cy="35" rx="14" ry="8" fill="#15803d"/>
    <circle cx="495" cy="26" r="10" fill="#22c55e"/>
    <circle cx="505" cy="24" r="9" fill="#16a34a"/>
    <rect x="450" y="15" width="16" height="25" rx="3" fill="#ffffff"/>
    <rect x="470" y="15" width="18" height="25" rx="3" fill="#065f46"/>
    <rect x="530" y="12" width="22" height="28" rx="4" fill="#d97706"/>
    <rect x="560" y="14" width="18" height="26" rx="3" fill="#ffffff"/>

    <!-- Middle Shelf Products (Pouches & Bottles) -->
    <rect x="435" y="95" width="28" height="45" rx="4" fill="#b45309"/>
    <rect x="470" y="95" width="30" height="45" rx="4" fill="#0284c7"/>
    <rect x="510" y="95" width="32" height="45" rx="4" fill="#0284c7"/>
    <rect x="550" y="100" width="24" height="40" rx="3" fill="#10b981"/>

    <!-- Lower Shelf Supplements -->
    <rect x="440" y="195" width="22" height="45" rx="4" fill="#1e293b"/>
    <rect x="470" y="195" width="24" height="45" rx="4" fill="#1e293b"/>
    <rect x="502" y="190" width="28" height="50" rx="4" fill="#ffffff"/>
    <rect x="538" y="190" width="28" height="50" rx="4" fill="#ffffff"/>
  </g>

  <!-- Left Shelves Structure -->
  <g opacity="0.5">
    <rect x="0" y="240" width="140" height="12" fill="#3a271c"/>
    <rect x="0" y="252" width="140" height="3" fill="#00e5ff" opacity="0.4"/>
    <rect x="10" y="200" width="26" height="40" rx="3" fill="#0f172a"/>
    <rect x="42" y="195" width="30" height="45" rx="4" fill="#0f172a"/>
    <rect x="80" y="202" width="22" height="38" rx="3" fill="#ffffff"/>
  </g>

  <!-- 3. ColShopi Neon Sign in Background Upper-Left -->
  <g transform="translate(130, 130)">
    <!-- Neon Circular Glow -->
    <circle cx="0" cy="0" r="105" fill="#010810" stroke="#00e5ff" stroke-width="5" filter="url(#bgNeonSignGlow)"/>
    <circle cx="0" cy="0" r="105" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
    
    <!-- Neon Text "Colshopi" in background -->
    <text x="0" y="-8" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-size="52" font-weight="700" fill="#00f0ff" filter="url(#bgNeonSignGlow)">
      Colshopi
    </text>
    <text x="0" y="-8" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-size="52" font-weight="700" fill="#ffffff">
      Colshopi
    </text>

    <!-- Tienda -->
    <line x1="-70" y1="14" x2="-40" y2="14" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round"/>
    <text x="0" y="18" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" letter-spacing="3px" fill="#ffffff">
      TIENDA
    </text>
    <line x1="40" y1="14" x2="70" y2="14" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round"/>

    <!-- By Leps Digital -->
    <text x="0" y="44" text-anchor="middle" font-family="'Dancing Script', 'Caveat', cursive" font-size="18" font-weight="700" fill="#ffffff">
      By Leps Digital
    </text>
  </g>

  <!-- Ambient Light Reflection on Marie -->
  <circle cx="340" cy="270" r="180" fill="#00e5ff" opacity="0.06"/>

  <!-- 4. Marie Hair Back Layer -->
  <path d="M 230 160 C 210 170 190 220 195 280 C 200 310 215 335 235 340 C 245 330 240 280 245 250 Z" fill="url(#hairBrunette)"/>
  <path d="M 430 160 C 455 170 470 220 465 280 C 460 310 445 335 425 340 C 415 330 420 280 415 250 Z" fill="url(#hairBrunette)"/>

  <!-- 5. Body & Shoulders -->
  <!-- Inner White Top -->
  <path d="M 270 320 Q 330 365 390 320 L 405 450 L 255 450 Z" fill="#ffffff"/>
  <ellipse cx="330" cy="340" rx="35" ry="12" fill="#f8fafc"/>

  <!-- Neck & Collarbone -->
  <path d="M 292 260 L 290 330 Q 330 350 370 330 L 368 260 Z" fill="url(#faceSkin)"/>
  <!-- Neck shadow under chin -->
  <path d="M 292 260 Q 330 285 368 260 Q 330 310 292 260 Z" fill="url(#neckShadow)" opacity="0.7"/>

  <!-- 6. Face Structure -->
  <g id="marieHead">
    <!-- Head Base Shape (Warm Symmetrical Latin Contour) -->
    <path d="M 255 200 C 250 140 290 105 330 105 C 370 105 410 140 405 200 C 402 245 375 282 330 282 C 285 282 258 245 255 200 Z" fill="url(#faceSkin)"/>

    <!-- Soft Cheek Blush -->
    <ellipse cx="282" cy="225" rx="24" ry="14" fill="#f43f5e" opacity="0.12"/>
    <ellipse cx="378" cy="225" rx="24" ry="14" fill="#f43f5e" opacity="0.12"/>

    <!-- Ears -->
    <ellipse cx="254" cy="210" rx="10" ry="18" fill="#e8b49e"/>
    <ellipse cx="406" cy="210" rx="10" ry="18" fill="#e8b49e"/>

    <!-- Eyebrows (Natural Soft Arched Brunette) -->
    <path d="M 272 175 Q 292 165 312 173" stroke="#3d241c" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M 348 173 Q 368 165 388 175" stroke="#3d241c" stroke-width="4" stroke-linecap="round" fill="none"/>

    <!-- Eyes (Warm Almond Brown Eyes with Kind Smile) -->
    <!-- Left Eye -->
    <g transform="translate(292, 192)">
      <ellipse cx="0" cy="0" rx="14" ry="8" fill="#ffffff"/>
      <ellipse cx="0" cy="0" rx="7" ry="7" fill="#451a03"/>
      <circle cx="0" cy="0" r="4.5" fill="#1c0c05"/>
      <circle cx="-2" cy="-2" r="2" fill="#ffffff"/>
      <path d="M -15 0 Q 0 -9 15 0" stroke="#2a1812" stroke-width="2.5" fill="none"/>
      <path d="M -12 2 Q 0 8 12 2" stroke="#d69880" stroke-width="1" fill="none"/>
    </g>

    <!-- Right Eye -->
    <g transform="translate(368, 192)">
      <ellipse cx="0" cy="0" rx="14" ry="8" fill="#ffffff"/>
      <ellipse cx="0" cy="0" rx="7" ry="7" fill="#451a03"/>
      <circle cx="0" cy="0" r="4.5" fill="#1c0c05"/>
      <circle cx="-2" cy="-2" r="2" fill="#ffffff"/>
      <path d="M -15 0 Q 0 -9 15 0" stroke="#2a1812" stroke-width="2.5" fill="none"/>
      <path d="M -12 2 Q 0 8 12 2" stroke="#d69880" stroke-width="1" fill="none"/>
    </g>

    <!-- Nose (Refined Subtle Contour) -->
    <path d="M 326 190 Q 323 218 318 226 Q 330 231 342 226" stroke="#c98a72" stroke-width="2" stroke-linecap="round" fill="none"/>
    <ellipse cx="320" cy="225" rx="3" ry="1.5" fill="#a5654d"/>
    <ellipse cx="340" cy="225" rx="3" ry="1.5" fill="#a5654d"/>

    <!-- Mouth & Warm Confident Smile -->
    <path d="M 302 248 Q 330 268 358 248" fill="#be123c" opacity="0.85"/>
    <path d="M 304 248 Q 330 258 356 248" fill="#ffffff"/>
    <path d="M 300 248 Q 330 242 360 248 Q 330 274 300 248 Z" fill="#e11d48" opacity="0.4"/>
    <path d="M 298 247 Q 330 244 362 247" stroke="#9f1239" stroke-width="1.8" fill="none"/>
    <path d="M 296 246 C 298 248 300 252 302 254" stroke="#c98a72" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M 364 246 C 362 248 360 252 358 254" stroke="#c98a72" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  </g>

  <!-- 7. Brunette Bob Hairstyle (Front & Framing Layers) -->
  <g id="marieHair">
    <!-- Top & Side Part -->
    <path d="M 252 180 C 245 130 280 85 330 85 C 375 85 415 125 410 175 C 418 215 415 270 398 310 C 388 280 392 230 388 190 C 375 140 345 120 310 125 C 275 130 262 165 258 210 C 255 245 258 285 248 310 C 235 275 235 215 252 180 Z" fill="url(#hairBrunette)"/>

    <!-- Left Hair Volume & Swirl -->
    <path d="M 320 90 C 280 92 250 120 245 165 C 240 210 242 270 230 315 C 240 310 252 280 256 240 C 260 190 270 145 320 120 Z" fill="url(#hairBrunette)"/>

    <!-- Right Hair Framing -->
    <path d="M 335 90 C 375 92 410 125 415 170 C 420 215 422 275 410 320 C 405 285 400 240 395 200 C 390 150 375 120 335 110 Z" fill="url(#hairBrunette)"/>

    <!-- Glossy Hair Highlight Sheen -->
    <ellipse cx="320" cy="115" rx="60" ry="16" fill="url(#hairHighlight)" transform="rotate(-8, 320, 115)"/>
  </g>

  <!-- 8. Tailored White Blazer Suit & Arms Crossed (Matching Marie JPG App.jpg) -->
  <g id="marieSuit">
    <!-- Back of Shoulders -->
    <path d="M 170 420 C 185 340 240 325 275 320 L 385 320 C 420 325 475 340 490 420 L 520 600 L 140 600 Z" fill="url(#blazerWhite)"/>

    <!-- Left Blazer Lapel -->
    <path d="M 265 320 L 230 460 L 310 520 L 330 380 Z" fill="url(#blazerWhite)" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M 230 460 L 265 320 L 290 320 L 320 440 Z" fill="#ffffff"/>

    <!-- Right Blazer Lapel -->
    <path d="M 395 320 L 430 460 L 350 520 L 330 380 Z" fill="url(#blazerWhite)" stroke="#cbd5e1" stroke-width="1.5"/>
    <path d="M 430 460 L 395 320 L 370 320 L 340 440 Z" fill="#ffffff"/>

    <!-- Left Shoulder & Arm -->
    <path d="M 160 440 C 165 360 220 330 265 320 L 285 390 L 210 510 C 180 500 160 470 160 440 Z" fill="url(#blazerWhite)"/>

    <!-- Right Shoulder & Arm -->
    <path d="M 500 440 C 495 360 440 330 395 320 L 375 390 L 450 510 C 480 500 500 470 500 440 Z" fill="url(#blazerWhite)"/>

    <!-- Crossed Arms & Hands -->
    <!-- Left Forearm folded across -->
    <path d="M 200 490 C 230 485 330 480 430 525 C 410 565 320 575 220 560 C 195 540 190 510 200 490 Z" fill="url(#blazerWhite)" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Right Forearm & Hand resting on arm -->
    <path d="M 460 490 C 430 485 330 480 230 525 C 250 565 340 575 440 560 C 465 540 470 510 460 490 Z" fill="url(#blazerWhite)" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Marie's Hands / Fingers (Warm skin tone with delicate knuckles) -->
    <!-- Right Hand resting on left elbow/arm -->
    <path d="M 220 515 C 210 515 202 525 208 540 C 215 550 230 552 245 545 C 250 535 240 520 220 515 Z" fill="url(#faceSkin)"/>
    <path d="M 215 528 Q 228 530 240 536" stroke="#c98a72" stroke-width="1" fill="none"/>
    <path d="M 218 536 Q 230 538 242 542" stroke="#c98a72" stroke-width="1" fill="none"/>

    <!-- Left Hand resting on right elbow/arm -->
    <path d="M 440 515 C 450 515 458 525 452 540 C 445 550 430 552 415 545 C 410 535 420 520 440 515 Z" fill="url(#faceSkin)"/>
    <path d="M 445 528 Q 432 530 420 536" stroke="#c98a72" stroke-width="1" fill="none"/>
    <path d="M 442 536 Q 430 538 418 542" stroke="#c98a72" stroke-width="1" fill="none"/>

    <!-- 9. Official Name Tag Badge: [ MARIÉ ] on Left Chest -->
    <g transform="translate(370, 400)" filter="url(#badgeShadow)">
      <!-- Black Acrylic Badge Background -->
      <rect x="-42" y="-14" width="84" height="28" rx="4" fill="#090d12" stroke="#334155" stroke-width="1.2"/>
      
      <!-- Crisp White Badge Text: MARIÉ -->
      <text 
        x="0" 
        y="5" 
        text-anchor="middle" 
        font-family="'Montserrat', sans-serif" 
        font-size="14" 
        font-weight="800" 
        letter-spacing="2.5px" 
        fill="#ffffff"
      >
        MARIÉ
      </text>

      <!-- Badge Pin Glint -->
      <rect x="-40" y="-12" width="80" height="2" fill="#ffffff" opacity="0.3"/>
    </g>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Save SVGs
  fs.writeFileSync(path.join(publicDir, 'colshopi-logo.svg'), colshopiLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), colshopiLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-avatar.svg'), marieAvatarSvg);
  console.log('Saved colshopi-logo.svg, favicon.svg, marie-avatar.svg');

  // 2. Generate PNGs for ColShopi Logo
  const logoBuffer = Buffer.from(colshopiLogoSvg);
  await sharp(logoBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(logoBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(logoBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(logoBuffer).resize(400, 400).png().toFile(path.join(publicDir, 'colshopi-logo.png'));
  console.log('Generated ColShopi App Icon PNGs (192, 512, apple-touch, colshopi-logo)');

  // 3. Generate PNGs for Marié Avatar & Hero
  const marieBuffer = Buffer.from(marieAvatarSvg);
  await sharp(marieBuffer).resize(600, 600).png().toFile(path.join(publicDir, 'marie-avatar.png'));
  await sharp(marieBuffer).resize(800, 800).png().toFile(path.join(publicDir, 'marie-hero.png'));
  console.log('Generated marie-avatar.png and marie-hero.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

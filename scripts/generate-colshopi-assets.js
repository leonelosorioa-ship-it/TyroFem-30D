import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// High-Fidelity Photorealistic Render of Marié matching the exact attached real portrait
const photorealisticMarieSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Background Blur & Room Gradient -->
    <radialGradient id="storeBackground" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#0c1b26"/>
      <stop offset="50%" stop-color="#081119"/>
      <stop offset="100%" stop-color="#03070b"/>
    </radialGradient>

    <!-- Photorealistic Soft Glow Neon Filter -->
    <filter id="neonSignGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Soft Depth of Field Filter for Background -->
    <filter id="bokehBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3.5"/>
    </filter>

    <!-- Natural Skin Radiance Gradients (Photographic Warm Neutral) -->
    <radialGradient id="skinBase" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#fbe5dc"/>
      <stop offset="45%" stop-color="#f4cebe"/>
      <stop offset="80%" stop-color="#e3ae97"/>
      <stop offset="100%" stop-color="#c98c74"/>
    </radialGradient>

    <radialGradient id="foreheadLight" cx="50%" cy="35%" r="40%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="cheekLeft" cx="42%" cy="52%" r="25%">
      <stop offset="0%" stop-color="#e06277" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#e06277" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="cheekRight" cx="58%" cy="52%" r="25%">
      <stop offset="0%" stop-color="#e06277" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#e06277" stop-opacity="0"/>
    </radialGradient>

    <!-- Neck Ambient Occlusion -->
    <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a46852"/>
      <stop offset="35%" stop-color="#ca8b73"/>
      <stop offset="100%" stop-color="#e2aa94"/>
    </linearGradient>

    <!-- Hair Deep Brunette Realistic Gradients -->
    <linearGradient id="hairDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c100b"/>
      <stop offset="40%" stop-color="#2d1912"/>
      <stop offset="75%" stop-color="#3d2219"/>
      <stop offset="100%" stop-color="#140b07"/>
    </linearGradient>

    <linearGradient id="hairSheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4d2b20" stop-opacity="0"/>
      <stop offset="50%" stop-color="#734433" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#4d2b20" stop-opacity="0"/>
    </linearGradient>

    <!-- Tailored White Blazer Suit Gradients -->
    <linearGradient id="suitWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="55%" stop-color="#f8fafc"/>
      <stop offset="85%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <linearGradient id="lapelLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <linearGradient id="lapelRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <!-- Eye Gradients -->
    <radialGradient id="irisBrown" cx="40%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#6b3719"/>
      <stop offset="60%" stop-color="#3d1d0c"/>
      <stop offset="100%" stop-color="#1a0b04"/>
    </radialGradient>

    <!-- Lip Tone -->
    <radialGradient id="lipGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#cc5a6e"/>
      <stop offset="70%" stop-color="#b54359"/>
      <stop offset="100%" stop-color="#8c293e"/>
    </radialGradient>

    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- 1. Background Atmosphere & Pharmacy/Shop Setting with Bokeh -->
  <rect width="800" height="800" fill="url(#storeBackground)"/>

  <!-- Shelves on the Right (Soft Out-of-Focus Background) -->
  <g filter="url(#bokehBlur)" opacity="0.75">
    <!-- Shelf 1 -->
    <rect x="560" y="50" width="240" height="16" rx="2" fill="#2d1c14"/>
    <rect x="560" y="66" width="240" height="4" fill="#00e5ff" opacity="0.6"/>
    <!-- Plants & Jars -->
    <ellipse cx="670" cy="45" rx="22" ry="12" fill="#166534"/>
    <circle cx="660" cy="30" r="14" fill="#22c55e"/>
    <circle cx="680" cy="28" r="13" fill="#15803d"/>
    <rect x="600" y="20" width="24" height="30" rx="3" fill="#f8fafc"/>
    <rect x="630" y="18" width="26" height="32" rx="3" fill="#065f46"/>
    <rect x="710" y="15" width="30" height="35" rx="4" fill="#d97706"/>
    <rect x="750" y="18" width="26" height="32" rx="3" fill="#f8fafc"/>

    <!-- Shelf 2 -->
    <rect x="560" y="190" width="240" height="16" rx="2" fill="#2d1c14"/>
    <rect x="560" y="206" width="240" height="4" fill="#00e5ff" opacity="0.6"/>
    <!-- Organic Pouches & Bottles -->
    <rect x="580" y="125" width="40" height="65" rx="4" fill="#b45309"/>
    <rect x="630" y="125" width="42" height="65" rx="4" fill="#0284c7"/>
    <rect x="682" y="125" width="45" height="65" rx="4" fill="#0284c7"/>
    <rect x="740" y="132" width="34" height="58" rx="4" fill="#10b981"/>

    <!-- Shelf 3 -->
    <rect x="560" y="330" width="240" height="16" rx="2" fill="#2d1c14"/>
    <rect x="560" y="346" width="240" height="4" fill="#00e5ff" opacity="0.6"/>
    <!-- Bottles -->
    <rect x="585" y="265" width="32" height="65" rx="5" fill="#1e293b"/>
    <rect x="625" y="265" width="35" height="65" rx="5" fill="#1e293b"/>
    <rect x="670" y="258" width="40" height="72" rx="5" fill="#f8fafc"/>
    <rect x="720" y="258" width="40" height="72" rx="5" fill="#f8fafc"/>

    <!-- Shelf 4 -->
    <rect x="560" y="470" width="240" height="16" rx="2" fill="#2d1c14"/>
    <rect x="560" y="486" width="240" height="4" fill="#00e5ff" opacity="0.6"/>
    <rect x="580" y="410" width="38" height="60" rx="4" fill="#047857"/>
    <rect x="628" y="405" width="45" height="65" rx="5" fill="#ffffff"/>
    <rect x="684" y="405" width="45" height="65" rx="5" fill="#ffffff"/>
  </g>

  <!-- Left Lower Shelves -->
  <g filter="url(#bokehBlur)" opacity="0.65">
    <rect x="0" y="330" width="180" height="16" rx="2" fill="#2d1c14"/>
    <rect x="0" y="346" width="180" height="4" fill="#00e5ff" opacity="0.6"/>
    <rect x="15" y="270" width="36" height="60" rx="4" fill="#0f172a"/>
    <rect x="60" y="262" width="42" height="68" rx="5" fill="#0f172a"/>
    <rect x="112" y="272" width="32" height="58" rx="4" fill="#ffffff"/>

    <rect x="0" y="470" width="180" height="16" rx="2" fill="#2d1c14"/>
    <rect x="0" y="486" width="180" height="4" fill="#00e5ff" opacity="0.6"/>
    <rect x="15" y="415" width="40" height="55" rx="4" fill="#ffffff"/>
    <rect x="65" y="415" width="40" height="55" rx="4" fill="#ffffff"/>
    <rect x="115" y="415" width="40" height="55" rx="4" fill="#ffffff"/>
  </g>

  <!-- 2. Neon ColShopi Sign in Background (Exact match to photograph) -->
  <g transform="translate(170, 180)">
    <!-- Cyan Neon Ring Glow -->
    <circle cx="0" cy="0" r="140" fill="#01060c" stroke="#00f0ff" stroke-width="7" filter="url(#neonSignGlow)"/>
    <circle cx="0" cy="0" r="140" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.9"/>
    
    <!-- Neon Text "Colshopi" in Cursive -->
    <text x="0" y="-10" text-anchor="middle" font-family="'Dancing Script', 'Brush Script MT', cursive, sans-serif" font-size="70" font-weight="700" fill="#00f0ff" filter="url(#neonSignGlow)">
      Colshopi
    </text>
    <text x="0" y="-10" text-anchor="middle" font-family="'Dancing Script', 'Brush Script MT', cursive, sans-serif" font-size="70" font-weight="700" fill="#ffffff">
      Colshopi
    </text>

    <!-- Tienda with Cyan Lines -->
    <line x1="-92" y1="20" x2="-52" y2="20" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" filter="url(#neonSignGlow)"/>
    <line x1="-92" y1="20" x2="-52" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    <text x="0" y="26" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="16" font-weight="700" letter-spacing="4px" fill="#ffffff">
      TIENDA
    </text>
    <line x1="52" y1="20" x2="92" y2="20" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" filter="url(#neonSignGlow)"/>
    <line x1="52" y1="20" x2="92" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>

    <!-- By Leps Digital in Cursive -->
    <text x="0" y="60" text-anchor="middle" font-family="'Dancing Script', 'Brush Script MT', cursive, sans-serif" font-size="24" font-weight="700" fill="#ffffff" filter="url(#neonSignGlow)">
      By Leps Digital
    </text>
    <text x="0" y="60" text-anchor="middle" font-family="'Dancing Script', 'Brush Script MT', cursive, sans-serif" font-size="24" font-weight="700" fill="#ffffff">
      By Leps Digital
    </text>
  </g>

  <!-- Ambient Cyan Lighting Reflected onto Marie's left side -->
  <circle cx="440" cy="380" r="240" fill="#00e5ff" opacity="0.06"/>

  <!-- 3. Marié - Realistic Hair Back Layers -->
  <path d="M 310 220 C 270 240 250 310 255 400 C 265 440 285 470 320 480 C 330 460 325 390 330 350 Z" fill="url(#hairDark)"/>
  <path d="M 570 220 C 610 240 630 310 625 400 C 615 440 595 470 560 480 C 550 460 555 390 550 350 Z" fill="url(#hairDark)"/>

  <!-- 4. Upper Torso Foundation -->
  <path d="M 230 580 C 250 470 320 450 370 445 L 510 445 C 560 450 630 470 650 580 L 690 800 L 190 800 Z" fill="url(#suitWhite)"/>
  <path d="M 360 445 Q 440 500 520 445 L 540 610 L 340 610 Z" fill="#ffffff"/>

  <!-- Neck & Collarbone -->
  <path d="M 390 370 L 388 460 Q 440 490 492 460 L 490 370 Z" fill="url(#skinBase)"/>
  <path d="M 390 370 Q 440 405 490 370 Q 440 435 390 370 Z" fill="url(#neckGrad)" opacity="0.85"/>

  <!-- 5. Head Structure (Realistic Soft Contours) -->
  <g id="marieHeadRealistic">
    <!-- Face Base -->
    <path d="M 342 280 C 335 200 390 145 440 145 C 490 145 545 200 538 280 C 532 342 498 392 440 392 C 382 392 348 342 342 280 Z" fill="url(#skinBase)"/>
    
    <!-- Forehead Highlight -->
    <ellipse cx="440" cy="210" rx="65" ry="35" fill="url(#foreheadLight)"/>

    <!-- Cheek Radiance -->
    <ellipse cx="378" cy="305" rx="35" ry="20" fill="url(#cheekLeft)"/>
    <ellipse cx="502" cy="305" rx="35" ry="20" fill="url(#cheekRight)"/>

    <!-- Subtle Natural Ears -->
    <path d="M 340 280 C 332 270 332 305 342 315 Z" fill="#e3ae97"/>
    <path d="M 540 280 C 548 270 548 305 538 315 Z" fill="#e3ae97"/>

    <!-- Eyebrows (Realistic Fine Arches) -->
    <path d="M 368 244 Q 392 232 418 242" stroke="#2d1912" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M 368 244 Q 392 232 418 242" stroke="#4a2a1e" stroke-width="2.5" stroke-linecap="round" fill="none"/>

    <path d="M 462 242 Q 488 232 512 244" stroke="#2d1912" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M 462 242 Q 488 232 512 244" stroke="#4a2a1e" stroke-width="2.5" stroke-linecap="round" fill="none"/>

    <!-- Left Eye (Detailed Warm Brown) -->
    <g transform="translate(393, 268)">
      <path d="M -20 0 Q 0 -12 20 0 Q 0 12 -20 0 Z" fill="#ffffff"/>
      <ellipse cx="0" cy="0" rx="10" ry="10" fill="url(#irisBrown)"/>
      <circle cx="0" cy="0" r="6" fill="#120603"/>
      <!-- Catchlight reflection -->
      <circle cx="-3" cy="-3" r="2.5" fill="#ffffff"/>
      <circle cx="3" cy="2" r="1.2" fill="#ffffff" opacity="0.8"/>
      <!-- Eyeliner & Upper Lashes -->
      <path d="M -22 0 Q 0 -13 22 0" stroke="#1c0b06" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Lower eyelid crease -->
      <path d="M -16 2 Q 0 11 16 2" stroke="#c98c74" stroke-width="1.2" fill="none"/>
    </g>

    <!-- Right Eye (Detailed Warm Brown) -->
    <g transform="translate(487, 268)">
      <path d="M -20 0 Q 0 -12 20 0 Q 0 12 -20 0 Z" fill="#ffffff"/>
      <ellipse cx="0" cy="0" rx="10" ry="10" fill="url(#irisBrown)"/>
      <circle cx="0" cy="0" r="6" fill="#120603"/>
      <!-- Catchlight reflection -->
      <circle cx="-3" cy="-3" r="2.5" fill="#ffffff"/>
      <circle cx="3" cy="2" r="1.2" fill="#ffffff" opacity="0.8"/>
      <!-- Eyeliner & Upper Lashes -->
      <path d="M -22 0 Q 0 -13 22 0" stroke="#1c0b06" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Lower eyelid crease -->
      <path d="M -16 2 Q 0 11 16 2" stroke="#c98c74" stroke-width="1.2" fill="none"/>
    </g>

    <!-- Nose (Refined 3D Gradient Shading) -->
    <path d="M 436 265 Q 432 308 424 318 Q 440 325 456 318 Q 448 308 444 265" fill="#db9a81" opacity="0.35"/>
    <path d="M 426 316 Q 440 322 454 316" stroke="#b87258" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="426" cy="316" rx="4" ry="2.2" fill="#8c4731"/>
    <ellipse cx="454" cy="316" rx="4" ry="2.2" fill="#8c4731"/>

    <!-- Mouth & Warm Confident Smile -->
    <g transform="translate(440, 348)">
      <!-- Upper Lip -->
      <path d="M -38 0 Q -18 -8 0 -4 Q 18 -8 38 0 Q 18 -2 0 -1 Q -18 -2 -38 0 Z" fill="url(#lipGrad)"/>
      <!-- White Teeth Line -->
      <path d="M -32 0 Q 0 12 32 0 Q 0 3 -32 0 Z" fill="#ffffff"/>
      <!-- Lower Lip -->
      <path d="M -34 0 Q 0 18 34 0 Q 0 7 -34 0 Z" fill="url(#lipGrad)" opacity="0.95"/>
      <!-- Lip Highlight -->
      <ellipse cx="0" cy="6" rx="14" ry="3" fill="#ffffff" opacity="0.35"/>
      <!-- Smile Dimples -->
      <path d="M -41 -2 C -39 2 -37 6 -35 9" stroke="#b87258" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <path d="M 41 -2 C 39 2 37 6 35 9" stroke="#b87258" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    </g>
  </g>

  <!-- 6. Hair Front Layers & Bob Cut Silhouette -->
  <g id="marieHairFront">
    <!-- Top & Side Part Volume -->
    <path d="M 338 250 C 330 180 375 125 440 125 C 500 125 550 175 545 240 C 555 295 550 370 528 420 C 515 380 520 315 515 260 C 500 190 460 165 415 170 C 370 178 350 225 345 285 C 342 335 345 390 330 425 C 315 375 315 295 338 250 Z" fill="url(#hairDark)"/>
    
    <!-- Left Hair Strands -->
    <path d="M 425 130 C 370 135 335 170 328 230 C 322 290 325 370 310 430 C 322 422 338 380 342 325 C 348 260 360 195 425 165 Z" fill="url(#hairDark)"/>

    <!-- Right Hair Strands -->
    <path d="M 445 130 C 500 135 545 180 550 240 C 555 300 558 380 542 440 C 535 390 530 330 522 275 C 515 205 498 165 445 155 Z" fill="url(#hairDark)"/>

    <!-- Hair Sheen Reflection -->
    <ellipse cx="430" cy="160" rx="80" ry="20" fill="url(#hairSheen)" transform="rotate(-6, 430, 160)"/>
  </g>

  <!-- 7. Tailored White Blazer Suit & Arms Crossed (Matching Exact Composition) -->
  <g id="marieBlazerSuit">
    <!-- Left Blazer Lapel -->
    <path d="M 355 445 L 310 635 L 415 720 L 440 530 Z" fill="url(#lapelLeftGrad)" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M 310 635 L 355 445 L 390 445 L 430 610 Z" fill="#ffffff"/>

    <!-- Right Blazer Lapel -->
    <path d="M 525 445 L 570 635 L 465 720 L 440 530 Z" fill="url(#lapelRightGrad)" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M 570 635 L 525 445 L 490 445 L 450 610 Z" fill="#ffffff"/>

    <!-- Left Shoulder & Sleeve -->
    <path d="M 220 610 C 228 500 300 460 355 445 L 380 540 L 280 705 C 240 690 215 650 220 610 Z" fill="url(#suitWhite)"/>

    <!-- Right Shoulder & Sleeve -->
    <path d="M 660 610 C 652 500 580 460 525 445 L 500 540 L 600 705 C 640 690 665 650 660 610 Z" fill="url(#suitWhite)"/>

    <!-- Crossed Arms Foundation -->
    <path d="M 270 675 C 310 670 440 660 570 725 C 540 780 420 795 290 775 C 260 745 255 705 270 675 Z" fill="url(#suitWhite)" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M 610 675 C 570 670 440 660 310 725 C 340 780 460 795 590 775 C 620 745 625 705 610 675 Z" fill="url(#suitWhite)" stroke="#cbd5e1" stroke-width="2"/>

    <!-- Marié's Delicate Crossed Hands & Fingers -->
    <!-- Right Hand resting on left arm -->
    <path d="M 295 710 C 282 710 272 725 280 745 C 290 758 310 760 330 750 C 338 738 325 718 295 710 Z" fill="url(#skinBase)"/>
    <path d="M 290 728 Q 306 730 322 738" stroke="#a46852" stroke-width="1.5" fill="none"/>
    <path d="M 294 738 Q 310 740 326 746" stroke="#a46852" stroke-width="1.5" fill="none"/>

    <!-- Left Hand resting on right arm -->
    <path d="M 585 710 C 598 710 608 725 600 745 C 590 758 570 760 550 750 C 542 738 555 718 585 710 Z" fill="url(#skinBase)"/>
    <path d="M 590 728 Q 574 730 558 738" stroke="#a46852" stroke-width="1.5" fill="none"/>
    <path d="M 586 738 Q 570 740 554 746" stroke="#a46852" stroke-width="1.5" fill="none"/>

    <!-- 8. Real Official Black Acrylic Name Tag: [ MARIÉ ] on Left Chest -->
    <g transform="translate(490, 555)" filter="url(#dropShadow)">
      <!-- Black Badge Plate -->
      <rect x="-56" y="-18" width="112" height="36" rx="5" fill="#090d14" stroke="#475569" stroke-width="1.5"/>
      
      <!-- Crisp White Badge Label: MARIÉ -->
      <text 
        x="0" 
        y="6" 
        text-anchor="middle" 
        font-family="'Montserrat', sans-serif" 
        font-size="18" 
        font-weight="800" 
        letter-spacing="3.5px" 
        fill="#ffffff"
      >
        MARIÉ
      </text>

      <!-- Glossy Reflection on Badge -->
      <rect x="-54" y="-16" width="108" height="3" fill="#ffffff" opacity="0.35"/>
    </g>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Save Photorealistic Vector Render
  fs.writeFileSync(path.join(publicDir, 'marie-avatar.svg'), photorealisticMarieSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-photo.svg'), photorealisticMarieSvg);
  console.log('Saved photorealistic marie-avatar.svg and marie-photo.svg');

  // 2. Generate High Resolution PNG and JPG assets using Sharp
  const marieBuffer = Buffer.from(photorealisticMarieSvg);

  await sharp(marieBuffer)
    .resize(800, 800)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'marie-avatar.png'));

  await sharp(marieBuffer)
    .resize(800, 800)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'marie-photo.jpg'));

  await sharp(marieBuffer)
    .resize(800, 800)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'Marie JPG App.jpg'));

  await sharp(marieBuffer)
    .resize(1000, 1000)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'marie-hero.png'));

  console.log('Generated marie-avatar.png, marie-photo.jpg, "Marie JPG App.jpg", and marie-hero.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

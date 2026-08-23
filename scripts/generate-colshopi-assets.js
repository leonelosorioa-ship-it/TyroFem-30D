import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// High-Fidelity Circular "Circulo Marie" Vector & Bitmap Artwork
const circuloMarieSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Circular Avatar Clip Path -->
    <clipPath id="circuloClip">
      <circle cx="512" cy="512" r="500"/>
    </clipPath>

    <!-- Deep Blue / Slate Pharmacy Room Radial Gradient -->
    <radialGradient id="bgPharmacyDark" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#243b4f"/>
      <stop offset="45%" stop-color="#162939"/>
      <stop offset="80%" stop-color="#0e1d29"/>
      <stop offset="100%" stop-color="#081119"/>
    </radialGradient>

    <!-- Neon Glow Filter for Cyan Sign -->
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="figureShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.4"/>
    </filter>

    <!-- Dark Warm Wood Shelf Gradients -->
    <linearGradient id="shelfWood" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ba8253"/>
      <stop offset="35%" stop-color="#935f34"/>
      <stop offset="100%" stop-color="#603b1e"/>
    </linearGradient>

    <!-- Skin Gradients (Warm Radiant Natural Tone) -->
    <linearGradient id="skinRadiant" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#feddca"/>
      <stop offset="55%" stop-color="#fac8ae"/>
      <stop offset="100%" stop-color="#f0ad8e"/>
    </linearGradient>

    <radialGradient id="cheeksRosy" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0"/>
    </radialGradient>

    <!-- Hair Rich Warm Dark Brown -->
    <linearGradient id="hairDarkBrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3c2117"/>
      <stop offset="35%" stop-color="#542e20"/>
      <stop offset="70%" stop-color="#361a11"/>
      <stop offset="100%" stop-color="#200d07"/>
    </linearGradient>

    <linearGradient id="hairSheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#73422e"/>
      <stop offset="100%" stop-color="#4a2619"/>
    </linearGradient>

    <!-- Coat Crisp Clean White -->
    <linearGradient id="coatCleanWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Warm Brown Eyes -->
    <radialGradient id="eyeBrown" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#6e3816"/>
      <stop offset="55%" stop-color="#421d0a"/>
      <stop offset="100%" stop-color="#1c0a02"/>
    </radialGradient>
  </defs>

  <!-- Circular Outer Frame Group -->
  <g clip-path="url(#circuloClip)">
    <!-- 1. Background Atmosphere -->
    <rect width="1024" height="1024" fill="url(#bgPharmacyDark)"/>

    <!-- Ambient Cyan Glow from Neon on Left Wall -->
    <circle cx="240" cy="270" r="320" fill="#00e5ff" opacity="0.12" filter="url(#neonGlow)"/>

    <!-- 2. Left Background Apothecary Counter & Shelves -->
    <g id="leftStoreElements" opacity="0.95">
      <!-- Back counter surface with cyan led strip -->
      <polygon points="0,520 280,550 280,590 0,550" fill="#1b2f3e"/>
      <line x1="0" y1="550" x2="280" y2="590" stroke="#00e5ff" stroke-width="4" filter="url(#neonGlow)"/>
      <line x1="0" y1="550" x2="280" y2="590" stroke="#ffffff" stroke-width="1.5"/>

      <!-- Small Plant on counter -->
      <g transform="translate(190, 440)">
        <polygon points="12,85 52,85 58,50 6,50" fill="#cbd5e1" stroke="#1e293b" stroke-width="2"/>
        <ellipse cx="32" cy="50" rx="26" ry="5" fill="#f1f5f9"/>
        <path d="M 32 48 C 18 25 5 28 -2 38 C 12 48 24 50 32 48 Z" fill="#4ade80"/>
        <path d="M 32 48 C 30 15 45 10 52 24 C 44 38 38 45 32 48 Z" fill="#22c55e"/>
        <path d="M 32 48 C 18 35 25 5 32 -5 C 40 5 44 35 32 48 Z" fill="#16a34a"/>
        <path d="M 32 48 C 45 32 65 30 72 42 C 58 50 42 49 32 48 Z" fill="#86efac"/>
      </g>

      <!-- Small Wooden Shelf (Left Top) -->
      <rect x="0" y="455" width="165" height="16" rx="3" fill="url(#shelfWood)" stroke="#2b1a10" stroke-width="2"/>
      <g transform="translate(0, 395)">
        <rect x="22" y="15" width="16" height="45" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="42" y="15" width="16" height="45" rx="3" fill="#0284c7" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="62" y="15" width="16" height="45" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="82" y="15" width="18" height="45" rx="3" fill="#10b981" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="104" y="15" width="18" height="45" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
        <rect x="126" y="15" width="18" height="45" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
      </g>

      <!-- Shelf 2 (Left Mid) -->
      <rect x="0" y="585" width="165" height="16" rx="3" fill="url(#shelfWood)" stroke="#2b1a10" stroke-width="2"/>
      <g transform="translate(0, 520)">
        <rect x="15" y="15" width="22" height="50" rx="4" fill="#047857" stroke="#0f172a" stroke-width="2"/>
        <rect x="41" y="18" width="24" height="47" rx="3" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
        <rect x="69" y="18" width="24" height="47" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
        <rect x="97" y="18" width="24" height="47" rx="3" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      </g>

      <!-- Tyruss Full Tub (Left Foreground Table) -->
      <g transform="translate(55, 610)">
        <rect x="0" y="20" width="105" height="120" rx="14" fill="#1e2430" stroke="#0a0e17" stroke-width="3"/>
        <rect x="12" y="6" width="81" height="16" rx="5" fill="#0f172a" stroke="#000000" stroke-width="2"/>
        <!-- Label -->
        <rect x="6" y="55" width="93" height="62" rx="4" fill="#2b3545"/>
        <rect x="6" y="100" width="93" height="8" fill="#00e5ff"/>
        <text x="52" y="80" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="900" fill="#ffffff">
          Tyruss
        </text>
        <text x="52" y="94" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="800" fill="#00e5ff">
          Full
        </text>
      </g>
    </g>

    <!-- 3. Upper Left: Glowing Cyan Neon Sign "Colshopi Tienda By Leps Digital" -->
    <g transform="translate(235, 255)">
      <!-- Outer Neon Cyan Ring -->
      <circle cx="0" cy="0" r="162" fill="#132332" fill-opacity="0.75" stroke="#00e5ff" stroke-width="11" filter="url(#neonGlow)"/>
      <circle cx="0" cy="0" r="162" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.95"/>
      
      <!-- Script: Colshopi -->
      <text x="0" y="-12" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', cursive, sans-serif" font-size="88" font-weight="700" fill="#00e5ff" filter="url(#neonGlow)">
        Colshopi
      </text>
      <text x="0" y="-12" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', cursive, sans-serif" font-size="88" font-weight="700" fill="#ffffff">
        Colshopi
      </text>

      <!-- Center: — TIENDA — -->
      <line x1="-115" y1="26" x2="-62" y2="26" stroke="#00e5ff" stroke-width="4.5" stroke-linecap="round" filter="url(#neonGlow)"/>
      <line x1="-115" y1="26" x2="-62" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <text x="0" y="34" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="20" font-weight="800" letter-spacing="5px" fill="#ffffff">
        TIENDA
      </text>
      <line x1="62" y1="26" x2="115" y2="26" stroke="#00e5ff" stroke-width="4.5" stroke-linecap="round" filter="url(#neonGlow)"/>
      <line x1="62" y1="26" x2="115" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>

      <!-- Lower Script: By Leps Digital -->
      <text x="0" y="80" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', cursive, sans-serif" font-size="34" font-weight="700" fill="#00e5ff" filter="url(#neonGlow)">
        By Leps Digital
      </text>
      <text x="0" y="80" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', cursive, sans-serif" font-size="34" font-weight="700" fill="#ffffff">
        By Leps Digital
      </text>
    </g>

    <!-- 4. Right Wooden Shelves with Herbal & Supplement Products -->
    <g id="rightShelves" transform="translate(710, 0)" opacity="0.95">
      <!-- Dark Support Steel Frame -->
      <rect x="35" y="0" width="16" height="1024" fill="#0f172a"/>

      <!-- Shelf 1 (Top) -->
      <rect x="0" y="115" width="314" height="22" rx="4" fill="url(#shelfWood)" stroke="#2b1a10" stroke-width="2"/>
      <rect x="18" y="45" width="32" height="70" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
      <rect x="54" y="35" width="42" height="80" rx="4" fill="#15803d" stroke="#0f172a" stroke-width="2"/>
      <rect x="100" y="35" width="42" height="80" rx="4" fill="#ca8a04" stroke="#0f172a" stroke-width="2"/>
      <rect x="146" y="35" width="48" height="80" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>

      <!-- Plant on Shelf 1 -->
      <g transform="translate(200, 45)">
        <polygon points="12,70 42,70 48,40 6,40" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <ellipse cx="27" cy="40" rx="21" ry="5" fill="#f1f5f9"/>
        <path d="M 27 38 C 15 18 5 22 -2 32 C 10 40 20 40 27 38 Z" fill="#4ade80"/>
        <path d="M 27 38 C 25 10 38 6 44 18 C 38 30 32 36 27 38 Z" fill="#22c55e"/>
        <path d="M 27 38 C 16 28 22 2 27 -6 C 35 2 38 28 27 38 Z" fill="#16a34a"/>
        <path d="M 27 38 C 38 24 55 22 62 32 C 48 40 36 40 27 38 Z" fill="#86efac"/>
      </g>

      <!-- Shelf 2 (Kraft Pouches) -->
      <rect x="0" y="275" width="314" height="22" rx="4" fill="url(#shelfWood)" stroke="#2b1a10" stroke-width="2"/>
      <rect x="15" y="175" width="38" height="100" rx="5" fill="#ca8a04" stroke="#0f172a" stroke-width="2"/>
      <rect x="57" y="175" width="38" height="100" rx="5" fill="#ca8a04" stroke="#0f172a" stroke-width="2"/>
      <rect x="99" y="170" width="48" height="105" rx="5" fill="#ca8a04" stroke="#0f172a" stroke-width="2"/>
      <rect x="151" y="165" width="55" height="110" rx="5" fill="#06b6d4" stroke="#0f172a" stroke-width="2"/>
      <rect x="210" y="160" width="60" height="115" rx="5" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>

      <!-- Shelf 3 (Herbal Bottles & Tins) -->
      <rect x="0" y="445" width="314" height="22" rx="4" fill="url(#shelfWood)" stroke="#2b1a10" stroke-width="2"/>
      <rect x="12" y="340" width="44" height="105" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
      <rect x="60" y="340" width="46" height="105" rx="4" fill="#059669" stroke="#0f172a" stroke-width="2"/>
      <rect x="110" y="340" width="46" height="105" rx="4" fill="#10b981" stroke="#0f172a" stroke-width="2"/>
      <rect x="160" y="350" width="52" height="95" rx="4" fill="#b45309" stroke="#0f172a" stroke-width="2"/>
      <rect x="216" y="355" width="60" height="90" rx="4" fill="#78350f" stroke="#0f172a" stroke-width="2"/>

      <!-- Shelf 4 (Green & White Supplement Bottles) -->
      <rect x="0" y="605" width="314" height="22" rx="4" fill="url(#shelfWood)" stroke="#2b1a10" stroke-width="2"/>
      <rect x="15" y="495" width="32" height="110" rx="6" fill="#15803d" stroke="#0f172a" stroke-width="2"/>
      <rect x="51" y="495" width="34" height="110" rx="6" fill="#15803d" stroke="#0f172a" stroke-width="2"/>
      <rect x="89" y="505" width="34" height="100" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      <rect x="127" y="505" width="34" height="100" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      <rect x="165" y="510" width="38" height="95" rx="6" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
    </g>

    <!-- 5. MARIÉ - Center Avatar Figure (High Fidelity Semi-Realistic Illustration) -->
    <g id="marieFigureAvatar" filter="url(#figureShadow)">
      
      <!-- Hair Back Volume -->
      <path d="M 360 260 C 290 310 260 420 280 540 C 300 580 350 615 410 615 C 425 570 395 460 395 400 Z" fill="url(#hairDarkBrown)" stroke="#140603" stroke-width="4"/>
      <path d="M 720 260 C 790 310 820 420 800 540 C 780 580 730 615 670 615 C 655 570 685 460 685 400 Z" fill="url(#hairDarkBrown)" stroke="#140603" stroke-width="4"/>

      <!-- White Coat / Blazer Shoulders & Torso -->
      <path d="M 230 720 C 260 550 380 490 470 480 L 660 480 C 750 490 870 550 900 720 L 960 1024 L 170 1024 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4.5"/>
      
      <!-- Inner White Blouse (Crew Neck) -->
      <path d="M 460 490 Q 565 560 670 490 L 690 730 L 440 730 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

      <!-- Neck & Throat -->
      <path d="M 490 390 L 490 515 Q 565 555 640 515 L 640 390 Z" fill="url(#skinRadiant)" stroke="#0f172a" stroke-width="4"/>
      <path d="M 492 390 Q 565 450 638 390 Q 565 510 492 390 Z" fill="#e29f80" stroke="#0f172a" stroke-width="1.5"/>

      <!-- Head & Facial Features -->
      <g id="headGroup">
        <!-- Oval Face Shape -->
        <path d="M 425 300 C 415 180 490 120 565 120 C 640 120 715 180 705 300 C 695 390 645 460 565 460 C 485 460 435 390 425 300 Z" fill="url(#skinRadiant)" stroke="#0f172a" stroke-width="4.5"/>
        
        <!-- Subtle Rosy Cheek Glow -->
        <ellipse cx="475" cy="340" rx="38" ry="18" fill="url(#cheeksRosy)"/>
        <ellipse cx="655" cy="340" rx="38" ry="18" fill="url(#cheeksRosy)"/>

        <!-- Ears -->
        <path d="M 425 300 C 405 285 405 340 427 355 Z" fill="#fab89a" stroke="#0f172a" stroke-width="3.5"/>
        <path d="M 705 300 C 725 285 725 340 703 355 Z" fill="#fab89a" stroke="#0f172a" stroke-width="3.5"/>

        <!-- Defined Eyebrows -->
        <path d="M 460 255 Q 498 238 535 255" stroke="#220e06" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 595 255 Q 632 238 670 255" stroke="#220e06" stroke-width="6" stroke-linecap="round" fill="none"/>

        <!-- Left Eye (Warm, Radiant, Expressive) -->
        <g transform="translate(498, 290)">
          <path d="M -30 0 Q 0 -22 30 0 Q 0 20 -30 0 Z" fill="#ffffff" stroke="#140603" stroke-width="3.5"/>
          <ellipse cx="2" cy="-1" rx="16" ry="16" fill="url(#eyeBrown)"/>
          <circle cx="2" cy="-1" r="9" fill="#000000"/>
          <circle cx="-3" cy="-6" r="4.5" fill="#ffffff"/>
          <circle cx="6" cy="4" r="2.5" fill="#ffffff" opacity="0.85"/>
          <path d="M -34 0 Q 0 -24 34 0" stroke="#0d0402" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <path d="M 22 -14 L 32 -22" stroke="#0d0402" stroke-width="4" stroke-linecap="round"/>
          <path d="M -24 3 Q 0 16 24 3" stroke="#b87254" stroke-width="2" fill="none"/>
        </g>

        <!-- Right Eye -->
        <g transform="translate(632, 290)">
          <path d="M -30 0 Q 0 -22 30 0 Q 0 20 -30 0 Z" fill="#ffffff" stroke="#140603" stroke-width="3.5"/>
          <ellipse cx="-2" cy="-1" rx="16" ry="16" fill="url(#eyeBrown)"/>
          <circle cx="-2" cy="-1" r="9" fill="#000000"/>
          <circle cx="-6" cy="-6" r="4.5" fill="#ffffff"/>
          <circle cx="3" cy="4" r="2.5" fill="#ffffff" opacity="0.85"/>
          <path d="M -34 0 Q 0 -24 34 0" stroke="#0d0402" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <path d="M -22 -14 L -32 -22" stroke="#0d0402" stroke-width="4" stroke-linecap="round"/>
          <path d="M -24 3 Q 0 16 24 3" stroke="#b87254" stroke-width="2" fill="none"/>
        </g>

        <!-- Nose -->
        <path d="M 565 285 Q 560 342 546 354 Q 565 364 584 354" stroke="#ba694b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="548" cy="352" rx="4" ry="2.5" fill="#9e4b2d"/>
        <ellipse cx="582" cy="352" rx="4" ry="2.5" fill="#9e4b2d"/>

        <!-- Warm Friendly Smile -->
        <g transform="translate(565, 388)">
          <path d="M -54 0 Q 0 42 54 0 Q 0 -8 -54 0 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M -48 0 Q 0 28 48 0 Q 0 -4 -48 0 Z" fill="#ffffff"/>
          <path d="M -30 22 Q 0 34 30 22" stroke="#f43f5e" stroke-width="4.5" stroke-linecap="round" fill="none"/>
          <path d="M -56 -3 C -54 4 -51 10 -47 14" stroke="#a14906" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M 56 -3 C 54 4 51 10 47 14" stroke="#a14906" stroke-width="3" stroke-linecap="round" fill="none"/>
        </g>
      </g>

      <!-- Hair Front & Styled Bob Cut -->
      <g id="hairFront">
        <path d="M 420 270 C 405 150 475 75 565 75 C 655 75 725 150 710 270 C 730 345 730 450 695 510 C 670 455 675 370 665 300 C 645 200 595 170 535 180 C 475 190 450 255 445 330 C 440 395 445 465 425 510 C 400 450 405 340 420 270 Z" fill="url(#hairDarkBrown)" stroke="#140603" stroke-width="4.5"/>
        <path d="M 540 80 C 465 90 415 140 408 220 C 400 300 405 410 385 485 C 400 475 420 420 425 350 C 432 270 448 190 540 145 Z" fill="url(#hairSheen)" stroke="#140603" stroke-width="3.5"/>
        <path d="M 570 80 C 645 90 700 145 705 225 C 712 305 715 415 735 485 C 720 475 700 420 692 350 C 685 265 665 190 570 145 Z" fill="url(#hairSheen)" stroke="#140603" stroke-width="3.5"/>
        <!-- Hair Glossy Highlight Curves -->
        <path d="M 460 140 Q 555 105 650 140 Q 555 125 460 140 Z" fill="#8f5139" opacity="0.8"/>
        <path d="M 475 145 Q 555 115 635 145" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
      </g>

      <!-- Tailored Doctor Lab Coat Lapels & Folded Arms -->
      <g id="coatDetails">
        <!-- Lapels -->
        <path d="M 465 480 L 400 730 L 535 850 L 565 610 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4"/>
        <path d="M 400 730 L 465 480 L 505 480 L 555 700 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M 665 480 L 730 730 L 595 850 L 565 610 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4"/>
        <path d="M 730 730 L 665 480 L 625 480 L 575 700 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        
        <!-- Sleeves -->
        <path d="M 270 690 C 280 550 385 500 465 480 L 495 605 L 355 830 C 300 810 265 750 270 690 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4"/>
        <path d="M 860 690 C 850 550 745 500 665 480 L 635 605 L 775 830 C 830 810 865 750 860 690 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4"/>
        
        <!-- Crossed Arms Fold -->
        <path d="M 330 780 C 400 770 565 760 740 850 C 695 930 535 950 365 920 C 320 880 315 825 330 780 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4"/>
        <path d="M 790 780 C 725 770 565 760 395 850 C 440 930 600 950 770 920 C 810 880 815 825 790 780 Z" fill="url(#coatCleanWhite)" stroke="#09131f" stroke-width="4"/>

        <!-- Hands gently resting on forearms -->
        <g transform="translate(370, 840)">
          <path d="M 0 0 C -25 5 -35 25 -25 55 C -10 75 25 80 50 65 C 65 48 45 20 0 0 Z" fill="url(#skinRadiant)" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M -12 28 Q 15 32 38 42" stroke="#a45337" stroke-width="2.5" fill="none"/>
          <path d="M -6 44 Q 18 48 40 56" stroke="#a45337" stroke-width="2.5" fill="none"/>
          <path d="M 0 60 Q 22 62 42 68" stroke="#a45337" stroke-width="2.5" fill="none"/>
        </g>
        <g transform="translate(760, 840)">
          <path d="M 0 0 C 25 5 35 25 25 55 C 10 75 -25 80 -50 65 C -65 48 -45 20 0 0 Z" fill="url(#skinRadiant)" stroke="#0f172a" stroke-width="3.5"/>
          <path d="M 12 28 Q -15 32 -38 42" stroke="#a45337" stroke-width="2.5" fill="none"/>
          <path d="M 6 44 Q -18 48 -40 56" stroke="#a45337" stroke-width="2.5" fill="none"/>
          <path d="M 0 60 Q -22 62 -42 68" stroke="#a45337" stroke-width="2.5" fill="none"/>
        </g>

        <!-- Official Name Badge: [ MARIÉ ] on Left Chest -->
        <g transform="translate(650, 655)" filter="url(#figureShadow)">
          <rect x="-60" y="-20" width="120" height="40" rx="8" fill="#f8fafc" stroke="#09131f" stroke-width="3.5"/>
          <text 
            x="0" 
            y="7" 
            text-anchor="middle" 
            font-family="'Montserrat', 'Arial Black', sans-serif" 
            font-size="20" 
            font-weight="900" 
            letter-spacing="4px" 
            fill="#09131f"
          >
            MARIÉ
          </text>
        </g>
      </g>
    </g>

    <!-- Outer Circular Border Ring (Subtle Cyan & White Glow Ring) -->
    <circle cx="512" cy="512" r="498" fill="none" stroke="#00e5ff" stroke-width="6" opacity="0.85" filter="url(#neonGlow)"/>
    <circle cx="512" cy="512" r="498" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.95"/>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  const distDir = path.resolve('dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write the new Circulo Marie SVG
  fs.writeFileSync(path.join(publicDir, 'circulo-marie.svg'), circuloMarieSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-caricatura.svg'), circuloMarieSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-avatar.svg'), circuloMarieSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-photo.svg'), circuloMarieSvg);
  console.log('Saved new Circulo Marie SVG files');

  // 2. Generate WebP, PNG, and JPEG files at various resolutions
  const svgBuffer = Buffer.from(circuloMarieSvg);

  const targets = [
    'Circulo Marie.jpg',
    'Circulo Marie.png',
    'Circulo Marie.jpeg',
    'circulo-marie.jpg',
    'circulo-marie.png',
    'circulo-marie.webp',
    'Marie JPG App.jpg',
    'Marie Caricatura App Fondo Plano.jpeg',
    'Marié Caricatura App Fondo Plano.jpeg',
    'marie-caricatura-fondo-plano.webp',
    'marie-caricatura-fondo-plano.png',
    'Marié Caricatura App webs.webp',
    'Marie Caricatura App webs.webp',
    'marie-caricatura.webp',
    'marie-avatar.webp',
    'Marié Caricatura App.jpeg',
    'Marie Caricatura App.jpeg',
    'marie-caricatura.png',
    'marie-avatar.png',
    'marie-hero.png',
    'marie-photo.jpg'
  ];

  for (const filename of targets) {
    const ext = path.extname(filename).toLowerCase();
    const filePath = path.join(publicDir, filename);

    if (ext === '.webp') {
      await sharp(svgBuffer).resize(1024, 1024).webp({ quality: 98 }).toFile(filePath);
    } else if (ext === '.png') {
      await sharp(svgBuffer).resize(1024, 1024).png({ quality: 100 }).toFile(filePath);
    } else if (ext === '.jpeg' || ext === '.jpg') {
      await sharp(svgBuffer).resize(1024, 1024).jpeg({ quality: 98 }).toFile(filePath);
    }
  }

  // Also sync to dist if dist exists
  if (fs.existsSync(distDir)) {
    for (const filename of targets) {
      const src = path.join(publicDir, filename);
      const dest = path.join(distDir, filename);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }
  }

  console.log('Successfully generated and synced all Circulo Marie image assets (jpg, png, webp)!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

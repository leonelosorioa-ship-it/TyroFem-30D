import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// High-Fidelity Vector & Bitmap matching the new "Marié Caricatura App.jpeg"
const marieCaricaturaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Background Gradient (Muted Blue/Teal Room) -->
    <linearGradient id="bgWall" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#416979"/>
      <stop offset="50%" stop-color="#335665"/>
      <stop offset="100%" stop-color="#233e4b"/>
    </linearGradient>

    <!-- Neon Glow Filter -->
    <filter id="neonCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.25"/>
    </filter>

    <!-- Wood Shelf Gradients -->
    <linearGradient id="woodShelf" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d7a168"/>
      <stop offset="40%" stop-color="#b87f48"/>
      <stop offset="100%" stop-color="#8d5b2d"/>
    </linearGradient>

    <!-- Skin Gradients (Warm Animated Tone) -->
    <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fee3d3"/>
      <stop offset="60%" stop-color="#fdd1bc"/>
      <stop offset="100%" stop-color="#f6b89c"/>
    </linearGradient>

    <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f87171" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#f87171" stop-opacity="0"/>
    </radialGradient>

    <!-- Hair Rich Brown Gradients -->
    <linearGradient id="hairMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d2218"/>
      <stop offset="35%" stop-color="#542e20"/>
      <stop offset="70%" stop-color="#381d14"/>
      <stop offset="100%" stop-color="#241009"/>
    </linearGradient>

    <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a4633"/>
      <stop offset="100%" stop-color="#4d281a"/>
    </linearGradient>

    <!-- Coat Gradients -->
    <linearGradient id="coatWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="75%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#dbe3eb"/>
    </linearGradient>

    <linearGradient id="coatShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d1d9e2"/>
      <stop offset="100%" stop-color="#b4c2ce"/>
    </linearGradient>

    <!-- Eye Gradient -->
    <radialGradient id="eyeIris" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#6e3919"/>
      <stop offset="50%" stop-color="#451e0b"/>
      <stop offset="100%" stop-color="#1e0a02"/>
    </radialGradient>
  </defs>

  <!-- 1. Background Interior -->
  <rect width="1024" height="1024" fill="url(#bgWall)"/>

  <!-- Left Back Counter with Cyan Strip -->
  <rect x="0" y="550" width="300" height="22" fill="#2d4957"/>
  <rect x="140" y="550" width="160" height="8" fill="#00e5ff" filter="url(#neonCyanGlow)"/>
  <rect x="140" y="550" width="160" height="4" fill="#ffffff"/>

  <!-- Potted Plant on Back Counter -->
  <g transform="translate(195, 435)">
    <!-- Pot -->
    <polygon points="12,85 52,85 58,50 6,50" fill="#cbd5e1" stroke="#334155" stroke-width="2.5"/>
    <ellipse cx="32" cy="50" rx="27" ry="6" fill="#e2e8f0" stroke="#334155" stroke-width="2.5"/>
    <!-- Leaves -->
    <path d="M 32 48 C 20 25 5 28 -2 38 C 12 48 24 50 32 48 Z" fill="#4ade80" stroke="#166534" stroke-width="2"/>
    <path d="M 32 48 C 30 15 45 10 52 24 C 44 38 38 45 32 48 Z" fill="#22c55e" stroke="#166534" stroke-width="2"/>
    <path d="M 32 48 C 18 35 25 5 32 -5 C 40 5 44 35 32 48 Z" fill="#16a34a" stroke="#15803d" stroke-width="2"/>
    <path d="M 32 48 C 45 32 65 30 72 42 C 58 50 42 49 32 48 Z" fill="#86efac" stroke="#166534" stroke-width="2"/>
  </g>

  <!-- Left Shelves with Supplements & "Tyruss Full" -->
  <g id="leftShelves">
    <!-- Shelf 1 (Top left) -->
    <rect x="0" y="450" width="170" height="18" rx="3" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2"/>
    <rect x="0" y="452" width="170" height="4" fill="#fde68a" opacity="0.6"/>
    <!-- Top small bottles -->
    <g transform="translate(0, 365)">
      <!-- White bottle 1 -->
      <rect x="0" y="35" width="30" height="50" rx="5" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
      <rect x="0" y="52" width="30" height="22" fill="#0284c7"/>
      <!-- White bottle 2 -->
      <rect x="34" y="38" width="18" height="47" rx="3" fill="#f8fafc" stroke="#1e293b" stroke-width="2"/>
      <rect x="54" y="38" width="18" height="47" rx="3" fill="#f8fafc" stroke="#1e293b" stroke-width="2"/>
      <rect x="74" y="38" width="18" height="47" rx="3" fill="#f8fafc" stroke="#1e293b" stroke-width="2"/>
      <rect x="94" y="38" width="20" height="47" rx="3" fill="#f8fafc" stroke="#1e293b" stroke-width="2"/>
    </g>

    <!-- Shelf 2 (Middle left) with Tyruss Full tubs -->
    <rect x="0" y="575" width="170" height="18" rx="3" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2"/>
    <rect x="0" y="577" width="170" height="4" fill="#fde68a" opacity="0.6"/>
    <g transform="translate(0, 505)">
      <rect x="0" y="10" width="22" height="60" rx="4" fill="#047857" stroke="#1e293b" stroke-width="2.5"/>
      <rect x="23" y="12" width="28" height="58" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
      <rect x="53" y="12" width="26" height="58" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
      <rect x="81" y="12" width="26" height="58" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
      <rect x="109" y="14" width="26" height="56" rx="4" fill="#f8fafc" stroke="#1e293b" stroke-width="2.5"/>
    </g>

    <!-- Shelf 3 (Lower left) with BIG TYRUSS FULL TUBS -->
    <rect x="0" y="750" width="190" height="22" rx="3" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="752" width="190" height="5" fill="#fde68a" opacity="0.6"/>
    <!-- Metal legs structure -->
    <rect x="155" y="772" width="16" height="252" fill="#1e293b"/>
    <rect x="135" y="795" width="36" height="12" fill="#334155"/>

    <!-- Tub 1: Tyruss Full -->
    <g transform="translate(48, 615)">
      <rect x="0" y="20" width="102" height="115" rx="14" fill="#181c24" stroke="#000000" stroke-width="3"/>
      <rect x="10" y="6" width="82" height="16" rx="5" fill="#0f172a" stroke="#000000" stroke-width="3"/>
      <!-- Label -->
      <rect x="6" y="55" width="90" height="58" rx="4" fill="#2d3748"/>
      <rect x="6" y="98" width="90" height="8" fill="#00e5ff"/>
      <text x="51" y="80" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="900" fill="#ffffff">
        Tyruss
      </text>
      <text x="51" y="93" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="800" fill="#00e5ff">
        Full
      </text>
    </g>
    <!-- Tub 0: Tyruss left peek -->
    <g transform="translate(0, 625)">
      <rect x="-20" y="20" width="70" height="105" rx="12" fill="#181c24" stroke="#000000" stroke-width="3"/>
      <text x="15" y="80" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="900" fill="#ffffff">
        yruss
      </text>
    </g>

    <!-- Bottom White Bottles -->
    <g transform="translate(0, 845)">
      <rect x="0" y="30" width="48" height="85" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
      <rect x="5" y="55" width="38" height="38" fill="#38bdf8" opacity="0.3"/>
      <rect x="52" y="30" width="52" height="85" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
      <rect x="57" y="55" width="42" height="38" fill="#38bdf8" opacity="0.3"/>
      <rect x="108" y="25" width="55" height="90" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
      <rect x="113" y="52" width="45" height="40" fill="#38bdf8" opacity="0.3"/>
    </g>
  </g>

  <!-- 2. Neon ColShopi Logo in Background -->
  <g transform="translate(200, 230)">
    <!-- Neon Outer Cyan Ring -->
    <circle cx="0" cy="0" r="175" fill="#091b24" stroke="#00f0ff" stroke-width="12" filter="url(#neonCyanGlow)"/>
    <circle cx="0" cy="0" r="175" fill="none" stroke="#ffffff" stroke-width="3.5" opacity="0.9"/>
    
    <!-- Neon Script: Colshopi -->
    <text x="0" y="-14" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="95" font-weight="700" fill="#00f0ff" filter="url(#neonCyanGlow)">
      Colshopi
    </text>
    <text x="0" y="-14" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="95" font-weight="700" fill="#ffffff">
      Colshopi
    </text>

    <!-- Tienda -->
    <line x1="-120" y1="26" x2="-68" y2="26" stroke="#00f0ff" stroke-width="4.5" stroke-linecap="round" filter="url(#neonCyanGlow)"/>
    <line x1="-120" y1="26" x2="-68" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <text x="0" y="34" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="22" font-weight="800" letter-spacing="5px" fill="#ffffff">
      TIENDA
    </text>
    <line x1="68" y1="26" x2="120" y2="26" stroke="#00f0ff" stroke-width="4.5" stroke-linecap="round" filter="url(#neonCyanGlow)"/>
    <line x1="68" y1="26" x2="120" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>

    <!-- By Leps Digital -->
    <text x="0" y="80" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="36" font-weight="700" fill="#ffffff" filter="url(#neonCyanGlow)">
      By Leps Digital
    </text>
    <text x="0" y="80" text-anchor="middle" font-family="'Brush Script MT', 'Dancing Script', cursive, sans-serif" font-size="36" font-weight="700" fill="#ffffff">
      By Leps Digital
    </text>
  </g>

  <!-- Right Shelves Background -->
  <g id="rightShelves" transform="translate(710, 0)">
    <!-- Vertical Support Beam -->
    <rect x="40" y="0" width="16" height="1024" fill="#1e293b"/>

    <!-- Shelf 1 (Top) -->
    <rect x="0" y="80" width="314" height="24" rx="4" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="82" width="314" height="6" fill="#fde68a" opacity="0.6"/>
    <!-- Jars & pouches -->
    <rect x="20" y="10" width="34" height="68" rx="4" fill="#1e3a5f" stroke="#0f172a" stroke-width="2"/>
    <rect x="60" y="0" width="45" height="78" rx="4" fill="#854d0e" stroke="#0f172a" stroke-width="2"/>
    <rect x="110" y="0" width="45" height="78" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
    <rect x="160" y="0" width="55" height="78" rx="4" fill="#d97706" stroke="#0f172a" stroke-width="2"/>

    <!-- Shelf 2 -->
    <rect x="0" y="245" width="314" height="24" rx="4" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="247" width="314" height="6" fill="#fde68a" opacity="0.6"/>
    <!-- Potted Plant on shelf -->
    <g transform="translate(90, 140)">
      <polygon points="18,100 68,100 74,60 12,60" fill="#ffffff" stroke="#334155" stroke-width="2.5"/>
      <ellipse cx="43" cy="60" rx="31" ry="7" fill="#f1f5f9" stroke="#334155" stroke-width="2.5"/>
      <path d="M 43 58 C 25 30 10 35 2 48 C 18 60 34 60 43 58 Z" fill="#4ade80" stroke="#166534" stroke-width="2.5"/>
      <path d="M 43 58 C 40 18 60 12 70 28 C 60 45 52 54 43 58 Z" fill="#22c55e" stroke="#166534" stroke-width="2.5"/>
      <path d="M 43 58 C 24 40 34 5 43 -8 C 54 5 60 40 43 58 Z" fill="#16a34a" stroke="#15803d" stroke-width="2.5"/>
      <path d="M 43 58 C 60 38 85 36 94 50 C 76 60 56 59 43 58 Z" fill="#86efac" stroke="#166534" stroke-width="2.5"/>
    </g>
    <!-- Jars around plant -->
    <rect x="22" y="170" width="36" height="72" rx="6" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="58" y="175" width="28" height="67" rx="5" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="180" y="180" width="55" height="62" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
    <rect x="238" y="172" width="38" height="70" rx="6" fill="#15803d" stroke="#0f172a" stroke-width="2.5"/>

    <!-- Shelf 3 (Pouches) -->
    <rect x="0" y="425" width="314" height="24" rx="4" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="427" width="314" height="6" fill="#fde68a" opacity="0.6"/>
    <!-- Pouches -->
    <rect x="20" y="325" width="32" height="98" rx="4" fill="#d97706" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="54" y="325" width="34" height="98" rx="4" fill="#d97706" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="90" y="325" width="62" height="98" rx="5" fill="#ca8a04" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="155" y="310" width="60" height="112" rx="5" fill="#06b6d4" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="218" y="305" width="65" height="117" rx="5" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>

    <!-- Shelf 4 -->
    <rect x="0" y="585" width="314" height="24" rx="4" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="587" width="314" height="6" fill="#fde68a" opacity="0.6"/>
    <!-- Green and brown items -->
    <rect x="12" y="475" width="46" height="106" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
    <rect x="62" y="475" width="48" height="106" rx="4" fill="#059669" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="114" y="475" width="48" height="106" rx="4" fill="#10b981" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="165" y="490" width="55" height="92" rx="4" fill="#b45309" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="225" y="495" width="65" height="87" rx="4" fill="#78350f" stroke="#0f172a" stroke-width="2.5"/>

    <!-- Shelf 5 (Supplements) -->
    <rect x="0" y="745" width="314" height="24" rx="4" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="747" width="314" height="6" fill="#fde68a" opacity="0.6"/>
    <rect x="15" y="635" width="32" height="108" rx="6" fill="#15803d" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="50" y="635" width="34" height="108" rx="6" fill="#15803d" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="88" y="642" width="34" height="100" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="125" y="642" width="34" height="100" rx="6" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="162" y="648" width="38" height="94" rx="6" fill="#e2e8f0" stroke="#0f172a" stroke-width="2.5"/>

    <!-- Shelf 6 (Bottom) -->
    <rect x="0" y="905" width="314" height="24" rx="4" fill="url(#woodShelf)" stroke="#3f2719" stroke-width="2.5"/>
    <rect x="0" y="907" width="314" height="6" fill="#fde68a" opacity="0.6"/>
    <rect x="15" y="755" width="48" height="148" rx="8" fill="#047857" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="68" y="775" width="38" height="128" rx="8" fill="#0284c7" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="110" y="780" width="38" height="122" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
    <rect x="152" y="780" width="38" height="122" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
  </g>

  <!-- 3. Marié - Illustration Figure (Semi-Realistic Caricature Style) -->
  <g id="marieFigureCaricatura" filter="url(#subtleShadow)">
    
    <!-- Hair Back Layers -->
    <path d="M 370 280 C 310 320 280 430 300 540 C 320 580 370 610 430 610 C 440 570 410 460 410 400 Z" fill="url(#hairMain)" stroke="#1a0a04" stroke-width="4"/>
    <path d="M 720 280 C 780 320 810 430 790 540 C 770 580 720 610 660 610 C 650 570 680 460 680 400 Z" fill="url(#hairMain)" stroke="#1a0a04" stroke-width="4"/>

    <!-- White Blazer Torso Base -->
    <path d="M 270 700 C 300 560 410 520 490 510 L 660 510 C 740 520 850 560 880 700 L 920 1024 L 230 1024 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>
    
    <!-- White Inner Blouse / Crew Neck Top -->
    <path d="M 480 520 Q 575 580 670 520 L 690 750 L 460 750 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5"/>

    <!-- Neck & Throat -->
    <path d="M 500 420 L 500 535 Q 575 570 650 535 L 650 420 Z" fill="url(#skinTone)" stroke="#0f172a" stroke-width="4"/>
    <!-- Neck shadow under chin -->
    <path d="M 502 420 Q 575 480 648 420 Q 575 530 502 420 Z" fill="#e2a082" stroke="#0f172a" stroke-width="2"/>

    <!-- 4. Head & Face (Clean Line Art & Expressive Features) -->
    <g id="faceGroup">
      <!-- Face Base Shape -->
      <path d="M 440 330 C 430 210 500 150 575 150 C 650 150 720 210 710 330 C 700 415 650 480 575 480 C 500 480 450 415 440 330 Z" fill="url(#skinTone)" stroke="#0f172a" stroke-width="4.5"/>
      
      <!-- Rosy Cheeks Blush -->
      <ellipse cx="485" cy="365" rx="38" ry="20" fill="url(#cheekBlush)"/>
      <ellipse cx="665" cy="365" rx="38" ry="20" fill="url(#cheekBlush)"/>

      <!-- Delicate Ears -->
      <path d="M 440 330 C 420 315 420 370 442 385 Z" fill="#fbbfa3" stroke="#0f172a" stroke-width="3.5"/>
      <path d="M 710 330 C 730 315 730 370 708 385 Z" fill="#fbbfa3" stroke="#0f172a" stroke-width="3.5"/>

      <!-- Eyebrows (Expressive Dark Arches) -->
      <path d="M 470 285 Q 508 268 545 285" stroke="#241009" stroke-width="6.5" stroke-linecap="round" fill="none"/>
      <path d="M 605 285 Q 642 268 680 285" stroke="#241009" stroke-width="6.5" stroke-linecap="round" fill="none"/>

      <!-- Left Eye (Big Expressive Cartoon/Anime Style) -->
      <g transform="translate(508, 318)">
        <!-- Sclera -->
        <path d="M -30 0 Q 0 -22 30 0 Q 0 20 -30 0 Z" fill="#ffffff" stroke="#1a0a04" stroke-width="3.5"/>
        <!-- Iris -->
        <ellipse cx="2" cy="-1" rx="17" ry="17" fill="url(#eyeIris)"/>
        <!-- Pupil -->
        <circle cx="2" cy="-1" r="10" fill="#000000"/>
        <!-- Highlights -->
        <circle cx="-3" cy="-6" r="5" fill="#ffffff"/>
        <circle cx="7" cy="4" r="2.5" fill="#ffffff" opacity="0.85"/>
        <!-- Upper Eyelid & Bold Lashes -->
        <path d="M -34 0 Q 0 -25 34 0" stroke="#120502" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 22 -14 L 32 -22" stroke="#120502" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Lower eyelid -->
        <path d="M -24 3 Q 0 18 24 3" stroke="#c27d60" stroke-width="2.5" fill="none"/>
        <!-- Eyelid crease above -->
        <path d="M -22 -20 Q 0 -28 22 -20" stroke="#b46e50" stroke-width="2.5" fill="none"/>
      </g>

      <!-- Right Eye (Big Expressive Cartoon/Anime Style) -->
      <g transform="translate(642, 318)">
        <!-- Sclera -->
        <path d="M -30 0 Q 0 -22 30 0 Q 0 20 -30 0 Z" fill="#ffffff" stroke="#1a0a04" stroke-width="3.5"/>
        <!-- Iris -->
        <ellipse cx="-2" cy="-1" rx="17" ry="17" fill="url(#eyeIris)"/>
        <!-- Pupil -->
        <circle cx="-2" cy="-1" r="10" fill="#000000"/>
        <!-- Highlights -->
        <circle cx="-7" cy="-6" r="5" fill="#ffffff"/>
        <circle cx="3" cy="4" r="2.5" fill="#ffffff" opacity="0.85"/>
        <!-- Upper Eyelid & Bold Lashes -->
        <path d="M -34 0 Q 0 -25 34 0" stroke="#120502" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M -22 -14 L -32 -22" stroke="#120502" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Lower eyelid -->
        <path d="M -24 3 Q 0 18 24 3" stroke="#c27d60" stroke-width="2.5" fill="none"/>
        <!-- Eyelid crease above -->
        <path d="M -22 -20 Q 0 -28 22 -20" stroke="#b46e50" stroke-width="2.5" fill="none"/>
      </g>

      <!-- Nose (Cute Defined Stroke) -->
      <path d="M 570 315 Q 565 372 552 384 Q 575 394 598 384" stroke="#c27255" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="554" cy="382" rx="4" ry="2.5" fill="#a45337"/>
      <ellipse cx="594" cy="382" rx="4" ry="2.5" fill="#a45337"/>

      <!-- Mouth (Warm Enthusiastic Smile with Bright White Teeth) -->
      <g transform="translate(575, 418)">
        <!-- Outer Lip Path -->
        <path d="M -54 0 Q 0 42 54 0 Q 0 -8 -54 0 Z" fill="#e11d48" stroke="#0f172a" stroke-width="4"/>
        <!-- Teeth (White Arch) -->
        <path d="M -48 0 Q 0 28 48 0 Q 0 -4 -48 0 Z" fill="#ffffff"/>
        <!-- Lower Lip Plump Underline -->
        <path d="M -30 22 Q 0 34 30 22" stroke="#f43f5e" stroke-width="5" stroke-linecap="round" fill="none"/>
        <!-- Smile Corners Dimples -->
        <path d="M -57 -3 C -55 4 -52 10 -48 14" stroke="#b45309" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 57 -3 C 55 4 52 10 48 14" stroke="#b45309" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </g>
    </g>

    <!-- 5. Hair Front (Smooth Bob Cut with Glossy Sheen) -->
    <g id="hairFrontGroup">
      <!-- Main Front Volume -->
      <path d="M 435 300 C 420 180 485 105 575 105 C 665 105 730 180 715 300 C 735 375 735 480 700 540 C 675 485 680 400 670 330 C 650 230 600 200 540 210 C 480 220 455 285 450 360 C 445 425 450 495 430 540 C 405 480 410 370 435 300 Z" fill="url(#hairMain)" stroke="#1a0a04" stroke-width="4.5"/>
      
      <!-- Side Strands -->
      <path d="M 550 110 C 475 120 425 170 418 250 C 410 330 415 440 395 515 C 410 505 430 450 435 380 C 442 300 458 220 550 175 Z" fill="url(#hairHighlight)" stroke="#1a0a04" stroke-width="3.5"/>

      <path d="M 580 110 C 655 120 710 175 715 255 C 722 335 725 445 745 515 C 730 505 710 450 702 380 C 695 295 675 220 580 175 Z" fill="url(#hairHighlight)" stroke="#1a0a04" stroke-width="3.5"/>

      <!-- Glossy Hair Highlight Ribbons -->
      <path d="M 470 170 Q 565 135 660 170 Q 565 155 470 170 Z" fill="#9a5b42" opacity="0.8"/>
      <path d="M 485 175 Q 565 145 645 175" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
    </g>

    <!-- 6. Tailored White Doctor / Lab Blazer Coat & Arms Crossed -->
    <g id="blazerGroup">
      <!-- Left Lapel -->
      <path d="M 475 510 L 415 760 L 550 880 L 575 640 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>
      <path d="M 415 760 L 475 510 L 515 510 L 565 730 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

      <!-- Right Lapel -->
      <path d="M 675 510 L 735 760 L 600 880 L 575 640 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>
      <path d="M 735 760 L 675 510 L 635 510 L 585 730 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>

      <!-- Left Shoulder and Arm -->
      <path d="M 280 720 C 290 580 395 530 475 510 L 505 635 L 365 860 C 310 840 275 780 280 720 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>

      <!-- Right Shoulder and Arm -->
      <path d="M 870 720 C 860 580 755 530 675 510 L 645 635 L 785 860 C 840 840 875 780 870 720 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>

      <!-- Crossed Forearms Structure -->
      <path d="M 350 820 C 410 810 575 800 740 890 C 700 970 540 990 375 960 C 335 920 330 865 350 820 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>
      <path d="M 800 820 C 740 810 575 800 410 890 C 450 970 610 990 775 960 C 815 920 820 865 800 820 Z" fill="url(#coatWhite)" stroke="#0f172a" stroke-width="4"/>

      <!-- Marié's Illustrated Hands Resting on Crossed Arms -->
      <!-- Left Hand resting on right sleeve -->
      <g transform="translate(385, 875)">
        <path d="M 0 0 C -25 5 -35 25 -25 55 C -10 75 25 80 50 65 C 65 48 45 20 0 0 Z" fill="url(#skinTone)" stroke="#0f172a" stroke-width="3.5"/>
        <!-- Fingers outlines -->
        <path d="M -12 28 Q 15 32 38 42" stroke="#a45337" stroke-width="3" fill="none"/>
        <path d="M -6 44 Q 18 48 40 56" stroke="#a45337" stroke-width="3" fill="none"/>
        <path d="M 0 60 Q 22 62 42 68" stroke="#a45337" stroke-width="3" fill="none"/>
      </g>

      <!-- Right Hand resting on left sleeve -->
      <g transform="translate(765, 875)">
        <path d="M 0 0 C 25 5 35 25 25 55 C 10 75 -25 80 -50 65 C -65 48 -45 20 0 0 Z" fill="url(#skinTone)" stroke="#0f172a" stroke-width="3.5"/>
        <!-- Fingers outlines -->
        <path d="M 12 28 Q -15 32 -38 42" stroke="#a45337" stroke-width="3" fill="none"/>
        <path d="M 6 44 Q -18 48 -40 56" stroke="#a45337" stroke-width="3" fill="none"/>
        <path d="M 0 60 Q -22 62 -42 68" stroke="#a45337" stroke-width="3" fill="none"/>
      </g>

      <!-- 7. Official White Badge with Dark Border: [ MARIÉ ] on Left Chest -->
      <g transform="translate(660, 685)" filter="url(#subtleShadow)">
        <!-- White Rounded Badge Plate -->
        <rect x="-60" y="-20" width="120" height="40" rx="8" fill="#f8fafc" stroke="#0f172a" stroke-width="3.5"/>
        
        <!-- Crisp Dark Badge Label: MARIÉ -->
        <text 
          x="0" 
          y="7" 
          text-anchor="middle" 
          font-family="'Montserrat', 'Arial Black', sans-serif" 
          font-size="20" 
          font-weight="900" 
          letter-spacing="4px" 
          fill="#0f172a"
        >
          MARIÉ
        </text>
      </g>
    </g>

  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write the new Caricatura SVG
  fs.writeFileSync(path.join(publicDir, 'marie-caricatura.svg'), marieCaricaturaSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-avatar.svg'), marieCaricaturaSvg);
  fs.writeFileSync(path.join(publicDir, 'marie-photo.svg'), marieCaricaturaSvg);
  console.log('Saved new caricature SVG files');

  // 2. Generate PNG and JPEG files at various resolutions matching the attachment
  const svgBuffer = Buffer.from(marieCaricaturaSvg);

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'Marié Caricatura App.jpeg'));

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'Marie Caricatura App.jpeg'));

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'marie-caricatura.png'));

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'marie-avatar.png'));

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'marie-hero.png'));

  await sharp(svgBuffer)
    .resize(1024, 1024)
    .jpeg({ quality: 98 })
    .toFile(path.join(publicDir, 'marie-photo.jpg'));

  console.log('Successfully generated all Marié Caricatura image assets in /public');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

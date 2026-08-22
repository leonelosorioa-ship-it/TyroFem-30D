import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface MariePhotoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBadge?: boolean;
  showNeonBg?: boolean;
  className?: string;
}

export const MariePhoto: React.FC<MariePhotoProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  // Size dimensions for container
  const dimensions = {
    xs: 'w-10 h-10',
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    xl: 'w-36 h-36 sm:w-40 sm:h-40',
    hero: 'w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60',
  }[size];

  const badgeTextSize = {
    xs: 'text-[7px] px-1 py-0.2',
    sm: 'text-[8px] px-1.5 py-0.5',
    md: 'text-[9px] px-2 py-0.5',
    lg: 'text-[10px] px-2.5 py-0.5',
    xl: 'text-xs px-3 py-1',
    hero: 'text-xs px-3.5 py-1 font-bold',
  }[size];

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Outer Cyan Ambient Glow for larger sizes */}
      {(size === 'lg' || size === 'xl' || size === 'hero') && (
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-emerald-500/30 rounded-3xl blur-xl pointer-events-none animate-pulse" />
      )}

      {/* Main Container Frame */}
      <div 
        className={`relative ${dimensions} rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_4px_25px_rgba(0,229,255,0.35)] bg-[#070e14] flex items-center justify-center`}
      >
        {/* Full-Vector Photographic SVG Replica of Marié in ColShopi Tienda */}
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full object-cover object-center"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Room Lighting */}
            <radialGradient id="storeGlow" cx="25%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#0f2638" />
              <stop offset="50%" stopColor="#0a141d" />
              <stop offset="100%" stopColor="#04080d" />
            </radialGradient>

            {/* Neon Cyan Sign Glow */}
            <filter id="neonCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Hair Color Gradients */}
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3d2419" />
              <stop offset="40%" stopColor="#25140d" />
              <stop offset="100%" stopColor="#150a06" />
            </linearGradient>
            <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#5c3826" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#25140d" stopOpacity="0" />
            </linearGradient>

            {/* Skin Tones */}
            <radialGradient id="skinFace" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#ffe4d1" />
              <stop offset="70%" stopColor="#f8cfb5" />
              <stop offset="100%" stopColor="#e8b497" />
            </radialGradient>
            <linearGradient id="skinNeck" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d89f83" />
              <stop offset="100%" stopColor="#f4c4a8" />
            </linearGradient>
            <linearGradient id="skinHands" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdd9c2" />
              <stop offset="100%" stopColor="#e6ab8d" />
            </linearGradient>

            {/* White Blazer Fabric */}
            <linearGradient id="blazerMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="blazerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Neon Blue Shelf Tube */}
            <linearGradient id="neonStrip" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. SHOP BACKGROUND */}
          <rect width="500" height="500" fill="url(#storeGlow)" />

          {/* Wooden Shelves on Right & Left */}
          {/* Right Shelves */}
          <rect x="360" y="80" width="140" height="12" fill="#543826" rx="2" opacity="0.85" />
          <rect x="360" y="160" width="140" height="12" fill="#422919" rx="2" opacity="0.85" />
          <rect x="360" y="240" width="140" height="12" fill="#361f12" rx="2" opacity="0.85" />
          <rect x="360" y="320" width="140" height="12" fill="#2d190e" rx="2" opacity="0.85" />

          {/* Glowing blue neon light strip above right shelf */}
          <rect x="360" y="74" width="140" height="4" fill="url(#neonStrip)" filter="url(#neonCyanGlow)" />

          {/* Herbal bottles and packs on right shelves */}
          {/* Top shelf items */}
          <rect x="380" y="48" width="18" height="32" fill="#e2e8f0" rx="3" opacity="0.7" />
          <rect x="404" y="42" width="22" height="38" fill="#10b981" rx="4" opacity="0.8" />
          <rect x="432" y="50" width="18" height="30" fill="#f59e0b" rx="3" opacity="0.75" />
          <circle cx="475" cy="55" r="14" fill="#065f46" opacity="0.7" />

          {/* Middle shelf items (pouches) */}
          <rect x="375" y="115" width="24" height="45" fill="#d97706" rx="4" opacity="0.8" />
          <rect x="405" y="112" width="26" height="48" fill="#0284c7" rx="4" opacity="0.85" />
          <rect x="437" y="112" width="26" height="48" fill="#059669" rx="4" opacity="0.85" />
          <rect x="470" y="118" width="22" height="42" fill="#7c3aed" rx="4" opacity="0.7" />

          {/* Left background jars & bottles */}
          <rect x="0" y="220" width="120" height="12" fill="#3e2415" rx="2" opacity="0.85" />
          <rect x="0" y="300" width="120" height="12" fill="#301b0f" rx="2" opacity="0.85" />
          <rect x="0" y="380" width="120" height="12" fill="#24130a" rx="2" opacity="0.85" />

          <rect x="10" y="185" width="18" height="35" fill="#ffffff" rx="3" opacity="0.6" />
          <rect x="34" y="180" width="20" height="40" fill="#059669" rx="3" opacity="0.7" />
          <rect x="60" y="182" width="18" height="38" fill="#d97706" rx="3" opacity="0.65" />
          
          <rect x="12" y="260" width="24" height="40" fill="#0f172a" rx="4" opacity="0.8" />
          <rect x="42" y="255" width="26" height="45" fill="#047857" rx="4" opacity="0.85" />
          <rect x="74" y="260" width="24" height="40" fill="#0369a1" rx="4" opacity="0.8" />

          {/* 2. NEON CIRCULAR WALL SIGN: COLSHOPI TIENDA BY LEPS DIGITAL */}
          <g transform="translate(100, 115)">
            {/* Outer Cyan Neon Glow Ring */}
            <circle cx="0" cy="0" r="95" fill="#061924" stroke="#00e5ff" strokeWidth="6" filter="url(#neonCyanGlow)" />
            <circle cx="0" cy="0" r="95" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />

            {/* Inner Dark Background */}
            <circle cx="0" cy="0" r="92" fill="#030e16" opacity="0.95" />

            {/* Script Text: Colshopi */}
            <text 
              x="0" 
              y="-15" 
              textAnchor="middle" 
              fill="#00f5ff" 
              fontFamily="Brush Script MT, 'Segoe Script', cursive, sans-serif" 
              fontSize="46" 
              fontWeight="bold"
              letterSpacing="1"
              filter="url(#neonCyanGlow)"
            >
              Colshopi
            </text>
            <text 
              x="0" 
              y="-15" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontFamily="Brush Script MT, 'Segoe Script', cursive, sans-serif" 
              fontSize="46" 
              fontWeight="bold"
              letterSpacing="1"
            >
              Colshopi
            </text>

            {/* Divider lines & TIENDA */}
            <line x1="-70" y1="12" x2="-35" y2="12" stroke="#00e5ff" strokeWidth="2.5" />
            <text 
              x="0" 
              y="18" 
              textAnchor="middle" 
              fill="#e0f7fa" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="16" 
              fontWeight="900" 
              letterSpacing="5"
            >
              TIENDA
            </text>
            <line x1="35" y1="12" x2="70" y2="12" stroke="#00e5ff" strokeWidth="2.5" />

            {/* Subtitle: By Leps Digital */}
            <text 
              x="0" 
              y="45" 
              textAnchor="middle" 
              fill="#80deea" 
              fontFamily="Georgia, serif" 
              fontStyle="italic" 
              fontSize="15" 
              fontWeight="bold"
            >
              By Leps Digital
            </text>
          </g>

          {/* 3. MARIÉ - NUTRITIONIST PORTRAIT */}

          {/* Hair - Back Layer */}
          <path 
            d="M 180 160 C 160 210 150 280 200 320 C 220 330 280 330 300 320 C 350 280 340 210 320 160 C 300 120 200 120 180 160 Z" 
            fill="url(#hairGrad)" 
          />

          {/* Neck & Collarbone */}
          <path 
            d="M 225 240 L 225 300 C 225 315 275 315 275 300 L 275 240 Z" 
            fill="url(#skinNeck)" 
          />
          {/* Collarbone subtle shadow */}
          <path d="M 230 295 Q 250 305 270 295" stroke="#d49477" strokeWidth="2" fill="none" opacity="0.6" />

          {/* Inner White Top / Blouse */}
          <path 
            d="M 220 290 L 280 290 L 290 350 L 210 350 Z" 
            fill="#f8fafc" 
          />

          {/* Face Oval & Jawline */}
          <path 
            d="M 195 180 C 195 240 215 270 250 270 C 285 270 305 240 305 180 C 305 130 195 130 195 180 Z" 
            fill="url(#skinFace)" 
          />

          {/* Rosy Cheeks */}
          <ellipse cx="218" cy="210" rx="16" ry="9" fill="#f43f5e" opacity="0.12" />
          <ellipse cx="282" cy="210" rx="16" ry="9" fill="#f43f5e" opacity="0.12" />

          {/* Eyes & Brows */}
          {/* Eyebrows */}
          <path d="M 210 178 Q 222 173 234 177" stroke="#26150d" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 266 177 Q 278 173 290 178" stroke="#26150d" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Left Eye */}
          <ellipse cx="222" cy="188" rx="8" ry="5.5" fill="#ffffff" />
          <circle cx="222" cy="188" r="4.5" fill="#452715" />
          <circle cx="222" cy="188" r="2.2" fill="#1a0e08" />
          <circle cx="220.5" cy="186.5" r="1.5" fill="#ffffff" />
          <path d="M 214 186 Q 222 181 230 186" stroke="#26150d" strokeWidth="1.8" fill="none" />
          <path d="M 215 188 Q 222 193 229 188" stroke="#a36e53" strokeWidth="0.8" fill="none" />

          {/* Right Eye */}
          <ellipse cx="278" cy="188" rx="8" ry="5.5" fill="#ffffff" />
          <circle cx="278" cy="188" r="4.5" fill="#452715" />
          <circle cx="278" cy="188" r="2.2" fill="#1a0e08" />
          <circle cx="276.5" cy="186.5" r="1.5" fill="#ffffff" />
          <path d="M 270 186 Q 278 181 286 186" stroke="#26150d" strokeWidth="1.8" fill="none" />
          <path d="M 271 188 Q 278 193 285 188" stroke="#a36e53" strokeWidth="0.8" fill="none" />

          {/* Nose */}
          <path d="M 250 184 L 248 208 Q 250 214 254 213" stroke="#cb8f72" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="245" cy="212" rx="2" ry="1.2" fill="#ba7c5e" opacity="0.6" />
          <ellipse cx="255" cy="212" rx="2" ry="1.2" fill="#ba7c5e" opacity="0.6" />

          {/* Smile / Mouth */}
          <path d="M 235 230 Q 250 244 265 230" fill="#e11d48" opacity="0.75" />
          <path d="M 237 230 Q 250 236 263 230" fill="#ffffff" />
          <path d="M 234 229 Q 250 245 266 229" stroke="#be123c" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Hair - Front Bob Style (Distinctive cut from real photo) */}
          {/* Left Hair Swoop */}
          <path 
            d="M 250 128 C 215 125 180 150 175 195 C 170 235 180 265 200 270 C 205 272 208 260 200 240 C 192 215 198 170 240 145 Z" 
            fill="url(#hairGrad)" 
          />
          {/* Right Hair Side */}
          <path 
            d="M 250 128 C 290 125 325 150 330 200 C 335 240 325 265 305 270 C 300 272 297 260 305 240 C 312 215 306 170 260 145 Z" 
            fill="url(#hairGrad)" 
          />
          {/* Hair Top Cap & Highlights */}
          <path 
            d="M 185 160 C 190 125 230 120 250 122 C 275 120 315 125 320 160 C 300 135 260 130 250 130 C 235 130 195 138 185 160 Z" 
            fill="url(#hairHighlight)" 
          />

          {/* 4. ELEGANT WHITE BLAZER & CROSSED ARMS */}
          {/* Blazer Back Collar */}
          <path d="M 215 285 L 285 285 L 295 315 L 205 315 Z" fill="#e2e8f0" />

          {/* Shoulders & Main Torso Silhouette */}
          <path 
            d="M 140 360 C 145 315 180 295 220 290 L 280 290 C 320 295 355 315 360 360 L 390 480 C 390 500 110 500 110 480 Z" 
            fill="url(#blazerMain)" 
          />

          {/* Sharp Blazer Lapels */}
          {/* Left Lapel */}
          <polygon points="215,290 245,345 200,380 185,330" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Right Lapel */}
          <polygon points="285,290 255,345 300,380 315,330" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Blazer Seams & Shadows */}
          <path d="M 185 330 L 145 420" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 315 330 L 355 420" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.6" />

          {/* CROSSED ARMS & HANDS */}
          {/* Left Arm (Folded under) */}
          <path 
            d="M 130 380 Q 180 430 320 425 Q 350 425 365 410 L 375 440 Q 320 480 180 470 Q 125 440 120 400 Z" 
            fill="#f1f5f9" 
            stroke="#cbd5e1" 
            strokeWidth="2"
          />

          {/* Right Arm (Folded across) */}
          <path 
            d="M 370 380 Q 320 430 180 425 Q 150 425 135 410 L 125 440 Q 180 480 320 470 Q 375 440 380 400 Z" 
            fill="#ffffff" 
            stroke="#cbd5e1" 
            strokeWidth="2"
          />

          {/* Resting Hand & Fingers on Arm */}
          <g transform="translate(140, 395)">
            <rect x="0" y="0" width="35" height="18" rx="8" fill="url(#skinHands)" />
            <path d="M 6 18 L 6 8 Q 6 4 12 4 L 12 18" stroke="#d49477" strokeWidth="1" fill="none" />
            <path d="M 14 18 L 14 6 Q 14 3 20 3 L 20 18" stroke="#d49477" strokeWidth="1" fill="none" />
            <path d="M 22 18 L 22 7 Q 22 4 28 4 L 28 18" stroke="#d49477" strokeWidth="1" fill="none" />
          </g>

          {/* 5. BLACK NAMETAG ON CHEST: "MARIÉ" (Exact replica from real photo) */}
          <g transform="translate(290, 335)">
            {/* Nametag Shadow & Outer Border */}
            <rect 
              x="-2" 
              y="-2" 
              width="68" 
              height="28" 
              rx="4" 
              fill="#000000" 
              stroke="#334155" 
              strokeWidth="1.5" 
            />
            {/* Glossy Reflection Highlight */}
            <rect 
              x="0" 
              y="0" 
              width="64" 
              height="12" 
              rx="2" 
              fill="#ffffff" 
              opacity="0.12" 
            />
            {/* Crisp Bold White Typography: MARIÉ */}
            <text 
              x="32" 
              y="17" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontSize="12" 
              fontWeight="900" 
              letterSpacing="2"
            >
              MARIÉ
            </text>
          </g>
        </svg>

        {/* Real Official Badge at bottom */}
        {showBadge && (
          <div className="absolute bottom-1.5 z-20">
            <span className={`${badgeTextSize} font-bold rounded-full bg-slate-950/90 text-cyan-300 border border-cyan-400/60 shadow-lg backdrop-blur-xs flex items-center gap-1`}>
              <ShieldCheck className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
              <span>Nutricionista Marié</span>
            </span>
          </div>
        )}
      </div>

      {/* Online Specialist Active Pulse */}
      <div className="absolute top-1 right-1 z-30 flex items-center justify-center">
        <span className="w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0a1520] shadow-[0_0_8px_#34d399]" />
      </div>
    </div>
  );
};

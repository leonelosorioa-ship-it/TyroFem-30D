import React from 'react';

interface ColshopiLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  className?: string;
}

export const ColshopiLogo: React.FC<ColshopiLogoProps> = ({
  size = 'md',
  showGlow = true,
  className = '',
}) => {
  const sizeMap = {
    xs: { dim: 'w-7 h-7', textScale: 0.5 },
    sm: { dim: 'w-9 h-9', textScale: 0.7 },
    md: { dim: 'w-12 h-12', textScale: 1 },
    lg: { dim: 'w-20 h-20', textScale: 1.5 },
    xl: { dim: 'w-32 h-32', textScale: 2.2 },
  };

  const { dim } = sizeMap[size];

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${dim} ${className}`}
      title="ColShopi Tienda By Leps Digital"
    >
      {/* SVG Vector recreation of the exact 2026 Neon Emblem */}
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full rounded-full transition-transform ${
          showGlow ? 'drop-shadow-[0_0_10px_rgba(0,229,255,0.45)]' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="colshopiBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d151c" />
            <stop offset="90%" stopColor="#05070a" />
            <stop offset="100%" stopColor="#020305" />
          </radialGradient>
          
          <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#00d8f6" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle cx="100" cy="100" r="95" fill="url(#colshopiBg)" />

        {/* Outer Glowing Neon Ring */}
        <circle
          cx="100"
          cy="100"
          r="86"
          stroke="url(#neonCyan)"
          strokeWidth="6"
          filter={showGlow ? "url(#neonGlow)" : undefined}
        />

        {/* Inner subtle ring */}
        <circle
          cx="100"
          cy="100"
          r="89"
          stroke="#00f5ff"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Colshopi Script Brand Text */}
        <text
          x="100"
          y="96"
          textAnchor="middle"
          fill="#00f5ff"
          style={{
            fontFamily: "'Brush Script MT', 'Dancing Script', 'Pacifico', 'Caveat', 'Great Vibes', cursive",
            fontSize: "44px",
            fontWeight: "bold",
            letterSpacing: "0.5px"
          }}
          filter={showGlow ? "url(#neonGlow)" : undefined}
        >
          Colshopi
        </text>

        {/* Divider lines and TIENDA */}
        <line x1="34" y1="117" x2="68" y2="117" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" />
        <text
          x="100"
          y="122"
          textAnchor="middle"
          fill="#ffffff"
          style={{
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "4px"
          }}
        >
          TIENDA
        </text>
        <line x1="132" y1="117" x2="166" y2="117" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" />

        {/* By Leps Digital */}
        <text
          x="100"
          y="150"
          textAnchor="middle"
          fill="#ffffff"
          style={{
            fontFamily: "'Brush Script MT', 'Dancing Script', 'Caveat', cursive",
            fontSize: "23px",
            fontWeight: "bold",
            fontStyle: "italic"
          }}
        >
          By <tspan fill="#00f5ff">Leps Digital</tspan>
        </text>
      </svg>
    </div>
  );
};

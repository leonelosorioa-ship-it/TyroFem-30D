import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface MariePhotoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBadge?: boolean;
  showNeonBg?: boolean;
  className?: string;
}

// Cascade list of photo sources to ensure the new caricature illustration is loaded seamlessly
const PHOTO_SOURCES = [
  '/Marié Caricatura App webs.webp',
  '/Marie Caricatura App webs.webp',
  '/marie-caricatura.webp',
  '/marie-avatar.webp',
  '/Marié Caricatura App.jpeg',
  '/Marie Caricatura App.jpeg',
  '/marie-caricatura.png',
  '/marie-avatar.png',
  '/marie-hero.png',
  '/marie-caricatura.svg',
  '/marie-avatar.svg',
];

export const MariePhoto: React.FC<MariePhotoProps> = ({
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const [sourceIndex, setSourceIndex] = useState(0);

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

  const handleImageError = () => {
    if (sourceIndex < PHOTO_SOURCES.length - 1) {
      setSourceIndex(prev => prev + 1);
    }
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Outer Cyan Ambient Glow for larger sizes */}
      {(size === 'lg' || size === 'xl' || size === 'hero') && (
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-emerald-500/30 rounded-3xl blur-xl pointer-events-none animate-pulse" />
      )}

      {/* Main Container Frame with high contrast dark glass frame */}
      <div 
        className={`relative ${dimensions} rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_4px_25px_rgba(0,229,255,0.35)] bg-[#070e14] flex items-center justify-center`}
      >
        {/* Exact Real Photo */}
        <img
          src={PHOTO_SOURCES[sourceIndex]}
          alt="Nutricionista Marié - ColShopi Tienda"
          className="w-full h-full object-cover object-top sm:object-center"
          loading="eager"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />

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

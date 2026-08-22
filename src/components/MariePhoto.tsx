import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';

interface MariePhotoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showBadge?: boolean;
  showNeonBg?: boolean;
  className?: string;
}

export const MariePhoto: React.FC<MariePhotoProps> = ({
  size = 'md',
  showBadge = true,
  showNeonBg = true,
  className = '',
}) => {
  // Size dimensions
  const dimensions = {
    xs: 'w-9 h-9',
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
    hero: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  const badgeTextSize = {
    xs: 'text-[6px] px-1 py-0.2',
    sm: 'text-[7px] px-1 py-0.5',
    md: 'text-[9px] px-1.5 py-0.5',
    lg: 'text-[10px] px-2 py-0.5',
    xl: 'text-xs px-2.5 py-1',
    hero: 'text-xs px-3 py-1 font-black',
  }[size];

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Outer Glow Halo for Hero / XL / Large */}
      {(size === 'lg' || size === 'xl' || size === 'hero') && (
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-teal-500/20 to-emerald-500/30 rounded-3xl blur-xl pointer-events-none animate-pulse" />
      )}

      {/* Main Portrait Frame */}
      <div 
        className={`relative ${dimensions} rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_4px_20px_rgba(0,229,255,0.3)] bg-[#070e14] flex flex-col justify-end items-center`}
      >
        {/* Background Naturist Store Shelves & Neon Light Ambience */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1520] via-[#081017] to-[#04070a]">
          {/* Neon Circular Sign behind Marié */}
          {showNeonBg && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[85%] aspect-square rounded-full border border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,229,255,0.4)] flex flex-col items-center justify-center p-1 opacity-90">
              <span className="font-serif-luxury text-[7px] sm:text-[9px] font-black text-cyan-300 tracking-tight leading-none text-center drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">
                Colshopi
              </span>
              <div className="flex items-center gap-0.5 my-0.5">
                <span className="h-px w-2 bg-cyan-400/60" />
                <span className="text-[5px] sm:text-[6px] tracking-widest text-cyan-200 uppercase font-sans font-bold">
                  Tienda
                </span>
                <span className="h-px w-2 bg-cyan-400/60" />
              </div>
              <span className="text-[5px] sm:text-[6px] text-cyan-300/80 font-serif italic">
                By Leps Digital
              </span>
            </div>
          )}

          {/* Wooden shelves & bottles silhouettes */}
          <div className="absolute inset-x-0 top-0 h-1/2 flex justify-between px-2 pt-1 opacity-30 pointer-events-none">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-3 bg-emerald-300/40 rounded-t-xs" />
              <div className="w-1.5 h-4 bg-amber-300/40 rounded-t-xs" />
              <div className="w-2 h-3.5 bg-cyan-300/40 rounded-t-xs" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-2 h-4 bg-emerald-300/40 rounded-t-xs" />
              <div className="w-1.5 h-3 bg-amber-300/40 rounded-t-xs" />
            </div>
          </div>
        </div>

        {/* High-Fidelity Marié Portrait Illustration & Badging */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end">
          {/* Realistic Silhouette & Facial Features of Marié */}
          <div className="relative flex flex-col items-center">
            {/* Hair & Head */}
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center">
              {/* Short Dark Bob Hair Shape */}
              <div className="absolute top-1 w-11 h-11 sm:w-16 sm:h-16 rounded-t-[20px] rounded-b-[12px] bg-[#1a110c] shadow-md border border-amber-950/40" />
              
              {/* Face */}
              <div className="relative z-10 w-9 h-10 sm:w-13 sm:h-14 bg-gradient-to-b from-[#fcd5b8] to-[#f7caa7] rounded-b-[14px] rounded-t-[10px] shadow-sm flex flex-col items-center justify-start pt-2 border border-[#eab893]/50">
                {/* Eyes & Eyebrows */}
                <div className="flex justify-between w-6 sm:w-8 px-0.5 pt-0.5">
                  <div className="flex flex-col items-center">
                    <div className="w-2 sm:w-2.5 h-0.5 bg-[#2b1810] rounded-full mb-0.5" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#422216] rounded-full ring-1 ring-amber-900/30" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-2 sm:w-2.5 h-0.5 bg-[#2b1810] rounded-full mb-0.5" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#422216] rounded-full ring-1 ring-amber-900/30" />
                  </div>
                </div>

                {/* Friendly Smile with rosy cheeks */}
                <div className="mt-1 flex items-center justify-center">
                  <div className="w-3.5 sm:w-4.5 h-1.5 border-b-2 border-rose-500 rounded-b-full shadow-xs" />
                </div>
              </div>
            </div>

            {/* White Blazer & MARIÉ Nametag */}
            <div className="relative -mt-1 w-20 sm:w-28 h-10 sm:h-14 bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-t-[18px] border-t border-slate-300 shadow-md flex flex-col items-center justify-start pt-1">
              {/* Lapels */}
              <div className="w-full flex justify-between px-2 text-[6px] text-slate-400">
                <div className="w-3 h-6 bg-white border-r border-slate-300 -rotate-6 shadow-xs" />
                <div className="w-3 h-6 bg-white border-l border-slate-300 rotate-6 shadow-xs" />
              </div>

              {/* Black Pin Badge: MARIÉ */}
              <div className="absolute top-1.5 right-2 sm:right-3 bg-slate-950 text-white font-black text-[6px] sm:text-[7px] px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-[2px] border border-slate-700 shadow-xs tracking-wider uppercase flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                <span>MARIÉ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Badge at bottom */}
        {showBadge && (
          <div className="absolute bottom-1 z-20">
            <span className={`${badgeTextSize} font-bold rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-400/50 shadow-md backdrop-blur-xs flex items-center gap-1`}>
              <ShieldCheck className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
              <span>Nutricionista Marié</span>
            </span>
          </div>
        )}
      </div>

      {/* Online Pulse Indicator */}
      <div className="absolute top-1 right-1 z-30 flex items-center justify-center">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a1520] shadow-[0_0_8px_#34d399]" />
      </div>
    </div>
  );
};

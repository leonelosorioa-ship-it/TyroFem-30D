import React from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  Calendar, 
  CheckCircle2,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';

interface MarieProfileCardProps {
  onOpenChat: () => void;
  onOpenOrder?: () => void;
  variant?: 'full' | 'compact' | 'hero';
}

export const MarieProfileCard: React.FC<MarieProfileCardProps> = ({
  onOpenChat,
  onOpenOrder,
  variant = 'full',
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c131a] via-[#080d12] to-[#040608] text-white border border-cyan-500/30 shadow-xl">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Marie Visual Avatar / Portrait Representation */}
          <div className="relative shrink-0 flex flex-col items-center">
            {/* Outer Neon Halo */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-400 shadow-[0_0_25px_rgba(0,229,255,0.4)]">
              {/* Inner Store Environment Simulation */}
              <div className="w-full h-full rounded-[22px] bg-[#0c161d] overflow-hidden relative flex flex-col items-center justify-end border border-cyan-400/50">
                {/* Background shelves & neon circular logo */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/40 via-[#0a1016] to-[#05070a]" />
                
                {/* Micro Neon Logo on store wall */}
                <div className="absolute top-2 left-2 opacity-80 scale-60 origin-top-left">
                  <ColshopiLogo size="xs" showGlow={false} />
                </div>

                {/* Animated Store Botanicals / Superfoods subtle silhouettes */}
                <div className="absolute top-3 right-3 text-cyan-400/40 text-xs font-mono">
                  🌿 💊
                </div>

                {/* Marie Figure */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Doctor/Nutritionist Avatar Portrait */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-t from-emerald-100 to-amber-50 border-2 border-cyan-300 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                    <span role="img" aria-label="Nutricionista Marié" className="mt-2 scale-110">
                      👩🏻‍⚕️
                    </span>
                  </div>

                  {/* White Medical / Nutritional Blazer */}
                  <div className="w-28 h-12 bg-white rounded-t-2xl shadow-md border-t-2 border-x-2 border-slate-200 flex flex-col items-center pt-1 relative">
                    {/* Black Name Tag: MARIÉ (Exactly as in uploaded photo) */}
                    <div className="bg-black text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded border border-slate-700 shadow-xs flex items-center gap-1">
                      <span>MARIÉ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            <div className="absolute -bottom-2 bg-slate-900 border border-cyan-400/60 text-cyan-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Especialista ColShopi</span>
            </div>
          </div>

          {/* Bio and Nutritional Mission */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Nutrición Funcional & Salud Femenina
              </span>
              <span className="text-xs font-medium text-slate-400">
                ColShopi Tienda By Leps Digital
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury flex items-center justify-center md:justify-start gap-2">
                <span>Nutricionista Marié</span>
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </h3>
              <p className="text-xs text-cyan-200/90 font-medium mt-0.5">
                Autora de la Guía Nutricional TyroFem 30D y Asesora Oficial de Tyruss Full
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              "Mi objetivo es acompañarte día a día durante estos 30 días para desinflamar tu organismo, nutrir tu glándula tiroides con el selenio y la espirulina de <strong>Tyruss Full</strong>, y recuperar tu vitalidad y balance hormonal de forma natural."
            </p>

            {/* Quick credentials & guarantees */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Registro INVIMA RSA-0021928-2022</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Asesoría personalizada por chat</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
              <button
                type="button"
                onClick={onOpenChat}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chatear con Marié en la App</span>
              </button>

              <a
                href="https://wa.me/573104007428?text=Hola%20Marié,%20te%20escribo%20desde%20la%20App%20ColShopi%20TyroFem%2030D"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs transition-colors border border-emerald-400/40 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp (+57 310 400 7428)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

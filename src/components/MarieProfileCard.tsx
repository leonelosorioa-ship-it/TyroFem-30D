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
  ExternalLink,
  Smartphone,
  Gift
} from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';
import { UserProfile } from '../types';

interface MarieProfileCardProps {
  userProfile?: UserProfile | null;
  onOpenChat: () => void;
  onOpenOrder?: () => void;
  onOpenVipPerks?: () => void;
  onOpenWelcomeAudio?: () => void;
  variant?: 'full' | 'compact' | 'hero';
}

export const MarieProfileCard: React.FC<MarieProfileCardProps> = ({
  userProfile,
  onOpenChat,
  onOpenOrder,
  onOpenVipPerks,
  onOpenWelcomeAudio,
  variant = 'full',
}) => {
  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : 'hermosa';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c131a] via-[#080d12] to-[#040608] text-white border border-cyan-500/30 shadow-xl">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-7">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Marie Visual Avatar / Portrait from Real Photo */}
          <div className="relative shrink-0 flex flex-col items-center">
            <MariePhoto size="hero" showBadge={true} showNeonBg={true} />

            {/* Status Pill */}
            <div className="mt-2 bg-slate-900/90 border border-cyan-400/60 text-cyan-300 text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Directora Nutricional ColShopi</span>
            </div>
          </div>

          {/* Bio and Nutritional Mission */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Nutrición Funcional & Salud Femenina
              </span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                ⭐ Única Tienda con App Exclusiva
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury flex items-center justify-center md:justify-start gap-2">
                <span>Nutricionista Marié</span>
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </h3>
              <p className="text-xs text-cyan-200/90 font-medium mt-0.5">
                Directora de Bienestar en ColShopi Tienda By Leps Digital & Creadora de la Guía TyroFem 30D
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              "Hola {userProfile?.name ? <strong className="text-white">{userProfile.name}</strong> : 'hermosa'}, en <strong>ColShopi Tienda By Leps Digital</strong> no solo te vendemos un suplemento; te acompañamos en todo tu proceso. Somos la <strong>única tienda naturista con una App propia</strong> para que registres tu evolución, desinflames tu organismo con <strong>Tyruss Full</strong> y sientas el cambio real día a día."
            </p>

            {/* Quick credentials & guarantees */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Registro INVIMA RSA-0021928-2022</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Asesoría 1 a 1 por WhatsApp</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Descuento VIP en Recompras</span>
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

              {onOpenWelcomeAudio && (
                <button
                  type="button"
                  onClick={onOpenWelcomeAudio}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/40 hover:to-teal-500/40 text-emerald-300 font-bold text-xs transition-all border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>🎙️ Escuchar Audio de Marié</span>
                </button>
              )}

              <a
                href="https://wa.link/6zpm18"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs transition-colors border border-emerald-400/40 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Marié (+57 310 400 7428)</span>
              </a>

              {onOpenVipPerks && (
                <button
                  type="button"
                  onClick={onOpenVipPerks}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-all border border-cyan-400/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Mis Ventajas VIP ColShopi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Flame, 
  Heart,
  ShoppingBag,
  FileText,
  Smartphone
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile | null;
  currentDay: number;
  completedDaysCount: number;
  onOpenNutritionalInfo: () => void;
  onOpenOrder: () => void;
  onOpenChat: () => void;
  onInstallPWA?: () => void;
  canInstallPWA?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  currentDay,
  completedDaysCount,
  onOpenNutritionalInfo,
  onOpenOrder,
  onOpenChat,
  onInstallPWA,
  canInstallPWA
}) => {
  const progressPercent = Math.round((completedDaysCount / 30) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top micro-bar: Exclusive Gift Badge */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs py-1.5 px-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-flex items-center justify-center bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-400/30">
              REGALO EXCLUSIVO
            </span>
            <span className="truncate text-emerald-100 font-medium">
              ColShopi Tienda By Leps Digital 💚 • Nutricionista Marié
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNutritionalInfo}
              className="flex items-center gap-1 text-[11px] text-emerald-200 hover:text-white transition-colors cursor-pointer"
              title="Ver Registro INVIMA y Ficha Técnica"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">INVIMA: RSA-0021928-2022</span>
              <span className="sm:hidden">INVIMA</span>
            </button>

            {canInstallPWA && (
              <button
                onClick={onInstallPWA}
                className="hidden md:flex items-center gap-1 text-[10px] bg-emerald-700/60 hover:bg-emerald-600 px-2 py-0.5 rounded text-white transition-colors cursor-pointer"
              >
                <Smartphone className="w-3 h-3" />
                Instalar App
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-100 shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                Tyro<span className="text-emerald-700 font-extrabold">Fem</span> <span className="text-amber-600 text-xs font-semibold px-1.5 py-0.5 bg-amber-50 rounded border border-amber-200">30D</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
              Guía Nutricional & Balance Hormonal • <span className="text-emerald-700 font-semibold">Marié</span>
            </p>
          </div>
        </div>

        {/* Quick Stats & CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Day & Progress Pill */}
          <div className="hidden sm:flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1 text-emerald-800 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Día {currentDay}</span>
            </div>
            <div className="w-px h-3.5 bg-emerald-200" />
            <div className="text-[11px] text-slate-600">
              <span className="font-bold text-emerald-700">{progressPercent}%</span> completado
            </div>
          </div>

          {/* Quick Nutritional Table Button */}
          <button
            onClick={onOpenNutritionalInfo}
            className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-200/80 cursor-pointer"
            title="Tabla Nutricional Tyruss Full"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Chat with Marie Quick CTA */}
          <button
            onClick={onOpenChat}
            className="hidden xs:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 px-3 py-2 rounded-xl transition-colors border border-emerald-300/60 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Marié</span>
          </button>

          {/* Re-order & Packages CTA */}
          <button
            onClick={onOpenOrder}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3 sm:px-4 py-2 rounded-xl shadow-xs shadow-emerald-700/20 transition-all cursor-pointer transform active:scale-98"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pedir Tyruss Full</span>
            <span className="sm:hidden">Tarros</span>
          </button>
        </div>
      </div>

      {/* Mobile Mini Progress Bar */}
      <div className="sm:hidden w-full bg-emerald-100/60 h-1">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};

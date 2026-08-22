import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Flame, 
  Heart, 
  ShoppingBag, 
  FileText, 
  Smartphone,
  Store,
  Download
} from 'lucide-react';
import { UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';

interface HeaderProps {
  userProfile: UserProfile | null;
  currentDay: number;
  completedDaysCount: number;
  onOpenNutritionalInfo: () => void;
  onOpenOrder: () => void;
  onOpenChat: () => void;
  onOpenBrandModal?: () => void;
  onOpenUserProfile?: () => void;
  onOpenAdminPanel?: () => void;
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
  onOpenBrandModal,
  onOpenUserProfile,
  onOpenAdminPanel,
  onInstallPWA,
  canInstallPWA
}) => {
  const progressPercent = Math.round((completedDaysCount / 30) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top micro-bar: Exclusive Gift & Brand Badge */}
      <div className="bg-gradient-to-r from-[#070b10] via-slate-900 to-[#070b10] text-white text-xs py-1.5 px-3 border-b border-cyan-500/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <button
              onClick={onOpenBrandModal}
              className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer text-left truncate"
              title="Conocer más sobre ColShopi Tienda By Leps Digital"
            >
              <ColshopiLogo size="xs" showGlow={false} />
              <span className="truncate text-cyan-300 font-bold text-[11px]">
                ColShopi Tienda By Leps Digital
              </span>
              <span className="hidden sm:inline text-slate-400 text-[10px]">
                • Cuidamos de ti 💙
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {userProfile?.isAdmin && onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="flex items-center gap-1 text-[11px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full shadow-md transition-all cursor-pointer ring-2 ring-amber-300/60 animate-pulse"
                title="Abrir Panel de Control Administrativo ColShopi"
              >
                <span>👑 Panel Admin</span>
              </button>
            )}

            {userProfile && onOpenUserProfile && !userProfile.isAdmin && (
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-1 text-[10px] bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 px-2 py-0.5 rounded-full hover:bg-cyan-900 transition-colors cursor-pointer"
                title="Ver mi código VIP e Informe Clínico"
              >
                <span className="font-bold">VIP {userProfile.accessCode ? `#${userProfile.accessCode}` : 'AUTORIZADO'}</span>
              </button>
            )}

            <button
              onClick={onOpenNutritionalInfo}
              className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white transition-colors cursor-pointer"
              title="Ver Registro INVIMA y Ficha Técnica"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">INVIMA: RSA-0021928-2022</span>
              <span className="sm:hidden">INVIMA</span>
            </button>

            {onOpenBrandModal && (
              <button
                onClick={onOpenBrandModal}
                className="hidden lg:flex items-center gap-1 text-[10px] bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/30 text-cyan-300 px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                <Store className="w-3 h-3 text-cyan-400" />
                <span>Nuestra Tienda</span>
              </button>
            )}

            {onInstallPWA && (
              <button
                onClick={onInstallPWA}
                className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-emerald-800/90 to-teal-800/90 hover:from-emerald-700 hover:to-teal-700 border border-emerald-400/50 px-2 py-0.5 rounded-full text-emerald-200 font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Instalar TyroFem 30D en tu pantalla de inicio"
              >
                <Smartphone className="w-3 h-3 text-cyan-300 animate-pulse" />
                <span>Instalar App</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBrandModal}
            className="group cursor-pointer flex items-center gap-2 text-left"
            title="Ver información de ColShopi Tienda"
          >
            <ColshopiLogo size="md" showGlow={true} className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  Tyro<span className="text-emerald-700 font-extrabold">Fem</span> <span className="text-amber-600 text-xs font-semibold px-1.5 py-0.2 bg-amber-50 rounded border border-amber-200">30D</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[190px] sm:max-w-xs flex items-center gap-1">
                <span>Por</span> 
                <span className="text-emerald-800 font-bold">Nutricionista Marié</span>
                <span className="text-[10px] text-cyan-600 bg-cyan-50 px-1 rounded border border-cyan-200">ColShopi</span>
              </p>
            </div>
          </button>
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

          {/* Admin Panel Quick Switcher if user is admin */}
          {userProfile?.isAdmin && onOpenAdminPanel && (
            <button
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3 py-2 rounded-xl shadow-md border border-amber-300 transition-all cursor-pointer transform active:scale-98"
            >
              <span>👑</span>
              <span className="hidden sm:inline">Panel Admin</span>
            </button>
          )}

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
            className="hidden xs:flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-2 rounded-xl transition-colors border border-emerald-300/60 cursor-pointer"
          >
            <span className="text-xs">👩🏻‍⚕️</span>
            <span>Marié</span>
          </button>

          {/* Re-order & Packages CTA */}
          <button
            onClick={onOpenOrder}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3 sm:px-4 py-2 rounded-xl shadow-xs shadow-emerald-700/20 transition-all cursor-pointer transform active:scale-98"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedir Tyruss Full</span>
          </button>

          {/* Dedicated Download / Install App Button (matching DUERME header experience) */}
          {onInstallPWA && (
            <button
              onClick={onInstallPWA}
              className="p-2 text-emerald-800 bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 rounded-xl transition-all border border-emerald-300/80 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center shrink-0"
              title="Descargar e instalar App TyroFem 30D"
              aria-label="Descargar e instalar App"
            >
              <Download className="w-4 h-4 text-emerald-800" />
            </button>
          )}
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

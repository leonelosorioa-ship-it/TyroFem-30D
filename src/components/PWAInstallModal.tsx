import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  PlusSquare, 
  ShieldCheck, 
  Leaf, 
  Zap,
  Globe
} from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (err) {
        console.error('Error prompting install:', err);
      } finally {
        setDeferredPrompt(null);
        setIsInstalling(false);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      setIsInstalling(false);
      if (!isIOS) {
        alert('Para instalar TyroFem 30D en tu celular: Abre el menú de tu navegador (los 3 puntos ⋮ arriba a la derecha) y presiona "Instalar aplicación" o "Agregar a la pantalla principal".');
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-[#141b24] via-[#0f1720] to-[#0a0f16] rounded-3xl p-6 shadow-2xl border border-cyan-500/30 text-white overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Title */}
        <div className="text-left mb-6">
          <h3 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <span>Instalar aplicación</span>
          </h3>
        </div>

        {/* App Presentation Card */}
        <div className="flex flex-col items-center text-center space-y-3 py-2">
          {/* Glowing App Icon */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center border border-cyan-400/40">
              <div className="w-full h-full rounded-[14px] bg-[#0c141d] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                <div className="text-2xl mb-0.5 animate-pulse">🌿</div>
                <span className="text-[10px] font-black text-cyan-300 tracking-wider">TyroFem</span>
                <span className="text-[8px] font-bold text-amber-400 bg-amber-400/20 px-1 rounded">30D</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-[#0f1720]">
              <Sparkles className="w-3 h-3 text-slate-950" />
            </div>
          </div>

          {/* App Titles */}
          <div>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              TyroFem™ 30D Mujer
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Descanso, Balance Hormonal & Tiroides
            </p>
            <p className="text-[11px] text-cyan-400/80 font-medium flex items-center justify-center gap-1 mt-1">
              <Globe className="w-3 h-3" />
              <span>tyrofem-30d.ai.studio</span>
            </p>
          </div>
        </div>

        {/* Value Points */}
        <div className="mt-4 bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Acceso directo en 1-toque desde tu pantalla</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Carga instantánea y funciona sin internet</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Respaldado por ColShopi Tienda By Leps Digital</span>
          </div>
        </div>

        {/* iOS Specific Instructions */}
        {isIOS && (
          <div className="mt-3 bg-cyan-950/40 rounded-xl p-2.5 border border-cyan-500/30 text-left text-xs space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>Para iPhone / iPad (Safari):</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              1. Toca el botón <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" /> en la barra inferior.
              <br />
              2. Selecciona <strong>"Agregar al inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" />.
            </p>
          </div>
        )}

        {/* Action Buttons (Cancelar / Instalar) */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {!isIOS ? (
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-md shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalling ? 'Instalando...' : 'Instalar'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer"
            >
              ¡Entendido!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share2, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { isDeviceIOS, isAppInstalled, promptPWAInstall } from '../utils/pwaManager';

interface PWAInstallBannerProps {
  onOpenModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenModal }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if dismissed before in session
    const isDismissed = sessionStorage.getItem('tyrofem_pwa_banner_dismissed');
    if (isDismissed) return;

    // Check if already installed as standalone PWA
    if (isAppInstalled()) return;

    setIsIOS(isDeviceIOS());

    // Show floating banner after 3.5 seconds
    const timer = setTimeout(() => {
      if (!isAppInstalled()) {
        setShowBanner(true);
      }
    }, 3500);

    const handleInstalled = () => {
      setShowBanner(false);
    };
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      onOpenModal();
      return;
    }

    if (window.__deferredPwaPrompt) {
      setIsInstalling(true);
      const res = await promptPWAInstall();
      setIsInstalling(false);
      if (res.outcome === 'accepted') {
        setShowBanner(false);
      }
    } else {
      onOpenModal();
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('tyrofem_pwa_banner_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-gradient-to-r from-slate-950 via-[#071d16] to-slate-950 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-emerald-500/40 animate-fadeIn text-xs">
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white rounded-full cursor-pointer bg-slate-900/60 transition-colors"
        aria-label="Cerrar banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 border border-emerald-400/50 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-emerald-500/20">
          🌿
        </div>
        
        <div className="flex-1 pr-3 space-y-1.5">
          <div className="flex items-center gap-1.5 font-black text-white">
            <span>Instalar TyroFem 30D</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded font-bold uppercase">
              App Móvil
            </span>
          </div>
          
          <p className="text-slate-300 text-[11px] leading-tight">
            Accede a tu calendario de 30 días, recetas y registro en 1 solo toque desde tu pantalla de inicio.
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="py-1.5 px-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 text-slate-950 hover:from-emerald-300 hover:to-cyan-200 font-black rounded-xl text-[11px] flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>{isIOS ? 'Ver cómo instalar' : (isInstalling ? 'Instalando...' : 'Descargar / Instalar')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenModal}
              className="text-[11px] text-emerald-300 hover:text-white underline underline-offset-2 cursor-pointer font-medium"
            >
              Más info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

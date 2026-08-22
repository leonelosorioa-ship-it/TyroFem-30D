import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download, Share2, PlusSquare, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem('tyrofem_pwa_dismissed');
    if (isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS or mobile, show banner after 3 seconds if not installed
    const timer = setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('tyrofem_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-emerald-200 animate-fade-in text-xs">
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
          🌿
        </div>
        <div className="flex-1 pr-4 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span>Instala TyroFem 30D</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
              Offline Ready
            </span>
          </div>
          <p className="text-slate-600 text-[11px] leading-tight">
            Accede a tu calendario de 30 días, recetas y registro diario directamente desde tu pantalla de inicio.
          </p>

          {isIOS ? (
            <p className="text-[10px] text-emerald-800 pt-1 font-semibold flex items-center gap-1">
              <span>Toca</span> <Share2 className="w-3 h-3 inline" /> <span>y luego "Agregar a Inicio"</span> <PlusSquare className="w-3 h-3 inline" />
            </p>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Instalar en mi Pantalla</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  Zap,
  Globe,
  MoreVertical,
  ArrowRight,
  Compass,
  ExternalLink,
  Layers,
  BellRing
} from 'lucide-react';
import { isDeviceIOS, isDeviceAndroid, isAppInstalled, promptPWAInstall } from '../utils/pwaManager';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    const ios = isDeviceIOS();
    const android = isDeviceAndroid();
    setIsIOS(ios);
    setIsAndroid(android);

    if (ios) {
      setActiveTab('ios');
    } else if (android) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }

    // Detect In-App browsers (WhatsApp, Instagram, Facebook, TikTok)
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent || '';
      const inApp = /FBAN|FBAV|Instagram|WhatsApp|TikTok|Line|MicroMessenger|Snapchat/i.test(ua);
      setIsInAppBrowser(inApp);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setIsInstalling(true);
    const res = await promptPWAInstall();
    setIsInstalling(false);

    if (res.outcome === 'accepted') {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#111c18] via-[#0b1613] to-[#070f0d] rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-500/30 text-white overflow-hidden animate-scaleUp max-h-[92vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/60 z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto pr-1 space-y-4">
          
          {/* Header Title */}
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Instalación PWA Directa</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1 font-serif-luxury">
              <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Instalar aplicación</span>
            </h3>
          </div>

          {/* App Presentation Card */}
          <div className="flex flex-col items-center text-center space-y-2 py-2 bg-slate-950/60 rounded-2xl p-4 border border-cyan-500/20">
            {/* Glowing App Icon - ColShopi Tienda */}
            <div className="relative group">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-600 via-slate-900 to-black p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center border border-cyan-400/50">
                <img
                  src="/icon-192.png"
                  alt="ColShopi Tienda By Leps Digital"
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-slate-950 p-1 rounded-full border-2 border-[#0f1720]">
                <Sparkles className="w-3 h-3 text-slate-950" />
              </div>
            </div>

            {/* App Titles */}
            <div>
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                ColShopi Tienda • TyroFem™ 30D
              </h4>
              <p className="text-xs text-cyan-300/90 font-medium">
                App Exclusiva • Balance Hormonal & Tiroides
              </p>
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5 mt-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span className="font-mono text-cyan-300">colshopi-tyrofem-30d.ai.studio</span>
              </div>
            </div>
          </div>

          {/* In-App Browser Warning (if detected) */}
          {isInAppBrowser && (
            <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-3 text-xs space-y-1 text-amber-200">
              <div className="font-bold flex items-center gap-1.5 text-amber-300">
                <span>⚠️ Navegador interno detectado:</span>
              </div>
              <p className="text-[11px] text-amber-100/90 leading-tight">
                Para instalar la app, toca los 3 puntos <MoreVertical className="w-3 h-3 inline" /> en la esquina y selecciona <strong>"Abrir en Chrome"</strong> o <strong>"Abrir en Safari"</strong>.
              </p>
            </div>
          )}

          {/* Value Points */}
          <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 space-y-2 text-left">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Acceso directo en 1 toque sin abrir navegador</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Carga instantánea y guarda tu progreso diario</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Exclusivo para compradoras VIP de Tyruss Full</span>
            </div>
          </div>

          {/* Platform Tabs Selector */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === 'android' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Android / Chrome</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === 'ios' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>iPhone (Safari)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('desktop')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                activeTab === 'desktop' 
                  ? 'bg-emerald-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>PC / Mac</span>
            </button>
          </div>

          {/* Platform Specific Step-by-Step Instructions */}
          {activeTab === 'android' && (
            <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-emerald-500/20 text-xs space-y-2">
              <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>Instalación en Android (Google Chrome / Edge):</span>
              </p>
              <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-900/90 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Presiona el botón verde <strong>"Instalar Aplicación"</strong> que aparece abajo.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-900/90 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Si no abre, toca los <strong>3 puntos ⋮</strong> arriba a la derecha en Chrome y presiona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-900/90 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>Confirma y ¡listo! TyroFem 30D quedará instalada como una app nativa en tu celular.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-cyan-500/20 text-xs space-y-2">
              <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                <span>Instalación en iPhone / iPad (Navegador Safari):</span>
              </p>
              <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Toca el botón <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Desliza hacia abajo y presiona <strong>"Agregar al inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-cyan-400" />.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>Toca <strong>"Agregar"</strong> en la esquina superior derecha.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-700/60 text-xs space-y-2">
              <p className="font-bold text-slate-200 flex items-center gap-1.5">
                <span>Instalación en Computador (Chrome / Edge / Brave):</span>
              </p>
              <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Presiona el icono de <strong>Instalar</strong> <Download className="w-3.5 h-3.5 inline mx-0.5 text-emerald-400" /> en la barra de direcciones del navegador.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>O haz clic en el botón <strong>"Instalar Aplicación"</strong> abajo.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons (Cancelar / Instalar) */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {activeTab !== 'ios' ? (
            <button
              type="button"
              onClick={handleNativeInstall}
              disabled={isInstalling || installSuccess}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              {installSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>¡Instalada con éxito!</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isInstalling ? 'animate-bounce' : ''}`} />
                  <span>{isInstalling ? 'Abriendo diálogo...' : 'Instalar Aplicación'}</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
            >
              ¡Entendido!
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

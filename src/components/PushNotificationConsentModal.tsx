import React, { useState } from 'react';
import { 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Heart, 
  ShieldCheck, 
  X,
  Volume2,
  Salad,
  Zap
} from 'lucide-react';
import { requestPushPermission } from '../utils/pushNotificationService';
import { ColshopiLogo } from './ColshopiLogo';

interface PushNotificationConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
  userVipCode?: string;
  userEmail?: string;
}

export const PushNotificationConsentModal: React.FC<PushNotificationConsentModalProps> = ({
  isOpen,
  onClose,
  onPermissionGranted,
  userVipCode,
  userEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivateNotifications = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await requestPushPermission(userVipCode, userEmail);
      if (result.success) {
        setIsSuccess(true);
        if (onPermissionGranted) onPermissionGranted();
        setTimeout(() => {
          onClose();
        }, 1800);
      } else if (result.permission === 'denied') {
        setErrorMessage('Los permisos fueron denegados en el navegador. Puedes activarlos en la configuración de tu navegador si deseas recibir alertas.');
      } else if (result.permission === 'unsupported') {
        setErrorMessage('Tu navegador actual no admite notificaciones push nativas.');
      } else {
        onClose();
      }
    } catch (e: any) {
      setErrorMessage('Ocurrió un error al solicitar los permisos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-white space-y-5"
        style={{
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.15), 0 0 30px rgba(245, 158, 11, 0.1)'
        }}
      >
        {/* Decorative background glow circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="py-6 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-emerald-300">¡Notificaciones Activadas! 🌿</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Excelente. Marié te enviará tus recordatorios diarios de Tyruss Full, recetas exclusivas y tests a tiempo.
              </p>
            </div>
          </div>
        ) : (
          /* MAIN PROMPT CONTENT */
          <>
            {/* Header: Marié Avatar + Golden Bell Icon */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="relative shrink-0">
                <img
                  src="/circulo-marie.png"
                  alt="Marié"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-emerald-950"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full flex items-center justify-center text-slate-950 shadow-md border-2 border-slate-900 animate-bounce">
                  <Bell className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>Acompañamiento VIP Personalizado</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  Activa tus Notificaciones de Bienestar con Marié
                </h3>
              </div>
            </div>

            {/* Main explanation text */}
            <p className="text-xs text-slate-300 leading-relaxed">
              Permítenos avisarte cuando tu siguiente día del reto esté listo, enviarte recordatorios para tu <strong className="text-emerald-300 font-bold">Tyruss Full</strong>, recetas exclusivas y sorpresas VIP de <span className="text-amber-300 font-semibold">ColShopi Tienda</span>.
            </p>

            {/* Key benefits list */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-white block text-[11px]">Recordatorio Oportuno de Tyruss Full</span>
                  <span className="text-[10px] text-slate-400">Nunca olvides tu dosis matutina o nocturna para máxima absorción.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Salad className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-white block text-[11px]">Desbloqueo de Recetas y Test Diario</span>
                  <span className="text-[10px] text-slate-400">Aviso automático cada 24 horas para registrar tu energía y digestión.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Heart className="w-3 h-3" />
                </div>
                <div>
                  <span className="font-bold text-white block text-[11px]">Tips Hormonales & Beneficios VIP</span>
                  <span className="text-[10px] text-slate-400">Consejos de Marié para tiroides, digestión y descuentos exclusivos.</span>
                </div>
              </div>
            </div>

            {/* Error banner if rejected */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-200 text-xs leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleActivateNotifications}
                disabled={isLoading}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-emerald-400/40 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Conectando con tu dispositivo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>✨ Activar Notificaciones</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-semibold cursor-pointer text-center"
              >
                Quizás más tarde
              </button>
            </div>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center pt-1 border-t border-slate-800/80">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>ColShopi respeta tu privacidad. Solo recibirás alertas útiles de tu reto.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

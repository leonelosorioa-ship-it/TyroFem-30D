import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  FileCheck2, 
  Sparkles, 
  MessageCircle, 
  Award,
  CheckCircle2,
  Lock,
  Download,
  Check,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { DayProgress, UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { generateTransformationReportPDF } from '../utils/pdfGenerator';
import { LogOut } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  completedDays: number;
  progressMap?: Record<number, DayProgress>;
  currentDay?: number;
  onOpenAdminPanel?: () => void;
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  completedDays,
  progressMap = {},
  currentDay = 1,
  onOpenAdminPanel,
  onLogout
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      generateTransformationReportPDF({
        userProfile,
        progressMap,
        currentDay
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto pt-3 sm:pt-6 pb-12 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon - Fixed */}
        <div className="bg-gradient-to-r from-[#070b10] via-slate-900 to-[#070b10] text-white p-4 sm:p-5 border-b border-cyan-500/25 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ColshopiLogo size="sm" showGlow={true} />
              <div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                  Credencial de Compradora VIP
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-serif-luxury">
                  Expediente & Datos de Acceso
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Volver a la pantalla anterior"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain">
          
          {/* VIP Pass Card */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 to-[#0c161d] text-white border border-cyan-500/30 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-cyan-300 tracking-wider block">
                    Acceso Autorizado ColShopi
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {userProfile.name}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Código VIP</span>
                <span className="text-sm font-mono font-black text-amber-400 tracking-widest">
                  {userProfile.accessCode || 'AUTORIZADO'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">WhatsApp de Pedido:</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {userProfile.phone || '+57 310 400 7428'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Rango de Edad:</span>
                <span className="font-semibold text-slate-200">
                  {userProfile.ageGroup || 'Personalizado'}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Report Destination Card */}
          <div className="rounded-2xl p-4 bg-cyan-50/80 border border-cyan-200 space-y-2 text-xs text-cyan-950">
            <div className="flex items-center gap-2 font-bold text-cyan-900">
              <FileCheck2 className="w-4 h-4 text-cyan-700 shrink-0" />
              <span>Informe Clínico al Finalizar tus 30 Días:</span>
            </div>
            
            <p className="text-[11px] leading-relaxed text-slate-700">
              Tu reporte oficial{' '}
              <strong className="text-cyan-950 font-bold">
                "Informe Clínico de Evolución Tiroidea, Balance Hormonal & Biometría Metabólica TyroFem 30D"
              </strong>{' '}
              se generará y enviará al completar el Día 30 a tu correo:
            </p>

            <div className="p-2.5 rounded-xl bg-white border border-cyan-200/80 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span className="font-bold text-slate-800 text-xs truncate">
                {userProfile.email || 'No registrado'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-cyan-900 pt-1">
              <span>Progreso hacia tu informe:</span>
              <strong className="font-bold">{completedDays} de 30 Días ({Math.round((completedDays / 30) * 100)}%)</strong>
            </div>
          </div>

          {/* 30-Day Validity & Reactivation Badge */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-cyan-300 flex items-center gap-1">
                <span>⏰ Vigencia de la App</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/80 text-cyan-200 font-bold border border-cyan-400/40">
                30 Días Calendario
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Tu acceso está activo durante tu ciclo de tratamiento. Para reactivar tu App por <strong>30 días más</strong>, solicita tu nuevo pedido de Tyruss Full a la línea de ColShopi.
            </p>
          </div>

          {/* Health Objective Registered */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Enfoque Clínico Seleccionado
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base">
                {userProfile.primaryAngle === 'tiroides_metabolismo' && '🦋'}
                {userProfile.primaryAngle === 'desbalance_menopausia' && '🌸'}
                {userProfile.primaryAngle === 'ciclos_spm' && '🩸'}
                {userProfile.primaryAngle === 'digestion_detox' && '🌿'}
              </span>
              <span className="font-bold text-slate-800 capitalize">
                {userProfile.primaryAngle.replace('_', ' & ')}
              </span>
            </div>
          </div>

          {/* Actions: Download PDF & WhatsApp */}
          <div className="pt-2 space-y-2 text-xs">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-center cursor-pointer shadow-xs ${
                downloadSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡Informe PDF Descargado!</span>
                </>
              ) : isDownloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Informe de Transformación 30D (PDF)</span>
                </>
              )}
            </button>

            {/* Admin Exclusive Panel Trigger */}
            {userProfile.isAdmin && onOpenAdminPanel && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPanel();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black flex items-center justify-center gap-2 transition-all text-center cursor-pointer shadow-md"
              >
                <span>👑 Abrir Panel de Control Administrativo ColShopi</span>
              </button>
            )}

            <a
              href="https://wa.link/6zpm18"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-2 transition-colors text-center cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contactar a Marié por WhatsApp (+57 310 400 7428)</span>
            </a>

            {onLogout && (
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión / Salir de esta cuenta</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

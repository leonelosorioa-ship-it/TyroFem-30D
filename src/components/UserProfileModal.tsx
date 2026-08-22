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
  FileText
} from 'lucide-react';
import { DayProgress, UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { generateTransformationReportPDF } from '../utils/pdfGenerator';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  completedDays: number;
  progressMap?: Record<number, DayProgress>;
  currentDay?: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  completedDays,
  progressMap = {},
  currentDay = 1
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#070b10] via-slate-900 to-[#070b10] text-white p-5 border-b border-cyan-500/25 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ColshopiLogo size="sm" showGlow={true} />
              <div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                  Credencial de Compradora VIP
                </span>
                <h3 className="text-base font-bold text-white font-serif-luxury">
                  Expediente & Datos de Acceso
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
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

            <a
              href="https://wa.link/6zpm18"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-2 transition-colors text-center cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contactar a Marié por WhatsApp (+57 310 400 7428)</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

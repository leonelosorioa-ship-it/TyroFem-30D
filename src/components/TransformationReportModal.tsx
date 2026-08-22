import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Award, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Heart,
  Droplet,
  Sun,
  Flame,
  Check,
  ArrowLeft
} from 'lucide-react';
import { DayProgress, UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { generateTransformationReportPDF } from '../utils/pdfGenerator';

interface TransformationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  progressMap: Record<number, DayProgress>;
  currentDay: number;
}

export const TransformationReportModal: React.FC<TransformationReportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  progressMap,
  currentDay
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const progressEntries = Object.values(progressMap) as DayProgress[];
  const completedDaysCount = progressEntries.filter(
    (p) => p.completedAt || (p.tyrussTaken && p.water2L)
  ).length;

  const tyrussDaysCount = progressEntries.filter((p) => p.tyrussTaken).length;
  const waterDaysCount = progressEntries.filter((p) => p.water2L).length;
  const antiinflamDaysCount = progressEntries.filter((p) => p.antiinflammatoryMeal).length;

  const energyScores = progressEntries.map((p) => p.energyLevel || 4);
  const avgEnergy = energyScores.length > 0
    ? (energyScores.reduce((a, b) => a + b, 0) / energyScores.length).toFixed(1)
    : '4.2';
  
  const adherencePercent = Math.round((completedDaysCount / 30) * 100);

  const lightDigestionCount = progressEntries.filter(
    (p) => p.digestion === 'liviana' || p.digestion === 'normal'
  ).length;
  
  const digestionSuccessRate = progressEntries.length > 0
    ? Math.round((lightDigestionCount / progressEntries.length) * 100)
    : 85;

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      generateTransformationReportPDF({
        userProfile,
        progressMap,
        currentDay
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareText = `¡Hola Marié! 💚 Acabo de descargar mi Informe de Transformación de 30 Días de TyroFem con Tyruss Full de ColShopi Tienda.\n\n📊 Resumen de mi evolución:\n• Alumna: ${userProfile.name}\n• Código VIP: #${userProfile.accessCode || '849201'}\n• Adherencia al Reto: ${adherencePercent}% (${completedDaysCount}/30 días)\n• Nivel de Energía Promedio: ${avgEnergy}/5.0\n• Desinflamación Digestiva: ${digestionSuccessRate}%\n\n¡Gracias por tu acompañamiento! ✨`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#070b10] via-slate-900 to-[#070b10] text-white p-5 border-b border-cyan-500/30 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ColshopiLogo size="sm" showGlow={true} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded border border-cyan-400/40">
                    Expediente Clínico Oficial
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-400/40">
                    VIP #{userProfile.accessCode || '849201'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-luxury mt-0.5">
                  Informe de Transformación de 30 Días
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Volver a la pantalla anterior"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Report Content Preview */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          
          {/* Patient Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Paciente / Alumna Registrada
              </span>
              <h4 className="text-base font-bold text-slate-900">{userProfile.name}</h4>
              <p className="text-xs text-slate-500">
                📲 {userProfile.phone || 'WhatsApp verificado'} • ✉️ {userProfile.email || 'Correo principal'}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Supervisión Nutricional
              </span>
              <p className="text-xs font-bold text-slate-800">Nutricionista Marié</p>
              <span className="text-[11px] text-slate-500">ColShopi Tienda By Leps Digital</span>
            </div>
          </div>

          {/* 3 Core Highlights (Adherence, Energy, Digestion) */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* Adherence */}
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Adherencia</span>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">{adherencePercent}%</span>
              </div>
              <span className="text-[10px] text-emerald-900 font-medium">
                {completedDaysCount}/30 Días Cumplidos
              </span>
            </div>

            {/* Energy */}
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Energía Media</span>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-600">{avgEnergy}</span>
                <span className="text-xs text-amber-700 font-bold">/5</span>
              </div>
              <span className="text-[10px] text-amber-900 font-medium">
                Curva Vital Ascendente
              </span>
            </div>

            {/* Digestion */}
            <div className="bg-teal-50/80 p-3.5 rounded-2xl border border-teal-200 shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-teal-800 uppercase">Desinflamación</span>
              <div className="my-1">
                <span className="text-2xl sm:text-3xl font-black text-teal-700">{digestionSuccessRate}%</span>
              </div>
              <span className="text-[10px] text-teal-900 font-medium">
                Digestión Ligera
              </span>
            </div>
          </div>

          {/* Therapeutic Pillars Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Desglose de Pilares Terapéuticos TyroFem</span>
            </h5>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <div>
                    <strong className="text-slate-800 block">Toma Diaria de Tyruss Full (20g)</strong>
                    <span className="text-[10px] text-slate-500">Selenio orgánico + Yodo en ayunas</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                  {tyrussDaysCount} / {Math.max(currentDay, 1)} días
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-teal-500" />
                  <div>
                    <strong className="text-slate-800 block">Hidratación Funcional (2 Litros)</strong>
                    <span className="text-[10px] text-slate-500">Drenaje linfático y desinflamación celular</span>
                  </div>
                </div>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md text-[11px]">
                  {waterDaysCount} / {Math.max(currentDay, 1)} días
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <div>
                    <strong className="text-slate-800 block">Alimentación Antiinflamatoria</strong>
                    <span className="text-[10px] text-slate-500">Recetas del protocolo con vegetales y grasas buenas</span>
                  </div>
                </div>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                  {antiinflamDaysCount} días registrados
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Opinion */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-emerald-950 font-serif-luxury">Dictamen Nutricional & Metabólico de Marié:</strong>
            </div>
            <p className="text-emerald-900 leading-relaxed text-[11px]">
              El aporte diario de <strong>Tyruss Full (500g)</strong> ha generado una optimización progresiva en tus receptores metabólicos, estabilizando los picos de fatiga y protegiendo tu mucosa gástrica. Se recomienda mantener la dosis de soporte diario para evitar rebotes y mantener el tono tiroideo activo.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 text-white shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left text-[11px] text-slate-400">
            📄 Formato PDF oficial con sello de validez ColShopi Tienda.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/573104007428?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
              title="Compartir resumen por WhatsApp a Marié"
            >
              <Share2 className="w-4 h-4" />
              <span>Enviar a Marié</span>
            </a>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer flex-1 sm:flex-initial ${
                downloadSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡PDF Descargado con Éxito!</span>
                </>
              ) : isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Informe PDF 30D</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

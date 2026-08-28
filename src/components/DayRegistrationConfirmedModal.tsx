import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  BookOpen,
  MessageCircle,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface DayRegistrationConfirmedModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  completedDaysCount?: number;
  userProfile: UserProfile;
  onOpenReport: () => void;
  onOpenTrend: () => void;
  onOpenChat: () => void;
  onOpenRecipes?: () => void;
  onNavigateToCalendar?: () => void;
}

export const DayRegistrationConfirmedModal: React.FC<DayRegistrationConfirmedModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  completedDaysCount = 1,
  userProfile,
  onOpenReport,
  onOpenTrend,
  onOpenChat,
  onOpenRecipes,
  onNavigateToCalendar
}) => {
  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((completedDaysCount / 30) * 100));
  const isMilestone = dayNumber === 7 || dayNumber === 14 || dayNumber === 21 || dayNumber === 30;

  const handleReturnToCalendar = () => {
    onClose();
    if (onNavigateToCalendar) {
      onNavigateToCalendar();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-100 animate-scaleUp flex flex-col my-auto max-h-[92vh]">
        {/* Header Ribbon with Back Arrow Navigation */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 relative shrink-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              type="button"
              onClick={handleReturnToCalendar}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-emerald-100 text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Calendario</span>
            </button>

            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/40">
              Día {dayNumber} de 30
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shrink-0">
              <CheckCircle2 className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Registro Exitoso & Blindado
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-white mt-1">
                ¡Día {dayNumber} Guardado con Éxito! {isMilestone ? '🎉' : '🌿'}
              </h3>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-700 overflow-y-auto">
          
          {/* Top Primary Call to Action Button */}
          <button
            type="button"
            onClick={handleReturnToCalendar}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/30"
          >
            <CalendarIcon className="w-4 h-4 text-amber-300" />
            <span>Volver al Calendario Principal</span>
          </button>

          {/* Progress Celebration Strip */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Progreso Total del Reto 30D</span>
              </div>
              <span className="text-xs font-black text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-amber-400/30">
                {completedDaysCount} de 30 días ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-emerald-950/80 rounded-full h-2 overflow-hidden border border-emerald-700/50">
              <div 
                className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <p className="text-[11px] text-emerald-100 leading-snug">
              {dayNumber >= 30 
                ? '👑 ¡Felicidades! Has completado la totalidad del Reto TyroFem 30D.'
                : dayNumber === 21
                ? '🌸 ¡Hito de 21 Días alcanzado! Tu balance hormonal y hábitos están consolidados.'
                : dayNumber === 14
                ? '⚡ ¡Hito de 14 Días completado! Tu metabolismo y energía están activos.'
                : dayNumber === 7
                ? '🌿 ¡Hito de 7 Días completado! Tu proceso de desinflamación digestiva avanza con éxito.'
                : `✨ ¡Sigue así! Estás a ${30 - completedDaysCount} ${30 - completedDaysCount === 1 ? 'día' : 'días'} de tu graduación oficial.`}
            </p>
          </div>

          {/* Educational Step Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-emerald-950">
            <div className="flex items-center gap-2">
              <span className="text-base">🌿</span>
              <h4 className="font-bold text-xs sm:text-sm text-emerald-900 font-serif-luxury">
                ¿Por qué registrar cada uno de tus 30 días?
              </h4>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              Cada día completado permite que <strong>Marié</strong> y el sistema midan tu evolución metabólica, ajusten tus pautas y construyan tu <strong>Bitácora de Bienestar en PDF</strong>. Recuerda que tu siguiente día se desbloqueará en <strong>24 horas exactas</strong>.
            </p>
          </div>

          {/* Information Saved Notice */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Información registrada y protegida contra reprocesos</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Hola <strong>{userProfile.name}</strong>, tus tomas de <strong>Tyruss Full</strong>, hidratación, alimentación y métricas somáticas de hoy han quedado <strong>oficialmente consolidadas</strong>.
            </p>
          </div>

          {/* Locked Notice Explanation */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 space-y-1">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Día asegurado para evitar duplicados: consulta disponible 24/7</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Para garantizar la precisión de tu tratamiento metabólico, este día ha quedado registrado. Podrás consultar sus datos en cualquier momento en tu calendario y reporte.
            </p>
          </div>

          {/* Quick Action Shortcuts: 3 Action buttons */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Accesos Rápidos del Día:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenRecipes) {
                    onOpenRecipes();
                  }
                }}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group cursor-pointer shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">Explorar Recetas</strong>
                  <span className="text-[10px] text-slate-500">Menús desinflamatorios</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group cursor-pointer shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">Preguntar a Marié</strong>
                  <span className="text-[10px] text-slate-500">Guía IA y hábitos</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTrend();
                }}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-cyan-500 hover:bg-cyan-50/50 text-left transition-all group cursor-pointer shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">Ver Evolución</strong>
                  <span className="text-[10px] text-slate-500">Gráficas somáticas</span>
                </div>
              </button>
            </div>
          </div>

          {/* PDF Report Access Card */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Bitácora de Bienestar (PDF)</span>
                <span className="text-[10px] text-slate-500">Descarga tu informe con firma digital y avances</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              className="px-3 py-1.5 bg-white border border-emerald-600 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Consultar PDF
            </button>
          </div>
        </div>

        {/* Footer Navigation Button */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Siguiente día disponible en 24h</span>
          </span>
          <button
            type="button"
            onClick={handleReturnToCalendar}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Volver al Calendario Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};


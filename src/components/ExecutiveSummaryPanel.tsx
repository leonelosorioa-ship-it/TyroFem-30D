import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Activity, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  CalendarCheck,
  HeartPulse,
  Trophy,
  ChevronRight,
  Info
} from 'lucide-react';
import { DayProgress, UserProfile } from '../types';

interface ExecutiveSummaryPanelProps {
  userProfile: UserProfile;
  progressMap: Record<number, DayProgress>;
  currentDay: number;
  unlockedMaxDay: number;
  onSelectSubTab?: (tab: 'registro' | 'curva' | 'informe') => void;
  onOpenReport?: () => void;
  onSelectDay?: (day: number) => void;
}

export const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({
  userProfile,
  progressMap,
  currentDay,
  unlockedMaxDay,
  onSelectSubTab,
  onOpenReport,
  onSelectDay
}) => {
  const [activeCardTooltip, setActiveCardTooltip] = useState<string | null>(null);

  // 1. Calculate Completed Days
  const completedDaysList = (Object.values(progressMap) as DayProgress[]).filter(
    p => p.completedAt || (p.tyrussTaken && p.water2L) || p.isLockedAfterSubmit
  );
  const completedDaysCount = completedDaysList.length;
  const progressPercent = Math.min(100, Math.round((completedDaysCount / 30) * 100));

  // 2. Calculate Success Streak (Racha de Éxito)
  let currentStreak = 0;
  for (let d = unlockedMaxDay; d >= 1; d--) {
    const dayData = progressMap[d];
    const isDayDone = dayData && (dayData.completedAt || (dayData.tyrussTaken && dayData.water2L) || dayData.isLockedAfterSubmit);
    if (isDayDone) {
      currentStreak++;
    } else {
      if (d === unlockedMaxDay && currentStreak === 0) {
        // Current day is still in progress, check previous
        continue;
      }
      break;
    }
  }

  // 3. Calculate Metabolic Health Status
  let metabolicStatusText = 'En Calibración';
  let metabolicSubtext = 'Iniciando fase de depuración celular';
  let metabolicScore = '4.5/5';
  let metabolicColorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let metabolicIconColor = 'text-emerald-600';

  if (completedDaysCount > 0) {
    const totalEnergy = completedDaysList.reduce((acc, curr) => acc + (curr.energyLevel || 4), 0);
    const avgEnergy = (totalEnergy / completedDaysCount).toFixed(1);
    metabolicScore = `${avgEnergy}/5`;

    const lightDigestionCount = completedDaysList.filter(p => p.digestion === 'liviana' || p.digestion === 'normal').length;
    const lightDigestionRatio = lightDigestionCount / completedDaysCount;

    if (completedDaysCount >= 21) {
      metabolicStatusText = 'Equilibrio Pleno';
      metabolicSubtext = 'Ritmo tiroideo y balance hormonal consolidado';
      metabolicColorClass = 'text-amber-900 bg-amber-50 border-amber-300';
      metabolicIconColor = 'text-amber-600';
    } else if (completedDaysCount >= 14) {
      metabolicStatusText = 'Metabolismo Activo';
      metabolicSubtext = 'Absorción optimizada de Selenio y Yodo orgánico';
      metabolicColorClass = 'text-teal-900 bg-teal-50 border-teal-300';
      metabolicIconColor = 'text-teal-600';
    } else if (completedDaysCount >= 7) {
      metabolicStatusText = 'Fase Desinflamada';
      metabolicSubtext = lightDigestionRatio >= 0.7 ? 'Tránsito digestivo y confort óptimo' : 'Depuración activa en curso';
      metabolicColorClass = 'text-emerald-900 bg-emerald-50 border-emerald-300';
      metabolicIconColor = 'text-emerald-600';
    } else {
      metabolicStatusText = 'Fase de Adaptación';
      metabolicSubtext = 'Primeros estímulos celulares con Tyruss Full';
      metabolicColorClass = 'text-cyan-900 bg-cyan-50 border-cyan-300';
      metabolicIconColor = 'text-cyan-600';
    }
  }

  // 4. Calculate Next Goal (Próxima Meta)
  const milestones = [
    { day: 7, title: 'Hito 7D: Desinflamación Intestinal', desc: '1ra semana de colon limpio', badge: '🌿 Desinflamada' },
    { day: 14, title: 'Hito 14D: Chispa Metabólica', desc: 'Nutrición tiroidea y energía', badge: '⚡ Chispa Vital' },
    { day: 21, title: 'Hito 21D: Equilibrio Femenino', desc: 'Hábito anclado y control de sofocos', badge: '🌸 Balance Total' },
    { day: 30, title: 'Hito 30D: Transformación Dorada', desc: 'Graduación oficial y renovación', badge: '👑 Graduada 30D' }
  ];

  const nextMilestone = milestones.find(m => m.day > completedDaysCount) || milestones[milestones.length - 1];
  const daysUntilNext = Math.max(0, nextMilestone.day - completedDaysCount);
  const isAllCompleted = completedDaysCount >= 30;

  return (
    <div className="space-y-3.5" id="executive-summary-panel">
      {/* Top Header Label with ColShopi Official Corporate Colors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-100" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950">
              Panel de Resumen Ejecutivo
            </span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              ColShopi Tienda
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Usuaria VIP:</span>
          <span className="font-bold text-emerald-900 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
            {userProfile.name}
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-slate-600">Día {currentDay} de 30</span>
        </div>
      </div>

      {/* 4 Interactive Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* TARJETA 1: Días Completados */}
        <div 
          id="card-dias-completados"
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('registro');
            if (onSelectDay) onSelectDay(currentDay);
          }}
          className="group relative bg-white hover:bg-emerald-50/30 rounded-2xl p-4.5 border border-emerald-200/90 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Haz clic para ver o registrar el progreso de tu día actual"
        >
          {/* Subtle ColShopi green decorative glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-950 transition-colors">
                  Días Completados
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-luxury tracking-tight">
                {completedDaysCount}
              </span>
              <span className="text-xs font-bold text-slate-500">
                / 30 días
              </span>
              <span className="ml-auto text-xs font-black text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-lg shadow-2xs">
                {progressPercent}%
              </span>
            </div>

            {/* ColShopi Gradient Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden p-0.5 border border-slate-200/70">
              <div 
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium truncate">
              {completedDaysCount >= 30 ? '🎉 Reto 30D Completado' : `${30 - completedDaysCount} días restantes`}
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>Registrar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* TARJETA 2: Racha de Éxito */}
        <div 
          id="card-racha-exito"
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('registro');
            if (onSelectDay) onSelectDay(currentDay);
          }}
          className="group relative bg-white hover:bg-amber-50/30 rounded-2xl p-4.5 border border-amber-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Tu constancia diaria consecutiva de tomas de Tyruss Full y hábitos saludables"
        >
          {/* Subtle ColShopi Amber/Gold decorative glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 group-hover:text-amber-950 transition-colors">
                  Racha de Éxito
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:scale-105 transition-all shadow-2xs">
                <Flame className="w-4 h-4 fill-amber-500 group-hover:fill-slate-950 text-amber-500 group-hover:text-slate-950" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-luxury tracking-tight">
                {currentStreak}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currentStreak === 1 ? 'día seguido' : 'días seguidos'}
              </span>
              {currentStreak >= 3 && (
                <span className="ml-auto text-[10px] font-black text-amber-900 bg-amber-200/90 border border-amber-300 px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                  <span>🔥 En Racha</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-1">
              {currentStreak >= 7
                ? '¡Constancia impecable! Hábito 100% blindado'
                : currentStreak >= 3
                ? '¡Excelente ritmo! Cada toma cuenta'
                : currentStreak > 0
                ? 'Mantén la toma diaria de Tyruss Full'
                : 'Inicia hoy tu racha con Tyruss Full'}
            </p>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 font-semibold truncate">
              {currentStreak > 0 ? `✨ ${currentStreak} tomas continuas` : 'Conserva tu rutina'}
            </span>
            <span className="text-amber-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>Continuar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* TARJETA 3: Estado Metabólico */}
        <div 
          id="card-estado-metabolico"
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('curva');
          }}
          className="group relative bg-white hover:bg-teal-50/30 rounded-2xl p-4.5 border border-teal-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Haz clic para ver la Curva Evolutiva de energía y digestión en Recharts"
        >
          {/* Subtle ColShopi Teal decorative glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 group-hover:text-teal-950 transition-colors">
                  Estado Metabólico
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                  {metabolicStatusText}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${metabolicColorClass} shadow-2xs`}>
                  ★ {metabolicScore}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {metabolicSubtext}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-teal-800 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              <span>Ver Curva Evolutiva</span>
            </span>
            <span className="text-teal-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>Explorar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* TARJETA 4: Próxima Meta */}
        <div 
          id="card-proxima-meta"
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('informe');
            if (onOpenReport) onOpenReport();
          }}
          className="group relative bg-white hover:bg-emerald-50/30 rounded-2xl p-4.5 border border-emerald-200/90 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Haz clic para abrir tu Informe de Transformación 30D y medallas"
        >
          {/* Subtle ColShopi Green/Gold decorative glow */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-950 transition-colors">
                  Próxima Meta
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                <Target className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {nextMilestone.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {isAllCompleted 
                  ? '¡Has desbloqueado todas las medallas 30D!' 
                  : `Faltan ${daysUntilNext} ${daysUntilNext === 1 ? 'día' : 'días'} para desbloquear`}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isAllCompleted ? 'Certificado 30D' : `Objetivo Día ${nextMilestone.day}`}</span>
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>Informe</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

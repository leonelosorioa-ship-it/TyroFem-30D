import React from 'react';
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
  Calendar
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
  let metabolicSubtext = 'Iniciando fase de desinflamación';
  let metabolicScore = '4.5/5';
  let metabolicBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';

  if (completedDaysCount > 0) {
    const totalEnergy = completedDaysList.reduce((acc, curr) => acc + (curr.energyLevel || 4), 0);
    const avgEnergy = (totalEnergy / completedDaysCount).toFixed(1);
    metabolicScore = `${avgEnergy}/5`;

    const lightDigestionCount = completedDaysList.filter(p => p.digestion === 'liviana' || p.digestion === 'normal').length;
    const lightDigestionRatio = lightDigestionCount / completedDaysCount;

    if (completedDaysCount >= 21) {
      metabolicStatusText = 'Equilibrio Pleno';
      metabolicSubtext = 'Ritmo tiroideo y hormonal consolidado';
      metabolicBadgeColor = 'bg-amber-50 text-amber-900 border-amber-300';
    } else if (completedDaysCount >= 14) {
      metabolicStatusText = 'Metabolismo Activo';
      metabolicSubtext = 'Absorción optimizada con Selenio y Yodo';
      metabolicBadgeColor = 'bg-teal-50 text-teal-900 border-teal-300';
    } else if (completedDaysCount >= 7) {
      metabolicStatusText = 'Fase Desinflamada';
      metabolicSubtext = lightDigestionRatio >= 0.7 ? 'Tránsito digestivo óptimo' : 'Depuración activa en curso';
      metabolicBadgeColor = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    } else {
      metabolicStatusText = 'Fase de Adaptación';
      metabolicSubtext = 'Primeros estímulos celulares con Tyruss';
      metabolicBadgeColor = 'bg-cyan-50 text-cyan-900 border-cyan-300';
    }
  }

  // 4. Calculate Next Goal (Próxima Meta)
  const milestones = [
    { day: 7, title: 'Hito 7D: Desinflamación Intestinal', desc: '1ra semana de colon limpio', icon: '🌿' },
    { day: 14, title: 'Hito 14D: Chispa Metabólica', desc: 'Nutrición tiroidea profunda', icon: '⚡' },
    { day: 21, title: 'Hito 21D: Equilibrio Femenino', desc: 'Hábito anclado y balance', icon: '🌸' },
    { day: 30, title: 'Hito 30D: Transformación Dorada', desc: 'Graduación y renovación total', icon: '👑' }
  ];

  const nextMilestone = milestones.find(m => m.day > completedDaysCount) || milestones[milestones.length - 1];
  const daysUntilNext = Math.max(0, nextMilestone.day - completedDaysCount);
  const isAllCompleted = completedDaysCount >= 30;

  return (
    <div className="space-y-3" id="executive-summary-panel">
      {/* Small Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
            Resumen Ejecutivo • {userProfile.name}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium">
          Día {currentDay} • Reto TyroFem 30D
        </span>
      </div>

      {/* 4 Interactive Executive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* CARD 1: Días Completados */}
        <div 
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('registro');
          }}
          className="group relative bg-white hover:bg-slate-50/80 rounded-2xl p-4 border border-emerald-100/90 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Ver o registrar tu progreso diario"
        >
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-900 transition-colors">
                Días Completados
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-serif-luxury tracking-tight">
                {completedDaysCount}
              </span>
              <span className="text-xs font-bold text-slate-500">
                / 30 días
              </span>
              <span className="ml-auto text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                {progressPercent}%
              </span>
            </div>

            {/* Mini Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden p-0.5 border border-slate-200/60">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate">
              {completedDaysCount >= 30 ? '🎉 Reto 30D Completado' : `${30 - completedDaysCount} días restantes`}
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Registrar</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 2: Racha de Éxito */}
        <div 
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('registro');
          }}
          className="group relative bg-white hover:bg-slate-50/80 rounded-2xl p-4 border border-amber-200/80 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Tu constancia consecutiva en el consumo de Tyruss y hábitos saludables"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 group-hover:text-amber-900 transition-colors">
                Racha de Éxito
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
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
                <span className="ml-auto text-[10px] font-black text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>🔥 En llamas</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-2 line-clamp-1">
              {currentStreak >= 7
                ? '¡Constancia impecable! Hábito 100% blindado'
                : currentStreak >= 3
                ? '¡Excelente ritmo! Cada día cuenta'
                : 'Mantén la toma diaria de Tyruss Full'}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-800 font-medium">
              {currentStreak > 0 ? `✨ ${currentStreak} tomas consecutivas` : 'Inicia tu racha hoy'}
            </span>
            <span className="text-amber-700 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Continuar</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 3: Estado Metabólico */}
        <div 
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('curva');
          }}
          className="group relative bg-white hover:bg-slate-50/80 rounded-2xl p-4 border border-teal-100/90 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Ver gráfico interactivo de energía y digestión en Recharts"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-teal-500/10 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 group-hover:text-teal-900 transition-colors">
                Estado Metabólico
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {metabolicStatusText}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md border bg-teal-50 text-teal-900 border-teal-300">
                  ★ {metabolicScore}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {metabolicSubtext}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-teal-800 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-teal-600" />
              <span>Ver Curva Evolutiva</span>
            </span>
            <span className="text-teal-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 4: Próxima Meta */}
        <div 
          onClick={() => {
            if (onSelectSubTab) onSelectSubTab('informe');
          }}
          className="group relative bg-white hover:bg-slate-50/80 rounded-2xl p-4 border border-emerald-200 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          title="Ver tus insignias, informe clínico PDF y metas de transformación"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-900 transition-colors">
                Próxima Meta
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{nextMilestone.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {nextMilestone.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {isAllCompleted 
                  ? '¡Has desbloqueado todas las medallas!' 
                  : `Faltan ${daysUntilNext} ${daysUntilNext === 1 ? 'día' : 'días'} para desbloquear`}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 font-semibold flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-600" />
              <span>{isAllCompleted ? 'Ver Certificado' : `Día ${nextMilestone.day} Objetivo`}</span>
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Informe</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

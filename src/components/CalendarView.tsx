import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Flame, 
  AlertCircle,
  ShoppingBag,
  Droplet,
  Utensils,
  Filter,
  Lock,
  Clock,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Check
} from 'lucide-react';
import { DayPlan, DayProgress, UserProfile } from '../types';
import { CALENDAR_DAYS } from '../data/calendarData';
import { 
  getDayStatus, 
  getConsecutiveCompletedDays, 
  TimeRemaining 
} from '../utils/timeLock';
import { DayCountdownClock } from './DayCountdownClock';
import { SuccessStoriesCarousel } from './SuccessStoriesCarousel';

interface CalendarViewProps {
  userProfile: UserProfile;
  progressMap: Record<number, DayProgress>;
  onSelectDay: (dayPlan: DayPlan) => void;
  onOpenOrder: () => void;
  onOpenChat: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  userProfile,
  progressMap,
  onSelectDay,
  onOpenOrder,
  onOpenChat
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [isGuideExpanded, setIsGuideExpanded] = useState<boolean>(true);
  const [, setTick] = useState<number>(Date.now());

  // Live timer tick every 1000ms to update all countdowns in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedDays = getConsecutiveCompletedDays(progressMap);
  const completedCount = completedDays.length;
  const targetDay = Math.min(30, completedCount + 1);
  const targetStatus = getDayStatus(targetDay, progressMap, userProfile);
  const isTargetActive = targetStatus.status === 'ACTIVE';
  const isTargetCountdown = targetStatus.status === 'COUNTDOWN';
  const isAllProgramCompleted = completedCount >= 30;

  // Active display day
  const displayCurrentDay = isTargetActive ? targetDay : (completedCount > 0 ? completedDays[completedCount - 1] : 1);

  const phases = [
    { id: 1, name: 'Semana 1', label: 'Limpieza & Desinflamación', range: 'Días 1-7', icon: '🌿', color: 'from-emerald-600 to-teal-700' },
    { id: 2, name: 'Semana 2', label: 'Nutrición Tiroidea & Metabolismo', range: 'Días 8-14', icon: '🦋', color: 'from-teal-600 to-cyan-700' },
    { id: 3, name: 'Semana 3', label: 'Balance Hormonal & Sofocos', range: 'Días 15-21', icon: '🌸', color: 'from-rose-500 to-pink-700' },
    { id: 4, name: 'Semana 4', label: 'Fijación Metabólica & Vitalidad', range: 'Días 22-30', icon: '💎', color: 'from-amber-600 to-emerald-700' },
  ];

  const filteredDays = selectedPhase === 'all' 
    ? CALENDAR_DAYS 
    : CALENDAR_DAYS.filter(d => d.phaseNumber === selectedPhase);

  const isReorderActive = displayCurrentDay >= 22;

  return (
    <div className="space-y-6 pb-20">
      {/* Educational Mini-Tour Banner: ¿Cómo funciona tu reto de 30 días? */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-emerald-950 shadow-xs">
        <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={() => setIsGuideExpanded(prev => !prev)}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              💡
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-serif-luxury text-emerald-950">
                ¿Cómo funciona tu reto de 30 días?
              </h3>
              <p className="text-[11px] text-emerald-800">
                Aprende la dinámica de desbloqueo diario y registro para completar con éxito tu reto.
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="p-1.5 rounded-lg bg-emerald-200/60 hover:bg-emerald-300/60 text-emerald-900 transition-colors"
            aria-label="Alternar guía"
          >
            {isGuideExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isGuideExpanded && (
          <div className="mt-3.5 pt-3.5 border-t border-emerald-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-fadeIn">
            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 flex items-start gap-2.5 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs">Paso 1: Revisa tu pauta</strong>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Abre el día activo para consultar tu dosis de <strong>Tyruss Full</strong>, pautas alimentarias y meta de hidratación.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 flex items-start gap-2.5 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs">Paso 2: Registra tu progreso</strong>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Al final del día completa tu test somático. Tu día quedará <strong>sellado</strong> y el siguiente se activará en 24h.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 flex items-start gap-2.5 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs">Paso 3: Aprovecha los módulos</strong>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Explora recetas antiinflamatorias, monitorea tus gráficos de energía y resuelve dudas en vivo con <strong>Marié IA</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hero Welcome & Phase Overview */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Programa Oficial TyroFem 30D</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight font-serif-luxury">
              Tu Viaje de 30 Días, {userProfile.name} 🌿
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Cada día se desbloquea secuencialmente cada <strong>24 horas exactas</strong> para garantizar la asimilación biológica de tu porción de <strong>Tyruss Full</strong> y asegurar el éxito de tu transformación.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 shrink-0 min-w-full sm:min-w-[240px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex flex-col items-center justify-center text-slate-900 shadow-md font-bold shrink-0">
              <span className="text-[10px] sm:text-xs uppercase leading-none font-semibold">
                {isAllProgramCompleted ? 'Fin' : isTargetActive ? 'Hoy' : 'Día'}
              </span>
              <span className="text-lg sm:text-xl leading-tight">
                {isAllProgramCompleted ? '30' : targetDay}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-200">Progreso 30D</span>
                <span className="text-xs sm:text-sm font-bold text-white">{completedCount}/30 Días</span>
              </div>
              <div className="w-full bg-emerald-950/60 rounded-full h-2 overflow-hidden border border-emerald-400/20">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / 30) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-200/80 mt-1 block font-medium">
                {isAllProgramCompleted 
                  ? '🎉 ¡Felicidades! Reto 100% Completado' 
                  : isTargetActive
                  ? `Día ${targetDay} activo para registro • ${30 - completedCount} restantes`
                  : `Día ${targetDay} desbloquea en ${targetStatus.formattedCountdown} • ${30 - completedCount} restantes`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 24-HOUR TIME LOCK LIVE BANNER */}
      {!isAllProgramCompleted && (
        isTargetCountdown ? (
          <div className="bg-gradient-to-r from-[#09121d] via-slate-900 to-[#070e17] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-cyan-500/40 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-inner">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-cyan-400" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/40">
                    ⏳ Desbloqueo Regresivo 24H
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-300 font-medium">
                    Día {targetDay - 1} Completado con Éxito
                  </span>
                </div>
                <h4 className="text-[11px] sm:text-sm font-bold text-white font-serif-luxury">
                  Próximo Test & Guía del Día {targetDay} se habilita en:
                </h4>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center justify-center md:justify-end shrink-0">
              <DayCountdownClock
                dayNumber={targetDay}
                progressMap={progressMap}
                userProfile={userProfile}
                variant="card"
                showExplanation={false}
              />
            </div>
          </div>
        ) : isTargetActive ? (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-emerald-400/40 text-white shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
                    ✨ Día {targetDay} Habilitado
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                  ¡Tu guía diaria y test somático del Día {targetDay} están listos para registrar!
                </h4>
              </div>
            </div>
            <button
              onClick={() => {
                const dayPlan = CALENDAR_DAYS.find(d => d.dayNumber === targetDay) || CALENDAR_DAYS[0];
                onSelectDay(dayPlan);
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              Abrir Día {targetDay}
            </button>
          </div>
        ) : null
      )}

      {/* DAY 22+ RE-ORDER TRIGGER NOTIFICATION BANNER */}
      {isReorderActive && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-300 animate-pulse-subtle">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0 mt-0.5">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase bg-white text-orange-950 px-2 py-0.5 rounded-full">
                  Día 22 • Alerta de Continuidad
                </span>
              </div>
              <h4 className="font-bold text-base mt-0.5">¡Vas excelente en tu transformación, {userProfile.name}!</h4>
              <p className="text-xs text-amber-50 leading-relaxed mt-0.5 max-w-xl">
                Tu primer tarro de Tyruss Full (25 tomas) está por culminar. Solicita tu recompra con beneficio exclusivo para clientas de Marié en <strong>ColShopi Tienda</strong> y no pauses tu fijación metabólica.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenOrder}
            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span>Solicitar Recompra con Obsequio</span>
          </button>
        </div>
      )}

      {/* Phase Filter Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>Fases del Programa</span>
          </h3>
          <button
            onClick={() => setSelectedPhase('all')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedPhase === 'all' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            Ver Todos los 30 Días
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {phases.map((phase) => {
            const isSelected = selectedPhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{phase.icon}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {phase.range}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{phase.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{phase.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-emerald-700" />
            <span>
              {selectedPhase === 'all' 
                ? 'Calendario Completo (30 Días)' 
                : `Días de la ${phases.find(p => p.id === selectedPhase)?.name}`}
            </span>
          </h3>
          <span className="text-xs text-slate-500">Toca cualquier día para ver tu guía o tiempo restante</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDays.map((day) => {
            const progress = progressMap[day.dayNumber];
            const dayStatus = getDayStatus(day.dayNumber, progressMap, userProfile);
            const isCompleted = dayStatus.status === 'COMPLETED';
            const isCurrent = dayStatus.status === 'ACTIVE';
            const isCountdown = dayStatus.status === 'COUNTDOWN';
            const isLocked = dayStatus.status === 'LOCKED';

            return (
              <div
                key={day.dayNumber}
                onClick={() => onSelectDay(day)}
                className={`group relative bg-white rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isCompleted 
                    ? 'border-emerald-300 bg-emerald-50/30' 
                    : isCurrent 
                    ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/20 shadow-xs' 
                    : isCountdown
                    ? 'border-cyan-400 ring-1 ring-cyan-400/40 bg-cyan-50/15'
                    : 'border-slate-200/80 bg-slate-50/60 opacity-80'
                }`}
              >
                {/* Top card bar: Day pill & status */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-white animate-pulse-subtle'
                          : isCountdown
                          ? 'bg-cyan-900 text-cyan-200 border border-cyan-500/40'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        Día {day.dayNumber}
                        {isCurrent && <Flame className="w-3 h-3 fill-white" />}
                        {isCountdown && <Lock className="w-3 h-3 text-cyan-300" />}
                        {isLocked && <Lock className="w-3 h-3 text-slate-500" />}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                        Fase {day.phaseNumber}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completado
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/60">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Hoy Activo
                      </span>
                    ) : isCountdown ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded-full border border-cyan-500/40 shadow-xs">
                        <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
                        {dayStatus.formattedCountdown}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3 text-slate-400" />
                        Bloqueado
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold transition-colors line-clamp-1 ${
                    isLocked ? 'text-slate-600' : 'text-slate-900 group-hover:text-emerald-800'
                  }`}>
                    {day.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {day.nutritionalFocus}
                  </p>
                </div>

                {/* Bottom Micro Badges or Lock Countdown */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 text-emerald-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{day.tyrussDose}</span>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span title="Dosis Tyruss">
                        <Utensils className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      </span>
                      <span title="2L de Agua">
                        <Droplet className="w-3.5 h-3.5 text-teal-600 font-bold" />
                      </span>
                    </div>
                  ) : isCurrent ? (
                    <div className="flex items-center gap-1 text-amber-700 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Listo para test</span>
                    </div>
                  ) : isCountdown ? (
                    <div className="flex items-center gap-1 text-cyan-800 text-[10px] font-semibold">
                      <Clock className="w-3 h-3 text-cyan-600" />
                      <span>Desbloqueo a las 24h</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-semibold">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Bloqueado</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Proof: Historias de Éxito de Clientas ColShopi */}
      <SuccessStoriesCarousel
        userProfile={userProfile}
        onOpenDayPlan={() => {
          const currentPlan = CALENDAR_DAYS.find(d => d.dayNumber === displayCurrentDay) || CALENDAR_DAYS[0];
          onSelectDay(currentPlan);
        }}
        onOpenChat={onOpenChat}
        onOpenOrder={onOpenOrder}
      />
    </div>
  );
};

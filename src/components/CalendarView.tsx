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
  Lock, 
  Clock, 
  ChevronDown, 
  X
} from 'lucide-react';
import { DayPlan, DayProgress, UserProfile } from '../types';
import { CALENDAR_DAYS } from '../data/calendarData';
import { 
  getDayStatus, 
  getConsecutiveCompletedDays 
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

  const isReorderActive = displayCurrentDay >= 22;

  // Detectar si la usuaria acaba de registrar un día (en los últimos 10 minutos)
  const lastRecordedDayNumber = completedCount > 0 ? completedDays[completedCount - 1] : null;
  const lastCompletedDayData = lastRecordedDayNumber ? progressMap[lastRecordedDayNumber] : null;
  const [showCelebrationBanner, setShowCelebrationBanner] = useState<boolean>(true);

  const isRecentCompletion = Boolean(
    lastCompletedDayData?.completedAt && 
    (Date.now() - new Date(lastCompletedDayData.completedAt).getTime() < 1000 * 60 * 15)
  );

  return (
    <div className="space-y-5 pb-20">
      {/* Banner de Celebración Inmediata de Éxito al volver a la sección principal */}
      {isRecentCompletion && showCelebrationBanner && lastRecordedDayNumber && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl border border-emerald-300/40 animate-scaleUp relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
                🎉
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    ¡Registro del Día {lastRecordedDayNumber} Confirmado! ✨
                  </span>
                  <span className="text-[11px] text-emerald-200 font-semibold hidden sm:inline">
                    {completedCount} de 30 días acumulados
                  </span>
                </div>
                <h3 className="text-sm sm:text-lg font-bold font-serif-luxury text-white">
                  ¡Bravo, {userProfile.name}! Tus datos diarios quedaron guardados con éxito 🌿
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-100/90 leading-snug">
                  Tu progreso de hoy está seguro. Ya puedes revisar tus recetas, ver tu bitácora o descansar: tu siguiente día se habilitará en 24 horas exactas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCelebrationBanner(false)}
              className="p-1.5 text-white/70 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition-colors cursor-pointer shrink-0"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Welcome & Phase Overview */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Programa Oficial TyroFem 30D • ColShopi</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight font-serif-luxury">
              Tu Viaje de 30 Días, {userProfile.name} 🌿
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Visualiza en la cuadrícula tu camino de 30 días: aquellos días que ya registraste (en verde), el día activo (en dorado) y los próximos días por desbloquear cada 24 horas.
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
              <div className="w-full bg-emerald-950/60 rounded-full h-2.5 overflow-hidden border border-emerald-400/20">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / 30) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-200/90 mt-1 block font-medium">
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

      {/* SECCIÓN PRINCIPAL: CUADRÍCULA DIRECTA DE LOS 30 DÍAS */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-100/90 shadow-md space-y-4">
        {/* Header de la Cuadrícula */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-slate-900">
                Tu Reto de 30 Días al Detalle
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toca directamente cualquier casilla para abrir su test, guía nutricional o ver su cuenta regresiva.
            </p>
          </div>

          {/* Mini Leyenda Rápida */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Realizados ({completedCount})
            </span>
            <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" />
              Activo Hoy
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
              Por Registrar ({30 - completedCount})
            </span>
          </div>
        </div>

        {/* Cuadrícula Visual de los 30 Días (5 x 6 o 6 x 5 responsiva) */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-2.5 pt-1">
          {CALENDAR_DAYS.map((day) => {
            const dayStatus = getDayStatus(day.dayNumber, progressMap, userProfile);
            const isCompleted = dayStatus.status === 'COMPLETED';
            const isCurrent = dayStatus.status === 'ACTIVE';
            const isCountdown = dayStatus.status === 'COUNTDOWN';
            const isLocked = dayStatus.status === 'LOCKED';

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => onSelectDay(day)}
                className={`relative aspect-square sm:aspect-auto sm:h-20 rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 text-center border ${
                  isCompleted
                    ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-xs hover:from-emerald-500 hover:to-teal-600'
                    : isCurrent
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black border-amber-300 ring-4 ring-amber-400/30 shadow-md hover:scale-105'
                    : isCountdown
                    ? 'bg-gradient-to-b from-slate-900 to-cyan-950 text-cyan-200 border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-800'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300 hover:bg-white'
                }`}
                title={`Día ${day.dayNumber}: ${day.title}`}
              >
                {/* Indicador de Número de Día */}
                <span className={`text-xs sm:text-base font-black ${isCurrent ? 'text-slate-950 text-sm sm:text-lg' : ''}`}>
                  {day.dayNumber}
                </span>

                {/* Subtítulo / Ícono de Estado */}
                <div className="mt-0.5 sm:mt-1 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  ) : isCurrent ? (
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-tight bg-slate-950 text-amber-300 px-1 py-0.2 rounded-md">
                      HOY
                    </span>
                  ) : isCountdown ? (
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300 animate-pulse" />
                  ) : (
                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                  )}
                </div>

                {/* Micro etiqueta visible en pantallas mayores */}
                <span className="hidden sm:block text-[9px] truncate max-w-full px-1 mt-0.5 opacity-85">
                  {isCompleted ? 'Listo' : isCurrent ? 'Registrar' : isCountdown ? '24h' : 'Pronto'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resumen Informativo de Progreso y Fases */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🌿</span>
            <span className="text-slate-700">
              Progreso actual: <strong>{completedCount} de 30 días realizados</strong> ({Math.round((completedCount / 30) * 100)}%).
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const currentPlan = CALENDAR_DAYS.find(d => d.dayNumber === displayCurrentDay) || CALENDAR_DAYS[0];
              onSelectDay(currentPlan);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Continuar con el Día {displayCurrentDay}</span>
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </div>
      </div>

      {/* GUÍA DETALLADA DÍA A DÍA */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-emerald-700" />
            <span>Guía Nutricional & Test Somático de Cada Día</span>
          </h3>
          <span className="text-xs text-slate-500">Toca para abrir cualquier día</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CALENDAR_DAYS.map((day) => {
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

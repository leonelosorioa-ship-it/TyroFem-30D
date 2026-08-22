import React, { useState, useEffect } from 'react';
import { Clock, Lock, Sparkles, ShieldCheck, Flame } from 'lucide-react';
import { getTimeRemainingForDay, TimeRemaining } from '../utils/timeLock';

interface DayCountdownClockProps {
  dayNumber: number;
  startDate?: string;
  variant?: 'hero' | 'card' | 'compact' | 'inline';
  showExplanation?: boolean;
  onUnlocked?: () => void;
}

export const DayCountdownClock: React.FC<DayCountdownClockProps> = ({
  dayNumber,
  startDate,
  variant = 'card',
  showExplanation = true,
  onUnlocked
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    getTimeRemainingForDay(dayNumber, startDate)
  );

  useEffect(() => {
    const updateTimer = () => {
      const remaining = getTimeRemainingForDay(dayNumber, startDate);
      setTimeRemaining(remaining);
      if (remaining.isUnlocked && onUnlocked) {
        onUnlocked();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dayNumber, startDate, onUnlocked]);

  if (timeRemaining.isUnlocked) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-bold animate-fadeIn">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>¡Día {dayNumber} Habilitado! Puedes realizar el test hoy.</span>
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-mono font-bold shadow-xs">
        <Lock className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>Desbloquea en: {timeRemaining.formatted}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-amber-300 font-mono font-bold text-xs bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
        <Clock className="w-3 h-3 text-amber-400" />
        {timeRemaining.formatted}
      </span>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1724] via-[#09101a] to-[#04080e] p-6 text-white border border-cyan-500/40 shadow-2xl space-y-4">
        {/* Glow ambient lights */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Ciclo Biológico de 24 Horas en Curso</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
            El Test Somático del Día {dayNumber} se Habilitará en:
          </h3>

          {/* Glowing Digital Flip Countdown Clock */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 py-2 w-full max-w-sm">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-full bg-[#0d1622] border border-cyan-500/50 rounded-2xl py-3 px-2 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 tracking-wider">
                  {pad(timeRemaining.hours)}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Horas
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-full bg-[#0d1622] border border-cyan-500/50 rounded-2xl py-3 px-2 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-300 tracking-wider">
                  {pad(timeRemaining.minutes)}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Minutos
              </span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-full bg-[#0d1622] border border-amber-500/50 rounded-2xl py-3 px-2 flex items-center justify-center shadow-lg shadow-amber-950/50 animate-pulse">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300 tracking-wider">
                  {pad(timeRemaining.seconds)}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Segundos
              </span>
            </div>
          </div>

          {showExplanation && (
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5 max-w-md">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantía de Adherencia al Reto de 30 Días</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Para que el <strong>selenio, yodo orgánico y aminoácidos de Tyruss Full</strong> regulen tu metabolismo y balance tiroideo, tu organismo requiere un ciclo metabólico completo de 24 horas entre cada dosis matutina y registro diario.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard 'card' variant
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0c1622] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-amber-500/40 text-white shadow-md relative overflow-hidden w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                🔒 Día {dayNumber} Bloqueado
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                Ciclo 24h
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
              Tiempo restante para el test:
            </h4>
          </div>
        </div>

        {/* Digital Clock Badge */}
        <div className="flex items-center justify-center gap-1.5 bg-slate-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-cyan-500/50 shadow-inner font-mono w-full sm:w-auto">
          <div className="text-center min-w-[28px]">
            <span className="text-base sm:text-lg font-bold text-cyan-300">{pad(timeRemaining.hours)}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 block -mt-1">h</span>
          </div>
          <span className="text-cyan-500 font-bold text-sm sm:text-base">:</span>
          <div className="text-center min-w-[28px]">
            <span className="text-base sm:text-lg font-bold text-emerald-300">{pad(timeRemaining.minutes)}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 block -mt-1">m</span>
          </div>
          <span className="text-emerald-500 font-bold text-sm sm:text-base">:</span>
          <div className="text-center min-w-[28px]">
            <span className="text-base sm:text-lg font-bold text-amber-300">{pad(timeRemaining.seconds)}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-400 block -mt-1">s</span>
          </div>
        </div>
      </div>

      {showExplanation && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 text-[10px] sm:text-[11px] text-slate-400 flex items-start gap-1.5">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Cada día se activa exactamente a las <strong>24 horas</strong> del día anterior para asegurar la asimilación gradual de los 30 días calendario.
          </span>
        </div>
      )}
    </div>
  );
};

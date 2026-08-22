import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Sparkles, 
  ChevronRight, 
  Flame, 
  AlertCircle,
  ShoppingBag,
  Heart,
  Droplet,
  Utensils,
  Award,
  Filter
} from 'lucide-react';
import { DayPlan, DayProgress, UserProfile } from '../types';
import { CALENDAR_DAYS } from '../data/calendarData';

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

  const completedCount = (Object.values(progressMap) as DayProgress[]).filter(p => p.completedAt || (p.tyrussTaken && p.water2L)).length;
  const currentDay = userProfile.currentDay || 1;

  const phases = [
    { id: 1, name: 'Semana 1', label: 'Limpieza & Desinflamación', range: 'Días 1-7', icon: '🌿', color: 'from-emerald-600 to-teal-700' },
    { id: 2, name: 'Semana 2', label: 'Nutrición Tiroidea & Metabolismo', range: 'Días 8-14', icon: '🦋', color: 'from-teal-600 to-cyan-700' },
    { id: 3, name: 'Semana 3', label: 'Balance Hormonal & Sofocos', range: 'Días 15-21', icon: '🌸', color: 'from-rose-500 to-pink-700' },
    { id: 4, name: 'Semana 4', label: 'Fijación Metabólica & Vitalidad', range: 'Días 22-30', icon: '💎', color: 'from-amber-600 to-emerald-700' },
  ];

  const filteredDays = selectedPhase === 'all' 
    ? CALENDAR_DAYS 
    : CALENDAR_DAYS.filter(d => d.phaseNumber === selectedPhase);

  const isReorderActive = currentDay >= 22;

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Welcome & Phase Overview */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Programa Oficial TyroFem 30D</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-luxury">
              Tu Viaje de 30 Días, {userProfile.name} 🌿
            </h2>
            <p className="text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Cada día está estructurado con tareas nutricionales, el tip exclusivo de la Nutricionista Marié y el modo exacto de tu porción de <strong>Tyruss Full</strong>.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 min-w-[240px]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex flex-col items-center justify-center text-slate-900 shadow-md font-bold shrink-0">
              <span className="text-xs uppercase leading-none font-semibold">Día</span>
              <span className="text-xl leading-tight">{currentDay}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-semibold text-emerald-200">Progreso</span>
                <span className="text-sm font-bold text-white">{completedCount}/30 Días</span>
              </div>
              <div className="w-full bg-emerald-950/60 rounded-full h-2 overflow-hidden border border-emerald-400/20">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / 30) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-200/80 mt-1 block">
                {completedCount >= 30 ? '🎉 ¡Felicidades! Reto Completado' : `${30 - completedCount} días para tu transformación total`}
              </span>
            </div>
          </div>
        </div>
      </div>

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
              <h4 className="font-bold text-base mt-0.5">¡Vas excelente en tu transformación!</h4>
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
          <span className="text-xs text-slate-500">Toca cualquier día para ver tu guía</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDays.map((day) => {
            const progress = progressMap[day.dayNumber];
            const isCompleted = progress?.completedAt || (progress?.tyrussTaken && progress?.water2L);
            const isCurrent = day.dayNumber === currentDay;

            return (
              <div
                key={day.dayNumber}
                onClick={() => onSelectDay(day)}
                className={`group relative bg-white rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isCompleted 
                    ? 'border-emerald-300 bg-emerald-50/30' 
                    : isCurrent 
                    ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/20' 
                    : 'border-slate-200 hover:border-emerald-300'
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
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        Día {day.dayNumber}
                        {isCurrent && <Flame className="w-3 h-3 fill-white" />}
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
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Hoy
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 group-hover:text-emerald-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {day.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {day.nutritionalFocus}
                  </p>
                </div>

                {/* Bottom Micro Badges */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 text-emerald-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{day.tyrussDose}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span title="Dosis Tyruss">
                      <Utensils className={`w-3.5 h-3.5 ${progress?.tyrussTaken ? 'text-emerald-600 font-bold' : ''}`} />
                    </span>
                    <span title="2L de Agua">
                      <Droplet className={`w-3.5 h-3.5 ${progress?.water2L ? 'text-teal-600 font-bold' : ''}`} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

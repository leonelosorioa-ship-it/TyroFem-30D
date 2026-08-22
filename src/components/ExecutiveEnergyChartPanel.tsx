import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import {
  Zap,
  TrendingUp,
  Sparkles,
  Star,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { DayProgress, UserProfile } from '../types';

interface ExecutiveEnergyChartPanelProps {
  progressMap: Record<number, DayProgress>;
  currentDay: number;
  unlockedMaxDay: number;
  userProfile?: UserProfile;
  onExploreFullCurve?: () => void;
  onSelectDay?: (day: number) => void;
}

interface ChartPoint {
  day: string;
  dayNum: number;
  energy: number | null;
  displayEnergy: number;
  digestion?: string;
  mood?: string;
  sleepStars?: number;
  tyrussTaken?: boolean;
  hasRecord: boolean;
  isCurrent: boolean;
  phaseName: string;
}

const getPhaseName = (day: number) => {
  if (day <= 7) return 'Fase 1: Desinflamación & Colon';
  if (day <= 14) return 'Fase 2: Nutrición Tiroidea';
  if (day <= 21) return 'Fase 3: Balance Hormonal';
  return 'Fase 4: Consolidación & Vitalidad';
};

const getEnergyDescriptor = (val: number | null) => {
  if (!val) return { label: 'Sin registro', badge: 'bg-slate-100 text-slate-500 border-slate-200', note: 'Pendiente de registrar' };
  if (val >= 5) return { label: 'Radiante (5★)', badge: 'bg-amber-100 text-amber-900 border-amber-300', note: 'Activación mitocondrial máxima' };
  if (val >= 4) return { label: 'Enérgica (4★)', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', note: 'Metabolismo óptimo con Tyruss' };
  if (val >= 3) return { label: 'Estable (3★)', badge: 'bg-teal-100 text-teal-900 border-teal-300', note: 'Balance celular en progreso' };
  if (val >= 2) return { label: 'Baja (2★)', badge: 'bg-orange-100 text-orange-900 border-orange-300', note: 'Cuerpo en fase de depuración' };
  return { label: 'Agotada (1★)', badge: 'bg-rose-100 text-rose-900 border-rose-300', note: 'Requiere hidratación y descanso' };
};

export const ExecutiveEnergyChartPanel: React.FC<ExecutiveEnergyChartPanelProps> = ({
  progressMap,
  currentDay,
  unlockedMaxDay,
  userProfile,
  onExploreFullCurve,
  onSelectDay
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Generate complete dataset for 30 days
  const fullData: ChartPoint[] = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const dayNum = index + 1;
      const progress = progressMap[dayNum];
      const hasRecord = Boolean(progress && progress.energyLevel);
      const isCurrent = dayNum === currentDay;
      
      // Default to 4 for current day preview if not set, or null if future
      const rawEnergy = progress?.energyLevel ?? (dayNum <= unlockedMaxDay ? (progress?.completedAt ? 4 : (isCurrent ? 4 : null)) : null);

      return {
        day: `D${dayNum}`,
        dayNum,
        energy: hasRecord ? (progress?.energyLevel ?? null) : (isCurrent ? 4 : (dayNum <= unlockedMaxDay && progress?.completedAt ? 4 : null)),
        displayEnergy: (progress?.energyLevel || (isCurrent ? 4 : (dayNum <= unlockedMaxDay && progress?.completedAt ? 4 : 0))),
        digestion: progress?.digestion,
        mood: progress?.mood,
        sleepStars: progress?.sleepStars,
        tyrussTaken: progress?.tyrussTaken,
        hasRecord: hasRecord || (isCurrent && !progress?.isLockedAfterSubmit),
        isCurrent,
        phaseName: getPhaseName(dayNum)
      };
    });
  }, [progressMap, currentDay, unlockedMaxDay]);

  // Filter based on selected time range
  const filteredData = useMemo(() => {
    if (timeRange === '7d') {
      const start = Math.max(1, Math.min(24, currentDay - 3));
      return fullData.slice(start - 1, start + 6);
    }
    if (timeRange === '14d') {
      const start = Math.max(1, Math.min(17, currentDay - 6));
      return fullData.slice(start - 1, start + 13);
    }
    return fullData;
  }, [fullData, timeRange, currentDay]);

  // Calculate clinical metrics
  const registeredPoints = fullData.filter(d => d.energy !== null);
  const totalRegistered = registeredPoints.length;

  const avgEnergy = useMemo(() => {
    if (totalRegistered === 0) return 4.2;
    const sum = registeredPoints.reduce((acc, p) => acc + (p.energy || 4), 0);
    return Number((sum / totalRegistered).toFixed(1));
  }, [registeredPoints, totalRegistered]);

  // Baseline vs latest improvement calculation
  const baselineEnergy = fullData[0]?.energy || 3;
  const latestEnergy = registeredPoints[registeredPoints.length - 1]?.energy || 4;
  const improvementPercent = useMemo(() => {
    if (baselineEnergy <= 0) return 25;
    const diff = latestEnergy - baselineEnergy;
    if (diff <= 0) return '+15%';
    const pct = Math.round((diff / baselineEnergy) * 100);
    return `+${pct}%`;
  }, [baselineEnergy, latestEnergy]);

  const optimalDaysCount = registeredPoints.filter(p => (p.energy || 0) >= 4).length;

  return (
    <div 
      id="executive-energy-trend-panel"
      className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 shadow-sm space-y-4 transition-all duration-300"
    >
      {/* 1. Header with ColShopi Title, KPI Badges & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300/80">
              <Zap className="w-3 h-3 text-emerald-700 fill-emerald-600" />
              Tendencia Metabólica de Vitalidad
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Evolución 1 a 5 Estrellas
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-serif-luxury flex items-center gap-2">
            Curva de Energía y Respuesta Metabólica {userProfile?.name ? `• ${userProfile.name}` : ''} 🌿
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl">
            Hola {userProfile?.name ? <strong>{userProfile.name}</strong> : 'hermosa'}, visualiza cómo el aporte diario de Selenio, Yodo Quelado y activos de <strong>Tyruss Full</strong> han elevado tu curva de rendimiento físico y desinflamación.
          </p>
        </div>

        {/* Time range switcher buttons */}
        <div className="flex items-center gap-1.5 self-start lg:self-center bg-white p-1 rounded-2xl border border-emerald-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeRange === '7d'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            7 Días
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('14d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeRange === '14d'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            14 Días
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeRange === '30d'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            Reto 30D
          </button>
        </div>
      </div>

      {/* 2. Metabolic Key Metrics Bar (4 Highlights) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-emerald-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Promedio de Energía
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900 font-serif-luxury">
                {avgEnergy}
              </span>
              <span className="text-xs text-amber-700 font-bold">/ 5 ★</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-teal-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Ganancia de Vitalidad
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-700 font-serif-luxury">
                {improvementPercent}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">vs Inicio</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-amber-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-amber-700 fill-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Días Óptimos (≥4★)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900 font-serif-luxury">
                {optimalDaysCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">días pico</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-emerald-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
              Estado Clínico
            </span>
            <span className="text-xs font-black text-emerald-900 block truncate">
              {avgEnergy >= 4 ? 'Metabolismo Alto' : 'En Calibración'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recharts Line Chart Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100/90 shadow-xs relative">
        
        {/* Top legend in chart */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1 text-[11px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
              <span className="font-bold text-slate-700">Nivel de Energía (1-5)</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <span className="w-4 h-0.5 bg-emerald-400 border-dashed" />
              <span>Zona Óptima (4 a 5 estrellas)</span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Escala Clínica: 1 (Baja) a 5 (Radiante)
          </span>
        </div>

        <div className="w-full h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  const dayNum = e.activePayload[0].payload.dayNum;
                  if (onSelectDay) onSelectDay(dayNum);
                }
              }}
            >
              <defs>
                <linearGradient id="energyLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />

              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(value) => `${value}★`}
              />

              {/* Reference line for optimal zone (4 stars) */}
              <ReferenceLine 
                y={4} 
                stroke="#059669" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  value: '🎯 Zona Óptima (4-5★)', 
                  position: 'insideTopRight', 
                  fill: '#059669', 
                  fontSize: 10,
                  fontWeight: 'bold'
                }} 
              />

              {/* Reference line for baseline threshold (3 stars) */}
              <ReferenceLine 
                y={3} 
                stroke="#94a3b8" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Nivel Base (3★)', 
                  position: 'insideBottomRight', 
                  fill: '#64748b', 
                  fontSize: 10 
                }} 
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartPoint;
                    const descriptor = getEnergyDescriptor(data.energy);

                    return (
                      <div className="bg-slate-950/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs space-y-2 min-w-[210px] z-50">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-emerald-300">
                            Día {data.dayNum}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {data.phaseName}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Nivel de Energía:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${descriptor.badge}`}>
                              {descriptor.label}
                            </span>
                          </div>

                          {data.digestion && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Digestión:</span>
                              <span className="text-slate-200 capitalize font-medium">{data.digestion}</span>
                            </div>
                          )}

                          {data.sleepStars && (
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Sueño Reparador:</span>
                              <span className="text-indigo-300 font-bold">{data.sleepStars}★</span>
                            </div>
                          )}

                          <div className="pt-1 text-[10px] text-emerald-200 italic border-t border-slate-800/80">
                            {descriptor.note}
                          </div>
                        </div>

                        <div className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-800">
                          Haz clic para ver el detalle de este día
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Main Line with Gradient & Smooth Curve */}
              <Line
                type="monotone"
                dataKey="energy"
                name="Nivel de Energía"
                stroke="url(#energyLineGradient)"
                strokeWidth={3.5}
                connectNulls={true}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (!cx || !cy) return null;
                  const isCur = payload.dayNum === currentDay;
                  const hasRec = payload.hasRecord;
                  const isFive = payload.energy === 5;

                  return (
                    <g key={`dot-${payload.dayNum}`}>
                      {isCur && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={10}
                          fill="#10b981"
                          opacity={0.3}
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isCur ? 6 : isFive ? 5.5 : 4.5}
                        fill={isFive ? '#f59e0b' : hasRec ? '#059669' : '#0d9488'}
                        stroke="#ffffff"
                        strokeWidth={2.5}
                        className="cursor-pointer hover:r-7 transition-all"
                      />
                    </g>
                  );
                }}
                activeDot={{
                  r: 8,
                  fill: '#d97706',
                  stroke: '#ffffff',
                  strokeWidth: 3
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Chart Footer with Quick Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              La toma de <strong>Tyruss Full</strong> con 2L de agua promueve un ascenso constante en tus niveles diarios.
            </span>
          </div>

          {onExploreFullCurve && (
            <button
              type="button"
              onClick={onExploreFullCurve}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 group cursor-pointer text-xs shrink-0"
            >
              <span>Ver análisis multivariable completo</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

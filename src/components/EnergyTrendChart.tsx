import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Star, 
  Calendar, 
  Award,
  ArrowUpRight,
  Info,
  Layers,
  Activity,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { DayProgress } from '../types';

interface EnergyTrendChartProps {
  progressMap: Record<number, DayProgress>;
  currentDay: number;
}

interface TooltipPayloadItem {
  value: number | null;
  payload: {
    dayNum: number;
    energy: number | null;
    digestion?: string;
    mood?: string;
    sleepStars?: number;
    phaseName: string;
    tyrussTaken?: boolean;
  };
}

const getPhaseName = (day: number) => {
  if (day <= 7) return 'Fase 1: Desintoxicación & Colon';
  if (day <= 14) return 'Fase 2: Nutrición Tiroidea';
  if (day <= 21) return 'Fase 3: Balance Hormonal';
  return 'Fase 4: Consolidación & Vitalidad';
};

const getEnergyLabel = (level: number | null) => {
  switch (level) {
    case 5: return { text: '⚡ Radiante (100%)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    case 4: return { text: '✨ Enérgica (80%)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 3: return { text: '🌱 Estable (60%)', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    case 2: return { text: '🍂 Baja (40%)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    case 1: return { text: '😩 Agotada (20%)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    default: return { text: 'Sin registro', color: 'text-slate-500 bg-slate-100 border-slate-200' };
  }
};

export const EnergyTrendChart: React.FC<EnergyTrendChartProps> = ({
  progressMap,
  currentDay,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'logged' | 'fase1' | 'fase2' | 'fase3' | 'fase4'>('all');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  // Build the 30-day timeline
  const fullChartData = Array.from({ length: 30 }, (_, index) => {
    const dayNum = index + 1;
    const progress = progressMap[dayNum];
    const energy = progress?.energyLevel ?? (dayNum === currentDay ? 4 : null);
    
    return {
      day: `D${dayNum}`,
      fullLabel: `Día ${dayNum}`,
      dayNum,
      energy: energy,
      digestion: progress?.digestion,
      mood: progress?.mood,
      sleepStars: progress?.sleepStars,
      phaseName: getPhaseName(dayNum),
      tyrussTaken: progress?.tyrussTaken,
      isCurrent: dayNum === currentDay,
      hasRecord: Boolean(progress?.energyLevel)
    };
  });

  // Filter based on viewMode
  let filteredData = fullChartData;
  if (viewMode === 'logged') {
    filteredData = fullChartData.filter(d => d.hasRecord || d.isCurrent);
  } else if (viewMode === 'fase1') {
    filteredData = fullChartData.filter(d => d.dayNum <= 7);
  } else if (viewMode === 'fase2') {
    filteredData = fullChartData.filter(d => d.dayNum >= 8 && d.dayNum <= 14);
  } else if (viewMode === 'fase3') {
    filteredData = fullChartData.filter(d => d.dayNum >= 15 && d.dayNum <= 21);
  } else if (viewMode === 'fase4') {
    filteredData = fullChartData.filter(d => d.dayNum >= 22);
  }

  // Calculate metrics & insights
  const recordedDays = fullChartData.filter(d => d.hasRecord);
  const totalRecorded = recordedDays.length;
  
  const averageEnergy = totalRecorded > 0 
    ? (recordedDays.reduce((acc, curr) => acc + (curr.energy || 0), 0) / totalRecorded).toFixed(1)
    : '4.0';

  // Compare first tracked vs latest tracked
  let energyGain = 0;
  if (recordedDays.length >= 2) {
    const firstEnergy = recordedDays[0].energy || 0;
    const lastEnergy = recordedDays[recordedDays.length - 1].energy || 0;
    energyGain = lastEnergy - firstEnergy;
  }

  // Count high energy days (4 or 5 stars)
  const highEnergyDays = recordedDays.filter(d => (d.energy || 0) >= 4).length;
  const highEnergyPercentage = totalRecorded > 0 ? Math.round((highEnergyDays / totalRecorded) * 100) : 80;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      const data = payload[0].payload;
      const labelInfo = getEnergyLabel(data.energy);

      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-xs text-xs space-y-2 min-w-[210px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-emerald-400 font-serif-luxury text-sm flex items-center gap-1.5">
              <span>Día {data.dayNum}</span>
              {data.dayNum === currentDay && (
                <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  HOY
                </span>
              )}
            </span>
            <span className="text-[10px] text-slate-400">
              {data.phaseName.split(':')[0]}
            </span>
          </div>

          <div className="pt-0.5">
            <div className="text-[11px] text-slate-300">Nivel de Energía:</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${labelInfo.color}`}>
                {labelInfo.text}
              </span>
              <div className="flex items-center text-amber-400">
                {data.energy && Array.from({ length: data.energy }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {data.digestion && (
            <div className="text-[10px] text-slate-300 flex items-center justify-between pt-1 border-t border-slate-800">
              <span>Digestión:</span>
              <span className="font-semibold text-emerald-300 capitalize">{data.digestion}</span>
            </div>
          )}
          {data.mood && (
            <div className="text-[10px] text-slate-300 flex items-center justify-between">
              <span>Estado de Ánimo:</span>
              <span className="font-semibold text-rose-300 capitalize">{data.mood}</span>
            </div>
          )}
          {data.sleepStars && (
            <div className="text-[10px] text-slate-300 flex items-center justify-between">
              <span>Descanso:</span>
              <span className="font-semibold text-indigo-300">{data.sleepStars} / 5 ★</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl border border-amber-200/60 text-amber-600">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  Gráfica Recharts Dinámica
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  1-5 Estrellas
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif-luxury mt-0.5">
                Curva de Tendencia de Energía & Progreso Metabólico
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Monitorea la reactivación celular y absorción de nutrientes de Tyruss Full día a día
          </p>
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/70">
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === 'area' 
                ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Área
          </button>
          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === 'line' 
                ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Línea
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              chartType === 'bar' 
                ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Barras
          </button>
        </div>
      </div>

      {/* Filter Tabs by Phase or Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setViewMode('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Reto Completo (30 Días)
        </button>

        <button
          type="button"
          onClick={() => setViewMode('logged')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'logged'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Días Registrados ({totalRecorded})
        </button>

        <button
          type="button"
          onClick={() => setViewMode('fase1')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'fase1'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Fase 1: Detox (D1-D7)
        </button>

        <button
          type="button"
          onClick={() => setViewMode('fase2')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'fase2'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
          }`}
        >
          Fase 2: Tiroides (D8-D14)
        </button>

        <button
          type="button"
          onClick={() => setViewMode('fase3')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'fase3'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
          }`}
        >
          Fase 3: Hormonas (D15-D21)
        </button>

        <button
          type="button"
          onClick={() => setViewMode('fase4')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            viewMode === 'fase4'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          Fase 4: Consolidación (D22-D30)
        </button>
      </div>

      {/* Quick Biometric Insights Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 block">Promedio de Energía</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-950 font-serif-luxury">{averageEnergy}</span>
            <span className="text-xs text-emerald-700 font-bold">/ 5.0 ★</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${Number(averageEnergy) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 block">Días de Alta Vitalidad</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-amber-950 font-serif-luxury">{highEnergyPercentage}%</span>
            <span className="text-xs text-amber-700">en 4-5★</span>
          </div>
          <span className="text-[10px] text-amber-800 block mt-1 font-medium">
            {highEnergyDays} de {Math.max(totalRecorded, 1)} días evaluados
          </span>
        </div>

        <div className="p-3.5 bg-teal-50/80 rounded-2xl border border-teal-200 shadow-xs">
          <span className="text-[11px] font-bold text-teal-800 block">Día en Curso</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-teal-950 font-serif-luxury">Día {currentDay}</span>
            <span className="text-xs text-teal-700">/ 30</span>
          </div>
          <span className="text-[10px] text-teal-800 block mt-1 font-medium">
            Fase {Math.ceil(currentDay / 7.5)} del protocolo
          </span>
        </div>

        <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-800 block">Salto Metabólico</span>
          <div className="flex items-center gap-1 mt-1">
            {energyGain > 0 ? (
              <span className="text-base font-black text-emerald-700 flex items-center gap-0.5 font-serif-luxury">
                <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[3]" />
                +{energyGain} Pts Vitalidad
              </span>
            ) : (
              <span className="text-base font-black text-indigo-950 flex items-center gap-1 font-serif-luxury">
                <Sparkles className="w-4 h-4 text-amber-500" />
                En Absorción
              </span>
            )}
          </div>
          <span className="text-[10px] text-indigo-700 block mt-1 font-medium">
            Tiroides reactivándose
          </span>
        </div>
      </div>

      {/* Main Recharts Graphic Display */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart
              data={filteredData}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#14b8a6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval={filteredData.length > 15 ? 2 : 0}
              />

              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                tickFormatter={(value) => `${value}★`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Optimal Vitality Reference Line */}
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
                  fontWeight: 700
                }}
              />

              <Area
                type="monotone"
                dataKey="energy"
                stroke="#059669"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#energyGradient)"
                connectNulls={true}
                dot={{
                  r: 4.5,
                  fill: '#059669',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 8,
                  fill: '#f59e0b',
                  stroke: '#ffffff',
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart
              data={filteredData}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval={filteredData.length > 15 ? 2 : 0}
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                tickFormatter={(value) => `${value}★`}
              />
              <Tooltip content={<CustomTooltip />} />
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
                  fontWeight: 700
                }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#0d9488"
                strokeWidth={3.5}
                dot={{ r: 5, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#f59e0b', stroke: '#fff', strokeWidth: 3 }}
                connectNulls={true}
              />
            </LineChart>
          ) : (
            <BarChart
              data={filteredData}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                interval={filteredData.length > 15 ? 2 : 0}
              />
              <YAxis 
                domain={[0, 5]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                tickFormatter={(value) => `${value}★`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={4} stroke="#059669" strokeDasharray="4 4" />
              <Bar
                dataKey="energy"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Explanatory Clinical Insights Box */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3.5 text-xs">
        <div className="p-2 bg-emerald-600 rounded-xl text-white shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-slate-800">
          <strong className="block text-emerald-950 font-serif-luxury text-sm">
            Explicación Metabólica: ¿Cómo evoluciona tu energía con Tyruss Full?
          </strong>
          <p className="text-slate-700 text-[11px] leading-relaxed">
            • <strong>Días 1 a 7 (Fase 1):</strong> La chlorella y la espirulina barren toxinas y reducen la pesadez estomacal.<br />
            • <strong>Días 8 a 14 (Fase 2):</strong> El selenio quelado y el yodo reactivan la conversión de hormonas tiroideas T4 en T3 activa.<br />
            • <strong>Días 15 a 30 (Fases 3 y 4):</strong> Los picos de somnolencia diurna desaparecen y la vitalidad se consolida en la zona de <strong>4 a 5 estrellas</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};


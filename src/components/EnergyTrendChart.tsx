import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Star, 
  Calendar, 
  Award,
  ArrowUpRight,
  Info
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
  const [viewMode, setViewMode] = useState<'all' | 'logged'>('all');

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
      isCurrent: dayNum === currentDay,
      hasRecord: Boolean(progress?.energyLevel)
    };
  });

  const chartData = viewMode === 'logged' 
    ? fullChartData.filter(d => d.hasRecord || d.isCurrent)
    : fullChartData;

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

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      const data = payload[0].payload;
      const labelInfo = getEnergyLabel(data.energy);

      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-xs text-xs space-y-1.5 min-w-[200px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-emerald-400 font-serif-luxury text-sm">
              Día {data.dayNum}
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
              <span>Ánimo:</span>
              <span className="font-semibold text-rose-300 capitalize">{data.mood}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                Curva de Energía y Vitalidad Metabólica (30 Días)
              </h3>
              <p className="text-xs text-slate-500">
                Monitorea la respuesta de tu tiroides y metabolismo al consumo constante de Tyruss Full
              </p>
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'all' 
                ? 'bg-white text-emerald-900 shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Vista 30 Días
          </button>
          <button
            type="button"
            onClick={() => setViewMode('logged')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === 'logged' 
                ? 'bg-white text-emerald-900 shadow-xs font-bold' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Días Registrados ({totalRecorded})
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
          <span className="text-[11px] font-semibold text-emerald-800 block">Promedio de Energía</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-extrabold text-emerald-950 font-serif-luxury">{averageEnergy}</span>
            <span className="text-xs text-emerald-700 font-bold">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3 h-3 ${Number(averageEnergy) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
          <span className="text-[11px] font-semibold text-amber-800 block">Día Actual</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-amber-950 font-serif-luxury">Día {currentDay}</span>
            <span className="text-xs text-amber-700">de 30</span>
          </div>
          <span className="text-[10px] text-amber-700 block mt-1">
            Fase {Math.ceil(currentDay / 7.5)}
          </span>
        </div>

        <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100">
          <span className="text-[11px] font-semibold text-teal-800 block">Días Evaluados</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-teal-950 font-serif-luxury">{totalRecorded}</span>
            <span className="text-xs text-teal-700">registros</span>
          </div>
          <span className="text-[10px] text-teal-700 block mt-1 font-medium">
            {Math.round((totalRecorded / 30) * 100)}% de constancia
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-semibold text-slate-700 block">Evolución Metabólica</span>
          <div className="flex items-center gap-1 mt-0.5">
            {energyGain > 0 ? (
              <span className="text-sm font-bold text-emerald-700 flex items-center gap-0.5">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                +{energyGain} Pts Mejora
              </span>
            ) : (
              <span className="text-sm font-bold text-slate-700 flex items-center gap-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Activa y Nutriéndose
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Nutrientes Tyruss en acción
          </span>
        </div>
      </div>

      {/* Chart Graphic Area */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="60%" stopColor="#14b8a6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              interval={viewMode === 'all' ? 2 : 0}
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

            {/* Optimal Energy Line */}
            <ReferenceLine 
              y={4} 
              stroke="#059669" 
              strokeDasharray="4 4" 
              strokeOpacity={0.5}
              label={{
                value: 'Zona de Vitalidad Óptima (4-5★)',
                position: 'insideTopRight',
                fill: '#059669',
                fontSize: 10,
                fontWeight: 600
              }}
            />

            <Area
              type="monotone"
              dataKey="energy"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#energyGradient)"
              connectNulls={true}
              dot={{
                r: 4,
                fill: '#059669',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: '#f59e0b',
                stroke: '#ffffff',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend / Clinical Explanation */}
      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs text-emerald-950">
        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-800 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <span className="font-bold block text-emerald-900">
            ¿Por qué aumenta tu energía con Tyruss Full a lo largo de los días?
          </span>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            Durante la <strong>Fase 1 (Días 1-7)</strong> la espirulina y chlorella desintoxican tu colon. Hacia la <strong>Fase 2 y 3 (Días 8-21)</strong>, el selenio y yodo orgánico nutren la tiroides para optimizar la conversión hormonal (T4 a T3 libre), reduciendo la fatiga crónica y estabilizando tu nivel en 4-5 estrellas ✨.
          </p>
        </div>
      </div>
    </div>
  );
};

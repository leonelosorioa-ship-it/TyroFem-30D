import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sparkles, 
  Flame, 
  Droplet, 
  Moon, 
  Sun, 
  Smile, 
  Award, 
  Share2, 
  CheckCircle2, 
  Star,
  ChevronRight,
  TrendingUp,
  Heart,
  FileText,
  Download,
  Check,
  Lock,
  Clock,
  ShieldCheck,
  AlertCircle,
  Eye,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerDayCompletionConfetti } from '../utils/confettiCelebration';
import { DayProgress, UserProfile } from '../types';
import { EnergyTrendChart } from './EnergyTrendChart';
import { TransformationReportModal } from './TransformationReportModal';
import { generateTransformationReportPDF } from '../utils/pdfGenerator';
import { getMaxUnlockedDay } from '../utils/timeLock';
import { DayCountdownClock } from './DayCountdownClock';
import { DayRegistrationConfirmedModal } from './DayRegistrationConfirmedModal';
import { Day15CelebrationModal } from './Day15CelebrationModal';
import { Day30CelebrationModal } from './Day30CelebrationModal';
import { ExecutiveSummaryPanel } from './ExecutiveSummaryPanel';
import { ExecutiveEnergyChartPanel } from './ExecutiveEnergyChartPanel';

interface DailyTrackerProps {
  userProfile: UserProfile;
  progressMap: Record<number, DayProgress>;
  currentDay: number;
  onSaveProgress: (dayNumber: number, progress: DayProgress) => void;
  onOpenOrder: () => void;
  onOpenChat: () => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  userProfile,
  progressMap,
  currentDay,
  onSaveProgress,
  onOpenOrder,
  onOpenChat
}) => {
  const [unlockedMaxDay, setUnlockedMaxDay] = useState<number>(() => 
    getMaxUnlockedDay(userProfile?.startDate)
  );

  useEffect(() => {
    const updateUnlocked = () => {
      setUnlockedMaxDay(getMaxUnlockedDay(userProfile?.startDate));
    };
    updateUnlocked();
    const interval = setInterval(updateUnlocked, 1000);
    return () => clearInterval(interval);
  }, [userProfile?.startDate]);

  const [selectedDay, setSelectedDay] = useState<number>(() => currentDay || unlockedMaxDay);

  // Sync selectedDay when unlockedMaxDay changes if it was on currentDay
  useEffect(() => {
    if (selectedDay > 30) {
      setSelectedDay(30);
    }
  }, [unlockedMaxDay, selectedDay]);

  const isSelectedDayUnlocked = selectedDay <= unlockedMaxDay;

  const currentDayData = progressMap[selectedDay] || {
    dayNumber: selectedDay,
    tyrussTaken: false,
    water2L: false,
    antiinflammatoryMeal: false,
    extraHabit: false,
    energyLevel: 4,
    digestion: 'liviana',
    mood: 'tranquila',
    sleepStars: 4,
    notes: ''
  };

  // Day is strictly locked if it has been registered/saved
  const isSelectedDayAlreadyLocked = Boolean(
    currentDayData.isLockedAfterSubmit || 
    (currentDayData.completedAt && currentDayData.tyrussTaken && currentDayData.water2L)
  );

  const [activeSubTab, setActiveSubTab] = useState<'registro' | 'curva' | 'informe'>('registro');
  const [energyLevel, setEnergyLevel] = useState<number>(currentDayData.energyLevel || 4);
  const [digestion, setDigestion] = useState<DayProgress['digestion']>(currentDayData.digestion || 'liviana');
  const [mood, setMood] = useState<DayProgress['mood']>(currentDayData.mood || 'tranquila');
  const [sleepStars, setSleepStars] = useState<number>(currentDayData.sleepStars || 4);
  const [waterGlasses, setWaterGlasses] = useState<number>(currentDayData.water2L ? 8 : (currentDayData.waterGlasses || 4));
  const [notes, setNotes] = useState<string>(currentDayData.notes || '');
  const [tyrussTaken, setTyrussTaken] = useState<boolean>(currentDayData.tyrussTaken || false);
  const [antiinflammatoryMeal, setAntiinflammatoryMeal] = useState<boolean>(currentDayData.antiinflammatoryMeal || false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isQuickDownloading, setIsQuickDownloading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDay15CelebrationModal, setShowDay15CelebrationModal] = useState(false);
  const [showDay30CelebrationModal, setShowDay30CelebrationModal] = useState(false);

  // Sync inputs when selectedDay changes
  useEffect(() => {
    const data = progressMap[selectedDay] || {
      dayNumber: selectedDay,
      tyrussTaken: false,
      water2L: false,
      antiinflammatoryMeal: false,
      extraHabit: false,
      energyLevel: 4,
      digestion: 'liviana',
      mood: 'tranquila',
      sleepStars: 4,
      notes: ''
    };
    setEnergyLevel(data.energyLevel || 4);
    setDigestion(data.digestion || 'liviana');
    setMood(data.mood || 'tranquila');
    setSleepStars(data.sleepStars || 4);
    setWaterGlasses(data.water2L ? 8 : 4);
    setNotes(data.notes || '');
    setTyrussTaken(data.tyrussTaken || false);
    setAntiinflammatoryMeal(data.antiinflammatoryMeal || false);
  }, [selectedDay, progressMap]);

  const completedDays = (Object.values(progressMap) as DayProgress[]).filter(p => p.completedAt || (p.tyrussTaken && p.water2L)).length;
  const progressPercent = Math.round((completedDays / 30) * 100);

  const handleDirectDownloadPDF = () => {
    setIsQuickDownloading(true);
    try {
      generateTransformationReportPDF({
        userProfile,
        progressMap,
        currentDay: selectedDay
      });
      setTimeout(() => setIsQuickDownloading(false), 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsQuickDownloading(false);
    }
  };

  const handleDraftUpdate = (updatedFields: Partial<DayProgress>) => {
    if (!isSelectedDayUnlocked || isSelectedDayAlreadyLocked) return;

    if (updatedFields.energyLevel !== undefined) setEnergyLevel(updatedFields.energyLevel);
    if (updatedFields.digestion !== undefined) setDigestion(updatedFields.digestion);
    if (updatedFields.mood !== undefined) setMood(updatedFields.mood);
    if (updatedFields.sleepStars !== undefined) setSleepStars(updatedFields.sleepStars);
    if (updatedFields.notes !== undefined) setNotes(updatedFields.notes);
    if (updatedFields.tyrussTaken !== undefined) setTyrussTaken(updatedFields.tyrussTaken);
    if (updatedFields.antiinflammatoryMeal !== undefined) setAntiinflammatoryMeal(updatedFields.antiinflammatoryMeal);
  };

  const handleAddGlass = () => {
    if (!isSelectedDayUnlocked || isSelectedDayAlreadyLocked) return;
    const next = Math.min(8, waterGlasses + 1);
    setWaterGlasses(next);
  };

  const handleSaveAndLockDay = () => {
    if (!isSelectedDayUnlocked || isSelectedDayAlreadyLocked) return;

    const finalProgress: DayProgress = {
      ...currentDayData,
      dayNumber: selectedDay,
      tyrussTaken: true, // Mark Tyruss taken when registering the day
      water2L: waterGlasses >= 8,
      antiinflammatoryMeal: true,
      extraHabit: true,
      energyLevel,
      digestion,
      mood,
      sleepStars,
      notes,
      completedAt: currentDayData.completedAt || new Date().toISOString(),
      isLockedAfterSubmit: true
    };

    onSaveProgress(selectedDay, finalProgress);

    // Calculate updated total completed days
    const currentCompleted = (Object.values(progressMap) as DayProgress[]).filter(
      p => p.dayNumber !== selectedDay && (p.completedAt || (p.tyrussTaken && p.water2L) || p.isLockedAfterSubmit)
    ).length;
    const updatedCompletedDays = currentCompleted + 1;

    // Trigger tier-customized confetti animation linked to total progress
    triggerDayCompletionConfetti({
      dayNumber: selectedDay,
      totalCompletedDays: updatedCompletedDays
    });

    // If day 30 is submitted/registered, activate Day 30 celebration modal with graduation audio, PDF download, and WhatsApp reorder link
    if (selectedDay === 30) {
      setShowDay30CelebrationModal(true);
    } else if (selectedDay === 15) {
      setShowDay15CelebrationModal(true);
    } else {
      setShowConfirmationModal(true);
    }
  };


  const badges = [
    {
      id: 'b1',
      title: 'Inicio Consciente',
      day: 1,
      unlocked: completedDays >= 1,
      icon: '🌱',
      desc: 'Diste el primer paso por tu bienestar hormonal.'
    },
    {
      id: 'b7',
      title: 'Desinflamada y Ligera',
      day: 7,
      unlocked: completedDays >= 7,
      icon: '🌿',
      desc: '1ra semana de colon limpio y desinflamación.'
    },
    {
      id: 'b14',
      title: 'Chispa Metabólica',
      day: 14,
      unlocked: completedDays >= 14,
      icon: '⚡',
      desc: 'Tiroides nutrida con selenio y yodo orgánico.'
    },
    {
      id: 'b15',
      title: 'Mitad del Reto 15D',
      day: 15,
      unlocked: completedDays >= 15 || Boolean(progressMap[15]?.completedAt || progressMap[15]?.isLockedAfterSubmit),
      icon: '🌟',
      desc: '¡Audio especial de Marié y 50% alcanzado!',
      isDay15Special: true
    },
    {
      id: 'b21',
      title: 'Equilibrio Femenino',
      day: 21,
      unlocked: completedDays >= 21,
      icon: '🌸',
      desc: 'Hábito anclado y control de sofocos.'
    },
    {
      id: 'b30',
      title: 'Transformación Dorada 30D',
      day: 30,
      unlocked: completedDays >= 30,
      icon: '👑',
      desc: 'Graduada oficial del Reto TyroFem 30D.'
    }
  ];

  const shareText = `¡Hola Marié! 💚 Estoy en el Día ${currentDay} de mi Reto TyroFem 30D con Tyruss Full de ColShopi Tienda. Llevo ${completedDays}/30 días cumplidos y me siento con excelente energía ✨.`;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Executive Summary Panel with Interactive KPI Cards */}
      <ExecutiveSummaryPanel
        userProfile={userProfile}
        progressMap={progressMap}
        currentDay={currentDay}
        unlockedMaxDay={unlockedMaxDay}
        onSelectSubTab={(tab) => setActiveSubTab(tab)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onSelectDay={(day) => setSelectedDay(day)}
      />

      {/* Top Executive Energy & Metabolic Evolution Recharts Line Chart Panel */}
      <ExecutiveEnergyChartPanel
        progressMap={progressMap}
        currentDay={currentDay}
        unlockedMaxDay={unlockedMaxDay}
        userProfile={userProfile}
        onExploreFullCurve={() => setActiveSubTab('curva')}
        onSelectDay={(day) => {
          setSelectedDay(day);
          setActiveSubTab('registro');
        }}
      />

      {/* Header Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Registro Diario de Bienestar
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif-luxury mt-0.5">
              Cómo se Siente tu Cuerpo Hoy, {userProfile.name} 🌿
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Día {currentDay} de 30 • Monitorea tu energía, digestión y balance hormonal
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Generar y previsualizar tu Informe de Transformación de 30 Días en PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Informe de Transformación 30D</span>
            </button>

            <button
              onClick={handleDirectDownloadPDF}
              disabled={isQuickDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-colors border border-emerald-300 cursor-pointer"
              title="Descarga directa del archivo PDF"
            >
              {isQuickDownloading ? (
                <>
                  <span className="w-3 h-3 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  <span>Descargando...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/573104007428?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Marié</span>
            </a>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-900">Progreso del Reto 30D</span>
            <span className="font-extrabold text-emerald-700">{progressPercent}% ({completedDays} de 30 Días)</span>
          </div>
          <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-emerald-100/80">
          <button
            type="button"
            onClick={() => setActiveSubTab('registro')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'registro'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Test & Registro (Día {selectedDay})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('curva')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'curva'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>2. Curva de Energía & Metabolismo (Recharts)</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
              ★ 1-5
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('informe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'informe'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Informe de Bienestar & Hábitos (PDF)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Registro Diario */}
      {activeSubTab === 'registro' && (
        <div className="space-y-6">
          {/* Day Selector Strip */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Seleccionar Día del Protocolo:
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Día {unlockedMaxDay} Habilitado Actualmente
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                1 día cada 24 horas
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                const isDUnlocked = d <= unlockedMaxDay;
                const isSelected = d === selectedDay;
                const isDone = progressMap[d]?.completedAt || (progressMap[d]?.tyrussTaken && progressMap[d]?.water2L);

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`h-9 min-w-9 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/30 shadow-xs scale-105'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : isDUnlocked
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-50 text-slate-400 border border-dashed border-slate-200 hover:bg-amber-50 hover:text-amber-900'
                    }`}
                    title={isDUnlocked ? `Día ${d}` : `Día ${d} Bloqueado (requiere cumplir 24h)`}
                  >
                    {!isDUnlocked ? (
                      <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                    ) : isDone ? (
                      <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                    ) : null}
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If the selected day is LOCKED, show the 24H countdown timer hero and disable inputs */}
          {isSelectedDayAlreadyLocked ? (
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-400/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
                        Registro Asegurado & Consolidado
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        Día {selectedDay} Bloqueado para Edición
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white font-serif-luxury mt-1">
                      Tus datos del Día {selectedDay} están listos en tu Informe de Bienestar 📄
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Ver en Informe PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('curva')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl transition-all border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Ver Curva Recharts</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed border-t border-emerald-900/60 pt-2.5">
                Para proteger la fidelidad de tu historial de bienestar, este día ha sido <strong>sellado</strong>. Todos los parámetros se encuentran almacenados y disponibles para consulta y guía de <strong>Marié (Guía de Bienestar)</strong>.
              </p>
            </div>
          ) : !isSelectedDayUnlocked ? (
            <div className="space-y-4">
              <DayCountdownClock
                dayNumber={selectedDay}
                startDate={userProfile.startDate}
                variant="hero"
                showExplanation={true}
                onUnlocked={() => setUnlockedMaxDay(getMaxUnlockedDay(userProfile.startDate))}
              />
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p>
                  <strong>Test del Día {selectedDay} Bloqueado:</strong> Por prescripción nutricional del protocolo TyroFem 30D, los tests somáticos diarios solo pueden registrarse una vez que tu organismo haya completado el ciclo biológico de 24 horas del día anterior.
                </p>
              </div>
            </div>
          ) : (
            unlockedMaxDay < 30 && selectedDay === unlockedMaxDay && (
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#070e17] rounded-2xl p-3.5 sm:p-4 border border-cyan-500/40 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-cyan-950 rounded-xl border border-cyan-400/40 text-cyan-300 shrink-0">
                    <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      Ciclo de 24 Horas en Marcha
                    </span>
                    <h5 className="text-xs font-bold text-white">
                      Tu próximo test (Día {unlockedMaxDay + 1}) se habilitará en:
                    </h5>
                  </div>
                </div>
                <DayCountdownClock
                  dayNumber={unlockedMaxDay + 1}
                  startDate={userProfile.startDate}
                  variant="compact"
                  showExplanation={false}
                />
              </div>
            )
          )}

          {/* Day 15 Special Celebration Banner */}
          {selectedDay === 15 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shrink-0 ring-4 ring-amber-300/30">
                  15D
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full mb-1 border border-amber-400/50">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>¡Hito Oficial: 15 Días (Mitad del Reto 50%)!</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {isSelectedDayAlreadyLocked
                      ? '¡Has completado con éxito el día 15 de tu transformación!'
                      : '¡Al registrar tu día 15 se activará automáticamente tu felicitación y audio de Marié!'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Escucha el mensaje de voz de Marié y comunícate con ella por WhatsApp (+57 310 400 7428).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDay15CelebrationModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-amber-300" />
                <span>Audio de Marié (Día 15)</span>
              </button>
            </div>
          )}

          {/* Day 30 Grand Graduation Banner */}
          {selectedDay === 30 && (
            <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-emerald-500/20 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shrink-0 ring-4 ring-amber-300/40">
                  👑
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-0.5 rounded-full mb-1 border border-amber-500/50 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>¡GRADUACIÓN OFICIAL RETO TYROFEM 30D (100% CUMPLIDO)!</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {isSelectedDayAlreadyLocked
                      ? '¡Felicidades por culminar tus 30 días de transformación y hábitos saludables!'
                      : '¡Al registrar tu día 30 se activará automáticamente tu graduación, audio oficial y descarga del informe de bienestar avalado!'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Escucha el audio de cierre de Marié, descarga tu informe en PDF y activa tu recompra con beneficio VIP.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDay30CelebrationModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-950" />
                <span>Graduación & Audio Día 30</span>
              </button>
            </div>
          )}

          {/* Daily Metrics Dashboard */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${(!isSelectedDayUnlocked || isSelectedDayAlreadyLocked) ? 'opacity-85 pointer-events-none' : ''}`}>
            {/* Metric 1: Energy Level */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Nivel de Energía (Día {selectedDay})</span>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {energyLevel === 5 && '⚡ Radiante (100%)'}
                  {energyLevel === 4 && '✨ Enérgica (80%)'}
                  {energyLevel === 3 && '🌱 Estable (60%)'}
                  {energyLevel === 2 && '🍂 Baja (40%)'}
                  {energyLevel === 1 && '😩 Agotada (20%)'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 bg-slate-50 p-2 rounded-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!isSelectedDayUnlocked || isSelectedDayAlreadyLocked}
                    onClick={() => handleDraftUpdate({ energyLevel: star })}
                    className={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      energyLevel >= star 
                        ? 'text-amber-500' 
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${energyLevel >= star ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span className="text-[10px] font-bold">{star}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metric 2: Digestion Status */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Estado de Digestión</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                  {digestion}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'liviana', label: '🌿 Liviana & Plana', desc: 'Sin inflamación' },
                  { id: 'normal', label: '✨ Normal', desc: 'Cómoda post-comida' },
                  { id: 'pesada', label: '🍂 Pesada', desc: 'Digestión lenta' },
                  { id: 'inflamada', label: '⚠️ Inflamada', desc: 'Gases o pesadez' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!isSelectedDayUnlocked || isSelectedDayAlreadyLocked}
                    onClick={() => handleDraftUpdate({ digestion: opt.id as DayProgress['digestion'] })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      digestion === opt.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block font-bold">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metric 3: Water Counter (8 glasses = 2L) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Droplet className="w-4 h-4 text-teal-600 fill-teal-600" />
                  <span>Hidratación Diaria (Meta: 2 Litros)</span>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  {waterGlasses * 250} ml / 2000 ml
                </span>
              </div>

              <div className="grid grid-cols-8 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <button
                    key={g}
                    type="button"
                    disabled={!isSelectedDayUnlocked || isSelectedDayAlreadyLocked}
                    onClick={() => {
                      setWaterGlasses(g);
                    }}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      waterGlasses >= g
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 hover:bg-teal-50 hover:text-teal-600'
                    }`}
                    title={`Vaso ${g} (250 ml)`}
                  >
                    <Droplet className={`w-4 h-4 ${waterGlasses >= g ? 'fill-white' : ''}`} />
                    <span className="text-[9px] font-bold">{g}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>{waterGlasses >= 8 ? '🎉 ¡Meta de 2L alcanzada!' : `Faltan ${8 - waterGlasses} vasos (250ml c/u)`}</span>
                <button
                  type="button"
                  disabled={!isSelectedDayUnlocked || isSelectedDayAlreadyLocked}
                  onClick={handleAddGlass}
                  className="text-teal-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  + Agregar 1 Vaso
                </button>
              </div>
            </div>

            {/* Metric 4: Mood & Sleep */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Smile className="w-4 h-4 text-rose-500" />
                  <span>Ánimo & Calidad de Sueño</span>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full capitalize">
                  {mood}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'radiante', emoji: '🌸', label: 'Radiante' },
                  { id: 'tranquila', emoji: '🧘‍♀️', label: 'Tranquila' },
                  { id: 'enfocada', emoji: '🎯', label: 'Enfocada' },
                  { id: 'sensible', emoji: '🥺', label: 'Sensible' },
                  { id: 'agotada', emoji: '😩', label: 'Agotada' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!isSelectedDayUnlocked || isSelectedDayAlreadyLocked}
                    onClick={() => handleDraftUpdate({ mood: m.id as DayProgress['mood'] })}
                    className={`flex-1 py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      mood === m.id
                        ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base block">{m.emoji}</span>
                    <span className="text-[10px] block truncate">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Sleep Stars */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-slate-600 flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  Descanso Nocturno:
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={!isSelectedDayUnlocked || isSelectedDayAlreadyLocked}
                      onClick={() => handleDraftUpdate({ sleepStars: s })}
                      className="cursor-pointer disabled:opacity-50"
                    >
                      <Star className={`w-4 h-4 ${sleepStars >= s ? 'fill-indigo-500 text-indigo-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar: Submit & Lock Day to prevent re-processing */}
          {isSelectedDayUnlocked && !isSelectedDayAlreadyLocked && (
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-400/30">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
                    Cierre de Test Diario
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    Día {selectedDay}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                  ¿Lista para registrar tus datos de hoy, {userProfile.name}? 🌿
                </h4>
                <p className="text-xs text-emerald-100/90 max-w-xl">
                  Al confirmar, este día se guardará de forma blindada en tu <strong>Informe de Bienestar Oficial</strong> y se bloqueará para evitar reprocesos. Podrás consultarlo siempre que desees.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAndLockDay}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-2xl shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Registrar y Asegurar Día {selectedDay}</span>
              </button>
            </div>
          )}

          {/* Quick jump to Trend Chart */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-emerald-950 block">
                  ¿Quieres analizar tu evolución y niveles de vitalidad?
                </strong>
                <span className="text-[11px] text-emerald-800">
                  Explora la curva de 30 días generada con Recharts y mira tus saltos de bienestar.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('curva')}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
            >
              Ver Gráfica Recharts →
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Curva de Energía & Metabolismo (Recharts) */}
      {activeSubTab === 'curva' && (
        <div className="space-y-6">
          <EnergyTrendChart 
            progressMap={progressMap} 
            currentDay={currentDay} 
          />
        </div>
      )}

      {/* SUB-TAB 3: Informe de Bienestar PDF & Logros */}
      {activeSubTab === 'informe' && (
        <div className="space-y-6">
          {/* Official 30-Day Transformation Report (PDF Card Banner) */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0a1520] to-emerald-950 rounded-3xl p-6 border border-cyan-500/30 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/40">
                    Documento Oficial TyroFem
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40">
                    VIP #{userProfile.accessCode || '849201'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif-luxury">
                  Informe de Transformación de 30 Días (PDF) 📄
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Genera tu informe descargable que consolida tu adherencia al reto, evolución de niveles de energía, confort digestivo y resumen avalado por <strong>Marié y ColShopi Tienda</strong>.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5 shrink-0">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Ver Informe Completo</span>
                </button>

                <button
                  onClick={handleDirectDownloadPDF}
                  disabled={isQuickDownloading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {isQuickDownloading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Snapshot Metrics inside the Card */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Adherencia</span>
                <strong className="text-emerald-400 text-sm font-extrabold">{progressPercent}%</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Energía Media</span>
                <strong className="text-amber-400 text-sm font-extrabold">
                  {(Object.values(progressMap) as DayProgress[]).length > 0 
                    ? ((Object.values(progressMap) as DayProgress[]).map(p => p.energyLevel || 4).reduce((a, b) => a + b, 0) / (Object.values(progressMap) as DayProgress[]).length).toFixed(1)
                    : '4.2'}/5
                </strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Metabolismo</span>
                <strong className="text-cyan-300 text-sm font-extrabold">Optimizado ✨</strong>
              </div>
            </div>
          </div>

          {/* 30-Day Milestone Rewards / Badges */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                  Medallas & Logros de Transformación
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {badges.filter(b => b.unlocked).length} de {badges.length} Desbloqueadas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => {
                    if (badge.day === 30) {
                      setShowDay30CelebrationModal(true);
                    } else if (badge.day === 15) {
                      setShowDay15CelebrationModal(true);
                    } else if (badge.unlocked) {
                      setSelectedDay(badge.day);
                    }
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between cursor-pointer hover:scale-[1.02] ${
                    badge.unlocked
                      ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-xs ring-1 ring-amber-400/20'
                      : 'bg-slate-50/80 border-slate-200/80 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                      badge.unlocked ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {badge.unlocked ? '✓ Desbloqueada' : `Día ${badge.day}`}
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight pt-1">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Continuous Support Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-base font-serif-luxury">
            ¿Tienes dudas sobre tus síntomas o cómo ajustar tu dosis?
          </h4>
          <p className="text-xs text-emerald-100 max-w-xl">
            Marié, tu Asistente Virtual y Guía de Bienestar, está disponible para orientarte en cualquier momento del reto.
          </p>
        </div>
        <button
          onClick={onOpenChat}
          className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          Pregúntale a Marié 💬
        </button>
      </div>

      {/* 30-Day Transformation Clinical Report Modal */}
      <TransformationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userProfile={userProfile}
        progressMap={progressMap}
        currentDay={currentDay}
      />

      {/* Confirmation modal upon registering and sealing a day */}
      <DayRegistrationConfirmedModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        dayNumber={selectedDay}
        completedDaysCount={completedDays}
        userProfile={userProfile}
        onOpenReport={() => {
          setShowConfirmationModal(false);
          setIsReportModalOpen(true);
        }}
        onOpenTrend={() => {
          setShowConfirmationModal(false);
          setActiveSubTab('curva');
        }}
        onOpenChat={() => {
          setShowConfirmationModal(false);
          onOpenChat();
        }}
      />

      {/* Day 15 Special Celebration Modal with Audio & WhatsApp */}
      <Day15CelebrationModal
        isOpen={showDay15CelebrationModal}
        onClose={() => setShowDay15CelebrationModal(false)}
        userProfile={userProfile}
        onOpenReport={() => {
          setShowDay15CelebrationModal(false);
          setIsReportModalOpen(true);
        }}
        onOpenTrend={() => {
          setShowDay15CelebrationModal(false);
          setActiveSubTab('curva');
        }}
      />

      {/* Day 30 Special Graduation Celebration Modal with Audio, Signed PDF & WhatsApp Reorder */}
      <Day30CelebrationModal
        isOpen={showDay30CelebrationModal}
        onClose={() => setShowDay30CelebrationModal(false)}
        userProfile={userProfile}
        progressMap={progressMap}
        onOpenFullReport={() => {
          setShowDay30CelebrationModal(false);
          setIsReportModalOpen(true);
        }}
        onOpenTrend={() => {
          setShowDay30CelebrationModal(false);
          setActiveSubTab('curva');
        }}
      />
    </div>
  );
};

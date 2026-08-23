import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Droplet, 
  Utensils, 
  Heart, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Flame,
  Coffee,
  ChevronRight,
  Smile,
  ArrowLeft,
  Lock,
  AlertCircle,
  FileText,
  TrendingUp,
  Eye,
  Headphones,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPlan, DayProgress, UserProfile } from '../types';
import { getMaxUnlockedDay } from '../utils/timeLock';
import { DayCountdownClock } from './DayCountdownClock';
import { DayRegistrationConfirmedModal } from './DayRegistrationConfirmedModal';
import { Day15CelebrationModal } from './Day15CelebrationModal';
import { Day30CelebrationModal } from './Day30CelebrationModal';

interface DayDetailModalProps {
  dayPlan: DayPlan | null;
  userProfile: UserProfile;
  currentProgress?: DayProgress;
  onClose: () => void;
  onSaveProgress: (dayNumber: number, progress: DayProgress) => void;
  onOpenRecipe: (recipeId: string) => void;
  onOpenChat: () => void;
  onOpenReport?: () => void;
  onOpenTrend?: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dayPlan,
  userProfile,
  currentProgress,
  onClose,
  onSaveProgress,
  onOpenRecipe,
  onOpenChat,
  onOpenReport,
  onOpenTrend
}) => {
  if (!dayPlan) return null;

  const [unlockedMaxDay, setUnlockedMaxDay] = useState<number>(() => 
    getMaxUnlockedDay(userProfile?.startDate)
  );

  useEffect(() => {
    const updateLock = () => {
      setUnlockedMaxDay(getMaxUnlockedDay(userProfile?.startDate));
    };
    updateLock();
    const interval = setInterval(updateLock, 1000);
    return () => clearInterval(interval);
  }, [userProfile?.startDate]);

  const isDayUnlocked = dayPlan.dayNumber <= unlockedMaxDay;
  
  // A day is strictly locked from modification once submitted/completed
  const isDayAlreadyLocked = Boolean(
    currentProgress?.isLockedAfterSubmit || 
    (currentProgress?.completedAt && currentProgress?.tyrussTaken && currentProgress?.water2L)
  );

  const [tyrussTaken, setTyrussTaken] = useState(currentProgress?.tyrussTaken || false);
  const [water2L, setWater2L] = useState(currentProgress?.water2L || false);
  const [antiinflammatoryMeal, setAntiinflammatoryMeal] = useState(currentProgress?.antiinflammatoryMeal || false);
  const [extraHabit, setExtraHabit] = useState(currentProgress?.extraHabit || false);
  const [notes, setNotes] = useState(currentProgress?.notes || '');
  const [energyLevel, setEnergyLevel] = useState(currentProgress?.energyLevel || 4);
  const [digestion, setDigestion] = useState(currentProgress?.digestion || 'liviana');
  const [mood, setMood] = useState(currentProgress?.mood || 'tranquila');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDay15CelebrationModal, setShowDay15CelebrationModal] = useState(false);
  const [showDay30CelebrationModal, setShowDay30CelebrationModal] = useState(false);

  useEffect(() => {
    if (currentProgress) {
      setTyrussTaken(currentProgress.tyrussTaken || false);
      setWater2L(currentProgress.water2L || false);
      setAntiinflammatoryMeal(currentProgress.antiinflammatoryMeal || false);
      setExtraHabit(currentProgress.extraHabit || false);
      setNotes(currentProgress.notes || '');
      setEnergyLevel(currentProgress.energyLevel || 4);
      setDigestion(currentProgress.digestion || 'liviana');
      setMood(currentProgress.mood || 'tranquila');
    }
  }, [currentProgress, dayPlan.dayNumber]);

  const handleCheckboxToggle = (type: 'tyruss' | 'water' | 'meal' | 'extra') => {
    if (!isDayUnlocked || isDayAlreadyLocked) return;

    let updatedTyruss = tyrussTaken;
    let updatedWater = water2L;
    let updatedMeal = antiinflammatoryMeal;
    let updatedExtra = extraHabit;

    if (type === 'tyruss') {
      updatedTyruss = !tyrussTaken;
      setTyrussTaken(updatedTyruss);
    } else if (type === 'water') {
      updatedWater = !water2L;
      setWater2L(updatedWater);
    } else if (type === 'meal') {
      updatedMeal = !antiinflammatoryMeal;
      setAntiinflammatoryMeal(updatedMeal);
    } else if (type === 'extra') {
      updatedExtra = !extraHabit;
      setExtraHabit(updatedExtra);
    }

    const allChecked = updatedTyruss && updatedWater && updatedMeal;
    if (allChecked && (!tyrussTaken || !water2L || !antiinflammatoryMeal)) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fallback
      }
    }
  };

  const handleNotesChange = (val: string) => {
    if (!isDayUnlocked || isDayAlreadyLocked) return;
    setNotes(val);
  };

  const handleFinalSubmitAndLock = () => {
    if (!isDayUnlocked || isDayAlreadyLocked) {
      onClose();
      return;
    }

    const allChecked = tyrussTaken && water2L && antiinflammatoryMeal;
    const finalData: DayProgress = {
      dayNumber: dayPlan.dayNumber,
      tyrussTaken,
      water2L,
      antiinflammatoryMeal,
      extraHabit,
      energyLevel,
      digestion,
      mood,
      sleepStars: currentProgress?.sleepStars || 4,
      notes,
      completedAt: currentProgress?.completedAt || new Date().toISOString(),
      isLockedAfterSubmit: true
    };

    onSaveProgress(dayPlan.dayNumber, finalData);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.55 }
      });
    } catch (e) {
      // silent
    }

    if (dayPlan.dayNumber === 30) {
      setShowDay30CelebrationModal(true);
    } else if (dayPlan.dayNumber === 15) {
      setShowDay15CelebrationModal(true);
    } else {
      setShowConfirmationModal(true);
    }
  };

  const isFullyCompleted = tyrussTaken && water2L && antiinflammatoryMeal;

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto pt-3 sm:pt-6 pb-12 animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-100/80 overflow-hidden my-auto flex flex-col max-h-[92vh]">
          {/* Header Ribbon - Fixed */}
          <div className={`p-4 sm:p-6 shrink-0 relative border-b text-white ${
            isDayAlreadyLocked
              ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-[#071318] border-emerald-500/40'
              : isDayUnlocked 
              ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 border-emerald-900/40' 
              : 'bg-gradient-to-r from-slate-900 via-slate-950 to-[#0c1622] border-amber-500/30'
          }`}>
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-20">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-200 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
                title="Volver al calendario"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-1 pr-24 flex-wrap">
              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                isDayAlreadyLocked
                  ? 'bg-emerald-400 text-slate-950 flex items-center gap-1'
                  : isDayUnlocked 
                  ? 'bg-amber-400 text-slate-950' 
                  : 'bg-slate-800 text-amber-300 border border-amber-400/40'
              }`}>
                {isDayAlreadyLocked 
                  ? `✓ Día ${dayPlan.dayNumber} • Registrado y Asegurado` 
                  : isDayUnlocked 
                  ? `Día ${dayPlan.dayNumber} de 30` 
                  : `🔒 Día ${dayPlan.dayNumber} • Bloqueado`}
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-200 font-medium truncate">
                {dayPlan.phaseName}
              </span>
            </div>

            <h2 className="text-base sm:text-2xl font-bold font-serif-luxury mt-1 pr-16 sm:pr-0">
              {dayPlan.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-0.5">
              {dayPlan.theme}
            </p>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 overscroll-contain">
            
            {/* If Day is Locked After Submit: Show Official Registered Notice */}
            {isDayAlreadyLocked && (
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 border border-emerald-400/40 shadow-lg space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Día Oficialmente Registrado y Protegido</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Modo Solo Consulta
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Los datos de este día ya fueron guardados exitosamente y están integrados en tu <strong>Bitácora de Bienestar y Hábitos (PDF)</strong> y en tus reportes. Para evitar reprocesos o alteraciones, este día se mantiene asegurado.
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {dayPlan.dayNumber === 15 && (
                    <button
                      type="button"
                      onClick={() => setShowDay15CelebrationModal(true)}
                      className="text-[11px] font-bold text-amber-200 hover:text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Headphones className="w-3.5 h-3.5 text-amber-100" />
                      <span>🎧 Audio de Marié (Día 15)</span>
                    </button>
                  )}
                  {dayPlan.dayNumber === 30 && (
                    <button
                      type="button"
                      onClick={() => setShowDay30CelebrationModal(true)}
                      className="text-[11px] font-black text-slate-950 hover:text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5 text-slate-950" />
                      <span>👑 Graduación & Audio Día 30</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenReport?.();
                    }}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Consultar en Bitácora PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTrend?.();
                    }}
                    className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver Curva de Energía</span>
                  </button>
                </div>
              </div>
            )}

            {/* If Day is Locked due to 24H schedule */}
            {!isDayUnlocked && (
              <DayCountdownClock
                dayNumber={dayPlan.dayNumber}
                startDate={userProfile.startDate}
                variant="hero"
                showExplanation={true}
                onUnlocked={() => setUnlockedMaxDay(getMaxUnlockedDay(userProfile.startDate))}
              />
            )}

            {/* Tip de Bienestar de Marié */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl p-4 sm:p-5 relative shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs ring-2 ring-emerald-200">
                  ✨
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Tip de Bienestar de Marié
                    </h4>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                      ColShopi Tienda
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{dayPlan.marieTip}"
                  </p>
                </div>
              </div>
            </div>

            {/* Modo de Preparación Tyruss Full */}
            <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>Cómo Tomar Tu Tyruss Full Hoy</span>
                </div>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  {dayPlan.tyrussTime}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Dosis Exacta</span>
                  <span className="text-sm font-bold text-slate-900">{dayPlan.tyrussDose}</span>
                  <p className="text-[11px] text-slate-500">1 a 1¼ cucharada dosificadora (15-20g)</p>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-amber-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Líquido Recomendado</span>
                  <span className="text-sm font-bold text-slate-900">200-250 ml</span>
                  <p className="text-[11px] text-slate-500">Agua pura, leche de almendras o coco</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white/50 p-2.5 rounded-xl border border-amber-100/50">
                <strong className="text-slate-800">Preparación:</strong> {dayPlan.tyrussPreparation}
              </p>

              {dayPlan.recipeSuggestionId && (
                <button
                  onClick={() => onOpenRecipe(dayPlan.recipeSuggestionId!)}
                  className="w-full py-2 px-3 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ver Receta Recomendada para este Día</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Interactive Daily Habit Checklist */}
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Cumplimiento Diario de Hábitos</span>
                </h4>
                {isDayAlreadyLocked ? (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Registrado Oficialmente
                  </span>
                ) : isDayUnlocked ? (
                  <span className="text-xs font-bold text-emerald-700">
                    {[tyrussTaken, water2L, antiinflammatoryMeal].filter(Boolean).length}/3 Obligatorios
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Bloqueado temporalmente
                  </span>
                )}
              </div>

              {!isDayUnlocked && (
                <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    El test somático y el registro de tomas se habilitarán exactamente cuando transcurran las 24 horas del protocolo.
                  </span>
                </div>
              )}

              <div className={`space-y-2 ${(!isDayUnlocked || isDayAlreadyLocked) ? 'opacity-85 pointer-events-none' : ''}`}>
                {/* Check 1: Tyruss Full */}
                <button
                  type="button"
                  disabled={!isDayUnlocked || isDayAlreadyLocked}
                  onClick={() => handleCheckboxToggle('tyruss')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    tyrussTaken 
                      ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 font-semibold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${tyrussTaken ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'}`}>
                      {tyrussTaken && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Tomé mi porción de Tyruss Full</span>
                      <span className="text-[11px] text-slate-500 font-normal">Dosis de 1 a 1¼ scoop en la mañana</span>
                    </div>
                  </div>
                  <Utensils className={`w-4 h-4 shrink-0 ${tyrussTaken ? 'text-emerald-700' : 'text-slate-300'}`} />
                </button>

                {/* Check 2: Water */}
                <button
                  type="button"
                  disabled={!isDayUnlocked || isDayAlreadyLocked}
                  onClick={() => handleCheckboxToggle('water')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    water2L 
                      ? 'bg-teal-50/90 border-teal-600 text-teal-950 font-semibold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${water2L ? 'bg-teal-600 text-white' : 'border-2 border-slate-300'}`}>
                      {water2L && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Bebí mis 2 Litros de Agua</span>
                      <span className="text-[11px] text-slate-500 font-normal">Esencial para drenar toxinas y activar fibra</span>
                    </div>
                  </div>
                  <Droplet className={`w-4 h-4 shrink-0 ${water2L ? 'text-teal-700' : 'text-slate-300'}`} />
                </button>

                {/* Check 3: Antiinflammatory Diet */}
                <button
                  type="button"
                  disabled={!isDayUnlocked || isDayAlreadyLocked}
                  onClick={() => handleCheckboxToggle('meal')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    antiinflammatoryMeal 
                      ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 font-semibold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${antiinflammatoryMeal ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'}`}>
                      {antiinflammatoryMeal && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Alimentación Antiinflamatoria</span>
                      <span className="text-[11px] text-slate-500 font-normal">{dayPlan.nutritionalFocus}</span>
                    </div>
                  </div>
                  <Sparkles className={`w-4 h-4 shrink-0 ${antiinflammatoryMeal ? 'text-emerald-700' : 'text-slate-300'}`} />
                </button>

                {/* Check 4: Specific Task */}
                <button
                  type="button"
                  disabled={!isDayUnlocked || isDayAlreadyLocked}
                  onClick={() => handleCheckboxToggle('extra')}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    extraHabit 
                      ? 'bg-slate-100 border-slate-400 text-slate-900 font-semibold' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${extraHabit ? 'bg-slate-700 text-white' : 'border border-slate-300'}`}>
                      {extraHabit && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">{dayPlan.tasks[dayPlan.tasks.length - 1]?.label || 'Actividad de autocuidado y descanso'}</span>
                  </div>
                  <Smile className={`w-4 h-4 shrink-0 ${extraHabit ? 'text-slate-700' : 'text-slate-300'}`} />
                </button>
              </div>
            </div>

            {/* Educational Clinical Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                💡 ¿Por qué funciona esto en tu cuerpo?
              </span>
              <p className="leading-relaxed text-slate-600">
                {dayPlan.educationalSnippet}
              </p>
            </div>

            {/* Personal Reflection & Notes */}
            <div className={`space-y-1.5 ${(!isDayUnlocked || isDayAlreadyLocked) ? 'opacity-85' : ''}`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Notas y Sensaciones de {userProfile.name} para el Día {dayPlan.dayNumber}
                </label>
                {isDayAlreadyLocked && (
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Guardado permanente
                  </span>
                )}
              </div>
              <textarea
                disabled={!isDayUnlocked || isDayAlreadyLocked}
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="¿Cómo te sentiste hoy? (Ej: Menos pesadez, más activa, descansé mejor...)"
                rows={2}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 disabled:bg-slate-100 disabled:text-slate-700"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={onOpenChat}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Consultar con Marié</span>
            </button>

            {isDayAlreadyLocked ? (
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Cerrar Consulta</span>
              </button>
            ) : !isDayUnlocked ? (
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-xs bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
              >
                🔒 Entendido (Volver)
              </button>
            ) : (
              <button
                onClick={handleFinalSubmitAndLock}
                className={`py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                  isFullyCompleted
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isFullyCompleted ? '✓ Confirmar y Bloquear Día' : 'Registrar y Guardar Día'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation & No-Reprocess Shield Modal */}
      <DayRegistrationConfirmedModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          onClose();
        }}
        dayNumber={dayPlan.dayNumber}
        userProfile={userProfile}
        onOpenReport={() => {
          setShowConfirmationModal(false);
          onOpenReport?.();
        }}
        onOpenTrend={() => {
          setShowConfirmationModal(false);
          onOpenTrend?.();
        }}
        onOpenChat={() => {
          setShowConfirmationModal(false);
          onOpenChat();
        }}
      />
      {/* Day 15 Special Milestone Celebration Modal */}
      <Day15CelebrationModal
        isOpen={showDay15CelebrationModal}
        onClose={() => {
          setShowDay15CelebrationModal(false);
          onClose();
        }}
        userProfile={userProfile}
        onOpenReport={() => {
          setShowDay15CelebrationModal(false);
          onOpenReport?.();
        }}
        onOpenTrend={() => {
          setShowDay15CelebrationModal(false);
          onOpenTrend?.();
        }}
      />
      {/* Day 30 Special Graduation Celebration Modal */}
      <Day30CelebrationModal
        isOpen={showDay30CelebrationModal}
        onClose={() => {
          setShowDay30CelebrationModal(false);
          onClose();
        }}
        userProfile={userProfile}
        progressMap={{
          [dayPlan.dayNumber]: {
            dayNumber: dayPlan.dayNumber,
            tyrussTaken,
            water2L,
            antiinflammatoryMeal,
            extraHabit,
            energyLevel,
            digestion,
            mood,
            sleepStars: currentProgress?.sleepStars || 4,
            notes,
            completedAt: currentProgress?.completedAt || new Date().toISOString(),
            isLockedAfterSubmit: true
          }
        }}
        onOpenFullReport={() => {
          setShowDay30CelebrationModal(false);
          onOpenReport?.();
        }}
        onOpenTrend={() => {
          setShowDay30CelebrationModal(false);
          onOpenTrend?.();
        }}
      />
    </>
  );
};


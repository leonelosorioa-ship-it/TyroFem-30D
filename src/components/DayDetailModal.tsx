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
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPlan, DayProgress, UserProfile } from '../types';

interface DayDetailModalProps {
  dayPlan: DayPlan | null;
  userProfile: UserProfile;
  currentProgress?: DayProgress;
  onClose: () => void;
  onSaveProgress: (dayNumber: number, progress: DayProgress) => void;
  onOpenRecipe: (recipeId: string) => void;
  onOpenChat: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dayPlan,
  userProfile,
  currentProgress,
  onClose,
  onSaveProgress,
  onOpenRecipe,
  onOpenChat
}) => {
  if (!dayPlan) return null;

  const [tyrussTaken, setTyrussTaken] = useState(currentProgress?.tyrussTaken || false);
  const [water2L, setWater2L] = useState(currentProgress?.water2L || false);
  const [antiinflammatoryMeal, setAntiinflammatoryMeal] = useState(currentProgress?.antiinflammatoryMeal || false);
  const [extraHabit, setExtraHabit] = useState(currentProgress?.extraHabit || false);
  const [notes, setNotes] = useState(currentProgress?.notes || '');
  const [energyLevel, setEnergyLevel] = useState(currentProgress?.energyLevel || 4);
  const [digestion, setDigestion] = useState(currentProgress?.digestion || 'liviana');
  const [mood, setMood] = useState(currentProgress?.mood || 'tranquila');

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

    const updatedData: DayProgress = {
      dayNumber: dayPlan.dayNumber,
      tyrussTaken: updatedTyruss,
      water2L: updatedWater,
      antiinflammatoryMeal: updatedMeal,
      extraHabit: updatedExtra,
      energyLevel,
      digestion,
      mood,
      sleepStars: currentProgress?.sleepStars || 4,
      notes,
      completedAt: allChecked ? new Date().toISOString() : undefined
    };

    onSaveProgress(dayPlan.dayNumber, updatedData);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    const updatedData: DayProgress = {
      dayNumber: dayPlan.dayNumber,
      tyrussTaken,
      water2L,
      antiinflammatoryMeal,
      extraHabit,
      energyLevel,
      digestion,
      mood,
      sleepStars: currentProgress?.sleepStars || 4,
      notes: val,
      completedAt: (tyrussTaken && water2L && antiinflammatoryMeal) ? new Date().toISOString() : undefined
    };
    onSaveProgress(dayPlan.dayNumber, updatedData);
  };

  const isFullyCompleted = tyrussTaken && water2L && antiinflammatoryMeal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Volver al calendario"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
              Día {dayPlan.dayNumber} de 30
            </span>
            <span className="text-xs text-emerald-200 font-medium truncate">
              {dayPlan.phaseName}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury mt-1">
            {dayPlan.title}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            {dayPlan.theme}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Tip de la Nutricionista Marié */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl p-4 sm:p-5 relative shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs ring-2 ring-emerald-200">
                👩‍⚕️
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Tip de la Nutricionista Marié
                  </h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                    ColShopi
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Cumplimiento Diario de Hábitos</span>
              </h4>
              <span className="text-xs font-bold text-emerald-700">
                {[tyrussTaken, water2L, antiinflammatoryMeal].filter(Boolean).length}/3 Obligatorios
              </span>
            </div>

            <div className="space-y-2">
              {/* Check 1: Tyruss Full */}
              <button
                type="button"
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Notas y Sensaciones de {userProfile.name} para el Día {dayPlan.dayNumber}
            </label>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="¿Cómo te sentiste hoy? (Ej: Menos pesadez, más activa, descansé mejor...)"
              rows={2}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
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

          <button
            onClick={onClose}
            className={`py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isFullyCompleted
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {isFullyCompleted ? '✓ Día Registrado' : 'Guardar y Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

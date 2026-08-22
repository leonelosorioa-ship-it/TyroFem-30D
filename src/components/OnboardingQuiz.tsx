import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Activity, 
  Flame, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  Leaf, 
  Smile 
} from 'lucide-react';
import { HealthAngle, UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';

interface OnboardingQuizProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('35-45 años');
  const [primaryAngle, setPrimaryAngle] = useState<HealthAngle>('tiroides_metabolismo');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const angleOptions: { id: HealthAngle; title: string; subtitle: string; icon: string; badge: string }[] = [
    {
      id: 'tiroides_metabolismo',
      title: 'Tiroides & Metabolismo Lento',
      subtitle: 'Siento mi cuerpo pesado, dificultad para bajar de peso, caída de cabello y cansancio crónico.',
      icon: '🦋',
      badge: 'Soporte con Yodo y Selenio'
    },
    {
      id: 'desbalance_menopausia',
      title: 'Desbalances Hormonales & Menopausia',
      subtitle: 'Sofocos repentinos, sudores nocturnos, cambios bruscos de humor y dificultad para dormir.',
      icon: '🌸',
      badge: 'Equilibrio Estrogénico'
    },
    {
      id: 'ciclos_spm',
      title: 'Ciclos Irregulares & SPM Fuerte',
      subtitle: 'Cólicos intensos, hinchazón antes del período, irritabilidad y retención de líquidos.',
      icon: '🩸',
      badge: 'Armonía Ciclo Femenino'
    },
    {
      id: 'digestion_detox',
      title: 'Digestión Lenta & Vientre Inflamado',
      subtitle: 'Estreñimiento frecuente, gases, pesadez después de comer y sensación de toxinas acumuladas.',
      icon: '🌿',
      badge: 'Desintoxicación con Clorofila'
    }
  ];

  const symptomListByAngle: Record<HealthAngle, string[]> = {
    tiroides_metabolismo: [
      'Metabolismo lento a pesar de comer poco',
      'Fatiga crónica y letargo matutino',
      'Caída de cabello y uñas quebradizas',
      'Sensibilidad extrema al frío en manos/pies',
      'Niebla mental y dificultad para concentrarme',
      'Piel muy seca o áspera'
    ],
    desbalance_menopausia: [
      'Sofocos repentinos y oleadas de calor',
      'Sudoración y despertares nocturnos',
      'Ansiedad o cambios de humor inexplicables',
      'Resequedad en la piel y mucosas',
      'Insomnio o sueño ligero no reparador',
      'Sensación de que el cuerpo ya no responde igual'
    ],
    ciclos_spm: [
      'Cólicos fuertes y dolor pélvico',
      'Retención severa de líquidos (vientre y senos)',
      'Atracones o ansiedad por azúcar antes del período',
      'Ciclos menstruales retrasados o irregulares',
      'Acné hormonal en barbilla/mandíbula',
      'Cansancio extremo premenstrual'
    ],
    digestion_detox: [
      'Estreñimiento o evacuaciones dolorosas/irregulares',
      'Vientre inflamado después de cada comida',
      'Gases molestos y pesadez estomacal',
      'Reflujo o digestión muy lenta',
      'Sensación de pesadez y toxinas corporales',
      'Halitosis o lengua pastosa en la mañana'
    ]
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleFinish = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newProfile: UserProfile = {
        name: name.trim() || 'Amiga',
        ageGroup,
        primaryAngle,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Fatiga matutina', 'Inflamación digestiva'],
        hasCompletedOnboarding: true,
        startDate: new Date().toISOString(),
        currentDay: 1,
        unlockedBadges: ['badge_start']
      };
      onComplete(newProfile);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border border-emerald-100 overflow-hidden">
        {/* Header Ribbon with ColShopi Neon Identity */}
        <div className="bg-gradient-to-r from-[#070c12] via-slate-900 to-[#070c12] px-6 py-5 text-white relative border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ColshopiLogo size="sm" showGlow={true} />
              <div>
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                  ColShopi Tienda By Leps Digital
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                  Diagnóstico Nutricional Femenino
                </h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-cyan-300 block font-medium">Paso {step} de 4</span>
              <div className="flex gap-1 mt-1 justify-end">
                {[1, 2, 3, 4].map(s => (
                  <div 
                    key={s} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step ? 'w-6 bg-cyan-400' : s < step ? 'w-3 bg-emerald-400' : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Name & Age */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                {/* Visual Representation of Nutritionist Marie */}
                <div className="inline-flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(0,229,255,0.35)] relative">
                    <div className="w-full h-full rounded-[14px] bg-[#0c161d] overflow-hidden flex flex-col items-center justify-end">
                      <div className="text-3xl mt-1">👩🏻‍⚕️</div>
                      <div className="bg-black text-[8px] text-white font-black px-2 py-0.2 rounded-xs border border-slate-700 mb-1 tracking-wider">
                        MARIÉ
                      </div>
                    </div>
                  </div>
                  <span className="mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Nutricionista ColShopi Oficial
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 font-serif-luxury">
                  ¡Hola! Soy la Nutricionista Marié 💚
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Cuidamos de ti en <strong>ColShopi Tienda</strong>. Quiero acompañarte de forma personalizada durante estos 30 días con <strong>Tyruss Full</strong>. ¿Cómo te llamas y qué edad tienes?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tu Nombre Completo o Cómo te gusta que te llamen
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Carolina, Patricia, Marcela..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 text-base"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Rango de Edad
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['25-34 años', '35-44 años', '45-54 años', '55+ años'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setAgeGroup(range)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          ageGroup === range
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-semibold">Regalo 100% Gratuito:</strong> Esta guía y aplicación interactiva han sido creadas exclusivamente por ColShopi Tienda para acompañar tu proceso con Tyruss Full.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  name.trim() 
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-800/20 active:scale-98' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continuar al Diagnóstico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Primary Health Angle */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Hola {name} 🌿
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  ¿Cuál es tu principal motivo de consulta hoy?
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona la situación que más se asemeja a lo que sientes en tu día a día:
                </p>
              </div>

              <div className="space-y-2.5">
                {angleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPrimaryAngle(opt.id);
                      setSelectedSymptoms([]);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      primaryAngle === opt.id
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-xs ring-1 ring-emerald-500/30'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{opt.title}</h4>
                        <span className="text-[10px] font-semibold bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{opt.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-800/20 active:scale-98 cursor-pointer"
                >
                  <span>Siguiente: Tus Síntomas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Symptoms Checklist */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Personalización del Plan
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  ¿Cuáles de estos síntomas has experimentado últimamente?
                </h3>
                <p className="text-xs text-slate-500">
                  Marca todos los que apliquen para calibrar tus recomendaciones diarias:
                </p>
              </div>

              <div className="space-y-2">
                {symptomListByAngle[primaryAngle].map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <span>{symptom}</span>
                      <CheckCircle2 
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isSelected ? 'text-emerald-700 fill-emerald-100' : 'text-slate-300'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-800/20 active:scale-98 cursor-pointer"
                >
                  <span>Generar mi Plan 30D</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Diagnostic Summary & Plan Unlock */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              {isGenerating ? (
                <div className="py-12 space-y-4">
                  <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">
                    Calibrando tu protocolo nutricional con Marié...
                  </h4>
                  <p className="text-xs text-slate-500">
                    Adaptando los nutrientes de Tyruss Full a tus necesidades hormonales y metabólicas.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 text-left">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h4 className="font-bold text-base">
                        ¡Plan Listo para {name}!
                      </h4>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      Según tu perfil, tu cuerpo requiere un enfoque prioritario en{' '}
                      <strong className="text-emerald-900 font-bold">
                        {primaryAngle === 'tiroides_metabolismo' && 'Activación Tiroidea & Aporte de Yodo/Selenio'}
                        {primaryAngle === 'desbalance_menopausia' && 'Equilibrio Estrogénico & Control de Temperatura'}
                        {primaryAngle === 'ciclos_spm' && 'Regulación del Eje Ovárico & Desinflamación Pélvica'}
                        {primaryAngle === 'digestion_detox' && 'Desintoxicación Intestinal & Tránsito Fluido'}
                      </strong>.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Dosis Diaria</span>
                        <span className="font-bold text-emerald-800">1 y ¼ Cucharada (20g)</span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Momento Ideal</span>
                        <span className="font-bold text-emerald-800">Mañana en Ayunas</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <span>🎁 Obsequio Incluido en tu Proceso:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Recuerda que con tu pedido en ColShopi Tienda cuentas con tu <strong>Loción Termoactiva Herbal GRATIS</strong> para alivio corporal y piernas cansadas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinish}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>Comenzar Día 1 de mi Reto</span>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

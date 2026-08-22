import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  KeyRound,
  MessageCircle,
  Mail,
  Phone,
  User,
  AlertCircle,
  HelpCircle,
  FileCheck2,
  Lock,
  Smartphone,
  Gift,
  Download
} from 'lucide-react';
import { HealthAngle, UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';
import { promptPWAInstall } from '../utils/pwaManager';
import { 
  isAuthorizedCode, 
  isCodeAlreadyUsed, 
  markCodeAsRedeemed 
} from '../data/authorizedCodes';
import { 
  isAdminCredentials, 
  ADMIN_CREDENTIALS, 
  findUserByCodeOrEmail, 
  saveRegisteredUser, 
  RegisteredUser 
} from '../data/usersDatabase';

interface OnboardingQuizProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Registration and VIP Gate States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ageGroup, setAgeGroup] = useState('35-44 años');
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // Clinical Diagnostic States
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

  // WhatsApp Pre-filled message generator
  const getWhatsAppRequestUrl = () => {
    const userNameParam = name.trim() ? `, mi nombre es *${name.trim()}*` : '';
    const text = `Hola Marié recibí ya mi Tyruss Full y quiero mi codigo para el acceso a TyroFem 30D${userNameParam}`;
    return `https://wa.me/573104007428?text=${encodeURIComponent(text)}`;
  };

  // Code validation handler with Admin credentials support and status checks
  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = accessCode.replace(/\D/g, ''); // only digits

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setCodeError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (cleanCode.length !== 6) {
      setCodeError('El código de acceso debe contener exactamente 6 dígitos numéricos.');
      return;
    }

    // A. Check for Admin Credentials (contacto@colshopi.com / 250816)
    if (isAdminCredentials(cleanEmail, cleanCode)) {
      setIsGenerating(true);
      setTimeout(() => {
        const adminProfile: UserProfile = {
          name: cleanName || ADMIN_CREDENTIALS.name,
          phone: cleanPhone || '+57 310 400 7428',
          email: ADMIN_CREDENTIALS.email,
          accessCode: ADMIN_CREDENTIALS.code,
          ageGroup: '35-44 años',
          primaryAngle: 'tiroides_metabolismo',
          symptoms: ['Supervisión y Monitoreo de Plataforma'],
          hasCompletedOnboarding: true,
          startDate: new Date().toISOString(),
          currentDay: 1,
          unlockedBadges: ['badge_start', 'badge_vip', 'badge_admin'],
          status: 'activa',
          isAdmin: true
        };
        onComplete(adminProfile);
      }, 1000);
      return;
    }

    // B. Check if it's a regular user and validate required fields
    if (!cleanName) {
      setCodeError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      setCodeError('Por favor ingresa el número de WhatsApp con el que realizaste tu pedido.');
      return;
    }

    // C. Check if user already exists in centralized database and is suspended or disabled
    const existingUser = findUserByCodeOrEmail(cleanEmail) || findUserByCodeOrEmail(cleanCode);
    if (existingUser) {
      if (existingUser.status === 'suspendida') {
        setCodeError(
          `⚠️ Tu cuenta ha sido SUSPENDIDA temporalmente por la administración de ColShopi. ${
            existingUser.statusReason ? `Motivo: "${existingUser.statusReason}".` : ''
          } Comunícate con soporte al WhatsApp +57 310 400 7428 para reactivar tu acceso.`
        );
        return;
      }
      if (existingUser.status === 'inhabilitada') {
        setCodeError(
          `⛔ Tu cuenta ha sido INHABILITADA de forma permanente por la administración de ColShopi. ${
            existingUser.statusReason ? `Motivo: "${existingUser.statusReason}".` : ''
          } Comunícate con soporte al WhatsApp +57 310 400 7428 si consideras que es un error.`
        );
        return;
      }

      // If returning active user with matching credentials, restore session directly
      if (existingUser.status === 'activa') {
        const emailMatches = existingUser.email && existingUser.email.toLowerCase() === cleanEmail;
        const codeMatches = existingUser.accessCode && existingUser.accessCode === cleanCode;
        if (emailMatches || codeMatches) {
          setIsGenerating(true);
          setTimeout(() => {
            const restoredProfile: UserProfile = {
              name: existingUser.name || cleanName,
              phone: existingUser.phone || cleanPhone,
              email: existingUser.email || cleanEmail,
              accessCode: existingUser.accessCode || cleanCode,
              ageGroup: existingUser.ageGroup || '35-44 años',
              primaryAngle: existingUser.primaryAngle || 'tiroides_metabolismo',
              symptoms: existingUser.symptoms || ['Soporte nutricional Tyruss Full'],
              hasCompletedOnboarding: true,
              startDate: existingUser.startDate || new Date().toISOString(),
              currentDay: existingUser.currentDay || 1,
              unlockedBadges: ['badge_start', 'badge_vip'],
              status: 'activa',
              isAdmin: false
            };
            onComplete(restoredProfile);
          }, 1000);
          return;
        }
      }
    }

    // 1. Check if the code is in the 50 authorized master database
    if (!isAuthorizedCode(cleanCode)) {
      setCodeError(
        '⛔ Código NO autorizado o no existe en la base de datos de ColShopi. Solo las compradoras verificadas de Tyruss Full reciben un código de acceso. Solicita tu código oficial por WhatsApp a ColShopi: +57 310 400 7428.'
      );
      return;
    }

    // 2. Check if the code was already redeemed / used by another user
    if (isCodeAlreadyUsed(cleanCode, undefined, cleanEmail)) {
      setCodeError(
        '⚠️ Este código de 6 dígitos ya fue canjeado y activado previamente por otra compradora. Cada código es de USO ÚNICO e intransferible. Si necesitas activar tu acceso para tu nuevo pedido, escríbenos a WhatsApp para asignarte un código libre.'
      );
      return;
    }

    setIsCodeVerified(true);
    setAccessCode(cleanCode);
    setStep(2);
  };

  const handleAdminQuickFill = () => {
    setName('Administrador ColShopi');
    setPhone('+57 310 400 7428');
    setEmail(ADMIN_CREDENTIALS.email);
    setAccessCode(ADMIN_CREDENTIALS.code);
    setCodeError(null);
  };

  const handleFinish = () => {
    setIsGenerating(true);
    
    // Register and burn the single-use 6-digit code in database
    markCodeAsRedeemed(accessCode.trim(), {
      userName: name.trim() || 'Compradora VIP',
      userPhone: phone.trim(),
      userEmail: email.trim()
    });

    const newProfile: UserProfile = {
      name: name.trim() || 'Compradora VIP',
      phone: phone.trim(),
      email: email.trim(),
      accessCode: accessCode.trim(),
      ageGroup,
      primaryAngle,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Fatiga matutina', 'Inflamación digestiva'],
      hasCompletedOnboarding: true,
      startDate: new Date().toISOString(),
      currentDay: 1,
      unlockedBadges: ['badge_start', 'badge_vip'],
      status: 'activa',
      isAdmin: false
    };

    // Save to master centralized users database for admin tracking
    const registeredUser: RegisteredUser = {
      id: `usr_${accessCode.trim()}`,
      name: newProfile.name,
      email: newProfile.email || '',
      phone: newProfile.phone || '',
      accessCode: newProfile.accessCode || '',
      ageGroup: newProfile.ageGroup || '35-44 años',
      primaryAngle: newProfile.primaryAngle,
      symptoms: newProfile.symptoms,
      startDate: newProfile.startDate,
      currentDay: 1,
      completedDays: 0,
      adherencePercent: 0,
      status: 'activa',
      registeredAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      notes: 'Registro verificado desde Onboarding TyroFem 30D.'
    };
    saveRegisteredUser(registeredUser);

    setTimeout(() => {
      onComplete(newProfile);
    }, 1600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
        
        {/* Header Ribbon with ColShopi VIP Identity */}
        <div className="bg-gradient-to-r from-[#070c12] via-slate-900 to-[#070c12] px-5 sm:px-7 py-5 text-white relative border-b border-cyan-500/25">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ColshopiLogo size="sm" showGlow={true} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40">
                    Acceso Exclusivo Compradoras
                  </span>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((step - 1) as any)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      title="Volver al paso anterior"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Volver al Paso {step - 1}</span>
                    </button>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-luxury mt-0.5">
                  TyroFem 30D • Activación de Protocolo
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={async () => {
                  if (window.__deferredPwaPrompt) {
                    await promptPWAInstall();
                  } else {
                    alert('Para instalar TyroFem 30D: Abre el menú ⋮ de Chrome y presiona "Instalar aplicación", o en Safari toca "Compartir" y "Agregar al inicio".');
                  }
                }}
                className="p-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1 text-[10px] font-bold"
                title="Descargar e Instalar App TyroFem 30D"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Instalar App</span>
              </button>

              <div className="text-right">
                <span className="text-xs text-cyan-300 block font-medium">Paso {step} de 4</span>
                <div className="flex gap-1.5 mt-1 justify-end">
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
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8">

          {/* ============================================================ */}
          {/* STEP 1: VIP ACCESS CODE & BUYER REGISTRATION FORM */}
          {/* ============================================================ */}
          {step === 1 && (
            <form onSubmit={handleValidateStep1} className="space-y-6">
              
              {/* Doctor Marie Portrait & VIP Access Notice */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0c161d] text-white rounded-2xl p-4 sm:p-5 border border-cyan-500/30 relative overflow-hidden space-y-3">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="shrink-0 flex flex-col items-center">
                    <MariePhoto size="md" showBadge={false} />
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        ¡Bienvenida a ColShopi Tienda! Soy Marié 💚
                      </h3>
                    </div>
                    <p className="text-xs text-cyan-200/90 leading-relaxed mt-1">
                      Somos la <strong>única Tienda Online Naturista con una App Exclusiva</strong> para acompañar tu tratamiento con Tyruss Full. Para activar tu protocolo de 30 días, ingresa tu <strong>código VIP de 6 dígitos</strong>.
                    </p>
                  </div>
                </div>

                {/* Direct WhatsApp Helper Trigger */}
                <div className="pt-2 border-t border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>¿Aún no tienes tu código de 6 dígitos?</span>
                  </div>

                  <a
                    href={getWhatsAppRequestUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all active:scale-98 text-center cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>Solicitar mi Código de acceso a Marié</span>
                  </a>
                </div>
              </div>

              {/* Error Message if any */}
              {codeError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">{codeError}</p>
                </div>
              )}

              {/* Registration Fields */}
              <div className="space-y-4">
                
                {/* 1. Nombre Completo */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tu Nombre Completo</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (codeError) setCodeError(null);
                    }}
                    placeholder="Ej: Claudia Patricia Martínez"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 text-sm font-medium"
                  />
                </div>

                {/* 2. WhatsApp con el que realizó el pedido & Rango de Edad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp de tu Pedido</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (codeError) setCodeError(null);
                      }}
                      placeholder="Ej: 310 400 7428"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 text-sm font-medium"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Número con el que solicitaste tu Tyruss Full.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Rango de Edad
                    </label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 text-sm font-medium bg-white"
                    >
                      <option value="18-24 años">18 - 24 años</option>
                      <option value="25-34 años">25 - 34 años</option>
                      <option value="35-44 años">35 - 44 años</option>
                      <option value="45-54 años">45 - 54 años</option>
                      <option value="55+ años">55 años o más</option>
                    </select>
                  </div>
                </div>

                {/* 3. Correo Electrónico Principal + Explicación del Informe Clínico */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Tu Correo Electrónico Principal</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (codeError) setCodeError(null);
                    }}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 text-sm font-medium"
                  />
                  
                  {/* Explicit Explanation of the 30-Day Clinical Report */}
                  <div className="mt-2.5 p-3 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-cyan-950 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-900">
                      <FileCheck2 className="w-4 h-4 text-cyan-700" />
                      <span>¿Por qué te solicitamos tu correo?</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-cyan-950">
                      Al finalizar tus 30 días con Tyruss Full, la Nutricionista Marié generará y te enviará a este correo tu{' '}
                      <strong className="text-cyan-900 font-extrabold underline decoration-cyan-400">
                        "Informe Clínico de Evolución Tiroidea, Balance Hormonal & Biometría Metabólica TyroFem 30D"
                      </strong>, con la comparativa de tus niveles de energía, digestión, síntomas y tu plan de mantenimiento.
                    </p>
                  </div>
                </div>

                {/* 4. Código de 6 Dígitos Numéricos */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      <span>Código de Activación Único (6 Dígitos Numéricos)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-bold text-slate-500">
                      {accessCode.replace(/\D/g, '').length} / 6
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                      value={accessCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setAccessCode(val);
                        if (codeError) setCodeError(null);
                      }}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.6em] font-mono text-2xl font-black px-4 py-3 rounded-xl border-2 border-emerald-500/60 bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 placeholder:tracking-normal placeholder:text-slate-300"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Asignado manualmente por ColShopi a cada compradora.</span>
                    </span>

                    <a
                      href={getWhatsAppRequestUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pedir mi código por WhatsApp</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Submit / Continue Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Validar Código VIP & Iniciar Diagnóstico</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* ColShopi VIP Customer Guarantee Badge & Admin Access */}
              <div className="pt-3 text-center border-t border-slate-100 flex flex-col items-center justify-center gap-2 text-[11px] text-slate-500">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <div className="flex items-center gap-1 font-semibold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Comunidad Exclusiva ColShopi Tienda By Leps Digital</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="text-slate-400">Garantía & Registro INVIMA RSA-0021928-2022</span>
                </div>

                <button
                  type="button"
                  onClick={handleAdminQuickFill}
                  className="text-[10px] text-slate-400 hover:text-cyan-700 transition-colors inline-flex items-center gap-1 mt-1 cursor-pointer"
                  title="Acceso para el equipo administrativo de ColShopi"
                >
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                  <span>Acceso Administrativo ColShopi (contacto@colshopi.com)</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 2: PRIMARY HEALTH ANGLE */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Código VIP Validado • Hola {name} 🌿
                </span>
                <h3 className="text-lg font-bold text-slate-800 font-serif-luxury">
                  ¿Cuál es tu principal motivo de consulta hoy?
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona la situación que más se asemeja a lo que sientes en tu día a día con tu salud:
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
                  <span>Siguiente: Tus Síntomas Activos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: SYMPTOMS CHECKLIST */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Personalización del Protocolo
                </span>
                <h3 className="text-lg font-bold text-slate-800 font-serif-luxury">
                  ¿Cuáles de estos síntomas has experimentado últimamente?
                </h3>
                <p className="text-xs text-slate-500">
                  Marca todos los que apliquen. Estos datos se registrarán en tu <strong>Informe Clínico TyroFem 30D</strong>:
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

          {/* ============================================================ */}
          {/* STEP 4: DIAGNOSTIC SUMMARY & PROTOCOL ACTIVATION */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fadeIn">
              {isGenerating ? (
                <div className="py-12 space-y-4">
                  <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">
                    Activando Protocolo VIP para {name}...
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Calibrando dosis de Tyruss Full, guía de hidratación y preparando la apertura de tu expediente clínico.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 text-left">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h4 className="font-bold text-base font-serif-luxury">
                          ¡Plan TyroFem 30D Listo para {name}!
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                        Código VIP: {accessCode}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      Según tu evaluación, tu organismo requiere un enfoque prioritario en{' '}
                      <strong className="text-emerald-900 font-bold">
                        {primaryAngle === 'tiroides_metabolismo' && 'Activación Tiroidea & Aporte de Yodo/Selenio Funcional'}
                        {primaryAngle === 'desbalance_menopausia' && 'Equilibrio Estrogénico & Control de Temperatura'}
                        {primaryAngle === 'ciclos_spm' && 'Regulación del Eje Ovárico & Desinflamación Pélvica'}
                        {primaryAngle === 'digestion_detox' && 'Desintoxicación Intestinal & Tránsito Fluido'}
                      </strong>.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Dosis Diaria Tyruss</span>
                        <span className="font-bold text-emerald-800">1 y ¼ Cucharada (20g)</span>
                      </div>
                      <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Momento de Toma</span>
                        <span className="font-bold text-emerald-800">Mañanas en Ayunas</span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Email & Clinical Report Confirmation Card */}
                  <div className="p-4 rounded-2xl bg-cyan-50/90 border border-cyan-200 space-y-2 text-xs text-cyan-950">
                    <div className="flex items-center gap-2 font-bold text-cyan-900">
                      <Mail className="w-4 h-4 text-cyan-700 shrink-0" />
                      <span>Destino del Informe Clínico (Día 30):</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Al completar tus 30 días, recibirás tu <strong>"Informe Clínico de Evolución Tiroidea & Balance Metabólico TyroFem 30D"</strong> en: <strong className="text-cyan-950 underline">{email}</strong>.
                    </p>
                  </div>

                  {/* Free Gift Card */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <span>🎁 Obsequio Incluido en tu Proceso:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Recuerda que con tu pedido en ColShopi Tienda cuentas con tu <strong>Loción Termoactiva Herbal GRATIS</strong> para alivio corporal, piernas pesadas y contracturas.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="flex-1 py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <span>Comenzar Día 1 de mi Reto</span>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Activity, 
  BookOpen, 
  MessageCircle, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Heart,
  FileText,
  Smartphone,
  Award,
  ChevronRight,
  Send,
  Leaf,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPlan, DayProgress, UserProfile } from './types';
import { Header } from './components/Header';
import { OnboardingQuiz } from './components/OnboardingQuiz';
import { CalendarView } from './components/CalendarView';
import { DayDetailModal } from './components/DayDetailModal';
import { DailyTracker } from './components/DailyTracker';
import { RecipeBook } from './components/RecipeBook';
import { MarieChat } from './components/MarieChat';
import { OrderModal } from './components/OrderModal';
import { NutritionalInfoModal } from './components/NutritionalInfoModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWAInstallModal } from './components/PWAInstallModal';
import { ColshopiBrandModal } from './components/ColshopiBrandModal';
import { ColshopiCorporateBanner } from './components/ColshopiCorporateBanner';
import { ColshopiLogo } from './components/ColshopiLogo';
import { MarieProfileCard } from './components/MarieProfileCard';
import { UserProfileModal } from './components/UserProfileModal';
import { ColshopiVipPerksModal } from './components/ColshopiVipPerksModal';
import { WhatsAppShareButton } from './components/WhatsAppShareButton';
import { CALENDAR_DAYS } from './data/calendarData';
import { RECIPES_DATA } from './data/recipesData';

export default function App() {
  // Load or initialize user profile from localStorage
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tyrofem_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Load progress map
  const [progressMap, setProgressMap] = useState<Record<number, DayProgress>>(() => {
    const saved = localStorage.getItem('tyrofem_progress_map');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Navigation tab and history stack
  const [activeTab, setActiveTab] = useState<'calendario' | 'tracker' | 'recetas' | 'chat' | 'pedidos'>('calendario');
  const [navigationHistory, setNavigationHistory] = useState<('calendario' | 'tracker' | 'recetas' | 'chat' | 'pedidos')[]>([]);

  const TAB_LABELS: Record<string, { label: string; icon: any }> = {
    calendario: { label: 'Calendario 30D', icon: CalendarIcon },
    tracker: { label: 'Mi Registro Diario', icon: Activity },
    recetas: { label: 'Recetario de Batidos', icon: BookOpen },
    chat: { label: 'Pregúntale a Marié', icon: MessageCircle },
    pedidos: { label: 'Promociones & Pedidos', icon: ShoppingBag }
  };

  const handleNavigateTab = (newTab: 'calendario' | 'tracker' | 'recetas' | 'chat' | 'pedidos') => {
    if (newTab === activeTab) return;
    setNavigationHistory(prev => [...prev.filter(t => t !== newTab), activeTab]);
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const prevTab = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setActiveTab(prevTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('calendario');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Modals state
  const [selectedDayPlan, setSelectedDayPlan] = useState<DayPlan | null>(null);
  const [targetRecipeId, setTargetRecipeId] = useState<string | undefined>(undefined);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isNutritionalModalOpen, setIsNutritionalModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isVipPerksModalOpen, setIsVipPerksModalOpen] = useState(false);
  const [isPwaInstallModalOpen, setIsPwaInstallModalOpen] = useState(false);
  const [isReorderTrigger, setIsReorderTrigger] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('tyrofem_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('tyrofem_progress_map', JSON.stringify(progressMap));
  }, [progressMap]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setActiveTab('calendario');
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // silent
    }
    // Auto-prompt PWA Install Modal after login and entering 30-day plan
    setTimeout(() => {
      setIsPwaInstallModalOpen(true);
    }, 1000);
  };

  // Handle saving day progress
  const handleSaveDayProgress = (dayNumber: number, progress: DayProgress) => {
    setProgressMap(prev => {
      const updated = { ...prev, [dayNumber]: progress };
      
      // Update currentDay if progressing
      if (userProfile && dayNumber >= userProfile.currentDay && progress.completedAt) {
        const nextDay = Math.min(30, dayNumber + 1);
        setUserProfile(curr => curr ? { ...curr, currentDay: nextDay } : null);
      }
      
      return updated;
    });
  };

  // Handle recipe link click
  const handleOpenRecipe = (recipeId: string) => {
    setSelectedDayPlan(null);
    setTargetRecipeId(recipeId);
    setActiveTab('recetas');
  };

  const handleOpenOrder = (isReorderFlow: boolean = false) => {
    setIsReorderTrigger(isReorderFlow);
    setIsOrderModalOpen(true);
  };

  const completedDaysCount = (Object.values(progressMap) as DayProgress[]).filter(p => p.completedAt || (p.tyrussTaken && p.water2L)).length;
  const currentDay = userProfile?.currentDay || 1;

  // Render Onboarding Quiz if not completed
  if (!userProfile || !userProfile.hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        <Header
          userProfile={null}
          currentDay={1}
          completedDaysCount={0}
          onOpenNutritionalInfo={() => setIsNutritionalModalOpen(true)}
          onOpenOrder={() => handleOpenOrder(false)}
          onOpenChat={() => {}}
          onInstallPWA={() => setIsPwaInstallModalOpen(true)}
        />
        <main className="flex-1 max-w-5xl mx-auto w-full p-4">
          <OnboardingQuiz onComplete={handleOnboardingComplete} />
        </main>
        <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-200/80 bg-white">
          <p>© 2026 ColShopi Tienda By Leps Digital • TyroFem 30D con Tyruss Full • Registro INVIMA RSA-0021928-2022</p>
        </footer>

        {/* PWA Install Modal */}
        <PWAInstallModal
          isOpen={isPwaInstallModalOpen}
          onClose={() => setIsPwaInstallModalOpen(false)}
        />

        {/* Nutritional Modal available during onboarding */}
        <NutritionalInfoModal
          isOpen={isNutritionalModalOpen}
          onClose={() => setIsNutritionalModalOpen(false)}
          onOpenOrder={() => {
            setIsNutritionalModalOpen(false);
            handleOpenOrder(false);
          }}
        />

        <OrderModal
          userProfile={{
            name: 'Amiga',
            primaryAngle: 'tiroides_metabolismo',
            symptoms: [],
            hasCompletedOnboarding: false,
            startDate: '',
            currentDay: 1,
            unlockedBadges: []
          }}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          isReorder={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-800 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans relative">
      {/* App Header */}
      <Header
        userProfile={userProfile}
        currentDay={currentDay}
        completedDaysCount={completedDaysCount}
        onOpenNutritionalInfo={() => setIsNutritionalModalOpen(true)}
        onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
        onOpenChat={() => handleNavigateTab('chat')}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        onInstallPWA={() => setIsPwaInstallModalOpen(true)}
      />

      {/* Main Tab Navigation Header (Desktop / Tablet) */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[69px] z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between overflow-x-auto gap-2 py-1">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'calendario', label: 'Calendario 30D', icon: CalendarIcon },
              { id: 'tracker', label: 'Mi Registro Diario', icon: Activity },
              { id: 'recetas', label: 'Recetario de Batidos', icon: BookOpen },
              { id: 'chat', label: 'Pregúntale a Marié', icon: MessageCircle },
              { id: 'pedidos', label: 'Promociones & Pedidos', icon: ShoppingBag, badge: 'Obsequio 🎁' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigateTab(tab.id as any)}
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Profile Tag */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 pl-4 border-l border-slate-200 shrink-0">
            <button
              onClick={() => setIsUserProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer"
              title="Ver mi credencial VIP y expediente clínico"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Alumna: <strong className="text-slate-900">{userProfile.name}</strong></span>
              <span className="text-[10px] text-cyan-700 font-bold bg-cyan-100 px-1.5 py-0.2 rounded">VIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 mt-2">
        {/* Universal Back Navigation Bar (Available in every section to return to previous section) */}
        {activeTab !== 'calendario' && (
          <div className="mb-4 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 animate-fadeIn">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Volver a la sección anterior"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Volver a {navigationHistory.length > 0 ? TAB_LABELS[navigationHistory[navigationHistory.length - 1]]?.label : 'Calendario 30D'}
              </span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              <button 
                onClick={() => handleNavigateTab('calendario')}
                className="hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Inicio</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-bold text-slate-800 truncate">
                {TAB_LABELS[activeTab]?.label}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'calendario' && (
          <CalendarView
            userProfile={userProfile}
            progressMap={progressMap}
            onSelectDay={(day) => setSelectedDayPlan(day)}
            onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
            onOpenChat={() => handleNavigateTab('chat')}
          />
        )}

        {activeTab === 'tracker' && (
          <DailyTracker
            userProfile={userProfile}
            progressMap={progressMap}
            currentDay={currentDay}
            onSaveProgress={handleSaveDayProgress}
            onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
            onOpenChat={() => handleNavigateTab('chat')}
          />
        )}

        {activeTab === 'recetas' && (
          <RecipeBook
            initialRecipeId={targetRecipeId}
            onOpenOrder={() => handleOpenOrder(false)}
            onOpenChat={() => handleNavigateTab('chat')}
          />
        )}

        {activeTab === 'chat' && (
          <MarieChat
            userProfile={userProfile}
            onOpenOrder={() => handleOpenOrder(false)}
            onOpenRecipe={handleOpenRecipe}
          />
        )}

        {activeTab === 'pedidos' && (
          <div className="space-y-6 pb-20">
            {/* Prominent Return Button for Pedidos Section */}
            <div className="flex items-center justify-between bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 px-4 shadow-xs">
              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-950 hover:text-emerald-900 bg-white hover:bg-emerald-100/70 px-3.5 py-2 rounded-xl border border-emerald-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-700" />
                <span>Volver a la sección anterior ({navigationHistory.length > 0 ? TAB_LABELS[navigationHistory[navigationHistory.length - 1]]?.label : 'Calendario 30D'})</span>
              </button>
              <span className="text-[11px] font-semibold text-emerald-800 hidden sm:inline">
                ColShopi Tienda By Leps Digital
              </span>
            </div>

            {/* Full Official Corporate Banner */}
            <ColshopiCorporateBanner 
              onOpenBrandModal={() => setIsBrandModalOpen(true)}
              onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <MarieProfileCard 
                  onOpenChat={() => handleNavigateTab('chat')}
                  onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
                  onOpenVipPerks={() => setIsVipPerksModalOpen(true)}
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Despacho Oficial ColShopi
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1 font-serif-luxury">
                        Garantías de tu Compra
                      </h3>
                    </div>
                    <button
                      onClick={() => handleOpenOrder(currentDay >= 22)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      Pedir Ahora
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="text-base">🚚</span>
                      <div>
                        <strong className="block text-slate-800">Envío Gratis Colombia</strong>
                        Despacho prioritario de 2 a 4 días hábiles.
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="text-base">💵</span>
                      <div>
                        <strong className="block text-slate-800">Pago Contra Entrega</strong>
                        Pagas en efectivo al recibir en tu puerta.
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="text-base">🎁</span>
                      <div>
                        <strong className="block text-slate-800">Obsequio Incluido</strong>
                        Loción Termoactiva gratis en todos los paquetes.
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="text-base">🛡️</span>
                      <div>
                        <strong className="block text-slate-800">100% Original & Sellado</strong>
                        Registro INVIMA RSA-0021928-2022 de Unmerco.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 30 Calendar Days App Validity & Reactivation Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-[#071318] text-white rounded-3xl p-6 border border-cyan-500/40 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏰</span>
                    <h4 className="font-bold text-base text-cyan-300">
                      Vigencia de la App: 30 Días Calendario por Tratamiento
                    </h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Tu acceso a la <strong>App TyroFem 30D</strong> y el acompañamiento personalizado de la <strong>Nutricionista Marié</strong> está habilitado durante tus <strong>30 días calendario de tratamiento</strong>.
                  </p>
                  <div className="bg-emerald-950/80 rounded-2xl p-3.5 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-100">
                    <div>
                      <strong className="text-white block font-bold">¿Cómo reactivar tu App por 30 días más?</strong>
                      <span className="text-emerald-200/90 text-[11px]">
                        Al solicitar un nuevo pedido de Tyruss Full, tu acceso se reactiva automáticamente por 30 días adicionales para continuar tu evolución.
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenOrder(currentDay >= 22)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                    >
                      Pedir Tyruss Full
                    </button>
                  </div>
                </div>

                {/* Form Trigger Card */}
                <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-base">¿Lista para continuar tu proceso?</h4>
                    <p className="text-xs text-emerald-200 mt-0.5">Escribe directamente a la línea de ColShopi (+57 310 400 7428) o llena tu formulario.</p>
                  </div>
                  <button
                    onClick={() => handleOpenOrder(currentDay >= 22)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    Pedir Tyruss Full
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Navegación principal móvil" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-lg">
        {[
          { id: 'calendario', label: '30 Días', icon: CalendarIcon },
          { id: 'tracker', label: 'Registro', icon: Activity },
          { id: 'recetas', label: 'Recetas', icon: BookOpen },
          { id: 'chat', label: 'Marié', icon: MessageCircle },
          { id: 'pedidos', label: 'Tarros', icon: ShoppingBag, badge: '🎁' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'pedidos') {
                  handleOpenOrder(currentDay >= 22);
                } else {
                  setActiveTab(tab.id as any);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {tab.badge && (
                <span className="absolute -top-1 right-1 text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Day Detail Modal */}
      <DayDetailModal
        dayPlan={selectedDayPlan}
        userProfile={userProfile}
        currentProgress={selectedDayPlan ? progressMap[selectedDayPlan.dayNumber] : undefined}
        onClose={() => setSelectedDayPlan(null)}
        onSaveProgress={handleSaveDayProgress}
        onOpenRecipe={handleOpenRecipe}
        onOpenChat={() => {
          setSelectedDayPlan(null);
          setActiveTab('chat');
        }}
      />

      {/* Order & Recompra Modal */}
      <OrderModal
        userProfile={userProfile}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        isReorder={isReorderTrigger || currentDay >= 22}
      />

      {/* Nutritional Info & INVIMA Modal */}
      <NutritionalInfoModal
        isOpen={isNutritionalModalOpen}
        onClose={() => setIsNutritionalModalOpen(false)}
        onOpenOrder={() => {
          setIsNutritionalModalOpen(false);
          handleOpenOrder(false);
        }}
      />

      {/* ColShopi Brand Modal */}
      <ColshopiBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onOpenOrder={() => {
          setIsBrandModalOpen(false);
          handleOpenOrder(false);
        }}
        onOpenChat={() => {
          setIsBrandModalOpen(false);
          setActiveTab('chat');
        }}
      />

      {/* User VIP Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
        userProfile={userProfile}
        completedDays={completedDaysCount}
        progressMap={progressMap}
        currentDay={currentDay}
      />

      {/* ColShopi VIP Customer Exclusivity & Perks Modal */}
      <ColshopiVipPerksModal
        isOpen={isVipPerksModalOpen}
        onClose={() => setIsVipPerksModalOpen(false)}
        onOpenOrder={() => {
          setIsVipPerksModalOpen(false);
          handleOpenOrder(false);
        }}
        onOpenChat={() => {
          setIsVipPerksModalOpen(false);
          setActiveTab('chat');
        }}
        userProfile={userProfile}
      />

      {/* Permanent WhatsApp Share Floating Button (Viralization & Direct Marie Link) */}
      <WhatsAppShareButton
        userProfile={userProfile}
        currentDay={currentDay}
        completedDaysCount={completedDaysCount}
        progressMap={progressMap}
      />

        {/* PWA Installation Helper & Modal */}
        <PWAInstallBanner onOpenInstallModal={() => setIsPwaInstallModalOpen(true)} />
        <PWAInstallModal
          isOpen={isPwaInstallModalOpen}
          onClose={() => setIsPwaInstallModalOpen(false)}
        />

      {/* Rich Corporate Brand Footer */}
      <footer className="text-slate-400 border-t border-slate-800 bg-[#070b10] py-8 px-4 text-xs mb-14 sm:mb-0">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3 text-left">
              <ColshopiLogo size="md" showGlow={true} />
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  COLSHOPI TIENDA BY LEPS DIGITAL
                </h4>
                <p className="text-[11px] text-cyan-300">
                  Cuidamos de ti • Nutrición & Bienestar Femenino 2026
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <button
                onClick={() => setIsVipPerksModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-cyan-900/80 border border-emerald-400/50 text-emerald-200 text-xs font-bold hover:border-emerald-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98"
                title="Conoce las ventajas exclusivas de ser cliente VIP de ColShopi Tienda"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>⭐ Mis Ventajas VIP ColShopi</span>
              </button>

              <button
                onClick={() => setIsBrandModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900 transition-colors cursor-pointer"
              >
                Conocer la Marca ColShopi
              </button>

              <button
                onClick={() => setIsNutritionalModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
              >
                INVIMA: RSA-0021928-2022
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-slate-400 text-center sm:text-left">
            <div>
              <span className="text-slate-200 font-bold block mb-1">Categorías</span>
              <p>Belleza & Cuidado</p>
              <p>Salud & Bienestar</p>
              <p>Nutrición Femenina</p>
            </div>
            <div>
              <span className="text-slate-200 font-bold block mb-1">Garantías</span>
              <p>Pago Contra Entrega</p>
              <p>Envío Gratis Nacional</p>
              <p>Productos 100% Originales</p>
            </div>
            <div>
              <span className="text-slate-200 font-bold block mb-1">Atención & WhatsApp</span>
              <p className="text-cyan-300 font-semibold">+57 310 400 7428</p>
              <p>Lunes a Sábado: 8am - 8pm</p>
              <p>Colombia</p>
            </div>
            <div>
              <span className="text-slate-200 font-bold block mb-1">Nutricionista</span>
              <p className="text-emerald-300 font-semibold">Marié de ColShopi</p>
              <p>Guía TyroFem 30D</p>
              <p>Tyruss Full (500g)</p>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-slate-900 text-[10px] text-slate-500">
            © 2026 ColShopi Tienda By Leps Digital. Todos los derechos reservados. Tyruss Full es un alimento funcional en polvo fabricado por Laboratorio Unmerco con Registro Sanitario INVIMA RSA-0021928-2022.
          </div>
        </div>
      </footer>
    </div>
  );
}

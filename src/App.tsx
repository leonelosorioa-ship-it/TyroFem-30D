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
  Leaf
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

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'calendario' | 'tracker' | 'recetas' | 'chat' | 'pedidos'>('calendario');

  // Modals state
  const [selectedDayPlan, setSelectedDayPlan] = useState<DayPlan | null>(null);
  const [targetRecipeId, setTargetRecipeId] = useState<string | undefined>(undefined);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isNutritionalModalOpen, setIsNutritionalModalOpen] = useState(false);
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
        />
        <main className="flex-1 max-w-5xl mx-auto w-full p-4">
          <OnboardingQuiz onComplete={handleOnboardingComplete} />
        </main>
        <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-200/80 bg-white">
          <p>© 2026 ColShopi Tienda By Leps Digital • TyroFem 30D con Tyruss Full • Registro INVIMA RSA-0021928-2022</p>
        </footer>

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
        onOpenChat={() => setActiveTab('chat')}
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
                  onClick={() => setActiveTab(tab.id as any)}
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
            <span>Alumna: <strong className="text-slate-800">{userProfile.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 mt-2">
        {activeTab === 'calendario' && (
          <CalendarView
            userProfile={userProfile}
            progressMap={progressMap}
            onSelectDay={(day) => setSelectedDayPlan(day)}
            onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'tracker' && (
          <DailyTracker
            userProfile={userProfile}
            progressMap={progressMap}
            currentDay={currentDay}
            onSaveProgress={handleSaveDayProgress}
            onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
            onOpenChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'recetas' && (
          <RecipeBook
            initialRecipeId={targetRecipeId}
            onOpenOrder={() => handleOpenOrder(false)}
            onOpenChat={() => setActiveTab('chat')}
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
            {/* Quick Trigger to open full order modal or showcase offers directly */}
            <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950">
                  ColShopi Tienda By Leps Digital
                </span>
                <span className="text-xs text-emerald-200">
                  Garantía & Despacho Inmediato 🚚
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury">
                Promociones Oficiales Tyruss Full (500g)
              </h2>
              <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
                Todos los pedidos incluyen <strong>Loción Termoactiva GRATIS 🎁</strong>, Envío Sin Costo a toda Colombia y <strong>Pago Contra Entrega</strong> (pagas en efectivo al recibir en tu puerta).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleOpenOrder(currentDay >= 22)}
                  className="py-3 px-6 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Abrir Formulario de Pedido Rápido</span>
                </button>
              </div>
            </div>

            {/* Embed the Order Form inside view as well */}
            <DailyTracker
              userProfile={userProfile}
              progressMap={progressMap}
              currentDay={currentDay}
              onSaveProgress={handleSaveDayProgress}
              onOpenOrder={() => handleOpenOrder(currentDay >= 22)}
              onOpenChat={() => setActiveTab('chat')}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button: Quick WhatsApp / Order */}
      <aside aria-label="Acciones rápidas de WhatsApp y Asesoría" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2">
        <a
          href="https://wa.me/573104007428?text=Hola%20Marié,%20estoy%20en%20la%20App%20TyroFem%2030D%20y%20quiero%20hacerte%20una%20consulta"
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white"
          title="Chatear con Marié por WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>
      </aside>

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

      {/* PWA Installation Helper */}
      <PWAInstallBanner />

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-200/80 bg-white space-y-1 mb-14 sm:mb-0">
        <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold">
          <span>TyroFem 30D</span>
          <span>•</span>
          <span>ColShopi Tienda By Leps Digital 💚</span>
          <span>•</span>
          <span>Nutricionista Marié</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
          Tyruss Full es un alimento en polvo funcional con Registro INVIMA RSA-0021928-2022. No reemplaza tratamientos médicos especializados.
        </p>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  MessageCircle, 
  Flame,
  Clock,
  MapPin,
  Utensils,
  X,
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { SUCCESS_STORIES, SuccessStory } from '../data/successStoriesData';
import { UserProfile } from '../types';

interface SuccessStoriesCarouselProps {
  userProfile?: UserProfile;
  onOpenDayPlan?: () => void;
  onOpenChat?: () => void;
  onOpenOrder?: () => void;
}

export const SuccessStoriesCarousel: React.FC<SuccessStoriesCarouselProps> = ({
  userProfile,
  onOpenDayPlan,
  onOpenChat,
  onOpenOrder
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedStoryModal, setSelectedStoryModal] = useState<SuccessStory | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter stories by category
  const filteredStories = selectedCategory === 'all'
    ? SUCCESS_STORIES
    : SUCCESS_STORIES.filter(s => s.category === selectedCategory);

  // Reset index if category changes and index is out of bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Set default filter matching user's primary angle if available
  useEffect(() => {
    if (userProfile?.primaryAngle && selectedCategory === 'all') {
      const match = SUCCESS_STORIES.find(s => s.category === userProfile.primaryAngle);
      if (match) {
        // We can highlight or default to it smoothly
      }
    }
  }, [userProfile?.primaryAngle]);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying || filteredStories.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredStories.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredStories.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev - 1 + filteredStories.length) % filteredStories.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % filteredStories.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const categories = [
    { id: 'all', label: 'Todas las Historias', icon: '🌟' },
    { id: 'tiroides_metabolismo', label: 'Tiroides & Metabolismo', icon: '🦋' },
    { id: 'desbalance_menopausia', label: 'Balance Hormonal', icon: '🌸' },
    { id: 'fatiga_energia', label: 'Energía & Vitalidad', icon: '⚡' },
    { id: 'inflamacion_digestion', label: 'Desinflamación', icon: '🌿' }
  ];

  const currentStory = filteredStories[currentIndex] || filteredStories[0];

  return (
    <section 
      id="historias-de-exito-colshopi"
      className="bg-gradient-to-b from-white to-emerald-50/40 rounded-3xl p-4 sm:p-7 border border-emerald-200/90 shadow-sm relative overflow-hidden space-y-5"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Decorative corporate background glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header section with ColShopi verified stamp */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-100 pb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-300 shadow-2xs mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Compradoras Reales Tyruss Full (500g)</span>
            <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 rounded-full">ColShopi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-luxury tracking-tight flex items-center gap-2">
            <span>Historias de Éxito & Transformación</span>
            <span className="text-amber-500 text-lg">✨</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-0.5 leading-relaxed">
            Conoce cómo otras mujeres en Colombia transformaron su digestión, controlaron sus sofocos y reactivaron su metabolismo en 30 días.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 font-semibold mr-2">
            <span>{currentIndex + 1}</span>
            <span className="text-slate-300">/</span>
            <span>{filteredStories.length}</span>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-950 transition-all active:scale-95 shadow-2xs cursor-pointer"
            aria-label="Historia anterior"
            title="Historia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 text-white transition-all active:scale-95 shadow-2xs cursor-pointer"
            aria-label="Siguiente historia"
            title="Siguiente historia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setIsAutoPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-emerald-800 text-white border border-emerald-900 shadow-xs scale-[1.02]'
                  : 'bg-white hover:bg-emerald-50/70 text-slate-700 border border-slate-200 hover:border-emerald-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Carousel Card */}
      {currentStory && (
        <div 
          className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-emerald-200 shadow-sm transition-all duration-500 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle top quotation mark watermark */}
          <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-16 sm:w-24 h-16 sm:h-24 text-emerald-900/5 -rotate-12 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-center relative z-10">
            
            {/* Left Column: Author Info & Rating */}
            <div className="lg:col-span-4 space-y-3.5 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
              <div className="flex items-center gap-3.5">
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${currentStory.avatarBg} text-white font-serif-luxury font-black text-lg sm:text-xl flex items-center justify-center shadow-md shrink-0 ring-4 ring-emerald-100/80`}>
                  {currentStory.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentStory.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                    <span>{currentStory.age}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-600">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {currentStory.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5-Star Rating & Verified Badge */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1">
                  {[...Array(currentStory.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-black text-slate-800 ml-1.5">5.0 / 5.0</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reto 30D Completado con Éxito</span>
                </div>
              </div>

              {/* Initial symptom tag */}
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Motivo Inicial:
                </span>
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  {currentStory.initialSymptom}
                </p>
              </div>
            </div>

            {/* Middle/Right Column: Story & Results */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Highlight Quote */}
              <div className="relative">
                <blockquote className="text-base sm:text-xl font-bold text-slate-900 font-serif-luxury italic leading-relaxed text-emerald-950">
                  “{currentStory.storyQuote}”
                </blockquote>
              </div>

              {/* Story excerpt */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentStory.fullTestimonial}
              </p>

              {/* Key Achievements Grid */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Resultados Obtenidos en 30 Días:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentStory.keyResults.map((result, idx) => (
                    <div 
                      key={idx}
                      className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-2.5 text-xs font-semibold text-emerald-950 flex items-start gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer action bar inside card */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Receta preferida:</span>
                  </span>
                  <span className="font-bold text-emerald-900 bg-emerald-100/60 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {currentStory.favoriteRecipe}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStoryModal(currentStory)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer ml-auto"
                >
                  <span>Ver experiencia completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Pagination dots & Motivational Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {filteredStories.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-emerald-700 shadow-xs'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Ir al testimonio ${idx + 1}`}
            />
          ))}
        </div>

        {/* Motivational Callout */}
        <div className="flex items-center gap-2.5 bg-emerald-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium shadow-xs">
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>¡Tú eres la próxima historia de éxito de los 30 Días!</span>
          {onOpenDayPlan && (
            <button
              type="button"
              onClick={onOpenDayPlan}
              className="font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer ml-1"
            >
              Completar mi día
            </button>
          )}
        </div>
      </div>

      {/* Expanded Story Detail Modal */}
      {selectedStoryModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedStoryModal(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-emerald-200 max-h-[90vh] overflow-y-auto space-y-5 animate-scaleUp relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStoryModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${selectedStoryModal.avatarBg} text-white font-serif-luxury font-black text-2xl flex items-center justify-center shadow-lg ring-4 ring-emerald-100`}>
                {selectedStoryModal.avatarInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedStoryModal.name}
                  </h3>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                    Verificada
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStoryModal.age} • {selectedStoryModal.city} • Reto 30D Completado
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">Calificación 5/5</span>
                </div>
              </div>
            </div>

            {/* Quote banner */}
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-2xl">
              <p className="text-sm sm:text-base font-serif-luxury font-bold text-emerald-950 italic">
                “{selectedStoryModal.storyQuote}”
              </p>
            </div>

            {/* Full narrative */}
            <div className="space-y-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Experiencia Completa:
              </h5>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedStoryModal.fullTestimonial}
              </p>
            </div>

            {/* WhatsApp feedback snippet if available */}
            {selectedStoryModal.whatsappQuote && (
              <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4 space-y-1.5 border border-emerald-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Mensaje de WhatsApp a Marié:</span>
                </div>
                <p className="text-xs sm:text-sm italic text-emerald-200">
                  {selectedStoryModal.whatsappQuote}
                </p>
              </div>
            )}

            {/* Results breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Transformaciones tangibles alcanzadas:
              </h5>
              <div className="space-y-1.5">
                {selectedStoryModal.keyResults.map((kr, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{kr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                ColShopi Tienda By Leps Digital • Programa TyroFem 30D
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onOpenChat && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoryModal(null);
                      onOpenChat();
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Hablar con Marié
                  </button>
                )}
                {onOpenOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoryModal(null);
                      onOpenOrder();
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Ver Promoción Tyruss Full
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

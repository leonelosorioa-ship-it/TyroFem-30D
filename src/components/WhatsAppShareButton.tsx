import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Sparkles, 
  Copy, 
  Check, 
  Heart, 
  Flame, 
  TrendingUp, 
  X, 
  Award,
  Users,
  Send
} from 'lucide-react';
import { UserProfile, DayProgress } from '../types';
import { MariePhoto } from './MariePhoto';

interface WhatsAppShareButtonProps {
  userProfile?: UserProfile | null;
  currentDay?: number;
  completedDaysCount?: number;
  progressMap?: Record<number, DayProgress>;
}

export const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({
  userProfile,
  currentDay = 1,
  completedDaysCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const userName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Amiga';
  const marieDirectLink = 'https://wa.link/6zpm18';

  const templates = [
    {
      id: 'evolucion',
      title: '🌟 Mi Evolución & Energía (Recomendado)',
      badge: 'Más Compartido',
      message: `¡Hola! 👋 Te quería compartir algo que me ha encantado. ✨
Estoy en mi día *${currentDay} del Reto TyroFem 30D* con *Tyruss Full* y me he sentido con muchísima más energía, ligera y en bienestar general. 🌿💚

Lo mejor es que *ColShopi Tienda* es la única que te da una *App Exclusiva* con *Marié*, su Asistente Virtual y Guía de Bienestar, para acompañar todo tu proceso paso a paso. 📲✨

Si quieres probarlo o conocer sobre este reto de hábitos, puedes hablar directo con Marié aquí 👇
${marieDirectLink}

¡100% recomendado! 🌸✨`
    },
    {
      id: 'desinflamacion',
      title: '🍃 Confort & Bienestar Diario',
      badge: 'Hábitos',
      message: `¡Amiga! 💚 Tienes que conocer esto. Llevo *${completedDaysCount > 0 ? `${completedDaysCount} días` : `iniciando`}* con *Tyruss Full* (Selenio + Espirulina) de *ColShopi Tienda* y mi bienestar diario y energía han mejorado muchísimo. 🚀✨

Viene con acceso gratis a su App de hábitos, recetas saludables y pautas guiadas por Marié.

Habla con Marié directamente en su WhatsApp oficial aquí para que te oriente: 👇
${marieDirectLink}

¡Te va a encantar! 🌿`
    },
    {
      id: 'motivacion',
      title: '💪 Reto Hábitos Saludables 30 Días',
      badge: 'Reto VIP',
      message: `¡Hola a todas! 🌸 Me uní al reto de 30 días de hábitos con *Tyruss Full* y el acompañamiento de *ColShopi Tienda*. ¡Los cambios en mi vitalidad y constancia se sienten desde la primera semana! 🥑✨

Es un producto con registro INVIMA y viene con una App interactiva increíble. 

Escríbele a Marié para pedir el tuyo con envío gratis y pago contra entrega: 👇
${marieDirectLink}`
    }
  ];

  const currentMessage = templates[selectedTemplateIndex].message;

  const handleShareToWhatsApp = () => {
    const encodedText = encodeURIComponent(currentMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  return (
    <>
      {/* Permanent Floating Button (Mobile & Desktop) */}
      <div 
        id="colshopi-permanent-share-btn-container"
        className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-30 flex flex-col items-end gap-2 group pointer-events-auto"
      >
        {/* Helper tooltip tag on hover */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500/50 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>¡Comparte tu evolución por WhatsApp!</span>
        </div>

        <button
          id="btn-open-whatsapp-share-modal"
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label="Compartir evolución en WhatsApp"
          className="flex items-center gap-2.5 p-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-[0_4px_20px_rgba(4,120,87,0.4)] border-2 border-emerald-300/50 hover:border-emerald-200 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {/* Animated WhatsApp icon indicator */}
          <div className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-emerald-500" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-900 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-900 rounded-full" />
          </div>

          <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
            <span className="text-[10px] text-emerald-100 font-semibold tracking-wider uppercase flex items-center gap-1">
              <span>Viralizar</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm">
              Compartir mi Evolución
            </span>
          </div>

          <Share2 className="hidden sm:block w-4 h-4 text-emerald-100 shrink-0 ml-0.5" />
        </button>
      </div>

      {/* Share Modal Dialog */}
      {isOpen && (
        <div 
          id="whatsapp-share-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            id="whatsapp-share-modal-content"
            className="bg-gradient-to-b from-slate-900 via-[#0a141d] to-[#060c12] text-white rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-emerald-500/40 shadow-2xl relative overflow-hidden my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Background Glow Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              id="btn-close-share-modal"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer z-10"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="shrink-0">
                <MariePhoto size="sm" showBadge={false} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span>Comunidad & Tendencia ColShopi</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  ¡Inspira a tus Amigas & Contactos! 💚
                </h3>
                <p className="text-xs text-slate-300">
                  Comparte tu experiencia real y ayúdalas a transformar su energía.
                </p>
              </div>
            </div>

            {/* User Progress Preview Badge */}
            <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-emerald-500/20 mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
                  {currentDay}d
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    Protocolo de {userName}
                  </span>
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Día {currentDay} de 30 • {completedDaysCount} días completados</span>
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 font-bold text-[11px] shrink-0">
                ⭐ Testimonio Real
              </span>
            </div>

            {/* Template Selector Tabs */}
            <div className="space-y-1.5 mb-3">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Selecciona tu mensaje personalizado:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {templates.map((tpl, idx) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateIndex(idx);
                      setCopied(false);
                    }}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                      selectedTemplateIndex === idx
                        ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] text-emerald-400 font-black block">
                      {tpl.badge}
                    </span>
                    <span className="line-clamp-1 text-[11px]">
                      {tpl.title.replace(/^[^\s]+\s/, '')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Preview Box */}
            <div className="relative bg-[#080e14] rounded-2xl p-3.5 border border-slate-700/80 mb-4 font-mono text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap selection:bg-emerald-900">
              {currentMessage}
            </div>

            {/* Direct Link Info Banner */}
            <div className="bg-cyan-950/40 rounded-xl p-2.5 border border-cyan-500/30 mb-4 flex items-center gap-2.5 text-[11px] text-cyan-200">
              <div className="w-6 h-6 rounded-lg bg-cyan-900/80 flex items-center justify-center shrink-0 text-cyan-300 font-bold">
                🔗
              </div>
              <p className="flex-1">
                Tus contactos recibirán el enlace directo para asesorarse con <strong>Marié</strong> (<span className="text-cyan-300 font-bold">wa.link/6zpm18</span>) y adquirir su <strong>Tyruss Full</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              {/* WhatsApp Share Button */}
              <button
                id="btn-send-whatsapp-share"
                type="button"
                onClick={handleShareToWhatsApp}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Enviar por WhatsApp</span>
                <Send className="w-4 h-4" />
              </button>

              {/* Copy Text Button */}
              <button
                id="btn-copy-share-text"
                type="button"
                onClick={handleCopyText}
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-600 active:scale-98 transition-all cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Mensaje</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Footer */}
            <div className="mt-3 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>ColShopi Tienda By Leps Digital • Comunidad de Bienestar & Salud Femenina</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

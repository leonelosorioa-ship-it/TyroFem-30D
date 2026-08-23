import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Truck, 
  PhoneCall, 
  Pill, 
  Droplet, 
  Leaf, 
  ShoppingBag,
  ExternalLink,
  Award,
  ArrowLeft
} from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';

interface ColshopiBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder: () => void;
}

export const ColshopiBrandModal: React.FC<ColshopiBrandModalProps> = ({
  isOpen,
  onClose,
  onOpenOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto pt-3 sm:pt-6 pb-12 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#090e14] text-white rounded-2xl sm:rounded-3xl border border-cyan-500/40 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header - Fixed */}
        <div className="relative z-10 p-4 sm:p-6 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ColshopiLogo size="sm" showGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                  ColShopi Tienda
                </h2>
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                  By Leps Digital
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Cuidamos de ti • Tu bienestar es nuestra prioridad 💙
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Volver a la pantalla anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="relative z-10 p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm overscroll-contain">
          {/* Brand Mission Statement Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
              <Heart className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>NUESTRA PROMESA DE MARCA</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              "En <strong>ColShopi Tienda By Leps Digital</strong> ofrecemos una selección de productos de cosmética, alimentos saludables, suplementos y aseo, cuidadosamente diseñados para transformar tu bienestar y hacer de tu día a día una experiencia más saludable y equilibrada."
            </p>
          </div>

          {/* 4 Commercial Lines */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Líneas de Cuidado Integral ColShopi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0 border border-cyan-500/30">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">1. Suplementos Alimenticios</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fórmulas nutricionales con Registro INVIMA como Tyruss Full (Selenio, Espirulina, Chlorella).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0 border border-cyan-500/30">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">2. Cosmética Natural</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Loción Termoactiva moldeadora, hidratación profunda y cuidado botánico para tu piel.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0 border border-cyan-500/30">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">3. Alimentos Saludables</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Superalimentos, harinas integrales, semillas antioxidantes e infusiones digestivas.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0 border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">4. Productos de Aseo</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Higiene consciente y cuidado del hogar sin químicos agresivos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantees and Shipping Services */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantías y Seguridad en Cada Envío</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>Envíos Gratis a toda Colombia</strong> con Servientrega, Envía e Interrapidísimo.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Pago Contra Entrega:</strong> Pagas en efectivo solo cuando recibes el producto en tus manos.</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Acompañamiento en Hábitos & Bienestar:</strong> Asistencia con Marié durante tus 30 días de reto.</span>
              </li>
            </ul>
          </div>

          {/* Official Contact Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-xs text-slate-400">
            <div>
              <span className="text-white font-bold block">Canal Oficial de Atención:</span>
              <span>Línea Directa / WhatsApp: +57 310 400 7428</span>
            </div>
            <a
              href="https://wa.me/573104007428?text=Hola%20ColShopi,%20quiero%20más%20información%20sobre%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shrink-0"
            >
              Contactar Asesor
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 sm:p-5 border-t border-cyan-500/20 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            © 2026 ColShopi Tienda By Leps Digital • Todos los derechos reservados
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenOrder();
              }}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Promociones Tyruss Full</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

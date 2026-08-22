import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Smartphone, 
  Truck, 
  Gift, 
  CheckCircle2, 
  X, 
  MessageCircle, 
  ArrowRight,
  ShoppingBag,
  Award,
  Star,
  ArrowLeft
} from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';

interface ColshopiVipPerksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
  onOpenChatModal?: () => void;
  userAccessCode?: string;
  userName?: string;
}

export const ColshopiVipPerksModal: React.FC<ColshopiVipPerksModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderModal,
  onOpenChatModal,
  userAccessCode = '849201',
  userName = 'Compradora VIP'
}) => {
  if (!isOpen) return null;

  const vipAdvantages = [
    {
      icon: <Smartphone className="w-6 h-6 text-cyan-400" />,
      title: 'App Exclusiva 30 Días con Reactivación en Recompra',
      desc: 'Tu acceso a la App TyroFem 30D y bio-monitoreo está habilitado por 30 días calendario correspondientes a tu tarro de Tyruss Full. Al realizar tu recompra en ColShopi Tienda, tu acceso se reactiva automáticamente por 30 días adicionales para continuar tu evolución.',
      badge: 'Vigencia 30D'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: 'Acompañamiento Clínico Personalizado con Marié',
      desc: 'No estás sola en tu proceso. Cuentas con consulta directa, resolución de dudas de tomas, ajuste de dosis y evaluación de síntomas con Marié, nuestra nutricionista y directora de bienestar.',
      badge: 'Atención 1 a 1'
    },
    {
      icon: <Truck className="w-6 h-6 text-amber-400" />,
      title: 'Envíos Prioritarios & Pago Contra Entrega Nacional',
      desc: 'Pide tus tratamientos con total tranquilidad. Enviamos a cualquier ciudad o municipio de Colombia con pago en efectivo cuando recibes en la puerta de tu casa.',
      badge: '100% Seguro'
    },
    {
      icon: <Gift className="w-6 h-6 text-rose-400" />,
      title: 'Descuentos VIP en Recompra & Portafolio Completo',
      desc: 'Por haber adquirido Tyruss Full y validar tu código VIP, accedes a precios especiales y descuentos preferenciales permanentes para continuar tu mantenimiento y explorar todo nuestro portafolio de bienestar.',
      badge: 'Ahorro VIP'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
      title: 'Registro Sanitario INVIMA & Fórmulas Certificadas',
      desc: 'Nuestros productos cuentan con registro oficial INVIMA (RSA-0021928-2022), materias primas puras y la máxima concentración de nutrientes botánicos sin químicos perjudiciales.',
      badge: 'Calidad Médica'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0b1520] via-[#081018] to-[#04080c] rounded-3xl border border-cyan-500/40 shadow-2xl text-white overflow-hidden my-6">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close and Back Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer"
            title="Volver a la pantalla anterior"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Content */}
        <div className="relative z-10 p-6 sm:p-8 border-b border-cyan-500/20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <MariePhoto size="lg" showBadge={true} showNeonBg={true} />

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                  Comunidad VIP Oficial
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                  Código: #{userAccessCode}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury">
                Privilegios & Ventajas de ser Clienta VIP de ColShopi Tienda
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                ¡Hola, <strong className="text-emerald-300">{userName}</strong>! Queremos que sientas la diferencia de comprar en la <strong>única Tienda Online Naturista con App Exclusiva</strong> para cuidar tu salud y acompañar tu tratamiento.
              </p>
            </div>
          </div>
        </div>

        {/* Advantages List */}
        <div className="relative z-10 p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
          {vipAdvantages.map((adv, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-4"
            >
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 shrink-0">
                {adv.icon}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white font-serif-luxury">{adv.title}</h4>
                  <span className="text-[9px] font-black uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
                    {adv.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Testimonial / Community Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 text-xs text-slate-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-300 font-serif-luxury">Compromiso ColShopi Tienda By Leps Digital:</strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Nuestra misión no termina cuando recibes tu producto; ahí es donde verdaderamente empieza. Por eso diseñamos esta App para ti, para que día a día sientas cómo tu tiroides, digestión y energía renacen.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 p-6 sm:p-8 bg-[#060c12] border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onOpenChatModal) onOpenChatModal();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-all border border-cyan-500/40 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hablar con Marié por WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenOrderModal) onOpenOrderModal();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Solicitar Recompra con Descuento VIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

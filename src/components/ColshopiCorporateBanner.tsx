import React from 'react';
import { 
  Pill, 
  Sparkles, 
  Leaf, 
  Droplet, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { ColshopiLogo } from './ColshopiLogo';

interface ColshopiCorporateBannerProps {
  onOpenOrder?: () => void;
  compact?: boolean;
}

export const ColshopiCorporateBanner: React.FC<ColshopiCorporateBannerProps> = ({
  onOpenOrder,
  compact = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#090e14] text-white border border-cyan-500/30 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Content */}
      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Logo & Headline */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <ColshopiLogo size="lg" showGlow={true} className="shrink-0" />
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                <span>Identidad Corporativa • ColShopi Tienda</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif-luxury flex items-center justify-center sm:justify-start gap-2">
                <span>Cuidamos</span> 
                <span className="text-cyan-400 font-serif italic">de ti</span>
                <span className="text-cyan-400">♡</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Ofrecemos una selección de productos de <strong>cosmética</strong>, <strong>alimentos saludables</strong>, <strong>suplementos</strong> y <strong>aseo</strong>, cuidadosamente diseñados para transformar tu bienestar y hacer de tu día a día una experiencia más saludable y equilibrada.
              </p>
            </div>
          </div>

          {/* Right Brand Motto Badge */}
          <div className="shrink-0 text-center lg:text-right hidden sm:block">
            <div className="p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 backdrop-blur-xs space-y-1">
              <span className="text-[11px] text-cyan-300 block uppercase tracking-wider font-semibold">
                Compromiso ColShopi
              </span>
              <span className="text-sm font-bold text-white block italic font-serif">
                "Tu bienestar es nuestra prioridad" 💙
              </span>
              <span className="text-[10px] text-slate-400 block">
                Respaldado por By Leps Digital
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars / Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Suplementos Alimenticios */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors group">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Suplementos
            </h3>
            <span className="text-[10px] text-cyan-300 block font-medium">Alimenticios</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Tyruss Full, Vitaminas, Minerales y Adaptógenos
            </p>
          </div>

          {/* Cosmética Natural */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors group">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Droplet className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Cosmética
            </h3>
            <span className="text-[10px] text-cyan-300 block font-medium">Natural</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Loción Termoactiva, Cuidado Facial y Botánico
            </p>
          </div>

          {/* Alimentos Saludables */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors group">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Alimentos
            </h3>
            <span className="text-[10px] text-cyan-300 block font-medium">Saludables</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Superfoods, Harinas Funcionales e Infusiones
            </p>
          </div>

          {/* Productos de Aseo */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors group">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Productos
            </h3>
            <span className="text-[10px] text-cyan-300 block font-medium">De Aseo</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Higiene consciente y fórmulas biocompatibles
            </p>
          </div>
        </div>

        {/* Bottom Quality Promise Pill (Exactly from uploaded image) */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 border border-cyan-400/40 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-cyan-500/20">
            <div className="flex items-center gap-2.5 sm:px-2 pt-1 sm:pt-0">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Productos de calidad</span>
                <span className="text-[11px] text-cyan-300">para tu bienestar</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:px-4 pt-2 sm:pt-0">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Ingredientes naturales</span>
                <span className="text-[11px] text-cyan-300">y seguros</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:px-4 pt-2 sm:pt-0">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg text-cyan-400 shrink-0">
                <Heart className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Bienestar que se nota,</span>
                <span className="text-[11px] text-cyan-300">cuidado que permanece</span>
              </div>
            </div>
          </div>
        </div>

        {/* Historias de Éxito & Citas Inspiradoras (Reto 30D Completado) */}
        <div className="pt-2 border-t border-cyan-500/20 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-400/20 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-serif-luxury">
                  Historias de Éxito • Reto 30 Días
                </h3>
                <span className="text-[10px] text-cyan-300">
                  Citas y experiencias de clientas que completaron su guía y transformaron sus hábitos
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 w-fit">
              ✓ Compradoras Reales Tyruss Full
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Cita 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-2.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <div className="flex items-center gap-0.5">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    Día 30 Completado
                  </span>
                </div>
                <blockquote className="text-xs text-slate-200 italic font-serif leading-relaxed">
                  “Por fin sentí que mi cuerpo despertó. En el día 12 la pesadez y la fatiga desaparecieron. Cumplí mis 30 días y mi digestión está como hace 10 años.”
                </blockquote>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 ring-1 ring-emerald-400">
                  MR
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white block">Martha Cecilia Restrepo</span>
                  <span className="text-[10px] text-slate-400">52 años • Medellín</span>
                </div>
              </div>
            </div>

            {/* Cita 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-2.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <div className="flex items-center gap-0.5">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                    Día 30 Completado
                  </span>
                </div>
                <blockquote className="text-xs text-slate-200 italic font-serif leading-relaxed">
                  “Dormir 7 horas seguidas sin despertarme con bochornos ni sofocos fue el mayor regalo. Los hábitos diarios y Tyruss me cambiaron la vida.”
                </blockquote>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="w-7 h-7 rounded-full bg-rose-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 ring-1 ring-rose-400">
                  CG
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white block">Claudia Patricia Gómez</span>
                  <span className="text-[10px] text-slate-400">49 años • Bogotá D.C.</span>
                </div>
              </div>
            </div>

            {/* Cita 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-2.5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-amber-300 text-xs">
                  <div className="flex items-center gap-0.5">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold text-teal-300 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/30">
                    Día 30 Completado
                  </span>
                </div>
                <blockquote className="text-xs text-slate-200 italic font-serif leading-relaxed">
                  “Cerrar el botón del pantalón en las tardes sin hinchazón ni dolor abdominal fue mi gran victoria. El recetario y Marié hacen todo muy sencillo.”
                </blockquote>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0 ring-1 ring-teal-400">
                  YC
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-white block">Yolanda Mercedes Cuéllar</span>
                  <span className="text-[10px] text-slate-400">44 años • Cali</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive CTA */}
        {onOpenOrder && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-cyan-500/20">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              📦 Despachos a toda Colombia con <strong>Pago Contra Entrega</strong> y Garantía ColShopi Tienda.
            </div>
            <button
              onClick={onOpenOrder}
              className="py-2.5 px-5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Promociones Tyruss Full en Tienda</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

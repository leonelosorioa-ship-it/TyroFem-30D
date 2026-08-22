import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Gift, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  Flame, 
  Phone, 
  AlertCircle,
  HelpCircle,
  Leaf
} from 'lucide-react';
import { OFFICIAL_PACKAGES, FREE_GIFT_INFO, BATIDO_VERDE_INFO, COLSHOPI_INFO } from '../data/nutritionData';
import { OrderFormState, ProductPackage, UserProfile } from '../types';

interface OrderModalProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  isReorder?: boolean;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  userProfile,
  isOpen,
  onClose,
  isReorder
}) => {
  if (!isOpen) return null;

  const [selectedPackId, setSelectedPackId] = useState<string>('pack-2'); // default 2 tarros
  const [addBatidoVerde, setAddBatidoVerde] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>(userProfile.name !== 'Amiga' ? userProfile.name : '');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isRural, setIsRural] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  const selectedPack = OFFICIAL_PACKAGES.find(p => p.id === selectedPackId) || OFFICIAL_PACKAGES[1];
  const totalPrice = selectedPack.price + (addBatidoVerde ? BATIDO_VERDE_INFO.promoPrice : 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleGenerateWhatsAppOrder = () => {
    const batidoText = addBatidoVerde ? `\n🌱 + Batido Verde Detox Previo ($15.000)` : '';
    const addressText = isRural 
      ? `Reclamar en Oficina Interrapidísimo de ${city}` 
      : `${address}`;

    const text = `¡Hola Marié! 💚 Vengo desde la App TyroFem 30D y quiero confirmar mi pedido de Tyruss Full:

☑️ Nombre Completo: ${fullName || userProfile.name}
☑️ Celular: ${phone || 'Por confirmar'}
☑️ Ciudad / Municipio: ${city || 'Colombia'}
☑️ Departamento: ${department || ''}
☑️ Dirección / Barrio: ${addressText}
☑️ Producto: ${selectedPack.title} + Loción Termoactiva GRATIS 🎁${batidoText}
☑️ Total a Pagar: ${formatCurrency(totalPrice)} (Pago Contra Entrega con Envío Gratis)

¿Todo está correcto para proceder con el despacho? ✨`;

    const url = `https://wa.me/573104007428?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
              ColShopi Tienda By Leps Digital
            </span>
            <span className="text-xs text-emerald-200">
              Despacho Nacional con Pago Contra Entrega 🚚
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury mt-1">
            {isReorder ? 'Recompra Exclusiva Tyruss Full (Día 22+)' : 'Pedir Tyruss Full & Tu Obsequio Exclusivo 🌿'}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Garantiza tu tratamiento con Registro INVIMA RSA-0021928-2022, Loción Termoactiva GRATIS y Envío Sin Costo.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* DAY 22 SPECIAL BANNER IF APPLICABLE */}
          {isReorder && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block text-sm">
                  ¡Beneficio Especial de Alumna para {userProfile.name}!
                </strong>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Por estar en la recta final de tu primer tarro, tienes prioridad en despacho y mantienes tu Loción Termoactiva de regalo para seguir desinflamando tu cuerpo.
                </p>
              </div>
            </div>
          )}

          {/* Package Selection Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Selecciona Tu Paquete Oficial
              </h3>
              <span className="text-xs font-semibold text-emerald-700">
                Envío GRATIS en todos los paquetes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICIAL_PACKAGES.map((pack) => {
                const isSelected = selectedPackId === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'
                    }`}
                  >
                    {pack.tag && (
                      <span className={`absolute -top-2.5 right-4 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs ${
                        pack.isPopular 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'bg-emerald-700 text-white'
                      }`}>
                        {pack.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{pack.title}</h4>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-lg font-extrabold text-emerald-900">
                          {formatCurrency(pack.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(pack.regularPrice)}
                        </span>
                      </div>

                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        {pack.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        {pack.freeGift}
                      </span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FREE GIFT SPOTLIGHT */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <h4 className="font-bold text-sm text-emerald-200">
                Tu Obsequio Incluido: Loción Termoactiva Herbal 🌿🔥
              </h4>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Formulada con <strong>Árnica, Hamamelis, Castaño de Indias, Uña de Gato y Chuchuguaza</strong>. Aplícala en piernas cansadas, cuello y espalda para una sensación de alivio y frescura inmediata.
            </p>
          </div>

          {/* UPSELL: BATIDO VERDE DETOX */}
          <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Recomendación Clave de Marié
                </span>
                <span className="text-xs font-bold text-rose-600 line-through">
                  $25.000
                </span>
                <span className="text-xs font-extrabold text-emerald-800">
                  +$15.000 HOY
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                ¿Deseas agregar el Batido Verde Detox Pre-Tratamiento?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                Sobre concentrado de 20g con espirulina, jengibre, cúrcuma y apio. Realiza una limpieza digestiva la noche previa para que tu cuerpo absorba el Tyruss Full al 100%.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAddBatidoVerde(!addBatidoVerde)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                addBatidoVerde
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-400'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${addBatidoVerde ? 'text-white' : 'text-slate-300'}`} />
              <span>{addBatidoVerde ? '✓ Agregado al Pedido' : '+ Agregar por $15.000'}</span>
            </button>
          </div>

          {/* ORDER FORM FIELDS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Datos de Envío (Pago Contra Entrega)
              </h3>
              <span className="text-xs text-slate-500">
                Pagas en efectivo al recibir en tu puerta
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre y Apellidos"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Número de Celular / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 310 123 4567"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Ciudad o Municipio
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Medellín, Bogotá, Cali..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Departamento
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ej: Antioquia, Cundinamarca, Valle..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Dirección Completa y Barrio
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isRural}
                  placeholder={isRural ? 'Se despachará a la oficina principal de Interrapidísimo' : 'Ej: Calle 45 # 12-34, Apto 302, Barrio El Poblado'}
                  className={`w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                    isRural ? 'bg-slate-100 text-slate-500' : ''
                  }`}
                />
              </div>
            </div>

            {/* Rural / Vereda checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="ruralCheck"
                checked={isRural}
                onChange={(e) => setIsRural(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
              <label htmlFor="ruralCheck" className="text-xs text-slate-600 cursor-pointer">
                Vivo en zona rural o vereda (Reclamar en oficina de Interrapidísimo)
              </label>
            </div>
          </div>

          {/* TOTAL & CONFIRMATION BOX */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>{selectedPack.title}:</span>
              <span className="font-bold text-slate-800">{formatCurrency(selectedPack.price)}</span>
            </div>
            {addBatidoVerde && (
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Batido Verde Detox:</span>
                <span className="font-bold text-emerald-700">+{formatCurrency(BATIDO_VERDE_INFO.promoPrice)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Obsequio Loción Termoactiva:</span>
              <span className="font-bold text-amber-600">GRATIS $0</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Envío Nacional Contra Entrega:</span>
              <span className="font-bold text-emerald-700">GRATIS $0</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-sm text-slate-900">Total a Pagar al Recibir:</span>
              <span className="text-xl font-black text-emerald-800">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Entrega de 2 a 5 días hábiles en toda Colombia</span>
          </div>

          <button
            type="button"
            onClick={handleGenerateWhatsAppOrder}
            className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-800/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirmar Pedido por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

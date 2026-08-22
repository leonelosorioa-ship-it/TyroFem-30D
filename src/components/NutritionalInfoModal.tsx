import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  FileText, 
  Heart, 
  CheckCircle2,
  Award
} from 'lucide-react';
import { NUTRITIONAL_FACTS, SUPERFOOD_INGREDIENTS, FREE_GIFT_INFO } from '../data/nutritionData';

interface NutritionalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder: () => void;
}

export const NutritionalInfoModal: React.FC<NutritionalInfoModalProps> = ({
  isOpen,
  onClose,
  onOpenOrder
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'tabla' | 'ingredientes' | 'invima' | 'obsequio'>('tabla');

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
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Ficha Técnica & Respaldo Científico
            </span>
            <span className="text-xs text-emerald-200">
              Laboratorio Unmerco / ColShopi
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury mt-1">
            Información Nutricional & Calidad Tyruss Full
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1">
            Registro INVIMA: <strong>{NUTRITIONAL_FACTS.invimaRecord}</strong> • 100% Libre de Soya y Sin Maltodextrina
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'tabla', label: 'Tabla Nutricional Oficial', icon: '📊' },
            { id: 'ingredientes', label: 'Superalimentos Clave', icon: '🌿' },
            { id: 'invima', label: 'Respaldo INVIMA & Seguridad', icon: '🛡️' },
            { id: 'obsequio', label: 'Loción Termoactiva (Regalo)', icon: '🎁' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === t.id
                  ? 'border-emerald-700 text-emerald-900 bg-white'
                  : 'border-transparent text-slate-500 hover:text-emerald-700'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: TABLA NUTRICIONAL */}
          {activeTab === 'tabla' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Tamaño de Porción</span>
                  <strong className="text-emerald-900">{NUTRITIONAL_FACTS.servingSize}</strong>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Porciones por Envase</span>
                  <strong className="text-emerald-900">{NUTRITIONAL_FACTS.servingsPerContainer}</strong>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Contenido Neto</span>
                  <strong className="text-emerald-900">{NUTRITIONAL_FACTS.netWeight} (Sabor Manzana-Piña)</strong>
                </div>
              </div>

              {/* Qualities Badges */}
              <div className="flex flex-wrap gap-1.5">
                {NUTRITIONAL_FACTS.qualities.map((q, idx) => (
                  <span key={idx} className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                    ✓ {q}
                  </span>
                ))}
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Nutriente / Componente</th>
                      <th className="py-2.5 px-4 text-center">Por 100 g</th>
                      <th className="py-2.5 px-4 text-right">Por Porción (30g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {NUTRITIONAL_FACTS.tableRows.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-2 px-4 font-medium">{row.nutrient}</td>
                        <td className="py-2 px-4 text-center text-slate-500">{row.per100g}</td>
                        <td className="py-2 px-4 text-right font-bold text-slate-900">{row.perServing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INGREDIENTES & SUPERALIMENTOS */}
          {activeTab === 'ingredientes' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Tyruss Full combina una matriz botánica de alta densidad nutricional para nutrir la tiroides, equilibrar estrógenos y desinflamar el intestino:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUPERFOOD_INGREDIENTS.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 block">
                      {item.role}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESPALDO INVIMA */}
          {activeTab === 'invima' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto text-2xl shadow-md">
                  🛡️
                </div>
                <h3 className="text-base font-bold text-emerald-950">
                  Registro Sanitario INVIMA Oficial
                </h3>
                <div className="inline-block px-4 py-2 bg-white rounded-2xl border-2 border-emerald-600 text-emerald-950 font-black text-lg tracking-wider">
                  RSA-0021928-2022
                </div>
                <p className="text-xs text-emerald-900/90 max-w-md mx-auto leading-relaxed">
                  Producto clasificado como alimento funcional en polvo, formulado por laboratorio certificado bajo estrictos estándares de buenas prácticas de manufactura (BPM) en Colombia.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <strong className="text-slate-800 block text-xs font-bold uppercase">
                  Condiciones de Conservación y Almacenamiento:
                </strong>
                <ul className="space-y-1 list-disc list-inside text-[11px]">
                  <li>Mantener en lugar fresco, seco y protegido de la luz solar directa.</li>
                  <li>Cerrar bien la tapa plástica tras cada uso para evitar humedad.</li>
                  <li>Consumir dentro de los 24 meses de vida útil.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: LOCIÓN TERMOACTIVA (OBSEQUIO) */}
          {activeTab === 'obsequio' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-3xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                  <span className="text-2xl">🎁</span>
                  <h3>{FREE_GIFT_INFO.name}</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {FREE_GIFT_INFO.description}
                </p>

                <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <strong className="text-xs font-bold text-amber-950 block uppercase tracking-wider">
                    Extractos Botánicos de la Fórmula:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {FREE_GIFT_INFO.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-slate-600 bg-amber-100/60 p-3 rounded-xl">
                  <strong>Modo de Uso Tópico:</strong> {FREE_GIFT_INFO.usage}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Distribución exclusiva ColShopi Tienda
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenOrder();
            }}
            className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ml-auto"
          >
            Pedir con Obsequio Loción 🎁
          </button>
        </div>
      </div>
    </div>
  );
};

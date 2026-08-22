import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Check, 
  Copy, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';
import { MASTER_AUTHORIZED_CODES, getRedeemedCodesRegistry } from '../data/authorizedCodes';
import { ColshopiLogo } from './ColshopiLogo';

interface AdminCodePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCodePoolModal: React.FC<AdminCodePoolModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'used'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const registry = getRedeemedCodesRegistry();
  const usedCodesList = Object.keys(registry);
  const usedCount = usedCodesList.length;
  const totalCount = MASTER_AUTHORIZED_CODES.length;
  const availableCount = totalCount - usedCount;

  const filteredCodes = MASTER_AUTHORIZED_CODES.filter(code => {
    const isUsed = Boolean(registry[code]);
    const matchesSearch = code.includes(searchTerm) || 
      (registry[code]?.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registry[code]?.userPhone || '').includes(searchTerm);

    if (!matchesSearch) return false;
    if (filter === 'available') return !isUsed;
    if (filter === 'used') return isUsed;
    return true;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyWhatsAppText = (code: string) => {
    const text = `¡Hola! 💚 Te saluda la Nutricionista Marié de ColShopi Tienda. Aquí tienes tu Código de Activación Único de 6 dígitos para ingresar gratis a tu App TyroFem 30D:\n\n🔑 CÓDIGO VIP: ${code}\n\nIngrésalo en la pantalla de bienvenida junto con tus datos para activar tu protocolo y recibir al final de tus 30 días tu Informe Clínico. ¡Bienvenida! 🌿`;
    navigator.clipboard.writeText(text);
    setCopiedCode(`wa_${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp flex flex-col max-h-[90vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#070b10] via-slate-900 to-[#070b10] text-white p-5 border-b border-cyan-500/25 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ColshopiLogo size="sm" showGlow={true} />
              <div>
                <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider bg-cyan-950 px-2 py-0.5 rounded border border-cyan-400/40">
                  Panel de Control ColShopi Tienda
                </span>
                <h3 className="text-base font-bold text-white font-serif-luxury mt-0.5">
                  Base de Datos Oficial • 50 Códigos de Acceso VIP
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats and Filter Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Total Códigos</span>
              <strong className="text-slate-900 text-base font-black">{totalCount}</strong>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 shadow-xs">
              <span className="text-[10px] text-emerald-700 block font-bold uppercase">Disponibles</span>
              <strong className="text-emerald-800 text-base font-black">{availableCount}</strong>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950 shadow-xs">
              <span className="text-[10px] text-amber-700 block font-bold uppercase">Canjeados</span>
              <strong className="text-amber-800 text-base font-black">{usedCount}</strong>
            </div>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar código (ej: 849201) o compradora..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold shrink-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Todos ({totalCount})
              </button>
              <button
                onClick={() => setFilter('available')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'available' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Disponibles ({availableCount})
              </button>
              <button
                onClick={() => setFilter('used')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filter === 'used' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                }`}
              >
                Activados ({usedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Codes List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2.5">
          {filteredCodes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No se encontraron códigos con el filtro actual.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCodes.map((code, index) => {
                const info = registry[code];
                const isUsed = Boolean(info);

                return (
                  <div
                    key={code}
                    className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                      isUsed 
                        ? 'bg-amber-50/50 border-amber-200' 
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 w-5">
                          #{index + 1}
                        </span>
                        <span className="font-mono text-base font-black tracking-widest text-slate-900">
                          {code}
                        </span>
                      </div>

                      {isUsed ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-amber-700" />
                          <span>Activado</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Disponible</span>
                        </span>
                      )}
                    </div>

                    {isUsed && info && (
                      <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-amber-200/70 space-y-0.5">
                        <div className="font-bold text-slate-900 truncate">
                          👤 {info.userName}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between">
                          <span>📲 {info.userPhone}</span>
                          <span>{new Date(info.redeemedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handleCopyCode(code)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Copiar solo el código de 6 dígitos"
                      >
                        {copiedCode === code ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copiar Código</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopyWhatsAppText(code)}
                        className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Copiar mensaje listo para enviar a la clienta por WhatsApp"
                      >
                        {copiedCode === `wa_${code}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">¡Mensaje Copiado!</span>
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            <span>Copiar Mensaje WA</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 text-white text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-slate-300 text-[11px]">
            ⚡ Cada código es de <strong>uso único estricto</strong>. Una vez activado por una compradora, queda bloqueado para otros registros.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors cursor-pointer text-xs shrink-0"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};

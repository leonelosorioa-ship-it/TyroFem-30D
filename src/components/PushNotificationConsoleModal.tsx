import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  Clock, 
  Calendar, 
  Sparkles, 
  Tag, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Trash2, 
  Layers, 
  Flame, 
  Gift, 
  Salad, 
  Star, 
  ExternalLink,
  Smartphone,
  Info,
  Radio
} from 'lucide-react';
import { MasterUserData } from '../data/usersDatabase';
import { 
  PushAudienceType, 
  PushMessageType, 
  PushSendMode, 
  PushNotificationRecord, 
  PushNotificationPayload, 
  fetchPushNotificationsHistory, 
  sendPushNotificationFromAdmin, 
  deletePushNotificationFromHistory 
} from '../utils/pushNotificationService';
import { ColshopiLogo } from './ColshopiLogo';

interface PushNotificationConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: MasterUserData[];
  preSelectedUser?: MasterUserData | null;
  onPushSent?: () => void;
}

const TEMPLATES: Array<{
  label: string;
  type: PushMessageType;
  title: string;
  message: string;
  url: string;
  icon: string;
}> = [
  {
    label: '🌿 Recordatorio de Toma Tyruss Full',
    type: 'recordatorio',
    title: '¡Hora de tu Tyruss Full! 🌿',
    message: 'Toma tu dosis diaria de Tyruss Full con agua tibia o infusión para potenciar tu metabolismo y tiroides.',
    url: '#calendario',
    icon: '/circulo-marie.png'
  },
  {
    label: '🥑 Tip Digestivo de Marié',
    type: 'tip_nutricional',
    title: '¡Marié tiene un consejo para tu digestión! 🥑',
    message: 'Hoy tu cuerpo necesita hidratación extra con tu Tyruss Full. Toca aquí para ver tu receta del día.',
    url: '#recetas',
    icon: '/circulo-marie.png'
  },
  {
    label: '🎁 Oferta Recompra VIP ColShopi',
    type: 'oferta_vip',
    title: '🎁 Beneficio VIP Exclusivo en ColShopi',
    message: 'Tu siguiente frasco de Tyruss Full tiene 20% OFF + Envío Gratis por ser parte del Reto 30D.',
    url: 'https://wa.me/573197036711?text=Hola%20ColShopi,%20quiero%20aprovechar%20mi%20descuento%20VIP%20de%20recompra%20Tyruss%20Full',
    icon: '/colshopi-logo.png'
  },
  {
    label: '⭐ Testimonio Inspirador',
    type: 'testimonio',
    title: '⭐ ¡Sandra redujo su fatiga en 7 días!',
    message: 'La constancia diaria transforma tu energía. Toca aquí para registrar tu día de hoy con Marié.',
    url: '#calendario',
    icon: '/circulo-marie.png'
  }
];

export const PushNotificationConsoleModal: React.FC<PushNotificationConsoleModalProps> = ({
  isOpen,
  onClose,
  users,
  preSelectedUser,
  onPushSent
}) => {
  // Navigation tabs within Push Console
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Form states
  const [audienceType, setAudienceType] = useState<PushAudienceType>(() => {
    return preSelectedUser ? 'individual' : 'all';
  });
  const [targetUserId, setTargetUserId] = useState<string>(() => preSelectedUser?.id || '');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [targetStage, setTargetStage] = useState<string>('fase_1');

  const [title, setTitle] = useState('¡Marié tiene un consejo para tu digestión! 🌿');
  const [message, setMessage] = useState('Hoy tu cuerpo necesita hidratación extra con tu Tyruss Full. Toca aquí para ver tu receta del día.');
  const [messageType, setMessageType] = useState<PushMessageType>('recordatorio');
  const [destinationUrl, setDestinationUrl] = useState<string>('#calendario');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [iconChoice, setIconChoice] = useState<string>('/circulo-marie.png');

  const [sendMode, setSendMode] = useState<PushSendMode>('instant');
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 3600 * 1000 * 2);
    return d.toISOString().slice(0, 16);
  });

  // History state
  const [historyList, setHistoryList] = useState<PushNotificationRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Submission feedback
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync when preSelectedUser changes
  useEffect(() => {
    if (preSelectedUser) {
      setAudienceType('individual');
      setTargetUserId(preSelectedUser.id);
      setActiveTab('compose');
    }
  }, [preSelectedUser]);

  // Load history on open or tab change
  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const list = await fetchPushNotificationsHistory();
      setHistoryList(list);
    } catch (e) {
      console.warn('History load error', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  // Calculate dynamic recipients preview count
  const calculatedRecipients = useMemo(() => {
    const activeUsers = users.filter(u => u.status === 'active' || u.status === 'activa');

    if (audienceType === 'all') {
      return { count: activeUsers.length, label: `Todas las Usuarias Activas (${activeUsers.length})` };
    }

    if (audienceType === 'individual') {
      const selected = users.find(u => u.id === targetUserId);
      const name = selected ? (selected.fullName || selected.name) : 'Usuaria no seleccionada';
      return { count: selected ? 1 : 0, label: `Individual: ${name}` };
    }

    if (audienceType === 'stage') {
      const filtered = users.filter(u => {
        const day = Number(u.currentDay || 1);
        if (targetStage === 'fase_1') return day >= 1 && day <= 7;
        if (targetStage === 'fase_2') return day >= 8 && day <= 14;
        if (targetStage === 'fase_3') return day >= 15 && day <= 20;
        if (targetStage === 'fase_4') return day >= 21 && day <= 30;
        return true;
      });
      const stageLabels: Record<string, string> = {
        fase_1: 'Fase 1 (Días 1 a 7 - Desinflamación)',
        fase_2: 'Fase 2 (Días 8 a 14 - Activación)',
        fase_3: 'Fase 3 (Días 15 a 20 - Balance Hormonal)',
        fase_4: 'Fase 4 (Días 21 a 30 - Consolidación)'
      };
      return { count: filtered.length, label: `${stageLabels[targetStage] || 'Etapa seleccionada'} (${filtered.length} usuarias)` };
    }

    if (audienceType === 'low_adherence') {
      const twoDaysAgo = Date.now() - 48 * 3600 * 1000;
      const low = users.filter(u => {
        const adherence = Number(u.adherencePercentage ?? u.adherencePercent ?? 0);
        const lastAct = u.lastActivityTimestamp || (u.lastActivityAt ? new Date(u.lastActivityAt).getTime() : 0);
        return adherence < 50 || (lastAct > 0 && lastAct < twoDaysAgo);
      });
      return { count: low.length, label: `Baja Adherencia o >48h inactivas (${low.length} usuarias)` };
    }

    return { count: users.length, label: 'Todas las usuarias' };
  }, [users, audienceType, targetUserId, targetStage]);

  // Filtered users for individual picker
  const selectableUsers = useMemo(() => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u => {
      const name = (u.fullName || u.name || '').toLowerCase();
      const code = (u.vipCode || u.accessCode || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      return name.includes(q) || code.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [users, userSearchQuery]);

  // Apply quick template
  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setTitle(t.title);
    setMessage(t.message);
    setMessageType(t.type);
    setDestinationUrl(t.url);
    setIconChoice(t.icon);
    setFeedback({
      type: 'success',
      text: `Plantilla "${t.label}" cargada en el editor.`
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Submit Handler
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: 'Por favor completa el Título y el Mensaje de la notificación.' });
      return;
    }

    if (audienceType === 'individual' && !targetUserId) {
      setFeedback({ type: 'error', text: 'Por favor selecciona la usuaria específica que recibirá la notificación.' });
      return;
    }

    const finalUrl = destinationUrl === 'custom' ? customUrl : destinationUrl;

    const payload: PushNotificationPayload = {
      title: title.trim().slice(0, 50),
      message: message.trim().slice(0, 140),
      type: messageType,
      url: finalUrl || '#calendario',
      icon: iconChoice,
      badge: '/colshopi-logo.png',
      audienceType,
      targetUserId: audienceType === 'individual' ? targetUserId : undefined,
      targetUserName: audienceType === 'individual' ? (users.find(u => u.id === targetUserId)?.fullName) : undefined,
      targetStage: audienceType === 'stage' ? targetStage : undefined,
      sendMode,
      scheduledAt: sendMode === 'scheduled' ? scheduledDateTime : undefined
    };

    setIsSending(true);
    setFeedback(null);

    try {
      const res = await sendPushNotificationFromAdmin(payload);
      if (res.success) {
        setFeedback({
          type: 'success',
          text: sendMode === 'instant'
            ? `¡Notificación Push enviada con éxito a ${res.recipientCount || calculatedRecipients.count} usuaria(s)! 🚀`
            : `¡Notificación programada con éxito para ${scheduledDateTime}! ⏰`
        });
        loadHistory();
        if (onPushSent) onPushSent();
        // Switch to history tab after 2s
        setTimeout(() => {
          setActiveTab('history');
        }, 1500);
      } else {
        setFeedback({ type: 'error', text: res.error || 'Error al enviar la notificación push.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Error de conexión con el servidor.' });
    } finally {
      setIsSending(false);
    }
  };

  // Delete notification record from history
  const handleDeleteHistory = async (id: string) => {
    if (!window.confirm('¿Deseas eliminar este registro del historial de notificaciones?')) return;
    const ok = await deletePushNotificationFromHistory(id);
    if (ok) {
      setHistoryList(prev => prev.filter(item => item.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden text-white my-6 flex flex-col max-h-[92vh]">
        
        {/* ========================================================================= */}
        {/* HEADER */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 rounded-full">
                  PWA Web Push Console
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  ● Sistema Activo
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>Emisión de Notificaciones Push</span>
                <span className="text-xs font-medium text-slate-400">TyroFem 30D</span>
              </h2>
            </div>
          </div>

          {/* Tab buttons + Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('compose')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'compose'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ✏️ Redactar & Enviar
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('history'); loadHistory(); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                📜 Historial ({historyList.length})
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer border border-slate-800"
              title="Cerrar consola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback alert message */}
        {feedback && (
          <div className={`p-3 sm:px-6 text-xs font-bold flex items-center justify-between border-b shrink-0 animate-fadeIn ${
            feedback.type === 'success' 
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40' 
              : 'bg-rose-950 text-rose-200 border-rose-500/40'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-xs text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: COMPOSE & SEND */}
        {/* ========================================================================= */}
        {activeTab === 'compose' ? (
          <form onSubmit={handleSendNotification} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* Quick Templates Row */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Plantillas Rápidas Pre-configuradas</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="text-left p-2.5 bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 block truncate">
                      {tpl.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {tpl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT COLUMN: Audience & Content Form (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. SELECCIÓN DE AUDIENCIA / SEGMENTACIÓN */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-extrabold text-white">1. Audiencia / Destinatarias</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-full">
                      {calculatedRecipients.label}
                    </span>
                  </div>

                  {/* Radio Group: 4 Segmentation Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    {/* Option 1: All Active Users */}
                    <label 
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        audienceType === 'all'
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value="all"
                        checked={audienceType === 'all'}
                        onChange={() => setAudienceType('all')}
                        className="mt-1 text-cyan-500 focus:ring-cyan-400"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-white block">📢 Todas las Usuarias</span>
                        <span className="text-[10px] text-slate-400">Envío masivo a toda la base registrada activa.</span>
                      </div>
                    </label>

                    {/* Option 2: Specific Individual User */}
                    <label 
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        audienceType === 'individual'
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value="individual"
                        checked={audienceType === 'individual'}
                        onChange={() => setAudienceType('individual')}
                        className="mt-1 text-cyan-500 focus:ring-cyan-400"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-white block">🎯 Usuaria Individual</span>
                        <span className="text-[10px] text-slate-400">Mensaje directo a una compradora VIP específica.</span>
                      </div>
                    </label>

                    {/* Option 3: By Challenge Stage */}
                    <label 
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        audienceType === 'stage'
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value="stage"
                        checked={audienceType === 'stage'}
                        onChange={() => setAudienceType('stage')}
                        className="mt-1 text-cyan-500 focus:ring-cyan-400"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-white block">📊 Por Etapa del Reto</span>
                        <span className="text-[10px] text-slate-400">Segmentado por fase (Días 1-7, 8-14, etc.)</span>
                      </div>
                    </label>

                    {/* Option 4: Low Adherence Users */}
                    <label 
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        audienceType === 'low_adherence'
                          ? 'bg-amber-950/80 border-amber-400 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value="low_adherence"
                        checked={audienceType === 'low_adherence'}
                        onChange={() => setAudienceType('low_adherence')}
                        className="mt-1 text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-amber-300 block">⚠️ Baja Adherencia</span>
                        <span className="text-[10px] text-slate-400">&gt;48h sin registro o &lt;50% de avance.</span>
                      </div>
                    </label>

                  </div>

                  {/* Dynamic Sub-selector for Individual User */}
                  {audienceType === 'individual' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2.5 animate-fadeIn">
                      <label className="text-xs font-bold text-slate-300 block">
                        Buscar y Seleccionar Usuaria Destinataria:
                      </label>
                      <input
                        type="text"
                        placeholder="Buscar por Nombre, WhatsApp o Código VIP..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                      />
                      <div className="max-h-36 overflow-y-auto divide-y divide-slate-800/80 rounded-lg border border-slate-800 bg-slate-900/50">
                        {selectableUsers.map((u) => {
                          const isSelected = targetUserId === u.id;
                          return (
                            <div
                              key={u.id}
                              onClick={() => setTargetUserId(u.id)}
                              className={`p-2 px-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected ? 'bg-cyan-950 text-cyan-200 font-bold' : 'hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="block font-semibold">{u.fullName || u.name}</span>
                                <span className="text-[10px] text-slate-400 block">
                                  VIP #{u.vipCode || u.accessCode} • WA: {u.phone} • Día {u.currentDay || 1}/30
                                </span>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Sub-selector for Stage */}
                  {audienceType === 'stage' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2 animate-fadeIn">
                      <label className="text-xs font-bold text-slate-300 block">
                        Selecciona la Fase del Reto a impactar:
                      </label>
                      <select
                        value={targetStage}
                        onChange={(e) => setTargetStage(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-cyan-400"
                      >
                        <option value="fase_1">Fase 1: Desinflamación Inicial (Días 1 a 7)</option>
                        <option value="fase_2">Fase 2: Activación Metabólica (Días 8 a 14)</option>
                        <option value="fase_3">Fase 3: Regulación y Balance Hormonal (Días 15 a 20)</option>
                        <option value="fase_4">Fase 4: Consolidación y Hábitos Duraderos (Días 21 a 30)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 2. FORMULARIO DE REDACCIÓN */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-extrabold text-white">2. Redacción del Mensaje</h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Formato Web Push Notification
                    </span>
                  </div>

                  {/* Categoría / Badge selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Tipo / Categoría de Mensaje:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'recordatorio', label: '🌿 Recordatorio Diario', color: 'emerald' },
                        { id: 'oferta_vip', label: '🎁 Oferta VIP', color: 'amber' },
                        { id: 'tip_nutricional', label: '🥗 Tip Nutricional', color: 'cyan' },
                        { id: 'testimonio', label: '⭐ Testimonio', color: 'purple' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMessageType(item.id as PushMessageType)}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            messageType === item.id
                              ? 'bg-slate-800 border-cyan-400 text-white shadow-xs'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-200">
                        Título de la Notificación: <span className="text-rose-400">*</span>
                      </label>
                      <span className={`font-mono text-[11px] ${title.length > 45 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {title.length}/50 caracteres
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={50}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: ¡Marié tiene un consejo para tu digestión! 🌿"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-cyan-400 font-medium"
                      required
                    />
                  </div>

                  {/* Notification Body / Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-200">
                        Mensaje / Cuerpo: <span className="text-rose-400">*</span>
                      </label>
                      <span className={`font-mono text-[11px] ${message.length > 130 ? 'text-amber-400' : 'text-slate-400'}`}>
                        {message.length}/140 caracteres
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={140}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ej: Hoy tu cuerpo necesita hidratación extra con tu Tyruss Full. Toca aquí para ver tu receta del día."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:border-cyan-400 font-medium resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* URL / Action Destination */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ruta o URL al hacer clic:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDestinationUrl('#calendario')}
                        className={`p-2 text-xs rounded-xl border font-semibold text-center cursor-pointer transition-colors ${
                          destinationUrl === '#calendario'
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        📅 Calendario / Día Activo
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestinationUrl('#recetas')}
                        className={`p-2 text-xs rounded-xl border font-semibold text-center cursor-pointer transition-colors ${
                          destinationUrl === '#recetas'
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        🥗 Recetario Completo
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestinationUrl('#chat')}
                        className={`p-2 text-xs rounded-xl border font-semibold text-center cursor-pointer transition-colors ${
                          destinationUrl === '#chat'
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        💬 Chat con Marié IA
                      </button>
                    </div>

                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="O ingresa un enlace externo (Ej: WhatsApp Recompra ColShopi https://wa.me/...)"
                        value={destinationUrl.startsWith('http') || destinationUrl === 'custom' ? destinationUrl : ''}
                        onChange={(e) => setDestinationUrl(e.target.value || '#calendario')}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-hidden focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* Icon & Avatar Choice */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ícono de la Notificación:</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <label 
                        className={`flex items-center gap-2.5 p-2 px-3 rounded-xl border cursor-pointer transition-colors ${
                          iconChoice === '/circulo-marie.png'
                            ? 'bg-cyan-950/80 border-cyan-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="iconChoice"
                          value="/circulo-marie.png"
                          checked={iconChoice === '/circulo-marie.png'}
                          onChange={() => setIconChoice('/circulo-marie.png')}
                        />
                        <img src="/circulo-marie.png" alt="Marié" className="w-7 h-7 rounded-full object-cover border border-amber-400" />
                        <span className="text-xs font-bold">Marié IA Avatar</span>
                      </label>

                      <label 
                        className={`flex items-center gap-2.5 p-2 px-3 rounded-xl border cursor-pointer transition-colors ${
                          iconChoice === '/colshopi-logo.png'
                            ? 'bg-cyan-950/80 border-cyan-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="iconChoice"
                          value="/colshopi-logo.png"
                          checked={iconChoice === '/colshopi-logo.png'}
                          onChange={() => setIconChoice('/colshopi-logo.png')}
                        />
                        <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center p-1 border border-cyan-400">
                          <ColshopiLogo className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xs font-bold">ColShopi Logo</span>
                      </label>
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN: Live Mobile Preview & Dispatch Mode (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 3. LIVE SMARTPHONE NOTIFICATION PREVIEW */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-extrabold text-white">Vista Previa Móvil</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Lockscreen PWA
                    </span>
                  </div>

                  {/* Realistic Smartphone Mockup Box */}
                  <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 rounded-3xl p-4 shadow-2xl space-y-4">
                    
                    {/* Top phone bar */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span>5G</span>
                        <div className="w-4 h-2 border border-slate-400 rounded-xs relative">
                          <div className="h-full bg-emerald-400 w-3/4" />
                        </div>
                      </div>
                    </div>

                    {/* Lock screen Push Notification Card */}
                    <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-xl backdrop-blur-md space-y-2 animate-fadeIn transition-all">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={iconChoice}
                            alt="Icon"
                            className="w-5 h-5 rounded-md object-cover border border-amber-400/60"
                          />
                          <span className="text-[11px] font-bold text-slate-300">
                            TyroFem 30D • ColShopi
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">Ahora</span>
                      </div>

                      <div className="space-y-1 pl-7">
                        <h5 className="text-xs font-extrabold text-white leading-tight">
                          {title || 'Título de la notificación...'}
                        </h5>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {message || 'Cuerpo del mensaje que la usuaria verá en su pantalla de bloqueo...'}
                        </p>
                      </div>

                      {/* Pill Badge */}
                      <div className="pl-7 pt-0.5 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-900/90 text-cyan-300 rounded-full border border-slate-700">
                          {messageType === 'recordatorio' && '🌿 Recordatorio Diario'}
                          {messageType === 'oferta_vip' && '🎁 Oferta VIP'}
                          {messageType === 'tip_nutricional' && '🥗 Tip Nutricional'}
                          {messageType === 'testimonio' && '⭐ Testimonio'}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Tocar para abrir</span>
                      </div>

                    </div>

                    <div className="text-center pt-2 text-[10px] text-slate-500">
                      Simulación en tiempo real del banner nativo de Android / iOS
                    </div>
                  </div>
                </div>

                {/* 4. MODO DE ENVÍO & BOTÓN PRINCIPAL */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-extrabold text-white">3. Modo de Envío</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSendMode('instant')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        sendMode === 'instant'
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-white block">⚡ Enviar Ahora</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Disparo inmediato en tiempo real</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSendMode('scheduled')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        sendMode === 'scheduled'
                          ? 'bg-amber-950/80 border-amber-400 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-amber-300 block">⏰ Programar</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Definir fecha y hora futura</span>
                    </button>
                  </div>

                  {sendMode === 'scheduled' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1.5 animate-fadeIn">
                      <label className="text-xs font-bold text-amber-300 block">Fecha y Hora de Emisión:</label>
                      <input
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-amber-400"
                        required
                      />
                    </div>
                  )}

                  {/* Summary of action */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Destinatarias:</span>
                      <strong className="text-cyan-300 font-bold">{calculatedRecipients.count} usuarias</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entrega:</span>
                      <span className="text-white font-semibold">
                        {sendMode === 'instant' ? 'Inmediata (Push Web PWA)' : `Programada (${scheduledDateTime})`}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending || calculatedRecipients.count === 0}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 via-cyan-600 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        <span>Procesando envío push...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {sendMode === 'instant'
                            ? `🚀 Disparar Notificación Push a ${calculatedRecipients.count} Usuaria(s)`
                            : '⏰ Guardar y Programar Notificación'}
                        </span>
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

          </form>
        ) : (
          /* ========================================================================= */
          /* TAB 2: HISTORIAL DE NOTIFICACIONES ENVIADAS */
          /* ========================================================================= */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Registro Histórico de Notificaciones Push</h3>
                <p className="text-xs text-slate-400">Total registros emitidos y programados: {historyList.length}</p>
              </div>
              <button
                type="button"
                onClick={loadHistory}
                disabled={isLoadingHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                <span>Actualizar Historial</span>
              </button>
            </div>

            {historyList.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-slate-900/50 rounded-2xl border border-slate-800">
                <Bell className="w-12 h-12 text-slate-700 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">Aún no hay notificaciones en el historial</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Utiliza la pestaña "Redactar & Enviar" para emitir la primera notificación a tus usuarias.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Fecha & Hora</th>
                      <th className="py-3 px-3">Título & Mensaje</th>
                      <th className="py-3 px-3">Audiencia / Destino</th>
                      <th className="py-3 px-3">Categoría</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {historyList.map((item) => {
                      const formattedDate = new Date(item.sentAt || Date.now()).toLocaleDateString('es-CO', {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      const audienceLabels: Record<string, string> = {
                        all: '📢 Masivo (Todas)',
                        individual: `🎯 Individual (${item.targetUserName || 'Usuaria'})`,
                        stage: `📊 Etapa (${item.targetStage || 'Fase'})`,
                        low_adherence: '⚠️ Baja Adherencia'
                      };

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                          
                          {/* Col 1: Date */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {formattedDate}
                          </td>

                          {/* Col 2: Title & Message */}
                          <td className="py-3 px-3">
                            <div className="space-y-0.5 max-w-xs sm:max-w-sm">
                              <h5 className="font-bold text-white text-xs truncate" title={item.title}>
                                {item.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 truncate" title={item.message}>
                                {item.message}
                              </p>
                              {item.url && (
                                <span className="text-[10px] text-cyan-400 font-mono truncate block">
                                  Ruta: {item.url}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Col 3: Audience */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-xs font-semibold text-slate-200 block">
                              {audienceLabels[item.audienceType] || item.audienceType}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {item.recipientCount} destinatarias
                            </span>
                          </td>

                          {/* Col 4: Category */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-950 border border-slate-700 text-slate-300 rounded-full">
                              {item.type}
                            </span>
                          </td>

                          {/* Col 5: Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {item.status === 'sent' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Enviada</span>
                              </span>
                            )}
                            {item.status === 'scheduled' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                                <Clock className="w-3 h-3" />
                                <span>Programada</span>
                              </span>
                            )}
                            {item.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Error</span>
                              </span>
                            )}
                          </td>

                          {/* Col 6: Actions */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Re-use template */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTitle(item.title);
                                  setMessage(item.message);
                                  setMessageType(item.type);
                                  setDestinationUrl(item.url || '#calendario');
                                  setActiveTab('compose');
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Cargar y re-enviar este mensaje"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteHistory(item.id)}
                                className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar del historial"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

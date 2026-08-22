import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Heart, 
  Play, 
  Pause, 
  Volume2, 
  ShieldCheck, 
  ShoppingBag, 
  Phone, 
  RotateCcw, 
  Check, 
  ExternalLink,
  MessageCircle,
  Clock,
  Award
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { INITIAL_MARIE_MESSAGES, getMarieResponse } from '../data/faqChatData';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';
import { useScreenWakeLock } from '../hooks/useScreenWakeLock';

interface MarieChatProps {
  userProfile: UserProfile;
  onOpenOrder: () => void;
  onOpenRecipe: (recipeId: string) => void;
  onOpenWelcomeAudio?: () => void;
}

export const MarieChat: React.FC<MarieChatProps> = ({
  userProfile,
  onOpenOrder,
  onOpenRecipe,
  onOpenWelcomeAudio
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tyrofem_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MARIE_MESSAGES;
      }
    }
    return INITIAL_MARIE_MESSAGES;
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep screen awake while playing audio notes
  useScreenWakeLock(isPlayingAudio, 'marie-chat-voice-note');

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('tyrofem_chat_messages', JSON.stringify(messages));
  }, [messages, isTyping]);

  // Handle simulated audio note playback
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      setAudioProgress(0);
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 400);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate natural thinking delay
    setTimeout(() => {
      const responseData = getMarieResponse(query);
      const marieMsg: ChatMessage = {
        id: `marie-${Date.now()}`,
        sender: 'marie',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: responseData.quickReplies,
        actionLink: responseData.actionLink,
        isVoiceNote: responseData.isVoiceNote,
        voiceDuration: responseData.voiceDuration
      };

      setMessages(prev => [...prev, marieMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MARIE_MESSAGES);
    localStorage.removeItem('tyrofem_chat_messages');
  };

  const quickPrompts = [
    '🦋 ¿Cómo actúa Tyruss Full en la Tiroides y Metabolismo?',
    '🌸 ¿Cómo controlar sofocos y calores?',
    '🥤 ¿Cómo se prepara y a qué hora tomarlo?',
    '🛡️ ¿Tiene Registro INVIMA certificado?',
    '🎁 ¿Cuál es mi obsequio (Loción Termoactiva)?',
    '📦 Ver Promociones ColShopi y Precios'
  ];

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      {/* Header Profile Card with ColShopi Identity & Marie Portrait */}
      <div className="relative overflow-hidden rounded-3xl bg-[#090e14] text-white p-5 sm:p-6 border border-cyan-500/30 shadow-xl space-y-4">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Visual Portrait Replica */}
            <div className="relative shrink-0">
              <MariePhoto size="md" showBadge={false} showNeonBg={true} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif-luxury">
                  Nutricionista Marié
                </h2>
                <span className="text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  ColShopi Tienda
                </span>
              </div>
              <p className="text-xs text-cyan-200/90 font-medium">
                Especialista en Salud Femenina & Guía Nutricional TyroFem 30D
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>By Leps Digital</span>
                <span>•</span>
                <span className="text-emerald-300">En línea para resolver tus dudas</span>
              </div>
            </div>
          </div>

          {/* WhatsApp & Reset Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <a
              href="https://wa.link/6zpm18"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Directo con Marié</span>
            </a>

            <button
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Reiniciar conversación"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Note & Welcome Message Widget */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-4 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenWelcomeAudio || togglePlayAudio}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-emerald-800/20 shrink-0 cursor-pointer"
            title="Escuchar Audio Oficial de Marié"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">Audio Oficial de Bienvenida de Marié 🎙️</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                MP3 Oficial
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Escucha las instrucciones clínicas de Marié para tu toma de Tyruss Full.
            </p>
          </div>
        </div>

        {onOpenWelcomeAudio && (
          <button
            type="button"
            onClick={onOpenWelcomeAudio}
            className="self-end sm:self-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Abrir Reproductor</span>
          </button>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMarie = msg.sender === 'marie';

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMarie ? 'items-start' : 'items-end'} space-y-1`}
            >
              <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[78%]">
                {isMarie && (
                  <div className="shrink-0 mb-1">
                    <MariePhoto size="xs" showBadge={false} />
                  </div>
                )}

                <div 
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMarie 
                      ? 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs' 
                      : 'bg-emerald-700 text-white rounded-br-xs'
                  }`}
                >
                  {/* Formatted Text */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>

                  {/* Contextual Action Link Button inside Bubble */}
                  {msg.actionLink && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                      {msg.actionLink.type === 'order' ? (
                        <button
                          type="button"
                          onClick={onOpenOrder}
                          className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{msg.actionLink.text}</span>
                        </button>
                      ) : msg.actionLink.type === 'whatsapp' ? (
                        <a
                          href={msg.actionLink.url || 'https://wa.me/573104007428'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors inline-block text-center"
                        >
                          <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
                          <span>{msg.actionLink.text}</span>
                        </a>
                      ) : msg.actionLink.type === 'recipe' && msg.actionLink.targetId ? (
                        <button
                          type="button"
                          onClick={() => onOpenRecipe(msg.actionLink!.targetId!)}
                          className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{msg.actionLink.text}</span>
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 px-2">
                {msg.timestamp}
              </span>

              {/* Quick Replies below message */}
              {isMarie && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                  {msg.quickReplies.map((qr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(qr)}
                      className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 rounded-full transition-colors cursor-pointer"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
              👩‍⚕️
            </div>
            <div className="bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[11px] text-slate-400">Marié está escribiendo...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
          Preguntas Frecuentes
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Escríbele tu duda a la Nutricionista Marié, ${userProfile.name}...`}
          className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className={`p-3 rounded-xl transition-all cursor-pointer ${
            inputVal.trim()
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

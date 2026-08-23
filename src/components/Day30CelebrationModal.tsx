import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Headphones,
  Flame,
  Award,
  Heart,
  MessageCircle,
  Download,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Check,
  Gift,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayProgress, UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';
import { useScreenWakeLock } from '../hooks/useScreenWakeLock';
import { generateTransformationReportPDF } from '../utils/pdfGenerator';
import { triggerDayCompletionConfetti } from '../utils/confettiCelebration';

interface Day30CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  progressMap: Record<number, DayProgress>;
  onOpenFullReport?: () => void;
  onOpenTrend?: () => void;
}

const DAY_30_AUDIO_URL = 'https://f005.backblazeb2.com/file/ColShopi/Tyruss+Full/Audio+Mari%C3%A9+30+dias+Clientes.mp3';
const WHATSAPP_DAY_30_REORDER_LINK = 'https://wa.link/si8xpl';
const WHATSAPP_PHONE_DISPLAY = '+57 310 400 7428';

export const Day30CelebrationModal: React.FC<Day30CelebrationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  progressMap,
  onOpenFullReport,
  onOpenTrend
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);

  // Keep mobile & desktop screen awake during audio playback
  useScreenWakeLock(isPlaying, 'marie-day30-audio-modal');

  // Stats calculation
  const progressEntries = Object.values(progressMap) as DayProgress[];
  const completedDaysCount = progressEntries.filter(
    (p) => p.completedAt || (p.tyrussTaken && p.water2L) || p.isLockedAfterSubmit
  ).length;
  const safeCompletedDays = Math.max(completedDaysCount, 30);
  const adherenceRate = Math.min(100, Math.round((safeCompletedDays / 30) * 100));

  // Trigger celebration confetti & auto-play attempt on open
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Trigger grand graduation confetti
    triggerDayCompletionConfetti({
      dayNumber: 30,
      totalCompletedDays: 30
    });

    setIsLoadingAudio(true);
    setIsAutoplayBlocked(false);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.playbackRate = playbackRate;
      audio.currentTime = 0;

      // Autoplay attempt
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
            setIsLoadingAudio(false);
          })
          .catch((err) => {
            console.warn('Day 30 Autoplay restricted by browser policy:', err);
            setIsPlaying(false);
            setIsAutoplayBlocked(true);
            setIsLoadingAudio(false);
          });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isOpen]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch((err) => {
          console.error('Error playing day 30 audio:', err);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoadingAudio(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextRate = speeds[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadPDFReport = () => {
    setIsGeneratingPDF(true);
    try {
      generateTransformationReportPDF({
        userProfile,
        progressMap,
        currentDay: 30
      });
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 4000);
    } catch (error) {
      console.error('Error generating 30D transformation PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="day-30-celebration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-400/80 overflow-hidden my-auto flex flex-col max-h-[95vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={DAY_30_AUDIO_URL}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="auto"
        />

        {/* Top Header Ribbon: Royal Emerald & Gold Gradient */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-5 sm:p-6 text-white relative shrink-0 overflow-hidden border-b-2 border-amber-400/60">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            title="Cerrar ventana de graduación"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-xl ring-4 ring-amber-400/30">
                <MariePhoto size="md" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 p-1.5 rounded-full border-2 border-white shadow-md">
                <Award className="w-4 h-4 fill-slate-950" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>¡GRADUACIÓN OFICIAL RETO TYROFEM 30D!</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif-luxury text-white tracking-tight leading-tight">
                ¡Lo lograste, {userProfile.name}! 👑🎉
              </h2>
              <p className="text-xs text-amber-200 font-medium">
                Has completado con éxito la totalidad de tus <span className="font-bold text-white underline decoration-amber-400">30 días de transformación</span> con Tyruss Full (500g).
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-slate-700 text-xs">
          
          {/* Milestone Transformation Summary Card */}
          <div className="bg-gradient-to-br from-amber-50/90 via-emerald-50/50 to-white rounded-2xl p-4 border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Meta 100% Cumplida & Balance Hormonal Consolidado</span>
              </div>
              <span className="text-[11px] font-black text-amber-950 bg-amber-200 border border-amber-400 px-3 py-0.5 rounded-full shadow-2xs">
                30 / 30 Días (100%)
              </span>
            </div>

            {/* Complete Progress Bar */}
            <div className="w-full bg-slate-200/90 rounded-full h-2.5 overflow-hidden p-0.5 border border-amber-300">
              <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 h-full rounded-full w-full transition-all duration-700 shadow-xs" />
            </div>

            <p className="text-[12px] text-slate-700 leading-relaxed">
              Durante estos <strong className="text-emerald-950">30 días continuos</strong>, tu tiroides recibió el soporte biológico del selenio, espirulina y nutrientes esenciales de <strong className="text-emerald-950">Tyruss Full</strong>. Has limpiado tu tracto digestivo, activado tu gasto calórico basal y reconectado con tu energía vital femenina.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Toma Tyruss</span>
                <span className="text-sm font-black text-emerald-700">30 Días</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Adherencia</span>
                <span className="text-sm font-black text-amber-600">100%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Código VIP</span>
                <span className="text-sm font-black text-slate-800">#{userProfile.accessCode || '849201'}</span>
              </div>
            </div>
          </div>

          {/* AUDIO PLAYER: Audio Especial de Marié para el Día 30 */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-amber-400/50 space-y-3.5">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-200 leading-tight">
                    Audio Oficial de Marié: Felicitaciones Día 30 (Graduación)
                  </h4>
                  <span className="text-[10px] text-emerald-300/80">
                    Mensaje de voz de cierre y recomendaciones para graduadas
                  </span>
                </div>
              </div>

              {/* Animated Voice Wave */}
              <div className="flex items-center gap-0.5 h-4">
                {[40, 75, 100, 60, 95, 45, 85, 55].map((h, i) => (
                  <div
                    key={i}
                    className={`w-0.5 rounded-full transition-all duration-300 ${
                      isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-emerald-700/60'
                    }`}
                    style={{
                      height: isPlaying ? `${h}%` : '20%',
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Autoplay blocked banner if required */}
            {isAutoplayBlocked && (
              <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-2.5 text-amber-200 text-[11px] flex items-center justify-between gap-2">
                <span>🎧 Toca reproducir para escuchar el mensaje de graduación de Marié:</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Escuchar Audio
                </button>
              </div>
            )}

            {/* Main Audio Controls */}
            <div className="space-y-2">
              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Progreso del audio del día 30"
                />
                <div className="flex items-center justify-between text-[10px] text-emerald-300/80 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Buttons Row */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  {/* Rewind 10s */}
                  <button
                    type="button"
                    onClick={handleRewind}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors cursor-pointer"
                    title="Rebobinar 10 segundos"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Play / Pause Primary Button */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all active:scale-95 shadow-md cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-slate-950" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>{currentTime > 0 ? 'Continuar' : 'Reproducir Audio'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed toggle */}
                  <button
                    type="button"
                    onClick={toggleSpeed}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 font-mono text-[10px] font-bold transition-colors cursor-pointer"
                    title="Velocidad de reproducción"
                  >
                    {playbackRate}x
                  </button>

                  {/* Mute button */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors cursor-pointer"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÓN 1: DESCARGA DE INFORME CLÍNICO EN PDF (FIRMADO POR MARIÉ) */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-4.5 border border-cyan-400/40 shadow-md space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-cyan-300 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/30">
                  <FileText className="w-3 h-3 text-cyan-300" />
                  <span>Expediente Clínico & Certificado Oficial 30D</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  Informe de Resultados, Valoraciones y Cambios
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Descarga tu informe clínico en PDF con el balance completo de tus 30 días, métricas somáticas y recomendaciones de mantenimiento, firmado oficialmente por <strong>Marié Nutricionista de ColShopi Tienda</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadPDFReport}
                disabled={isGeneratingPDF}
                id="btn-download-pdf-dia-30"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {pdfDownloaded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    <span>¡Informe Descargado en PDF con Éxito!</span>
                  </>
                ) : isGeneratingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Generando Expediente Clínico PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Descargar Informe Clínico en PDF (Firmado)</span>
                  </>
                )}
              </button>

              {onOpenFullReport && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFullReport();
                  }}
                  className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer shrink-0"
                >
                  Visualizar en Pantalla
                </button>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] text-cyan-200/90 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Avalado con Sello Digital INVIMA NSA-0012896-2022 y Firma Profesional</span>
            </div>
          </div>

          {/* BOTÓN 2: WHATSAPP RECOMPRA VIP (+57 3104007428 / wa.link/si8xpl) */}
          <div className="bg-gradient-to-br from-emerald-50 via-amber-50/60 to-emerald-50 border-2 border-emerald-600 rounded-2xl p-4 sm:p-4.5 space-y-2.5 text-center shadow-xs">
            <div className="inline-flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-0.5 rounded-full font-bold text-[10px]">
              <Gift className="w-3.5 h-3.5 text-emerald-700" />
              <span>Beneficio de Continuidad & Recompra VIP ColShopi</span>
            </div>

            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              ¡Continúa con tu Dosis de Mantenimiento y Asegura tu Descuento VIP!
            </h4>
            
            <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg mx-auto">
              Para consolidar tu metabolismo sin efecto rebote y mantener tu tiroides activa, solicita tu siguiente tarro de <strong>Tyruss Full (500g)</strong> con Marié vía WhatsApp con <strong>Envío Gratis + Pago Contra Entrega</strong>:
            </p>

            <a
              href={WHATSAPP_DAY_30_REORDER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              id="btn-whatsapp-recompra-dia-30"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-700" />
              <span>Solicitar Recompra VIP por WhatsApp ({WHATSAPP_PHONE_DISPLAY})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-900 font-semibold pt-0.5">
              <span>🚚 Despacho Nacional 24/48h</span>
              <span>•</span>
              <span>💵 Pago Contra Entrega</span>
              <span>•</span>
              <span>⭐ Garantía 100% Original</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            <span>Has finalizado con éxito tu ciclo de 30 días</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenTrend && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTrend();
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Ver Curva Completa
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Finalizar & Celebrar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

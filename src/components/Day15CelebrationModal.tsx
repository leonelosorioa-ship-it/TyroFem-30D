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
  Clock,
  ArrowRight,
  TrendingUp,
  Share2,
  CalendarCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';
import { useScreenWakeLock } from '../hooks/useScreenWakeLock';

interface Day15CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onOpenReport?: () => void;
  onOpenTrend?: () => void;
}

const DAY_15_AUDIO_URL = 'https://f005.backblazeb2.com/file/ColShopi/Tyruss+Full/Audio+Mari%C3%A9+15+dias+Clientes.mp3';
const WHATSAPP_DAY_15_LINK = 'https://wa.link/ffch56';
const WHATSAPP_PHONE_DISPLAY = '+57 310 400 7428';

export const Day15CelebrationModal: React.FC<Day15CelebrationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onOpenReport,
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

  // Keep mobile & desktop screen awake during audio playback
  useScreenWakeLock(isPlaying, 'marie-day15-audio-modal');

  // Trigger celebration confetti & auto-play attempt on open
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Trigger celebratory confetti burst for 15-day milestone
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.45 },
        colors: ['#047857', '#10B981', '#F59E0B', '#FBBF24', '#2DD4BF', '#FFFFFF'],
        ticks: 250
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0.15, y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#FFFFFF'],
          ticks: 200
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 0.85, y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#FFFFFF'],
          ticks: 200
        });
      }, 300);
    } catch (e) {
      // silent
    }

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
            console.warn('Autoplay restricted by browser policy:', err);
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
          console.error('Error playing audio:', err);
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

  if (!isOpen) return null;

  return (
    <div
      id="day-15-celebration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden my-auto flex flex-col max-h-[94vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={DAY_15_AUDIO_URL}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="auto"
        />

        {/* Top Header Ribbon with ColShopi Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-5 sm:p-6 text-white relative shrink-0 overflow-hidden border-b border-emerald-700/50">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            title="Cerrar ventana de felicitación"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg ring-4 ring-emerald-400/20">
                <MariePhoto size="md" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full border-2 border-white shadow-xs">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border border-amber-400/40 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>¡Mitad del Reto Cumplida (50%)!</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif-luxury text-white tracking-tight leading-tight">
                ¡Felicitaciones, {userProfile.name}! 🎉
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                Has alcanzado y completado el <span className="font-bold text-amber-300">Día 15 del Reto TyroFem 30D</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4.5 overflow-y-auto text-slate-700 text-xs">
          
          {/* Milestone Overview Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl p-4 border border-emerald-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Compromiso & Logro Festejado</span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                15 / 30 Días (50%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden p-0.5 border border-emerald-200/60">
              <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400 h-full rounded-full w-1/2 transition-all duration-700 shadow-xs" />
            </div>

            <p className="text-[12px] text-slate-600 leading-relaxed">
              Llegar al <strong className="text-emerald-950">Día 15</strong> demuestra tu increíble determinación con tu salud metabólica y hormonal. A partir de hoy, los nutrientes de <strong className="text-emerald-950">Tyruss Full (500g)</strong> se han acumulado celularmente, permitiendo una mayor estabilidad en tu tiroides, tránsito digestivo y niveles continuos de energía.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                  Desinflamación Digestiva Consolidada
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                  Chispa Metabólica & Calma Hormonal
                </span>
              </div>
            </div>
          </div>

          {/* AUDIO PLAYER: Audio de Marié para el Día 15 */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-emerald-600/40 space-y-3.5">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-100 leading-tight">
                    Audio Especial de Marié: Felicitaciones 15 Días
                  </h4>
                  <span className="text-[10px] text-emerald-300/80">
                    Mensaje de voz oficial para compradoras VIP Tyruss Full
                  </span>
                </div>
              </div>

              {/* Animated Voice Wave Indicator */}
              <div className="flex items-center gap-0.5 h-4">
                {[40, 70, 100, 60, 90, 45, 80, 50].map((h, i) => (
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

            {/* Autoplay blocked gentle banner */}
            {isAutoplayBlocked && (
              <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-2.5 text-amber-200 text-[11px] flex items-center justify-between gap-2">
                <span>🎧 Toca el botón de reproducción para escuchar a Marié:</span>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Escuchar Ahora
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
                  aria-label="Progreso del audio"
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

          {/* WHATSAPP ACTION BUTTON (+57 3104007428 / wa.link/ffch56) */}
          <div className="bg-emerald-50 border-2 border-emerald-500/60 rounded-2xl p-4 space-y-2.5 text-center shadow-xs">
            <div className="flex items-center justify-center gap-2 text-emerald-950 font-bold text-xs">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Acompañamiento VIP Directo con Marié</span>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-snug">
              ¿Cómo te has sentido en estos 15 días? Cuéntale a Marié tus avances o resuelve cualquier duda para la segunda fase del programa:
            </p>

            <a
              href={WHATSAPP_DAY_15_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              id="btn-whatsapp-dia-15"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>Hablar con Marié por WhatsApp ({WHATSAPP_PHONE_DISPLAY})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-800 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Línea oficial de soporte de bienestar y hábitos ColShopi</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            <span>Continuar con los siguientes 15 días del reto</span>
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
                Ver Curva Evolutiva
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
            >
              <span>¡Entendido, vamos por más!</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

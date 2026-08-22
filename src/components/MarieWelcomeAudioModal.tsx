import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Headphones,
  Flame,
  Droplets,
  Clock,
  PhoneCall,
  Heart,
  Plus,
  Minus
} from 'lucide-react';
import { UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';
import { MariePhoto } from './MariePhoto';

interface MarieWelcomeAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onContinueToPlan?: () => void;
}

const WELCOME_AUDIO_URL = 'https://f005.backblazeb2.com/file/ColShopi/Tyruss+Full/Audio+de+Bienvenida+de+Mari%C3%A9+App.mp3';

export const MarieWelcomeAudioModal: React.FC<MarieWelcomeAudioModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onContinueToPlan,
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

  // Auto-play attempt on mount / open
  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    setIsLoadingAudio(true);
    setIsAutoplayBlocked(false);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.playbackRate = playbackRate;
      audio.currentTime = 0;

      // Attempt autoplay
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
            setIsLoadingAudio(false);
          })
          .catch((err) => {
            console.warn('Autoplay prevented by browser policy:', err);
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

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch((err) => {
          console.error('Error playing audio:', err);
        });
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Step Volume Up / Down
  const handleStepVolume = (delta: number) => {
    handleVolumeChange(volume + delta);
  };

  // Handle Mute Toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const restoreVolume = volume === 0 ? 0.8 : volume;
      audio.volume = restoreVolume;
      setVolume(restoreVolume);
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle Seek / Scrub
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  // Replay Audio from start
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  // Toggle Playback speed (1x, 1.25x, 1.5x)
  const handleToggleSpeed = () => {
    const nextSpeed = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  // Close and stop
  const handleCloseModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onClose();
  };

  // Continue to Plan CTA
  const handleContinue = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    if (onContinueToPlan) {
      onContinueToPlan();
    } else {
      onClose();
    }
  };

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  const userName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Hermosa';
  const primaryAngle = userProfile?.primaryAngle || 'tiroides_metabolismo';

  const angleLabels = {
    tiroides_metabolismo: 'Activación Tiroidea & Metabolismo',
    desbalance_menopausia: 'Balance Hormonal & Menopausia',
    ciclos_spm: 'Regulación de Ciclos & SPM',
    digestion_detox: 'Digestión & Desintoxicación Intestinal'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={WELCOME_AUDIO_URL}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoadingAudio(false);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-[#09121a] via-[#070e15] to-[#04080c] rounded-3xl border border-cyan-500/40 shadow-[0_10px_50px_rgba(0,229,255,0.25)] text-white overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow lights */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-5 py-3.5 border-b border-cyan-500/20 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ColshopiLogo size="xs" showGlow={false} />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-cyan-300 tracking-wide">
                ColShopi Tienda By Leps Digital
              </span>
              <span className="text-[9px] text-slate-400">
                Audio Oficial de Bienvenida • TyroFem 30D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>INVIMA RSA-0021928-2022</span>
            </span>

            <button
              onClick={handleCloseModal}
              type="button"
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Cerrar ventana y continuar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="relative z-10 p-5 sm:p-6 overflow-y-auto space-y-5 text-center">
          
          {/* Marie Visual Avatar & Animated Speaking Aura */}
          <div className="relative flex flex-col items-center">
            <div className="relative">
              {/* Animated pulsating equalizer ring when audio is playing */}
              {isPlaying && (
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-500 opacity-70 blur-md animate-pulse" />
              )}

              <MariePhoto size="hero" showBadge={true} showNeonBg={true} />

              {/* Online indicator badge */}
              <div className="absolute -bottom-2 bg-slate-950/95 border border-cyan-400/80 text-cyan-300 text-[10px] font-black px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>{isPlaying ? 'Marié te está hablando...' : 'Directora Nutricional Marié'}</span>
              </div>
            </div>

            {/* Title & Personalized Greeting */}
            <div className="mt-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>¡Bienvenida a tu Reto TyroFem 30D!</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury tracking-tight pt-1">
                ¡Hola, {userName}! 🌿
              </h2>

              <p className="text-xs sm:text-sm text-cyan-200/90 max-w-md mx-auto leading-relaxed">
                Escucha el mensaje de voz que preparé especialmente para guiarte en tu primera toma con <strong>Tyruss Full (500g)</strong>.
              </p>
            </div>
          </div>

          {/* Autoplay Blocked Notification Warning (If browser blocked instant autoplay) */}
          {isAutoplayBlocked && !isPlaying && (
            <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-400/40 rounded-2xl p-3 text-amber-200 text-xs flex items-center justify-between gap-3 animate-bounce">
              <div className="flex items-center gap-2 text-left">
                <Headphones className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Toca el botón para iniciar el audio de Marié:</span>
              </div>
              <button
                type="button"
                onClick={togglePlay}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reproducir</span>
              </button>
            </div>
          )}

          {/* AUDIO PLAYER CONTROLLER CARD (COMPREHENSIVE CONTROLS) */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-3.5 shadow-xl text-left">
            
            {/* Equalizer Visualizer & Status */}
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-4">
                  {[40, 90, 60, 100, 75, 45, 85, 30].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: isPlaying ? `${h}%` : '25%' }}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-300">
                  {isPlaying ? 'Reproduciendo audio de Marié' : 'Audio en pausa'}
                </span>
              </div>

              {/* Speed Switcher */}
              <button
                type="button"
                onClick={handleToggleSpeed}
                className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                title="Cambiar velocidad de reproducción"
              >
                {playbackRate}x
              </button>
            </div>

            {/* Time Slider & Progress Scrubbing */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  aria-label="Progreso del audio"
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Interactive Controls Row: Play, Pause, Restart, Volume Up/Down, Mute */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              
              {/* Play / Pause / Restart Cluster */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
                  title={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  title="Reiniciar audio desde el principio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Controls Cluster (Subir, Bajar, Slider, Mutear) */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800">
                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-slate-400 hover:text-cyan-300 transition-colors p-1 cursor-pointer"
                  title={isMuted ? 'Activar sonido' : 'Mutear sonido'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-4 h-4 text-cyan-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-cyan-300" />
                  )}
                </button>

                {/* Step Volume Down Button */}
                <button
                  type="button"
                  onClick={() => handleStepVolume(-0.15)}
                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                  title="Bajar volumen"
                >
                  <Minus className="w-3 h-3" />
                </button>

                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  title={`Volumen: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />

                {/* Step Volume Up Button */}
                <button
                  type="button"
                  onClick={() => handleStepVolume(0.15)}
                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                  title="Subir volumen"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Directives Summary (Key Takeaways) */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-cyan-950/40 border border-emerald-500/30 rounded-2xl p-4 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-emerald-300 font-bold border-b border-emerald-500/20 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Puntos Clave de tu Reto 30D</span>
              </span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                {angleLabels[primaryAngle as keyof typeof angleLabels] || 'Balance Integral'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
              <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 flex items-start gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">1 y ¼ Cucharada (20g)</strong>
                  <span className="text-slate-400">Tomar en ayunas todas las mañanas.</span>
                </div>
              </div>

              <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 flex items-start gap-2">
                <Droplets className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">2 Litros de Agua</strong>
                  <span className="text-slate-400">Para facilitar la absorción celular.</span>
                </div>
              </div>

              <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800 flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">Desbloqueo 24H</strong>
                  <span className="text-slate-400">Cada día se habilita cada 24 horas.</span>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Specialist Link */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">¿Dudas con tu toma de Tyruss Full?</span>
                <span className="text-[11px] text-slate-400">Escríbeme directo a mi WhatsApp personal</span>
              </div>
            </div>
            <a
              href="https://wa.link/6zpm18"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              WhatsApp Marié
            </a>
          </div>

        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="relative z-10 p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer text-center"
          >
            Cerrar Ventana
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-700/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Acceder a mi Plan Nutricional 30D</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

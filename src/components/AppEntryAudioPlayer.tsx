import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Pause, Play, Music, Sparkles } from 'lucide-react';
import { useScreenWakeLock } from '../hooks/useScreenWakeLock';

const ENTRY_AUDIO_URL = 'https://f005.backblazeb2.com/file/ColShopi/Tyruss+Full/ColShopi+App.mp3';

interface AppEntryAudioPlayerProps {
  isWelcomeAudioModalOpen?: boolean;
}

export const AppEntryAudioPlayer: React.FC<AppEntryAudioPlayerProps> = ({
  isWelcomeAudioModalOpen = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlayRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [showPill, setShowPill] = useState<boolean>(false);

  // Keep screen awake while app entry audio is playing
  useScreenWakeLock(isPlaying, 'app-entry-audio');

  // Initial autoplay attempt on mount (every time the app loads, reloads, or refreshes)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = false;
    audio.volume = 0.85;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setShowPill(true);
      } catch (error) {
        // Autoplay policy prevented immediate playback without user interaction
        console.log('App entry audio autoplay waiting for user interaction');
        
        const handleFirstInteraction = async () => {
          if (hasAttemptedPlayRef.current) return;
          hasAttemptedPlayRef.current = true;

          // Remove listeners
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
          window.removeEventListener('pointerdown', handleFirstInteraction);
          window.removeEventListener('keydown', handleFirstInteraction);

          try {
            if (audioRef.current && !audioRef.current.ended) {
              await audioRef.current.play();
              setIsPlaying(true);
              setShowPill(true);
            }
          } catch (err) {
            console.warn('Playback error on first user interaction:', err);
          }
        };

        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
        window.addEventListener('keydown', handleFirstInteraction, { once: true });
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Pause entry audio if Marie's welcome modal opens to prevent overlapping sounds
  useEffect(() => {
    if (isWelcomeAudioModalOpen && audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isWelcomeAudioModalOpen, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (hasEnded) {
        audio.currentTime = 0;
        setHasEnded(false);
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn('Play error:', err));
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Background Audio Instance */}
      <audio
        ref={audioRef}
        src={ENTRY_AUDIO_URL}
        preload="auto"
        onEnded={() => {
          setIsPlaying(false);
          setHasEnded(true);
          // Hide floating badge after 4 seconds of completion
          setTimeout(() => {
            setShowPill(false);
          }, 4000);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setShowPill(true);
        }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Audio Status Pill (Discreet & Elegant) */}
      {showPill && (
        <div
          id="colshopi-entry-audio-pill"
          className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-30 flex items-center gap-1.5 bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/40 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 animate-fadeIn"
        >
          {/* Animated sound wave bars or music icon */}
          <div className="flex items-center gap-1">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:300ms]" />
              </div>
            ) : (
              <Music className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-[11px] font-bold text-cyan-200">
              ColShopi
            </span>
          </div>

          {/* Quick Play/Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </button>

          {/* Quick Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-red-400" />
            ) : (
              <Volume2 className="w-3 h-3 text-emerald-400" />
            )}
          </button>
        </div>
      )}
    </>
  );
};

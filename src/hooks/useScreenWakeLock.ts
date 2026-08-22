import { useEffect } from 'react';
import { screenWakeLock } from '../utils/screenWakeLock';

/**
 * Custom React Hook to keep screen awake while audio/video is playing
 * @param isPlaying Boolean indicating whether media is currently active
 * @param source Identifier for debugging/logging
 */
export function useScreenWakeLock(isPlaying: boolean, source: string = 'media-hook'): void {
  useEffect(() => {
    if (isPlaying) {
      screenWakeLock.requestLock(source);
    } else {
      screenWakeLock.releaseLock(source);
    }

    return () => {
      if (isPlaying) {
        screenWakeLock.releaseLock(`${source}-cleanup`);
      }
    };
  }, [isPlaying, source]);
}

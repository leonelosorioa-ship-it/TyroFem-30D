/**
 * Screen Wake Lock Manager for ColShopi & TyroFem 30D
 * Keeps mobile/desktop screens awake and prevents sleep/display dimming
 * whenever any audio or protocol voice note is active and playing.
 */

class ScreenWakeLockManager {
  private wakeLockSentinel: any = null;
  private activeLocksCount: number = 0;
  private activeAudioElements: Set<HTMLAudioElement | HTMLMediaElement> = new Set();
  private isSupported: boolean = false;
  private listenersAttached: boolean = false;

  constructor() {
    this.isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  /**
   * Initializes global DOM listeners for all <audio> and <video> elements
   * so any playback automatically acquires the Screen Wake Lock.
   */
  public initGlobalListeners(): void {
    if (this.listenersAttached || typeof window === 'undefined') return;

    this.listenersAttached = true;

    // Capture play events from any media element
    window.addEventListener(
      'play',
      (event) => {
        const target = event.target as HTMLMediaElement;
        if (target && (target.tagName === 'AUDIO' || target.tagName === 'VIDEO')) {
          this.activeAudioElements.add(target);
          this.requestLock(`media-play-${target.tagName}`);
        }
      },
      true
    );

    // Capture pause events
    window.addEventListener(
      'pause',
      (event) => {
        const target = event.target as HTMLMediaElement;
        if (target) {
          this.activeAudioElements.delete(target);
          if (this.activeAudioElements.size === 0 && this.activeLocksCount === 0) {
            this.releaseLock(`media-pause-${target.tagName}`);
          }
        }
      },
      true
    );

    // Capture ended events
    window.addEventListener(
      'ended',
      (event) => {
        const target = event.target as HTMLMediaElement;
        if (target) {
          this.activeAudioElements.delete(target);
          if (this.activeAudioElements.size === 0 && this.activeLocksCount === 0) {
            this.releaseLock(`media-ended-${target.tagName}`);
          }
        }
      },
      true
    );

    // Capture error events
    window.addEventListener(
      'error',
      (event) => {
        const target = event.target as HTMLMediaElement;
        if (target && (target.tagName === 'AUDIO' || target.tagName === 'VIDEO')) {
          this.activeAudioElements.delete(target);
          if (this.activeAudioElements.size === 0 && this.activeLocksCount === 0) {
            this.releaseLock(`media-error-${target.tagName}`);
          }
        }
      },
      true
    );

    // Re-acquire Wake Lock when tab becomes visible again if audio is playing
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (this.activeAudioElements.size > 0 || this.activeLocksCount > 0) {
          this.acquireWakeLock();
        }
      }
    });
  }

  /**
   * Explicitly requests keeping the screen active (e.g. from an audio component or modal)
   */
  public requestLock(source: string = 'unknown'): void {
    this.activeLocksCount++;
    this.acquireWakeLock();
  }

  /**
   * Explicitly releases a previously requested lock
   */
  public releaseLock(source: string = 'unknown'): void {
    if (this.activeLocksCount > 0) {
      this.activeLocksCount--;
    }

    if (this.activeLocksCount === 0 && this.activeAudioElements.size === 0) {
      this.releaseWakeLock();
    }
  }

  /**
   * Acquires the Screen Wake Lock Sentinel via navigator.wakeLock
   */
  private async acquireWakeLock(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    try {
      if (this.wakeLockSentinel && !this.wakeLockSentinel.released) {
        return; // Already held
      }

      this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');

      this.wakeLockSentinel.addEventListener('release', () => {
        // If release was unexpected and we still have active audio, try to reacquire when visible
        if ((this.activeAudioElements.size > 0 || this.activeLocksCount > 0) && document.visibilityState === 'visible') {
          setTimeout(() => {
            this.acquireWakeLock();
          }, 1000);
        }
      });
    } catch (err) {
      console.warn('Screen WakeLock request failed (battery saver or permission):', err);
    }
  }

  /**
   * Releases the active Screen Wake Lock Sentinel
   */
  private releaseWakeLock(): void {
    if (this.wakeLockSentinel && !this.wakeLockSentinel.released) {
      try {
        this.wakeLockSentinel.release();
      } catch (err) {
        console.warn('Error releasing Screen WakeLock:', err);
      }
      this.wakeLockSentinel = null;
    }
  }

  /**
   * Check if wake lock is currently active
   */
  public isActive(): boolean {
    return !!(this.wakeLockSentinel && !this.wakeLockSentinel.released);
  }
}

export const screenWakeLock = new ScreenWakeLockManager();

/**
 * Global PWA Manager & Hook
 * Captures `beforeinstallprompt` event as early as possible and manages PWA installation lifecycle.
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __deferredPwaPrompt?: any;
    __pwaInstalled?: boolean;
  }
}

// Global listener initialized immediately on module load
if (typeof window !== 'undefined') {
  // Check standalone mode
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  ) {
    window.__pwaInstalled = true;
  }

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    window.__deferredPwaPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
    console.log('TyroFem PWA: beforeinstallprompt captured and ready for trigger');
  });

  window.addEventListener('appinstalled', () => {
    window.__pwaInstalled = true;
    window.__deferredPwaPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa-installed'));
    console.log('TyroFem PWA: App successfully installed on device');
  });
}

export function isDeviceIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
}

export function isDeviceAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /android/.test(ua);
}

export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.__pwaInstalled === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export async function promptPWAInstall(): Promise<{
  success: boolean;
  outcome?: 'accepted' | 'dismissed' | 'manual_needed';
}> {
  if (typeof window === 'undefined') return { success: false, outcome: 'manual_needed' };

  const promptEvent = window.__deferredPwaPrompt;

  if (promptEvent) {
    try {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        window.__pwaInstalled = true;
        window.__deferredPwaPrompt = null;
        window.dispatchEvent(new CustomEvent('pwa-installed'));
        return { success: true, outcome: 'accepted' };
      } else {
        return { success: false, outcome: 'dismissed' };
      }
    } catch (err) {
      console.error('TyroFem PWA: Error triggering native prompt', err);
      return { success: false, outcome: 'manual_needed' };
    }
  }

  return { success: false, outcome: 'manual_needed' };
}

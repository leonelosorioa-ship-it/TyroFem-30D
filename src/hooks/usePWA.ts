import { useState, useEffect, useCallback } from 'react';
import { 
  isDeviceIOS, 
  isDeviceAndroid, 
  isAppInstalled, 
  promptPWAInstall 
} from '../utils/pwaManager';

export function usePWA() {
  const [canInstall, setCanInstall] = useState<boolean>(() => {
    return typeof window !== 'undefined' && Boolean(window.__deferredPwaPrompt);
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(() => isAppInstalled());
  const [isIOS] = useState<boolean>(() => isDeviceIOS());
  const [isAndroid] = useState<boolean>(() => isDeviceAndroid());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handlePromptAvailable = () => {
      setCanInstall(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setIsModalOpen(false);
    };

    window.addEventListener('pwa-prompt-available', handlePromptAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    if (window.__deferredPwaPrompt) {
      setCanInstall(true);
    }
    if (isAppInstalled()) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('pwa-prompt-available', handlePromptAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    // If native prompt is available (Chrome Android / Edge / Chrome Desktop)
    if (window.__deferredPwaPrompt) {
      const result = await promptPWAInstall();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setCanInstall(false);
        return;
      }
      if (result.outcome === 'dismissed') {
        return;
      }
    }
    
    // If native prompt is not available (iOS, Safari, In-App browsers, or already captured)
    // open the beautiful install instructions modal
    setIsModalOpen(true);
  }, []);

  return {
    canInstall,
    isInstalled,
    isIOS,
    isAndroid,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    triggerInstall
  };
}

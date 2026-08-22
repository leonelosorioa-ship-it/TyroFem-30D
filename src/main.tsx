import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { screenWakeLock } from './utils/screenWakeLock';

// Initialize global screen wake lock listeners to keep mobile/desktop screen on during any audio playback
screenWakeLock.initGlobalListeners();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('TyroFem PWA: Service Worker registered successfully', reg.scope);
      })
      .catch((err) => {
        console.warn('TyroFem PWA: Service Worker registration failed', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


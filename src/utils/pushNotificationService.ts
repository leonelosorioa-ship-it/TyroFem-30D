import { saveRegisteredUser } from '../data/usersDatabase';

export type PushAudienceType = 'all' | 'individual' | 'stage' | 'low_adherence';
export type PushMessageType = 'recordatorio' | 'oferta_vip' | 'tip_nutricional' | 'testimonio';
export type PushSendMode = 'instant' | 'scheduled';

export interface PushNotificationRecord {
  id: string;
  title: string;
  message: string;
  type: PushMessageType;
  url: string;
  icon: string;
  badge: string;
  audienceType: PushAudienceType;
  targetUserId?: string;
  targetUserName?: string;
  targetStage?: string;
  sendMode: PushSendMode;
  scheduledAt?: string;
  sentAt: string;
  status: 'sent' | 'scheduled' | 'failed';
  recipientCount: number;
  deliveredCount: number;
}

export interface PushNotificationPayload {
  title: string;
  message: string;
  type: PushMessageType;
  url: string;
  icon?: string;
  badge?: string;
  audienceType: PushAudienceType;
  targetUserId?: string;
  targetUserName?: string;
  targetStage?: string;
  sendMode: PushSendMode;
  scheduledAt?: string;
}

const STORAGE_KEY_PUSH_PROMPTED = 'tyrofem_push_permission_prompted';
const STORAGE_KEY_PUSH_ENABLED = 'tyrofem_push_enabled';
const STORAGE_KEY_PUSH_SUBSCRIPTION = 'tyrofem_push_subscription_json';

// BroadcastChannel for instant cross-tab and in-app synchronization
const pushBroadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('tyrofem_push_channel') 
  : null;

if (pushBroadcastChannel) {
  pushBroadcastChannel.onmessage = (event) => {
    if (event.data && event.data.type === 'PUSH_RECEIVED') {
      const payload = event.data.payload;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tyrofem_push_received', { detail: payload }));
      }
    }
  };
}

/**
 * Utility for converting Base64 VAPID string into Uint8Array for PushManager
 */
export function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Personalizes text by replacing the {nombre} tag with the user's first name
 */
export function personalizeNotificationText(templateText: string, fullName?: string): string {
  if (!templateText) return '';
  const firstName = fullName && fullName.trim().length > 0 
    ? fullName.trim().split(' ')[0] 
    : 'Hermosa';
  return templateText.replace(/\{nombre\}/gi, firstName);
}

/**
 * Prepares personalized title, body and metadata payload for a given user
 */
export function preparePersonalizedPayload(
  templateTitle: string,
  templateBody: string,
  user: { fullName?: string; name?: string; id?: string },
  selectedRouteUrl: string = '#calendario',
  icon: string = '/circulo-marie.png'
) {
  const name = user.fullName || user.name || '';
  const firstName = name.trim().length > 0 ? name.trim().split(' ')[0] : 'Hermosa';

  const personalizedTitle = templateTitle.replace(/\{nombre\}/gi, firstName);
  const personalizedBody = templateBody.replace(/\{nombre\}/gi, firstName);

  return {
    title: personalizedTitle,
    body: personalizedBody,
    message: personalizedBody,
    icon: icon || '/circulo-marie.png',
    badge: '/colshopi-logo.png',
    url: selectedRouteUrl,
    tag: `tyrofem-push-${Date.now()}`
  };
}

/**
 * Check if Web Push and Notifications are supported by the current browser/device
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get current browser notification permission status
 */
export function getPushPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Has the user already been prompted or responded to the friendly modal?
 */
export function hasBeenPromptedForPush(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_PUSH_PROMPTED) === 'true';
}

/**
 * Set the prompted flag
 */
export function markPushAsPrompted(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PUSH_PROMPTED, 'true');
  }
}

/**
 * Obtain public VAPID key from server or fallback
 */
export async function getVapidPublicKey(): Promise<string> {
  try {
    const res = await fetch('/api/push/vapid-public-key');
    if (res.ok) {
      const data = await res.json();
      if (data && data.publicKey) {
        return data.publicKey;
      }
    }
  } catch (e) {
    console.warn('Could not fetch VAPID public key from backend:', e);
  }
  return 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
}

/**
 * Core function to register and sync PushSubscription for an active user
 */
export async function registerUserPushSubscription(
  userVipCode?: string,
  userEmail?: string
): Promise<{ success: boolean; subscription?: any; error?: string }> {
  try {
    if (!isPushSupported()) {
      return { success: false, error: 'Push no soportado en este navegador' };
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const publicVapidKey = await getVapidPublicKey();
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(publicVapidKey)
      });
    }

    // Standardize to JSON object with endpoint and keys
    const subscriptionData = subscription.toJSON();
    const cleanCode = (userVipCode || localStorage.getItem('tyrofem_vip_code') || '').toString().replace(/\D/g, '').trim();

    localStorage.setItem(STORAGE_KEY_PUSH_ENABLED, 'true');
    localStorage.setItem(STORAGE_KEY_PUSH_SUBSCRIPTION, JSON.stringify(subscriptionData));

    // Update central database on server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userVipCode: cleanCode,
        userEmail: userEmail || '',
        subscription: subscriptionData,
        permission: 'granted',
        pushEnabled: true,
        lastTokenUpdate: Date.now()
      })
    }).catch(err => {
      console.warn('Server subscribe sync error:', err);
    });

    // Also persist in local database registry
    if (cleanCode || userEmail) {
      saveRegisteredUser({
        vipCode: cleanCode,
        email: userEmail,
        pushSubscription: subscriptionData,
        pushEnabled: true,
        lastTokenUpdate: Date.now(),
        pushPermissionStatus: 'granted'
      });
    }

    console.log('✅ Suscripción Push vinculada exitosamente para:', cleanCode || userEmail);
    return { success: true, subscription: subscriptionData };
  } catch (error: any) {
    console.error('Error al registrar suscripción Push:', error);
    return { success: false, error: error?.message || 'Error registrando push subscription' };
  }
}

/**
 * Friendly Request Push Notification Permission flow
 */
export async function requestPushPermission(
  userVipCode?: string,
  userEmail?: string
): Promise<{ success: boolean; permission: NotificationPermission | 'unsupported'; error?: string }> {
  markPushAsPrompted();

  if (!isPushSupported()) {
    console.warn('Push notifications are not supported in this browser/device');
    return { success: false, permission: 'unsupported', error: 'No soportado en este navegador' };
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      localStorage.setItem(STORAGE_KEY_PUSH_ENABLED, 'true');

      // Capture and link actual PushSubscription
      await registerUserPushSubscription(userVipCode, userEmail);

      let swRegistration: ServiceWorkerRegistration | null = null;
      try {
        if ('serviceWorker' in navigator) {
          swRegistration = await navigator.serviceWorker.ready;
        }
      } catch (swErr) {
        console.warn('SW ready check failed:', swErr);
      }

      // Trigger initial Welcome Push Notification as instant confirmation
      triggerWelcomeNotification(swRegistration);

      // Dispatch global window event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tyrofem_push_permission_changed', { detail: { granted: true } }));
      }

      return { success: true, permission: 'granted' };
    } else {
      localStorage.setItem(STORAGE_KEY_PUSH_ENABLED, 'false');
      return { success: false, permission };
    }
  } catch (error: any) {
    console.error('Error requesting notification permission:', error);
    return { success: false, permission: 'default', error: error?.message || 'Error al solicitar permisos' };
  }
}

/**
 * Auto-sync existing push subscription on App load if already granted
 */
export async function autoSyncPushSubscriptionIfGranted(userVipCode?: string, userEmail?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isPushSupported() && Notification.permission === 'granted') {
    try {
      await registerUserPushSubscription(userVipCode, userEmail);
    } catch (e) {
      // silent
    }
  }
}

/**
 * Triggers a welcome confirmation notification
 */
export function triggerWelcomeNotification(swReg?: ServiceWorkerRegistration | null): void {
  const title = '¡Notificaciones TyroFem 30D activadas! 🌿';
  const options = {
    body: 'Marié y el equipo de ColShopi te avisarán de tus tomas de Tyruss Full, recetas y tests diarios.',
    icon: '/circulo-marie.png',
    badge: '/colshopi-logo.png',
    vibrate: [200, 100, 200],
    data: { url: '#calendario' }
  };

  try {
    if (swReg && 'showNotification' in swReg) {
      swReg.showNotification(title, options);
    } else if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: options.body,
        icon: options.icon
      });
    }
  } catch (e) {
    console.warn('Could not display welcome push notification:', e);
  }
}

/**
 * Broadcast in-app notification across tabs and trigger floating banner
 */
export function broadcastInAppNotification(targetUserId?: string, payload?: any): void {
  if (typeof window === 'undefined' || !payload) return;

  // 1. Dispatch in-app event on current window
  window.dispatchEvent(new CustomEvent('tyrofem_push_received', {
    detail: payload
  }));

  // 2. Broadcast to other open tabs via BroadcastChannel
  if (pushBroadcastChannel) {
    try {
      pushBroadcastChannel.postMessage({
        type: 'PUSH_RECEIVED',
        targetUserId,
        payload
      });
    } catch (e) {
      // silent
    }
  }
}

/**
 * Triggers a local or in-app notification for the active user
 */
export function triggerLocalPush(title: string, message: string, url = '#calendario', icon = '/circulo-marie.png'): void {
  if (typeof window === 'undefined') return;

  const payload = {
    title,
    message,
    body: message,
    url,
    icon,
    timestamp: Date.now()
  };

  // 1. Try Service Worker / Browser Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'TRIGGER_LOCAL_PUSH',
        title,
        options: {
          body: message,
          icon,
          badge: '/colshopi-logo.png',
          vibrate: [200, 100, 200],
          data: { url }
        }
      });
    } else {
      try {
        new Notification(title, { body: message, icon });
      } catch (e) {
        // silent
      }
    }
  }

  // 2. Broadcast in-app floating toast
  broadcastInAppNotification(undefined, payload);
}

/**
 * Fetch Push Notification History from Central Server
 */
export async function fetchPushNotificationsHistory(): Promise<PushNotificationRecord[]> {
  try {
    const res = await fetch('/api/push/history');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.notifications) ? data.notifications : [];
  } catch (e) {
    console.warn('Error fetching push history from server:', e);
    return [];
  }
}

/**
 * Send Push Notification from Super Admin Console
 */
export async function sendPushNotificationFromAdmin(payload: PushNotificationPayload): Promise<{
  success: boolean;
  notification?: PushNotificationRecord;
  recipientCount?: number;
  targetUserNames?: string[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }

    const data = await res.json();

    // Trigger local push preview in the browser for instant feedback
    if (payload.sendMode === 'instant') {
      const displayTitle = data.notification?.title || payload.title;
      const displayMessage = data.notification?.message || payload.message;
      triggerLocalPush(displayTitle, displayMessage, payload.url, payload.icon || '/circulo-marie.png');
    }

    return {
      success: true,
      notification: data.notification,
      recipientCount: data.recipientCount,
      targetUserNames: data.targetUserNames
    };
  } catch (error: any) {
    console.error('Error sending push notification from admin:', error);
    return {
      success: false,
      error: error?.message || 'Error al conectar con el servidor de notificaciones'
    };
  }
}

/**
 * Delete Push Notification record from history
 */
export async function deletePushNotificationFromHistory(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/push/history/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    console.warn('Error deleting push record:', e);
    return false;
  }
}

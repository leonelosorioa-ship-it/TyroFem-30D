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

/**
 * Check if Web Push and Notifications are supported by the current browser/device
 */
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
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

      let swRegistration: ServiceWorkerRegistration | null = null;
      try {
        if ('serviceWorker' in navigator) {
          swRegistration = await navigator.serviceWorker.ready;
        }
      } catch (swErr) {
        console.warn('SW ready check failed:', swErr);
      }

      // Sync subscription status with Central Database
      try {
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userVipCode: userVipCode || localStorage.getItem('tyrofem_vip_code') || '',
            userEmail: userEmail || '',
            permission: 'granted',
            subscription: {
              endpoint: 'pwa-active-client',
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
              subscribedAt: new Date().toISOString()
            }
          })
        });
      } catch (apiErr) {
        console.warn('Could not sync push subscription to server:', apiErr);
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
 * Triggers a welcome confirmation notification
 */
export function triggerWelcomeNotification(swReg?: ServiceWorkerRegistration | null): void {
  const title = '¡Notificaciones TyroFem 30D activadas! 🌿';
  const options = {
    body: 'Marié y el equipo de ColShopi te avisarán de tus tomas de Tyruss Full, recetas y tests diarios.',
    icon: '/circulo-marie.png',
    badge: '/colshopi-logo.png',
    vibrate: [100, 50, 100],
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
 * Triggers a local or in-app notification for the active user
 */
export function triggerLocalPush(title: string, message: string, url = '#calendario', icon = '/circulo-marie.png'): void {
  if (typeof window === 'undefined') return;

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
          vibrate: [100, 50, 100],
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

  // 2. Dispatch in-app event for instant visual floating toast
  window.dispatchEvent(new CustomEvent('tyrofem_push_received', {
    detail: { title, message, url, icon, timestamp: Date.now() }
  }));
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

    // Trigger local push preview in the browser for instant feedback if matching
    if (payload.sendMode === 'instant') {
      triggerLocalPush(payload.title, payload.message, payload.url, payload.icon || '/circulo-marie.png');
    }

    return {
      success: true,
      notification: data.notification,
      recipientCount: data.recipientCount
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

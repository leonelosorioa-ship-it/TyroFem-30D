import * as XLSX from 'xlsx';
import { HealthAngle, UserProfile } from '../types';
import {
  MASTER_AUTHORIZED_CODES,
  getRedeemedCodesRegistry,
  applyCodeRenewalSync,
  getCurrentRenewalEpoch,
  isAuthorizedCode,
  syncAuthorizedCodesFromRemote
} from './authorizedCodes';

/**
 * Listado Oficial de 30 Códigos VIP Únicos (6 Dígitos Numéricos)
 * de Uso Único e Intransferible para Compradoras de Tyruss Full (500g)
 */
export const OFFICIAL_30_VIP_CODES: string[] = [
  '204815', '315926', '426137', '537248', '648359',
  '759461', '861572', '972683', '183794', '294105',
  '305216', '416327', '527438', '638549', '749651',
  '851762', '962873', '173495', '284506', '395617',
  '406728', '517839', '628941', '739152', '841263',
  '952374', '163485', '274596', '385607', '496718'
];

export type UserStatus = 'active' | 'suspended' | 'completed_30d' | 'activa' | 'suspendida' | 'inhabilitada';

export type CodeStatus = 'disponible' | 'utilizado' | 'invalido' | 'suspendido' | 'inhabilitado';

export interface CodeValidationResult {
  isValid: boolean;
  status: 'disponible' | 'utilizado' | 'invalido' | 'cuenta_existente' | 'cuenta_suspendida' | 'cuenta_inhabilitada';
  message: string;
  code: string;
  user?: MasterUserData;
  isFirstTimeUsage?: boolean;
  isReturningUser?: boolean;
}

export interface CodeRedemptionRecord {
  code: string;
  status: 'utilizado';
  redeemedAt: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  userId?: string;
}

export interface UserHistoryEvent {
  timestamp: string; // e.g. "2026-08-27 21:19"
  event: string; // e.g. "Login con Código VIP #623914", "Completó Test Día 1 - Toma Tyruss Full confirmada"
}

export interface MasterUserData {
  id: string;
  vipCode: string; // 6-digit VIP code
  fullName: string;
  name?: string;
  phone: string;
  email: string;
  registrationDate: string;
  registeredAt?: string;
  healthGoal: string; // e.g. "Tiroides & Metabolismo"
  primaryAngle: HealthAngle;
  symptoms: string[];
  ageGroup: string;
  status: 'active' | 'suspended' | 'completed_30d' | 'activa' | 'suspendida' | 'inhabilitada';
  statusReason?: string;
  currentDay: number;
  completedDaysCount: number;
  completedDays?: number;
  completedDaysList: number[];
  adherencePercentage: number;
  adherencePercent?: number;
  lastActivityTimestamp: number;
  lastActivityAt?: string;
  lastAction: string;
  historyLog: UserHistoryEvent[];
  progressMap?: Record<number, any>;
  notes?: string;
  accessCode?: string; // alias for vipCode
  pushSubscription?: any;
  pushEnabled?: boolean;
  lastTokenUpdate?: number;
  pushPermissionStatus?: 'granted' | 'denied' | 'default';
  codeRenewalEpoch?: number;
}

export type RegisteredUser = MasterUserData;

export const ADMIN_CREDENTIALS = {
  email: 'contacto@colshopi.com',
  code: '250816',
  name: 'Administrador ColShopi By Leps Digital',
  role: 'Super Admin'
};

export function isAdminCredentials(email?: string, code?: string): boolean {
  if (!email || !code) return false;
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.replace(/\D/g, '').trim();
  return cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() && cleanCode === ADMIN_CREDENTIALS.code;
}

const STORAGE_KEY_USERS_DB = 'tyrofem_registered_users_db';

/**
 * Format timestamp helper
 */
export function formatCurrentTimestamp(d = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${y}-${m}-${day} ${h}:${min}`;
}

/**
 * Helper para traducir el ángulo clínico a nombre legible
 */
export function getAngleLabel(angle?: string): string {
  switch (angle) {
    case 'tiroides_metabolismo':
      return 'Tiroides & Metabolismo';
    case 'desbalance_menopausia':
      return 'Desbalance Hormonal & Menopausia';
    case 'ciclos_spm':
      return 'Ciclos Irregulares & SPM';
    case 'digestion_detox':
      return 'Digestión Lenta & Detox';
    default:
      return 'Tiroides & Metabolismo';
  }
}

/**
 * Normaliza el estado de la usuaria
 */
export function normalizeUserStatus(status?: string): 'active' | 'suspended' | 'completed_30d' {
  if (status === 'suspendida' || status === 'suspended' || status === 'inhabilitada') {
    return 'suspended';
  }
  if (status === 'completed_30d') {
    return 'completed_30d';
  }
  return 'active';
}

/**
 * Obtener todas las usuarias registradas en la base de datos (Memoria Local/Cache)
 */
export function getRegisteredUsers(): MasterUserData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (!raw) {
      return [];
    }
    const parsed: any[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(u => ({
      ...u,
      fullName: u.fullName || u.name || 'Usuaria TyroFem',
      name: u.fullName || u.name || 'Usuaria TyroFem',
      vipCode: u.vipCode || u.accessCode || '',
      accessCode: u.vipCode || u.accessCode || '',
      healthGoal: u.healthGoal || getAngleLabel(u.primaryAngle),
      completedDaysCount: Number(u.completedDaysCount ?? u.completedDays ?? 0),
      completedDays: Number(u.completedDaysCount ?? u.completedDays ?? 0),
      completedDaysList: Array.isArray(u.completedDaysList) ? u.completedDaysList : [],
      adherencePercentage: Number(u.adherencePercentage ?? u.adherencePercent ?? 0),
      adherencePercent: Number(u.adherencePercentage ?? u.adherencePercent ?? 0),
      historyLog: Array.isArray(u.historyLog) ? u.historyLog : [],
      status: normalizeUserStatus(u.status),
      pushSubscription: u.pushSubscription || null,
      pushEnabled: Boolean(u.pushEnabled || (u.pushSubscription && u.pushSubscription.endpoint)),
      lastTokenUpdate: u.lastTokenUpdate,
      pushPermissionStatus: u.pushPermissionStatus || (u.pushEnabled ? 'granted' : 'default')
    }));
  } catch (error) {
    console.error('Error fetching registered users from storage', error);
    return [];
  }
}

/**
 * Obtener usuarias directamente desde el servidor centralizado de ColShopi
 */
export async function fetchRegisteredUsersFromServer(): Promise<MasterUserData[]> {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.users)) {
      const normalizedUsers: MasterUserData[] = data.users.map((u: any) => ({
        ...u,
        fullName: u.fullName || u.name || 'Usuaria TyroFem',
        name: u.fullName || u.name || 'Usuaria TyroFem',
        vipCode: u.vipCode || u.accessCode || '',
        accessCode: u.vipCode || u.accessCode || '',
        healthGoal: u.healthGoal || getAngleLabel(u.primaryAngle),
        completedDaysCount: Number(u.completedDaysCount ?? u.completedDays ?? 0),
        completedDays: Number(u.completedDaysCount ?? u.completedDays ?? 0),
        completedDaysList: Array.isArray(u.completedDaysList) ? u.completedDaysList : [],
        adherencePercentage: Number(u.adherencePercentage ?? u.adherencePercent ?? 0),
        adherencePercent: Number(u.adherencePercentage ?? u.adherencePercent ?? 0),
        historyLog: Array.isArray(u.historyLog) ? u.historyLog : [],
        status: normalizeUserStatus(u.status),
        pushSubscription: u.pushSubscription || null,
        pushEnabled: Boolean(u.pushEnabled || (u.pushSubscription && u.pushSubscription.endpoint)),
        lastTokenUpdate: u.lastTokenUpdate,
        pushPermissionStatus: u.pushPermissionStatus || (u.pushEnabled ? 'granted' : 'default')
      }));
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(normalizedUsers));
      return normalizedUsers;
    }
    return getRegisteredUsers();
  } catch (error) {
    console.warn('Could not fetch users from server, fallback to local storage:', error);
    return getRegisteredUsers();
  }
}

/**
 * Guardar o actualizar una usuaria en la base de datos central y local
 */
export function saveRegisteredUser(user: Partial<MasterUserData>): void {
  try {
    const cleanCode = (user.vipCode || user.accessCode || '').toString().replace(/\D/g, '').trim();
    const cleanEmail = (user.email || '').trim().toLowerCase();
    const fullName = user.fullName || user.name || 'Usuaria TyroFem';
    const nowIso = new Date().toISOString();
    const nowLog = formatCurrentTimestamp();
    const healthGoal = user.healthGoal || getAngleLabel(user.primaryAngle);

    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(
      u => (user.id && u.id === user.id) || 
           (cleanEmail && u.email.toLowerCase() === cleanEmail) || 
           (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    const historyLog = Array.isArray(user.historyLog) && user.historyLog.length > 0
      ? user.historyLog
      : [
          { timestamp: nowLog, event: `Login con Código VIP #${cleanCode || '623914'}` },
          { timestamp: nowLog, event: `Registro y Onboarding completado (${healthGoal})` }
        ];

    const completedDaysCount = Number(user.completedDaysCount ?? user.completedDays ?? 0);
    const adherencePercentage = Number(user.adherencePercentage ?? user.adherencePercent ?? 0);

    const completeUser: MasterUserData = {
      id: user.id || `USR-${cleanCode || Date.now()}`,
      vipCode: cleanCode,
      accessCode: cleanCode,
      fullName,
      name: fullName,
      phone: user.phone || '',
      email: cleanEmail,
      registrationDate: user.registrationDate || user.registeredAt || nowIso,
      registeredAt: user.registeredAt || user.registrationDate || nowIso,
      healthGoal,
      primaryAngle: user.primaryAngle || 'tiroides_metabolismo',
      symptoms: user.symptoms || ['Soporte nutricional Tyruss Full'],
      ageGroup: user.ageGroup || '35-44 años',
      status: normalizeUserStatus(user.status),
      statusReason: user.statusReason,
      currentDay: user.currentDay || 1,
      completedDaysCount,
      completedDays: completedDaysCount,
      completedDaysList: user.completedDaysList || (completedDaysCount > 0 ? [1] : []),
      adherencePercentage,
      adherencePercent: adherencePercentage,
      lastActivityTimestamp: Date.now(),
      lastActivityAt: nowIso,
      lastAction: user.lastAction || `Registro completado (${healthGoal})`,
      historyLog: existingIndex >= 0 ? (users[existingIndex].historyLog || historyLog) : historyLog,
      progressMap: user.progressMap || {},
      notes: user.notes || 'Registro oficial en ColShopi Tienda TyroFem 30D',
      pushSubscription: user.pushSubscription !== undefined ? user.pushSubscription : (existingIndex >= 0 ? users[existingIndex].pushSubscription : null),
      pushEnabled: user.pushEnabled !== undefined ? user.pushEnabled : (existingIndex >= 0 ? users[existingIndex].pushEnabled : false),
      lastTokenUpdate: user.lastTokenUpdate || (existingIndex >= 0 ? users[existingIndex].lastTokenUpdate : undefined),
      pushPermissionStatus: user.pushPermissionStatus || (existingIndex >= 0 ? users[existingIndex].pushPermissionStatus : undefined),
      codeRenewalEpoch: user.codeRenewalEpoch ?? getCurrentRenewalEpoch()
    };

    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...completeUser,
        historyLog: users[existingIndex].historyLog.length > 0 ? users[existingIndex].historyLog : completeUser.historyLog,
        lastActivityAt: nowIso,
        lastActivityTimestamp: Date.now()
      };
    } else {
      users.unshift(completeUser);
    }

    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

    // Si el usuario tiene código VIP, marcarlo inmediatamente como 'utilizado' para evitar re-utilización
    if (cleanCode && cleanCode !== ADMIN_CREDENTIALS.code) {
      markCodeAsUsed(cleanCode, {
        fullName,
        phone: user.phone || '',
        email: cleanEmail,
        id: completeUser.id
      });
    }

    // Dispatch background sync to centralized server
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeUser)
    }).catch(err => {
      console.warn('Background sync to server failed:', err);
    });

    // Notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tyrofem_users_updated', { detail: completeUser }));
    }
  } catch (error) {
    console.error('Error saving user to registry', error);
  }
}

/**
 * Registrar un evento de actividad en el historial de la usuaria
 */
export function recordUserActivityEvent(userIdOrEmail: string, eventText: string, actionType?: string): void {
  if (!userIdOrEmail || !eventText) return;

  const nowLog = formatCurrentTimestamp();
  const nowIso = new Date().toISOString();
  const cleanQuery = userIdOrEmail.trim().toLowerCase();
  const cleanCode = userIdOrEmail.replace(/\D/g, '').trim();

  try {
    const users = getRegisteredUsers();
    const userIndex = users.findIndex(
      u => u.id === userIdOrEmail || u.email.toLowerCase() === cleanQuery || (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    if (userIndex >= 0) {
      const historyLog = Array.isArray(users[userIndex].historyLog) ? [...users[userIndex].historyLog] : [];
      // Avoid duplicate consecutive identical events within seconds
      if (!historyLog.length || historyLog[historyLog.length - 1].event !== eventText) {
        historyLog.push({ timestamp: nowLog, event: eventText });
      }
      users[userIndex].historyLog = historyLog;
      users[userIndex].lastActivityTimestamp = Date.now();
      users[userIndex].lastActivityAt = nowIso;
      users[userIndex].lastAction = actionType || eventText;
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tyrofem_users_updated', { detail: users[userIndex] }));
      }
    }
  } catch (e) {
    // silent
  }

  // Send to server API
  fetch('/api/users/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userIdOrEmail, event: eventText, actionType })
  }).catch(err => {
    console.warn('Could not sync user activity event to server:', err);
  });
}

/**
 * Sincronizar el progreso diario y sesión activa de la usuaria con el servidor
 */
export function syncUserSessionToServer(userProfile: UserProfile | null, progressMap?: Record<number, any>, actionDescription?: string): void {
  if (!userProfile || userProfile.isAdmin) return;

  const cleanEmail = (userProfile.email || '').toLowerCase().trim();
  const cleanCode = (userProfile.accessCode || '').toString().replace(/\D/g, '').trim();
  const fullName = userProfile.name || 'Usuaria TyroFem';
  const healthGoal = getAngleLabel(userProfile.primaryAngle);

  // Calculate completed days list
  const completedDaysList: number[] = [];
  if (progressMap && typeof progressMap === 'object') {
    Object.entries(progressMap).forEach(([dayStr, d]: [string, any]) => {
      if (d && (d.completedAt || (d.tyrussTaken && d.water2L) || d.isLockedAfterSubmit)) {
        completedDaysList.push(Number(dayStr));
      }
    });
    completedDaysList.sort((a, b) => a - b);
  }
  const completedDaysCount = completedDaysList.length;
  const adherencePercentage = Math.min(100, Math.round((completedDaysCount / 30) * 100));
  const lastAction = actionDescription || (completedDaysCount > 0 ? `Check-in Día ${completedDaysList[completedDaysList.length - 1]} completado` : 'Sincronización activa');

  const payload = {
    userProfile: {
      ...userProfile,
      fullName,
      name: fullName,
      email: cleanEmail,
      phone: userProfile.phone || '',
      vipCode: cleanCode,
      accessCode: cleanCode,
      healthGoal,
      primaryAngle: userProfile.primaryAngle,
      ageGroup: userProfile.ageGroup,
      symptoms: userProfile.symptoms,
      startDate: userProfile.startDate,
      status: userProfile.status || 'active',
      statusReason: userProfile.statusReason,
      currentDay: userProfile.currentDay || Math.max(completedDaysCount + 1, 1),
      completedDaysCount,
      completedDays: completedDaysCount,
      completedDaysList,
      adherencePercentage,
      adherencePercent: adherencePercentage
    },
    progressMap: progressMap || {},
    actionDescription: lastAction
  };

  // Also update local users DB cache
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(
      u => (cleanEmail && u.email.toLowerCase() === cleanEmail) || (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    const nowIso = new Date().toISOString();
    const nowLog = formatCurrentTimestamp();

    if (existingIndex >= 0) {
      const historyLog = Array.isArray(users[existingIndex].historyLog) ? [...users[existingIndex].historyLog] : [];
      if (actionDescription && (!historyLog.length || historyLog[historyLog.length - 1].event !== actionDescription)) {
        historyLog.push({ timestamp: nowLog, event: actionDescription });
      }

      users[existingIndex] = {
        ...users[existingIndex],
        fullName,
        name: fullName,
        phone: userProfile.phone || users[existingIndex].phone,
        healthGoal,
        currentDay: userProfile.currentDay || users[existingIndex].currentDay,
        completedDaysCount: Math.max(completedDaysCount, users[existingIndex].completedDaysCount || 0),
        completedDays: Math.max(completedDaysCount, users[existingIndex].completedDaysCount || 0),
        completedDaysList: completedDaysList.length > 0 ? completedDaysList : users[existingIndex].completedDaysList,
        adherencePercentage: Math.max(adherencePercentage, users[existingIndex].adherencePercentage || 0),
        adherencePercent: Math.max(adherencePercentage, users[existingIndex].adherencePercent || 0),
        lastActivityTimestamp: Date.now(),
        lastActivityAt: nowIso,
        lastAction,
        historyLog,
        progressMap: progressMap || users[existingIndex].progressMap || {}
      };
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tyrofem_users_updated', { detail: users[existingIndex] }));
      }
    }
  } catch (e) {
    // silent
  }

  fetch('/api/users/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => {
    console.warn('Error syncing session to server:', err);
  });
}

/**
 * Cambiar el estado de una usuaria: Habilitar ('active'), Suspender ('suspended'), etc.
 */
export async function updateUserStatus(userIdOrEmail: string, status: UserStatus, reason?: string): Promise<boolean> {
  try {
    const normalizedStatus = normalizeUserStatus(status);
    const users = getRegisteredUsers();
    const cleanQuery = userIdOrEmail.trim().toLowerCase();
    const cleanCode = userIdOrEmail.replace(/\D/g, '').trim();

    const userIndex = users.findIndex(
      u => u.id === userIdOrEmail || u.email.toLowerCase() === cleanQuery || (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    const nowLog = formatCurrentTimestamp();
    const nowIso = new Date().toISOString();

    if (userIndex >= 0) {
      users[userIndex].status = normalizedStatus;
      if (reason !== undefined) {
        users[userIndex].statusReason = reason;
      } else if (normalizedStatus === 'active') {
        users[userIndex].statusReason = undefined;
      }
      users[userIndex].lastActivityTimestamp = Date.now();
      users[userIndex].lastActivityAt = nowIso;
      
      const historyLog = Array.isArray(users[userIndex].historyLog) ? [...users[userIndex].historyLog] : [];
      historyLog.push({
        timestamp: nowLog,
        event: normalizedStatus === 'active' 
          ? 'Cuenta HABILITADA (Acceso concedido por Super Admin)' 
          : `Cuenta SUSPENDIDA por administración (${reason || 'En revisión'})`
      });
      users[userIndex].historyLog = historyLog;
      users[userIndex].lastAction = normalizedStatus === 'active' ? 'Acceso Habilitado' : 'Acceso Suspendido';

      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    }

    // Sync to local profile if it matches current active session
    try {
      const currentProfileRaw = localStorage.getItem('tyrofem_user_profile');
      if (currentProfileRaw) {
        const currentProfile = JSON.parse(currentProfileRaw);
        if (
          currentProfile.email?.toLowerCase() === cleanQuery ||
          currentProfile.accessCode === cleanCode ||
          currentProfile.id === userIdOrEmail
        ) {
          currentProfile.status = normalizedStatus;
          currentProfile.statusReason = reason;
          localStorage.setItem('tyrofem_user_profile', JSON.stringify(currentProfile));
        }
      }
    } catch (e) {
      // silent
    }

    // Send PATCH to central server
    try {
      await fetch(`/api/users/${encodeURIComponent(userIdOrEmail)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: normalizedStatus, reason })
      });
    } catch (err) {
      console.warn('Server status patch error:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tyrofem_users_updated'));
    }

    return true;
  } catch (error) {
    console.error('Error updating user status', error);
    return false;
  }
}

/**
 * Buscar usuaria por código o email
 */
export function findUserByCodeOrEmail(query: string): MasterUserData | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();
  const cleanCode = query.replace(/\D/g, '').trim();
  const users = getRegisteredUsers();
  return users.find(u => {
    const userEmail = (u.email || '').trim().toLowerCase();
    const userVip = (u.vipCode || '').toString().replace(/\D/g, '').trim();
    const userAccess = (u.accessCode || '').toString().replace(/\D/g, '').trim();
    
    // Match exact email
    if (clean && userEmail && userEmail === clean) {
      return true;
    }
    // Match exact access or VIP 6-digit code
    if (cleanCode && (userVip === cleanCode || userAccess === cleanCode)) {
      return true;
    }
    return false;
  });
}

/**
 * Eliminar una usuaria (solo admin)
 */
export async function deleteRegisteredUser(userId: string): Promise<boolean> {
  try {
    const users = getRegisteredUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(filtered));

    // Send DELETE to central server
    try {
      await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Server user delete error:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tyrofem_users_updated'));
    }

    return true;
  } catch (error) {
    console.error('Error deleting user', error);
    return false;
  }
}

// =========================================================================
// LÓGICA ROBUSTA DE VALIDACIÓN Y CONTROL DE ESTADO DE CÓDIGOS DE ACCESO
// =========================================================================

const STORAGE_KEY_USED_CODES_MAP = 'tyrofem_used_codes_registry';

/**
 * Comprueba si un código pertenece al listado oficial de 30 códigos únicos
 */
export function isCodeInOfficial30Batch(code: string): boolean {
  const clean = (code || '').toString().replace(/\D/g, '').trim();
  return OFFICIAL_30_VIP_CODES.includes(clean);
}

/**
 * Comprueba si un código está autorizado (lote de 30 códigos únicos, lote maestro o autorizados dinámicamente)
 */
export function isVIPCodeAuthorized(code: string): boolean {
  const clean = (code || '').toString().replace(/\D/g, '').trim();
  if (OFFICIAL_30_VIP_CODES.includes(clean)) return true;
  if (MASTER_AUTHORIZED_CODES.includes(clean)) return true;
  return isAuthorizedCode(clean);
}

export interface ServerCodesSnapshot {
  renewalEpoch: number;
  renewedAt?: string;
  codes: string[];
  details: Record<string, any>;
  redeemedCodes: Record<string, any>;
}

/**
 * Extrae limpiamente un código de 6 dígitos incluso si la usuaria pega texto con prefijos o dos puntos (ej. "01. 204815:")
 */
export function extractAccessCodeDigits(rawInput: string): string {
  const raw = (rawInput || '').toString();
  const sixDigitTokens = raw.match(/\d{6}/g);
  if (sixDigitTokens && sixDigitTokens.length > 0) {
    return sixDigitTokens[sixDigitTokens.length - 1];
  }
  return raw.replace(/\D/g, '').slice(0, 6);
}

/**
 * Sincroniza el estado de códigos autorizados, época de renovación y canjes desde el servidor central
 */
export async function syncCodesStateFromServer(): Promise<ServerCodesSnapshot | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`/api/authorized-codes?_t=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success) {
      if (Array.isArray(data.codes)) {
        syncAuthorizedCodesFromRemote(data.codes);
      }
      applyCodeRenewalSync(data.renewalEpoch, data.redeemedCodes);
      return {
        renewalEpoch: Number(data.renewalEpoch || 1),
        renewedAt: data.renewedAt,
        codes: Array.isArray(data.codes) ? data.codes : [],
        details: data.details || {},
        redeemedCodes: data.redeemedCodes || {}
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Renueva los 30 códigos VIP oficiales por 6 meses en el servidor y limpia cualquier bloqueo previo local
 */
export async function renewOfficial30CodesOnServer(validityMonths = 6): Promise<{
  success: boolean;
  renewalEpoch?: number;
  validUntil?: string;
  renewedAt?: string;
  renewedCount?: number;
  message?: string;
}> {
  try {
    const res = await fetch('/api/codes/renew-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validityMonths })
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data && data.success) {
      applyCodeRenewalSync(data.renewalEpoch, {});
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tyrofem_users_updated'));
      }
      return {
        success: true,
        renewalEpoch: data.renewalEpoch,
        validUntil: data.validUntil,
        renewedAt: data.renewedAt,
        renewedCount: data.renewedCount || 30
      };
    }
    return { success: false, message: 'No se pudo completar la renovación en el servidor.' };
  } catch (err) {
    console.warn('Error renewing 30 codes batch on server:', err);
    return { success: false, message: 'Error de conexión con el servidor al renovar códigos.' };
  }
}

/**
 * Obtener el mapa de códigos utilizados guardados localmente
 */
export function getRedeemedCodesMap(): Record<string, CodeRedemptionRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USED_CODES_MAP);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error al leer registro de códigos utilizados:', error);
    return {};
  }
}

/**
 * Verifica si un código de acceso ya fue utilizado por otra compradora
 * Si se proporciona el correo actual y coincide con la dueña original, retorna false para permitir reingreso
 */
export function isCodeUtilizado(code: string, currentEmail?: string): boolean {
  const cleanCode = (code || '').toString().replace(/\D/g, '').trim();
  if (!cleanCode || cleanCode === ADMIN_CREDENTIALS.code) return false;

  const cleanEmail = (currentEmail || '').trim().toLowerCase();

  // 1. Revisar en el registro local de códigos quemados
  try {
    const registry = getRedeemedCodesMap();
    const record = registry[cleanCode];
    if (record) {
      if (cleanEmail && record.userEmail && record.userEmail.toLowerCase() === cleanEmail) {
        return false; // Misma compradora legítima
      }
      return true; // Ya utilizado por otra persona
    }
  } catch (e) {
    // silent
  }

  // 2. Revisar en la lista de usuarias registradas en la base de datos
  const users = getRegisteredUsers();
  const existingWithCode = users.find(u => {
    const uCode = (u.vipCode || u.accessCode || '').toString().replace(/\D/g, '').trim();
    return uCode === cleanCode;
  });

  if (existingWithCode) {
    if (cleanEmail && existingWithCode.email && existingWithCode.email.toLowerCase() === cleanEmail) {
      return false; // Misma compradora
    }
    return true; // Ya registrado y utilizado por otra compradora
  }

  return false;
}

/**
 * Actualiza el estado del código a 'utilizado' inmediatamente al momento del primer ingreso exitoso
 * para evitar su re-utilización tanto en almacenamiento local como en el servidor central
 */
export function markCodeAsUsed(
  code: string,
  userDetails: { fullName: string; phone: string; email: string; id?: string }
): boolean {
  const cleanCode = (code || '').toString().replace(/\D/g, '').trim();
  if (!cleanCode || cleanCode === ADMIN_CREDENTIALS.code) return false;

  const redemptionRecord: CodeRedemptionRecord = {
    code: cleanCode,
    status: 'utilizado',
    redeemedAt: new Date().toISOString(),
    userName: userDetails.fullName || 'Compradora VIP',
    userPhone: userDetails.phone || '',
    userEmail: (userDetails.email || '').toLowerCase().trim(),
    userId: userDetails.id
  };

  // 1. Persistir inmediatamente en localStorage
  try {
    const registry = getRedeemedCodesMap();
    registry[cleanCode] = redemptionRecord;
    localStorage.setItem(STORAGE_KEY_USED_CODES_MAP, JSON.stringify(registry));
  } catch (error) {
    console.error('Error al registrar código utilizado en localStorage:', error);
  }

  // 2. Disparar sincronización inmediata al servidor central (/api/codes/redeem)
  fetch('/api/codes/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: cleanCode,
      userName: redemptionRecord.userName,
      userPhone: redemptionRecord.userPhone,
      userEmail: redemptionRecord.userEmail
    })
  }).catch(err => {
    console.warn('Aviso de sincronización de código al servidor:', err);
  });

  // 3. Notificar a componentes en tiempo real
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tyrofem_code_redeemed', { detail: redemptionRecord }));
  }

  return true;
}

/**
 * Quema y actualiza inmediatamente el código de acceso a estado 'utilizado'
 * al momento del primer ingreso exitoso para evitar re-utilización
 */
export async function consumeCodeOnFirstSuccessfulEntry(
  code: string,
  userDetails: { fullName: string; phone: string; email: string; id?: string }
): Promise<boolean> {
  const cleanCode = (code || '').toString().replace(/\D/g, '').trim();
  if (!cleanCode || cleanCode === ADMIN_CREDENTIALS.code) return false;

  const markedLocal = markCodeAsUsed(cleanCode, userDetails);

  // Confirmar persistencia inmediata en servidor central antes de continuar el flujo
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    await fetch('/api/codes/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        userName: userDetails.fullName || 'Compradora VIP',
        userPhone: userDetails.phone || '',
        userEmail: (userDetails.email || '').toLowerCase().trim()
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch {
    // Ya quedó registrado localmente; el fallback sincronizará al finalizar onboarding
  }

  return markedLocal;
}

/**
 * Lógica robusta de validación de códigos de acceso:
 * 1. Verifica formato (6 dígitos numéricos).
 * 2. Sincroniza época de renovación desde el servidor para liberar lotes renovados.
 * 3. Valida contra el listado de 30 códigos únicos de Tyruss Full (y lote maestro).
 * 4. Comprueba el estado de la cuenta (activa, suspendida, inhabilitada).
 * 5. Valida en servidor central y local si ya se encuentra en estado 'utilizado'.
 * 6. Si es reingreso de la misma compradora (mismo correo), permite acceso.
 * 7. Si es primer ingreso exitoso, deja listo para actualización inmediata a 'utilizado'.
 */
export async function validateAccessCodeRobust(
  code: string,
  userDetails?: { fullName?: string; phone?: string; email?: string }
): Promise<CodeValidationResult> {
  const cleanCode = extractAccessCodeDigits(code);
  const cleanEmail = (userDetails?.email || '').trim().toLowerCase();
  const cleanName = (userDetails?.fullName || '').trim();
  const cleanPhone = (userDetails?.phone || '').trim();

  // 1. Verificación sintáctica: debe tener exactamente 6 dígitos numéricos
  if (!cleanCode || cleanCode.length !== 6) {
    return {
      isValid: false,
      status: 'invalido',
      code: cleanCode,
      message: 'Por favor ingresa un código VIP válido de 6 dígitos numéricos.'
    };
  }

  // 2. Verificación de credenciales de Administrador ColShopi
  if (isAdminCredentials(cleanEmail, cleanCode) || cleanCode === ADMIN_CREDENTIALS.code) {
    return {
      isValid: true,
      status: 'disponible',
      code: cleanCode,
      message: 'Acceso de Administrador verificado con éxito.'
    };
  }

  // 3. Sincronizar estado vivo y época de renovación desde el servidor antes de validar localmente
  await syncCodesStateFromServer();

  // 4. Verificación contra el listado oficial de 30 códigos únicos y autorizados
  const isOfficial30 = isCodeInOfficial30Batch(cleanCode);
  const isAuthorized = isVIPCodeAuthorized(cleanCode);

  if (!isAuthorized) {
    return {
      isValid: false,
      status: 'invalido',
      code: cleanCode,
      message: '⛔ Código NO autorizado o no existe en la base de datos de ColShopi. Solo las compradoras verificadas de Tyruss Full reciben un código de acceso único. Solicita tu código oficial por WhatsApp a ColShopi: +57 310 400 7428.'
    };
  }

  // 5. Verificación de estado de cuenta existente (suspensión, inhabilitación o titularidad)
  const userByCode = findUserByCodeOrEmail(cleanCode);
  const userByEmail = cleanEmail ? findUserByCodeOrEmail(cleanEmail) : undefined;
  const existingUser = userByCode || userByEmail;

  if (existingUser) {
    if (existingUser.status === 'suspendida' || existingUser.status === 'suspended') {
      return {
        isValid: false,
        status: 'cuenta_suspendida',
        code: cleanCode,
        user: existingUser,
        message: `⚠️ Tu cuenta ha sido SUSPENDIDA temporalmente por la administración de ColShopi. ${
          existingUser.statusReason ? `Motivo: "${existingUser.statusReason}".` : ''
        } Comunícate con soporte al WhatsApp +57 310 400 7428 para reactivar tu acceso.`
      };
    }
    if (existingUser.status === 'inhabilitada') {
      return {
        isValid: false,
        status: 'cuenta_inhabilitada',
        code: cleanCode,
        user: existingUser,
        message: `⛔ Tu cuenta ha sido INHABILITADA de forma permanente por la administración de ColShopi. ${
          existingUser.statusReason ? `Motivo: "${existingUser.statusReason}".` : ''
        } Comunícate con soporte al WhatsApp +57 310 400 7428 si consideras que es un error.`
      };
    }
  }

  // 6. Validación autoritativa en Servidor Central vía API (/api/codes/validate)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch('/api/codes/validate', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (!data.valid) {
        if (data.reason === 'already_used') {
          return {
            isValid: false,
            status: 'utilizado',
            code: cleanCode,
            message: data.message || '⚠️ Este código de 6 dígitos ya fue utilizado y canjeado por otra compradora. Cada código es de USO ÚNICO e intransferible. Si necesitas activar tu acceso para tu nuevo pedido, escríbenos a WhatsApp para asignarte un código libre.'
          };
        }
        if (data.reason === 'expired') {
          return {
            isValid: false,
            status: 'invalido',
            code: cleanCode,
            message: data.message || '⚠️ Este código ha expirado su vigencia de 6 meses. Solicita tu renovación por WhatsApp.'
          };
        }
        if (data.reason === 'account_suspended') {
          return {
            isValid: false,
            status: 'cuenta_suspendida',
            code: cleanCode,
            message: data.message
          };
        }
        if (data.reason === 'account_disabled') {
          return {
            isValid: false,
            status: 'cuenta_inhabilitada',
            code: cleanCode,
            message: data.message
          };
        }
        return {
          isValid: false,
          status: 'invalido',
          code: cleanCode,
          message: data.message || '⛔ Código no válido en la base de datos de ColShopi.'
        };
      }

      if (data.status === 'returning_user') {
        return {
          isValid: true,
          status: 'cuenta_existente',
          code: cleanCode,
          user: userByCode || userByEmail,
          isReturningUser: true,
          message: 'Código verificado con éxito para tu cuenta registrada.'
        };
      }

      // Servidor confirmó explícitamente que el código está activo y disponible para primer ingreso
      if (data.status === 'active') {
        return {
          isValid: true,
          status: 'disponible',
          code: cleanCode,
          isFirstTimeUsage: true,
          message: isOfficial30
            ? '✅ Código VIP renovado y verificado exitosamente para tu primer ingreso.'
            : '✅ Código VIP autorizado y verificado exitosamente.'
        };
      }
    }
  } catch (netErr) {
    console.log('Validación de código en modo local fallback:', netErr);
  }

  // 7. Fallback local anti-reutilización (cuando no hay conexión con servidor)
  if (userByCode && (userByCode.status === 'active' || userByCode.status === 'activa')) {
    const ownerEmail = (userByCode.email || '').trim().toLowerCase();
    if (cleanEmail && ownerEmail && ownerEmail === cleanEmail) {
      return {
        isValid: true,
        status: 'cuenta_existente',
        code: cleanCode,
        user: userByCode,
        isReturningUser: true,
        message: `¡Bienvenida de vuelta, ${userByCode.fullName || userByCode.name}! Tu cuenta y progreso han sido verificados.`
      };
    }
    return {
      isValid: false,
      status: 'utilizado',
      code: cleanCode,
      message: '⚠️ Este código de 6 dígitos ya fue utilizado y activado previamente por otra compradora. Cada código es de USO ÚNICO e intransferible. Si necesitas activar tu acceso para tu nuevo pedido, escríbenos a WhatsApp para asignarte un código libre.'
    };
  }

  if (isCodeUtilizado(cleanCode, cleanEmail)) {
    return {
      isValid: false,
      status: 'utilizado',
      code: cleanCode,
      message: '⚠️ Este código de 6 dígitos ya fue utilizado y activado previamente por otra compradora. Cada código es de USO ÚNICO e intransferible. Si necesitas activar tu acceso para tu nuevo pedido, escríbenos a WhatsApp para asignarte un código libre.'
    };
  }

  // 8. Código verificado con éxito y disponible para su primer ingreso
  return {
    isValid: true,
    status: 'disponible',
    code: cleanCode,
    isFirstTimeUsage: true,
    message: isOfficial30
      ? '✅ Código VIP verificado exitosamente en la lista oficial de 30 códigos únicos de ColShopi.'
      : '✅ Código VIP autorizado y verificado exitosamente.'
  };
}

/**
 * Exportar Registro Completo de Usuarias a Archivo Excel (.XLSX)
 */
export function exportUsersToExcelFile(users?: MasterUserData[]): { success: boolean; filename: string } {
  try {
    const userList = users || getRegisteredUsers();
    const redeemedRegistry = getRedeemedCodesRegistry();

    // 1. Hoja 1: Registro Maestro Detallado de Usuarias
    const usersDataForExcel = userList.map((u, index) => {
      const formattedDate = new Date(u.registrationDate || u.registeredAt || Date.now()).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      const formattedLast = u.lastActivityAt ? new Date(u.lastActivityAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A';

      const statusSpanish = 
        u.status === 'active' || u.status === 'activa' ? 'ACTIVA (Habilitada)' :
        u.status === 'suspended' || u.status === 'suspendida' ? 'SUSPENDIDA' : 'COMPLETADO 30D';

      return {
        'N°': index + 1,
        'ID Usuaria': u.id,
        'Nombre Completo': u.fullName || u.name,
        'Código VIP (6 Dígitos)': u.vipCode || u.accessCode,
        'Correo Electrónico': u.email,
        'Teléfono WhatsApp': u.phone,
        'Estado de Acceso': statusSpanish,
        'Motivo de Estado': u.statusReason || 'Acceso regular concedido',
        'Objetivo Principal': u.healthGoal || getAngleLabel(u.primaryAngle),
        'Rango de Edad': u.ageGroup || '35-44 años',
        'Progreso Reto': `Día ${u.currentDay || 1} de 30`,
        'Días Completados': u.completedDaysCount ?? u.completedDays ?? 0,
        'Adherencia (%)': `${u.adherencePercentage ?? u.adherencePercent ?? 0}%`,
        'Última Acción': u.lastAction || 'N/A',
        'Fecha de Registro': formattedDate,
        'Última Actividad': formattedLast,
        'Síntomas Reportados': (u.symptoms || []).join('; '),
        'Total Eventos Historial': Array.isArray(u.historyLog) ? u.historyLog.length : 0,
        'Notas': u.notes || ''
      };
    });

    // 2. Hoja 2: Resumen Ejecutivo y Estadísticas
    const totalUsers = userList.length;
    const activeCount = userList.filter(u => u.status === 'active' || u.status === 'activa').length;
    const suspendedCount = userList.filter(u => u.status === 'suspended' || u.status === 'suspendida').length;
    const completedCount = userList.filter(u => u.status === 'completed_30d').length;
    const avgAdherence = totalUsers > 0 
      ? Math.round(userList.reduce((acc, u) => acc + (u.adherencePercentage || u.adherencePercent || 0), 0) / totalUsers)
      : 0;
    
    const totalMasterCodes = MASTER_AUTHORIZED_CODES.length;
    const totalUsedCodes = Math.max(Object.keys(redeemedRegistry).length, totalUsers);
    const availableCodes = Math.max(0, totalMasterCodes - totalUsedCodes);

    const summaryDataForExcel = [
      { 'Métrica / Indicador': 'Total de Usuarias Registradas en Base de Datos Central', 'Valor': totalUsers, 'Detalle': 'Base central TyroFem 30D ColShopi' },
      { 'Métrica / Indicador': 'Usuarias Activas (Habilitadas)', 'Valor': activeCount, 'Detalle': `${Math.round((activeCount / (totalUsers || 1)) * 100)}% del total` },
      { 'Métrica / Indicador': 'Usuarias Suspendidas', 'Valor': suspendedCount, 'Detalle': 'Acceso pausado por administración' },
      { 'Métrica / Indicador': 'Usuarias con Reto 30D Completado', 'Valor': completedCount, 'Detalle': 'Completaron los 30 días de transformación' },
      { 'Métrica / Indicador': 'Promedio Global de Adherencia al Reto 30D', 'Valor': `${avgAdherence}%`, 'Detalle': 'Seguimiento tomas Tyruss Full y hábitos diarios' },
      { 'Métrica / Indicador': 'Total Códigos VIP Autorizados (Lote Oficial)', 'Valor': totalMasterCodes, 'Detalle': 'Base maestra de 50 códigos de 6 dígitos' },
      { 'Métrica / Indicador': 'Códigos VIP Canjeados y Registrados', 'Valor': totalUsedCodes, 'Detalle': `${totalUsedCodes}/50 códigos canjeados` },
      { 'Métrica / Indicador': 'Códigos VIP Disponibles para Nuevos Pedidos', 'Valor': availableCodes, 'Detalle': 'Listos para ser entregados por WhatsApp' },
      { 'Métrica / Indicador': 'Fecha de Generación del Reporte', 'Valor': new Date().toLocaleString('es-CO'), 'Detalle': 'Generado desde Panel Admin ColShopi' },
      { 'Métrica / Indicador': 'Administrador Responsable', 'Valor': ADMIN_CREDENTIALS.email, 'Detalle': 'ColShopi Tienda By Leps Digital' }
    ];

    // 3. Create Workbook
    const workbook = XLSX.utils.book_new();

    const wsUsers = XLSX.utils.json_to_sheet(usersDataForExcel);
    const wsSummary = XLSX.utils.json_to_sheet(summaryDataForExcel);

    // Set column widths for sheet 1
    wsUsers['!cols'] = [
      { wch: 5 },   // N°
      { wch: 15 },  // ID
      { wch: 30 },  // Nombre
      { wch: 15 },  // VIP Code
      { wch: 32 },  // Correo
      { wch: 18 },  // Teléfono
      { wch: 24 },  // Estado
      { wch: 30 },  // Motivo
      { wch: 28 },  // Objetivo
      { wch: 15 },  // Edad
      { wch: 16 },  // Progreso
      { wch: 16 },  // Días comp
      { wch: 15 },  // Adherencia
      { wch: 30 },  // Última Acción
      { wch: 22 },  // Fecha Reg
      { wch: 22 },  // Ult Act
      { wch: 45 },  // Síntomas
      { wch: 15 },  // Eventos
      { wch: 35 }   // Notas
    ];

    // Set column widths for sheet 2
    wsSummary['!cols'] = [
      { wch: 45 },
      { wch: 20 },
      { wch: 45 }
    ];

    XLSX.utils.book_append_sheet(workbook, wsUsers, 'Usuarias TyroFem 30D');
    XLSX.utils.book_append_sheet(workbook, wsSummary, 'Resumen & Métricas');

    const nowStr = new Date().toISOString().slice(0, 10);
    const filename = `Registro_Maestro_Usuarias_TyroFem_30D_ColShopi_${nowStr}.xlsx`;

    XLSX.writeFile(workbook, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting users to Excel', error);
    return { success: false, filename: '' };
  }
}

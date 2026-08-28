import * as XLSX from 'xlsx';
import { HealthAngle, UserProfile } from '../types';
import { MASTER_AUTHORIZED_CODES, getRedeemedCodesRegistry } from './authorizedCodes';

export type UserStatus = 'active' | 'suspended' | 'completed_30d' | 'activa' | 'suspendida' | 'inhabilitada';

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
      status: normalizeUserStatus(u.status)
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
        status: normalizeUserStatus(u.status)
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
      notes: user.notes || 'Registro oficial en ColShopi Tienda TyroFem 30D'
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
  return users.find(u => 
    u.email.toLowerCase() === clean || 
    (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode)) ||
    (cleanCode.length >= 6 && u.phone.replace(/\D/g, '').includes(cleanCode))
  );
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

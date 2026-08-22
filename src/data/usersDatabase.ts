import * as XLSX from 'xlsx';
import { HealthAngle, UserProfile } from '../types';
import { MASTER_AUTHORIZED_CODES, getRedeemedCodesRegistry } from './authorizedCodes';

export type UserStatus = 'activa' | 'suspendida' | 'inhabilitada';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  accessCode: string;
  ageGroup: string;
  primaryAngle: HealthAngle;
  symptoms: string[];
  startDate: string;
  currentDay: number;
  completedDays: number;
  adherencePercent: number;
  status: UserStatus;
  statusReason?: string;
  registeredAt: string;
  lastActivityAt?: string;
  notes?: string;
}

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
const MOCK_USER_IDS = ['usr_849201', 'usr_623914', 'usr_518472', 'usr_934165', 'usr_412893', 'usr_735628'];

/**
 * Obtener todas las usuarias registradas en la base de datos (Memoria Local/Cache)
 */
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (!raw) {
      return [];
    }
    const parsed: RegisteredUser[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out any leftover development mock users
    const cleanUsers = parsed.filter(u => !MOCK_USER_IDS.includes(u.id));
    if (cleanUsers.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(cleanUsers));
    }
    return cleanUsers;
  } catch (error) {
    console.error('Error fetching registered users', error);
    return [];
  }
}

/**
 * Obtener usuarias directamente desde el servidor centralizado de ColShopi
 */
export async function fetchRegisteredUsersFromServer(): Promise<RegisteredUser[]> {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.users)) {
      const serverUsers: RegisteredUser[] = data.users.filter((u: any) => !MOCK_USER_IDS.includes(u.id));
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(serverUsers));
      return serverUsers;
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
export function saveRegisteredUser(user: RegisteredUser): void {
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(
      u => u.id === user.id || 
           (user.email && u.email.toLowerCase() === user.email.toLowerCase()) || 
           (user.accessCode && u.accessCode === user.accessCode)
    );

    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...user,
        lastActivityAt: new Date().toISOString()
      };
    } else {
      users.unshift({
        ...user,
        registeredAt: user.registeredAt || new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      });
    }

    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

    // Dispatch background sync to centralized server
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).catch(err => {
      console.warn('Background sync to server failed:', err);
    });

    // Notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tyrofem_users_updated', { detail: user }));
    }
  } catch (error) {
    console.error('Error saving user to registry', error);
  }
}

/**
 * Sincronizar el progreso diario y sesión activa de la usuaria con el servidor
 */
export function syncUserSessionToServer(userProfile: UserProfile | null, progressMap?: Record<number, any>): void {
  if (!userProfile || userProfile.isAdmin) return;

  const payload = {
    userProfile: {
      ...userProfile,
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      accessCode: userProfile.accessCode,
      primaryAngle: userProfile.primaryAngle,
      ageGroup: userProfile.ageGroup,
      symptoms: userProfile.symptoms,
      startDate: userProfile.startDate,
      status: userProfile.status || 'activa',
      statusReason: userProfile.statusReason
    },
    progressMap: progressMap || {}
  };

  fetch('/api/users/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => {
    console.warn('Error syncing session to server:', err);
  });
}

/**
 * Cambiar el estado de una usuaria: Habilitar ('activa'), Suspender ('suspendida'), Inhabilitar ('inhabilitada')
 */
export async function updateUserStatus(userIdOrEmail: string, status: UserStatus, reason?: string): Promise<boolean> {
  try {
    const users = getRegisteredUsers();
    const cleanQuery = userIdOrEmail.trim().toLowerCase();
    const userIndex = users.findIndex(
      u => u.id === userIdOrEmail || u.email.toLowerCase() === cleanQuery || u.accessCode === cleanQuery
    );

    if (userIndex >= 0) {
      users[userIndex].status = status;
      if (reason !== undefined) {
        users[userIndex].statusReason = reason;
      } else if (status === 'activa') {
        users[userIndex].statusReason = undefined;
      }
      users[userIndex].lastActivityAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    }

    // Sync to local profile if it matches current active session
    try {
      const currentProfileRaw = localStorage.getItem('tyrofem_user_profile');
      if (currentProfileRaw) {
        const currentProfile = JSON.parse(currentProfileRaw);
        if (
          currentProfile.email?.toLowerCase() === cleanQuery ||
          currentProfile.accessCode === cleanQuery ||
          currentProfile.id === userIdOrEmail
        ) {
          currentProfile.status = status;
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
        body: JSON.stringify({ status, reason })
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
export function findUserByCodeOrEmail(query: string): RegisteredUser | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();
  const cleanCode = query.replace(/\D/g, '').trim();
  const users = getRegisteredUsers();
  return users.find(u => 
    u.email.toLowerCase() === clean || 
    (cleanCode && u.accessCode === cleanCode) ||
    u.phone.replace(/\D/g, '').includes(cleanCode)
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
 * Helper para traducir el ángulo clínico a nombre legible
 */
export function getAngleLabel(angle: HealthAngle): string {
  switch (angle) {
    case 'tiroides_metabolismo':
      return 'Tiroides & Metabolismo';
    case 'desbalance_menopausia':
      return 'Hormonal & Menopausia';
    case 'ciclos_spm':
      return 'Ciclos SPM & Dolor';
    case 'digestion_detox':
      return 'Digestión & Detox';
    default:
      return 'Tiroides & Metabolismo';
  }
}

/**
 * Exportar Registro Completo de Usuarias a Archivo Excel (.XLSX)
 */
export function exportUsersToExcelFile(users?: RegisteredUser[]): { success: boolean; filename: string } {
  try {
    const userList = users || getRegisteredUsers();
    const redeemedRegistry = getRedeemedCodesRegistry();

    // 1. Hoja 1: Registro Detallado de Usuarias
    const usersDataForExcel = userList.map((u, index) => {
      const formattedDate = new Date(u.registeredAt).toLocaleDateString('es-CO', {
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
        u.status === 'activa' ? 'ACTIVA (Habilitada)' :
        u.status === 'suspendida' ? 'SUSPENDIDA' : 'INHABILITADA (Bloqueada)';

      return {
        'N°': index + 1,
        'ID Usuaria': u.id,
        'Nombre Completo': u.name,
        'Correo Electrónico': u.email,
        'Teléfono WhatsApp': u.phone,
        'Código VIP (6 Dígitos)': u.accessCode,
        'Estado de Acceso': statusSpanish,
        'Motivo / Observación de Estado': u.statusReason || 'Acceso regular concedido',
        'Objetivo de Salud': getAngleLabel(u.primaryAngle),
        'Rango de Edad': u.ageGroup || '35-44 años',
        'Día Actual en App': `Día ${u.currentDay} de 30`,
        'Días Completados': u.completedDays,
        'Adherencia (%)': `${u.adherencePercent}%`,
        'Fecha de Registro': formattedDate,
        'Última Actividad': formattedLast,
        'Síntomas Reportados': (u.symptoms || []).join('; '),
        'Notas de Seguimiento': u.notes || ''
      };
    });

    // 2. Hoja 2: Resumen Ejecutivo y Estadísticas
    const totalUsers = userList.length;
    const activeCount = userList.filter(u => u.status === 'activa').length;
    const suspendedCount = userList.filter(u => u.status === 'suspendida').length;
    const disabledCount = userList.filter(u => u.status === 'inhabilitada').length;
    const avgAdherence = totalUsers > 0 
      ? Math.round(userList.reduce((acc, u) => acc + (u.adherencePercent || 0), 0) / totalUsers)
      : 0;
    
    const totalMasterCodes = MASTER_AUTHORIZED_CODES.length;
    const totalUsedCodes = Object.keys(redeemedRegistry).length;
    const availableCodes = totalMasterCodes - totalUsedCodes;

    const summaryDataForExcel = [
      { 'Métrica / Indicador': 'Total de Usuarias Registradas en Base de Datos Central', 'Valor': totalUsers, 'Detalle': 'Base central TyroFem 30D ColShopi' },
      { 'Métrica / Indicador': 'Usuarias Activas (Habilitadas)', 'Valor': activeCount, 'Detalle': `${Math.round((activeCount / (totalUsers || 1)) * 100)}% del total` },
      { 'Métrica / Indicador': 'Usuarias Suspendidas Temporalmente', 'Valor': suspendedCount, 'Detalle': 'Por revisión o infracción leve' },
      { 'Métrica / Indicador': 'Usuarias Inhabilitadas Permanentemente', 'Valor': disabledCount, 'Detalle': 'Acceso revocado por administración' },
      { 'Métrica / Indicador': 'Promedio Global de Adherencia al Reto 30D', 'Valor': `${avgAdherence}%`, 'Detalle': 'Seguimiento tomas Tyruss Full y hábitos' },
      { 'Métrica / Indicador': 'Total Códigos VIP Autorizados (Lote Oficial)', 'Valor': totalMasterCodes, 'Detalle': 'Base maestra de 50 códigos de 6 dígitos' },
      { 'Métrica / Indicador': 'Códigos VIP Canjeados y Quemados', 'Valor': totalUsedCodes, 'Detalle': 'Asignados a compradoras verificadas' },
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
      { wch: 32 },  // Correo
      { wch: 18 },  // Teléfono
      { wch: 15 },  // Código
      { wch: 24 },  // Estado
      { wch: 35 },  // Motivo
      { wch: 25 },  // Objetivo
      { wch: 15 },  // Edad
      { wch: 16 },  // Día
      { wch: 16 },  // Días comp
      { wch: 15 },  // Adherencia
      { wch: 22 },  // Fecha Reg
      { wch: 22 },  // Ult Act
      { wch: 45 },  // Síntomas
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

    // Generate filename with timestamp
    const nowStr = new Date().toISOString().slice(0, 10);
    const filename = `Registro_Usuarias_TyroFem_30D_ColShopi_${nowStr}.xlsx`;

    // Download file in browser
    XLSX.writeFile(workbook, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting users to Excel', error);
    return { success: false, filename: '' };
  }
}

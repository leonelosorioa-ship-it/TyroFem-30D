/**
 * Base de Datos Oficial de 50 Códigos de Acceso VIP Únicos (6 Dígitos Numéricos)
 * para Compradoras de Tyruss Full (500g) - ColShopi Tienda By Leps Digital
 */

export interface CodeRedemptionInfo {
  code: string;
  redeemedAt: string;
  userName: string;
  userPhone: string;
  userEmail: string;
}

export const NEW_BATCH_30_CODES: string[] = [
  '204815', '315926', '426137', '537248', '648359',
  '759461', '861572', '972683', '183794', '294105',
  '305216', '416327', '527438', '638549', '749651',
  '851762', '962873', '173495', '284506', '395617',
  '406728', '517839', '628941', '739152', '841263',
  '952374', '163485', '274596', '385607', '496718'
];

export const MASTER_AUTHORIZED_CODES: string[] = [
  // Lote 30 Códigos Nuevos de Entrega Manual (Uso Único)
  ...NEW_BATCH_30_CODES,

  // Códigos autorizados anteriores
  '125294', '138371',
  '849201', '623914', '518472', '934165', '412893',
  '735628', '294817', '658231', '381946', '947253',
  '163892', '529471', '837164', '249583', '618395',
  '472918', '953826', '318479', '764295', '582931',
  '194837', '638291', '429175', '857392', '361849',
  '792461', '518394', '284719', '946283', '673915',
  '395821', '814729', '258394', '749163', '462839',
  '928374', '173958', '584923', '349581', '692847',
  '827391', '491827', '738492', '263918', '915824',
  '538472', '372916', '849173', '619284', '482937'
];

const STORAGE_KEY_USED_CODES = 'tyrofem_used_codes_registry';
const STORAGE_KEY_CUSTOM_AUTHORIZED_CODES = 'tyrofem_custom_authorized_codes';

/**
 * Obtener códigos adicionales autorizados manualmente
 */
export function getCustomAuthorizedCodes(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_AUTHORIZED_CODES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading custom authorized codes', error);
    return [];
  }
}

/**
 * Agrega un nuevo código a la lista de autorizados dinámicamente
 */
export function addCustomAuthorizedCode(code: string): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  if (cleanCode.length !== 6) return false;
  try {
    const current = getCustomAuthorizedCodes();
    if (!current.includes(cleanCode) && !MASTER_AUTHORIZED_CODES.includes(cleanCode)) {
      current.push(cleanCode);
      localStorage.setItem(STORAGE_KEY_CUSTOM_AUTHORIZED_CODES, JSON.stringify(current));
    }
    return true;
  } catch (e) {
    console.error('Error adding custom authorized code', e);
    return false;
  }
}

/**
 * Obtiene todos los códigos autorizados (maestros + dinámicos)
 */
export function getAllAuthorizedCodes(): string[] {
  const custom = getCustomAuthorizedCodes();
  const set = new Set([...MASTER_AUTHORIZED_CODES, ...custom]);
  return Array.from(set);
}

/**
 * Obtener el historial de códigos canjeados almacenados localmente
 */
export function getRedeemedCodesRegistry(): Record<string, CodeRedemptionInfo> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USED_CODES);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading redeemed codes registry', error);
    return {};
  }
}

/**
 * Verifica si un código de 6 dígitos pertenece a la base de datos oficial de códigos autorizados
 */
export function isAuthorizedCode(code: string): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  if (MASTER_AUTHORIZED_CODES.includes(cleanCode)) return true;
  const custom = getCustomAuthorizedCodes();
  return custom.includes(cleanCode);
}

/**
 * Verifica si un código ya fue canjeado previamente por otra usuaria
 */
export function isCodeAlreadyUsed(code: string, currentSavedCode?: string, currentEmail?: string): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  // Si la usuaria actual ya tiene este código en su sesión, no la bloqueamos a ella misma
  if (currentSavedCode && currentSavedCode === cleanCode) {
    return false;
  }
  const registry = getRedeemedCodesRegistry();
  const found = registry[cleanCode];
  if (!found) return false;

  if (currentEmail && found.userEmail && found.userEmail.toLowerCase() === currentEmail.toLowerCase().trim()) {
    return false;
  }

  return true;
}

/**
 * Registra y quema el código para que sea de uso único
 */
export function markCodeAsRedeemed(code: string, info: { userName: string; userPhone: string; userEmail: string }): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  if (!isAuthorizedCode(cleanCode)) return false;

  const registry = getRedeemedCodesRegistry();
  const redemption: CodeRedemptionInfo = {
    code: cleanCode,
    redeemedAt: new Date().toISOString(),
    userName: info.userName,
    userPhone: info.userPhone,
    userEmail: info.userEmail
  };
  registry[cleanCode] = redemption;

  try {
    localStorage.setItem(STORAGE_KEY_USED_CODES, JSON.stringify(registry));
  } catch (error) {
    console.error('Error saving code redemption to localStorage', error);
  }

  // Background sync to server API
  fetch('/api/codes/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(redemption)
  }).catch(err => {
    console.warn('Could not sync code redemption to server:', err);
  });

  return true;
}

/**
 * Obtiene lista de códigos disponibles y usados calculando la unión entre el registro local y la lista de usuarias
 */
export function getCodesStatusSummary(registeredUsers?: Array<{ accessCode?: string; name?: string; phone?: string; email?: string; registeredAt?: string }>) {
  const registry = { ...getRedeemedCodesRegistry() };

  // Sync users into registry summary
  if (registeredUsers && Array.isArray(registeredUsers)) {
    registeredUsers.forEach(u => {
      if (u.accessCode && isAuthorizedCode(u.accessCode)) {
        const cleanCode = u.accessCode.replace(/\D/g, '').trim();
        if (!registry[cleanCode]) {
          registry[cleanCode] = {
            code: cleanCode,
            redeemedAt: u.registeredAt || new Date().toISOString(),
            userName: u.name || 'Compradora VIP',
            userPhone: u.phone || '',
            userEmail: u.email || ''
          };
        }
      }
    });
  }

  const allCodes = getAllAuthorizedCodes();
  const total = allCodes.length;
  const usedCodesList = Object.keys(registry);
  const usedCount = usedCodesList.length;
  const availableCount = Math.max(0, total - usedCount);

  return {
    total,
    usedCount,
    availableCount,
    registry,
    masterList: allCodes
  };
}

/**
 * Sincroniza códigos autorizados recibidos del servidor remoto en el almacenamiento local
 */
export function syncAuthorizedCodesFromRemote(remoteCodes: string[]): void {
  if (!Array.isArray(remoteCodes) || remoteCodes.length === 0) return;
  try {
    const current = getCustomAuthorizedCodes();
    const set = new Set([...current]);
    remoteCodes.forEach((c) => {
      const clean = c.replace(/\D/g, '').trim();
      if (clean.length === 6 && !MASTER_AUTHORIZED_CODES.includes(clean)) {
        set.add(clean);
      }
    });
    localStorage.setItem(STORAGE_KEY_CUSTOM_AUTHORIZED_CODES, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Error syncing remote authorized codes:', err);
  }
}

/**
 * Validador dual (remoto con fallback local ultra-seguro) de códigos de 6 dígitos
 */
export async function validateCodeOnline(
  code: string,
  email: string,
  name?: string,
  phone?: string
): Promise<{ valid: boolean; reason?: string; message?: string }> {
  const cleanCode = code.replace(/\D/g, '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Intento de validación con servidor central vía API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('/api/codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        email: cleanEmail,
        name: (name || '').trim(),
        phone: (phone || '').trim()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.valid) {
        // Asegurar que el código quede autorizado en local para siempre
        addCustomAuthorizedCode(cleanCode);
        return { valid: true };
      } else {
        return {
          valid: false,
          reason: data.reason || 'unauthorized',
          message: data.message || 'Código no válido.'
        };
      }
    }
  } catch (err) {
    console.log('Validación offline fallback:', err);
  }

  // 2. Fallback local: Comprobación contra base maestra local
  if (!isAuthorizedCode(cleanCode)) {
    return {
      valid: false,
      reason: 'unauthorized',
      message:
        '⛔ Código NO autorizado o no existe en la base de datos de ColShopi. Solo las compradoras verificadas de Tyruss Full reciben un código de acceso. Solicita tu código oficial por WhatsApp a ColShopi: +57 310 400 7428.'
    };
  }

  if (isCodeAlreadyUsed(cleanCode, undefined, cleanEmail)) {
    return {
      valid: false,
      reason: 'already_used',
      message:
        '⚠️ Este código de 6 dígitos ya fue canjeado y activado previamente por otra compradora. Cada código es de USO ÚNICO e intransferible. Si necesitas activar tu acceso para tu nuevo pedido, escríbenos a WhatsApp para asignarte un código libre.'
    };
  }

  return { valid: true };
}


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

export const MASTER_AUTHORIZED_CODES: string[] = [
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
 * Verifica si un código de 6 dígitos pertenece a la base de datos oficial de los 50 códigos
 */
export function isAuthorizedCode(code: string): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  return MASTER_AUTHORIZED_CODES.includes(cleanCode);
}

/**
 * Verifica si un código ya fue canjeado previamente por otra usuaria
 */
export function isCodeAlreadyUsed(code: string, currentSavedCode?: string): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  // Si la usuaria actual ya tiene este código en su sesión, no la bloqueamos a ella misma
  if (currentSavedCode && currentSavedCode === cleanCode) {
    return false;
  }
  const registry = getRedeemedCodesRegistry();
  return Boolean(registry[cleanCode]);
}

/**
 * Registra y quema el código para que sea de uso único
 */
export function markCodeAsRedeemed(code: string, info: { userName: string; userPhone: string; userEmail: string }): boolean {
  const cleanCode = code.replace(/\D/g, '').trim();
  if (!isAuthorizedCode(cleanCode)) return false;

  const registry = getRedeemedCodesRegistry();
  registry[cleanCode] = {
    code: cleanCode,
    redeemedAt: new Date().toISOString(),
    userName: info.userName,
    userPhone: info.userPhone,
    userEmail: info.userEmail
  };

  try {
    localStorage.setItem(STORAGE_KEY_USED_CODES, JSON.stringify(registry));
    return true;
  } catch (error) {
    console.error('Error saving code redemption', error);
    return false;
  }
}

/**
 * Obtiene lista de códigos disponibles y usados
 */
export function getCodesStatusSummary() {
  const registry = getRedeemedCodesRegistry();
  const total = MASTER_AUTHORIZED_CODES.length;
  const usedCodesList = Object.keys(registry);
  const usedCount = usedCodesList.length;
  const availableCount = total - usedCount;

  return {
    total,
    usedCount,
    availableCount,
    registry,
    masterList: MASTER_AUTHORIZED_CODES
  };
}

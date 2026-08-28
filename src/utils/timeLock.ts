/**
 * TimeLock Utility for TyroFem 30D
 * Enforces strict 1-to-30 linear sequential unlocking with an exact 24-Hour countdown.
 * 
 * REGLAS DE ORO DE DESBLOQUEO Y PROGRESIÓN (INQUEBRANTABLES):
 * 1. Secuencia 100% Lineal y Progresiva: La usuaria NUNCA puede saltarse ningún día.
 *    Para que el Día N+1 esté en cuenta regresiva o activo, los días 1..N deben estar COMPLETADOS.
 * 2. Temporizador Exacto de 24 Horas: Cuando el Día N se completa, el Día N+1 entra en estado
 *    COUNTDOWN por exactamente 24 horas (COOLDOWN_MS = 24 * 60 * 60 * 1000).
 *    SOLO al llegar a 00:00:00 el Día N+1 pasa a ACTIVE ("Hoy Activo").
 * 3. Bloqueo Total de Días Futuros: Días de N+2 a 30 permanecen LOCKED con candado gris simple (sin timer).
 * 4. Día 1 siempre está ACTIVE al iniciar el programa (0 completados).
 */

import { DayProgress, UserProfile } from '../types';

export const COOLDOWN_HOURS = 24;
export const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000; // 86,400,000 ms
export const DAY_DURATION_MS = COOLDOWN_MS;

export type DayStateStatus = 'COMPLETED' | 'ACTIVE' | 'COUNTDOWN' | 'LOCKED';

export interface TimeRemaining {
  isUnlocked: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  formatted: string; // "HH:MM:SS"
  formattedLong: string; // "Xh Ym Zs"
}

export interface DayStatusInfo {
  status: DayStateStatus;
  canInteract: boolean;
  isCompleted: boolean;
  isActive: boolean;
  isCountdown: boolean;
  isLocked: boolean;
  remainingMs: number;
  formattedCountdown: string;
  formattedCountdownLong: string;
  hours: number;
  minutes: number;
  seconds: number;
  targetDay: number;
}

/**
 * Returns array of strictly consecutive completed days [1, 2, ..., N].
 * Prevents non-sequential skips.
 */
export function getConsecutiveCompletedDays(progressMap?: Record<number, DayProgress> | null): number[] {
  if (!progressMap || typeof progressMap !== 'object') return [];
  
  const completed: number[] = [];
  for (let d = 1; d <= 30; d++) {
    const p = progressMap[d];
    const isDone = Boolean(p && (p.completedAt || (p.tyrussTaken && p.water2L) || p.isLockedAfterSubmit));
    if (isDone) {
      completed.push(d);
    } else {
      // Linear rule: Stop at the first uncompleted day
      break;
    }
  }
  return completed;
}

/**
 * Get the timestamp (in ms) when the latest day in sequence was completed.
 */
export function getLastCompletedTimestamp(
  progressMap?: Record<number, DayProgress> | null, 
  userProfile?: UserProfile | null
): number {
  // Check localStorage first
  try {
    const stored = localStorage.getItem('tyrofem_last_completed_timestamp');
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // silent
  }

  // Check userProfile
  if (userProfile?.lastCompletedTimestamp && typeof userProfile.lastCompletedTimestamp === 'number') {
    return userProfile.lastCompletedTimestamp;
  }

  // Fallback: check progressMap for the latest completed day's completedAt string
  const completedDays = getConsecutiveCompletedDays(progressMap);
  if (completedDays.length > 0) {
    const lastDay = completedDays[completedDays.length - 1];
    const completedAtStr = progressMap?.[lastDay]?.completedAt;
    if (completedAtStr) {
      const parsed = new Date(completedAtStr).getTime();
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return 0;
}

/**
 * Save completion timestamp in localStorage and return the timestamp
 */
export function recordDayCompletionTimestamp(): number {
  const timestamp = Date.now();
  try {
    localStorage.setItem('tyrofem_last_completed_timestamp', timestamp.toString());
  } catch (e) {
    // silent
  }
  return timestamp;
}

/**
 * Helper to format ms to HH:MM:SS
 */
export function formatMsToHHMMSS(diffMs: number): {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  formattedLong: string;
} {
  if (diffMs <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: '00:00:00',
      formattedLong: '0h 00m 00s'
    };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return {
    hours,
    minutes,
    seconds,
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    formattedLong: `${hours}h ${pad(minutes)}m ${pad(seconds)}s`
  };
}

/**
 * Central State Calculation for any Day (1..30)
 * Evaluates whether a day is COMPLETED, ACTIVE, COUNTDOWN (24h timer), or LOCKED.
 */
export function getDayStatus(
  dayNumber: number,
  progressMap?: Record<number, DayProgress> | null,
  userProfile?: UserProfile | null
): DayStatusInfo {
  const completedDays = getConsecutiveCompletedDays(progressMap);
  const isCompleted = completedDays.includes(dayNumber);
  const currentTargetDay = Math.min(30, completedDays.length + 1);

  // 1. If day is already completed in sequence
  if (isCompleted) {
    return {
      status: 'COMPLETED',
      canInteract: false, // Read-only viewing
      isCompleted: true,
      isActive: false,
      isCountdown: false,
      isLocked: false,
      remainingMs: 0,
      formattedCountdown: '00:00:00',
      formattedCountdownLong: '0h 00m 00s',
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDay: currentTargetDay
    };
  }

  // If all 30 days are complete
  if (completedDays.length >= 30) {
    return {
      status: 'COMPLETED',
      canInteract: false,
      isCompleted: true,
      isActive: false,
      isCountdown: false,
      isLocked: false,
      remainingMs: 0,
      formattedCountdown: '00:00:00',
      formattedCountdownLong: '0h 00m 00s',
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetDay: 30
    };
  }

  // 2. If this is the immediate NEXT day in sequence (currentTargetDay)
  if (dayNumber === currentTargetDay) {
    // Day 1 is ALWAYS ACTIVE at the beginning (0 completed days)
    if (completedDays.length === 0) {
      return {
        status: 'ACTIVE',
        canInteract: true,
        isCompleted: false,
        isActive: true,
        isCountdown: false,
        isLocked: false,
        remainingMs: 0,
        formattedCountdown: '00:00:00',
        formattedCountdownLong: '0h 00m 00s',
        hours: 0,
        minutes: 0,
        seconds: 0,
        targetDay: currentTargetDay
      };
    }

    const lastCompletedTimestamp = getLastCompletedTimestamp(progressMap, userProfile);
    const now = Date.now();
    const unlockTime = (lastCompletedTimestamp || now) + COOLDOWN_MS;
    const remainingMs = unlockTime - now;

    if (remainingMs <= 0) {
      // 24 Hours have passed: Day N+1 is now ACTIVE!
      return {
        status: 'ACTIVE',
        canInteract: true,
        isCompleted: false,
        isActive: true,
        isCountdown: false,
        isLocked: false,
        remainingMs: 0,
        formattedCountdown: '00:00:00',
        formattedCountdownLong: '0h 00m 00s',
        hours: 0,
        minutes: 0,
        seconds: 0,
        targetDay: currentTargetDay
      };
    } else {
      // Within 24-hour cooldown: Day N+1 is in COUNTDOWN
      const timeInfo = formatMsToHHMMSS(remainingMs);
      return {
        status: 'COUNTDOWN',
        canInteract: false,
        isCompleted: false,
        isActive: false,
        isCountdown: true,
        isLocked: true,
        remainingMs,
        formattedCountdown: timeInfo.formatted,
        formattedCountdownLong: timeInfo.formattedLong,
        hours: timeInfo.hours,
        minutes: timeInfo.minutes,
        seconds: timeInfo.seconds,
        targetDay: currentTargetDay
      };
    }
  }

  // 3. All subsequent days (currentTargetDay + 1 to 30) are LOCKED with NO timer
  return {
    status: 'LOCKED',
    canInteract: false,
    isCompleted: false,
    isActive: false,
    isCountdown: false,
    isLocked: true,
    remainingMs: 0,
    formattedCountdown: '00:00:00',
    formattedCountdownLong: '0h 00m 00s',
    hours: 0,
    minutes: 0,
    seconds: 0,
    targetDay: currentTargetDay
  };
}

/**
 * Returns the highest currently unlocked day number (1..30)
 */
export function getMaxUnlockedDay(
  startDateStrOrProgressMap?: string | Record<number, DayProgress> | null,
  progressMapOrUserProfile?: Record<number, DayProgress> | UserProfile | null
): number {
  let progressMap: Record<number, DayProgress> | null = null;
  let userProfile: UserProfile | null = null;

  if (typeof startDateStrOrProgressMap === 'object' && startDateStrOrProgressMap !== null) {
    progressMap = startDateStrOrProgressMap as Record<number, DayProgress>;
  } else {
    // Try to load from localStorage if not passed
    try {
      const saved = localStorage.getItem('tyrofem_progress_map');
      if (saved) progressMap = JSON.parse(saved);
    } catch (e) {
      // silent
    }
  }

  if (progressMapOrUserProfile && 'name' in progressMapOrUserProfile) {
    userProfile = progressMapOrUserProfile as UserProfile;
  }

  const completedDays = getConsecutiveCompletedDays(progressMap);
  if (completedDays.length === 0) {
    return 1;
  }
  if (completedDays.length >= 30) {
    return 30;
  }

  const targetDay = completedDays.length + 1;
  const targetStatus = getDayStatus(targetDay, progressMap, userProfile);

  if (targetStatus.status === 'ACTIVE') {
    return targetDay;
  }

  // If in countdown, currently unlocked are the completed days
  return completedDays[completedDays.length - 1];
}

/**
 * Calculate time remaining until a specific day unlocks
 */
export function getTimeRemainingForDay(
  dayNumber: number,
  progressMapOrStartDate?: Record<number, DayProgress> | string | null,
  userProfile?: UserProfile | null
): TimeRemaining {
  let progressMap: Record<number, DayProgress> | null = null;
  if (typeof progressMapOrStartDate === 'object' && progressMapOrStartDate !== null) {
    progressMap = progressMapOrStartDate as Record<number, DayProgress>;
  } else {
    try {
      const saved = localStorage.getItem('tyrofem_progress_map');
      if (saved) progressMap = JSON.parse(saved);
    } catch (e) {
      // silent
    }
  }

  const status = getDayStatus(dayNumber, progressMap, userProfile);

  if (status.status === 'ACTIVE' || status.status === 'COMPLETED') {
    return {
      isUnlocked: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      formatted: '00:00:00',
      formattedLong: '0h 00m 00s'
    };
  }

  return {
    isUnlocked: false,
    hours: status.hours,
    minutes: status.minutes,
    seconds: status.seconds,
    totalMs: status.remainingMs,
    formatted: status.formattedCountdown,
    formattedLong: status.formattedCountdownLong
  };
}

/**
 * Calculate time remaining for the next pending day in sequence
 */
export function getTimeRemainingForNextDay(
  progressMap?: Record<number, DayProgress> | null,
  userProfile?: UserProfile | null
): {
  nextDayNumber: number;
  timeRemaining: TimeRemaining;
  isAllCompleted: boolean;
  isTargetActive: boolean;
} {
  const completedDays = getConsecutiveCompletedDays(progressMap);
  if (completedDays.length >= 30) {
    return {
      nextDayNumber: 30,
      timeRemaining: {
        isUnlocked: true,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        formatted: '00:00:00',
        formattedLong: '0h 00m 00s'
      },
      isAllCompleted: true,
      isTargetActive: false
    };
  }

  const nextDayNumber = completedDays.length + 1;
  const status = getDayStatus(nextDayNumber, progressMap, userProfile);

  return {
    nextDayNumber,
    timeRemaining: {
      isUnlocked: status.status === 'ACTIVE',
      hours: status.hours,
      minutes: status.minutes,
      seconds: status.seconds,
      totalMs: status.remainingMs,
      formatted: status.formattedCountdown,
      formattedLong: status.formattedCountdownLong
    },
    isAllCompleted: false,
    isTargetActive: status.status === 'ACTIVE'
  };
}

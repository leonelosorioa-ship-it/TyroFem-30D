/**
 * TimeLock Utility for TyroFem 30D
 * Enforces strict 24-hour progressive unlocks for each calendar day of the 30-day program.
 * Ensures the user experiences the full 30-day biological protocol with Tyruss Full.
 */

export const DAY_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface TimeRemaining {
  isUnlocked: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  formatted: string; // e.g. "23:45:12"
  formattedLong: string; // e.g. "23h 45m 12s"
}

/**
 * Get the start timestamp in ms from userProfile.startDate, with safe fallbacks
 */
export function getStartTimestamp(startDateStr?: string): number {
  if (!startDateStr) {
    return Date.now();
  }
  const parsed = new Date(startDateStr).getTime();
  if (isNaN(parsed) || parsed <= 0) {
    return Date.now();
  }
  return parsed;
}

/**
 * Calculate the highest day number (1 to 30) unlocked based on 24-hour intervals
 */
export function getMaxUnlockedDay(startDateStr?: string, demoOffsetHours: number = 0): number {
  const startMs = getStartTimestamp(startDateStr);
  const nowMs = Date.now() + (demoOffsetHours * 60 * 60 * 1000);
  
  const elapsedMs = Math.max(0, nowMs - startMs);
  const elapsedDays = Math.floor(elapsedMs / DAY_DURATION_MS);
  
  // Day 1 is immediately unlocked (elapsedDays = 0 -> day 1)
  const maxDay = Math.min(30, 1 + elapsedDays);
  return Math.max(1, maxDay);
}

/**
 * Get exact unlock timestamp for a specific day
 */
export function getDayUnlockTimestamp(dayNumber: number, startDateStr?: string, demoOffsetHours: number = 0): number {
  const startMs = getStartTimestamp(startDateStr);
  const offsetMs = demoOffsetHours * 60 * 60 * 1000;
  
  if (dayNumber <= 1) {
    return startMs - offsetMs;
  }
  
  return startMs + ((dayNumber - 1) * DAY_DURATION_MS) - offsetMs;
}

/**
 * Calculate time remaining until a specific day unlocks
 */
export function getTimeRemainingForDay(dayNumber: number, startDateStr?: string, demoOffsetHours: number = 0): TimeRemaining {
  if (dayNumber <= 1) {
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

  const unlockTime = getDayUnlockTimestamp(dayNumber, startDateStr, demoOffsetHours);
  const now = Date.now();
  const diffMs = unlockTime - now;

  if (diffMs <= 0) {
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

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const formattedLong = `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    isUnlocked: false,
    hours,
    minutes,
    seconds,
    totalMs: diffMs,
    formatted,
    formattedLong
  };
}

/**
 * Calculate time remaining for the next locked day
 */
export function getTimeRemainingForNextDay(startDateStr?: string, demoOffsetHours: number = 0): {
  nextDayNumber: number;
  timeRemaining: TimeRemaining;
  isAllCompleted: boolean;
} {
  const currentUnlocked = getMaxUnlockedDay(startDateStr, demoOffsetHours);
  
  if (currentUnlocked >= 30) {
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
      isAllCompleted: true
    };
  }

  const nextDayNumber = currentUnlocked + 1;
  const timeRemaining = getTimeRemainingForDay(nextDayNumber, startDateStr, demoOffsetHours);

  return {
    nextDayNumber,
    timeRemaining,
    isAllCompleted: false
  };
}

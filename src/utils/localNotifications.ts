export interface LocalNotification {
  id: string;
  title: string;
  message: string;
  icon: string;
  badge?: string;
  timestamp: number;
}

const MOTIVATIONAL_MESSAGES = [
  {
    title: '¡Día completado con éxito! 🌿',
    messages: [
      '¡Excelente constancia! Cada día que cuidas tu tiroides y digestión es un regalo de bienestar.',
      '¡Tu constancia marca la diferencia! Tu energía y ligereza se construyen paso a paso.',
      '¡Gran trabajo hoy! Nutrir tu cuerpo a diario con amor y disciplina transforma tu salud.',
      '¡Meta de hoy cumplida! Siente la satisfacción de priorizar tu vitalidad y bienestar.'
    ],
    icon: '✨'
  },
  {
    day: 1,
    title: '¡Primer paso superado! 🌱',
    messages: [
      '¡Felicidades por iniciar con determinación tu Reto 30 Días! Tu cuerpo te lo agradecerá.'
    ],
    icon: '🌱'
  },
  {
    day: 7,
    title: '¡1 Semana de Transformación! 🌿',
    messages: [
      '¡7 días de constancia! Tu sistema digestivo está más ligero y tu energía empieza a elevarse.'
    ],
    icon: '🎉'
  },
  {
    day: 15,
    title: '¡Mitad de Camino Conquistada! 🌟',
    messages: [
      '¡15 días imparable! Estás construyendo un metabolismo más activo y hábitos duraderos.'
    ],
    icon: '🏆'
  },
  {
    day: 21,
    title: '¡21 Días de Hábitos Consolidados! 💫',
    messages: [
      '¡Increíble disciplina! Has creado una rutina saludable que ya es parte natural de ti.'
    ],
    icon: '⚡'
  },
  {
    day: 30,
    title: '¡Reto 30 Días Completado! 👑',
    messages: [
      '¡Felicidades, te has graduado! Has transformado tu energía, digestión y bienestar cotidiano.'
    ],
    icon: '👑'
  }
];

export function getMotivationalNotification(dayNumber: number, completedDaysCount: number): LocalNotification {
  const milestone = MOTIVATIONAL_MESSAGES.find(m => 'day' in m && m.day === dayNumber);
  
  if (milestone && milestone.messages) {
    const randomMsg = milestone.messages[Math.floor(Math.random() * milestone.messages.length)];
    return {
      id: `notif-${Date.now()}-${dayNumber}`,
      title: milestone.title,
      message: randomMsg,
      icon: milestone.icon,
      badge: `Día ${dayNumber} / 30`,
      timestamp: Date.now()
    };
  }

  const generic = MOTIVATIONAL_MESSAGES[0];
  const randomMsg = generic.messages[Math.floor(Math.random() * generic.messages.length)];

  return {
    id: `notif-${Date.now()}-${dayNumber}`,
    title: `¡Día ${dayNumber} registrado con éxito! 🌿`,
    message: randomMsg,
    icon: generic.icon,
    badge: `${completedDaysCount}/30 Días`,
    timestamp: Date.now()
  };
}

/**
 * Trigger native browser notification if permission is granted
 */
export async function sendBrowserNotification(title: string, body: string, icon = '🌿') {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
      });
      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/vite.svg',
        });
        return true;
      }
    }
  } catch {
    // Gracefully handle iframe restrictions or browser security sandbox
  }
  return false;
}

import confetti from 'canvas-confetti';

/**
 * Colores Corporativos de ColShopi & Tyruss Full para Confeti:
 * - Esmeraldas profundos y luminosos: #047857, #10B981, #059669, #34D399
 * - Oro y Ámbar Transformación: #F59E0B, #FBBF24, #D97706
 * - Menta & Turquesa Vital: #2DD4BF, #0D9488
 * - Destellos blancos: #FFFFFF
 */
const COLSHOPI_PALETTE = ['#047857', '#10B981', '#059669', '#34D399', '#F59E0B', '#FBBF24', '#2DD4BF', '#FFFFFF'];
const GOLD_GRADUATION_PALETTE = ['#F59E0B', '#FBBF24', '#D97706', '#FEF3C7', '#10B981', '#047857', '#FFFFFF'];
const MILESTONE_PALETTE = ['#10B981', '#059669', '#34D399', '#F59E0B', '#FBBF24', '#14B8A6', '#6EE7B7'];

export interface ConfettiTriggerOptions {
  dayNumber: number;
  totalCompletedDays: number;
}

/**
 * Dispara una animación de confeti personalizada y adaptada según el hito alcanzado en el reto
 */
export function triggerDayCompletionConfetti({ dayNumber, totalCompletedDays }: ConfettiTriggerOptions) {
  try {
    const isGraduation = dayNumber >= 30 || totalCompletedDays >= 30;
    const isMajorMilestone = dayNumber === 7 || dayNumber === 14 || dayNumber === 15 || dayNumber === 21 || totalCompletedDays === 7 || totalCompletedDays === 14 || totalCompletedDays === 15 || totalCompletedDays === 21;

    if (isGraduation) {
      // 👑 GRADUACIÓN DÍA 30: Espectáculo de fuegos artificiales de confeti dorado y esmeralda de 3 segundos
      const duration = 2800;
      const end = Date.now() + duration;

      const frame = () => {
        // Lanzamientos alternados desde los laterales hacia el centro
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: GOLD_GRADUATION_PALETTE,
          scalar: 1.2,
          ticks: 250
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: GOLD_GRADUATION_PALETTE,
          scalar: 1.2,
          ticks: 250
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Gran explosión central de estrellas y oro
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.5 },
          colors: GOLD_GRADUATION_PALETTE,
          scalar: 1.3,
          ticks: 300,
          shapes: ['star', 'circle']
        });
      }, 400);

    } else if (isMajorMilestone) {
      // 🌿 HITOS 7D, 14D y 21D: Cañones dobles laterales sincronizados y lluvia central
      // Cañón izquierdo
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.7 },
        colors: MILESTONE_PALETTE,
        scalar: 1.15,
        ticks: 220
      });

      // Cañón derecho
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.7 },
        colors: MILESTONE_PALETTE,
        scalar: 1.15,
        ticks: 220
      });

      // Explosión de destellos en el centro
      setTimeout(() => {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { x: 0.5, y: 0.55 },
          colors: MILESTONE_PALETTE,
          shapes: ['circle', 'star'],
          ticks: 200
        });
      }, 250);

    } else {
      // 🌟 REGISTRO DIARIO ESTÁNDAR: Doble ráfaga esmeralda y ámbar con alta física
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { x: 0.5, y: 0.62 },
        colors: COLSHOPI_PALETTE,
        scalar: 1.05,
        ticks: 180
      });

      // Segundo pulso de micro-partículas doradas
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 90,
          origin: { x: 0.5, y: 0.65 },
          colors: ['#F59E0B', '#10B981', '#FFFFFF', '#34D399'],
          ticks: 150
        });
      }, 180);
    }

    // Reproducir una sutil fanfarria auditiva de éxito usando Web Audio API sintetizada (sin dependencias de archivos externos)
    playCelebrationAudio(isGraduation ? 'graduation' : isMajorMilestone ? 'milestone' : 'standard');
  } catch (error) {
    console.warn('Canvas confetti execution skipped:', error);
  }
}

/**
 * Generador de acorde armónico sintetizado de celebración (Web Audio API)
 * Produce notas cálidas y reconfortantes de campana/arpa celebrando el logro
 */
export function playCelebrationAudio(type: 'standard' | 'milestone' | 'graduation' = 'standard') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Frecuencias pentatónicas mayores luminosas (Do - Mi - Sol - La - Do agudo)
    const notes = type === 'graduation' 
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51] // C5, E5, G5, C6, E6
      : type === 'milestone'
      ? [440.00, 554.37, 659.25, 880.00]           // A4, C#5, E5, A5
      : [523.25, 659.25, 783.99];                  // C5, E5, G5

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      // Envolvente de volumen suave estilo campana zen
      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.95);
    });
  } catch (e) {
    // Si el navegador bloquea audio sin interacción previa, falla en silencio
  }
}

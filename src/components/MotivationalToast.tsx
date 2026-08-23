import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Award } from 'lucide-react';
import { LocalNotification } from '../utils/localNotifications';

interface MotivationalToastProps {
  notification: LocalNotification | null;
  onClose: () => void;
}

export const MotivationalToast: React.FC<MotivationalToastProps> = ({
  notification,
  onClose
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-4 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-96 shadow-2xl rounded-2xl overflow-hidden border border-emerald-400/40 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white"
        >
          {/* Top highlight glow bar */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 animate-pulse" />

          <div className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-xl shrink-0 shadow-inner border border-emerald-300/30">
              {notification.icon || <Sparkles className="w-5 h-5 text-amber-300" />}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 mb-1">
                {notification.badge && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <Award className="w-2.5 h-2.5 text-amber-300" />
                    {notification.badge}
                  </span>
                )}
                <span className="text-[10px] text-cyan-300 font-medium ml-auto">
                  Marié • Notificación
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white font-serif-luxury leading-tight">
                {notification.title}
              </h4>

              <p className="text-[11px] sm:text-xs text-slate-200 mt-1 leading-relaxed">
                {notification.message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

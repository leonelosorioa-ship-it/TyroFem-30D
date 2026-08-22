import React from 'react';
import { 
  AlertTriangle, 
  Ban, 
  ShieldAlert, 
  MessageCircle, 
  Mail, 
  Phone, 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { ColshopiLogo } from './ColshopiLogo';

interface UserSuspendedModalProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

export const UserSuspendedModal: React.FC<UserSuspendedModalProps> = ({ userProfile, onLogout }) => {
  const isBanned = userProfile.status === 'inhabilitada';
  const reason = userProfile.statusReason || (
    isBanned 
      ? 'Tu cuenta ha sido inhabilitada de forma definitiva por la administración de ColShopi debido a una infracción de los términos de uso o anulación del pedido.'
      : 'Tu cuenta ha sido suspendida temporalmente por seguridad o detección de uso simultáneo no autorizado del código VIP.'
  );

  const waText = encodeURIComponent(
    `Hola ColShopi Tienda, soy ${userProfile.name} (Correo: ${userProfile.email || 'N/A'}, Código: ${userProfile.accessCode || 'N/A'}). Mi cuenta de TyroFem 30D aparece ${isBanned ? 'INHABILITADA' : 'SUSPENDIDA'}. Solicito por favor la revisión de mi estado.`
  );
  const waUrl = `https://wa.me/573104007428?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl animate-scaleUp text-white">
        
        {/* Header Ribbon */}
        <div className={`p-5 ${
          isBanned 
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/30'
            : 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isBanned 
                ? 'bg-rose-950 text-rose-400 border-rose-400/40' 
                : 'bg-amber-950 text-amber-400 border-amber-400/40'
            }`}>
              {isBanned ? <Ban className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6 animate-pulse" />}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                isBanned 
                  ? 'bg-rose-950 text-rose-300 border-rose-500/40' 
                  : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}>
                {isBanned ? 'Acceso Inhabilitado' : 'Acceso Suspendido Temporalmente'}
              </span>
              <h2 className="text-base sm:text-lg font-bold font-serif-luxury mt-0.5">
                {isBanned ? 'Cuenta de Acceso Inhabilitada' : 'Cuenta Suspendida por Administración'}
              </h2>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Usuaria: <strong className="text-white">{userProfile.name}</strong></span>
              {userProfile.accessCode && (
                <span className="font-mono text-cyan-300">VIP #{userProfile.accessCode}</span>
              )}
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Motivo Informado por ColShopi:
              </span>
              <p className="text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {reason}
              </p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            De acuerdo con las políticas de uso exclusivo de <strong>TyroFem 30D By ColShopi Tienda</strong>, el acceso a la plataforma está reservado a compradoras verificadas de Tyruss Full. Si consideras que esto es un error, por favor comunícate de inmediato con nuestro equipo de soporte para reactivar tu cuenta.
          </p>

          {/* Contact Support Direct CTA */}
          <div className="space-y-2 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar a Soporte ColShopi por WhatsApp</span>
            </a>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+57 310 400 7428</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-cyan-400" />
                <span>contacto@colshopi.com</span>
              </span>
            </div>
          </div>

          {/* Logout / Exit action */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir o Ingresar con Otra Cuenta</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

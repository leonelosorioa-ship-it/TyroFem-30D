import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  KeyRound, 
  Mail, 
  Phone, 
  Calendar, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Lock, 
  Unlock, 
  Eye, 
  RefreshCw, 
  MessageCircle, 
  Plus, 
  Trash2, 
  ArrowLeft,
  SlidersHorizontal,
  FileText,
  Clock,
  Layers
} from 'lucide-react';
import { 
  RegisteredUser, 
  UserStatus, 
  getRegisteredUsers, 
  updateUserStatus, 
  saveRegisteredUser, 
  deleteRegisteredUser, 
  exportUsersToExcelFile, 
  getAngleLabel,
  ADMIN_CREDENTIALS
} from '../data/usersDatabase';
import { getCodesStatusSummary } from '../data/authorizedCodes';
import { ColshopiLogo } from './ColshopiLogo';
import { HealthAngle } from '../types';

interface AdminPanelProps {
  onBackToApp: () => void;
  onLogoutAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToApp, onLogoutAdmin }) => {
  const [users, setUsers] = useState<RegisteredUser[]>(() => getRegisteredUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [angleFilter, setAngleFilter] = useState<'all' | HealthAngle>('all');
  
  // Selected user for status change modal or details modal
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<RegisteredUser | null>(null);
  const [newStatus, setNewStatus] = useState<UserStatus>('activa');
  const [statusReason, setStatusReason] = useState('');

  const [selectedUserForDetail, setSelectedUserForDetail] = useState<RegisteredUser | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCode, setNewUserCode] = useState('');
  const [newUserAngle, setNewUserAngle] = useState<HealthAngle>('tiroides_metabolismo');
  const [newUserAge, setNewUserAge] = useState('35-44 años');
  const [newUserNotes, setNewUserNotes] = useState('');

  const reloadUsers = () => {
    setUsers(getRegisteredUsers());
  };

  const codesSummary = useMemo(() => getCodesStatusSummary(), [users]);

  // Statistics calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'activa').length;
  const suspendedUsers = users.filter(u => u.status === 'suspendida').length;
  const disabledUsers = users.filter(u => u.status === 'inhabilitada').length;
  const avgAdherence = totalUsers > 0 
    ? Math.round(users.reduce((acc, u) => acc + (u.adherencePercent || 0), 0) / totalUsers)
    : 0;

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.accessCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchAngle = angleFilter === 'all' || user.primaryAngle === angleFilter;

      return matchSearch && matchStatus && matchAngle;
    });
  }, [users, searchTerm, statusFilter, angleFilter]);

  // Handle Export to Excel
  const handleExportExcel = () => {
    const result = exportUsersToExcelFile(users);
    if (result.success) {
      setExportFeedback(`¡Excel generado con éxito! Archivo: ${result.filename}`);
      setTimeout(() => setExportFeedback(null), 4000);
    } else {
      setExportFeedback('Error al exportar archivo Excel');
      setTimeout(() => setExportFeedback(null), 3000);
    }
  };

  // Open status modal
  const handleOpenStatusModal = (user: RegisteredUser, targetStatus: UserStatus) => {
    setSelectedUserForStatus(user);
    setNewStatus(targetStatus);
    setStatusReason(
      targetStatus === 'suspendida' 
        ? 'Suspensión preventiva: Revisión de uso indebido de cuenta o accesos simultáneos.' 
        : targetStatus === 'inhabilitada'
        ? 'Inhabilitación definitiva: Infracción a los términos de uso y compartición de código VIP.'
        : ''
    );
  };

  // Confirm status update
  const handleConfirmStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForStatus) return;

    updateUserStatus(selectedUserForStatus.id, newStatus, statusReason.trim() || undefined);
    reloadUsers();
    setSelectedUserForStatus(null);
  };

  // Create new user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPhone.trim() || !newUserCode.trim()) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const newUser: RegisteredUser = {
      id: `usr_${newUserCode.replace(/\D/g, '') || Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      accessCode: newUserCode.trim(),
      ageGroup: newUserAge,
      primaryAngle: newUserAngle,
      symptoms: ['Soporte nutricional Tyruss Full', 'Ingreso manual por soporte'],
      startDate: new Date().toISOString(),
      currentDay: 1,
      completedDays: 0,
      adherencePercent: 0,
      status: 'activa',
      registeredAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      notes: newUserNotes.trim() || 'Registrada manualmente desde Panel de Admin ColShopi.'
    };

    saveRegisteredUser(newUser);
    reloadUsers();
    setIsNewUserModalOpen(false);
    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserCode('');
    setNewUserNotes('');
  };

  // Delete user
  const handleDeleteUser = (user: RegisteredUser) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro de ${user.name}? Esta acción no se puede deshacer.`)) {
      deleteRegisteredUser(user.id);
      reloadUsers();
      if (selectedUserForDetail?.id === user.id) {
        setSelectedUserForDetail(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/30 px-4 sm:px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <ColshopiLogo size="md" showGlow={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded">
                  Super Admin Panel
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                  Leps Digital
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white font-serif-luxury leading-tight mt-0.5">
                Panel de Administración • TyroFem 30D
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white truncate max-w-[200px]">
                {ADMIN_CREDENTIALS.email}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Código Admin: 250816
              </span>
            </div>

            <button
              type="button"
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Volver a la vista normal del reto 30D"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Ver App como Usuaria</span>
            </button>

            <button
              type="button"
              onClick={onLogoutAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <UserX className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Excel Export Alert Banner if triggered */}
        {exportFeedback && (
          <div className="p-4 bg-emerald-950/90 border border-emerald-400 text-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{exportFeedback}</span>
            </div>
            <button
              onClick={() => setExportFeedback(null)}
              className="text-xs text-emerald-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Executive Metrics Overview Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* Card 1: Total Users */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Usuarias</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{totalUsers}</span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                Registradas
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Base activa TyroFem 30D</p>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Habilitadas (Activas)</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{activeUsers}</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                {totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}%` : '0%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Con acceso pleno a la App</p>
          </div>

          {/* Card 3: Suspended / Disabled */}
          <div className="bg-slate-900/90 border border-rose-900/50 rounded-2xl p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Suspendidas / Bajas</span>
              <Ban className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-400">{suspendedUsers + disabledUsers}</span>
              <span className="text-[10px] text-rose-300 font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                {suspendedUsers} susp. / {disabledUsers} inact.
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Acceso restringido por admin</p>
          </div>

          {/* Card 4: Average Adherence */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Adherencia 30D</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{avgAdherence}%</span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                Global
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Cumplimiento tomas Tyruss</p>
          </div>

          {/* Card 5: Codes Inventory */}
          <div className="bg-slate-900/90 border border-cyan-900/60 rounded-2xl p-4 shadow-md space-y-2 col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-cyan-300">
              <span className="text-xs font-semibold uppercase tracking-wider">Códigos VIP 6 Dígitos</span>
              <KeyRound className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-cyan-300">
                {codesSummary.usedCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {codesSummary.total} Total
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold">
              {codesSummary.availableCount} disponibles para entrega
            </p>
          </div>

        </section>

        {/* Actions & Filters Toolbar */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar usuaria por nombre, correo, WhatsApp o código VIP de 6 dígitos..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Main Action Buttons: Export Excel & Add User */}
            <div className="flex items-center gap-2 shrink-0">
              
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer transform active:scale-98"
                title="Descargar base completa de usuarias en formato Microsoft Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-white" />
                <span>Exportar a Excel (.XLSX)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNewUserModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                title="Registrar manualmente una nueva compradora"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Usuaria</span>
              </button>

              <button
                type="button"
                onClick={reloadUsers}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                title="Recargar base de datos"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtrar Estado:</span>
            </span>

            {[
              { id: 'all', label: `Todas (${totalUsers})` },
              { id: 'activa', label: `Activas (${activeUsers})`, color: 'text-emerald-400' },
              { id: 'suspendida', label: `Suspendidas (${suspendedUsers})`, color: 'text-amber-400' },
              { id: 'inhabilitada', label: `Inhabilitadas (${disabledUsers})`, color: 'text-rose-400' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-800 mx-2 hidden sm:block" />

            <span className="text-slate-400 font-bold hidden sm:inline">Objetivo:</span>
            <select
              value={angleFilter}
              onChange={e => setAngleFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-hidden focus:border-cyan-400"
            >
              <option value="all">Todos los Objetivos Clínicos</option>
              <option value="tiroides_metabolismo">Tiroides & Metabolismo</option>
              <option value="desbalance_menopausia">Hormonal & Menopausia</option>
              <option value="ciclos_spm">Ciclos SPM & Dolor</option>
              <option value="digestion_detox">Digestión & Detox</option>
            </select>

            <span className="ml-auto text-slate-400 font-medium text-[11px]">
              Mostrando <strong className="text-white">{filteredUsers.length}</strong> de {totalUsers} usuarias
            </span>
          </div>

        </section>

        {/* Users Registry Table & Cards */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Registro Maestro de Usuarias Activas & Historial
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Base Centralizada ColShopi • Exportable XLSX
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No se encontraron usuarias con los filtros aplicados</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Intenta modificar el término de búsqueda o restablecer los filtros de estado clínico.
              </p>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setAngleFilter('all'); }}
                className="text-xs text-cyan-400 underline font-bold"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Usuaria & Contacto</th>
                    <th className="py-3 px-3">Código VIP</th>
                    <th className="py-3 px-3">Objetivo Clínico</th>
                    <th className="py-3 px-3">Progreso 30D</th>
                    <th className="py-3 px-3">Estado Actual</th>
                    <th className="py-3 px-3">Fecha Registro</th>
                    <th className="py-3 px-4 text-right">Acciones Admin</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredUsers.map((user) => {
                    const waLink = `https://wa.me/${user.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hola ${user.name}, te saludamos desde ColShopi Tienda soporte TyroFem 30D.`
                    )}`;

                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Column 1: User & Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-white text-xs hover:text-cyan-300 cursor-pointer" onClick={() => setSelectedUserForDetail(user)}>
                                {user.name}
                              </h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1 truncate max-w-[180px]">
                                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </span>
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                                  title="Abrir chat de WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3 shrink-0" />
                                  <span>{user.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: VIP Code */}
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1 bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs px-2 py-1 rounded-md">
                            <KeyRound className="w-3 h-3 text-cyan-400" />
                            <span>{user.accessCode}</span>
                          </div>
                        </td>

                        {/* Column 3: Clinical Angle */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-200 block">
                              {getAngleLabel(user.primaryAngle)}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {user.ageGroup}
                            </span>
                          </div>
                        </td>

                        {/* Column 4: Progress & Adherence */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1 min-w-[120px]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-white">Día {user.currentDay}/30</span>
                              <span className="font-bold text-amber-400">{user.adherencePercent}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, user.adherencePercent)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 block">
                              {user.completedDays} días completados
                            </span>
                          </div>
                        </td>

                        {/* Column 5: Status */}
                        <td className="py-3.5 px-3">
                          {user.status === 'activa' && (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Activa (Habilitada)</span>
                            </div>
                          )}

                          {user.status === 'suspendida' && (
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                <span>Suspendida</span>
                              </div>
                              {user.statusReason && (
                                <p className="text-[10px] text-amber-200/70 truncate max-w-[140px]" title={user.statusReason}>
                                  {user.statusReason}
                                </p>
                              )}
                            </div>
                          )}

                          {user.status === 'inhabilitada' && (
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                <Ban className="w-3.5 h-3.5 text-rose-400" />
                                <span>Inhabilitada</span>
                              </div>
                              {user.statusReason && (
                                <p className="text-[10px] text-rose-300/70 truncate max-w-[140px]" title={user.statusReason}>
                                  {user.statusReason}
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Column 6: Registered At */}
                        <td className="py-3.5 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(user.registeredAt).toLocaleDateString('es-CO', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Column 7: Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Ver Detalle */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForDetail(user)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Ver expediente completo"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Action: Habilitar (if not active) */}
                            {user.status !== 'activa' && (
                              <button
                                type="button"
                                onClick={() => handleOpenStatusModal(user, 'activa')}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                title="Habilitar acceso"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Habilitar</span>
                              </button>
                            )}

                            {/* Action: Suspender (if active) */}
                            {user.status === 'activa' && (
                              <button
                                type="button"
                                onClick={() => handleOpenStatusModal(user, 'suspendida')}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                title="Suspender temporalmente por mal uso"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Suspender</span>
                              </button>
                            )}

                            {/* Action: Inhabilitar (if not inhabilitada) */}
                            {user.status !== 'inhabilitada' && (
                              <button
                                type="button"
                                onClick={() => handleOpenStatusModal(user, 'inhabilitada')}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                title="Inhabilitar permanentemente"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Inhabilitar</span>
                              </button>
                            )}

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: STATUS CHANGE (HABILITAR / SUSPENDER / INHABILITAR) */}
      {/* ========================================================================= */}
      {selectedUserForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${
                  newStatus === 'activa' 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                    : newStatus === 'suspendida'
                    ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                    : 'bg-rose-950 text-rose-400 border-rose-500/40'
                }`}>
                  {newStatus === 'activa' && <Unlock className="w-5 h-5" />}
                  {newStatus === 'suspendida' && <AlertTriangle className="w-5 h-5" />}
                  {newStatus === 'inhabilitada' && <Ban className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-serif-luxury">
                    {newStatus === 'activa' && 'Habilitar Acceso de Usuaria'}
                    {newStatus === 'suspendida' && 'Suspender Acceso de Usuaria'}
                    {newStatus === 'inhabilitada' && 'Inhabilitar Acceso Permanentemente'}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUserForStatus.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForStatus(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmStatusUpdate} className="space-y-4 text-xs">
              
              {/* Select Status */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Acción de Estado:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'activa', label: 'Habilitar', color: 'border-emerald-500 text-emerald-300 bg-emerald-950/50' },
                    { id: 'suspendida', label: 'Suspender', color: 'border-amber-500 text-amber-300 bg-amber-950/50' },
                    { id: 'inhabilitada', label: 'Inhabilitar', color: 'border-rose-500 text-rose-300 bg-rose-950/50' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setNewStatus(s.id as UserStatus);
                        if (s.id === 'activa') setStatusReason('');
                      }}
                      className={`py-2 px-1.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        newStatus === s.id
                          ? `${s.color} ring-2 ring-cyan-400`
                          : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Reason Input */}
              {newStatus !== 'activa' && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center justify-between">
                    <span>Motivo de Suspensión / Inhabilitación:</span>
                    <span className="text-[10px] text-slate-400">(Visible en expediente)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={statusReason}
                    onChange={e => setStatusReason(e.target.value)}
                    placeholder="Ej. Compartición de cuenta con terceros no autorizados, anomalía en el código VIP..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                    required={newStatus !== 'activa'}
                  />
                </div>
              )}

              {/* Security notice */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-cyan-300 block">Efecto inmediato:</span>
                <p>
                  {newStatus === 'activa' 
                    ? 'La usuaria podrá ingresar normalmente con su código VIP de 6 dígitos.'
                    : 'Si la usuaria intenta ingresar o navegar en la App, su acceso será bloqueado inmediatamente y se le remitirá a soporte ColShopi.'}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForStatus(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold text-white shadow-md cursor-pointer transition-all ${
                    newStatus === 'activa'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : newStatus === 'suspendida'
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirmar Cambio
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: USER FULL DETAIL CARD */}
      {/* ========================================================================= */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
                  {selectedUserForDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif-luxury">
                    {selectedUserForDetail.name}
                  </h3>
                  <span className="text-xs text-cyan-300 font-mono">ID: {selectedUserForDetail.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForDetail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Status Badge & Code */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Código VIP Asignado</span>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold text-sm">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>{selectedUserForDetail.accessCode}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estado Actual</span>
                  <span className={`inline-block font-bold text-xs px-2 py-0.5 rounded-full ${
                    selectedUserForDetail.status === 'activa'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : selectedUserForDetail.status === 'suspendida'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}>
                    {selectedUserForDetail.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Datos de Contacto</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Correo:</span>
                    <span className="font-bold text-white">{selectedUserForDetail.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${selectedUserForDetail.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{selectedUserForDetail.phone}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Rango de Edad:</span>
                    <span className="text-slate-200">{selectedUserForDetail.ageGroup}</span>
                  </div>
                </div>
              </div>

              {/* Clinical Objective & Symptoms */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Diagnóstico de Salud</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Objetivo Clínico:</span>
                  <span className="font-bold text-amber-300">{getAngleLabel(selectedUserForDetail.primaryAngle)}</span>
                </div>
                {selectedUserForDetail.symptoms && selectedUserForDetail.symptoms.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 block text-[10px]">Síntomas Seleccionados:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedUserForDetail.symptoms.map((s, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-md">
                          • {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress 30D Details */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Progreso en el Reto 30D</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Día Actual</span>
                    <span className="text-sm font-bold text-white">Día {selectedUserForDetail.currentDay}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Completados</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedUserForDetail.completedDays}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Adherencia</span>
                    <span className="text-sm font-bold text-amber-400">{selectedUserForDetail.adherencePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Notes & Status Reason */}
              {(selectedUserForDetail.notes || selectedUserForDetail.statusReason) && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Observaciones Administrativas</span>
                  {selectedUserForDetail.statusReason && (
                    <p className="text-amber-300 font-medium">
                      <strong>Motivo de Estado:</strong> {selectedUserForDetail.statusReason}
                    </p>
                  )}
                  {selectedUserForDetail.notes && (
                    <p className="text-slate-400">
                      <strong>Notas:</strong> {selectedUserForDetail.notes}
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleDeleteUser(selectedUserForDetail)}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Usuaria</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const user = selectedUserForDetail;
                    setSelectedUserForDetail(null);
                    handleOpenStatusModal(user, user.status === 'activa' ? 'suspendida' : 'activa');
                  }}
                  className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cambiar Estado
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserForDetail(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MANUAL USER REGISTRATION */}
      {/* ========================================================================= */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-serif-luxury">
                  Registrar Nueva Compradora Manualmente
                </h3>
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Nombre Completo:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="Ej. Sandra Patricia Morales"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Correo Electrónico:</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Teléfono WhatsApp:</label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={e => setNewUserPhone(e.target.value)}
                    placeholder="+57 310..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Código VIP (6 Dígitos):</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newUserCode}
                    onChange={e => setNewUserCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="849201"
                    className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl p-2.5 text-xs text-cyan-300 font-mono font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">Rango de Edad:</label>
                  <select
                    value={newUserAge}
                    onChange={e => setNewUserAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="18-24 años">18-24 años</option>
                    <option value="25-34 años">25-34 años</option>
                    <option value="35-44 años">35-44 años</option>
                    <option value="45-54 años">45-54 años</option>
                    <option value="55+ años">55+ años</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Objetivo Clínico de Salud:</label>
                <select
                  value={newUserAngle}
                  onChange={e => setNewUserAngle(e.target.value as HealthAngle)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="tiroides_metabolismo">Tiroides & Metabolismo</option>
                  <option value="desbalance_menopausia">Desbalances Hormonales & Menopausia</option>
                  <option value="ciclos_spm">Ciclos SPM & Dolor</option>
                  <option value="digestion_detox">Digestión Lenta & Detox</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">Notas de la compra / soporte:</label>
                <textarea
                  rows={2}
                  value={newUserNotes}
                  onChange={e => setNewUserNotes(e.target.value)}
                  placeholder="Pedido de 3 frascos Tyruss Full..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white shadow-md cursor-pointer"
                >
                  Guardar Usuaria
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

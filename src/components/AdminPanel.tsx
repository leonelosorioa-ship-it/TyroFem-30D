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
  Layers,
  History,
  Check,
  Bell
} from 'lucide-react';
import { 
  MasterUserData,
  RegisteredUser, 
  UserStatus, 
  getRegisteredUsers, 
  fetchRegisteredUsersFromServer,
  updateUserStatus, 
  saveRegisteredUser, 
  deleteRegisteredUser, 
  exportUsersToExcelFile, 
  getAngleLabel,
  formatCurrentTimestamp,
  ADMIN_CREDENTIALS
} from '../data/usersDatabase';
import { getCodesStatusSummary } from '../data/authorizedCodes';
import { ColshopiLogo } from './ColshopiLogo';
import { PushNotificationConsoleModal } from './PushNotificationConsoleModal';
import { HealthAngle } from '../types';

interface AdminPanelProps {
  onBackToApp: () => void;
  onLogoutAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToApp, onLogoutAdmin }) => {
  const [users, setUsers] = useState<MasterUserData[]>(() => getRegisteredUsers());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toLocaleTimeString('es-CO'));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'completed_30d'>('all');
  const [angleFilter, setAngleFilter] = useState<'all' | string>('all');
  
  // Selected user for status change modal or details modal
  const [selectedUserForStatus, setSelectedUserForStatus] = useState<MasterUserData | null>(null);
  const [newStatus, setNewStatus] = useState<'active' | 'suspended'>('active');
  const [statusReason, setStatusReason] = useState('');

  const [selectedUserForDetail, setSelectedUserForDetail] = useState<MasterUserData | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isPushConsoleOpen, setIsPushConsoleOpen] = useState(false);
  const [pushConsolePreSelectedUser, setPushConsolePreSelectedUser] = useState<MasterUserData | null>(null);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCode, setNewUserCode] = useState('');
  const [newUserAngle, setNewUserAngle] = useState<HealthAngle>('tiroides_metabolismo');
  const [newUserAge, setNewUserAge] = useState('35-44 años');
  const [newUserNotes, setNewUserNotes] = useState('');

  const reloadUsers = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setIsSyncing(true);
    try {
      const serverUsers = await fetchRegisteredUsersFromServer();
      setUsers(serverUsers);
      setLastSyncedAt(new Date().toLocaleTimeString('es-CO'));
      // Keep selected user detail in sync if open
      if (selectedUserForDetail) {
        const updatedSelected = serverUsers.find(u => u.id === selectedUserForDetail.id);
        if (updatedSelected) {
          setSelectedUserForDetail(updatedSelected);
        }
      }
    } catch (e) {
      setUsers(getRegisteredUsers());
    } finally {
      if (showLoadingSpinner) {
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  };

  // Initial fetch and auto-polling every 6 seconds for real-time registrations & check-ins
  useEffect(() => {
    reloadUsers(true);

    const interval = setInterval(() => {
      reloadUsers(false);
    }, 6000);

    const handleCustomUpdate = () => {
      reloadUsers(false);
    };

    window.addEventListener('tyrofem_users_updated', handleCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('tyrofem_users_updated', handleCustomUpdate);
    };
  }, []);

  const codesSummary = useMemo(() => getCodesStatusSummary(users), [users]);

  // Statistics calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active' || u.status === 'activa').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended' || u.status === 'suspendida' || u.status === 'inhabilitada').length;
  const completedUsers = users.filter(u => u.status === 'completed_30d' || (u.completedDaysCount || u.completedDays || 0) >= 30).length;
  
  const avgAdherence = totalUsers > 0 
    ? Math.round(users.reduce((acc, u) => acc + (u.adherencePercentage ?? u.adherencePercent ?? 0), 0) / totalUsers)
    : 0;

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = (user.fullName || user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const phone = (user.phone || '').toLowerCase();
      const code = (user.vipCode || user.accessCode || '').toLowerCase();
      const goal = (user.healthGoal || '').toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const matchSearch = !search || 
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        code.includes(search) ||
        goal.includes(search);

      const isUserActive = user.status === 'active' || user.status === 'activa';
      const isUserSuspended = user.status === 'suspended' || user.status === 'suspendida' || user.status === 'inhabilitada';
      const isUserCompleted = user.status === 'completed_30d' || (user.completedDaysCount || user.completedDays || 0) >= 30;

      let matchStatus = true;
      if (statusFilter === 'active') matchStatus = isUserActive;
      else if (statusFilter === 'suspended') matchStatus = isUserSuspended;
      else if (statusFilter === 'completed_30d') matchStatus = isUserCompleted;

      let matchAngle = true;
      if (angleFilter !== 'all') {
        matchAngle = user.primaryAngle === angleFilter || (user.healthGoal && user.healthGoal.toLowerCase().includes(angleFilter.toLowerCase()));
      }

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
  const handleOpenStatusModal = (user: MasterUserData, targetStatus: 'active' | 'suspended') => {
    setSelectedUserForStatus(user);
    setNewStatus(targetStatus);
    setStatusReason(
      targetStatus === 'suspended' 
        ? 'Suspensión preventiva: Revisión de uso indebido de cuenta o accesos simultáneos.' 
        : ''
    );
  };

  // Confirm status update
  const handleConfirmStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForStatus) return;

    await updateUserStatus(selectedUserForStatus.id, newStatus, statusReason.trim() || undefined);
    await reloadUsers();
    setSelectedUserForStatus(null);
  };

  // Create new user manually
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newUserCode.replace(/\D/g, '').trim();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPhone.trim() || !cleanCode) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const nowIso = new Date().toISOString();
    const nowLog = formatCurrentTimestamp();
    const goal = getAngleLabel(newUserAngle);

    const newUser: MasterUserData = {
      id: `usr_${cleanCode || Date.now()}`,
      vipCode: cleanCode,
      accessCode: cleanCode,
      fullName: newUserName.trim(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      registrationDate: nowIso,
      registeredAt: nowIso,
      healthGoal: goal,
      primaryAngle: newUserAngle,
      ageGroup: newUserAge,
      symptoms: ['Soporte nutricional Tyruss Full', 'Ingreso manual por soporte ColShopi'],
      currentDay: 1,
      completedDaysCount: 0,
      completedDays: 0,
      completedDaysList: [],
      adherencePercentage: 0,
      adherencePercent: 0,
      status: 'active',
      lastActivityTimestamp: Date.now(),
      lastActivityAt: nowIso,
      lastAction: `Registro manual desde Super Admin (${goal})`,
      historyLog: [
        { timestamp: nowLog, event: `Asignación manual de Código VIP #${cleanCode}` },
        { timestamp: nowLog, event: `Cuenta Habilitada por Super Admin (${goal})` }
      ],
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
  const handleDeleteUser = async (user: MasterUserData) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro de ${user.fullName || user.name}? Esta acción no se puede deshacer.`)) {
      await deleteRegisteredUser(user.id);
      await reloadUsers();
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
            {/* Live Database Sync status */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] px-3 py-1.5 rounded-xl shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Base Central Conectada</span>
              <span className="text-[10px] text-slate-400 font-mono">({lastSyncedAt})</span>
            </div>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white truncate max-w-[200px]">
                {ADMIN_CREDENTIALS.email}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                Código Admin: 250816
              </span>
            </div>

            {/* Push Notification Dispatcher Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setPushConsolePreSelectedUser(null);
                setIsPushConsoleOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 px-3.5 py-2 rounded-xl transition-all shadow-lg hover:shadow-amber-400/20 cursor-pointer active:scale-95 border border-amber-200"
              title="Abrir consola de emisión de notificaciones push PWA"
            >
              <Bell className="w-4 h-4 fill-current" />
              <span>Enviar Notificación Push</span>
            </button>

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
              className="text-xs text-emerald-300 hover:text-white cursor-pointer"
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

          {/* Card 3: Suspended */}
          <div className="bg-slate-900/90 border border-amber-900/50 rounded-2xl p-4 shadow-md space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Suspendidas</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-400">{suspendedUsers}</span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                {suspendedUsers} en pausa
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Acceso pausado por admin</p>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
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
                onClick={() => reloadUsers(true)}
                disabled={isSyncing}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                title="Recargar y sincronizar con base de datos central"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
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
              { id: 'active', label: `Activas (${activeUsers})`, color: 'text-emerald-400' },
              { id: 'suspended', label: `Suspendidas (${suspendedUsers})`, color: 'text-amber-400' },
              { id: 'completed_30d', label: `30D Completado (${completedUsers})`, color: 'text-cyan-400' }
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
              onChange={e => setAngleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-hidden focus:border-cyan-400"
            >
              <option value="all">Todos los Objetivos de Bienestar</option>
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

          {users.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto text-emerald-400">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white">Base de datos lista para el Lanzamiento Oficial</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Aún no hay usuarias registradas. A medida que las compradoras adquieran su <strong>Tyruss Full (500g)</strong> y canjeen su código VIP de 6 dígitos en el cuestionario de bienvenida, aparecerán aquí en tiempo real con su progreso y adherencia.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Usuaria Manualmente</span>
                </button>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-700 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No se encontraron usuarias con los filtros aplicados</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Intenta modificar el término de búsqueda o restablecer los filtros de búsqueda.
              </p>
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setAngleFilter('all'); }}
                className="text-xs text-cyan-400 underline font-bold cursor-pointer"
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
                    <th className="py-3 px-3">Objetivo de Bienestar</th>
                    <th className="py-3 px-3">Progreso Reto 30D</th>
                    <th className="py-3 px-3">Estado Acceso</th>
                    <th className="py-3 px-3">Última Acción / Actividad</th>
                    <th className="py-3 px-4 text-right">Acciones Admin</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredUsers.map((user) => {
                    const userName = user.fullName || user.name || 'Usuaria TyroFem';
                    const vipCode = user.vipCode || user.accessCode || 'N/A';
                    const adherence = user.adherencePercentage ?? user.adherencePercent ?? 0;
                    const completedCount = user.completedDaysCount ?? user.completedDays ?? 0;
                    const cleanPhone = (user.phone || '').replace(/\D/g, '');
                    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hola ${userName}, te saludamos desde ColShopi Tienda soporte TyroFem 30D.`
                    )}`;

                    const isActive = user.status === 'active' || user.status === 'activa';
                    const isSuspended = user.status === 'suspended' || user.status === 'suspendida' || user.status === 'inhabilitada';
                    const isCompleted = user.status === 'completed_30d' || completedCount >= 30;

                    const formattedLastActivity = user.lastActivityAt ? new Date(user.lastActivityAt).toLocaleDateString('es-CO', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Reciente';

                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Column 1: User & Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold shrink-0">
                              {userName.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                              <h4 
                                className="font-bold text-white text-xs hover:text-cyan-300 cursor-pointer flex items-center gap-1.5"
                                onClick={() => setSelectedUserForDetail(user)}
                              >
                                <span>{userName}</span>
                                {Array.isArray(user.historyLog) && user.historyLog.length > 0 && (
                                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-800">
                                    {user.historyLog.length} logs
                                  </span>
                                )}
                              </h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1 truncate max-w-[180px]">
                                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </span>
                                {cleanPhone && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                                    title="Abrir chat de WhatsApp"
                                  >
                                    <MessageCircle className="w-3 h-3 shrink-0" />
                                    <span>{user.phone}</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: VIP Code */}
                        <td className="py-3.5 px-3">
                          <div className="inline-flex items-center gap-1 bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                            <KeyRound className="w-3 h-3 text-cyan-400" />
                            <span>{vipCode}</span>
                          </div>
                        </td>

                        {/* Column 3: Clinical Angle */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-200 block">
                              {user.healthGoal || getAngleLabel(user.primaryAngle)}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {user.ageGroup || '35-44 años'}
                            </span>
                          </div>
                        </td>

                        {/* Column 4: Progress & Adherence */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1 min-w-[120px]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-white">Día {user.currentDay || 1}/30</span>
                              <span className="font-bold text-amber-400">{adherence}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, adherence)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              {completedCount} de 30 días completados
                            </span>
                          </div>
                        </td>

                        {/* Column 5: Status */}
                        <td className="py-3.5 px-3">
                          {isActive && (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Activa (Habilitada)</span>
                            </div>
                          )}

                          {isSuspended && (
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

                          {isCompleted && !isSuspended && (
                            <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>Reto 30D Completado</span>
                            </div>
                          )}
                        </td>

                        {/* Column 6: Last Action & Activity */}
                        <td className="py-3.5 px-3 text-[11px] text-slate-300">
                          <div className="space-y-0.5 max-w-[180px]">
                            <p className="font-semibold text-slate-200 truncate" title={user.lastAction || 'Actividad registrada'}>
                              {user.lastAction || 'Sincronización activa'}
                            </p>
                            <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{formattedLastActivity}</span>
                            </span>
                          </div>
                        </td>

                        {/* Column 7: Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Quick Push Notification Trigger to this user */}
                            <button
                              type="button"
                              onClick={() => {
                                setPushConsolePreSelectedUser(user);
                                setIsPushConsoleOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-amber-950 text-amber-400 hover:text-amber-200 border border-slate-700 hover:border-amber-500/50 rounded-lg transition-colors cursor-pointer"
                              title={`Enviar Notificación Push directa a ${userName}`}
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>

                            {/* Ver Detalle / Historial */}
                            <button
                              type="button"
                              onClick={() => setSelectedUserForDetail(user)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Ver expediente e historial completo"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Action: Habilitar (if not active) */}
                            {isSuspended && (
                              <button
                                type="button"
                                onClick={() => handleOpenStatusModal(user, 'active')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                title="Habilitar acceso"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Habilitar</span>
                              </button>
                            )}

                            {/* Action: Suspender (if active) */}
                            {isActive && (
                              <button
                                type="button"
                                onClick={() => handleOpenStatusModal(user, 'suspended')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                title="Suspender temporalmente por mal uso"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Suspender</span>
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
      {/* MODAL 1: STATUS CHANGE (HABILITAR / SUSPENDER) */}
      {/* ========================================================================= */}
      {selectedUserForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${
                  newStatus === 'active' 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' 
                    : 'bg-amber-950 text-amber-400 border-amber-500/40'
                }`}>
                  {newStatus === 'active' ? <Unlock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-serif-luxury">
                    {newStatus === 'active' ? 'Habilitar Acceso de Usuaria' : 'Suspender Acceso de Usuaria'}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUserForStatus.fullName || selectedUserForStatus.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForStatus(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmStatusUpdate} className="space-y-4 text-xs">
              
              {/* Select Status */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Acción de Estado:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewStatus('active');
                      setStatusReason('');
                    }}
                    className={`py-2.5 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newStatus === 'active'
                        ? 'border-emerald-500 text-emerald-300 bg-emerald-950/60 ring-2 ring-emerald-400'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Habilitar Acceso
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStatus('suspended')}
                    className={`py-2.5 px-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newStatus === 'suspended'
                        ? 'border-amber-500 text-amber-300 bg-amber-950/60 ring-2 ring-amber-400'
                        : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Suspender Acceso
                  </button>
                </div>
              </div>

              {/* Status Reason Input */}
              {newStatus === 'suspended' && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center justify-between">
                    <span>Motivo de Suspensión:</span>
                    <span className="text-[10px] text-slate-400">(Visible en expediente)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={statusReason}
                    onChange={e => setStatusReason(e.target.value)}
                    placeholder="Ej. Compartición de cuenta con terceros no autorizados, anomalía en el código VIP..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                    required
                  />
                </div>
              )}

              {/* Security notice */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-cyan-300 block">Efecto inmediato:</span>
                <p>
                  {newStatus === 'active' 
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
                    newStatus === 'active'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-amber-600 hover:bg-amber-500'
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
      {/* MODAL 2: USER FULL DETAIL CARD & CHRONOLOGICAL HISTORY LOG */}
      {/* ========================================================================= */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
                  {(selectedUserForDetail.fullName || selectedUserForDetail.name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif-luxury">
                    {selectedUserForDetail.fullName || selectedUserForDetail.name}
                  </h3>
                  <span className="text-xs text-cyan-300 font-mono">ID: {selectedUserForDetail.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForDetail(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Status Badge & Code */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Código VIP Asignado</span>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold text-sm">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>{selectedUserForDetail.vipCode || selectedUserForDetail.accessCode}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estado de Acceso</span>
                  <span className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded-full ${
                    selectedUserForDetail.status === 'active' || selectedUserForDetail.status === 'activa'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : selectedUserForDetail.status === 'suspended' || selectedUserForDetail.status === 'suspendida'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {selectedUserForDetail.status === 'active' || selectedUserForDetail.status === 'activa' ? 'HABILITADA (ACTIVA)' :
                     selectedUserForDetail.status === 'suspended' || selectedUserForDetail.status === 'suspendida' ? 'SUSPENDIDA' : 'RETO 30D COMPLETADO'}
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
                      href={`https://wa.me/${(selectedUserForDetail.phone || '').replace(/\D/g, '')}`}
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
                    <span className="text-slate-200">{selectedUserForDetail.ageGroup || '35-44 años'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fecha de Registro:</span>
                    <span className="text-slate-200">
                      {new Date(selectedUserForDetail.registrationDate || selectedUserForDetail.registeredAt || Date.now()).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wellness Objective & Symptoms */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Enfoque de Hábitos</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Objetivo Principal:</span>
                  <span className="font-bold text-amber-300">{selectedUserForDetail.healthGoal || getAngleLabel(selectedUserForDetail.primaryAngle)}</span>
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

              {/* 30-Day Grid Visualizer */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    Cuadrícula de Progresión 30 Días
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">
                    Adherencia: {selectedUserForDetail.adherencePercentage ?? selectedUserForDetail.adherencePercent ?? 0}% ({selectedUserForDetail.completedDaysCount ?? selectedUserForDetail.completedDays ?? 0}/30)
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-1">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(dayNum => {
                    const isCompleted = 
                      (Array.isArray(selectedUserForDetail.completedDaysList) && selectedUserForDetail.completedDaysList.includes(dayNum)) ||
                      dayNum <= (selectedUserForDetail.completedDaysCount ?? selectedUserForDetail.completedDays ?? 0);
                    const isCurrent = dayNum === (selectedUserForDetail.currentDay || 1);

                    return (
                      <div 
                        key={dayNum}
                        className={`p-1.5 rounded-lg text-center font-bold text-[10px] flex flex-col items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                            : isCurrent
                            ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                            : 'bg-slate-900 border border-slate-800 text-slate-500'
                        }`}
                        title={isCompleted ? `Día ${dayNum} Completado` : isCurrent ? `Día ${dayNum} Activo Hoy` : `Día ${dayNum} Pendiente`}
                      >
                        <span>{dayNum}</span>
                        {isCompleted ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Chronological History Log */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    Historial Cronológico de Actividad en Tiempo Real
                  </span>
                </div>

                {Array.isArray(selectedUserForDetail.historyLog) && selectedUserForDetail.historyLog.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedUserForDetail.historyLog.slice().reverse().map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-[11px]">
                        <span className="text-[10px] font-mono text-cyan-400 shrink-0 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {log.timestamp}
                        </span>
                        <span className="text-slate-200 leading-tight font-medium">
                          {log.event}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px] italic">
                    Sin eventos registrados aún.
                  </p>
                )}
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
                className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
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
                    handleOpenStatusModal(
                      user, 
                      user.status === 'active' || user.status === 'activa' ? 'suspended' : 'active'
                    );
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
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
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
                <label className="text-slate-300 font-bold block">Objetivo de Bienestar:</label>
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

      {/* ========================================================================= */}
      {/* MODAL 4: PUSH NOTIFICATION CONSOLE MODAL */}
      {/* ========================================================================= */}
      <PushNotificationConsoleModal
        isOpen={isPushConsoleOpen}
        onClose={() => {
          setIsPushConsoleOpen(false);
          setPushConsolePreSelectedUser(null);
        }}
        users={users}
        preSelectedUser={pushConsolePreSelectedUser}
        onPushSent={() => {
          reloadUsers(false);
        }}
      />

    </div>
  );
};

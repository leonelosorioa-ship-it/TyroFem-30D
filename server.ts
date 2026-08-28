import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Storage path for registered users database and codes
  const DATA_DIR = path.join(process.cwd(), 'data');
  const USERS_FILE = path.join(DATA_DIR, 'registered_users.json');
  const CODES_FILE = path.join(DATA_DIR, 'redeemed_codes.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Load or initialize users in memory
  let usersCache: any[] = [];
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        usersCache = parsed;
      }
    }
  } catch (err) {
    console.error('Error reading users file:', err);
    usersCache = [];
  }

  // Load or initialize redeemed codes in memory
  let redeemedCodesCache: Record<string, any> = {};
  try {
    if (fs.existsSync(CODES_FILE)) {
      const raw = fs.readFileSync(CODES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        redeemedCodesCache = parsed;
      }
    }
  } catch (err) {
    console.error('Error reading codes file:', err);
    redeemedCodesCache = {};
  }

  function persistUsers() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting users file:', err);
    }
  }

  function persistCodes() {
    try {
      fs.writeFileSync(CODES_FILE, JSON.stringify(redeemedCodesCache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting codes file:', err);
    }
  }

  // Auto-sync codes from users cache if any user has an access code
  usersCache.forEach((u: any) => {
    if (u.accessCode && u.accessCode !== '250816') {
      const cleanCode = u.accessCode.trim();
      if (!redeemedCodesCache[cleanCode]) {
        redeemedCodesCache[cleanCode] = {
          code: cleanCode,
          redeemedAt: u.registeredAt || new Date().toISOString(),
          userName: u.name,
          userPhone: u.phone,
          userEmail: u.email
        };
      }
    }
  });
  persistCodes();

  // Helper to format health goal title
  function getHealthGoalLabel(angle?: string): string {
    switch (angle) {
      case 'tiroides_metabolismo': return 'Tiroides & Metabolismo';
      case 'desbalance_menopausia': return 'Desbalance Hormonal & Menopausia';
      case 'ciclos_spm': return 'Ciclos Irregulares & SPM';
      case 'digestion_detox': return 'Digestión Lenta & Detox';
      default: return 'Tiroides & Metabolismo';
    }
  }

  // Format date helper for history log
  function formatLogTime(date = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${y}-${m}-${d} ${h}:${min}`;
  }

  // Seed default registered buyers if cache is empty or minimal
  if (usersCache.length === 0) {
    const nowIso = new Date().toISOString();
    const nowLog = formatLogTime();
    usersCache = [
      {
        id: 'USR-623914',
        vipCode: '623914',
        fullName: 'Sandra Patricia Morales',
        name: 'Sandra Patricia Morales',
        phone: '3109876543',
        email: 'sandra.morales@hotmail.com',
        registrationDate: '2026-08-25T14:30:00.000Z',
        registeredAt: '2026-08-25T14:30:00.000Z',
        healthGoal: 'Desbalance Hormonal & Menopausia',
        primaryAngle: 'desbalance_menopausia',
        symptoms: ['Sofocos repentinos y oleadas de calor', 'Sudoración nocturna', 'Insomnio'],
        ageGroup: '45-54 años',
        status: 'active',
        currentDay: 3,
        completedDaysCount: 3,
        completedDays: 3,
        completedDaysList: [1, 2, 3],
        adherencePercentage: 100,
        adherencePercent: 100,
        lastActivityTimestamp: Date.now() - 3600000 * 2,
        lastActivityAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        lastAction: 'Check-in Día 3 completado (Energía: 5/5)',
        historyLog: [
          { timestamp: '2026-08-25 14:30', event: 'Login inicial con Código VIP #623914' },
          { timestamp: '2026-08-25 14:35', event: 'Onboarding completado (Objetivo: Desbalance Hormonal & Menopausia)' },
          { timestamp: '2026-08-25 21:10', event: 'Completó Test Día 1 - Toma Tyruss Full confirmada (Energía: 4/5)' },
          { timestamp: '2026-08-26 21:05', event: 'Completó Test Día 2 - Toma Tyruss Full confirmada (Energía: 4/5)' },
          { timestamp: '2026-08-27 18:20', event: 'Completó Test Día 3 - Toma Tyruss Full confirmada (Energía: 5/5)' }
        ],
        progressMap: {
          1: { dayNumber: 1, tyrussTaken: true, water2L: true, antiinflammatoryMeal: true, extraHabit: true, energyLevel: 4, digestion: 'liviana', mood: 'tranquila', sleepStars: 4, notes: 'Me sentí con menos hinchazón al despertar.', completedAt: '2026-08-25T21:10:00Z', isLockedAfterSubmit: true },
          2: { dayNumber: 2, tyrussTaken: true, water2L: true, antiinflammatoryMeal: true, extraHabit: true, energyLevel: 4, digestion: 'normal', mood: 'radiante', sleepStars: 4, notes: 'Los sofocos han disminuido en la noche.', completedAt: '2026-08-26T21:05:00Z', isLockedAfterSubmit: true },
          3: { dayNumber: 3, tyrussTaken: true, water2L: true, antiinflammatoryMeal: true, extraHabit: true, energyLevel: 5, digestion: 'liviana', mood: 'radiante', sleepStars: 5, notes: 'Dormí profundo por primera vez en semanas.', completedAt: '2026-08-27T18:20:00Z', isLockedAfterSubmit: true }
        }
      },
      {
        id: 'USR-849201',
        vipCode: '849201',
        fullName: 'María Camila Gómez',
        name: 'María Camila Gómez',
        phone: '3124567890',
        email: 'mariagomez@gmail.com',
        registrationDate: '2026-08-26T10:15:00.000Z',
        registeredAt: '2026-08-26T10:15:00.000Z',
        healthGoal: 'Tiroides & Metabolismo',
        primaryAngle: 'tiroides_metabolismo',
        symptoms: ['Metabolismo lento a pesar de comer poco', 'Fatiga crónica y letargo matutino', 'Caída de cabello'],
        ageGroup: '35-44 años',
        status: 'active',
        currentDay: 2,
        completedDaysCount: 2,
        completedDays: 2,
        completedDaysList: [1, 2],
        adherencePercentage: 100,
        adherencePercent: 100,
        lastActivityTimestamp: Date.now() - 3600000 * 5,
        lastActivityAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        lastAction: 'Check-in Día 2 completado',
        historyLog: [
          { timestamp: '2026-08-26 10:15', event: 'Login inicial con Código VIP #849201' },
          { timestamp: '2026-08-26 10:20', event: 'Onboarding completado (Objetivo: Tiroides & Metabolismo)' },
          { timestamp: '2026-08-26 20:45', event: 'Completó Test Día 1 - Toma Tyruss Full confirmada' },
          { timestamp: '2026-08-27 15:30', event: 'Consulta a Marié IA: "¿A qué hora tomar la dosis de Tyruss Full?"' },
          { timestamp: '2026-08-27 20:10', event: 'Completó Test Día 2 - Toma Tyruss Full confirmada' }
        ],
        progressMap: {
          1: { dayNumber: 1, tyrussTaken: true, water2L: true, antiinflammatoryMeal: true, extraHabit: true, energyLevel: 4, digestion: 'normal', mood: 'enfocada', sleepStars: 4, notes: 'Sabor muy agradable, lo preparé en infusión tibia.', completedAt: '2026-08-26T20:45:00Z', isLockedAfterSubmit: true },
          2: { dayNumber: 2, tyrussTaken: true, water2L: true, antiinflammatoryMeal: true, extraHabit: false, energyLevel: 4, digestion: 'liviana', mood: 'tranquila', sleepStars: 4, notes: 'Siento mucha más energía en la tarde.', completedAt: '2026-08-27T20:10:00Z', isLockedAfterSubmit: true }
        }
      },
      {
        id: 'USR-518472',
        vipCode: '518472',
        fullName: 'Penélope Cruz Osorio',
        name: 'Penélope Cruz Osorio',
        phone: '3104007428',
        email: 'penelope.cruz@gmail.com',
        registrationDate: '2026-08-27T19:10:00.000Z',
        registeredAt: '2026-08-27T19:10:00.000Z',
        healthGoal: 'Tiroides & Metabolismo',
        primaryAngle: 'tiroides_metabolismo',
        symptoms: ['Fatiga matutina', 'Sensibilidad extrema al frío', 'Retención de líquidos'],
        ageGroup: '35-44 años',
        status: 'active',
        currentDay: 1,
        completedDaysCount: 1,
        completedDays: 1,
        completedDaysList: [1],
        adherencePercentage: 100,
        adherencePercent: 100,
        lastActivityTimestamp: Date.now() - 1000 * 60 * 15,
        lastActivityAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        lastAction: 'Check-in Día 1 completado',
        historyLog: [
          { timestamp: nowLog, event: 'Login inicial con Código VIP #518472' },
          { timestamp: nowLog, event: 'Onboarding completado (Objetivo: Tiroides & Metabolismo)' },
          { timestamp: nowLog, event: 'Completó Test Día 1 - Toma Tyruss Full confirmada (Energía: 5/5)' }
        ],
        progressMap: {
          1: { dayNumber: 1, tyrussTaken: true, water2L: true, antiinflammatoryMeal: true, extraHabit: true, energyLevel: 5, digestion: 'liviana', mood: 'radiante', sleepStars: 5, notes: 'Excelente inicio del reto de 30 días.', completedAt: new Date().toISOString(), isLockedAfterSubmit: true }
        }
      }
    ];
    persistUsers();
  }

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      server: 'ColShopi Tienda Central Database API', 
      usersCount: usersCache.length, 
      time: new Date().toISOString() 
    });
  });

  // GET all registered users
  app.get('/api/users', (req, res) => {
    res.json({ 
      success: true, 
      count: usersCache.length,
      users: usersCache 
    });
  });

  // POST create or update user
  app.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user || (!user.id && !user.email && !user.accessCode && !user.vipCode)) {
      return res.status(400).json({ error: 'Invalid user payload' });
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const cleanCode = (user.vipCode || user.accessCode || '').toString().replace(/\D/g, '').trim();
    const now = new Date().toISOString();
    const nowLog = formatLogTime();

    const existingIndex = usersCache.findIndex(
      (u: any) =>
        (user.id && u.id === user.id) ||
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
        (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    const healthGoal = user.healthGoal || getHealthGoalLabel(user.primaryAngle);
    const fullName = user.fullName || user.name || 'Usuaria TyroFem';
    const status = user.status === 'suspendida' || user.status === 'suspended' ? 'suspended' : 'active';
    const completedDaysCount = Number(user.completedDaysCount ?? user.completedDays ?? 0);
    const adherencePercentage = Number(user.adherencePercentage ?? user.adherencePercent ?? 0);

    if (existingIndex >= 0) {
      const existing = usersCache[existingIndex];
      const historyLog = Array.isArray(existing.historyLog) ? [...existing.historyLog] : [];
      if (user.newHistoryEvent) {
        historyLog.push({ timestamp: nowLog, event: user.newHistoryEvent });
      }

      usersCache[existingIndex] = {
        ...existing,
        ...user,
        fullName,
        name: fullName,
        email: cleanEmail || existing.email,
        vipCode: cleanCode || existing.vipCode || existing.accessCode,
        accessCode: cleanCode || existing.accessCode || existing.vipCode,
        healthGoal,
        status,
        completedDaysCount: Math.max(completedDaysCount, existing.completedDaysCount || 0),
        completedDays: Math.max(completedDaysCount, existing.completedDaysCount || 0),
        adherencePercentage: Math.max(adherencePercentage, existing.adherencePercentage || 0),
        adherencePercent: Math.max(adherencePercentage, existing.adherencePercentage || 0),
        lastActivityTimestamp: Date.now(),
        lastActivityAt: now,
        lastAction: user.lastAction || existing.lastAction || 'Actualización de perfil',
        historyLog
      };
    } else {
      const historyLog = Array.isArray(user.historyLog) && user.historyLog.length > 0
        ? user.historyLog
        : [
            { timestamp: nowLog, event: `Login con Código VIP #${cleanCode || '623914'}` },
            { timestamp: nowLog, event: `Registro y Onboarding completado (${healthGoal})` }
          ];

      const newUser = {
        id: user.id || `USR-${cleanCode || Date.now()}`,
        vipCode: cleanCode,
        accessCode: cleanCode,
        fullName,
        name: fullName,
        email: cleanEmail,
        phone: user.phone ? user.phone.replace(/\D/g, '') : '',
        registrationDate: user.registrationDate || user.registeredAt || now,
        registeredAt: user.registeredAt || user.registrationDate || now,
        healthGoal,
        primaryAngle: user.primaryAngle || 'tiroides_metabolismo',
        symptoms: Array.isArray(user.symptoms) ? user.symptoms : ['Soporte nutricional Tyruss Full'],
        ageGroup: user.ageGroup || '35-44 años',
        status,
        statusReason: user.statusReason,
        currentDay: user.currentDay || 1,
        completedDaysCount,
        completedDays: completedDaysCount,
        completedDaysList: Array.isArray(user.completedDaysList) ? user.completedDaysList : (completedDaysCount > 0 ? [1] : []),
        adherencePercentage,
        adherencePercent: adherencePercentage,
        lastActivityTimestamp: Date.now(),
        lastActivityAt: now,
        lastAction: user.lastAction || `Registro completado (${healthGoal})`,
        historyLog,
        progressMap: user.progressMap || {},
        notes: user.notes || 'Registro oficial en ColShopi Tienda TyroFem 30D'
      };
      usersCache.unshift(newUser);
    }

    if (cleanCode && cleanCode !== '250816') {
      redeemedCodesCache[cleanCode] = {
        code: cleanCode,
        redeemedAt: now,
        userName: fullName,
        userPhone: user.phone || '',
        userEmail: cleanEmail || ''
      };
      persistCodes();
    }

    persistUsers();
    res.json({ success: true, count: usersCache.length, user: existingIndex >= 0 ? usersCache[existingIndex] : usersCache[0] });
  });

  // POST sync session progress for an active user
  app.post('/api/users/sync', (req, res) => {
    const { userProfile, progressMap, actionDescription } = req.body;
    if (!userProfile || (!userProfile.email && !userProfile.accessCode && !userProfile.vipCode)) {
      return res.json({ success: true, count: usersCache.length, users: usersCache });
    }

    // Ignore admin user profile from being registered as a regular client
    if (userProfile.isAdmin) {
      return res.json({ success: true, count: usersCache.length, users: usersCache });
    }

    const cleanEmail = (userProfile.email || '').toLowerCase().trim();
    const cleanCode = (userProfile.vipCode || userProfile.accessCode || '').toString().replace(/\D/g, '').trim();
    const now = new Date().toISOString();
    const nowLog = formatLogTime();

    if (cleanCode && cleanCode !== '250816') {
      redeemedCodesCache[cleanCode] = {
        code: cleanCode,
        redeemedAt: userProfile.startDate || userProfile.registrationDate || now,
        userName: userProfile.fullName || userProfile.name || 'Compradora VIP',
        userPhone: userProfile.phone || '',
        userEmail: cleanEmail || ''
      };
      persistCodes();
    }

    // Calculate completed days & adherence
    const completedDaysList: number[] = [];
    if (progressMap && typeof progressMap === 'object') {
      Object.entries(progressMap).forEach(([dayStr, d]: [string, any]) => {
        if (d && (d.completedAt || (d.tyrussTaken && d.water2L) || d.isLockedAfterSubmit)) {
          completedDaysList.push(Number(dayStr));
        }
      });
      completedDaysList.sort((a, b) => a - b);
    }
    const completedDaysCount = completedDaysList.length;
    const adherencePercentage = Math.min(100, Math.round((completedDaysCount / 30) * 100));

    const existingIndex = usersCache.findIndex(
      (u: any) =>
        (userProfile.id && u.id === userProfile.id) ||
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
        (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    const healthGoal = userProfile.healthGoal || getHealthGoalLabel(userProfile.primaryAngle);
    const fullName = userProfile.fullName || userProfile.name || 'Usuaria TyroFem';
    const status = userProfile.status === 'suspendida' || userProfile.status === 'suspended' ? 'suspended' : 'active';
    const lastAction = actionDescription || (completedDaysCount > 0 ? `Check-in Día ${completedDaysList[completedDaysList.length - 1]} completado` : 'Sincronización activa');

    if (existingIndex >= 0) {
      const existing = usersCache[existingIndex];
      const historyLog = Array.isArray(existing.historyLog) ? [...existing.historyLog] : [];
      if (actionDescription && (!historyLog.length || historyLog[historyLog.length - 1].event !== actionDescription)) {
        historyLog.push({ timestamp: nowLog, event: actionDescription });
      }

      usersCache[existingIndex] = {
        ...existing,
        fullName,
        name: fullName,
        phone: userProfile.phone ? userProfile.phone.replace(/\D/g, '') : existing.phone,
        email: cleanEmail || existing.email,
        vipCode: cleanCode || existing.vipCode,
        accessCode: cleanCode || existing.accessCode,
        healthGoal,
        primaryAngle: userProfile.primaryAngle || existing.primaryAngle,
        symptoms: userProfile.symptoms || existing.symptoms,
        ageGroup: userProfile.ageGroup || existing.ageGroup,
        currentDay: userProfile.currentDay || Math.max(completedDaysCount + 1, existing.currentDay || 1),
        completedDaysCount: Math.max(completedDaysCount, existing.completedDaysCount || 0),
        completedDays: Math.max(completedDaysCount, existing.completedDaysCount || 0),
        completedDaysList: completedDaysList.length > 0 ? completedDaysList : existing.completedDaysList || [],
        adherencePercentage: Math.max(adherencePercentage, existing.adherencePercentage || 0),
        adherencePercent: Math.max(adherencePercentage, existing.adherencePercentage || 0),
        status: existing.status || status,
        statusReason: existing.statusReason,
        lastActivityTimestamp: Date.now(),
        lastActivityAt: now,
        lastAction,
        historyLog,
        progressMap: progressMap || existing.progressMap || {}
      };
    } else {
      const historyLog = [
        { timestamp: nowLog, event: `Login con Código VIP #${cleanCode || '623914'}` },
        { timestamp: nowLog, event: `Registro y Onboarding completado (${healthGoal})` }
      ];
      if (actionDescription) {
        historyLog.push({ timestamp: nowLog, event: actionDescription });
      }

      usersCache.unshift({
        id: userProfile.id || `USR-${cleanCode || Date.now()}`,
        vipCode: cleanCode,
        accessCode: cleanCode,
        fullName,
        name: fullName,
        email: cleanEmail,
        phone: userProfile.phone ? userProfile.phone.replace(/\D/g, '') : '',
        registrationDate: userProfile.startDate || userProfile.registrationDate || now,
        registeredAt: userProfile.startDate || userProfile.registrationDate || now,
        healthGoal,
        primaryAngle: userProfile.primaryAngle || 'tiroides_metabolismo',
        symptoms: userProfile.symptoms || ['Soporte nutricional Tyruss Full'],
        ageGroup: userProfile.ageGroup || '35-44 años',
        currentDay: userProfile.currentDay || 1,
        completedDaysCount,
        completedDays: completedDaysCount,
        completedDaysList,
        adherencePercentage,
        adherencePercent: adherencePercentage,
        status,
        lastActivityTimestamp: Date.now(),
        lastActivityAt: now,
        lastAction,
        historyLog,
        progressMap: progressMap || {},
        notes: 'Sincronizada automáticamente desde el ingreso a la App'
      });
    }

    persistUsers();
    res.json({ success: true, count: usersCache.length, user: existingIndex >= 0 ? usersCache[existingIndex] : usersCache[0] });
  });

  // POST record user activity event into historyLog
  app.post('/api/users/event', (req, res) => {
    const { userIdOrEmail, event, actionType } = req.body;
    if (!userIdOrEmail || !event) {
      return res.status(400).json({ error: 'userIdOrEmail and event are required' });
    }

    const cleanQuery = userIdOrEmail.toString().trim().toLowerCase();
    const cleanCode = userIdOrEmail.toString().replace(/\D/g, '').trim();

    const userIndex = usersCache.findIndex(
      (u: any) =>
        u.id === userIdOrEmail ||
        (u.email && u.email.toLowerCase() === cleanQuery) ||
        (cleanCode && (u.vipCode === cleanCode || u.accessCode === cleanCode))
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const nowIso = new Date().toISOString();
    const nowLog = formatLogTime();
    const historyLog = Array.isArray(usersCache[userIndex].historyLog) ? [...usersCache[userIndex].historyLog] : [];
    historyLog.push({ timestamp: nowLog, event });

    usersCache[userIndex] = {
      ...usersCache[userIndex],
      lastActivityTimestamp: Date.now(),
      lastActivityAt: nowIso,
      lastAction: actionType || event,
      historyLog
    };

    persistUsers();
    res.json({ success: true, user: usersCache[userIndex] });
  });

  // PATCH user status (Habilitar / Suspender / Inhabilitar)
  app.patch('/api/users/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    const cleanQuery = id.trim().toLowerCase();
    const userIndex = usersCache.findIndex(
      (u: any) => u.id === id || u.email?.toLowerCase() === cleanQuery || u.accessCode === cleanQuery
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in central database' });
    }

    usersCache[userIndex].status = status;
    if (reason !== undefined) {
      usersCache[userIndex].statusReason = reason;
    } else if (status === 'activa') {
      delete usersCache[userIndex].statusReason;
    }
    usersCache[userIndex].lastActivityAt = new Date().toISOString();

    persistUsers();
    res.json({ success: true, user: usersCache[userIndex] });
  });

  // DELETE user
  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const cleanQuery = id.trim().toLowerCase();
    const initialLen = usersCache.length;
    usersCache = usersCache.filter(
      (u: any) => u.id !== id && u.email?.toLowerCase() !== cleanQuery && u.accessCode !== cleanQuery
    );
    persistUsers();
    res.json({ success: true, deleted: initialLen !== usersCache.length, count: usersCache.length });
  });

  // GET all redeemed VIP codes
  app.get('/api/codes', (req, res) => {
    res.json({
      success: true,
      count: Object.keys(redeemedCodesCache).length,
      codes: redeemedCodesCache
    });
  });

  // POST redeem VIP code
  app.post('/api/codes/redeem', (req, res) => {
    const { code, userName, userPhone, userEmail } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    const cleanCode = code.toString().replace(/\D/g, '').trim();
    redeemedCodesCache[cleanCode] = {
      code: cleanCode,
      redeemedAt: new Date().toISOString(),
      userName: userName || 'Compradora VIP',
      userPhone: userPhone || '',
      userEmail: userEmail || ''
    };
    persistCodes();
    res.json({ success: true, code: redeemedCodesCache[cleanCode] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ColShopi Central Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

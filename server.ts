import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Storage path for registered users database
  const DATA_DIR = path.join(process.cwd(), 'data');
  const USERS_FILE = path.join(DATA_DIR, 'registered_users.json');

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

  function persistUsers() {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting users file:', err);
    }
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
    if (!user || (!user.id && !user.email && !user.accessCode)) {
      return res.status(400).json({ error: 'Invalid user payload' });
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const cleanCode = (user.accessCode || '').trim();

    const existingIndex = usersCache.findIndex(
      (u: any) =>
        (user.id && u.id === user.id) ||
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
        (cleanCode && u.accessCode === cleanCode)
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      usersCache[existingIndex] = {
        ...usersCache[existingIndex],
        ...user,
        email: cleanEmail || usersCache[existingIndex].email,
        accessCode: cleanCode || usersCache[existingIndex].accessCode,
        lastActivityAt: now
      };
    } else {
      const newUser = {
        id: user.id || `usr_${cleanCode || Date.now()}`,
        name: user.name || 'Usuaria TyroFem',
        email: cleanEmail,
        phone: user.phone || '',
        accessCode: cleanCode,
        ageGroup: user.ageGroup || '35-44 años',
        primaryAngle: user.primaryAngle || 'tiroides_metabolismo',
        symptoms: Array.isArray(user.symptoms) ? user.symptoms : ['Soporte nutricional Tyruss Full'],
        startDate: user.startDate || now,
        currentDay: user.currentDay || 1,
        completedDays: user.completedDays || 0,
        adherencePercent: user.adherencePercent || 0,
        status: user.status || 'activa',
        statusReason: user.statusReason,
        registeredAt: user.registeredAt || now,
        lastActivityAt: now,
        notes: user.notes || 'Registro oficial en ColShopi Tienda TyroFem 30D'
      };
      usersCache.unshift(newUser);
    }

    persistUsers();
    res.json({ success: true, count: usersCache.length, user: existingIndex >= 0 ? usersCache[existingIndex] : usersCache[0] });
  });

  // POST sync session progress for an active user
  app.post('/api/users/sync', (req, res) => {
    const { userProfile, progressMap } = req.body;
    if (!userProfile || (!userProfile.email && !userProfile.accessCode)) {
      return res.json({ success: true, count: usersCache.length, users: usersCache });
    }

    // Ignore admin user profile from being registered as a regular client
    if (userProfile.isAdmin) {
      return res.json({ success: true, count: usersCache.length, users: usersCache });
    }

    const cleanEmail = (userProfile.email || '').toLowerCase().trim();
    const cleanCode = (userProfile.accessCode || '').trim();

    // Calculate completed days & adherence
    let completedDays = 0;
    if (progressMap && typeof progressMap === 'object') {
      const days = Object.values(progressMap) as any[];
      completedDays = days.filter(d => d.completedAt || (d.tyrussTaken && d.water2L) || d.isLockedAfterSubmit).length;
    }
    const adherencePercent = Math.min(100, Math.round((completedDays / 30) * 100));

    const existingIndex = usersCache.findIndex(
      (u: any) =>
        (userProfile.id && u.id === userProfile.id) ||
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
        (cleanCode && u.accessCode === cleanCode)
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      usersCache[existingIndex] = {
        ...usersCache[existingIndex],
        name: userProfile.name || usersCache[existingIndex].name,
        phone: userProfile.phone || usersCache[existingIndex].phone,
        ageGroup: userProfile.ageGroup || usersCache[existingIndex].ageGroup,
        primaryAngle: userProfile.primaryAngle || usersCache[existingIndex].primaryAngle,
        symptoms: userProfile.symptoms || usersCache[existingIndex].symptoms,
        completedDays: Math.max(completedDays, usersCache[existingIndex].completedDays || 0),
        adherencePercent: Math.max(adherencePercent, usersCache[existingIndex].adherencePercent || 0),
        status: userProfile.status || usersCache[existingIndex].status || 'activa',
        statusReason: userProfile.statusReason || usersCache[existingIndex].statusReason,
        lastActivityAt: now
      };
    } else {
      usersCache.unshift({
        id: `usr_${cleanCode || Date.now()}`,
        name: userProfile.name || 'Usuaria TyroFem',
        email: cleanEmail,
        phone: userProfile.phone || '',
        accessCode: cleanCode,
        ageGroup: userProfile.ageGroup || '35-44 años',
        primaryAngle: userProfile.primaryAngle || 'tiroides_metabolismo',
        symptoms: userProfile.symptoms || ['Soporte nutricional Tyruss Full'],
        startDate: userProfile.startDate || now,
        currentDay: 1,
        completedDays,
        adherencePercent,
        status: userProfile.status || 'activa',
        registeredAt: now,
        lastActivityAt: now,
        notes: 'Sincronizada automáticamente desde el ingreso a la App'
      });
    }

    persistUsers();
    res.json({ success: true, count: usersCache.length });
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

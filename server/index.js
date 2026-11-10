import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load persistent data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data file', err);
  }
  return null;
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data file', err);
  }
}

let store = loadData();

if (!store) {
  store = {
    services: [],
    barbers: [],
    appointments: [],
    packages: [],
    hairstyles: [],
    settings: {},
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Admin Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (
    (email === 'admin@aurelius.com' && password === 'admin123') ||
    (email === 'manager@aurelius.com' && password === 'manager123')
  ) {
    return res.json({
      success: true,
      token: 'jwt-aurelius-' + Buffer.from(email + ':' + Date.now()).toString('base64'),
      user: {
        id: 'adm-1',
        name: email === 'admin@aurelius.com' ? 'Marcus Vance (Master Craftsman & Director)' : 'Studio Concierge',
        email,
        role: 'superadmin',
      },
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials. Use admin@aurelius.com / admin123' });
});

// Services CRUD
app.get('/api/services', (req, res) => {
  res.json(store.services);
});

app.post('/api/services', (req, res) => {
  const newService = {
    id: 'srv-' + Date.now(),
    name: req.body.name,
    category: req.body.category || 'hair',
    price: Number(req.body.price) || 40,
    durationMinutes: Number(req.body.durationMinutes) || 30,
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    popular: Boolean(req.body.popular),
    isActive: true,
  };
  store.services.push(newService);
  saveData(store);
  res.status(201).json(newService);
});

app.put('/api/services/:id', (req, res) => {
  const { id } = req.params;
  const index = store.services.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Service not found' });
  }
  store.services[index] = { ...store.services[index], ...req.body };
  saveData(store);
  res.json(store.services[index]);
});

app.delete('/api/services/:id', (req, res) => {
  const { id } = req.params;
  store.services = store.services.filter((s) => s.id !== id);
  saveData(store);
  res.json({ success: true, message: 'Service deleted' });
});

// Barbers CRUD
app.get('/api/barbers', (req, res) => {
  res.json(store.barbers);
});

app.put('/api/barbers/:id', (req, res) => {
  const { id } = req.params;
  const index = store.barbers.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Barber not found' });
  }
  store.barbers[index] = { ...store.barbers[index], ...req.body };
  saveData(store);
  res.json(store.barbers[index]);
});

app.post('/api/barbers', (req, res) => {
  const newBarber = {
    id: 'barber-' + Date.now(),
    name: req.body.name,
    role: req.body.role || 'Barber Artisan',
    experienceYears: Number(req.body.experienceYears) || 5,
    specialization: req.body.specialization || ['Haircuts', 'Styling'],
    rating: 5.0,
    reviewCount: 0,
    workingHours: req.body.workingHours || '10:00 AM - 7:00 PM',
    image: req.body.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    bio: req.body.bio || '',
    isAvailable: true,
  };
  store.barbers.push(newBarber);
  saveData(store);
  res.status(201).json(newBarber);
});

// Appointments & Double Booking Prevention
app.get('/api/appointments', (req, res) => {
  const { date, barberId } = req.query;
  let list = store.appointments;
  if (date) {
    list = list.filter((a) => a.appointmentDate === date);
  }
  if (barberId) {
    list = list.filter((a) => a.barberId === barberId);
  }
  res.json(list);
});

app.post('/api/appointments', (req, res) => {
  const {
    serviceId,
    serviceName,
    servicePrice,
    serviceDuration,
    barberId,
    barberName,
    customerName,
    customerPhone,
    customerEmail,
    appointmentDate,
    appointmentTime,
    notes,
  } = req.body;

  if (!customerName || !customerPhone || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: 'Missing required appointment parameters' });
  }

  // DOUBLE BOOKING CHECK
  let assignedBarberId = barberId;
  let assignedBarberName = barberName;

  if (assignedBarberId === 'any' || !assignedBarberId) {
    const busyBarberIds = store.appointments
      .filter(
        (a) =>
          a.appointmentDate === appointmentDate &&
          a.appointmentTime === appointmentTime &&
          a.status !== 'cancelled'
      )
      .map((a) => a.barberId);

    const freeBarber = store.barbers.find((b) => b.isAvailable && !busyBarberIds.includes(b.id));
    if (!freeBarber) {
      return res.status(409).json({
        message: 'All master barbers are fully booked for this time slot. Please select a different time.',
      });
    }
    assignedBarberId = freeBarber.id;
    assignedBarberName = freeBarber.name;
  } else {
    const conflict = store.appointments.find(
      (a) =>
        a.barberId === assignedBarberId &&
        a.appointmentDate === appointmentDate &&
        a.appointmentTime === appointmentTime &&
        a.status !== 'cancelled'
    );

    if (conflict) {
      return res.status(409).json({
        message: `Conflict: ${assignedBarberName || 'This barber'} is already booked on ${appointmentDate} at ${appointmentTime}. Please select another time slot.`,
      });
    }
  }

  const bookingCode = 'AUR-' + Math.floor(1000 + Math.random() * 9000);
  const newAppointment = {
    id: 'apt-' + Date.now(),
    bookingCode,
    serviceId,
    serviceName,
    servicePrice: Number(servicePrice) || 45,
    serviceDuration: Number(serviceDuration) || 40,
    barberId: assignedBarberId,
    barberName: assignedBarberName,
    customerName,
    customerPhone,
    customerEmail: customerEmail || '',
    appointmentDate,
    appointmentTime,
    notes: notes || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  store.appointments.unshift(newAppointment);
  saveData(store);

  console.log(`[Aurelius Notification] Booking confirmed ${bookingCode} for ${customerName} (${customerPhone}) on ${appointmentDate} at ${appointmentTime}.`);

  res.status(201).json({
    success: true,
    appointment: newAppointment,
    message: 'Appointment successfully confirmed!',
  });
});

app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const index = store.appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  store.appointments[index] = { ...store.appointments[index], ...req.body };
  saveData(store);
  res.json(store.appointments[index]);
});

// Packages CRUD
app.get('/api/packages', (req, res) => {
  res.json(store.packages);
});

app.put('/api/packages/:id', (req, res) => {
  const { id } = req.params;
  const index = store.packages.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Package not found' });
  }
  store.packages[index] = { ...store.packages[index], ...req.body };
  saveData(store);
  res.json(store.packages[index]);
});

// Gallery CRUD
app.get('/api/gallery', (req, res) => {
  res.json(store.hairstyles);
});

app.post('/api/gallery', (req, res) => {
  const newItem = {
    id: 'style-' + Date.now(),
    title: req.body.title,
    category: req.body.category || 'fade',
    image: req.body.image,
    beforeImage: req.body.beforeImage || '',
    description: req.body.description || '',
    barberName: req.body.barberName || 'Master Barber',
    tags: req.body.tags || ['Custom Style'],
  };
  store.hairstyles.unshift(newItem);
  saveData(store);
  res.status(201).json(newItem);
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  store.hairstyles = store.hairstyles.filter((h) => h.id !== id);
  saveData(store);
  res.json({ success: true, message: 'Gallery item removed' });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(store.settings);
});

app.put('/api/settings', (req, res) => {
  store.settings = { ...store.settings, ...req.body };
  saveData(store);
  res.json(store.settings);
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const totalRevenue = store.appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.servicePrice || 0), 0);

  const completedCount = store.appointments.filter((a) => a.status === 'completed').length;
  const confirmedCount = store.appointments.filter((a) => a.status === 'confirmed').length;
  const cancelledCount = store.appointments.filter((a) => a.status === 'cancelled').length;

  const serviceCounts = {};
  store.appointments.forEach((a) => {
    serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
  });

  const topServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const barberCounts = {};
  store.appointments.forEach((a) => {
    barberCounts[a.barberName] = (barberCounts[a.barberName] || 0) + 1;
  });

  res.json({
    totalRevenue,
    totalBookings: store.appointments.length,
    completedCount,
    confirmedCount,
    cancelledCount,
    topServices,
    barberCounts,
    averageTicketValue: store.appointments.length > 0 ? Math.round(totalRevenue / store.appointments.length) : 0,
  });
});

// Error handling protection & persistence
process.on('uncaughtException', (err) => {
  console.error('[Aurelius Server Uncaught]', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Aurelius Server Rejection]', reason);
});

// Keep process active indefinitely
setInterval(() => {}, 1000 * 60 * 60);

// Graceful signal handling
process.on('SIGTERM', () => {
  console.log('[Aurelius Server] Received SIGTERM');
});
process.on('SIGINT', () => {
  console.log('[Aurelius Server] Received SIGINT');
});

// Serve frontend build if present
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const htmlPath = path.join(distPath, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath, (err) => {
        if (err && !res.headersSent) {
          res.status(500).send('Error loading application');
        }
      });
    } else {
      res.status(404).send('Application build not found');
    }
  });
}

function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`[Aurelius Backend] Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && port === 5000) {
      console.log(`[Aurelius Backend] Port 5000 busy, falling back to 5001...`);
      startServer(5001);
    } else {
      console.error('[SERVER ERROR]', err);
    }
  });
}

startServer(PORT);

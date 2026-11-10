import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  DollarSign,
  Scissors,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  LogOut,
  Sparkles,
  BarChart3,
  Image as ImageIcon,
  Tag,
  Save,
  AlertCircle,
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Service, Barber, Appointment, GroomingPackage, HairstyleItem, BusinessSettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminUser,
    loginAdmin,
    logoutAdmin,
    services,
    barbers,
    appointments,
    packages,
    hairstyles,
    settings,
    updateAppointmentStatus,
    updateService,
    addService,
    deleteService,
    updateBarber,
    addBarber,
    updateSettings,
    addGalleryItem,
    deleteGalleryItem,
    createAppointment,
  } = useSalon();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'services' | 'barbers' | 'packages' | 'gallery' | 'analytics' | 'settings'
  >('appointments');

  // Login form state
  const [email, setEmail] = useState('admin@aurelius.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // New Service Modal / Form state
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'hair' | 'beard' | 'treatment'>('hair');
  const [newServicePrice, setNewServicePrice] = useState('45');
  const [newServiceDuration, setNewServiceDuration] = useState('35');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceImg, setNewServiceImg] = useState('');

  // New Barber Form state
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberRole, setNewBarberRole] = useState('Master Stylist');
  const [newBarberExp, setNewBarberExp] = useState('7');
  const [newBarberHours, setNewBarberHours] = useState('10:00 AM - 7:00 PM (Mon-Fri)');
  const [newBarberImg, setNewBarberImg] = useState('');

  // New Gallery Item state
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState<'fade' | 'classic' | 'modern' | 'beard' | 'transformation'>('fade');
  const [newGalImg, setNewGalImg] = useState('');
  const [newGalBeforeImg, setNewGalBeforeImg] = useState('');
  const [newGalBarber, setNewGalBarber] = useState('Marcus Vance');

  // Walk-in form state
  const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
  const [walkInClient, setWalkInClient] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInServiceId, setWalkInServiceId] = useState(services[0]?.id || '');
  const [walkInBarberId, setWalkInBarberId] = useState(barbers[0]?.id || '');
  const [walkInTime, setWalkInTime] = useState('11:00 AM');

  // Business settings form state
  const [editSettings, setEditSettings] = useState<BusinessSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Status Filter in Appointments
  const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all');

  if (!isAdminOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loginAdmin(data.user);
      } else {
        // Fallback check
        if (email === 'admin@aurelius.com' && password === 'admin123') {
          loginAdmin({
            id: 'adm-1',
            name: 'Marcus Vance (Director)',
            email,
            role: 'superadmin',
          });
        } else {
          setLoginError(data.message || 'Invalid credentials.');
        }
      }
    } catch {
      if (email === 'admin@aurelius.com' && password === 'admin123') {
        loginAdmin({
          id: 'adm-1',
          name: 'Marcus Vance (Director)',
          email,
          role: 'superadmin',
        });
      } else {
        setLoginError('Invalid credentials. Use admin@aurelius.com / admin123');
      }
    }
  };

  // Add Service Submit
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    await addService({
      name: newServiceName,
      category: newServiceCategory,
      price: Number(newServicePrice) || 45,
      durationMinutes: Number(newServiceDuration) || 30,
      description: newServiceDesc || 'Custom tailored grooming service.',
      image: newServiceImg || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    });
    setIsAddingService(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  // Add Barber Submit
  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName) return;
    await addBarber({
      name: newBarberName,
      role: newBarberRole,
      experienceYears: Number(newBarberExp) || 6,
      workingHours: newBarberHours,
      image: newBarberImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      bio: 'Bespoke grooming artisan specialized in precision clipper and scissor silhouettes.',
    });
    setIsAddingBarber(false);
    setNewBarberName('');
  };

  // Add Gallery Submit
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle || !newGalImg) return;
    await addGalleryItem({
      title: newGalTitle,
      category: newGalCategory,
      image: newGalImg,
      beforeImage: newGalBeforeImg,
      barberName: newGalBarber,
      description: 'Artisan lookbook showcase entry.',
      tags: [newGalCategory.toUpperCase(), 'Custom'],
    });
    setIsAddingGallery(false);
    setNewGalTitle('');
    setNewGalImg('');
    setNewGalBeforeImg('');
  };

  // Walk-in Submit
  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInClient || !walkInPhone) return;
    const srv = services.find((s) => s.id === walkInServiceId) || services[0];
    const brb = barbers.find((b) => b.id === walkInBarberId) || barbers[0];
    const today = new Date().toISOString().split('T')[0];

    await createAppointment({
      serviceId: srv.id,
      serviceName: srv.name,
      servicePrice: srv.price,
      serviceDuration: srv.durationMinutes,
      barberId: brb.id,
      barberName: brb.name,
      customerName: walkInClient,
      customerPhone: walkInPhone,
      customerEmail: 'walkin@aurelius.com',
      appointmentDate: today,
      appointmentTime: walkInTime,
      notes: 'Direct Walk-In logged via Studio Terminal',
    });
    setIsAddingWalkIn(false);
    setWalkInClient('');
    setWalkInPhone('');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(editSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Calculations for Analytics
  const totalRevenue = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.servicePrice || 0), 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-salon-950 border border-salon-gold/50 rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="bg-salon-900 px-6 py-4 border-b border-salon-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-salon-950 border border-salon-gold/60 flex items-center justify-center text-salon-gold shadow-gold-glow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-salon-beigelight text-lg tracking-wide uppercase">
                Aurelius Management Console
              </h3>
              <p className="text-[11px] text-salon-gold font-medium">
                {adminUser ? `Signed in as ${adminUser.name} (${adminUser.role})` : 'Executive Staff Authentication'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {adminUser && (
              <button
                onClick={logoutAdmin}
                className="text-xs text-salon-muted hover:text-rose-400 flex items-center space-x-1 p-1.5 rounded hover:bg-salon-800 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-salon-muted hover:text-salon-beige p-1.5 rounded-lg hover:bg-salon-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If NOT logged in: show login view */}
        {!adminUser ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-salon-950">
            <div className="max-w-md w-full bg-salon-900 border border-salon-gold/40 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-salon-950 border border-salon-gold/50 flex items-center justify-center text-salon-gold mx-auto mb-3 shadow-gold-glow">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-heading font-bold text-salon-beigelight uppercase tracking-wider">
                  Staff & Admin Authentication
                </h4>
                <p className="text-xs text-salon-muted mt-1">
                  Access live bookings, pricing, schedules, and revenue reports.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                    Staff Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                    Access Code / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold-gradient text-salon-950 font-heading font-bold text-xs uppercase tracking-widest rounded shadow-gold-glow hover:brightness-110 transition"
                >
                  Authorize Entry
                </button>
              </form>

              {/* Demo Credentials Quick Button */}
              <div className="mt-6 pt-4 border-t border-salon-800 text-center">
                <p className="text-[11px] text-salon-muted mb-2">Default demo credentials:</p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@aurelius.com');
                    setPassword('admin123');
                  }}
                  className="text-xs text-salon-gold hover:underline bg-salon-950 px-3 py-1.5 rounded border border-salon-800"
                >
                  Fill: admin@aurelius.com / admin123
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-salon-900 border-r border-salon-800/80 p-4 flex flex-row md:flex-col justify-between flex-shrink-0 overflow-x-auto">
              <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 flex-nowrap">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'appointments'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointments ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'services'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <Scissors className="w-4 h-4" />
                  <span>Services & Pricing ({services.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('barbers')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'barbers'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Barbers & Staff ({barbers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('packages')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'packages'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Packages & Clubs</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'gallery'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery Manager</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Revenue Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-heading tracking-wider uppercase transition whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-salon-gold text-salon-950 font-bold shadow-gold-glow'
                      : 'text-salon-beige/80 hover:bg-salon-800 hover:text-salon-gold'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Business Settings</span>
                </button>
              </nav>

              {/* Bottom Quick KPI */}
              <div className="hidden md:block p-3 rounded-xl bg-salon-950 border border-salon-800 mt-4">
                <p className="text-[10px] text-salon-muted uppercase tracking-wider font-semibold">Total Revenue</p>
                <p className="text-xl font-heading font-bold text-salon-gold">
                  {settings.currencySymbol}{totalRevenue}
                </p>
                <p className="text-[10px] text-emerald-400 mt-0.5">● Realtime Sync Active</p>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 overflow-y-auto bg-salon-950">
              {/* TAB 1: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  {/* Top Header & Walk-In Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                        Live Appointment Management
                      </h4>
                      <p className="text-xs text-salon-muted">
                        Review customer bookings, manage confirmations, check-in walk-in clients.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsAddingWalkIn(true)}
                        className="px-4 py-2 bg-salon-gold text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-gold-glow"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Log Walk-In</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-2 border-b border-salon-800 pb-3">
                    {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded text-xs font-heading uppercase tracking-wider border ${
                          statusFilter === st
                            ? 'bg-salon-800 text-salon-gold border-salon-gold'
                            : 'bg-salon-900 text-salon-muted border-salon-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Appointments Table */}
                  <div className="overflow-x-auto rounded-xl border border-salon-800 bg-salon-900">
                    <table className="w-full text-left text-xs text-salon-beige">
                      <thead className="bg-salon-950 text-salon-muted uppercase font-heading text-[11px] tracking-wider border-b border-salon-800">
                        <tr>
                          <th className="py-3 px-4">Ref Code</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Artisan</th>
                          <th className="py-3 px-4">Date & Time</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-salon-800/80">
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-salon-muted">
                              No appointments found for this filter.
                            </td>
                          </tr>
                        ) : (
                          filteredAppointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-salon-850/50 transition">
                              <td className="py-3 px-4 font-mono font-bold text-salon-gold">
                                {apt.bookingCode}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-salon-beigelight block">
                                  {apt.customerName}
                                </span>
                                <span className="text-[11px] text-salon-muted block">
                                  {apt.customerPhone}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-salon-gold">{apt.serviceName}</span>
                                <span className="text-[10px] text-salon-muted block">
                                  {apt.serviceDuration} min
                                </span>
                              </td>
                              <td className="py-3 px-4 text-salon-beige/90">{apt.barberName}</td>
                              <td className="py-3 px-4">
                                <span className="block">{apt.appointmentDate}</span>
                                <span className="text-salon-gold font-medium">{apt.appointmentTime}</span>
                              </td>
                              <td className="py-3 px-4 font-bold text-salon-beigelight">
                                {settings.currencySymbol}{apt.servicePrice}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                    apt.status === 'confirmed'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                      : apt.status === 'completed'
                                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                      : apt.status === 'cancelled'
                                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-1.5">
                                  {apt.status !== 'completed' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                      className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 rounded text-[10px] font-semibold"
                                      title="Mark Completed"
                                    >
                                      Complete
                                    </button>
                                  )}
                                  {apt.status !== 'confirmed' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                      className="px-2 py-1 bg-salon-800 hover:bg-salon-700 text-salon-gold rounded text-[10px] font-semibold"
                                      title="Confirm"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {apt.status !== 'cancelled' && (
                                    <button
                                      onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                      className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[10px] font-semibold"
                                      title="Cancel"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Walk In Modal */}
                  {isAddingWalkIn && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                      <div className="bg-salon-900 border border-salon-gold/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-heading font-bold text-lg text-salon-beigelight uppercase">
                            Log Chair Walk-In
                          </h5>
                          <button onClick={() => setIsAddingWalkIn(false)}>
                            <X className="w-5 h-5 text-salon-muted" />
                          </button>
                        </div>
                        <form onSubmit={handleAddWalkIn} className="space-y-3">
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Client Name
                            </label>
                            <input
                              type="text"
                              required
                              value={walkInClient}
                              onChange={(e) => setWalkInClient(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800 focus:border-salon-gold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Client Phone
                            </label>
                            <input
                              type="tel"
                              required
                              value={walkInPhone}
                              onChange={(e) => setWalkInPhone(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800 focus:border-salon-gold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Service
                            </label>
                            <select
                              value={walkInServiceId}
                              onChange={(e) => setWalkInServiceId(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            >
                              {services.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} (${s.price})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Artisan
                            </label>
                            <select
                              value={walkInBarberId}
                              onChange={(e) => setWalkInBarberId(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            >
                              {barbers.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Time
                            </label>
                            <input
                              type="text"
                              value={walkInTime}
                              onChange={(e) => setWalkInTime(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div className="pt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingWalkIn(false)}
                              className="px-4 py-2 bg-salon-800 text-salon-muted rounded text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-salon-gold text-salon-950 font-bold rounded text-xs uppercase"
                            >
                              Save Walk-In
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SERVICES & PRICING MANAGEMENT */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                        Services & Dynamic Pricing
                      </h4>
                      <p className="text-xs text-salon-muted">
                        Update service prices, durations, descriptions, or add new craft offerings.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingService(true)}
                      className="px-4 py-2 bg-salon-gold text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-gold-glow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  {/* Services Grid with Direct In-Place Edit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => (
                      <div
                        key={s.id}
                        className="bg-salon-900 border border-salon-800 rounded-xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                              src={s.image}
                              alt={s.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-heading font-bold text-salon-beigelight text-sm truncate">
                                {s.name}
                              </h5>
                              <span className="text-[10px] uppercase font-semibold text-salon-gold bg-salon-950 px-2 py-0.5 rounded border border-salon-800">
                                {s.category}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-salon-muted line-clamp-2 mb-3">
                            {s.description}
                          </p>

                          {/* Editable inputs */}
                          <div className="grid grid-cols-2 gap-2 mb-3 bg-salon-950 p-2.5 rounded-lg border border-salon-800">
                            <div>
                              <label className="text-[10px] text-salon-muted uppercase block">
                                Price ($)
                              </label>
                              <input
                                type="number"
                                value={s.price}
                                onChange={(e) => updateService(s.id, { price: Number(e.target.value) })}
                                className="w-full bg-salon-900 text-salon-gold font-bold text-xs px-2 py-1 rounded border border-salon-700"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-salon-muted uppercase block">
                                Duration (min)
                              </label>
                              <input
                                type="number"
                                value={s.durationMinutes}
                                onChange={(e) =>
                                  updateService(s.id, { durationMinutes: Number(e.target.value) })
                                }
                                className="w-full bg-salon-900 text-salon-beige text-xs px-2 py-1 rounded border border-salon-700"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-salon-800">
                          <label className="flex items-center space-x-2 text-xs text-salon-muted cursor-pointer">
                            <input
                              type="checkbox"
                              checked={s.isActive}
                              onChange={(e) => updateService(s.id, { isActive: e.target.checked })}
                              className="rounded bg-salon-950 border-salon-800 text-salon-gold focus:ring-0"
                            />
                            <span>Active in Menu</span>
                          </label>

                          <button
                            onClick={() => deleteService(s.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Service Modal */}
                  {isAddingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                      <div className="bg-salon-900 border border-salon-gold/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-heading font-bold text-lg text-salon-beigelight uppercase">
                            Add New Grooming Service
                          </h5>
                          <button onClick={() => setIsAddingService(false)}>
                            <X className="w-5 h-5 text-salon-muted" />
                          </button>
                        </div>
                        <form onSubmit={handleAddService} className="space-y-3">
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Service Title
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Royal Italian Pompadour Cut"
                              value={newServiceName}
                              onChange={(e) => setNewServiceName(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Category
                            </label>
                            <select
                              value={newServiceCategory}
                              onChange={(e) => setNewServiceCategory(e.target.value as any)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            >
                              <option value="hair">Hair Services</option>
                              <option value="beard">Beard & Grooming</option>
                              <option value="treatment">Premium Treatments</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                                Price ($)
                              </label>
                              <input
                                type="number"
                                required
                                value={newServicePrice}
                                onChange={(e) => setNewServicePrice(e.target.value)}
                                className="w-full bg-salon-950 text-salon-gold font-bold text-xs px-3 py-2 rounded border border-salon-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                                Duration (mins)
                              </label>
                              <input
                                type="number"
                                required
                                value={newServiceDuration}
                                onChange={(e) => setNewServiceDuration(e.target.value)}
                                className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={newServiceDesc}
                              onChange={(e) => setNewServiceDesc(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Image URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={newServiceImg}
                              onChange={(e) => setNewServiceImg(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div className="pt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingService(false)}
                              className="px-4 py-2 bg-salon-800 text-salon-muted rounded text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-salon-gold text-salon-950 font-bold rounded text-xs uppercase"
                            >
                              Create Service
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BARBERS & STAFF MANAGEMENT */}
              {activeTab === 'barbers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                        Barbers & Shift Scheduling
                      </h4>
                      <p className="text-xs text-salon-muted">
                        Configure master barber availability, hours, and chair assignments.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingBarber(true)}
                      className="px-4 py-2 bg-salon-gold text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-gold-glow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Master Barber</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {barbers.map((b) => (
                      <div
                        key={b.id}
                        className="bg-salon-900 border border-salon-800 rounded-xl p-5 flex flex-col justify-between"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <img
                            src={b.image}
                            alt={b.name}
                            className="w-20 h-20 rounded-xl object-cover border border-salon-800"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h5 className="font-heading font-bold text-base text-salon-beigelight">
                                {b.name}
                              </h5>
                              <label className="flex items-center space-x-1.5 text-xs">
                                <span className="text-salon-muted text-[11px]">Chair:</span>
                                <input
                                  type="checkbox"
                                  checked={b.isAvailable}
                                  onChange={(e) => updateBarber(b.id, { isAvailable: e.target.checked })}
                                  className="rounded bg-salon-950 border-salon-800 text-salon-gold focus:ring-0"
                                />
                                <span className={b.isAvailable ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                                  {b.isAvailable ? 'Online' : 'Off-duty'}
                                </span>
                              </label>
                            </div>
                            <p className="text-xs text-salon-gold font-medium">{b.role}</p>
                            <p className="text-[11px] text-salon-muted mt-1">{b.workingHours}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {b.specialization.map((sp, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-salon-950 text-salon-beige/80 px-2 py-0.5 rounded border border-salon-800"
                                >
                                  {sp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-salon-800 flex items-center justify-between text-xs text-salon-muted">
                          <span>Rating: ★ {b.rating} ({b.reviewCount} reviews)</span>
                          <span className="text-salon-gold font-semibold">{b.experienceYears} Years Exp</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Barber Modal */}
                  {isAddingBarber && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                      <div className="bg-salon-900 border border-salon-gold/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-heading font-bold text-lg text-salon-beigelight uppercase">
                            Add Master Barber
                          </h5>
                          <button onClick={() => setIsAddingBarber(false)}>
                            <X className="w-5 h-5 text-salon-muted" />
                          </button>
                        </div>
                        <form onSubmit={handleAddBarber} className="space-y-3">
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              required
                              value={newBarberName}
                              onChange={(e) => setNewBarberName(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Title / Role
                            </label>
                            <input
                              type="text"
                              value={newBarberRole}
                              onChange={(e) => setNewBarberRole(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                                Exp (Years)
                              </label>
                              <input
                                type="number"
                                value={newBarberExp}
                                onChange={(e) => setNewBarberExp(e.target.value)}
                                className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                                Hours
                              </label>
                              <input
                                type="text"
                                value={newBarberHours}
                                onChange={(e) => setNewBarberHours(e.target.value)}
                                className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Profile Photo URL
                            </label>
                            <input
                              type="url"
                              value={newBarberImg}
                              onChange={(e) => setNewBarberImg(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div className="pt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingBarber(false)}
                              className="px-4 py-2 bg-salon-800 text-salon-muted rounded text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-salon-gold text-salon-950 font-bold rounded text-xs uppercase"
                            >
                              Add Barber
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PACKAGES */}
              {activeTab === 'packages' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                      Packages & Membership Tiers
                    </h4>
                    <p className="text-xs text-salon-muted">
                      Transparent package offerings and recurring grooming subscriptions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="bg-salon-900 border border-salon-800 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-heading font-bold text-lg text-salon-beigelight">{pkg.name}</h5>
                          <span className="text-salon-gold font-bold text-xl">{settings.currencySymbol}{pkg.price}</span>
                        </div>
                        <p className="text-xs text-salon-gold mb-3">{pkg.tagline}</p>
                        <ul className="space-y-1.5 text-xs text-salon-beige/80 mb-4">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-start space-x-1.5">
                              <span className="text-salon-gold">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GALLERY MANAGER */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                        Hairstyle Portfolio & Lookbook
                      </h4>
                      <p className="text-xs text-salon-muted">
                        Publish new hairstyle cuts and before/after transformation studies.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingGallery(true)}
                      className="px-4 py-2 bg-salon-gold text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-1.5 shadow-gold-glow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Lookbook Entry</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {hairstyles.map((h) => (
                      <div key={h.id} className="bg-salon-900 border border-salon-800 rounded-xl overflow-hidden group">
                        <div className="h-44 relative">
                          <img src={h.image} alt={h.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => deleteGalleryItem(h.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-salon-950/80 text-rose-400 hover:text-rose-300 flex items-center justify-center"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3">
                          <span className="text-[10px] text-salon-gold uppercase font-semibold">{h.category}</span>
                          <h6 className="font-heading font-bold text-sm text-salon-beigelight truncate">{h.title}</h6>
                          <p className="text-[11px] text-salon-muted">Artisan: {h.barberName}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Gallery Modal */}
                  {isAddingGallery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                      <div className="bg-salon-900 border border-salon-gold/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-heading font-bold text-lg text-salon-beigelight uppercase">
                            Add Lookbook Entry
                          </h5>
                          <button onClick={() => setIsAddingGallery(false)}>
                            <X className="w-5 h-5 text-salon-muted" />
                          </button>
                        </div>
                        <form onSubmit={handleAddGallery} className="space-y-3">
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Style Title
                            </label>
                            <input
                              type="text"
                              required
                              value={newGalTitle}
                              onChange={(e) => setNewGalTitle(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Category
                            </label>
                            <select
                              value={newGalCategory}
                              onChange={(e) => setNewGalCategory(e.target.value as any)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            >
                              <option value="fade">Fade Cuts</option>
                              <option value="classic">Executive Classics</option>
                              <option value="modern">Modern Textured</option>
                              <option value="beard">Beard Sculpting</option>
                              <option value="transformation">Transformation (Before/After)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Image URL (After Cut)
                            </label>
                            <input
                              type="url"
                              required
                              value={newGalImg}
                              onChange={(e) => setNewGalImg(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Before Image URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={newGalBeforeImg}
                              onChange={(e) => setNewGalBeforeImg(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase text-salon-muted font-semibold mb-1">
                              Master Barber
                            </label>
                            <input
                              type="text"
                              value={newGalBarber}
                              onChange={(e) => setNewGalBarber(e.target.value)}
                              className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                            />
                          </div>
                          <div className="pt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingGallery(false)}
                              className="px-4 py-2 bg-salon-800 text-salon-muted rounded text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-salon-gold text-salon-950 font-bold rounded text-xs uppercase"
                            >
                              Publish Entry
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: REVENUE ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                      Studio Performance & Analytics
                    </h4>
                    <p className="text-xs text-salon-muted">
                      Financial indicators, booking volume, and chair utilization metrics.
                    </p>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-salon-900 border border-salon-800 p-5 rounded-xl">
                      <p className="text-[11px] text-salon-muted uppercase tracking-wider font-semibold">Total Revenue</p>
                      <p className="text-3xl font-heading font-bold text-salon-gold mt-1">
                        {settings.currencySymbol}{totalRevenue}
                      </p>
                      <p className="text-[10px] text-emerald-400 mt-1">From confirmed & completed</p>
                    </div>

                    <div className="bg-salon-900 border border-salon-800 p-5 rounded-xl">
                      <p className="text-[11px] text-salon-muted uppercase tracking-wider font-semibold">Total Bookings</p>
                      <p className="text-3xl font-heading font-bold text-salon-beigelight mt-1">
                        {appointments.length}
                      </p>
                      <p className="text-[10px] text-salon-muted mt-1">Across all master chairs</p>
                    </div>

                    <div className="bg-salon-900 border border-salon-800 p-5 rounded-xl">
                      <p className="text-[11px] text-salon-muted uppercase tracking-wider font-semibold">Completed Services</p>
                      <p className="text-3xl font-heading font-bold text-blue-400 mt-1">
                        {completedCount}
                      </p>
                      <p className="text-[10px] text-salon-muted mt-1">Delivered rituals</p>
                    </div>

                    <div className="bg-salon-900 border border-salon-800 p-5 rounded-xl">
                      <p className="text-[11px] text-salon-muted uppercase tracking-wider font-semibold">Avg Ticket Value</p>
                      <p className="text-3xl font-heading font-bold text-salon-gold mt-1">
                        {settings.currencySymbol}
                        {appointments.length > 0 ? Math.round(totalRevenue / appointments.length) : 0}
                      </p>
                      <p className="text-[10px] text-salon-muted mt-1">Per visiting gentleman</p>
                    </div>
                  </div>

                  {/* Status Breakdown & Popular Services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-salon-900 border border-salon-800 p-6 rounded-xl">
                      <h5 className="font-heading font-bold text-base text-salon-beigelight mb-4 uppercase">
                        Booking Status Distribution
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-emerald-400">Confirmed ({confirmedCount})</span>
                            <span className="text-salon-muted">
                              {appointments.length > 0 ? Math.round((confirmedCount / appointments.length) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-salon-950 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2"
                              style={{ width: `${(confirmedCount / (appointments.length || 1)) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-400">Completed ({completedCount})</span>
                            <span className="text-salon-muted">
                              {appointments.length > 0 ? Math.round((completedCount / appointments.length) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-salon-950 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-2"
                              style={{ width: `${(completedCount / (appointments.length || 1)) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-rose-400">Cancelled ({cancelledCount})</span>
                            <span className="text-salon-muted">
                              {appointments.length > 0 ? Math.round((cancelledCount / appointments.length) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-salon-950 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-rose-500 h-2"
                              style={{ width: `${(cancelledCount / (appointments.length || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-salon-900 border border-salon-800 p-6 rounded-xl">
                      <h5 className="font-heading font-bold text-base text-salon-beigelight mb-4 uppercase">
                        Most Booked Rituals
                      </h5>
                      <ul className="space-y-3">
                        {services.slice(0, 5).map((s, idx) => (
                          <li key={s.id} className="flex items-center justify-between text-xs">
                            <span className="text-salon-beige">
                              {idx + 1}. {s.name}
                            </span>
                            <span className="text-salon-gold font-bold">
                              ${s.price} ({s.durationMinutes} min)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: BUSINESS SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-heading font-bold text-salon-beigelight uppercase tracking-wide">
                        Business & Studio Settings
                      </h4>
                      <p className="text-xs text-salon-muted">
                        Manage contact channels, operating schedule, and WhatsApp integration.
                      </p>
                    </div>

                    {settingsSaved && (
                      <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded">
                        Settings saved!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 bg-salon-900 border border-salon-800 p-6 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Salon Name
                        </label>
                        <input
                          type="text"
                          value={editSettings.salonName}
                          onChange={(e) => setEditSettings({ ...editSettings, salonName: e.target.value })}
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Brand Tagline
                        </label>
                        <input
                          type="text"
                          value={editSettings.tagline}
                          onChange={(e) => setEditSettings({ ...editSettings, tagline: e.target.value })}
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={editSettings.phone}
                          onChange={(e) => setEditSettings({ ...editSettings, phone: e.target.value })}
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          WhatsApp Direct Line (numbers only)
                        </label>
                        <input
                          type="text"
                          value={editSettings.whatsappNumber}
                          onChange={(e) => setEditSettings({ ...editSettings, whatsappNumber: e.target.value })}
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editSettings.email}
                          onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Instagram Handle
                        </label>
                        <input
                          type="text"
                          value={editSettings.instagramHandle}
                          onChange={(e) => setEditSettings({ ...editSettings, instagramHandle: e.target.value })}
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                        Studio Physical Address
                      </label>
                      <input
                        type="text"
                        value={editSettings.address}
                        onChange={(e) => setEditSettings({ ...editSettings, address: e.target.value })}
                        className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2.5 rounded border border-salon-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Weekday Hours
                        </label>
                        <input
                          type="text"
                          value={editSettings.openHours.weekdays}
                          onChange={(e) =>
                            setEditSettings({
                              ...editSettings,
                              openHours: { ...editSettings.openHours, weekdays: e.target.value },
                            })
                          }
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Saturday Hours
                        </label>
                        <input
                          type="text"
                          value={editSettings.openHours.saturday}
                          onChange={(e) =>
                            setEditSettings({
                              ...editSettings,
                              openHours: { ...editSettings.openHours, saturday: e.target.value },
                            })
                          }
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                          Sunday Hours
                        </label>
                        <input
                          type="text"
                          value={editSettings.openHours.sunday}
                          onChange={(e) =>
                            setEditSettings({
                              ...editSettings,
                              openHours: { ...editSettings.openHours, sunday: e.target.value },
                            })
                          }
                          className="w-full bg-salon-950 text-salon-beige text-xs px-3 py-2 rounded border border-salon-800"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gold-gradient text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-2 shadow-gold-glow"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Business Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

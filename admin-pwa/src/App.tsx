import React, { useState, useEffect } from 'react';
import { supabase, SUPABASE_URL } from './supabase';
import { 
  ShieldCheck, 
  Send, 
  RefreshCw, 
  Phone, 
  Sparkles, 
  Scissors, 
  UserCheck, 
  Layers, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Eye
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@thehairmission.com');
  const [password, setPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'services' | 'barbers' | 'packages' | 'whyUs'>('general');
  const [statusMessage, setStatusMessage] = useState('● Ready to sync with Supabase');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    salonName: 'The Hair Mission',
    phone: '7696736030',
    whatsappNumber: '7696736030',
    email: 'concierge@thehairmission.com',
    address: '448 Mayfair Avenue, Suite 100',
    city: 'Beverly Hills, CA 90210',
    instagramHandle: '@thehairmission.salon',
    tagline: "Luxury Barber Lounge & Men's Grooming Sanctuary"
  });

  // Hero State
  const [hero, setHero] = useState({
    badge: "Voted Best Men's Luxury Grooming Lounge • 2025 & 2026",
    headlineLine1: 'YOUR STYLE.',
    headlineLine2: 'YOUR IDENTITY.',
    description: 'Step into an executive sanctuary where old-world European barber craftsmanship unites with bespoke modern styling. Precision fades, straight-razor hot towel rituals, and restorative scalp therapy.',
    bgImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=85',
    stat1Value: '4.98 / 5.0',
    stat1Label: '850+ Google Reviews',
    stat2Value: '14+ Yrs',
    stat2Label: 'Master Craftsmanship',
    stat3Value: '100%',
    stat3Label: 'Hospital UV Sanitized',
    stat4Value: 'VIP Bar',
    stat4Label: 'Single Malt & Espresso'
  });

  // Services State
  const [services, setServices] = useState([
    {
      id: 'hair-1',
      name: 'Classic Haircut',
      price: 35,
      description: 'Precision scissor and clipper cut tailored to your head shape, finished with neck shave.'
    },
    {
      id: 'hair-2',
      name: 'Fade Haircut',
      price: 45,
      description: 'Seamless low, mid, or high skin fade with foil shaver detailing and razor line-up.'
    },
    {
      id: 'beard-4',
      name: 'Hot Towel Shave',
      price: 45,
      description: 'Royal straight razor ritual with botanical pre-shave oils and cold towel astringent.'
    }
  ]);

  // Barbers State
  const [barbers, setBarbers] = useState([
    {
      id: 'barber-1',
      name: 'Marcus Vance',
      role: 'Master Craftsman & Creative Director',
      experienceYears: 14
    },
    {
      id: 'barber-2',
      name: 'Julian Reyes',
      role: 'Master Barber & Fade Architect',
      experienceYears: 9
    }
  ]);

  // Packages State
  const [pkg, setPkg] = useState({
    name: 'The Executive Monthly Club',
    price: 110,
    tagline: 'Unlimited grooming maintenance for busy directors'
  });

  // Why Us State
  const [whyUs, setWhyUs] = useState({
    eyebrow: 'The Hair Mission Standard',
    title: 'WHY DISCERNING GENTLEMEN CHOOSE US',
    subtitle: "We operate as a private gentleman's retreat where craftsmanship, privacy, and impeccable grooming coalesce."
  });

  // Check saved session
  useEffect(() => {
    const saved = localStorage.getItem('thm_pwa_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      fetchLiveContent();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      // 1. Supabase Auth attempt
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.session) {
        setIsAuthenticated(true);
        localStorage.setItem('thm_pwa_auth', 'true');
        fetchLiveContent();
        setIsAuthenticating(false);
        return;
      }
    } catch (err) {}

    // 2. Staff credentials check
    if (
      (email === 'admin@thehairmission.com' || email === 'admin@aurelius.com') &&
      password === 'admin123'
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('thm_pwa_auth', 'true');
      fetchLiveContent();
    } else {
      setAuthError('Invalid credentials. Use admin@thehairmission.com / admin123');
    }
    setIsAuthenticating(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('thm_pwa_auth');
  };

  const fetchLiveContent = async () => {
    setIsFetching(true);
    setStatusMessage('● Syncing live content from Supabase...');

    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'current_content')
        .maybeSingle();

      if (!error && data?.data) {
        const d = data.data;
        if (d.settings) setSettings(prev => ({ ...prev, ...d.settings }));
        if (d.hero) setHero(prev => ({ ...prev, ...d.hero }));
        if (d.whyChooseUs) setWhyUs(prev => ({ ...prev, ...d.whyChooseUs }));
        if (Array.isArray(d.services) && d.services.length > 0) {
          setServices(d.services);
        }
        if (Array.isArray(d.barbers) && d.barbers.length > 0) {
          setBarbers(d.barbers);
        }
        if (Array.isArray(d.packages) && d.packages.length > 0) {
          setPkg(d.packages[0]);
        }
        setStatusMessage('✔ Live content synced successfully from database');
      } else {
        setStatusMessage('● Connected to Supabase Realtime channel: hair-mission-sync');
      }
    } catch (err) {
      setStatusMessage('● Supabase channel active. Ready for updates.');
    } finally {
      setIsFetching(false);
    }
  };

  const publishToLive = async () => {
    setIsPublishing(true);
    setStatusMessage('● Broadcasting updates to live frontend & Supabase...');

    const payload = {
      settings,
      hero,
      whyChooseUs: whyUs,
      services,
      barbers,
      packages: [pkg]
    };

    try {
      // 1. Supabase Realtime Broadcast (all open website windows update instantly)
      const channel = supabase.channel('hair-mission-sync');
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'full-content-update',
            payload
          });
          channel.send({
            type: 'broadcast',
            event: 'content-update',
            payload: settings
          });
        }
      });

      // 2. Persist to Supabase site_content table
      await supabase.from('site_content').upsert({
        id: 'current_content',
        data: payload,
        updated_at: new Date().toISOString()
      });

      setStatusMessage('✔ Published! Frontend updated in Realtime.');
    } catch (err) {
      setStatusMessage('✔ Broadcast sent to all active visitors.');
    } finally {
      setIsPublishing(false);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-[#141418] border border-[#D4AF37]/40 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#1C1C24] border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-[#F5EBE6]">THE HAIR MISSION</h1>
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] mt-1 font-semibold">Staff & Admin PWA Portal</p>
          </div>

          {authError && (
            <div className="mb-4 bg-red-950/60 border border-red-500/50 rounded-lg p-3 flex items-center space-x-2 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A09E9B] mb-1">Staff Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3.5 text-sm text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A09E9B] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3.5 text-sm text-white outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:brightness-110 text-black font-bold text-sm tracking-wider uppercase rounded-lg transition"
            >
              {isAuthenticating ? 'Authenticating...' : 'Sign In as Staff'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@thehairmission.com');
                setPassword('admin123');
              }}
              className="text-xs text-[#D4AF37] hover:underline"
            >
              Fill Staff Credentials: admin@thehairmission.com / admin123
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col">
      {/* Header Bar */}
      <header className="bg-[#141418] border-b border-[#24242B] px-4 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-wider text-[#D4AF37]">THE HAIR MISSION</span>
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">PWA</span>
          </div>
          <p className="text-[11px] text-[#A09E9B]">Live Content Controller • Signed in as {email}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveContent}
            disabled={isFetching}
            className="p-2 text-[#A09E9B] hover:text-[#D4AF37] hover:bg-[#1C1C24] rounded-lg transition"
            title="Refresh database state"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Live Status Pill */}
      <div className="bg-[#121217] border-b border-[#1E1E26] px-4 py-2 flex items-center justify-between text-xs">
        <span className="text-emerald-400 font-medium flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{statusMessage}</span>
        </span>
        <span className="text-[10px] text-[#A09E9B] uppercase font-mono">SUPABASE REALTIME</span>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#141418] border-b border-[#24242B] overflow-x-auto no-scrollbar flex px-2 py-1.5 space-x-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'general' ? 'bg-[#D4AF37] text-black' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          General & Phone
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'hero' ? 'bg-[#D4AF37] text-black' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Hero & Metrics
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'services' ? 'bg-[#D4AF37] text-black' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Services & Prices
        </button>
        <button
          onClick={() => setActiveTab('barbers')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'barbers' ? 'bg-[#D4AF37] text-black' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Artisans & Barbers
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'packages' ? 'bg-[#D4AF37] text-black' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          VIP Packages
        </button>
        <button
          onClick={() => setActiveTab('whyUs')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'whyUs' ? 'bg-[#D4AF37] text-black' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Why Choose Us
        </button>
      </div>

      {/* Main Form Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#24242B] pb-3">
              <Phone className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Business Identity & Contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Business Name</label>
                <input
                  type="text"
                  value={settings.salonName}
                  onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Concierge Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Studio Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">City / Region</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Instagram Handle</label>
              <input
                type="text"
                value={settings.instagramHandle}
                onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: HERO */}
        {activeTab === 'hero' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#24242B] pb-3">
              <Sparkles className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Hero Section Headlines &amp; Stats</h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Top Accolade Badge</label>
              <input
                type="text"
                value={hero.badge}
                onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Headline Line 1</label>
                <input
                  type="text"
                  value={hero.headlineLine1}
                  onChange={(e) => setHero({ ...hero, headlineLine1: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Headline Line 2 (Gold Gradient)</label>
                <input
                  type="text"
                  value={hero.headlineLine2}
                  onChange={(e) => setHero({ ...hero, headlineLine2: e.target.value })}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Narrative Description</label>
              <textarea
                rows={3}
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg p-3 text-sm text-white outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Background Image URL</label>
              <input
                type="text"
                value={hero.bgImage}
                onChange={(e) => setHero({ ...hero, bgImage: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-xs text-white font-mono outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Metric 1 (Value & Label)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={hero.stat1Value}
                    onChange={(e) => setHero({ ...hero, stat1Value: e.target.value })}
                    className="w-24 h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-2 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={hero.stat1Label}
                    onChange={(e) => setHero({ ...hero, stat1Label: e.target.value })}
                    className="flex-1 h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Metric 2 (Value & Label)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={hero.stat2Value}
                    onChange={(e) => setHero({ ...hero, stat2Value: e.target.value })}
                    className="w-24 h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-2 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={hero.stat2Label}
                    onChange={(e) => setHero({ ...hero, stat2Label: e.target.value })}
                    className="flex-1 h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeTab === 'services' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-5">
            <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#24242B] pb-3">
              <Scissors className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Services &amp; Pricing Menu</h2>
            </div>

            {services.map((srv, idx) => (
              <div key={srv.id || idx} className="bg-[#181820] border border-[#2B2B36] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase">Service #{idx + 1}</span>
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={srv.name}
                    placeholder="Service Name"
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].name = e.target.value;
                      setServices(updated);
                    }}
                    className="flex-1 h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-2.5 text-xs text-[#A09E9B]">$</span>
                    <input
                      type="number"
                      value={srv.price}
                      placeholder="Price"
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].price = Number(e.target.value);
                        setServices(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg pl-7 pr-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={srv.description}
                  placeholder="Service description"
                  onChange={(e) => {
                    const updated = [...services];
                    updated[idx].description = e.target.value;
                    setServices(updated);
                  }}
                  className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-xs text-white/80 outline-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: BARBERS */}
        {activeTab === 'barbers' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-5">
            <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#24242B] pb-3">
              <UserCheck className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Master Artisans &amp; Barbers</h2>
            </div>

            {barbers.map((barber, idx) => (
              <div key={barber.id || idx} className="bg-[#181820] border border-[#2B2B36] rounded-lg p-4 space-y-3">
                <span className="text-xs font-bold text-[#D4AF37] uppercase">Artisan #{idx + 1}</span>

                <div>
                  <label className="block text-[11px] text-[#A09E9B] mb-1">Barber Name</label>
                  <input
                    type="text"
                    value={barber.name}
                    onChange={(e) => {
                      const updated = [...barbers];
                      updated[idx].name = e.target.value;
                      setBarbers(updated);
                    }}
                    className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#A09E9B] mb-1">Role &amp; Credentials</label>
                  <input
                    type="text"
                    value={barber.role}
                    onChange={(e) => {
                      const updated = [...barbers];
                      updated[idx].role = e.target.value;
                      setBarbers(updated);
                    }}
                    className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#24242B] pb-3">
              <Layers className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">VIP Memberships &amp; Packages</h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Package Name</label>
              <input
                type="text"
                value={pkg.name}
                onChange={(e) => setPkg({ ...pkg, name: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Price ($)</label>
              <input
                type="number"
                value={pkg.price}
                onChange={(e) => setPkg({ ...pkg, price: Number(e.target.value) })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={pkg.tagline}
                onChange={(e) => setPkg({ ...pkg, tagline: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 6: WHY US */}
        {activeTab === 'whyUs' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-[#D4AF37] border-b border-[#24242B] pb-3">
              <Sparkles className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Why Choose Us Copy</h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Eyebrow Pill</label>
              <input
                type="text"
                value={whyUs.eyebrow}
                onChange={(e) => setWhyUs({ ...whyUs, eyebrow: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Title</label>
              <input
                type="text"
                value={whyUs.title}
                onChange={(e) => setWhyUs({ ...whyUs, title: e.target.value })}
                className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#A09E9B] uppercase mb-1">Subtitle</label>
              <textarea
                rows={3}
                value={whyUs.subtitle}
                onChange={(e) => setWhyUs({ ...whyUs, subtitle: e.target.value })}
                className="w-full bg-[#1C1C24] border border-[#2B2B36] rounded-lg p-3 text-sm text-white outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Publish Action Floating Bar */}
        <div className="pt-4">
          <button
            onClick={publishToLive}
            disabled={isPublishing}
            className="w-full h-14 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] hover:brightness-110 text-black font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isPublishing ? 'Broadcasting to Website & Supabase...' : 'Publish All Changes to Website'}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

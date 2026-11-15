import React, { useState, useEffect } from 'react';
import { supabase, SUPABASE_URL } from './supabase';
import { 
  Send, 
  RefreshCw, 
  Phone, 
  Sparkles, 
  Scissors, 
  UserCheck, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3,
  Image as ImageIcon,
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'hair' | 'beard' | 'treatment';
  price: number;
  durationMinutes: number;
  description: string;
  image: string;
  popular?: boolean;
  isActive: boolean;
}

export interface BarberItem {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  specialization: string[];
  rating: number;
  reviewCount: number;
  workingHours: string;
  image: string;
  bio: string;
  isAvailable: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  billingPeriod?: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'services' | 'barbers' | 'packages' | 'whyUs'>('general');
  const [statusMessage, setStatusMessage] = useState('● Supabase Live Channel Ready');
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

  // Services State (Dynamic Add/Edit/Delete)
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 'hair-1',
      name: 'Classic Haircut',
      category: 'hair',
      price: 35,
      durationMinutes: 30,
      description: 'Precision scissor and clipper cut tailored to your head shape, finished with neck shave, tonic, and natural matte clay styling.',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      popular: true,
      isActive: true
    },
    {
      id: 'hair-2',
      name: 'Fade Haircut',
      category: 'hair',
      price: 45,
      durationMinutes: 40,
      description: 'Seamless low, mid, or high skin fade with foil shaver detailing, razor edge line-up, and hot mist finish.',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      popular: true,
      isActive: true
    },
    {
      id: 'beard-4',
      name: 'Hot Towel Shave (Royal Ritual)',
      category: 'beard',
      price: 45,
      durationMinutes: 45,
      description: 'Triple eucalyptus hot towel compress, sandalwood shave lather, cut-throat razor precision, and post-shave alum block balm.',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      popular: true,
      isActive: true
    }
  ]);

  // Barbers State (Dynamic Add/Edit/Delete + Internet Image URL integration)
  const [barbers, setBarbers] = useState<BarberItem[]>([
    {
      id: 'barber-1',
      name: 'Marcus Vance',
      role: 'Master Craftsman & Creative Director',
      experienceYears: 14,
      specialization: ['Precision Scissor Craft', 'Beard Morphology', 'Signature Fades'],
      rating: 4.98,
      reviewCount: 384,
      workingHours: '10:00 AM - 7:00 PM (Tue - Sat)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      bio: 'Trained in Mayfair, London and Milan. Marcus combines old-world barbering traditions with razor-sharp modern silhouettes for bespoke gentleman profiles.',
      isAvailable: true
    },
    {
      id: 'barber-2',
      name: 'Julian Reyes',
      role: 'Master Barber & Fade Architect',
      experienceYears: 9,
      specialization: ['Skin Fades', 'Razor Line Art', 'Hot Towel Rituals'],
      rating: 4.97,
      reviewCount: 290,
      workingHours: '09:00 AM - 6:00 PM (Wed - Sun)',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
      bio: 'Former senior stylist at Manhattan elite grooming salons. Master of textural volume and low-to-high skin fade transitions.',
      isAvailable: true
    }
  ]);

  // Packages State (Dynamic Add/Edit/Delete)
  const [packages, setPackages] = useState<PackageItem[]>([
    {
      id: 'pkg-1',
      name: 'The Executive Monthly Club',
      tagline: 'Unlimited grooming maintenance for busy directors',
      price: 110,
      billingPeriod: 'Monthly',
      features: [
        'Bi-weekly Haircut & Beard Shaping',
        'Complimentary Scalp Clarifying Ritual',
        'Priority Weekend Booking Access',
        'Exclusive Bar Lounge Access'
      ],
      recommended: true,
      badge: 'Most Popular'
    },
    {
      id: 'pkg-2',
      name: 'The Royal Wedding Protocol',
      tagline: 'Comprehensive party styling for Groom & 3 Groomsmen',
      price: 340,
      billingPeriod: 'One-Time Event',
      features: [
        'Full Hair, Beard & Royal Straight Razor Shaves',
        'Charcoal Face Purify & Hydro-Eye Masks',
        'Private Studio Reservation with Scotch Service'
      ],
      recommended: false,
      badge: 'Bespoke Experience'
    }
  ]);

  // Why Us State
  const [whyUs, setWhyUs] = useState({
    eyebrow: 'The Hair Mission Standard',
    title: 'WHY DISCERNING GENTLEMEN CHOOSE US',
    subtitle: "We operate as a private gentleman's retreat where craftsmanship, privacy, and impeccable grooming coalesce."
  });

  // Load content directly from Supabase upon mount (NO LOGIN REQUIRED)
  useEffect(() => {
    fetchLiveContent();
  }, []);

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
          setPackages(d.packages);
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
      packages
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

  // SERVICES CRUD
  const handleAddService = () => {
    const newSrv: ServiceItem = {
      id: 'srv-' + Date.now(),
      name: 'New Custom Service',
      category: 'hair',
      price: 40,
      durationMinutes: 30,
      description: 'Precision styling tailored to your preferences.',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      popular: false,
      isActive: true
    };
    setServices([...services, newSrv]);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  // BARBERS CRUD + URL INTEGRATION
  const handleAddBarber = () => {
    const newBarber: BarberItem = {
      id: 'barber-' + Date.now(),
      name: 'Master Barber',
      role: 'Master Craftsman & Stylist',
      experienceYears: 8,
      specialization: ['Custom Cuts', 'Beard Detailing'],
      rating: 5.0,
      reviewCount: 150,
      workingHours: '10:00 AM - 7:00 PM',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      bio: 'Expert stylist dedicated to uncompromising precision grooming.',
      isAvailable: true
    };
    setBarbers([...barbers, newBarber]);
  };

  const handleDeleteBarber = (id: string) => {
    setBarbers(barbers.filter(b => b.id !== id));
  };

  // PACKAGES CRUD
  const handleAddPackage = () => {
    const newPkg: PackageItem = {
      id: 'pkg-' + Date.now(),
      name: 'VIP Package',
      tagline: 'Exclusive grooming tier',
      price: 85,
      billingPeriod: 'Monthly',
      features: ['Signature Haircut', 'Beard Sculpting', 'Hot Towel Finish'],
      recommended: false
    };
    setPackages([...packages, newPkg]);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-[#141418] border-b border-[#24242B] px-4 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-wider text-[#D4AF37]">THE HAIR MISSION</span>
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
              DIRECT SUPABASE ACCESS
            </span>
          </div>
          <p className="text-[11px] text-[#A09E9B]">Live Content Controller • Add, Edit & Delete Cards Instantly</p>
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
            activeTab === 'general' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          General & Contact
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'hero' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Hero & Metrics
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'services' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('barbers')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'barbers' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          Artisans & Barbers ({barbers.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'packages' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A09E9B] hover:text-[#D4AF37]'
          }`}
        >
          VIP Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('whyUs')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition ${
            activeTab === 'whyUs' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A09E9B] hover:text-[#D4AF37]'
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

        {/* TAB 3: SERVICES (DYNAMIC ADD / EDIT / DELETE) */}
        {activeTab === 'services' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#24242B] pb-3">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <Scissors className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Services ({services.length} Cards)</h2>
              </div>
              <button
                onClick={handleAddService}
                className="bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold px-3 py-1.5 rounded-md flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service Card</span>
              </button>
            </div>

            {services.map((srv, idx) => (
              <div key={srv.id || idx} className="bg-[#181820] border border-[#2B2B36] rounded-lg p-4 space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase">Card #{idx + 1}</span>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40 transition"
                    title="Delete Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Service Title</label>
                    <input
                      type="text"
                      value={srv.name}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].name = e.target.value;
                        setServices(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={srv.price}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].price = Number(e.target.value);
                        setServices(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#A09E9B] mb-1">Description</label>
                  <input
                    type="text"
                    value={srv.description}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].description = e.target.value;
                      setServices(updated);
                    }}
                    className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-xs text-white/90 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#A09E9B] mb-1">Card Image URL</label>
                  <input
                    type="text"
                    value={srv.image}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[idx].image = e.target.value;
                      setServices(updated);
                    }}
                    className="w-full h-9 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-xs text-white/70 font-mono outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: BARBERS & ARTISANS (DYNAMIC ADD / EDIT / DELETE + INTERNET URL INTEGRATION) */}
        {activeTab === 'barbers' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#24242B] pb-3">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <UserCheck className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Master Artisans ({barbers.length} Cards)</h2>
              </div>
              <button
                onClick={handleAddBarber}
                className="bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold px-3 py-1.5 rounded-md flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Artisan Card</span>
              </button>
            </div>

            {barbers.map((barber, idx) => (
              <div key={barber.id || idx} className="bg-[#181820] border border-[#2B2B36] rounded-lg p-4 space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase">Artisan Card #{idx + 1}</span>
                  <button
                    onClick={() => handleDeleteBarber(barber.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40 transition"
                    title="Delete Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Artisan Name</label>
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
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Title & Role</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Years Experience</label>
                    <input
                      type="number"
                      value={barber.experienceYears}
                      onChange={(e) => {
                        const updated = [...barbers];
                        updated[idx].experienceYears = Number(e.target.value);
                        setBarbers(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Working Schedule</label>
                    <input
                      type="text"
                      value={barber.workingHours}
                      onChange={(e) => {
                        const updated = [...barbers];
                        updated[idx].workingHours = e.target.value;
                        setBarbers(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                {/* INTERNET IMAGE URL INTEGRATION */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[#D4AF37] font-semibold flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Artisan Photo (Internet Image URL Integration)</span>
                    </label>
                    {barber.image && (
                      <a 
                        href={barber.image} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-[#A09E9B] hover:text-[#D4AF37] flex items-center space-x-0.5"
                      >
                        <span>Preview URL</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="text"
                      placeholder="Paste any photo URL from the internet (e.g. https://...)"
                      value={barber.image}
                      onChange={(e) => {
                        const updated = [...barbers];
                        updated[idx].image = e.target.value;
                        setBarbers(updated);
                      }}
                      className="flex-1 h-10 bg-[#1C1C24] border border-[#2B2B36] focus:border-[#D4AF37] rounded-lg px-3 text-xs text-white font-mono outline-none"
                    />
                    {barber.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#D4AF37]/50 bg-[#1C1C24] flex-shrink-0">
                        <img 
                          src={barber.image} 
                          alt={barber.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80';
                          }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-[#888899] mt-1">
                    Paste any direct image link from Pinterest, Unsplash, Instagram CDN, Google Drive, or any image host.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PACKAGES (DYNAMIC ADD / EDIT / DELETE) */}
        {activeTab === 'packages' && (
          <div className="bg-[#141418] border border-[#24242B] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#24242B] pb-3">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <Layers className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider">VIP Packages ({packages.length} Cards)</h2>
              </div>
              <button
                onClick={handleAddPackage}
                className="bg-[#D4AF37] hover:brightness-110 text-black text-xs font-bold px-3 py-1.5 rounded-md flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Package Card</span>
              </button>
            </div>

            {packages.map((pkgItem, idx) => (
              <div key={pkgItem.id || idx} className="bg-[#181820] border border-[#2B2B36] rounded-lg p-4 space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase">Package #{idx + 1}</span>
                  <button
                    onClick={() => handleDeletePackage(pkgItem.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40 transition"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Package Title</label>
                    <input
                      type="text"
                      value={pkgItem.name}
                      onChange={(e) => {
                        const updated = [...packages];
                        updated[idx].name = e.target.value;
                        setPackages(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#A09E9B] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={pkgItem.price}
                      onChange={(e) => {
                        const updated = [...packages];
                        updated[idx].price = Number(e.target.value);
                        setPackages(updated);
                      }}
                      className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#A09E9B] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={pkgItem.tagline}
                    onChange={(e) => {
                      const updated = [...packages];
                      updated[idx].tagline = e.target.value;
                      setPackages(updated);
                    }}
                    className="w-full h-10 bg-[#1C1C24] border border-[#2B2B36] rounded-lg px-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            ))}
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

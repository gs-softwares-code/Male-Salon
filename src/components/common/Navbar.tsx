import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, Phone, ShieldCheck, Menu, X, Clock, MapPin } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const Navbar: React.FC = () => {
  const { openBookingModal, setIsAdminOpen, adminUser, settings } = useSalon();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Hairstyles', href: '#gallery' },
    { label: 'Our Barbers', href: '#barbers' },
    { label: 'Packages', href: '#packages' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Location', href: '#location' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-salon-900 border-b border-salon-800 text-salon-muted text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-wide">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-salon-beige/80">
              <MapPin className="w-3.5 h-3.5 text-salon-gold" />
              <span>{settings.address}, {settings.city}</span>
            </span>
            <span className="flex items-center space-x-1.5 text-salon-beige/80">
              <Clock className="w-3.5 h-3.5 text-salon-gold" />
              <span>Mon-Fri: {settings.openHours.weekdays} | Sat: {settings.openHours.saturday}</span>
            </span>
          </div>

          <div className="flex items-center space-x-5">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center space-x-1.5 text-salon-gold hover:text-salon-goldlight transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
            <span className="text-salon-700">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1 text-salon-muted hover:text-salon-gold transition text-xs"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-salon-gold/70" />
              <span>{adminUser ? 'Staff Portal (Active)' : 'Staff Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-salon-950/95 backdrop-blur-md border-b border-salon-800/80 shadow-luxury py-3'
            : 'bg-salon-950/80 backdrop-blur-sm border-b border-salon-800/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full border border-salon-gold/60 flex items-center justify-center bg-salon-900 group-hover:border-salon-gold transition shadow-gold-glow">
              <Scissors className="w-5 h-5 text-salon-gold rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <span className="text-2xl font-heading tracking-widest text-salon-beigelight font-bold block leading-none">
                AURELIUS
              </span>
              <span className="text-[10px] tracking-[0.25em] text-salon-gold uppercase block mt-1 font-semibold">
                Barber Lounge & Spa
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-salon-beige/80 hover:text-salon-gold transition tracking-wide uppercase font-heading text-[13px]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider text-salon-muted hover:text-salon-gold hover:bg-salon-900 border border-transparent hover:border-salon-800 transition lg:hidden"
            >
              Admin
            </button>

            <button
              onClick={() => openBookingModal()}
              className="relative group overflow-hidden bg-gold-gradient text-salon-950 font-heading font-bold text-sm tracking-widest px-6 py-2.5 rounded shadow-gold-glow hover:shadow-gold-glow-lg transition duration-300 flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-salon-950" />
              <span>BOOK APPOINTMENT</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => openBookingModal()}
              className="bg-gold-gradient text-salon-950 px-3 py-1.5 rounded font-heading font-bold text-xs tracking-wider flex items-center space-x-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-salon-beige hover:text-salon-gold focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-salon-900 border-b border-salon-800 px-6 py-5 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-heading tracking-wider uppercase text-salon-beige hover:text-salon-gold py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-salon-800 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full text-left text-sm text-salon-gold flex items-center space-x-2 py-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Staff & Admin Portal</span>
              </button>
              <a
                href={`tel:${settings.phone}`}
                className="text-sm text-salon-beige/80 flex items-center space-x-2 py-1"
              >
                <Phone className="w-4 h-4 text-salon-gold" />
                <span>Call {settings.phone}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

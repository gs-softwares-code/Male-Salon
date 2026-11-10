import React from 'react';
import { Scissors, MapPin, Phone, Mail, Instagram, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const Footer: React.FC = () => {
  const { settings, openBookingModal, setIsAdminOpen } = useSalon();

  return (
    <footer className="bg-salon-950 border-t border-salon-800/80 text-salon-muted pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-salon-gold/60 flex items-center justify-center bg-salon-900 shadow-gold-glow">
                <Scissors className="w-4 h-4 text-salon-gold rotate-45" />
              </div>
              <span className="text-2xl font-heading tracking-widest text-salon-beigelight font-bold">
                AURELIUS
              </span>
            </div>
            <p className="text-sm text-salon-muted leading-relaxed">
              Modern masculine luxury. Where traditional Italian & British barber craft meets contemporary aesthetic precision.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openBookingModal()}
                className="bg-salon-900 hover:bg-salon-850 text-salon-gold border border-salon-gold/40 hover:border-salon-gold px-4 py-2 rounded text-xs font-heading font-semibold tracking-widest uppercase transition"
              >
                Schedule Grooming
              </button>
            </div>
          </div>

          {/* Hours Col */}
          <div>
            <h4 className="font-heading text-salon-beige text-lg tracking-wider mb-4 border-b border-salon-800 pb-2">
              Working Hours
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="text-salon-gold font-medium">{settings.openHours.weekdays}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-salon-gold font-medium">{settings.openHours.saturday}</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-salon-gold font-medium">{settings.openHours.sunday}</span>
              </li>
            </ul>
            <p className="text-xs text-salon-muted mt-4 bg-salon-900/60 p-2.5 rounded border border-salon-800">
              ⚡ Walk-ins welcomed based on chair availability; reservations strongly recommended.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-salon-beige text-lg tracking-wider mb-4 border-b border-salon-800 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="hover:text-salon-gold transition">Signature Services</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-salon-gold transition">Lookbook & Transformations</a>
              </li>
              <li>
                <a href="#barbers" className="hover:text-salon-gold transition">Master Barbers</a>
              </li>
              <li>
                <a href="#packages" className="hover:text-salon-gold transition">VIP Memberships</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-salon-gold transition">Client Endorsements</a>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-salon-gold transition flex items-center space-x-1.5 text-salon-gold/80"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Sanctuary Location */}
          <div>
            <h4 className="font-heading text-salon-beige text-lg tracking-wider mb-4 border-b border-salon-800 pb-2">
              Lounge Location
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-salon-gold flex-shrink-0 mt-1" />
                <span className="text-salon-beige/90">
                  {settings.address}<br />
                  {settings.city} {settings.postalCode}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-salon-gold flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-salon-gold transition text-salon-beige/90">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-salon-gold flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-salon-gold transition text-salon-beige/90">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Instagram className="w-4 h-4 text-salon-gold flex-shrink-0" />
                <span className="text-salon-gold hover:underline cursor-pointer">{settings.instagramHandle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-salon-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-salon-muted space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} AURELIUS Men's Grooming Lounge. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-salon-beige cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-salon-beige cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-salon-beige cursor-pointer">Sanitation Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

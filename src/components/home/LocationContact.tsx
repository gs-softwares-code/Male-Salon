import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Car, Shield, Send } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const LocationContact: React.FC = () => {
  const { settings, openBookingModal } = useSalon();

  return (
    <section id="location" className="py-24 bg-salon-900 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Details Column */}
          <div>
            <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
              <MapPin className="w-4 h-4 text-salon-gold" />
              <span>Beverly Hills Sanctuary</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-6">
              LOCATION & RESERVATIONS
            </h2>
            <p className="text-salon-muted text-sm sm:text-base leading-relaxed mb-8">
              Nestled on prestigious Mayfair Avenue. Complimentary subterranean valet parking available for all clients with reservations.
            </p>

            {/* Quick Info Grid */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4 bg-salon-950 p-4 rounded-xl border border-salon-800">
                <div className="w-10 h-10 rounded-lg bg-salon-900 border border-salon-gold/30 flex items-center justify-center text-salon-gold flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-salon-beigelight text-sm tracking-wide">
                    Studio Address
                  </h4>
                  <p className="text-xs text-salon-beige/80">
                    {settings.address}, {settings.city} {settings.postalCode}
                  </p>
                  <p className="text-[11px] text-salon-gold/80 mt-0.5">
                    Opposite The Grand Carlton Hotel • Private Elevator to 2nd Floor
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-salon-950 p-4 rounded-xl border border-salon-800">
                <div className="w-10 h-10 rounded-lg bg-salon-900 border border-salon-gold/30 flex items-center justify-center text-salon-gold flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-salon-beigelight text-sm tracking-wide mb-1">
                    Operating Schedule
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-salon-beige/80">
                    <div>Mon – Fri: <span className="text-salon-gold">{settings.openHours.weekdays}</span></div>
                    <div>Saturday: <span className="text-salon-gold">{settings.openHours.saturday}</span></div>
                    <div>Sunday: <span className="text-salon-gold">{settings.openHours.sunday}</span></div>
                    <div>Emergency: <span className="text-salon-gold">By Appointment</span></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-salon-950 p-4 rounded-xl border border-salon-800">
                <div className="w-10 h-10 rounded-lg bg-salon-900 border border-salon-gold/30 flex items-center justify-center text-salon-gold flex-shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-salon-beigelight text-sm tracking-wide">
                    Valet & Parking
                  </h4>
                  <p className="text-xs text-salon-beige/80">
                    Complimentary 2-hour validated valet parking in the north subterranean garage.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openBookingModal()}
                className="px-6 py-3 bg-gold-gradient text-salon-950 font-heading font-bold text-xs tracking-wider rounded uppercase shadow-gold-glow"
              >
                Book Appointment
              </button>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${settings.salonName} ${settings.address} ${settings.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-salon-950 hover:bg-salon-850 text-salon-beige border border-salon-800 hover:border-salon-gold rounded font-heading font-bold text-xs tracking-wider uppercase transition flex items-center space-x-2"
              >
                <Navigation className="w-4 h-4 text-salon-gold" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="px-6 py-3 bg-salon-950 hover:bg-salon-850 text-salon-beige border border-salon-800 hover:border-salon-gold rounded font-heading font-bold text-xs tracking-wider uppercase transition flex items-center space-x-2"
              >
                <Phone className="w-4 h-4 text-salon-gold" />
                <span>Call Front Desk</span>
              </a>
            </div>
          </div>

          {/* Interactive Styled Google Maps Preview Column */}
          <div className="relative rounded-2xl overflow-hidden border border-salon-800 shadow-2xl bg-salon-950 h-[480px]">
            {/* Embedded Responsive Map */}
            <iframe
              title="Aurelius Barber Lounge Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13222.868770281692!2d-118.41162357777717!3d34.07362002340532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd381f1f!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
              className="w-full h-full border-0 filter invert contrast-125 hue-rotate-180 opacity-80 hover:opacity-100 transition duration-300"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Floating Location Card Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-salon-950/95 backdrop-blur-md p-4 rounded-xl border border-salon-gold/40 shadow-xl flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-salon-beigelight text-sm tracking-wide">
                  AURELIUS MEN'S LOUNGE
                </h4>
                <p className="text-[11px] text-salon-muted">
                  Beverly Hills Flagship • 448 Mayfair Ave
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=Beverly+Hills+CA+90210`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-salon-gold text-salon-950 font-heading font-bold text-[11px] rounded uppercase flex items-center space-x-1"
              >
                <span>Navigate</span>
                <Navigation className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

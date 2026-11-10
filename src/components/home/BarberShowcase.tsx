import React from 'react';
import { Star, Clock, Award, Calendar, Sparkles } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const BarberShowcase: React.FC = () => {
  const { barbers, openBookingModal } = useSalon();

  return (
    <section id="barbers" className="py-24 bg-salon-900 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-4 h-4 text-salon-gold" />
            <span>Master Craftsmen</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-4">
            MEET OUR ARTISANS
          </h2>
          <p className="text-salon-muted text-sm sm:text-base leading-relaxed">
            Our master barbers blend decades of combined heritage in London, Milan, and New York. Select your dedicated stylist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="luxury-card rounded-2xl overflow-hidden flex flex-col group"
            >
              {/* Image & Experience Badge */}
              <div className="relative h-80 overflow-hidden bg-salon-950">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-salon-950 via-salon-950/20 to-transparent opacity-80" />

                {/* Experience Badge */}
                <div className="absolute top-3 left-3 bg-salon-950/90 text-salon-gold border border-salon-gold/40 px-2.5 py-1 rounded text-[11px] font-heading font-bold uppercase tracking-wider backdrop-blur-sm">
                  {barber.experienceYears}+ Years Craft
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-salon-950/90 text-salon-beige border border-salon-800 px-2.5 py-1 rounded text-xs flex items-center space-x-1 backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-salon-gold text-salon-gold" />
                  <span className="font-bold text-salon-gold">{barber.rating}</span>
                  <span className="text-salon-muted text-[10px]">({barber.reviewCount})</span>
                </div>

                {/* Status Dot */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-salon-950/80 px-2.5 py-1 rounded-full border border-salon-800 backdrop-blur-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      barber.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-[10px] uppercase font-semibold text-salon-beige">
                    {barber.isAvailable ? 'Accepting Bookings' : 'Booked Out Today'}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-heading font-bold text-salon-beigelight tracking-wide mb-1 group-hover:text-salon-gold transition">
                    {barber.name}
                  </h3>
                  <p className="text-xs text-salon-gold font-medium mb-3 uppercase tracking-wider">
                    {barber.role}
                  </p>
                  <p className="text-xs text-salon-muted leading-relaxed mb-4 line-clamp-3">
                    {barber.bio}
                  </p>

                  {/* Specializations */}
                  <div className="mb-4">
                    <p className="text-[10px] text-salon-muted uppercase tracking-wider font-semibold mb-1.5">
                      Masteries:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {barber.specialization.map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-salon-900 text-salon-beige/90 px-2 py-0.5 rounded border border-salon-800"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center space-x-2 text-xs text-salon-muted mb-6 bg-salon-900/60 p-2.5 rounded border border-salon-800/60">
                    <Clock className="w-3.5 h-3.5 text-salon-gold flex-shrink-0" />
                    <span className="text-[11px]">{barber.workingHours}</span>
                  </div>
                </div>

                {/* Direct Booking Button */}
                <button
                  onClick={() => openBookingModal(undefined, barber.id)}
                  disabled={!barber.isAvailable}
                  className={`w-full py-2.5 rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition duration-200 border ${
                    barber.isAvailable
                      ? 'bg-salon-850 hover:bg-gold-gradient text-salon-gold hover:text-salon-950 border-salon-gold/50 hover:border-salon-gold'
                      : 'bg-salon-900 text-salon-muted border-salon-800 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{barber.isAvailable ? `Book with ${barber.name.split(' ')[0]}` : 'Unavailable'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

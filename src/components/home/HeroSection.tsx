import React from 'react';
import { Calendar, Award, Star, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const HeroSection: React.FC = () => {
  const { openBookingModal } = useSalon();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-salon-950">
      {/* Cinematic Background with Dark Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=85"
          alt="Luxury Barber Studio Interior"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-salon-950 via-salon-950/80 to-salon-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-salon-950/70 to-salon-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-20">
        {/* Top Luxury Accolade Pill */}
        <div className="inline-flex items-center space-x-2 bg-salon-900/90 border border-salon-gold/40 px-4 py-1.5 rounded-full mb-8 shadow-gold-glow backdrop-blur-md">
          <Award className="w-4 h-4 text-salon-gold" />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-salon-beige">
            Voted Best Men's Luxury Grooming Lounge • 2025 & 2026
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-salon-beigelight uppercase leading-none mb-6">
          YOUR STYLE. <br />
          <span className="gold-gradient-text drop-shadow-md">YOUR IDENTITY.</span>
        </h1>

        {/* Narrative Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-salon-beige/85 font-light leading-relaxed mb-10">
          Step into an executive sanctuary where old-world European barber craftsmanship unites with bespoke modern styling. Precision fades, straight-razor hot towel rituals, and restorative scalp therapy.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto px-8 py-4 bg-gold-gradient text-salon-950 font-heading font-bold text-base tracking-widest rounded-md shadow-gold-glow-lg hover:brightness-110 transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center space-x-3 uppercase"
          >
            <Calendar className="w-5 h-5 text-salon-950" />
            <span>Book Your Appointment</span>
          </button>

          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-4 bg-salon-900/80 hover:bg-salon-800 text-salon-beige border border-salon-700 hover:border-salon-gold font-heading font-semibold text-base tracking-widest rounded-md transition duration-200 flex items-center justify-center space-x-2 uppercase"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 text-salon-gold" />
          </a>
        </div>

        {/* Trust Badges / Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-salon-800/80 max-w-4xl mx-auto">
          <div className="bg-salon-900/60 p-4 rounded-xl border border-salon-800/60 backdrop-blur-sm">
            <div className="flex items-center justify-center text-salon-gold mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-salon-gold text-salon-gold" />
              ))}
            </div>
            <p className="text-xl font-heading font-bold text-salon-beigelight">4.98 / 5.0</p>
            <p className="text-[11px] text-salon-muted uppercase tracking-wider">850+ Google Reviews</p>
          </div>

          <div className="bg-salon-900/60 p-4 rounded-xl border border-salon-800/60 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-salon-gold mx-auto mb-1" />
            <p className="text-xl font-heading font-bold text-salon-beigelight">14+ Yrs</p>
            <p className="text-[11px] text-salon-muted uppercase tracking-wider">Master Craftsmanship</p>
          </div>

          <div className="bg-salon-900/60 p-4 rounded-xl border border-salon-800/60 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-salon-gold mx-auto mb-1" />
            <p className="text-xl font-heading font-bold text-salon-beigelight">100%</p>
            <p className="text-[11px] text-salon-muted uppercase tracking-wider">Hospital UV Sanitized</p>
          </div>

          <div className="bg-salon-900/60 p-4 rounded-xl border border-salon-800/60 backdrop-blur-sm">
            <Award className="w-4 h-4 text-salon-gold mx-auto mb-1" />
            <p className="text-xl font-heading font-bold text-salon-beigelight">VIP Bar</p>
            <p className="text-[11px] text-salon-muted uppercase tracking-wider">Single Malt & Espresso</p>
          </div>
        </div>
      </div>
    </section>
  );
};

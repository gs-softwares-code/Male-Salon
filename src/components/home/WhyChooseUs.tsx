import React from 'react';
import { Award, ShieldCheck, Coffee, Sparkles, Scissors, Clock } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Scissors,
      title: 'Master Artisans Only',
      description:
        'Our stylists carry a minimum of 8 years tenure, having apprenticed in premier European and American barber houses. No apprentices on customer chairs.',
    },
    {
      icon: Sparkles,
      title: 'Morphological Architecture',
      description:
        'We never deliver generic cuts. Every fade and taper is calculated against your skull contour, jaw angle, growth whorls, and lifestyle routine.',
    },
    {
      icon: Coffee,
      title: 'Executive Hospitality Lounge',
      description:
        'Unwind before or after your service with curated small-batch single malt whiskies, Italian espresso, cold brew, and quiet leather club chairs.',
    },
    {
      icon: ShieldCheck,
      title: 'Clinical Sterilization Standards',
      description:
        'Surgical-grade Barbicide immersion, high-heat autoclaves, and UV cabinet sanitization for every straight razor blade and clipper attachment.',
    },
    {
      icon: Clock,
      title: 'Uncompromised Punctuality',
      description:
        'We respect executive schedules. Your chair is prepared for you at your exact reservation time with zero chaotic wait times.',
    },
    {
      icon: Award,
      title: 'Organic Italian Tonics',
      description:
        'Exclusively formulated paraben-free shampoos, natural pomades, and cold-pressed jojoba beard serums designed for male dermis.',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-salon-950 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-4 h-4 text-salon-gold" />
            <span>The Aurelius Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-4">
            WHY DISCERNING GENTLEMEN CHOOSE US
          </h2>
          <p className="text-salon-muted text-sm sm:text-base leading-relaxed">
            We operate as a private gentleman's retreat where craftsmanship, privacy, and impeccable grooming coalesce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="luxury-card p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-xl bg-salon-900 border border-salon-gold/30 flex items-center justify-center text-salon-gold mb-6 group-hover:scale-110 group-hover:border-salon-gold transition-all duration-300 shadow-gold-glow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-salon-beigelight tracking-wide mb-3 group-hover:text-salon-gold transition">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-salon-muted leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

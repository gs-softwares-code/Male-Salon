import React from 'react';
import { Star, ShieldCheck, Quote, Sparkles, ExternalLink } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useSalon();

  return (
    <section id="reviews" className="py-24 bg-salon-900 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-4 h-4 text-salon-gold" />
            <span>Verified Client Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-4">
            WHAT OUR GENTLEMEN SAY
          </h2>
          <p className="text-salon-muted text-sm sm:text-base leading-relaxed">
            From Fortune 500 executives and creative directors to wedding grooms, discover authentic endorsements of our craft.
          </p>

          {/* Google Reviews Badge */}
          <div className="inline-flex items-center space-x-3 bg-salon-950 border border-salon-800 px-5 py-2.5 rounded-full mt-6">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-base text-salon-beigelight">Google</span>
              <span className="text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">Verified</span>
            </div>
            <div className="flex items-center space-x-1 text-salon-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-salon-gold text-salon-gold" />
              ))}
            </div>
            <span className="text-xs font-semibold text-salon-beige">
              4.98 Stars <span className="text-salon-muted font-normal">(850+ Reviews)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="luxury-card p-8 rounded-2xl flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-salon-gold/20 absolute top-6 right-6" />

              <div>
                <div className="flex items-center space-x-1 mb-4 text-salon-gold">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-salon-gold text-salon-gold" />
                  ))}
                </div>

                <p className="text-sm text-salon-beige/90 leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-salon-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-salon-beigelight text-base">
                    {t.name}
                  </h4>
                  <p className="text-xs text-salon-muted">{t.designation}</p>
                  <p className="text-[11px] text-salon-gold/80 mt-1 font-medium">
                    Ritual: {t.service}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-salon-gold hover:text-salon-goldlight border-b border-salon-gold/40 pb-1 transition"
          >
            <span>Read all 850+ reviews on Google Business Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

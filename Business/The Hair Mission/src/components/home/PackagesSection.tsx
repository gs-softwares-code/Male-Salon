import React from 'react';
import { Sparkles, Check, Crown, Calendar, Gift } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const PackagesSection: React.FC = () => {
  const { packages, openBookingModal, settings } = useSalon();

  return (
    <section id="packages" className="py-24 bg-salon-950 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Crown className="w-4 h-4 text-salon-gold" />
            <span>Curated Gentlemen's Clubs & Suites</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-4">
            MEMBERSHIPS & PACKAGES
          </h2>
          <p className="text-salon-muted text-sm sm:text-base leading-relaxed">
            Elevate your personal grooming into a seamless recurring ritual or secure comprehensive luxury styling for high-stakes celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl relative flex flex-col p-8 transition-all duration-300 ${
                pkg.recommended
                  ? 'bg-gradient-to-b from-salon-900 to-salon-950 border-2 border-salon-gold shadow-gold-glow-lg -translate-y-2'
                  : 'luxury-card'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3.5 right-6 bg-gold-gradient text-salon-950 px-3.5 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-wider shadow-md flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-salon-950" />
                  <span>{pkg.badge}</span>
                </div>
              )}

              {/* Title & Tagline */}
              <div className="mb-6">
                <h3 className="text-2xl font-heading font-bold text-salon-beigelight tracking-wide mb-1">
                  {pkg.name}
                </h3>
                <p className="text-xs text-salon-gold font-medium">{pkg.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-salon-800">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl sm:text-5xl font-heading font-bold text-salon-gold tracking-tight">
                    {settings.currencySymbol}{pkg.price}
                  </span>
                  <span className="text-xs text-salon-muted uppercase tracking-wider">
                    / {pkg.billingPeriod || 'Visit'}
                  </span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="flex-1 space-y-3 mb-8">
                <p className="text-[11px] text-salon-muted uppercase tracking-wider font-semibold">
                  Package Privileges:
                </p>
                {pkg.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-salon-beige/90">
                    <div className="w-4 h-4 rounded-full bg-salon-900 border border-salon-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-salon-gold">
                      <Check className="w-3 h-3 text-salon-gold" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => openBookingModal()}
                className={`w-full py-3.5 rounded font-heading font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition duration-200 ${
                  pkg.recommended
                    ? 'bg-gold-gradient text-salon-950 hover:brightness-110 shadow-gold-glow'
                    : 'bg-salon-900 hover:bg-salon-800 text-salon-gold border border-salon-gold/40 hover:border-salon-gold'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Package</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

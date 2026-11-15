import React, { useState } from 'react';
import { Clock, Tag, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { ServiceCategory } from '../../types';

export const FeaturedServices: React.FC = () => {
  const { services, openBookingModal, settings } = useSalon();
  const [activeTab, setActiveTab] = useState<'all' | ServiceCategory>('all');

  const tabs: { id: 'all' | ServiceCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Services', count: services.filter(s => s.isActive).length },
    { id: 'hair', label: 'Hair Craftsmanship', count: services.filter(s => s.category === 'hair' && s.isActive).length },
    { id: 'beard', label: 'Beard & Shave', count: services.filter(s => s.category === 'beard' && s.isActive).length },
    { id: 'treatment', label: 'Premium Treatments', count: services.filter(s => s.category === 'treatment' && s.isActive).length },
  ];

  const filteredServices = services.filter((s) => {
    if (!s.isActive) return false;
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  return (
    <section id="services" className="py-24 bg-salon-950 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-4 h-4 text-salon-gold" />
            <span>Master Barber & Grooming Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-4">
            TAILORED GROOMING SERVICES
          </h2>
          <p className="text-salon-muted text-sm sm:text-base leading-relaxed">
            Every service begins with a customized profile consultation, hot herbal towel treatment, and finishes with neck razor detailing and signature tonics.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-heading tracking-widest uppercase transition-all duration-200 flex items-center space-x-2 border ${
                  activeTab === tab.id
                    ? 'bg-salon-gold text-salon-950 border-salon-gold font-bold shadow-gold-glow'
                    : 'bg-salon-900 text-salon-beige/80 border-salon-800 hover:border-salon-gold/50 hover:text-salon-gold'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-salon-950/20 text-salon-950' : 'bg-salon-800 text-salon-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group luxury-card rounded-2xl overflow-hidden flex flex-col relative"
            >
              {/* Image Container with Badges */}
              <div className="relative h-60 overflow-hidden bg-salon-900">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-salon-900 via-transparent to-transparent opacity-80" />

                {/* Popular Pill */}
                {service.popular && (
                  <div className="absolute top-3 left-3 bg-salon-gold text-salon-950 px-3 py-1 rounded text-[11px] font-heading font-bold uppercase tracking-wider shadow-md">
                    Signature Favorite
                  </div>
                )}

                {/* Category Pill */}
                <div className="absolute top-3 right-3 bg-salon-950/80 backdrop-blur-sm text-salon-beige border border-salon-800 px-2.5 py-1 rounded text-[10px] font-heading uppercase tracking-widest">
                  {service.category}
                </div>

                {/* Price Display */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-2xl font-heading font-bold text-salon-gold tracking-tight">
                    {settings.currencySymbol}{service.price}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1 text-xs text-salon-beige/90 bg-salon-950/80 backdrop-blur-sm px-2.5 py-1 rounded border border-salon-800">
                  <Clock className="w-3.5 h-3.5 text-salon-gold" />
                  <span>{service.durationMinutes} min</span>
                </div>
              </div>

              {/* Service Info Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-heading font-bold text-salon-beigelight tracking-wide mb-2 group-hover:text-salon-gold transition">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-salon-muted leading-relaxed line-clamp-3 mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Action Row */}
                <div className="pt-4 border-t border-salon-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Stylist Consultation Included</span>
                  </div>

                  <button
                    onClick={() => openBookingModal(service.id)}
                    className="px-4 py-2 bg-salon-850 hover:bg-salon-gold hover:text-salon-950 text-salon-gold border border-salon-gold/40 hover:border-salon-gold rounded text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 flex items-center space-x-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

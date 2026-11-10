import React, { useState } from 'react';
import { Sparkles, Eye, X, ZoomIn, ArrowRight } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { HairstyleItem } from '../../types';

export const HairstyleShowcase: React.FC = () => {
  const { hairstyles, openBookingModal } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLook, setSelectedLook] = useState<HairstyleItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Portfolios' },
    { id: 'fade', label: 'Skin & Taper Fades' },
    { id: 'classic', label: 'Executive Classics' },
    { id: 'modern', label: 'Modern Textured' },
    { id: 'beard', label: 'Beard Sculpting' },
    { id: 'transformation', label: 'Transformations' },
  ];

  const filteredItems = hairstyles.filter((h) => {
    if (selectedCategory === 'all') return true;
    return h.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-24 bg-salon-900 relative border-t border-salon-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-4 h-4 text-salon-gold" />
            <span>Curated Lookbook & Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-salon-beigelight tracking-wide mb-4">
            HAIRSTYLE GALLERY
          </h2>
          <p className="text-salon-muted text-sm sm:text-base leading-relaxed">
            Examine the geometry of our craft. Every cut is engineered with skull morphology analysis and tailored density distribution.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-heading tracking-widest uppercase transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'bg-salon-gold text-salon-950 border-salon-gold font-bold shadow-gold-glow'
                    : 'bg-salon-950 text-salon-beige/80 border-salon-800 hover:border-salon-gold/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Interactive Before/After Transformation Slider */}
        <div className="mb-20">
          <BeforeAfterSlider
            beforeImage="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80"
            afterImage="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80"
            title="The Low Skin Fade Transformation"
            subtitle="Client arrived after 10 weeks without cut. Scalp geometry aligned with razor line work by Marcus Vance."
            beforeLabel="Before: Unstructured Length"
            afterLabel="After: Signature Low Skin Fade"
          />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedLook(item)}
              className="group relative rounded-xl overflow-hidden bg-salon-950 border border-salon-800 hover:border-salon-gold/60 cursor-pointer shadow-luxury transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-salon-950 via-salon-950/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                {/* Category Pill */}
                <span className="absolute top-3 left-3 bg-salon-900/90 text-salon-gold text-[10px] uppercase font-heading tracking-widest px-2.5 py-1 rounded border border-salon-800">
                  {item.category}
                </span>

                {/* Zoom Hint */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-salon-950/80 text-salon-beige flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-4 h-4 text-salon-gold" />
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h4 className="font-heading text-lg font-bold text-salon-beigelight tracking-wide mb-1 leading-snug group-hover:text-salon-gold transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-salon-gold/80 mb-2 font-medium">
                    Artisan: {item.barberName}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-salon-900/90 text-salon-muted px-2 py-0.5 rounded border border-salon-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Zoom Preview */}
        {selectedLook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-salon-900 border border-salon-gold/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setSelectedLook(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-salon-950/90 text-salon-beige hover:text-salon-gold flex items-center justify-center border border-salon-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-96 sm:h-[450px]">
                <img
                  src={selectedLook.image}
                  alt={selectedLook.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-salon-950 via-transparent to-transparent" />
              </div>

              <div className="p-6 bg-salon-950">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-salon-gold uppercase tracking-widest font-heading font-semibold">
                      {selectedLook.category} Cut
                    </span>
                    <h3 className="text-2xl font-heading font-bold text-salon-beigelight">
                      {selectedLook.title}
                    </h3>
                  </div>
                  <span className="text-xs text-salon-muted bg-salon-900 px-3 py-1 rounded border border-salon-800">
                    Artisan: {selectedLook.barberName}
                  </span>
                </div>

                <p className="text-sm text-salon-muted leading-relaxed mb-6">
                  {selectedLook.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-salon-800">
                  <div className="flex gap-2">
                    {selectedLook.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-salon-gold/80 bg-salon-900 px-2.5 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedLook(null);
                      openBookingModal();
                    }}
                    className="px-6 py-2.5 bg-gold-gradient text-salon-950 font-heading font-bold text-xs tracking-wider rounded uppercase flex items-center space-x-2"
                  >
                    <span>Request This Style</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

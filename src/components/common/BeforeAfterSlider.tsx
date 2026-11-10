import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before: 12 Weeks Growth',
  afterLabel = 'After: Master Low Fade & Sculpt',
  title = 'The Executive Transformation',
  subtitle = 'Drag the slider to reveal the precision contrast',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-salon-900 border border-salon-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center space-x-2 text-salon-gold text-xs font-semibold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-salon-gold" />
            <span>Interactive Transformation Study</span>
          </div>
          <h3 className="text-2xl font-heading text-salon-beigelight tracking-wide">{title}</h3>
          <p className="text-xs text-salon-muted">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-salon-950 px-3 py-1.5 rounded-full border border-salon-800 self-start sm:self-auto">
          <MoveHorizontal className="w-4 h-4 text-salon-gold" />
          <span className="text-salon-beige/80">Drag line horizontally</span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-80 sm:h-96 md:h-[450px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-salon-700/80"
      >
        {/* After Image (Full background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* After Tag */}
        <div className="absolute top-4 right-4 bg-salon-950/90 text-salon-gold border border-salon-gold/50 px-3 py-1 rounded text-xs font-heading font-semibold tracking-wider uppercase z-10 backdrop-blur-sm">
          {afterLabel}
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            }}
          />
          {/* Before Tag */}
          <div className="absolute top-4 left-4 bg-salon-950/90 text-salon-muted border border-salon-800 px-3 py-1 rounded text-xs font-heading font-semibold tracking-wider uppercase z-10 backdrop-blur-sm">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-salon-gold shadow-[0_0_15px_rgba(212,175,55,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-salon-gold text-salon-950 font-bold flex items-center justify-center shadow-lg border-2 border-salon-950">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-salon-muted">
        <span>👈 Drag to inspect initial canvas</span>
        <span>Drag to inspect sculpted perimeter 👉</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, openBookingModal } = useSalon();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickPrompts = [
    'I would like to book an appointment today.',
    'Do you have slots for a Fade & Hot Towel Shave?',
    'What does the Wedding Groom Package include?',
    'Can I request Master Barber Marcus Vance?',
  ];

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message || 'Hello Aurelius Concierge, I would like to book a grooming service.';
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-salon-900 border border-salon-gold/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-salon-950 p-4 border-b border-salon-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-salon-950 rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-salon-beigelight font-heading tracking-wide">
                  AURELIUS CONCIERGE
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
                  <span>● Online</span>
                  <span className="text-salon-muted">• Typically replies instantly</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-salon-muted hover:text-salon-beige p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3 bg-salon-900/90 text-sm max-h-72 overflow-y-auto">
            <div className="bg-salon-850 border border-salon-800 p-3 rounded-xl text-salon-beige/90 text-xs leading-relaxed">
              <div className="flex items-center space-x-1 text-salon-gold font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Private Styling Concierge</span>
              </div>
              Welcome to Aurelius. How may we assist your styling ritual today? Choose a quick question below or type your request.
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-salon-muted uppercase tracking-wider font-semibold">Quick Inquiries:</p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left text-xs bg-salon-950/80 hover:bg-salon-800 text-salon-beige/90 hover:text-salon-gold p-2 rounded-lg border border-salon-800/80 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openBookingModal();
                }}
                className="w-full py-2 bg-salon-800 hover:bg-salon-700 text-salon-gold border border-salon-gold/30 rounded-lg text-xs font-heading tracking-wider uppercase font-semibold text-center block transition"
              >
                Or Open Instant Booking Engine
              </button>
            </div>
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-salon-950 border-t border-salon-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message for WhatsApp..."
              className="flex-1 bg-salon-900 text-salon-beige placeholder-salon-muted text-xs px-3 py-2 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:scale-105 transition-all duration-300 border-2 border-salon-950"
        aria-label="Contact Concierge via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-salon-gold rounded-full border-2 border-salon-950 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-salon-gold rounded-full border-2 border-salon-950"></span>
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        )}
      </button>
    </div>
  );
};

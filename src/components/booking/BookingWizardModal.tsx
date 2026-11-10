import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Scissors,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  Sparkles,
  Download,
  Share2,
  CalendarCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSalon } from '../../context/SalonContext';
import { Service, Barber, Appointment } from '../../types';

export const BookingWizardModal: React.FC = () => {
  const {
    isBookingOpen,
    closeBookingModal,
    services,
    barbers,
    appointments,
    selectedServiceForBooking,
    selectedBarberForBooking,
    createAppointment,
    settings,
  } = useSalon();

  // Wizard Steps: 1: Service, 2: Barber, 3: Date & Time, 4: Details, 5: Confirmed
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | 'any'>('any');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Customer form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Status & Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Category filter in service step
  const [serviceCategory, setServiceCategory] = useState<'all' | 'hair' | 'beard' | 'treatment'>('all');

  // Initialize defaults when modal opens
  useEffect(() => {
    if (isBookingOpen) {
      if (selectedServiceForBooking) {
        setSelectedService(selectedServiceForBooking);
      } else if (!selectedService && services.length > 0) {
        setSelectedService(services[0]);
      }

      if (selectedBarberForBooking) {
        setSelectedBarber(selectedBarberForBooking);
      } else {
        setSelectedBarber('any');
      }

      // Default date: tomorrow or today
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setSelectedTime('');
      setErrorMessage(null);
      setConfirmedAppointment(null);
      setStep(1);
    }
  }, [isBookingOpen, selectedServiceForBooking, selectedBarberForBooking]);

  if (!isBookingOpen) return null;

  // Available Time Slots list
  const standardTimeSlots = [
    '09:30 AM',
    '10:15 AM',
    '11:00 AM',
    '11:45 AM',
    '12:30 PM',
    '01:30 PM',
    '02:15 PM',
    '03:00 PM',
    '03:45 PM',
    '04:30 PM',
    '05:15 PM',
    '06:00 PM',
    '06:45 PM',
  ];

  // Double booking checker for a specific time slot on selectedDate
  const isSlotBooked = (time: string): boolean => {
    if (!selectedDate) return false;

    if (selectedBarber === 'any') {
      // If "any", slot is booked only if ALL active barbers are booked at that time
      const bookedBarberIds = appointments
        .filter(
          (a) =>
            a.appointmentDate === selectedDate &&
            a.appointmentTime === time &&
            a.status !== 'cancelled'
        )
        .map((a) => a.barberId);

      const availableCount = barbers.filter((b) => b.isAvailable && !bookedBarberIds.includes(b.id)).length;
      return availableCount === 0;
    } else {
      // Check if specific barber is booked
      return appointments.some(
        (a) =>
          a.barberId === selectedBarber.id &&
          a.appointmentDate === selectedDate &&
          a.appointmentTime === time &&
          a.status !== 'cancelled'
      );
    }
  };

  // Submit Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedService) {
      setErrorMessage('Please select a service.');
      setStep(1);
      return;
    }
    if (!selectedDate || !selectedTime) {
      setErrorMessage('Please select an appointment date and time slot.');
      setStep(3);
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Please provide your full name and contact phone number.');
      return;
    }

    setIsSubmitting(true);

    const barberId = selectedBarber === 'any' ? 'any' : selectedBarber.id;
    const barberName = selectedBarber === 'any' ? 'First Available Master Barber' : selectedBarber.name;

    const payload: Partial<Appointment> = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.durationMinutes,
      barberId,
      barberName,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      notes: notes.trim(),
    };

    const res = await createAppointment(payload);
    setIsSubmitting(false);

    if (res.success && res.appointment) {
      setConfirmedAppointment(res.appointment);
      setStep(5);
      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F4DE8E', '#FFFFFF', '#CD7F32'],
        });
      } catch (err) {
        console.log('Confetti trigger', err);
      }
    } else {
      setErrorMessage(res.message || 'Unable to complete appointment. Please pick a different slot.');
    }
  };

  // Direct WhatsApp Confirmation Trigger
  const handleSendWhatsAppConfirmation = () => {
    if (!confirmedAppointment) return;
    const text = `Hello Aurelius Barbers, I have confirmed my booking:
Code: ${confirmedAppointment.bookingCode}
Client: ${confirmedAppointment.customerName}
Service: ${confirmedAppointment.serviceName}
Barber: ${confirmedAppointment.barberName}
Date: ${confirmedAppointment.appointmentDate} at ${confirmedAppointment.appointmentTime}
Thank you!`;
    const cleanNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Google Calendar Add Link
  const handleAddToCalendar = () => {
    if (!confirmedAppointment) return;
    const title = encodeURIComponent(`Aurelius Barber: ${confirmedAppointment.serviceName}`);
    const details = encodeURIComponent(
      `Appointment Code: ${confirmedAppointment.bookingCode}\nArtisan: ${confirmedAppointment.barberName}\nService: ${confirmedAppointment.serviceName} ($${confirmedAppointment.servicePrice})\nLocation: ${settings.address}, ${settings.city}`
    );
    const location = encodeURIComponent(`${settings.address}, ${settings.city}`);
    const dStr = confirmedAppointment.appointmentDate.replace(/-/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dStr}T100000Z/${dStr}T110000Z`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-salon-950 border border-salon-gold/50 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-salon-900 px-6 py-4 border-b border-salon-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-salon-950 border border-salon-gold/50 flex items-center justify-center text-salon-gold">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-salon-beigelight text-lg tracking-wide uppercase">
                Aurelius Private Reservation
              </h3>
              <p className="text-[11px] text-salon-gold font-medium">
                Step {step} of {step === 5 ? '5 - Confirmed' : '4'}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="text-salon-muted hover:text-salon-beige p-1.5 rounded-lg hover:bg-salon-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-salon-900 h-1">
            <div
              className="bg-gold-gradient h-1 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/70 border border-rose-700/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-heading font-bold text-xl text-salon-beigelight">
                    1. CHOOSE YOUR GROOMING RITUAL
                  </h4>
                  <p className="text-xs text-salon-muted">
                    Select a signature service from our craft menu.
                  </p>
                </div>

                <div className="flex gap-1.5 bg-salon-900 p-1 rounded-lg border border-salon-800 self-start sm:self-auto">
                  {(['all', 'hair', 'beard', 'treatment'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setServiceCategory(cat)}
                      className={`px-2.5 py-1 rounded text-[11px] font-heading uppercase tracking-wider ${
                        serviceCategory === cat
                          ? 'bg-salon-gold text-salon-950 font-bold'
                          : 'text-salon-muted hover:text-salon-beige'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {services
                  .filter((s) => s.isActive && (serviceCategory === 'all' || s.category === serviceCategory))
                  .map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-salon-900 border-salon-gold shadow-gold-glow'
                            : 'bg-salon-900/60 border-salon-800 hover:border-salon-700 hover:bg-salon-900'
                        }`}
                      >
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h5 className="font-heading font-bold text-sm text-salon-beigelight truncate">
                              {service.name}
                            </h5>
                            <span className="text-sm font-heading font-bold text-salon-gold ml-2">
                              {settings.currencySymbol}{service.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-salon-muted line-clamp-2 mt-0.5">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-salon-gold/80">
                            <Clock className="w-3 h-3" />
                            <span>{service.durationMinutes} mins</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-gold-gradient text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Continue: Select Artisan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT BARBER */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading font-bold text-xl text-salon-beigelight">
                  2. SELECT MASTER BARBER
                </h4>
                <p className="text-xs text-salon-muted">
                  Choose a dedicated stylist or select any available master.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {/* Any Barber Option */}
                <div
                  onClick={() => setSelectedBarber('any')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3.5 ${
                    selectedBarber === 'any'
                      ? 'bg-salon-900 border-salon-gold shadow-gold-glow'
                      : 'bg-salon-900/60 border-salon-800 hover:border-salon-700 hover:bg-salon-900'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-salon-950 border border-salon-gold/40 flex items-center justify-center text-salon-gold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-base text-salon-beigelight">
                      First Available Master Barber
                    </h5>
                    <p className="text-xs text-salon-gold">Recommended for maximum flexibility</p>
                    <p className="text-[11px] text-salon-muted">
                      We pair you with the best available artisan for your slot.
                    </p>
                  </div>
                </div>

                {/* Specific Barbers */}
                {barbers.map((b) => {
                  const isSelected = selectedBarber !== 'any' && selectedBarber.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => b.isAvailable && setSelectedBarber(b)}
                      className={`p-3.5 rounded-xl border flex items-center space-x-3.5 ${
                        !b.isAvailable
                          ? 'opacity-40 cursor-not-allowed bg-salon-950 border-salon-800'
                          : isSelected
                          ? 'bg-salon-900 border-salon-gold shadow-gold-glow cursor-pointer'
                          : 'bg-salon-900/60 border-salon-800 hover:border-salon-700 hover:bg-salon-900 cursor-pointer'
                      }`}
                    >
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-14 h-14 rounded-full object-cover border border-salon-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h5 className="font-heading font-bold text-sm text-salon-beigelight truncate">
                            {b.name}
                          </h5>
                          <span className="text-[11px] text-salon-gold font-semibold">
                            ★ {b.rating}
                          </span>
                        </div>
                        <p className="text-xs text-salon-gold/90">{b.role}</p>
                        <p className="text-[11px] text-salon-muted truncate">
                          {b.experienceYears} yrs • {b.workingHours}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-salon-900 hover:bg-salon-850 text-salon-muted hover:text-salon-beige text-xs font-heading uppercase tracking-wider rounded flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-gold-gradient text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-2"
                >
                  <span>Continue: Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading font-bold text-xl text-salon-beigelight">
                  3. CHOOSE DATE & TIME SLOT
                </h4>
                <p className="text-xs text-salon-muted">
                  Double booking prevention active. Only real open slots are selectable.
                </p>
              </div>

              {/* Date Input */}
              <div className="bg-salon-900 p-4 rounded-xl border border-salon-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-salon-gold" />
                  <div>
                    <label className="block text-[11px] text-salon-muted uppercase tracking-wider font-semibold">
                      Reservation Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime('');
                      }}
                      className="bg-salon-950 text-salon-beige text-sm px-3 py-1.5 rounded border border-salon-700 focus:outline-none focus:border-salon-gold mt-1"
                    />
                  </div>
                </div>

                <div className="text-xs text-salon-muted">
                  <span>Selected Stylist: </span>
                  <span className="text-salon-gold font-semibold">
                    {selectedBarber === 'any' ? 'First Available Master' : selectedBarber.name}
                  </span>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-2.5">
                  Available Precision Slots for {selectedDate || 'Selected Date'}:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {standardTimeSlots.map((slot) => {
                    const booked = isSlotBooked(slot);
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-3 px-3 rounded-lg text-xs font-heading tracking-wider uppercase transition-all flex flex-col items-center justify-center border ${
                          booked
                            ? 'bg-salon-950/60 border-salon-800 text-salon-muted/40 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-salon-gold text-salon-950 font-bold border-salon-gold shadow-gold-glow'
                            : 'bg-salon-900 border-salon-800 text-salon-beige hover:border-salon-gold/60'
                        }`}
                      >
                        <span className="font-semibold">{slot}</span>
                        <span className="text-[10px] mt-0.5 opacity-80">
                          {booked ? 'Booked' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-salon-900 hover:bg-salon-850 text-salon-muted hover:text-salon-beige text-xs font-heading uppercase tracking-wider rounded flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-gold-gradient text-salon-950 font-heading font-bold text-xs uppercase tracking-wider rounded flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Continue: Client Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS & REVIEW */}
          {step === 4 && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <h4 className="font-heading font-bold text-xl text-salon-beigelight">
                  4. CLIENT CONTACT & CONFIRMATION
                </h4>
                <p className="text-xs text-salon-muted">
                  Provide your details to receive instant WhatsApp and email notifications.
                </p>
              </div>

              {/* Order Summary Strip */}
              <div className="bg-salon-900 p-4 rounded-xl border border-salon-gold/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-salon-muted uppercase tracking-wider font-semibold">
                    Reservation Ritual
                  </p>
                  <p className="font-heading font-bold text-base text-salon-gold">
                    {selectedService?.name}
                  </p>
                  <p className="text-xs text-salon-beige/80">
                    {selectedService?.durationMinutes} mins • {settings.currencySymbol}{selectedService?.price}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-salon-muted uppercase tracking-wider font-semibold">
                    Stylist & Schedule
                  </p>
                  <p className="text-sm font-semibold text-salon-beige">
                    {selectedBarber === 'any' ? 'First Available Master' : selectedBarber.name}
                  </p>
                  <p className="text-xs text-salon-gold">
                    {selectedDate} at {selectedTime}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-salon-gold absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-salon-900 text-salon-beige text-xs pl-9 pr-3 py-2.5 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-salon-gold absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 789-0123"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-salon-900 text-salon-beige text-xs pl-9 pr-3 py-2.5 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-salon-gold absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="e.g. jonathan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-salon-900 text-salon-beige text-xs pl-9 pr-3 py-2.5 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-salon-muted font-semibold mb-1">
                    Styling Notes / Preferences
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Skin sensitive on neck, mid fade preference"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-salon-900 text-salon-beige text-xs px-3 py-2.5 rounded-lg border border-salon-800 focus:outline-none focus:border-salon-gold"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-salon-900 hover:bg-salon-850 text-salon-muted hover:text-salon-beige text-xs font-heading uppercase tracking-wider rounded flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gold-gradient text-salon-950 font-heading font-bold text-xs uppercase tracking-widest rounded shadow-gold-glow-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-salon-950" />
                  <span>{isSubmitting ? 'Confirming Reservation...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: CONFIRMATION & RECEIPT */}
          {step === 5 && confirmedAppointment && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-heading font-extrabold text-2xl sm:text-3xl text-salon-beigelight tracking-wide uppercase">
                  RESERVATION CONFIRMED
                </h4>
                <p className="text-xs text-salon-gold mt-1 font-semibold uppercase tracking-widest">
                  Booking Reference: <span className="text-salon-beigelight font-bold text-sm">{confirmedAppointment.bookingCode}</span>
                </p>
                <p className="text-xs text-salon-muted max-w-md mx-auto mt-2">
                  Your appointment has been locked in our schedule. We look forward to delivering your signature grooming ritual.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-salon-900 border border-salon-gold/30 rounded-xl p-5 max-w-md mx-auto text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-salon-800 pb-2">
                  <span className="text-salon-muted">Client Name:</span>
                  <span className="text-salon-beige font-semibold">{confirmedAppointment.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-salon-800 pb-2">
                  <span className="text-salon-muted">Service:</span>
                  <span className="text-salon-gold font-semibold">{confirmedAppointment.serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-salon-800 pb-2">
                  <span className="text-salon-muted">Master Stylist:</span>
                  <span className="text-salon-beige font-semibold">{confirmedAppointment.barberName}</span>
                </div>
                <div className="flex justify-between border-b border-salon-800 pb-2">
                  <span className="text-salon-muted">Date & Time:</span>
                  <span className="text-salon-beige font-semibold">
                    {confirmedAppointment.appointmentDate} at {confirmedAppointment.appointmentTime}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-salon-muted">Investment:</span>
                  <span className="text-salon-gold font-bold text-sm">
                    {settings.currencySymbol}{confirmedAppointment.servicePrice} (Pay at lounge)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSendWhatsAppConfirmation}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-heading font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-md transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp</span>
                </button>

                <button
                  onClick={handleAddToCalendar}
                  className="px-5 py-2.5 bg-salon-900 hover:bg-salon-850 text-salon-gold border border-salon-gold/40 hover:border-salon-gold rounded text-xs font-heading font-semibold uppercase tracking-wider flex items-center space-x-2 transition"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Add to Google Calendar</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-salon-900 hover:bg-salon-850 text-salon-muted hover:text-salon-beige border border-salon-800 rounded text-xs font-heading uppercase tracking-wider flex items-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="pt-3">
                <button
                  onClick={closeBookingModal}
                  className="text-xs text-salon-muted hover:text-salon-gold transition uppercase tracking-widest font-semibold"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

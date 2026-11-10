import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Service,
  Barber,
  Appointment,
  GroomingPackage,
  HairstyleItem,
  Testimonial,
  BusinessSettings,
} from '../types';
import {
  initialServices,
  initialBarbers,
  initialPackages,
  initialHairstyles,
  initialTestimonials,
  initialBusinessSettings,
  initialAppointments,
} from '../data/initialData';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SalonContextType {
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  packages: GroomingPackage[];
  hairstyles: HairstyleItem[];
  testimonials: Testimonial[];
  settings: BusinessSettings;
  isLoading: boolean;
  // Booking modal state
  isBookingOpen: boolean;
  openBookingModal: (serviceId?: string, barberId?: string) => void;
  closeBookingModal: () => void;
  selectedServiceForBooking: Service | null;
  selectedBarberForBooking: Barber | null;
  // Admin modal / page state
  isAdminOpen: boolean;
  setIsAdminOpen: (val: boolean) => void;
  adminUser: AdminUser | null;
  loginAdmin: (user: AdminUser) => void;
  logoutAdmin: () => void;
  // CRUD actions
  createAppointment: (aptData: Partial<Appointment>) => Promise<{ success: boolean; appointment?: Appointment; message?: string }>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<boolean>;
  addService: (service: Partial<Service>) => Promise<boolean>;
  updateService: (id: string, updates: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  updateBarber: (id: string, updates: Partial<Barber>) => Promise<boolean>;
  addBarber: (barber: Partial<Barber>) => Promise<boolean>;
  updateSettings: (newSettings: Partial<BusinessSettings>) => Promise<boolean>;
  addGalleryItem: (item: Partial<HairstyleItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('aur_services');
    return saved ? JSON.parse(saved) : initialServices;
  });
  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('aur_barbers');
    return saved ? JSON.parse(saved) : initialBarbers;
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('aur_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });
  const [packages, setPackages] = useState<GroomingPackage[]>(() => {
    const saved = localStorage.getItem('aur_packages');
    return saved ? JSON.parse(saved) : initialPackages;
  });
  const [hairstyles, setHairstyles] = useState<HairstyleItem[]>(() => {
    const saved = localStorage.getItem('aur_hairstyles');
    return saved ? JSON.parse(saved) : initialHairstyles;
  });
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('aur_settings');
    return saved ? JSON.parse(saved) : initialBusinessSettings;
  });
  const [testimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isLoading, setIsLoading] = useState(false);

  // Booking modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [selectedBarberForBooking, setSelectedBarberForBooking] = useState<Barber | null>(null);

  // Admin state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('aur_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch initial from backend
  const refreshData = async () => {
    try {
      const [srvRes, brbRes, aptRes, pkgRes, galRes, setRes] = await Promise.allSettled([
        fetch('/api/services'),
        fetch('/api/barbers'),
        fetch('/api/appointments'),
        fetch('/api/packages'),
        fetch('/api/gallery'),
        fetch('/api/settings'),
      ]);

      if (srvRes.status === 'fulfilled' && srvRes.value.ok) {
        const data = await srvRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
          localStorage.setItem('aur_services', JSON.stringify(data));
        }
      }
      if (brbRes.status === 'fulfilled' && brbRes.value.ok) {
        const data = await brbRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setBarbers(data);
          localStorage.setItem('aur_barbers', JSON.stringify(data));
        }
      }
      if (aptRes.status === 'fulfilled' && aptRes.value.ok) {
        const data = await aptRes.value.json();
        if (Array.isArray(data)) {
          setAppointments(data);
          localStorage.setItem('aur_appointments', JSON.stringify(data));
        }
      }
      if (pkgRes.status === 'fulfilled' && pkgRes.value.ok) {
        const data = await pkgRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
          localStorage.setItem('aur_packages', JSON.stringify(data));
        }
      }
      if (galRes.status === 'fulfilled' && galRes.value.ok) {
        const data = await galRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setHairstyles(data);
          localStorage.setItem('aur_hairstyles', JSON.stringify(data));
        }
      }
      if (setRes.status === 'fulfilled' && setRes.value.ok) {
        const data = await setRes.value.json();
        if (data && data.salonName) {
          setSettings(data);
          localStorage.setItem('aur_settings', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.log('Backend sync offline, operating in local luxury state', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const openBookingModal = (serviceId?: string, barberId?: string) => {
    if (serviceId) {
      const match = services.find((s) => s.id === serviceId);
      setSelectedServiceForBooking(match || null);
    } else {
      setSelectedServiceForBooking(null);
    }

    if (barberId) {
      const matchB = barbers.find((b) => b.id === barberId);
      setSelectedBarberForBooking(matchB || null);
    } else {
      setSelectedBarberForBooking(null);
    }

    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
  };

  const loginAdmin = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('aur_admin_user', JSON.stringify(user));
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('aur_admin_user');
  };

  // Create appointment with conflict check
  const createAppointment = async (aptData: Partial<Appointment>): Promise<{ success: boolean; appointment?: Appointment; message?: string }> => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aptData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Double booking conflict or invalid data' };
      }

      setAppointments((prev) => {
        const updated = [data.appointment, ...prev];
        localStorage.setItem('aur_appointments', JSON.stringify(updated));
        return updated;
      });

      return { success: true, appointment: data.appointment };
    } catch {
      // Offline fallback booking with client-side double booking prevention
      const conflict = appointments.find(
        (a) =>
          a.barberId === aptData.barberId &&
          a.appointmentDate === aptData.appointmentDate &&
          a.appointmentTime === aptData.appointmentTime &&
          a.status !== 'cancelled'
      );
      if (conflict) {
        return {
          success: false,
          message: `Conflict: This time slot is already booked for this barber. Please choose another slot.`,
        };
      }

      const newApt: Appointment = {
        id: 'apt-' + Date.now(),
        bookingCode: 'AUR-' + Math.floor(1000 + Math.random() * 9000),
        serviceId: aptData.serviceId || 'hair-1',
        serviceName: aptData.serviceName || 'Classic Haircut',
        servicePrice: aptData.servicePrice || 35,
        serviceDuration: aptData.serviceDuration || 30,
        barberId: aptData.barberId || 'barber-1',
        barberName: aptData.barberName || 'Marcus Vance',
        customerName: aptData.customerName || 'Gentleman Client',
        customerPhone: aptData.customerPhone || '',
        customerEmail: aptData.customerEmail || '',
        appointmentDate: aptData.appointmentDate || new Date().toISOString().split('T')[0],
        appointmentTime: aptData.appointmentTime || '11:00 AM',
        notes: aptData.notes || '',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setAppointments((prev) => {
        const updated = [newApt, ...prev];
        localStorage.setItem('aur_appointments', JSON.stringify(updated));
        return updated;
      });
      return { success: true, appointment: newApt };
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<boolean> => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.log('Offline update', e);
    }

    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem('aur_appointments', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const addService = async (service: Partial<Service>): Promise<boolean> => {
    let created: Service = {
      id: 'srv-' + Date.now(),
      name: service.name || 'New Service',
      category: service.category || 'hair',
      price: service.price || 40,
      durationMinutes: service.durationMinutes || 30,
      description: service.description || '',
      image: service.image || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      popular: Boolean(service.popular),
      isActive: true,
    };

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      if (res.ok) {
        created = await res.json();
      }
    } catch (e) {
      console.log('Offline add service', e);
    }

    setServices((prev) => {
      const updated = [...prev, created];
      localStorage.setItem('aur_services', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const updateService = async (id: string, updates: Partial<Service>): Promise<boolean> => {
    try {
      await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.log('Offline update service', e);
    }

    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      localStorage.setItem('aur_services', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Offline delete service', e);
    }

    setServices((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem('aur_services', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const updateBarber = async (id: string, updates: Partial<Barber>): Promise<boolean> => {
    try {
      await fetch(`/api/barbers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.log('Offline update barber', e);
    }

    setBarbers((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
      localStorage.setItem('aur_barbers', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const addBarber = async (barber: Partial<Barber>): Promise<boolean> => {
    let created: Barber = {
      id: 'barber-' + Date.now(),
      name: barber.name || 'Master Barber',
      role: barber.role || 'Senior Stylist',
      experienceYears: barber.experienceYears || 5,
      specialization: barber.specialization || ['Fades', 'Precision Cuts'],
      rating: 5.0,
      reviewCount: 0,
      workingHours: barber.workingHours || '10:00 AM - 7:00 PM',
      image: barber.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      bio: barber.bio || '',
      isAvailable: true,
    };

    try {
      const res = await fetch('/api/barbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(barber),
      });
      if (res.ok) {
        created = await res.json();
      }
    } catch (e) {
      console.log('Offline add barber', e);
    }

    setBarbers((prev) => {
      const updated = [...prev, created];
      localStorage.setItem('aur_barbers', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const updateSettings = async (newSettings: Partial<BusinessSettings>): Promise<boolean> => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {
      console.log('Offline update settings', e);
    }

    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('aur_settings', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const addGalleryItem = async (item: Partial<HairstyleItem>): Promise<boolean> => {
    let created: HairstyleItem = {
      id: 'style-' + Date.now(),
      title: item.title || 'Curated Gentleman Look',
      category: item.category || 'fade',
      image: item.image || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80',
      beforeImage: item.beforeImage || '',
      description: item.description || '',
      barberName: item.barberName || 'Master Barber',
      tags: item.tags || ['Custom'],
    };

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        created = await res.json();
      }
    } catch (e) {
      console.log('Offline add gallery', e);
    }

    setHairstyles((prev) => {
      const updated = [created, ...prev];
      localStorage.setItem('aur_hairstyles', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const deleteGalleryItem = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Offline delete gallery', e);
    }

    setHairstyles((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      localStorage.setItem('aur_hairstyles', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  return (
    <SalonContext.Provider
      value={{
        services,
        barbers,
        appointments,
        packages,
        hairstyles,
        testimonials,
        settings,
        isLoading,
        isBookingOpen,
        openBookingModal,
        closeBookingModal,
        selectedServiceForBooking,
        selectedBarberForBooking,
        isAdminOpen,
        setIsAdminOpen,
        adminUser,
        loginAdmin,
        logoutAdmin,
        createAppointment,
        updateAppointmentStatus,
        addService,
        updateService,
        deleteService,
        updateBarber,
        addBarber,
        updateSettings,
        addGalleryItem,
        deleteGalleryItem,
        refreshData,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};

export type ServiceCategory = 'hair' | 'beard' | 'treatment';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  image: string;
  popular?: boolean;
  isActive: boolean;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  specialization: string[];
  rating: number;
  reviewCount: number;
  workingHours: string;
  image: string;
  bio: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberId: string;
  barberName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM (e.g. 10:00 AM)
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface GroomingPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  billingPeriod?: string; // 'Monthly' | 'One-Time'
  features: string[];
  recommended?: boolean;
  badge?: string;
}

export interface HairstyleItem {
  id: string;
  title: string;
  category: 'fade' | 'classic' | 'modern' | 'beard' | 'transformation';
  image: string;
  beforeImage?: string;
  description: string;
  barberName: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  comment: string;
  rating: number;
  service: string;
  date: string;
}

export interface BusinessSettings {
  salonName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  whatsappNumber: string;
  instagramHandle: string;
  openHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  slotDurationMinutes: number;
  currencySymbol: string;
  taxRatePercent: number;
}

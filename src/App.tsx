import React from 'react';
import { SalonProvider } from './context/SalonContext';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedServices } from './components/home/FeaturedServices';
import { HairstyleShowcase } from './components/home/HairstyleShowcase';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { BarberShowcase } from './components/home/BarberShowcase';
import { PackagesSection } from './components/home/PackagesSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { InstagramGrid } from './components/home/InstagramGrid';
import { LocationContact } from './components/home/LocationContact';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { BookingWizardModal } from './components/booking/BookingWizardModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <SalonProvider>
      <div className="min-h-screen bg-salon-950 text-salon-beige flex flex-col font-sans selection:bg-salon-gold selection:text-salon-950">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero */}
          <HeroSection />

          {/* Featured Services */}
          <FeaturedServices />

          {/* Hairstyle Gallery & Before/After Slider */}
          <HairstyleShowcase />

          {/* Why Choose Us */}
          <WhyChooseUs />

          {/* Barbers Showcase */}
          <BarberShowcase />

          {/* Packages & Memberships */}
          <PackagesSection />

          {/* Reviews */}
          <TestimonialsSection />

          {/* Instagram Grid */}
          <InstagramGrid />

          {/* Location & Contact */}
          <LocationContact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Concierge */}
        <FloatingWhatsApp />

        {/* Booking Wizard Modal */}
        <BookingWizardModal />

        {/* Admin Dashboard Modal */}
        <AdminDashboard />
      </div>
    </SalonProvider>
  );
};

export default App;

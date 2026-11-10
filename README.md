# AURELIUS | Luxury Barber Lounge & Men's Grooming Sanctuary

A premium, modern, full-stack website and appointment management system designed for high-end men's hair salons and barbershops. Built with modern masculine luxury styling: matte black, charcoal, warm beige, bronze, and muted gold.

---

## ✨ Features & Architecture

### 1. Modern Masculine Luxury UI/UX
- **Color Palette**: Deep matte black (`#0A0A0C`), rich charcoal, warm luxury beige (`#EADBCE`), metallic bronze, and muted gold (`#D4AF37`).
- **Typography**: Oswald & Bebas Neue for powerful masculine headings, Inter for clear body text.
- **Cinematic Visuals**: High-resolution barber portraits, close-up razor fades, grooming products, and lounge interior imagery.
- **Micro-Interactions**: Draggable before-and-after transformation comparisons, gold glow states, confetti celebrations, and smooth transitions.

### 2. Customer-Facing Showcase
- **Cinematic Hero**: Impactful headline *"Your Style. Your Identity."*, VIP accolades, and rapid booking actions.
- **Complete Services Menu**:
  - **Hair Craftsmanship**: Classic Haircut, Fade Haircut, Taper Fade, Modern Hair Styling, Hair Wash & Scalp Clarify, Hair Spa Detox, Hair Colouring, Keratin Treatment.
  - **Beard & Shave**: Beard Trimming, Beard Styling & Sculpting, Clean Shave, Hot Towel Shave (Royal Ritual), Beard Colouring.
  - **Premium Treatments**: Head Massage, Executive Charcoal Facial, D-Tan Sun Damage Reversal, Express Pore Cleanup, Anti-Fatigue Skin Care, The Emperor Hair & Beard Ritual.
  - *Each service features duration, price, photography, and direct "Book Now" trigger.*
- **Interactive Hairstyle Gallery**:
  - Filterable by: Fade, Classic, Modern, Beard, and Transformations.
  - Full-screen lightbox zoom inspection.
  - **Interactive Draggable Before/After Slider** comparing unkempt length to razor-sculpted fades.
- **Our Barbers Showcase**: Master artisan profiles with experience years, bio, specialties, shifts, ratings, and one-click direct appointment booking.
- **VIP Memberships & Packages**:
  - Monthly Grooming Club ($89/mo)
  - Haircut + Beard Combo ($65)
  - The Royal VIP Experience ($150)
  - The Gentleman's Wedding Suite ($320)
  - Special Occasion Executive ($95)
- **Verified Client Endorsements**: Real ratings, 4.98 Google Reviews badge, and client testimonials.
- **Instagram Archive**: Curated 6-post visual grid with likes, comments, and direct profile link.
- **Location, Map & Directions**: Embedded map, operating hours, and complimentary valet parking instructions.
- **Floating WhatsApp Concierge**: Instant chat widget with prefilled questions and quick booking shortcut.

### 3. Functional 5-Step Appointment Booking System
1. **Step 1 - Select Service**: Filter by Hair, Beard, or Treatments.
2. **Step 2 - Select Barber**: Pick an artisan or "First Available Master".
3. **Step 3 - Date & Real Time Slots**: Interactive date picker with **dynamic double-booking prevention** (unavailable slots are disabled in real-time).
4. **Step 4 - Client Details**: Name, phone number, email, and bespoke styling preferences.
5. **Step 5 - Instant Confirmation**:
   - Unique reference code (`AUR-XXXX`).
   - Confetti celebration.
   - **Send to WhatsApp** pre-formatted dispatch.
   - **Add to Google Calendar** direct link.
   - Print / Download appointment receipt.

### 4. Comprehensive Admin Management Console
Secure administrative panel accessible via the **Staff Login** button:
- **Demo Credentials**:
  - **Email**: `admin@aurelius.com`
  - **Password**: `admin123`
  - *(One-click autofill provided in login modal)*
- **Appointment Management**: Filter by status (Confirmed, Pending, Completed, Cancelled), change status, and log walk-in clients.
- **Service & Dynamic Pricing**: Update prices, duration, descriptions, active state, or add new offerings.
- **Barbers & Staff Schedules**: Toggle barber availability (online/off-duty), update shifts, or register new stylists.
- **Package Management**: Review membership tiers and benefits.
- **Lookbook Gallery Manager**: Add new haircut styles or transformations.
- **Revenue Analytics**: Live KPI indicators (Total Revenue, Completed Count, Average Ticket Value, Status Distribution).
- **Business Settings**: Update operating hours, address, phone, and WhatsApp numbers.

---

## 🚀 Running the Application

### 1. Start the Production Server (Serves Full Frontend + Backend)
```bash
npm start
```
*Application opens at [http://localhost:5000](http://localhost:5000).*

### 2. Development Mode (Vite Hot-Reload)
```bash
# In one terminal:
node server/index.js

# In another terminal:
npm run dev
```
*Vite dev server will start on [http://localhost:3000](http://localhost:3000) and proxy API calls to port 5000.*

---

## 🛡️ Double-Booking Validation
Backend validation in `server/index.js` checks both specific barber bookings and overall chair availability on the target date and time slot. Conflicting bookings return a `409 Conflict` response with an explicit notice to choose an alternative time slot.

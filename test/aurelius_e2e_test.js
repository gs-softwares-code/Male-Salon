// End-to-End Automated Test Suite for AURELIUS Luxury Men's Salon

async function runTests() {
  const BASE_URL = 'http://localhost:5000';
  console.log(`================================================================`);
  console.log(`Starting AURELIUS Men's Salon Full-Stack Verification Suite`);
  console.log(`Target: ${BASE_URL}\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      testsPassed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      testsFailed++;
    }
  }

  try {
    // 1. Health check
    console.log('[Test 1] Health Endpoint');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    assert(healthRes.ok && healthData.status === 'ok', `Server reports healthy (status: ${healthData.status})`);

    // 2. Settings & Business Profile
    console.log('\n[Test 2] Business Profile & Contact Settings');
    const settingsRes = await fetch(`${BASE_URL}/api/settings`);
    const settings = await settingsRes.json();
    assert(settings.salonName === 'AURELIUS', `Brand name matches: ${settings.salonName}`);
    assert(settings.phone.length > 5, `Contact phone configured: ${settings.phone}`);
    assert(settings.whatsappNumber.length > 5, `WhatsApp concierge active: ${settings.whatsappNumber}`);
    assert(settings.address.includes('Mayfair'), `Flagship address verified: ${settings.address}`);
    assert(Boolean(settings.openHours.weekdays), `Operating hours defined: ${settings.openHours.weekdays}`);

    // 3. Services Catalog
    console.log('\n[Test 3] Services Catalog (19 Services across 3 Categories)');
    const servicesRes = await fetch(`${BASE_URL}/api/services`);
    const services = await servicesRes.json();
    assert(services.length === 19, `Total services count: ${services.length} (Expected 19)`);

    const hair = services.filter((s) => s.category === 'hair');
    const beard = services.filter((s) => s.category === 'beard');
    const treatments = services.filter((s) => s.category === 'treatment');

    assert(hair.length === 8, `Hair Services: ${hair.length}/8 (Classic, Fade, Taper, Modern Styling, Wash, Spa, Colouring, Keratin)`);
    assert(beard.length === 5, `Beard & Grooming: ${beard.length}/5 (Trimming, Styling, Clean Shave, Hot Towel, Colouring)`);
    assert(treatments.length === 6, `Premium Treatments: ${treatments.length}/6 (Head Massage, Facial, D-Tan, Cleanup, Skin Care, Emperor Package)`);

    // Verify properties
    const sample = services[0];
    assert(sample.price > 0 && sample.durationMinutes > 0 && sample.description.length > 10 && sample.image.startsWith('http'),
      `Service structure validated (Price: $${sample.price}, Duration: ${sample.durationMinutes}m, Image & Description present)`
    );

    // 4. Barbers Showcase
    console.log('\n[Test 4] Master Barbers Showcase');
    const barbersRes = await fetch(`${BASE_URL}/api/barbers`);
    const barbers = await barbersRes.json();
    assert(barbers.length === 4, `Active Master Barbers: ${barbers.length}/4`);
    const marcus = barbers.find((b) => b.name.includes('Marcus'));
    assert(marcus && marcus.experienceYears >= 10 && marcus.isAvailable, `Marcus Vance profile verified (${marcus.experienceYears} yrs experience, active)`);

    // 5. Packages & Memberships
    console.log('\n[Test 5] Memberships & Packages');
    const pkgRes = await fetch(`${BASE_URL}/api/packages`);
    const packages = await pkgRes.json();
    assert(packages.length === 5, `Packages count: ${packages.length}/5`);
    const club = packages.find((p) => p.name.includes('Monthly'));
    assert(club && club.price === 89 && club.features.length >= 5, `Monthly Grooming Club configured ($${club.price}/mo with ${club.features.length} perks)`);

    // 6. Lookbook Gallery
    console.log('\n[Test 6] Lookbook Gallery');
    const galRes = await fetch(`${BASE_URL}/api/gallery`);
    const gallery = await galRes.json();
    assert(gallery.length >= 8, `Lookbook entries count: ${gallery.length}`);
    const transformation = gallery.find((g) => g.category === 'transformation');
    assert(Boolean(transformation && transformation.beforeImage), 'Interactive Before/After transformation look confirmed');

    // 7. Appointment Booking & Double-Booking Prevention
    console.log('\n[Test 7] Appointment Booking & Double-Booking Prevention');
    const randomDay = 15 + Math.floor(Math.random() * 10);
    const testDate = `2026-11-${randomDay}`;
    const testTime = '03:45 PM';
    const testBarber = barbers[0];

    // Book first appointment
    const bookRes = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: 'hair-2',
        serviceName: 'Fade Haircut',
        servicePrice: 45,
        serviceDuration: 40,
        barberId: testBarber.id,
        barberName: testBarber.name,
        customerName: 'Automated Test Client',
        customerPhone: '+1 (555) 999-0000',
        customerEmail: 'autotest@aurelius.com',
        appointmentDate: testDate,
        appointmentTime: testTime,
      }),
    });
    const bookData = await bookRes.json();
    assert(bookRes.ok && bookData.success && bookData.appointment.bookingCode, `New appointment booked successfully (Code: ${bookData.appointment?.bookingCode})`);

    // Attempt duplicate booking for the SAME barber at the SAME date and time
    const duplicateRes = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: 'hair-1',
        serviceName: 'Classic Haircut',
        servicePrice: 35,
        serviceDuration: 30,
        barberId: testBarber.id,
        barberName: testBarber.name,
        customerName: 'Second Conflicting Client',
        customerPhone: '+1 (555) 999-1111',
        appointmentDate: testDate,
        appointmentTime: testTime,
      }),
    });
    assert(duplicateRes.status === 409, `Double-booking blocked with HTTP 409 Conflict (Backend Validation Guard Active)`);

    // 8. Admin Authentication
    console.log('\n[Test 8] Admin Authentication & Security');
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aurelius.com', password: 'wrongpassword' }),
    });
    assert(badLoginRes.status === 401, 'Unauthorized login attempt rejected with HTTP 401');

    const goodLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aurelius.com', password: 'admin123' }),
    });
    const goodLoginData = await goodLoginRes.json();
    assert(goodLoginRes.ok && goodLoginData.token && goodLoginData.user.role === 'superadmin', 'Admin login successful, token & superadmin role issued');

    // 9. Revenue Analytics
    console.log('\n[Test 9] Revenue & Studio Analytics');
    const analyticsRes = await fetch(`${BASE_URL}/api/analytics`);
    const analytics = await analyticsRes.json();
    assert(analytics.totalRevenue > 0 && analytics.totalBookings > 0, `Analytics computes live metrics (Total Rev: $${analytics.totalRevenue}, Bookings: ${analytics.totalBookings})`);
    assert(analytics.topServices && analytics.topServices.length > 0, `Top booked rituals aggregated (${analytics.topServices[0]?.name})`);

    // 10. Web Serving
    console.log('\n[Test 10] Root Web Serving');
    const webRes = await fetch(`${BASE_URL}/`);
    const webHtml = await webRes.text();
    assert(webRes.ok && webHtml.includes('<!doctype html>'), 'Root URL serves production HTML entry point');
    assert(webHtml.includes('AURELIUS'), 'HTML contains AURELIUS luxury brand metadata');

  } catch (err) {
    console.error('Test run error:', err);
    testsFailed++;
  }

  console.log(`\n================================================================`);
  console.log(`Test Execution Finished.`);
  console.log(`Total Passed: ${testsPassed}`);
  console.log(`Total Failed: ${testsFailed}`);
  console.log(`Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed || 1)) * 100)}%`);
  console.log(`================================================================\n`);

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests();

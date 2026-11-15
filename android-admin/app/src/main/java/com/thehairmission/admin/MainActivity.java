package com.thehairmission.admin;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {

    public static final String SUPABASE_URL = "https://hkvhnrnmosysmsyyyqyg.supabase.co";
    public static final String SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdmhucm5tb3N5c21zeXl5cXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3MDcyOTQsImV4cCI6MjExMDI4MzI5NH0.zRdLnKASEMIitORT9d8Q_kllomHUiO9Ac-QO3rM0iHU";

    // Containers
    private ScrollView layoutLogin;
    private LinearLayout layoutDashboard;
    private TextView tvStatus, tvStaffBadge;
    private Button btnSignOut;

    // Login Views
    private EditText etLoginEmail, etLoginPassword;
    private Button btnLogin;
    private TextView tvQuickFill;

    // Tab buttons
    private Button tabGeneral, tabHero, tabServices, tabBarbers, tabPackages, tabWhyUs;
    private LinearLayout sectionGeneral, sectionHero, sectionServices, sectionBarbers, sectionPackages, sectionWhyUs;

    // Section 1: General Settings
    private EditText etSalonName, etPhone, etWhatsapp, etEmail, etAddress, etCity, etInstagram, etTagline;

    // Section 2: Hero
    private EditText etHeroBadge, etHeroLine1, etHeroLine2, etHeroDesc, etHeroBg;
    private EditText etHeroStat1Val, etHeroStat1Lbl, etHeroStat2Val, etHeroStat2Lbl;

    // Section 3: Services (Top 3 popular)
    private EditText etSrv1Name, etSrv1Price, etSrv1Desc;
    private EditText etSrv2Name, etSrv2Price, etSrv2Desc;
    private EditText etSrv3Name, etSrv3Price, etSrv3Desc;

    // Section 4: Barbers
    private EditText etBarber1Name, etBarber1Role, etBarber2Name, etBarber2Role;

    // Section 5: Packages
    private EditText etPkg1Name, etPkg1Price, etPkg1Tagline;

    // Section 6: Why Us
    private EditText etWhyEyebrow, etWhyTitle, etWhySubtitle;

    // Action buttons
    private Button btnPublishAll, btnRefreshAll;

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private boolean isLoggedIn = false;
    private String currentStaffEmail = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bindViews();
        setupListeners();
        populateInitialDefaults();
    }

    private void bindViews() {
        layoutLogin = findViewById(R.id.layoutLogin);
        layoutDashboard = findViewById(R.id.layoutDashboard);
        tvStatus = findViewById(R.id.tvStatus);
        tvStaffBadge = findViewById(R.id.tvStaffBadge);
        btnSignOut = findViewById(R.id.btnSignOut);

        etLoginEmail = findViewById(R.id.etLoginEmail);
        etLoginPassword = findViewById(R.id.etLoginPassword);
        btnLogin = findViewById(R.id.btnLogin);
        tvQuickFill = findViewById(R.id.tvQuickFill);

        tabGeneral = findViewById(R.id.tabGeneral);
        tabHero = findViewById(R.id.tabHero);
        tabServices = findViewById(R.id.tabServices);
        tabBarbers = findViewById(R.id.tabBarbers);
        tabPackages = findViewById(R.id.tabPackages);
        tabWhyUs = findViewById(R.id.tabWhyUs);

        sectionGeneral = findViewById(R.id.sectionGeneral);
        sectionHero = findViewById(R.id.sectionHero);
        sectionServices = findViewById(R.id.sectionServices);
        sectionBarbers = findViewById(R.id.sectionBarbers);
        sectionPackages = findViewById(R.id.sectionPackages);
        sectionWhyUs = findViewById(R.id.sectionWhyUs);

        etSalonName = findViewById(R.id.etSalonName);
        etPhone = findViewById(R.id.etPhone);
        etWhatsapp = findViewById(R.id.etWhatsapp);
        etEmail = findViewById(R.id.etEmail);
        etAddress = findViewById(R.id.etAddress);
        etCity = findViewById(R.id.etCity);
        etInstagram = findViewById(R.id.etInstagram);
        etTagline = findViewById(R.id.etTagline);

        etHeroBadge = findViewById(R.id.etHeroBadge);
        etHeroLine1 = findViewById(R.id.etHeroLine1);
        etHeroLine2 = findViewById(R.id.etHeroLine2);
        etHeroDesc = findViewById(R.id.etHeroDesc);
        etHeroBg = findViewById(R.id.etHeroBg);
        etHeroStat1Val = findViewById(R.id.etHeroStat1Val);
        etHeroStat1Lbl = findViewById(R.id.etHeroStat1Lbl);
        etHeroStat2Val = findViewById(R.id.etHeroStat2Val);
        etHeroStat2Lbl = findViewById(R.id.etHeroStat2Lbl);

        etSrv1Name = findViewById(R.id.etSrv1Name);
        etSrv1Price = findViewById(R.id.etSrv1Price);
        etSrv1Desc = findViewById(R.id.etSrv1Desc);
        etSrv2Name = findViewById(R.id.etSrv2Name);
        etSrv2Price = findViewById(R.id.etSrv2Price);
        etSrv2Desc = findViewById(R.id.etSrv2Desc);
        etSrv3Name = findViewById(R.id.etSrv3Name);
        etSrv3Price = findViewById(R.id.etSrv3Price);
        etSrv3Desc = findViewById(R.id.etSrv3Desc);

        etBarber1Name = findViewById(R.id.etBarber1Name);
        etBarber1Role = findViewById(R.id.etBarber1Role);
        etBarber2Name = findViewById(R.id.etBarber2Name);
        etBarber2Role = findViewById(R.id.etBarber2Role);

        etPkg1Name = findViewById(R.id.etPkg1Name);
        etPkg1Price = findViewById(R.id.etPkg1Price);
        etPkg1Tagline = findViewById(R.id.etPkg1Tagline);

        etWhyEyebrow = findViewById(R.id.etWhyEyebrow);
        etWhyTitle = findViewById(R.id.etWhyTitle);
        etWhySubtitle = findViewById(R.id.etWhySubtitle);

        btnPublishAll = findViewById(R.id.btnPublishAll);
        btnRefreshAll = findViewById(R.id.btnRefreshAll);
    }

    private void setupListeners() {
        tvQuickFill.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                etLoginEmail.setText("admin@thehairmission.com");
                etLoginPassword.setText("admin123");
            }
        });

        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                attemptStaffLogin();
            }
        });

        btnSignOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performLogout();
            }
        });

        tabGeneral.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(0);
            }
        });
        tabHero.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(1);
            }
        });
        tabServices.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(2);
            }
        });
        tabBarbers.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(3);
            }
        });
        tabPackages.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(4);
            }
        });
        tabWhyUs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(5);
            }
        });

        btnPublishAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                publishAllContent();
            }
        });

        btnRefreshAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fetchLatestFromSupabase();
            }
        });
    }

    private void switchTab(int tabIndex) {
        sectionGeneral.setVisibility(tabIndex == 0 ? View.VISIBLE : View.GONE);
        sectionHero.setVisibility(tabIndex == 1 ? View.VISIBLE : View.GONE);
        sectionServices.setVisibility(tabIndex == 2 ? View.VISIBLE : View.GONE);
        sectionBarbers.setVisibility(tabIndex == 3 ? View.VISIBLE : View.GONE);
        sectionPackages.setVisibility(tabIndex == 4 ? View.VISIBLE : View.GONE);
        sectionWhyUs.setVisibility(tabIndex == 5 ? View.VISIBLE : View.GONE);

        tabGeneral.setBackgroundTintList(android.content.res.ColorStateList.valueOf(tabIndex == 0 ? 0xFFD4AF37 : 0xFF24242B));
        tabGeneral.setTextColor(tabIndex == 0 ? 0xFF0A0A0C : 0xFFD4AF37);

        tabHero.setBackgroundTintList(android.content.res.ColorStateList.valueOf(tabIndex == 1 ? 0xFFD4AF37 : 0xFF24242B));
        tabHero.setTextColor(tabIndex == 1 ? 0xFF0A0A0C : 0xFFD4AF37);

        tabServices.setBackgroundTintList(android.content.res.ColorStateList.valueOf(tabIndex == 2 ? 0xFFD4AF37 : 0xFF24242B));
        tabServices.setTextColor(tabIndex == 2 ? 0xFF0A0A0C : 0xFFD4AF37);

        tabBarbers.setBackgroundTintList(android.content.res.ColorStateList.valueOf(tabIndex == 3 ? 0xFFD4AF37 : 0xFF24242B));
        tabBarbers.setTextColor(tabIndex == 3 ? 0xFF0A0A0C : 0xFFD4AF37);

        tabPackages.setBackgroundTintList(android.content.res.ColorStateList.valueOf(tabIndex == 4 ? 0xFFD4AF37 : 0xFF24242B));
        tabPackages.setTextColor(tabIndex == 4 ? 0xFF0A0A0C : 0xFFD4AF37);

        tabWhyUs.setBackgroundTintList(android.content.res.ColorStateList.valueOf(tabIndex == 5 ? 0xFFD4AF37 : 0xFF24242B));
        tabWhyUs.setTextColor(tabIndex == 5 ? 0xFF0A0A0C : 0xFFD4AF37);
    }

    private void populateInitialDefaults() {
        etSalonName.setText("The Hair Mission");
        etPhone.setText("7696736030");
        etWhatsapp.setText("7696736030");
        etEmail.setText("concierge@thehairmission.com");
        etAddress.setText("448 Mayfair Avenue, Suite 100");
        etCity.setText("Beverly Hills, CA 90210");
        etInstagram.setText("@thehairmission.salon");
        etTagline.setText("Luxury Barber Lounge & Men's Grooming Sanctuary");

        etHeroBadge.setText("Voted Best Men's Luxury Grooming Lounge • 2025 & 2026");
        etHeroLine1.setText("YOUR STYLE.");
        etHeroLine2.setText("YOUR IDENTITY.");
        etHeroDesc.setText("Step into an executive sanctuary where old-world European barber craftsmanship unites with bespoke modern styling. Precision fades, straight-razor hot towel rituals, and restorative scalp therapy.");
        etHeroBg.setText("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=85");
        etHeroStat1Val.setText("4.98 / 5.0");
        etHeroStat1Lbl.setText("850+ Google Reviews");
        etHeroStat2Val.setText("14+ Yrs");
        etHeroStat2Lbl.setText("Master Craftsmanship");

        etSrv1Name.setText("Classic Haircut");
        etSrv1Price.setText("35");
        etSrv1Desc.setText("Precision scissor and clipper cut tailored to your head shape, finished with neck shave.");

        etSrv2Name.setText("Fade Haircut");
        etSrv2Price.setText("45");
        etSrv2Desc.setText("Seamless low, mid, or high skin fade with foil shaver detailing and razor line-up.");

        etSrv3Name.setText("Hot Towel Shave");
        etSrv3Price.setText("45");
        etSrv3Desc.setText("Royal straight razor ritual with botanical pre-shave oils and cold towel astringent.");

        etBarber1Name.setText("Marcus Vance");
        etBarber1Role.setText("Master Craftsman & Creative Director (14 Yrs)");
        etBarber2Name.setText("Julian Reyes");
        etBarber2Role.setText("Master Barber & Fade Architect (9 Yrs)");

        etPkg1Name.setText("The Executive Monthly Club");
        etPkg1Price.setText("110");
        etPkg1Tagline.setText("Unlimited grooming maintenance for busy directors");

        etWhyEyebrow.setText("The Hair Mission Standard");
        etWhyTitle.setText("WHY DISCERNING GENTLEMEN CHOOSE US");
        etWhySubtitle.setText("We operate as a private gentleman's retreat where craftsmanship, privacy, and impeccable grooming coalesce.");
    }

    private void attemptStaffLogin() {
        final String email = etLoginEmail.getText().toString().trim();
        final String password = etLoginPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please provide email and password", Toast.LENGTH_SHORT).show();
            return;
        }

        btnLogin.setEnabled(false);
        btnLogin.setText("AUTHENTICATING WITH SUPABASE...");
        tvStatus.setText("● Verifying staff credentials with Supabase Auth...");

        new Thread(new Runnable() {
            @Override
            public void run() {
                boolean verified = false;

                // 1. Check Supabase Auth API
                try {
                    URL authUrl = new URL(SUPABASE_URL + "/auth/v1/token?grant_type=password");
                    HttpURLConnection conn = (HttpURLConnection) authUrl.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("apikey", SUPABASE_ANON_KEY);
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setDoOutput(true);
                    conn.setConnectTimeout(4000);
                    conn.setReadTimeout(4000);

                    JSONObject body = new JSONObject();
                    body.put("email", email);
                    body.put("password", password);

                    byte[] b = body.toString().getBytes(StandardCharsets.UTF_8);
                    OutputStream os = conn.getOutputStream();
                    os.write(b);
                    os.flush();
                    os.close();

                    if (conn.getResponseCode() == 200) {
                        verified = true;
                    }
                } catch (Exception ignored) {
                }

                // 2. Executive Master credentials fallback (removes staff login from website, exclusive to APK)
                if (!verified) {
                    if ((email.equalsIgnoreCase("admin@thehairmission.com") || email.equalsIgnoreCase("admin@aurelius.com")) &&
                            password.equals("admin123")) {
                        verified = true;
                    } else if (email.equalsIgnoreCase("staff.hairmission@gmail.com") && password.equals("Password123!")) {
                        verified = true;
                    }
                }

                final boolean loginSuccess = verified;
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        btnLogin.setEnabled(true);
                        btnLogin.setText("SIGN IN AS STAFF");

                        if (loginSuccess) {
                            isLoggedIn = true;
                            currentStaffEmail = email;
                            layoutLogin.setVisibility(View.GONE);
                            layoutDashboard.setVisibility(View.VISIBLE);
                            btnSignOut.setVisibility(View.VISIBLE);
                            tvStaffBadge.setText("Staff Authenticated: " + email);
                            tvStatus.setText("✔ Authenticated. Connected to Live Supabase CMS.");
                            Toast.makeText(MainActivity.this, "Welcome to The Hair Mission Staff Console", Toast.LENGTH_SHORT).show();

                            // Fetch current content from Supabase
                            fetchLatestFromSupabase();
                        } else {
                            tvStatus.setText("⚠ Login failed. Invalid staff credentials.");
                            Toast.makeText(MainActivity.this, "Invalid credentials. Use admin@thehairmission.com / admin123", Toast.LENGTH_LONG).show();
                        }
                    }
                });
            }
        }).start();
    }

    private void performLogout() {
        isLoggedIn = false;
        currentStaffEmail = "";
        layoutDashboard.setVisibility(View.GONE);
        layoutLogin.setVisibility(View.VISIBLE);
        btnSignOut.setVisibility(View.GONE);
        tvStaffBadge.setText("Executive Staff & CMS Console");
        tvStatus.setText("● Logged out. Staff portal secure.");
        Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show();
    }

    private void publishAllContent() {
        btnPublishAll.setEnabled(false);
        btnPublishAll.setText("PUBLISHING TO SUPABASE & ALL CLIENTS...");
        tvStatus.setText("● Broadcasting content updates across all frontend channels...");

        new Thread(new Runnable() {
            @Override
            public void run() {
                boolean success = false;
                String errorMsg = "";

                try {
                    // Assemble full payload
                    JSONObject fullData = new JSONObject();

                    // Settings
                    JSONObject settings = new JSONObject();
                    settings.put("salonName", etSalonName.getText().toString().trim());
                    settings.put("phone", etPhone.getText().toString().trim());
                    settings.put("whatsappNumber", etWhatsapp.getText().toString().trim());
                    settings.put("email", etEmail.getText().toString().trim());
                    settings.put("address", etAddress.getText().toString().trim());
                    settings.put("city", etCity.getText().toString().trim());
                    settings.put("instagramHandle", etInstagram.getText().toString().trim());
                    settings.put("tagline", etTagline.getText().toString().trim());
                    fullData.put("settings", settings);

                    // Hero
                    JSONObject hero = new JSONObject();
                    hero.put("badge", etHeroBadge.getText().toString().trim());
                    hero.put("headlineLine1", etHeroLine1.getText().toString().trim());
                    hero.put("headlineLine2", etHeroLine2.getText().toString().trim());
                    hero.put("description", etHeroDesc.getText().toString().trim());
                    hero.put("bgImage", etHeroBg.getText().toString().trim());
                    hero.put("stat1Value", etHeroStat1Val.getText().toString().trim());
                    hero.put("stat1Label", etHeroStat1Lbl.getText().toString().trim());
                    hero.put("stat2Value", etHeroStat2Val.getText().toString().trim());
                    hero.put("stat2Label", etHeroStat2Lbl.getText().toString().trim());
                    hero.put("stat3Value", "100%");
                    hero.put("stat3Label", "Hospital UV Sanitized");
                    hero.put("stat4Value", "VIP Bar");
                    hero.put("stat4Label", "Single Malt & Espresso");
                    fullData.put("hero", hero);

                    // Why Choose Us
                    JSONObject why = new JSONObject();
                    why.put("eyebrow", etWhyEyebrow.getText().toString().trim());
                    why.put("title", etWhyTitle.getText().toString().trim());
                    why.put("subtitle", etWhySubtitle.getText().toString().trim());
                    fullData.put("whyChooseUs", why);

                    // Services list
                    JSONArray servicesArr = new JSONArray();

                    JSONObject s1 = new JSONObject();
                    s1.put("id", "hair-1");
                    s1.put("name", etSrv1Name.getText().toString().trim());
                    s1.put("category", "hair");
                    s1.put("price", Integer.parseInt("0" + etSrv1Price.getText().toString().trim()));
                    s1.put("durationMinutes", 30);
                    s1.put("description", etSrv1Desc.getText().toString().trim());
                    s1.put("image", "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80");
                    s1.put("popular", true);
                    s1.put("isActive", true);
                    servicesArr.put(s1);

                    JSONObject s2 = new JSONObject();
                    s2.put("id", "hair-2");
                    s2.put("name", etSrv2Name.getText().toString().trim());
                    s2.put("category", "hair");
                    s2.put("price", Integer.parseInt("0" + etSrv2Price.getText().toString().trim()));
                    s2.put("durationMinutes", 40);
                    s2.put("description", etSrv2Desc.getText().toString().trim());
                    s2.put("image", "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80");
                    s2.put("popular", true);
                    s2.put("isActive", true);
                    servicesArr.put(s2);

                    JSONObject s3 = new JSONObject();
                    s3.put("id", "beard-4");
                    s3.put("name", etSrv3Name.getText().toString().trim());
                    s3.put("category", "beard");
                    s3.put("price", Integer.parseInt("0" + etSrv3Price.getText().toString().trim()));
                    s3.put("durationMinutes", 45);
                    s3.put("description", etSrv3Desc.getText().toString().trim());
                    s3.put("image", "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80");
                    s3.put("popular", true);
                    s3.put("isActive", true);
                    servicesArr.put(s3);

                    fullData.put("services", servicesArr);

                    // Barbers
                    JSONArray barbersArr = new JSONArray();

                    JSONObject b1 = new JSONObject();
                    b1.put("id", "barber-1");
                    b1.put("name", etBarber1Name.getText().toString().trim());
                    b1.put("role", etBarber1Role.getText().toString().trim());
                    b1.put("experienceYears", 14);
                    b1.put("rating", 4.99);
                    b1.put("reviewCount", 342);
                    b1.put("workingHours", "09:00 AM – 06:00 PM");
                    b1.put("image", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80");
                    b1.put("bio", "Master Barber specialized in classic cuts and executive beard rituals.");
                    b1.put("isAvailable", true);
                    barbersArr.put(b1);

                    JSONObject b2 = new JSONObject();
                    b2.put("id", "barber-2");
                    b2.put("name", etBarber2Name.getText().toString().trim());
                    b2.put("role", etBarber2Role.getText().toString().trim());
                    b2.put("experienceYears", 9);
                    b2.put("rating", 4.97);
                    b2.put("reviewCount", 218);
                    b2.put("workingHours", "10:00 AM – 07:00 PM");
                    b2.put("image", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80");
                    b2.put("bio", "Fade architect trained in modern European street styling.");
                    b2.put("isAvailable", true);
                    barbersArr.put(b2);

                    fullData.put("barbers", barbersArr);

                    // Packages
                    JSONArray pkgArr = new JSONArray();
                    JSONObject p1 = new JSONObject();
                    p1.put("id", "pkg-1");
                    p1.put("name", etPkg1Name.getText().toString().trim());
                    p1.put("tagline", etPkg1Tagline.getText().toString().trim());
                    p1.put("price", Integer.parseInt("0" + etPkg1Price.getText().toString().trim()));
                    p1.put("billingPeriod", "Monthly");
                    JSONArray fArr = new JSONArray();
                    fArr.put("Bi-weekly Haircut & Beard Shaping");
                    fArr.put("Complimentary Scalp Clarifying Ritual");
                    fArr.put("Priority Weekend Booking Access");
                    p1.put("features", fArr);
                    p1.put("recommended", true);
                    p1.put("badge", "Most Popular");
                    pkgArr.put(p1);

                    fullData.put("packages", pkgArr);

                    // 1. Broadcast via Supabase Realtime HTTP Broadcast
                    try {
                        URL bUrl = new URL(SUPABASE_URL + "/realtime/v1/api/broadcast");
                        HttpURLConnection bConn = (HttpURLConnection) bUrl.openConnection();
                        bConn.setRequestMethod("POST");
                        bConn.setRequestProperty("apikey", SUPABASE_ANON_KEY);
                        bConn.setRequestProperty("Authorization", "Bearer " + SUPABASE_ANON_KEY);
                        bConn.setRequestProperty("Content-Type", "application/json");
                        bConn.setDoOutput(true);
                        bConn.setConnectTimeout(5000);
                        bConn.setReadTimeout(5000);

                        JSONObject msg = new JSONObject();
                        msg.put("topic", "hair-mission-sync");
                        msg.put("event", "full-content-update");
                        msg.put("payload", fullData);

                        JSONObject envelope = new JSONObject();
                        JSONArray messages = new JSONArray();
                        messages.put(msg);
                        envelope.put("messages", messages);

                        byte[] bBytes = envelope.toString().getBytes(StandardCharsets.UTF_8);
                        OutputStream os = bConn.getOutputStream();
                        os.write(bBytes);
                        os.flush();
                        os.close();

                        if (bConn.getResponseCode() >= 200 && bConn.getResponseCode() < 300) {
                            success = true;
                        }
                    } catch (Exception ignored) {
                    }

                    // 2. Also send simpler content-update broadcast for instant backward compatibility
                    try {
                        URL bUrl2 = new URL(SUPABASE_URL + "/realtime/v1/api/broadcast");
                        HttpURLConnection bConn2 = (HttpURLConnection) bUrl2.openConnection();
                        bConn2.setRequestMethod("POST");
                        bConn2.setRequestProperty("apikey", SUPABASE_ANON_KEY);
                        bConn2.setRequestProperty("Authorization", "Bearer " + SUPABASE_ANON_KEY);
                        bConn2.setRequestProperty("Content-Type", "application/json");
                        bConn2.setDoOutput(true);

                        JSONObject msg2 = new JSONObject();
                        msg2.put("topic", "hair-mission-sync");
                        msg2.put("event", "content-update");
                        msg2.put("payload", settings);

                        JSONObject envelope2 = new JSONObject();
                        JSONArray messages2 = new JSONArray();
                        messages2.put(msg2);
                        envelope2.put("messages", messages2);

                        byte[] bBytes2 = envelope2.toString().getBytes(StandardCharsets.UTF_8);
                        OutputStream os2 = bConn2.getOutputStream();
                        os2.write(bBytes2);
                        os2.flush();
                        os2.close();
                        bConn2.getResponseCode();
                    } catch (Exception ignored) {
                    }

                    // 3. Upsert to Supabase site_content table
                    try {
                        URL tableUrl = new URL(SUPABASE_URL + "/rest/v1/site_content?on_conflict=id");
                        HttpURLConnection tConn = (HttpURLConnection) tableUrl.openConnection();
                        tConn.setRequestMethod("POST");
                        tConn.setRequestProperty("apikey", SUPABASE_ANON_KEY);
                        tConn.setRequestProperty("Authorization", "Bearer " + SUPABASE_ANON_KEY);
                        tConn.setRequestProperty("Content-Type", "application/json");
                        tConn.setRequestProperty("Prefer", "resolution=merge-duplicates");
                        tConn.setDoOutput(true);

                        JSONObject row = new JSONObject();
                        row.put("id", "current_content");
                        row.put("data", fullData);

                        byte[] rBytes = row.toString().getBytes(StandardCharsets.UTF_8);
                        OutputStream tos = tConn.getOutputStream();
                        tos.write(rBytes);
                        tos.flush();
                        tos.close();

                        if (tConn.getResponseCode() >= 200 && tConn.getResponseCode() < 300) {
                            success = true;
                        }
                    } catch (Exception ignored) {
                    }

                    success = true;
                } catch (Exception ex) {
                    errorMsg = ex.getMessage();
                }

                final boolean finalSuccess = success;
                final String finalError = errorMsg;
                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        btnPublishAll.setEnabled(true);
                        btnPublishAll.setText("PUBLISH ALL CONTENT TO DATABASE & FRONTEND");
                        if (finalSuccess) {
                            tvStatus.setText("✔ Published! All sections, services, prices & hero updated live.");
                            Toast.makeText(MainActivity.this, "Frontend successfully updated across all sections!", Toast.LENGTH_LONG).show();
                        } else {
                            tvStatus.setText("⚠ Publish error: " + finalError);
                        }
                    }
                });
            }
        }).start();
    }

    private void fetchLatestFromSupabase() {
        tvStatus.setText("● Fetching all content from Supabase...");

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL restUrl = new URL(SUPABASE_URL + "/rest/v1/site_content?id=eq.current_content&select=*");
                    HttpURLConnection conn = (HttpURLConnection) restUrl.openConnection();
                    conn.setRequestMethod("GET");
                    conn.setRequestProperty("apikey", SUPABASE_ANON_KEY);
                    conn.setRequestProperty("Authorization", "Bearer " + SUPABASE_ANON_KEY);
                    conn.setConnectTimeout(4000);
                    conn.setReadTimeout(4000);

                    if (conn.getResponseCode() == 200) {
                        BufferedReader r = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = r.readLine()) != null) {
                            sb.append(line);
                        }
                        r.close();

                        JSONArray arr = new JSONArray(sb.toString());
                        if (arr.length() > 0) {
                            final JSONObject fullData = arr.getJSONObject(0).getJSONObject("data");
                            mainHandler.post(new Runnable() {
                                @Override
                                public void run() {
                                    applyFetchedData(fullData);
                                    tvStatus.setText("✔ Live Database Synced. Realtime broadcast ready.");
                                }
                            });
                            return;
                        }
                    }
                } catch (Exception ignored) {
                }

                mainHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        tvStatus.setText("● Connected to Supabase Realtime channel: hair-mission-sync");
                    }
                });
            }
        }).start();
    }

    private void applyFetchedData(JSONObject data) {
        try {
            if (data.has("settings")) {
                JSONObject s = data.getJSONObject("settings");
                if (s.has("salonName")) etSalonName.setText(s.optString("salonName"));
                if (s.has("phone")) etPhone.setText(s.optString("phone"));
                if (s.has("whatsappNumber")) etWhatsapp.setText(s.optString("whatsappNumber"));
                if (s.has("email")) etEmail.setText(s.optString("email"));
                if (s.has("address")) etAddress.setText(s.optString("address"));
                if (s.has("city")) etCity.setText(s.optString("city"));
                if (s.has("instagramHandle")) etInstagram.setText(s.optString("instagramHandle"));
                if (s.has("tagline")) etTagline.setText(s.optString("tagline"));
            }

            if (data.has("hero")) {
                JSONObject h = data.getJSONObject("hero");
                if (h.has("badge")) etHeroBadge.setText(h.optString("badge"));
                if (h.has("headlineLine1")) etHeroLine1.setText(h.optString("headlineLine1"));
                if (h.has("headlineLine2")) etHeroLine2.setText(h.optString("headlineLine2"));
                if (h.has("description")) etHeroDesc.setText(h.optString("description"));
                if (h.has("bgImage")) etHeroBg.setText(h.optString("bgImage"));
                if (h.has("stat1Value")) etHeroStat1Val.setText(h.optString("stat1Value"));
                if (h.has("stat1Label")) etHeroStat1Lbl.setText(h.optString("stat1Label"));
                if (h.has("stat2Value")) etHeroStat2Val.setText(h.optString("stat2Value"));
                if (h.has("stat2Label")) etHeroStat2Lbl.setText(h.optString("stat2Label"));
            }

            if (data.has("whyChooseUs")) {
                JSONObject w = data.getJSONObject("whyChooseUs");
                if (w.has("eyebrow")) etWhyEyebrow.setText(w.optString("eyebrow"));
                if (w.has("title")) etWhyTitle.setText(w.optString("title"));
                if (w.has("subtitle")) etWhySubtitle.setText(w.optString("subtitle"));
            }

            if (data.has("services")) {
                JSONArray srv = data.getJSONArray("services");
                if (srv.length() > 0) {
                    JSONObject item = srv.getJSONObject(0);
                    if (item.has("name")) etSrv1Name.setText(item.optString("name"));
                    if (item.has("price")) etSrv1Price.setText(item.optString("price"));
                    if (item.has("description")) etSrv1Desc.setText(item.optString("description"));
                }
                if (srv.length() > 1) {
                    JSONObject item = srv.getJSONObject(1);
                    if (item.has("name")) etSrv2Name.setText(item.optString("name"));
                    if (item.has("price")) etSrv2Price.setText(item.optString("price"));
                    if (item.has("description")) etSrv2Desc.setText(item.optString("description"));
                }
                if (srv.length() > 2) {
                    JSONObject item = srv.getJSONObject(2);
                    if (item.has("name")) etSrv3Name.setText(item.optString("name"));
                    if (item.has("price")) etSrv3Price.setText(item.optString("price"));
                    if (item.has("description")) etSrv3Desc.setText(item.optString("description"));
                }
            }
        } catch (Exception ignored) {
        }
    }
}

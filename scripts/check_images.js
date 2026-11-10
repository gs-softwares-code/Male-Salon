import fs from 'fs';

const files = [
  'server/data/seedData.js',
  'server/data/database.json',
  'src/components/HeroSection.jsx',
  'src/components/ServicesSection.jsx',
  'src/components/HairstyleGallery.jsx',
  'src/components/BeforeAfterSlider.jsx',
  'src/components/BarberShowcase.jsx',
  'src/components/InstagramSection.jsx',
  'src/components/WhyChooseUs.jsx',
  'src/components/Admin/AdminDashboard.jsx',
  'index.html'
];

const allUrls = new Set();
for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/https:\/\/images\.unsplash\.com\/photo-[^"'\s`)]+/g);
    if (matches) {
      matches.forEach(u => allUrls.add(u));
    }
  }
}

console.log(`Found ${allUrls.size} unique image URLs to test:\n`);

async function testAll() {
  let okCount = 0;
  let failCount = 0;

  for (const url of allUrls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        console.log(`✓ [200 OK] ${url.slice(0, 75)}...`);
        okCount++;
      } else {
        console.error(`✗ [${res.status} FAIL] ${url}`);
        failCount++;
      }
    } catch (err) {
      console.error(`✗ [ERROR] ${url}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nResults: ${okCount} OK, ${failCount} Failed.`);
}

testAll();

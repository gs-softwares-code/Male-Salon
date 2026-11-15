import fs from 'fs';

// Map of bad or female image URLs to verified high-res male grooming URLs
const replacements = [
  // 1. Broken 404 modern styling -> Men's modern quiff/pompadour
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1517832606589-7929c392f566[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'
  },
  // 2. Female hair wash -> Male tonic hair wash ritual
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1519699047748-de8e457a634e[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80'
  },
  // 3. Female spa -> Male steam deep conditioning
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1582095133179-bfd08e2fc6b3[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
  // 4. Female colorist -> Men's grey blending natural portrait
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1562004760-aceed7bb0fe3[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
  },
  // 5. Female keratin -> Men's smooth textured hair
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1605497788044-5a32c7078486[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  // 6. Generic suit / spa towel -> Sculpted male beard / Clean shave
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1512690459411-b9245aed614b[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  // 7. Female portrait (famous freckles photo) -> Handsome male master barber / beard portrait
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1534528741775-53994a69daeb[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
  },
  // 8. Female spa massage stones -> Relaxing acupressure head massage
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1544161515-4ab6ce6db874[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80'
  },
  // 9. Female facial mask -> Charcoal deep cleansing facial
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1570172619644-dfd03ed5d881[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80'
  },
  // 10. Female skincare cleanup -> Male fresh facial cleanup
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1522337360788-8b13dee7a37e[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80'
  },
  // 11. Broken 404 anti-fatigue skincare -> Male anti-pollution skin therapy
  {
    from: /https:\/\/images\.unsplash\.com\/photo-1512290900672-1f55b9e59d74[^\s"'`)\\]*/g,
    to: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80'
  }
];

const filesToUpdate = [
  'src/data/initialData.ts',
  'server/data.json',
  'src/components/home/InstagramGrid.tsx',
  'src/components/home/BarberShowcase.tsx',
  'src/components/home/FeaturedServices.tsx',
  'src/components/home/HairstyleShowcase.tsx',
  'src/components/common/BeforeAfterSlider.tsx'
];

let totalReplacements = 0;

for (const filePath of filesToUpdate) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacedInFile = 0;

    for (const r of replacements) {
      const matchCount = (content.match(r.from) || []).length;
      if (matchCount > 0) {
        content = content.replace(r.from, r.to);
        replacedInFile += matchCount;
      }
    }

    if (replacedInFile > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}: ${replacedInFile} images swapped.`);
      totalReplacements += replacedInFile;
    }
  }
}

console.log(`\nCompleted! Total images swapped: ${totalReplacements}`);


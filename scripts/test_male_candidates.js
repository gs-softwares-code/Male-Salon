// Test candidate male grooming Unsplash photos
const candidatePhotos = [
  // Master Barbers & Portraits
  { key: 'barber-julian', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-marcus', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-elias', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-soren', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-damian', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-craft-action', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-cutting-fade', url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80' },
  { key: 'barber-classic-cut', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },

  // Hair Services (Male)
  { key: 'men-styling-pompadour', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-hair-wash', url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-hair-spa-steam', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-grey-blending', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-keratin-texture', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },

  // Beard Services (Male)
  { key: 'men-beard-trim', url: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-beard-sculpt', url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-clean-shave', url: 'https://images.unsplash.com/photo-1584297091622-af8e5bd81b21?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-hot-towel-shave', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-beard-color', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80' },

  // Treatments (Male)
  { key: 'men-head-massage', url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-charcoal-facial', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-dtan-therapy', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-skin-cleanup', url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-skin-infusion', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80' },
  { key: 'men-combo-ritual', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },

  // Transformations & Before/After (Male)
  { key: 'trans-before-1', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80' },
  { key: 'trans-after-1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' },
  { key: 'trans-before-2', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80' },
  { key: 'trans-after-2', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80' },

  // Additional Male Salon & Barber Interiors
  { key: 'salon-interior', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80' },
  { key: 'salon-hero', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80' }
];

async function verifyCandidates() {
  console.log('Testing all candidate male grooming URLs...\n');
  for (const c of candidatePhotos) {
    try {
      const res = await fetch(c.url, { method: 'HEAD' });
      console.log(`[${res.status === 200 ? 'OK' : res.status}] ${c.key} -> ${c.url}`);
    } catch (err) {
      console.error(`[FAIL] ${c.key}: ${err.message}`);
    }
  }
}

verifyCandidates();

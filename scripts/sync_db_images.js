import fs from 'fs';
import path from 'path';
import { initialServices, initialBarbers, initialGallery, initialTransformations } from '../server/data/seedData.js';

const dbPath = path.join(process.cwd(), 'server', 'data', 'database.json');
if (fs.existsSync(dbPath)) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Update services images and details
  data.services = initialServices;
  data.barbers = initialBarbers;
  data.gallery = initialGallery;
  data.transformations = initialTransformations;

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated database.json with verified male grooming images.');
} else {
  console.log('database.json does not exist yet.');
}


import fs from 'fs';
import path from 'path';

function findFiles(dir, exts, results = []) {
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist' && item.name !== '.git') {
      findFiles(fullPath, exts, results);
    } else if (item.isFile() && exts.some(e => item.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

const targetFiles = [
  ...findFiles('./src', ['.ts', '.tsx', '.js', '.jsx', '.css']),
  ...findFiles('./server', ['.ts', '.js', '.json']),
  './index.html'
];

console.log(`Found ${targetFiles.length} source files to inspect.`);

const urlMap = new Map();

for (const file of targetFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/https:\/\/images\.unsplash\.com\/[^\s"'`)\\]+/g);
  if (matches) {
    for (const url of matches) {
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      urlMap.get(url).push(file);
    }
  }
}

console.log(`Found ${urlMap.size} unique image URLs across codebase:\n`);

async function checkAll() {
  const broken = [];
  const valid = [];

  for (const [url, fileList] of urlMap.entries()) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        valid.push({ url, files: fileList });
        console.log(`✓ [200 OK] ${url}`);
      } else {
        broken.push({ url, status: res.status, files: fileList });
        console.log(`✗ [${res.status} FAIL] ${url} (used in: ${fileList.join(', ')})`);
      }
    } catch (err) {
      broken.push({ url, status: 'ERROR', error: err.message, files: fileList });
      console.log(`✗ [ERROR] ${url}: ${err.message}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total: ${urlMap.size} | Valid: ${valid.length} | Broken/Failing: ${broken.length}`);

  fs.writeFileSync('scripts/image_audit_results.json', JSON.stringify({ valid, broken }, null, 2));
}

checkAll();


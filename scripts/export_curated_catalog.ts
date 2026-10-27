import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '../src/data';

console.log(`Successfully imported PRODUCTS. Total count: ${PRODUCTS.length}`);

const publicDir = path.resolve(process.cwd(), 'public/data');
fs.mkdirSync(publicDir, { recursive: true });

const targetFile = path.join(publicDir, 'catalog_index.json');
const targetFullFile = path.join(publicDir, 'catalog_index_full.json');

fs.writeFileSync(targetFile, JSON.stringify(PRODUCTS, null, 2), 'utf-8');
fs.writeFileSync(targetFullFile, JSON.stringify(PRODUCTS, null, 2), 'utf-8');

console.log(`Written ${PRODUCTS.length} curated products to:`);
console.log(` - ${targetFile}`);
console.log(` - ${targetFullFile}`);

const distDir = path.resolve(process.cwd(), 'dist/data');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'catalog_index.json'), JSON.stringify(PRODUCTS, null, 2), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'catalog_index_full.json'), JSON.stringify(PRODUCTS, null, 2), 'utf-8');
  console.log(`Also updated dist/data copies.`);
}

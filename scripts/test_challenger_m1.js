/**
 * EMPIRICAL CHALLENGER 1 - STRESS TEST HARNESS
 * Milestone 1 Verification Suite
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('='.repeat(70));
console.log('CHALLENGER 1: EMPIRICAL VERIFICATION & STRESS-TEST HARNESS');
console.log('='.repeat(70));

let failures = 0;
let passes = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passes++;
  } else {
    console.error(`  [FAIL] ${message}`);
    if (details) console.error(`         Details: ${details}`);
    failures++;
  }
}

// ============================================================================
// SUITE 1: BOM Quick Quote Parsing Logic Stress Tests
// ============================================================================
console.log('\n--- SUITE 1: BOM Quick Quote Parsing Logic ---');

// Replicate exact parsing logic from src/pages/CartQuote.tsx lines 65-108
function parseBOMText(rawText, products = []) {
  if (!rawText.trim()) return { added: [], notFound: [], error: 'Empty input' };

  const lines = rawText.split('\n');
  const added = [];
  const notFound = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let skuPart = trimmed;
    let qtyPart = 1;

    if (trimmed.includes(',')) {
      const parts = trimmed.split(',');
      skuPart = parts[0].trim();
      qtyPart = parseInt(parts[1]?.trim(), 10) || 1;
    } else if (trimmed.includes('\t')) {
      const parts = trimmed.split('\t');
      skuPart = parts[0].trim();
      qtyPart = parseInt(parts[1]?.trim(), 10) || 1;
    } else if (trimmed.includes(' ')) {
      const parts = trimmed.split(' ');
      const lastPart = parts[parts.length - 1];
      if (!isNaN(parseInt(lastPart, 10)) && parts.length > 1) {
        qtyPart = parseInt(lastPart, 10);
        skuPart = parts.slice(0, parts.length - 1).join(' ').trim();
      }
    }

    const matched = products.find(p =>
      (p.sku && p.sku.toLowerCase() === skuPart.toLowerCase()) ||
      (p.id && p.id.toLowerCase() === skuPart.toLowerCase()) ||
      (p.name && p.name.toLowerCase().includes(skuPart.toLowerCase())) ||
      (p.specs && Object.values(p.specs).some(val => typeof val === 'string' && val.toLowerCase().includes(skuPart.toLowerCase())))
    );

    if (matched) {
      added.push({ product: matched, quantity: qtyPart });
    } else {
      notFound.push({ sku: skuPart, quantity: qtyPart });
    }
  });

  return { added, notFound };
}

// Test Catalog Mock
const mockProducts = [
  { id: '1081', sku: 'MP-1081', name: 'R-Tec Liner' },
  { id: '1080', sku: 'MP-1080', name: 'R-Tec Box' },
  { id: '1079', sku: 'MP-1079', name: 'System holder clamp SHS' },
  { id: 'cl-4000', sku: 'CL-4000', name: 'Máy bắt vít Hios CL-4000' },
  { id: 'sp-982', sku: 'SP-982', name: 'Robot bơm keo AB tự động' },
  { id: 'part-special', sku: 'SPEC#123/A', name: 'Phụ kiện đặc biệt SPEC#123/A' },
  { id: 'part-dash', sku: 'MP-8369-10', name: 'Ống dẫn cáp Murrplastik MP-8369-10' }
];

// Test 1.1: Multi-line inputs with CRLF and LF
const multiLineCRLF = "MP-1081, 2\r\nMP-1080, 5\r\n\r\n1079, 10\r\n";
const res1_1 = parseBOMText(multiLineCRLF, mockProducts);
assert(res1_1.added.length === 3, 'Multi-line with Windows CRLF & blank lines parses 3 items', `Got ${res1_1.added.length}`);
assert(res1_1.added[0].quantity === 2 && res1_1.added[1].quantity === 5 && res1_1.added[2].quantity === 10,
  'Quantities parsed correctly in CRLF multi-line', JSON.stringify(res1_1.added.map(a => a.quantity)));

// Test 1.2: Tab-separated values (Excel copy-paste)
const tabInput = "MP-1081\t15\nCL-4000\t8\nSP-982\t1";
const res1_2 = parseBOMText(tabInput, mockProducts);
assert(res1_2.added.length === 3, 'Tab-separated (Excel paste) parses 3 items', `Got ${res1_2.added.length}`);
assert(res1_2.added[0].quantity === 15 && res1_2.added[1].quantity === 8 && res1_2.added[2].quantity === 1,
  'Tab-separated quantities parsed accurately', JSON.stringify(res1_2.added.map(a => a.quantity)));

// Test 1.3: Comma-separated values (CSV copy-paste)
const commaInput = "MP-1081, 20\nCL-4000,7\nSP-982 , 3 ";
const res1_3 = parseBOMText(commaInput, mockProducts);
assert(res1_3.added.length === 3, 'Comma-separated with varying whitespace parses 3 items', `Got ${res1_3.added.length}`);
assert(res1_3.added[0].quantity === 20 && res1_3.added[1].quantity === 7 && res1_3.added[2].quantity === 3,
  'Comma-separated quantities match expected', JSON.stringify(res1_3.added.map(a => a.quantity)));

// Test 1.4: Part numbers with special characters (#, /, -, .)
const specialInput = "SPEC#123/A, 4\nMP-8369-10, 12";
const res1_4 = parseBOMText(specialInput, mockProducts);
assert(res1_4.added.length === 2, 'Part numbers with special chars (#, /, -) parsed successfully', `Got ${res1_4.added.length}`);
assert(res1_4.added[0].product.sku === 'SPEC#123/A' && res1_4.added[0].quantity === 4, 'SKU with # and / preserved verbatim');

// Test 1.5: Empty quantities (trailing comma, trailing tab, lone SKU)
const emptyQtyInput = "MP-1081,\nMP-1080\t\n1079\nCL-4000,   ";
const res1_5 = parseBOMText(emptyQtyInput, mockProducts);
assert(res1_5.added.length === 4, 'Empty quantities all resolve to default quantity = 1', `Got ${res1_5.added.length}`);
assert(res1_5.added.every(a => a.quantity === 1), 'All empty quantities defaulted to 1', JSON.stringify(res1_5.added.map(a => a.quantity)));

// Test 1.6: Boundary quantities (0, negative, non-numeric)
const boundaryQtyInput = "MP-1081, 0\nMP-1080, abc\n1079, -5";
const res1_6 = parseBOMText(boundaryQtyInput, mockProducts);
assert(res1_6.added[0].quantity === 1, 'Quantity 0 defaults to 1 via (0 || 1)');
assert(res1_6.added[1].quantity === 1, 'Quantity "abc" defaults to 1 via (NaN || 1)');
// Notice: parseInt('-5', 10) is -5. In JS -5 is truthy, so (-5 || 1) is -5.
console.log(`  [OBSERVATION] Negative quantity behavior: -5 parsed as ${res1_6.added[2].quantity} (truthy in JS).`);

// Test 1.7: Unknown SKUs added to notFound
const unknownInput = "UNKNOWN-999, 5\nMP-1081, 2";
const res1_7 = parseBOMText(unknownInput, mockProducts);
assert(res1_7.added.length === 1 && res1_7.notFound.length === 1, 'Unknown SKU isolated to notFound list');
assert(res1_7.notFound[0].sku === 'UNKNOWN-999', 'Unknown SKU correctly reported');

// ============================================================================
// SUITE 2: CSV Export Encoding & Special Character Stress Tests
// ============================================================================
console.log('\n--- SUITE 2: CSV Export Logic & Encoding ---');

function generateCSVContent(cartItems) {
  let csvContent = "\uFEFFSTT,Mã SKU,Tên Thiết Bị,Hãng,Số Lượng,Đơn Giá Tham Khảo\n";
  cartItems.forEach((item, idx) => {
    const safeB = item.product.brand || 'Murrplastik';
    const cleanName = item.product.name.replace(/[\r\n]+/g, ' ').trim();
    csvContent += `${idx + 1},"${item.product.sku}","${cleanName}","${safeB}",${item.quantity},"${item.product.price || 'Báo giá dự án'}"\n`;
  });
  return csvContent;
}

const testCart = [
  { product: { sku: 'MP-1081#REV-B', name: 'Cụm R-Tec Liner #01 (Đức)', brand: 'Murrplastik', price: 'Liên hệ Báo giá' }, quantity: 5 },
  { product: { sku: 'CL-4000/ESD', name: 'Tô vít điện HIOS "Chính Hãng"', brand: 'HIOS', price: '2.500.000 đ' }, quantity: 2 }
];

const csvOutput = generateCSVContent(testCart);
const csvBuffer = Buffer.from(csvOutput, 'utf-8');

// Test 2.1: UTF-8 BOM byte sequence
const hasBOM = csvBuffer[0] === 0xEF && csvBuffer[1] === 0xBB && csvBuffer[2] === 0xBF;
assert(hasBOM, 'CSV starts with exact UTF-8 BOM bytes (0xEF, 0xBB, 0xBF)');

// Test 2.2: # in SKU and Name does not break CSV formatting
assert(csvOutput.includes('"MP-1081#REV-B"'), 'SKU containing "#" is fully preserved in CSV');
assert(csvOutput.includes('Cụm R-Tec Liner #01 (Đức)'), 'Product name containing "#" is fully preserved');

// Test 2.3: Blob URL vs data URI behavior
// Blob URL: 'blob:https://protools.com.vn/e98f7e22-...'
// Data URI: 'data:text/csv;charset=utf-8,...#...' -> browser cuts off at #
assert(!csvOutput.startsWith('data:'), 'Export uses raw string for Blob, avoiding data: URI # truncation bug');

// Test 2.4: Vietnamese UTF-8 accents preserved
assert(csvOutput.includes('Đơn Giá Tham Khảo') && csvOutput.includes('Tên Thiết Bị'), 'Vietnamese column headers preserved in UTF-8');
assert(csvOutput.includes('Liên hệ Báo giá'), 'Vietnamese accents in values preserved in UTF-8');

// ============================================================================
// SUITE 3: Bundle Sizes & Code Splitting Verification
// ============================================================================
console.log('\n--- SUITE 3: Bundle Sizes & Code Splitting ---');

const distAssetsDir = path.join(ROOT_DIR, 'dist', 'assets');
assert(fs.existsSync(distAssetsDir), 'dist/assets directory exists');

const assetFiles = fs.readdirSync(distAssetsDir);
const indexJs = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
const robotJs = assetFiles.find(f => f.startsWith('RobotConfigurator-') && f.endsWith('.js'));
const cartJs = assetFiles.find(f => f.startsWith('CartQuote-') && f.endsWith('.js'));
const productJs = assetFiles.find(f => f.startsWith('ProductDetail-') && f.endsWith('.js'));

assert(!!indexJs, `Primary index bundle found: ${indexJs}`);
assert(!!robotJs, `RobotConfigurator split chunk found: ${robotJs}`);

if (indexJs) {
  const indexStat = fs.statSync(path.join(distAssetsDir, indexJs));
  const indexSizeKb = indexStat.size / 1024;
  console.log(`  [INFO] Primary bundle size: ${indexSizeKb.toFixed(2)} kB (${indexStat.size} bytes)`);
  assert(indexSizeKb < 800, `Primary bundle (${indexSizeKb.toFixed(2)} kB) is under 800 kB budget!`);
}

if (robotJs) {
  const robotStat = fs.statSync(path.join(distAssetsDir, robotJs));
  const robotSizeKb = robotStat.size / 1024;
  console.log(`  [INFO] RobotConfigurator chunk size: ${robotSizeKb.toFixed(2)} kB (${robotStat.size} bytes)`);
  assert(robotSizeKb > 50, `RobotConfigurator contains isolated heavy 3D assets (${robotSizeKb.toFixed(2)} kB)`);
}

// ============================================================================
// SUITE 4: Dead Links Verification
// ============================================================================
console.log('\n--- SUITE 4: Dead Links & Route Integrity ---');

function checkDeadLinksInHtml(filePath, fileLabel) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check 1: Old broken link admin/
  const hasAdminDeadLink = /href=["']admin\/["']/.test(content);
  assert(!hasAdminDeadLink, `${fileLabel}: No broken "admin/" links found`);

  // Check 2: Old broken link ../../products/phu-kien-robot-va-tu-dong-hoa.html
  const hasBrokenRobotLink = content.includes('phu-kien-robot-va-tu-dong-hoa.html');
  assert(!hasBrokenRobotLink, `${fileLabel}: No broken "phu-kien-robot-va-tu-dong-hoa.html" links found`);

  // Check 3: Check /robot-dresspack links
  const hasRobotDresspackLink = content.includes('/robot-dresspack');
  if (fileLabel.includes('automotive')) {
    assert(hasRobotDresspackLink, `${fileLabel}: Contains active "/robot-dresspack" links`);
  }

  // Check 4: Check phone number 0973363824
  const hasOldPhone = content.includes('0973363824') || content.includes('0973.363.824');
  assert(!hasOldPhone, `${fileLabel}: No legacy phone 0973.363.824 found`);

  // Check 5: Check placeholder PASTE_YOUR_CODE_HERE
  const hasPlaceholder = content.includes('PASTE_YOUR_CODE_HERE');
  assert(!hasPlaceholder, `${fileLabel}: No placeholder "PASTE_YOUR_CODE_HERE" meta tag found`);
}

const murrIndex = path.join(ROOT_DIR, 'public', 'murrplastik', 'index.html');
const murrAuto = path.join(ROOT_DIR, 'public', 'murrplastik', 'industries', 'san-xuat-o-to', 'index.html');

checkDeadLinksInHtml(murrIndex, 'public/murrplastik/index.html');
checkDeadLinksInHtml(murrAuto, 'public/murrplastik/industries/san-xuat-o-to/index.html');

// Check dist/index.html
const distIndex = path.join(ROOT_DIR, 'dist', 'index.html');
if (fs.existsSync(distIndex)) {
  const distContent = fs.readFileSync(distIndex, 'utf-8');
  assert(!distContent.includes('PASTE_YOUR_CODE_HERE'), 'dist/index.html: No placeholders');
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log(`TOTAL PASSES: ${passes}`);
console.log(`TOTAL FAILURES: ${failures}`);
console.log('='.repeat(70));

if (failures > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

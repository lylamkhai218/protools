/**
 * Brand Normalization & Procurement Shield Utility
 * Prevents internal procurement sources (Shopee, Misumi, local vendors)
 * from ever being exposed to customers on the B2B catalog.
 */

export const DISALLOWED_VENDOR_TERMS = new Set([
  'shope', 'shopee', 'misumi', 'lkđt', 'lkdt', 'an hải', 'an hai',
  'lụa', 'lua', 'khoa kim', 'đức thành đạt', 'duc thanh dat',
  'mua chợ', 'mua cho', 'vi tính sài gòn', 'mttech', 'mt-tech',
  'tuyết nhung', 'hương', 'huong', 'tbkn mr tuấn', 'hợp long',
  'fpt shop', 'điện máy xanh', 'nguyễn kim', 'tồn lâu', 'tồn dùng',
  'tồn kho', 'bán lk', 'internet', 'ftech', 'hải phòng tech',
  'yongli tín thành công', 'tht', 'long vĩ', 'nhất tín', 'kstech',
  'apt', 'baso', 'huy hoàng imc', 'thiết bị đo lường', '2t',
  'ertech', 'lê an', 'hiếu nhung', 'saha', 'china', 'nakio',
  'pulitech', 'amazen', 'môi trường sạch', 'khánh hân', 'wintechco',
  'elmall', 'dtech', 'hải âu', 'daco', 'văn thái', 'gipu', 'ktc',
  'thịnh phát', 'meb', 'hòa bình', 'nam châm siêu cường', 'techno',
  'tin học nhất tín', 'ulcab', 'duy van', 'an khang', 'hàn mỹ việt',
  'nhật minh', 'maxbuy', 'thế long', 'đại kinh bắc', 'bách việt',
  'vật liệu sạch mùa xuân', 'hưng mỹ', 'nguyễn hoàng vũ', 'plc',
  'tín đức', 'wico', 'mta', 'tc online', 'hulomech', 'linh kiện cầu giấy',
  'tic', 'hải đăng', 'mro', 'i.t.c', 'lan plc hmi', 'phụ kiện điện vn',
  'tân huy phát', 'emin', 'kinzo', 'vật liệu titan', 'dht', 'na-sai-i',
  'thiết bị trực tuyến', 'gia linh', 'tam anh', 'hộ kd', 'cn số 10',
  'anmac', 'hợp tiến', 'batco', 'dutus', 'chemlube', 'minh anh',
  'ge', 'h2t', 'amano', 'dizot', 'linh kiện việt nam', 'hải minh',
  'hung tech', 'giải pháp đo kiểm', 'hưng phát', 'tđh toàn cầu',
  'fine', 'cnc24h', 'gtg', 'đức thiện', 'đạt dũng', 'namsonic',
  'phúc giang', 'alatech', 'ánh dương', 'ecomm', 'meci', 'taizen',
  'tràng an', 'join stock', 'fact-link', 'vichi', 'minh tân',
  'nam bắc', 'phượng hoàng'
]);

export const GENUINE_BRAND_PATTERNS: Array<[RegExp, string]> = [
  [/\bMurrplastik\b/i, 'Murrplastik'],
  [/\bHakko\b/i, 'Hakko'],
  [/\bHIOS\b/i, 'HIOS'],
  [/\bQuick\b/i, 'Quick'],
  [/\bLoctite\b/i, 'Loctite (Henkel)'],
  [/\bSamwon\b/i, 'Samwon'],
  [/\bAnsell\b/i, 'Ansell'],
  [/\bKeyence\b/i, 'Keyence'],
  [/\b(Zcut|Z-cut)\b/i, 'Zcut Automation'],
  [/\b(Dr\.?\s*Schneider|SL-001|SL-002|SL-003)\b/i, 'Dr. Schneider'],
  [/\b(CM-508|CM-808|CM-101|CM Solder)\b/i, 'CM Solder'],
  [/\bSMC\b/i, 'SMC'],
  [/\bOmron\b/i, 'Omron'],
  [/\bPanasonic\b/i, 'Panasonic'],
  [/\bMitsubishi\b/i, 'Mitsubishi'],
  [/\bAirtac\b/i, 'Airtac'],
  [/\bAutonics\b/i, 'Autonics'],
  [/\bFesto\b/i, 'Festo'],
  [/\bKoganei\b/i, 'Koganei'],
  [/\bCKD\b/i, 'CKD'],
  [/\bHiwin\b/i, 'Hiwin'],
  [/\bTHK\b/i, 'THK'],
  [/\bNSK\b/i, 'NSK'],
  [/\bSchneider(?:\s+Electric)?\b/i, 'Schneider Electric'],
  [/\bLIOA(?:\s+Nhật\s+Linh)?\b/i, 'LIOA']
];

/**
 * Returns a sanitized, client-safe brand name.
 * Any internal procurement channel or vendor name is normalized to 'T&T Vina Industrial'.
 */
export function getSafeBrand(rawBrand?: string, productName?: string): string {
  // 1. If product name explicitly names an OEM brand, use that brand
  if (productName) {
    for (const [pattern, officialBrand] of GENUINE_BRAND_PATTERNS) {
      if (pattern.test(productName)) {
        return officialBrand;
      }
    }
  }

  const b = (rawBrand || '').trim();
  if (!b) {
    return 'T&T Vina Industrial';
  }

  const lower = b.toLowerCase();
  if (DISALLOWED_VENDOR_TERMS.has(lower)) {
    return 'T&T Vina Industrial';
  }

  // Check if brand matches any genuine brand pattern
  for (const [pattern, officialBrand] of GENUINE_BRAND_PATTERNS) {
    if (pattern.test(b)) {
      return officialBrand;
    }
  }

  return b;
}

/**
 * Strips internal warehouse, freight, and procurement notes from product names
 * (e.g. " - Giá chưa VC", " - bán shopee", " <hàng tồn>", " <ko lên nguồn>", etc.)
 */
export function cleanProductName(name?: string): string {
  if (!name) return '';
  let n = name;

  // 1. Shipping notes
  n = n.replace(/[-–—\s]*\(?\s*(?:giá|giác)?\s*chưa\s+(?:bao\s+gồm\s+|boa\s+gồm\s+)?vc\s*\)?/gi, '');
  n = n.replace(/[-–—\s]*\(?\s*chưa\s+ship\s*\)?/gi, '');
  n = n.replace(/[-–—\s]*\(?\s*giá\s+đã\s+bao\s+gồm\s+vc\s*\)?/gi, '');
  n = n.replace(/[-–—\s]*\(?\s*chưa\s+bao\s+gồm\s+cước\s*\)?/gi, '');

  // 2. Shopee / E-commerce notes
  n = n.replace(/[-–—\s<(\[]*\b(?:bán\s+shope[e]?|bản\s+shope[e]?|shope[e]?)\b[>\])\s]*/gi, '');

  // 3. Inventory / Stock
  n = n.replace(/<\s*hàng\s+tồn\s*>/gi, '');
  n = n.replace(/[-–—\s<(\[]*\b(?:hàng\s+tồn|tồn\s+lâu|tồn\s+dùng|xả\s+tồn)\b[>\])\s]*/gi, '');

  // 4. Defect / Sample / Used
  n = n.replace(/<\s*ko\s+lên\s+nguồn\s*>/gi, '');
  n = n.replace(/[\(\<]\s*(?:hàng\s+)?mẫu\s*[\)\>]/gi, '');
  n = n.replace(/<\s*(?:mẫu|mẫu\s+arca|3\s+mẫu)\s*>/gi, '');
  n = n.replace(/<\s*hàng\s+dùng\s+rồi\s*>/gi, '');
  n = n.replace(/[-–—\s]*\(?\s*hàng\s+LK\s*\)?/gi, '');

  // 5. Customer names
  n = n.replace(/<\s*A,\s*bán\s+cho\s+arcadyan\s*>/gi, '');
  n = n.replace(/<\s*Hàng\s+genbyte\s+hoàn\s+về\s*>/gi, '');

  // 6. Accounting / Tax
  n = n.replace(/<\s*nhập\s+đầu\s+vào\s+ko\s+bán\s+khách\s+lấy\s+hóa\s+đơn\s*>/gi, '');
  n = n.replace(/[-–—\s<(\[]*\b(?:chưa\s+vat|ko\s+vat|không\s+vat|chưa\s+thuế)\b[>\])\s]*/gi, '');

  // 7. Sourcing
  n = n.replace(/<\s*nhập\s+Hương\s*>/gi, '');
  n = n.replace(/[-–—\s<(\[]*\bmua\s+chợ\b[>\])\s]*/gi, '');

  // 8. Grading
  n = n.replace(/<\s*thường\s*-\s*tốt\s*>/gi, '');
  n = n.replace(/<\s*rẻ\s*>/gi, '');
  n = n.replace(/<\s*tốt\s*>/gi, '');
  n = n.replace(/<\s*Tốt,\s*có\s+hộp-tem\s+mác\s*>/gi, '');

  // 9. PO tracking code in angle brackets <001887>
  n = n.replace(/<\s*00\d{4}\s*>/gi, '');

  // Cleanup dangling trailing/leading hyphens and extra spaces
  n = n.replace(/[\s\-–—]+$/, '');
  n = n.replace(/^[\s\-–—]+/, '');
  n = n.replace(/\s+/g, ' ').trim();

  return n || name;
}

/**
 * Permanent Blacklist of Disallowed / Purged SKUs
 * (Executive Order: Purged from Public Catalog 07/10/2026)
 */
export const EXCLUDED_NORM_SKUS = new Set([
  // Batch 1 (Thiết bị hàn, mũi hàn, phụ kiện nhạy cảm)
  'PVN1145', 'PVN1307', 'PVN1605', 'PVN1678', 'PVN1747', 'PVN1787', 'PVN2077', 'PVN2155',
  'PVN2636', 'PVN2721', 'PVN3257', 'PVN4151', 'PVN4684', 'PVN5033', 'PVN5133', 'PVN5202',
  'PVN5561', 'PVN5669', 'PVN5734', 'PVN5741', 'PVN6314', 'PVN6329', 'PVN6485', 'PVN6728',
  'PVN6729', 'PVN6733', 'PVN6734', 'PVN6814', 'PVN7002', 'PVN7237', 'PVN7282', 'PVN7437',
  'PVN7765', 'PVN7926', 'PVN8464', 'PVN8669', 'PVN9671', 'PVN9672', 'PVN9673', 'PVN9674',
  'TPC0524', 'TTPC0316', 'TTPC0317', 'TTPC0395', 'TTPC0397', 'TTPC0524', 'TTPC0547', 'TTPC0684',
  'TTPC1207', 'TTPC1357', 'TTPC1809', 'TTPC2210', 'TTPC2986', 'TTPC3002', 'TTPC3245', 'TTPC3345',
  'TTPC3826', 'TTPC5257', 'TTPC8623', 'TTPC9612',
  // Batch 2 (Dụng cụ bơm keo, robot tự động nhạy cảm)
  'PVN10183', 'PVN10380', 'PVN1156', 'PVN1227', 'PVN1258', 'PVN1260', 'PVN1273', 'PVN1639',
  'PVN1662', 'PVN1880', 'PVN2050', 'PVN2053', 'PVN2088', 'PVN2601', 'PVN2679', 'PVN2781',
  'PVN2894', 'PVN3087', 'PVN3112', 'PVN3198', 'PVN3224', 'PVN3225', 'PVN3247', 'PVN3376',
  'PVN3454', 'PVN3468', 'PVN3520', 'PVN3530', 'PVN3559', 'PVN3619', 'PVN3696', 'PVN3804',
  'PVN3922', 'PVN3941', 'PVN4171', 'PVN4199', 'PVN4204', 'PVN4329', 'PVN4330', 'PVN4353',
  'PVN4354', 'PVN4397', 'PVN4498', 'PVN4503', 'PVN4691', 'PVN4692', 'PVN4715', 'PVN4856',
  'PVN4862', 'PVN4988', 'PVN5068', 'PVN5072', 'PVN5137', 'PVN5322', 'PVN5379', 'PVN5576',
  'PVN5578', 'PVN5609', 'PVN5784', 'PVN5968', 'PVN6208', 'PVN6452', 'PVN6488', 'PVN6530',
  'PVN6531', 'PVN6575', 'PVN6616', 'PVN6714', 'PVN6740', 'PVN6782', 'PVN6805', 'PVN6856',
  'PVN6919', 'PVN6920', 'PVN7023', 'PVN7317', 'PVN7438', 'PVN7439', 'PVN7446', 'PVN7471',
  'PVN7492', 'PVN7601', 'PVN7630', 'PVN7690', 'PVN7802', 'PVN7872', 'PVN7873', 'PVN7898',
  'PVN7899', 'PVN7901', 'PVN7927', 'PVN7930', 'PVN7981', 'PVN8210', 'PVN8278', 'PVN8483',
  'PVN8593', 'PVN8607', 'PVN8608', 'PVN8721', 'PVN8725', 'PVN8893', 'PVN8968',
  'TTPC0176', 'TTPC0179', 'TTPC0180', 'TTPC0182', 'TTPC0210', 'TTPC0212', 'TTPC0213', 'TTPC0214',
  'TTPC0215', 'TTPC0219', 'TTPC0227', 'TTPC0230', 'TTPC2410'
]);

export function isExcludedSku(sku?: string): boolean {
  if (!sku) return false;
  const norm = sku.toUpperCase().replace(/[\s\-_]/g, '');
  return EXCLUDED_NORM_SKUS.has(norm);
}

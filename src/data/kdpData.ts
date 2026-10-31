// CSDL Hệ Thống Cable Entry Configurator KDP (Chuẩn Murrplastik Đức & T&T Vina)
// Dữ liệu bóc tách chính thức từ shop.murrplastik.com/kdp (KDP on Demand & Standard KDP Plates)

export type KdpShape = 'rectangular' | 'rectangular-radius' | 'round';
export type KdpPlateMaterial = 'stainless-v4a' | 'stainless-v2a' | 'aluminum' | 'plastic-pa6' | 'plastic-fda';
export type KdpSealMaterial = 'elastomer' | 'pu-foam';
export type KdpEdgeFinish = 'deburred' | 'faceted' | 'edge_hd';
export type KdpMountingType = 'holes' | 'welded_studs';

export interface KdpStandardPlatePreset {
  id: string;
  mpn: string;
  name: string;
  series: string;
  shape: KdpShape;
  material: KdpPlateMaterial;
  width: number;
  height: number;
  thickness: number;
  cutoutWidth: number;
  cutoutHeight: number;
  ipRating: string;
  maxCables: number;
  cableRangeDesc: string;
  description: string;
  openings: Array<{
    id: string;
    dMin: number;
    dMax: number;
    count: number;
    defaultX: number;
    defaultY: number;
  }>;
}

export interface KdpCableRequirement {
  id: string;
  label: string;
  diameter: number; // Cable outer diameter in mm
  quantity: number;
  isFlat?: boolean;
  flatWidth?: number;
  flatHeight?: number;
  color?: string;
}

export interface KdpPlacedHole {
  id: string;
  cableId?: string;
  d: number;
  r: number;
  x: number;
  y: number;
  isFlat?: boolean;
  flatWidth?: number;
  flatHeight?: number;
  membraneRange: string;
}

// 1. TIÊU CHUẨN ĐƯỜNG KÍNH MÀNG LUỒN CÁP MURRPLASTIK (MEMBRANE SIZING MATRIX)
export const KDP_MEMBRANE_RANGES = [
  { id: 'rng-1.5-3.5', label: '1.5 - 3.5 mm', dMin: 1.5, dMax: 3.5, holeDia: 5, color: '#38bdf8' },
  { id: 'rng-3.0-6.5', label: '3.0 - 6.5 mm', dMin: 3.0, dMax: 6.5, holeDia: 8, color: '#3b82f6' },
  { id: 'rng-5.0-9.2', label: '5.0 - 9.2 mm', dMin: 5.0, dMax: 9.2, holeDia: 11, color: '#6366f1' },
  { id: 'rng-8.0-12.5', label: '8.0 - 12.5 mm', dMin: 8.0, dMax: 12.5, holeDia: 14.5, color: '#8b5cf6' },
  { id: 'rng-11.0-16.0', label: '11.0 - 16.0 mm', dMin: 11.0, dMax: 16.0, holeDia: 18.5, color: '#ec4899' },
  { id: 'rng-15.0-22.0', label: '15.0 - 22.0 mm', dMin: 15.0, dMax: 22.0, holeDia: 25, color: '#f59e0b' },
  { id: 'rng-21.0-32.0', label: '21.0 - 32.0 mm', dMin: 21.0, dMax: 32.0, holeDia: 35, color: '#ef4444' }
];

// 2. CÁC DÒNG TẤM TIÊU CHUẨN CÓ SẴN (STANDARD KDP PRESETS)
export const KDP_STANDARD_PRESETS: KdpStandardPlatePreset[] = [
  {
    id: 'kdp-24-29',
    mpn: '87663024',
    name: 'KDP 24/29 (Chuẩn 24-Pin Harting Cutout)',
    series: 'KDP/N 24',
    shape: 'rectangular',
    material: 'plastic-pa6',
    width: 148,
    height: 58,
    thickness: 14,
    cutoutWidth: 112,
    cutoutHeight: 36,
    ipRating: 'IP65',
    maxCables: 29,
    cableRangeDesc: '29 cáp: 24x 1.5-3.5mm, 4x 3.0-6.5mm, 1x 8.0-12.5mm',
    description: 'Tấm luồn cáp chữ nhật nhựa PA6 cho lỗ khoét 24-chân tiêu chuẩn tủ điện, luồn tối đa 29 dây trong diện tích tối thiểu.',
    openings: [
      { id: 'o1', dMin: 1.5, dMax: 3.5, count: 24, defaultX: 0, defaultY: 0 },
      { id: 'o2', dMin: 3.0, dMax: 6.5, count: 4, defaultX: 0, defaultY: 0 },
      { id: 'o3', dMin: 8.0, dMax: 12.5, count: 1, defaultX: 0, defaultY: 0 }
    ]
  },
  {
    id: 'kdp-24-17',
    mpn: '87663017',
    name: 'KDP 24/17 (Chuẩn 24-Pin Cáp Đa Kích Thước)',
    series: 'KDP/N 24',
    shape: 'rectangular',
    material: 'plastic-pa6',
    width: 148,
    height: 58,
    thickness: 14,
    cutoutWidth: 112,
    cutoutHeight: 36,
    ipRating: 'IP65',
    maxCables: 17,
    cableRangeDesc: '17 cáp: 12x 3.0-6.5mm, 5x 5.0-9.2mm',
    description: 'Phiên bản cân bằng tối ưu giữa mật độ dây tín hiệu và cáp điều khiển động cơ servo cỡ nhỏ.',
    openings: [
      { id: 'o1', dMin: 3.0, dMax: 6.5, count: 12, defaultX: 0, defaultY: 0 },
      { id: 'o2', dMin: 5.0, dMax: 9.2, count: 5, defaultX: 0, defaultY: 0 }
    ]
  },
  {
    id: 'kdp-24-11',
    mpn: '87663011',
    name: 'KDP 24/11 (Cáp Động Lực Lớn)',
    series: 'KDP/N 24',
    shape: 'rectangular',
    material: 'plastic-pa6',
    width: 148,
    height: 58,
    thickness: 14,
    cutoutWidth: 112,
    cutoutHeight: 36,
    ipRating: 'IP65',
    maxCables: 11,
    cableRangeDesc: '11 cáp: 4x 3.0-6.5mm, 4x 5.0-9.2mm, 3x 8.0-12.5mm',
    description: 'Chuyên dụng cho các bó dây động lực, ống dẫn khí nén và cáp nguồn trung bình.',
    openings: [
      { id: 'o1', dMin: 3.0, dMax: 6.5, count: 4, defaultX: 0, defaultY: 0 },
      { id: 'o2', dMin: 5.0, dMax: 9.2, count: 4, defaultX: 0, defaultY: 0 },
      { id: 'o3', dMin: 8.0, dMax: 12.5, count: 3, defaultX: 0, defaultY: 0 }
    ]
  },
  {
    id: 'kdp-x-24-17-inox',
    mpn: '87663117',
    name: 'KDP/X 24/17 Inox V4A (Chuẩn Vệ Sinh IP69K)',
    series: 'KDP/X Inox',
    shape: 'rectangular',
    material: 'stainless-v4a',
    width: 148,
    height: 58,
    thickness: 3,
    cutoutWidth: 112,
    cutoutHeight: 36,
    ipRating: 'IP69K',
    maxCables: 17,
    cableRangeDesc: '17 cáp: Khung thép không gỉ 316L, màng vi sinh FDA',
    description: 'Tấm màng thép không gỉ Inox V4A (1.4571) chống tia nước áp lực cực cao và hóa chất CIP tẩy rửa mạnh.',
    openings: [
      { id: 'o1', dMin: 3.0, dMax: 6.5, count: 12, defaultX: 0, defaultY: 0 },
      { id: 'o2', dMin: 5.0, dMax: 9.2, count: 5, defaultX: 0, defaultY: 0 }
    ]
  },
  {
    id: 'kdp-z-56',
    mpn: '87663056',
    name: 'KDP/Z 24/56 (Mật Độ Cực Cao 56 Dây)',
    series: 'KDP/Z High Density',
    shape: 'rectangular',
    material: 'plastic-pa6',
    width: 148,
    height: 58,
    thickness: 14,
    cutoutWidth: 112,
    cutoutHeight: 36,
    ipRating: 'IP65',
    maxCables: 56,
    cableRangeDesc: '56 cáp: 56x 1.5-3.5mm (Dây cảm biến siêu nhỏ)',
    description: 'Khả năng nén dây tín hiệu tối đa: 56 dây cảm biến sensor trên cùng 1 lỗ khoét tủ điện duy nhất.',
    openings: [
      { id: 'o1', dMin: 1.5, dMax: 3.5, count: 56, defaultX: 0, defaultY: 0 }
    ]
  },
  {
    id: 'kdp-r-m50',
    mpn: '87663250',
    name: 'KDP/R M50/6 (Khung Tròn Ren Metric)',
    series: 'KDP/R Round',
    shape: 'round',
    material: 'plastic-pa6',
    width: 60,
    height: 60,
    thickness: 20,
    cutoutWidth: 50.5,
    cutoutHeight: 50.5,
    ipRating: 'IP65',
    maxCables: 6,
    cableRangeDesc: '6 cáp: 4x 3.0-6.5mm, 2x 5.0-9.2mm',
    description: 'Tấm màng luồn cáp tròn ren ngoài M50x1.5 đi kèm đai ốc siết, khoét lỗ tròn nhanh chóng bằng mũi khoét.',
    openings: [
      { id: 'o1', dMin: 3.0, dMax: 6.5, count: 4, defaultX: 0, defaultY: 0 },
      { id: 'o2', dMin: 5.0, dMax: 9.2, count: 2, defaultX: 0, defaultY: 0 }
    ]
  },
  {
    id: 'kdp-r-m63',
    mpn: '87663263',
    name: 'KDP/R M63/8 (Khung Tròn Ren Metric M63)',
    series: 'KDP/R Round',
    shape: 'round',
    material: 'plastic-pa6',
    width: 74,
    height: 74,
    thickness: 20,
    cutoutWidth: 63.5,
    cutoutHeight: 63.5,
    ipRating: 'IP65',
    maxCables: 8,
    cableRangeDesc: '8 cáp: 4x 3.0-6.5mm, 4x 5.0-9.2mm',
    description: 'Tấm màng tròn chuẩn ren M63x1.5 cho tủ điện công nghiệp và hộp nối phân phối hiện trường.',
    openings: [
      { id: 'o1', dMin: 3.0, dMax: 6.5, count: 4, defaultX: 0, defaultY: 0 },
      { id: 'o2', dMin: 5.0, dMax: 9.2, count: 4, defaultX: 0, defaultY: 0 }
    ]
  }
];

// 3. THÔNG SỐ VẬT LIỆU TẤM (MATERIALS METADATA)
export const KDP_MATERIALS = [
  {
    id: 'stainless-v4a' as KdpPlateMaterial,
    name: 'Thép không gỉ Inox V4A (1.4571 / AISI 316Ti)',
    abbreviation: 'V4A',
    description: 'Chống ăn mòn axit, hóa chất tẩy rửa CIP, kháng muối biển, chuẩn vi sinh thực phẩm & y tế.',
    colorHex: '#94a3b8',
    texture: 'Brushed Stainless'
  },
  {
    id: 'stainless-v2a' as KdpPlateMaterial,
    name: 'Thép không gỉ Inox V2A (1.4301 / AISI 304)',
    abbreviation: 'V2A',
    description: 'Độ bền cơ học cao, chống gỉ sét công nghiệp thông thường, bề mặt xử lý xước mờ thẩm mỹ.',
    colorHex: '#cbd5e1',
    texture: 'Standard Inox'
  },
  {
    id: 'aluminum' as KdpPlateMaterial,
    name: 'Hợp kim nhôm Anode (AlMg3)',
    abbreviation: 'AlMg3',
    description: 'Trọng lượng nhẹ, chống tĩnh điện EMC, tản nhiệt tốt, gia công CNC chính xác tuyệt đối.',
    colorHex: '#e2e8f0',
    texture: 'Anodized Aluminum'
  },
  {
    id: 'plastic-pa6' as KdpPlateMaterial,
    name: 'Nhựa kỹ thuật Polyamide PA6.6 V-0 (Màu Đen)',
    abbreviation: 'PA6.6',
    description: 'Chống cháy chuẩn UL 94 V-0, độ dẻo dai cao, cách điện tuyệt đối, chống lão hóa ozone.',
    colorHex: '#1e293b',
    texture: 'Matte Black PA'
  },
  {
    id: 'plastic-fda' as KdpPlateMaterial,
    name: 'Nhựa Polyamide FDA Thực Phẩm (Màu Trắng)',
    abbreviation: 'PA-FDA',
    description: 'Đạt chuẩn tiếp xúc thực phẩm FDA 21 CFR và quy chuẩn châu Âu EU 10/2011.',
    colorHex: '#f8fafc',
    texture: 'White FDA'
  }
];

// 4. KIỂU BẮT VÍT & BULÔNG HÀN (MOUNTING SPECS)
export const KDP_MOUNTING_OPTIONS = [
  {
    id: 'holes' as KdpMountingType,
    name: 'Lỗ khoét bắt vít xuyên tâm (Through-holes)',
    description: 'Bắt bu lông từ mặt trước hoặc mặt sau với đai ốc, đường kính lỗ thông dụng Ø4.5mm - Ø5.5mm.'
  },
  {
    id: 'welded_studs' as KdpMountingType,
    name: 'Bulông cấy hàn mặt sau (Welded Studs)',
    description: 'Mặt trước phẳng bóng 100% không bám bụi, đạt tiêu chuẩn vệ sinh thực phẩm & y tế (Hygienic Design).'
  }
];

// 5. THUẬT TOÁN TỰ ĐỘNG BỐ TRÍ MA TRẬN LỖ (AUTO-PLACEMENT ALGORITHM)
export function autoPlaceKdpMembranes(
  plateWidth: number,
  plateHeight: number,
  shape: KdpShape,
  cables: KdpCableRequirement[],
  margin: number = 16,
  minSpacing: number = 4
): { placedHoles: KdpPlacedHole[]; packingDensity: number; isExceeded: boolean } {
  const holesToPlace: Array<{ d: number; cableId: string; label: string }> = [];
  
  cables.forEach(c => {
    // Find membrane outer diameter
    const matched = KDP_MEMBRANE_RANGES.find(r => c.diameter >= r.dMin && c.diameter <= r.dMax) 
      || KDP_MEMBRANE_RANGES[KDP_MEMBRANE_RANGES.length - 1];
    for (let i = 0; i < c.quantity; i++) {
      holesToPlace.push({
        d: matched.holeDia,
        cableId: c.id,
        label: matched.label
      });
    }
  });

  // Sort largest to smallest for optimal packing
  holesToPlace.sort((a, b) => b.d - a.d);

  const placed: KdpPlacedHole[] = [];
  let totalHoleArea = 0;

  if (shape === 'round') {
    const R = plateWidth / 2;
    const usableR = R - margin;

    // Concentric rings placement
    let currentRadius = 0;
    let index = 0;

    while (index < holesToPlace.length) {
      if (currentRadius === 0) {
        // Place center hole
        const h = holesToPlace[index];
        placed.push({
          id: `hole-0`,
          cableId: h.cableId,
          d: h.d,
          r: h.d / 2,
          x: R,
          y: R,
          membraneRange: h.label
        });
        totalHoleArea += Math.PI * (h.d / 2) * (h.d / 2);
        currentRadius += (h.d + minSpacing);
        index++;
      } else {
        const h = holesToPlace[index];
        const stepR = h.d / 2;
        const ringR = currentRadius + stepR;
        if (ringR + stepR > usableR) {
          // Cannot fit more rings
          break;
        }
        const perimeter = 2 * Math.PI * ringR;
        const countOnRing = Math.max(1, Math.floor(perimeter / (h.d + minSpacing)));
        const angleStep = (2 * Math.PI) / countOnRing;

        for (let k = 0; k < countOnRing && index < holesToPlace.length; k++) {
          const item = holesToPlace[index];
          const angle = k * angleStep;
          const x = R + ringR * Math.cos(angle);
          const y = R + ringR * Math.sin(angle);
          placed.push({
            id: `hole-${index}`,
            cableId: item.cableId,
            d: item.d,
            r: item.d / 2,
            x: Math.round(x * 10) / 10,
            y: Math.round(y * 10) / 10,
            membraneRange: item.label
          });
          totalHoleArea += Math.PI * (item.d / 2) * (item.d / 2);
          index++;
        }
        currentRadius = ringR + stepR + minSpacing;
      }
    }

    const plateArea = Math.PI * R * R;
    const density = Math.round((totalHoleArea / plateArea) * 100);
    return {
      placedHoles: placed,
      packingDensity: density,
      isExceeded: placed.length < holesToPlace.length
    };
  } else {
    // Rectangular / Rectangular-radius
    const usableW = plateWidth - 2 * margin;
    const usableH = plateHeight - 2 * margin;
    const plateArea = plateWidth * plateHeight;

    if (holesToPlace.length === 0) {
      return { placedHoles: [], packingDensity: 0, isExceeded: false };
    }

    // Grid matrix placement
    const avgDia = holesToPlace.reduce((sum, h) => sum + h.d, 0) / holesToPlace.length;
    const colStep = avgDia + minSpacing;
    const rowStep = avgDia + minSpacing;

    const cols = Math.max(1, Math.floor(usableW / colStep));
    const rows = Math.max(1, Math.floor(usableH / rowStep));

    const actualSpacingX = usableW / cols;
    const actualSpacingY = usableH / rows;

    let index = 0;
    for (let r = 0; r < rows && index < holesToPlace.length; r++) {
      for (let c = 0; c < cols && index < holesToPlace.length; c++) {
        const item = holesToPlace[index];
        const x = margin + c * actualSpacingX + actualSpacingX / 2;
        const y = margin + r * actualSpacingY + actualSpacingY / 2;

        placed.push({
          id: `hole-${index}`,
          cableId: item.cableId,
          d: item.d,
          r: item.d / 2,
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          membraneRange: item.label
        });
        totalHoleArea += Math.PI * (item.d / 2) * (item.d / 2);
        index++;
      }
    }

    const density = Math.round((totalHoleArea / plateArea) * 100);
    return {
      placedHoles: placed,
      packingDensity: density,
      isExceeded: placed.length < holesToPlace.length
    };
  }
}

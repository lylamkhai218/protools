import { Product, Document, Partner, Solution, IndustryApplication, SalesRepInfo } from './types';

// THÔNG TIN DOANH NGHIỆP CHÍNH XÁC 100% TỪ PROTOOLS.COM.VN
export const COMPANY_INFO = {
  name: 'CÔNG TY TNHH CÔNG NGHIỆP T&T VINA',
  fullNameEn: 'T&T VINA INDUSTRIAL CO., LTD',
  shortName: 'T&T VINA',
  brand: 'T&T VINA',
  websiteName: 'Protools.com.vn',
  slogan: 'Chuyên cung cấp các thiết bị công nghiệp, thiết bị phụ trợ cho các nhà máy lắp ráp & sản xuất linh kiện điện tử',
  headquarters: 'Thôn Nhạo Sơn - Xã Thụy Anh - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)',
  headquartersFull: 'Thôn Nhạo Sơn - Xã Thụy Anh - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)',
  vpgdAndWarehouse: 'Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội',
  branchHanoi: 'Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội',
  mapUrlLinhNam: 'https://maps.app.goo.gl/cMn6HEe4KqVGCpPV7',
  mapEmbedLinhNam: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d783.13591034401!2d105.88146848700326!3d20.982886742453424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af26d2bb1e0f%3A0x65f178554a3bb4aa!2zQ8O0bmcgdHkgVE5ISCBDw7RuZyBuZ2hp4buHcCBUJlQgVmluYQ!5e0!3m2!1svi!2s!4v1788060518008!5m2!1svi!2s',
  officeHungYen: 'Thôn Nhạo Sơn - Xã Thụy Anh - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)',
  branch2: 'Thôn Nhạo Sơn - Xã Thụy Anh - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km)',
  hotline: '0915.168.824',
  hotlineRaw: '0915168824',
  hotlines: ['0915.168.824', '0929.938.368', '0365.366.455'],
  salesTeam: [
    { 
      name: 'Ms. Hiền', 
      phone: '0929.938.368', 
      rawPhone: '0929938368', 
      intlPhone: '+84 929938368', 
      role: 'Nhân viên kinh doanh',
      zaloUrl: 'https://zalo.me/0929938368' 
    },
    { 
      name: 'Ms. Phương', 
      phone: '0365.366.455', 
      rawPhone: '0365366455', 
      intlPhone: '+84 365366455', 
      role: 'Nhân viên kinh doanh',
      zaloUrl: 'https://zalo.me/0365366455' 
    }
  ],
  murrSalesTeam: [
    { 
      name: 'Mr. Bình', 
      phone: '0868.822.409', 
      rawPhone: '0868822409', 
      intlPhone: '+84 868822409', 
      role: 'NVKD Murrplastik',
      zaloUrl: 'https://zalo.me/0868822409' 
    },
    { 
      name: 'Mr. Khải', 
      phone: '0968.597.131', 
      rawPhone: '0968597131', 
      intlPhone: '+84 968597131', 
      role: 'NVKD Murrplastik',
      zaloUrl: 'https://zalo.me/0968597131' 
    }
  ],
  projectDept: {
    name: 'Mr. Thanh',
    phone: '0943.301.886',
    rawPhone: '0943301886',
    role: 'Phòng Dự Án',
    zaloUrl: 'https://zalo.me/0943301886'
  },
  techTeam: [],
  email: 'info@t2tvina.com',
  website: 'https://protools.com.vn'
};

/**
 * Phân luồng nhân viên phụ trách tư vấn & báo giá tự động theo Tags Sapo
 * Fallback mặc định: Mrs. Nhung (Hotline: 0915.168.824)
 */
export function getSalesRepForProduct(product?: Partial<Product> | null): SalesRepInfo {
  if (!product) {
    return {
      name: 'Mrs. Nhung (Hotline)',
      phone: COMPANY_INFO.hotline,
      rawPhone: COMPANY_INFO.hotlineRaw,
      role: 'Hotline Tổng Đài & Báo Giá',
      zaloUrl: `https://zalo.me/${COMPANY_INFO.hotlineRaw}`
    };
  }

  // 1. Nếu sản phẩm đã được gán sẵn thông tin salesRep
  if (product.salesRep && product.salesRep.phone) {
    return product.salesRep;
  }

  const tags = (product.tags || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const categorySlug = (product.categorySlug || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();

  // 2. Chuyên ngành Murrplastik (Đức)
  if (brand.includes('murrplastik') || categorySlug === 'murrplastik' || sku.startsWith('mp-')) {
    const murrRep = COMPANY_INFO.murrSalesTeam[0] || {
      name: 'Mr. Bình',
      phone: '0868.822.409',
      rawPhone: '0868822409',
      zaloUrl: 'https://zalo.me/0868822409'
    };
    return {
      name: murrRep.name,
      phone: murrRep.phone,
      rawPhone: murrRep.rawPhone,
      role: 'Kinh doanh Murrplastik',
      zaloUrl: murrRep.zaloUrl
    };
  }

  // 3. Phân luồng theo Tags từ hệ thống Sapo
  if (tags.includes('phương') || tags.includes('phuong')) {
    return {
      name: 'Ms. Phương',
      phone: '0365.366.455',
      rawPhone: '0365366455',
      role: 'Tư vấn Bán hàng & Báo giá',
      zaloUrl: 'https://zalo.me/0365366455'
    };
  }
  if (tags.includes('hiền') || tags.includes('hien')) {
    return {
      name: 'Ms. Hiền',
      phone: '0929.938.368',
      rawPhone: '0929938368',
      role: 'Tư vấn Bán hàng & Báo giá',
      zaloUrl: 'https://zalo.me/0929938368'
    };
  }
  if (tags.includes('nhinh')) {
    return {
      name: 'Ms. Nhinh',
      phone: '0964.920.025',
      rawPhone: '0964920025',
      role: 'Phòng Bán Hàng',
      zaloUrl: 'https://zalo.me/0964920025'
    };
  }
  if (tags.includes('phong')) {
    return {
      name: 'Mr. Phong',
      phone: '0983.794.782',
      rawPhone: '0983794782',
      role: 'Hỗ trợ Kỹ thuật & Dự án',
      zaloUrl: 'https://zalo.me/0983794782'
    };
  }
  if (tags.includes('hai')) {
    return {
      name: 'Mr. Hai',
      phone: '0981.919.590',
      rawPhone: '0981919590',
      role: 'Hỗ trợ Kỹ thuật & Dự án',
      zaloUrl: 'https://zalo.me/0981919590'
    };
  }
  if (tags.includes('thanh')) {
    return {
      name: 'Mr. Thanh',
      phone: COMPANY_INFO.projectDept.phone,
      rawPhone: COMPANY_INFO.projectDept.rawPhone,
      role: 'Phòng Dự Án',
      zaloUrl: COMPANY_INFO.projectDept.zaloUrl
    };
  }

  // 4. Mặc định: Hotline Tổng Đài Mrs. Nhung
  return {
    name: 'Mrs. Nhung (Hotline)',
    phone: COMPANY_INFO.hotline,
    rawPhone: COMPANY_INFO.hotlineRaw,
    role: 'Hotline Tổng Đài & Báo Giá',
    zaloUrl: `https://zalo.me/${COMPANY_INFO.hotlineRaw}`
  };
}

export const PARTNERS: Partner[] = [
  { 
    name: 'Murrplastik', 
    logoText: 'MURRPLASTIK', 
    country: 'CHLB Đức', 
    category: 'Xích dẫn cáp, ống luồn dây & Giá đỡ Robot',
    description: 'Tập đoàn số 1 của Đức về xích dẫn cáp động lực, hệ thống giá đỡ robot FHS và đánh dấu công nghiệp.',
    url: 'https://protools.com.vn/murrplastik',
    brandColor: '#E30613',
    hoverBorderClass: 'hover:border-[#E30613]',
    hoverBgClass: 'hover:bg-red-50/60',
    hoverTextClass: 'group-hover:text-[#E30613]',
    categorySlug: 'murrplastik'
  },
  { 
    name: 'Hakko', 
    logoText: 'HAKKO', 
    country: 'Nhật Bản', 
    category: 'Thiết bị hàn & Kiểm tra chống tĩnh điện',
    description: 'Thương hiệu hàng đầu Nhật Bản về máy hàn thiếc, trạm hàn và máy kiểm tra nhiệt độ hàn.',
    brandColor: '#005BAC',
    hoverBorderClass: 'hover:border-[#005BAC]',
    hoverBgClass: 'hover:bg-blue-50/60',
    hoverTextClass: 'group-hover:text-[#005BAC]',
    categorySlug: 'thiet-bi-han'
  },
  { 
    name: 'HIOS', 
    logoText: 'HIOS', 
    country: 'Nhật Bản', 
    category: 'Máy bắt vít, nguồn cấp & máy đo lực siết',
    description: 'Thương hiệu nổi tiếng về tô vít điện tử, nguồn cấp CLT-50 và máy đo lực siết HP-10.',
    brandColor: '#C8102E',
    hoverBorderClass: 'hover:border-[#C8102E]',
    hoverBgClass: 'hover:bg-rose-50/60',
    hoverTextClass: 'group-hover:text-[#C8102E]',
    categorySlug: 'may-bat-vit-nha-vit'
  },
  { 
    name: 'Quick', 
    logoText: 'QUICK', 
    country: 'Chính Hãng', 
    category: 'Máy hàn & Thiết bị đo nhiệt độ mỏ hàn',
    description: 'Dòng máy hàn cao tần Quick 205 (150W), nhiệt kế đo mỏ hàn Quick 191AD/196 phổ biến trong các nhà máy SMT.',
    brandColor: '#FF6600',
    hoverBorderClass: 'hover:border-[#FF6600]',
    hoverBgClass: 'hover:bg-orange-50/60',
    hoverTextClass: 'group-hover:text-[#FF6600]',
    categorySlug: 'thiet-bi-han'
  },
  { 
    name: 'Loctite (Henkel)', 
    logoText: 'LOCTITE', 
    country: 'Đức / USA', 
    category: 'Keo khóa ren & hóa chất công nghiệp',
    description: 'Keo khóa ren, dán bề mặt kim loại chống rung động chịu nhiệt cho lắp ráp cơ khí.',
    brandColor: '#D32F2F',
    hoverBorderClass: 'hover:border-[#D32F2F]',
    hoverBgClass: 'hover:bg-red-50/60',
    hoverTextClass: 'group-hover:text-[#D32F2F]',
    categorySlug: 'dung-cu-bom-keo'
  },
  { 
    name: 'Samwon', 
    logoText: 'SAMWON', 
    country: 'Hàn Quốc', 
    category: 'Relay & Cầu đấu khối tự động hóa',
    description: 'Cung cấp Relay R4T-16P-S, cầu đấu XTB-20H, XTB-COM40 và cáp C20HH cho tủ điện tự động.',
    brandColor: '#003399',
    hoverBorderClass: 'hover:border-[#003399]',
    hoverBgClass: 'hover:bg-indigo-50/60',
    hoverTextClass: 'group-hover:text-[#003399]',
    categorySlug: 'may-bat-vit-nha-vit'
  },
  { 
    name: 'Ansell', 
    logoText: 'ANSELL', 
    country: 'Úc / USA', 
    category: 'Găng tay nitrile bảo hộ & phòng sạch',
    description: 'Thương hiệu bảo hộ lao động và phòng sạch số 1 thế giới, nổi tiếng với dòng găng tay nitrile TouchNTuff® 92-600 kháng hóa chất.',
    brandColor: '#00843D',
    hoverBorderClass: 'hover:border-[#00843D]',
    hoverBgClass: 'hover:bg-emerald-50/60',
    hoverTextClass: 'group-hover:text-[#00843D]',
    categorySlug: 'dung-cu-chong-tinh-dien'
  }
];

export const SOLUTIONS: Solution[] = [
  {
    id: 'murrplastik',
    title: 'MURRPLASTIK (CHÍNH HÃNG ĐỨC)',
    subtitle: 'Robotics Dresspack & Energy Chains',
    desc: 'Hệ thống xích dẫn cáp EVOCHAIN, khớp bi KEG/ZL, vòng ống SRF, hộp thu hồi R-Tec Box / Liner, giá đỡ robot FHS và máy khắc laser mp-LM 1.',
    iconName: 'Cpu',
    tag: 'Murrplastik Germany',
    badge: 'Made in Germany',
    bgGradient: 'from-blue-50 to-sky-50/40',
    featuredProductsCount: 14,
    standards: ['Đầy đủ chứng từ hàng hóa', 'Chịu uốn mỏi hàng triệu chu kỳ', 'Có bảo hành chính hãng']
  },
  {
    id: 'thiet-bi-han',
    title: 'THIẾT BỊ HÀN & BỂ HÀN THIẾC',
    subtitle: 'Soldering Stations & Robotic Soldering',
    desc: 'Robot hàn tự động 3-6 trục, trạm hàn cao tần Quick 205, máy hàn Hakko 936, bể hàn thiếc CM-508 / CM-808 và phụ kiện mũi hàn.',
    iconName: 'Zap',
    tag: 'Hakko / Quick / CM',
    badge: 'Chính Hãng',
    bgGradient: 'from-blue-50 to-indigo-50/40',
    featuredProductsCount: 16,
    standards: ['Đầy đủ chứng từ hàng hóa', 'Có bảo hành chính hãng', 'Sẵn hàng kho']
  },
  {
    id: 'may-bat-vit-nha-vit',
    title: 'MÁY BẮT VÍT & NHẢ VÍT TỰ ĐỘNG',
    subtitle: 'Electric Screwdrivers & Screw Feeders',
    desc: 'Robot bắt vít tự động 6 trục, máy bắt vít HIOS CL-3000 / CL-4000, nguồn CLT-50, máy nhả vít và máy đo lực siết HP-10.',
    iconName: 'Wrench',
    tag: 'HIOS / Samwon',
    badge: 'Độ chính xác cao',
    bgGradient: 'from-amber-50 to-orange-50/40',
    featuredProductsCount: 12,
    standards: ['Chuẩn lực siết ISO', 'Động cơ siêu bền', 'Hàng sẵn kho']
  },
  {
    id: 'dung-cu-bom-keo',
    title: 'DỤNG CỤ & ROBOT BƠM KEO TỰ ĐỘNG',
    subtitle: 'Dispensing Robots & Glue Accessories',
    desc: 'Robot bơm keo AB tự động, máy bơm keo SP-982, kim chóp nhựa, kim nhựa mũi sắt, xi lanh bơm keo và dây bơm keo.',
    iconName: 'PackageCheck',
    tag: 'SP-982 / Dispenser',
    badge: 'Chính xác từng giọt',
    bgGradient: 'from-emerald-50 to-teal-50/40',
    featuredProductsCount: 14,
    standards: ['Chống nghẽn keo', 'Dung tích đa dạng', 'Giao ngay']
  },
  {
    id: 'may-cat-bang-dinh-tu-dong',
    title: 'MÁY CẮT BĂNG DÍNH & TÁCH TEM NHÃN',
    subtitle: 'Tape Dispensers & Label Strippers',
    desc: 'Máy cắt băng dính tự động Zcut 9, Zcut 2, RT-3700, M1000/M1000S, máy tách tem nhãn decal AL-505LR, FTR-118C, 1150D.',
    iconName: 'Scissors',
    tag: 'Zcut / RT-3700 / AL-505',
    badge: 'Cắt tự động 100%',
    bgGradient: 'from-purple-50 to-pink-50/40',
    featuredProductsCount: 10,
    standards: ['Cảm biến quang tự động', 'Độ dài tùy chỉnh', 'Hàng sẵn']
  },
  {
    id: 'thiet-bi-kiem-tra',
    title: 'THIẾT BỊ ĐO LƯỜNG & KIỂM TRA',
    subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
    desc: 'Máy đo lực siết HP-10, nhiệt kế đầu mỏ hàn Quick 191AD / 196, máy kiểm tra chống tĩnh điện Hakko 498, Hakko FG-101.',
    iconName: 'Activity',
    tag: 'HP-10 / Quick 191AD / Hakko',
    badge: 'Chuẩn QC Nhà Máy',
    bgGradient: 'from-cyan-50 to-sky-50/40',
    featuredProductsCount: 8,
    standards: ['Độ chính xác cao', 'Có kiểm định xuất xưởng']
  },
  {
    id: 'camera-kinh-soi-cong-nghiep',
    title: 'KÍNH HIỂN VI & KÍNH LÚP SOI BẢNG MẠCH',
    subtitle: 'Optical Microscopes & Magnifiers',
    desc: 'Kính hiển vi soi nổi SM-3TPZ-144-HD2 3 mắt kèm camera HDMI Full HD, kính lúp để bàn có đèn LED tròn LT-86A.',
    iconName: 'Eye',
    tag: 'SM-3TPZ / LT-86A',
    badge: 'Độ phóng đại 45X',
    bgGradient: 'from-teal-50 to-emerald-50/40',
    featuredProductsCount: 7,
    standards: ['Thấu kính quang học Nhật', 'Đèn LED 144 bóng']
  },
  {
    id: 'dung-cu-chong-tinh-dien',
    title: 'VẬT TƯ CHỐNG TĨNH ĐIỆN & PHÒNG SẠCH (ESD)',
    subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
    desc: 'Quạt thổi ion khử tĩnh điện SL-001, SL-002, SP-600, bộ nhíp chống tĩnh điện ESD, nhíp SA/ST, dây tiếp đất và vòng đeo tay.',
    iconName: 'ShieldCheck',
    tag: 'Dr. Schneider / ESD Safe',
    badge: 'Tiêu chuẩn ESD',
    bgGradient: 'from-amber-50 to-yellow-50/40',
    featuredProductsCount: 15,
    standards: ['Khử ion < 1.5s', 'Điện trở 10^6 - 10^9 Ω']
  },
  {
    id: 'thiet-bi-dong-goi-tu-dong',
    title: 'THIẾT BỊ ĐÓNG GÓI & DÂY CHUYỀN TỰ ĐỘNG',
    subtitle: 'Carton Sealers & Shrink Packaging',
    desc: 'Máy co màng đóng gói sản phẩm, máy dán mép thùng 4 cạnh, máy bóc tách đóng thùng tự động, dây chuyền đóng gói khép kín.',
    iconName: 'Package',
    tag: 'Packaging Automation',
    badge: 'Năng suất cao',
    bgGradient: 'from-slate-50 to-blue-50/40',
    featuredProductsCount: 6,
    standards: ['Tiết kiệm nhân công', 'Vận hành liên tục']
  },
  {
    id: 'thiet-bi-tu-dong-hoa',
    title: 'THIẾT BỊ TỰ ĐỘNG HÓA & KHÍ NÉN SAMWON',
    subtitle: 'Samwon Relays, Terminal Blocks & Cables',
    desc: 'Relay Samwon R4T-16P-S, cầu đấu khối XTB-20H, XTB-COM40, cáp tín hiệu C20HH-10SL-2 và phụ kiện tủ điện.',
    iconName: 'Cpu',
    tag: 'Samwon Korea',
    badge: 'Made in Korea',
    bgGradient: 'from-indigo-50 to-violet-50/40',
    featuredProductsCount: 8,
    standards: ['100% Chính hãng Hàn Quốc', 'Đạt chuẩn CE/UL']
  }
];

export const INDUSTRIES: IndustryApplication[] = [
  {
    id: 'electronics',
    name: 'Sản xuất Linh kiện Điện tử & SMT',
    enName: 'Electronics & SMT Assembly',
    iconName: 'CircuitBoard',
    desc: 'Thiết bị hàn, máy bắt vít HIOS, quạt ion khử tĩnh điện, kính hiển vi và nhíp gắp ESD cho phòng sạch nhà máy điện tử.',
    typicalTools: ['Máy hàn Hakko 936', 'Máy bắt vít Hios CL-4000', 'Quạt thổi Ion SL-001']
  },
  {
    id: 'robotics',
    name: 'Dây chuyền Tự động hóa & Đóng gói',
    enName: 'Automation & Packaging Lines',
    iconName: 'Cpu',
    desc: 'Robot hàn 6 trục, robot bơm keo, máy đóng dán mép thùng tự động, xích dẫn cáp và giá đỡ Murrplastik.',
    typicalTools: ['Robot hàn tự động 6 trục', 'Xích dẫn cáp Murrplastik', 'Máy đóng thùng tự động']
  },
  {
    id: 'qc_inspection',
    name: 'Phòng Lab QC & Soi Kiểm Kích Thước',
    enName: 'QC Lab & Optical Inspection',
    iconName: 'Eye',
    desc: 'Kính hiển vi soi nổi SM-3TPZ, kính lúp để bàn LT-86A, máy đo nhiệt độ Quick 191AD, máy đo lực HP-10.',
    typicalTools: ['Kính hiển vi SM-3TPZ-144-HD2', 'Kính lúp LT-86A', 'Máy đo lực HP-10']
  },
  {
    id: 'cleanroom',
    name: 'Vật tư Chống Tĩnh Điện & Phòng Sạch (ESD)',
    enName: 'ESD & Cleanroom Supplies',
    iconName: 'ShieldCheck',
    desc: 'Dây tiếp đất, vòng đeo tay/chân chống tĩnh điện, khăn lau phòng sạch, lọ đựng cồn và nhíp gắp chống tĩnh điện.',
    typicalTools: ['Khăn lau phòng sạch', 'Dây tiếp đất chống tĩnh điện', 'Nhíp ESD']
  }
];

export const PRODUCTS: Product[] = [
  {
    "id": "1083",
    "name": "Ball joint KEG/ZL - Hose ring SRF/ZL ( Khớp bi KEG/ZL -...",
    "sku": "MP-1083",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/15/image%20(29).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Ball joint KEG/ZL - Hose ring SRF/ZL ( Khớp bi KEG/ZL -... chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1083",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1082",
    "name": "KMG/F ball bearing - SRF hose ring (Vòng bi KMG/F - Vòng...",
    "sku": "MP-1082",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/15/image%20(23).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "KMG/F ball bearing - SRF hose ring (Vòng bi KMG/F - Vòng... chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1082",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1081",
    "name": "R-Tec Liner (Hệ Thống Thu Hồi Ống Dẫn Robot)",
    "sku": "MP-1081",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "CHLB Đức (Made in Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/15/0-image%20(19).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Ứng dụng kỹ thuật tiêu biểu trong ngành sản xuất và lắp ráp ô tô công nghệ cao: Hệ thống thu hồi và dẫn hướng ống bảo vệ cáp đàn hồi cho Robot 6 trục, hoạt động bền bỉ trên dàn Robot hàn và lắp ráp tự động.",
    "highlights": [
      "Case Study thực tế: Đã lắp đặt và hoạt động ổn định trên dàn Robot hàn ABB tại xưởng Body Shop dây chuyền sản xuất ô tô.",
      "Hệ thống lò xo đàn hồi thu hồi ống mượt mà, triệt tiêu ma sát và chống xoắn gập cáp khi Robot di chuyển đa trục tốc độ cao.",
      "100% Chính hãng Murrplastik CHLB Đức, đầy đủ chứng từ hàng hóa và có bảo hành chính hãng."
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik (CHLB Đức)",
      "Mã sản phẩm (ID)": "1081 (R-Tec Liner)",
      "Ứng dụng Robot": "Robot hàn ABB, KUKA, FANUC, YASKAWA 6 trục",
      "Dự án tiêu biểu": "Xưởng Hàn Thân Xe (Body Shop) - Dây Chuyền Ô Tô",
      "Chức năng": "Thu hồi & chống xoắn gập ống dẫn khí/điện",
      "Độ bền uốn": "Hàng triệu chu kỳ chuyển động liên tục 24/7",
      "Xuất xứ": "CHLB Đức (Made in Germany)",
      "Tình trạng": "Sẵn hàng tại kho Hà Nội & Hưng Yên"
    }
  },
  {
    "id": "1080",
    "name": "R-Tec Box",
    "sku": "MP-1080",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/15/image%20(16).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "R-Tec Box chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1080",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1079",
    "name": "System holder clamp SHS (Kẹp giữ hệ thống SHS)",
    "sku": "MP-1079",
    "brand": "Murrplastik",
    "category": "FHS fasteners (Chốt FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/0-image%20(12).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "System holder clamp SHS (Kẹp giữ hệ thống SHS) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1079",
      "Chuyên mục": "FHS fasteners (Chốt FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1065",
    "name": "Robot bơm keo AB tự động",
    "sku": "TTPC 1409",
    "brand": "T&T Vina Industrial",
    "category": "Robot bơm keo tự động",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/bơm keo 2.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robot bơm keo AB tự động chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1065",
      "Chuyên mục": "Robot bơm keo tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1055",
    "name": "Robot bơm keo tự động",
    "sku": "PVN9523",
    "brand": "T&T Vina Industrial",
    "category": "Robot bơm keo tự động",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/Robot bơm keo tự động.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robot bơm keo tự động chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1055",
      "Chuyên mục": "Robot bơm keo tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1032",
    "name": "Máy bơm keo SP-982",
    "sku": "TTPC-0298",
    "brand": "T&T Vina Industrial",
    "category": "Máy bơm keo",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": `${import.meta.env.BASE_URL}images/products/sp-982-main.png`,
    "images": [
      `${import.meta.env.BASE_URL}images/products/sp-982-main.png`,
      `${import.meta.env.BASE_URL}images/products/sp-982-sub.png`
    ],
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy bơm keo SP-982 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1032",
      "Chuyên mục": "Máy bơm keo",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "983A",
    "name": "Máy bơm keo tự động 983A",
    "sku": "TTPC-0299",
    "brand": "T&T Vina Industrial",
    "category": "Máy bơm keo",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": `${import.meta.env.BASE_URL}images/products/983a-main.png`,
    "images": [
      `${import.meta.env.BASE_URL}images/products/983a-main.png`,
      `${import.meta.env.BASE_URL}images/products/983a-accessories.png`,
      `${import.meta.env.BASE_URL}images/products/983a-panel.png`
    ],
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy bơm keo tự động 983A định lượng kỹ thuật số chính xác đến 0.01 ml, tích hợp 2 chế độ nhả keo tự động và bán tự động đạp chân, có chức năng hút chân không chống nhỏ giọt.",
    "highlights": [
      "Điều khiển chính xác: Trang bị bộ hẹn giờ kỹ thuật số hỗ trợ lập trình thời gian bơm cực kỳ linh hoạt, cho phép định lượng lượng keo tối thiểu chính xác đến 0.01 ml.",
      "Tích hợp hai chế độ hoạt động: Chế độ tự động (nhả keo theo thời gian cài đặt) & Chế độ thủ công / Bán tự động (người vận hành điều khiển chủ động bằng bàn dậm chân).",
      "Hệ thống điều áp chuẩn xác: Tích hợp đồng hồ hiển thị áp suất khí nén và núm điều chỉnh, giúp dễ dàng kiểm soát lực đẩy keo tùy theo độ quánh của chất liệu.",
      "Chức năng hút chân không chống nhỏ giọt: Ngăn hiện tượng rò rỉ hay đọng keo ở đầu kim sau khi ngắt lệnh, đảm bảo vệ sinh sản phẩm và hạn chế lãng phí.",
      "Trang bị chân đế đỡ xilanh tiện lợi: Thiết kế giá treo xilanh chuyên dụng giữ cho ống keo luôn thẳng đứng, gọn gàng và an toàn trên bàn thao tác."
    ],
    "specs": {
      "Model": "983A",
      "Điện áp đầu vào": "AC 220 ~ 240V, 50Hz",
      "Điện áp đầu ra": "24V DC",
      "Chương trình lập trình hẹn giờ": "0.01–1s; 0.1–10s; 0.2–20s; 0.3–30s",
      "Lượng keo tối thiểu": "0.01 ml",
      "Áp suất khí vào (Đầu vào không khí)": "2.5 – 7 bar (35 – 100 psi)",
      "Áp suất khí ra (Đầu ra không khí)": "0.1 – 5.5 bar (1 – 78 psi)",
      "Kích thước (D x R x C)": "23.8 x 15.5 x 6 cm",
      "Trọng lượng": "1673 g (~1.67 kg)",
      "Hãng sản xuất": "T&T Vina Industrial",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho Hà Nội & Hưng Yên"
    }
  },
  {
    "id": "736",
    "name": "Kim nhựa mũi sắt",
    "sku": "TTPC-0161",
    "brand": "T&T Vina Industrial",
    "category": "Kim bơm keo",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/08/04/z717937115673_69b530314931c59f1030aefdb79cac6e.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Kim nhựa mũi sắt chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "736",
      "Chuyên mục": "Kim bơm keo",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "735",
    "name": "Kim chóp nhựa",
    "sku": "TTPC 1009",
    "brand": "T&T Vina Industrial",
    "category": "Kim bơm keo",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/kim chóp nhựa.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Kim chóp nhựa chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "735",
      "Chuyên mục": "Kim bơm keo",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1064",
    "name": "Robot hàn tự động 6 trục",
    "sku": "TTPC-0323",
    "brand": "T&T Vina Industrial",
    "category": "Robot hàn tự động",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/0-robot hàn tự động.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robot hàn tự động 6 trục chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1064",
      "Chuyên mục": "Robot hàn tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1063",
    "name": "Robot hàn tự động 3 trục",
    "sku": "TTPC-0594",
    "brand": "T&T Vina Industrial",
    "category": "Robot hàn tự động",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/z2652052227434_692f44e1de5fa2f52208fd9483984690.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robot hàn tự động 3 trục chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1063",
      "Chuyên mục": "Robot hàn tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1044",
    "name": "Bể hàn thiếc CM-808",
    "sku": "TTPC-0017",
    "brand": "CM Solder",
    "category": "Bể hàn thiếc",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/07/CM-808.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Bể hàn thiếc CM-808 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "CM Solder",
      "Mã sản phẩm (ID)": "1044",
      "Chuyên mục": "Bể hàn thiếc",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1043",
    "name": "Bể hàn thiếc CM-508",
    "sku": "TTPC-0015",
    "brand": "CM Solder",
    "category": "Bể hàn thiếc",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/07/CM508.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Bể hàn thiếc CM-508 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "CM Solder",
      "Mã sản phẩm (ID)": "1043",
      "Chuyên mục": "Bể hàn thiếc",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "QUICK-205",
    "name": "Trạm hàn cao tần QUICK 205 ESD (150W)",
    "sku": "TTPC-0289",
    "brand": "Quick",
    "category": "Thiết bị hàn công nghiệp / Trạm hàn ESD",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": `${import.meta.env.BASE_URL}images/products/quick-205.png`,
    "images": [
      `${import.meta.env.BASE_URL}images/products/quick-205.png`,
      `${import.meta.env.BASE_URL}images/products/quick-205.webp`
    ],
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Trạm hàn cao tần QUICK 205 công suất 150W chuyên dụng cho dây chuyền SMT và sản xuất điện tử công nghiệp. Ứng dụng công nghệ gia nhiệt xoáy cao tần (Eddy Current) bù nhiệt tức thì, dải nhiệt 200°C ~ 600°C, khóa nhiệt bảo vệ mật khẩu và chế độ ngủ Auto Sleep đạt chuẩn ESD Safe.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa: Đầy đủ giấy tờ thủ tục, hóa đơn, cam kết bảo vệ dây chuyền lắp ráp điện tử đạt chuẩn xuất khẩu.",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7: Gia nhiệt cao tần tốc độ cao, khả năng bù nhiệt tức thì khi tiếp xúc mối hàn lớn/mối hàn không chì (Lead-free).",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc: Hỗ trợ kiểm tra điện áp rò/nối đất định kỳ, sẵn linh kiện thay thế (đầu tip, sensor nhiệt).",
      "Kiểm soát nhiệt chuẩn xác & Khóa nhiệt an toàn: Hỗ trợ khóa thông số cài đặt bằng mật khẩu, tránh công nhân tự ý thay đổi dải nhiệt trên dây chuyền.",
      "Chế độ ngủ thông minh (Auto Sleep / Auto Power-off): Tự động hạ nhiệt khi đặt tay hàn vào giá đỡ, kéo dài tuổi thọ đầu mút hàn và tiết kiệm điện năng."
    ],
    "features": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa: Đầy đủ giấy tờ thủ tục, hóa đơn, cam kết bảo vệ dây chuyền lắp ráp điện tử đạt chuẩn xuất khẩu.",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7: Gia nhiệt cao tần tốc độ cao, khả năng bù nhiệt tức thì khi tiếp xúc mối hàn lớn/mối hàn không chì (Lead-free).",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc: Hỗ trợ kiểm tra điện áp rò/nối đất định kỳ, sẵn linh kiện thay thế (đầu tip, sensor nhiệt).",
      "Kiểm soát nhiệt chuẩn xác & Khóa nhiệt an toàn: Hỗ trợ khóa thông số cài đặt bằng mật khẩu, tránh công nhân tự ý thay đổi dải nhiệt trên dây chuyền.",
      "Chế độ ngủ thông minh (Auto Sleep / Auto Power-off): Tự động hạ nhiệt khi đặt tay hàn vào giá đỡ, kéo dài tuổi thọ đầu mút hàn và tiết kiệm điện năng."
    ],
    "includedAccessories": [
      "Thân máy trạm hàn QUICK 205 ESD (150W)",
      "Tay hàn cao tần kèm dây chịu nhiệt khóa xoay 5 chân",
      "Mũi hàn cao tần tiêu chuẩn chính hãng",
      "Giá để tay hàn chống tĩnh điện bằng hợp kim đúc",
      "Miếng bọt biển chịu nhiệt làm sạch đầu mũi hàn (Clean Sponge)",
      "Dây nối đất tiếp địa an toàn chống tĩnh điện",
      "Sách hướng dẫn vận hành & Chứng từ chứng nhận chính hãng"
    ],
    "specs": {
      "Hãng sản xuất": "QUICK (Phân phối chính hãng)",
      "Mã sản phẩm (ID)": "QUICK 205",
      "Chuyên mục": "Thiết bị hàn công nghiệp / Trạm hàn ESD",
      "Công suất định mức": "150W",
      "Công nghệ gia nhiệt": "Gia nhiệt cao tần (High-Frequency Eddy Current Heating)",
      "Dải nhiệt độ cài đặt": "200°C ~ 600°C",
      "Độ ổn định nhiệt độ": "±2°C (ở trạng thái không tải)",
      "Điện áp hoạt động": "220V AC / 50Hz",
      "Điện trở nối đất đầu mỏ hàn": "< 2Ω",
      "Điện áp rò đầu mỏ hàn": "< 2mV",
      "Tiêu chuẩn chống tĩnh điện": "ESD Safe (Bảo vệ an toàn linh kiện nhạy cảm)",
      "Xuất xứ": "Chính hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1039",
    "name": "Máy hàn Hakko 936",
    "sku": "TTPC-0320",
    "brand": "Hakko",
    "category": "Máy hàn Hakko",
    "categorySlug": "thiet-bi-han",
    "origin": "Nhật Bản (Japan)",
    "image": "https://protools.com.vn/images/stores/2019/10/07/0-hakko 936.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy hàn Hakko 936 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Hakko",
      "Mã sản phẩm (ID)": "1039",
      "Chuyên mục": "Máy hàn Hakko",
      "Xuất xứ": "Nhật Bản (Japan)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "811",
    "name": "Kính lúp LT-86A",
    "sku": "TTPC-0532",
    "brand": "T&T Vina Industrial",
    "category": "Kính lúp",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/08/04/z722302975774_e086e5e1885861ad3b9b846928c749e9.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Kính lúp LT-86A chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "811",
      "Chuyên mục": "Kính lúp",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "947",
    "name": "Camera VGA",
    "sku": "PVN9934",
    "brand": "T&T Vina Industrial",
    "category": "Camera",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/11/25/Electron-Th-K-nh-Zoom-Video-Microscope-Magnifier-FKE-208A-CCD-h-th-ng-camera-v.jpg_640x640.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Camera VGA chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "947",
      "Chuyên mục": "Camera",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "999",
    "name": "Kính hiển vi SM-3TPZ-144-HD2",
    "sku": "PVN7764",
    "brand": "T&T Vina Industrial",
    "category": "Kính hiển vi",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/14/0-stereo-microscope-sm-3t-144-hd2 (1).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Kính hiển vi SM-3TPZ-144-HD2 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "999",
      "Chuyên mục": "Kính hiển vi",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "998",
    "name": "Kính hiển vi SM-3TZZ-144-B",
    "sku": "PVN8625",
    "brand": "T&T Vina Industrial",
    "category": "Kính hiển vi",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/14/0-zoom-stereo-microscope-boom-sm-3tb-144.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Kính hiển vi SM-3TZZ-144-B chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "998",
      "Chuyên mục": "Kính hiển vi",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "997",
    "name": "Kính hiển vi",
    "sku": "TTV-T&T-997",
    "brand": "T&T Vina Industrial",
    "category": "Kính hiển vi",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/14/microscope-sm-1ts-6w-m-6_4_2_1_2.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Kính hiển vi chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "997",
      "Chuyên mục": "Kính hiển vi",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1067",
    "name": "Máy co màng đóng gói sản phẩm",
    "sku": "PVN7215",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/z2791846877797_6ca4bf6f39de57ff850c17f613e17669.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy co màng đóng gói sản phẩm chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1067",
      "Chuyên mục": "Thiết bị đóng gói tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1062",
    "name": "Máy đóng dán mép thùng 4 cạnh ngang",
    "sku": "PVN1552",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/0-máy đóng thùng 4 cạnh.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy đóng dán mép thùng 4 cạnh ngang chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1062",
      "Chuyên mục": "Thiết bị đóng gói tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1061",
    "name": "Máy đóng dán mép thùng cạnh dọc",
    "sku": "PVN8398",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/0-z2791733746366_54ed3ee9a9c3209eda6abd42966d4499.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy đóng dán mép thùng cạnh dọc chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1061",
      "Chuyên mục": "Thiết bị đóng gói tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1060",
    "name": "Máy bóc tách đóng thùng tự động",
    "sku": "TTPC 3837",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/2-Máy đóng thùng tự động.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy bóc tách đóng thùng tự động chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1060",
      "Chuyên mục": "Thiết bị đóng gói tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1059",
    "name": "Dây truyền đóng gói khép kín",
    "sku": "PVN6174",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/2-Dây truyền đóng gói khép kín.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Dây truyền đóng gói khép kín chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1059",
      "Chuyên mục": "Thiết bị đóng gói tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "801",
    "name": "Hakko 498",
    "sku": "HK-801",
    "brand": "Hakko",
    "category": "Máy kiểm tra chống tĩnh điện",
    "categorySlug": "thiet-bi-han",
    "origin": "Nhật Bản (Japan)",
    "image": "https://protools.com.vn/images/stores/2017/09/22/hakko-498.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Hakko 498 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Hakko",
      "Mã sản phẩm (ID)": "801",
      "Chuyên mục": "Máy kiểm tra chống tĩnh điện",
      "Xuất xứ": "Nhật Bản (Japan)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "804",
    "name": "Hakko FG101",
    "sku": "TTPC-0308",
    "brand": "Hakko",
    "category": "Máy kiểm tra nhiệt độ hàn",
    "categorySlug": "thiet-bi-han",
    "origin": "Nhật Bản (Japan)",
    "image": "https://protools.com.vn/images/stores/2019/10/05/Hakko FG101.png",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Hakko FG101 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Hakko",
      "Mã sản phẩm (ID)": "804",
      "Chuyên mục": "Máy kiểm tra nhiệt độ hàn",
      "Xuất xứ": "Nhật Bản (Japan)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "996",
    "name": "Máy đo lực HP-10",
    "sku": "TTPC-0314",
    "brand": "T&T Vina Industrial",
    "category": "Máy đo lực",
    "categorySlug": "thiet-bi-kiem-tra",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/HP-10.png",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy đo lực HP-10 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "996",
      "Chuyên mục": "Máy đo lực",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1031",
    "name": "Máy đo nhiệt độ Quick 191AD",
    "sku": "PVN7871",
    "brand": "Quick",
    "category": "Máy kiểm tra nhiệt độ hàn",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/27/Quick191ad-Large.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy đo nhiệt độ Quick 191AD chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Quick",
      "Mã sản phẩm (ID)": "1031",
      "Chuyên mục": "Máy kiểm tra nhiệt độ hàn",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1030",
    "name": "Máy đo nhiệt độ Quick 196",
    "sku": "TTV-QUI-1030",
    "brand": "Quick",
    "category": "Máy kiểm tra nhiệt độ hàn",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/27/HTB1wMR0KXXXXXXoXpXXq6xXFXXXA.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy đo nhiệt độ Quick 196 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Quick",
      "Mã sản phẩm (ID)": "1030",
      "Chuyên mục": "Máy kiểm tra nhiệt độ hàn",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1073",
    "name": "EVOCHAIN® MAX MP 420 (42mm)",
    "sku": "MP-1073",
    "brand": "Murrplastik",
    "category": "Energy chains",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/13/1-image%20(3).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "EVOCHAIN® MAX MP 420 (42mm) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1073",
      "Chuyên mục": "Energy chains",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1072",
    "name": "EVOCHAIN® MAX MP 800 (80mm)",
    "sku": "MP-1072",
    "brand": "Murrplastik",
    "category": "Energy chains",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/image%20(2)%20(1).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "EVOCHAIN® MAX MP 800 (80mm) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1072",
      "Chuyên mục": "Energy chains",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1071",
    "name": "EVOCHAIN® MAX MP 560 (56mm)",
    "sku": "MP-1071",
    "brand": "Murrplastik",
    "category": "Energy chains",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/image%20(1)%20(2).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "EVOCHAIN® MAX MP 560 (56mm) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1071",
      "Chuyên mục": "Energy chains",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1037",
    "name": "Máy cắt băng dính RT-3700",
    "sku": "PVN5066",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/RT3700.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy cắt băng dính RT-3700 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Zcut Automation",
      "Mã sản phẩm (ID)": "1037",
      "Chuyên mục": "Máy cắt băng dính tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1036",
    "name": "Máy cắt băng dính Zcut 9",
    "sku": "PVN1956",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/Zcut 9.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy cắt băng dính Zcut 9 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Zcut Automation",
      "Mã sản phẩm (ID)": "1036",
      "Chuyên mục": "Máy cắt băng dính tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1035",
    "name": "Máy cắt băng dính Zcut 2",
    "sku": "TTPC-0310",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/Zcut 2.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy cắt băng dính Zcut 2 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Zcut Automation",
      "Mã sản phẩm (ID)": "1035",
      "Chuyên mục": "Máy cắt băng dính tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1034",
    "name": "Máy cắt băng dính M1000S",
    "sku": "TTPC-0303",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/M1000S.png",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy cắt băng dính M1000S chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Zcut Automation",
      "Mã sản phẩm (ID)": "1034",
      "Chuyên mục": "Máy cắt băng dính tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1033",
    "name": "Máy cắt băng dính M1000",
    "sku": "TTPC-0302",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/05/M1000.png",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy cắt băng dính M1000 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Zcut Automation",
      "Mã sản phẩm (ID)": "1033",
      "Chuyên mục": "Máy cắt băng dính tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1066",
    "name": "Robot bắt vít tự động 6 trục",
    "sku": "TTPC-07030",
    "brand": "T&T Vina Industrial",
    "category": "Robot bắt vít tự động",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/z2652052179913_debbf040c69e55470229265dade811da.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robot bắt vít tự động 6 trục chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1066",
      "Chuyên mục": "Robot bắt vít tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1053",
    "name": "Robot bắt vít tự động",
    "sku": "PVN6627",
    "brand": "T&T Vina Industrial",
    "category": "Robot bắt vít tự động",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2021/09/25/robot bắt vít.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robot bắt vít tự động chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1053",
      "Chuyên mục": "Robot bắt vít tự động",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1042",
    "name": "Nguồn máy bắt vít Hios CLT-50",
    "sku": "TTPC-0422",
    "brand": "HIOS",
    "category": "Máy bắt vít",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Nhật Bản (Japan)",
    "image": "https://protools.com.vn/images/stores/2019/10/07/CLT-50.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Nguồn máy bắt vít Hios CLT-50 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "HIOS",
      "Mã sản phẩm (ID)": "1042",
      "Chuyên mục": "Máy bắt vít",
      "Xuất xứ": "Nhật Bản (Japan)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1041",
    "name": "Máy bắt vít Hios CL-4000",
    "sku": "PVN5224",
    "brand": "HIOS",
    "category": "Máy bắt vít",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Nhật Bản (Japan)",
    "image": "https://protools.com.vn/images/stores/2019/10/07/0-CL-4000.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy bắt vít Hios CL-4000 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "HIOS",
      "Mã sản phẩm (ID)": "1041",
      "Chuyên mục": "Máy bắt vít",
      "Xuất xứ": "Nhật Bản (Japan)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1040",
    "name": "Máy bắt vít Hios CL-3000",
    "sku": "TTPC-0424",
    "brand": "HIOS",
    "category": "Máy bắt vít",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Nhật Bản (Japan)",
    "image": "https://protools.com.vn/images/stores/2019/10/07/0-CL-3000.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy bắt vít Hios CL-3000 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "HIOS",
      "Mã sản phẩm (ID)": "1040",
      "Chuyên mục": "Máy bắt vít",
      "Xuất xứ": "Nhật Bản (Japan)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "974",
    "name": "Nhíp SA Series",
    "sku": "TTPC-0446",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp SA Series",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/nhíp.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Nhíp SA Series chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "974",
      "Chuyên mục": "Nhíp SA Series",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "973",
    "name": "Nhíp Aaa Series",
    "sku": "PVN9736",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp gắp sản phẩm",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/08/18/TB29TGIXA7myKJjSZFgXXcT9XXa_!!2864331523.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Nhíp Aaa Series chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "973",
      "Chuyên mục": "Nhíp gắp sản phẩm",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "928",
    "name": "Nhíp ST Series",
    "sku": "TTPC-0447",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp ST Series",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/nhíp ST.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Nhíp ST Series chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "928",
      "Chuyên mục": "Nhíp ST Series",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "927",
    "name": "Nhíp ESD",
    "sku": "TTPC-0435",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp ESD",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/nhip ESD.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Nhíp ESD chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "927",
      "Chuyên mục": "Nhíp ESD",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "926",
    "name": "Nhíp nhựa 93302-93308",
    "sku": "TTPC-0456",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp nhựa",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/0-nhíp nhựa.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Nhíp nhựa 93302-93308 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "926",
      "Chuyên mục": "Nhíp nhựa",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1048",
    "name": "Quạt thổi Ion SL-001",
    "sku": "PVN1561",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/SL-001.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Quạt thổi Ion SL-001 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Dr. Schneider",
      "Mã sản phẩm (ID)": "1048",
      "Chuyên mục": "Quạt thổi ion",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "938",
    "name": "Quạt thổi Ion  SL-002",
    "sku": "PVN10448",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/SL-002.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Quạt thổi Ion  SL-002 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Dr. Schneider",
      "Mã sản phẩm (ID)": "938",
      "Chuyên mục": "Quạt thổi ion",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "936",
    "name": "Quạt thổi Ion SBL_30w",
    "sku": "TTV-DR.-936",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2016/12/07/SBL_30w_(1).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Quạt thổi Ion SBL_30w chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Dr. Schneider",
      "Mã sản phẩm (ID)": "936",
      "Chuyên mục": "Quạt thổi ion",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "935",
    "name": "Quạt thổi Ion BK 5600",
    "sku": "TTV-DR.-935",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/08/17/1595565004_28393935.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Quạt thổi Ion BK 5600 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Dr. Schneider",
      "Mã sản phẩm (ID)": "935",
      "Chuyên mục": "Quạt thổi ion",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "934",
    "name": "Quạt thổi Ion SP-600",
    "sku": "TTPC 22354",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/09/SP-600.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Quạt thổi Ion SP-600 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Dr. Schneider",
      "Mã sản phẩm (ID)": "934",
      "Chuyên mục": "Quạt thổi ion",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1047",
    "name": "Máy tách tem nhãn AL- 505 LR",
    "sku": "TTV-T&T-1047",
    "brand": "T&T Vina Industrial",
    "category": "Máy tách tem nhãn",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/07/AL-505LR.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy tách tem nhãn AL- 505 LR chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1047",
      "Chuyên mục": "Máy tách tem nhãn",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1046",
    "name": "Máy tách tem nhãn FTR-118C",
    "sku": "TTV-T&T-1046",
    "brand": "T&T Vina Industrial",
    "category": "Máy tách tem nhãn",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/07/FTR-118C.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy tách tem nhãn FTR-118C chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1046",
      "Chuyên mục": "Máy tách tem nhãn",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1045",
    "name": "Máy tách tem nhãn 1150D",
    "sku": "TTPC 0107",
    "brand": "T&T Vina Industrial",
    "category": "Máy tách tem nhãn",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/07/1150D.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Máy tách tem nhãn 1150D chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1045",
      "Chuyên mục": "Máy tách tem nhãn",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1023",
    "name": "Dây tiếp đất chống tĩnh điện",
    "sku": "TTPC-0658",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/12/dây tiếp đất.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Dây tiếp đất chống tĩnh điện chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1023",
      "Chuyên mục": "Dung cụ chống tĩnh điện",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "943",
    "name": "Dây chống tĩnh điện",
    "sku": "TTPC 2354",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2016/11/05/Day tiep dat.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Dây chống tĩnh điện chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "943",
      "Chuyên mục": "Dung cụ chống tĩnh điện",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "897",
    "name": "Vòng đeo chân chống tĩnh điện",
    "sku": "TTPC-0512",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2019/10/12/vòng đeo chân.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Vòng đeo chân chống tĩnh điện chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "897",
      "Chuyên mục": "Dung cụ chống tĩnh điện",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "942",
    "name": "Ổ cắm tiếp đất",
    "sku": "TTPC-0470",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2016/12/07/dây tiếp đất ổ cắm.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Ổ cắm tiếp đất chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "942",
      "Chuyên mục": "Dung cụ chống tĩnh điện",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "895",
    "name": "Vòng đeo tay chống tĩnh điện",
    "sku": "TTPC-0513",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/08/04/z722310551625_45d31378a84e02d4ccebea998ad6a5f1.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Vòng đeo tay chống tĩnh điện chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "895",
      "Chuyên mục": "Dung cụ chống tĩnh điện",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1052",
    "name": "RELAY SAMWON R4T-16P-S",
    "sku": "PVN10052",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "https://protools.com.vn/images/stores/2019/10/12/0-R4T-16P-S.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "RELAY SAMWON R4T-16P-S chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Samwon",
      "Mã sản phẩm (ID)": "1052",
      "Chuyên mục": "Thiết bị tự động hóa",
      "Xuất xứ": "Hàn Quốc (Korea)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1051",
    "name": "Cầu đấu XTB-20H",
    "sku": "PVN6277",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "https://protools.com.vn/images/stores/2019/10/12/0-XTB-20H.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Cầu đấu XTB-20H chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Samwon",
      "Mã sản phẩm (ID)": "1051",
      "Chuyên mục": "Thiết bị tự động hóa",
      "Xuất xứ": "Hàn Quốc (Korea)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1050",
    "name": "Dây cable C20HH-10SL-2",
    "sku": "PVN6834",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "https://protools.com.vn/images/stores/2019/10/12/0-C20HH-10SL-2.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Dây cable C20HH-10SL-2 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Samwon",
      "Mã sản phẩm (ID)": "1050",
      "Chuyên mục": "Thiết bị tự động hóa",
      "Xuất xứ": "Hàn Quốc (Korea)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1049",
    "name": "CẦU ĐẤU XTB-COM40",
    "sku": "PVN5440",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "https://protools.com.vn/images/stores/2019/10/09/XTB.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "CẦU ĐẤU XTB-COM40 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Samwon",
      "Mã sản phẩm (ID)": "1049",
      "Chuyên mục": "Thiết bị tự động hóa",
      "Xuất xứ": "Hàn Quốc (Korea)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1068",
    "name": "Dây chun, dây thun",
    "sku": "PVN4637",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2023/11/16/Dây chun.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Dây chun, dây thun chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1068",
      "Chuyên mục": "Thiết bị phụ trợ khác",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1027",
    "name": "Ống hút mùi - hút khói",
    "sku": "PVN6631",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/25/TB136oyKVXXXXaJXXXXXXXXXXXX_!!0-item_pic.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Ống hút mùi - hút khói chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1027",
      "Chuyên mục": "Thiết bị phụ trợ khác",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1024",
    "name": "Khăn lau phòng sạch",
    "sku": "PVN8044",
    "brand": "T&T Vina Industrial",
    "category": "Vật tư Chống Tĩnh Điện & Phòng Sạch (ESD)",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": `${import.meta.env.BASE_URL}images/products/sapo/PVN8044.webp`,
    "images": [
      `${import.meta.env.BASE_URL}images/products/sapo/PVN8044.webp`
    ],
    "stock": 500,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "unit": "Túi",
    "shortDesc": "Khăn lau phòng sạch chuyên dụng chuẩn Class 10 – Class 1000 cho nhà máy lắp ráp SMT, quang học và vi mạch điện tử. Tùy chọn 2 dòng chất liệu cao cấp: Microfiber siêu mịn chống xước và 100% Polyester dệt kép bền dai.",
    "highlights": [
      "Đạt tiêu chuẩn phòng sạch Cleanroom Class 10 – Class 1000 (ISO Class 4 – 6)",
      "Cắt viền công nghệ Laser nhiệt & Siêu âm ngăn ngừa tối đa phát sinh tưa xơ sợi",
      "Độ phát sinh hạt bụi và hàm lượng ion cực thấp, kháng cồn IPA và dung môi mạnh",
      "Đóng gói 2 lớp túi hút chân không phòng sạch, sẵn hàng số lượng lớn tại kho Hà Nội & Hưng Yên"
    ],
    "variantLabel": "Phân loại chất liệu",
    "variants": [
      {
        "id": "microfiber",
        "name": "Loại Microfiber",
        "sku": "PVN8044-MF",
        "badge": "Sợi siêu mịn - Chống xước",
        "shortDesc": "Khăn lau phòng sạch Microfiber cấu tạo sợi siêu mịn (80% Polyester + 20% Polyamide), hấp thụ nước và cồn IPA gấp 5 lần trọng lượng khăn, chuyên lau bề mặt nhạy cảm, màn hình LCD/OLED, chip bán dẫn và thấu kính quang học không để lại vết xước.",
        "specs": {
          "Hãng sản xuất": "T&T Vina Industrial",
          "Mã SKU": "PVN8044-MF",
          "Phân loại chất liệu": "Microfiber (80% Polyester + 20% Polyamide / Nylon)",
          "Cấu trúc sợi": "Sợi siêu mảnh dạng nêm bẫy bụi vi mô & dầu mỡ",
          "Cấp độ phòng sạch": "Class 10 – Class 1000 (ISO Class 4 – 6)",
          "Kỹ thuật cắt mép": "Cắt Laser / Siêu âm (Ultrasonic Sealed Edge)",
          "Kích thước tiêu chuẩn": "9\" x 9\" (22.5cm x 22.5cm)",
          "Khả năng hấp thụ chất lỏng": "> 450 ml/m² (Hấp thụ nước & cồn IPA gấp 5 lần trọng lượng)",
          "Độ giải phóng hạt bụi": "Cực thấp (LPC ≤ 600 counts/m² đối với hạt ≥ 0.5µm)",
          "Độ bền dung môi": "Không phản ứng với cồn IPA, Ethanol, Acetone",
          "Quy cách đóng gói": "100 tờ/túi (Đóng gói 2 lớp hút chân không Cleanroom)",
          "Ứng dụng khuyên dùng": "Lau màn hình cảm ứng, thấu kính camera, chip bán dẫn, cảm biến quang học",
          "Tình trạng kho": "Sẵn hàng tại Kho Hà Nội & Hưng Yên"
        },
        "highlights": [
          "Sợi Microfiber siêu mềm mịn, hoàn toàn không gây trầy xước bề mặt kính & quang học",
          "Hấp thụ dầu mỡ và dung môi IPA cực nhanh, gom giữ hạt bụi vi mô vào khe sợi",
          "Viền hàn siêu âm 4 cạnh ngăn chặn tuyệt đối tình trạng rơi rụng xơ sợi",
          "Phù hợp cho phòng sạch Class 10 - Class 1000 nhà máy SMT và sản xuất màn hình điện tử"
        ]
      },
      {
        "id": "polyester",
        "name": "Loại Polyester",
        "sku": "PVN8044-PE",
        "badge": "100% Sợi dệt kép - Bền dai",
        "shortDesc": "Khăn lau phòng sạch 100% Polyester dệt kép liên tục (Double knit continuous filament), độ dai cơ học cao, chống mài mòn, chịu hóa chất mạnh, chuyên vệ sinh khuôn in thiếc SMT, bàn thao tác và dây chuyền lắp ráp.",
        "specs": {
          "Hãng sản xuất": "T&T Vina Industrial",
          "Mã SKU": "PVN8044-PE",
          "Phân loại chất liệu": "100% Continuous Filament Polyester",
          "Cấu trúc dệt": "Dệt kim sợi kép liên tục (Double Knit Interlock)",
          "Cấp độ phòng sạch": "Class 100 – Class 1000 (ISO Class 5 – 6)",
          "Kỹ thuật cắt mép": "Cắt nhiệt Laser 4 cạnh (Laser Sealed Border)",
          "Kích thước tiêu chuẩn": "9\" x 9\" (22.5cm x 22.5cm)",
          "Trọng lượng định lượng": "110 – 140 g/m²",
          "Khả năng chịu lực kéo": "Độ dai cơ học cao, chịu ma sát mạnh không xơ rách",
          "Độ bền hóa chất": "Chịu cồn công nghiệp, IPA, MEK, Acetone, dầu máy",
          "Độ giải phóng hạt bụi": "Mức độ cực thấp, không chứa silicon và tạp chất ion",
          "Quy cách đóng gói": "150 tờ/túi (Đóng gói 2 lớp phòng sạch tiệt trùng)",
          "Ứng dụng khuyên dùng": "Lau khuôn in Stencil SMT, gạt kem hàn, vệ sinh máy móc & bàn thao tác",
          "Tình trạng kho": "Sẵn hàng tại Kho Hà Nội & Hưng Yên"
        },
        "highlights": [
          "100% Sợi Polyester dệt kép liên tục, độ bền cơ học cao, không bị xơ rách khi cọ sát mạnh",
          "Cắt nhiệt Laser phong kín 4 viền giúp mép khăn không bị tưa khi lau chùi",
          "Kháng dung môi công nghiệp và hóa chất tẩy rửa bản mạch chuyên dụng",
          "Lựa chọn kinh tế tối ưu cho dây chuyền SMT, gạt thiếc hàn và vệ sinh thiết bị phòng sạch"
        ]
      }
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã SKU": "PVN8044",
      "Phân loại chất liệu": "Tùy chọn: Microfiber (80/20) hoặc 100% Polyester",
      "Cấp độ phòng sạch": "Class 10 – Class 1000 (ISO Class 4 – 6)",
      "Kích thước tiêu chuẩn": "9\" x 9\" (22.5cm x 22.5cm)",
      "Kỹ thuật xử lý viền": "Cắt viền Laser nhiệt & Cắt siêu âm (Ultrasonic seal)",
      "Đóng gói": "Túi hút chân không 2 lớp (100 - 150 tờ/túi)",
      "Tình trạng kho": "Sẵn hàng tại Kho Hà Nội & Hưng Yên"
    }
  },
  {
    "id": "92-600",
    "name": "Găng tay nitrile xanh Ansell TouchNTuff® 92-600",
    "sku": "92-600",
    "brand": "Ansell",
    "category": "Vật tư Chống Tĩnh Điện & Phòng Sạch (ESD)",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng Ansell (Thái Lan / Malaysia)",
    "image": `${import.meta.env.BASE_URL}images/products/touchntuff-92-600.webp`,
    "images": [
      `${import.meta.env.BASE_URL}images/products/touchntuff-92-600.webp`,
      `${import.meta.env.BASE_URL}images/products/touchntuff-92-600.png`
    ],
    "stock": 1000,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "unit": "Hộp (100 chiếc)",
    "shortDesc": "Găng tay bảo hộ nitrile dùng một lần hàng đầu thế giới Ansell TouchNTuff® 92-600. Công nghệ độc quyền TNT™ kháng văng bắn hóa chất nguy hiểm, 100% Nitrile không bột, chống tĩnh điện ESD, độ bền chống đâm thủng vượt trội gấp 4 lần so với găng cao su tự nhiên.",
    "highlights": [
      "Công nghệ độc quyền Ansell TNT™ Chemical Splash Resistance bảo vệ chống văng bắn nhiều loại hóa chất",
      "Chất liệu 100% Nitrile cao cấp, không bột (Powder-Free), không silicon, chống dị ứng da Latex-Free",
      "Độ bền chống đâm thủng vượt trội gấp 4 lần găng cao su tự nhiên và gấp 3 lần găng neoprene",
      "Đầu ngón tay tạo nhám (Textured fingers) bám dính chắc chắn khi thao tác linh kiện và dung môi trơn ướt",
      "Đạt chuẩn quốc tế EN ISO 374-1 Type B (JKPT), EN ISO 374-5 (Virus), EN 1149 (Antistatic), FDA 21 CFR 177.2600"
    ],
    "variantLabel": "Kích cỡ găng tay (Size)",
    "variants": [
      {
        "id": "size-s",
        "name": "Size S (6.5 – 7.0)",
        "sku": "92-600-S",
        "badge": "Chiều dài 240mm - Dày 0.12mm"
      },
      {
        "id": "size-m",
        "name": "Size M (7.5 – 8.0)",
        "sku": "92-600-M",
        "badge": "Kích cỡ thông dụng nhất"
      },
      {
        "id": "size-l",
        "name": "Size L (8.5 – 9.0)",
        "sku": "92-600-L",
        "badge": "Chiều dài 240mm - Dày 0.12mm"
      },
      {
        "id": "size-xl",
        "name": "Size XL (9.5 – 10.0)",
        "sku": "92-600-XL",
        "badge": "Chiều dài 240mm - Dày 0.12mm"
      }
    ],
    "specs": {
      "Hãng sản xuất": "Ansell (Thương hiệu bảo hộ lao động số 1 thế giới)",
      "Model / Dòng sản phẩm": "TouchNTuff® 92-600",
      "Mã SKU": "92-600",
      "Chất liệu": "100% Nitrile cao cấp (Không chứa protein cao su tự nhiên - Latex Free)",
      "Màu sắc": "Xanh lục đặc trưng (Green)",
      "Bề mặt tiếp xúc": "Nhám đầu ngón tay (Textured Fingers)",
      "Độ dày lòng bàn tay": "0.12 mm (5.0 mil)",
      "Độ dày ngón tay": "0.14 mm (5.5 mil)",
      "Chiều dài găng": "240 mm (9.5 inch)",
      "Kiểu cổ tay": "Se viền tròn (Beaded cuff)",
      "Đặc tính bột": "Không bột (Powder-Free), không silicone",
      "Tiêu chuẩn chống hóa chất": "EN ISO 374-1:2016 Type B (JKPT)",
      "Tiêu chuẩn chống vi sinh vật": "EN ISO 374-5:2016 (Bảo vệ chống Virus / Vi khuẩn)",
      "Tiêu chuẩn chống tĩnh điện": "EN 1149-1/2/3 (Antistatic ESD Safe)",
      "Tiêu chuẩn tiếp xúc thực phẩm": "FDA 21 CFR 177.2600 & European Food Contact",
      "Chỉ số chất lượng (AQL)": "1.5 (Chuẩn kiểm định lỗ kim y tế & công nghiệp)",
      "Quy cách đóng gói": "100 chiếc/hộp, 10 hộp/thùng carton (1.000 chiếc/thùng)",
      "Ứng dụng tiêu biểu": "Sản xuất SMT, bán dẫn, pha chế hóa chất, phòng lab, bảo trì cơ khí chính xác, chế biến thực phẩm",
      "Tình trạng kho": "Sẵn hàng tại kho Hà Nội & Hưng Yên"
    },
    "features": [
      "Kháng hóa chất vượt trội: Bảo vệ an toàn trước sự văng bắn ngẫu nhiên của các dung môi, bazơ và axit loãng.",
      "Cảm giác xúc giác tuyệt vời: Mềm dẻo và ôm sát bàn tay, giảm mỏi cơ khi thao tác liên tục trong ca làm việc dài.",
      "Đầu ngón tay tạo nhám: Thao tác linh hoạt, cầm nắm chính xác các linh kiện điện tử nhỏ và dụng cụ dính dầu mỡ.",
      "An toàn cho làn da: Không chứa protein mủ cao su, loại trừ nguy cơ dị ứng da Type I cho người sử dụng.",
      "Độ tinh sạch cao: Không chứa silicone và không bột, loại trừ rủi ro gây nhiễm bẩn lên bề mặt sản phẩm và phòng sạch."
    ],
    "applications": [
      {
        "name": "Điện tử & Bán dẫn SMT",
        "desc": "Thao tác gắn chip, gắp linh kiện nhạy cảm, lắp ráp thiết bị điện tử chính xác."
      },
      {
        "name": "Phòng thí nghiệm & Pha chế",
        "desc": "Pha chế dung môi, kiểm nghiệm mẫu hóa học, phân tích sinh học và nghiên cứu dược phẩm."
      },
      {
        "name": "Chế biến Thực phẩm (F&B)",
        "desc": "Đạt chuẩn FDA tiếp xúc an toàn với mọi loại thực phẩm tươi sống và chế biến."
      },
      {
        "name": "Bảo dưỡng Cơ khí & Ô tô",
        "desc": "Lắp ráp động cơ, lau chùi chi tiết máy dính dầu nhờn và chất tẩy rửa cơ khí."
      }
    ]
  },
  {
    "id": "1016",
    "name": "Lọ đựng cồn",
    "sku": "TTPC-0701",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/20/2016053152371661.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Lọ đựng cồn chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1016",
      "Chuyên mục": "Thiết bị phụ trợ khác",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1000",
    "name": "Bộ máy khoan mài mini",
    "sku": "PVN8199",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "https://protools.com.vn/images/stores/2017/12/14/2115_b____m__y_khoan_m__i_kh___c___a_n__ng_100_m__n_tpc_8258_4_.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Bộ máy khoan mài mini chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1000",
      "Chuyên mục": "Thiết bị phụ trợ khác",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1078",
    "name": "Hệ thống thu hồi FHS 21/29",
    "sku": "MP-1078",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/1-image%20(7).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Hệ thống thu hồi FHS 21/29 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1078",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1077",
    "name": "Robotics kit UR (Bộ dụng cụ robot UR)",
    "sku": "MP-1077",
    "brand": "Murrplastik",
    "category": "FHS Robotics Kits (Bộ dụng cụ robot FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/1-image%20(4).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Robotics kit UR (Bộ dụng cụ robot UR) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1077",
      "Chuyên mục": "FHS Robotics Kits (Bộ dụng cụ robot FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1076",
    "name": "FHS-UHE support bracket (Giá đỡ FHS-UHE)",
    "sku": "MP-1076",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/0-image%20(8).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "FHS-UHE support bracket (Giá đỡ FHS-UHE) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1076",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1075",
    "name": "FHS-C support bracket (Giá đỡ FHS-C)",
    "sku": "MP-1075",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/0-image%20(6).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "FHS-C support bracket (Giá đỡ FHS-C) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1075",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1074",
    "name": "FHS-SH support bracket (Giá đỡ FHS-SH)",
    "sku": "MP-1074",
    "brand": "Murrplastik",
    "category": "FHS components (Các thành phần FHS)",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/14/image%20(3).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "FHS-SH support bracket (Giá đỡ FHS-SH) chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1074",
      "Chuyên mục": "FHS components (Các thành phần FHS)",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1069",
    "name": "Hệ thống laser mp-LM 1",
    "sku": "MP-1069",
    "brand": "Murrplastik",
    "category": "Labeling",
    "categorySlug": "murrplastik",
    "origin": "Đức (Germany)",
    "image": "https://protools.com.vn/images/stores/2025/10/11/0-image%20(1).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Hệ thống laser mp-LM 1 chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik",
      "Mã sản phẩm (ID)": "1069",
      "Chuyên mục": "Labeling",
      "Xuất xứ": "Đức (Germany)",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  }
];

export const TECHNICAL_DOCUMENTS: Document[] = [];

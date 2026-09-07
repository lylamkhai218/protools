import { Product, Document, Partner, Solution, IndustryApplication } from './types';

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
    description: 'Dòng máy hàn cao tần và nhiệt kế đo mỏ hàn Quick 191AD/196 phổ biến trong các nhà máy SMT.',
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
    desc: 'Robot hàn tự động 3-6 trục, máy hàn Hakko 936, máy hàn Quick, bể hàn thiếc CM-508 / CM-808 và phụ kiện mũi hàn.',
    iconName: 'Zap',
    tag: 'Hakko / Quick / CM',
    badge: 'Chính Hãng',
    bgGradient: 'from-blue-50 to-indigo-50/40',
    featuredProductsCount: 15,
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
    "image": "http://protools.com.vn/images/stores/2025/10/15/image%20(29).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/15/image%20(23).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/15/0-image%20(19).jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Hệ thống thu hồi và dẫn hướng xích cáp đàn hồi cho Robot 6 trục. Đã lắp đặt và hoạt động bền bỉ trên dàn Robot hàn ABB tại xưởng Body Shop Tổ hợp nhà máy VinFast Cát Hải (Hải Phòng).",
    "highlights": [
      "Case Study thực tế: Đã lắp đặt và hoạt động ổn định trên dàn Robot ABB tại Body Shop Tổ hợp nhà máy VinFast Cát Hải.",
      "Hệ thống lò xo đàn hồi thu hồi ống mượt mà, triệt tiêu ma sát và chống xoắn gập cáp khi Robot di chuyển đa trục tốc độ cao.",
      "100% Chính hãng Murrplastik CHLB Đức, đầy đủ chứng từ hàng hóa và có bảo hành chính hãng."
    ],
    "specs": {
      "Hãng sản xuất": "Murrplastik (CHLB Đức)",
      "Mã sản phẩm (ID)": "1081 (R-Tec Liner)",
      "Ứng dụng Robot": "Robot hàn ABB, KUKA, FANUC, YASKAWA 6 trục",
      "Dự án tiêu biểu": "Xưởng Body Shop - VinFast Cát Hải",
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
    "image": "http://protools.com.vn/images/stores/2025/10/15/image%20(16).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/0-image%20(12).jpg",
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
    "sku": "TTV-T&T-1065",
    "brand": "T&T Vina Industrial",
    "category": "Robot bơm keo tự động",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/bơm keo 2.jpg",
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
    "sku": "TTV-T&T-1055",
    "brand": "T&T Vina Industrial",
    "category": "Robot bơm keo tự động",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/Robot bơm keo tự động.jpg",
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
    "sku": "TTV-T&T-1032",
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
    "sku": "TTV-983A",
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
    "sku": "TTV-T&T-736",
    "brand": "T&T Vina Industrial",
    "category": "Kim bơm keo",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/08/04/z717937115673_69b530314931c59f1030aefdb79cac6e.jpg",
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
    "sku": "TTV-T&T-735",
    "brand": "T&T Vina Industrial",
    "category": "Kim bơm keo",
    "categorySlug": "dung-cu-bom-keo",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/kim chóp nhựa.jpg",
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
    "sku": "TTV-T&T-1064",
    "brand": "T&T Vina Industrial",
    "category": "Robot hàn tự động",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/0-robot hàn tự động.jpg",
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
    "sku": "TTV-T&T-1063",
    "brand": "T&T Vina Industrial",
    "category": "Robot hàn tự động",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/z2652052227434_692f44e1de5fa2f52208fd9483984690.jpg",
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
    "sku": "TTV-CM -1044",
    "brand": "CM Solder",
    "category": "Bể hàn thiếc",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/07/CM-808.jpg",
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
    "sku": "TTV-CM -1043",
    "brand": "CM Solder",
    "category": "Bể hàn thiếc",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/07/CM508.jpg",
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
    "id": "1039",
    "name": "Máy hàn Hakko 936",
    "sku": "HK-1039",
    "brand": "Hakko",
    "category": "Máy hàn Hakko",
    "categorySlug": "thiet-bi-han",
    "origin": "Nhật Bản (Japan)",
    "image": "http://protools.com.vn/images/stores/2019/10/07/0-hakko 936.jpg",
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
    "sku": "TTV-T&T-811",
    "brand": "T&T Vina Industrial",
    "category": "Kính lúp",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/08/04/z722302975774_e086e5e1885861ad3b9b846928c749e9.jpg",
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
    "sku": "TTV-T&T-947",
    "brand": "T&T Vina Industrial",
    "category": "Camera",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/11/25/Electron-Th-K-nh-Zoom-Video-Microscope-Magnifier-FKE-208A-CCD-h-th-ng-camera-v.jpg_640x640.jpg",
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
    "sku": "TTV-T&T-999",
    "brand": "T&T Vina Industrial",
    "category": "Kính hiển vi",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/14/0-stereo-microscope-sm-3t-144-hd2 (1).jpg",
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
    "sku": "TTV-T&T-998",
    "brand": "T&T Vina Industrial",
    "category": "Kính hiển vi",
    "categorySlug": "camera-kinh-soi-cong-nghiep",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/14/0-zoom-stereo-microscope-boom-sm-3tb-144.jpg",
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
    "image": "http://protools.com.vn/images/stores/2017/12/14/microscope-sm-1ts-6w-m-6_4_2_1_2.jpg",
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
    "sku": "TTV-T&T-1067",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/z2791846877797_6ca4bf6f39de57ff850c17f613e17669.jpg",
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
    "sku": "TTV-T&T-1062",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/0-máy đóng thùng 4 cạnh.jpg",
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
    "sku": "TTV-T&T-1061",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/0-z2791733746366_54ed3ee9a9c3209eda6abd42966d4499.jpg",
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
    "sku": "TTV-T&T-1060",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/2-Máy đóng thùng tự động.jpg",
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
    "sku": "TTV-T&T-1059",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị đóng gói tự động",
    "categorySlug": "thiet-bi-dong-goi-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/2-Dây truyền đóng gói khép kín.jpg",
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
    "image": "http://protools.com.vn/images/stores/2017/09/22/hakko-498.jpg",
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
    "sku": "HK-804",
    "brand": "Hakko",
    "category": "Máy kiểm tra nhiệt độ hàn",
    "categorySlug": "thiet-bi-han",
    "origin": "Nhật Bản (Japan)",
    "image": "http://protools.com.vn/images/stores/2019/10/05/Hakko FG101.png",
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
    "sku": "TTV-T&T-996",
    "brand": "T&T Vina Industrial",
    "category": "Máy đo lực",
    "categorySlug": "thiet-bi-kiem-tra",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/HP-10.png",
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
    "sku": "TTV-QUI-1031",
    "brand": "Quick",
    "category": "Máy kiểm tra nhiệt độ hàn",
    "categorySlug": "thiet-bi-han",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/27/Quick191ad-Large.jpg",
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
    "image": "http://protools.com.vn/images/stores/2017/12/27/HTB1wMR0KXXXXXXoXpXXq6xXFXXXA.jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/13/1-image%20(3).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/image%20(2)%20(1).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/image%20(1)%20(2).jpg",
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
    "sku": "TTV-ZCU-1037",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/RT3700.jpg",
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
    "sku": "TTV-ZCU-1036",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/Zcut 9.jpg",
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
    "sku": "TTV-ZCU-1035",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/Zcut 2.jpg",
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
    "sku": "TTV-ZCU-1034",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/M1000S.png",
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
    "sku": "TTV-ZCU-1033",
    "brand": "Zcut Automation",
    "category": "Máy cắt băng dính tự động",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/05/M1000.png",
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
    "sku": "TTV-T&T-1066",
    "brand": "T&T Vina Industrial",
    "category": "Robot bắt vít tự động",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/z2652052179913_debbf040c69e55470229265dade811da.jpg",
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
    "sku": "TTV-T&T-1053",
    "brand": "T&T Vina Industrial",
    "category": "Robot bắt vít tự động",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2021/09/25/robot bắt vít.jpg",
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
    "sku": "HIOS-1042",
    "brand": "HIOS",
    "category": "Máy bắt vít",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Nhật Bản (Japan)",
    "image": "http://protools.com.vn/images/stores/2019/10/07/CLT-50.jpg",
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
    "sku": "HIOS-1041",
    "brand": "HIOS",
    "category": "Máy bắt vít",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Nhật Bản (Japan)",
    "image": "http://protools.com.vn/images/stores/2019/10/07/0-CL-4000.jpg",
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
    "sku": "HIOS-1040",
    "brand": "HIOS",
    "category": "Máy bắt vít",
    "categorySlug": "may-bat-vit-nha-vit",
    "origin": "Nhật Bản (Japan)",
    "image": "http://protools.com.vn/images/stores/2019/10/07/0-CL-3000.jpg",
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
    "sku": "TTV-T&T-974",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp SA Series",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/nhíp.jpg",
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
    "sku": "TTV-T&T-973",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp gắp sản phẩm",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/08/18/TB29TGIXA7myKJjSZFgXXcT9XXa_!!2864331523.jpg",
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
    "sku": "TTV-T&T-928",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp ST Series",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/nhíp ST.jpg",
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
    "sku": "TTV-T&T-927",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp ESD",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/nhip ESD.jpg",
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
    "sku": "TTV-T&T-926",
    "brand": "T&T Vina Industrial",
    "category": "Nhíp nhựa",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/0-nhíp nhựa.jpg",
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
    "sku": "TTV-DR.-1048",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/SL-001.jpg",
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
    "sku": "TTV-DR.-938",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/SL-002.jpg",
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
    "image": "http://protools.com.vn/images/stores/2016/12/07/SBL_30w_(1).jpg",
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
    "image": "http://protools.com.vn/images/stores/2017/08/17/1595565004_28393935.jpg",
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
    "sku": "TTV-DR.-934",
    "brand": "Dr. Schneider",
    "category": "Quạt thổi ion",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/09/SP-600.jpg",
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
    "image": "http://protools.com.vn/images/stores/2019/10/07/AL-505LR.jpg",
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
    "image": "http://protools.com.vn/images/stores/2019/10/07/FTR-118C.jpg",
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
    "sku": "TTV-T&T-1045",
    "brand": "T&T Vina Industrial",
    "category": "Máy tách tem nhãn",
    "categorySlug": "may-cat-bang-dinh-tu-dong",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/07/1150D.jpg",
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
    "sku": "TTV-T&T-1023",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/12/dây tiếp đất.jpg",
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
    "sku": "TTV-T&T-943",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2016/11/05/Day tiep dat.jpg",
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
    "sku": "TTV-T&T-897",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2019/10/12/vòng đeo chân.jpg",
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
    "sku": "TTV-T&T-942",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2016/12/07/dây tiếp đất ổ cắm.jpg",
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
    "sku": "TTV-T&T-895",
    "brand": "T&T Vina Industrial",
    "category": "Dung cụ chống tĩnh điện",
    "categorySlug": "dung-cu-chong-tinh-dien",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/08/04/z722310551625_45d31378a84e02d4ccebea998ad6a5f1.jpg",
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
    "sku": "TTV-SAM-1052",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "http://protools.com.vn/images/stores/2019/10/12/0-R4T-16P-S.jpg",
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
    "sku": "TTV-SAM-1051",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "http://protools.com.vn/images/stores/2019/10/12/0-XTB-20H.jpg",
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
    "sku": "TTV-SAM-1050",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "http://protools.com.vn/images/stores/2019/10/12/0-C20HH-10SL-2.jpg",
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
    "sku": "TTV-SAM-1049",
    "brand": "Samwon",
    "category": "Thiết bị tự động hóa",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Hàn Quốc (Korea)",
    "image": "http://protools.com.vn/images/stores/2019/10/09/XTB.jpg",
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
    "sku": "TTV-T&T-1068",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2023/11/16/Dây chun.jpg",
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
    "sku": "TTV-T&T-1027",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/25/TB136oyKVXXXXaJXXXXXXXXXXXX_!!0-item_pic.jpg",
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
    "sku": "TTV-T&T-1024",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/25/product_s350.jpg",
    "stock": 50,
    "stockStatus": "In Stock",
    "stockLocation": "Kho Hà Nội & Hưng Yên",
    "price": "Liên hệ Báo giá",
    "shortDesc": "Khăn lau phòng sạch chính hãng phân phối bởi T&T Vina Industrial Co., Ltd, đáp ứng tiêu chuẩn nhà máy lắp ráp & SMT.",
    "highlights": [
      "100% Chính hãng, có đầy đủ chứng từ hàng hóa",
      "Độ bền cao, hoạt động ổn định trong dây chuyền sản xuất công nghiệp 24/7",
      "Hỗ trợ kỹ thuật lắp đặt và giao hàng nhanh tại các KCN trên toàn quốc"
    ],
    "specs": {
      "Hãng sản xuất": "T&T Vina Industrial",
      "Mã sản phẩm (ID)": "1024",
      "Chuyên mục": "Thiết bị phụ trợ khác",
      "Xuất xứ": "Chính Hãng",
      "Tình trạng": "Sẵn hàng tại kho"
    }
  },
  {
    "id": "1016",
    "name": "Lọ đựng cồn",
    "sku": "TTV-T&T-1016",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/20/2016053152371661.jpg",
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
    "sku": "TTV-T&T-1000",
    "brand": "T&T Vina Industrial",
    "category": "Thiết bị phụ trợ khác",
    "categorySlug": "thiet-bi-tu-dong-hoa",
    "origin": "Chính Hãng",
    "image": "http://protools.com.vn/images/stores/2017/12/14/2115_b____m__y_khoan_m__i_kh___c___a_n__ng_100_m__n_tpc_8258_4_.jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/1-image%20(7).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/1-image%20(4).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/0-image%20(8).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/0-image%20(6).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/14/image%20(3).jpg",
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
    "image": "http://protools.com.vn/images/stores/2025/10/11/0-image%20(1).jpg",
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

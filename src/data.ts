import { Product, Document, Partner, Solution } from './types';

export const PARTNERS: Partner[] = [
  { name: 'Murrplastik', logo: 'M' },
  { name: 'ATOKA', logo: 'A' },
  { name: 'Nvidia', logo: 'N' },
  { name: 'LOCTITE', logo: 'L' },
  { name: 'WELLER', logo: 'W' },
  { name: 'HIOKI', logo: 'H' }
];

export const SOLUTIONS: Solution[] = [
  {
    id: 'han-khu-tinh-dien',
    title: 'HÀN & KHỬ TĨNH ĐIỆN',
    desc: 'Hệ thống trạm hàn cao cấp, máy thu khói hàn và các thiết bị chống tĩnh điện chuẩn ESD cho dây chuyền SMT.',
    icon: 'bolt',
    link: '#'
  },
  {
    id: 'robot-tu-dong-hoa',
    title: 'ROBOT & TỰ ĐỘNG HÓA',
    desc: 'Robot hàn, robot cấp vít và các giải pháp cánh tay robot cộng tác (Cobot) tối ưu năng suất lao động.',
    icon: 'smart_toy',
    link: '#'
  },
  {
    id: 'keo-vat-tu-tieu-hao',
    title: 'KEO & VẬT TƯ TIÊU HAO',
    desc: 'Keo công nghiệp Loctite, mỡ chịu nhiệt và các loại vật tư tiêu hao chuyên dụng cho lắp ráp cơ khí.',
    icon: 'water_drop',
    link: '#'
  },
  {
    id: 'dung-cu-van-vit',
    title: 'DỤNG CỤ VẶN VÍT',
    desc: 'Tô vít điện tử, súng siết bu lông và hệ thống quản lý lực siết thông minh đạt chuẩn QC quốc tế.',
    icon: 'build',
    link: '#'
  }
];

export const TECHNICAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Catalog Máy Hàn Hakko Professional Series 2024',
    sku: 'HK-2024-SYS',
    size: '12.4 MB',
    category: 'Catalog tổng hợp',
    updatedAt: '12/03/2024',
    downloadCount: 420
  },
  {
    id: 'doc-2',
    title: 'Hướng dẫn sử dụng Trạm hàn FX-888D (Tiếng Việt)',
    sku: 'FX-888D',
    size: '4.2 MB',
    category: 'Hướng dẫn vận hành',
    updatedAt: '05/01/2024',
    downloadCount: 855
  },
  {
    id: 'doc-3',
    title: 'Chứng nhận tiêu chuẩn ISO 9001:2015 - T&T Factory',
    sku: 'CERT-ISO-9001',
    size: '1.8 MB',
    category: 'Chứng nhận hiệu chuẩn',
    updatedAt: '20/12/2023',
    downloadCount: 150
  },
  {
    id: 'doc-4',
    title: 'Sơ đồ đấu nối Robot vặn vít Janome JR3300',
    sku: 'JR3300-DIAG',
    size: '8.5 MB',
    category: 'Catalog tổng hợp',
    updatedAt: '15/11/2023',
    downloadCount: 290
  },
  {
    id: 'doc-5',
    title: 'Hướng dẫn hiệu chuẩn súng vặn vít điện tử HIOS',
    sku: 'HIOS-CAL-01',
    size: '3.1 MB',
    category: 'Chứng nhận hiệu chuẩn',
    updatedAt: '02/10/2023',
    downloadCount: 188
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'hakko-hu-200',
    name: 'Robot Hàn Tự Động Hakko HU-200',
    sku: 'HK-HU200-Z1',
    brand: 'Hakko',
    category: 'Trạm hàn / Robot',
    // Realistic links / placeholders with beautiful content
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    status: 'In Stock',
    price: 'Báo giá',
    shortDesc: 'Giải pháp hàn tự động đa trục hiệu suất cao, được thiết kế cho các dây chuyền lắp ráp điện tử yêu cầu độ chính xác tuyệt đối. Robot HU-200 kết hợp công nghệ kiểm soát nhiệt tiên tiến của Hakko với hệ thống chuyển động ổn định 4 trục.',
    specs: {
      'Mô hình Robot': 'HU-200 Desktop Series',
      'Số trục điều khiển': '4 Trục (X, Y, Z, R)',
      'Dải nhiệt độ hàn': '50°C - 500°C',
      'Độ chính xác vị trí': '± 0.01 mm',
      'Điện năng tiêu thụ': 'AC 220V, 50/60 Hz, 450W',
      'Khối lượng máy': '28 kg',
      'Kết nối ngoại vi': 'Ethernet, USB, RS-232C'
    },
    applications: [
      {
        name: 'Lắp ráp PCB',
        desc: 'Hàn các linh kiện xuyên lỗ (Through-hole) trên bảng mạch in với tốc độ cao và nhiệt độ ổn định.',
        icon: 'tablet_mac'
      },
      {
        name: 'Hàn đầu nối Connector',
        desc: 'Đảm bảo các mối hàn dây dẫn và connector chắc chắn, không bị quá nhiệt làm hỏng vỏ nhựa.',
        icon: 'settings_ethernet'
      }
    ],
    documents: [
      { name: 'HU-200 User Manual (v2.1)', type: 'PDF, 4.2 MB', size: 'Tiếng Anh/Tiếng Việt' },
      { name: 'Bản vẽ 2D/3D CAD (STEP/DWG)', type: 'ZIP, 12 MB', size: 'Dành cho thiết kế tích hợp' }
    ]
  },
  {
    id: 'hakko-fx-888d',
    name: 'Hakko FX-888D Digital Soldering Station',
    sku: 'HK888-D01',
    brand: 'Hakko',
    category: 'Trạm hàn',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    stock: 142,
    status: 'In Stock',
    price: 'Báo giá',
    shortDesc: 'Trạm hàn nhiệt độ kỹ thuật số chất lượng vượt trội. Thiết kế cực kỳ nhỏ gọn giúp tối ưu không gian bàn thao tác công nghiệp.'
  },
  {
    id: 'hios-vz-1510',
    name: 'HIOS VZ-1510 Precision Electric Screwdriver',
    sku: 'VZ-1510-AC',
    brand: 'HIOS',
    category: 'Dụng cụ vặn vít',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
    stock: 45,
    status: 'In Stock',
    price: 'Báo giá',
    shortDesc: 'Tô vít điện tử chính xác dùng cho dây chuyền sản xuất lắp ráp linh kiện vi cơ, smartphone và điện tử gia dụng.'
  },
  {
    id: 'quick-861dw',
    name: 'Quick 861DW Hot Air Rework Station',
    sku: 'QK-861DW-1000W',
    brand: 'Quick',
    category: 'Khỏ nhiệt',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    status: 'Low Stock',
    price: 'Báo giá',
    shortDesc: 'Trạm khò nhiệt thông minh công suất lớn 1000W chuyên dụng, dải nhiệt độ rộng, lưu lượng gió thổi cực kỳ ổn định.'
  },
  {
    id: 'hakko-t12-bc2',
    name: 'Hakko T12-BC2 Shape BC 2.0mm Tip',
    sku: 'HK-T12-BC2',
    brand: 'Hakko',
    category: 'Mũi hàn',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    stock: 500,
    status: 'In Stock',
    price: 'Báo giá',
    shortDesc: 'Mũi hàn đầu vát tròn BC cao cấp dùng cho dòng hàn T12, thiết kế tối ưu hóa dẫn nhiệt cực nhanh.'
  }
];

export const ACCESSORIES = [
  {
    id: 'acc-1',
    name: 'Mũi hàn Hakko T31',
    price: '245.000 VND',
    image: 'https://images.unsplash.com/photo-1597484211029-f0a4d0dd5365?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'acc-2',
    name: 'Thiếc hàn tinh khiết 0.8mm',
    price: '1.120.000 VND',
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=200'
  }
];

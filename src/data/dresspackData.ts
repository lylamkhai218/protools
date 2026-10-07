// CSDL Hệ Thống Robot Dresspack Configurator (Chuẩn T&T Vina Industrial B2B)
// Dữ liệu bóc tách chính thức từ Murrplastik Configuration & Dự án thực tế T&T Vina

export interface DresspackPartItem {
  id: string;
  mpn: string;
  name: string;
  vnName: string;
  position: string;
  role: string;
  spec: string;
  defaultQty: number;
  unit: string;
  imageUrl: string;
  cadPdfUrl?: string;
  cadStepUrl?: string;
}

export interface PerspectiveView {
  id: string;
  label: string;
  angle: string;
  url: string;
}

export interface DresspackPackage {
  id: string;
  packageCode: string;
  configId: string;
  name: string;
  robotModelId: string;
  robotModelName: string;
  travelRange: string;
  conduitType: string;
  innerDiameterMm: number;
  outerDiameterMm: number;
  description: string;
  recommendedFor: string;
  main3dImage: string;
  perspectiveImages: PerspectiveView[];
  cadPdfUrl?: string;
  cadStepUrl?: string;
  parts: DresspackPartItem[];
}


export interface RobotModel {
  id: string;
  brandId: string;
  name: string;
  series: string;
  payloadKg: number;
  reachM: number;
  imageUrl: string;
  hasActiveConfig: boolean;
  packages: DresspackPackage[];
}

export interface RobotBrand {
  id: string;
  name: string;
  country: string;
  representativeRobotImg: string;
  modelsCount: number;
  hasActiveConfig: boolean;
  description: string;
}

export interface StandardCableOption {
  id: string;
  name: string;
  standard: string;
  category: 'air' | 'sensor' | 'servo';
  diameterMm: number;
  color: string;
  defaultQty: number;
}

// 1. DANH SÁCH 13 THƯƠNG HIỆU HÀNG ĐẦU (STEP 1)
export const ROBOT_BRANDS: RobotBrand[] = [
  {
    id: 'fanuc',
    name: 'FANUC Corporation',
    country: 'Nhật Bản',
    representativeRobotImg: '/images/dresspack/fanuc/00_Robot_Angle_1_Overview.png',
    modelsCount: 9,
    hasActiveConfig: true,
    description: 'Nhà sản xuất robot công nghiệp màu vàng số 1 thế giới'
  },
  {
    id: 'abb',
    name: 'ABB Robotics',
    country: 'Thụy Sĩ / Thụy Điển',
    representativeRobotImg: '/images/dresspack/abb/abb_irb6700_overview.png',
    modelsCount: 14,
    hasActiveConfig: true,
    description: 'Tập đoàn dẫn đầu giải pháp tự động hóa nặng & ô tô toàn cầu'
  },
  {
    id: 'kuka',
    name: 'KUKA Robotics',
    country: 'CHLB Đức',
    representativeRobotImg: '/images/dresspack/kuka/kuka_brand_kr210.webp',
    modelsCount: 18,
    hasActiveConfig: true,
    description: 'Chuyên gia robot hàn thân xe & lắp ráp hạng nặng tiêu chuẩn Đức'
  },
  {
    id: 'yaskawa',
    name: 'Yaskawa Motoman',
    country: 'Nhật Bản',
    representativeRobotImg: '/images/dresspack/yaskawa/yaskawa_brand.webp',
    modelsCount: 11,
    hasActiveConfig: true,
    description: 'Đỉnh cao robot điều khiển chuyển động, hàn hồ quang & gắp thả'
  },
  {
    id: 'universal-robots',
    name: 'Universal Robots (UR)',
    country: 'Đan Mạch',
    representativeRobotImg: '/images/dresspack/universal-robots/ur_brand.webp',
    modelsCount: 6,
    hasActiveConfig: true,
    description: 'Thương hiệu Cobot (Robot cộng tác) tiên phong & phổ biến nhất'
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki Robotics',
    country: 'Nhật Bản',
    representativeRobotImg: '/images/dresspack/kawasaki/kawasaki_brand.webp',
    modelsCount: 3,
    hasActiveConfig: true,
    description: 'Robot công nghiệp chính xác cao cho ngành bán dẫn & cơ khí'
  },
  {
    id: 'doosan',
    name: 'Doosan Robotics',
    country: 'Hàn Quốc',
    representativeRobotImg: '/images/dresspack/doosan/doosan_brand.webp',
    modelsCount: 3,
    hasActiveConfig: true,
    description: 'Cobot cảm biến mô-men xoắn cao cấp từ tập đoàn công nghiệp Doosan'
  },
  {
    id: 'comau',
    name: 'Comau Robotics',
    country: 'Ý',
    representativeRobotImg: '/images/dresspack/comau/comau_brand.webp',
    modelsCount: 2,
    hasActiveConfig: true,
    description: 'Giải pháp robot linh hoạt chuyên biệt cho dây chuyền sản xuất xe hơi'
  },
  {
    id: 'techman-robot',
    name: 'Techman Robot (TM)',
    country: 'Đài Loan',
    representativeRobotImg: '/images/dresspack/techman-robot/tm_brand.webp',
    modelsCount: 7,
    hasActiveConfig: true,
    description: 'Cobot tích hợp sẵn hệ thống camera thị giác máy tính thông minh'
  },
  {
    id: 'delta',
    name: 'Delta Electronics',
    country: 'Đài Loan',
    representativeRobotImg: '/images/dresspack/delta/delta_brand.webp',
    modelsCount: 6,
    hasActiveConfig: true,
    description: 'Robot SCARA & Articulated phục vụ lắp ráp điện tử tốc độ cao'
  },
  {
    id: 'kassow-robots',
    name: 'Kassow Robots',
    country: 'Đan Mạch',
    representativeRobotImg: '/images/dresspack/kassow/kassow_brand.webp',
    modelsCount: 1,
    hasActiveConfig: true,
    description: 'Cobot 7 bậc tự do (7-axis) linh hoạt tối đa cho không gian hẹp'
  },
  {
    id: 'neura',
    name: 'NEURA Robotics',
    country: 'CHLB Đức',
    representativeRobotImg: '/images/dresspack/neura/neura_brand.webp',
    modelsCount: 2,
    hasActiveConfig: true,
    description: 'Robot nhận thức AI Cognitive Robots thế hệ mới'
  },
  {
    id: 'autonox',
    name: 'Autonox Robotics',
    country: 'CHLB Đức',
    representativeRobotImg: '/images/dresspack/autonox/CategoryAutonox_Robotics.webp',
    modelsCount: 1,
    hasActiveConfig: true,
    description: 'Cơ cấu robot cơ khí Delta & Articulated độc lập hệ điều khiển'
  }
];

// 2. DANH MỤC GÓI ABB IRB 6700 - MS82501000000700 (13 LINH KIỆN ĐỒNG BỘ)
export const ABB_IRB6700_PACKAGE: DresspackPackage = {
  id: 'pkg-abb-irb6700-m40',
  packageCode: 'MS82501000000700',
  configId: '1027667',
  name: 'Gói Dresspack ABB IRB 6700 - A3 sang A6 (Chuẩn M40/P36)',
  robotModelId: 'abb-irb-6700',
  robotModelName: 'ABB IRB 6700 - 150Kg 3.2M',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M40/P36 Black',
  innerDiameterMm: 28.5,
  outerDiameterMm: 36.0,
  description: 'Hệ thống xích dẫn & bảo vệ cáp khép kín tích hợp Hộp hoàn lực tự động R-Tec Box 80N. Ngăn chặn tuyệt đối tình trạng võng chùng và quấn cáp quanh cổ tay robot trong quá trình vận hành tốc độ cao.',
  recommendedFor: 'Ứng dụng hàn thân xe (Body Shop), gắp tải nặng dập kim loại, sơn tĩnh điện & vận chuyển pallet.',
  main3dImage: '/images/dresspack/abb/abb_irb6700_overview.png',
  perspectiveImages: [
    {
      id: 'ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/abb/abb_irb6700_overview.png'
    },
    {
      id: 'ang-2',
      label: 'Góc nhìn từ trên xuống (Top View)',
      angle: 'Plan View A3-A6',
      url: '/images/dresspack/abb/abb_irb6700_angle_top.png'
    },
    {
      id: 'ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & R-Tec Box',
      url: '/images/dresspack/abb/abb_irb6700_angle_side.png'
    },
    {
      id: 'ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Flange & Tool',
      url: '/images/dresspack/abb/abb_irb6700_angle_wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/abb_irb6700_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/ABB/IRB6700/1027667_SYM_00_3K1.STP',
  parts: [
    {
      id: 'abb-part-1',
      mpn: '83692622',
      name: 'Base Plate ABB Serie 6600/6640/6650/6700',
      vnName: 'Bản mã gá chân đế R-Tec Box trục 3',
      position: 'Trục 3 (Axis 3)',
      role: 'Đế định vị chịu lực liên kết R-Tec Box với cánh tay robot',
      spec: 'Thép mạ kẽm độ bền kéo cao, khoan sẵn lỗ chuẩn tâm trục ABB',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/abb/83692622_Base_Plate_ABB_6700.png'
    },
    {
      id: 'abb-part-2',
      mpn: '83692652',
      name: 'R-Tec Box EWX 36 MP - 80N',
      vnName: 'Hộp lò xo hồi vị hoàn lực tự động 80N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi tự động và duy trì lực căng cáp không đổi khi tay vươn xa',
      spec: 'Lực kéo lò xo 80N, hành trình hoàn lực 400mm, tiêu chuẩn IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/abb/83692652_R_Tec_Box_EWX_36_80N.png'
    },
    {
      id: 'abb-part-3',
      mpn: '83692768',
      name: 'Halteblech Achse 3',
      vnName: 'Bản mã gá đỡ kẹp phụ trục 3',
      position: 'Trục 3 (Axis 3 Intermediate)',
      role: 'Giữ cùm kẹp SH-P chống dao động ống luồn',
      spec: 'Thép kết cấu sơn tĩnh điện chống ăn mòn hóa chất',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83692768_Halteblech_Achse_3.png'
    },
    {
      id: 'abb-part-4',
      mpn: '83692771',
      name: 'Befestigungsblech A1',
      vnName: 'Tấm gá liên kết cố định trục 1 (A1)',
      position: 'Trục 1 (Axis 1 Base)',
      role: 'Cố định đầu vào cáp từ nguồn chân robot lên thân trên',
      spec: 'Tấm định vị kim loại chịu lực uốn động học',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83692771_Befestigungsblech_A1.png'
    },
    {
      id: 'abb-part-5',
      mpn: '83952642',
      name: 'R-SSR 200-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống luồn theo quỹ đạo chuyển động của cánh tay',
      spec: 'Đường kính kẹp 200mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/abb/83952642_R_SSR_200_1_A.png'
    },
    {
      id: 'abb-part-6',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/abb/83952614_R_FKE_32.png'
    },
    {
      id: 'abb-part-7',
      mpn: '83692462',
      name: 'KEG/K-M40',
      vnName: 'Khớp cầu bi xoay 360° bảo vệ dây',
      position: 'Đầu ra ống luồn (Trục 3 & Trục 6)',
      role: 'Triệt tiêu hoàn toàn ứng suất xoắn vặn ruột gà lên bó dây cáp',
      spec: 'Góc tự do ±30°, xoay tròn 360°, Polyamide chống mài mòn',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83692462_KEG_K_M40.png'
    },
    {
      id: 'abb-part-8',
      mpn: '83691460',
      name: 'SH-P / M40-M50',
      vnName: 'Cùm kẹp giữ cố định ống trượt',
      position: 'Dọc cánh tay A3-A4-A5',
      role: 'Định hướng cho ống trượt mượt mà không vướng mắc kết cấu cơ khí',
      spec: 'Chất liệu PA6 cải tiến chống tia UV, ngàm tháo lắp nhanh',
      defaultQty: 5,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83691460_SH_P_M40_M50.png'
    },
    {
      id: 'abb-part-9',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp giữ chính hệ thống',
      position: 'Giá đỡ trung gian',
      role: 'Đảm bảo ống luồn cố định vững chắc ở các điểm neo then chốt',
      spec: 'Polyamide gia cường sợi thủy tinh độ bền kéo cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'abb-part-10',
      mpn: '83691262',
      name: 'PR/SV-EWX 36',
      vnName: 'Vòng đệm giảm chấn và chống mòn ống',
      position: 'Lắp cách đều trên thân ống EWX',
      role: 'Hấp thụ va đập và ngăn ống ma sát trực tiếp với thân robot',
      spec: 'Vật liệu đàn hồi chịu nhiệt độ cao -40°C đến +100°C',
      defaultQty: 5,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83691262_PR_SV_EWX_36.png'
    },
    {
      id: 'abb-part-11',
      mpn: '83691662',
      name: 'KMG/F-M40',
      vnName: 'Bạc dẫn hướng cao su giảm rung chấn',
      position: 'Khớp liên kết ngàm cùm SH',
      role: 'Đệm trượt đàn hồi giúp ống luồn tịnh tiến êm ái',
      spec: 'Vật liệu đàn hồi TPE dẻo tiêu chuẩn công nghiệp',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83691662_KMG_F_M40.png'
    },
    {
      id: 'abb-part-12',
      mpn: '83951610',
      name: 'R-ZL/N1 36/48',
      vnName: 'Tấm kẹp chặn lực căng cáp (Strain Relief)',
      position: 'Hai đầu hộp R-Tec Box & Cổ tay',
      role: 'Khóa chặt từng sợi cáp độc lập, ngăn lực giật truyền vào đầu giắc',
      spec: 'Thiết kế kẹp hình sao (Star Grommet) bảo vệ vỏ cáp tối đa',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/abb/83951610_R_ZL_N1_36_48.png'
    },
    {
      id: 'abb-part-13',
      mpn: '83182062',
      name: 'EWX-PAE-M40/P36 Black',
      vnName: 'Ống luồn Murrflex PA12 uốn mỏi dẻo cao',
      position: 'Dọc tuyến dẫn A3 đến A6',
      role: 'Lớp vỏ bọc chính chịu mỏi uốn động học > 10 triệu chu kỳ',
      spec: 'Vật liệu Polyamide 12 cao cấp, ID: 28.5mm, OD: 36.0mm, chống cháy UL94 V2',
      defaultQty: 4,
      unit: 'Mét',
      imageUrl: '/images/dresspack/abb/83182062_EWX_PAE_M40_P36.png'
    }
  ]
};

// 2B. GÓI ABB IRB 6700 - MS82501000000707 (CHUẨN M50/P48 TẢI NẶNG)
export const ABB_IRB6700_HEAVY_PACKAGE: DresspackPackage = {
  id: 'pkg-abb-irb6700-m50',
  packageCode: 'MS82501000000707',
  configId: '1027668',
  name: 'Gói Dresspack ABB IRB 6700 - A3 sang A6 (Chuẩn M50/P48 Tải Nặng)',
  robotModelId: 'abb-irb-6700',
  robotModelName: 'ABB IRB 6700 - 150Kg 3.2M',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 38.6,
  outerDiameterMm: 50.0,
  description: 'Gói dresspack tải nặng đường kính lớn M50 cho ứng dụng hàn hồ quang, cấp phôi phay CNC và dây chuyền lắp ráp tải trọng lớn.',
  recommendedFor: 'Ứng dụng hàn công nghiệp, gắp dập kim loại, sơn tĩnh điện & vận chuyển pallet tải nặng.',
  main3dImage: '/images/dresspack/abb/abb_irb6700_overview.png',
  perspectiveImages: ABB_IRB6700_PACKAGE.perspectiveImages,
  cadPdfUrl: ABB_IRB6700_PACKAGE.cadPdfUrl,
  parts: [
    ...ABB_IRB6700_PACKAGE.parts.filter(p => p.mpn !== '83182062'),
    {
      id: 'abb-part-13-m50',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn Murrflex PA12 chuyên dụng Robot M50',
      position: 'Dọc tuyến dẫn A3 đến A6',
      role: 'Đường ống chịu uốn chính cỡ lớn M50 cho bó dây dày',
      spec: 'Polyamide 12 cao cấp, ID: 38.6mm, OD: 50.0mm, chống cháy UL94 V2',
      defaultQty: 4,
      unit: 'Mét',
      imageUrl: '/images/dresspack/fanuc/83182064_EWX-PAE-M50_P48_Black.png'
    }
  ]
};

// 3. DANH MỤC GÓI FANUC M-710iC/50 - MS82501000000256 (9 LINH KIỆN ĐỒNG BỘ)
export const FANUC_M710_PACKAGE: DresspackPackage = {
  id: 'pkg-fanuc-m710ic50-m50',
  packageCode: 'MS82501000000256',
  configId: '1017711',
  name: 'Gói Dresspack Fanuc M-710iC/50 - A3 sang A6 (Chuẩn M50/P48)',
  robotModelId: 'fanuc-m-710ic-50',
  robotModelName: 'Fanuc M-710iC/50',
  travelRange: 'Trục 3 ra Trục 6 (Upper Arm -> Wrist Tool)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 38.6,
  outerDiameterMm: 50.0,
  description: 'Gói giải pháp dresspack tối ưu cho dòng robot Fanuc gắp tải trung bình M-710iC/50. Sử dụng ống luồn đường kính lớn M50 và Hộp hồi vị R-Tec Box 100N hành trình 400mm mang lại độ bền hoạt động 24/7.',
  recommendedFor: 'Máy dập cấp phôi, dây chuyền gắp thả FSTV, đánh bóng cơ khí & cắt plasma/laser.',
  main3dImage: '/images/dresspack/fanuc/00_Robot_Angle_1_Overview.png',
  perspectiveImages: [
    {
      id: 'fanuc-ang-1',
      label: 'Phối cảnh tổng thể (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/fanuc/00_Robot_Angle_1_Overview.png'
    },
    {
      id: 'fanuc-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 3-6',
      url: '/images/dresspack/fanuc/00_Robot_Angle_2_Top.png'
    },
    {
      id: 'fanuc-ang-3',
      label: 'Góc nhìn ngang cánh tay & R-Tec Box',
      angle: 'Lateral View & Spring Return',
      url: '/images/dresspack/fanuc/00_Robot_Angle_3_Side.png'
    },
    {
      id: 'fanuc-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/fanuc/00_Robot_Angle_4_Wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/fanuc_m710ic_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/Fanuc/M-710iC-50/1017711_SYM_00_3K1.STP',
  parts: [
    {
      id: 'fanuc-part-1',
      mpn: '82390043',
      name: 'System plate for R-Tec Box Fanuc M710',
      vnName: 'Bản mã gá chân đế R-Tec Box Fanuc',
      position: 'Trục 3 (Axis 3)',
      role: 'Đế gá chuyên dụng gia công CNC khớp chuẩn tâm trục Fanuc M-710',
      spec: 'Thép tôi mạ kẽm chống rỉ, chịu tải rung động cao',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/fanuc/82390043_Base_Plate_Fanuc_M710.png'
    },
    {
      id: 'fanuc-part-2',
      mpn: '83692656',
      name: 'R-Tec Box EWX 48 MP - 100N',
      vnName: 'Hộp lò xo hồi vị hoàn lực tự động 100N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Kéo căng và thu hồi ống luồn tự động khi trục 4/5/6 cử động uốn',
      spec: 'Lực kéo lò xo 100N, hành trình 400mm, độ bền trên 10 triệu chu kỳ',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/fanuc/83692656_R-Tec_Box_EWX_48_MP_100N.png'
    },
    {
      id: 'fanuc-part-3',
      mpn: '82952696',
      name: 'R-SSR 125-1 A Pipe 15deg',
      vnName: 'Cùm kẹp ôm ống cổ tay góc nghiêng 15°',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong thoát góc 15 độ, chống cọ sát vào động cơ servo',
      spec: 'Đường kính kẹp 125mm, góc uốn 15 độ, nhôm đúc chịu lực cao',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/fanuc/82952696_R-SSR_125-1_A_Pipe_15deg.png'
    },
    {
      id: 'fanuc-part-4',
      mpn: '83952614',
      name: 'R-FKE 32 Flange Clamp',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Đế bích khóa chắc chắn ống luồn tại đầu cơ cấu chấp hành',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, nhôm Anodize chống tĩnh điện',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/fanuc/83952614_R-FKE_32_Flange_Clamp.png'
    },
    {
      id: 'fanuc-part-5',
      mpn: '83692464',
      name: 'KEG/K-M50 Ball Joint',
      vnName: 'Khớp cầu bi xoay 360° bảo vệ dây M50',
      position: 'Đầu ra hộp R-Tec Box & Khớp bích trục 6',
      role: 'Cho phép ống xoay tự do 360 độ và lắc góc ±30 độ, triệt tiêu xoắn cáp',
      spec: 'Polyamide 6 biến tính đàn hồi, kích cỡ ren M50/P48',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/fanuc/83692464_KEG_K-M50_Ball_Joint.png'
    },
    {
      id: 'fanuc-part-6',
      mpn: '83691501',
      name: 'SH M40/M50-M Holder',
      vnName: 'Cùm kẹp giữ chính hệ thống M50',
      position: 'Thân cánh tay trên',
      role: 'Giữ cùm liên kết chắc chắn với kết cấu robot',
      spec: 'Chất liệu PA6 biến tính gia cường, ngàm kẹp cơ động',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/fanuc/83691501_SH_M40_M50-M_Holder.png'
    },
    {
      id: 'fanuc-part-7',
      mpn: '83691264',
      name: 'PR/SV-EWX 48 Protector',
      vnName: 'Vòng đệm bảo vệ chống mòn ống M50',
      position: 'Thân ống luồn EWX',
      role: 'Chống mài mòn va chạm khi ống tiếp xúc thân robot ở các góc uốn gấp',
      spec: 'Polyamide 6 chịu va đập cơ học cao',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/fanuc/83691264_PR_SV-EWX_48_Protector.png'
    },
    {
      id: 'fanuc-part-8',
      mpn: '83951610',
      name: 'R-ZL/N1 36/48 Strain Relief',
      vnName: 'Tấm kẹp chặn lực căng cáp Star Grommet',
      position: 'Hai đầu cố định cáp',
      role: 'Kẹp cố định các bó dây cáp điện và ống khí, ngăn tuột giắc cắm',
      spec: 'Gờ kẹp răng cưa dạng sao, không làm dập vỏ bọc cáp',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/fanuc/83951610_R-ZL_N1_36_48_Strain_Relief.png'
    },
    {
      id: 'fanuc-part-9',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn Murrflex PA12 chuyên dụng Robot M50',
      position: 'Dọc toàn bộ hành trình A3 đến A6',
      role: 'Đường ống chịu uốn chính, bảo vệ toàn diện cáp điện và ống khí nén',
      spec: 'Polyamide 12 cao cấp, ID: 38.6mm, OD: 50.0mm, độ bền uốn mỏi vượt trội',
      defaultQty: 4,
      unit: 'Mét',
      imageUrl: '/images/dresspack/fanuc/83182064_EWX-PAE-M50_P48_Black.png'
    }
  ]
};


// 4. GÓI KUKA KR 210 R2700 PRIME - MS82502100000700
export const KUKA_KR210_PACKAGE: DresspackPackage = {
  id: 'pkg-kuka-kr210-m50',
  packageCode: 'MS82501000000752',
  configId: '1035821',
  name: 'Gói Dresspack KUKA KR 210 R2700 - A3 sang A6 (Chuẩn M50/P48)',
  robotModelId: 'kuka-kr-210-r2700',
  robotModelName: 'KUKA KR 210 R2700-2 Prime',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 38.6,
  outerDiameterMm: 50.0,
  description: 'Hệ thống xích dẫn cáp cao cấp R-Tec Box 100N cho robot tải nặng KUKA KR 210, tối ưu hóa cho xưởng hàn dập thân xe (Body Shop) và dây chuyền lắp ráp ô tô tự động.',
  recommendedFor: 'Hàn bấm (Spot Welding), sơn robot, bốc dỡ phôi dập kim loại nặng.',
  main3dImage: '/images/dresspack/kuka/00_Robot_Angle_1_Overview.png',
  perspectiveImages: [
    {
      id: 'kuka-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/kuka/00_Robot_Angle_1_Overview.png'
    },
    {
      id: 'kuka-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 3-6',
      url: '/images/dresspack/kuka/00_Robot_Angle_2_Top.png'
    },
    {
      id: 'kuka-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & Spring Return',
      url: '/images/dresspack/kuka/00_Robot_Angle_3_Side.png'
    },
    {
      id: 'kuka-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/kuka/00_Robot_Angle_4_Wrist.png'
    }
  ],
  parts: [
    {
      id: 'kuka-part-1',
      mpn: '82390067',
      name: 'R-SSR 140-2',
      vnName: 'Cùm kẹp ôm cổ tay robot KUKA A6 - Ø140mm',
      position: 'Trục 6 (Axis 6 Wrist)',
      role: 'Cùm kẹp ôm cổ tay trục 6 dẫn hướng ống luồn vào khớp nối bàn tay cơ khí',
      spec: 'Đường kính kẹp Ø140mm, hợp kim nhôm đúc chịu tải uốn mỏi cao, chuẩn bu lông KUKA Quantec',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kuka/82390067_R-SSR_140-2.png'
    },
    {
      id: 'kuka-part-2',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Đế bích khóa cố định cụm dẫn hướng vào mặt bích công cụ cơ cấu chấp hành',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize chống ăn mòn và tĩnh điện',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kuka/83952614_R-FKE_32.png'
    },
    {
      id: 'kuka-part-3',
      mpn: '83951610',
      name: 'R-ZL/N1 36/48',
      vnName: 'Tấm kẹp chặn lực căng cáp Star Grommet',
      position: 'Thoát dây Trục 6 & Hộp R-Tec Box',
      role: 'Khóa chặt các bó dây cáp điện và ống khí nén, ngăn giật đứt chân giắc tín hiệu',
      spec: 'Biên dạng kẹp dạng hoa sao (Star Grommet) ngàm dẻo, bảo vệ vỏ bọc ruột cáp tối đa',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kuka/83951610_R-ZL_N1_36_48.png'
    },
    {
      id: 'kuka-part-4',
      mpn: '83692464',
      name: 'KEG/K-M50',
      vnName: 'Khớp cầu bi xoay 360° bảo vệ dây M50',
      position: 'Đầu ra hộp R-Tec Box & Cùm bích trục 6',
      role: 'Triệt tiêu hoàn toàn ứng suất xoắn vặn ruột gà khi cổ tay robot quay tròn tốc độ cao',
      spec: 'Vật liệu Polyamide 6 biến tính đàn hồi chịu mài mòn, kích cỡ ren M50/P48',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kuka/83692464_KEG_K-M50.png'
    },
    {
      id: 'kuka-part-5',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp giữ chính hệ thống SH M50',
      position: 'Giá đỡ trung gian & Cổ tay',
      role: 'Đảm bảo ống luồn cố định vững chắc ở các điểm neo then chốt trên cánh tay',
      spec: 'Chất liệu Polyamide 6 gia cường sợi thủy tinh, tích hợp ngàm kim loại chống trượt',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kuka/83691501_SH_M40_M50-M.png'
    },
    {
      id: 'kuka-part-6',
      mpn: '83691264',
      name: 'PR/SV-EWX 48',
      vnName: 'Vòng đệm bảo vệ chống mòn ống M50',
      position: 'Dọc thân ống EWX (Lắp cách đều)',
      role: 'Hấp thụ va chạm và ngăn ma sát mài mòn trực tiếp giữa ống với khung thân máy KUKA',
      spec: 'Polyamide 6 biến tính đàn hồi cao, chịu nhiệt -40°C đến +100°C',
      defaultQty: 4,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kuka/83691264_PR_SV-EWX_48.png'
    },
    {
      id: 'kuka-part-7',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn sóng cao chịu uốn cực đại PA12 M50',
      position: 'Dọc toàn bộ hành trình Trục 3 -> Trục 6',
      role: 'Lớp vỏ bảo vệ chịu lực uốn động chính, chống dầu mài mòn và tia hàn xỉ dính bám',
      spec: 'Vật liệu PA12 cao cấp gân sâu, ID: 38.6mm, OD: 50.0mm, chống cháy UL94 V2',
      defaultQty: 4,
      unit: 'Mét',
      imageUrl: '/images/dresspack/kuka/83182064_EWX-PAE-M50_P48.png'
    },
    {
      id: 'kuka-part-8',
      mpn: '83697211',
      name: 'R-GP A-Profil 750-2-KUKA-1',
      vnName: 'Bản mã gá chân đế R-Tec Box KUKA Quantec',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế định vị chịu lực liên kết hộp hoàn lực R-Tec Box vững chắc với cánh tay robot',
      spec: 'Thép kết cấu sơn tĩnh điện / mạ kẽm CNC chuẩn xác theo lỗ bu lông KUKA',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kuka/83697211_R-GP_A-Profil_KUKA.png'
    },
    {
      id: 'kuka-part-9',
      mpn: '83692656',
      name: 'R-Tec Box EWX 48 MP - 100N',
      vnName: 'Hộp lò xo hồi vị hoàn lực tự động 100N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Tự động thu hồi và duy trì độ căng thẳng thớ của ống luồn khi robot vươn duỗi cánh tay',
      spec: 'Lực kéo lò xo 100N, hành trình hoàn lực 400mm, tiêu chuẩn bảo vệ công nghiệp IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kuka/83692656_R-Tec_Box_100N.png'
    }
  ]
};

export const KUKA_KR210_JUMBO_PACKAGE: DresspackPackage = {
  id: 'pkg-kuka-kr210-jumbo-70',
  packageCode: 'MS82501000000740',
  configId: '1028042',
  name: 'Gói Dresspack KUKA KR 210 R2700 - Cỡ đại Jumbo 70 (A3 sang A6)',
  robotModelId: 'kuka-kr-210-r2700',
  robotModelName: 'KUKA KR 210 R2700-2 Prime',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6 Tuyến ống Jumbo 70)',
  conduitType: 'EWX-PAE-70 Jumbo Black',
  innerDiameterMm: 64.0,
  outerDiameterMm: 70.0,
  description: 'Hệ thống xích dẫn cáp hạng nặng Jumbo 70 tích hợp Hộp hoàn lực R-Tec Box 200N cho robot KUKA KR 210. Chuyên dụng cho các trạm hàn bấm điểm (Spot Welding) xưởng thân xe VinFast và dập phôi nặng.',
  recommendedFor: 'Hàn bấm điểm xưởng thân xe (Body Shop), dập nóng dập nguội tự động & gắp khuôn đúc.',
  main3dImage: '/images/dresspack/kuka/00_Robot_Angle_1_Overview.png',
  perspectiveImages: KUKA_KR210_PACKAGE.perspectiveImages,
  parts: [
    ...KUKA_KR210_PACKAGE.parts.filter(p => p.mpn !== '83182064' && p.mpn !== '83692656'),
    {
      id: 'kuka-jumbo-box',
      mpn: '83692660',
      name: 'R-Tec Box EW/EWX 70 MP - 200N',
      vnName: 'Hộp lò xo hồi vị hoàn lực Jumbo R-Tec Box 70 MP - 200N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Hộp thu hồi lực căng lò xo siêu khỏe 200N chuyên dụng ống Jumbo 70',
      spec: 'Lực kéo 200N, hành trình hoàn lực 400mm, khung hợp kim nhôm tiêu chuẩn IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692660_R_Tec_Box_EW_EWX_70_MP___200N.png'
    },
    {
      id: 'kuka-jumbo-conduit',
      mpn: '83182080',
      name: 'EWX-PAE-70 Jumbo Black',
      vnName: 'Ống luồn Murrflex EWX-PAE-70 Jumbo Black',
      position: 'Dọc toàn bộ hành trình Trục 3 -> Trục 6',
      role: 'Ống luồn chịu uốn cỡ đại bảo vệ bó cáp hàn bấm và ống nước làm mát',
      spec: 'Polyamide 12 cao cấp, ID: 64.0mm, OD: 70.0mm, gân sóng chịu uốn cực đại',
      defaultQty: 4,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182080_EWX_PAE_70_Jumbo_Black.png'
    }
  ]
};


// 5. GÓI YASKAWA MOTOMAN GP50 - 4 GIẢI PHÁP CHÍNH HÃNG MURRPLASTIK (A3-A6 M40, A3-A6 M50, FULL ARM M50, FULL JUMBO 70)
export const YASKAWA_GP50_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp50-m40',
  packageCode: 'MS82501000000370',
  configId: '1020829',
  name: 'Gói Dresspack Yaskawa GP50 - A3 sang A6 (Chuẩn M40/P36)',
  robotModelId: 'yaskawa-gp50',
  robotModelName: 'Yaskawa MOTOMAN GP50',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M40/P36 Black',
  innerDiameterMm: 28.5,
  outerDiameterMm: 36.0,
  description: 'Hệ thống dẫn hướng và bù trừ chiều dài cáp tự động cho robot Yaskawa Motoman GP series tốc độ cao, ngăn gãy cáp tín hiệu servo và ống khí nén.',
  recommendedFor: 'Gắp thả chi tiết máy (Material Handling), dập cơ khí, cắt plasma.',
  main3dImage: '/images/dresspack/yaskawa/00_Robot_Angle_1_Overview.png',
  perspectiveImages: [
    {
      id: 'yaskawa-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/00_Robot_Angle_1_Overview.png'
    },
    {
      id: 'yaskawa-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 3-6',
      url: '/images/dresspack/yaskawa/00_Robot_Angle_2_Top.png'
    },
    {
      id: 'yaskawa-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & Spring Return',
      url: '/images/dresspack/yaskawa/00_Robot_Angle_3_Side.png'
    },
    {
      id: 'yaskawa-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/yaskawa/00_Robot_Angle_4_Wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/yaskawa_gp50_m40_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/Yaskawa/GP50/1020829_SYM_00_3K1.STP',
  parts: [
    {
      id: 'yaskawa-part-1',
      mpn: '83692772',
      name: 'Base Plate Motoman MH50-35',
      vnName: 'Bản mã gá chân đế R-Tec Box Yaskawa GP50',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế định vị chịu lực liên kết R-Tec Box với cánh tay robot Yaskawa',
      spec: 'Thép mạ kẽm CNC khoan sẵn lỗ chuẩn tâm trục Motoman GP50/MH50',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'yaskawa-part-2',
      mpn: '83692652',
      name: 'R-Tec Box EWX 36 MP - 80N',
      vnName: 'Hộp lò xo hồi vị hoàn lực tự động 80N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi tự động và duy trì lực căng cáp không đổi khi tay vươn xa',
      spec: 'Lực kéo lò xo 80N, hành trình hoàn lực 400mm, tiêu chuẩn IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692652_R_Tec_Box_EWX_36_MP___80N.png'
    },
    {
      id: 'yaskawa-part-3',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    },
    {
      id: 'yaskawa-part-4',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'yaskawa-part-5',
      mpn: '83692262',
      name: 'KEG/ZL-M40',
      vnName: 'Khớp cầu xoay kèm chặn cáp tích hợp M40',
      position: 'Khớp cổ tay Trục 6',
      role: 'Triệt tiêu lực xoắn vặn và kẹp chặn cáp đồng thời trong một kết cấu nhỏ gọn',
      spec: 'Polyamide 6, góc lắc tự do ±30°, xoay tròn 360°, cỡ ren M40/P36',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692262_KEG_ZL_M40.png'
    },
    {
      id: 'yaskawa-part-6',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp giữ chính hệ thống M40/M50',
      position: 'Giá đỡ trung gian',
      role: 'Đảm bảo ống luồn cố định vững chắc ở các điểm neo then chốt',
      spec: 'Polyamide gia cường sợi thủy tinh độ bền kéo cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'yaskawa-part-7',
      mpn: '83691262',
      name: 'PR/SV-EWX 36',
      vnName: 'Vòng đệm giảm chấn và chống mòn ống M36',
      position: 'Lắp cách đều trên thân ống EWX',
      role: 'Hấp thụ va đập và ngăn ống ma sát trực tiếp với thân robot',
      spec: 'Vật liệu đàn hồi chịu nhiệt độ cao -40°C đến +100°C',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691262_PR_SV_EWX_36.png'
    },
    {
      id: 'yaskawa-part-8',
      mpn: '83692266',
      name: 'SRF/ZL-70',
      vnName: 'Khớp lò xo giảm giật kèm chặn cáp SRF',
      position: 'Đầu vào cáp Hộp hoàn lực',
      role: 'Giảm chấn xung lực kéo đột ngột khi cánh tay gia tốc cao',
      spec: 'Vật liệu Polyamide 6 tích hợp lò xo đệm inox',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692266_SRF_ZL_70.png'
    },
    {
      id: 'yaskawa-part-9',
      mpn: '83182062',
      name: 'EWX-PAE-M40/P36 Black',
      vnName: 'Ống luồn Murrflex PA12 uốn mỏi dẻo cao M40',
      position: 'Dọc toàn bộ hành trình A3 đến A6',
      role: 'Đường ống chịu uốn chính, bảo vệ toàn diện cáp điện và ống khí nén',
      spec: 'Polyamide 12 cao cấp, ID: 28.5mm, OD: 36.0mm, độ bền uốn mỏi vượt trội',
      defaultQty: 3.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182062_EWX_PAE_M40_P36_Black.png'
    }
  ]
};

export const YASKAWA_GP50_A3_A6_M50_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp50-m50',
  packageCode: 'MS82501000000705',
  configId: '1027389',
  name: 'Gói Dresspack Yaskawa GP50 - A3 sang A6 (Chuẩn M50/P48)',
  robotModelId: 'yaskawa-gp50',
  robotModelName: 'Yaskawa MOTOMAN GP50',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 36.7,
  outerDiameterMm: 50.0,
  description: 'Gói dresspack tải trung bình - nặng đường kính lớn M50 cho robot Yaskawa Motoman GP50, tích hợp hộp hồi vị hoàn lực R-Tec Box 100N chịu tải uốn mỏi liên tục.',
  recommendedFor: 'Ứng dụng hàn hồ quang, cấp phôi máy dập, gắp thả tải trung bình & cắt kim loại.',
  main3dImage: '/images/dresspack/yaskawa/gp50_pkg_705_overview.png',
  perspectiveImages: [
    {
      id: 'yaskawa-705-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp50_pkg_705_overview.png'
    },
    {
      id: 'yaskawa-705-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 3-6',
      url: '/images/dresspack/yaskawa/gp50_pkg_705_top.png'
    },
    {
      id: 'yaskawa-705-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & Spring Return',
      url: '/images/dresspack/yaskawa/gp50_pkg_705_side.png'
    },
    {
      id: 'yaskawa-705-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/yaskawa/gp50_pkg_705_wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/yaskawa_gp50_m50_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/Yaskawa/GP50/1027389_SYM_00_3K1.STP',
  parts: [
    {
      id: 'yaskawa-705-part-1',
      mpn: '83692772',
      name: 'Base Plate Motoman MH50-35',
      vnName: 'Bản mã gá chân đế R-Tec Box Yaskawa GP50',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế định vị chịu lực liên kết R-Tec Box với cánh tay robot Yaskawa',
      spec: 'Thép mạ kẽm CNC khoan sẵn lỗ chuẩn tâm trục Motoman GP50/MH50',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'yaskawa-705-part-2',
      mpn: '83692656',
      name: 'R-Tec Box EWX 48 MP - 100N',
      vnName: 'Hộp lò xo hồi vị hoàn lực tự động 100N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi và duy trì độ căng ổn định của ống M50 khi tay vươn xa',
      spec: 'Lực kéo lò xo 100N, hành trình hoàn lực 400mm, tiêu chuẩn IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692656_R_Tec_Box_EWX_48_MP___100N.png'
    },
    {
      id: 'yaskawa-705-part-3',
      mpn: '83692266',
      name: 'SRF/ZL-70',
      vnName: 'Khớp lò xo giảm giật kèm chặn cáp SRF',
      position: 'Đầu vào cáp Hộp hoàn lực',
      role: 'Giảm chấn xung lực kéo đột ngột khi cánh tay gia tốc cao',
      spec: 'Vật liệu Polyamide 6 tích hợp lò xo đệm inox',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692266_SRF_ZL_70.png'
    },
    {
      id: 'yaskawa-705-part-4',
      mpn: '83691264',
      name: 'PR/SV-EWX 48',
      vnName: 'Vòng đệm bảo vệ chống mòn ống M50',
      position: 'Lắp cách đều trên thân ống EWX M50',
      role: 'Ngăn ma sát mài mòn giữa ống luồn và thân máy khi robot chuyển động',
      spec: 'Polyamide 6 biến tính đàn hồi chịu va đập',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691264_PR_SV_EWX_48.png'
    },
    {
      id: 'yaskawa-705-part-5',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn Murrflex PA12 chuyên dụng Robot M50',
      position: 'Dọc tuyến dẫn A3 đến A6',
      role: 'Đường ống chịu uốn chính cỡ lớn M50 cho bó dây dày',
      spec: 'Polyamide 12 cao cấp, ID: 36.7mm, OD: 50.0mm, chống cháy UL94 V2',
      defaultQty: 4,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182064_EWX_PAE_M50_P48_Black.png'
    },
    {
      id: 'yaskawa-705-part-6',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp giữ chính hệ thống M40/M50',
      position: 'Giá đỡ trung gian',
      role: 'Đảm bảo ống luồn cố định vững chắc ở các điểm neo then chốt',
      spec: 'Polyamide gia cường sợi thủy tinh độ bền kéo cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'yaskawa-705-part-7',
      mpn: '83692264',
      name: 'KEG/ZL-M50',
      vnName: 'Khớp cầu xoay kèm chặn cáp tích hợp M50',
      position: 'Khớp cổ tay Trục 6',
      role: 'Khớp cầu xoay tự do 360 độ triệt tiêu ứng suất xoắn cho ống M50',
      spec: 'Polyamide 6 biến tính, ren M50/P48',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692264_KEG_ZL_M50.png'
    },
    {
      id: 'yaskawa-705-part-8',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'yaskawa-705-part-9',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    }
  ]
};

export const YASKAWA_GP50_FULL_M50_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp50-full-m50',
  packageCode: 'MS82501000000226',
  configId: '1017053',
  name: 'Gói Dresspack Yaskawa GP50 - Toàn thân A1-A3 & A3-A6 (Chuẩn M50/P48)',
  robotModelId: 'yaskawa-gp50',
  robotModelName: 'Yaskawa MOTOMAN GP50',
  travelRange: 'Trục 1 lên Trục 3 & Trục 3 ra Trục 6 (A1-A3 / A3-A6 Toàn diện)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 36.7,
  outerDiameterMm: 50.0,
  description: 'Giải pháp bảo vệ toàn diện khép kín từ chân bệ Trục 1 qua khớp vai Trục 2/3 lên cổ tay Trục 6. Đi kèm bộ bản mã gá chuyên dụng R-MP-S cho từng khớp trục Yaskawa GP50.',
  recommendedFor: 'Dây chuyền tự động hóa chuyển động phức tạp, robot quay 360 độ liên tục, môi trường bụi bẩn & bắn tóe xỉ hàn.',
  main3dImage: '/images/dresspack/yaskawa/gp50_pkg_226_overview.png',
  perspectiveImages: [
    {
      id: 'yaskawa-226-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp50_pkg_226_overview.png'
    },
    {
      id: 'yaskawa-226-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 1-6',
      url: '/images/dresspack/yaskawa/gp50_pkg_226_top.png'
    },
    {
      id: 'yaskawa-226-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & Dual Line',
      url: '/images/dresspack/yaskawa/gp50_pkg_226_side.png'
    },
    {
      id: 'yaskawa-226-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/yaskawa/gp50_pkg_226_wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/yaskawa_gp50_full_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/Yaskawa/GP50/1017053_SYM_00_3K1.STP',
  parts: [
    {
      id: 'yaskawa-226-part-1',
      mpn: '83697130',
      name: 'R-MP-S-A1-1 Yaskawa GP50',
      vnName: 'Bản mã gá chân đế Trục 1 R-MP-S-A1-1',
      position: 'Trục 1 (Axis 1 Base)',
      role: 'Đế gá chịu lực cố định ống luồn tại chân đế robot GP50',
      spec: 'Thép kết cấu mạ kẽm CNC chuẩn tâm trục GP50',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697130_R_MP_S_A1_1_Yaskawa_GP50.png'
    },
    {
      id: 'yaskawa-226-part-2',
      mpn: '83697131',
      name: 'R-MP-S-A2-1 Yaskawa GP50',
      vnName: 'Bản mã gá cánh tay Trục 2 R-MP-S-A2-1',
      position: 'Trục 2 (Axis 2 Lower Arm)',
      role: 'Đế định vị dẫn hướng cáp dọc thân cánh tay dưới Trục 2',
      spec: 'Thép kết cấu mạ kẽm chống rung động mạnh',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697131_R_MP_S_A2_1_Yaskawa_GP50.png'
    },
    {
      id: 'yaskawa-226-part-3',
      mpn: '83692768',
      name: 'Halteblech Achse 3',
      vnName: 'Bản mã kẹp giữ Trục 3 (Halteblech Achse 3)',
      position: 'Trục 3 (Axis 3 Junction)',
      role: 'Bản thép gia cố liên kết ống luồn từ trục 2 vào trục 3',
      spec: 'Thép mạ kẽm gia công CNC khoan lỗ chuẩn Motoman',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692768_Halteblech_Achse_3.png'
    },
    {
      id: 'yaskawa-226-part-4',
      mpn: '83692772',
      name: 'Base Plate Motoman MH50-35',
      vnName: 'Bản mã gá chân đế R-Tec Box Yaskawa GP50',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế định vị chịu lực liên kết R-Tec Box với cánh tay robot Yaskawa',
      spec: 'Thép mạ kẽm CNC khoan sẵn lỗ chuẩn tâm trục Motoman GP50/MH50',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'yaskawa-226-part-5',
      mpn: '83692656',
      name: 'R-Tec Box EWX 48 MP - 100N',
      vnName: 'Hộp lò xo hồi vị hoàn lực tự động 100N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi tự động và duy trì lực căng cáp không đổi khi tay vươn xa',
      spec: 'Lực kéo lò xo 100N, hành trình hoàn lực 400mm, tiêu chuẩn IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692656_R_Tec_Box_EWX_48_MP___100N.png'
    },
    {
      id: 'yaskawa-226-part-6',
      mpn: '83691460',
      name: 'SH-P / M40-M50',
      vnName: 'Cùm kẹp đế gá định vị SH-P M40-M50',
      position: 'Trục 1 & Trục 2',
      role: 'Cố định tuyến cáp chắc chắn dọc chân bệ và cánh tay dưới',
      spec: 'Polyamide 6 gia cường thép mạ kẽm',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691460_SH_P___M40_M50.png'
    },
    {
      id: 'yaskawa-226-part-7',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp giữ chính hệ thống M40/M50',
      position: 'Giá đỡ trung gian',
      role: 'Đảm bảo ống luồn cố định vững chắc ở các điểm neo then chốt',
      spec: 'Polyamide gia cường sợi thủy tinh độ bền kéo cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'yaskawa-226-part-8',
      mpn: '83691664',
      name: 'KMG/F-M50',
      vnName: 'Đế bích xoay dẫn hướng KMG/F-M50',
      position: 'Trục 2 sang Trục 3',
      role: 'Khớp nối xoay linh hoạt cho phép ống uốn chuyển hướng qua trục 2',
      spec: 'Hợp kim nhôm & PA6 kỹ thuật cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691664_KMG_F_M50.png'
    },
    {
      id: 'yaskawa-226-part-9',
      mpn: '83692464',
      name: 'KEG/K-M50',
      vnName: 'Khớp cầu bi xoay 360° bảo vệ dây M50',
      position: 'Đầu ra hộp R-Tec Box & Cổ tay',
      role: 'Triệt tiêu hoàn toàn góc xoắn vặn của ruột gà khi cổ tay quay',
      spec: 'Polyamide 6 đàn hồi cao, cỡ ren M50/P48',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692464_KEG_K_M50.png'
    },
    {
      id: 'yaskawa-226-part-10',
      mpn: '83691264',
      name: 'PR/SV-EWX 48',
      vnName: 'Vòng đệm bảo vệ chống mòn ống M50',
      position: 'Lắp cách đều trên thân ống EWX',
      role: 'Hấp thụ va chạm và ngăn mài mòn thân máy',
      spec: 'Polyamide 6 chịu va đập cơ học cao',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691264_PR_SV_EWX_48.png'
    },
    {
      id: 'yaskawa-226-part-11',
      mpn: '83951610',
      name: 'R-ZL/N1 36/48',
      vnName: 'Tấm kẹp chặn lực căng cáp Star Grommet R-ZL 36/48',
      position: 'Hai đầu cố định cáp Trục 1 & Trục 6',
      role: 'Kẹp giữ chặt từng sợi cáp điện và ống khí, chống tụt giắc nối',
      spec: 'Ngàm kẹp răng cưa dạng sao đàn hồi bảo vệ vỏ cáp',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83951610_R_ZL_N1_36_48.png'
    },
    {
      id: 'yaskawa-226-part-12',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'yaskawa-226-part-13',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    },
    {
      id: 'yaskawa-226-part-14',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn Murrflex PA12 chuyên dụng Robot M50',
      position: 'Dọc toàn bộ hành trình A1 đến A6',
      role: 'Đường ống chịu uốn chính, bảo vệ toàn diện cáp điện và ống khí nén',
      spec: 'Polyamide 12 cao cấp, ID: 36.7mm, OD: 50.0mm, độ bền uốn mỏi vượt trội',
      defaultQty: 5.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182064_EWX_PAE_M50_P48_Black.png'
    }
  ]
};

export const YASKAWA_GP50_FULL_JUMBO_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp50-jumbo-70',
  packageCode: 'MS82501000000858',
  configId: '1031337',
  name: 'Gói Dresspack Yaskawa GP50 - Cỡ đại Jumbo 70 (A1-A3 / A3-A6)',
  robotModelId: 'yaskawa-gp50',
  robotModelName: 'Yaskawa MOTOMAN GP50',
  travelRange: 'Trục 1 ra Trục 6 (Toàn tuyến ống cỡ đại Jumbo 70)',
  conduitType: 'EWX-PAE-70 Jumbo Black',
  innerDiameterMm: 64.0,
  outerDiameterMm: 70.0,
  description: 'Hệ thống dresspack tải cực nặng cỡ đại Jumbo 70 với hộp hồi vị lực kéo lò xo 200N và khung nhôm định hình 750mm. Đảm bảo sức chứa an toàn tuyệt đối cho bó cáp động lực servo và đường ống khí nén công suất lớn.',
  recommendedFor: 'Hàn bấm điểm (Spot Welding), đúc áp lực, vận chuyển vật nặng & cấp phôi tự động nhiều công đoạn đồng thời.',
  main3dImage: '/images/dresspack/yaskawa/gp50_pkg_858_overview.png',
  perspectiveImages: [
    {
      id: 'yaskawa-858-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp50_pkg_858_overview.png'
    },
    {
      id: 'yaskawa-858-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 1-6',
      url: '/images/dresspack/yaskawa/gp50_pkg_858_top.png'
    },
    {
      id: 'yaskawa-858-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & 200N Box',
      url: '/images/dresspack/yaskawa/gp50_pkg_858_side.png'
    },
    {
      id: 'yaskawa-858-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/yaskawa/gp50_pkg_858_wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/yaskawa_gp50_jumbo_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/Yaskawa/GP50/1031337_SYM_00_3K1.STP',
  parts: [
    {
      id: 'yaskawa-858-part-1',
      mpn: '83692660',
      name: 'R-Tec Box EW/EWX 70 MP - 200N',
      vnName: 'Hộp lò xo hồi vị hoàn lực Jumbo R-Tec Box 70 MP - 200N',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Hộp thu hồi lực căng lò xo siêu khỏe 200N chuyên dụng ống Jumbo 70',
      spec: 'Lực kéo 200N, hành trình hoàn lực 400mm, khung hợp kim nhôm tiêu chuẩn IP65',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692660_R_Tec_Box_EW_EWX_70_MP___200N.png'
    },
    {
      id: 'yaskawa-858-part-2',
      mpn: '83697246',
      name: 'R-GP A-Profil 750-2-Yaskawa-1',
      vnName: 'Thanh giàn nhôm chịu lực R-GP A-Profil 750-2-Yaskawa-1',
      position: 'Dọc lưng Trục 2/3 Robot Yaskawa',
      role: 'Khung giàn chịu lực chính đỡ toàn bộ hệ thống R-Tec Box Jumbo 200N',
      spec: 'Nhôm định hình kết cấu chịu tải nặng chiều dài 750mm',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697246_R_GP_A_Profil_750_2_Yaskawa_1.png'
    },
    {
      id: 'yaskawa-858-part-3',
      mpn: '83697241',
      name: 'R-MP A-Profil 200-1',
      vnName: 'Thanh nhôm profile gá lắp R-MP A-Profil 200-1',
      position: 'Trục 3 (Axis 3 Mounting Bracket)',
      role: 'Giá đỡ kéo dài tùy biến vị trí lắp hộp R-Tec Box',
      spec: 'Nhôm định hình anodize chiều dài 200mm',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83697241_R_MP_A_Profil_200_1.png'
    },
    {
      id: 'yaskawa-858-part-4',
      mpn: '83697130',
      name: 'R-MP-S-A1-1 Yaskawa GP50',
      vnName: 'Bản mã gá chân đế Trục 1 R-MP-S-A1-1 Yaskawa GP50',
      position: 'Trục 1 (Axis 1 Base)',
      role: 'Đế gá chịu lực cố định ống luồn tại chân đế robot GP50',
      spec: 'Thép kết cấu mạ kẽm CNC chuẩn tâm trục GP50',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697130_R_MP_S_A1_1_Yaskawa_GP50.png'
    },
    {
      id: 'yaskawa-858-part-5',
      mpn: '83697131',
      name: 'R-MP-S-A2-1 Yaskawa GP50',
      vnName: 'Bản mã gá cánh tay Trục 2 R-MP-S-A2-1 Yaskawa GP50',
      position: 'Trục 2 (Axis 2 Lower Arm)',
      role: 'Đế định vị dẫn hướng cáp dọc thân cánh tay dưới Trục 2',
      spec: 'Thép kết cấu mạ kẽm chống rung động mạnh',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697131_R_MP_S_A2_1_Yaskawa_GP50.png'
    },
    {
      id: 'yaskawa-858-part-6',
      mpn: '83697239',
      name: 'Alu Profil-Winkel 30x30 Nut8 - M8',
      vnName: 'Ke góc nhôm định hình 30x30 Nut8 - M8',
      position: 'Khung giàn gá R-Tec Box',
      role: 'Liên kết chắc chắn các thanh nhôm profile định hình',
      spec: 'Nhôm đúc áp lực cao, ren bu lông M8',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83697239_Alu_Profil_Winkel_30x30_Nut8___M8.png'
    },
    {
      id: 'yaskawa-858-part-7',
      mpn: '83697226',
      name: 'Aluprofil-Nutenstein 8 mit Feder M8',
      vnName: 'Con trượt rãnh nhôm Nutenstein 8 có lò xo M8',
      position: 'Rãnh thanh nhôm profile',
      role: 'Bu lông trượt định vị chống xoay khi xiết lực mạnh',
      spec: 'Thép mạ kẽm ren M8 tích hợp bi lò xo định vị',
      defaultQty: 6,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83697226_Aluprofil_Nutenstein_8_mit_Feder_M8.png'
    },
    {
      id: 'yaskawa-858-part-8',
      mpn: '83691490',
      name: 'SH 56/70',
      vnName: 'Cùm kẹp giữ chính hệ thống SH 56/70',
      position: 'Dọc thân robot Trục 1 - Trục 3',
      role: 'Cùm kẹp chịu lực cho ống luồn cỡ đại OD 70mm',
      spec: 'PA6 biến tính gia cường sợi thủy tinh',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691490_SH_56_70.png'
    },
    {
      id: 'yaskawa-858-part-9',
      mpn: '83691502',
      name: 'SH 56/70-M',
      vnName: 'Cùm kẹp giữ SH 56/70-M',
      position: 'Khung nhôm định hình',
      role: 'Khóa ống luồn vào khung nhôm chịu lực',
      spec: 'Polyamide gia cường ngàm kim loại M8',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691502_SH_56_70_M.png'
    },
    {
      id: 'yaskawa-858-part-10',
      mpn: '83692468',
      name: 'KEG/K-70',
      vnName: 'Khớp cầu bi xoay 360° KEG/K-70',
      position: 'Đầu ra Hộp R-Tec Box 70',
      role: 'Triệt tiêu momen xoắn cho ống luồn cỡ đại Jumbo 70',
      spec: 'Polyamide gia cường kích thước ren 70',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692468_KEG_K_70.png'
    },
    {
      id: 'yaskawa-858-part-11',
      mpn: '83692480',
      name: 'KEG/AK-70',
      vnName: 'Khớp cầu bi xoay góc kèm bích KEG/AK-70',
      position: 'Cổ tay Trục 6',
      role: 'Khớp cầu góc thoát cáp chuyển hướng linh hoạt cho ống Jumbo 70',
      spec: 'Polyamide 6 kết hợp bích kim loại',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692480_KEG_AK_70.png'
    },
    {
      id: 'yaskawa-858-part-12',
      mpn: '83692292',
      name: 'SRF-70',
      vnName: 'Khớp đệm lò xo giảm chấn SRF-70',
      position: 'Đầu vào ống luồn',
      role: 'Giảm xung lực đột ngột khi robot tăng tốc tối đa',
      spec: 'Tích hợp lò xo thép không gỉ đàn hồi cao',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692292_SRF_70.png'
    },
    {
      id: 'yaskawa-858-part-13',
      mpn: '83692802',
      name: 'V-ZLT-70',
      vnName: 'Thanh kẹp căng cáp V-ZLT-70',
      position: 'Cụm thoát cáp Trục 1 & Hộp hoàn lực',
      role: 'Giữ thẳng hàng và phân luồng các sợi cáp tiết diện lớn',
      spec: 'Nhôm định hình anodize cao cấp',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692802_V_ZLT_70.png'
    },
    {
      id: 'yaskawa-858-part-14',
      mpn: '83692806',
      name: 'ZS-70',
      vnName: 'Cụm chặn kéo căng ZS-70',
      position: 'Điểm neo đầu cuối ống Jumbo',
      role: 'Cố định chắc chắn đầu ống 70 vào mặt bích công cụ',
      spec: 'Polyamide 6 độ bền cơ học cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692806_ZS_70.png'
    },
    {
      id: 'yaskawa-858-part-15',
      mpn: '83691267',
      name: 'PR/SV-UNI 70 Black',
      vnName: 'Vòng đệm bảo vệ chống mòn PR/SV-UNI 70 Black',
      position: 'Dọc thân ống EWX 70',
      role: 'Bảo vệ thành ống 70 chống va đập trực tiếp vào cánh tay robot',
      spec: 'Polyamide chịu va đập cơ học cao',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691267_PR_SV_UNI_70_Black.png'
    },
    {
      id: 'yaskawa-858-part-16',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'yaskawa-858-part-17',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    },
    {
      id: 'yaskawa-858-part-18',
      mpn: '83182080',
      name: 'EWX-PAE-70 Jumbo Black',
      vnName: 'Ống luồn Murrflex EWX-PAE-70 Jumbo Black',
      position: 'Dọc toàn bộ hành trình A1 - A6',
      role: 'Ống luồn cỡ đại bảo vệ bó cáp cực dày cho ứng dụng tải nặng',
      spec: 'Polyamide 12 cao cấp, ID: 64.0mm, OD: 70.0mm, gân sóng chịu uốn cực đại',
      defaultQty: 5.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182080_EWX_PAE_70_Jumbo_Black.png'
    }
  ]
};


// 5.5. CÁC GÓI CẤU HÌNH YASKAWA MOTOMAN GP180 (4 GÓI CHUẨN MURRPLASTIK)
export const YASKAWA_GP180_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp180-m50',
  packageCode: 'MS82501000000227',
  cadPdfUrl: '/documents/cad/yaskawa_gp50_m50_cad.pdf',
  configId: '1020829',
  name: 'Gói Dresspack Yaskawa GP180 - A3 sang A6 (Chuẩn M50/P48)',
  robotModelId: 'yaskawa-gp180',
  robotModelName: 'Yaskawa MOTOMAN GP180',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 36.7,
  outerDiameterMm: 50.0,
  description: 'Hệ thống dẫn hướng và bảo vệ cáp tải nặng A3-A6 cho Yaskawa MOTOMAN GP180, tích hợp hộp hoàn lực hồi chuyển R-Tec Box 100N. Thiết kế tối ưu cho dây chuyền gắp tải nặng, dập kim loại và hàn bấm spot welding.',
  recommendedFor: 'Hàn điểm (Spot Welding), đúc dập kim loại tải nặng 180kg, gắp phôi CNC cỡ lớn.',
  main3dImage: '/images/dresspack/yaskawa/gp180_pkg_227_overview.png',
  perspectiveImages: [
    {
      id: 'gp180-227-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp180_pkg_227_overview.png'
    },
    {
      id: 'gp180-227-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Top Plan View',
      url: '/images/dresspack/yaskawa/gp180_pkg_227_overview.png'
    },
    {
      id: 'gp180-227-ang-3',
      label: 'Góc nhìn ngang thân (Side View)',
      angle: 'Lateral View',
      url: '/images/dresspack/yaskawa/gp180_pkg_227_overview.png'
    },
    {
      id: 'gp180-227-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/yaskawa/gp180_pkg_227_overview.png'
    }
  ],
  parts: [
    {
      id: 'gp180-227-part-1',
      mpn: '83692772',
      name: 'R-MP Base Plate Yaskawa MH180/GP180',
      vnName: 'Bản mã gá Hộp R-Tec Box trên Trục 3 Yaskawa GP180',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế gá chịu lực cố định Hộp R-Tec Box vào thân robot GP180',
      spec: 'Hợp kim nhôm Anodize CNC độ bền cao',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'gp180-227-part-2',
      mpn: '83692656',
      name: 'R-Tec Box 100N - M50',
      vnName: 'Hộp hoàn lực tự động R-Tec Box 100N (Cỡ M50)',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi cáp tự động hành trình 350mm, bảo vệ ruột gà uốn mỏi',
      spec: 'Lực kéo đàn hồi 100N, vỏ composite chịu nhiệt và tia lửa hàn',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692656_R_Tec_Box_EWX_48_MP___100N.png'
    },
    {
      id: 'gp180-227-part-3',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    },
    {
      id: 'gp180-227-part-4',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'gp180-227-part-5',
      mpn: '83692264',
      name: 'KEG/ZL-M50',
      vnName: 'Khớp cầu xoay kèm chặn cáp KEG/ZL-M50',
      position: 'Cổ tay Trục 6 & Đầu ra R-Tec Box',
      role: 'Khớp cầu xoay 360 độ triệt tiêu xoắn vặn và giữ chặn cố định cáp',
      spec: 'Polyamide 6, góc xoay tự do ±30°, kích cỡ M50',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692264_KEG_ZL_M50.png'
    },
    {
      id: 'gp180-227-part-6',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp dẫn hướng ống luồn SH M40/M50-M',
      position: 'Khớp xoay và tay đỡ',
      role: 'Cố định ống luồn vào các điểm gá đỡ trung gian',
      spec: 'Polyamide 6 biến tính dẻo chịu va đập cơ học cao',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'gp180-227-part-7',
      mpn: '83691264',
      name: 'PR/SV-EWX 48',
      vnName: 'Vòng đệm bảo vệ chống mòn PR/SV-EWX 48',
      position: 'Thân ống luồn EWX-PAE',
      role: 'Chống ma sát mài mòn thân ống khi cọ sát với thân robot',
      spec: 'Polyamide 6 chịu mài mòn cao, màu đen',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691264_PR_SV_EWX_48.png'
    },
    {
      id: 'gp180-227-part-8',
      mpn: '83692266',
      name: 'SRF/ZL-70',
      vnName: 'Khớp đệm lò xo chống giật SRF/ZL-70',
      position: 'Đầu vào ống luồn tại R-Tec Box',
      role: 'Hấp thụ xung chấn kéo giật đột ngột khi robot đảo chiều tốc độ cao',
      spec: 'Tích hợp lò xo thép không gỉ đàn hồi cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692266_SRF_ZL_70.png'
    },
    {
      id: 'gp180-227-part-9',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn Murrflex chuyên dụng Robot EWX-PAE-M50',
      position: 'Hành trình A3 - A6',
      role: 'Bảo vệ đường cáp servo, encoder và khí nén tải nặng 180kg',
      spec: 'Polyamide 12 cao cấp, ID: 36.7mm, OD: 50.0mm, uốn mỏi > 5 triệu chu kỳ',
      defaultQty: 3.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182064_EWX_PAE_M50_P48_Black.png'
    }
  ]
};

export const YASKAWA_GP180_M40_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp180-m40',
  packageCode: 'MS82501000000729',
  cadPdfUrl: '/documents/cad/yaskawa_gp50_m40_cad.pdf',
  configId: '1020828',
  name: 'Gói Dresspack Yaskawa GP180 - A3 sang A6 (Chuẩn M40/P36)',
  robotModelId: 'yaskawa-gp180',
  robotModelName: 'Yaskawa MOTOMAN GP180',
  travelRange: 'Trục 3 ra Trục 6 (A3 - A6)',
  conduitType: 'EWX-PAE-M40/P36 Black',
  innerDiameterMm: 28.5,
  outerDiameterMm: 36.0,
  description: 'Cấu hình ruột gà M40 nhỏ gọn cho các cụm gắp gá chi tiết nhẹ hoặc đường khí nén tiêu chuẩn trên robot Yaskawa GP180. Hộp hoàn lực R-Tec Box 80N vận hành êm ái.',
  recommendedFor: 'Gắp thả phôi tiêu chuẩn, đánh bóng, mài ba via kim loại.',
  main3dImage: '/images/dresspack/yaskawa/gp180_pkg_729_overview.png',
  perspectiveImages: [
    {
      id: 'gp180-729-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp180_pkg_729_overview.png'
    },
    {
      id: 'gp180-729-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Top Plan View',
      url: '/images/dresspack/yaskawa/gp180_pkg_729_overview.png'
    },
    {
      id: 'gp180-729-ang-3',
      label: 'Góc nhìn ngang thân (Side View)',
      angle: 'Lateral View',
      url: '/images/dresspack/yaskawa/gp180_pkg_729_overview.png'
    },
    {
      id: 'gp180-729-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Tool Flange',
      url: '/images/dresspack/yaskawa/gp180_pkg_729_overview.png'
    }
  ],
  parts: [
    {
      id: 'gp180-729-part-1',
      mpn: '83692772',
      name: 'R-MP Base Plate Yaskawa MH180/GP180',
      vnName: 'Bản mã gá Hộp R-Tec Box trên Trục 3 Yaskawa GP180',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế gá chịu lực cố định Hộp R-Tec Box vào thân robot GP180',
      spec: 'Hợp kim nhôm Anodize CNC độ bền cao',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'gp180-729-part-2',
      mpn: '83692652',
      name: 'R-Tec Box 80N - M40',
      vnName: 'Hộp hoàn lực tự động R-Tec Box 80N (Cỡ M40)',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi cáp tự động hành trình 350mm, bảo vệ ruột gà uốn mỏi',
      spec: 'Lực kéo đàn hồi 80N, vỏ composite chịu nhiệt',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692652_R_Tec_Box_EWX_36_MP___80N.png'
    },
    {
      id: 'gp180-729-part-3',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    },
    {
      id: 'gp180-729-part-4',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'gp180-729-part-5',
      mpn: '83692262',
      name: 'KEG/ZL-M40',
      vnName: 'Khớp cầu xoay kèm chặn cáp KEG/ZL-M40',
      position: 'Cổ tay Trục 6 & Đầu ra R-Tec Box',
      role: 'Khớp cầu xoay 360 độ triệt tiêu xoắn vặn và giữ chặn cố định cáp',
      spec: 'Polyamide 6, góc xoay tự do ±30°, kích cỡ M40',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692262_KEG_ZL_M40.png'
    },
    {
      id: 'gp180-729-part-6',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp dẫn hướng ống luồn SH M40/M50-M',
      position: 'Khớp xoay và tay đỡ',
      role: 'Cố định ống luồn vào các điểm gá đỡ trung gian',
      spec: 'Polyamide 6 biến tính dẻo chịu va đập cơ học cao',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'gp180-729-part-7',
      mpn: '83691262',
      name: 'PR/SV 36',
      vnName: 'Vòng đệm bảo vệ chống mòn PR/SV 36',
      position: 'Thân ống luồn EWX-PAE',
      role: 'Chống ma sát mài mòn thân ống khi cọ sát với thân robot',
      spec: 'Polyamide 6 chịu mài mòn cao, màu đen',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691262_PR_SV_EWX_36.png'
    },
    {
      id: 'gp180-729-part-8',
      mpn: '83692266',
      name: 'SRF/ZL-70',
      vnName: 'Khớp đệm lò xo chống giật SRF/ZL-70',
      position: 'Đầu vào ống luồn tại R-Tec Box',
      role: 'Hấp thụ xung chấn kéo giật đột ngột khi robot đảo chiều tốc độ cao',
      spec: 'Tích hợp lò xo thép không gỉ đàn hồi cao',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692266_SRF_ZL_70.png'
    },
    {
      id: 'gp180-729-part-9',
      mpn: '83182062',
      name: 'EWX-PAE-M40/P36 Black',
      vnName: 'Ống luồn Murrflex chuyên dụng Robot EWX-PAE-M40',
      position: 'Hành trình A3 - A6',
      role: 'Bảo vệ đường cáp servo, encoder và khí nén tiêu chuẩn',
      spec: 'Polyamide 12 cao cấp, ID: 28.5mm, OD: 36.0mm, uốn mỏi > 5 triệu chu kỳ',
      defaultQty: 3.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182062_EWX_PAE_M40_P36_Black.png'
    }
  ]
};

export const YASKAWA_GP180_FULL_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp180-full',
  packageCode: 'MS82501000000584',
  cadPdfUrl: '/documents/cad/yaskawa_gp50_full_cad.pdf',
  configId: '1017053',
  name: 'Gói Dresspack Yaskawa GP180-120 - Toàn thân Full Arm A1 sang A6 (Chuẩn M50)',
  robotModelId: 'yaskawa-gp180',
  robotModelName: 'Yaskawa MOTOMAN GP180',
  travelRange: 'Trục 1 ra Trục 6 (A1 - A6 Toàn thân)',
  conduitType: 'EWX-PAE-M50/P48 Black',
  innerDiameterMm: 36.7,
  outerDiameterMm: 50.0,
  description: 'Giải pháp bảo vệ toàn diện dẫn cáp từ chân đế Trục 1 qua thân Trục 2/3 lên cổ tay Trục 6 của GP180. Trang bị đầy đủ bản mã gá bắt cáp chịu lực, cùm kẹp dẫn hướng và hộp thu hồi cáp hồi chuyển.',
  recommendedFor: 'Dây chuyền tích hợp cấp nguồn trọn gói từ sàn nhà xưởng lên tay máy GP180.',
  main3dImage: '/images/dresspack/yaskawa/gp180_pkg_584_overview.png',
  perspectiveImages: [
    {
      id: 'gp180-584-ang-1',
      label: 'Tổng quan toàn thân (Full Arm Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp180_pkg_584_overview.png'
    },
    {
      id: 'gp180-584-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Top Plan View',
      url: '/images/dresspack/yaskawa/gp180_pkg_584_overview.png'
    },
    {
      id: 'gp180-584-ang-3',
      label: 'Góc nhìn ngang thân (Side View)',
      angle: 'Lateral View Axis 1-6',
      url: '/images/dresspack/yaskawa/gp180_pkg_584_overview.png'
    },
    {
      id: 'gp180-584-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Flange',
      url: '/images/dresspack/yaskawa/gp180_pkg_584_overview.png'
    }
  ],
  parts: [
    {
      id: 'gp180-584-part-1',
      mpn: '83697130',
      name: 'R-MP-S-A1-1 Yaskawa GP180',
      vnName: 'Bản mã gá chân đế Trục 1 R-MP-S-A1-1 Yaskawa GP180',
      position: 'Trục 1 (Axis 1 Base)',
      role: 'Đế gá chịu lực cố định ống luồn tại chân đế robot GP180',
      spec: 'Thép kết cấu mạ kẽm CNC chuẩn tâm trục GP180',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697130_R_MP_S_A1_1_Yaskawa_GP50.png'
    },
    {
      id: 'gp180-584-part-2',
      mpn: '83697131',
      name: 'R-MP-S-A2-1 Yaskawa GP180',
      vnName: 'Bản mã gá cánh tay Trục 2 R-MP-S-A2-1 Yaskawa GP180',
      position: 'Trục 2 (Axis 2 Lower Arm)',
      role: 'Đế định vị dẫn hướng cáp dọc thân cánh tay dưới Trục 2',
      spec: 'Thép kết cấu mạ kẽm chống rung động mạnh',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83697131_R_MP_S_A2_1_Yaskawa_GP50.png'
    },
    {
      id: 'gp180-584-part-3',
      mpn: '83692772',
      name: 'R-MP Base Plate Yaskawa MH180/GP180',
      vnName: 'Bản mã gá Hộp R-Tec Box trên Trục 3 Yaskawa GP180',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế gá chịu lực cố định Hộp R-Tec Box vào thân robot GP180',
      spec: 'Hợp kim nhôm Anodize CNC độ bền cao',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'gp180-584-part-4',
      mpn: '83692656',
      name: 'R-Tec Box 100N - M50',
      vnName: 'Hộp hoàn lực tự động R-Tec Box 100N (Cỡ M50)',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Thu hồi cáp tự động hành trình 350mm, bảo vệ ruột gà uốn mỏi',
      spec: 'Lực kéo đàn hồi 100N, vỏ composite chịu nhiệt',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692656_R_Tec_Box_EWX_48_MP___100N.png'
    },
    {
      id: 'gp180-584-part-5',
      mpn: '83952626',
      name: 'R-SSR 100-1 - A',
      vnName: 'Cùm căng định vị ống luồn cổ tay trục 4/5',
      position: 'Trục 4 & 5 (Wrist Arm)',
      role: 'Dẫn hướng ống cong ôm sát cánh tay theo quỹ đạo chuyển động',
      spec: 'Đường kính kẹp 100mm, nhôm đúc chịu mỏi uốn động lực học',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952626_R_SSR_100_1___A.png'
    },
    {
      id: 'gp180-584-part-6',
      mpn: '83952614',
      name: 'R-FKE 32',
      vnName: 'Cùm bích liên kết cổ tay trục 6',
      position: 'Trục 6 (Axis 6 Flange Tool)',
      role: 'Điểm neo kết thúc khóa ống luồn cáp vào đầu súng hàn/kẹp gắp',
      spec: 'Khớp bích tiêu chuẩn ISO 9409-1-A, hợp kim nhôm Anodize',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83952614_R_FKE_32.png'
    },
    {
      id: 'gp180-584-part-7',
      mpn: '83692264',
      name: 'KEG/ZL-M50',
      vnName: 'Khớp cầu xoay kèm chặn cáp KEG/ZL-M50',
      position: 'Cổ tay Trục 6 & Đầu ra R-Tec Box',
      role: 'Khớp cầu xoay 360 độ triệt tiêu xoắn vặn và giữ chặn cố định cáp',
      spec: 'Polyamide 6, góc xoay tự do ±30°, kích cỡ M50',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692264_KEG_ZL_M50.png'
    },
    {
      id: 'gp180-584-part-8',
      mpn: '83691501',
      name: 'SH M40/M50-M',
      vnName: 'Cùm kẹp dẫn hướng ống luồn SH M40/M50-M',
      position: 'Trục 1, 2 và khung gá',
      role: 'Cố định ống luồn vào các điểm gá đỡ trung gian dọc thân robot',
      spec: 'Polyamide 6 biến tính dẻo chịu va đập cơ học cao',
      defaultQty: 4,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691501_SH_M40_M50_M.png'
    },
    {
      id: 'gp180-584-part-9',
      mpn: '83691264',
      name: 'PR/SV-EWX 48',
      vnName: 'Vòng đệm bảo vệ chống mòn PR/SV-EWX 48',
      position: 'Thân ống luồn EWX-PAE',
      role: 'Chống ma sát mài mòn thân ống khi cọ sát với thân robot',
      spec: 'Polyamide 6 chịu mài mòn cao, màu đen',
      defaultQty: 5,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691264_PR_SV_EWX_48.png'
    },
    {
      id: 'gp180-584-part-10',
      mpn: '83182064',
      name: 'EWX-PAE-M50/P48 Black',
      vnName: 'Ống luồn Murrflex chuyên dụng Robot EWX-PAE-M50',
      position: 'Toàn thân hành trình A1 - A6',
      role: 'Bảo vệ đường cáp servo, encoder và khí nén tải nặng 180kg',
      spec: 'Polyamide 12 cao cấp, ID: 36.7mm, OD: 50.0mm, uốn mỏi > 5 triệu chu kỳ',
      defaultQty: 5.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182064_EWX_PAE_M50_P48_Black.png'
    }
  ]
};

export const YASKAWA_GP180_JUMBO_PACKAGE: DresspackPackage = {
  id: 'pkg-yaskawa-gp180-jumbo',
  packageCode: 'MS82501000000789',
  cadPdfUrl: '/documents/cad/yaskawa_gp50_jumbo_cad.pdf',
  configId: '1031337',
  name: 'Gói Dresspack Yaskawa GP180 Heavy Duty - Jumbo 70mm (A1 sang A6)',
  robotModelId: 'yaskawa-gp180',
  robotModelName: 'Yaskawa MOTOMAN GP180',
  travelRange: 'Trục 1 ra Trục 6 (A1 - A6 Full Arm Jumbo)',
  conduitType: 'EWX-PAE-70 Jumbo Black',
  innerDiameterMm: 64.0,
  outerDiameterMm: 70.0,
  description: 'Cấu hình công nghiệp nặng kích thước siêu lớn Jumbo 70mm, hộp hoàn lực cực đại R-Tec Box 200N kết hợp hệ giàn nhôm định hình gia cường. Cho phép luồn các bó cáp nguồn súng hàn servo cực đại và đường nước làm mát công suất cao.',
  recommendedFor: 'Trạm hàn bấm thân xe tự động (Automotive Spot Welding Gun) với bó dây cấp nguồn cực lớn.',
  main3dImage: '/images/dresspack/yaskawa/gp180_pkg_789_overview.png',
  perspectiveImages: [
    {
      id: 'gp180-789-ang-1',
      label: 'Tổng quan hệ thống Jumbo 70 (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/yaskawa/gp180_pkg_789_overview.png'
    },
    {
      id: 'gp180-789-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Top Plan View',
      url: '/images/dresspack/yaskawa/gp180_pkg_789_overview.png'
    },
    {
      id: 'gp180-789-ang-3',
      label: 'Góc nhìn ngang thân (Side View)',
      angle: 'Lateral View & Alu Bar',
      url: '/images/dresspack/yaskawa/gp180_pkg_789_overview.png'
    },
    {
      id: 'gp180-789-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Flange Tool',
      url: '/images/dresspack/yaskawa/gp180_pkg_789_overview.png'
    }
  ],
  parts: [
    {
      id: 'gp180-789-part-1',
      mpn: '83692772',
      name: 'R-MP Base Plate Yaskawa MH180/GP180',
      vnName: 'Bản mã gá Hộp R-Tec Box trên Trục 3 Yaskawa GP180',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Đế gá chịu lực cố định Hộp R-Tec Box vào thân robot GP180',
      spec: 'Hợp kim nhôm Anodize CNC độ bền cao',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692772_Base_Plate_Motoman_MH50_35.png'
    },
    {
      id: 'gp180-789-part-2',
      mpn: '83692658',
      name: 'R-Tec Box 200N - 70',
      vnName: 'Hộp hoàn lực cực đại R-Tec Box 200N (Cỡ Jumbo 70)',
      position: 'Trục 3 (Axis 3 Upper Arm)',
      role: 'Hộp lò xo trợ lực cực đại 200N cho ống ruột gà cỡ đại 70mm',
      spec: 'Vỏ composite chịu nhiệt độ cao và xỉ hàn dập',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/yaskawa/83692660_R_Tec_Box_EW_EWX_70_MP___200N.png'
    },
    {
      id: 'gp180-789-part-3',
      mpn: '83697220',
      name: 'Alu Profil 30x30 L=750mm',
      vnName: 'Thanh nhôm định hình gia cường 30x30 Dài 750mm',
      position: 'Dọc bắp tay trên Trục 3',
      role: 'Khung giàn chịu lực nâng đỡ Hộp hoàn lực và dẫn hướng ống Jumbo 70',
      spec: 'Nhôm định hình anodize rãnh Nut 8 tiêu chuẩn công nghiệp',
      defaultQty: 1,
      unit: 'Cây',
      imageUrl: '/images/dresspack/yaskawa/83697241_R_MP_A_Profil_200_1.png'
    },
    {
      id: 'gp180-789-part-4',
      mpn: '83692468',
      name: 'KEG/K-70',
      vnName: 'Khớp cầu bi xoay 360° KEG/K-70',
      position: 'Đầu ra Hộp R-Tec Box 70',
      role: 'Triệt tiêu momen xoắn cho ống luồn cỡ đại Jumbo 70',
      spec: 'Polyamide gia cường kích thước ren 70',
      defaultQty: 1,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83692468_KEG_K_70.png'
    },
    {
      id: 'gp180-789-part-5',
      mpn: '83691267',
      name: 'PR/SV-UNI 70 Black',
      vnName: 'Vòng đệm bảo vệ chống mòn PR/SV-UNI 70 Black',
      position: 'Dọc thân ống EWX 70',
      role: 'Bảo vệ thành ống 70 chống va đập trực tiếp vào cánh tay robot',
      spec: 'Polyamide chịu va đập cơ học cao',
      defaultQty: 4,
      unit: 'Cái',
      imageUrl: '/images/dresspack/yaskawa/83691267_PR_SV_UNI_70_Black.png'
    },
    {
      id: 'gp180-789-part-6',
      mpn: '83182080',
      name: 'EWX-PAE-70 Jumbo Black',
      vnName: 'Ống luồn Murrflex EWX-PAE-70 Jumbo Black',
      position: 'Dọc toàn bộ hành trình A1 - A6',
      role: 'Ống luồn cỡ đại bảo vệ bó cáp cực dày cho ứng dụng tải nặng 180kg',
      spec: 'Polyamide 12 cao cấp, ID: 64.0mm, OD: 70.0mm, gân sóng chịu uốn cực đại',
      defaultQty: 5.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/yaskawa/83182080_EWX_PAE_70_Jumbo_Black.png'
    }
  ]
};

// 6. GÓI UNIVERSAL ROBOTS (UR) COBOT - MS82501000000379
export const UNIVERSAL_ROBOTS_UR_PACKAGE: DresspackPackage = {
  id: 'pkg-ur-ur20-m50',
  packageCode: 'MS82501000000379',
  configId: '1058201',
  name: 'Gói Dresspack Universal Robots Cobot UR10e / UR20 (Chuẩn M50/P48)',
  robotModelId: 'ur-ur20',
  robotModelName: 'Universal Robots UR20 / UR10e',
  travelRange: 'Dọc toàn bộ cánh tay Cobot (J1 - J6)',
  conduitType: 'EWX-PAE-LS M50/P48 Black',
  innerDiameterMm: 38.6,
  outerDiameterMm: 50.0,
  description: 'Bộ đai kẹp kỹ thuật chuyên dụng cho Robot cộng tác (Cobot) Universal Robots, bảo vệ bó dây cảm biến và ống hút chân không gọn gàng sát thân robot, tuyệt đối an toàn khi thao tác cạnh con người.',
  recommendedFor: 'Đóng thùng carton (Palletizing), cấp phôi CNC, hàn cộng tác Cobot Welding.',
  main3dImage: '/images/dresspack/universal-robots/00_Robot_Angle_1_Overview.png',
  perspectiveImages: [
    {
      id: 'ur-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/universal-robots/00_Robot_Angle_1_Overview.png'
    },
    {
      id: 'ur-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis J1-J6',
      url: '/images/dresspack/universal-robots/00_Robot_Angle_2_Top.png'
    },
    {
      id: 'ur-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & Arm Clamps',
      url: '/images/dresspack/universal-robots/00_Robot_Angle_3_Side.png'
    },
    {
      id: 'ur-ang-4',
      label: 'Cận cảnh cổ tay trục J6 (Wrist Detail)',
      angle: 'Axis J6 Flange & Tool',
      url: '/images/dresspack/universal-robots/00_Robot_Angle_4_Wrist.png'
    }
  ],
  cadPdfUrl: '/documents/cad/ur_ur20_cad.pdf',
  cadStepUrl: 'https://assets.configuration.murrelektronik.se/assets/Files/UR/UR20/1024704_SYM_00_3K1.STP',
  parts: [
    {
      id: 'ur-part-1',
      mpn: '83182264',
      name: 'EWX-PAE-LS M50/P48 Black',
      vnName: 'Ống luồn uốn linh hoạt siêu mềm Cobot M50',
      position: 'Dọc toàn bộ cánh tay Cobot (J1 - J6)',
      role: 'Ống dẫn hướng bảo vệ cáp tín hiệu và ống khí chân không',
      spec: 'Polyamide 12 đặc chế siêu dẻo, lực kháng uốn thấp, không gây cản trở cảm biến lực Cobot',
      defaultQty: 3,
      unit: 'Mét',
      imageUrl: '/images/dresspack/universal-robots/83182264_EWX-PAE-LS_M50_P48.png'
    },
    {
      id: 'ur-part-2',
      mpn: '83691460',
      name: 'SH-P / M40-M50',
      vnName: 'Cùm kẹp giữ cố định ống trượt Cobot',
      position: 'Khớp cánh tay trung gian',
      role: 'Giữ ống luồn chuyển động trượt êm sát theo thân robot',
      spec: 'Chất liệu PA6 biến tính dẻo, ngàm tháo lắp nhanh',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/universal-robots/83691460_SH-P_M40_M50.png'
    },
    {
      id: 'ur-part-3',
      mpn: '83691664',
      name: 'KMG/F-M50',
      vnName: 'Bạc dẫn hướng cao su giảm rung chấn M50',
      position: 'Trong cùm giữ SH-P',
      role: 'Đệm cao su định hướng trượt mượt mà, triệt tiêu tiếng ồn',
      spec: 'Vật liệu đàn hồi TPE dẻo tiêu chuẩn công nghiệp',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/universal-robots/83691664_KMG_F-M50.png'
    },
    {
      id: 'ur-part-4',
      mpn: '83692264',
      name: 'KEG/ZL-M50',
      vnName: 'Khớp cầu xoay kèm chặn cáp tích hợp M50',
      position: 'Khớp cổ tay J6 & Chân đế J1',
      role: 'Xoay tự do 360 độ và chống giật cáp tích hợp',
      spec: 'Polyamide 6, góc lắc ±30°, xoay tròn 360°, cỡ ren M50/P48',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/universal-robots/83692264_KEG_ZL-M50.png'
    },
    {
      id: 'ur-part-5',
      mpn: '83693584',
      name: 'SHS 88',
      vnName: 'Cụm cùm kẹp ôm thân Cobot Ø88mm',
      position: 'Cánh tay dưới UR (Forearm link)',
      role: 'Ôm sát thân robot UR không gây trầy xước lớp sơn kim loại',
      spec: 'Đường kính kẹp Ø88mm, tích hợp lớp lót đệm cao su giảm chấn',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/universal-robots/83693584_SHS_88.png'
    },
    {
      id: 'ur-part-6',
      mpn: '83693587',
      name: 'SHS 108',
      vnName: 'Cụm cùm kẹp ôm thân Cobot Ø108mm',
      position: 'Cánh tay trên UR (Upper arm link)',
      role: 'Cố định ống luồn vững chắc trên bắp tay robot UR10e / UR20',
      spec: 'Đường kính kẹp Ø108mm, thiết kế vặn xiết an toàn công nghiệp',
      defaultQty: 2,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/universal-robots/83693587_SHS_108.png'
    },
    {
      id: 'ur-part-7',
      mpn: '83952699',
      name: 'R-SSR 63',
      vnName: 'Cùm kẹp ôm mặt bích cổ tay Cobot Ø63mm',
      position: 'Cổ tay trục J6 (Wrist Tool Flange)',
      role: 'Khóa định vị ống luồn sát đầu giác hút/kẹp gắp của Cobot',
      spec: 'Đường kính kẹp Ø63mm chuẩn mặt bích UR ISO 9409-1-50-4-M6',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/universal-robots/83952699_R-SSR_63.png'
    }
  ]
};

// 6B. GÓI KAWASAKI ROBOTICS - MS82501000000663
export const KAWASAKI_RS_PACKAGE: DresspackPackage = {
  id: 'pkg-kawasaki-rs-m32',
  packageCode: 'MS82501000000663',
  configId: '1064210',
  name: 'Gói Dresspack Kawasaki RS Series (Chuẩn M32/P29)',
  robotModelId: 'kawasaki-rs080n',
  robotModelName: 'Kawasaki RS080N / RS007L',
  travelRange: 'Dọc toàn bộ cánh tay robot (A1 - A6)',
  conduitType: 'EW-PAE-M32/P29 Black',
  innerDiameterMm: 24.3,
  outerDiameterMm: 29.6,
  description: 'Hệ thống dẫn hướng cáp linh hoạt sử dụng đai dán kỹ thuật Velcro FHS-SH không cần khoan taro lỗ bu lông trên thân robot Kawasaki. Tích hợp khớp cầu xoay 360 độ KEG/ZL triệt tiêu ứng suất xoắn vặn ruột gà.',
  recommendedFor: 'Lắp ráp linh kiện tốc độ cao, gắp thả sản phẩm, đóng gói và phục vụ máy CNC.',
  main3dImage: '/images/dresspack/kawasaki/00_Robot_Angle_1_Overview.png',
  perspectiveImages: [
    {
      id: 'kaw-ang-1',
      label: 'Tổng quan hệ thống (Overview)',
      angle: 'Isometric View',
      url: '/images/dresspack/kawasaki/00_Robot_Angle_1_Overview.png'
    },
    {
      id: 'kaw-ang-2',
      label: 'Góc nhìn trên xuống (Top View)',
      angle: 'Plan View Axis 1-6',
      url: '/images/dresspack/kawasaki/00_Robot_Angle_2_Top.png'
    },
    {
      id: 'kaw-ang-3',
      label: 'Góc nhìn ngang cánh tay (Side View)',
      angle: 'Lateral View & FHS Straps',
      url: '/images/dresspack/kawasaki/00_Robot_Angle_3_Side.png'
    },
    {
      id: 'kaw-ang-4',
      label: 'Cận cảnh cổ tay trục 6 (Wrist Detail)',
      angle: 'Axis 6 Flange & Tool',
      url: '/images/dresspack/kawasaki/00_Robot_Angle_4_Wrist.png'
    }
  ],
  parts: [
    {
      id: 'kaw-part-1',
      mpn: '83181662',
      name: 'EW-PAE-M32/P29 Black',
      vnName: 'Ống luồn cáp sóng chuẩn Robot PA12 M32',
      position: 'Dọc toàn bộ hành trình robot Kawasaki',
      role: 'Bảo vệ đường cáp encoder và ống khí nén tốc độ cao',
      spec: 'Polyamide 12 cao cấp, ID: 24.3mm, OD: 29.6mm, chịu uốn mỏi > 5 triệu chu kỳ',
      defaultQty: 2.5,
      unit: 'Mét',
      imageUrl: '/images/dresspack/kawasaki/83181662_EW-PAE-M32_P29.png'
    },
    {
      id: 'kaw-part-2',
      mpn: '83693427',
      name: 'FHS-SH 550',
      vnName: 'Bộ đai dán kỹ thuật Velcro FHS-SH 550mm',
      position: 'Bắp tay trên robot Kawasaki',
      role: 'Cố định cùm kẹp ống lên thân robot không cần khoan taro lỗ bu lông',
      spec: 'Đai dệt kỹ thuật cường lực chiều dài 550mm, chịu lực xé lớn, chống hóa chất',
      defaultQty: 2,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kawasaki/83693427_FHS-SH_550.png'
    },
    {
      id: 'kaw-part-3',
      mpn: '83693425',
      name: 'FHS-SH 450',
      vnName: 'Bộ đai dán kỹ thuật Velcro FHS-SH 450mm',
      position: 'Cánh tay trước robot Kawasaki',
      role: 'Định vị cùm kẹp ống tại đoạn thân robot tiết diện nhỏ',
      spec: 'Đai dệt kỹ thuật cường lực chiều dài 450mm kèm đệm cao su bám dính',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kawasaki/83693425_FHS-SH_450.png'
    },
    {
      id: 'kaw-part-4',
      mpn: '83691660',
      name: 'KMG/F-M32',
      vnName: 'Bạc dẫn hướng cao su giảm rung chấn M32',
      position: 'Trong cùm giữ SH-P',
      role: 'Khớp trượt cao su giúp ống luồn tịnh tiến nhịp nhàng không bị xước thân ống',
      spec: 'Vật liệu đàn hồi TPE dẻo tiêu chuẩn công nghiệp M32',
      defaultQty: 3,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kawasaki/83691660_KMG_F-M32.png'
    },
    {
      id: 'kaw-part-5',
      mpn: '83691060',
      name: 'PR/SV-EW 29 Black',
      vnName: 'Vòng đệm bảo vệ chống mòn ống M32/P29',
      position: 'Thân ống luồn EW-PAE',
      role: 'Chống va đập và mài mòn thân ống khi cọ xát với gá lắp ráp',
      spec: 'Polyamide 6 chịu va đập cơ học cao, màu đen',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kawasaki/83691060_PR_SV-EW_29.png'
    },
    {
      id: 'kaw-part-6',
      mpn: '83691462',
      name: 'SH-P / M25-M32',
      vnName: 'Cùm kẹp giữ cố định ống trượt M25-M32',
      position: 'Gá trên đai FHS-SH',
      role: 'Cùm kẹp định hướng trượt mượt mà cho ống luồn',
      spec: 'PA6 biến tính dẻo chống tia UV, khóa ngàm cơ động',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kawasaki/83691462_SH-P_M25_M32.png'
    },
    {
      id: 'kaw-part-7',
      mpn: '83692260',
      name: 'KEG/ZL-M32',
      vnName: 'Khớp cầu xoay kèm chặn cáp tích hợp M32',
      position: 'Cổ tay trục 6 & Điểm cấp nguồn',
      role: 'Khớp cầu xoay 360 độ triệt tiêu xoắn cáp và kẹp chặn cáp đồng bộ',
      spec: 'Polyamide 6, góc xoay tự do ±30°, kích cỡ M32/P29',
      defaultQty: 2,
      unit: 'Cái',
      imageUrl: '/images/dresspack/kawasaki/83692260_KEG_ZL-M32.png'
    },
    {
      id: 'kaw-part-8',
      mpn: '83692753',
      name: 'Mounting Axis 6 Bracket',
      vnName: 'Bản mã gá bắt mặt bích cổ tay trục 6',
      position: 'Mặt bích cổ tay trục 6 (Axis 6 Flange)',
      role: 'Đế bắt cùm kẹp giữ khớp cầu KEG/ZL vào đầu robot',
      spec: 'Hợp kim nhôm Anodize đen độ cứng cao, khoan sẵn chuẩn bu lông trục 6',
      defaultQty: 1,
      unit: 'Bộ',
      imageUrl: '/images/dresspack/kawasaki/83692753_Mounting_Axis_6.png'
    }
  ]
};


// 7. DANH MỤC ROBOT MODELS (STEP 2 - 83 MÔ HÌNH CHÍNH HÃNG MURRPLASTIK)
export const ROBOT_MODELS: RobotModel[] = [
  {
    id: 'fanuc-crx',
    brandId: 'fanuc',
    name: 'CRX (CRX-10iA / 20iA Cobot)',
    series: 'Collaborative Cobot (CRX-10iA / 20iA)',
    payloadKg: 10,
    reachM: 1.24,
    imageUrl: '/images/dresspack/fanuc/CRX-10iA.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-lr',
    brandId: 'fanuc',
    name: 'LR (LR-10iA Handling)',
    series: 'Compact High Speed Handling',
    payloadKg: 10,
    reachM: 1.1,
    imageUrl: '/images/dresspack/fanuc/LR-10iA.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-m-410ic',
    brandId: 'fanuc',
    name: 'M-410iC',
    series: 'Palletizing & Packaging Robot',
    payloadKg: 185,
    reachM: 3.14,
    imageUrl: '/images/dresspack/fanuc/M-410iC.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-m-710ic',
    brandId: 'fanuc',
    name: 'M-710iC',
    series: 'Medium Payload All-Rounder',
    payloadKg: 50,
    reachM: 2.05,
    imageUrl: '/images/dresspack/fanuc/M-710iC.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-m-900ib',
    brandId: 'fanuc',
    name: 'M-900iB',
    series: 'Heavy Duty Foundry & Machining',
    payloadKg: 360,
    reachM: 2.65,
    imageUrl: '/images/dresspack/fanuc/M-900iB.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-r-2000ia',
    brandId: 'fanuc',
    name: 'R-2000iA',
    series: 'Automotive Assembly Legacy',
    payloadKg: 165,
    reachM: 2.65,
    imageUrl: '/images/dresspack/fanuc/R-2000iA.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-r-2000ib',
    brandId: 'fanuc',
    name: 'R-2000iB',
    series: 'Automotive Body Shop Standard',
    payloadKg: 210,
    reachM: 2.65,
    imageUrl: '/images/dresspack/fanuc/R-2000iB.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-r-2000ic',
    brandId: 'fanuc',
    name: 'R-2000iC',
    series: 'Automotive Spot Welding (VinFast Body Shop)',
    payloadKg: 210,
    reachM: 2.65,
    imageUrl: '/images/dresspack/fanuc/R-2000iC.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'fanuc-m-2000ia',
    brandId: 'fanuc',
    name: 'M-2000iA',
    series: 'Ultra Heavy Payload 1350kg-2300kg',
    payloadKg: 1350,
    reachM: 3.73,
    imageUrl: '/images/dresspack/fanuc/M-2000iA.webp',
    hasActiveConfig: true,
    packages: [FANUC_M710_PACKAGE]
  },
  {
    id: 'abb-crb-15000',
    brandId: 'abb',
    name: 'CRB 15000',
    series: 'GoFa Collaborative Cobot',
    payloadKg: 5,
    reachM: 0.95,
    imageUrl: '/images/dresspack/abb/CRB15000.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-1300',
    brandId: 'abb',
    name: 'IRB 1300',
    series: 'Small Payload High Speed',
    payloadKg: 11,
    reachM: 1.15,
    imageUrl: '/images/dresspack/abb/IRB1300.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-1600',
    brandId: 'abb',
    name: 'IRB 1600',
    series: 'High Performance Arc Welding',
    payloadKg: 10,
    reachM: 1.45,
    imageUrl: '/images/dresspack/abb/ABB-1600.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-2600',
    brandId: 'abb',
    name: 'IRB 2600',
    series: 'Compact Industrial Robot',
    payloadKg: 20,
    reachM: 1.65,
    imageUrl: '/images/dresspack/abb/ABB-2600.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-4600',
    brandId: 'abb',
    name: 'IRB 4600',
    series: 'Medium Industrial Robot',
    payloadKg: 40,
    reachM: 2.55,
    imageUrl: '/images/dresspack/abb/ABB-4600.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-5710',
    brandId: 'abb',
    name: 'IRB 5710',
    series: 'High Speed Material Handling',
    payloadKg: 70,
    reachM: 2.3,
    imageUrl: '/images/dresspack/abb/ABB-5710.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-660',
    brandId: 'abb',
    name: 'IRB 660',
    series: 'High Speed Palletizer',
    payloadKg: 250,
    reachM: 3.15,
    imageUrl: '/images/dresspack/abb/IRB660.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-6620',
    brandId: 'abb',
    name: 'IRB 6620',
    series: 'Agile Spot Welding',
    payloadKg: 150,
    reachM: 2.2,
    imageUrl: '/images/dresspack/abb/ABB-6620.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-6640',
    brandId: 'abb',
    name: 'IRB 6640',
    series: 'Heavy Industrial Production',
    payloadKg: 180,
    reachM: 2.55,
    imageUrl: '/images/dresspack/abb/ABB-IRB6640_2.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-6650',
    brandId: 'abb',
    name: 'IRB 6650',
    series: 'Press Automation & Foundry',
    payloadKg: 200,
    reachM: 2.75,
    imageUrl: '/images/dresspack/abb/ABB-6650.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-6700',
    brandId: 'abb',
    name: 'IRB 6700',
    series: 'Heavy Industrial Flagship',
    payloadKg: 150,
    reachM: 3.2,
    imageUrl: '/images/dresspack/abb/IRB6700.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE, ABB_IRB6700_HEAVY_PACKAGE]
  },
  {
    id: 'abb-irb-6740',
    brandId: 'abb',
    name: 'IRB 6740',
    series: 'Next-Gen High Performance',
    payloadKg: 200,
    reachM: 2.8,
    imageUrl: '/images/dresspack/abb/ABB-6740.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-7600',
    brandId: 'abb',
    name: 'IRB 7600',
    series: 'Ultra Heavy Handling',
    payloadKg: 500,
    reachM: 2.55,
    imageUrl: '/images/dresspack/abb/IRB7600.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'abb-irb-8700',
    brandId: 'abb',
    name: 'IRB 8700',
    series: 'Extreme Heavy Payload 800kg',
    payloadKg: 800,
    reachM: 3.5,
    imageUrl: '/images/dresspack/abb/IRB8700.webp',
    hasActiveConfig: true,
    packages: [ABB_IRB6700_PACKAGE]
  },
  {
    id: 'kuka-lbr-iiwa',
    brandId: 'kuka',
    name: 'LBR iiwa',
    series: 'LBR iiwa Sensitive Cobot',
    payloadKg: 7,
    reachM: 0.8,
    imageUrl: '/images/dresspack/kuka/LBR-iiwa.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr6',
    brandId: 'kuka',
    name: 'KR 6',
    series: 'Compact Assembly & Arc',
    payloadKg: 6,
    reachM: 0.9,
    imageUrl: '/images/dresspack/kuka/KR6.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr8',
    brandId: 'kuka',
    name: 'KR 8',
    series: 'Cybertech Nano High Precision',
    payloadKg: 8,
    reachM: 1.1,
    imageUrl: '/images/dresspack/kuka/KR8.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr10',
    brandId: 'kuka',
    name: 'KR 10',
    series: 'Cybertech Compact Handling',
    payloadKg: 10,
    reachM: 1.1,
    imageUrl: '/images/dresspack/kuka/KR10-58ca32.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr16',
    brandId: 'kuka',
    name: 'KR 16',
    series: 'Universal Mid-Size Workhorse',
    payloadKg: 16,
    reachM: 1.61,
    imageUrl: '/images/dresspack/kuka/kr16.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr20',
    brandId: 'kuka',
    name: 'KR 20',
    series: 'Cybertech High Accuracy',
    payloadKg: 20,
    reachM: 1.81,
    imageUrl: '/images/dresspack/kuka/kr20.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr22',
    brandId: 'kuka',
    name: 'KR 22',
    series: 'High Speed Machining',
    payloadKg: 22,
    reachM: 1.61,
    imageUrl: '/images/dresspack/kuka/KR22.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr30',
    brandId: 'kuka',
    name: 'KR 30',
    series: 'Iontec Mid-Heavy Payload',
    payloadKg: 30,
    reachM: 2.03,
    imageUrl: '/images/dresspack/kuka/KR30.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr50',
    brandId: 'kuka',
    name: 'KR 50',
    series: 'Iontec Universal Machine Tending',
    payloadKg: 50,
    reachM: 2.1,
    imageUrl: '/images/dresspack/kuka/KR50.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr70',
    brandId: 'kuka',
    name: 'KR 70',
    series: 'Iontec All-Rounder',
    payloadKg: 70,
    reachM: 2.1,
    imageUrl: '/images/dresspack/kuka/kr70.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr120',
    brandId: 'kuka',
    name: 'KR 120',
    series: 'Quantec High Performance',
    payloadKg: 120,
    reachM: 2.5,
    imageUrl: '/images/dresspack/kuka/kr120.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr150',
    brandId: 'kuka',
    name: 'KR 150',
    series: 'Quantec Automotive Standard',
    payloadKg: 150,
    reachM: 2.7,
    imageUrl: '/images/dresspack/kuka/kr150.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr180',
    brandId: 'kuka',
    name: 'KR 180',
    series: 'Quantec Heavy Duty',
    payloadKg: 180,
    reachM: 2.9,
    imageUrl: '/images/dresspack/kuka/kr180.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr210',
    brandId: 'kuka',
    name: 'KR 210',
    series: 'Quantec Prime Automotive',
    payloadKg: 210,
    reachM: 2.7,
    imageUrl: '/images/dresspack/kuka/KR210.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE, KUKA_KR210_JUMBO_PACKAGE]
  },
  {
    id: 'kuka-kr240',
    brandId: 'kuka',
    name: 'KR 240',
    series: 'Quantec Ultra Payload',
    payloadKg: 240,
    reachM: 2.9,
    imageUrl: '/images/dresspack/kuka/kr240.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr300',
    brandId: 'kuka',
    name: 'KR 300',
    series: 'Fortec Extreme Payload',
    payloadKg: 300,
    reachM: 2.5,
    imageUrl: '/images/dresspack/kuka/kr300.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr360',
    brandId: 'kuka',
    name: 'KR 360',
    series: 'Fortec Heavy Foundry',
    payloadKg: 360,
    reachM: 2.8,
    imageUrl: '/images/dresspack/kuka/KR360.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'kuka-kr1000',
    brandId: 'kuka',
    name: 'KR 1000 Titan',
    series: 'Titan Heavy Lift 1000kg',
    payloadKg: 1000,
    reachM: 3.2,
    imageUrl: '/images/dresspack/kuka/KR1000.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'yaskawa-gp4',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP4',
    series: 'Ultra Compact Fast Assembly',
    payloadKg: 4,
    reachM: 0.55,
    imageUrl: '/images/dresspack/yaskawa/GP4.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-gp7',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP7',
    series: 'High Speed Small Assembly',
    payloadKg: 7,
    reachM: 0.92,
    imageUrl: '/images/dresspack/yaskawa/gp7.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-gp8',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP8',
    series: 'Fast Pick & Place',
    payloadKg: 8,
    reachM: 0.72,
    imageUrl: '/images/dresspack/yaskawa/gp8.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-gp35l',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP35L',
    series: 'Long Reach Machine Tending',
    payloadKg: 35,
    reachM: 2.53,
    imageUrl: '/images/dresspack/yaskawa/gp35l.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-gp50',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP50',
    series: 'General Purpose Handling',
    payloadKg: 50,
    reachM: 2.06,
    imageUrl: '/images/dresspack/yaskawa/gp50.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE, YASKAWA_GP50_A3_A6_M50_PACKAGE, YASKAWA_GP50_FULL_M50_PACKAGE, YASKAWA_GP50_FULL_JUMBO_PACKAGE]
  },
  {
    id: 'yaskawa-gp88',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP88',
    series: 'Medium Heavy Handling',
    payloadKg: 88,
    reachM: 2.23,
    imageUrl: '/images/dresspack/yaskawa/GP88.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-gp165r',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP165R',
    series: 'Shelf Mount Machine Tending',
    payloadKg: 165,
    reachM: 2.65,
    imageUrl: '/images/dresspack/yaskawa/GP165Rv2.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-gp180',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP180',
    series: 'Heavy Duty 6-Axis Handling',
    payloadKg: 180,
    reachM: 2.7,
    imageUrl: '/images/dresspack/yaskawa/gp180.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP180_PACKAGE, YASKAWA_GP180_M40_PACKAGE, YASKAWA_GP180_FULL_PACKAGE, YASKAWA_GP180_JUMBO_PACKAGE]
  },
  {
    id: 'yaskawa-gp225',
    brandId: 'yaskawa',
    name: 'MOTOMAN GP225',
    series: 'High Inertia Spot Welding',
    payloadKg: 225,
    reachM: 2.7,
    imageUrl: '/images/dresspack/yaskawa/gp225.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-hc',
    brandId: 'yaskawa',
    name: 'MOTOMAN HC',
    series: 'Human-Collaborative Cobot DTP',
    payloadKg: 10,
    reachM: 1.2,
    imageUrl: '/images/dresspack/yaskawa/hc10.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'yaskawa-ph130f',
    brandId: 'yaskawa',
    name: 'MOTOMAN PH130F',
    series: 'Press Automation High Speed',
    payloadKg: 130,
    reachM: 2.6,
    imageUrl: '/images/dresspack/yaskawa/PH130F.webp',
    hasActiveConfig: true,
    packages: [YASKAWA_GP50_PACKAGE]
  },
  {
    id: 'universal-robots-ur5e',
    brandId: 'universal-robots',
    name: 'UR5e',
    series: 'Universal Workhorse Cobot',
    payloadKg: 5,
    reachM: 0.85,
    imageUrl: '/images/dresspack/universal-robots/ur5e.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'universal-robots-ur10',
    brandId: 'universal-robots',
    name: 'UR10',
    series: 'Classic Cobot Series',
    payloadKg: 10,
    reachM: 1.3,
    imageUrl: '/images/dresspack/universal-robots/ur10.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'universal-robots-ur10e',
    brandId: 'universal-robots',
    name: 'UR10e',
    series: 'Medium Reach Precision Cobot',
    payloadKg: 12.5,
    reachM: 1.3,
    imageUrl: '/images/dresspack/universal-robots/ur10e.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'universal-robots-ur16e',
    brandId: 'universal-robots',
    name: 'UR16e',
    series: 'Heavy Duty Tooling Cobot',
    payloadKg: 16,
    reachM: 0.9,
    imageUrl: '/images/dresspack/universal-robots/ur16e.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'universal-robots-ur20',
    brandId: 'universal-robots',
    name: 'UR20',
    series: 'Next-Gen Long Reach Cobot',
    payloadKg: 20,
    reachM: 1.75,
    imageUrl: '/images/dresspack/universal-robots/ur20.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'universal-robots-ur30',
    brandId: 'universal-robots',
    name: 'UR30',
    series: 'High Payload Palletizing Cobot',
    payloadKg: 30,
    reachM: 1.3,
    imageUrl: '/images/dresspack/universal-robots/ur30.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'kawasaki-m-series',
    brandId: 'kawasaki',
    name: 'M series',
    series: 'M-Series Ultra Heavy Duty (MX500N)',
    payloadKg: 500,
    reachM: 2.54,
    imageUrl: '/images/dresspack/kawasaki/mx500n.webp',
    hasActiveConfig: true,
    packages: [KAWASAKI_RS_PACKAGE]
  },
  {
    id: 'kawasaki-r-series',
    brandId: 'kawasaki',
    name: 'R series',
    series: 'R-Series General Purpose Handling',
    payloadKg: 100,
    reachM: 2.2,
    imageUrl: '/images/dresspack/kawasaki/rs080n.webp',
    hasActiveConfig: true,
    packages: [KAWASAKI_RS_PACKAGE]
  },
  {
    id: 'kawasaki-rs-series',
    brandId: 'kawasaki',
    name: 'RS series',
    series: 'RS-Series High Speed (RS007L / RS080N)',
    payloadKg: 80,
    reachM: 2.1,
    imageUrl: '/images/dresspack/kawasaki/rs007l.webp',
    hasActiveConfig: true,
    packages: [KAWASAKI_RS_PACKAGE]
  },
  {
    id: 'doosan-a-series',
    brandId: 'doosan',
    name: 'A-Series',
    series: 'A-Series Fast Pace Cobot',
    payloadKg: 9,
    reachM: 0.9,
    imageUrl: '/images/dresspack/doosan/A-Series.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'doosan-h-series',
    brandId: 'doosan',
    name: 'H-Series',
    series: 'H-Series Heavy Payload Cobot',
    payloadKg: 25,
    reachM: 1.7,
    imageUrl: '/images/dresspack/doosan/H-Series.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'doosan-m-series',
    brandId: 'doosan',
    name: 'M-Series',
    series: 'M-Series High Precision Cobot',
    payloadKg: 15,
    reachM: 1.3,
    imageUrl: '/images/dresspack/doosan/M-Series.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'comau-nj370-3-0',
    brandId: 'comau',
    name: 'NJ370-3.0',
    series: 'NJ 370 Body Shop Automotive',
    payloadKg: 370,
    reachM: 3.0,
    imageUrl: '/images/dresspack/comau/nj370.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'comau-nj650-2-7',
    brandId: 'comau',
    name: 'NJ650-2.7',
    series: 'NJ 650 Heavy Duty Foundry',
    payloadKg: 650,
    reachM: 2.7,
    imageUrl: '/images/dresspack/comau/nj650.webp',
    hasActiveConfig: true,
    packages: [KUKA_KR210_PACKAGE]
  },
  {
    id: 'techman-robot-tm5',
    brandId: 'techman-robot',
    name: 'TM5',
    series: 'AI Vision Smart Cobot',
    payloadKg: 5,
    reachM: 0.9,
    imageUrl: '/images/dresspack/techman-robot/tm5.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'techman-robot-tm12',
    brandId: 'techman-robot',
    name: 'TM12',
    series: 'Smart Heavy Payload Cobot',
    payloadKg: 12,
    reachM: 1.3,
    imageUrl: '/images/dresspack/techman-robot/tm12.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'techman-robot-tm14',
    brandId: 'techman-robot',
    name: 'TM14',
    series: 'High Speed Packaging Cobot',
    payloadKg: 14,
    reachM: 1.1,
    imageUrl: '/images/dresspack/techman-robot/TM14.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'techman-robot-tm16x',
    brandId: 'techman-robot',
    name: 'TM16X',
    series: 'Heavy Duty Precision Cobot',
    payloadKg: 16,
    reachM: 0.9,
    imageUrl: '/images/dresspack/techman-robot/TM16X.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'techman-robot-tm20',
    brandId: 'techman-robot',
    name: 'TM20',
    series: 'AI Vision Heavy Cobot',
    payloadKg: 20,
    reachM: 1.3,
    imageUrl: '/images/dresspack/techman-robot/tm20.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'techman-robot-tm25s',
    brandId: 'techman-robot',
    name: 'TM25S',
    series: 'S-Series Extreme Reach',
    payloadKg: 25,
    reachM: 1.9,
    imageUrl: '/images/dresspack/techman-robot/TM25S.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'techman-robot-tm30s',
    brandId: 'techman-robot',
    name: 'TM30S',
    series: 'S-Series Heavy Payload',
    payloadKg: 30,
    reachM: 1.7,
    imageUrl: '/images/dresspack/techman-robot/TM30S.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'delta-delta-dc06',
    brandId: 'delta',
    name: 'Delta DC06',
    series: 'High Speed Articulated Robot',
    payloadKg: 6,
    reachM: 0.9,
    imageUrl: '/images/dresspack/delta/Delta-DC06.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'delta-delta-dc08',
    brandId: 'delta',
    name: 'Delta DC08',
    series: 'Production Line Handling',
    payloadKg: 8,
    reachM: 1.1,
    imageUrl: '/images/dresspack/delta/Delta-DC08.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'delta-delta-dc10',
    brandId: 'delta',
    name: 'Delta DC10',
    series: 'Precision Assembly Robot',
    payloadKg: 10,
    reachM: 1.3,
    imageUrl: '/images/dresspack/delta/Delta-DC10.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'delta-delta-dc16',
    brandId: 'delta',
    name: 'Delta DC16',
    series: 'Heavy Handling Articulated',
    payloadKg: 16,
    reachM: 1.5,
    imageUrl: '/images/dresspack/delta/Delta-DC16.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'delta-delta-dc20',
    brandId: 'delta',
    name: 'Delta DC20',
    series: 'Heavy Palletizing Robot',
    payloadKg: 20,
    reachM: 1.7,
    imageUrl: '/images/dresspack/delta/Delta-DC20.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'delta-delta-dc30',
    brandId: 'delta',
    name: 'Delta DC30',
    series: 'Long Reach Industrial',
    payloadKg: 30,
    reachM: 1.9,
    imageUrl: '/images/dresspack/delta/Delta-DC30.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'kassow-robots-kr-series',
    brandId: 'kassow-robots',
    name: 'KR-Series',
    series: '7-Axis Flexible Cobot KR Series',
    payloadKg: 18,
    reachM: 1.0,
    imageUrl: '/images/dresspack/kassow/KR-series.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'neura-lara',
    brandId: 'neura',
    name: 'Lara',
    series: 'LARA Agile Collaborative Robot',
    payloadKg: 8,
    reachM: 1.0,
    imageUrl: '/images/dresspack/neura/Laru5_Product.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'neura-maira',
    brandId: 'neura',
    name: 'MAiRa',
    series: 'MAiRa Cognitive AI Robot',
    payloadKg: 15,
    reachM: 1.4,
    imageUrl: '/images/dresspack/neura/MAiRa_Pro_L_Product.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  },
  {
    id: 'autonox-articc6-1959',
    brandId: 'autonox',
    name: 'Articc6-1959',
    series: 'Articulated Delta Hybrid Robot',
    payloadKg: 6,
    reachM: 0.9,
    imageUrl: '/images/dresspack/autonox/CategoryAutonox_Robotics.webp',
    hasActiveConfig: true,
    packages: [UNIVERSAL_ROBOTS_UR_PACKAGE]
  }
];

// 5. CÁC LỰA CHỌN DÂY CÔNG NGHIỆP THEO CHUẨN QUỐC TẾ (ISO / IEC / DESINA)
export const STANDARD_CABLES: StandardCableOption[] = [
  {
    id: 'air-6mm',
    name: 'Ống khí nén PU Ø6mm',
    standard: 'ISO 14743 / DIN 73378',
    category: 'air',
    diameterMm: 6.0,
    color: '#0284C7',
    defaultQty: 2
  },
  {
    id: 'air-8mm',
    name: 'Ống khí nén PU Ø8mm',
    standard: 'ISO 14743 / DIN 73378',
    category: 'air',
    diameterMm: 8.0,
    color: '#0284C7',
    defaultQty: 0
  },
  {
    id: 'air-10mm',
    name: 'Ống khí / Nước giải nhiệt Ø10mm',
    standard: 'ISO 14743 / DIN 73378',
    category: 'air',
    diameterMm: 10.0,
    color: '#0284C7',
    defaultQty: 0
  },
  {
    id: 'sensor-4mm',
    name: 'Cáp tín hiệu M8/M12 Sensor Ø4.0mm',
    standard: 'IEC 61076-2 / UL 20549',
    category: 'sensor',
    diameterMm: 4.0,
    color: '#16A34A',
    defaultQty: 0
  },
  {
    id: 'sensor-6mm',
    name: 'Cáp mạng PROFINET / Fieldbus Ø6.5mm',
    standard: 'IEC 61158 / IEC 61784',
    category: 'sensor',
    diameterMm: 6.5,
    color: '#16A34A',
    defaultQty: 0
  },
  {
    id: 'servo-14mm',
    name: 'Cáp động lực Servo Motor Ø14.0mm',
    standard: 'DESINA / IEC 60228 Class 6',
    category: 'servo',
    diameterMm: 14.0,
    color: '#7C3AED',
    defaultQty: 1
  },
  {
    id: 'servo-12mm',
    name: 'Cáp Servo Encoder Hybrid Ø12.5mm',
    standard: 'DESINA / IEC 60228',
    category: 'servo',
    diameterMm: 12.5,
    color: '#DC2626',
    defaultQty: 0
  },
  {
    id: 'welding-18mm',
    name: 'Cáp hàn thứ cấp chịu dòng cao Ø18.0mm',
    standard: 'DIN VDE 0282-6',
    category: 'servo',
    diameterMm: 18.0,
    color: '#D97706',
    defaultQty: 0
  }
];

// 6. PRESETS MẪU CÁP THỰC TẾ
export interface CablePreset {
  id: string;
  name: string;
  application: string;
  customerNote: string;
  cableCounts: Record<string, number>;
}

export const CABLE_PRESETS: CablePreset[] = [
  {
    id: 'preset-cad-standard',
    name: 'Bản Vẽ CAD Mẫu (1x 14mm + 2x 6mm)',
    application: 'Tiêu chuẩn mặt cắt CAD 2D minh họa',
    customerNote: '1 Cáp servo Ø14mm (d0) + 2 Ống khí PU Ø6mm (d1, d2)',
    cableCounts: {
      'servo-14mm': 1,
      'air-6mm': 2
    }
  },
  {
    id: 'preset-pick-place',
    name: 'Ứng Dụng Gắp Thả Phôi (Pick & Place)',
    application: 'Cấp phôi xi lanh & tay gắp Gripper Tool',
    customerNote: '3 ống khí nén PU Ø6mm cấp xi lanh giác hút + 3 cáp sensor Ø4mm',
    cableCounts: {
      'air-6mm': 3,
      'sensor-4mm': 3
    }
  },
  {
    id: 'preset-welding',
    name: 'Ứng Dụng Robot Hàn Công Nghiệp (Spot Welding)',
    application: 'Hàn hồ quang & hàn bấm điểm',
    customerNote: '2 ống nước làm mát Ø10mm + 1 cáp hàn Ø18mm + 2 cáp sensor Ø4mm',
    cableCounts: {
      'air-10mm': 2,
      'welding-18mm': 1,
      'sensor-4mm': 2
    }
  },
  {
    id: 'preset-dispensing',
    name: 'Ứng Dụng Bơm Keo & Rót Phôi (Dispensing)',
    application: 'Bơm keo kết cấu & làm kín gioăng',
    customerNote: '2 ống dẫn keo áp lực Ø8mm + 2 cáp servo Ø12.5mm + 2 cáp sensor Ø4mm',
    cableCounts: {
      'air-8mm': 2,
      'servo-12mm': 2,
      'sensor-4mm': 2
    }
  }
];

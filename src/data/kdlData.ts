// CSDL Hệ Thống Cable Entry Configurator KDL (Chuẩn Murrplastik Đức & T&T Vina)
// Dữ liệu bóc tách chính thức từ shop.murrplastik.com/kdl

export type KdlSystemKey = 'dch' | 'mono' | 'e' | 'e-plus';
export type GrommetSize = 'small' | 'medium' | 'big';

export interface KdlSystemInfo {
  id: KdlSystemKey;
  code: string;
  name: string;
  vnName: string;
  description: string;
  defaultMaterial: 'plastic' | 'metal';
  ipRatings: string[];
  features: string[];
  badge: string;
}

export interface KdlFrameItem {
  matnr: string;
  id: string;
  name: string;
  system: KdlSystemKey;
  cutoutSize: string;
  material: 'plastic' | 'metal';
  tightness: string[];
  fireClass: string[];
  resistance: string[];
  fda: boolean;
  numberSmall: number;
  numberMedium: number;
  numberBig: number;
  totalOpenings: number;
  layoutKey: string;
}

export interface KdlGrommetItem {
  matnr: string;
  name: string;
  vnName: string;
  category: string;
  type: string;
  size: GrommetSize;
  diameter?: number | null;
  color: string;
}

export interface CableSlotCoordinate {
  x: number;
  y: number;
}

export interface FrameLayoutSlots {
  small?: Record<string, [number, number]>;
  medium?: Record<string, [number, number]>;
  big?: Record<string, [number, number]>;
}

// 1. DANH MỤC 4 HỆ THỐNG KHUNG LUỒN CÁP KDL
export const KDL_SYSTEMS: KdlSystemInfo[] = [
  {
    id: 'e',
    code: 'KDL/E',
    name: 'KDL/E Cable Entry System',
    vnName: 'Hệ Khung Luồn Cáp Tiết Kiệm KDL/E (Nhựa PA6)',
    description: 'Hệ thống khung luồn cáp chia đôi kinh tế, lắp ráp cài chốt nhanh không cần dụng cụ chuyên dụng.',
    defaultMaterial: 'plastic',
    ipRatings: ['IP54'],
    features: ['Lắp ráp nhanh snap-in', 'Mật độ dây cao', 'Tiết kiệm chi phí đầu tư'],
    badge: 'Phổ biến nhất'
  },
  {
    id: 'e-plus',
    code: 'KDL/E+',
    name: 'KDL/E+ Cable Entry System',
    vnName: 'Hệ Khung Luồn Cáp Nâng Cao KDL/E+ (Khối Xếp Tầng)',
    description: 'Khung modular xếp tầng tăng cường khả năng chịu lực, gioăng kép và giữ cáp chống giật vượt trội.',
    defaultMaterial: 'plastic',
    ipRatings: ['IP65', 'IP66'],
    features: ['Xếp tầng linh hoạt', 'Chống giật strain relief', 'Chuẩn chống cháy UL 94 V-0'],
    badge: 'Hiệu suất cao'
  },
  {
    id: 'dch',
    code: 'KDL/C, D, H',
    name: 'KDL/C, KDL/D & KDL/H Heavy Duty',
    vnName: 'Hệ Khung Luồn Cáp Hạng Nặng KDL/C-D-H & Khung Inox V4A',
    description: 'Khung hợp kim nhôm & Inox 316L V4A chống ăn mòn, chịu áp lực nước IP69K, chuẩn vi sinh FDA.',
    defaultMaterial: 'metal',
    ipRatings: ['IP65', 'IP66/67', 'IP69K'],
    features: ['Inox V4A & Hợp kim', 'Áp lực nước IP69K', 'Chuẩn thực phẩm FDA'],
    badge: 'Heavy-Duty / FDA'
  },
  {
    id: 'mono',
    code: 'KDL/D-mono',
    name: 'KDL/D-mono Round Entry',
    vnName: 'Hệ Khung Luồn Cáp Tròn KDL/D-mono (Chuẩn Metric M25-M50)',
    description: 'Khung tròn chia đôi lắp vào lỗ khoét tiêu chuẩn M25, M32, M40, M50 với đai ốc siết chắc chắn.',
    defaultMaterial: 'plastic',
    ipRatings: ['IP65'],
    features: ['Lỗ ren Metric tiêu chuẩn', 'Chia đôi luồn jack dễ dàng', 'Khóa đai ốc ren'],
    badge: 'Lỗ tròn Metric'
  }
];

// 2. TỌA ĐỘ VỊ TRÍ 50 LAYOUT KHUNG KDL (CHO BẢN VẼ 2D CAD TRỰC QUAN)
export const KDL_LAYOUT_COORDINATES: Record<string, FrameLayoutSlots> = {
  "dch-24-12": {
    "small": {
      "0": [
        32,
        22
      ],
      "1": [
        61,
        22
      ],
      "2": [
        90,
        22
      ],
      "3": [
        120,
        22
      ],
      "4": [
        150,
        22
      ],
      "5": [
        178,
        22
      ],
      "6": [
        32,
        47
      ],
      "7": [
        61,
        47
      ],
      "8": [
        90,
        47
      ],
      "9": [
        120,
        47
      ],
      "10": [
        150,
        47
      ],
      "11": [
        178,
        47
      ]
    }
  },
  "dch-24-9": {
    "small": {
      "0": [
        85,
        22
      ],
      "1": [
        115,
        22
      ],
      "2": [
        145,
        22
      ],
      "3": [
        175,
        22
      ],
      "4": [
        85,
        47
      ],
      "5": [
        115,
        47
      ],
      "6": [
        145,
        47
      ],
      "7": [
        175,
        47
      ]
    },
    "medium": {
      "0": [
        35,
        35
      ]
    }
  },
  "dch-24-8": {
    "small": {
      "0": [
        77,
        22
      ],
      "1": [
        105,
        22
      ],
      "2": [
        133,
        22
      ],
      "3": [
        77,
        47
      ],
      "4": [
        105,
        47
      ],
      "5": [
        133,
        47
      ]
    },
    "medium": {
      "0": [
        32,
        35
      ],
      "1": [
        160,
        35
      ]
    }
  },
  "dch-24-4": {
    "medium": {
      "0": [
        32,
        35
      ],
      "1": [
        75,
        35
      ],
      "2": [
        119,
        35
      ],
      "3": [
        162,
        35
      ]
    }
  },
  "dch-24-3": {
    "medium": {
      "0": [
        95,
        35
      ]
    },
    "big": {
      "0": [
        35,
        35
      ],
      "1": [
        149,
        35
      ]
    }
  },
  "dch-16-8": {
    "small": {
      "0": [
        42,
        22
      ],
      "1": [
        82,
        22
      ],
      "2": [
        124,
        22
      ],
      "3": [
        166,
        22
      ],
      "4": [
        42,
        47
      ],
      "5": [
        82,
        47
      ],
      "6": [
        124,
        47
      ],
      "7": [
        166,
        47
      ]
    }
  },
  "dch-16-7": {
    "small": {
      "0": [
        94,
        22
      ],
      "1": [
        132,
        22
      ],
      "2": [
        168,
        22
      ],
      "3": [
        94,
        47
      ],
      "4": [
        132,
        47
      ],
      "5": [
        168,
        47
      ]
    },
    "medium": {
      "0": [
        39,
        35
      ]
    }
  },
  "dch-16-3": {
    "medium": {
      "0": [
        39,
        35
      ],
      "1": [
        95,
        35
      ],
      "2": [
        150,
        35
      ]
    }
  },
  "dch-16-2": {
    "big": {
      "0": [
        49,
        35
      ],
      "1": [
        129,
        35
      ]
    }
  },
  "dch-10-6": {
    "small": {
      "0": [
        51,
        22
      ],
      "1": [
        105,
        22
      ],
      "2": [
        160,
        22
      ],
      "3": [
        51,
        47
      ],
      "4": [
        105,
        47
      ],
      "5": [
        160,
        47
      ]
    }
  },
  "dch-10-5": {
    "small": {
      "0": [
        113,
        22
      ],
      "1": [
        153,
        22
      ],
      "2": [
        113,
        47
      ],
      "3": [
        153,
        47
      ]
    },
    "medium": {
      "0": [
        52,
        35
      ]
    }
  },
  "dch-10-2": {
    "medium": {
      "0": [
        57,
        35
      ],
      "1": [
        132,
        35
      ]
    }
  },
  "dch-6-4": {
    "small": {
      "0": [
        45,
        22
      ],
      "1": [
        75,
        22
      ],
      "2": [
        45,
        47
      ],
      "3": [
        75,
        47
      ]
    }
  },
  "dch-1-6": {
    "small": {
      "0": [
        28,
        15
      ],
      "1": [
        59,
        15
      ],
      "2": [
        89,
        15
      ],
      "3": [
        120,
        15
      ],
      "4": [
        151,
        15
      ],
      "5": [
        182,
        15
      ]
    }
  },
  "dch-m50": {
    "small": {
      "0": [
        40,
        14
      ],
      "1": [
        16,
        35
      ],
      "2": [
        64,
        35
      ],
      "3": [
        40,
        56
      ]
    }
  },
  "mono-m25": {
    "small": {
      "0": [
        35,
        30
      ]
    }
  },
  "mono-m32": {
    "medium": {
      "0": [
        28,
        23
      ]
    }
  },
  "mono-m40-1": {
    "medium": {
      "0": [
        27,
        22
      ]
    }
  },
  "mono-m40-2": {
    "small": {
      "0": [
        13,
        30
      ],
      "1": [
        55,
        30
      ]
    }
  },
  "mono-m50": {
    "big": {
      "0": [
        22,
        18
      ]
    }
  },
  "e-24-10": {
    "small": {
      "0": [
        36,
        11
      ],
      "1": [
        69,
        11
      ],
      "2": [
        104,
        12
      ],
      "3": [
        137,
        11
      ],
      "4": [
        171,
        11
      ],
      "5": [
        36,
        42
      ],
      "6": [
        69,
        42
      ],
      "7": [
        104,
        43
      ],
      "8": [
        137,
        42
      ],
      "9": [
        171,
        42
      ]
    }
  },
  "e-24-7": {
    "small": {
      "0": [
        104,
        12
      ],
      "1": [
        137,
        11
      ],
      "2": [
        171,
        11
      ],
      "3": [
        104,
        43
      ],
      "4": [
        137,
        42
      ],
      "5": [
        171,
        42
      ]
    },
    "big": {
      "0": [
        38,
        27
      ]
    }
  },
  "e-24-4": {
    "small": {
      "0": [
        104,
        12
      ],
      "1": [
        104,
        43
      ]
    },
    "big": {
      "0": [
        38,
        27
      ],
      "1": [
        140,
        27
      ]
    }
  },
  "e-16-8": {
    "small": {
      "0": [
        30,
        12
      ],
      "1": [
        67,
        12
      ],
      "2": [
        104,
        12
      ],
      "3": [
        139,
        12
      ],
      "4": [
        30,
        43
      ],
      "5": [
        67,
        43
      ],
      "6": [
        104,
        43
      ],
      "7": [
        139,
        43
      ]
    }
  },
  "e-16-5": {
    "small": {
      "0": [
        103,
        12
      ],
      "1": [
        140,
        12
      ],
      "2": [
        103,
        42
      ],
      "3": [
        140,
        42
      ]
    },
    "big": {
      "0": [
        34,
        27
      ]
    }
  },
  "e-16-4": {
    "small": {
      "0": [
        103,
        12
      ],
      "1": [
        139,
        12
      ],
      "2": [
        103,
        42
      ],
      "3": [
        139,
        42
      ]
    }
  },
  "e-16-2": {
    "big": {
      "0": [
        34,
        27
      ],
      "1": [
        107,
        27
      ]
    }
  },
  "e-plus-24-10": {
    "small": {
      "0": [
        31,
        12
      ],
      "1": [
        65,
        12
      ],
      "2": [
        100,
        12
      ],
      "3": [
        144,
        12
      ],
      "4": [
        179,
        12
      ],
      "5": [
        31,
        52
      ],
      "6": [
        65,
        52
      ],
      "7": [
        100,
        52
      ],
      "8": [
        144,
        52
      ],
      "9": [
        179,
        52
      ]
    }
  },
  "e-plus-24-7": {
    "small": {
      "0": [
        31,
        12
      ],
      "1": [
        65,
        12
      ],
      "2": [
        100,
        12
      ],
      "3": [
        31,
        52
      ],
      "4": [
        65,
        52
      ],
      "5": [
        100,
        52
      ]
    },
    "big": {
      "0": [
        151,
        32
      ]
    }
  },
  "e-plus-24-4": {
    "small": {
      "0": [
        100,
        12
      ],
      "1": [
        100,
        52
      ]
    },
    "big": {
      "0": [
        32,
        32
      ],
      "1": [
        151,
        32
      ]
    }
  },
  "e-plus-24-8": {
    "small": {
      "0": [
        101,
        12
      ],
      "1": [
        101,
        52
      ],
      "2": [
        101,
        108
      ],
      "3": [
        101,
        147
      ]
    },
    "big": {
      "0": [
        31,
        32
      ],
      "1": [
        151,
        32
      ],
      "2": [
        31,
        128
      ],
      "3": [
        151,
        128
      ]
    }
  },
  "e-plus-24-11": {
    "small": {
      "0": [
        32,
        12
      ],
      "1": [
        32,
        53
      ],
      "2": [
        67,
        12
      ],
      "3": [
        67,
        53
      ],
      "4": [
        101,
        12
      ],
      "5": [
        101,
        53
      ],
      "6": [
        99,
        107
      ],
      "7": [
        99,
        148
      ]
    },
    "big": {
      "0": [
        151,
        32
      ],
      "1": [
        33,
        128
      ],
      "2": [
        151,
        128
      ]
    }
  },
  "e-plus-24-14": {
    "small": {
      "0": [
        32,
        12
      ],
      "1": [
        32,
        53
      ],
      "2": [
        67,
        12
      ],
      "3": [
        67,
        53
      ],
      "4": [
        101,
        12
      ],
      "5": [
        101,
        53
      ],
      "6": [
        101,
        107
      ],
      "7": [
        101,
        148
      ],
      "8": [
        32,
        107
      ],
      "9": [
        32,
        148
      ],
      "10": [
        67,
        107
      ],
      "11": [
        67,
        148
      ]
    },
    "big": {
      "0": [
        151,
        32
      ],
      "1": [
        151,
        128
      ]
    }
  },
  "e-plus-24-17": {
    "small": {
      "0": [
        32,
        12
      ],
      "1": [
        32,
        53
      ],
      "2": [
        67,
        12
      ],
      "3": [
        67,
        53
      ],
      "4": [
        101,
        12
      ],
      "5": [
        101,
        53
      ],
      "6": [
        101,
        107
      ],
      "7": [
        101,
        148
      ],
      "8": [
        32,
        107
      ],
      "9": [
        32,
        148
      ],
      "10": [
        67,
        107
      ],
      "11": [
        67,
        148
      ],
      "12": [
        148,
        107
      ],
      "13": [
        148,
        148
      ],
      "14": [
        182,
        107
      ],
      "15": [
        182,
        148
      ]
    },
    "big": {
      "0": [
        151,
        32
      ]
    }
  },
  "e-plus-24-20": {
    "small": {
      "0": [
        32,
        12
      ],
      "1": [
        32,
        53
      ],
      "2": [
        67,
        12
      ],
      "3": [
        67,
        53
      ],
      "4": [
        101,
        12
      ],
      "5": [
        101,
        53
      ],
      "6": [
        101,
        107
      ],
      "7": [
        101,
        148
      ],
      "8": [
        32,
        107
      ],
      "9": [
        32,
        148
      ],
      "10": [
        67,
        107
      ],
      "11": [
        67,
        148
      ],
      "12": [
        146,
        107
      ],
      "13": [
        146,
        148
      ],
      "14": [
        180,
        107
      ],
      "15": [
        180,
        148
      ],
      "16": [
        146,
        12
      ],
      "17": [
        146,
        53
      ],
      "18": [
        180,
        12
      ],
      "19": [
        180,
        53
      ]
    }
  },
  "e-plus-24-12": {
    "small": {
      "0": [
        101,
        12
      ],
      "1": [
        101,
        53
      ],
      "2": [
        101,
        108
      ],
      "3": [
        101,
        150
      ],
      "4": [
        101,
        205
      ],
      "5": [
        101,
        247
      ]
    },
    "big": {
      "0": [
        31,
        32
      ],
      "1": [
        151,
        32
      ],
      "2": [
        31,
        129
      ],
      "3": [
        151,
        129
      ],
      "4": [
        31,
        226
      ],
      "5": [
        151,
        226
      ]
    }
  },
  "e-plus-24-21": {
    "small": {
      "0": [
        33,
        12
      ],
      "1": [
        33,
        53
      ],
      "2": [
        33,
        108
      ],
      "3": [
        33,
        150
      ],
      "4": [
        33,
        205
      ],
      "5": [
        33,
        247
      ],
      "6": [
        67,
        12
      ],
      "7": [
        67,
        53
      ],
      "8": [
        67,
        108
      ],
      "9": [
        67,
        150
      ],
      "10": [
        67,
        205
      ],
      "11": [
        67,
        247
      ],
      "12": [
        101,
        12
      ],
      "13": [
        101,
        53
      ],
      "14": [
        101,
        108
      ],
      "15": [
        101,
        150
      ],
      "16": [
        101,
        205
      ],
      "17": [
        101,
        247
      ]
    },
    "big": {
      "0": [
        151,
        32
      ],
      "1": [
        151,
        129
      ],
      "2": [
        151,
        226
      ]
    }
  },
  "e-plus-24-30": {
    "small": {
      "0": [
        33,
        12
      ],
      "1": [
        33,
        53
      ],
      "2": [
        33,
        108
      ],
      "3": [
        33,
        150
      ],
      "4": [
        33,
        205
      ],
      "5": [
        33,
        247
      ],
      "6": [
        67,
        12
      ],
      "7": [
        67,
        53
      ],
      "8": [
        67,
        108
      ],
      "9": [
        67,
        150
      ],
      "10": [
        67,
        205
      ],
      "11": [
        67,
        247
      ],
      "12": [
        101,
        12
      ],
      "13": [
        101,
        53
      ],
      "14": [
        101,
        108
      ],
      "15": [
        101,
        150
      ],
      "16": [
        101,
        205
      ],
      "17": [
        101,
        247
      ],
      "18": [
        146,
        12
      ],
      "19": [
        146,
        53
      ],
      "20": [
        146,
        108
      ],
      "21": [
        146,
        150
      ],
      "22": [
        146,
        205
      ],
      "23": [
        146,
        247
      ],
      "24": [
        180,
        12
      ],
      "25": [
        180,
        53
      ],
      "26": [
        180,
        108
      ],
      "27": [
        180,
        150
      ],
      "28": [
        180,
        205
      ],
      "29": [
        180,
        247
      ]
    }
  },
  "e-plus-16-8": {
    "small": {
      "0": [
        42,
        13
      ],
      "1": [
        42,
        51
      ],
      "2": [
        84,
        13
      ],
      "3": [
        84,
        51
      ],
      "4": [
        127,
        13
      ],
      "5": [
        127,
        51
      ],
      "6": [
        169,
        13
      ],
      "7": [
        169,
        51
      ]
    }
  },
  "e-plus-16-5": {
    "small": {
      "0": [
        42,
        13
      ],
      "1": [
        42,
        51
      ],
      "2": [
        84,
        13
      ],
      "3": [
        84,
        51
      ]
    },
    "big": {
      "0": [
        129,
        32
      ]
    }
  },
  "e-plus-16-2": {
    "big": {
      "0": [
        41,
        32
      ],
      "1": [
        129,
        32
      ]
    }
  },
  "e-plus-10-6": {
    "small": {
      "0": [
        50,
        13
      ],
      "1": [
        50,
        51
      ],
      "2": [
        101,
        13
      ],
      "3": [
        101,
        51
      ],
      "4": [
        152,
        13
      ],
      "5": [
        152,
        51
      ]
    }
  },
  "e-plus-10-3": {
    "small": {
      "0": [
        50,
        13
      ],
      "1": [
        50,
        51
      ]
    },
    "big": {
      "0": [
        106,
        32
      ]
    }
  },
  "e-plus-6-4": {
    "small": {
      "0": [
        39,
        13
      ],
      "1": [
        39,
        51
      ],
      "2": [
        80,
        13
      ],
      "3": [
        80,
        51
      ]
    }
  },
  "e-plus-6-1": {
    "big": {
      "0": [
        41,
        32
      ]
    }
  },
  "er-plus-25-1": {
    "small": {
      "0": [
        30,
        16
      ]
    }
  },
  "er-plus-32-1": {
    "small": {
      "0": [
        30,
        16
      ]
    }
  },
  "er-plus-50-2": {
    "small": {
      "0": [
        18,
        27
      ],
      "1": [
        55,
        27
      ]
    }
  },
  "er-plus-50-4": {
    "small": {
      "0": [
        20,
        15
      ],
      "1": [
        52,
        15
      ],
      "2": [
        20,
        51
      ],
      "3": [
        52,
        51
      ]
    }
  },
  "er-plus-50-1": {
    "big": {
      "0": [
        17,
        14
      ]
    }
  }
};

// 3. CATALOG CHI TIẾT 91 MODEL KHUNG LUỒN CÁP
export const KDL_FRAMES: KdlFrameItem[] = [
  {
    "matnr": "87141048",
    "id": "d-1-6",
    "name": "KDL/D 1/6: Black",
    "system": "dch",
    "cutoutSize": "1",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-1-6"
  },
  {
    "matnr": "87141422",
    "id": "h-1-6",
    "name": "KDL/H 1/6: Black",
    "system": "dch",
    "cutoutSize": "1",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-1-6"
  },
  {
    "matnr": "87141470",
    "id": "h-va-1-6",
    "name": "KDL/H-VA 1/6: Material color",
    "system": "dch",
    "cutoutSize": "1",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-1-6"
  },
  {
    "matnr": "87141870",
    "id": "h-va-fda-1-6",
    "name": "KDL/H-VA-FDA 1/6, Set: Material color",
    "system": "dch",
    "cutoutSize": "1",
    "material": "metal",
    "tightness": [
      "ip69k"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren"
    ],
    "fda": true,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-1-6"
  },
  {
    "matnr": "87142748",
    "id": "d-fda-1-6",
    "name": "KDL/D 1/6-FDA Set: White / Blue",
    "system": "dch",
    "cutoutSize": "1",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-1-6"
  },
  {
    "matnr": "87141044",
    "id": "d-6-4",
    "name": "KDL/D 6/4: Black",
    "system": "dch",
    "cutoutSize": "6",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-6-4"
  },
  {
    "matnr": "87141046",
    "id": "c-6-4",
    "name": "KDL/C 6/4: Black",
    "system": "dch",
    "cutoutSize": "6",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-6-4"
  },
  {
    "matnr": "87141038",
    "id": "d-10-6",
    "name": "KDL/D 10/6: Black",
    "system": "dch",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-10-6"
  },
  {
    "matnr": "87141040",
    "id": "c-10-6",
    "name": "KDL/C 10/6: Black",
    "system": "dch",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "dch-10-6"
  },
  {
    "matnr": "87141042",
    "id": "d-10-5",
    "name": "KDL/D 10/5: Black",
    "system": "dch",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 5,
    "layoutKey": "dch-10-5"
  },
  {
    "matnr": "87141043",
    "id": "c-10-5",
    "name": "KDL/C 10/5: Black",
    "system": "dch",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 5,
    "layoutKey": "dch-10-5"
  },
  {
    "matnr": "87141039",
    "id": "d-10-2",
    "name": "KDL/D 10/2: Black",
    "system": "dch",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 2,
    "numberBig": 0,
    "totalOpenings": 2,
    "layoutKey": "dch-10-2"
  },
  {
    "matnr": "87141041",
    "id": "c-10-2",
    "name": "KDL/C 10/2: Black",
    "system": "dch",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 2,
    "numberBig": 0,
    "totalOpenings": 2,
    "layoutKey": "dch-10-2"
  },
  {
    "matnr": "87141026",
    "id": "d-16-8",
    "name": "KDL/D 16/8: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-16-8"
  },
  {
    "matnr": "87141028",
    "id": "c-16-8",
    "name": "KDL/C 16/8: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-16-8"
  },
  {
    "matnr": "87141418",
    "id": "h-16-8",
    "name": "KDL/H 16/8: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-16-8"
  },
  {
    "matnr": "87141476",
    "id": "h-va-16-8",
    "name": "KDL/H-VA 16/8: Material color",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-16-8"
  },
  {
    "matnr": "87141877",
    "id": "h-va-fda-16-8",
    "name": "KDL/H-VA-FDA 16/8, Set: Material color",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip69k"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren"
    ],
    "fda": true,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-16-8"
  },
  {
    "matnr": "87142726",
    "id": "d-fda-16-8",
    "name": "KDL/D 16/8-FDA Set: White / Blue",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-16-8"
  },
  {
    "matnr": "87141030",
    "id": "d-16-7",
    "name": "KDL/D 16/7: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 7,
    "layoutKey": "dch-16-7"
  },
  {
    "matnr": "87141032",
    "id": "c-16-7",
    "name": "KDL/C 16/7: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 7,
    "layoutKey": "dch-16-7"
  },
  {
    "matnr": "87141034",
    "id": "d-16-3",
    "name": "KDL/D 16/3: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 3,
    "numberBig": 0,
    "totalOpenings": 3,
    "layoutKey": "dch-16-3"
  },
  {
    "matnr": "87141036",
    "id": "c-16-3",
    "name": "KDL/C 16/3: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 3,
    "numberBig": 0,
    "totalOpenings": 3,
    "layoutKey": "dch-16-3"
  },
  {
    "matnr": "87141416",
    "id": "h-16-3",
    "name": "KDL/H 16/3: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 3,
    "numberBig": 0,
    "totalOpenings": 3,
    "layoutKey": "dch-16-3"
  },
  {
    "matnr": "87141474",
    "id": "h-va-16-3",
    "name": "KDL/H-VA 16/3: Material color",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 3,
    "numberBig": 0,
    "totalOpenings": 3,
    "layoutKey": "dch-16-3"
  },
  {
    "matnr": "87141874",
    "id": "h-va-fda-16-3",
    "name": "KDL/H-VA-FDA 16/3, Set: Material color",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip69k"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren"
    ],
    "fda": true,
    "numberSmall": 0,
    "numberMedium": 3,
    "numberBig": 0,
    "totalOpenings": 3,
    "layoutKey": "dch-16-3"
  },
  {
    "matnr": "87142734",
    "id": "d-fda-16-3",
    "name": "KDL/D 16/3-FDA Set: White / Blue",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 0,
    "numberMedium": 3,
    "numberBig": 0,
    "totalOpenings": 3,
    "layoutKey": "dch-16-3"
  },
  {
    "matnr": "87141033",
    "id": "d-16-2",
    "name": "KDL/D 16/2: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 2,
    "layoutKey": "dch-16-2"
  },
  {
    "matnr": "87141420",
    "id": "h-16-2",
    "name": "KDL/H 16/2: Black",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 2,
    "layoutKey": "dch-16-2"
  },
  {
    "matnr": "87141472",
    "id": "h-va-16-2",
    "name": "KDL/H-VA 16/2: Material color",
    "system": "dch",
    "cutoutSize": "16",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 2,
    "layoutKey": "dch-16-2"
  },
  {
    "matnr": "87142733",
    "id": "d-fda-16-2",
    "name": "KDL/D 16/2-FDA Set: White / Blue",
    "system": "dch",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 2,
    "layoutKey": "dch-16-2"
  },
  {
    "matnr": "87141010",
    "id": "d-24-12",
    "name": "KDL/D 24/12: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 12,
    "layoutKey": "dch-24-12"
  },
  {
    "matnr": "87141012",
    "id": "c-24-12",
    "name": "KDL/C 24/12: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 12,
    "layoutKey": "dch-24-12"
  },
  {
    "matnr": "87141410",
    "id": "h-24-12",
    "name": "KDL/H 24/12: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 12,
    "layoutKey": "dch-24-12"
  },
  {
    "matnr": "87141482",
    "id": "h-va-24-12",
    "name": "KDL/H-VA 24/12: Material color",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 12,
    "layoutKey": "dch-24-12"
  },
  {
    "matnr": "87141882",
    "id": "h-va-fda-24-12",
    "name": "KDL/H-VA-FDA 24/12, Set: Material color",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip69k"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren"
    ],
    "fda": true,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 12,
    "layoutKey": "dch-24-12"
  },
  {
    "matnr": "87142710",
    "id": "d-fda-24-12",
    "name": "KDL/D 24/12-FDA, ws/bl, Set: White / Blue",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 12,
    "layoutKey": "dch-24-12"
  },
  {
    "matnr": "87141022",
    "id": "d-24-9",
    "name": "KDL/D 24/9: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 9,
    "layoutKey": "dch-24-9"
  },
  {
    "matnr": "87141024",
    "id": "c-24-9",
    "name": "KDL/C 24/9: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 9,
    "layoutKey": "dch-24-9"
  },
  {
    "matnr": "87141018",
    "id": "d-24-8",
    "name": "KDL/D 24/8: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 2,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-24-8"
  },
  {
    "matnr": "87141020",
    "id": "c-24-8",
    "name": "KDL/C 24/8: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 2,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-24-8"
  },
  {
    "matnr": "87141428",
    "id": "h-24-8",
    "name": "KDL/H 24/8: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 2,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "dch-24-8"
  },
  {
    "matnr": "87141014",
    "id": "d-24-4",
    "name": "KDL/D 24/4: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 4,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-24-4"
  },
  {
    "matnr": "87141016",
    "id": "c-24-4",
    "name": "KDL/C 24/4: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 4,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-24-4"
  },
  {
    "matnr": "87141412",
    "id": "h-24-4",
    "name": "KDL/H 24/4: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 4,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-24-4"
  },
  {
    "matnr": "87141480",
    "id": "h-va-24-4",
    "name": "KDL/H-VA 24/4: Material color",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 4,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-24-4"
  },
  {
    "matnr": "87141880",
    "id": "h-va-fda-24-4",
    "name": "KDL/H-VA-FDA 24/4, Set: Material color",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip69k"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren"
    ],
    "fda": true,
    "numberSmall": 0,
    "numberMedium": 4,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-24-4"
  },
  {
    "matnr": "87142714",
    "id": "d-fda-24-4",
    "name": "KDL/D 24/4-FDA Set: White / Blue",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 0,
    "numberMedium": 4,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-24-4"
  },
  {
    "matnr": "87141013",
    "id": "d-24-3",
    "name": "KDL/D 24/3: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 1,
    "numberBig": 2,
    "totalOpenings": 3,
    "layoutKey": "dch-24-3"
  },
  {
    "matnr": "87141414",
    "id": "h-24-3",
    "name": "KDL/H 24/3: Black",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 1,
    "numberBig": 2,
    "totalOpenings": 3,
    "layoutKey": "dch-24-3"
  },
  {
    "matnr": "87141478",
    "id": "h-va-24-3",
    "name": "KDL/H-VA 24/3: Material color",
    "system": "dch",
    "cutoutSize": "24",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 1,
    "numberBig": 2,
    "totalOpenings": 3,
    "layoutKey": "dch-24-3"
  },
  {
    "matnr": "87142713",
    "id": "d-fda-24-3",
    "name": "KDL/D 24/3-FDA Set: White / Blue",
    "system": "dch",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 0,
    "numberMedium": 1,
    "numberBig": 2,
    "totalOpenings": 3,
    "layoutKey": "dch-24-3"
  },
  {
    "matnr": "87141002",
    "id": "d-r-m50-4",
    "name": "KDL/D-R M50/4: Black",
    "system": "dch",
    "cutoutSize": "50",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-m50"
  },
  {
    "matnr": "87141424",
    "id": "h-m50-4",
    "name": "KDL/H M50/4: Black",
    "system": "dch",
    "cutoutSize": "50",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-m50"
  },
  {
    "matnr": "87141484",
    "id": "h-va-m50-4",
    "name": "KDL/H-VA M50/4: Material color",
    "system": "dch",
    "cutoutSize": "50",
    "material": "metal",
    "tightness": [
      "ip66/67, ip69k"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-m50"
  },
  {
    "matnr": "87141884",
    "id": "h-va-fda-m50-4",
    "name": "KDL/H-VA-FDA M50/4, Set: Material color",
    "system": "dch",
    "cutoutSize": "50",
    "material": "metal",
    "tightness": [
      "ip69k"
    ],
    "fireClass": [
      "UL 94 V-0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": true,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "dch-m50"
  },
  {
    "matnr": "87141610",
    "id": "d-mono-1-m25",
    "name": "KDL/D-mono 1 M25: Black",
    "system": "mono",
    "cutoutSize": "25",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 1,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 1,
    "layoutKey": "mono-m25"
  },
  {
    "matnr": "87141620",
    "id": "d-mono-1-m32",
    "name": "KDL/D-mono 1 M32: Black",
    "system": "mono",
    "cutoutSize": "32",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 1,
    "layoutKey": "mono-m32"
  },
  {
    "matnr": "87141636",
    "id": "d-mono-1-m40",
    "name": "KDL/D-mono 1 M40: Black",
    "system": "mono",
    "cutoutSize": "40",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 1,
    "numberBig": 0,
    "totalOpenings": 1,
    "layoutKey": "mono-m40-1"
  },
  {
    "matnr": "87141630",
    "id": "d-mono-2-m40",
    "name": "KDL/D-mono 2 M40: Black",
    "system": "mono",
    "cutoutSize": "40",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 2,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 2,
    "layoutKey": "mono-m40-2"
  },
  {
    "matnr": "87141640",
    "id": "d-mono-1-m50",
    "name": "KDL/D-mono 1 M50: Black",
    "system": "mono",
    "cutoutSize": "50",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 1,
    "layoutKey": "mono-m50"
  },
  {
    "matnr": "87121154",
    "id": "e-plus-6-4",
    "name": "KDL/E+ 6/4: Black",
    "system": "e-plus",
    "cutoutSize": "6",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "e-plus-6-4"
  },
  {
    "matnr": "87121156",
    "id": "e-plus-6-1",
    "name": "KDL/E+ 6/1: Black",
    "system": "e-plus",
    "cutoutSize": "6",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 1,
    "layoutKey": "e-plus-6-1"
  },
  {
    "matnr": "87121150",
    "id": "e-plus-10-6",
    "name": "KDL/E+ 10/6: Black",
    "system": "e-plus",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 6,
    "layoutKey": "e-plus-10-6"
  },
  {
    "matnr": "87121152",
    "id": "e-plus-10-3",
    "name": "KDL/E+ 10/3: Black",
    "system": "e-plus",
    "cutoutSize": "10",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 2,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 3,
    "layoutKey": "e-plus-10-3"
  },
  {
    "matnr": "87121160",
    "id": "e-plus-16-8",
    "name": "KDL/E+ 16/8: Black",
    "system": "e-plus",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "e-plus-16-8"
  },
  {
    "matnr": "87121162",
    "id": "e-plus-16-5",
    "name": "KDL/E+ 16/5: Black",
    "system": "e-plus",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 5,
    "layoutKey": "e-plus-16-5"
  },
  {
    "matnr": "87121164",
    "id": "e-plus-16-2",
    "name": "KDL/E+ 16/2: Black",
    "system": "e-plus",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 2,
    "layoutKey": "e-plus-16-2"
  },
  {
    "matnr": "87121130",
    "id": "e-plus-24-10",
    "name": "KDL/E+ 24/10: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 10,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 10,
    "layoutKey": "e-plus-24-10"
  },
  {
    "matnr": "87121120",
    "id": "e-plus-24-7",
    "name": "KDL/E+ 24/7: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 7,
    "layoutKey": "e-plus-24-7"
  },
  {
    "matnr": "87121110",
    "id": "e-plus-24-4",
    "name": "KDL/E+ 24/4: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 2,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 4,
    "layoutKey": "e-plus-24-4"
  },
  {
    "matnr": "87121112",
    "id": "e-plus-24-8",
    "name": "KDL/E+ 24/8: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 4,
    "totalOpenings": 8,
    "layoutKey": "e-plus-24-8"
  },
  {
    "matnr": "87121140",
    "id": "e-plus-24-11",
    "name": "KDL/E+ 24/11: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 3,
    "totalOpenings": 11,
    "layoutKey": "e-plus-24-11"
  },
  {
    "matnr": "87121122",
    "id": "e-plus-24-14",
    "name": "KDL/E+ 24/14: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 12,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 14,
    "layoutKey": "e-plus-24-14"
  },
  {
    "matnr": "87121142",
    "id": "e-plus-24-17",
    "name": "KDL/E+ 24/17: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 16,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 17,
    "layoutKey": "e-plus-24-17"
  },
  {
    "matnr": "87121132",
    "id": "e-plus-24-20",
    "name": "KDL/E+ 24/20: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 20,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 20,
    "layoutKey": "e-plus-24-20"
  },
  {
    "matnr": "87121114",
    "id": "e-plus-24-12",
    "name": "KDL/E+ 24/12: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 6,
    "totalOpenings": 12,
    "layoutKey": "e-plus-24-12"
  },
  {
    "matnr": "87121124",
    "id": "e-plus-24-21",
    "name": "KDL/E+ 24/21: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 18,
    "numberMedium": 0,
    "numberBig": 3,
    "totalOpenings": 21,
    "layoutKey": "e-plus-24-21"
  },
  {
    "matnr": "87121134",
    "id": "e-plus-24-30",
    "name": "KDL/E+ 24/30: Black",
    "system": "e-plus",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 30,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 30,
    "layoutKey": "e-plus-24-30"
  },
  {
    "matnr": "87121180",
    "id": "er-plus-25-1",
    "name": "KDL/ER+ 25/1: Black",
    "system": "e-plus",
    "cutoutSize": "25",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 1,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 1,
    "layoutKey": "er-plus-25-1"
  },
  {
    "matnr": "87121182",
    "id": "er-plus-32-1",
    "name": "KDL/ER+ 32/1: Black",
    "system": "e-plus",
    "cutoutSize": "32",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 1,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 1,
    "layoutKey": "er-plus-32-1"
  },
  {
    "matnr": "87121188",
    "id": "er-plus-50-1",
    "name": "KDL/ER+ 50/1: Black",
    "system": "e-plus",
    "cutoutSize": "50",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 1,
    "layoutKey": "e-plus-50-1"
  },
  {
    "matnr": "87121184",
    "id": "er-plus-50-2",
    "name": "KDL/ER+ 50/2: Black",
    "system": "e-plus",
    "cutoutSize": "50",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 2,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 2,
    "layoutKey": "e-plus-50-2"
  },
  {
    "matnr": "87121186",
    "id": "er-plus-50-4",
    "name": "KDL/ER+ 50/4: Black",
    "system": "e-plus",
    "cutoutSize": "50",
    "material": "plastic",
    "tightness": [
      "ip65"
    ],
    "fireClass": [
      "nachUL94V0"
    ],
    "resistance": [
      "laugen",
      "alkohole",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "e-plus-50-4"
  },
  {
    "matnr": "87121014",
    "id": "e-16-08",
    "name": "KDL/E 16/8: Black",
    "system": "e",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 8,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 8,
    "layoutKey": "e-16-8"
  },
  {
    "matnr": "87121012",
    "id": "e-16-05",
    "name": "KDL/E 16/5: Black",
    "system": "e",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 5,
    "layoutKey": "e-16-5"
  },
  {
    "matnr": "87121011",
    "id": "e-16-04",
    "name": "KDL/E 16/4: Black",
    "system": "e",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 4,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 4,
    "layoutKey": "e-16-4"
  },
  {
    "matnr": "87121010",
    "id": "e-16-02",
    "name": "KDL/E 16/2: Black",
    "system": "e",
    "cutoutSize": "16",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 0,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 2,
    "layoutKey": "e-16-2"
  },
  {
    "matnr": "87121020",
    "id": "e-24-10",
    "name": "KDL/E 24/10: Black",
    "system": "e",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 10,
    "numberMedium": 0,
    "numberBig": 0,
    "totalOpenings": 10,
    "layoutKey": "e-24-10"
  },
  {
    "matnr": "87121018",
    "id": "e-24-07",
    "name": "KDL/E 24/7: Black",
    "system": "e",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 6,
    "numberMedium": 0,
    "numberBig": 1,
    "totalOpenings": 7,
    "layoutKey": "e-24-7"
  },
  {
    "matnr": "87121016",
    "id": "e-24-04",
    "name": "KDL/E 24/4: Black",
    "system": "e",
    "cutoutSize": "24",
    "material": "plastic",
    "tightness": [
      "ip54"
    ],
    "fireClass": [
      "HB"
    ],
    "resistance": [
      "laugen",
      "schwacheSauren",
      "alkohole",
      "fette",
      "kraftstoffe",
      "mineralole"
    ],
    "fda": false,
    "numberSmall": 2,
    "numberMedium": 0,
    "numberBig": 2,
    "totalOpenings": 4,
    "layoutKey": "e-24-4"
  }
];

// 4. CATALOG 166 ĐỆM LUỒN CÁP GROMMETS (KDT/ZE, KDT/X, ĐỆM ĐÔI, ĐỆM 4, ĐỆM BLIND)
export const KDL_GROMMETS: KdlGrommetItem[] = [
  {
    "matnr": "87121210",
    "name": "KDT/ZE 03: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 03 (3mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 3,
    "color": "Black"
  },
  {
    "matnr": "87121212",
    "name": "KDT/ZE 04: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 04 (4mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 4,
    "color": "Black"
  },
  {
    "matnr": "87121214",
    "name": "KDT/ZE 05: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 05 (5mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 5,
    "color": "Black"
  },
  {
    "matnr": "87121216",
    "name": "KDT/ZE 06: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 06 (6mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 6,
    "color": "Black"
  },
  {
    "matnr": "87121218",
    "name": "KDT/ZE 07: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 07 (7mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 7,
    "color": "Black"
  },
  {
    "matnr": "87121220",
    "name": "KDT/ZE 08: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 08 (8mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 8,
    "color": "Black"
  },
  {
    "matnr": "87121222",
    "name": "KDT/ZE 09: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 09 (9mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 9,
    "color": "Black"
  },
  {
    "matnr": "87121224",
    "name": "KDT/ZE 10: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 10 (10mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 10,
    "color": "Black"
  },
  {
    "matnr": "87121226",
    "name": "KDT/ZE 11: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 11 (11mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 11,
    "color": "Black"
  },
  {
    "matnr": "87121228",
    "name": "KDT/ZE 12: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 12 (12mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 12,
    "color": "Black"
  },
  {
    "matnr": "87121230",
    "name": "KDT/ZE 13: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 13 (13mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 13,
    "color": "Black"
  },
  {
    "matnr": "87121232",
    "name": "KDT/ZE 14: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 14 (14mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 14,
    "color": "Black"
  },
  {
    "matnr": "87121234",
    "name": "KDT/ZE 15: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 15 (15mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 15,
    "color": "Black"
  },
  {
    "matnr": "87121236",
    "name": "KDT/ZE 16: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 16 (16mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 16,
    "color": "Black"
  },
  {
    "matnr": "87121238",
    "name": "KDT/ZE 17: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 17 (17mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 17,
    "color": "Black"
  },
  {
    "matnr": "87121240",
    "name": "KDT/ZE 18: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 18 (18mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 18,
    "color": "Black"
  },
  {
    "matnr": "87121242",
    "name": "KDT/ZE 19: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 19 (19mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 19,
    "color": "Black"
  },
  {
    "matnr": "87121244",
    "name": "KDT/ZE 20: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 20 (20mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 20,
    "color": "Black"
  },
  {
    "matnr": "87121246",
    "name": "KDT/ZE 21: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 21 (21mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 21,
    "color": "Black"
  },
  {
    "matnr": "87121248",
    "name": "KDT/ZE 22: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 22 (22mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 22,
    "color": "Black"
  },
  {
    "matnr": "87121250",
    "name": "KDT/ZE 23: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 23 (23mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 23,
    "color": "Black"
  },
  {
    "matnr": "87121252",
    "name": "KDT/ZE 24: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 24 (24mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 24,
    "color": "Black"
  },
  {
    "matnr": "87121254",
    "name": "KDT/ZE 25: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 25 (25mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 25,
    "color": "Black"
  },
  {
    "matnr": "87121256",
    "name": "KDT/ZE 26: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 26 (26mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 26,
    "color": "Black"
  },
  {
    "matnr": "87121258",
    "name": "KDT/ZE 27: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 27 (27mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 27,
    "color": "Black"
  },
  {
    "matnr": "87121260",
    "name": "KDT/ZE 28: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 28 (28mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 28,
    "color": "Black"
  },
  {
    "matnr": "87121262",
    "name": "KDT/ZE 29: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 29 (29mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 29,
    "color": "Black"
  },
  {
    "matnr": "87121264",
    "name": "KDT/ZE 30: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 30 (30mm)",
    "category": "KDL/E cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 30,
    "color": "Black"
  },
  {
    "matnr": "87121266",
    "name": "BTK/E: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTK/E",
    "category": "KDL/E cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121268",
    "name": "ATG/E: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n ATG/E",
    "category": "KDL/E cable entry system",
    "type": "Adaptert\u00fclle f\u00fcr kleine T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121270",
    "name": "BTG/E: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTG/E",
    "category": "KDL/E cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121272",
    "name": "KDT/VE 3-7: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/VE 3-7 (3mm)",
    "category": "KDL/E cable entry system",
    "type": "variable Leitungst\u00fclle",
    "size": "small",
    "diameter": 3,
    "color": "Black"
  },
  {
    "matnr": "87121274",
    "name": "KDT/VE 7-10: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/VE 7-10 (7mm)",
    "category": "KDL/E cable entry system",
    "type": "variable Leitungst\u00fclle",
    "size": "small",
    "diameter": 7,
    "color": "Black"
  },
  {
    "matnr": "87121280",
    "name": "KDT/ZE 2xASI double grommet: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p m\u1ea1ng bus ASI KDT/ZE 2xASI double grommet",
    "category": "KDL/E cable entry system",
    "type": "ASI-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121281",
    "name": "BST KDT/ZE ASI: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p m\u1ea1ng bus ASI BST KDT/ZE ASI",
    "category": "KDL/E cable entry system",
    "type": "Blindstopfen ASI-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121282",
    "name": "KDT/ZE ASI: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p m\u1ea1ng bus ASI KDT/ZE ASI",
    "category": "KDL/E cable entry system",
    "type": "ASI-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121284",
    "name": "KDT/ZE 2x4 double grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 2x4 double grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 2-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121286",
    "name": "KDT/ZE 2x5 double grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 2x5 double grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 2-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121288",
    "name": "KDT/ZE 2x6 double grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 2x6 double grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 2-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121290",
    "name": "KDT/ZE 2x7 double grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 2x7 double grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 2-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121291",
    "name": "KDT/ZE 2x8 double grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 2x8 double grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 2-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121292",
    "name": "KDT/ZE 4x2 quadruple grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 4x2 quadruple grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121293",
    "name": "KDT/ZE 4x3 quadruple grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 4x3 quadruple grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121294",
    "name": "KDT/ZE 4x4 quadruple grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 4x4 quadruple grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121295",
    "name": "KDT/ZE 4x5 quadruple grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 4x5 quadruple grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121296",
    "name": "KDT/ZE 4x6 quadruple grommet: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE 4x6 quadruple grommet",
    "category": "KDL/E cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87121310",
    "name": "KDT/ZE+ 03: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 03 (3mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 3,
    "color": "Black"
  },
  {
    "matnr": "87121312",
    "name": "KDT/ZE+ 04: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 04 (4mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 4,
    "color": "Black"
  },
  {
    "matnr": "87121314",
    "name": "KDT/ZE+ 05: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 05 (5mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 5,
    "color": "Black"
  },
  {
    "matnr": "87121316",
    "name": "KDT/ZE+ 06: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 06 (6mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 6,
    "color": "Black"
  },
  {
    "matnr": "87121318",
    "name": "KDT/ZE+ 07: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 07 (7mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 7,
    "color": "Black"
  },
  {
    "matnr": "87121320",
    "name": "KDT/ZE+ 08: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 08 (8mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 8,
    "color": "Black"
  },
  {
    "matnr": "87121322",
    "name": "KDT/ZE+ 09: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 09 (9mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 9,
    "color": "Black"
  },
  {
    "matnr": "87121324",
    "name": "KDT/ZE+ 10: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 10 (10mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 10,
    "color": "Black"
  },
  {
    "matnr": "87121326",
    "name": "KDT/ZE+ 11: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 11 (11mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 11,
    "color": "Black"
  },
  {
    "matnr": "87121328",
    "name": "KDT/ZE+ 12: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 12 (12mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 12,
    "color": "Black"
  },
  {
    "matnr": "87121330",
    "name": "KDT/ZE+ 13: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 13 (13mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 13,
    "color": "Black"
  },
  {
    "matnr": "87121332",
    "name": "KDT/ZE+ 14: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 14 (14mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 14,
    "color": "Black"
  },
  {
    "matnr": "87121334",
    "name": "KDT/ZE+ 15: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 15 (15mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 15,
    "color": "Black"
  },
  {
    "matnr": "87121336",
    "name": "KDT/ZE+ 16: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 16 (16mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 16,
    "color": "Black"
  },
  {
    "matnr": "87121338",
    "name": "KDT/ZE+ 17: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 17 (17mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 17,
    "color": "Black"
  },
  {
    "matnr": "87121340",
    "name": "KDT/ZE+ 18: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 18 (18mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 18,
    "color": "Black"
  },
  {
    "matnr": "87121342",
    "name": "KDT/ZE+ 19: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 19 (19mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 19,
    "color": "Black"
  },
  {
    "matnr": "87121344",
    "name": "KDT/ZE+ 20: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 20 (20mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 20,
    "color": "Black"
  },
  {
    "matnr": "87121346",
    "name": "KDT/ZE+ 21: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 21 (21mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 21,
    "color": "Black"
  },
  {
    "matnr": "87121348",
    "name": "KDT/ZE+ 22: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 22 (22mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 22,
    "color": "Black"
  },
  {
    "matnr": "87121350",
    "name": "KDT/ZE+ 23: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 23 (23mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 23,
    "color": "Black"
  },
  {
    "matnr": "87121352",
    "name": "KDT/ZE+ 24: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 24 (24mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 24,
    "color": "Black"
  },
  {
    "matnr": "87121354",
    "name": "KDT/ZE+ 25: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 25 (25mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 25,
    "color": "Black"
  },
  {
    "matnr": "87121356",
    "name": "KDT/ZE+ 26: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 26 (26mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 26,
    "color": "Black"
  },
  {
    "matnr": "87121358",
    "name": "KDT/ZE+ 27: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 27 (27mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 27,
    "color": "Black"
  },
  {
    "matnr": "87121360",
    "name": "KDT/ZE+ 28: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 28 (28mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 28,
    "color": "Black"
  },
  {
    "matnr": "87121362",
    "name": "KDT/ZE+ 29: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 29 (29mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 29,
    "color": "Black"
  },
  {
    "matnr": "87121364",
    "name": "KDT/ZE+ 30: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ 30 (30mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 30,
    "color": "Black"
  },
  {
    "matnr": "87121372",
    "name": "KDT/ZE+ flex 03-13: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ flex 03-13 (3mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 3,
    "color": "Black"
  },
  {
    "matnr": "87121374",
    "name": "KDT/ZE+ flex 13-30: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/ZE+ flex 13-30 (13mm)",
    "category": "KDL cable entry system for railway technology",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 13,
    "color": "Black"
  },
  {
    "matnr": "87141210",
    "name": "KDT/X 02: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 02 (2mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 2,
    "color": "Black"
  },
  {
    "matnr": "87141212",
    "name": "KDT/X 03: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 03 (3mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 3,
    "color": "Black"
  },
  {
    "matnr": "87141214",
    "name": "KDT/X 04: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 04 (4mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 4,
    "color": "Black"
  },
  {
    "matnr": "87141216",
    "name": "KDT/X 05: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 05 (5mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 5,
    "color": "Black"
  },
  {
    "matnr": "87141218",
    "name": "KDT/X 06: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 06 (6mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 6,
    "color": "Black"
  },
  {
    "matnr": "87141220",
    "name": "KDT/X 07: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 07 (7mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 7,
    "color": "Black"
  },
  {
    "matnr": "87141222",
    "name": "KDT/X 08: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 08 (8mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 8,
    "color": "Black"
  },
  {
    "matnr": "87141224",
    "name": "KDT/X 09: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 09 (9mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 9,
    "color": "Black"
  },
  {
    "matnr": "87141226",
    "name": "KDT/X 10: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 10 (10mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 10,
    "color": "Black"
  },
  {
    "matnr": "87141228",
    "name": "KDT/X 11: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 11 (11mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 11,
    "color": "Black"
  },
  {
    "matnr": "87141230",
    "name": "KDT/X 12: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 12 (12mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 12,
    "color": "Black"
  },
  {
    "matnr": "87141232",
    "name": "KDT/X 13: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 13 (13mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 13,
    "color": "Black"
  },
  {
    "matnr": "87141234",
    "name": "KDT/X 14: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 14 (14mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 14,
    "color": "Black"
  },
  {
    "matnr": "87141236",
    "name": "KDT/X 15: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 15 (15mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 15,
    "color": "Black"
  },
  {
    "matnr": "87141238",
    "name": "KDT/X 16: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 16 (16mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "small",
    "diameter": 16,
    "color": "Black"
  },
  {
    "matnr": "87141240",
    "name": "KDT/X 17: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 17 (17mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 17,
    "color": "Black"
  },
  {
    "matnr": "87141242",
    "name": "KDT/X 18: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 18 (18mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 18,
    "color": "Black"
  },
  {
    "matnr": "87141244",
    "name": "KDT/X 19: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 19 (19mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 19,
    "color": "Black"
  },
  {
    "matnr": "87141246",
    "name": "KDT/X 20: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 20 (20mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 20,
    "color": "Black"
  },
  {
    "matnr": "87141248",
    "name": "KDT/X 21: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 21 (21mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 21,
    "color": "Black"
  },
  {
    "matnr": "87141250",
    "name": "KDT/X 22: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 22 (22mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "medium",
    "diameter": 22,
    "color": "Black"
  },
  {
    "matnr": "87141252",
    "name": "KDT/X 23: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 23 (23mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 23,
    "color": "Black"
  },
  {
    "matnr": "87141254",
    "name": "KDT/X 24: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 24 (24mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 24,
    "color": "Black"
  },
  {
    "matnr": "87141256",
    "name": "KDT/X 25: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 25 (25mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 25,
    "color": "Black"
  },
  {
    "matnr": "87141258",
    "name": "KDT/X 26: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 26 (26mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 26,
    "color": "Black"
  },
  {
    "matnr": "87141260",
    "name": "KDT/X 27: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 27 (27mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 27,
    "color": "Black"
  },
  {
    "matnr": "87141262",
    "name": "KDT/X 28: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 28 (28mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 28,
    "color": "Black"
  },
  {
    "matnr": "87141264",
    "name": "KDT/X 29: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 29 (29mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle",
    "size": "big",
    "diameter": 29,
    "color": "Black"
  },
  {
    "matnr": "87141265",
    "name": "BTG/XL (dummy grommet): Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTG/XL (dummy grommet)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141266",
    "name": "BTG/X (dummy grommet): Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTG/X (dummy grommet)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141267",
    "name": "ATG/XL adapter grommet: Black",
    "vnName": "\u0110\u1ec7m chuy\u1ec3n \u0111\u1ed5i k\u00edch th\u01b0\u1edbc ATG/XL adapter grommet",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Adaptert\u00fclle f\u00fcr mittlere T\u00fclle",
    "size": "big",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141268",
    "name": "ATG/X: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n ATG/X",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Adaptert\u00fclle f\u00fcr kleine T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141270",
    "name": "BTK/X (dummy grommet): Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTK/X (dummy grommet)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141272",
    "name": "KDT/X 2xASI: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p m\u1ea1ng bus ASI KDT/X 2xASI",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "ASI-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141274",
    "name": "KDT/X 1xASI: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p m\u1ea1ng bus ASI KDT/X 1xASI",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "ASI-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141275",
    "name": "KDT/X 2x2: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x2",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141276",
    "name": "KDT/X 4x2: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x2",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141277",
    "name": "KDT/X 2x3: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x3",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141278",
    "name": "KDT/X 4x3: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x3",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141279",
    "name": "KDT/X 2x4: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x4",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141280",
    "name": "KDT/X 4x4: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x4",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141281",
    "name": "KDT/X 2x5: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x5",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141282",
    "name": "KDT/X 4x5: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x5",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141283",
    "name": "KDT/X 2x6: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x6",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141284",
    "name": "KDT/X 4x6: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x6",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141285",
    "name": "KDT/X 2x7: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x7",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141286",
    "name": "KDT/X 4x7: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x7",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141287",
    "name": "KDT/X 2x8: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 2x8",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Doppelleitungst\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141288",
    "name": "KDT/X 4x8: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X 4x8",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Mehrfacht\u00fclle 4-fach",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141292",
    "name": "KDT/X-LAN: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p m\u1ea1ng LAN / RJ45 KDT/X-LAN",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "LAN-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141294",
    "name": "KDT/X-USB 0.5m: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p USB c\u00f4ng nghi\u1ec7p KDT/X-USB 0.5m",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "USB-T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Black"
  },
  {
    "matnr": "87141296",
    "name": "KDT/X-USB 1.0m: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p USB c\u00f4ng nghi\u1ec7p KDT/X-USB 1.0m (1mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "USB-T\u00fclle",
    "size": "small",
    "diameter": 1,
    "color": "Black"
  },
  {
    "matnr": "87141298",
    "name": "KDT/X-USB 3.0m: Black",
    "vnName": "\u0110\u1ec7m c\u00e1p USB c\u00f4ng nghi\u1ec7p KDT/X-USB 3.0m (3mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "USB-T\u00fclle",
    "size": "small",
    "diameter": 3,
    "color": "Black"
  },
  {
    "matnr": "87141710",
    "name": "KDT/X-FDA 02, 02-03: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 02, 02-03 (2mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 2,
    "color": "Standard"
  },
  {
    "matnr": "87141712",
    "name": "KDT/X-FDA 03, 03-04: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 03, 03-04 (3mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 3,
    "color": "Standard"
  },
  {
    "matnr": "87141714",
    "name": "KDT/X-FDA 04, 04-05: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 04, 04-05 (4mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 4,
    "color": "Standard"
  },
  {
    "matnr": "87141716",
    "name": "KDT/X-FDA 05, 05-06: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 05, 05-06 (5mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 5,
    "color": "Standard"
  },
  {
    "matnr": "87141718",
    "name": "KDT/X-FDA 06, 06-07: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 06, 06-07 (6mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 6,
    "color": "Standard"
  },
  {
    "matnr": "87141720",
    "name": "KDT/X-FDA 07, 07-08: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 07, 07-08 (7mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 7,
    "color": "Standard"
  },
  {
    "matnr": "87141722",
    "name": "KDT/X-FDA 08, 08-09: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 08, 08-09 (8mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 8,
    "color": "Standard"
  },
  {
    "matnr": "87141724",
    "name": "KDT/X-FDA 09, 09-10: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 09, 09-10 (9mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 9,
    "color": "Standard"
  },
  {
    "matnr": "87141726",
    "name": "KDT/X-FDA 10, 10-11: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 10, 10-11 (10mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 10,
    "color": "Standard"
  },
  {
    "matnr": "87141728",
    "name": "KDT/X-FDA 11, 11-12: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 11, 11-12 (11mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 11,
    "color": "Standard"
  },
  {
    "matnr": "87141730",
    "name": "KDT/X-FDA 12: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 12 (12mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 12,
    "color": "Standard"
  },
  {
    "matnr": "87141732",
    "name": "KDT/X-FDA 13, 13-14: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 13, 13-14 (13mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 13,
    "color": "Standard"
  },
  {
    "matnr": "87141734",
    "name": "KDT/X-FDA 14, 14-15: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 14, 14-15 (14mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 14,
    "color": "Standard"
  },
  {
    "matnr": "87141736",
    "name": "KDT/X-FDA 15, 15-16: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 15, 15-16 (15mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 15,
    "color": "Standard"
  },
  {
    "matnr": "87141738",
    "name": "KDT/X-FDA 16, 16-17: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 16, 16-17 (16mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "small",
    "diameter": 16,
    "color": "Standard"
  },
  {
    "matnr": "87141740",
    "name": "KDT/X-FDA 17, 17-18: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 17, 17-18 (17mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "medium",
    "diameter": 17,
    "color": "Standard"
  },
  {
    "matnr": "87141742",
    "name": "KDT/X-FDA 18, 18-19: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 18, 18-19 (18mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "medium",
    "diameter": 18,
    "color": "Standard"
  },
  {
    "matnr": "87141744",
    "name": "KDT/X-FDA 19, 19-20: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 19, 19-20 (19mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "medium",
    "diameter": 19,
    "color": "Standard"
  },
  {
    "matnr": "87141746",
    "name": "KDT/X-FDA 20, 20-21: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 20, 20-21 (20mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "medium",
    "diameter": 20,
    "color": "Standard"
  },
  {
    "matnr": "87141748",
    "name": "KDT/X-FDA 21, 21-22: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 21, 21-22 (21mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "medium",
    "diameter": 21,
    "color": "Standard"
  },
  {
    "matnr": "87141750",
    "name": "KDT/X-FDA 22, 22-23: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 22, 22-23 (22mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "medium",
    "diameter": 22,
    "color": "Standard"
  },
  {
    "matnr": "87141752",
    "name": "KDT/X-FDA 23, 23-24: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 23, 23-24 (23mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 23,
    "color": "Standard"
  },
  {
    "matnr": "87141754",
    "name": "KDT/X-FDA 24, 24-25: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 24, 24-25 (24mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 24,
    "color": "Standard"
  },
  {
    "matnr": "87141756",
    "name": "KDT/X-FDA 25, 25-26: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 25, 25-26 (25mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 25,
    "color": "Standard"
  },
  {
    "matnr": "87141758",
    "name": "KDT/X-FDA 26, 26-27: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 26, 26-27 (26mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 26,
    "color": "Standard"
  },
  {
    "matnr": "87141760",
    "name": "KDT/X-FDA 27, 27-28: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 27, 27-28 (27mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 27,
    "color": "Standard"
  },
  {
    "matnr": "87141762",
    "name": "KDT/X-FDA 28, 28-29: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 28, 28-29 (28mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 28,
    "color": "Standard"
  },
  {
    "matnr": "87141764",
    "name": "KDT/X-FDA 29, 29-30: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n KDT/X-FDA 29, 29-30 (29mm)",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Kabeldurchf\u00fchrungst\u00fclle FDA",
    "size": "big",
    "diameter": 29,
    "color": "Standard"
  },
  {
    "matnr": "87141765",
    "name": "BTG/XL-FDA Dummy grommet large: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTG/XL-FDA Dummy grommet large",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Standard"
  },
  {
    "matnr": "87141766",
    "name": "BTG/X-FDA Blindt\u00fclle mittel: Blue",
    "vnName": "\u0110\u1ec7m b\u00edt k\u00edn (Blind plug) BTG/X-FDA Blindt\u00fclle mittel",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Standard"
  },
  {
    "matnr": "87141768",
    "name": "ATG/X-FDA: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n ATG/X-FDA",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Adaptert\u00fclle f\u00fcr kleine T\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Standard"
  },
  {
    "matnr": "87141770",
    "name": "BTK/X-FDA Dummy grommet: Blue",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n BTK/X-FDA Dummy grommet",
    "category": "KDL/C, KDL/D and KDL/H cable entry system",
    "type": "Blindt\u00fclle",
    "size": "small",
    "diameter": null,
    "color": "Standard"
  },
  {
    "matnr": "87174250",
    "name": "SDT/ZE 07: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n SDT/ZE 07 (7mm)",
    "category": "KDL/E cable entry system",
    "type": "Schlaucht\u00fclle",
    "size": "small",
    "diameter": 7,
    "color": "Black"
  },
  {
    "matnr": "87174252",
    "name": "SDT/ZE 09: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n SDT/ZE 09 (9mm)",
    "category": "KDL/E cable entry system",
    "type": "Schlaucht\u00fclle",
    "size": "small",
    "diameter": 9,
    "color": "Black"
  },
  {
    "matnr": "87174254",
    "name": "SDT/ZE 11: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n SDT/ZE 11 (11mm)",
    "category": "KDL/E cable entry system",
    "type": "Schlaucht\u00fclle",
    "size": "small",
    "diameter": 11,
    "color": "Black"
  },
  {
    "matnr": "87174256",
    "name": "SDT/ZE 16: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n SDT/ZE 16 (16mm)",
    "category": "KDL/E cable entry system",
    "type": "Schlaucht\u00fclle",
    "size": "small",
    "diameter": 16,
    "color": "Black"
  },
  {
    "matnr": "87174258",
    "name": "SDT/ZE 21: Black",
    "vnName": "\u0110\u1ec7m lu\u1ed3n c\u00e1p \u0111\u01a1n SDT/ZE 21 (21mm)",
    "category": "KDL/E cable entry system",
    "type": "Schlaucht\u00fclle",
    "size": "medium",
    "diameter": 21,
    "color": "Black"
  }
];

// 5. ĐỆM BÍT KÍN MẶC ĐỊNH CHO TỪNG SIZE
export const DEFAULT_BLANK_GROMMETS = {
  small: {
    matnr: '87121280',
    name: 'BTK/E small: Black',
    vnName: 'Đệm bít kín BTK size nhỏ (Blank plug)',
    category: 'KDL/E cable entry system',
    type: 'Blindtülle',
    size: 'small' as GrommetSize,
    color: 'Black'
  },
  medium: {
    matnr: '87141280',
    name: 'BTG/M medium: Black',
    vnName: 'Đệm bít kín BTG size vừa (Blank plug)',
    category: 'KDL/C, KDL/D and KDL/H cable entry system',
    type: 'Blindtülle',
    size: 'medium' as GrommetSize,
    color: 'Black'
  },
  big: {
    matnr: '87141282',
    name: 'BTG/G big: Black',
    vnName: 'Đệm bít kín BTG size lớn (Blank plug)',
    category: 'KDL/C, KDL/D and KDL/H cable entry system',
    type: 'Blindtülle',
    size: 'big' as GrommetSize,
    color: 'Black'
  }
};

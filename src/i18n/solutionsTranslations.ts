import { Solution } from '../types';
import { SupportedLocale } from '../components/FlagIcon';

export interface LocalizedSolutionText {
  title: string;
  subtitle: string;
  desc: string;
  badge: string;
  tag?: string;
  standards: string[];
}

export const SOLUTIONS_TRANSLATIONS: Record<string, Partial<Record<SupportedLocale, LocalizedSolutionText>>> = {
  'murrplastik': {
    vi: {
      title: 'MURRPLASTIK (CHÍNH HÃNG ĐỨC)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: 'Hệ thống xích dẫn cáp EVOCHAIN, khớp bi KEG/ZL, vòng ống SRF, hộp thu hồi R-Tec Box / Liner, giá đỡ robot FHS và máy khắc laser mp-LM 1.',
      tag: 'Murrplastik Germany',
      badge: 'Made in Germany',
      standards: ['Đầy đủ chứng từ hàng hóa', 'Chịu uốn mỏi hàng triệu chu kỳ', 'Có bảo hành chính hãng']
    },
    en: {
      title: 'MURRPLASTIK (OFFICIAL GERMANY)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: 'EVOCHAIN energy chains, KEG/ZL ball joints, SRF hose rings, R-Tec Box / Liner retraction systems, FHS brackets and mp-LM 1 laser markers.',
      tag: 'Murrplastik Germany',
      badge: 'Made in Germany',
      standards: ['Full CO/CQ compliance', 'High flex endurance >17M cycles', 'Official factory warranty']
    },
    'zh-CN': {
      title: '德国 MURRPLASTIK (官方授权)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: '德国莫尔塑料 EVOCHAIN 拖链、KEG/ZL 球头万向节、SRF 软管保护环、R-Tec Box/Liner 管线包回位系统、FHS 机器人支架与 mp-LM 1 激光打标机。',
      tag: '德国原装 Murrplastik',
      badge: '德国原装制造',
      standards: ['合规原厂CO/CQ', '超1700万次耐弯折寿命', '官方原厂质保']
    },
    de: {
      title: 'MURRPLASTIK (ORIGINAL DEUTSCHLAND)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: 'EVOCHAIN Energieführungsketten, KEG/ZL Kugelgelenke, SRF Schlauchringe, R-Tec Box / Liner Rückzugssysteme, FHS Halterungen und mp-LM 1 Lasermarkierer.',
      tag: 'Murrplastik Deutschland',
      badge: 'Made in Germany',
      standards: ['Vollständiges CO/CQ', '>17 Mio. Biegezyklen Lebensdauer', 'Herstellergarantie']
    },
    ko: {
      title: '독일 MURRPLASTIK (공식 유통)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: '독일 Murrplastik EVOCHAIN 케이블 트레이, KEG/ZL 볼 조인트, SRF 호스 링, R-Tec Box/Liner 로봇 드레스팩 회수 시스템, FHS 브래킷 및 mp-LM 1 레이저 마킹기.',
      tag: '독일 Murrplastik',
      badge: '독일 완제품 생산',
      standards: ['공식 CO/CQ 인증', '1700만 회 이상 내구성 검증', '제조사 공식 보증']
    },
    ja: {
      title: 'ドイツ MURRPLASTIK (正規代理店)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: 'EVOCHAIN ケーブルベア、KEG/ZL ボールジョイント、SRF ホースリング、R-Tec Box/Liner ロボットケーブル引き戻しシステム、FHS 取付ブラケット、レーザーマーカー。',
      tag: 'ドイツ Murrplastik',
      badge: 'ドイツ製',
      standards: ['CO/CQ証明書完備', '1,775万回屈曲耐久試験クリア', '正規メーカー保証']
    },
    th: {
      title: 'MURRPLASTIK (ของแท้จากเยอรมนี)',
      subtitle: 'Robotics Dresspack & Energy Chains',
      desc: 'รางกระดูกงูร้อยสายไฟ EVOCHAIN, ข้อต่อลูกหมาก KEG/ZL, แหวนรัดท่อ SRF, ระบบดึงกลับท่อร้อยสาย R-Tec Box / Liner และขายึดหุ่นยนต์ FHS',
      tag: 'Murrplastik เยอรมนี',
      badge: 'ผลิตในเยอรมนี',
      standards: ['มีใบรับรอง CO/CQ ครบถ้วน', 'ทนทานต่อการดัดงอกว่า 17 ล้านรอบ', 'รับประกันจากศูนย์']
    }
  },
  'thiet-bi-han': {
    vi: {
      title: 'THIẾT BỊ HÀN & ROBOT HÀN TỰ ĐỘNG',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: 'Robot hàn tự động 3-6 trục, trạm hàn cao tần Quick 205, máy hàn Hakko 936, bể hàn thiếc CM-508 / CM-808 và phụ kiện mũi hàn.',
      badge: 'Chính Hãng',
      standards: ['Đầy đủ chứng từ hàng hóa', 'Có bảo hành chính hãng', 'Sẵn hàng kho']
    },
    en: {
      title: 'SMT SOLDERING & ROBOTIC SOLDERING',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: '3-6 axis automatic soldering robots, Quick 205 high-frequency stations, Hakko 936, CM-508/808 solder pots and replacement tips.',
      badge: '100% Genuine',
      standards: ['Full CO/CQ compliance', 'Official factory warranty', 'Ready in stock']
    },
    'zh-CN': {
      title: 'SMT焊接设备与全自动焊接机器人',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: '3-6轴全自动点焊机器人、快克Quick 205高频焊台、白光Hakko 936、CM-508/808熔锡炉及各型烙铁头配件。',
      badge: '原装正品',
      standards: ['合规原厂CO/CQ', '官方原厂质保', '现货即发']
    },
    de: {
      title: 'SMT-LÖTSYSTEME & AUTOMATISCHE LÖTROBOTER',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: '3-6-Achs-Lötroboter, Quick 205 Hochfrequenz-Lötstationen, Hakko 936, CM-508/808 Löttiegel und Lötspitzen.',
      badge: '100% Original',
      standards: ['Vollständiges CO/CQ', 'Herstellergarantie', 'Auf Lager']
    },
    ko: {
      title: 'SMT 솔더링 장비 & 자동 납땜 로봇',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: '3-6축 자동 납땜 로봇, Quick 205 고주파 인두기, Hakko 936, CM-508/808 납조 및 인두 팁 부품.',
      badge: '정품 보증',
      standards: ['공식 CO/CQ 인증', '제조사 무상 보증', '창고 재고 완비']
    },
    ja: {
      title: 'SMTはんだ付け装置＆自動はんだ付けロボット',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: '3〜6軸自動はんだ付けロボット、Quick 205高周波はんだ付けステーション、白光Hakko 936、CM-508/808はんだ槽。',
      badge: 'メーカー純正品',
      standards: ['CO/CQ証明書完備', 'メーカー保証付き', '国内即納在庫']
    },
    th: {
      title: 'อุปกรณ์บัดกรี SMT และหุ่นยนต์บัดกรีอัตโนมัติ',
      subtitle: 'Soldering Stations & Robotic Soldering',
      desc: 'หุ่นยนต์บัดกรี 3-6 แกน, เครื่องบัดกรีความถี่สูง Quick 205, Hakko 936, หม้อต้มตะกั่ว CM-508/808 และปลายหัวแร้ง',
      badge: 'ของแท้ 100%',
      standards: ['เอกสาร CO/CQ ครบถ้วน', 'รับประกันศูนย์', 'มีสินค้าพร้อมส่ง']
    }
  },
  'may-bat-vit-nha-vit': {
    vi: {
      title: 'MÁY BẮT VÍT & NHẢ VÍT TỰ ĐỘNG',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: 'Robot bắt vít tự động 6 trục, máy bắt vít HIOS CL-3000 / CL-4000, nguồn CLT-50, máy nhả vít và máy đo lực siết HP-10.',
      badge: 'Độ chính xác cao',
      standards: ['Chuẩn lực siết ISO', 'Động cơ siêu bền', 'Hàng sẵn kho']
    },
    en: {
      title: 'PRECISION ELECTRIC SCREWDRIVERS & FEEDERS',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: '6-axis automatic screwdriving robots, HIOS CL-3000 / CL-4000 electric screwdrivers, CLT-50 power supply, and HP-10 torque meters.',
      badge: 'High Precision',
      standards: ['ISO torque standard', 'Heavy-duty motor', 'Ready in stock']
    },
    'zh-CN': {
      title: '精密电动螺丝刀与自动锁螺丝机',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: '6轴全自动锁螺丝机器人、HIOS好芝CL-3000/CL-4000电动螺丝刀、CLT-50电源、自动供螺丝机及HP-10扭力测试仪。',
      badge: '高精度扭力',
      standards: ['符合ISO扭力标准', '超耐久无刷电机', '现货充足']
    },
    de: {
      title: 'PRÄZISIONS-ELEKTROSCHRAUBER & ZUFÜHRER',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: '6-Achs-Schraubroboter, HIOS CL-3000 / CL-4000 Elektroschrauber, CLT-50 Netzteil und HP-10 Drehmomentmessgeräte.',
      badge: 'Hohe Präzision',
      standards: ['ISO-Drehmomentstandard', 'Langlebiger Motor', 'Auf Lager']
    },
    ko: {
      title: '정밀 전동 스크류드라이버 & 자동 피더',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: '6축 자동 체결 로봇, HIOS CL-3000/CL-4000 전동 드라이버, CLT-50 전원공급장치 및 HP-10 토크 테스터.',
      badge: '초정밀 토크',
      standards: ['ISO 토크 규격 준수', '초내구성 모터', '국내 재고 보유']
    },
    ja: {
      title: '精密電動トルクドライバー＆自動ねじ供給機',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: '6軸自動ねじ締めロボット、HIOS CL-3000 / CL-4000 電動ドライバー、CLT-50電源、HP-10トルクメーター。',
      badge: '高精度トルク',
      standards: ['ISOトルク基準適合', '高耐久モーター', '即納在庫あり']
    },
    th: {
      title: 'ไขควงไฟฟ้าความแม่นยำสูงและเครื่องป้อนสกรูอัตโนมัติ',
      subtitle: 'Electric Screwdrivers & Screw Feeders',
      desc: 'หุ่นยนต์ขันสกรู 6 แกน, ไขควงไฟฟ้า HIOS CL-3000/CL-4000, แหล่งจ่ายไฟ CLT-50 และเครื่องวัดแรงบิด HP-10',
      badge: 'แม่นยำสูง',
      standards: ['มาตรฐานแรงบิด ISO', 'มอเตอร์ทนทานพิเศษ', 'พร้อมส่งทันที']
    }
  },
  'dung-cu-bom-keo': {
    vi: {
      title: 'DỤNG CỤ & ROBOT BƠM KEO TỰ ĐỘNG',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: 'Robot bơm keo AB tự động, máy bơm keo SP-982, kim chóp nhựa, kim nhựa mũi sắt, xi lanh bơm keo và dây bơm keo.',
      badge: 'Chính xác từng giọt',
      standards: ['Chống nghẽn keo', 'Dung tích đa dạng', 'Giao ngay']
    },
    en: {
      title: 'AUTOMATED FLUID DISPENSING ROBOTS & TOOLS',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: 'Automatic 2-component AB dispensing robots, SP-982 dispensers, tapered tips, stainless steel needles, and barrels.',
      badge: 'Micro-Drop Precision',
      standards: ['Anti-clogging system', 'Versatile capacities', 'Fast delivery']
    },
    'zh-CN': {
      title: '全自动点胶机器人与流体分配工具',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: '全自动双组份AB高精度点胶机器人、SP-982数字定量点胶机、各式点胶针头、胶筒与输胶气管。',
      badge: '微升精准控胶',
      standards: ['防堵胶专利设计', '规格型号齐全', '现货闪电发货']
    },
    de: {
      title: 'AUTOMATISCHE DOSIERROBOTER & ZUBEHÖR',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: 'Automatische 2K-AB-Dosierroboter, SP-982 Präzisionsspender, Dosiernadeln und Zylinder.',
      badge: 'Tropfengenau',
      standards: ['Verstopfungsschutz', 'Vielfältige Volumina', 'Expressversand']
    },
    ko: {
      title: '자동 유체 디스펜싱 로봇 & 소모품',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: '자동 2액형 AB 디스펜싱 로봇, SP-982 정밀 디지털 디스펜서, 테이퍼 노즐 및 시린지 배럴.',
      badge: '정밀 도포 제어',
      standards: ['노즐 막힘 방지', '다양한 용량 규격', '당일 출고']
    },
    ja: {
      title: '全自動液体ディスペンサーロボット＆消耗品',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: '自動2液混合ABディスペンサーロボット、SP-982高精度デジタルディスペンサー、ディスペンス針、シリンジ。',
      badge: '微小液滴制御',
      standards: ['目詰まり防止機構', '多彩な容量対応', '即日出荷対応']
    },
    th: {
      title: 'หุ่นยนต์หยอดกาวอัตโนมัติและอุปกรณ์จ่ายของเหลว',
      subtitle: 'Dispensing Robots & Glue Accessories',
      desc: 'หุ่นยนต์หยอดกาว AB อัตโนมัติ, เครื่องหยอดกาว SP-982, หัวเข็มจ่ายกาว และหลอดไซริงค์',
      badge: 'แม่นยำทุกหยด',
      standards: ['ป้องกันการอุดตัน', 'ขนาดบรรจุหลากหลาย', 'จัดส่งรวดเร็ว']
    }
  },
  'may-cat-bang-dinh-tu-dong': {
    vi: {
      title: 'MÁY CẮT BĂNG DÍNH & TÁCH TEM NHÃN',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: 'Máy cắt băng dính tự động Zcut 9, Zcut 2, RT-3700, M1000/M1000S, máy tách tem nhãn decal AL-505LR, FTR-118C, 1150D.',
      badge: 'Cắt tự động 100%',
      standards: ['Cảm biến quang tự động', 'Độ dài tùy chỉnh', 'Hàng sẵn']
    },
    en: {
      title: 'AUTOMATIC TAPE DISPENSERS & LABEL PEELERS',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: 'Automatic tape cutters Zcut 9, Zcut 2, RT-3700, M1000/M1000S, label dispensers AL-505LR, FTR-118C, 1150D.',
      badge: '100% Automatic',
      standards: ['Optical sensor control', 'Custom cut length', 'In stock']
    },
    'zh-CN': {
      title: '全自动胶带切割机与标签剥离机',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: 'Zcut-9 / Zcut-2 双卷全自动胶带切割机、RT-3700、M1000/M1000S及AL-505LR、FTR-118C自动标签剥离机。',
      badge: '100%全自动裁切',
      standards: ['光电自动感应', '自由设定长度', '原装现货']
    },
    de: {
      title: 'AUTOMATISCHE KLEBEBAND- & ETIKETTENSPENDER',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: 'Automatische Bandschneider Zcut 9, Zcut 2, RT-3700, M1000/M1000S, Etikettenspender AL-505LR, 1150D.',
      badge: '100% Automatisch',
      standards: ['Optischer Sensor', 'Einstellbare Länge', 'Auf Lager']
    },
    ko: {
      title: '자동 테이프 커팅기 & 라벨 박리기',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: 'Zcut 9, Zcut 2, RT-3700, M1000/M1000S 자동 테이프 커터기 및 AL-505LR, 1150D 자동 라벨 분리기.',
      badge: '100% 자동 절단',
      standards: ['광학 센서 제어', '절단 길이 조절', '재고 상시 보유']
    },
    ja: {
      title: '自動テープカッター＆ラベル剥離機',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: '自動テープディスペンサー Zcut 9、Zcut 2、RT-3700、M1000/M1000S、自動ラベル剥離機 AL-505LR、1150D。',
      badge: '100% 自動裁断',
      standards: ['光電センサー搭載', 'ミリ単位の長さ設定', '即納対応']
    },
    th: {
      title: 'เครื่องตัดเทปอัตโนมัติและเครื่องลอกสติกเกอร์ฉลาก',
      subtitle: 'Tape Dispensers & Label Strippers',
      desc: 'เครื่องตัดเทปกาวอัตโนมัติ Zcut 9, Zcut 2, RT-3700, M1000 และเครื่องลอกสติกเกอร์ AL-505LR, 1150D',
      badge: 'ตัดอัตโนมัติ 100%',
      standards: ['ระบบเซนเซอร์ออปติคอล', 'กำหนดความยาวได้', 'มีสินค้าพร้อมส่ง']
    }
  },
  'thiet-bi-kiem-tra': {
    vi: {
      title: 'THIẾT BỊ ĐO LƯỜNG & KIỂM TRA',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'Máy đo lực siết HP-10, nhiệt kế đầu mỏ hàn Quick 191AD / 196, máy kiểm tra chống tĩnh điện Hakko 498, Hakko FG-101.',
      badge: 'Chuẩn QC Nhà Máy',
      standards: ['Độ chính xác cao', 'Có kiểm định xuất xưởng']
    },
    en: {
      title: 'MEASUREMENT, TORQUE & CALIBRATION TESTERS',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'Digital torque tester HP-10, soldering tip thermometers Quick 191AD / 196, Hakko 498 ESD tester, Hakko FG-101.',
      badge: 'QC Factory Standard',
      standards: ['High precision tolerance', 'Factory calibrated cert']
    },
    'zh-CN': {
      title: '工业计量仪器、扭力计与检测仪',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'HP-10高精度数显电批扭力计、快克Quick 191AD/196烙铁测温仪、白光Hakko 498手腕带测试仪与FG-101。',
      badge: '符合品管QC标准',
      standards: ['高精度容差检验', '附原厂出厂校准报告']
    },
    de: {
      title: 'MESSGERÄTE, DREHMOMENT & KALIBRIERUNG',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'Digitales Drehmomentmessgerät HP-10, Quick 191AD / 196 Lötspitzenthermometer, Hakko 498 ESD-Tester.',
      badge: 'QC-Werksstandard',
      standards: ['Hohe Messgenauigkeit', 'Kalibrierschein inklusive']
    },
    ko: {
      title: '정밀 측정기, 토크 테스터 & 계측 장비',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'HP-10 디지털 토크 미터, Quick 191AD/196 인두 팁 온도계, Hakko 498 정전기 테스터, FG-101.',
      badge: 'QC 공정 품질 표준',
      standards: ['초정밀 측정 오차', '출하 교정 성적서 완비']
    },
    ja: {
      title: '測定器・トルクチェッカー・検査機器',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'HP-10 デジタルトルクメーター、Quick 191AD / 196 こて先温度計、Hakko 498 リストストラップテスター。',
      badge: '工場QC品質規格',
      standards: ['高精度測定保証', '出荷時校正証明書対応']
    },
    th: {
      title: 'เครื่องมือวัด ทดสอบแรงบิด และตรวจสอบคุณภาพ',
      subtitle: 'Torque Meters, Temp Testers & ESD Checkers',
      desc: 'เครื่องวัดแรงบิดดิจิทัล HP-10, เทอร์โมมิเตอร์วัดอุณหภูมิปลายหัวแร้ง Quick 191AD, เครื่องทดสอบ ESD Hakko 498',
      badge: 'มาตรฐาน QC โรงงาน',
      standards: ['ความแม่นยำสูง', 'มีใบรับรองการสอบเทียบ']
    }
  },
  'camera-kinh-soi-cong-nghiep': {
    vi: {
      title: 'KÍNH HIỂN VI & KÍNH LÚP SOI BẢNG MẠCH',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: 'Kính hiển vi soi nổi SM-3TPZ-144-HD2 3 mắt kèm camera HDMI Full HD, kính lúp để bàn có đèn LED tròn LT-86A.',
      badge: 'Độ phóng đại 45X',
      standards: ['Thấu kính quang học Nhật', 'Đèn LED 144 bóng']
    },
    en: {
      title: 'OPTICAL MICROSCOPES & SMT INSPECTION CAMERAS',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: 'Trinocular stereo microscope SM-3TPZ-144-HD2 with HDMI camera, desktop illuminated magnifier lamp LT-86A.',
      badge: '45X Zoom Ratio',
      standards: ['Japanese optical lenses', '144-LED ring light']
    },
    'zh-CN': {
      title: '工业体视显微镜与PCB电路板检测相机',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: 'SM-3TPZ-144-HD2三目连续变倍体视显微镜带HDMI高清相机、LT-86A台式环形LED带灯放大镜。',
      badge: '45倍连续放大',
      standards: ['进口高清光学镜头', '144颗高亮度LED环形光源']
    },
    de: {
      title: 'OPTISCHE MIKROSKOPE & SMT-PRÜFKAMERAS',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: 'Trinokulares Stereomikroskop SM-3TPZ-144-HD2 mit HDMI-Kamera, LED-Lupenleuchte LT-86A.',
      badge: '45X Vergrößerung',
      standards: ['Japanische Optiklinsen', '144-LED-Ringlicht']
    },
    ko: {
      title: '광학 실체 현미경 & PCB 검사 카메라',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: 'SM-3TPZ-144-HD2 3안 실체 현미경 + HDMI 고해상도 카메라, LT-86A 원형 LED 탁상형 확대경.',
      badge: '45배 정밀 배율',
      standards: ['일본산 광학 렌즈 채용', '144구 LED 링 조명']
    },
    ja: {
      title: '実体顕微鏡＆基板検査用マイクロスコープ',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: '三眼ズーム式実体顕微鏡 SM-3TPZ-144-HD2（HDMIカメラ付き）、LT-86A デスクトップLED拡大鏡。',
      badge: '45倍高倍率ズーム',
      standards: ['日本仕様光学レンズ', '144灯LEDリングライト']
    },
    th: {
      title: 'กล้องจุลทรรศน์และกล้องตรวจจับแผงวงจร PCB',
      subtitle: 'Optical Microscopes & Magnifiers',
      desc: 'กล้องจุลทรรศน์สเตอริโอสามตา SM-3TPZ-144-HD2 พร้อมกล้อง HDMI, แว่นขยายตั้งโต๊ะไฟ LED LT-86A',
      badge: 'กำลังขยาย 45 เท่า',
      standards: ['เลนส์ออปติคอลคุณภาพสูง', 'ไฟวงแหวน LED 144 ดวง']
    }
  },
  'dung-cu-chong-tinh-dien': {
    vi: {
      title: 'VẬT TƯ CHỐNG TĨNH ĐIỆN & PHÒNG SẠCH (ESD)',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'Quạt thổi ion khử tĩnh điện SL-001, SL-002, SP-600, bộ nhíp chống tĩnh điện ESD, nhíp SA/ST, dây tiếp đất và vòng đeo tay.',
      badge: 'Tiêu chuẩn ESD',
      standards: ['Khử ion < 1.5s', 'Điện trở 10^6 - 10^9 Ω']
    },
    en: {
      title: 'ESD STATIC CONTROL & CLEANROOM ACCESSORIES',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'Ionizing air blowers SL-001, SL-002, SP-600, precision ESD tweezers, grounding wrist straps, and cords.',
      badge: 'ESD Standard',
      standards: ['Decay time < 1.5s', 'Resistance 10^6 - 10^9 Ω']
    },
    'zh-CN': {
      title: '防静电消除设备与无尘车间耗材 (ESD)',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'SL-001 / SL-002 / SP-600台式离子风机、防静电镊子系列、防静电接地线与防静电手腕带。',
      badge: '符合ESD防静电规范',
      standards: ['除静电时间 < 1.5s', '表面电阻 10^6 - 10^9 Ω']
    },
    de: {
      title: 'ESD-STATIKKONTROLLE & REINRAUMBEDARF',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'Ionisationsgebläse SL-001, SL-002, SP-600, ESD-Präzisionspinzetten, Erdungsbänder.',
      badge: 'ESD-Standard',
      standards: ['Entladezeit < 1,5s', 'Widerstand 10^6 - 10^9 Ω']
    },
    ko: {
      title: 'ESD 정전기 방지 장비 & 클린룸 소모품',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'SL-001, SL-002, SP-600 제전 이온 팬, ESD 정밀 핀셋, 접지선 및 정전기 방지 손목 밴드.',
      badge: '국제 ESD 표준',
      standards: ['정전기 감쇠 < 1.5초', '표면 저항 10^6 - 10^9 Ω']
    },
    ja: {
      title: 'ESD静電気除去装置＆クリーンルーム用品',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'SL-001、SL-002、SP-600 イオナイザー（除電ブロワー）、精密ESDピンセット、リストストラップ。',
      badge: 'ESD国際規格適合',
      standards: ['除電時間 1.5秒未満', '表面抵抗 10^6〜10^9 Ω']
    },
    th: {
      title: 'อุปกรณ์ป้องกันไฟฟ้าสถิต ESD และห้องคลีนรูม',
      subtitle: 'Ion Blowers, ESD Tweezers & Grounding Wires',
      desc: 'พัดลมสลายไฟฟ้าสถิต SL-001, SL-002, แหนบคีบกันไฟฟ้าสถิต ESD, สายรัดข้อมือและสายกราวด์',
      badge: 'มาตรฐาน ESD',
      standards: ['สลายไฟฟ้าสถิต < 1.5 วินาที', 'ความต้านทาน 10^6 - 10^9 Ω']
    }
  },
  'thiet-bi-dong-goi-tu-dong': {
    vi: {
      title: 'THIẾT BỊ ĐÓNG GÓI & DÂY CHUYỀN TỰ ĐỘNG',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: 'Máy co màng đóng gói sản phẩm, máy dán mép thùng 4 cạnh, máy bóc tách đóng thùng tự động, dây chuyền đóng gói khép kín.',
      badge: 'Năng suất cao',
      standards: ['Vận hành liên tục', 'Tiết kiệm nhân công']
    },
    en: {
      title: 'AUTOMATIC PACKAGING & CARTON SEALING MACHINES',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: 'Heat shrink packaging machines, 4-edge horizontal carton sealers, automated case erectors and integrated packing lines.',
      badge: 'High Throughput',
      standards: ['Continuous 24/7 run', 'Labor-saving automated']
    },
    'zh-CN': {
      title: '全自动后道包装设备与智能封箱流水线',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: '热收缩膜包装机、全自动四角边纸箱封箱机、全自动开箱机及无人化打包集成流水线。',
      badge: '高效自动化产能',
      standards: ['24/7全天候平稳运行', '大幅减少人工成本']
    },
    de: {
      title: 'AUTOMATISCHE VERPACKUNG & KARTONVERSCHLIESSUNG',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: 'Schrumpffolien-Verpackungsmaschinen, 4-Kanten-Kartonverschließer, automatische Kartonaufrichter.',
      badge: 'Hohe Durchsatzleistung',
      standards: ['24/7-Dauerbetrieb', 'Kosteneffizient automatisiert']
    },
    ko: {
      title: '자동 포장 기계 & 스마트 테이핑 라인',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: '열수축 포장기, 4모서리 테이핑기, 자동 박스 제함기 및 완전 자동화 포장 라인.',
      badge: '고생산성 자동화',
      standards: ['24/7 연속 가동', '인건비 절감 효과']
    },
    ja: {
      title: '自動包装機械＆カートンシーラーライン',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: '熱収縮フィルム包装機、四つ角水平封函機、自動製函機および完全自動化梱包ライン。',
      badge: '高処理能力',
      standards: ['24時間連続稼働対応', '人件費削減・省人化']
    },
    th: {
      title: 'เครื่องจักรบรรจุภัณฑ์อัตโนมัติและเครื่องปิดกล่อง',
      subtitle: 'Carton Sealers & Shrink Packaging',
      desc: 'เครื่องอบฟิล์มหด, เครื่องปิดเทปกาวกล่องสี่เหลี่ยมอัตโนมัติ, เครื่องกางกล่องและสายพานลำเลียง',
      badge: 'กำลังการผลิตสูง',
      standards: ['ทำงานต่อเนื่อง 24/7', 'ประหยัดแรงงานคน']
    }
  }
};

export function getLocalizedSolution(sol: Solution, locale: SupportedLocale): Solution {
  if (locale === 'vi') return sol;
  const trans = SOLUTIONS_TRANSLATIONS[sol.id]?.[locale];
  if (!trans) return sol;
  return {
    ...sol,
    title: trans.title || sol.title,
    subtitle: trans.subtitle || sol.subtitle,
    desc: trans.desc || sol.desc,
    badge: trans.badge || sol.badge,
    tag: trans.tag || sol.tag,
    standards: trans.standards || sol.standards
  };
}

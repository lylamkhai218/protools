import { SupportedLocale } from '../components/FlagIcon';

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_TRANSLATIONS: Record<SupportedLocale, FaqItem[]> = {
  vi: [
    {
      q: 'Công ty TNHH Công Nghiệp T&T VINA chuyên cung cấp những nhóm thiết bị nào?',
      a: 'T&T Vina (Protools.com.vn) chuyên phân phối thiết bị phụ trợ và giải pháp tự động hóa cho các nhà máy SMT, lắp ráp linh kiện điện tử, gồm: Robot hàn tự động, máy hàn Hakko/Quick, bể hàn thiếc CM-508/808, máy bắt vít HIOS CL-3000/4000, máy bơm keo SP-982, máy cắt băng dính tự động Zcut 9/RT-3700, máy tách tem nhãn, thiết bị đo lực siết HP-10, kính hiển vi soi nổi SM-3TPZ, quạt ion khử tĩnh điện Dr. Schneider SL-001, và toàn bộ hệ thống xích dẫn cáp, giá đỡ robot Murrplastik chính hãng Đức.'
    },
    {
      q: 'Các sản phẩm tại Protools.com.vn có đầy đủ chứng từ hàng hóa không?',
      a: '100% sản phẩm do T&T Vina cung cấp đều có đầy đủ chứng từ hàng hóa hợp pháp. Tất cả đơn hàng đều được cung cấp đầy đủ hồ sơ xuất xứ, chứng nhận chất lượng và hóa đơn giá trị gia tăng (VAT) theo quy định.'
    },
    {
      q: 'Chính sách bảo hành và hỗ trợ kỹ thuật tận nơi tại nhà máy như thế nào?',
      a: 'Toàn bộ thiết bị máy móc đều có chính sách bảo hành chính hãng. Đội ngũ chuyên gia kỹ thuật của T&T VINA (Hotline: 0915.168.824) sẵn sàng hỗ trợ khảo sát, tư vấn giải pháp, chạy thử mẫu (trial test) và hướng dẫn vận hành trực tiếp tại các nhà máy thuộc KCN Hà Nội, Bắc Ninh, Hưng Yên, Hải Phòng, Vĩnh Phúc, Thái Nguyên...'
    },
    {
      q: 'Thời gian nhận báo giá dự án và giao hàng mất bao lâu?',
      a: 'Sau khi quý khách gửi yêu cầu qua Giỏ Báo Giá hoặc liên hệ Hotline / Zalo Kinh Doanh (Ms. Hiền 0929.938.368 / Ms. Phương 0365.366.455 / Hotline 0915.168.824), chúng tôi sẽ gửi bảng báo giá chính thức trong vòng 15 - 30 phút. Với các mã hàng có sẵn tại kho Hà Nội & Hưng Yên, thời gian giao hàng hỏa tốc trong vòng 24 giờ.'
    },
    {
      q: 'Địa chỉ văn phòng trụ sở và kho hàng chính thức của T&T VINA ở đâu?',
      a: 'Trụ sở chính đặt tại: Thôn Nhạo Sơn - Xã Thụy Anh - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km). VPGD & Kho hàng Hà Nội: Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội (Số 11 ngách 68 ngõ 467 Lĩnh Nam — có sẵn định vị chỉ đường trên Google Maps).'
    }
  ],
  en: [
    {
      q: 'What industrial equipment categories does T&T VINA supply?',
      a: 'T&T Vina (Protools.com.vn) specializes in SMT assembly and automation equipment for factories, including: Robotic soldering systems, Hakko/Quick soldering stations, CM-508/808 solder pots, HIOS CL-3000/4000 precision torque screwdrivers, SP-982 fluid dispensers, Zcut 9/RT-3700 automatic tape cutters, label peelers, HP-10 torque meters, SM-3TPZ stereo inspection microscopes, Dr. Schneider SL-001 ionizing blowers, and genuine German Murrplastik robotic cable management systems.'
    },
    {
      q: 'Do products from Protools.com.vn include full CO/CQ and VAT invoices?',
      a: '100% of products supplied by T&T Vina include full legal factory documentation. Every order comes complete with Certificate of Origin (CO), Certificate of Quality (CQ), and official Vietnamese VAT invoices.'
    },
    {
      q: 'What is the warranty policy and on-site technical support for factories?',
      a: 'All equipment includes official 12-month manufacturer warranties. T&T Vina engineering specialists (Hotline: +84 915.168.824) provide on-site factory consultations, trial-testing, calibration, and commissioning across industrial parks in Hanoi, Bac Ninh, Hung Yen, Hai Phong, Vinh Phuc, Thai Nguyen, and nationwide.'
    },
    {
      q: 'How fast is project quotation and product delivery?',
      a: 'Upon submitting an RFQ via the website basket or contacting our Sales Engineering team (Ms. Hien +84 929.938.368 / Ms. Phuong +84 365.366.455 / Hotline +84 915.168.824), you will receive a formal quotation within 15–30 minutes. Stocked inventory from our Hanoi and Hung Yen warehouses ships same-day or within 24 hours.'
    },
    {
      q: 'Where are T&T VINA headquarters and warehouse hubs located?',
      a: 'Headquarters: Nhao Son, Thuy Anh, Hung Yen Province (1km from Lien Ha Thai Industrial Park). Hanoi Office & Warehouse: No. 11, Alley 68/467 Linh Nam Street, Hoang Mai District, Hanoi (GPS navigation available on Google Maps).'
    }
  ],
  'zh-CN': [
    {
      q: 'T&T VINA 工业主要供应哪些工业设备与自动化方案？',
      a: 'T&T Vina (Protools.com.vn) 专注为越南及外资 SMT 电子制造产线提供一站式设备与辅料：全自动点焊机器人、快克/白光烙铁焊台、CM-508/808锡炉、HIOS好芝电动螺丝刀、SP-982定量点胶机、Zcut-9/RT-3700自动胶带切割机、自动剥离机、HP-10扭力计、SM-3TPZ显微镜、SL-001离子风机及德国原装 Murrplastik 机器人管线包系统。'
    },
    {
      q: 'Protools.com.vn 供应的产品是否具备完整的原厂 CO/CQ 与越南发票？',
      a: 'T&T Vina 供应的所有产品 100% 具备正规合法进出口手续，随单提供原厂原产地证明 (CO)、品质合格证 (CQ) 以及符合越南税务标准的红字增值税发票 (VAT)。'
    },
    {
      q: '在越工厂售后保修与技术工程师上门支持政策如何？',
      a: '全系设备提供 12 个月原厂官方保修。T&T Vina 专业技术团队（热线：+84 915.168.824）可前往河内、北宁、海防、兴安、永福、太原等各重点工业园区现场调研、免费试样、设备调试与技术培训。'
    },
    {
      q: '项目询价与现货配送周期需要多长时间？',
      a: '通过线上询价车或直接联系业务专员（Ms. Hiền +84 929.938.368 / 中文专员 Mr. Khải +84 968.597.131），我们将在 15 至 30 分钟内出具正规盖章报价单。河内与兴安总库现货支持 24 小时内极速专车送达。'
    },
    {
      q: 'T&T VINA 官方总部与总仓设在何处？',
      a: '公司总部：越南兴安省太瑞县太瑞社茶回村（距连河泰工业园区 1 公里）。河内代表处与总仓：河内市黄梅郡岭南坊岭南467弄68巷11号（可在 Google Maps 搜索导航定位）。'
    }
  ],
  de: [
    {
      q: 'Welche Industrieausrüstungen liefert T&T VINA Industrial?',
      a: 'T&T Vina (Protools.com.vn) liefert schlüsselfertige Ausrüstung für SMT- und Elektronikmontagewerke: Lötroboter, Hakko/Quick-Lötstationen, CM-Löttiegel, HIOS-Elektroschrauber, SP-982 Dosiergeräte, automatische Zcut-Bandschneider, HP-10 Drehmomentmessgeräte, SM-3TPZ Stereomikroskope, SL-001 Ionengebläse und originale deutsche Murrplastik Roboterkabelführungen.'
    },
    {
      q: 'Verfügen alle Produkte über vollständige CO/CQ-Zertifikate?',
      a: '100% der von T&T Vina gelieferten Geräte besitzen vollständige Werksprüfzeugnisse (CO/CQ) sowie offizielle Mehrwertsteuerrechnungen nach vietnamesischem Recht.'
    },
    {
      q: 'Wie gestalten sich Garantie und technischer Vor-Ort-Support in Vietnam?',
      a: 'Alle Geräte verfügen über 12 Monate Werksgarantie. T&T Vina Ingenieure unterstützen Fabriken in Industrieparks in Hanoi, Bac Ninh, Hung Yen, Hai Phong und landesweit bei Installation, Kalibrierung und Testläufen.'
    },
    {
      q: 'Wie schnell erfolgen Angebotserstellung und Lieferung?',
      a: 'Nach Einreichung einer RFQ erhalten Sie innerhalb von 15–30 Minuten ein offizielles Angebot. Lagerware aus den Depots Hanoi & Hung Yen wird innerhalb von 24 Stunden geliefert.'
    },
    {
      q: 'Wo befinden sich Hauptsitz und Lager von T&T VINA?',
      a: 'Hauptsitz: Thuy Anh, Provinz Hung Yen (1 km vom Industriepark Lien Ha Thai). Büro & Lager Hanoi: Nr. 11/68/467 Linh Nam, Hoang Mai, Hanoi (auf Google Maps auffindbar).'
    }
  ],
  ko: [
    {
      q: 'T&T VINA Industrial은 어떤 산업 장비를 공급합니까?',
      a: 'T&T Vina (Protools.com.vn)는 SMT 전자 조립 및 자동화 공장을 위한 전문 장비를 공급합니다: 자동 납땜 로봇, Hakko/Quick 솔더링 스테이션, HIOS 정밀 전동 드라이버, SP-982 디스펜서, Zcut 9 테이프 커터, 라벨 박리기, HP-10 토크 테스터, SM-3TPZ 실체 현미경, SL-001 이온 블로어 및 독일 Murrplastik 정품 로봇 케이블 드레스팩 시스템.'
    },
    {
      q: '공급 제품에 정품 CO/CQ 인증서와 세금계산서가 발행됩니까?',
      a: 'T&T Vina가 공급하는 모든 장비는 100% 제조사 정품 원산지 증명서(CO), 품질 시험 성적서(CQ) 및 베트남 정식 VAT 세금계산서가 제공됩니다.'
    },
    {
      q: '베트남 현지 공장 무상 보증 및 엔지니어 기술 지원은 어떻게 진행됩니까?',
      a: '전 제품 12개월 공식 보증이 제공됩니다. T&T Vina 기술팀(+84 915.168.824)은 하노이, 박닌, 흥옌, 하이퐁, 빈푹, 타이응웬 등 주요 공단 현장 샘플 테스트, 설치 및 기술 지도를 지원합니다.'
    },
    {
      q: '견적 회신과 납품 소요 시간은 얼마나 걸립니까?',
      a: '온라인 견적 바구니 접수 후 15~30분 이내에 공식 견적서가 발행됩니다. 하노이 및 흥옌 창고 보유 재고는 24시간 이내 당일 신속 배송됩니다.'
    },
    {
      q: 'T&T VINA 본사 및 공식 물류 창고 위치는 어디입니까?',
      a: '본사: 흥옌성 투이안현 리엔하타이 공단 인근 1km. 하노이 사무소 및 물류 창고: 하노이 황마이구 린남 467골목 68번지 11호 (Google Maps 내비게이션 검색 가능).'
    }
  ],
  ja: [
    {
      q: 'T&T VINA Industrial はどのような産業設備を扱っていますか？',
      a: 'T&T Vina (Protools.com.vn) はSMT実装・自動化工場向け設備をワンストップで供給しています：自動はんだ付けロボット、白光(Hakko)／Quickはんだステーション、HIOS電動トルクドライバー、SP-982ディスペンサー、Zcut 9自動テープカッター、ラベル剥離機、HP-10トルクメーター、SM-3TPZ実体顕微鏡、SL-001イオナイザー、ドイツMurrplastik正規ロボットケーブル保護システム。'
    },
    {
      q: '取扱製品には原産地証明(CO)・品質検査書(CQ)およびVATインボイスが付きますか？',
      a: 'T&T Vinaが販売する全製品は100%正規メーカー純正品であり、原産地証明書(CO)、品質検査成績書(CQ)、およびベトナム正規VAT付加価値税インボイスを完備しています。'
    },
    {
      q: '工場現地での製品保証およびエンジニアの技術サポートについて教えてください。',
      a: '全機器に12ヶ月のメーカー保証が付帯します。T&T Vinaの専門技術チーム（+84 915.168.824）がハノイ、バクニン、フンイエン、ハイフォン等の各工業団地へ赴き、サンプル試運転、現地設置、操作指導を迅速に行います。'
    },
    {
      q: '見積もりの回答時間と納期の目安はどのくらいですか？',
      a: 'オンライン見積依頼後、15〜30分以内に正式な御見積書を送付いたします。ハノイ・フンイエン倉庫に在庫がある製品は、当日または24時間以内に特急配送いたします。'
    },
    {
      q: 'T&T VINAの本社および物流センターの所在地はどこですか？',
      a: '本社：フンイエン省トゥイアン（リエンハタイ工業団地より1km）。ハノイ支店・メイン倉庫：ハノイ市ホアンマイ区リンナム467横丁68路11号（Google Mapsにて位置情報公開中）。'
    }
  ],
  th: [
    {
      q: 'บริษัท T&T VINA Industrial จัดจำหน่ายอุปกรณ์อุตสาหกรรมประเภทใดบ้าง?',
      a: 'T&T Vina (Protools.com.vn) เชี่ยวชาญการจัดจำหน่ายเครื่องมือสำหรับโรงงานประกอบ SMT และระบบอัตโนมัติ: หุ่นยนต์บัดกรี, เครื่องบัดกรี Hakko/Quick, ไขควงไฟฟ้า HIOS, เครื่องหยอดกาว SP-982, เครื่องตัดเทป Zcut 9, เครื่องลอกฉลาก, เครื่องวัดแรงบิด HP-10, กล้องจุลทรรศน์ SM-3TPZ, พัดลมสลายไฟฟ้าสถิต SL-001 และระบบท่อร้อยสายหุ่นยนต์ Murrplastik แท้จากเยอรมนี'
    },
    {
      q: 'สินค้าทุกรายการมีเอกสาร CO/CQ และใบกำกับภาษี VAT ครบถ้วนหรือไม่?',
      a: 'สินค้าทั้งหมด 100% จาก T&T Vina มีเอกสารรับรองถิ่นกำเนิด (CO) และเอกสารรับรองคุณภาพ (CQ) จากโรงงานผู้ผลิต พร้อมใบกำกับภาษี VAT อย่างถูกต้องตามกฎหมาย'
    },
    {
      q: 'นโยบายการรับประกันและการบริการทางเทคนิคหน้างานเป็นอย่างไร?',
      a: 'เครื่องจักรทุกเครื่องรับประกันศูนย์ 12 เดือน ทีมวิศวกรของ T&T Vina (+84 915.168.824) พร้อมให้บริการสำรวจ ให้คำปรึกษา ทดสอบชิ้นงาน และฝึกอบรมการใช้งาน ณ โรงงานในนิคมอุตสาหกรรมทั่วประเทศ'
    },
    {
      q: 'ระยะเวลาในการออกใบเสนอราคาและจัดส่งสินค้านานเท่าใด?',
      a: 'หลังจากส่งคำขอผ่านตะกร้าใบเสนอราคา คุณจะได้รับใบเสนอราคาอย่างเป็นทางการภายใน 15-30 นาที สำหรับสินค้าที่มีในคลังฮานอยและฮึงเอียน เราจัดส่งด่วนภายใน 24 ชั่วโมง'
    },
    {
      q: 'ที่ตั้งสำนักงานใหญ่และคลังสินค้าของ T&T VINA อยู่ที่ใด?',
      a: 'สำนักงานใหญ่: ต.ถวิอัน จ.ฮึงเอียน (ห่างจากนิคมฯ เลียนฮาไท 1 กม.) สำนักงานและคลังสินค้าฮานอย: เลขที่ 11 ซอย 68/467 ถนนลิญห์นาม เขตฮว่างมาย กรุงฮานอย (มีพิกัดใน Google Maps)'
    }
  ]
};

export function getLocalizedFaqItems(locale: SupportedLocale): FaqItem[] {
  return FAQ_TRANSLATIONS[locale] || FAQ_TRANSLATIONS.vi;
}

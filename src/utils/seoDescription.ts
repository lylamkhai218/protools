/**
 * B2B TECHNICAL DESCRIPTION & SEO SYNTHESIZER
 * T&T Vina Industrial Co., Ltd (Protools.com.vn)
 * Khắc phục triệt để lỗi "Thin Content" của 7.400 sản phẩm Sapo
 * Tự động tạo mô tả công nghiệp chuẩn xác, phục vụ người dùng & Googlebot
 */

import { Product } from '../types';

interface SEODescriptionOutput {
  metaDescription: string;
  richDescription: string;
  defaultHighlights: string[];
}

export function generateProductSEODescription(product: Product): SEODescriptionOutput {
  const name = product.name || 'Thiết bị công nghiệp';
  const sku = product.sku || product.id || 'N/A';
  const brand = product.brand || 'T&T Vina Industrial';
  const category = product.category || 'Thiết bị công nghiệp';
  const catSlug = product.categorySlug || '';
  const origin = product.origin || 'Chính hãng';
  const warehouse = product.stockLocation || 'Kho Hà Nội & Hưng Yên';

  // 1. Meta Description (Tối ưu 150 - 160 ký tự cho Google Snippet)
  const metaDescription = `${name} (SKU: ${sku}) chính hãng ${brand}. ${category} chuẩn công nghiệp, chứng nhận CO/CQ, độ bền cao. Sẵn hàng tại ${warehouse}, giao hỏa tốc 24h.`;

  // 2. Rich B2B Technical Description (150 - 250 từ chuẩn ngữ nghĩa kỹ thuật)
  let specificIntro = '';
  let standardCommitment = '';
  let defaultHighlights: string[] = [];

  if (catSlug === 'xi-lanh-khi-nen' || name.toLowerCase().includes('xilanh') || name.toLowerCase().includes('xi lanh')) {
    specificIntro = `Sản phẩm ${name} (Mã thiết bị: ${sku}) thuộc nhóm thiết bị chấp hành khí nén công nghiệp tiêu chuẩn cao. Thiết bị được gia công chính xác bằng hợp kim nhôm chịu áp lực cao, piston mạ crom chống mài mòn, gioăng làm kín chịu dầu và ma sát thấp, đảm bảo vận hành êm ái với chu kỳ hàng triệu lần đóng mở trong dây chuyền tự động hóa.`;
    standardCommitment = `Phù hợp ứng dụng trong các cụm đồ gá JIG, cơ cấu kẹp phôi tự động, robot gắp thả và hệ thống khí nén phòng sạch trong các nhà máy sản xuất điện tử, ô tô xe máy.`;
    defaultHighlights = [
      'Gia công cơ khí chính xác, thân xilanh hợp kim nhôm chống mài mòn cao',
      'Gioăng cao su NBR chịu dầu, độ kín khít tuyệt đối, hoạt động ổn định ở áp suất 0.1 - 1.0 MPa',
      'Tương thích hoàn toàn với các chuẩn gá kẹp khí nén SMC, Airtac, Festo phổ biến',
      'Được kiểm định chất lượng nghiêm ngặt trước khi xuất xưởng'
    ];
  } else if (catSlug === 'khi-nen-phu-kien' || name.toLowerCase().includes('cut noi') || name.toLowerCase().includes('khop noi') || name.toLowerCase().includes('cút')) {
    specificIntro = `Phụ kiện ${name} (Mã SKU: ${sku}) là dòng đầu nối nhanh khí nén công nghiệp chất lượng cao từ ${brand}. Thiết kế thân ren đồng mạ niken kết hợp vòng đệm cao su đàn hồi cao, giúp kết nối chắc chắn, chống rò rỉ khí nén ngay cả dưới áp suất dao động mạnh.`;
    standardCommitment = `Dễ dàng lắp đặt nhanh cho các đường ống khí PA, PU, PE trong tủ điện điều khiển, máy tự động, hệ thống phân phối khí nhà xưởng.`;
    defaultHighlights = [
      'Khóa bấm kết nối nhanh One-touch, tháo lắp ống hơi dễ dàng không cần dụng cụ chuyên dụng',
      'Vật liệu đồng thau mạ niken chống oxy hóa, chống gỉ sét trong môi trường độ ẩm cao',
      'Vòng ôm ống bằng thép không gỉ giữ ống khí chắc chắn, chịu áp suất lên đến 1.5 MPa',
      'Đầy đủ quy cách ren và đường kính ống tiêu chuẩn công nghiệp'
    ];
  } else if (catSlug === 'bu-long-oc-vit' || name.toLowerCase().includes('bulong') || name.toLowerCase().includes('oc vit')) {
    specificIntro = `Vật tư liên kết cơ khí chính xác ${name} (Mã SKU: ${sku}) được sản xuất theo quy chuẩn công nghiệp DIN / ISO khắt khe. Sản phẩm sở hữu độ cấp bền cao, bề mặt được xử lý nhiệt luyện và mạ phủ bảo vệ chống ăn mòn hóa chất và oxy hóa môi trường.`;
    standardCommitment = `Chuyên dụng trong lắp dựng kết cấu khung nhôm định hình, bàn thao tác phòng sạch, đồ gá chế tạo máy, dây chuyền lắp ráp linh kiện điện tử.`;
    defaultHighlights = [
      'Tiêu chuẩn kích thước và bước ren đồng nhất theo hệ mét chuẩn quốc tế (DIN/ISO)',
      'Vật liệu thép hợp kim cao cấp / Inox không gỉ chịu lực kéo và lực siết mô-men xoắn lớn',
      'Xử lý bề mặt mạ đen / mạ kẽm chất lượng cao, hạn chế trượt giác khi bắt vít',
      'Đóng gói tiêu chuẩn công nghiệp, phục vụ nhu cầu sản xuất đại trà'
    ];
  } else if (catSlug === 'bang-tai-day-curoa' || name.toLowerCase().includes('bang tai') || name.toLowerCase().includes('day curoa')) {
    specificIntro = `Hệ thống truyền động ${name} (Mã SKU: ${sku}) được sản xuất từ chất liệu polyme chịu lực / cao su tổng hợp gia cường sợi bố chất lượng cao. Bề mặt có khả năng chống mài mòn, chống bám dính dầu mỡ công nghiệp và duy trì độ bám ma sát tối ưu.`;
    standardCommitment = `Đảm bảo dây chuyền truyền tải phôi, sản phẩm trung gian hoạt động liên tục 24/7 với độ giãn dài cực thấp và độ ồn vận hành tối thiểu.`;
    defaultHighlights = [
      'Lớp bố gia cường chịu lực căng cao, triệt tiêu hiện tượng dão và trượt tải',
      'Bề mặt chống tĩnh điện và chịu dầu, an toàn cho linh kiện vi mạch điện tử',
      'Mối nối ép nhiệt phẳng mịn, chuyển động êm ái qua các rulo và bánh đai',
      'Gia công chuẩn xác theo kích thước và yêu cầu kỹ thuật của từng dây chuyền'
    ];
  } else if (catSlug === 'dung-cu-chong-tinh-dien' || name.toLowerCase().includes('ion') || name.toLowerCase().includes('esd') || name.toLowerCase().includes('nhip')) {
    specificIntro = `Thiết bị và vật tư chuyên dụng ${name} (Mã SKU: ${sku}) đóng vai trò then chốt trong quy trình kiểm soát tĩnh điện (ESD Protection) tại các nhà máy SMT, bán dẫn và phòng sạch Class 100 - 10.000.`;
    standardCommitment = `Tuân thủ nghiêm ngặt tiêu chuẩn ANSI/ESD S20.20 quốc tế, giúp triệt tiêu điện tích bề mặt tức thì, bảo vệ an toàn cho các vi mạch nhạy cảm (IC, Sensor, Bo mạch chủ).`;
    defaultHighlights = [
      'Đạt chuẩn kiểm soát tĩnh điện công nghiệp ESD / Cleanroom tiêu chuẩn cao',
      'Khả năng cân bằng ion nhanh, phân tán điện tích dư thừa an toàn',
      'Vật liệu thân thiện phòng sạch, không phát sinh bụi sợi hạt trong quá trình sử dụng',
      'Được tin dùng tại các nhà máy điện tử hàng đầu tại các KCN Bắc Ninh, Thái Nguyên, Hải Phòng'
    ];
  } else if (catSlug === 'thiet-bi-han' || name.toLowerCase().includes('han') || name.toLowerCase().includes('hakko') || name.toLowerCase().includes('quick')) {
    specificIntro = `Thiết bị công nghệ hàn điện tử ${name} (Mã SKU: ${sku}) được thiết kế cho các ứng dụng hàn vi mạch cao cấp đòi hỏi độ ổn định nhiệt tuyệt đối. Công nghệ kiểm soát nhiệt độ thông minh giúp bù nhiệt cực nhanh khi chạm mối hàn lớn.`;
    standardCommitment = `Đảm bảo mối hàn sáng bóng, không sinh xỉ hàn, an toàn chống rò tĩnh điện tuyệt đối cho linh kiện theo tiêu chuẩn IPC-A-610.`;
    defaultHighlights = [
      'Hệ thống gia nhiệt công suất cao, tốc độ bù nhiệt tức thì chỉ trong 2-3 giây',
      'Thiết kế chống rò rỉ điện tích ESD Safe, bảo vệ linh kiện nhạy cảm',
      'Đầu mỏ hàn và phụ kiện thay thế chính hãng dễ dàng tìm mua',
      'Vận hành ổn định trong dây chuyền sản xuất bo mạch điện tử cường độ cao'
    ];
  } else if (catSlug === 'murrplastik') {
    specificIntro = `Sản phẩm Murrplastik chính hãng ${name} (Mã SKU: ${sku}) được chế tạo tại CHLB Đức. Đây là giải pháp hàng đầu thế giới về quản lý và bảo vệ cáp chuyển động, xích dẫn cáp robot (Energy Chain) và phụ kiện luồn dây chuyên dụng.`;
    standardCommitment = `Đã được chứng minh năng lực thực tế trên các tổ hợp robot công nghiệp nặng, xưởng dập hàn Body Shop ô tô và dây chuyền đóng gói tốc độ cao.`;
    defaultHighlights = [
      '100% Sản xuất tại CHLB Đức theo chuẩn chất lượng Châu Âu',
      'Vật liệu nhựa kỹ thuật polyamide biến tính đặc biệt, chịu uốn gập hàng triệu chu kỳ',
      'Đạt chuẩn chống cháy UL94 V0, kháng dầu mỡ, hóa chất công nghiệp và tia UV',
      'T&T Vina Industrial là đại diện phân phối chính thức kèm CO/CQ bản gốc'
    ];
  } else {
    specificIntro = `Thiết bị ${name} (Mã định danh: ${sku}) do T&T Vina Industrial cung ứng là giải pháp tin cậy cho các nhà máy, xưởng cơ khí chế tạo và dây chuyền tự động hóa. Sản phẩm đáp ứng đầy đủ các tiêu chuẩn kỹ thuật khắt khe về độ chính xác và tuổi thọ vận hành.`;
    standardCommitment = `T&T Vina cam kết cung cấp sản phẩm chính hãng với chứng nhận xuất xứ (CO) và chứng nhận chất lượng (CQ) đầy đủ, chính sách bảo hành 12 tháng và hỗ trợ kỹ thuật tận nơi.`;
    defaultHighlights = [
      'Thiết kế chuẩn công nghiệp, hoạt động bền bỉ trong môi trường sản xuất liên tục 24/7',
      'Nguồn gốc xuất xứ rõ ràng từ các thương hiệu uy tín Nhật Bản, CHLB Đức, Hàn Quốc',
      'Có sẵn phụ tùng thay thế và dịch vụ hỗ trợ kỹ thuật nhanh chóng',
      'Giao hàng tận nơi trên toàn quốc, ưu tiên các khu công nghiệp trọng điểm'
    ];
  }

  const richDescription = `${specificIntro} ${standardCommitment}`;

  return {
    metaDescription,
    richDescription,
    defaultHighlights
  };
}

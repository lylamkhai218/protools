import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  PhoneCall
} from 'lucide-react';
import { COMPANY_INFO, PARTNERS } from '../data';

interface FooterProps {
  onNavigate: (tab: string, filter?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(prev => prev === key ? null : prev);
    }, 2000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-[#00478D] relative overflow-hidden">
      {/* Background Precision Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Company Profile & Addresses with Google Maps (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                {COMPANY_INFO.fullNameEn}
              </h3>
              <div className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                {COMPANY_INFO.name}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {COMPANY_INFO.slogan}
            </p>

            <div className="pt-1 space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-[#00478D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Trụ sở chính:</span>
                  <span className="text-slate-400 block mt-0.5">{COMPANY_INFO.headquarters}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-200">VPGD & Kho Hà Nội:</span>
                  <span className="text-slate-400 block mt-0.5">{COMPANY_INFO.vpgdAndWarehouse}</span>
                  
                  {/* Google Maps Actions */}
                  <a 
                    href={COMPANY_INFO.mapUrlLinhNam} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 hover:underline font-semibold mt-1"
                  >
                    <span>Chỉ đường trên Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Embedded Google Map Iframe Directly Below Linh Nam */}
                  <div className="mt-2.5 rounded-xs overflow-hidden border border-slate-700/80 shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d783.13591034401!2d105.88146848700326!3d20.982886742453424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af26d2bb1e0f%3A0x65f178554a3bb4aa!2zQ8O0bmcgdHkgVE5ISCBDw7RuZyBuZ2hp4buHcCBUJlQgVmluYQ!5e0!3m2!1svi!2s!4v1788060518008!5m2!1svi!2s"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Bản đồ VPGD & Kho T&T Vina Lĩnh Nam"
                      className="w-full block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Right Macro Section (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Row: Danh Mục Thiết Bị & Liên Hệ / Báo Giá */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-6 border-b border-slate-800/80">
              
              {/* Sub-col A: Product Solution Groups */}
              <div className="space-y-3.5">
                <h4 className="font-display font-bold text-sm tracking-wider text-white uppercase border-b border-slate-800 pb-2">
                  Danh Mục Thiết Bị
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'thiet-bi-han')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Thiết bị hàn & Robot hàn tự động</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'may-bat-vit-nha-vit')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Máy bắt vít Hios & Robot bắt vít</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'dung-cu-bom-keo')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Dụng cụ & Robot tra bơm keo</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'may-cat-bang-dinh-tem-nhan')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Máy cắt băng dính & Tem nhãn</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'thiet-bi-kiem-tra')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Thiết bị đo lực & Nhiệt độ hàn</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'camera-kinh-soi')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Kính hiển vi & Kính lúp soi nổi</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => onNavigate('home', 'esd-phong-sach')} 
                      className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00478D] shrink-0"></span>
                      <span>Quạt thổi Ion & Dụng cụ ESD</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Sub-col B: Direct Contacts Roster */}
              <div className="space-y-3.5">
                <h4 className="font-display font-bold text-sm tracking-wider text-white uppercase border-b border-slate-800 pb-2">
                  Tư Vấn &amp; Báo Giá
                </h4>
                
                <div className="space-y-2.5 text-xs">
                  {/* Hotline */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-200">Hotline:</span>
                    <a href={`tel:${COMPANY_INFO.hotlineRaw}`} className="text-emerald-300 font-bold hover:underline font-mono">
                      {COMPANY_INFO.hotline}
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.hotlineRaw, 'foot_hotline', e)}
                      title="Sao chép Hotline"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_hotline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Kinh Doanh General */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-200">Kinh Doanh:</span>
                    <a href={COMPANY_INFO.salesTeam[0].zaloUrl} target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">
                      {COMPANY_INFO.salesTeam[0].name} ({COMPANY_INFO.salesTeam[0].phone})
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.salesTeam[0].rawPhone, 'foot_hien', e)}
                      title="Sao chép số Ms. Hiền"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_hien' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span className="text-slate-500">•</span>
                    <a href={COMPANY_INFO.salesTeam[1].zaloUrl} target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">
                      {COMPANY_INFO.salesTeam[1].name} ({COMPANY_INFO.salesTeam[1].phone})
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.salesTeam[1].rawPhone, 'foot_phuong', e)}
                      title="Sao chép số Ms. Phương"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_phuong' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Kinh Doanh Murrplastik */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-200">KD Murr:</span>
                    <a href={COMPANY_INFO.murrSalesTeam[0].zaloUrl} target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">
                      {COMPANY_INFO.murrSalesTeam[0].name} ({COMPANY_INFO.murrSalesTeam[0].phone})
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.murrSalesTeam[0].rawPhone, 'foot_binh', e)}
                      title="Sao chép số Mr. Bình"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_binh' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <span className="text-slate-500">•</span>
                    <a href={COMPANY_INFO.murrSalesTeam[1].zaloUrl} target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">
                      {COMPANY_INFO.murrSalesTeam[1].name} ({COMPANY_INFO.murrSalesTeam[1].phone})
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.murrSalesTeam[1].rawPhone, 'foot_khai', e)}
                      title="Sao chép số Mr. Khải"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_khai' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Phòng Dự Án */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-amber-300">Phòng Dự Án:</span>
                    <a href={`tel:${COMPANY_INFO.projectDept.rawPhone}`} className="text-amber-200 hover:underline font-mono font-bold">
                      {COMPANY_INFO.projectDept.phone} ({COMPANY_INFO.projectDept.name})
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.projectDept.rawPhone, 'foot_project_thanh', e)}
                      title="Sao chép số Phòng Dự Án"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_project_thanh' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="font-semibold text-slate-200">Email:</span>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-sky-300 hover:underline font-mono">
                      {COMPANY_INFO.email}
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.email, 'foot_email', e)}
                      title="Sao chép Email"
                      className="p-1 rounded-xs hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'foot_email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Featured Products */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display font-bold text-sm tracking-wider text-white uppercase">
                  CÁC SẢN PHẨM NỔI BẬT
                </h4>
                <span className="text-[11px] text-slate-400 hidden sm:inline">100% Xuất xứ Nhật Bản, Đức, Hàn Quốc</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => window.open('https://protools.com.vn/murrplastik', '_blank')}
                  className="p-2.5 rounded-sm bg-slate-800/80 border border-slate-700/60 hover:border-slate-500 transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span className="truncate group-hover:text-[#00478D]">Murrplastik (CHLB Đức)</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">Đức</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">
                    Xích dẫn cáp &amp; Giá đỡ Robot
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home', 'dung-cu-bom-keo')}
                  className="p-2.5 rounded-sm bg-slate-800/80 border border-slate-700/60 hover:border-slate-500 transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span className="truncate group-hover:text-[#00478D]">Máy bơm keo 983A / SP-982</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">0.01ml</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">
                    Bơm keo tự động &amp; Bán tự động
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home', 'may-bat-vit-nha-vit')}
                  className="p-2.5 rounded-sm bg-slate-800/80 border border-slate-700/60 hover:border-slate-500 transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span className="truncate group-hover:text-[#00478D]">Tô vít điện tử Hios CL-4000</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">SMT</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">
                    Máy bắt vít &amp; Đo lực siết HP-10
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home', 'thiet-bi-han')}
                  className="p-2.5 rounded-sm bg-slate-800/80 border border-slate-700/60 hover:border-slate-500 transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span className="truncate group-hover:text-[#00478D]">Trạm hàn thiếc Hakko / Quick</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">ESD</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">
                    Máy hàn Hakko 936, mỏ hàn, bể hàn
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home', 'may-cat-bang-dinh-tu-dong')}
                  className="p-2.5 rounded-sm bg-slate-800/80 border border-slate-700/60 hover:border-slate-500 transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span className="truncate group-hover:text-[#00478D]">Máy cắt băng dính Zcut 9</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">Auto</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">
                    Cắt 2 cuộn đồng thời &amp; Cắt tem nhãn
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('home', 'camera-kinh-soi')}
                  className="p-2.5 rounded-sm bg-slate-800/80 border border-slate-700/60 hover:border-slate-500 transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span className="truncate group-hover:text-[#00478D]">Kính hiển vi soi nổi SM-3TPZ</span>
                    <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">7X-45X</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-300">
                    Kính soi linh kiện &amp; Đo kiểm quang học
                  </div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('cart')}
                  className="w-full py-2.5 px-4 rounded-sm bg-slate-800 hover:bg-[#00478D] text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 hover:border-[#00478D] transition-all cursor-pointer shadow-sm"
                >
                  <span>Tạo Danh Sách Yêu Cầu Báo Giá Nhanh</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance & Credit */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="space-y-1 text-center md:text-left">
              <div>
                © 2026 <strong>{COMPANY_INFO.name}</strong> ({COMPANY_INFO.fullNameEn}). All rights reserved.
              </div>
              <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
                Toàn bộ nội dung, hình ảnh sản phẩm, tài liệu catalog và thông số kỹ thuật thuộc quyền sở hữu của T&T Vina Industrial Co., Ltd. Nghiêm cấm mọi hành vi sao chép, trích xuất hoặc tái bản dưới mọi hình thức khi chưa có sự chấp thuận bằng văn bản.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center md:items-end gap-3 shrink-0">
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Tiêu chuẩn B2B</span>
                <span>•</span>
                <span>Chính hãng 100%</span>
                <span>•</span>
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className="text-[11px] text-slate-500/70 hover:text-slate-400 transition-colors font-mono tracking-tight">
                Thiết kế &amp; phát triển: <span className="text-slate-400 font-medium">KhaiLL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

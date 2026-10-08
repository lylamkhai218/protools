import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import { 
  Clock, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { COMPANY_INFO } from '../data';

interface CatalogMaintenanceBlockProps {
  onOpenCart?: () => void;
}

export const CatalogMaintenanceBlock: React.FC<CatalogMaintenanceBlockProps> = ({ onOpenCart }) => {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    let anim: ReturnType<typeof lottie.loadAnimation> | null = null;
    if (lottieContainer.current) {
      try {
        anim = lottie.loadAnimation({
          container: lottieContainer.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/data/maintenance.json'
        });
      } catch (err) {
        console.warn('Lottie load warning:', err);
      }
    }
    return () => {
      if (anim) anim.destroy();
    };
  }, []);

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    try {
      navigator.clipboard.writeText(text);
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <section 
      id="product-catalog" 
      className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200/90 relative overflow-hidden"
    >
      <div id="catalog" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-sm border border-slate-200/90 shadow-lg p-6 sm:p-10 md:p-12 text-center relative overflow-hidden">
          
          {/* Subtle Industrial Background Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#00478D] to-blue-600" />
          
          {/* Lottie Vector Maintenance Animation */}
          <div className="w-full max-w-[240px] sm:max-w-[300px] md:max-w-[340px] aspect-[16/10] mx-auto flex items-center justify-center mb-4 sm:mb-6">
            <div ref={lottieContainer} className="w-full h-full filter drop-shadow-md" />
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Hệ Thống Đang Kiểm Duyệt & Nâng Cấp Dữ Liệu</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase max-w-2xl mx-auto mb-3">
            Hệ Thống Danh Mục Sản Phẩm Đang Trong Quá Trình Bảo Trì
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Bộ phận dữ liệu và kỹ thuật của <strong>T&T Vina</strong> đang tiến hành rà soát, kiểm duyệt và chuẩn hóa thông số kỹ thuật danh mục thiết bị để phục vụ Quý khách hàng & Đối tác chuẩn xác nhất. 
            Hệ thống danh mục trực tuyến sẽ sớm mở lại sau khi hoàn tất kiểm duyệt.
          </p>

          {/* B2B Direct Procurement Hotline & Channels */}
          <div className="w-full max-w-3xl mx-auto bg-slate-50/90 rounded-sm border border-slate-200 p-4 sm:p-6 mb-8 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tiếp Nhận Báo Giá Nhanh & Tra Cứu Thông Số (24/7)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Phản hồi báo giá trong 15 - 30 phút</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Hotline Box */}
              <div className="bg-white rounded-xs border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:border-blue-400 transition-colors">
                <div className="text-[11px] text-slate-500 font-medium">Hotline Tư Vấn / Báo Giá BOM</div>
                <div className="flex items-center justify-between mt-1">
                  <a
                    href="tel:0915168824"
                    className="text-lg sm:text-xl font-display font-black text-emerald-600 hover:text-emerald-700 font-mono tracking-tight"
                  >
                    0915.168.824
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('0915168824', 'phone')}
                    className="p-1.5 rounded-xs hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Tổng đài tiếp nhận Ms. Nhung</div>
              </div>

              {/* Email Box */}
              <div className="bg-white rounded-xs border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs hover:border-blue-400 transition-colors">
                <div className="text-[11px] text-slate-500 font-medium">Email Tiếp Nhận File BOM / Yêu Cầu Báo Giá</div>
                <div className="flex items-center justify-between mt-1">
                  <a
                    href="mailto:info@t2tvina.com"
                    className="text-base sm:text-lg font-display font-bold text-[#00478D] hover:underline font-mono truncate"
                  >
                    info@t2tvina.com
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('info@t2tvina.com', 'email')}
                    className="p-1.5 rounded-xs hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
                    title="Sao chép email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Hỗ trợ định dạng Excel, CSV, PDF, CAD</div>
              </div>
            </div>

            {/* Technical Sales Contacts */}
            <div className="mt-4 pt-3 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">Phòng Dự Án / Kỹ Thuật:</span>
                <span className="font-mono">0943.301.886 (Mr. Thanh)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">Chuyên Viên Murrplastik:</span>
                <span className="font-mono">0968.597.131 (Mr. Khải)</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                className="h-11 px-6 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-display text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                <span>Mở Công Cụ Báo Giá BOM Nhanh</span>
              </button>
            )}

            <a
              href="/murrplastik/"
              className="h-11 px-6 rounded-xs bg-[#E30613] hover:bg-[#C8102E] text-white font-display text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Xem Chuyên Trang Murrplastik Đức</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CatalogMaintenanceBlock;

import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import { Phone, Mail, Clock, ShieldCheck, MapPin, Copy, Check, ArrowRight } from 'lucide-react';

interface MaintenanceScreenProps {
  onEnterInternal?: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = () => {
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
    <div className="min-h-[100dvh] h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 selection:bg-[#00478D] selection:text-white">
      {/* 1. Header with Official T&T VINA Logo on Light Background */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-2 sm:py-2.5 shadow-2xs shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logos/TTV_LOGO_Color_Master.svg" 
              alt="T&T VINA Industrial" 
              className="h-8 sm:h-9 w-auto object-contain" 
            />
            <div className="border-l border-slate-200 pl-3 hidden xs:block">
              <div className="font-display font-black text-slate-900 text-xs sm:text-sm tracking-wide">
                PROTOOLS <span className="text-[#00478D] text-[10px] sm:text-xs font-bold uppercase">· Industrial</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-tight leading-tight">
                T&T VINA INDUSTRIAL CO., LTD
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Đang Bảo Trì Nâng Cấp
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Center Content (Compact & Perfectly Centered without Scroll) */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-2 sm:py-3 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Lottie SVG Animation - Shifted higher up & scaled cleanly */}
        <div className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[300px] aspect-[16/10] flex items-center justify-center shrink-0 -mt-1 sm:-mt-3 mb-1 sm:mb-2">
          <div ref={lottieContainer} className="w-full h-full filter drop-shadow-sm" />
        </div>

        {/* Headings */}
        <div className="space-y-1 sm:space-y-1.5 max-w-xl mx-auto shrink-0 mb-2 sm:mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-slate-100 text-slate-700 border border-slate-200 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#00478D]" />
            <span>Nâng Cấp Hạ Tầng Kỹ Thuật Định Kỳ</span>
          </div>

          <h1 className="font-display font-black text-lg sm:text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight">
            Website Đang Tiến Hành Bảo Trì & Nâng Cấp
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-normal max-w-lg mx-auto">
            Hệ thống Protools đang được bảo trì và tối ưu hóa dữ liệu danh mục để nâng cao chất lượng phục vụ.
            Website sẽ sớm quay trở lại phục vụ Quý khách trong thời gian ngắn nhất!
          </p>
        </div>

        {/* Urgent Contact Action Cards (Light Style, High Contrast) */}
        <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-sm p-3 sm:p-4 shadow-sm space-y-2.5 text-left shrink-0 mb-2 sm:mb-3">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kênh Tiếp Nhận Báo Giá & Hỗ Trợ Khẩn Cấp (24/7)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Hotline Card */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-xs p-2.5 sm:p-3 flex flex-col justify-between hover:border-blue-400 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Hotline Tư Vấn / Báo Giá</div>
                  <a
                    href="tel:0915168824"
                    className="text-base sm:text-lg font-display font-black text-emerald-600 hover:text-emerald-700 tracking-wide font-mono block mt-0.5"
                  >
                    0915.168.824
                  </a>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <a
                  href="tel:0915168824"
                  className="font-bold text-[#00478D] hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Gọi ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('0915168824', 'phone')}
                  className="text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-xs p-2.5 sm:p-3 flex flex-col justify-between hover:border-blue-400 transition-colors">
              <div className="flex items-start justify-between">
                <div className="truncate mr-2">
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Email Nhận BOM & Báo Giá</div>
                  <a
                    href="mailto:info@t2tvina.com"
                    className="text-sm sm:text-base font-display font-bold text-[#00478D] hover:text-blue-700 tracking-tight block mt-0.5 truncate"
                  >
                    info@t2tvina.com
                  </a>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#00478D] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <a
                  href="mailto:info@t2tvina.com"
                  className="font-bold text-[#00478D] hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Gửi email</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('info@t2tvina.com', 'email')}
                  className="text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Address Footer Brief */}
        <div className="text-[11px] sm:text-xs text-slate-500 space-y-0.5 max-w-lg shrink-0">
          <div className="font-semibold text-slate-700">
            CÔNG TY TNHH CÔNG NGHIỆP T&T VINA (T&T VINA INDUSTRIAL CO., LTD)
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            <span>Kho Hà Nội: 11/68/467 Lĩnh Nam · Kho Hưng Yên: Thôn Trà Hồi (KCN Liên Hà Thái)</span>
          </div>
        </div>
      </main>

      {/* 3. Clean Footer without internal portal link */}
      <footer className="border-t border-slate-200 bg-white/90 py-2 sm:py-2.5 px-4 text-center shrink-0">
        <div className="max-w-6xl mx-auto text-[10px] sm:text-[11px] text-slate-500">
          © {new Date().getFullYear()} CÔNG TY TNHH CÔNG NGHIỆP T&T VINA · Mọi quyền được bảo lưu.
        </div>
      </footer>
    </div>
  );
};

export default MaintenanceScreen;

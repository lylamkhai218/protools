import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  ArrowUp, 
  X, 
  ShoppingBag,
  ExternalLink,
  ChevronUp,
  Copy,
  Check,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { COMPANY_INFO } from '../data';
import { useTranslation } from '../i18n/LanguageContext';

interface FloatingWidgetsProps {
  onOpenCart?: () => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ onOpenCart }) => {
  const { t } = useTranslation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (docHeight > 0) {
            const isPastHalf = (scrollTop / docHeight) >= 0.50;
            setShowBackToTop(prev => prev !== isPastHalf ? isPastHalf : prev);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    if (startY === 0) return;

    const startTime = performance.now();
    const phase1Duration = 650; // 650ms trôi từ từ rất chậm rãi, êm ái
    const totalDuration = 1350; // Tổng thời gian 1350ms
    const phase1Distance = 140; // Đoạn trôi từ từ 140px

    const step = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < phase1Duration) {
        // Giai đoạn 1: Trôi từ từ chậm rãi 140px trong 650ms
        const p1 = elapsed / phase1Duration;
        const ease1 = p1 * p1 * (3 - 2 * p1); // Smooth cubic ease
        const currentY = startY - (phase1Distance * ease1);
        window.scrollTo(0, Math.max(0, currentY));
        window.requestAnimationFrame(step);
      } else if (elapsed < totalDuration) {
        // Giai đoạn 2: Phóng vụt nhanh như bay lên đỉnh 0px
        const p2 = (elapsed - phase1Duration) / (totalDuration - phase1Duration);
        const ease2 = Math.pow(p2, 3.2); // Rocket acceleration
        const remainY = Math.max(0, startY - phase1Distance);
        const currentY = remainY * (1 - ease2);
        window.scrollTo(0, Math.max(0, currentY));
        window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* 1. NÚT QUAY VỀ ĐẦU TRANG (HIỆN RA KHI CUỘN >= 50% TRANG VỚI HIỆU ỨNG TỰ NHIÊN) */}
      <button
        onClick={scrollToTop}
        className={`pointer-events-auto group flex items-center justify-center w-11 h-11 rounded-full bg-white text-slate-700 hover:text-white hover:bg-[#00478D] shadow-lg border border-slate-200/90 backdrop-blur-md transition-all duration-500 ease-out transform cursor-pointer ${
          showBackToTop 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
        }`}
        title="Quay về đầu trang"
        aria-label="Quay về đầu trang"
      >
        <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
      </button>

      {/* 2. MENU LIÊN HỆ ĐA PHƯƠNG THỨC (POPUP MODAL WITH SMOOTH SPRING ANIMATION) */}
      <div className="relative flex flex-col items-end pointer-events-auto">
        {isContactOpen && (
          <div className="bg-white/98 backdrop-blur-xl rounded-sm shadow-[0_20px_50px_rgba(0,31,63,0.15)] border border-slate-200 p-4 w-80 sm:w-92 space-y-3 origin-bottom-right transition-all duration-200 ease-out animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
            
            {/* Header popup */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
                  {t('contact_widget.panel_title')}
                </span>
              </div>
              <button 
                onClick={() => setIsContactOpen(false)}
                className="p-1 rounded-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label={t('contact_widget.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List methods */}
            <div className="space-y-2 text-xs">
              
              {/* 1. Hotline Tư Vấn (0915.168.824) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-slate-50 hover:bg-slate-100/90 border border-slate-200 transition-all group">
                <a
                  href={`tel:${COMPANY_INFO.hotlineRaw}`}
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#00478D] text-white flex items-center justify-center shadow-xs shrink-0">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-[#00478D] truncate">{t('contact_widget.hotline')}</div>
                      <div className="text-[11px] font-mono text-[#00478D] font-bold truncate">{COMPANY_INFO.hotline}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00478D] shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.hotlineRaw, 'hotline', e)}
                  title="Sao chép số Hotline"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'hotline'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'hotline' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2. Zalo Kinh Doanh 1 (Ms. Hiền - Màu Xanh Nước Biển) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/90 transition-all group">
                <a
                  href={COMPANY_INFO.salesTeam[0].zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-xs shrink-0">
                      Zalo
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-[#00478D] truncate">
                        {t('contact_widget.sales')}: {COMPANY_INFO.salesTeam[0].name}
                      </div>
                      <div className="text-[11px] font-mono text-[#0068FF] font-semibold truncate">
                        {COMPANY_INFO.salesTeam[0].intlPhone}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0068FF] shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.salesTeam[0].rawPhone, 'zalo_hien', e)}
                  title="Sao chép số Zalo Ms. Hiền"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'zalo_hien'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-blue-900 border-blue-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'zalo_hien' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-blue-500" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3. Zalo Kinh Doanh 2 (Ms. Phương - Màu Xanh Nước Biển) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/90 transition-all group">
                <a
                  href={COMPANY_INFO.salesTeam[1].zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-xs shrink-0">
                      Zalo
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-[#00478D] truncate">
                        {t('contact_widget.sales')}: {COMPANY_INFO.salesTeam[1].name}
                      </div>
                      <div className="text-[11px] font-mono text-[#0068FF] font-semibold truncate">
                        {COMPANY_INFO.salesTeam[1].intlPhone}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0068FF] shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.salesTeam[1].rawPhone, 'zalo_phuong', e)}
                  title="Sao chép số Zalo Ms. Phương"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'zalo_phuong'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-blue-900 border-blue-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'zalo_phuong' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-blue-500" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4. Zalo KD Murrplastik 1 (Mr. Bình) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/90 transition-all group">
                <a
                  href={COMPANY_INFO.murrSalesTeam[0].zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-xs shrink-0">
                      Zalo
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-[#00478D] truncate">
                        {t('contact_widget.murr_sales')}: {COMPANY_INFO.murrSalesTeam[0].name}
                      </div>
                      <div className="text-[11px] font-mono text-[#0068FF] font-semibold truncate">
                        {COMPANY_INFO.murrSalesTeam[0].phone}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0068FF] shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.murrSalesTeam[0].rawPhone, 'zalo_binh', e)}
                  title="Sao chép số Zalo Mr. Bình"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'zalo_binh'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-blue-900 border-blue-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'zalo_binh' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-blue-500" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 5. Zalo KD Murrplastik 2 (Mr. Khải) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/90 transition-all group">
                <a
                  href={COMPANY_INFO.murrSalesTeam[1].zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-[10px] font-mono shadow-xs shrink-0">
                      Zalo
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-[#00478D] truncate">
                        {t('contact_widget.murr_sales')}: {COMPANY_INFO.murrSalesTeam[1].name}
                      </div>
                      <div className="text-[11px] font-mono text-[#0068FF] font-semibold truncate">
                        {COMPANY_INFO.murrSalesTeam[1].phone}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0068FF] shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.murrSalesTeam[1].rawPhone, 'zalo_khai', e)}
                  title="Sao chép số Zalo Mr. Khải"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'zalo_khai'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-blue-50 text-blue-900 border-blue-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'zalo_khai' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-blue-500" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 6. Phòng Dự Án (Mr. Thanh) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 transition-all group">
                <a
                  href={`tel:${COMPANY_INFO.projectDept.rawPhone}`}
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xs shrink-0">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 group-hover:text-[#D97706] truncate">
                        {t('contact_widget.project')}: {COMPANY_INFO.projectDept.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#D97706] font-bold truncate">
                        {COMPANY_INFO.projectDept.phone}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D97706] shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.projectDept.rawPhone, 'project_thanh', e)}
                  title="Sao chép số Phòng Dự Án"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'project_thanh'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'project_thanh' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-600" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 7. Email Nhận Báo Giá */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all group">
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{t('contact_widget.email')}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{COMPANY_INFO.email}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(COMPANY_INFO.email, 'email', e)}
                  title="Sao chép Email"
                  className={`px-2 py-1.5 rounded-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer text-[10px] font-semibold border ${
                    copiedKey === 'email'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 shadow-2xs'
                  }`}
                >
                  {copiedKey === 'email' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('contact_widget.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>{t('contact_widget.copy')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 8. Bản Đồ & Vị Trí Kho Lĩnh Nam */}
              <div className="flex items-center gap-1.5 p-1 rounded-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all group">
                <a
                  href={COMPANY_INFO.mapUrlLinhNam}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-between p-1.5 min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-xs shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-amber-100" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-800 truncate">{t('contact_widget.wh_title')}</div>
                      <div className="text-[11px] text-[#00478D] font-medium truncate">{t('contact_widget.wh_sub')}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00478D] shrink-0 ml-1" />
                </a>
              </div>

            </div>

            {/* Bottom Note */}
            <div className="text-[10px] text-center text-slate-400 pt-1 border-t border-slate-100">
              {t('contact_widget.footer_note')}
            </div>

          </div>
        )}

        {/* 3. NÚT KÍCH HOẠT CHÍNH (FLOATING CONTACT BUTTON WITH REFINED COMPACT AURA) */}
        <div className="relative group">
          {/* Refined subtle radar pulse (not overly wide) */}
          {!isContactOpen && (
            <>
              <span className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-40 blur-xs animate-pulse"></span>
              <span className="absolute -inset-0.5 rounded-full bg-blue-400 opacity-25 animate-ping"></span>
            </>
          )}

          <button
            onClick={() => setIsContactOpen(!isContactOpen)}
            className={`relative flex items-center gap-2.5 px-4 sm:px-5 h-12 rounded-full font-display font-bold text-xs uppercase tracking-wider text-white shadow-xl transition-all duration-200 ease-out transform hover:scale-105 active:scale-95 cursor-pointer ${
              isContactOpen 
                ? 'bg-slate-800 hover:bg-slate-900 border border-slate-700' 
                : 'bg-gradient-to-r from-[#00478D] to-[#005EB8] hover:from-[#003B75] hover:to-[#004E9A] ring-2 ring-blue-400/30'
            }`}
            aria-label={t('contact_widget.btn_main')}
          >
            {isContactOpen ? (
              <>
                <X className="w-4.5 h-4.5 text-amber-400" />
                <span>{t('contact_widget.close')}</span>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-extrabold tracking-wide text-[12px]">{t('contact_widget.btn_main')}</span>
                  <span className="text-[9px] text-amber-300 font-medium tracking-normal lowercase -mt-0.5">{t('contact_widget.btn_sub')}</span>
                </div>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

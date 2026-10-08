import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, 
  X, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface SearchMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchMaintenanceModal: React.FC<SearchMaintenanceModalProps> = ({ isOpen, onClose }) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-[#00478D] to-blue-600" />

        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-5 pb-3 flex items-start justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider font-mono">
                Thông Báo Kỹ Thuật
              </div>
              <h3 id="search-modal-title" className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                Tính Năng Tìm Kiếm Đang Bảo Trì
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          <p className="text-slate-600 leading-relaxed font-normal">
            Hệ thống cơ sở dữ liệu sản phẩm đang được rà soát và kiểm duyệt dữ liệu định kỳ. Tính năng tìm kiếm trực tuyến đang tạm thời gián đoạn trong thời gian bảo trì.
          </p>

          <div className="bg-slate-50 rounded-xs border border-slate-200 p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kênh Tiếp Nhận Yêu Cầu Thiết Bị & Báo Giá Nhanh:</span>
            </div>

            {/* Hotline */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xs border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Hotline Báo Giá (Ms. Nhung):</span>
                <a href="tel:0915168824" className="text-sm font-bold font-mono text-emerald-600 hover:text-emerald-700">
                  0915.168.824
                </a>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('0915168824', 'phone')}
                className="p-1.5 rounded-xs hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Sao chép số điện thoại"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xs border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">Email BOM / Spec Sheet:</span>
                <a href="mailto:info@t2tvina.com" className="text-sm font-bold font-mono text-[#00478D] hover:underline">
                  info@t2tvina.com
                </a>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('info@t2tvina.com', 'email')}
                className="p-1.5 rounded-xs hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Sao chép email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Quý khách cũng có thể tra cứu toàn bộ dòng thiết bị xích cáp & bó cáp robot tại{' '}
            <a href="/murrplastik/" className="text-red-600 font-bold hover:underline inline-flex items-center gap-0.5">
              <span>Chuyên trang Murrplastik Đức</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <a
            href="tel:0915168824"
            className="px-4 py-2 rounded-xs bg-[#00478D] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gọi 0915.168.824</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
          >
            Đã Hiểu & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchMaintenanceModal;

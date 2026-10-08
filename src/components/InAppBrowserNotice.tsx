import React, { useState, useEffect } from 'react';
import { Compass, Copy, Check, X, ExternalLink, Globe } from 'lucide-react';

interface InAppDetectionResult {
  isInApp: boolean;
  appName: string;
  isIos: boolean;
  isAndroid: boolean;
}

function detectInAppBrowser(): InAppDetectionResult {
  if (typeof window === 'undefined' || !navigator || !navigator.userAgent) {
    return { isInApp: false, appName: '', isIos: false, isAndroid: false };
  }

  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  let appName = '';
  if (/Zalo/i.test(ua) || /ZaloTheme/i.test(ua) || /ZALOPHONEDIALER/i.test(ua)) {
    appName = 'Zalo';
  } else if (/FBAN|FBAV/i.test(ua)) {
    appName = 'Facebook';
  } else if (/Messenger/i.test(ua)) {
    appName = 'Messenger';
  } else if (/Instagram/i.test(ua)) {
    appName = 'Instagram';
  } else if (/musical_ly|ByteLocale|TikTok/i.test(ua)) {
    appName = 'TikTok';
  } else if (/MicroMessenger/i.test(ua)) {
    appName = 'WeChat';
  } else if (/Line\//i.test(ua)) {
    appName = 'Line';
  }

  return {
    isInApp: appName !== '',
    appName,
    isIos,
    isAndroid
  };
}

export const InAppBrowserNotice: React.FC = () => {
  const [detection, setDetection] = useState<InAppDetectionResult>({
    isInApp: false,
    appName: '',
    isIos: false,
    isAndroid: false
  });
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    try {
      const result = detectInAppBrowser();
      const dismissed = sessionStorage.getItem('protools_inapp_notice_dismissed') === 'true';
      setDetection(result);
      setIsDismissed(dismissed);
    } catch {
      // Ignore
    }
  }, []);

  if (!detection.isInApp || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('protools_inapp_notice_dismissed', 'true');
    } catch {
      // Ignore
    }
    setIsDismissed(true);
  };

  const handleCopyLink = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const instructionText = detection.isIos
    ? 'Bấm biểu tượng ba chấm (•••) hoặc chia sẻ ở góc màn hình -> chọn "Mở trong Safari" (Open in Safari)'
    : 'Bấm biểu tượng ba chấm (⋮) ở góc trên bên phải -> chọn "Mở bằng trình duyệt" (Open in Chrome)';

  return (
    <aside
      aria-label="Thông báo mở trình duyệt ngoài"
      className="sticky top-0 z-[60] bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-lg border-b border-amber-500/80 animate-in slide-in-from-top duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 sm:gap-4 text-xs">
        
        {/* Left: Info & Instructions */}
        <div className="flex items-start gap-2.5 sm:gap-3 flex-1">
          <div className="p-1.5 rounded-xs bg-white/15 shrink-0 mt-0.5">
            <Compass className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5 font-bold text-white">
              <span className="px-1.5 py-0.2 rounded-xs bg-black/25 text-amber-200 text-[10px] uppercase font-mono tracking-wide">
                Trình duyệt {detection.appName}
              </span>
              <span>Để có trải nghiệm tốt nhất, vui lòng mở bằng trình duyệt ngoài (Chrome / Safari)!</span>
            </div>
            <div className="text-[11px] text-amber-100/90 flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-200 shrink-0" />
              <span>{instructionText}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xs font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${
              isCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-900 hover:bg-amber-50'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã chép link</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="px-2.5 py-1.5 rounded-xs bg-black/25 hover:bg-black/40 text-amber-100 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
            <span>Đã hiểu</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export default InAppBrowserNotice;

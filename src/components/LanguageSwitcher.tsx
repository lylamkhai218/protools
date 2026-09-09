import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { FlagIcon } from './FlagIcon';
import { SUPPORTED_LOCALES, LocaleConfig } from '../i18n/config';
import { useTranslation } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'utility';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { locale, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocaleConfig = SUPPORTED_LOCALES.find(l => l.code === locale) || SUPPORTED_LOCALES[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: LocaleConfig['code']) => {
    setLocale(code);
    setIsOpen(false);
  };

  // Mobile Grid View inside Mobile Drawer
  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
          Chọn Ngôn Ngữ / Language
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {SUPPORTED_LOCALES.map((item) => {
            const isSelected = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xs text-xs font-semibold border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#00478D] text-white border-[#00478D] shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <FlagIcon country={item.code} width={18} height={12} />
                <span className="truncate">{item.nativeName}</span>
                {isSelected && <Check className="w-3 h-3 ml-auto shrink-0 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Top Utility Bar / Desktop Header Dropdown View
  const isUtility = variant === 'utility';

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={`Chuyển ngôn ngữ / Switch Language (Hiện tại: ${currentLocaleConfig.nativeName})`}
        className={`flex items-center gap-1.5 rounded-sm border transition-all cursor-pointer select-none ${
          isUtility
            ? 'h-6.5 px-2 text-[11px] font-semibold bg-white/90 hover:bg-white text-slate-700 hover:text-[#00478D] border-slate-200/90 shadow-2xs'
            : 'h-11 px-3 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs min-w-[94px]'
        } ${isOpen ? 'border-[#00478D] ring-2 ring-[#00478D]/10 bg-white' : ''}`}
      >
        <FlagIcon country={currentLocaleConfig.code} width={18} height={12} />
        <span className="font-mono uppercase tracking-tight">
          {isUtility ? currentLocaleConfig.shortLabel : currentLocaleConfig.nativeName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-[#00478D]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-48 rounded-xs bg-white py-1 shadow-xl border border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-1 duration-150 focus:outline-none"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Ngôn ngữ / Language
          </div>

          <div className="py-1 divide-y divide-slate-50">
            {SUPPORTED_LOCALES.map((item) => {
              const isSelected = item.code === locale;
              return (
                <button
                  key={item.code}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-50/80 text-[#00478D] font-bold'
                      : 'text-slate-700 hover:bg-slate-50/90 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FlagIcon country={item.code} width={18} height={12} />
                    <span className="truncate">{item.nativeName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {item.shortLabel}
                    </span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-[#00478D]" />
                    ) : (
                      <span className="w-3.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

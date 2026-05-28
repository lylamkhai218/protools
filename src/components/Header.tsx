import React, { useState } from 'react';
import { Search, Globe, FileText, ShoppingCart, LayoutGrid, ChevronDown, ListFilter, HelpCircle, Menu, X } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../LanguageContext';
import FlagIcon from './FlagIcon';

interface HeaderProps {
  currentTab: string;
  activeCategory: string;
  onTabChange: (tab: string) => void;
  onCategoryClick: () => void;
  cartCount: number;
  onSearch?: (query: string) => void;
}

function getCategoryLabel(catKey: string, code: string): string {
  const norm = (catKey || '').toLowerCase().replace(/_/g, '-');
  if (norm === 'robot') return code === 'VI' ? 'Robot Tự Động' : 'Robotics';
  if (norm === 'han') return code === 'VI' ? 'Thiết Bị Hàn & SMT' : 'Soldering & ESD';
  if (norm === 'keo') return code === 'VI' ? 'Keo & Vật Tư' : 'Adhesives';
  if (norm === 'van-vit') return code === 'VI' ? 'Dụng Cụ Vặn Vít' : 'Screwdrivers';
  
  // Custom category format
  return catKey
    .split(/[-_ ]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Header({ currentTab, activeCategory, onTabChange, onCategoryClick, cartCount, onSearch }: HeaderProps) {
  const [searchVal, setSearchVal] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLang, setLanguage, t } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    }
  };

  const isVi = currentLang.code === 'VI';

  return (
    <header className="sticky top-0 z-50 bg-[#001530] border-b border-[#002244]/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile hamburger menu toggle button & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 select-none shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 rounded-md text-white hover:bg-white/10 transition-colors focus:outline-hidden cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle mobile menu"
              title={isVi ? "Mở Menu chính" : "Open Main Navigation Menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#e8a020] animate-pulse" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
            <div 
              onClick={() => {
                onTabChange('home');
                setIsMobileMenuOpen(false);
              }} 
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
            >
              <span className="font-display text-lg sm:text-2xl font-extrabold text-white tracking-tight shrink-0">
                T&T Vina
              </span>
              <div className="hidden md:flex flex-col border-l border-white/20 pl-1.5 sm:pl-2 shrink-0">
                <span className="text-[10px] text-blue-200/80 font-display font-medium uppercase tracking-wider leading-none shrink-0">
                  Industrial Precision
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {/* 1. Home Tab */}
            <button
              onClick={() => onTabChange('home')}
              className={`px-3 py-2 text-xs xl:text-sm font-bold transition-colors relative whitespace-nowrap ${
                currentTab === 'home' || currentTab === ''
                  ? 'text-white font-extrabold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('home')}
              {(currentTab === 'home' || currentTab === '') && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#e8a020] rounded-full" />
              )}
            </button>

            {/* 2. Highlighted Dynamic Category Selector (drawer trigger) */}
            <button
              onClick={onCategoryClick}
              className={`px-3 py-2 text-xs xl:text-sm font-bold transition-colors relative whitespace-nowrap flex items-center gap-1.5 group cursor-pointer ${
                currentTab === 'products'
                  ? 'text-white font-extrabold'
                  : 'text-white/80 hover:text-white'
              }`}
              title={isVi ? "Click để xem thanh danh mục mở rộng" : "Click to view expanded category sidebar"}
            >
              <LayoutGrid className="h-4 w-4 text-[#e8a020] group-hover:rotate-12 transition-transform shrink-0" />
              <span className="font-display uppercase tracking-wider text-[11px] xl:text-xs">
                {isVi ? 'Danh mục:' : 'Category:'}{' '}
                <strong className="text-white font-black underline decoration-amber-500/50">
                  {getCategoryLabel(activeCategory, currentLang.code)}
                </strong>
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80 shrink-0" />
              {currentTab === 'products' && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#e8a020] rounded-full" />
              )}
            </button>

            {/* 3. Tech resource hub Tab */}
            <button
              onClick={() => onTabChange('document-center')}
              className={`px-3 py-2 text-xs xl:text-sm font-bold transition-colors relative whitespace-nowrap ${
                currentTab === 'document-center'
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('techCenter')}
              {currentTab === 'document-center' && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#e8a020] rounded-full" />
              )}
            </button>

            {/* 4. Admin Management Tab */}
            <button
              onClick={() => onTabChange('admin')}
              className={`px-3 py-2 text-xs xl:text-sm font-bold transition-colors relative whitespace-nowrap ${
                currentTab === 'admin'
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('adminTab')}
              {currentTab === 'admin' && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#e8a020] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Elements (Language, Quote Action) */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
            
            {/* Language Switcher */}
            <div className="relative">
              <div 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 sm:gap-2 text-xs text-white border border-white/20 bg-white/5 px-2 sm:px-2.5 py-1.5 rounded-md hover:bg-white/10 cursor-pointer select-none transition-all"
              >
                <FlagIcon countryCode={currentLang.code} className="w-4 h-2.5 shrink-0" />
                <span className="font-semibold uppercase text-white tracking-wider">
                  {currentLang.code}
                </span>
                <span className="text-[10px] text-white/80 font-sans ml-0.5 select-none font-bold">▼</span>
              </div>

              {isLangOpen && (
                <>
                  {/* Backdrop path closer */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsLangOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-zinc-200 rounded-md shadow-lg py-1 z-20 animate-fade-in divide-y divide-zinc-50">
                    <div className="px-3 py-1.5 text-[9px] font-display font-black text-zinc-400 uppercase tracking-widest bg-zinc-50/50">
                      Language / Ngôn ngữ
                    </div>
                    <div className="py-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-zinc-50 transition-colors ${
                            currentLang.code === lang.code 
                              ? 'text-[#00478d] bg-[#d5e0f7]/25 font-bold' 
                              : 'text-zinc-600'
                          }`}
                        >
                          <FlagIcon countryCode={lang.code} className="w-5 h-3.5" />
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quote Cart Button */}
            <button
              id="headerQuoteBtn"
              onClick={() => onTabChange('cart')}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#e8a020] hover:bg-amber-500 text-zinc-950 px-2.5 sm:px-4 lg:px-2.5 xl:px-4 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 rounded-xs font-display text-xs font-bold uppercase tracking-wider hover:scale-[1.02] hover:shadow-md transition-all relative shrink-0 active:scale-95"
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline lg:hidden xl:inline">{t('fastQuote')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-zinc-950 text-white font-sans font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#e8a020] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop screen closer */}
          <div 
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative flex w-full max-w-xs flex-col bg-[#001530] text-white shadow-2xl z-50 animate-slide-left-in border-r border-[#002244] h-full pt-16">
            {/* Close trigger button inside drawers */}
            <div className="absolute top-4 right-4 animate-fade-in">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest mb-3">
                  {isVi ? 'Hệ Thống Phân Mục' : 'Navigation Services'}
                </p>
                <div className="space-y-2">
                  {/* Home */}
                  <button
                    onClick={() => {
                      onTabChange('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      currentTab === 'home' || currentTab === ''
                        ? 'bg-[#002244] text-white font-black'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span>{t('home')}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-200 opacity-50" />
                  </button>

                  {/* Category Drawer Trigger */}
                  <button
                    onClick={() => {
                      onCategoryClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      currentTab === 'products'
                        ? 'bg-[#002244] text-white'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-[#e8a020]" />
                      <span>{isVi ? 'Nhóm danh mục' : 'Categories'}</span>
                    </span>
                    <span className="text-[11px] text-[#e8a020] underline font-extrabold uppercase truncate max-w-[120px]">
                      {getCategoryLabel(activeCategory, currentLang.code)}
                    </span>
                  </button>

                  {/* Document Center */}
                  <button
                    onClick={() => {
                      onTabChange('document-center');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      currentTab === 'document-center'
                        ? 'bg-[#002244] text-white font-black'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span>{t('techCenter')}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-200 opacity-50" />
                  </button>

                  {/* Admin Tab */}
                  <button
                    onClick={() => {
                      onTabChange('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      currentTab === 'admin'
                        ? 'bg-[#00478d] text-white font-black'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <span>{t('adminTab')}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-200 opacity-50" />
                  </button>
                </div>
              </div>

              {/* Enterprise Support metadata info */}
              <div className="pt-6 border-t border-white/10 text-center text-[10px] text-blue-200/40 space-y-1">
                <p className="font-bold text-blue-200/60 font-display">T&T VINA INDUSTRIAL CO., LTD</p>
                <p>Hotline: (+84) 983.794.782</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

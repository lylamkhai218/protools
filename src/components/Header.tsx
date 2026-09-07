import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  FileText, 
  PhoneCall, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  Zap,
  Cpu,
  Wrench,
  PackageCheck,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, SOLUTIONS, COMPANY_INFO } from '../data';

interface HeaderProps {
  currentTab: string;
  cartCount: number;
  onNavigate: (tab: string, filter?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function Header({ currentTab, cartCount, onNavigate, onSelectProduct }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Instant SKU & Product Autocomplete search
  const searchResults = searchQuery.trim() === '' ? [] : PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
    setIsSearchFocused(false);
    setSearchQuery('');
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleProductClick(searchResults[0]);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(0,31,63,0.05)] transition-all">
      {/* 1. TOP UTILITY BAR WITH 100% REAL COMPANY DATA (STRICT ALL-VISIBLE SINGLE LINE) */}
      <div className="bg-slate-50 border-b border-slate-200/60 text-[11px] text-slate-600 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4 whitespace-nowrap">
          
          {/* Left: Headquarters Location & VPGD */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Building2 className="w-3.5 h-3.5 text-[#00478D] shrink-0" />
              <span>Trụ sở: <strong>Thụy Anh, Hưng Yên</strong> • </span>
              <a 
                href={COMPANY_INFO.mapUrlLinhNam} 
                target="_blank" 
                rel="noreferrer" 
                title="Mở Google Maps chỉ đường đến VPGD & Kho Lĩnh Nam"
                className="hover:text-[#00478D] hover:underline inline-flex items-center gap-1"
              >
                <span>VPGD & Kho: <strong>11/68/467 Lĩnh Nam, HN</strong></span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </span>
          </div>

          {/* Right: Direct Contacts Fully Visible With Quick Copy */}
          <div className="flex items-center gap-3 shrink-0 font-medium text-[11px]">
            {/* Hotline */}
            <div className="flex items-center gap-1 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-0.5"></span>
              <span className="font-bold text-slate-900">Hotline:</span>
              <a href={`tel:${COMPANY_INFO.hotlineRaw}`} className="text-[#00478D] font-bold hover:underline font-mono">
                {COMPANY_INFO.hotline}
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(COMPANY_INFO.hotlineRaw, 'top_hotline', e)}
                title="Sao chép số Hotline"
                className="p-1 rounded-xs hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {copiedKey === 'top_hotline' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <span className="text-slate-300">|</span>

            {/* Sales Ms Hien */}
            <div className="flex items-center gap-1 text-slate-700">
              <span className="font-bold text-slate-900">Kinh doanh:</span>
              <a href={COMPANY_INFO.salesTeam[0].zaloUrl} target="_blank" rel="noreferrer" className="text-[#00478D] font-bold hover:underline">
                {COMPANY_INFO.salesTeam[0].name} ({COMPANY_INFO.salesTeam[0].phone})
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(COMPANY_INFO.salesTeam[0].rawPhone, 'top_hien', e)}
                title="Sao chép số Ms. Hiền"
                className="p-1 rounded-xs hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {copiedKey === 'top_hien' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
              
              <span className="text-slate-300 mx-1">•</span>

              {/* Sales Ms Phuong */}
              <a href={COMPANY_INFO.salesTeam[1].zaloUrl} target="_blank" rel="noreferrer" className="text-[#00478D] font-bold hover:underline">
                {COMPANY_INFO.salesTeam[1].name} ({COMPANY_INFO.salesTeam[1].phone})
              </a>
              <button
                type="button"
                onClick={(e) => handleCopy(COMPANY_INFO.salesTeam[1].rawPhone, 'top_phuong', e)}
                title="Sao chép số Ms. Phương"
                className="p-1 rounded-xs hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                {copiedKey === 'top_phuong' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4 sm:gap-8">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-8 shrink-0">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            >
              <img 
                src={`${import.meta.env.BASE_URL}logos/TTV_LOGO_Color_Master.svg`} 
                alt="T&T VINA INDUSTRIAL CO., LTD" 
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
              <div className="hidden sm:block">
                <div className="flex items-center">
                  <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] uppercase">
                    T&T VINA
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  INDUSTRIAL CO., LTD
                </p>
              </div>
            </button>

            {/* Desktop Category Menu Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#00478D] hover:bg-slate-50 rounded-sm border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
              >
                <span>Danh Mục Thiết Bị</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {isCategoryOpen && (
                <div 
                  onMouseLeave={() => setIsCategoryOpen(false)}
                  className="absolute top-full left-0 mt-1.5 w-[460px] bg-white rounded-sm shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-1.5 border-b border-slate-100 mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Danh Mục Thiết Bị Công Nghiệp &amp; Tự Động Hóa
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                      100% Chính Hãng
                    </span>
                  </div>

                  <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-50 px-1">
                    {SOLUTIONS.map((sol) => (
                      <button
                        key={sol.id}
                        onClick={() => {
                          onNavigate('home', sol.id);
                          setIsCategoryOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById('product-catalog');
                            if (el) {
                              const yOffset = -75;
                              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }, 60);
                        }}
                        className={`w-full px-3 py-2.5 text-left rounded-xs flex items-center justify-between group transition-all cursor-pointer ${
                          sol.id === 'murrplastik'
                            ? 'bg-red-50/40 hover:bg-red-50 border border-red-100/80 my-1 shadow-2xs'
                            : 'hover:bg-blue-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {sol.id === 'murrplastik' ? (
                            <div className="w-11 h-9 rounded-xs bg-white border border-red-200 p-1 flex items-center justify-center shadow-2xs shrink-0">
                              <img 
                                src={`${import.meta.env.BASE_URL}logos/logo_murrplastik.png`} 
                                alt="Murrplastik Germany" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-xs bg-slate-100 group-hover:bg-[#00478D] group-hover:text-white text-slate-600 flex items-center justify-center transition-colors shrink-0">
                              {sol.id === 'thiet-bi-han' && <Zap className="w-4 h-4 text-amber-500 group-hover:text-white" />}
                              {sol.id === 'may-bat-vit-nha-vit' && <Wrench className="w-4 h-4 text-blue-600 group-hover:text-white" />}
                              {sol.id === 'dung-cu-bom-keo' && <PackageCheck className="w-4 h-4 text-emerald-600 group-hover:text-white" />}
                              {sol.id === 'may-cat-bang-dinh-tu-dong' && <Cpu className="w-4 h-4 text-purple-600 group-hover:text-white" />}
                              {sol.id === 'thiet-bi-kiem-tra' && <ShieldCheck className="w-4 h-4 text-cyan-600 group-hover:text-white" />}
                              {sol.id === 'camera-kinh-soi-cong-nghiep' && <Search className="w-4 h-4 text-indigo-600 group-hover:text-white" />}
                              {sol.id === 'dung-cu-chong-tinh-dien' && <Zap className="w-4 h-4 text-yellow-600 group-hover:text-white" />}
                              {sol.id === 'thiet-bi-dong-goi-tu-dong' && <PackageCheck className="w-4 h-4 text-slate-600 group-hover:text-white" />}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate transition-colors ${
                              sol.id === 'murrplastik'
                                ? 'text-[#E30613] font-display'
                                : 'text-slate-800 group-hover:text-[#00478D]'
                            }`}>
                              {sol.title}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                              <span>{sol.tag}</span>
                              {sol.badge && (
                                <span className={`text-[9px] font-bold px-1 rounded-xs uppercase tracking-tight ${
                                  sol.id === 'murrplastik'
                                    ? 'bg-red-100 text-[#E30613]'
                                    : 'bg-slate-200/70 text-slate-700'
                                }`}>
                                  {sol.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <ArrowRight className={`w-4 h-4 shrink-0 transition-all ${
                          sol.id === 'murrplastik'
                            ? 'text-[#E30613] group-hover:translate-x-1'
                            : 'text-slate-300 group-hover:text-[#00478D] group-hover:translate-x-1'
                        }`} />
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 px-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Hỗ trợ chọn mã kỹ thuật:</span>
                    <a href={`tel:${COMPANY_INFO.hotlineRaw}`} className="text-[#00478D] font-bold hover:underline font-mono">
                      Hotline: {COMPANY_INFO.hotline}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. FAST SEARCH AUTOCOMPLETE WITH REAL PRODUCTS */}
          <div ref={searchRef} className="relative flex-1 max-w-md lg:max-w-lg xl:max-w-xl hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Tìm mã máy, linh kiện: Hakko 936, Hios CL-4000, SP-982, Zcut 9, KEG-ZL..."
                className="w-full h-11 pl-11 pr-12 rounded-sm bg-slate-50/90 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#00478D] focus:ring-2 focus:ring-[#00478D]/10 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded-xs hover:bg-slate-200 transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Live Autocomplete Results Dropdown (Swiss Precision Card Layout) */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[calc(100vw-32px)] sm:w-[520px] md:w-[580px] lg:w-[640px] max-w-[92vw] bg-white rounded-sm shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Kết quả tìm kiếm phù hợp ({searchResults.length})</span>
                  <span className="text-[10px] text-[#00478D] font-semibold">Bấm để xem thông số chi tiết</span>
                </div>

                <div className="divide-y divide-slate-100/80">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleProductClick(item)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50/50 flex items-center justify-between gap-3 group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-13 h-13 object-contain rounded-xs border border-slate-200 bg-white shrink-0 p-1 group-hover:border-[#00478D]/40 transition-colors"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00478D] transition-colors truncate">
                            {item.name}
                          </div>
                          
                          {/* Structured Pill Badges (Never wrap brokenly) */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-xs font-semibold whitespace-nowrap">
                              Mã: {item.sku}
                            </span>
                            <span className="bg-blue-50 text-[#00478D] font-bold px-2 py-0.5 rounded-xs whitespace-nowrap">
                              {item.brand}
                            </span>
                            <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-xs whitespace-nowrap">
                              {item.category}
                            </span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-xs whitespace-nowrap">
                              {item.stockStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#00478D] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. ACTIONS & QUOTE BASKET */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Quick RFQ Basket Button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative flex items-center gap-2 h-11 px-4 rounded-sm border transition-all cursor-pointer ${
                currentTab === 'cart'
                  ? 'bg-[#00478D] text-white border-[#00478D] shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-xs'
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
                Giỏ Báo Giá
              </span>
            </button>

            {/* Direct RFQ Project Consultation CTA */}
            <a
              href={`tel:${COMPANY_INFO.hotlines[0]}`}
              className="h-11 px-4 sm:px-5 rounded-sm bg-gradient-to-r from-[#00478D] to-[#005EB8] hover:from-[#003B75] hover:to-[#004E9A] text-white font-display font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Hotline: {COMPANY_INFO.hotlines[0]}</span>
              <span className="md:hidden">Gọi Ngay</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-sm text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* 5. MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Nhập tên máy, mã SKU: Hakko, Hios, Zcut..."
              className="w-full h-12 pl-10 pr-10 rounded-sm bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#00478D] font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live Mobile Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="bg-slate-50 rounded-sm border border-slate-200 divide-y divide-slate-200/70 max-h-64 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-500 bg-slate-100">
                Tìm thấy {searchResults.length} sản phẩm
              </div>
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="w-full p-2.5 text-left hover:bg-white flex items-center gap-3 transition-colors"
                >
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-white rounded-xs border border-slate-200 p-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                      <span className="font-mono text-slate-500">Mã: {item.sku}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[#00478D] font-semibold">{item.brand}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-1 pt-2">
            <button
              onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors ${
                currentTab === 'home' ? 'bg-blue-50 text-[#00478D]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Trang Chủ
            </button>

            <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Danh Mục Sản Phẩm
            </div>
            {SOLUTIONS.map((sol) => (
              <button
                key={sol.id}
                onClick={() => {
                  onNavigate('home', sol.id);
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById('product-catalog');
                    if (el) {
                      const yOffset = -75;
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 60);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-sm text-xs font-semibold hover:bg-slate-50 flex items-center justify-between transition-colors ${
                  sol.id === 'murrplastik' ? 'bg-red-50/50 text-[#E30613] font-bold border border-red-100' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {sol.id === 'murrplastik' && (
                    <img 
                      src={`${import.meta.env.BASE_URL}logos/logo_murrplastik.png`} 
                      alt="Murrplastik" 
                      className="h-4 w-auto object-contain shrink-0" 
                    />
                  )}
                  <span className="truncate">{sol.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-1.5">{sol.tag}</span>
              </button>
            ))}

            <button
              onClick={() => { onNavigate('cart'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors ${
                currentTab === 'cart' ? 'bg-blue-50 text-[#00478D]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Giỏ Yêu Cầu Báo Giá ({cartCount})
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-1.5 text-center text-xs text-slate-600">
            <div>Hotline: <strong className="text-[#00478D] font-mono">{COMPANY_INFO.hotline}</strong></div>
            <div>Kinh doanh: <strong>{COMPANY_INFO.salesTeam.map(s => `${s.name} (${s.phone})`).join(' - ')}</strong></div>
            <div>KD Murrplastik: <strong>{COMPANY_INFO.murrSalesTeam.map(s => `${s.name} (${s.phone})`).join(' - ')}</strong></div>
            <div>Phòng Dự Án: <strong>{COMPANY_INFO.projectDept.name} ({COMPANY_INFO.projectDept.phone})</strong></div>
            <div>Email: <strong>{COMPANY_INFO.email}</strong></div>
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  Zap,
  Cpu,
  Wrench,
  Package,
  PackageCheck,
  Copy,
  Check,
  ExternalLink,
  Cable,
  Flame,
  Pipette,
  Scissors,
  Gauge,
  Microscope
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, SOLUTIONS, COMPANY_INFO } from '../data';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedSolution } from '../i18n/solutionsTranslations';
import { loadCatalogIndex, searchCatalog } from '../utils/catalogLoader';
import { SearchMaintenanceModal } from './SearchMaintenanceModal';

interface HeaderProps {
  currentTab: string;
  cartCount: number;
  onNavigate: (tab: string, filter?: string, search?: string) => void;
  onSelectProduct: (product: Product) => void;
  isCatalogMaintenance?: boolean;
}

// 1. Phím tắt từ khóa tìm kiếm nhanh phổ biến
const POPULAR_SEARCH_TAGS = [
  { label: 'R-Tec Liner (MP-1081)', query: 'MP-1081', isHero: true },
  { label: 'Quick 205 ESD', query: 'Quick 205' },
  { label: 'Hakko 936', query: 'Hakko 936' },
  { label: 'HIOS CL-4000', query: 'CL-4000' },
  { label: 'Zcut-9', query: 'Zcut-9' },
  { label: 'Quạt ion SL-001', query: 'SL-001' },
  { label: 'Bể hàn CM-808', query: 'CM-808' },
  { label: 'Bơm keo SP-982', query: 'SP-982' },
  { label: 'Đo lực HP-10', query: 'HP-10' },
  { label: 'Murrplastik', query: 'Murrplastik' }
];

// 2. Phím tắt ngành hàng tra cứu nhanh (9 nhóm ngành B2B chính hãng chuẩn xác 100%)
const QUICK_CATEGORIES = [
  { id: 'murrplastik', name: 'Xích Cáp & Bó Cáp Robot', tag: 'Murrplastik Đức', icon: Cable },
  { id: 'thiet-bi-han', name: 'Thiết Bị Hàn & Bể Thiếc', tag: 'Hakko • Quick', icon: Flame },
  { id: 'may-bat-vit-nha-vit', name: 'Máy Bắt Vít & Siết Lực', tag: 'HIOS Nhật Bản', icon: Wrench },
  { id: 'dung-cu-bom-keo', name: 'Robot & Máy Bơm Keo', tag: 'Tra keo SP-982', icon: Pipette },
  { id: 'may-cat-bang-dinh-tu-dong', name: 'Máy Cắt Băng Dính & Tem', tag: 'Zcut • RT-7000', icon: Scissors },
  { id: 'thiet-bi-kiem-tra', name: 'Thiết Bị Đo Lực Siết', tag: 'Máy đo lực HP-10', icon: Gauge },
  { id: 'camera-kinh-soi-cong-nghiep', name: 'Kính Soi & Kính Hiển Vi', tag: 'Kính hiển vi SMT', icon: Microscope },
  { id: 'dung-cu-chong-tinh-dien', name: 'Phòng Sạch & Khử ESD', tag: 'Quạt ion SL-001', icon: ShieldCheck },
  { id: 'thiet-bi-dong-goi-tu-dong', name: 'Máy Đóng Gói Tự Động', tag: 'Dán thùng carton', icon: Package }
];

// 3. Ảnh sản phẩm thật đại diện cho từng danh mục ngành hàng
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'murrplastik': 'https://protools.com.vn/images/stores/2025/10/15/0-image%20(19).jpg', // R-Tec Liner Murrplastik Đức
  'thiet-bi-han': 'https://protools.com.vn/images/stores/2019/10/07/0-hakko%20936.jpg', // Trạm hàn Hakko 936
  'may-bat-vit-nha-vit': 'https://protools.com.vn/images/stores/2019/10/07/0-CL-4000.jpg', // Tô vít điện tử Hios CL-4000
  'dung-cu-bom-keo': 'https://protools.com.vn/images/stores/2021/09/25/Robot%20b%C6%A1m%20keo%20t%E1%BB%B1%20%C4%91%E1%BB%99ng.jpg', // Robot bơm keo tự động
  'may-cat-bang-dinh-tu-dong': 'https://protools.com.vn/images/stores/2019/10/05/Zcut%209.jpg', // Máy cắt băng dính Zcut 9
  'thiet-bi-kiem-tra': 'https://protools.com.vn/images/stores/2019/10/05/HP-10.png', // Máy đo lực siết HP-10
  'camera-kinh-soi-cong-nghiep': 'https://protools.com.vn/images/stores/2017/12/14/0-stereo-microscope-sm-3t-144-hd2%20(1).jpg', // Kính hiển vi SM-3TPZ
  'dung-cu-chong-tinh-dien': 'https://protools.com.vn/images/stores/2019/10/09/SL-001.jpg', // Quạt thổi Ion SL-001
  'thiet-bi-dong-goi-tu-dong': 'https://protools.com.vn/images/stores/2021/09/25/0-m%C3%A1y%20%C4%91%C3%B3ng%20th%C3%B9ng%204%20c%E1%BA%A1nh.jpg', // Máy đóng thùng carton tự động
  'thiet-bi-tu-dong-hoa': 'https://protools.com.vn/images/stores/2019/10/12/0-R4T-16P-S.jpg' // Relay Samwon R4T-16P-S
};

export default function Header({ currentTab, cartCount, onNavigate, onSelectProduct, isCatalogMaintenance = false }: HeaderProps) {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchMaintenanceOpen, setIsSearchMaintenanceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const toolboxRef = useRef<HTMLDivElement>(null);

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

  // Pre-warm the 7,500+ SKU catalog index on header mount for instant multi-field search
  useEffect(() => {
    loadCatalogIndex().catch(() => {});
  }, []);

  // Instant SKU, Model & Product Autocomplete search across all 7,500+ products
  const { results: searchResults, totalMatches } = useMemo(() => {
    return searchCatalog(searchQuery, 8);
  }, [searchQuery]);

  // 4 thiết bị tiêu biểu công nghệ & sẵn kho phục vụ gợi ý tức thì
  const featuredSuggestions = useMemo(() => {
    const getProd = (id: string, fallbackSku: string) => {
      return PRODUCTS.find(p => p.id === id || p.sku === fallbackSku) || PRODUCTS[0];
    };
    return [
      {
        product: getProd('1081', 'MP-1081'),
        tag: 'Tiêu Điểm Robot',
        highlight: 'Robot Body Shop Ô Tô',
        badgeColor: 'bg-red-50 text-[#E30613] border-red-200'
      },
      {
        product: getProd('QUICK-205', 'TTPC-0289'),
        tag: 'Trạm Hàn Cao Tần',
        highlight: '150W Eddy Current SMT',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
      },
      {
        product: getProd('1041', 'PVN5224'),
        tag: 'Tô Vít Siết Lực',
        highlight: 'Chính xác cao Nhật Bản',
        badgeColor: 'bg-blue-50 text-[#00478D] border-blue-200'
      },
      {
        product: getProd('1048', 'PVN1561'),
        tag: 'Khử Tĩnh Điện ESD',
        highlight: 'Phòng sạch & SMT',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }
    ];
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (toolboxRef.current && !toolboxRef.current.contains(event.target as Node)) {
        setIsToolboxOpen(false);
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
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
      return;
    }
    if (e.key === 'Enter') {
      if (searchResults.length === 1) {
        handleProductClick(searchResults[0]);
      } else if (searchQuery.trim() !== '') {
        setIsSearchFocused(false);
        onNavigate('home', undefined, searchQuery);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(0,31,63,0.05)] transition-all">
      {/* 1. TOP UTILITY BAR WITH 100% REAL COMPANY DATA (STRICT ALL-VISIBLE SINGLE LINE) */}
      <div className="bg-slate-50 border-b border-slate-200/60 text-xs text-slate-600 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4 whitespace-nowrap">
          
          {/* Left: Headquarters Location & VPGD */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Building2 className="w-3.5 h-3.5 text-[#00478D] shrink-0" />
              <span>{t('header.hq_label')}: <strong>{t('header.hq_val')}</strong> • </span>
              <a 
                href={COMPANY_INFO.mapUrlLinhNam} 
                target="_blank" 
                rel="noreferrer" 
                title="Mở Google Maps chỉ đường đến VPGD & Kho Lĩnh Nam"
                className="hover:text-[#00478D] hover:underline inline-flex items-center gap-1"
              >
                <span>{t('header.wh_label')}: <strong>{t('header.wh_val')}</strong></span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </span>
            <span className="text-slate-300">|</span>
            <a
              href="/murrplastik/"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100/90 border border-red-200/90 font-bold tracking-tight transition-all shadow-2xs group"
              title="Truy cập Chuyên Trang Ủy Quyền Murrplastik (CHLB Đức)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse"></span>
              <span>{t('nav.murr_portal')}</span>
              <ExternalLink className="w-2.5 h-2.5 text-red-700 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Right: Direct Contacts Fully Visible With Quick Copy */}
          <div className="flex items-center gap-3 shrink-0 font-medium text-xs">
            {/* Hotline */}
            <div className="flex items-center gap-1 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-0.5"></span>
              <span className="font-bold text-slate-900">{t('nav.hotline')}:</span>
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
              <span className="font-bold text-slate-900">{t('nav.sales')}:</span>
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
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo & Navigation Menu Links */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0">
            {/* Logo T&T VINA (Chỉ giữ lại Logo SVG tinh gọn) */}
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0"
              title="Trang chủ T&T Vina (Protools.com.vn)"
            >
              <img 
                src={`${import.meta.env.BASE_URL}logos/TTV_LOGO_Color_Master.svg`} 
                alt="T&T VINA" 
                width="168"
                height="44"
                className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </button>

            {/* Desktop Category Menu Dropdown with Hover Bridge */}
            <div 
              className="relative hidden lg:block"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#00478D] hover:bg-slate-50 rounded-sm border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
              >
                <span>{t('nav.categories')}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 pt-1.5 w-[460px] z-50">
                  {/* Invisible hover bridge to eliminate gap */}
                  <div className="absolute -top-3 inset-x-0 h-3" />
                  <div className="bg-white rounded-sm shadow-2xl border border-slate-200 py-3 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-1.5 border-b border-slate-100 mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {t('nav.dropdown_title')}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                        {t('nav.genuine_badge')}
                      </span>
                    </div>

                    <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-50 px-1">
                      {SOLUTIONS.map((sol) => {
                        const lSol = getLocalizedSolution(sol, locale);
                        const isMurr = sol.id === 'murrplastik';
                        const productImage = CATEGORY_IMAGE_MAP[sol.id] || 'https://protools.com.vn/images/stores/2025/10/15/0-image%20(19).jpg';

                        return (
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
                            className="w-full px-3 py-2.5 text-left rounded-xs flex items-center justify-between group transition-all cursor-pointer hover:bg-blue-50/70"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Ảnh hàng thật đại diện (Không dùng icon) */}
                              <div className="w-10 h-10 rounded-xs bg-slate-50 border border-slate-200/90 p-0.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#00478D]/40 group-hover:bg-white transition-all overflow-hidden">
                                <img 
                                  src={productImage} 
                                  alt={isMurr ? 'MURRPLASTIK (quản lý cáp)' : lSol.title} 
                                  className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                {/* Tên danh mục */}
                                <div className="text-xs font-bold truncate text-slate-800 group-hover:text-[#00478D] transition-colors">
                                  {isMurr ? 'MURRPLASTIK (quản lý cáp)' : lSol.title}
                                </div>

                                {/* Dòng mô tả / nhãn bên dưới */}
                                <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                  {isMurr ? (
                                    <span className="font-mono font-bold text-xs text-slate-500 uppercase tracking-wider">
                                      MADE IN GERMANY
                                    </span>
                                  ) : (
                                    <>
                                      <span>{lSol.tag || sol.tag}</span>
                                      {lSol.badge && (
                                        <span className="text-xs font-bold px-1 rounded-xs uppercase tracking-tight bg-slate-200/70 text-slate-700">
                                          {lSol.badge}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#00478D] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 px-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{t('nav.tech_support_hint')}</span>
                      <a href={`tel:${COMPANY_INFO.hotlineRaw}`} className="text-[#00478D] font-bold hover:underline font-mono">
                        Hotline: {COMPANY_INFO.hotline}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Digital Toolbox Menu with Unbreakable Hover Bridge */}
            <div 
              ref={toolboxRef} 
              className="relative hidden md:block"
              onMouseEnter={() => setIsToolboxOpen(true)}
              onMouseLeave={() => setIsToolboxOpen(false)}
            >
              <button
                onClick={() => {
                  onNavigate('robot-dresspack');
                  setIsToolboxOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-sm border transition-all cursor-pointer ${
                  currentTab === 'robot-dresspack'
                    ? 'bg-red-50 text-[#C8102E] border-red-200 font-bold'
                    : 'text-slate-700 hover:text-[#00478D] hover:bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}
              >
                <span>{t('nav.digital_toolbox', 'Digital Toolbox')}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isToolboxOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Digital Toolbox Dropdown */}
              {isToolboxOpen && (
                <div className="absolute top-full left-0 pt-1.5 w-[320px] z-50">
                  {/* Invisible hover bridge to eliminate gap */}
                  <div className="absolute -top-3 inset-x-0 h-3" />
                  <div className="bg-white rounded-sm shadow-2xl border border-slate-200 p-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-2.5 py-1 border-b border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 mb-1.5">
                      <span className="font-bold uppercase tracking-wider text-slate-700">{t('nav.digital_toolbox', 'DIGITAL TOOLBOX')}</span>
                      <span className="text-xs text-red-600 font-semibold bg-red-50 px-1.5 py-0.2 rounded-xs">Murrplastik</span>
                    </div>

                    <div className="space-y-1">
                      {/* Tool: Robot Dresspack */}
                      <button
                        onClick={() => {
                          onNavigate('robot-dresspack');
                          setIsToolboxOpen(false);
                        }}
                        className="w-full p-2.5 rounded-xs hover:bg-red-50 text-left transition-all group cursor-pointer border border-transparent hover:border-red-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#C8102E]">
                            {t('nav.toolbox_dresspack_title', 'Cấu hình Robot dresspack & bó cáp')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C8102E] group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {t('nav.toolbox_dresspack_desc', 'Mô phỏng cánh tay robot & tính fill factor bó cáp')}
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. EXPANDABLE SEARCH BAR (COMPACT BY DEFAULT, SMOOTHLY EXPANDS ON FOCUS/TYPING) */}
          <div 
            ref={searchRef} 
            className={`relative transition-all duration-300 ease-out hidden sm:block ${
              isSearchFocused
                ? 'w-72 sm:w-96 lg:w-[480px] z-50 shadow-lg ring-2 ring-[#00478D]/20 rounded-sm'
                : 'w-36 sm:w-48 lg:w-56'
            }`}
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  if (isCatalogMaintenance) {
                    setIsSearchMaintenanceOpen(true);
                    return;
                  }
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  if (isCatalogMaintenance) {
                    setIsSearchMaintenanceOpen(true);
                    return;
                  }
                  setIsSearchFocused(true);
                  loadCatalogIndex().catch(() => {});
                }}
                onClick={() => {
                  if (isCatalogMaintenance) {
                    setIsSearchMaintenanceOpen(true);
                  }
                }}
                placeholder={isCatalogMaintenance ? "Tìm thiết bị, SKU... (Đang bảo trì)" : (isSearchFocused ? t('nav.search_placeholder') : "Tìm thiết bị, SKU...")}
                className="w-full h-10 pl-9 pr-9 rounded-sm bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#00478D] transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 px-1 py-0.5 rounded-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 1. Quick Discovery Hub (When search is focused but query is empty) */}
            {isSearchFocused && searchQuery.trim() === '' && (
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[calc(100vw-32px)] sm:w-[540px] md:w-[620px] lg:w-[680px] max-w-[92vw] bg-white rounded-sm shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-[82vh] overflow-y-auto">
                
                {/* Header Bar */}
                <div className="px-4 sm:px-5 pb-2.5 border-b border-slate-100 flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Gợi Ý Tìm Kiếm & Thiết Bị Tiêu Biểu
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Bấm để lọc tức thì • Esc để đóng</span>
                </div>

                {/* Khối 1: Từ khóa tìm kiếm phổ biến */}
                <div className="px-4 sm:px-5 py-3 border-b border-slate-100/80 bg-slate-50/50">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Từ Khóa Tra Cứu Phổ Biến
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag.query}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchQuery(tag.query);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                          tag.isHero
                            ? 'bg-red-50 text-[#E30613] border-red-200 hover:bg-red-100 font-bold shadow-2xs'
                            : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-[#00478D] border-slate-200/90 hover:border-[#00478D]/30 shadow-2xs'
                        }`}
                      >
                        {tag.isHero && <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] animate-pulse" />}
                        <span>{tag.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Khối 2: Hàng tiêu biểu sẵn kho */}
                <div className="px-4 sm:px-5 py-3 border-b border-slate-100/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Thiết Bị Tiêu Biểu Sẵn Kho
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                      Sẵn Kho • Giao 24h
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {featuredSuggestions.map((item) => (
                      <button
                        key={item.product.id || item.product.sku}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleProductClick(item.product)}
                        className="p-2.5 rounded-xs border border-slate-200/80 hover:border-[#00478D]/40 bg-white hover:bg-blue-50/40 text-left transition-all group flex items-start gap-3 cursor-pointer shadow-2xs"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-contain rounded-xs border border-slate-200 bg-white p-0.5 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#00478D] transition-colors line-clamp-2 leading-snug min-h-[2rem]">
                            {item.product.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs mt-1">
                            <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-xs font-semibold">
                              {item.product.sku}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-medium truncate">
                              {item.product.brand}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">
                            {item.highlight}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Khối 3: Ngành hàng tra cứu nhanh (3 cột rộng rãi, layout ngang, icon chuẩn xác 100%) */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50/30">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Ngành Hàng Tra Cứu Nhanh
                    </span>
                    <span className="text-xs font-mono text-slate-400">9 Nhóm Ngành B2B</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {QUICK_CATEGORIES.map((cat) => {
                      const IconComp = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setIsSearchFocused(false);
                            onNavigate('home', cat.id);
                            setTimeout(() => {
                              const el = document.getElementById('product-catalog');
                              if (el) {
                                const yOffset = -75;
                                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }, 60);
                          }}
                          className="p-2 sm:p-2.5 rounded-xs border border-slate-200/80 bg-white hover:bg-blue-50/60 hover:border-[#00478D]/30 transition-all group flex items-center gap-2.5 text-left cursor-pointer shadow-2xs"
                        >
                          <div className="w-8 h-8 rounded-xs bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 group-hover:text-[#00478D] group-hover:bg-blue-100/60 transition-colors">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-800 group-hover:text-[#00478D] transition-colors truncate">
                              {cat.name}
                            </div>
                            <div className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                              {cat.tag}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-4 sm:px-5 pt-2.5 pb-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/80">
                  <span>
                    Hotline: <a href={`tel:${COMPANY_INFO.hotlineRaw}`} className="font-bold text-[#00478D] font-mono hover:underline">{COMPANY_INFO.hotline}</a>
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setIsSearchFocused(false);
                      onNavigate('home', 'all');
                      setTimeout(() => {
                        const el = document.getElementById('product-catalog');
                        if (el) {
                          const yOffset = -75;
                          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 60);
                    }}
                    className="text-xs font-bold text-[#00478D] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Xem toàn kho 7.500 SKU</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            )}

            {/* 2. Live Autocomplete Results Dropdown (Swiss Precision Card Layout) */}
            {isSearchFocused && searchQuery.trim() !== '' && searchResults.length > 0 && (
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[calc(100vw-32px)] sm:w-[520px] md:w-[580px] lg:w-[640px] max-w-[92vw] bg-white rounded-sm shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Kết quả ({searchResults.length} / {totalMatches} SKU)</span>
                  <span className="text-xs text-[#00478D] font-semibold">Bấm để xem thông số chi tiết</span>
                </div>

                <div className="divide-y divide-slate-100/80">
                  {searchResults.map((item) => (
                    <button
                      key={item.id || item.sku}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
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
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-xs font-semibold whitespace-nowrap">
                              Mã: {item.sku}
                            </span>
                            <span className="bg-blue-50 text-[#00478D] font-bold px-2 py-0.5 rounded-xs whitespace-nowrap">
                              {item.brand || 'T&T Vina'}
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

                {totalMatches > searchResults.length && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setIsSearchFocused(false);
                        onNavigate('home', undefined, searchQuery);
                      }}
                      className="text-xs font-bold text-[#00478D] hover:underline cursor-pointer"
                    >
                      Xem tất cả {totalMatches} sản phẩm trong tổng kho &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Empty search feedback */}
            {isSearchFocused && searchQuery.trim() !== '' && searchResults.length === 0 && (
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[calc(100vw-32px)] sm:w-[480px] bg-white rounded-sm shadow-2xl border border-slate-200 p-4 z-50 text-center">
                <p className="text-xs text-slate-600 font-medium">
                  Không tìm thấy thiết bị nào khớp với từ khóa &ldquo;<strong className="text-slate-900">{searchQuery}</strong>&rdquo;.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Vui lòng thử tìm theo mã SKU, tên hãng (Murrplastik, Hakko, HIOS...) hoặc liên hệ Hotline: <strong className="text-[#00478D]">{COMPANY_INFO.hotline}</strong>
                </p>
              </div>
            )}
          </div>

          {/* 4. ACTIONS & QUOTE BASKET */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick RFQ Basket Button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative flex items-center justify-center h-10 px-2.5 sm:px-3 rounded-sm border transition-all cursor-pointer ${
                currentTab === 'cart'
                  ? 'bg-[#00478D] text-white border-[#00478D] shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs'
              }`}
              title={t('nav.cart')}
            >
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-slate-700 group-hover:text-[#00478D]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-4.5 h-4.5 px-1 rounded-full bg-[#D97706] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden xl:inline-block ml-1.5">
                {t('nav.cart')}
              </span>
            </button>

            {/* Language Switcher in Main Nav (Desktop & Tablet: >= sm) */}
            <div className="hidden sm:inline-block">
              <LanguageSwitcher variant="header" />
            </div>

            {/* Mobile Language Switcher quick toggle (< sm) */}
            <div className="sm:hidden">
              <LanguageSwitcher variant="utility" />
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-sm text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
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
              onChange={(e) => {
                if (isCatalogMaintenance) {
                  setIsSearchMaintenanceOpen(true);
                  return;
                }
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => {
                if (isCatalogMaintenance) {
                  setIsSearchMaintenanceOpen(true);
                }
              }}
              onClick={() => {
                if (isCatalogMaintenance) {
                  setIsSearchMaintenanceOpen(true);
                }
              }}
              placeholder={isCatalogMaintenance ? "Tìm thiết bị, SKU... (Đang bảo trì)" : t('nav.search_placeholder_mobile')}
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

          {/* Quick suggestions when search is empty in mobile menu */}
          {!searchQuery && (
            <div className="space-y-2 pt-1 pb-1">
              <div className="text-xs font-bold uppercase text-slate-500">
                <span>Từ Khóa Gợi Ý Nhanh</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_TAGS.slice(0, 7).map((tag) => (
                  <button
                    key={tag.query}
                    type="button"
                    onClick={() => setSearchQuery(tag.query)}
                    className={`text-xs px-2.5 py-1 rounded-xs border font-medium cursor-pointer transition-colors ${
                      tag.isHero
                        ? 'bg-red-50 text-[#E30613] border-red-200 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {tag.isHero && <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] inline-block mr-1" />}
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Mobile Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="bg-slate-50 rounded-sm border border-slate-200 divide-y divide-slate-200/70 max-h-64 overflow-y-auto">
              <div className="px-3 py-1.5 text-xs font-bold uppercase text-slate-500 bg-slate-100">
                {t('catalog.found')} {searchResults.length} {t('catalog.matching_items')}
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
                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
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
              {t('nav.home')}
            </button>

            {/* Robot Dresspack Configurator Link on Mobile */}
            <button
              onClick={() => { onNavigate('robot-dresspack'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors flex items-center justify-between ${
                currentTab === 'robot-dresspack' ? 'bg-red-50 text-[#C8102E]' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{t('nav.toolbox_dresspack_title', 'Cấu hình Robot dresspack & bó cáp')}</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Featured Murrplastik Subsite Card on Mobile */}
            <div className="p-3 rounded-sm bg-gradient-to-br from-red-50 via-white to-red-50/40 border border-red-200/90 shadow-2xs space-y-2 my-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E30613] animate-pulse" />
                  <span className="text-xs font-bold text-[#E30613] uppercase tracking-wide font-display">
                    {t('nav.murr_portal')}
                  </span>
                </div>
                <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 rounded-xs bg-red-100 text-[#E30613]">
                  {t('nav.authorized')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {t('nav.murr_mobile_desc')}
              </p>
              <a
                href="/murrplastik/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-9 rounded-xs bg-[#E30613] hover:bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>{t('nav.portal_btn')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="px-3 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t('nav.categories')}
            </div>
            {SOLUTIONS.map((sol) => {
              const lSol = getLocalizedSolution(sol, locale);
              return (
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
                    <span className="truncate">{lSol.title}</span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 ml-1.5">{lSol.tag || sol.tag}</span>
                </button>
              );
            })}

            <button
              onClick={() => { onNavigate('cart'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-3 rounded-sm text-sm font-bold tracking-wide uppercase transition-colors ${
                currentTab === 'cart' ? 'bg-blue-50 text-[#00478D]' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t('nav.cart')} ({cartCount})
            </button>

            {/* Mobile Language Switcher Section */}
            <div className="pt-3 border-t border-slate-200">
              <LanguageSwitcher variant="mobile" />
            </div>
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

      {/* Search Maintenance Notice Modal */}
      <SearchMaintenanceModal 
        isOpen={isSearchMaintenanceOpen} 
        onClose={() => setIsSearchMaintenanceOpen(false)} 
      />
    </header>
  );
}

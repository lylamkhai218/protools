import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  PhoneCall, 
  ShoppingCart, 
  Package, 
  Sparkles, 
  X, 
  Eye, 
  ChevronDown,
  Tag,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';
import { getSalesRepForProduct, PRODUCTS, COMPANY_INFO } from '../data';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedProduct, CATEGORY_TRANSLATIONS } from '../i18n/productTranslations';
import { loadCatalogIndex } from '../utils/catalogLoader';

interface VirtualCatalogGridProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  initialCategory?: string;
  initialSearch?: string;
  initialBrand?: string;
}

// Category normalization and alias mapper to guarantee zero empty-results on footer/URL navigation
const normalizeCategorySlug = (slug: string): string => {
  if (!slug || slug === 'all') return 'all';
  const s = slug.toLowerCase();
  if (s === 'camera-kinh-soi' || s.includes('camera') || s.includes('kinh-soi') || s.includes('kinh-hien-vi')) {
    return 'camera-kinh-soi-cong-nghiep';
  }
  if (s === 'esd-phong-sach' || s === 'esd' || s.includes('chong-tinh-dien')) {
    return 'dung-cu-chong-tinh-dien';
  }
  if (s === 'may-cat-bang-dinh-tem-nhan' || s.includes('cat-bang-dinh')) {
    return 'may-cat-bang-dinh-tu-dong';
  }
  return slug;
};

export const VirtualCatalogGrid: React.FC<VirtualCatalogGridProps> = ({
  onSelectProduct,
  onAddToCart,
  initialCategory = 'all',
  initialSearch = '',
  initialBrand = 'all'
}) => {
  const { t, locale } = useTranslation();
  const [catalogItems, setCatalogItems] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(normalizeCategorySlug(initialCategory));
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || 'all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Sync initialCategory with alias normalization
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(normalizeCategorySlug(initialCategory));
    }
  }, [initialCategory]);

  // Sync initialSearch if passed from Header
  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchTerm(initialSearch);
      if (initialSearch.trim() !== '') {
        setSelectedCategory('all');
      }
    }
  }, [initialSearch]);

  // Sync initialBrand if passed
  useEffect(() => {
    if (initialBrand && initialBrand !== 'all') {
      setSelectedBrand(initialBrand);
    }
  }, [initialBrand]);

  // Load shared 7,500+ SKU index
  useEffect(() => {
    let isMounted = true;
    loadCatalogIndex().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setCatalogItems(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      console.warn('Could not load catalog index:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute Categories with Count
  const categoriesList = useMemo(() => {
    const catMap: Record<string, { name: string; count: number; slug: string }> = {};
    for (const item of catalogItems) {
      const slug = item.categorySlug || 'linh-kien-thiet-bi';
      const name = item.category || 'Linh kiện & Thiết bị';
      if (!catMap[slug]) {
        catMap[slug] = { name, count: 0, slug };
      }
      catMap[slug].count++;
    }
    return Object.values(catMap).sort((a, b) => b.count - a.count);
  }, [catalogItems]);

  // Compute Brands with Count
  const brandsList = useMemo(() => {
    const brandMap: Record<string, { name: string; count: number }> = {};
    for (const item of catalogItems) {
      const b = (item.brand || '').trim();
      if (!b) continue;
      const key = b.toLowerCase();
      if (!brandMap[key]) {
        brandMap[key] = { name: b, count: 0 };
      }
      brandMap[key].count++;
    }
    return Object.values(brandMap).sort((a, b) => b.count - a.count);
  }, [catalogItems]);

  // Fast In-Memory Filtering with Robust Category & Brand Facets
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    
    return catalogItems.filter(item => {
      // 1. Search filter
      if (q) {
        const cleanQ = q.replace(/[-_.\s]/g, '');
        const cleanSku = (item.sku || '').toLowerCase().replace(/[-_.\s]/g, '');
        const matchSku = item.sku.toLowerCase().includes(q) || (cleanQ.length >= 2 && cleanSku.includes(cleanQ));
        const matchName = item.name.toLowerCase().includes(q);
        const matchBrand = (item.brand || '').toLowerCase().includes(q);
        const matchCategory = (item.category || '').toLowerCase().includes(q);
        const matchTags = (item.tags || '').toLowerCase().includes(q);
        if (!matchSku && !matchName && !matchBrand && !matchCategory && !matchTags) {
          return false;
        }
      }

      // 2. Category filter with alias normalization
      if (selectedCategory !== 'all') {
        const normSelected = normalizeCategorySlug(selectedCategory);
        const normItemCat = normalizeCategorySlug(item.categorySlug || '');
        if (
          normItemCat !== normSelected &&
          item.categorySlug !== selectedCategory &&
          item.category !== selectedCategory &&
          !item.categorySlug?.includes(selectedCategory) &&
          !selectedCategory.includes(item.categorySlug || '___')
        ) {
          return false;
        }
      }

      // 3. Brand facet filter
      if (selectedBrand !== 'all') {
        const itemBrand = (item.brand || '').trim().toLowerCase();
        if (itemBrand !== selectedBrand.trim().toLowerCase()) {
          return false;
        }
      }

      // 4. In-stock filter
      if (onlyInStock) {
        if ((item.stock || 0) <= 0 && item.stockStatus !== 'In Stock') {
          return false;
        }
      }

      // 5. Sales rep filter
      if (selectedRep !== 'all') {
        const rep = getSalesRepForProduct(item);
        if (!rep.name.toLowerCase().includes(selectedRep.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [catalogItems, searchTerm, selectedCategory, selectedBrand, onlyInStock, selectedRep]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(36);
  }, [searchTerm, selectedCategory, selectedBrand, onlyInStock, selectedRep]);

  // Paginated Window
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const inStockTotal = useMemo(() => {
    return catalogItems.filter(p => (p.stock || 0) > 0 || p.stockStatus === 'In Stock').length;
  }, [catalogItems]);

  const handleLoadMore = () => {
    startTransition(() => {
      setVisibleCount(prev => Math.min(prev + 36, filteredProducts.length));
    });
  };

  const numLocale = locale === 'vi' ? 'vi-VN' : 'en-US';

  return (
    <section id="product-catalog" className="py-12 sm:py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00478D] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('catalog.warehouse_badge', 'TỔNG KHO THIẾT BỊ CÔNG NGHIỆP B2B')}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <span>{t('catalog.section_title', 'Danh Mục Thiết Bị')}</span>
              <span className="text-sm sm:text-base font-mono font-bold text-[#00478D] bg-blue-50 px-2.5 py-0.5 rounded-xs border border-blue-200">
                {catalogItems.length.toLocaleString(numLocale)} SKU
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {t('catalog.section_desc', 'Tra cứu nhanh chóng thông số kỹ thuật, tình trạng sẵn kho và số điện thoại phụ trách báo giá của từng thiết bị.')}
            </p>
          </div>

          {/* View Mode & Sẵn Kho Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sẵn kho toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`h-9 px-3 rounded-xs text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                onlyInStock 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span>{t('catalog.in_stock_toggle', 'Sẵn kho')} ({inStockTotal.toLocaleString(numLocale)})</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xs bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                title={t('catalog.view_grid', 'Chế độ xem dạng lưới')}
                className={`p-1.5 rounded-xs transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#00478D] shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title={t('catalog.view_table', 'Chế độ xem dạng bảng danh sách')}
                className={`p-1.5 rounded-xs transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white text-[#00478D] shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-slate-50 p-3 sm:p-4 rounded-sm border border-slate-200 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('catalog.search_placeholder', 'Tìm nhanh theo mã SKU, tên thiết bị, quy cách ren/phi, nhãn hiệu...')}
                className="w-full h-10 pl-9 pr-9 bg-white border border-slate-200 rounded-xs text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00478D] focus:ring-1 focus:ring-[#00478D]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sales Rep Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap hidden lg:inline">
                {t('catalog.sales_rep_label', 'Phụ trách:')}
              </span>
              <select
                value={selectedRep}
                onChange={(e) => setSelectedRep(e.target.value)}
                className="h-10 px-3 bg-white border border-slate-200 rounded-xs text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#00478D] cursor-pointer"
              >
                <option value="all">{t('catalog.all_reps', 'Tất cả NVKD / Hotline')}</option>
                <option value="Phương">Ms. Phương (0365.366.455)</option>
                <option value="Hiền">Ms. Hiền (0929.938.368)</option>
                <option value="Nhinh">Ms. Nhinh (0964.920.025)</option>
                <option value="Phong">Mr. Phong - KT (0983.794.782)</option>
                <option value="Hai">Mr. Hai - KT (0981.919.590)</option>
                <option value="Thanh">Mr. Thanh - DA (0943.301.886)</option>
                <option value="Murrplastik">Mr. Bình - Murr (0868.822.409)</option>
                <option value="Nhung">Mrs. Nhung - Hotline (0915.168.824)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs whitespace-nowrap scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#00478D] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t('catalog.tab_all', 'Tất cả')} ({catalogItems.length.toLocaleString(numLocale)})
            </button>
            {categoriesList.slice(0, 10).map(cat => {
              const tabName = (cat.slug && CATEGORY_TRANSLATIONS[cat.slug]?.[locale]) || cat.name;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#00478D] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tabName} ({cat.count.toLocaleString(numLocale)})
                </button>
              );
            })}
          </div>

          {/* Brand Facet Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2.5 text-xs whitespace-nowrap scrollbar-thin border-t border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pr-1 shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#00478D]" />
              <span>{locale === 'vi' ? 'Thương hiệu:' : 'Brand:'}</span>
            </span>
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-2.5 py-1 rounded-xs text-[11px] font-bold transition-all cursor-pointer ${
                selectedBrand === 'all'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {locale === 'vi' ? 'Tất cả hãng' : 'All Brands'}
            </button>
            {brandsList.slice(0, 12).map(b => (
              <button
                key={b.name}
                onClick={() => setSelectedBrand(b.name)}
                className={`px-2.5 py-1 rounded-xs text-[11px] font-bold transition-all cursor-pointer ${
                  selectedBrand.toLowerCase() === b.name.toLowerCase()
                    ? 'bg-[#00478D] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {b.name} <span className="opacity-75 text-[10px]">({b.count.toLocaleString(numLocale)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS SUMMARY BAR */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <div>
            {t('catalog.found', 'Tìm thấy')} <strong className="text-slate-900">{filteredProducts.length.toLocaleString(numLocale)}</strong> {t('catalog.matching_items', 'thiết bị phù hợp')}
            {selectedBrand !== 'all' && <span> {locale === 'vi' ? 'thuộc hãng' : 'of brand'} <strong className="text-[#00478D]">{selectedBrand}</strong></span>}
            {searchTerm && <span> {t('catalog.for_keyword', 'cho từ khóa')} &ldquo;<span className="text-[#00478D]">{searchTerm}</span>&rdquo;</span>}
          </div>
          <div>
            {t('catalog.showing', 'Hiển thị')} <strong className="text-slate-900">{visibleProducts.length}</strong> / {filteredProducts.length.toLocaleString(numLocale)}
          </div>
        </div>

        {/* 1. GRID VIEW MODE */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {visibleProducts.map((p) => {
              const lp = getLocalizedProduct(p, locale);
              const rep = getSalesRepForProduct(p);
              const inStock = (p.stock || 0) > 0 || p.stockStatus === 'In Stock';
              const catName = (p.categorySlug && CATEGORY_TRANSLATIONS[p.categorySlug]?.[locale]) || p.category;

              return (
                <div 
                  key={p.id || p.sku}
                  className="rounded-xs bg-white border border-slate-200 hover:border-[#00478D] shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Top Bar: SKU & Brand */}
                    <div className="p-2.5 pb-0 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-500 font-bold truncate max-w-[60%]">{p.sku}</span>
                      <span className="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-xs shrink-0 truncate max-w-[38%]">
                        {p.brand || 'T&T Vina'}
                      </span>
                    </div>

                    {/* Image Box */}
                    <div 
                      onClick={() => onSelectProduct(p)}
                      className="h-36 sm:h-44 m-2 rounded-xs bg-slate-50/80 p-2.5 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50/20 transition-colors cursor-pointer overflow-hidden relative"
                    >
                      {p.image ? (
                        <>
                          <Package className="w-10 h-10 text-slate-300 absolute inset-0 m-auto pointer-events-none opacity-40" />
                          <img 
                            src={p.image} 
                            alt={lp.name}
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="max-h-full max-w-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300 relative z-1"
                          />
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-2 text-slate-400">
                          <Package className="w-8 h-8 sm:w-9 sm:h-9 text-slate-300 mb-1" />
                          <span className="text-[10px] font-semibold text-slate-400">
                            {t('catalog.updating_image', 'Đang cập nhật ảnh')}
                          </span>
                        </div>
                      )}
                      {/* Badge z-index fixed with z-10 and pointer-events-none so image never covers it */}
                      <div className="absolute top-1.5 right-1.5 z-10 pointer-events-none">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-2xs ${
                          inStock 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {inStock 
                            ? `${t('catalog.in_stock_badge', 'Sẵn hàng')} (${p.stock})` 
                            : t('catalog.project_order', 'Đặt dự án')}
                        </span>
                      </div>
                    </div>

                    {/* Product Name & Category */}
                    <div className="px-3 py-1">
                      <span className="text-[10px] text-[#00478D] font-mono font-semibold block truncate">
                        {catName}
                      </span>
                      <h3 
                        onClick={() => onSelectProduct(p)}
                        className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#00478D] transition-colors line-clamp-2 leading-snug cursor-pointer mt-0.5 min-h-[2.5rem]"
                        title={lp.name}
                      >
                        {lp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Bottom: Sales Rep & Action CTA */}
                  <div className="p-3 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-2">
                    {/* Assigned Sales Rep Badge */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 truncate">{t('catalog.sales_rep_label', 'Phụ trách:')}</span>
                      <a 
                        href={`tel:${rep.rawPhone}`} 
                        className="font-bold text-slate-800 hover:text-[#00478D] flex items-center gap-1 shrink-0"
                        title={`Gọi ${rep.name}: ${rep.phone}`}
                      >
                        <PhoneCall className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{rep.name}</span>
                      </a>
                    </div>

                    {/* 2 Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="h-8 px-2 rounded-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-display text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{t('catalog.btn_detail', 'Chi tiết')}</span>
                      </button>
                      <button
                        onClick={() => onAddToCart(p, 1)}
                        className="h-8 px-2 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-display text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <ShoppingCart className="w-3 h-3 text-amber-300" />
                        <span>{t('catalog.btn_rfq', '+ Báo Giá')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. TABLE VIEW MODE (Fast Procurement List) */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xs border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase font-bold tracking-wider">
                  <th className="p-3 pl-4 w-12 text-center">{t('catalog.table_no', 'STT')}</th>
                  <th className="p-3 w-32">{t('catalog.table_sku', 'Mã SKU')}</th>
                  <th className="p-3 min-w-[260px]">{t('catalog.table_name', 'Tên Thiết Bị / Linh Kiện')}</th>
                  <th className="p-3 w-44">{t('catalog.table_category', 'Nhóm Ngành Hàng')}</th>
                  <th className="p-3 w-28 text-center">{t('catalog.table_status', 'Tình Trạng')}</th>
                  <th className="p-3 w-40">{t('catalog.table_rep', 'Phụ Trách Báo Giá')}</th>
                  <th className="p-3 pr-4 w-36 text-right">{t('catalog.table_actions', 'Thao Tác')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
                {visibleProducts.map((p, idx) => {
                  const lp = getLocalizedProduct(p, locale);
                  const rep = getSalesRepForProduct(p);
                  const inStock = (p.stock || 0) > 0 || p.stockStatus === 'In Stock';
                  const catName = (p.categorySlug && CATEGORY_TRANSLATIONS[p.categorySlug]?.[locale]) || p.category;

                  return (
                    <tr 
                      key={p.id || p.sku}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="p-3 pl-4 text-center font-mono text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-[#00478D]">
                        <span 
                          onClick={() => onSelectProduct(p)}
                          className="hover:underline cursor-pointer"
                        >
                          {p.sku}
                        </span>
                      </td>
                      <td className="p-3">
                        <span 
                          onClick={() => onSelectProduct(p)}
                          className="font-semibold text-slate-900 hover:text-[#00478D] cursor-pointer line-clamp-1"
                        >
                          {lp.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {p.brand || 'T&T Vina'} · {p.unit || 'cái'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 truncate max-w-[180px]">{catName}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                          inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {inStock 
                            ? `${t('catalog.in_stock_badge', 'Sẵn')} (${p.stock})` 
                            : t('catalog.project_order', 'Đặt hàng')}
                        </span>
                      </td>
                      <td className="p-3">
                        <a 
                          href={`tel:${rep.rawPhone}`} 
                          className="text-slate-800 hover:text-[#00478D] flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{rep.name}</span>
                        </a>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProduct(p)}
                            title={t('catalog.btn_detail', 'Xem chi tiết')}
                            className="p-1.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAddToCart(p, 1)}
                            className="px-2.5 py-1 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-bold text-[10px] uppercase transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingCart className="w-3 h-3 text-amber-300" />
                            <span>{t('catalog.btn_rfq', 'Báo Giá')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE FEEDBACK */}
        {filteredProducts.length === 0 && (
          <div className="py-16 px-4 bg-slate-50/70 border border-slate-200 rounded-sm text-center max-w-2xl mx-auto space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900 uppercase">
                {t('catalog.empty_title', 'Không tìm thấy thiết bị phù hợp')}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t('catalog.empty_desc', 'Không có sản phẩm nào khớp với các tiêu chí lọc hiện tại. Quý khách vui lòng thử tìm từ khóa khác hoặc đặt lại bộ lọc.')}
              </p>
            </div>

            {/* Active filters badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              {searchTerm && (
                <span className="px-2.5 py-1 rounded-xs bg-white border border-slate-200 text-slate-700">
                  Từ khóa: <strong>&ldquo;{searchTerm}&rdquo;</strong>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="px-2.5 py-1 rounded-xs bg-white border border-slate-200 text-slate-700">
                  Hãng: <strong>{selectedBrand}</strong>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 rounded-xs bg-white border border-slate-200 text-slate-700">
                  Danh mục: <strong>{selectedCategory}</strong>
                </span>
              )}
              {onlyInStock && (
                <span className="px-2.5 py-1 rounded-xs bg-emerald-50 border border-emerald-200 text-emerald-700">
                  Chỉ hàng sẵn kho
                </span>
              )}
              {selectedRep !== 'all' && (
                <span className="px-2.5 py-1 rounded-xs bg-white border border-slate-200 text-slate-700">
                  NVKD: <strong>{selectedRep}</strong>
                </span>
              )}
            </div>

            {/* Reset Button */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand('all');
                  setSelectedCategory('all');
                  setOnlyInStock(false);
                  setSelectedRep('all');
                }}
                className="h-10 px-5 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-display text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{locale === 'vi' ? 'Đặt Lại Tất Cả Bộ Lọc' : 'Reset All Filters'}</span>
              </button>
              <a
                href={`tel:${COMPANY_INFO.hotlineRaw}`}
                className="h-10 px-5 rounded-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-display text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gọi Hotline {COMPANY_INFO.hotline}</span>
              </a>
            </div>
          </div>
        )}

        {/* LOAD MORE BUTTON / PAGINATION */}
        {visibleProducts.length < filteredProducts.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="h-11 px-8 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>{t('catalog.btn_load_more', 'Xem Thêm Sản Phẩm')}</span>
              <ChevronDown className="w-4 h-4 text-amber-300" />
            </button>
            <p className="text-xs text-slate-500 mt-2.5 font-medium">
              {t('catalog.showing_progress', 'Đang hiển thị')} {visibleProducts.length.toLocaleString(numLocale)} {t('catalog.of_total', '/')} {filteredProducts.length.toLocaleString(numLocale)} {t('catalog.products_unit', 'sản phẩm')}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

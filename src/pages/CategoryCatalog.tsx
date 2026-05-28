import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ShoppingCart, SlidersHorizontal, Trash2, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Product } from '../types';

interface CategoryCatalogProps {
  categoryKey: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string) => void;
}

export default function CategoryCatalog({
  categoryKey,
  products,
  onAddToCart,
  onSelectProduct,
  onNavigate,
}: CategoryCatalogProps) {
  const { currentLang, t } = useLanguage();
  const isVi = currentLang.code === 'VI';

  // State for interactive B2B filtering
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [stockOnly, setStockOnly] = useState<boolean>(true); // DEFAULT checked on "Còn hàng" as per user screenshot!
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translate Category details
  const categoryDetails = useMemo(() => {
    switch (categoryKey) {
      case 'robot':
        return {
          title: isVi ? 'ROBOT & TỰ ĐỘNG HÓA' : 'ROBOT & AUTOMATION',
          path: isVi ? 'Robot & Tự động hóa' : 'Robot & Automation',
          solutions: [
            { id: 'cobot', label: isVi ? 'Cánh tay Robot (Cobot)' : 'Collaborative Arm (Cobot)' },
            { id: 'screw', label: isVi ? 'Hệ thống cấp vít tự động' : 'Automatic Screw System' },
            { id: 'welding', label: isVi ? 'Robot hàn tích hợp' : 'Integrated Welding Robot' }
          ]
        };
      case 'han':
        return {
          title: isVi ? 'HÀN & KHỬ TĨNH ĐIỆN' : 'SOLDERING & STATIC CONTROL',
          path: isVi ? 'Hàn & Khử tĩnh điện' : 'Soldering & ESD Static',
          solutions: [
            { id: 'station', label: isVi ? 'Trạm hàn cao cấp SMT' : 'SMT Soldering Station' },
            { id: 'esd', label: isVi ? 'Thiết bị khử tĩnh điện ESD' : 'ESD Ionizing Devices' },
            { id: 'smoke', label: isVi ? 'Máy hút khói lọc khí' : 'Fume Extractor Systems' }
          ]
        };
      case 'keo':
        return {
          title: isVi ? 'KEO & VẬT TƯ TIÊU HAO' : 'ADHESIVE & CONSUMABLES',
          path: isVi ? 'Keo & Vật tư tiêu hao' : 'Adhesive & Factory Consumables',
          solutions: [
            { id: 'uv', label: isVi ? 'Keo dán linh kiện UV' : 'UV Optical Bondings' },
            { id: 'instant', label: isVi ? 'Keo đa năng nhanh khô' : 'Instant Cyanocrylates' },
            { id: 'grease', label: isVi ? 'Mỡ bôi trơn tiếp điểm' : 'Thermal Bond Greases' }
          ]
        };
      case 'van-vit':
        return {
          title: isVi ? 'DỤNG CỤ VẶN VÍT' : 'SCREW FASTENING SYSTEMS',
          path: isVi ? 'Dụng cụ vặn vít' : 'Precision Electric Fasteners',
          solutions: [
            { id: 'electric', label: isVi ? 'Tô vít điện lực siết' : 'Electric Torque Screwdrivers' },
            { id: 'smart', label: isVi ? 'Máy quản lý lực Smart' : 'Smart Calibration Units' },
            { id: 'pneumatic', label: isVi ? 'Đầu súng xiết ốc cơ' : 'Pneumatic Nutrunners' }
          ]
        };
      default:
        return {
          title: isVi ? 'DANH MỤC SẢN PHẨM' : 'PRODUCT DIRECTORY',
          path: isVi ? 'Sản phẩm' : 'Products',
          solutions: []
        };
    }
  }, [categoryKey, isVi]);

  // Brands extracted from matching category products
  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category === categoryKey);
  }, [products, categoryKey]);

  const brands = useMemo(() => {
    const list = categoryProducts.map(p => p.brand);
    // Unique list of brands, ensuring standard matches represent
    const unique = Array.from(new Set(list));
    if (unique.length === 0) {
      return ['Hakko', 'Quick', 'Sudong', 'HIOS'];
    }
    return unique;
  }, [categoryProducts]);

  // Filter products matching selected criteria
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(p => {
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Stock status filter
      if (stockOnly && p.status !== 'In Stock') {
        return false;
      }
      // Solution sub-category simulation mapping
      if (selectedSolutions.length > 0) {
        // Mock solution identification for high fidelity criteria
        const hasMatch = selectedSolutions.some(sol => {
          if (sol === 'cobot' && p.id.includes('hu-200')) return true;
          if (sol === 'screw' && p.id.includes('sv-series')) return true;
          if (sol === 'welding' && p.id.includes('9800')) return true;
          if (sol === 'station' && p.id.includes('fx-888d')) return true;
          if (sol === 'esd' && p.id.includes('wxsmart')) return true; // Weller premium
          if (sol === 'uv' && p.id.includes('loctite')) return true;
          if (p.id.includes(sol)) return true;
          return false;
        });
        if (!hasMatch) return false;
      }
      return true;
    });
  }, [categoryProducts, selectedBrands, selectedSolutions, stockOnly]);

  // Sorting logics
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sortBy === 'newest') {
      return arr.reverse(); // simulate newer additions
    } else if (sortBy === 'price-low') {
      return arr; // price mock logic
    } else if (sortBy === 'price-high') {
      return arr;
    }
    return arr;
  }, [filteredProducts, sortBy]);

  // Reset page to 1 when filters or categories change
  useEffect(() => {
    setPage(1);
  }, [categoryKey, selectedBrands, selectedSolutions, stockOnly]);

  const ITEMS_PER_PAGE = 6;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  }, [sortedProducts]);

  const safePage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedProducts, safePage]);

  // Brand click helper
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  // Solution click helper
  const handleSolutionToggle = (solId: string) => {
    setSelectedSolutions(prev => 
      prev.includes(solId) 
        ? prev.filter(s => s !== solId) 
        : [...prev, solId]
    );
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedSolutions([]);
    setStockOnly(false);
  };

  // Safe and smooth page change handler with offset scrolling
  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
    const element = document.getElementById('products-catalog');
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Safe add with visual notification toast
  const triggerAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation(); // preserve navigate trigger
    onAddToCart(product);
    setToastMessage(isVi ? `Đã thêm ${product.name} vào giỏ hàng báo giá!` : `Added ${product.name} to quotation cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex-1 bg-[#f9f9ff] py-6 relative">
      
      {/* Toast notice trigger */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#001530] text-white border border-[#e8a020] px-4 py-3 rounded shadow-lg flex items-center gap-2.5 animate-fade-in font-sans font-bold text-xs">
          <div className="h-2 w-2 rounded-full bg-[#e8a020] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs Path Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium select-none mb-4">
          <span className="hover:text-primary cursor-pointer" onClick={() => onNavigate('home')}>
            Home
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-[#00478d] font-bold">
            {categoryDetails.path}
          </span>
        </nav>

        {/* Large Page Heading */}
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#001530] tracking-tight uppercase leading-none mb-8">
          {categoryDetails.title}
        </h1>

        {/* Content Columns Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 1. Sidebar with filters (left) */}
          <div className="lg:col-span-1 bg-white border border-zinc-200 p-5 rounded-xs space-y-6 select-none shadow-xs">
            
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <SlidersHorizontal className="h-4 w-4 text-zinc-700" />
              <h3 className="font-display text-sm font-black tracking-wider text-zinc-850 uppercase">
                {isVi ? 'BỘ LỌC TÌM KIẾM' : 'SEARCH FILTERS'}
              </h3>
            </div>

            {/* Sub-group: Thương hiệu */}
            <div className="space-y-3">
              <h4 className="font-display text-xs font-black tracking-wider text-zinc-950 uppercase">
                {isVi ? 'Thương hiệu' : 'Brand'}
              </h4>
              <div className="space-y-2">
                {brands.map(brand => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer group text-xs font-medium text-zinc-700">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(brand)}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 rounded-xs border transition-all flex items-center justify-center ${
                          isChecked ? 'bg-[#00478d] border-[#00478d]' : 'bg-zinc-50 border-zinc-300 group-hover:border-zinc-400'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 text-white stroke-[3.5]" />}
                        </div>
                      </div>
                      <span className="transition-colors group-hover:text-zinc-955">{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sub-group: Giải pháp */}
            {categoryDetails.solutions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-display text-xs font-black tracking-wider text-zinc-950 uppercase">
                  {isVi ? 'Giải pháp' : 'Solutions'}
                </h4>
                <div className="space-y-2">
                  {categoryDetails.solutions.map(sol => {
                    const isChecked = selectedSolutions.includes(sol.id);
                    return (
                      <label key={sol.id} className="flex items-center gap-2.5 cursor-pointer group text-xs font-medium text-zinc-700">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSolutionToggle(sol.id)}
                            className="sr-only"
                          />
                          <div className={`h-4 w-4 rounded-xs border transition-all flex items-center justify-center ${
                            isChecked ? 'bg-[#00478d] border-[#00478d]' : 'bg-zinc-50 border-zinc-300 group-hover:border-zinc-400'
                          }`}>
                            {isChecked && <Check className="h-3 w-3 text-white stroke-[3.5]" />}
                          </div>
                        </div>
                        <span className="transition-colors group-hover:text-zinc-955">{sol.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-group: Trạng thái kho */}
            <div className="space-y-3">
              <h4 className="font-display text-xs font-black tracking-wider text-zinc-950 uppercase">
                {isVi ? 'Trạng thái kho' : 'Stock status'}
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer group text-xs font-medium text-zinc-700">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={stockOnly}
                      onChange={() => setStockOnly(!stockOnly)}
                      className="sr-sr-only hidden"
                    />
                    <div className={`h-4 w-4 rounded-xs border transition-all flex items-center justify-center ${
                      stockOnly ? 'bg-[#00478d] border-[#00478d]' : 'bg-zinc-50 border-zinc-300 group-hover:border-zinc-400'
                    }`}>
                      {stockOnly && <Check className="h-3 w-3 text-white stroke-[3.5]" />}
                    </div>
                  </div>
                  <span>{isVi ? 'Còn hàng' : 'In stock'}</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group text-xs font-medium text-zinc-400">
                  <div className="h-4 w-4 rounded-xs border bg-zinc-100 border-zinc-200 flex items-center justify-center">
                    {/* Visual greyed option for order status mock */}
                  </div>
                  <span>{isVi ? 'Đặt hàng trước' : 'Available for pre-order'}</span>
                </label>
              </div>
            </div>

            {/* Clear filters trigger */}
            <button
              onClick={handleClearFilters}
              disabled={selectedBrands.length === 0 && selectedSolutions.length === 0 && !stockOnly}
              className="w-full flex items-center justify-center gap-2 bg-[#4a5568] hover:bg-slate-700 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xs font-display text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Trash2 className="h-3.5 w-3.5 text-current" />
              <span>{isVi ? 'Xóa bộ lọc' : 'Clear filters'}</span>
            </button>

          </div>

          {/* 2. Products grid columns panel (right) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top sorting & status panel row bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-zinc-200 px-4 py-3 rounded-xs gap-3">
              <span className="text-xs text-zinc-600 font-medium">
                {isVi 
                  ? `Hiển thị ${paginatedProducts.length} trong số ${sortedProducts.length} sản phẩm` 
                  : `Showing ${paginatedProducts.length} of ${sortedProducts.length} manufacturing models`}
                <span className="text-zinc-400 ml-1.5 font-light">
                  ({isVi ? `Trang ${safePage}/${totalPages}` : `Page ${safePage}/${totalPages}`})
                </span>
              </span>

              {/* Sort selector dropdown */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
                <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                  {isVi ? 'Sắp xếp theo:' : 'Sort by:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded text-xs px-2 py-1.5 font-semibold text-zinc-800 focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="newest">{isVi ? 'Mới nhất' : 'Newest'}</option>
                  <option value="price-low">{isVi ? 'Giá: Thấp đến Cao' : 'Price: Low to High'}</option>
                  <option value="price-high">{isVi ? 'Giá: Cao đến Thấp' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>

            {/* Empty Catalog Fallback state */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-zinc-200 text-center py-20 px-4 rounded-xs text-zinc-500">
                <span className="block font-display text-lg font-bold text-zinc-800 mb-2 uppercase">
                  {isVi ? 'KHÔNG TÌM THẤY SẢN PHẨM KHỚP BỘ LỌC' : 'NO SPECS MATCHING SELECTED FILTERS'}
                </span>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  {isVi 
                    ? 'Bạn hãy thử xóa các điều kiện tìm kiếm hoặc liên hệ Hotline để được hỗ trợ báo giá các dòng ngoài danh sách.' 
                    : 'Please try resetting search options or contact our live sales engineers for customizable industrial setups.'}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 px-6 py-2.5 bg-[#00478d] hover:bg-primary text-white font-display text-xs font-bold uppercase tracking-widest rounded-xs transition-all"
                >
                  {isVi ? 'Thiết lập lại bộ lọc' : 'Reset Category Listing'}
                </button>
              </div>
            ) : (
              
              /* Standard Product Cards Grid list */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="bg-white border border-zinc-200 hover:border-[#00478d] group cursor-pointer transition-all flex flex-col justify-between selection:bg-transparent rounded-xs overflow-hidden hover:shadow-md h-[430px]"
                  >
                    
                    {/* Header Image box & stock indicators */}
                    <div className="relative bg-zinc-50 h-52 w-full flex items-center justify-center p-3 overflow-hidden border-b border-zinc-100 shrink-0">
                      
                      {/* Exact Green Pill status from second mockup photo */}
                      <span className="absolute top-3 left-3 bg-[#e8fbf3] text-[#1aa053] font-sans font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full border border-[#bbf7db] z-10 flex items-center gap-1.5 shadow-xs select-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1aa053] inline-block animate-pulse" />
                        <span>{isVi ? 'Còn hàng' : 'In Stock'}</span>
                      </span>

                      {/* Brand Label overlays */}
                      <span className="absolute top-3 right-3 bg-zinc-950/85 text-white font-display text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-xs select-none shadow">
                        {p.brand}
                      </span>

                      <img
                        referrerPolicy="no-referrer"
                        src={p.image}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Meta info & specifications labels */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        {/* SKU specifications code */}
                        <span className="font-mono text-[10.5px] font-extrabold text-zinc-400 tracking-wider">
                          SKU: {p.sku}
                        </span>

                        {/* Title of the machinery item */}
                        <h4 className="font-sans text-sm font-bold text-zinc-900 line-clamp-2 md:h-[40px] group-hover:text-primary transition-colors leading-snug">
                          {p.name}
                        </h4>
                      </div>

                      {/* Decisive orange button from mockup for Fast Quote basket additions */}
                      <div className="pt-3">
                        <button
                          type="button"
                          onClick={(e) => triggerAddToCart(p, e)}
                          className="w-full flex items-center justify-center gap-2 bg-[#e8a020] hover:bg-amber-500 text-zinc-950 font-display text-[11px] font-extrabold uppercase tracking-widest py-3 rounded-xs shadow-xs transition-all active:scale-[0.98] select-none"
                        >
                          <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                          <span>{t('addToQuoteList')}</span>
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Realistic stylized B2B catalog pagination controls block */}
            {sortedProducts.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 pt-6 select-none font-sans">
                
                {/* Previous page */}
                <button 
                  onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="h-8 w-8 rounded border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-500 bg-white hover:bg-zinc-50 hover:text-zinc-805 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  &lt;
                </button>

                {/* Main pages list */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === safePage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 rounded flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'text-white bg-[#00478d]'
                          : 'border border-zinc-200 text-zinc-650 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next page */}
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                  disabled={safePage === totalPages}
                  className="h-8 w-8 rounded border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-500 bg-white hover:bg-zinc-50 hover:text-zinc-805 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  &gt;
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

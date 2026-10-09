import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { Search, Copy, Check, CheckSquare, Square, Package, X, ZoomIn, ExternalLink } from 'lucide-react';

interface InternalProduct extends Product {
  isExcluded?: boolean;
}

interface InternalReviewHubProps {
  onBackToHome?: () => void;
  onPreviewMaintenance?: () => void;
  onExitInternal?: () => void;
}

export const InternalReviewHub: React.FC<InternalReviewHubProps> = () => {
  const [products, setProducts] = useState<InternalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'excluded'>('all');
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  const [copiedSku, setCopiedSku] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState<boolean>(false);
  const [zoomedProduct, setZoomedProduct] = useState<InternalProduct | null>(null);

  useEffect(() => {
    fetch('/data/catalog_index_full.json')
      .then(res => res.json())
      .then((data: InternalProduct[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Could not load full catalog, fallback to regular:', err);
        fetch('/data/catalog_index.json')
          .then(r => r.json())
          .then(d => {
            setProducts(d);
            setLoading(false);
          });
      });
  }, []);

  // Compute Categories with Count
  const categoriesList = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) {
      const c = (p.category || 'Khác').trim();
      map[c] = (map[c] || 0) + 1;
    }
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Fast In-Memory Filtering (Status + Category + Search Query)
  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Status Filter
    if (filterStatus === 'active') {
      result = result.filter(p => !p.isExcluded);
    } else if (filterStatus === 'excluded') {
      result = result.filter(p => p.isExcluded);
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => (p.category || 'Khác').trim() === selectedCategory);
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/[\s\-_]/g, '');
      result = result.filter(p => {
        const skuNorm = (p.sku || '').toLowerCase().replace(/[\s\-_]/g, '');
        const matchSku = (p.sku || '').toLowerCase().includes(q) || (cleanQ.length >= 2 && skuNorm.includes(cleanQ));
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        return matchSku || matchName || matchBrand || matchCat;
      });
    }

    return result;
  }, [products, filterStatus, selectedCategory, searchQuery]);

  const toggleSelectSku = (sku: string) => {
    setSelectedSkus(prev => {
      const next = new Set(prev);
      if (next.has(sku)) {
        next.delete(sku);
      } else {
        next.add(sku);
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    const next = new Set(selectedSkus);
    filteredProducts.forEach(p => {
      if (p.sku) next.add(p.sku);
    });
    setSelectedSkus(next);
  };

  const clearSelection = () => {
    setSelectedSkus(new Set());
  };

  const copySingleSku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const copyBatchSelected = () => {
    const list = Array.from(selectedSkus).join(', ');
    navigator.clipboard.writeText(list);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2500);
  };

  const totalExcludedCount = useMemo(() => {
    return products.filter(p => p.isExcluded).length;
  }, [products]);

  const totalActiveCount = useMemo(() => {
    return products.filter(p => !p.isExcluded).length;
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-28">
      {/* 1. Clean Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="font-display font-black text-sm sm:text-base tracking-wide text-white">
                CỔNG NỘI BỘ KIỂM DUYỆT 7.500 SKU
              </div>
              <div className="text-[11px] text-slate-400">
                Tổng: <strong className="text-white">{products.length.toLocaleString('vi-VN')}</strong> SKU · Đang còn trên web: <strong className="text-emerald-400">{totalActiveCount.toLocaleString('vi-VN')}</strong> · Đã gỡ: <strong className="text-rose-400">{totalExcludedCount.toLocaleString('vi-VN')}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3 py-1.5 rounded-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Quay lại Trang Chủ Công Khai của khách hàng"
            >
              <span>Về Trang Chủ Công Khai</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm theo Mã SKU, Tên sản phẩm, Hãng hoặc Ngành hàng..."
                className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-xs text-xs focus:outline-none focus:border-[#00478D] focus:ring-1 focus:ring-[#00478D]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown Selector */}
            <div className="relative shrink-0 w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xs text-xs bg-white text-slate-800 font-medium focus:outline-none focus:border-[#00478D] focus:ring-1 focus:ring-[#00478D] cursor-pointer"
              >
                <option value="all">Tất cả ngành hàng ({products.length})</option>
                {categoriesList.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xs text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'all'
                    ? 'bg-[#00478D] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 rounded-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'active'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đang còn trên Web ({totalActiveCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('excluded')}
                className={`px-3 py-1 rounded-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  filterStatus === 'excluded'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã gỡ trước đó ({totalExcludedCount})
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <div>
              Hiển thị: <strong>{filteredProducts.length.toLocaleString('vi-VN')}</strong> kết quả
              {selectedCategory !== 'all' && (
                <span className="ml-2 text-slate-600 font-semibold">
                  · Ngành: <span className="text-[#00478D]">{selectedCategory}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={selectAllFiltered}
                className="text-[#00478D] hover:underline font-semibold cursor-pointer"
              >
                Chọn tất cả trang này
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Bỏ chọn ({selectedSkus.size})
              </button>
            </div>
          </div>
        </div>

        {/* Product Review Data Table */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              <div className="w-8 h-8 border-3 border-[#00478D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Đang tải danh mục 7.500 sản phẩm gốc...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <Package className="w-8 h-8 text-slate-300 mx-auto" />
              <div>Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</div>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[680px] scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider z-10">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <span className="sr-only">Chọn</span>
                    </th>
                    <th className="p-3 w-20 text-center">Ảnh</th>
                    <th className="p-3 w-32">Mã SKU</th>
                    <th className="p-3">Tên sản phẩm</th>
                    <th className="p-3 w-48">Ngành hàng</th>
                    <th className="p-3 w-36">Thương hiệu</th>
                    <th className="p-3 w-28 text-center">Trạng thái</th>
                    <th className="p-3 w-24 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredProducts.map((p, idx) => {
                    const isSelected = selectedSkus.has(p.sku);
                    const isCopied = copiedSku === p.sku;
                    const imgUrl = p.image ? (p.image.startsWith('http://') ? p.image.replace('http://', 'https://') : p.image) : '';

                    return (
                      <tr
                        key={p.sku || idx}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          isSelected ? 'bg-blue-50/80' : p.isExcluded ? 'bg-slate-50/60 opacity-60' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectSku(p.sku)}
                            className="cursor-pointer text-slate-400 hover:text-blue-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#00478D]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Product Image Thumbnail - Click to Zoom */}
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => setZoomedProduct(p)}
                            className="w-16 h-16 rounded-sm bg-white border border-slate-200 p-1 flex items-center justify-center mx-auto overflow-hidden shadow-2xs relative group cursor-zoom-in hover:border-[#00478D] hover:shadow-xs transition-all"
                            title="Bấm để phóng to ảnh xem chi tiết"
                          >
                            {imgUrl ? (
                              <>
                                <img
                                  src={imgUrl}
                                  alt={p.sku}
                                  className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                                  <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                                </div>
                              </>
                            ) : (
                              <Package className="w-6 h-6 text-slate-300" />
                            )}
                          </button>
                        </td>

                        {/* SKU */}
                        <td className="p-3 font-bold text-slate-900 select-all">
                          {p.sku}
                        </td>

                        {/* Tên sản phẩm (Moved before Thương hiệu) */}
                        <td className="p-3 font-sans font-medium text-slate-900 max-w-[340px]">
                          <span className={p.isExcluded ? 'line-through text-slate-400' : ''}>
                            {p.name}
                          </span>
                        </td>

                        {/* Ngành hàng (Moved before Thương hiệu) */}
                        <td className="p-3 font-sans text-slate-500 truncate max-w-[180px]">
                          {p.category || 'Công nghiệp'}
                        </td>

                        {/* Thương hiệu (Moved after Tên sản phẩm & Ngành hàng) */}
                        <td className="p-3 font-sans text-slate-600 truncate max-w-[140px]">
                          {p.brand || 'T&T Vina Industrial'}
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center">
                          {p.isExcluded ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              Đã gỡ bỏ
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Đang mở
                            </span>
                          )}
                        </td>

                        {/* Action: 1-Click Copy */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => copySingleSku(p.sku)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[11px] font-sans font-semibold transition-colors cursor-pointer border ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 hover:bg-[#00478D] text-slate-700 hover:text-white border-slate-300 hover:border-[#00478D]'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 3. Image Lightbox Zoom Modal */}
      {zoomedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setZoomedProduct(null)}
        >
          <div
            className="relative bg-white rounded-sm border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="font-mono text-xs font-bold text-[#00478D]">
                  Mã SKU: {zoomedProduct.sku}
                </div>
                <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 line-clamp-2 mt-0.5">
                  {zoomedProduct.name}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Hãng: <strong>{zoomedProduct.brand || 'T&T Vina Industrial'}</strong> · Ngành: <strong>{zoomedProduct.category || 'Công nghiệp'}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setZoomedProduct(null)}
                className="p-1.5 rounded-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Image Preview */}
            <div className="w-full h-72 sm:h-80 bg-slate-50 rounded-xs border border-slate-100 p-4 flex items-center justify-center overflow-hidden">
              {zoomedProduct.image ? (
                <img
                  src={zoomedProduct.image.startsWith('http://') ? zoomedProduct.image.replace('http://', 'https://') : zoomedProduct.image}
                  alt={zoomedProduct.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
              ) : (
                <Package className="w-16 h-16 text-slate-300" />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => copySingleSku(zoomedProduct.sku)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00478D] hover:bg-blue-700 text-white rounded-xs font-semibold cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép mã: {zoomedProduct.sku}</span>
              </button>
              <button
                type="button"
                onClick={() => setZoomedProduct(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xs font-medium cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Floating Batch Copy Bar */}
      {selectedSkus.size > 0 && (
        <aside aria-label="Thanh công cụ sao chép hàng loạt" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 shadow-2xl p-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00478D] flex items-center justify-center font-bold text-sm">
                {selectedSkus.size}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Đã chọn {selectedSkus.size} mã sản phẩm
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-md font-mono">
                  {Array.from(selectedSkus).slice(0, 8).join(', ')}
                  {selectedSkus.size > 8 && '...'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-2 rounded-xs text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Hủy chọn
              </button>
              <button
                type="button"
                onClick={copyBatchSelected}
                className={`px-5 py-2 rounded-xs text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                  copiedBatch
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#00478D] hover:bg-blue-600 text-white'
                }`}
              >
                {copiedBatch ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ĐÃ SAO CHÉP {selectedSkus.size} MÃ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>SAO CHÉP TẤT CẢ MÃ ĐÃ CHỌN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default InternalReviewHub;

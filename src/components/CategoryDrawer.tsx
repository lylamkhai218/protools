import React, { useMemo } from 'react';
import { X, ChevronRight, LayoutGrid, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../LanguageContext';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  activeCategory: string;
  onSelectCategory: (categoryKey: string) => void;
}

function getCategoryLabel(catKey: string, code: string): string {
  const norm = (catKey || '').toLowerCase().replace(/_/g, '-');
  if (norm === 'robot') return code === 'VI' ? 'Hệ thống Robot & Tự động hóa' : 'Robotics & Factory Automation';
  if (norm === 'han') return code === 'VI' ? 'Trạm Hàn cao cấp & Khử tĩnh điện ESD' : 'SMT Soldering & ESD Static Control';
  if (norm === 'keo') return code === 'VI' ? 'Keo SMT & Vật tư liên kết' : 'SMT Adhesives & Polymeric Consumables';
  if (norm === 'van-vit') return code === 'VI' ? 'Dụng cụ vặn vít kỹ thuật số' : 'Precision Electric Fasteners';
  
  // Custom category capitalized nicely
  return catKey
    .split(/[-_ ]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CategoryDrawer({
  isOpen,
  onClose,
  products,
  activeCategory,
  onSelectCategory,
}: CategoryDrawerProps) {
  const { currentLang } = useLanguage();
  const isVi = currentLang.code === 'VI';

  // Dynamically extract categories from all live active products
  const categories = useMemo(() => {
    const defaultCats = ['robot', 'han', 'keo', 'van-vit'];
    const activeProducts = products.filter(p => p.activeStatus !== 0);
    const existingCats = Array.from(new Set(activeProducts.map(p => p.category).filter(Boolean)));
    
    // Combine defaults and any newly discovered ones, unique list
    return Array.from(new Set([...defaultCats, ...existingCats]));
  }, [products]);

  // Compute product counts for each category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      counts[cat] = products.filter(p => p.category === cat && p.activeStatus !== 0).length;
    });
    return counts;
  }, [categories, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 flex max-w-full pr-10">
        <div className="w-screen max-w-md transform transition-transform duration-300 ease-out animate-slide-right-in">
          <div className="flex h-full flex-col bg-white shadow-2xl border-r border-zinc-200">
            
            {/* Header */}
            <div className="bg-[#001530] text-white px-6 py-5 flex items-center justify-between border-b border-[#002244]">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-[#e8a020]" />
                <div>
                  <h3 className="font-display text-sm font-extrabold tracking-wider uppercase">
                    {isVi ? 'Danh mục Thiết bị' : 'Equipment Catalogues'}
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    {isVi ? `Tìm thấy ${categories.length} phân khúc kỹ thuật` : `Discovered ${categories.length} workspace categories`}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-zinc-50 p-6 space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2">
                  {isVi ? 'Chọn Nhóm Thiết Bị' : 'Filter by Segment Workstation'}
                </span>
                
                <div className="space-y-2">
                  {categories.map((catKey) => {
                    const isActive = activeCategory === catKey;
                    const count = productCounts[catKey] || 0;
                    return (
                      <button
                        key={catKey}
                        onClick={() => {
                          onSelectCategory(catKey);
                          onClose();
                        }}
                        className={`w-full text-left p-4 rounded border transition-all flex items-center justify-between cursor-pointer group ${
                          isActive 
                            ? 'bg-[#00478d]/5 border-[#00478d] text-[#00478d] font-bold shadow-xs' 
                            : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <p className="text-xs sm:text-sm font-bold truncate group-hover:text-primary transition-colors">
                            {getCategoryLabel(catKey, currentLang.code)}
                          </p>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                            {isVi ? `Có ${count} linh kiện/thiết bị` : `${count} total inventories`}
                          </span>
                        </div>
                        <div className={`p-1 rounded-full transition-all ${
                          isActive ? 'bg-[#00478d] text-white' : 'bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-600'
                        }`}>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical guarantee banner */}
              <div className="p-4 bg-amber-500/5 rounded border border-amber-500/10 space-y-2">
                <div className="flex items-center gap-2 text-[#e8a020]">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span className="font-display text-xs font-black uppercase tracking-wider">
                    {isVi ? 'Đội ngũ Kỹ sư T&T Vina' : 'Certified Engineering Support'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  {isVi 
                    ? 'Tất cả các dòng máy móc, robot và vật tư thuộc danh mục đều được hiệu chuẩn và đi kèm hồ sơ CO/CQ chính hãng hoàn chỉnh.'
                    : 'Every automated system and consumable is calibrated to industrial precision guidelines, backed by strict CO/CQ certification.'}
                </p>
              </div>
            </div>

            {/* Footer view detailed */}
            <div className="p-4 bg-zinc-100 border-t border-zinc-200 text-center">
              <span className="text-[10px] text-zinc-500">
                T&T Vina Industrial Solutions • 2026
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

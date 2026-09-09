import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  FileText, 
  Download, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Check, 
  Copy, 
  Share2, 
  PhoneCall, 
  Package, 
  Cpu, 
  Wrench,
  ChevronRight,
  Layers,
  Sparkles,
  Truck,
  Tag,
  Plus,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, COMPANY_INFO } from '../data';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedProduct } from '../i18n/productTranslations';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: string, filter?: string) => void;
}

export default function ProductDetail({ 
  product, 
  onBack, 
  onAddToCart, 
  onSelectProduct, 
  onNavigate 
}: ProductDetailProps) {
  const { t, locale } = useTranslation();
  const p = product ? getLocalizedProduct(product, locale) : product;

  const TIER_PRICING = [
    { qtyLabel: '1 – 5', minQty: 1, policy: t('product_detail.tier_p1'), leadTime: t('product_detail.lead_24h'), highlight: false },
    { qtyLabel: '6 – 20', minQty: 6, policy: t('product_detail.tier_p2'), leadTime: t('product_detail.lead_24h'), highlight: true },
    { qtyLabel: '21 – 50', minQty: 21, policy: t('product_detail.tier_p3'), leadTime: t('product_detail.lead_1_2d'), highlight: false },
    { qtyLabel: '> 50', minQty: 50, policy: t('product_detail.tier_p4'), leadTime: t('product_detail.lead_schedule'), highlight: false },
  ];

  const defaultImage = product?.image || (PRODUCTS[0]?.image || '');
  const [selectedImage, setSelectedImage] = useState<string>(defaultImage);
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedSku, setCopiedSku] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'docs'>('specs');

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

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || '');
      setQuantity(1);
      setActiveTab('specs');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [product?.id, product?.image]);

  if (!product || !p) {
    return (
      <div className="flex-1 p-12 text-center">
        <p className="text-slate-500 text-sm">Không tìm thấy thông tin thiết bị.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#00478D] text-white rounded-xs text-xs font-bold">
          Quay lại danh mục
        </button>
      </div>
    );
  }

  const allImages = p.images && p.images.length > 0 
    ? p.images 
    : [p.image];

  const handleCopySku = () => {
    if (p.sku) {
      navigator.clipboard.writeText(p.sku);
      setCopiedSku(true);
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  const relatedProducts = PRODUCTS.filter(item => item.id !== p.id && (item.categorySlug === p.categorySlug || item.category === product.category)).slice(0, 3);

  return (
    <div className="flex-1 bg-slate-50/60 pb-20">
      
      {/* 1. BREADCRUMB NAVIGATION */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap py-0.5">
            <button 
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#00478D] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer transition-colors px-1.5 py-0.5 rounded-xs hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('product_detail.breadcrumb_home')}</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            <button 
              type="button"
              onClick={() => onNavigate('home', p.categorySlug || 'all')}
              className="hover:text-[#00478D] font-medium text-slate-600 hover:underline cursor-pointer transition-colors px-1.5 py-0.5 rounded-xs hover:bg-slate-100 truncate max-w-[200px]"
              title={`Xem danh mục ${p.category}`}
            >
              {p.category}
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            <button 
              type="button"
              onClick={() => onNavigate('home', p.brand?.toLowerCase().includes('murrplastik') ? 'murrplastik' : (p.categorySlug || 'all'))}
              className="hover:text-[#00478D] font-mono text-slate-500 hover:underline cursor-pointer transition-colors px-1.5 py-0.5 rounded-xs hover:bg-slate-100"
              title={`Lọc theo hãng ${p.brand}`}
            >
              {p.brand}
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md" title={p.name}>
              {p.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleCopySku}
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-[#00478D] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-xs transition-colors cursor-pointer"
            >
              {copiedSku ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSku ? t('product_detail.sku_copied') : t('product_detail.copy_sku')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT HERO & STUDIO OVERVIEW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-sm border border-slate-200 shadow-[0_4px_25px_-5px_rgba(0,31,63,0.05)] p-6 sm:p-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left: Studio Product Gallery */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="relative aspect-4/3 rounded-xs bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-6 group">
                <img 
                  src={selectedImage || p.image} 
                  alt={p.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="px-2.5 py-1 rounded-xs bg-[#00478D] text-white font-display font-bold text-xs uppercase tracking-wider">
                    {p.brand}
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-white/90 text-slate-800 text-[11px] font-mono border border-slate-200 font-bold">
                    SKU: {p.sku}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-xs bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{p.stockLocation || t('catalog.in_stock')}</span>
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xs border-2 p-1 bg-white overflow-hidden shrink-0 transition-all cursor-pointer ${
                        selectedImage === img ? 'border-[#00478D] shadow-xs' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Fast Dispatch & Warehouse Commitment Banner */}
              <div className="p-3.5 rounded-xs bg-blue-50/70 border border-blue-200/80 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#00478D] font-bold">
                  <Truck className="w-4 h-4 text-[#00478D] shrink-0" />
                  <span>{t('product_detail.delivery_title')}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px] pl-6">
                  • {t('product_detail.delivery_desc_1')}<br />
                  • {t('product_detail.delivery_desc_2')}
                </p>
              </div>

              {/* Trust Badge Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#00478D] mx-auto mb-1" />
                  <span className="font-bold text-slate-800 block text-[11px]">{t('product_detail.co_cq_title')}</span>
                  <span className="text-slate-400 text-[10px]">{t('product_detail.co_cq_sub')}</span>
                </div>
                <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-100">
                  <Building2 className="w-4 h-4 text-[#D97706] mx-auto mb-1" />
                  <span className="font-bold text-slate-800 block text-[11px]">{t('product_detail.warranty_title')}</span>
                  <span className="text-slate-400 text-[10px]">{t('product_detail.warranty_sub')}</span>
                </div>
                <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-100">
                  <Package className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-800 block text-[11px]">{t('product_detail.nationwide_title')}</span>
                  <span className="text-slate-400 text-[10px]">{t('product_detail.nationwide_sub')}</span>
                </div>
              </div>

            </div>

            {/* Right: Product Technical Meta & B2B Volume Pricing */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#00478D] uppercase tracking-wider">
                    {p.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">{t('product_detail.origin_prefix')} {p.origin || 'Chính Hãng'}</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {p.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {p.shortDesc}
                </p>
              </div>

              {/* VinFast Body Shop Case Study & Automotive Link for R-Tec Liner / Murrplastik */}
              {(product.id === '1081' || product.categorySlug === 'murrplastik' || product.brand === 'Murrplastik') && (
                <div className="p-4 rounded-xs bg-gradient-to-r from-slate-900 via-slate-800 to-[#00478D] text-white space-y-2.5 shadow-sm border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ứng Dụng Ngành Sản Xuất Ô Tô (VinFast Body Shop)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-xs bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                      Verified Case Study
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Hệ thống <strong>R-Tec Liner</strong> của Murrplastik đã được lắp đặt thực tế và chứng minh hiệu quả vận hành bền bỉ 24/7 trên các dàn robot hàn ABB tại xưởng hàn thân xe (Body Shop) Tổ hợp Nhà máy Ô tô VinFast Cát Hải, Hải Phòng.
                  </p>
                  <div className="pt-1">
                    <a
                      href="https://protools.com.vn/murrplastik/industries/san-xuat-o-to/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xs bg-white text-[#00478D] hover:bg-amber-50 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Xem Chi Tiết Giải Pháp Ngành Ô Tô</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#00478D]" />
                    </a>
                  </div>
                </div>
              )}

              {/* B2B VOLUME TIER PRICING TABLE (CHUẨN MISUMI) */}
              <div className="rounded-xs border border-slate-200 overflow-hidden bg-white">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#00478D]" />
                    <span>Khung Số Lượng & Chính Sách Báo Giá (B2B Tiers)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Click chọn số lượng</span>
                </div>
                
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                      <th className="p-2.5 pl-3">Số Lượng Đặt (Q'ty)</th>
                      <th className="p-2.5">Chính Sách Báo Giá</th>
                      <th className="p-2.5 pr-3 text-right">Thời Gian Giao (Lead Time)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {TIER_PRICING.map((tier, idx) => (
                      <tr 
                        key={idx}
                        onClick={() => setQuantity(tier.minQty)}
                        className={`cursor-pointer transition-colors ${
                          quantity >= tier.minQty && (idx === TIER_PRICING.length - 1 || quantity < TIER_PRICING[idx + 1].minQty)
                            ? 'bg-blue-50/80 font-bold text-[#00478D]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="p-2.5 pl-3 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${quantity >= tier.minQty && (idx === TIER_PRICING.length - 1 || quantity < TIER_PRICING[idx + 1].minQty) ? 'bg-[#00478D]' : 'bg-slate-300'}`}></span>
                          <span>{tier.qtyLabel}</span>
                        </td>
                        <td className="p-2.5">
                          <span className={tier.highlight ? 'text-[#00478D] font-bold' : ''}>
                            {tier.policy}
                          </span>
                        </td>
                        <td className="p-2.5 pr-3 text-right text-[11px] text-slate-500">
                          {tier.leadTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Core Highlights */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xs border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Tiêu Chuẩn Nhà Máy SMT & Lắp Ráp
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {(product.highlights || [
                    'Sản phẩm công nghiệp chính xác cao tiêu chuẩn nhà máy',
                    'Có đầy đủ chứng từ hàng hóa và bảo hành chính hãng',
                    'Hỗ trợ kỹ thuật lắp đặt & hướng dẫn vận hành'
                  ]).map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00478D] shrink-0 mt-0.5" />
                      <span className="leading-snug">{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector & Action CTA */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xs bg-white h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 h-full text-center text-sm font-mono font-bold text-slate-900 focus:outline-none border-x border-slate-200"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onNavigate('cart');
                    }}
                    className="flex-1 h-12 px-6 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-display font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-300" />
                    <span>{t('product_detail.add_to_quote_btn')} ({quantity})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:${COMPANY_INFO.hotlineRaw}`}
                      className="flex-1 h-10 px-3 rounded-xs bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer truncate"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{t('nav.hotline')}: {COMPANY_INFO.hotline}</span>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(COMPANY_INFO.hotlineRaw, 'pd_hotline', e)}
                      title="Sao chép Hotline"
                      className="h-10 px-2.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {copiedKey === 'pd_hotline' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const isMurr = product.brand?.toLowerCase().includes('murrplastik') || product.categorySlug === 'murrplastik' || product.sku?.startsWith('MP-');
                      const rep = isMurr ? COMPANY_INFO.murrSalesTeam[0] : COMPANY_INFO.salesTeam[0];
                      const label = isMurr ? `${t('contact_widget.murr_sales')}: ` : `${t('contact_widget.sales')}: `;

                      return (
                        <>
                          <a
                            href={rep.zaloUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 h-10 px-3 rounded-xs bg-[#0068FF] hover:bg-[#0055D4] text-white font-display font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer truncate shadow-2xs"
                          >
                            <span className="w-4 h-4 rounded-full bg-white text-[#0068FF] font-black text-[9px] flex items-center justify-center shrink-0">Z</span>
                            <span className="truncate">{label}{rep.name} ({rep.phone})</span>
                          </a>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(rep.rawPhone, 'pd_zalo', e)}
                            title={`Sao chép số Zalo ${rep.name}`}
                            className="h-10 px-2.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                          >
                            {copiedKey === 'pd_zalo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 3. DETAILED TECHNICAL TABS (Swiss Precision Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-[#00478D] bg-white text-[#00478D]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('product_detail.tab_specs')}
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'features'
                  ? 'border-[#00478D] bg-white text-[#00478D]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('product_detail.tab_features')}
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-[#00478D] bg-white text-[#00478D]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('product_detail.tab_docs')}
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-10">
            
            {/* Tab 1: Full Technical Specifications Table */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold uppercase text-[#0F172A]">
                    {t('product_detail.spec_heading')} ({p.name})
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{t('product_detail.unit_standard')}</span>
                </div>

                <div className="border border-slate-200 rounded-xs overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(p.specs || {}).map(([specKey, specVal], idx) => (
                        <tr key={specKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          <td className="p-3.5 sm:p-4 font-bold text-slate-700 w-1/3 sm:w-1/4 border-r border-slate-200 bg-slate-50/50">
                            {specKey}
                          </td>
                          <td className="p-3.5 sm:p-4 font-mono font-medium text-slate-900">
                            {specVal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Features & Included Accessories */}
            {activeTab === 'features' && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="font-display text-lg font-bold uppercase text-[#0F172A]">
                    {t('product_detail.features_heading')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(p.highlights || [
                      'Hoạt động bền bỉ 24/7 trong môi trường sản xuất công nghiệp',
                      'Độ chính xác và độ lặp lại cao theo tiêu chuẩn quốc tế',
                      'Dễ dàng tích hợp vào hệ thống dây chuyền tự động hóa',
                      'Sẵn sàng phụ tùng và linh kiện thay thế chính hãng'
                    ]).map((feat, i) => (
                      <div key={i} className="p-4 rounded-xs bg-slate-50 border border-slate-200 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Chứng Từ Hàng Hóa & Factory Technical Support */}
            {activeTab === 'docs' && (
              <div className="space-y-6">
                <h3 className="font-display text-lg font-bold uppercase text-[#0F172A]">
                  {t('product_detail.docs_heading')}
                </h3>

                <div className="p-5 rounded-xs bg-blue-50/60 border border-blue-200 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-[#00478D] font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    <span>{t('product_detail.docs_sub')}</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 pl-7 list-disc">
                    <li>{t('product_detail.doc_1')}</li>
                    <li>{t('product_detail.doc_2')}</li>
                    <li>{t('product_detail.doc_3')}</li>
                    <li>{t('product_detail.doc_4')}</li>
                  </ul>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a 
                      href={`tel:${COMPANY_INFO.hotlineRaw}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00478D] text-white rounded-xs font-bold text-xs hover:bg-[#003B75] transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t('product_detail.tech_support_hotline')}: {COMPANY_INFO.hotline}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 4. CROSS-BRAND EQUIVALENTS & COMPATIBLE ACCESSORIES */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00478D] block">
                Cross-Reference & Accessories
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 uppercase">
                {t('product_detail.cross_ref_heading')}
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-[#00478D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('product_detail.view_all_devices')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {relatedProducts.map((rel) => {
              const relLoc = getLocalizedProduct(rel, locale);
              return (
                <div 
                  key={rel.id}
                  className="rounded-sm bg-white border border-slate-200 hover:border-[#00478D] shadow-xs hover:shadow-lg transition-all p-2.5 sm:p-4 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] mb-1.5 sm:mb-2">
                      <span className="font-mono font-bold text-slate-500 truncate max-w-[55%]">{relLoc.sku}</span>
                      <span className="font-bold text-[#00478D] bg-blue-50 px-1 sm:px-1.5 py-0.5 rounded-xs shrink-0">{relLoc.brand}</span>
                    </div>

                    <div 
                      onClick={() => {
                        onSelectProduct(rel);
                        setSelectedImage(rel.image);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="h-28 sm:h-36 bg-slate-50 rounded-xs border border-slate-100 p-2 flex items-center justify-center overflow-hidden cursor-pointer mb-2 sm:mb-3 group-hover:bg-blue-50/20 transition-colors"
                    >
                      <img src={relLoc.image} alt={relLoc.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200" />
                    </div>

                    <h3 
                      onClick={() => {
                        onSelectProduct(rel);
                        setSelectedImage(rel.image);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="font-display font-bold text-xs text-slate-900 group-hover:text-[#00478D] transition-colors line-clamp-2 cursor-pointer min-h-[32px]"
                    >
                      {relLoc.name}
                    </h3>
                  </div>

                  <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-slate-100 flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => {
                        onSelectProduct(rel);
                        setSelectedImage(rel.image);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 h-7 sm:h-8 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {t('product_detail.detail_btn')}
                    </button>
                    <button
                      onClick={() => onAddToCart(rel, 1)}
                      className="h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-[10px] sm:text-[11px] font-bold transition-colors flex items-center gap-0.5 sm:gap-1 cursor-pointer shrink-0"
                      title="Thêm vào báo giá"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">{t('product_detail.quote_btn')}</span>
                      <span className="sm:hidden">{t('product_detail.quote_btn')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

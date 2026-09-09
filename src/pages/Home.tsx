import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Wrench, 
  PackageCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Plus,
  Building,
  PhoneCall,
  Sparkles,
  Layers,
  Settings2,
  Building2, 
  HelpCircle, 
  ChevronDown,
  Copy,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { PARTNERS, SOLUTIONS, PRODUCTS, TECHNICAL_DOCUMENTS, INDUSTRIES, COMPANY_INFO } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { useTranslation } from '../i18n/LanguageContext';

interface HomeProps {
  onNavigate: (tab: string, filter?: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialFilter?: string;
}

const FAQ_ITEMS = [
  {
    q: 'Công ty TNHH Công Nghiệp T&T VINA chuyên cung cấp những nhóm thiết bị nào?',
    a: 'T&T Vina (Protools.com.vn) chuyên phân phối thiết bị phụ trợ và giải pháp tự động hóa cho các nhà máy SMT, lắp ráp linh kiện điện tử, gồm: Robot hàn tự động, máy hàn Hakko/Quick, bể hàn thiếc CM-508/808, máy bắt vít HIOS CL-3000/4000, máy bơm keo SP-982, máy cắt băng dính tự động Zcut 9/RT-3700, máy tách tem nhãn, thiết bị đo lực siết HP-10, kính hiển vi soi nổi SM-3TPZ, quạt ion khử tĩnh điện Dr. Schneider SL-001, và toàn bộ hệ thống xích dẫn cáp, giá đỡ robot Murrplastik chính hãng Đức.'
  },
  {
    q: 'Các sản phẩm tại Protools.com.vn có đầy đủ chứng từ hàng hóa không?',
    a: '100% sản phẩm do T&T Vina cung cấp đều có đầy đủ chứng từ hàng hóa hợp pháp. Tất cả đơn hàng đều được cung cấp đầy đủ hồ sơ xuất xứ, chứng nhận chất lượng và hóa đơn giá trị gia tăng (VAT) theo quy định.'
  },
  {
    q: 'Chính sách bảo hành và hỗ trợ kỹ thuật tận nơi tại nhà máy như thế nào?',
    a: 'Toàn bộ thiết bị máy móc đều có chính sách bảo hành chính hãng. Đội ngũ chuyên gia kỹ thuật của T&T VINA (Hotline: 0915.168.824) sẵn sàng hỗ trợ khảo sát, tư vấn giải pháp, chạy thử mẫu (trial test) và hướng dẫn vận hành trực tiếp tại các nhà máy thuộc KCN Hà Nội, Bắc Ninh, Hưng Yên, Hải Phòng, Vĩnh Phúc, Thái Nguyên...'
  },
  {
    q: 'Thời gian nhận báo giá dự án và giao hàng mất bao lâu?',
    a: 'Sau khi quý khách gửi yêu cầu qua Giỏ Báo Giá hoặc liên hệ Hotline / Zalo Kinh Doanh (Ms. Hiền 0929.938.368 / Ms. Phương 0365.366.455 / Hotline 0915.168.824), chúng tôi sẽ gửi bảng báo giá chính thức trong vòng 15 - 30 phút. Với các mã hàng có sẵn tại kho Hà Nội & Hưng Yên, thời gian giao hàng hỏa tốc trong vòng 24 giờ.'
  },
  {
    q: 'Địa chỉ văn phòng trụ sở và kho hàng chính thức của T&T VINA ở đâu?',
    a: 'Trụ sở chính đặt tại: Thôn Nhạo Sơn - Xã Thụy Anh - Tỉnh Hưng Yên (cách khu công nghiệp Liên Hà Thái 1km). VPGD & Kho hàng Hà Nội: Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam, Quận Hoàng Mai, TP. Hà Nội (Số 11 ngách 68 ngõ 467 Lĩnh Nam — có sẵn định vị chỉ đường trên Google Maps).'
  }
];

export default function Home({ onNavigate, onSelectProduct, onAddToCart, initialFilter }: HomeProps) {
  const { t, locale } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>(initialFilter || 'all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('electronics');
  const [hoveredZoomProduct, setHoveredZoomProduct] = useState<{ product: Product; x: number; y: number } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroScrollSpread, setHeroScrollSpread] = useState<number>(0);
  const [isHeroCardMounted, setIsHeroCardMounted] = useState<boolean>(false);

  // Sync activeCategory when initialFilter prop updates from Header navigation & scroll to catalog
  useEffect(() => {
    if (initialFilter) {
      setActiveCategory(initialFilter);
      if (initialFilter !== 'all') {
        setTimeout(() => {
          const el = document.getElementById('product-catalog');
          if (el) {
            const yOffset = -75;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 80);
      }
    }
  }, [initialFilter]);

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    setTimeout(() => {
      const el = document.getElementById('product-catalog');
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  // Staggered entrance trigger on initial mount
  useEffect(() => {
    const t = setTimeout(() => setIsHeroCardMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Dynamic scroll listener with RAF throttle for smooth iOS 18 performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.pageYOffset || document.documentElement.scrollTop;
          if (y <= 400) {
            const spread = Math.min(y / 350, 1);
            setHeroScrollSpread(spread);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger dynamic scroll reveal when category filter changes or page scrolls
  useScrollReveal(activeCategory);

  // Filter products by category with robust matching
  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => {
        if (activeCategory === 'murrplastik') {
          return p.brand?.toLowerCase().includes('murrplastik') || p.categorySlug === 'murrplastik' || p.sku?.startsWith('MP-');
        }
        return p.categorySlug === activeCategory || p.category === activeCategory;
      });

  const heroFeatured = PRODUCTS.find(p => p.id === '1081') || PRODUCTS[0]; // R-Tec Liner Murrplastik Đức

  // JSON-LD Structured Data Schema for Google SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  return (
    <div className="flex-1 bg-white relative w-full max-w-full overflow-x-clip">
      
      {/* Schema.org FAQPage SEO Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* 1. HERO SECTION (Swiss Precision Light Luxury) */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/30 py-10 sm:py-16 bg-swiss-grid w-full max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-[#00478D] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#00478D] animate-ping shrink-0" />
                <span className="truncate">{t('hero.badge')}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight uppercase leading-[1.15] break-words">
                {t('hero.title_p1')}, <br className="hidden xs:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00478D] via-[#005EB8] to-[#003366]">
                  {t('hero.title_highlight')}
                </span>
              </h1>

              <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                {t('hero.subtitle')}
              </p>

              {/* Special Fast-Track Procurement Card for VEC 2026 (Chinese Language) */}
              {locale === 'zh-CN' && (
                <div className="p-3.5 rounded-sm bg-red-50/80 border border-red-200 shadow-2xs space-y-1.5 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#E30613] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E30613] animate-pulse" />
                      欢迎莅临 VEC 2026 展位 (H2-15a) · 中文采购直通
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-xs font-semibold">
                      微信 / WeChat 即时响应
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    T&T Vina 为在越外资制造企业提供原厂进口 SMT 设备、Murrplastik 拖链与防静电设备，支持越南增值税发票与美元结算。中文专员：<strong className="text-slate-900 font-mono">+84 968.597.131 (Mr. Khải)</strong> / <strong className="text-slate-900 font-mono">+84 868.822.409 (Mr. Bình)</strong>
                  </p>
                </div>
              )}

              {/* Action CTAs */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('cart')}
                  className="h-11 sm:h-12 px-5 sm:px-8 rounded-sm bg-[#00478D] hover:bg-[#003B75] text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>{t('hero.btn_rfq')}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <a
                  href={`tel:${COMPANY_INFO.hotlines[0]}`}
                  className="h-11 sm:h-12 px-5 sm:px-8 rounded-sm bg-white hover:bg-slate-50 text-slate-800 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#D97706]" />
                  <span>{t('nav.hotline')}: {COMPANY_INFO.hotlines[0]}</span>
                </a>
              </div>

              {/* Trust Indicators with Smooth Number Counting Animation */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-5 border-t border-slate-200/80 text-xs">
                <div>
                  <AnimatedCounter end={100} suffix="%" className="font-display text-xl sm:text-3xl font-black text-[#00478D] tracking-tight block" />
                  <div className="text-slate-500 text-[10px] sm:text-[11px] mt-0.5 font-medium leading-tight">Chính Hãng Nhật / Đức / Hàn</div>
                </div>
                <div>
                  <AnimatedCounter end={24} suffix="h" className="font-display text-xl sm:text-3xl font-black text-[#D97706] tracking-tight block" />
                  <div className="text-slate-500 text-[10px] sm:text-[11px] mt-0.5 font-medium leading-tight">Giao Hàng Tại Các KCN</div>
                </div>
                <div>
                  <AnimatedCounter end={76} suffix="+" className="font-display text-xl sm:text-3xl font-black text-slate-800 tracking-tight block" />
                  <div className="text-slate-500 text-[10px] sm:text-[11px] mt-0.5 font-medium leading-tight">Thiết Bị Tiêu Chuẩn Sẵn Kho</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Spotlight Hardware Card with Staggered Entrance */}
            <div className="lg:col-span-5">
              <div className={`relative rounded-sm bg-white p-6 shadow-xl border border-slate-200/90 group transition-all duration-700 ease-out ${
                isHeroCardMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'
              }`}>
                
                {/* 1. Tech Badge (Stagger 1: 150ms) */}
                <div className={`flex items-center justify-between pb-4 border-b border-slate-100 transition-all duration-500 ease-out delay-150 ${
                  isHeroCardMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase">TIÊU ĐIỂM ROBOTICS ĐỨC</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#00478D] bg-blue-50 px-2 py-0.5 rounded-xs border border-blue-200">
                    Sẵn hàng tại kho
                  </span>
                </div>

                {/* 2. Hardware Image with Optical Zoom (Stagger 2: 300ms) */}
                <div 
                  className={`relative h-64 sm:h-72 my-4 rounded-sm bg-slate-50 flex items-center justify-center p-4 border border-slate-100 overflow-hidden cursor-pointer transition-all duration-600 ease-out delay-300 ${
                    isHeroCardMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                  }`}
                  onClick={() => {
                    onSelectProduct(heroFeatured);
                    onNavigate('product-detail');
                  }}
                >
                  <img 
                    src={heroFeatured.image} 
                    alt={heroFeatured.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-slate-200 text-[11px] font-mono text-slate-600 shadow-2xs">
                    Mã: {heroFeatured.sku}
                  </div>
                </div>

                {/* 3. Hardware Title & VinFast Body Shop Case Study (Stagger 3: 450ms) */}
                <div className={`space-y-2.5 transition-all duration-500 ease-out delay-450 ${
                  isHeroCardMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {heroFeatured.category} • {heroFeatured.brand}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-[#00478D] transition-colors line-clamp-1">
                    {heroFeatured.name}
                  </h3>

                  {/* Verified Case Study VinFast Body Shop */}
                  <div className="p-2.5 rounded-xs bg-emerald-50/90 border border-emerald-200/90 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11px] uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Case Study VinFast Cát Hải:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">
                      {t('hero.trust_vinfast')}
                    </p>
                  </div>

                  {/* 4. Specs Grid (Stagger 4: 600ms) */}
                  <div className={`grid grid-cols-2 gap-2 pt-1 text-[11px] transition-all duration-500 ease-out delay-600 ${
                    isHeroCardMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}>
                    <div className="bg-slate-50 p-2 rounded-xs border border-slate-200/70">
                      <span className="text-slate-400 block text-[10px]">Ứng dụng</span>
                      <span className="font-mono font-bold text-slate-800">Robot hàn ABB (6 Trục)</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xs border border-slate-200/70">
                      <span className="text-slate-400 block text-[10px]">Cơ cấu</span>
                      <span className="font-mono font-bold text-slate-800">Thu hồi ống đàn hồi</span>
                    </div>
                  </div>

                  {/* 5. Actions (Stagger 5: 750ms) */}
                  <div className={`flex items-center gap-2 pt-2 transition-all duration-500 ease-out delay-700 ${
                    isHeroCardMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  }`}>
                    <button
                      onClick={() => {
                        onSelectProduct(heroFeatured);
                        onNavigate('product-detail');
                      }}
                      className="flex-1 h-10 rounded-sm bg-slate-900 hover:bg-[#00478D] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Xem Spec-sheet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onAddToCart(heroFeatured)}
                      className="h-10 px-3.5 rounded-sm bg-amber-50 hover:bg-amber-100 text-[#D97706] border border-amber-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Thêm vào giỏ báo giá"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Báo Giá</span>
                    </button>
                  </div>

                  {/* Direct link to Murrplastik portal */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Hệ sinh thái chính hãng:</span>
                    <a
                      href="/murrplastik/"
                      className="text-[#E30613] hover:underline font-bold inline-flex items-center gap-1 group"
                    >
                      <span>Vào Chuyên Trang Murrplastik</span>
                      <ExternalLink className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* Interactive Ambient Downward Scroll Indicator (Refined Swiss Precision) */}
          <div className="pt-8 sm:pt-12 flex flex-col items-center justify-center relative z-20">
            <button
              onClick={() => {
                const nextSection = document.getElementById('solution-pillars');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollBy({ top: 550, behavior: 'smooth' });
                }
              }}
              className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none transition-all"
              aria-label="Cuộn xuống xem danh mục & giải pháp"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-hover:text-[#00478D] transition-colors">
                Khám phá giải pháp & danh mục
              </span>
              
              {/* Minimalist Glassmorphic Scroll Pill */}
              <div className="relative flex items-center justify-center">
                {/* Soft ambient aura on hover */}
                <div className="absolute -inset-2 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 blur-sm transition-all duration-500 pointer-events-none" />
                
                <div className="relative w-8 h-8 rounded-full border border-slate-200/90 bg-white/90 shadow-2xs backdrop-blur-xs flex items-center justify-center text-slate-400 group-hover:text-[#00478D] group-hover:border-blue-300/80 group-hover:shadow-sm transition-all duration-300">
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Dynamic ambient color glow that expands smoothly without causing horizontal overflow */}
        <div 
          style={{
            opacity: 0.3 + heroScrollSpread * 0.7,
            transform: `translate(-50%, ${heroScrollSpread * 20}px) scale(${1 + heroScrollSpread * 0.8})`,
          }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[320px] sm:w-[800px] h-[260px] sm:h-[350px] bg-gradient-to-t from-blue-600/25 via-[#00478D]/15 to-transparent rounded-full blur-3xl pointer-events-none will-change-transform"
        />

      </section>

      {/* 2. INDUSTRIAL SOLUTION PILLARS (2 Columns on Mobile, 4 Columns on Desktop) */}
      <section id="solution-pillars" className="py-12 sm:py-20 bg-slate-50/50 border-b border-slate-200/80 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00478D] uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4" />
                <span>Trụ Cột Giải Pháp</span>
              </div>
              <h2 className="font-display text-xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
                {t('solutions.section_title')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              {t('solutions.section_sub')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {SOLUTIONS.map((sol) => {
              const repProduct = PRODUCTS.find(p => {
                if (sol.id === 'murrplastik') {
                  return p.brand?.toLowerCase().includes('murrplastik') || p.categorySlug === 'murrplastik' || p.sku?.startsWith('MP-');
                }
                return p.categorySlug === sol.id;
              }) || PRODUCTS[0];

              return (
                <div 
                  key={sol.id}
                  onClick={() => handleSelectCategory(sol.id)}
                  className="rounded-sm bg-white p-3 sm:p-5 border border-slate-200/90 hover:border-[#00478D] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-2 sm:space-y-3">
                    
                    {/* Top Row: Brand Tag & Badge */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-display font-extrabold text-[9px] sm:text-[11px] text-[#00478D] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-xs border border-blue-200 tracking-wider uppercase truncate max-w-[65%]">
                        {sol.tag.split('/')[0].trim()}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-xs bg-slate-100 text-slate-600 shrink-0 hidden xs:inline-block">
                        {sol.badge}
                      </span>
                    </div>

                    {/* Real Industrial Hardware Thumbnail Container */}
                    <div className="h-28 sm:h-36 my-1 sm:my-2 rounded-xs bg-slate-50/90 border border-slate-100 p-2 sm:p-2.5 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-50/30 transition-colors">
                      <img 
                        src={repProduct.image} 
                        alt={sol.title} 
                        className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5 p-1 sm:p-1.5 rounded-xs bg-white/95 shadow-2xs border border-slate-200/90 text-[#00478D]">
                        {sol.id === 'thiet-bi-han' && <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {sol.id === 'may-bat-vit-nha-vit' && <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {sol.id === 'dung-cu-bom-keo' && <PackageCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {sol.id === 'murrplastik' && <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {sol.id !== 'thiet-bi-han' && sol.id !== 'may-bat-vit-nha-vit' && sol.id !== 'dung-cu-bom-keo' && sol.id !== 'murrplastik' && <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 px-1 sm:px-1.5 py-0.5 bg-white/90 backdrop-blur-xs rounded-xs border border-slate-200 text-[9px] sm:text-[10px] font-mono text-slate-600 shadow-2xs">
                        {sol.featuredProductsCount} SP
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-xs sm:text-base text-slate-900 group-hover:text-[#00478D] transition-colors line-clamp-1 leading-snug">
                        {sol.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-mono text-[#D97706] mt-0.5 line-clamp-1">
                        {sol.subtitle}
                      </p>
                    </div>

                    <p className="text-[11px] sm:text-xs text-slate-600 leading-tight sm:leading-relaxed line-clamp-2 hidden sm:block">
                      {sol.desc}
                    </p>

                    <div className="space-y-1 pt-1.5 border-t border-slate-100 hidden sm:block">
                      {sol.standards.slice(0, 2).map((std, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{std}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-4 mt-1.5 sm:mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#00478D] group-hover:underline">
                    <span>Xem danh mục</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. REAL PRODUCTS SPEC-SHEET GRID */}
      <section id="product-catalog" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00478D] uppercase tracking-wider mb-2">
                <Settings2 className="w-4 h-4" />
                <span>Danh Mục Sản Phẩm Thực Tế</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
                Bảng Thông Số & Thiết Bị ({filteredProducts.length})
              </h2>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-sm border border-slate-200">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất Cả ({PRODUCTS.length})
              </button>
              <button
                onClick={() => setActiveCategory('thiet-bi-han')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'thiet-bi-han'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thiết Bị Hàn
              </button>
              <button
                onClick={() => setActiveCategory('may-bat-vit-nha-vit')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'may-bat-vit-nha-vit'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bắt Vít - Nhả Vít
              </button>
              <button
                onClick={() => setActiveCategory('dung-cu-bom-keo')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'dung-cu-bom-keo'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bơm Keo
              </button>
              <button
                onClick={() => setActiveCategory('may-cat-bang-dinh-tu-dong')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'may-cat-bang-dinh-tu-dong'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cắt Băng Dính & Tách Tem
              </button>
              <button
                onClick={() => setActiveCategory('thiet-bi-kiem-tra')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'thiet-bi-kiem-tra'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kiểm Tra & Đo Lực
              </button>
              <button
                onClick={() => setActiveCategory('camera-kinh-soi-cong-nghiep')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'camera-kinh-soi-cong-nghiep'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kính Soi & Hiển Vi
              </button>
              <button
                onClick={() => setActiveCategory('dung-cu-chong-tinh-dien')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'dung-cu-chong-tinh-dien'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Khử Tĩnh Điện ESD
              </button>
              <button
                onClick={() => setActiveCategory('murrplastik')}
                className={`px-3 py-1.5 rounded-xs text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'murrplastik'
                    ? 'bg-white text-[#00478D] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Murrplastik
              </button>
            </div>
          </div>

          {/* Murrplastik Official Partner Spotlight Showcase Banner */}
          {activeCategory === 'murrplastik' && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-sm bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-l-4 border-[#E30613] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E30613] animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                    ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC TẠI VIỆT NAM
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-xs bg-red-950 text-red-300 border border-red-800/80 hidden xs:inline-block">
                    MURRPLASTIK GMBH · SINCE 1963
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
                  Chuyên Trang Hệ Thống Quản Lý Cáp Murrplastik (CHLB Đức)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  T&T Vina phân phối chính hãng 6 giải pháp Murrplastik: Xích dẫn cáp Robot, Luồn ống bảo vệ luồn dây, Đầu vào cáp KDL/KDP, Tem nhãn &amp; Máy in laser công nghiệp mp-LM 1M, kèm Mô phỏng 3D WebGL tương tác thời gian thực.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-1 lg:pt-0">
                <a
                  href="/murrplastik/"
                  className="w-full sm:w-auto h-11 px-5 rounded-xs bg-[#E30613] hover:bg-[#C8102E] text-white font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-red-900/40 group cursor-pointer"
                  title="Khám phá chuyên trang giải pháp Murrplastik"
                >
                  <span>Xem Chi Tiết Về Hãng</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="/murrplastik/tin-tuc/trien-lam-vec-2026/"
                  className="w-full sm:w-auto h-11 px-4 rounded-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                  title="Mở mô phỏng 3D WebGL Gian Hàng Triển Lãm VEC 2026"
                >
                  <span>Gian Hàng Ảo 3D VEC 2026</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {/* Product Cards Grid with Real Specs & Desktop Hover Preview (2 columns on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map((p, idx) => (
              <div 
                key={p.id}
                style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                className="rounded-sm bg-white border border-slate-200 hover:border-[#00478D] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden scroll-reveal opacity-0 translate-y-8"
              >
                <div>
                  
                  {/* Top Bar: SKU & Origin */}
                  <div className="p-2 sm:p-3.5 pb-0 flex items-center justify-between text-[9px] sm:text-[11px]">
                    <span className="font-mono text-slate-500 font-semibold truncate max-w-[55%]">{p.sku}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 bg-slate-100 px-1 sm:px-1.5 py-0.5 rounded-xs shrink-0">
                      {p.brand}
                    </span>
                  </div>

                  {/* Studio Image Container with Hover Zoom Magnifier */}
                  <div 
                    onClick={() => {
                      onSelectProduct(p);
                      onNavigate('product-detail');
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredZoomProduct({
                        product: p,
                        x: rect.right + 16,
                        y: Math.max(20, rect.top - 20)
                      });
                    }}
                    onMouseLeave={() => setHoveredZoomProduct(null)}
                    className="h-32 sm:h-52 m-1.5 sm:m-3 rounded-sm bg-slate-50/80 p-2 sm:p-3 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50/20 transition-colors cursor-pointer overflow-hidden relative"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 text-[10px] font-bold text-[#00478D] px-1.5 py-0.5 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block shadow-2xs border border-slate-200">
                      Rê chuột phóng to
                    </div>
                  </div>

                  {/* Name & Short Description */}
                  <div className="px-2 sm:px-4 pb-1 sm:pb-2">
                    <h3 
                      onClick={() => {
                        onSelectProduct(p);
                        onNavigate('product-detail');
                      }}
                      className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#00478D] transition-colors line-clamp-2 cursor-pointer min-h-[32px] sm:min-h-[40px] leading-snug"
                    >
                      {p.name}
                    </h3>
                    
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed hidden sm:block">
                      {p.shortDesc}
                    </p>
                  </div>

                  {/* Compact Spec Sheet */}
                  <div className="px-2 py-1.5 sm:px-4 sm:py-2.5 my-1 sm:my-2 mx-1.5 sm:mx-3 rounded-xs bg-slate-50 border border-slate-200/60 text-[9px] sm:text-[11px] space-y-0.5 sm:space-y-1">
                    {Object.entries(p.specs).slice(0, 2).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-[9px] sm:text-[10px]">
                        <span className="text-slate-500 truncate mr-1.5">{key}:</span>
                        <span className="font-mono font-bold text-slate-700 shrink-0">{val}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Footer: Stock & Action Buttons */}
                <div className="p-2 sm:p-3.5 pt-1.5 sm:pt-2 border-t border-slate-100 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[9px] sm:text-[11px]">
                    <span className="text-slate-500 hidden xs:inline">Tình trạng:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded-xs text-[9px] sm:text-[10px] truncate max-w-full">
                      {p.stockLocation || 'Sẵn kho'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 pt-0.5 sm:pt-1">
                    <button
                      onClick={() => {
                        onSelectProduct(p);
                        onNavigate('product-detail');
                      }}
                      className="flex-1 h-7 sm:h-9 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-0.5 sm:gap-1 cursor-pointer"
                    >
                      <span>Chi tiết</span>
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="h-7 sm:h-9 px-1.5 sm:px-3 rounded-sm bg-[#00478D] hover:bg-[#003B75] text-white text-[10px] sm:text-xs font-bold transition-colors flex items-center gap-0.5 sm:gap-1 cursor-pointer shrink-0"
                      title="Thêm vào giỏ báo giá"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Báo Giá</span>
                      <span className="sm:hidden">Giá</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Murrplastik Full Catalog & CAD Call-to-Action */}
          {activeCategory === 'murrplastik' && (
            <div className="mt-10 p-6 sm:p-8 rounded-sm bg-slate-50 border border-slate-200/90 text-center space-y-3 shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E30613] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E30613]" />
                <span>Catalog &amp; Bản Vẽ Kỹ Thuật CAD Đầy Đủ</span>
              </div>
              <h4 className="font-display text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-tight">
                Khám Phá Hơn 500+ Mã Hàng, Bản Vẽ Kỹ Thuật &amp; Đặt Hàng Tại Chuyên Trang Murrplastik
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Quý khách cần tra cứu bảng kích thước chi tiết, tài liệu kỹ thuật PDF, chứng chỉ chống cháy UL94, hoặc đặt hàng các mã xích dẫn cáp đặc thù cho cánh tay Robot công nghiệp? Ghé thăm chuyên trang Murrplastik Việt Nam để được tư vấn kỹ thuật 1-on-1.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/murrplastik/"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xs bg-[#E30613] hover:bg-[#C8102E] text-white font-display text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  <span>Truy Cập Chuyên Trang Murrplastik Việt Nam</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="/murrplastik/tin-tuc/trien-lam-vec-2026/"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-display text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Mô Phỏng 3D Gian Hàng VEC 2026</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 5. COMPANY IMPACT METRICS BAR (SMOOTH RUNNING COUNTERS) */}
      <section className="py-12 bg-gradient-to-r from-[#003366] via-[#00478D] to-[#005EB8] text-white border-y border-blue-900 shadow-inner scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-sm bg-white/5 backdrop-blur-xs border border-white/10">
              <AnimatedCounter end={100} suffix="%" className="font-display text-3xl sm:text-4xl font-black text-amber-300 tracking-tight block" />
              <div className="text-xs uppercase tracking-wider text-blue-100 mt-1 font-bold">{t('b2b_benefits.co_cq_title')}</div>
              <p className="text-[11px] text-blue-200/80 mt-0.5">{t('b2b_benefits.co_cq_desc')}</p>
            </div>

            <div className="p-4 rounded-sm bg-white/5 backdrop-blur-xs border border-white/10">
              <AnimatedCounter end={500} suffix="+" className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight block" />
              <div className="text-xs uppercase tracking-wider text-blue-100 mt-1 font-bold">Nhà Máy Đối Tác</div>
              <p className="text-[11px] text-blue-200/80 mt-0.5">Các KCN trọng điểm toàn quốc</p>
            </div>

            <div className="p-4 rounded-sm bg-white/5 backdrop-blur-xs border border-white/10">
              <AnimatedCounter end={76} suffix="+" className="font-display text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight block" />
              <div className="text-xs uppercase tracking-wider text-blue-100 mt-1 font-bold">{t('b2b_benefits.stock_title')}</div>
              <p className="text-[11px] text-blue-200/80 mt-0.5">{t('b2b_benefits.stock_desc')}</p>
            </div>

            <div className="p-4 rounded-sm bg-white/5 backdrop-blur-xs border border-white/10">
              <AnimatedCounter end={10} suffix="+" className="font-display text-3xl sm:text-4xl font-black text-amber-300 tracking-tight block" />
              <div className="text-xs uppercase tracking-wider text-blue-100 mt-1 font-bold">{t('b2b_benefits.warranty_title')}</div>
              <p className="text-[11px] text-blue-200/80 mt-0.5">{t('b2b_benefits.warranty_desc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SEO FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00478D] uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Hỏi Đáp Kỹ Thuật & Mua Hàng</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
              Câu Hỏi Thường Gặp (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2">
              Giải đáp chi tiết về tiêu chuẩn CO/CQ, chính sách bảo hành, hỗ trợ chạy thử mẫu tại nhà máy và thời gian báo giá.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-sm bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-slate-900 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-[#00478D] text-xs flex items-center justify-center shrink-0 font-bold font-mono">
                        0{idx + 1}
                      </span>
                      <span>{item.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#00478D]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-in fade-in duration-200">
                      <p className="pl-9">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick FAQ Consultation CTA */}
          <div className="mt-8 p-4 rounded-sm bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="text-xs text-slate-700 font-medium">
              Bạn có câu hỏi kỹ thuật đặc thù cho dây chuyền sản xuất của nhà máy?
            </div>
            <a 
              href={`tel:${COMPANY_INFO.hotlineRaw}`}
              className="px-4 py-2 rounded-xs bg-[#00478D] hover:bg-[#003366] text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>Hotline Tư Vấn: {COMPANY_INFO.hotline}</span>
            </a>
          </div>

        </div>
      </section>

      {/* 6. FLOATING PRODUCT ZOOM PREVIEW MAGNIFIER (DESKTOP INTERACTIVE HOVER) */}
      {hoveredZoomProduct && (
        <div 
          style={{ 
            top: `${hoveredZoomProduct.y}px`, 
            left: hoveredZoomProduct.x + 340 > (typeof window !== 'undefined' ? window.innerWidth : 1200) 
              ? `${hoveredZoomProduct.x - 360}px` 
              : `${hoveredZoomProduct.x}px` 
          }}
          className="fixed z-50 pointer-events-none hidden lg:block w-76 sm:w-80 bg-white rounded-md shadow-[0_25px_70px_rgba(0,31,63,0.35)] border-2 border-[#00478D]/40 p-4 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          <div className="text-[11px] font-bold text-[#00478D] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{hoveredZoomProduct.product.brand}</span>
            <span className="font-mono text-slate-400 text-[10px]">{hoveredZoomProduct.product.sku}</span>
          </div>
          <div className="font-bold text-xs text-slate-900 line-clamp-1 mb-2">
            {hoveredZoomProduct.product.name}
          </div>
          <div className="h-60 w-full bg-slate-50/90 rounded-xs border border-slate-100 p-3 flex items-center justify-center overflow-hidden">
            <img 
              src={hoveredZoomProduct.product.image} 
              alt={hoveredZoomProduct.product.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 scale-110"
            />
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Xuất xứ: <strong className="text-slate-700">{hoveredZoomProduct.product.origin}</strong></span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-xs">
              {hoveredZoomProduct.product.stockStatus}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}

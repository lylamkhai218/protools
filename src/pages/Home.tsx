import { PARTNERS, SOLUTIONS, PRODUCTS } from '../data';
import { Solution, Product } from '../types';
import { FileText, ArrowRight, BookOpen, CheckSquare, ShieldCheck, ChevronRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function Home({ onNavigate, onSelectProduct }: HomeProps) {
  // Let's showcase standard products on the homepage too so users can click into them
  const featuredProduct = PRODUCTS.find(p => p.id === 'hakko-hu-200');

  return (
    <div className="flex-1 bg-zinc-50">
      
      {/* 1. Hero banner matching picture layout */}
      <section className="relative bg-zinc-900 overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* Background circuit-layout graphic representation */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#005eb8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
          <span className="font-display text-xs sm:text-sm font-bold tracking-widest text-tertiary uppercase block mb-4">
            Engineering Excellence 2026
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight max-w-4xl mx-auto">
            Giải pháp thiết bị công nghiệp toàn diện
          </h1>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Cung cấp hệ thống thiết bị kỹ thuật cao cấp, giải pháp tự động hóa và vật tư tiêu hao đạt chuẩn quốc tế cho các nhà máy sản xuất điện tử hiện đại.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('robot')} 
              className="px-8 py-3.5 bg-tertiary hover:bg-amber-500 text-zinc-950 font-display font-bold uppercase tracking-wider rounded-xs shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <span>Khám phá giải pháp</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onNavigate('document-center')} 
              className="px-8 py-3.5 border-2 border-white hover:bg-white/15 text-white font-display font-bold uppercase tracking-wider rounded-xs transition-all text-sm"
            >
              Xem Catalog
            </button>
          </div>
        </div>
      </section>

      {/* 2. Global Strategic Partners Logo Grid */}
      <section className="bg-white py-12 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-sm font-extrabold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
              Đối tác chiến lược toàn cầu
            </h2>
            <div className="h-px bg-zinc-200 w-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {PARTNERS.map((partner) => (
              <div 
                key={partner.name}
                className="flex items-center justify-center h-16 border border-zinc-200 hover:border-primary/40 rounded-sm hover:-translate-y-0.5 transition-all bg-zinc-50/50 p-4 select-none"
              >
                <span className="font-display font-black text-xl text-zinc-400 select-none tracking-widest text-center">
                  {partner.name.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Highlight Product Feature */}
      {featuredProduct && (
        <section className="py-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center bg-white p-8 sm:p-12 border border-zinc-200/80 rounded-sm shadow-xs">
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-sm overflow-hidden aspect-video border border-zinc-200">
                  <img 
                    src={featuredProduct.image} 
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 left-4 bg-[#005eb8] text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider font-display">
                    Sản phẩm tiêu biểu
                  </span>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#005eb8]">HAKKO PREMIUM ROBOT</span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-primary tracking-tight mt-1">
                  {featuredProduct.name}
                </h3>
                <p className="mt-4 text-sm text-zinc-600 leading-relaxed font-light">
                  {featuredProduct.shortDesc}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-zinc-100 py-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block">Độ chính xác</span>
                    <strong className="text-zinc-800 font-medium">± 0.01 mm</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Tốc độ tối đa</span>
                    <strong className="text-zinc-800 font-medium">800 mm/s</strong>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => {
                      onSelectProduct(featuredProduct);
                      onNavigate('product-detail');
                    }}
                    className="px-6 py-3 bg-[#00478d] hover:bg-primary-container text-white text-xs font-display font-bold uppercase tracking-wider rounded-xs transition-colors"
                  >
                    Xem chi tiết cấu hình
                  </button>
                  <button 
                    onClick={() => onNavigate('robot')}
                    className="px-6 py-3 text-primary text-xs font-display font-bold uppercase tracking-wider hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <span>Xem Robot khác</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Engineering Ecosystem (He sinh thai giai phap ky thuat) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase text-primary tracking-tight">
            Hệ sinh thái giải pháp kỹ thuật
          </h2>
          <div className="h-1 bg-tertiary w-16 mx-auto mt-4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SOLUTIONS.map((sol) => {
              // Custom CTA label match images
              let ctaText = 'CHI TIẾT DANH MỤC';
              let tabKey = 'han';
              if (sol.id === 'robot-tu-dong-hoa') {
                ctaText = 'TƯ VẤN HỆ THỐNG';
                tabKey = 'robot';
              } else if (sol.id === 'keo-vat-tu-tieu-hao') {
                ctaText = 'XEM DANH SÁCH';
                tabKey = 'keo';
              } else if (sol.id === 'dung-cu-van-vit') {
                ctaText = 'DỮ LIỆU KỸ THUẬT';
                tabKey = 'van-vit';
              }

              return (
                <div 
                  key={sol.id}
                  className="bg-zinc-50 border border-zinc-200/80 hover:border-primary hover:shadow-lg transition-all rounded-xs p-6 flex flex-col h-full group"
                >
                  <div className="mb-6 flex items-center justify-center w-12 h-12 bg-primary-container/10 group-hover:bg-primary group-hover:text-white text-primary rounded-xs transition-all">
                    <span className="material-symbols-outlined text-2xl">{sol.icon}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors">
                    {sol.title}
                  </h3>
                  <p className="mt-4 text-xs text-zinc-500 font-light leading-relaxed flex-1">
                    {sol.desc}
                  </p>
                  <button 
                    onClick={() => onNavigate(tabKey)}
                    className="mt-8 text-xs font-display font-bold text-zinc-900 hover:text-primary group-hover:translate-x-1.5 transition-all text-left flex items-center gap-1.5 tracking-wider uppercase"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-tertiary group-hover:text-primary transition-all" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Technical Document Database Section */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-primary tracking-tight">
                Trung tâm tài liệu kỹ thuật
              </h2>
              <p className="mt-2 text-sm text-zinc-500 font-light">
                Truy cập kho dữ liệu Catalog và hướng dẫn vận hành mới nhất cho nhà xưởng của bạn.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('document-center')}
              className="mt-4 md:mt-0 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
            >
              Truy cập tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Catalog 1 */}
            <div className="bg-white border-2 border-l-4 border-l-amber-500 border-zinc-200 p-6 rounded-xs hover:shadow-xs transition-all flex flex-col justify-between h-52">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-red-600" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display">T&T Vina Master Catalog</span>
                </div>
                <h3 className="font-display font-bold text-base text-zinc-800 line-clamp-2">
                  Tổng hợp hơn 5000+ thiết bị công nghiệp chủ đạo T&T Vina 2026
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('document-center')}
                className="text-xs font-display font-semibold text-primary/80 hover:text-primary hover:underline flex items-center gap-1.5 mt-4"
              >
                <span>Xem ngay</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Catalog 2 */}
            <div className="bg-white border-2 border-l-4 border-l-[#005eb8] border-zinc-200 p-6 rounded-xs hover:shadow-xs transition-all flex flex-col justify-between h-52">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-secondary" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display">Sản phẩm Hakko FX</span>
                </div>
                <h3 className="font-display font-bold text-base text-zinc-800 line-clamp-2">
                  Hướng dẫn vận hành Hakko FX-888D & Khắc phục lỗi nhiệt độ
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('document-center')}
                className="text-xs font-display font-semibold text-primary/80 hover:text-primary hover:underline flex items-center gap-1.5 mt-4"
              >
                <span>Xem online</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Catalog 3 */}
            <div className="bg-white border-2 border-l-4 border-l-green-600 border-zinc-200 p-6 rounded-xs hover:shadow-xs transition-all flex flex-col justify-between h-52">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display">Quy chuẩn quản lý</span>
                </div>
                <h3 className="font-display font-bold text-base text-zinc-800 line-clamp-2">
                  Chứng nhận hiệu chuẩn & Quy trình kiểm tra thiết bị đo chuẩn đo lường VN
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('document-center')}
                className="text-xs font-display font-semibold text-primary/80 hover:text-primary hover:underline flex items-center gap-1.5 mt-4"
              >
                <span>Tra cứu</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

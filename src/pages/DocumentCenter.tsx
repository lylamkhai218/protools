import { useState, useEffect, useMemo } from 'react';
import { TECHNICAL_DOCUMENTS } from '../data';
import { Document } from '../types';
import { 
  Search, FileText, Download, CheckCircle, HelpCircle, 
  ChevronLeft, ChevronRight, File, ArrowRight, BookOpen
} from 'lucide-react';

interface DocumentCenterProps {
  onNavigate: (tab: string) => void;
}

export default function DocumentCenter({ onNavigate }: DocumentCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadTracker, setDownloadTracker] = useState<Record<string, boolean>>({});
  const [documentsState, setDocumentsState] = useState<Document[]>(TECHNICAL_DOCUMENTS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories = [
    { id: 'all', label: 'Tất cả tài liệu' },
    { id: 'Catalog tổng hợp', label: 'Catalog tổng hợp' },
    { id: 'Hướng dẫn vận hành', label: 'Hướng dẫn vận hành' },
    { id: 'Chứng nhận hiệu chuẩn', label: 'Chứng nhận hiệu chuẩn' }
  ];

  const handleDownload = (id: string) => {
    setDownloadTracker(prev => ({ ...prev, [id]: true }));
    
    // Simulate updating download state locally
    setDocumentsState(prevDocs => 
      prevDocs.map(doc => 
        doc.id === id ? { ...doc, downloadCount: doc.downloadCount + 1 } : doc
      )
    );

    setTimeout(() => {
      setDownloadTracker(prev => ({ ...prev, [id]: false }));
      
      // Simulate real file download action trigger
      const link = window.document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'TTVINA-Technical-Resource.pdf');
      window.document.body.appendChild(link);
      // Clean up quietly
      window.document.body.removeChild(link);
    }, 1500);
  };

  // Filter & Search logic
  const filteredDocuments = documentsState.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting logic
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'newest') {
      // Just simulate by id sort
      return b.id.localeCompare(a.id);
    } else {
      return b.downloadCount - a.downloadCount;
    }
  });

  // Reset page when filters or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const ITEMS_PER_PAGE = 3;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE));
  }, [sortedDocuments]);

  const safePage = Math.min(currentPage, totalPages);

  const paginatedDocuments = useMemo(() => {
    const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
    return sortedDocuments.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedDocuments, safePage]);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    const element = document.getElementById('document-results-header');
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

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    
    // Smooth scroll down to Results Table header on mobile/tablet viewports so users can see results update
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const element = document.getElementById('document-results-header');
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
      }, 50);
    }
  };

  return (
    <div className="flex-1 bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Title */}
        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase text-[#00478d]">
            Trung tâm tài liệu kỹ thuật
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-light leading-relaxed max-w-2xl">
            Tra cứu thông tin kỹ thuật, hướng dẫn vận hành và các chứng nhận chất lượng quốc tế của thiết bị công nghiệp T&T Vina.
          </p>
        </div>

        {/* Search Bar section matching second picture */}
        <div className="bg-white border border-zinc-200 p-6 rounded-xs shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập mã SKU, Model hoặc Tên thiết bị (ví dụ: HAKKO-FX888D)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xs text-sm focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
              />
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
            </div>
            <button 
              onClick={() => {}}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-6 py-3 font-display font-bold uppercase text-xs tracking-wider rounded-xs transition-colors whitespace-nowrap"
            >
              SKU Search
            </button>
          </div>
        </div>

        {/* 2 columns layout: Category navigation list + Document Results sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Sidebar Left Column (3 col) */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white border border-zinc-200/80 rounded-xs overflow-hidden">
              <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200">
                <h3 className="font-display text-xs font-extrabold text-zinc-500 uppercase tracking-widest">
                  Danh mục tài liệu
                </h3>
              </div>
              <nav className="divide-y divide-zinc-100 text-xs font-medium">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-5 py-3.5 transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-zinc-100 text-primary font-bold border-l-4 border-primary' 
                          : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full font-mono font-bold">
                        {cat.id === 'all' 
                          ? documentsState.length 
                          : documentsState.filter(d => d.category === cat.id).length
                        }
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Simulated support widget amber styled (Desktop only) */}
            <div className="hidden lg:block bg-amber-600 text-zinc-950 p-6 rounded-xs space-y-4 relative overflow-hidden shadow-xs">
              <HelpCircle className="h-8 w-8 text-white/50" />
              <h4 className="font-display text-lg font-bold text-white uppercase tracking-tight">Hỗ trợ kỹ thuật 24/7</h4>
              <p className="text-xs text-amber-50 leading-relaxed font-light">
                Bạn không tìm thấy tài liệu kỹ thuật cần thiết cho dây chuyền sản xuất? Tìm kiếm trực tiếp với các chuyên gia hỗ trợ kỹ thuật của chúng tôi.
              </p>
              <button 
                onClick={() => onNavigate('cart')}
                className="w-full bg-zinc-950 text-white hover:bg-zinc-900 py-2.5 font-display text-xs font-bold uppercase rounded-xs transition-colors"
              >
                Gửi yêu cầu
              </button>
            </div>

          </div>

          {/* Table Results Right Column (9 col) */}
          <div id="document-results-header" className="scroll-mt-24 lg:col-span-9 space-y-6 bg-white border border-zinc-200 rounded-xs shadow-xs p-6 md:p-8">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-base font-extrabold text-zinc-800 uppercase">Kết quả tìm kiếm</span>
                <span className="bg-[#d5e0f7] text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  {paginatedDocuments.length} / {sortedDocuments.length} Tài liệu
                </span>
                <span className="text-xs text-zinc-400 font-light">
                  (Trang {safePage}/{totalPages})
                </span>
              </div>
              
              <div className="flex gap-2 items-center text-xs self-stretch sm:self-auto justify-between">
                <span className="text-zinc-400">Sắp xếp:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-xs py-1.5 px-3 focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary font-medium text-zinc-700"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Tải nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* Documents List View - Responsive Table on Desktop, Cards on Mobile */}
            {sortedDocuments.length === 0 ? (
              <div className="py-20 text-center text-zinc-400">
                <File className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                <p className="text-sm">Không tìm thấy tài liệu phù hợp</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Desktop version - Elegant Tabular view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 text-xs font-display font-medium uppercase tracking-wider">
                        <th className="pb-4 w-7/12">Tên tài liệu</th>
                        <th className="pb-4 w-2/12">Model / SKU</th>
                        <th className="pb-4 w-2/12">Dung lượng</th>
                        <th className="pb-4 text-right w-1/12">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {paginatedDocuments.map((doc) => {
                        const isDownloading = downloadTracker[doc.id];
                        return (
                          <tr key={doc.id} className="group hover:bg-zinc-50 transition-colors">
                            <td className="py-4 pr-4">
                              <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <p className="font-bold text-zinc-800 hover:text-[#00478d] transition-colors leading-tight font-sans truncate whitespace-normal max-w-md sm:max-w-lg">
                                    {doc.title}
                                  </p>
                                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                                    Cập nhật: {doc.updatedAt} • Tải xuống: <strong>{doc.downloadCount}</strong> lần
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-4 font-mono text-xs text-zinc-500">{doc.sku}</td>
                            <td className="py-4 pr-4 text-xs text-zinc-400 font-mono">{doc.size}</td>
                            <td className="py-4 text-right">
                              <button
                                disabled={isDownloading}
                                onClick={() => handleDownload(doc.id)}
                                className={`px-3 py-1.5 rounded-xs font-display text-[10px] sm:text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 self-end tracking-wider ${
                                  isDownloading 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-[#f2f3fb] text-[#00478d] hover:bg-primary-container hover:text-white'
                                }`}
                              >
                                {isDownloading ? (
                                  <>
                                    <CheckCircle className="h-3.5 w-3.5 text-white animate-bounce" />
                                    <span>Đang tải...</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Tải xuống</span>
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

                {/* 2. Mobile version - Direct stacked details cards */}
                <div className="md:hidden space-y-4">
                  {paginatedDocuments.map((doc) => {
                    const isDownloading = downloadTracker[doc.id];
                    return (
                      <div 
                        key={doc.id} 
                        className="p-4 border border-zinc-200 rounded-lg bg-zinc-50/45 hover:border-zinc-300 transition-colors flex flex-col gap-3 shadow-2xs"
                      >
                        <div className="flex gap-2.5 items-start">
                          <FileText className="h-5 w-5 text-red-650 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-800 leading-snug font-sans text-xs">
                              {doc.title}
                            </p>
                            <p className="text-[10px] text-zinc-400 mt-1">
                              Cập nhật: {doc.updatedAt} • Tải xuống: <strong>{doc.downloadCount}</strong> lần
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-y border-dashed border-zinc-200/80 py-2.5 text-[11px] text-zinc-500">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-bold mb-0.5">Model / SKU</span>
                            <span className="font-mono font-bold text-zinc-800">{doc.sku}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest block font-bold mb-0.5">Dung lượng</span>
                            <span className="font-mono font-bold text-zinc-700">{doc.size}</span>
                          </div>
                        </div>

                        <div>
                          <button
                            disabled={isDownloading}
                            onClick={() => handleDownload(doc.id)}
                            className={`w-full py-2.5 rounded font-display text-[11px] font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 tracking-wider cursor-pointer ${
                              isDownloading 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-zinc-100 hover:bg-[#00478d]/10 text-[#00478d] border border-zinc-200 active:bg-[#00478d]/25'
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <CheckCircle className="h-3.5 w-3.5 text-white animate-bounce" />
                                <span>Đang tải...</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                <span>Tải xuống tài liệu</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination Controls matched with design */}
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-zinc-200">
              <button 
                disabled={safePage === 1}
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                className="p-1.5 border border-zinc-200 rounded text-zinc-650 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center animate-fade-in"
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === safePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'text-white bg-[#00478d]'
                        : 'border border-zinc-200 text-[#00478d] bg-white hover:bg-zinc-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                disabled={safePage === totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                className="p-1.5 border border-zinc-200 rounded text-zinc-650 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center animate-fade-in"
                title="Trang kế tiếp"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Support widget shown at bottom on mobile/tablet */}
        <div className="lg:hidden mt-4 mb-10 max-w-md mx-auto bg-amber-600 text-zinc-950 p-6 rounded-xs space-y-4 relative overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 text-zinc-950">
            <HelpCircle className="h-6 w-6 text-zinc-950 shrink-0" />
            <h4 className="font-display text-sm font-black uppercase tracking-wider">Hỗ trợ kỹ thuật 24/7</h4>
          </div>
          <p className="text-xs text-zinc-950/90 leading-relaxed font-light">
            Bạn không tìm thấy tài liệu kỹ thuật cần thiết cho dây chuyền sản xuất? Tìm kiếm trực tiếp với các chuyên gia hỗ trợ kỹ thuật của chúng tôi.
          </p>
          <button 
            onClick={() => onNavigate('cart')}
            className="w-full bg-zinc-950 text-white hover:bg-[#001530] py-2.5 font-display text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
          >
            Gửi yêu cầu
          </button>
        </div>

        {/* -------------------- Featured Documents Blocks at bottom -------------------- */}
        <div className="border-t border-zinc-200 pt-16">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-[#00478d] tracking-tight mb-8">
            Tài liệu nổi bật
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Spotlight Card 1 */}
            <div className="bg-zinc-900 text-white p-8 rounded-xs relative overflow-hidden min-h-[220px] flex flex-col justify-between group border border-zinc-800 shadow-xs">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
              <div>
                <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm font-display select-none">Mới nhất</span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight mt-4 group-hover:text-tertiary transition-colors">
                  Giải pháp tự động hóa 4.0
                </h3>
                <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed max-w-md">
                  Khám phá toàn bộ hệ sinh thái thiết bị thông minh và tích hợp phần mềm điều khiển thế hệ mới của T&amp;T Vina cho dây chuyền SMT.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('robot')}
                className="text-xs text-white font-display font-semibold uppercase tracking-wider hover:text-tertiary flex items-center gap-1.5 mt-6 self-start transform group-hover:translate-x-1.5 transition-all cursor-pointer"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="h-4 w-4 text-tertiary" />
              </button>
            </div>

            {/* Spotlight Card 2 */}
            <div className="bg-white border border-zinc-200 p-8 rounded-xs min-h-[220px] flex flex-col justify-between group hover:border-[#005eb8] transition-colors relative shadow-xs">
              <div>
                <div className="text-[#005eb8] mb-1">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-zinc-900 tracking-tight mt-2 group-hover:text-primary transition-colors">
                  Lab Services
                </h3>
                <p className="mt-2 text-xs text-zinc-500 font-light leading-relaxed max-w-sm">
                  Dịch vụ hiệu chuẩn và kiểm định chất lượng phòng sạch của phòng Lab đạt chuẩn ISO/IEC 17025 tại Việt Nam.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('cart')}
                className="text-xs text-primary font-display font-semibold uppercase tracking-wider hover:underline flex items-center gap-1.5 mt-6 self-start transform group-hover:translate-x-1.5 transition-all cursor-pointer"
              >
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="h-4 w-4 text-tertiary" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

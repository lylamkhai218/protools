import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Document } from '../types';
import { TECHNICAL_DOCUMENTS, PARTNERS } from '../data';

interface DocumentCenterProps {
  onNavigate: (tab: string) => void;
}

export default function DocumentCenter({ onNavigate }: DocumentCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredDocs = TECHNICAL_DOCUMENTS.filter(doc => {
    const matchQuery = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchBrand = selectedBrand === 'all' || doc.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchType = selectedType === 'all' || doc.type === selectedType;

    return matchQuery && matchBrand && matchType;
  });

  return (
    <div className="flex-1 bg-slate-50/60 pb-20">
      
      {/* 1. HEADER BANNER (Swiss Engineering Style) */}
      <div className="bg-white border-b border-slate-200/80 py-12 bg-swiss-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706]">
              <BookOpen className="w-4 h-4" />
              <span>Official Engineering Knowledge Hub</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight uppercase">
              Trung Tâm Tài Liệu Kỹ Thuật & Thư Viện 3D STEP
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Tải miễn phí Catalog tổng hợp, hướng dẫn sử dụng tiếng Việt, chứng nhận hiệu chuẩn và bản vẽ CAD/3D chuẩn xác cho kỹ sư thiết kế máy tự động.
            </p>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200 shadow-2xs space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên tài liệu, mã SKU, hãng..."
                className="w-full h-11 pl-10 pr-4 rounded-xs bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00478D] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Brand Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full h-11 px-3 rounded-xs bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#00478D] cursor-pointer"
              >
                <option value="all">Tất cả thương hiệu ({PARTNERS.length})</option>
                {PARTNERS.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Document Type Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-11 px-3 rounded-xs bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#00478D] cursor-pointer"
              >
                <option value="all">Tất cả định dạng file</option>
                <option value="PDF">Tài liệu PDF (Catalog/HDSD)</option>
                <option value="3D STEP">Bản vẽ 3D STEP / CAD</option>
                <option value="Cert">Chứng nhận xuất xưởng (CO/CQ)</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Tìm thấy <strong className="text-slate-900">{filteredDocs.length}</strong> tài liệu kỹ thuật</span>
            {(searchQuery || selectedBrand !== 'all' || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('all');
                  setSelectedType('all');
                }}
                className="text-[#00478D] hover:underline font-semibold"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. DOCUMENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white p-5 sm:p-6 rounded-sm border border-slate-200/90 hover:border-[#00478D]/60 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xs flex items-center justify-center font-display font-bold text-xs uppercase ${
                      doc.type === 'PDF' 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : doc.type === '3D STEP'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {doc.type}
                    </div>
                    <div>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-xs text-[10px] font-bold text-slate-600 uppercase tracking-wider font-display">
                        {doc.brand}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Mã SKU: {doc.sku}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {doc.size}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-slate-900 leading-snug hover:text-[#00478D] transition-colors">
                  {doc.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Nhóm: {doc.category} • Cập nhật: {doc.updatedAt}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Lượt tải: <strong className="text-slate-700">{doc.downloadCount}</strong>
                </span>

                <button
                  onClick={() => alert(`Bắt đầu tải tài liệu: ${doc.title}`)}
                  className="px-4 py-2 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-xs font-display font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Về Ngay</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

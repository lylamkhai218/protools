import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Send, 
  FileSpreadsheet, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  PhoneCall, 
  Mail, 
  User, 
  Plus, 
  Minus,
  Sparkles,
  Download,
  ListPlus,
  Layers,
  HelpCircle,
  FileCode,
  Tag
} from 'lucide-react';
import { CartItem, Product } from '../types';
import { PRODUCTS, COMPANY_INFO } from '../data';

interface CartQuoteProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (tab: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

export default function CartQuote({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
  onAddToCart
}: CartQuoteProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [factoryLocation, setFactoryLocation] = useState('');
  const [projectNote, setProjectNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // BOM Quick Order State
  const [showBomDrawer, setShowBomDrawer] = useState(false);
  const [bomInput, setBomInput] = useState('');
  const [bomStatusMessage, setBomStatusMessage] = useState<string | null>(null);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProcessBOM = (customText?: string) => {
    const rawText = customText !== undefined ? customText : bomInput;
    if (!rawText.trim()) {
      setBomStatusMessage('Vui lòng nhập ít nhất một mã SKU hoặc Part Number!');
      return;
    }

    const lines = rawText.split('\n');
    let addedCount = 0;
    const notFoundList: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Format can be: "SKU, quantity" or "SKU quantity" or "SKU \t quantity" or just "SKU"
      let skuPart = trimmed;
      let qtyPart = 1;

      if (trimmed.includes(',')) {
        const parts = trimmed.split(',');
        skuPart = parts[0].trim();
        qtyPart = parseInt(parts[1]?.trim()) || 1;
      } else if (trimmed.includes('\t')) {
        const parts = trimmed.split('\t');
        skuPart = parts[0].trim();
        qtyPart = parseInt(parts[1]?.trim()) || 1;
      } else if (trimmed.includes(' ')) {
        const parts = trimmed.split(' ');
        const lastPart = parts[parts.length - 1];
        if (!isNaN(parseInt(lastPart))) {
          qtyPart = parseInt(lastPart);
          skuPart = parts.slice(0, parts.length - 1).join(' ').trim();
        }
      }

      // Find matching product by SKU, ID or Name in PRODUCTS
      const matched = PRODUCTS.find(p => 
        p.sku.toLowerCase() === skuPart.toLowerCase() ||
        p.id.toLowerCase() === skuPart.toLowerCase() ||
        p.name.toLowerCase().includes(skuPart.toLowerCase()) ||
        (p.specs && Object.values(p.specs).some(val => val.toLowerCase().includes(skuPart.toLowerCase())))
      );

      if (matched && onAddToCart) {
        onAddToCart(matched, qtyPart);
        addedCount += 1;
      } else {
        notFoundList.push(skuPart);
      }
    });

    if (addedCount > 0) {
      setBomStatusMessage(`Thành công: Đã tự động thêm ${addedCount} thiết bị vào danh sách báo giá!`);
      setBomInput('');
    } else {
      setBomStatusMessage(`Không tìm thấy mã phù hợp trong cơ sở dữ liệu. Vui lòng kiểm tra lại mã SKU.`);
    }
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !phone || !contactName) {
      alert('Vui lòng điền đầy đủ Tên Công ty, Người liên hệ và Số điện thoại!');
      return;
    }

    setIsSubmitting(true);
    // Simulate instant secure RFQ submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onClearCart();
    }, 1200);
  };

  const handleExportCSV = () => {
    if (cartItems.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "STT,Mã SKU,Tên Thiết Bị,Hãng,Số Lượng,Đơn Giá Tham Khảo\n";
    cartItems.forEach((item, idx) => {
      csvContent += `${idx + 1},"${item.product.sku}","${item.product.name}","${item.product.brand}",${item.quantity},"${item.product.price || 'Báo giá dự án'}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Protools_RFQ_Estimate_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 bg-slate-50/60 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-extrabold text-[#0F172A] uppercase">
              Yêu Cầu Báo Giá Đã Gửi Thành Công!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Đội ngũ Kỹ sư Dự án của Protools (T&T VINA) đã tiếp nhận danh mục thiết bị của quý công ty. Chúng tôi sẽ gửi Bảng báo giá chính thức kèm hồ sơ năng lực qua Email & Zalo trong vòng <strong className="text-slate-900">15 – 30 phút</strong>.
            </p>
          </div>

          <div className="p-5 rounded-sm bg-white border border-slate-200 text-xs text-left space-y-2 max-w-md mx-auto shadow-2xs">
            <div className="font-bold text-slate-900 uppercase font-display border-b border-slate-100 pb-1.5 text-xs">
              Thông Tin Tiếp Nhận
            </div>
            <div>Doanh nghiệp: <strong>{companyName || 'Công ty T&T Partner'}</strong></div>
            <div>Người phụ trách: <strong>{contactName || 'Kỹ sư Thu mua'}</strong></div>
            <div>Số điện thoại: <strong>{phone || '0982.xxx.xxx'}</strong></div>
            <div>Trạng thái: <span className="text-emerald-600 font-semibold">Đã chuyển giao bộ phận B2B Sales</span></div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                onNavigate('home');
              }}
              className="px-8 py-3 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-display font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Quay Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50/60 pb-20">
      
      {/* 1. HEADER */}
      <div className="bg-white border-b border-slate-200/80 py-10 bg-swiss-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] block mb-1">
                B2B Bulk Procurement Portal
              </span>
              <h1 className="font-display text-3xl font-extrabold text-[#0F172A] tracking-tight uppercase">
                Giỏ Yêu Cầu Báo Giá Dự Án ({totalItemsCount} Thiết Bị)
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowBomDrawer(!showBomDrawer)}
                className="px-4 py-2 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ListPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>{showBomDrawer ? 'Đóng Công Cụ BOM' : 'Nhập Nhanh Mã BOM (Excel)'}</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2 rounded-xs bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Thêm Thiết Bị Khác</span>
              </button>

              {cartItems.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Xuất File Excel/CSV</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* BOM Quick Order Section (MISUMI Style) */}
        {showBomDrawer && (
          <div className="mb-8 p-6 rounded-sm bg-white border-2 border-[#00478D] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-[#00478D]" />
                <h3 className="font-display font-bold text-sm uppercase text-slate-900">
                  Công Cụ Nhập Nhanh Mã Linh Kiện Hàng Loạt (BOM Quick Quote)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Chuẩn mua hàng nhà máy B2B</span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Dán trực tiếp danh sách mã SKU / Part Number từ Excel hoặc bảng kê vật tư vào ô bên dưới. Định dạng hỗ trợ: <code className="bg-slate-100 px-1.5 py-0.5 rounded-xs font-mono text-slate-800">[Mã SKU], [Số lượng]</code> hoặc mỗi dòng một mã.
            </p>

            {/* Pre-filled BOM Sample Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Nạp mẫu nhanh:</span>
              <button
                onClick={() => handleProcessBOM("HK-936, 5\nHIOS-1002, 3\nCM-1003, 1")}
                className="px-2.5 py-1 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                + Dây Chuyền Hàn & Bắt Vít
              </button>
              <button
                onClick={() => handleProcessBOM("MP-1076, 10\nMP-1074, 5\nMP-1078, 2")}
                className="px-2.5 py-1 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                + Xích Dẫn Cáp Robot Murrplastik
              </button>
              <button
                onClick={() => handleProcessBOM("ESD-1065, 4\nHP-1037, 2\nMIC-1045, 2")}
                className="px-2.5 py-1 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                + Phòng Sạch & Đo Lường ESD
              </button>
            </div>

            <div className="pt-3 space-y-3">
              <textarea
                rows={4}
                value={bomInput}
                onChange={(e) => setBomInput(e.target.value)}
                placeholder={"Ví dụ:\nHK-936, 5\nHIOS-1002, 3\nMP-1076, 10\nZCUT-1033, 1"}
                className="w-full p-3 rounded-xs border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#00478D] bg-slate-50/50"
              />

              {bomStatusMessage && (
                <div className="p-3 rounded-xs bg-blue-50 border border-blue-200 text-xs font-semibold text-[#00478D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>{bomStatusMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleProcessBOM()}
                  className="px-6 py-2.5 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white text-xs font-bold uppercase tracking-wider font-display transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <ListPlus className="w-4 h-4 text-amber-300" />
                  <span>Phân Tích & Thêm Vào Báo Giá</span>
                </button>

                <button
                  onClick={() => setShowBomDrawer(false)}
                  className="text-xs text-slate-500 hover:underline font-medium cursor-pointer"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        )}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-sm border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 uppercase">
              Giỏ Báo Giá Hiện Đang Trống
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quý khách vui lòng chọn các thiết bị công nghiệp từ danh mục để tạo danh sách yêu cầu báo giá dự án nhanh.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 rounded-xs bg-[#00478D] text-white text-xs font-bold uppercase tracking-wider font-display hover:bg-[#003B75] transition-colors"
            >
              Khám Phá Danh Mục Thiết Bị
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Col (7/12): Items Table */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="bg-white rounded-sm border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-700">
                    Danh Sách Thiết Bị Cần Báo Giá
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa tất cả</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-xs border border-slate-200 bg-white shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded-xs bg-[#00478D] text-white text-[9px] font-bold font-display uppercase">
                              {item.product.brand}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              SKU: {item.product.sku}
                            </span>
                          </div>

                          <h4 className="font-display text-sm font-bold text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>

                          <div className="text-xs font-semibold text-[#00478D]">
                            {item.product.price || 'Giá thỏa thuận theo số lượng'}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="flex items-center border border-slate-200 rounded-xs bg-slate-50 h-9">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-full text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-xs font-mono font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-full text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          title="Xóa thiết bị"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* B2B Guarantee badges */}
              <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-600 bg-white p-4 rounded-sm border border-slate-200">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#00478D]" />
                  <span>100% Đầy đủ CO/CQ</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Building2 className="w-4 h-4 text-[#D97706]" />
                  <span>Hỗ trợ hồ sơ thầu B2B</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bảo hành chính hãng</span>
                </div>
              </div>

            </div>

            {/* Right Col (5/12): Procurement Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 sm:p-7 space-y-5">
                
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display text-lg font-bold text-[#0F172A] uppercase">
                    Thông Tin Doanh Nghiệp Nhận Báo Giá
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chúng tôi sẽ lập bảng dự toán chi tiết và gửi lại cho quý công ty.
                  </p>
                </div>

                <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
                  
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tên Doanh Nghiệp / Nhà Máy <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="VD: Công ty TNHH Điện Tử Samsung / Foxconn..."
                        className="w-full h-10 pl-9 pr-3 rounded-xs border border-slate-200 focus:outline-none focus:border-[#00478D] font-medium text-slate-800"
                      />
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Người Phụ Trách / Kỹ Sư <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Họ và tên..."
                          className="w-full h-10 pl-9 pr-3 rounded-xs border border-slate-200 focus:outline-none focus:border-[#00478D] font-medium text-slate-800"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Số Điện Thoại / Zalo <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0982.xxx.xxx"
                          className="w-full h-10 pl-9 pr-3 rounded-xs border border-slate-200 focus:outline-none focus:border-[#00478D] font-medium text-slate-800"
                        />
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Nhận File Báo Giá (PDF)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="purchasing@company.com"
                        className="w-full h-10 pl-9 pr-3 rounded-xs border border-slate-200 focus:outline-none focus:border-[#00478D] font-medium text-slate-800"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Khu Công Nghiệp / Địa Điểm Giao Hàng
                    </label>
                    <input
                      type="text"
                      value={factoryLocation}
                      onChange={(e) => setFactoryLocation(e.target.value)}
                      placeholder="VD: KCN Yên Phong, Bắc Ninh hoặc KCN VSIP Hải Phòng..."
                      className="w-full h-10 px-3 rounded-xs border border-slate-200 focus:outline-none focus:border-[#00478D] font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Yêu Cầu Kỹ Thuật Đặc Biệt (Nếu có)
                    </label>
                    <textarea
                      rows={3}
                      value={projectNote}
                      onChange={(e) => setProjectNote(e.target.value)}
                      placeholder="Ghi chú về điện áp, xuất xứ, thời gian cần hàng hoặc yêu cầu demo chạy thử tại nhà máy..."
                      className="w-full p-2.5 rounded-xs border border-slate-200 focus:outline-none focus:border-[#00478D] font-medium text-slate-800 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xs bg-[#00478D] hover:bg-[#003B75] text-white font-display font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Đang Xử Lý Gửi Báo Giá...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Gửi Yêu Cầu Báo Giá Chính Thức</span>
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-center text-slate-400 pt-1">
                    Bảo mật tuyệt đối thông tin doanh nghiệp theo tiêu chuẩn B2B.
                  </div>

                </form>

              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

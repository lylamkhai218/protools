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
  Download,
  Layers,
  HelpCircle,
  FileCode,
  Tag
} from 'lucide-react';
import { CartItem, Product } from '../types';
import { PRODUCTS, COMPANY_INFO } from '../data';
import { useTranslation } from '../i18n/LanguageContext';

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
  const { t, locale } = useTranslation();
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [factoryLocation, setFactoryLocation] = useState('');
  const [projectNote, setProjectNote] = useState('');
  const [hpFax, setHpFax] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Honeypot spam trap
    if (hpFax) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        onClearCart();
      }, 500);
      return;
    }

    const cleanCompany = companyName.trim();
    const cleanContact = contactName.trim();
    const cleanPhone = phone.replace(/\s+/g, '');
    const cleanEmail = email.trim();

    if (!cleanCompany || !cleanPhone || !cleanContact) {
      setErrorMessage('Vui lòng điền đầy đủ Tên Doanh Nghiệp, Người Phụ Trách và Số Điện Thoại!');
      return;
    }

    const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập số di động 10 chữ số (VD: 0982xxxxxx).');
      return;
    }

    if (cleanEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setErrorMessage('Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.');
        return;
      }
    }

    if (cartItems.length === 0) {
      setErrorMessage('Giỏ yêu cầu báo giá đang trống. Vui lòng chọn ít nhất 1 thiết bị.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      companyName: cleanCompany,
      contactName: cleanContact,
      phone: cleanPhone,
      email: cleanEmail,
      factoryLocation: factoryLocation.trim(),
      projectNote: projectNote.trim(),
      hp_fax: hpFax,
      totalCount: totalItemsCount,
      items: cartItems.map((item, idx) => ({
        stt: idx + 1,
        sku: item.product.sku,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        price: item.product.price || 'Báo giá dự án'
      }))
    };

    try {
      const res = await fetch('/api/submit_quote.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({ success: true }));
        if (data.success !== false) {
          setIsSubmitting(false);
          setIsSubmitted(true);
          onClearCart();
          return;
        }
        throw new Error(data.message || 'Lỗi xử lý tiếp nhận báo giá.');
      }

      // If in local development or server returns non-200, check if 404 (dev server without PHP)
      if (res.status === 404 && window.location.hostname === 'localhost') {
        console.log('[LOCAL DEV MOCK] Đã tiếp nhận đơn B2B RFQ giả lập trên localhost:', payload);
        setIsSubmitting(false);
        setIsSubmitted(true);
        onClearCart();
        return;
      }

      throw new Error(`Máy chủ phản hồi mã lỗi: ${res.status}`);
    } catch (err: any) {
      // In localhost without PHP backend, simulate successful flow for UI testing
      if (window.location.hostname === 'localhost') {
        console.warn('[LOCAL DEV MOCK] Backend /api/submit_quote.php không khả dụng trên Vite dev server, chuyển sang chế độ test thành công:', payload);
        setIsSubmitting(false);
        setIsSubmitted(true);
        onClearCart();
        return;
      }

      console.error('Lỗi gửi báo giá:', err);
      setIsSubmitting(false);
      setErrorMessage('Không thể kết nối đến máy chủ tiếp nhận báo giá. Quý khách vui lòng gọi Hotline 0943.301.886 hoặc Zalo để được hỗ trợ tức thời.');
    }
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
                {t('cart_rfq.title')} ({totalItemsCount})
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
                  <span>{t('cart_rfq.download_csv')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-sm border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 uppercase">
              {t('cart_rfq.empty')}
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
                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xs animate-in fade-in">
                      {errorMessage}
                    </div>
                  )}

                  {/* Anti-spam honeypot field */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="hp_fax">Fax</label>
                    <input
                      id="hp_fax"
                      name="hp_fax"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={hpFax}
                      onChange={(e) => setHpFax(e.target.value)}
                    />
                  </div>

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
                        <span>{t('cart_rfq.btn_submit')}</span>
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

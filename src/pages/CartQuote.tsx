import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { 
  Plus, Minus, Trash2, ArrowLeft, Send, CheckCircle, Info, ShieldAlert, Lock, HelpCircle
} from 'lucide-react';

interface CartQuoteProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigate: (tab: string) => void;
  userEmail?: string;
  onClearCart: () => void;
}

export default function CartQuote({ 
  cartItems, onUpdateQuantity, onRemoveItem, onNavigate, userEmail, onClearCart 
}: CartQuoteProps) {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  
  // Submit animation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rfqNumber, setRfqNumber] = useState('');

  // Count sums
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate real web transmission request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Random RFQ identity
      const randomId = Math.floor(100000 + Math.random() * 900000);
      setRfqNumber(`RFQ-${randomId}`);
    }, 2000);
  };

  const resetForm = () => {
    setFullName('');
    setCompanyName('');
    setPhone('');
    setProjectDesc('');
    setSubmitSuccess(false);
    onClearCart();
  };

  return (
    <div className="flex-1 bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Quote Page Header matching pictures layout color scheme */}
        <div className="flex items-center gap-3.5 mb-10 border-l-4 border-[#00478d] pl-4">
          <h1 className="font-display text-3xl font-extrabold uppercase text-[#00478d] tracking-tight">
            Giỏ hàng báo giá
          </h1>
        </div>

        {submitSuccess ? (
          /* -------------------- Submission Success Screen -------------------- */
          <div className="bg-white border border-zinc-200 rounded-xs shadow-lg max-w-2xl mx-auto p-10 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 flex items-center justify-center rounded-full text-green-600">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-extrabold uppercase text-primary">gửi yêu cầu thành công!</h2>
              <p className="text-sm text-zinc-500 font-light">
                Mã số báo giá yêu cầu của bạn là <strong className="font-mono text-zinc-800 bg-zinc-100 px-2 py-1 rounded">{rfqNumber}</strong>.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs text-xs text-left max-w-md mx-auto space-y-2.5">
              <p className="text-zinc-600">Chúng tôi đã chuyển tiếp thông số cấu hình và tài liệu kỹ thuật của bạn tới bộ phận thiết kế giải pháp T&amp;T Vina.</p>
              <p className="text-zinc-700"><strong>Người nhận:</strong> {fullName || 'Quý khách'}</p>
              <p className="text-zinc-700"><strong>Đại diện:</strong> {companyName || 'Doanh nghiệp sản xuất'}</p>
              <p className="text-zinc-700"><strong>Email phản hồi:</strong> {workEmail}</p>
              <p className="text-zinc-400 text-[11px] leading-relaxed pt-2 border-t border-zinc-200">
                ⌛ Một chuyên viên kỹ thuật kinh doanh của chúng tôi sẽ phản hồi bảng báo giá PDF và tư vấn kỹ thuật trực tiếp vào hộp thư của bạn trong vòng 1-2 giờ làm việc.
              </p>
            </div>

            <button
              onClick={resetForm}
              className="px-8 py-3.5 bg-primary hover:bg-primary-container text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs shadow-md transition-all cursor-pointer"
            >
              Tiếp tục tham quan sản phẩm
            </button>
          </div>
        ) : (
          /* -------------------- Main Quote Basket Layout -------------------- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT Column: Selected Items (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-sm p-6 space-y-8">
              
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <span className="font-display text-xs font-extrabold text-zinc-400 uppercase tracking-widest">Sản phẩm tuyển chọn</span>
                <span className="text-xs text-zinc-500">{cartItems.length} sản phẩm độc lập</span>
              </div>

              {cartItems.length === 0 ? (
                /* Empty Cart */
                <div className="py-20 text-center space-y-4">
                  <div className="text-zinc-300">
                    <span className="material-symbols-outlined text-6xl">shopping_cart_off</span>
                  </div>
                  <p className="text-sm text-zinc-500">Giỏ hàng báo giá của bạn đang trống.</p>
                  <button 
                    onClick={() => onNavigate('home')}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline font-sans"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại chọn sản phẩm thiết bị
                  </button>
                </div>
              ) : (
                /* Listed Items with plus/minus */
                <div className="space-y-6">
                  <div className="space-y-4 divide-y divide-zinc-100">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-4 pt-4 first:pt-0 items-start">
                        {/* Photo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 border border-zinc-200 rounded-xs overflow-hidden flex-none">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-zinc-800 text-sm sm:text-base leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 font-mono">SKU: {item.product.sku}</p>
                          <p className="text-[11px] font-sans text-primary font-medium mt-1">
                            Yêu cầu: <span className="underline decoration-dotted">Tư vấn kỹ thuật</span>
                          </p>
                        </div>

                        {/* Quantity Counter adjustment */}
                        <div className="flex items-center border border-zinc-300 rounded-xs overflow-hidden shrink-0 bg-zinc-50">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-500 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1 text-xs font-bold font-mono text-zinc-800 bg-white select-none">
                            {item.quantity.toString().padStart(2, '0')}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-500 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Trash action button */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xs border border-zinc-200 sm:flex shrink-0 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    ))}
                  </div>

                  {/* Back CTA + Summary count block */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-50 p-5 border border-zinc-200/60 rounded-xs mt-8 gap-4">
                    <button 
                      onClick={() => onNavigate('home')}
                      className="text-xs font-display font-bold text-primary hover:text-primary-container inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                      <ArrowLeft className="h-4 w-4 text-tertiary" />
                       Tiếp tục chọn sản phẩm
                    </button>
                    
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] text-zinc-400 font-display font-extrabold tracking-widest uppercase">Tổng số lượng sản phẩm</p>
                      <p className="font-display font-extrabold text-[#00478d] text-2xl sm:text-3xl mt-1 leading-none">
                        {totalItemsCount.toString().padStart(2, '0')} Đơn vị
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* RIGHT Column: RFQ Form Pictured (5 cols) */}
            <div className="lg:col-span-5">
              
              <form 
                onSubmit={handleSubmit}
                className="bg-white border border-zinc-200 rounded-xs shadow-xs p-6 space-y-5"
              >
                
                <div className="flex items-center gap-2 mb-2 border-b border-zinc-100 pb-3">
                  <span className="material-symbols-outlined text-[#005eb8]">article</span>
                  <h3 className="font-display text-lg font-extrabold text-[#00478d] uppercase tracking-tight">Yêu cầu báo giá nhanh</h3>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider">
                    Công ty *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tên doanh nghiệp của bạn"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                {/* Work Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider">
                    Email công việc *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@company.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="024 XXXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                {/* Technical description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider">
                    Mô tả dự án
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Yêu cầu cụ thể về kỹ thuật, tiến độ..."
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                  />
                </div>

                {/* Info Note alert box pictured */}
                <div className="bg-zinc-50 border-l-4 border-l-amber-500 border-zinc-200 p-3 flex gap-2.5 items-start">
                  <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans font-light">
                    Chuyên viên kỹ thuật sản phẩm của T&amp;T Vina sẽ phản hồi bảng báo giá chính thức kèm bản vẽ phân tích trong vòng <strong>1-2 giờ</strong> làm việc.
                  </p>
                </div>

                {/* Submit button dynamic action */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full py-4 bg-[#00478d] hover:bg-primary-container text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-display font-bold uppercase tracking-widest rounded-xs shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>ĐANG XỬ LÝ...</span>
                    </>
                  ) : (
                    <>
                      <span>GỬI YÊU CẦU BÁO GIÁ</span>
                      <Send className="h-3.5 w-3.5 fill-white" />
                    </>
                  )}
                </button>

                {/* Trust standards footer icons */}
                <div className="flex justify-center gap-4 text-[10px] text-zinc-400 pt-3 border-t border-zinc-100">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    ISO 9001:2015
                  </span>
                  <span className="text-zinc-200">|</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3 text-[#005eb8]" />
                    Secure Privacy
                  </span>
                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

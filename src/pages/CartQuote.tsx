import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { 
  Plus, Minus, Trash2, ArrowLeft, Send, CheckCircle, Info, Lock, Building, User, Mail, PhoneCall, FileText
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface CartQuoteProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigate: (tab: string) => void;
  userEmail?: string;
  onClearCart: () => void;
  onSubmitQuote?: (quote: {
    fullName: string;
    companyName: string;
    workEmail: string;
    phone: string;
    projectDesc: string;
    items: string;
  }) => Promise<void>;
}

export default function CartQuote({ 
  cartItems, onUpdateQuantity, onRemoveItem, onNavigate, userEmail, onClearCart, onSubmitQuote 
}: CartQuoteProps) {
  const { currentLang, t } = useLanguage();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    const itemsDescription = cartItems.map(item => `${item.product.name} (SKU: ${item.product.sku}) x${item.quantity}`).join('; ');

    try {
      if (onSubmitQuote) {
        await onSubmitQuote({
          fullName,
          companyName,
          workEmail,
          phone,
          projectDesc,
          items: itemsDescription
        });
      }
      setIsSubmitting(false);
      setSubmitSuccess(true);
      const randomId = Math.floor(100000 + Math.random() * 900000);
      setRfqNumber(`RFQ-${randomId}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      const randomId = Math.floor(100000 + Math.random() * 900000);
      setRfqNumber(`RFQ-${randomId}`);
    }
  };

  const resetForm = () => {
    setFullName('');
    setCompanyName('');
    setPhone('');
    setProjectDesc('');
    setSubmitSuccess(false);
    onClearCart();
  };

  const isVi = currentLang.code === 'VI';

  return (
    <div className="flex-1 bg-zinc-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Quote Page Header matching pictures layout color scheme */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 border-l-4 border-[#00478d] pl-4">
          <div>
            <span className="text-[10px] font-bold text-[#00478d]/60 uppercase tracking-widest block mb-0.5">
              {isVi ? 'Yêu cầu báo giá thiết bị công nghiệp' : 'Industrial RFQ System'}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#00478d] tracking-tight leading-none">
              {t('cartTitle')}
            </h1>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={() => {
                if(confirm(isVi ? "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm đã chọn?" : "Are you sure you want to clear your RFQ list?")) {
                  onClearCart();
                }
              }}
              className="self-start sm:self-auto text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100/70 px-2.5 py-1.5 rounded transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isVi ? 'Xóa toàn bộ' : 'Clear RFQ List'}
            </button>
          )}
        </div>

        {submitSuccess ? (
          /* -------------------- Submission Success Screen -------------------- */
          <div className="bg-white border border-zinc-250 rounded-lg shadow-xl max-w-2xl mx-auto p-6 sm:p-10 text-center space-y-6 sm:space-y-8 animate-fade-in">
            <div className="mx-auto w-16 h-16 bg-emerald-50 flex items-center justify-center rounded-full text-emerald-600 border border-emerald-200">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-black uppercase text-[#00478d] tracking-tight">
                {t('rfqSuccessTitle')}
              </h2>
              <p className="text-sm text-zinc-500 font-light">
                {t('rfqSuccessId')} <strong className="font-mono text-zinc-800 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">{rfqNumber}</strong>.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-md text-xs text-left max-w-lg mx-auto space-y-3 shadow-2xs">
              <p className="text-zinc-650 leading-relaxed pb-2.5 border-b border-zinc-200">
                🚀 {t('rfqSuccessText')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700 pt-1.5 gap-y-2.5">
                <p><strong>👤 {isVi ? 'Người liên hệ:' : 'Recipient:'}</strong> {fullName || 'Quý khách'}</p>
                <p><strong>🏢 {isVi ? 'Doanh nghiệp:' : 'Company:'}</strong> {companyName || 'Đối tác'}</p>
                <p><strong>📧 {isVi ? 'Email liên hệ:' : 'Work Email:'}</strong> {workEmail}</p>
                <p><strong>📞 {isVi ? 'Kênh liên hệ:' : 'Telephone:'}</strong> {phone}</p>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed pt-3 border-t border-zinc-200">
                ⚙️ {t('rfqInfoBox')}
              </p>
            </div>

            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#00478d] hover:bg-[#005eb8] text-white font-display text-xs font-bold uppercase tracking-wider rounded-md shadow-md transition-all cursor-pointer"
            >
              {t('rfqSuccessCta')}
            </button>
          </div>
        ) : (
          /* -------------------- Main Quote Basket Layout -------------------- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* LEFT Column: Selected Items (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-4 sm:p-6 space-y-6 sm:space-y-8 shadow-sm">
              
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <span className="font-display text-xs font-black text-[#00478d] uppercase tracking-wider">
                  {t('cartProducts')}
                </span>
                <span className="text-xs text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full font-bold">
                  {cartItems.length} {t('cartCountDesc')}
                </span>
              </div>

              {cartItems.length === 0 ? (
                /* Empty Cart */
                <div className="py-20 text-center space-y-4">
                  <div className="text-zinc-300">
                    <span className="material-symbols-outlined text-6xl">shopping_cart_off</span>
                  </div>
                  <p className="text-sm text-zinc-500">{t('emptyCart')}</p>
                  <button 
                    onClick={() => onNavigate('home')}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline font-sans uppercase tracking-wider"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('backToProducts')}
                  </button>
                </div>
              ) : (
                /* Listed Items with plus/minus */
                <div className="space-y-6">
                  <div className="space-y-4 divide-y divide-zinc-200/60">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex flex-col sm:flex-row gap-4 pt-4 first:pt-0 items-stretch sm:items-start border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex gap-3.5 items-start flex-1">
                          {/* Photo */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden flex-none shadow-2xs">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-sans font-bold text-zinc-900 text-xs sm:text-sm md:text-base leading-snug line-clamp-2">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-zinc-400 mt-1 font-mono">{t('sku')}: {item.product.sku}</p>
                            <p className="text-[10px] text-[#005eb8] font-bold mt-1 font-sans flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {t('reqQuoteDetail')}
                            </p>
                          </div>
                        </div>

                        {/* Controls (Counter & Trash) */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-dashed border-zinc-100 sm:border-y-0 sm:border-t-0 shrink-0">
                          {/* Label shown on mobile only */}
                          <span className="text-xs text-zinc-500 font-bold sm:hidden">
                            {isVi ? 'Số lượng yêu cầu:' : 'Requested quantity:'}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {/* Quantity Counter adjustment */}
                            <div className="flex items-center border border-zinc-300 rounded-md overflow-hidden shrink-0 bg-zinc-50 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3.5 py-1 text-xs font-bold font-mono text-zinc-800 bg-white select-none min-w-[28px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 px-2.5 hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Trash action button */}
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.product.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded-md border border-zinc-200 shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
                              title={isVi ? 'Xóa khỏi báo giá' : 'Remove from RFQ'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* Back CTA + Summary count block */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-50 p-4 sm:p-5 border border-zinc-200 rounded-lg mt-8 gap-4">
                    <button 
                      onClick={() => onNavigate('home')}
                      className="text-xs font-display font-bold text-primary hover:text-primary-container inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                    >
                      <ArrowLeft className="h-4 w-4 text-tertiary" />
                      {t('btnContinueSelect')}
                    </button>
                    
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] text-zinc-400 font-display font-extrabold tracking-widest uppercase">{t('totalQuantity')}</p>
                      <p className="font-display font-extrabold text-[#00478d] text-2xl sm:text-3xl mt-0.5 leading-none">
                        {totalItemsCount.toString().padStart(2, '0')} {t('totalUnits')}
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
                className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 sm:p-6 space-y-4 sm:space-y-5"
              >
                
                <div className="flex items-center gap-2 mb-2 border-b border-zinc-100 pb-3">
                  <span className="material-symbols-outlined text-[#005eb8]">article</span>
                  <h3 className="font-display text-base sm:text-lg font-black text-[#00478d] uppercase tracking-tight">
                    {t('quoteReqFastTitle')}
                  </h3>
                </div>

                {/* Name field */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700">
                    {t('fullNameLabel')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t('fullNamePl')}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans shadow-2xs"
                    />
                    <User className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Company field */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700">
                    {t('companyLabel')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t('companyPl')}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans shadow-2xs"
                    />
                    <Building className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Work Email field */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700">
                    {t('workEmailLabel')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder={t('workEmailPl')}
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans shadow-2xs"
                    />
                    <Mail className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Phone field */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700">
                    {t('phoneLabel')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={t('phonePl')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-zinc-50 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans shadow-2xs"
                    />
                    <PhoneCall className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Technical description field */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-700">
                    {t('projectDescLabel')}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      placeholder={t('projectDescPl')}
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-md text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans shadow-2xs resize-none"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>

                {/* Info Note alert box pictured */}
                <div className="bg-amber-50 border-l-4 border-l-amber-500 border-amber-200/60 p-3 sm:p-4 flex gap-2.5 items-start rounded-r-md">
                  <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-900/90 leading-relaxed font-sans font-medium">
                    {t('rfqInfoBox')}
                  </p>
                </div>

                {/* Submit button dynamic action */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full py-3.5 sm:py-4 bg-[#00478d] hover:bg-[#005eb8] text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-display font-bold uppercase tracking-widest rounded-md shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>{t('btnSendingQuote')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('btnSendQuote')}</span>
                      <Send className="h-3.5 w-3.5 fill-white" />
                    </>
                  )}
                </button>

                {/* Trust standards footer icons */}
                <div className="flex justify-center gap-4 text-[10px] text-zinc-400 pt-3 border-t border-zinc-100">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    ISO 9001:2015
                  </span>
                  <span className="text-zinc-200">|</span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Lock className="h-3 w-3 text-[#005eb8]" />
                    {t('securePrivacy')}
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

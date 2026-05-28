import { useState } from 'react';
import { Product } from '../types';
import { ACCESSORIES } from '../data';
import { 
  FileCheck, Shield, Award, HelpCircle, Download, Check, ArrowRight, Play, Eye
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product | any) => void;
  onNavigate: (tab: string) => void;
  onSelectProduct: (p: Product) => void;
}

export default function ProductDetail({ product, onAddToCart, onNavigate, onSelectProduct }: ProductDetailProps) {
  const { currentLang, t } = useLanguage();
  // Gallery items matching image layout thumbnails
  const galleryImages = product.images || [product.image];
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [activeTab, setActiveTab] = useState('specs');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const handleAddToCartWithFeedback = (item: any) => {
    onAddToCart(item);
    setAddedItemName(item.name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 3000);
  };

  const tabs = [
    { id: 'specs', label: t('specsTab') },
    { id: 'apps', label: t('appsTab') },
    { id: 'docs', label: t('docsTab') }
  ];

  return (
    <div className="flex-1 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs matching layout */}
        <nav className="text-xs text-zinc-500 mb-6 flex items-center gap-1.5 font-sans animate-fade-in">
          <span className="hover:text-primary cursor-pointer" onClick={() => onNavigate('home')}>{t('home')}</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer" onClick={() => onNavigate('robot')}>{t('robot')}</span>
          <span>/</span>
          <span className="text-zinc-800 font-medium">{product.name}</span>
        </nav>

        {/* Top section: Gallery + Main Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative border border-zinc-200 rounded-xs overflow-hidden aspect-square bg-zinc-50 flex items-center justify-center group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded-xs overflow-hidden aspect-square hover:border-primary transition-all bg-zinc-50 ${
                    activeImage === img ? 'border-primary ring-1 ring-primary/20' : 'border-zinc-200'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Key info and Quick actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 items-center text-xs mb-2">
                <span className="text-zinc-400 font-mono">SKU: {product.sku}</span>
                <span className="text-zinc-300">•</span>
                <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-green-600 rounded-full animate-pulse"></span>
                  {t('statusInStock')}
                </span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#00478d] leading-tight uppercase animate-fade-in">
                {product.name}
              </h1>
            </div>

            <p className="text-zinc-600 text-sm font-light leading-relaxed">
              {currentLang.code === 'VI' ? product.shortDesc : 'Premium configuration system tailored with optimal workspace specifications, built for electronic factories requiring absolute precision and reliability.'}
            </p>

            {/* Quick Specs Blocks Pictured */}
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xs p-4 grid grid-cols-3 gap-4 text-center divide-x divide-zinc-200">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-display block">{t('maxSpeed')}</span>
                <span className="font-display font-extrabold text-[#00478d] text-lg sm:text-xl block mt-1">800 mm/s</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-display block pl-2">{t('accuracy')}</span>
                <span className="font-display font-extrabold text-[#00478d] text-lg sm:text-xl block mt-1 pl-2">± 0.01 mm</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-display block pl-2">{t('workArea')}</span>
                <span className="font-display font-extrabold text-[#00478d] text-lg sm:text-xl block mt-1 pl-2">200 x 200 mm</span>
              </div>
            </div>

            {/* Add to Quotes CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleAddToCartWithFeedback(product)}
                className="w-full bg-[#00478d] hover:bg-primary-container text-white py-4 px-6 rounded-xs font-display font-extrabold text-sm uppercase tracking-widest transition-all relative overflow-hidden flex items-center justify-center gap-2 group shadow-xs cursor-pointer"
              >
                <span>{t('btnQuickRfq')}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => onNavigate('document-center')}
                className="w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-700 py-3 rounded-xs font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                {t('btnDownloadCatalog')}
              </button>
            </div>

            {/* Security and service validation footnotes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <strong className="font-semibold block text-zinc-700">{t('genuineWarranty')}</strong>
                  <span className="text-[11px] text-zinc-400">{t('genuineWarrantyDesc')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-tertiary" />
                <div>
                  <strong className="font-semibold block text-zinc-700">{t('techSupport')}</strong>
                  <span className="text-[11px] text-zinc-400">{t('techSupportDesc')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* -------------------- Interactive Block Tabs -------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
          
          {/* Main Block left container (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Headers tabs controls */}
            <div className="flex border-b border-zinc-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 px-6 font-display font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Details tabs panels */}
            <div className="space-y-8">
              {activeTab === 'specs' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 bg-primary" />
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-zinc-900 tracking-tight">{t('specsTab')}</h2>
                  </div>
                  
                  <div className="border border-zinc-200 overflow-hidden rounded-xs">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specs && Object.entries(product.specs).map(([label, val], idx) => (
                          <tr 
                            key={idx} 
                            className={`border-b border-zinc-200 ${idx % 2 === 0 ? 'bg-zinc-50' : 'bg-white'}`}
                          >
                            <td className="px-5 py-3 font-semibold text-zinc-700 w-1/3">{label}</td>
                            <td className="px-5 py-3 text-zinc-600 font-mono text-xs">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'apps' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 bg-[#005eb8]" />
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-zinc-900 tracking-tight">{t('appsTab')}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {product.applications?.map((app, idx) => (
                      <div key={idx} className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs">
                        <div className="mb-4 flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-xs">
                          <span className="material-symbols-outlined">{app.icon}</span>
                        </div>
                        <h3 className="font-display text-base font-bold text-zinc-900">{app.name}</h3>
                        <p className="mt-2 text-xs text-zinc-500 font-light leading-relaxed">{app.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1.5 bg-zinc-950" />
                    <h2 className="font-display text-xl sm:text-2xl font-primary font-extrabold uppercase text-zinc-900 tracking-tight">{t('docsTab')}</h2>
                  </div>

                  <div className="space-y-3">
                    {product.documents?.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-200 rounded-sm hover:border-[#00478d] transition-all"
                      >
                        <div className="mb-3 sm:mb-0">
                          <p className="font-bold text-zinc-800 text-sm font-sans">{doc.name}</p>
                          <p className="text-xs text-zinc-400 mt-1">{doc.type} • {doc.size}</p>
                        </div>
                        <button className="self-start sm:self-center px-4 py-2 bg-zinc-100 hover:bg-[#005eb8] hover:text-white rounded-xs font-display text-xs font-bold uppercase transition-colors flex items-center gap-1">
                          <Download className="h-3.5 w-3.5" />
                          {t('btnDownloadCatalog_short')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar layout (Frequently bought together / Engineering help) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Frequently Bought together */}
            <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs">
              <h3 className="font-display text-xs font-extrabold text-zinc-400 tracking-widest uppercase mb-4">
                {t('frequentlyBought')}
              </h3>
              
              <div className="space-y-4">
                {ACCESSORIES.map((acc) => (
                  <div key={acc.id} className="flex gap-3 items-center border-b border-zinc-200/60 pb-3 last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-white border border-zinc-200 rounded-xs overflow-hidden flex-none">
                      <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-800 truncate font-sans">{acc.name}</p>
                      <p className="text-xs text-[#00478d] font-semibold mt-1">{acc.price}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCartWithFeedback({
                        id: acc.id,
                        name: acc.name,
                        sku: acc.id.toUpperCase(),
                        brand: 'Hakko Support',
                        category: 'Phụ kiện',
                        price: acc.price,
                        image: acc.image,
                        stock: 50,
                        status: 'In Stock',
                        shortDesc: 'Vật tư tiêu hao chất lượng cao bổ trợ cho vận hành lâu dài.'
                      })}
                      className="px-2.5 py-1 text-[10px] font-bold border border-[#005eb8] text-[#005eb8] hover:bg-primary-container hover:text-white rounded-xs transition-colors shrink-0"
                    >
                      {t('btnAdd')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Need technical help button block */}
            <div className="bg-[#00478d] p-6 text-white rounded-xs space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 text-white/10 select-none pointer-events-none">
                <HelpCircle className="h-32 w-32" />
              </div>
              <HelpCircle className="h-8 w-8 text-tertiary" />
              
              <h4 className="font-display text-lg font-bold uppercase tracking-tight">{t('needTechConsult')}</h4>
              <p className="text-xs text-zinc-200 font-light leading-relaxed">
                {t('engineerResolveDesc')}
              </p>
              <button 
                onClick={() => onNavigate('cart')}
                className="w-full py-3 bg-white text-primary text-xs font-display font-bold uppercase tracking-wider rounded-xs hover:bg-tertiary hover:text-zinc-950 transition-colors cursor-pointer"
              >
                {t('btnConnectNow')}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Inline success feedback notifier overlay */}
      {addedItemName && (
        <div className="fixed bottom-6 left-6 z-[120] bg-zinc-950 text-white border border-zinc-800 rounded-lg shadow-2xl p-4 max-w-sm flex gap-3 items-center animate-slide-in">
          <div className="bg-emerald-600 p-1.5 rounded-full text-white shrink-0">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">{t('cartUpdated')}</p>
            <p className="text-xs font-bold text-white line-clamp-1">{addedItemName}</p>
          </div>
        </div>
      )}

      {/* Demonstration video popup simulation */}

    </div>
  );
}

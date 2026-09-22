import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import Home from './pages/Home';
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const DocumentCenter = React.lazy(() => import('./pages/DocumentCenter'));
const CartQuote = React.lazy(() => import('./pages/CartQuote'));
import { PRODUCTS } from './data';
import { Product, CartItem } from './types';
import { ShoppingCart, CheckCircle2, X, AlertTriangle, RefreshCw } from 'lucide-react';
import SEOHead from './components/SEOHead';
import { extractSkuFromSlug, getProductPath, getCategoryPath } from './utils/slugify';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Protools UI Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-sm border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-900 uppercase">
              Cập nhật dữ liệu hệ thống
            </h2>
            <p className="text-xs text-slate-600">
              Hệ thống đang được làm mới dữ liệu. Quý khách vui lòng bấm nút bên dưới để tải lại trang.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('tt_vina_quote_cart_v2');
                localStorage.removeItem('tt_vina_quote_cart_v3');
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#00478D] hover:bg-[#003B75] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tải Lại Trang Ngay</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  
  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent Quote basket with robust validation
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_quote_cart_v3');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(item => item && item.product && item.product.id && item.product.name);
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.warn('Could not load cart:', e);
    }
    return [
      { product: PRODUCTS[0], quantity: 1 },
      { product: PRODUCTS[2], quantity: 2 }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tt_vina_quote_cart_v3', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cartItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (!product || !product.id) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.product?.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product?.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Đã thêm ${quantity}x "${product.name}" vào Giỏ Báo Giá!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product?.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product?.id !== productId));
    showToast('Đã xóa thiết bị khỏi Giỏ Báo Giá');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Đã làm trống Giỏ Báo Giá');
  };

  // Helper to sync state to browser URL with clean Semantic SEO Slugs
  const updateUrl = (tab: string, extra?: { product?: string; category?: string; productObj?: Product }) => {
    try {
      let targetPath = '/';

      if (tab === 'product-detail') {
        const prod = extra?.productObj || selectedProduct;
        if (prod) {
          targetPath = getProductPath(prod);
        } else if (extra?.product) {
          targetPath = `/san-pham/${extra.product}`;
        }
      } else if (tab === 'home') {
        if (extra?.category && extra.category !== 'all') {
          targetPath = getCategoryPath(extra.category);
        } else {
          targetPath = '/';
        }
      } else if (tab === 'document-center') {
        targetPath = '/tai-lieu';
      } else if (tab === 'cart') {
        targetPath = '/gio-bao-gia';
      }

      window.history.pushState({ tab, extra }, '', targetPath);
    } catch (e) {
      console.warn('URL sync error:', e);
    }
  };

  // Sync state from URL on initial load and browser back/forward buttons (popstate)
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const productParam = params.get('product');
      const categoryParam = params.get('category');
      const tabParam = params.get('tab');

      // 1. Semantic Clean URL: /san-pham/:slug
      if (pathname.startsWith('/san-pham/')) {
        const rawSlug = decodeURIComponent(pathname.replace('/san-pham/', '').replace(/\/$/, ''));
        const extractedSku = extractSkuFromSlug(rawSlug);

        const matchProduct = (items: Product[]): Product | undefined => {
          return items.find(p => {
            const pSku = (p.sku || '').toLowerCase().trim();
            const pId = (p.id || '').toLowerCase().trim();
            const targetSku = (extractedSku || '').toLowerCase().trim();
            const targetRaw = rawSlug.toLowerCase().trim();

            if (targetSku && (pSku === targetSku || pId === targetSku)) return true;
            if (pSku && targetRaw.endsWith(`-${pSku}`)) return true;
            if (pId && targetRaw.endsWith(`-${pId}`)) return true;
            if (pSku && targetRaw === pSku) return true;
            if (pId && targetRaw === pId) return true;
            return false;
          });
        };

        const foundLocal = matchProduct(PRODUCTS);
        if (foundLocal) {
          setSelectedProduct(foundLocal);
          setCurrentTab('product-detail');
          return;
        }

        // Deep-link fallback: lookup across all 7,479 items in catalog_index.json
        fetch('/data/catalog_index.json')
          .then(res => res.json())
          .then((items: Product[]) => {
            const target = matchProduct(items);
            if (target) {
              setSelectedProduct(target);
              setCurrentTab('product-detail');
            } else {
              setCurrentTab('home');
            }
          })
          .catch(() => setCurrentTab('home'));
        return;
      }

      // 2. Semantic Clean URL: /danh-muc/:categorySlug
      if (pathname.startsWith('/danh-muc/')) {
        const catSlug = decodeURIComponent(pathname.replace('/danh-muc/', '').replace(/\/$/, ''));
        if (catSlug) {
          setActiveCategoryFilter(catSlug);
          setCurrentTab('home');
          return;
        }
      }

      // 3. Semantic Clean URL: /tai-lieu, /gio-bao-gia
      if (pathname === '/tai-lieu') {
        setCurrentTab('document-center');
        return;
      }
      if (pathname === '/gio-bao-gia' || pathname === '/cart') {
        setCurrentTab('cart');
        return;
      }

      // 4. Backward-compatible Query Params Check: ?product=...
      if (productParam) {
        const found = PRODUCTS.find(p => 
          p.sku === productParam || 
          p.id === productParam || 
          p.sku.toLowerCase() === productParam.toLowerCase() ||
          p.id.toLowerCase() === productParam.toLowerCase()
        );
        if (found) {
          setSelectedProduct(found);
          setCurrentTab('product-detail');
          return;
        }

        fetch('/data/catalog_index.json')
          .then(res => res.json())
          .then((items: Product[]) => {
            const target = items.find(p => 
              p.sku === productParam || 
              p.id === productParam || 
              p.sku?.toLowerCase() === productParam.toLowerCase() ||
              p.id?.toLowerCase() === productParam.toLowerCase()
            );
            if (target) {
              setSelectedProduct(target);
              setCurrentTab('product-detail');
            }
          })
          .catch(e => console.warn('Could not lookup product in catalog_index.json', e));
        return;
      }

      if (categoryParam) {
        setActiveCategoryFilter(categoryParam);
        setCurrentTab('home');
        return;
      }

      if (tabParam) {
        setCurrentTab(tabParam);
        return;
      }

      setCurrentTab('home');
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleSelectProduct = (prod: Product) => {
    if (prod) {
      setSelectedProduct(prod);
      setCurrentTab('product-detail');
      updateUrl('product-detail', { product: prod.sku || prod.id, productObj: prod });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleNavigate = (tab: string, filter?: string, search?: string) => {
    setCurrentTab(tab);
    if (search !== undefined) {
      setActiveSearchQuery(search);
    }
    if (filter) {
      setActiveCategoryFilter(filter);
      updateUrl(tab, { category: filter });
      setTimeout(() => {
        const el = document.getElementById('product-catalog');
        if (el) {
          const yOffset = -75;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 80);
    } else if (search) {
      setActiveCategoryFilter('all');
      setTimeout(() => {
        const el = document.getElementById('product-catalog');
        if (el) {
          const yOffset = -75;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 80);
    } else {
      updateUrl(tab);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-white text-slate-900 selection:bg-[#00478D] selection:text-white">
        
        {/* DYNAMIC SEO HEAD CONTROLLER */}
        <SEOHead 
          product={currentTab === 'product-detail' ? selectedProduct : null}
          categorySlug={currentTab === 'home' ? activeCategoryFilter : undefined}
        />

        {/* 1. GLOBAL HEADER */}
        <Header
          currentTab={currentTab}
          cartCount={totalCartCount}
          onNavigate={handleNavigate}
          onSelectProduct={handleSelectProduct}
        />

        {/* 2. TOAST NOTIFICATION POPUP */}
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-sm shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3. MAIN PAGE ROUTING */}
        <main className="flex-1 flex flex-col">
          <React.Suspense fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[#00478D] border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {currentTab === 'home' && (
              <Home
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                initialFilter={activeCategoryFilter}
                initialSearch={activeSearchQuery}
              />
            )}

            {currentTab === 'product-detail' && selectedProduct && (
              <ProductDetail
                key={selectedProduct.id}
                product={selectedProduct}
                onBack={() => handleNavigate('home')}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleSelectProduct}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'document-center' && (
              <DocumentCenter
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'cart' && (
              <CartQuote
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCart}
              />
            )}
          </React.Suspense>
        </main>

        {/* 4. FLOATING ACTION WIDGETS (CONTACT HUB & BACK TO TOP >= 60%) */}
        <FloatingWidgets onOpenCart={() => handleNavigate('cart')} />

        {/* 5. GLOBAL FOOTER */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </ErrorBoundary>
  );
}

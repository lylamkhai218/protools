import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { FloatingWidgets } from './components/FloatingWidgets';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import DocumentCenter from './pages/DocumentCenter';
import CartQuote from './pages/CartQuote';
import { PRODUCTS } from './data';
import { Product, CartItem } from './types';
import { ShoppingCart, CheckCircle2, X, AlertTriangle, RefreshCw } from 'lucide-react';

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
              Đang làm mới dữ liệu hệ thống
            </h2>
            <p className="text-xs text-slate-600">
              Đang đồng bộ lại bộ nhớ đệm sản phẩm Protools. Bấm nút bên dưới để tải lại giao diện hoàn chỉnh.
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

  // Helper to sync state to browser URL without full page reload
  const updateUrl = (tab: string, extra?: { product?: string; category?: string }) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('product');
      url.searchParams.delete('category');
      url.searchParams.delete('tab');

      if (tab === 'product-detail' && extra?.product) {
        url.searchParams.set('product', extra.product);
      } else if (tab === 'home') {
        if (extra?.category && extra.category !== 'all') {
          url.searchParams.set('category', extra.category);
        }
      } else if (tab !== 'home') {
        url.searchParams.set('tab', tab);
      }
      
      window.history.pushState({ tab, extra }, '', url.toString());
    } catch (e) {
      console.warn('URL sync error:', e);
    }
  };

  // Sync state from URL on initial load and browser back/forward buttons (popstate)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const productParam = params.get('product');
      const categoryParam = params.get('category');
      const tabParam = params.get('tab');

      if (productParam) {
        const found = PRODUCTS.find(p => p.sku === productParam || p.id === productParam || p.sku.toLowerCase() === productParam.toLowerCase());
        if (found) {
          setSelectedProduct(found);
          setCurrentTab('product-detail');
          return;
        }
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
      updateUrl('product-detail', { product: prod.sku || prod.id });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleNavigate = (tab: string, filter?: string) => {
    setCurrentTab(tab);
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
    } else {
      updateUrl(tab);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-white text-slate-900 selection:bg-[#00478D] selection:text-white">
        
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
          {currentTab === 'home' && (
            <Home
              onNavigate={handleNavigate}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              initialFilter={activeCategoryFilter}
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
        </main>

        {/* 4. FLOATING ACTION WIDGETS (CONTACT HUB & BACK TO TOP >= 60%) */}
        <FloatingWidgets onOpenCart={() => handleNavigate('cart')} />

        {/* 5. GLOBAL FOOTER */}
        <Footer onNavigate={handleNavigate} />

      </div>
    </ErrorBoundary>
  );
}

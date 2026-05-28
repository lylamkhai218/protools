import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import DocumentCenter from './pages/DocumentCenter';
import CartQuote from './pages/CartQuote';
import AdminDashboard from './pages/AdminDashboard';
import CategoryCatalog from './pages/CategoryCatalog';
import CategoryDrawer from './components/CategoryDrawer';
import FloatingContacts from './components/FloatingContacts';
import { PRODUCTS } from './data';
import { Product, CartItem } from './types';
import { useLanguage } from './LanguageContext';
import { X, Lock, ShieldAlert, CheckCircle, Mail } from 'lucide-react';

// Google Authentication and Sheets Imports
import { initAuth, googleSignIn, logout as googleLogout, getAccessToken } from './lib/firebaseAuth';
import { fetchSheetDataPublic, rawRowsToProducts } from './lib/googleSheetsService';

export default function App() {
  const { currentLang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('robot');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminPass, setAdminPass] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tt_vina_admin_auth') === 'true';
  });
  const [adminError, setAdminError] = useState<string | null>(null);

  // Google OAuth User State
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  // Load static or persistent Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_products');
      return stored ? JSON.parse(stored) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  // Load products from public Google Sheets API on startup (zero key, safe public fetch!)
  const handleLoadSheetProducts = async () => {
    try {
      const data = await fetchSheetDataPublic('Products');
      if (data && data.length > 0) {
        const parsedProducts = rawRowsToProducts(data);
        setProducts(parsedProducts);
        localStorage.setItem('tt_vina_products', JSON.stringify(parsedProducts));
        console.log('✓ Successfully synchronized live catalog from Google Sheets!');
      }
    } catch (err) {
      console.warn('Google Sheet loading offline, holding persistent sandbox items:', err);
    }
  };

  useEffect(() => {
    handleLoadSheetProducts();
  }, []);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        setIsAdminAuthenticated(true);
        localStorage.setItem('tt_vina_admin_auth', 'true');
      },
      () => {
        // No auto logouts unless user requests it
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('tt_vina_products', JSON.stringify(products));
  }, [products]);

  // Scroll spy to dynamically switch active status of Header Links based on viewport scroll
  useEffect(() => {
    const onScroll = () => {
      if (isAdminOpen) {
        setCurrentTab('admin');
        return;
      }

      const homeSection = document.getElementById('home-section');
      const productsSection = document.getElementById('products-catalog');
      const docsSection = document.getElementById('document-center-section');

      if (!homeSection) return;

      const scrollPos = window.scrollY + 180; // height offset of nav header

      // Account for page bottom reach
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50);

      if (isAtBottom && docsSection) {
        setCurrentTab('document-center');
        return;
      }

      if (docsSection && scrollPos >= docsSection.offsetTop) {
        setCurrentTab('document-center');
      } else if (productsSection && scrollPos >= productsSection.offsetTop) {
        setCurrentTab('products');
      } else {
        setCurrentTab('home');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Synced initial calculation
    setTimeout(onScroll, 150);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isAdminOpen, products]);

  // Persistent Quote basket
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_quote_cart');
      return stored ? JSON.parse(stored) : [
        { product: PRODUCTS[1], quantity: 2 }, 
        { product: PRODUCTS[2], quantity: 5 }  
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tt_vina_quote_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddProduct = (newP: Product) => {
    const timeStr = new Date().toLocaleString('vi-VN');
    const enriched: Product = {
      ...newP,
      activeStatus: 1,
      create_at: timeStr,
      update_at: timeStr
    };
    setProducts(prev => [enriched, ...prev]);
  };

  const handleUpdateProduct = (updatedP: Product) => {
    const timeStr = new Date().toLocaleString('vi-VN');
    const enriched = {
      ...updatedP,
      update_at: timeStr,
      create_at: updatedP.create_at || timeStr
    };
    setProducts(prev => prev.map(p => p.id === updatedP.id ? enriched : p));
  };

  const handleDeleteProduct = (id: string) => {
    const timeStr = new Date().toLocaleString('vi-VN');
    setProducts(prev => prev.map(p => p.id === id ? { ...p, activeStatus: 0, update_at: timeStr } : p));
  };

  const handleRestoreProduct = (id: string) => {
    const timeStr = new Date().toLocaleString('vi-VN');
    setProducts(prev => prev.map(p => p.id === id ? { ...p, activeStatus: 1, update_at: timeStr } : p));
  };

  const handleSelectCategory = (categoryKey: string) => {
    setActiveCategory(categoryKey);
    setCurrentTab('products');
    const element = document.getElementById('products-catalog');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleTabSelection = (tab: string) => {
    if (tab === 'home' || tab === 'nav-home') {
      setCurrentTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const defaultCats = ['robot', 'han', 'keo', 'van-vit'];
    const activeProducts = products.filter(p => p.activeStatus !== 0);
    const existingCats = Array.from(new Set(activeProducts.map(p => p.category).filter(Boolean)));
    const allCategories = Array.from(new Set([...defaultCats, ...existingCats]));

    if (allCategories.includes(tab)) {
      handleSelectCategory(tab);
      return;
    }

    if (tab === 'document-center') {
      setCurrentTab('document-center');
      const element = document.getElementById('document-center-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (tab === 'cart') {
      setIsCartOpen(true);
      return;
    }

    if (tab === 'admin') {
      setCurrentTab('admin');
      setIsAdminOpen(true);
      return;
    }
  };

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin123' || adminPass === '1234') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('tt_vina_admin_auth', 'true');
      setAdminError(null);
    } else {
      setAdminError(currentLang.code === 'VI' ? 'Mật mã không đúng, vui lòng thử lại!' : 'Incorrect passcode, please try again!');
    }
  };

  const handleGoogleAuthSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setIsAdminAuthenticated(true);
        localStorage.setItem('tt_vina_admin_auth', 'true');
        setAdminError(null);
      }
    } catch (err: any) {
      console.warn('Google Auth Error:', err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes('popup-closed-by-user') || errMsg.includes('auth/popup-closed-by-user')) {
        setAdminError(
          currentLang.code === 'VI' 
            ? 'Cửa sổ đăng nhập Google đã bị đóng hoặc bị trình duyệt chặn (Pop-up Blocked). Bạn vui lòng cho phép hiển thị Pop-up hoặc có thể nhập mã PIN dự phòng phía dưới để vào phần quản trị ngay!'
            : 'The Google sign-in window was closed or blocked. Please allow popups or enter the backup PIN below to access the dashboard instantly!'
        );
      } else {
        setAdminError(
          currentLang.code === 'VI'
            ? `Lỗi kết nối: ${errMsg}`
            : `Connection error: ${errMsg}`
        );
      }
    }
  };

  const handleAdminLogout = async () => {
    await googleLogout();
    setGoogleUser(null);
    setGoogleToken(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('tt_vina_admin_auth');
    setIsAdminOpen(false);
    setAdminPass('');
  };

  // Submit quotation callback - stores quote in sync list
  const handleSubmitQuoteLog = async (quote: {
    fullName: string;
    companyName: string;
    workEmail: string;
    phone: string;
    projectDesc: string;
    items: string;
  }) => {
    const timestamp = new Date().toLocaleString('vi-VN');
    const newQuoteLog = {
      timestamp,
      customerName: quote.fullName,
      customerEmail: quote.workEmail,
      customerPhone: quote.phone,
      items: quote.items,
      notes: `${quote.companyName} | ${quote.projectDesc}`
    };

    // Store quote log locally so admins can open and write them to Sheet
    try {
      const stored = localStorage.getItem('tt_vina_quotes_log');
      const currentList = stored ? JSON.parse(stored) : [];
      localStorage.setItem('tt_vina_quotes_log', JSON.stringify([newQuoteLog, ...currentList]));
    } catch {
      // safe bypass
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans selection:bg-[#005eb8]/20 selection:text-primary">
      
      <Header 
        currentTab={currentTab} 
        activeCategory={activeCategory}
        onTabChange={handleTabSelection} 
        onCategoryClick={() => setIsCategoryDrawerOpen(true)}
        cartCount={totalCartCount} 
      />

      {/* Category Sidebar Drawer */}
      <CategoryDrawer 
        isOpen={isCategoryDrawerOpen} 
        onClose={() => setIsCategoryDrawerOpen(false)} 
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Persistent floating contact buttons at the bottom right of the viewport */}
      <FloatingContacts />

      <main className="flex-1 flex flex-col">
        {/* Home Banner & Solutions */}
        <div id="home-section">
          <Home 
            onNavigate={handleTabSelection} 
            onSelectProduct={(p) => setSelectedProduct(p)} 
          />
        </div>

        {/* Interactive Product Catalog */}
        <div id="products-catalog" className="scroll-mt-20 border-t border-zinc-200">
          <section className="bg-zinc-100/50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-l-4 border-[#00478d] pl-4">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-[#00478d] tracking-tight">
                  {currentLang.code === 'VI' ? 'Danh mục sản phẩm & Thiết bị' : 'Equipment & Product Showcase'}
                </h2>
                <p className="text-xs text-zinc-500 font-light mt-1 max-w-2xl leading-relaxed">
                  {currentLang.code === 'VI' 
                    ? 'Hệ thống thiết bị cao cấp, robot công tác, vật tư SMT chính hãng đồng bộ hóa cao được vận hành thử nghiệm trước khi bàn giao.'
                    : 'Genuine premium equipment, collaborative cobots, and SMT consumables meticulously tested before onsite custom deployment.'}
                </p>
              </div>
            </div>
          </section>

          <CategoryCatalog 
            categoryKey={activeCategory}
            products={products.filter(p => p.activeStatus !== 0)}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigate={handleTabSelection}
          />
        </div>

        {/* Resources / Technical Manual Section */}
        <div id="document-center-section" className="scroll-mt-20 border-t border-zinc-200">
          <DocumentCenter 
            onNavigate={handleTabSelection} 
          />
        </div>
      </main>

      <Footer />

      {/* Sliding RFQ Quote Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-100 overflow-hidden">
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 md:pl-10">
            <div className="pointer-events-auto w-screen max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-6xl transform transition-all duration-300 ease-in-out">
              <div className="flex h-full flex-col bg-white shadow-2xl border-l border-zinc-200 font-sans">
                <div className="bg-zinc-900 text-white px-6 py-5 flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined">shopping_basket</span>
                    {currentLang.code === 'VI' ? 'Tiến trình yêu cầu báo giá' : 'RFQ Quotation Progress'}
                  </h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 bg-zinc-50">
                  <CartQuote 
                    cartItems={cartItems} 
                    onUpdateQuantity={handleUpdateQuantity} 
                    onRemoveItem={handleRemoveItem} 
                    onNavigate={() => setIsCartOpen(false)}
                    userEmail="khaiy0968@gmail.com"
                    onClearCart={handleClearCart}
                    onSubmitQuote={handleSubmitQuoteLog}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Information Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative bg-white border border-zinc-200 rounded-sm shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto p-4 sm:p-6 z-10 animate-scale-up">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-zinc-100 hover:bg-zinc-200 hover:text-red-600 p-2 rounded-full transition-colors z-20 h-9 w-9 flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>
            
            <ProductDetail 
              product={selectedProduct} 
              onAddToCart={handleAddToCart} 
              onNavigate={(tab) => {
                setSelectedProduct(null);
                handleTabSelection(tab);
              }}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        </div>
      )}

      {/* Admin Panel Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div 
            className={`absolute inset-0 bg-stone-950/80 transition-all duration-300 ${
              !isAdminAuthenticated ? 'backdrop-blur-xl' : 'backdrop-blur-xs'
            } cursor-pointer`}
            onClick={() => setIsAdminOpen(false)}
          />

          {!isAdminAuthenticated ? (
            /* High-security frosted-glass full locks block for login */
            <div className="bg-white/95 backdrop-blur-md border border-zinc-200/50 rounded-lg shadow-2xl relative z-10 w-full max-w-md p-6 sm:p-8 md:p-10 animate-scale-up flex flex-col text-center space-y-7">
              {/* Close button for safety */}
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 p-1.5 transition-colors cursor-pointer text-xs font-bold leading-none font-sans"
              >
                ✕ {currentLang.code === 'VI' ? 'Đóng' : 'Close'}
              </button>

              <div className="space-y-4 font-sans">
                <div className="mx-auto w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-500 shadow-xs">
                  <Lock className="h-6 w-6 animate-pulse" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="font-display text-sm sm:text-base font-bold text-zinc-900 uppercase tracking-tight">
                    {currentLang.code === 'VI' ? 'Yêu Cầu Xác Thực Admin' : 'Admin Security Verification'}
                  </h4>
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">
                    {currentLang.code === 'VI' 
                      ? 'Nội dung này được bảo mật cao. Vui lòng xác minh danh tính tài khoản Sales / Operator của bạn.'
                      : 'This section is highly restricted. Please verify your operator or sales authority.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {/* Official Google sign-in button overlay */}
                <button
                  type="button"
                  onClick={handleGoogleAuthSignIn}
                  className="w-full py-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-750 font-bold text-[11px] uppercase tracking-wider rounded shadow-2xs hover:shadow transition-all flex items-center justify-center gap-2.5 cursor-pointer min-h-[44px]"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.483 0-6.315-2.853-6.315-6.365s2.832-6.365 6.315-6.365c1.55 0 2.96.559 4.058 1.492l3.056-3.056C19.11 2.373 15.89 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.899 0 10.8-4.234 10.8-11.24 0-.648-.052-1.296-.156-1.955H12.24z"/>
                  </svg>
                  <span>{currentLang.code === 'VI' ? 'ĐĂNG NHẬP GOOGLE SUITE' : 'AUTHENTICATE WITH GOOGLE'}</span>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                  <span className="relative bg-white/95 px-3 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{currentLang.code === 'VI' ? 'Hoặc nhập PIN quản trị' : 'Or enter security secret'}</span>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3 text-xs">
                  <input
                    type="password"
                    placeholder={currentLang.code === 'VI' ? 'Mã PIN bảo mật...' : 'Secret PIN key...'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded focus:ring-1 focus:ring-primary focus:outline-hidden transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-400"
                  />
                  {adminError && (
                    <div className="space-y-2 p-3 bg-red-50/70 border border-red-100 rounded text-left font-sans">
                      <p className="text-[11px] text-red-650 font-medium leading-relaxed">{adminError}</p>
                      {(adminError.includes('popup') || adminError.includes('Pop-up') || adminError.includes('closed')) && (
                        <button
                          type="button"
                          onClick={() => window.open(window.location.href, '_blank')}
                          className="w-full mt-1.5 py-2 px-3 bg-[#00478d] hover:bg-primary-container text-white text-[10px] font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          <span>{currentLang.code === 'VI' ? 'Mở tab mới sửa lỗi ↗' : 'Open in New Tab ↗'}</span>
                        </button>
                      )}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-zinc-850 hover:bg-zinc-950 text-white font-display text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-all min-h-[44px]"
                  >
                    {currentLang.code === 'VI' ? 'KÍCH HOẠT HỆ THỐNG' : 'SUBMIT SECURITY KEY'}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-zinc-150 flex items-center justify-center gap-1.5 text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-sans">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                Cổng bảo mật cấp cao T&amp;T Vina • 2026
              </div>
            </div>
          ) : (
            /* Dashboard layout when authorized successfully */
            <div className="bg-white border border-zinc-200 rounded-sm shadow-2xl relative z-10 w-full max-w-6xl max-h-[95vh] overflow-y-auto animate-scale-up flex flex-col">
              
              {/* Header banner */}
              <div className="bg-[#001530] text-white px-6 py-5 flex items-center justify-between border-b border-white/10 font-sans">
                <div>
                  <h3 className="font-display text-sm font-extrabold tracking-wider uppercase flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#e8a020]" />
                    {currentLang.code === 'VI' ? 'Cổng quản trị dữ liệu sản phẩm Live' : 'Product Inventory Admin Center'}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {currentLang.code === 'VI' ? 'Sales & HR tự chỉnh sửa tài sản trực tuyến lưu về Google Spreadsheets' : 'Direct catalog self-management workstation for Sales & HR personnel'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="p-1 px-3 bg-white/5 hover:bg-white/10 rounded font-bold text-xs text-zinc-300 hover:text-white cursor-pointer"
                >
                  {currentLang.code === 'VI' ? '✕ Đóng' : '✕ Close'}
                </button>
              </div>

              <div className="flex-1 bg-zinc-50 font-sans">
                <div className="bg-[#00478d]/5 border-b border-[#00478d]/10 px-6 py-3 text-xs flex justify-between items-center gap-3">
                  <div className="text-zinc-650">
                    🔥 <strong>{currentLang.code === 'VI' ? 'Quản lý Độc lập Live:' : 'Independent Management Live:'}</strong>{' '}
                    {currentLang.code === 'VI' 
                      ? 'sales và HR có thể tự do thêm sửa xóa, cập nhật thông số file. Mọi thay đổi sẽ lập tức đồng bộ lên bảng biểu Google.'
                      : 'sales and HR specialists can add profiles, edit attachments in real-time. Changes are instantly pushed to Google Workbook.'}
                  </div>
                  <button 
                    onClick={handleAdminLogout}
                    className="bg-zinc-800 hover:bg-zinc-950 text-white font-bold px-3 py-1.5 rounded-xs text-[10px] uppercase.tracking-wider transition-all cursor-pointer shrink-0"
                  >
                    {currentLang.code === 'VI' ? 'Đăng xuất Admin' : 'Logout Admin Center'}
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(95vh-130px)]">
                  <AdminDashboard 
                    products={products} 
                    onAddProduct={handleAddProduct} 
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct} 
                    onRestoreProduct={handleRestoreProduct}
                    onNavigate={(tab) => {
                      setIsAdminOpen(false);
                      handleTabSelection(tab);
                    }}
                    googleUser={googleUser}
                    googleToken={googleToken}
                    onGoogleSignIn={handleGoogleAuthSignIn}
                    onGoogleSignOut={handleAdminLogout}
                    onRefreshFromSheet={handleLoadSheetProducts}
                  />
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

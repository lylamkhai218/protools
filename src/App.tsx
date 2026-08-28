import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import DocumentCenter from './pages/DocumentCenter';
import CartQuote from './pages/CartQuote';
import AdminDashboard from './pages/AdminDashboard';
import { PRODUCTS } from './data';
import { Product, CartItem } from './types';

function getInitialTab(): string {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (path === 'document-center' || path === 'tai-lieu') return 'document-center';
  if (path === 'cart' || path === 'gio-hang') return 'cart';
  if (path === 'admin') return 'admin';
  return 'home';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]); // default to Hakko HU-200
  
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Persistent Quote basket
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_quote_cart');
      return stored ? JSON.parse(stored) : [
        // Populate standard defaults seen in the cart screenshot for demo fidelity
        { product: PRODUCTS[1], quantity: 2 }, // Hakko FX-888D (02)
        { product: PRODUCTS[2], quantity: 5 }  // HIOS VZ-1510 (05)
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

  // Product listing handlers for Admin controls
  const handleAddProduct = (newP: Product) => {
    setProducts(prev => [newP, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Switch tabs cleanly, allowing filtered category views
  const handleTabSelection = (tab: string, push: boolean = true) => {
    // If selecting specific category tabs from index links
    if (tab === 'robot' || tab === 'han' || tab === 'keo' || tab === 'van-vit') {
      const targetP = products.find(p => {
        if (tab === 'robot') return p.id === 'hakko-hu-200';
        if (tab === 'han') return p.id === 'hakko-fx-888d';
        if (tab === 'keo') return p.id === 'hios-vz-1510'; // default representative or HIOS matches
        if (tab === 'van-vit') return p.id === 'hios-vz-1510';
        return false;
      });
      if (targetP) {
        setSelectedProduct(targetP);
        setCurrentTab('product-detail');
        if (push && typeof window !== 'undefined') window.history.pushState(null, '', '/');
      } else {
        setCurrentTab('home');
        if (push && typeof window !== 'undefined') window.history.pushState(null, '', '/');
      }
    } else {
      setCurrentTab(tab);
      if (push && typeof window !== 'undefined') {
        const targetPath = tab === 'home' ? '/' : `/${tab}`;
        window.history.pushState(null, '', targetPath);
      }
    }
    
    // Smooth scroll to top on tab transitions
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-sans selection:bg-[#005eb8]/20 selection:text-primary">
      
      {/* Structural layout: If on Admin Dashboard panel screen, hide general header footer to match layout */}
      {currentTab !== 'admin' && (
        <Header 
          currentTab={currentTab} 
          onTabChange={handleTabSelection} 
          cartCount={totalCartCount} 
        />
      )}

      {/* Primary Page Canvas Screen switching */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'home' && (
          <Home 
            onNavigate={handleTabSelection} 
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentTab('product-detail');
            }} 
          />
        )}

        {currentTab === 'product-detail' && (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart} 
            onNavigate={handleTabSelection}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setCurrentTab('product-detail');
            }}
          />
        )}

        {currentTab === 'document-center' && (
          <DocumentCenter 
            onNavigate={handleTabSelection} 
          />
        )}

        {currentTab === 'cart' && (
          <CartQuote 
            cartItems={cartItems} 
            onUpdateQuantity={handleUpdateQuantity} 
            onRemoveItem={handleRemoveItem} 
            onNavigate={handleTabSelection}
            userEmail="khaiy0968@gmail.com" // Prefilled with user email metadata
            onClearCart={handleClearCart}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard 
            products={products} 
            onAddProduct={handleAddProduct} 
            onDeleteProduct={handleDeleteProduct} 
            onNavigate={handleTabSelection}
          />
        )}
      </main>

      {/* general Footer element */}
      {currentTab !== 'admin' && <Footer />}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  PlusCircle, Search, TrendingUp, AlertTriangle, Globe, Inbox, Filter, Edit, 
  Trash2, RefreshCw, Upload, CloudLightning, LogOut, CheckCircle, Bell, User, 
  ChevronLeft, ChevronRight, X, FileImage, ShieldAlert, FileText, Settings, Database,
  Plus, Check
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { SPREADSHEET_ID, ensureWorkbookStructure, overwriteSheetData } from '../lib/googleSheetsService';

// Defining type in-file for local quote entries
interface QuoteEntry {
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: string;
  notes: string;
}

interface AdminEntry {
  email: string;
  role: string;
}

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onRestoreProduct?: (id: string) => void;
  onNavigate: (tab: string) => void;
  
  // Google OAuth properties
  googleUser: any | null;
  googleToken: string | null;
  onGoogleSignIn: () => Promise<any>;
  onGoogleSignOut: () => Promise<void>;
  
  // Dynamic refresh trigger
  onRefreshFromSheet: () => Promise<void>;
}

export default function AdminDashboard({ 
  products, 
  onAddProduct, 
  onUpdateProduct,
  onDeleteProduct, 
  onRestoreProduct,
  onNavigate,
  googleUser,
  googleToken,
  onGoogleSignIn,
  onGoogleSignOut,
  onRefreshFromSheet
}: AdminDashboardProps) {
  const { currentLang } = useLanguage();
  
  // Sidebar view switcher: 'products' | 'quotes' | 'admins' | 'sheets'
  const [activeTab, setActiveTab] = useState<'products' | 'quotes' | 'admins' | 'sheets'>('products');

  // Local filters
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tất cả danh mục');
  
  // Modals status
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Edit Form States
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editBrand, setEditBrand] = useState('Hakko');
  const [editStock, setEditStock] = useState('15');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('robot');
  const [editImage, setEditImage] = useState('');
  const [editPdf, setEditPdf] = useState('');
  const [editDoc, setEditDoc] = useState('');

  const [isInitializingSheets, setIsInitializingSheets] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Lists loader (Quotes and Admins) loaded from LocalStorage (fallbacks) or public sheet
  const [quotesList, setQuotesList] = useState<QuoteEntry[]>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_quotes_log');
      return stored ? JSON.parse(stored) : [
        {
          timestamp: '27/05/2026 09:30',
          customerName: 'Nguyễn Văn Hùng',
          customerEmail: 'hung.nguyen@samsung.com',
          customerPhone: '0912345678',
          items: 'Cánh tay Robot Hakko Industrial-6X x1; Trạm hàn kỹ thuật số Hakko FX-888D x2',
          notes: 'Yêu cầu lắp ráp chạy thử nghiệm SMT tại Bắc Ninh.'
        },
        {
          timestamp: '26/05/2026 14:15',
          customerName: 'Trần Thị Mai',
          customerEmail: 'mai.tran@foxconn.com',
          customerPhone: '0987654321',
          items: 'Tô vít điện tử chính xác HIOS VZ-1510 x5',
          notes: 'Cung cấp hóa đơn đỏ VAT và chứng nhận hiệu chuẩn CO/CQ đầy đủ.'
        }
      ];
    } catch {
      return [];
    }
  });

  const [adminsList, setAdminsList] = useState<AdminEntry[]>(() => {
    try {
      const stored = localStorage.getItem('tt_vina_admins_log');
      return stored ? JSON.parse(stored) : [
        { email: 'khaiy0968@gmail.com', role: 'Super Admin' },
        { email: 'khaill@murrplastik-vn.com', role: 'Sales Specialist' },
        { email: 'hr.ttvina@gmail.com', role: 'HR Specialist' }
      ];
    } catch {
      return [];
    }
  });

  // Local state for add Admin input
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Sales Specialist');

  // Local storage binding
  useEffect(() => {
    localStorage.setItem('tt_vina_quotes_log', JSON.stringify(quotesList));
  }, [quotesList]);

  useEffect(() => {
    localStorage.setItem('tt_vina_admins_log', JSON.stringify(adminsList));
  }, [adminsList]);

  // Try parsing quotes from Google Sheet on load if public sheet contains them
  useEffect(() => {
    // If workbook public fetching is successful in App, we could sync. Let's do a fast local load.
  }, []);

  // Form states for Add Product with exact File link fields (Image, PDF, Excel, Word)
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('Hakko');
  const [newProductStock, setNewProductStock] = useState('15');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('robot');
  
  // Custom file document URI paths
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800');
  const [newProductPdf, setNewProductPdf] = useState('');
  const [newProductDoc, setNewProductDoc] = useState('');

  // Submit product additions
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    const stockNum = parseInt(newProductStock) || 0;
    
    const timeStr = new Date().toLocaleString('vi-VN');
    // Construct rich product schema including documents URLs (pdf, excel, word, image)
    const newP: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      sku: newProductSku || `TT-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: newProductBrand,
      category: newProductCategory,
      image: newProductImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      stock: stockNum,
      status: stockNum > 20 ? 'In Stock' : (stockNum > 0 ? 'Low Stock' : 'Out of Stock'),
      price: 'Báo giá',
      shortDesc: newProductDesc || 'Sản phẩm chính hãng chất lượng cao vận hành bền bỉ.',
      documents: [],
      activeStatus: 1,
      create_at: timeStr,
      update_at: timeStr
    };

    if (newProductPdf) {
      newP.documents?.push({ name: `${newProductName} - Technical Catalog`, type: 'PDF', size: '1.4 MB', url: newProductPdf });
    }
    if (newProductDoc) {
      newP.documents?.push({ name: `${newProductName} - Operation Sheet`, type: 'Excel/Word', size: '0.8 MB', url: newProductDoc });
    }

    onAddProduct(newP);
    
    // If Google Sheets is connected, auto-update the spreadsheet with fresh list
    const updatedList = [newP, ...products];
    if (googleToken) {
      setSyncMessage('Auto-synchronizing new product to Google Sheets...');
      setTimeout(async () => {
        await handleSyncAllToGoogleSheet(updatedList);
      }, 550);
    }

    setShowAddModal(false);
    
    // Trigger localized Success Notification
    setActionSuccessMessage(currentLang.code === 'VI' ? 'Thêm mới sản phẩm thành công và sẵn sằng hiển thị!' : 'New product successfully added!');
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 4000);
    
    // Clear state
    setNewProductName('');
    setNewProductSku('');
    setNewProductPdf('');
    setNewProductDoc('');
    setNewProductDesc('');
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditSku(p.sku);
    setEditBrand(p.brand);
    setEditStock(String(p.stock));
    setEditDesc(p.shortDesc || '');
    setEditCategory(p.category);
    setEditImage(p.image);
    
    // Extract document URLs
    const pdfUrl = p.documents?.find(d => d.type === 'PDF')?.url || '';
    const docUrl = p.documents?.find(d => d.type === 'Excel/Word')?.url || '';
    setEditPdf(pdfUrl);
    setEditDoc(docUrl);
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName) return;

    const stockNum = parseInt(editStock) || 0;
    
    const timeStr = new Date().toLocaleString('vi-VN');
    const updatedP: Product = {
      ...editingProduct,
      name: editName,
      sku: editSku || `TT-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: editBrand,
      category: editCategory,
      image: editImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      stock: stockNum,
      status: stockNum > 20 ? 'In Stock' : (stockNum > 0 ? 'Low Stock' : 'Out of Stock'),
      price: 'Báo giá',
      shortDesc: editDesc || 'Sản phẩm chính hãng chất lượng cao vận hành bền bỉ.',
      documents: [],
      activeStatus: editingProduct.activeStatus ?? 1,
      create_at: editingProduct.create_at || timeStr,
      update_at: timeStr
    };

    if (editPdf) {
      updatedP.documents?.push({ name: `${editName} - Technical Catalog`, type: 'PDF', size: '1.4 MB', url: editPdf });
    }
    if (editDoc) {
      updatedP.documents?.push({ name: `${editName} - Operation Sheet`, type: 'Excel/Word', size: '0.8 MB', url: editDoc });
    }

    onUpdateProduct(updatedP);
    
    const updatedList = products.map(p => p.id === updatedP.id ? updatedP : p);
    if (googleToken) {
      setSyncMessage('Auto-synchronizing edited product to Google Sheets...');
      setTimeout(async () => {
        await handleSyncAllToGoogleSheet(updatedList);
      }, 550);
    }

    setEditingProduct(null);
    setActionSuccessMessage(currentLang.code === 'VI' ? 'Cập nhật sản phẩm thành công!' : 'Product updated successfully!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleDeleteProductClick = (id: string) => {
    const found = products.find(p => p.id === id);
    if (found) {
      setProductToDelete(found);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const id = productToDelete.id;
    const timeStr = new Date().toLocaleString('vi-VN');
    const updatedList = products.map(p => p.id === id ? { ...p, activeStatus: 0, update_at: timeStr } : p);
    onDeleteProduct(id);
    
    if (googleToken) {
      setSyncMessage('Auto-synchronizing deleted product status to Google Sheets...');
      setTimeout(async () => {
        await handleSyncAllToGoogleSheet(updatedList);
      }, 550);
    }

    setProductToDelete(null);
    setActionSuccessMessage(currentLang.code === 'VI' ? 'Đã chuyển trạng thái ẩn sản phẩm thành công!' : 'Product state deactivated successfully!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRestoreProductClick = async (id: string) => {
    if (!onRestoreProduct) return;
    const timeStr = new Date().toLocaleString('vi-VN');
    onRestoreProduct(id);
    const updatedList = products.map(p => p.id === id ? { ...p, activeStatus: 1, update_at: timeStr } : p);
    
    if (googleToken) {
      setSyncMessage('Auto-synchronizing restored product status to Google Sheets...');
      setTimeout(async () => {
        await handleSyncAllToGoogleSheet(updatedList);
      }, 550);
    }

    setActionSuccessMessage(currentLang.code === 'VI' ? 'Đã khôi phục sản phẩm hiển thị thành công!' : 'Product restored successfully!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    const newList = [...adminsList, { email: newAdminEmail.trim().toLowerCase(), role: newAdminRole }];
    setAdminsList(newList);
    setNewAdminEmail('');
    
    if (googleToken) {
      setSyncMessage('Updating Administrators list on Google Sheet...');
      setTimeout(async () => {
        await handleSyncAllToGoogleSheet(products);
      }, 520);
    }
    
    setActionSuccessMessage(currentLang.code === 'VI' ? 'Cấp quyền truy cập quản trị thành công!' : 'Admin access granted successfully!');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleDeleteAdmin = (email: string) => {
    if (confirm(currentLang.code === 'VI' ? `Xóa quyền truy cập của ${email}?` : `Revoke access for ${email}?`)) {
      const filtered = adminsList.filter(adm => adm.email !== email);
      setAdminsList(filtered);
      if (googleToken) {
        setSyncMessage('Updating Administrators list on Google Sheet...');
        setTimeout(async () => {
          await handleSyncAllToGoogleSheet(products);
        }, 520);
      }
      
      setActionSuccessMessage(currentLang.code === 'VI' ? 'Thu hồi quyền Admin thành công!' : 'Admin privileges revoked!');
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  // Google Sheets Direct Write Synchronizer
  const handleSyncAllToGoogleSheet = async (customProductsList?: Product[]) => {
    if (!googleToken) {
      try {
        await onGoogleSignIn();
      } catch (err) {
        alert(currentLang.code === 'VI' ? 'Đăng nhập Google thất bại!' : 'Google sign in failed!');
        return;
      }
    }

    try {
      setIsInitializingSheets(true);
      setSyncMessage('Connecting and formatting Google Sheets worksheets...');
      
      // Ensure all 4 Sheets tabs structures ('Products', 'Quotes', 'Admins', 'Documents') exist 
      await ensureWorkbookStructure(googleToken!);

      // Write Products Rows including document columns
      setSyncMessage('Syncing live product items database ranges...');
      const productHeaders = ['id', 'name', 'sku', 'brand', 'category', 'image', 'stock', 'status', 'price', 'shortDesc', 'pdfUrl', 'docUrl', 'create_at', 'update_at'];
      const productsToSync = customProductsList || products;
      const productRows = productsToSync.map(p => {
        const pdfUrl = p.documents?.find(d => d.type === 'PDF')?.url || '';
        const docUrl = p.documents?.find(d => d.type === 'Excel/Word')?.url || '';
        const timeStr = new Date().toLocaleString('vi-VN');
        return [
          p.id,
          p.name,
          p.sku,
          p.brand,
          p.category,
          p.image,
          String(p.stock),
          String(p.activeStatus !== undefined ? p.activeStatus : 1),
          p.price || 'Báo giá',
          p.shortDesc || '',
          pdfUrl,
          docUrl,
          p.create_at || timeStr,
          p.update_at || timeStr
        ];
      });
      await overwriteSheetData(googleToken!, 'Products', productHeaders, productRows);

      // Write Quotes Rows
      setSyncMessage('Syncing customer inquiries & quote logs...');
      const quoteHeaders = ['timestamp', 'customerName', 'customerEmail', 'customerPhone', 'items', 'notes', 'status', 'create_at', 'update_at'];
      const quoteRows = quotesList.map(q => [
        q.timestamp,
        q.customerName,
        q.customerEmail,
        q.customerPhone,
        q.items,
        q.notes,
        '1',
        q.timestamp,
        q.timestamp
      ]);
      await overwriteSheetData(googleToken!, 'Quotes', quoteHeaders, quoteRows);

      // Write Admins Rows
      setSyncMessage('Syncing administrative privileges accounts...');
      const adminHeaders = ['email', 'role', 'status', 'create_at', 'update_at'];
      const timeNow = new Date().toLocaleString('vi-VN');
      const adminRows = adminsList.map(a => [
        a.email,
        a.role,
        '1',
        timeNow,
        timeNow
      ]);
      await overwriteSheetData(googleToken!, 'Admins', adminHeaders, adminRows);

      setSyncMessage('Database sync succeeded! Google Sheets spreadsheet is fully synchronized.');
      setTimeout(() => {
        setSyncMessage(null);
      }, 3000);

      // Reload
      await onRefreshFromSheet();
    } catch (err) {
      console.error(err);
      alert('Error updating Google Sheet table. Please check spreadsheet permission and share properties.');
    } finally {
      setIsInitializingSheets(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         p.sku.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = filterCategory === 'Tất cả danh mục' || p.category === filterCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[85vh] bg-zinc-50 font-sans">
      
      {/* ----------------- High-Fidelity HR & Sales Admin Sidebar Menu ----------------- */}
      <aside className="w-full md:w-64 bg-[#0a192f] text-zinc-300 border-r border-[#001530] flex flex-col p-6 space-y-7 shrink-0 font-sans">
        <div>
          <h1 className="font-display text-lg font-black text-white tracking-widest flex items-center gap-1.5 uppercase">
            <Database className="h-5 w-5 text-amber-500" />
            <span>T&amp;T CLOUD DB</span>
          </h1>
          <p className="text-[10px] font-display font-medium text-zinc-400 mt-1 uppercase tracking-wider">
            Google Sheets Workstation
          </p>
        </div>

        {/* Integration Hub Panel status indicator */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xs text-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${googleToken ? 'bg-green-500 animate-pulse' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
            <span className="font-bold text-xs text-white">
              {googleToken 
                ? (currentLang.code === 'VI' ? 'Đã Kết Nối Google' : 'Connected Cloud') 
                : (currentLang.code === 'VI' ? 'Quản trị Offline qua PIN' : 'Offline State')}
            </span>
          </div>
          {googleUser && (
            <p className="text-[10px] text-zinc-350 truncate font-mono">
              Hi: {googleUser.email}
            </p>
          )}
          <p className="text-[10px] text-zinc-400 font-light leading-normal">
            {googleToken
              ? (currentLang.code === 'VI' ? 'Đã đồng bộ trực tiếp hai chiều với Sheet.' : 'Two-way database communication active.')
              : (currentLang.code === 'VI' ? 'Đang chạy Sandbox an toàn. Dữ liệu lưu cục bộ trong trình duyệt và luôn sẵn sàng sync lên Google Sheets!' : 'Running on secure offline local browser sandbox.')}
          </p>
          <p className="text-[9px] text-zinc-400 leading-relaxed font-light">
            Target Workbook: <br/>
            <a 
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`} 
              target="_blank" 
              rel="noreferrer"
              className="font-mono text-amber-500 hover:underline break-all"
            >
              ...{SPREADSHEET_ID.substring(0, 10)}...
            </a>
          </p>
        </div>

        {/* Navigations */}
        <nav className="flex-1 space-y-1 text-xs font-display font-bold uppercase tracking-wider">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xs transition-all ${
              activeTab === 'products' ? 'bg-[#1e293b] text-amber-400 border-l-4 border-amber-400' : 'hover:bg-white/5 text-zinc-400'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory</span>
            <span>Kho Sản Phẩm ({products.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xs transition-all ${
              activeTab === 'quotes' ? 'bg-[#1e293b] text-amber-400 border-l-4 border-amber-400' : 'hover:bg-white/5 text-zinc-400'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>Hồ sơ Báo Giá ({quotesList.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('admins')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xs transition-all ${
              activeTab === 'admins' ? 'bg-[#1e293b] text-amber-400 border-l-4 border-amber-400' : 'hover:bg-white/5 text-zinc-400'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>Đại Diện Admins ({adminsList.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('sheets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xs transition-all ${
              activeTab === 'sheets' ? 'bg-[#1e293b] text-amber-400 border-l-4 border-amber-400' : 'hover:bg-white/5 text-zinc-400'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            <span>Đồng Bộ Google Sheets</span>
          </button>
        </nav>

        {/* Sidebar Logout */}
        <div className="pt-4 border-t border-white/10 space-y-3.5">
          {googleToken ? (
            <button 
              onClick={onGoogleSignOut}
              className="w-full flex items-center gap-2 justify-center py-2.5 px-3 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/40 text-xs font-bold uppercase rounded-xs transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất Google</span>
            </button>
          ) : (
            <button 
              onClick={onGoogleSignIn}
              className="w-full flex items-center gap-2 justify-center py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black uppercase rounded-xs shadow transition-all cursor-pointer"
            >
              <CloudLightning className="h-4 w-4 animate-bounce" />
              <span>Kết nối Google</span>
            </button>
          )}

          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-white text-xs transition-colors py-1 hover:underline"
          >
            ← Quay về Landing Page
          </button>
        </div>
      </aside>

      {/* ----------------- Active Workspace Content Panel ----------------- */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Dynamic header row syncing banner */}
        {syncMessage && (
          <div className="bg-amber-500 text-zinc-950 px-5 py-4.5 rounded-xs border border-amber-600 shadow-md text-sm font-semibold flex items-center justify-between gap-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>{syncMessage}</span>
            </div>
            <button onClick={() => setSyncMessage(null)} className="font-bold text-xs opacity-75 hover:opacity-100">✕ Close</button>
          </div>
        )}

        {/* Banner header title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1">
              <span>Cloud Spreadsheet Platform</span>
              <span>&gt;</span>
              <span className="text-primary font-black">{activeTab}</span>
            </nav>
            <h2 className="font-display text-2.5xl sm:text-3xl font-extrabold text-[#00478d]">
              {activeTab === 'products' && 'Quản lý danh mục sản phẩm'}
              {activeTab === 'quotes' && 'Hồ sơ khách hàng yêu cầu báo giá'}
              {activeTab === 'admins' && 'Phân quyền Admin (Sales & HR)'}
              {activeTab === 'sheets' && 'Trung tâm đồng bộ hóa Google Sheet'}
            </h2>
          </div>

          <button 
            onClick={handleSyncAllToGoogleSheet}
            className="flex items-center gap-2 bg-[#00478d] hover:bg-primary-container text-white py-3 px-5 rounded-xs font-display text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all self-end sm:self-auto cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Đồng bộ ngay</span>
          </button>
        </div>

        {/* TAB 1: Products table view */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Action Top Grid bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 border border-zinc-200 rounded-sm shadow-xs gap-4">
              <div>
                <h3 className="font-display text-sm font-extrabold text-zinc-700 uppercase tracking-wide">
                  Quản lý Sản phẩm công khai
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-lg leading-relaxed">
                  Thay đổi hoặc thêm bớt các bài đăng sản phẩm. Khi sales hoặc HR thêm sản phẩm có gắn kèm link Ảnh, PDF catalog, hay Excel hướng dẫn, dữ liệu sẽ trực tiếp kết nối chặt chẽ và lưu trữ đồng nhất.
                </p>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3.5 rounded-xs font-display font-extrabold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>

            {/* Quick Filter Box */}
            <div className="bg-white border border-zinc-200 rounded-sm p-4 shadow-xs flex flex-wrap gap-4 items-center">
              <div className="relative group flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm, Model SKU..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-100 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden focus:border-primary transition-all font-sans"
                />
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-400" />
              </div>

              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary font-medium text-zinc-600 outline-hidden"
              >
                <option>Tất cả danh mục</option>
                <option value="robot">Robot &amp; Tự động hóa</option>
                <option value="han">Hàn &amp; Khử tĩnh điện</option>
                <option value="keo">Keo &amp; Vật tư tiêu hao</option>
                <option value="van-vit">Dụng cụ vặn vít</option>
              </select>

              {(filterCategory !== 'Tất cả danh mục' || filterQuery) && (
                <button 
                  onClick={() => { setFilterQuery(''); setFilterCategory('Tất cả danh mục'); }}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Table layout of Products list */}
            <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-xs">
              
              {/* Desktop version - Elegant Tabular view */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left text-sm divide-y divide-zinc-200">
                  <thead className="bg-[#00478d] text-white font-display text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 whitespace-normal min-w-[200px]">Tên Sản phẩm &amp; Thiết bị</th>
                      <th className="px-6 py-4 whitespace-nowrap">Model / SKU</th>
                      <th className="px-6 py-4 whitespace-normal min-w-[150px]">Sản Phẩm Đính Kèm (PDF/Excel)</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap">Tồn Kho</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap">Trạng thái</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredProducts.map((p) => {
                      const isActive = p.activeStatus !== 0;
                      return (
                        <tr key={p.id} className={`hover:bg-zinc-50/50 transition-colors ${!isActive ? 'bg-zinc-100/40 opacity-75' : ''}`}>
                          <td className="px-6 py-4 whitespace-normal break-words min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden shrink-0">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-zinc-800 text-xs sm:text-sm leading-snug">{p.name}</p>
                                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold block mt-0.5">Thương hiệu: {p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-zinc-600 whitespace-nowrap">{p.sku}</td>
                          <td className="px-6 py-4 text-xs whitespace-normal break-words min-w-[150px]">
                            {p.documents && p.documents.length > 0 ? (
                              <div className="space-y-1">
                                {p.documents.map((doc, dIdx) => (
                                  <span 
                                    key={dIdx} 
                                    className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-sm block w-full truncate"
                                    title={doc.url}
                                  >
                                    {doc.type === 'PDF' ? <FileText className="h-3 w-3 text-red-650 shrink-0" /> : <FileImage className="h-3 w-3 text-green-655 shrink-0" />}
                                    <span className="truncate shrink">{doc.name}</span>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-400 font-light italic">Không đính kèm tệp</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap animate-none">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${p.stock > 10 ? 'bg-green-600' : 'bg-amber-600 animate-pulse'}`} />
                              {p.stock} Units
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                              isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 border border-zinc-300 text-zinc-500'
                            }`}>
                              {isActive ? 'Active (Hiển thị)' : 'Deactive (Đã ẩn)'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {isActive ? (
                                <>
                                  <button 
                                    onClick={() => handleStartEdit(p)}
                                    className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-xs transition-colors border border-transparent hover:border-amber-200 cursor-pointer"
                                    title="Sửa thông tin sản phẩm"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProductClick(p.id)}
                                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xs transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                                    title="Xóa/Ẩn linh kiện"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleRestoreProductClick(p.id)}
                                  className="px-2 py-1 text-[10px] font-extrabold uppercase text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm border border-emerald-500 transition-colors cursor-pointer flex items-center gap-1"
                                  title="Khôi phục trạng thái Hiển Thị"
                                >
                                  <RefreshCw className="h-3 w-3 shrink-0" />
                                  <span>Khôi phục</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 bg-zinc-50 text-center text-sm text-zinc-400 font-light italic">
                          Không tìm thấy sản phẩm nào phù hợp!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile version - Direct stacked details cards (no horizontal scroll!) */}
              <div className="md:hidden divide-y divide-zinc-200 bg-white">
                {filteredProducts.map((p) => {
                  const isActive = p.activeStatus !== 0;
                  return (
                    <div 
                      key={p.id} 
                      className={`p-4 flex flex-col gap-3.5 transition-colors ${
                        !isActive ? 'bg-zinc-100/50 opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden shrink-0 shadow-2xs">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-zinc-900 text-xs sm:text-sm leading-tight line-clamp-2">
                            {p.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 font-mono text-[10px] text-zinc-500">
                            <span className="font-bold">Model: {p.sku}</span>
                            <span className="text-zinc-305">•</span>
                            <span className="font-bold text-[#00478d]">Hãng: {p.brand}</span>
                          </div>
                        </div>
                      </div>

                      {/* Details specs block */}
                      <div className="grid grid-cols-2 gap-2 bg-zinc-50 border border-zinc-150 p-2.5 rounded-sm text-xs text-zinc-650">
                        <div>
                          <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wide block mb-0.5">Tồn Kho</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.stock > 10 ? 'bg-green-600' : 'bg-amber-600 animate-pulse'}`} />
                            {p.stock} Units
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wide block mb-0.5">Trạng thái</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                            isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-zinc-200 text-zinc-600 border border-zinc-300'
                          }`}>
                            {isActive ? 'Hiển thị' : 'Đã ẩn'}
                          </span>
                        </div>
                      </div>

                      {/* Documents block */}
                      <div className="text-xs">
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wide block mb-1">Tài liệu gắn kèm</span>
                        {p.documents && p.documents.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {p.documents.map((doc, dIdx) => (
                              <a 
                                key={dIdx} 
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] px-2.5 py-1 rounded-sm w-full font-medium hover:bg-amber-100 transition-colors truncate"
                                title={doc.url}
                              >
                                {doc.type === 'PDF' ? <FileText className="h-3.5 w-3.5 text-red-651 shrink-0" /> : <FileImage className="h-3.5 w-3.5 text-green-655 shrink-0" />}
                                <span className="truncate flex-1">{doc.name}</span>
                                <span className="text-[8px] opacity-45 uppercase font-mono tracking-widest text-[#001530]">Mở FILE ↗</span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-[11px] font-light italic">Không đính kèm tệp</span>
                        )}
                      </div>

                      {/* Buttons Action bar - Always visible directly with 44px min touch size */}
                      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-dashed border-zinc-200/80">
                        {isActive ? (
                          <>
                            <button 
                              onClick={() => handleStartEdit(p)}
                              className="px-4 py-2 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-center rounded-sm font-bold flex items-center justify-center gap-1.5 transition-all flex-1 cursor-pointer min-h-[40px]"
                              title="Sửa sản phẩm"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteProductClick(p.id)}
                              className="px-4 py-2 text-xs text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 text-center rounded-sm font-bold flex items-center justify-center gap-1.5 transition-all flex-1 cursor-pointer min-h-[40px]"
                              title="Ẩn sản phẩm"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Ẩn đi</span>
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleRestoreProductClick(p.id)}
                            className="px-4 py-2 text-xs font-extrabold uppercase text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm border border-emerald-500 transition-all flex items-center justify-center gap-1.5 w-full cursor-pointer min-h-[40px]"
                            title="Khôi phục thịnh hành"
                          >
                            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                            <span>Khôi phục hiển thị</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div className="py-12 bg-zinc-50 text-center text-sm text-zinc-400 font-light italic">
                    Không tìm thấy sản phẩm nào phù hợp!
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Customer RFQs list */}
        {activeTab === 'quotes' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-zinc-200 rounded-sm p-6 shadow-xs">
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-[#00478d]">
                Hồ sơ thông tin Báo Giá &amp; khách hàng liên hệ
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Tất cả các lượt hoàn tất điền form RFQ của khách hàng trên trang Landing Page đều hiển thị trực tiếp tại đây và tự động đổ về sheet <strong>"Quotes"</strong> để đại diện Marketing / Sales gọi liên hệ tư vấn.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-xs">
              
              {/* Desktop version - Tabular view */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left text-sm font-sans divide-y divide-zinc-200">
                  <thead className="bg-[#00478d] text-white font-display text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Thời Gian</th>
                      <th className="px-6 py-4 whitespace-normal min-w-[200px]">Khách Hàng &amp; Doanh Nghiệp</th>
                      <th className="px-6 py-4 whitespace-normal min-w-[220px]">Mặt hàng cần Báo Giá</th>
                      <th className="px-6 py-4 whitespace-normal min-w-[200px]">Lời Nhắn Kỹ Thuật</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-xs">
                    {quotesList.map((q, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4 text-zinc-400 font-mono font-medium whitespace-nowrap">{q.timestamp}</td>
                        <td className="px-6 py-4 whitespace-normal min-w-[200px] break-words">
                          <div>
                            <p className="font-extrabold text-zinc-800 text-sm leading-snug">{q.customerName}</p>
                            <p className="text-zinc-500 font-mono mt-0.5 break-all">{q.customerEmail} | Tel: {q.customerPhone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal min-w-[220px] break-words">
                          <p className="text-zinc-700 font-semibold leading-relaxed" title={q.items}>
                            {q.items}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-normal min-w-[200px] break-words">
                          <p className="text-zinc-500 font-light italic leading-relaxed" title={q.notes}>
                            {q.notes || 'Không ghi chú thêm'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button 
                            onClick={() => {
                              if (confirm('Xóa bản ghi báo giá này khỏi lịch sử hiển thị?')) {
                                setQuotesList(prev => prev.filter((_, i) => i !== idx));
                              }
                            }}
                            className="text-zinc-400 hover:text-red-650 p-1 rounded-full hover:bg-red-50 transition-all"
                            title="Xóa bản ghi"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {quotesList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 bg-zinc-50 text-center text-sm text-zinc-400 font-light italic">
                          Không có hồ sơ yêu cầu báo giá nào!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile version - Direct stacked details cards (No horizontal scrolling!) */}
              <div className="md:hidden divide-y divide-zinc-200 bg-white font-sans">
                {quotesList.map((q, idx) => (
                  <div key={idx} className="p-4 hover:bg-zinc-50/50 transition-colors flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-zinc-100/50 p-2 rounded-sm border border-zinc-200/50">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold">Lượt thứ #{idx + 1}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{q.timestamp}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-zinc-900 text-sm leading-tight">
                        {q.customerName}
                      </h4>
                      <p className="text-xs text-zinc-500 font-mono truncate">
                        Mail: <a href={`mailto:${q.customerEmail}`} className="text-blue-600 hover:underline">{q.customerEmail}</a>
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        Số điện thoại: <strong className="text-zinc-850 font-extrabold">{q.customerPhone}</strong>
                      </p>
                    </div>

                    {/* Request info card popup style */}
                    <div className="space-y-2 bg-slate-50 border border-slate-100 p-3 rounded-xs text-xs text-zinc-700">
                      <div>
                        <span className="text-[9px] text-[#00478d] uppercase tracking-wide font-extrabold block mb-0.5">Sản phẩm yêu cầu báo giá</span>
                        <p className="font-bold text-zinc-800 leading-snug">{q.items}</p>
                      </div>
                      <div className="border-t border-dashed border-zinc-200/80 pt-2 mt-2">
                        <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest block mb-0.5">Ghi chú &amp; Đơn vị</span>
                        <p className="text-zinc-650 font-light italic leading-relaxed">{q.notes || 'Không ghi chú thêm'}</p>
                      </div>
                    </div>

                    {/* Action button satisfying 44px touch layout perfectly */}
                    <div className="flex items-center justify-end pt-2 border-t border-dashed border-zinc-200/80">
                      <button 
                        onClick={() => {
                          if (confirm('Xóa bản ghi báo giá này khỏi lịch sử hiển thị?')) {
                            setQuotesList(prev => prev.filter((_, i) => i !== idx));
                          }
                        }}
                        className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 rounded text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 w-full cursor-pointer min-h-[44px]"
                        title="Xóa bản ghi"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Xóa yêu cầu khỏi danh sách</span>
                      </button>
                    </div>
                  </div>
                ))}
                {quotesList.length === 0 && (
                  <div className="py-12 bg-zinc-50/40 text-center text-sm text-zinc-400 font-light italic">
                    Không có hồ sơ yêu cầu báo giá nào!
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: Authorized Administrative emails */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-zinc-200 rounded-sm p-6 shadow-xs flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="space-y-1.5 max-w-xl">
                <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-[#00478d]">
                  Danh sách phân quyền quản trị (Admins)
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-light">
                  Phân quyền cho Sales / HR tự thêm sửa xóa sản phẩm mà không cần can thiệp Code. Nhân sự có đuôi email thuộc danh sách dưới đây sau khi nhấn <strong>"Sign In with Google"</strong> sẽ tự động được mở quyền can thiệp cơ sở dữ liệu.
                </p>
              </div>

              {/* Form to append Admins and push metadata to sheets */}
              <form onSubmit={handleAddAdminSubmit} className="flex gap-2 max-w-md w-full shrink-0">
                <input 
                  type="email" 
                  required 
                  placeholder="name.staff@tt-vina.com.vn"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
                
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="px-2 py-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600 focus:outline-hidden"
                >
                  <option>Sales Specialist</option>
                  <option>HR Specialist</option>
                  <option>Super Admin</option>
                </select>

                <button 
                  type="submit"
                  className="bg-[#00478d] hover:bg-primary-container text-white py-2 px-4 rounded font-display text-xs font-bold uppercase cursor-pointer flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Cấp Quyền</span>
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {adminsList.map((adm, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 p-5 rounded-sm relative flex items-center gap-4.5 shadow-xs">
                  <div className="w-10 h-10 bg-[#d5e0f7] text-primary flex items-center justify-center font-bold font-display rounded-full">
                    {adm.email.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#00478d] text-sm break-all pr-5">{adm.email}</h4>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-sm">
                      🛡️ {adm.role}
                    </span>
                  </div>
                  
                  {/* Delete power */}
                  {adm.email !== 'khaiy0968@gmail.com' && (
                    <button 
                      onClick={() => handleDeleteAdmin(adm.email)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition-all"
                      title="Thu hồi quyền Admin"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Google Sheets database direct sync controls */}
        {activeTab === 'sheets' && (
          <div className="bg-white border border-zinc-200 rounded-sm p-6 sm:p-8 shadow-xs max-w-4xl space-y-8 animate-fade-in">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-50 rounded-full border border-amber-200 text-amber-600">
                <Database className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase text-[#00478d]">
                  Cấu Hình Kết Nối &amp; Thiết Lập Database
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-light mt-1">
                  Cổng kết nối Google Spreadsheets API của T&amp;T Vina hoạt động hai chiều. Bạn có thể kéo dữ liệu sản phẩm công khai trực tiếp từ Sheet hoặc lưu trữ đè ngược lại toàn bộ cấu hình offline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-100 pt-6">
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs space-y-4">
                <h4 className="font-display text-xs font-extrabold uppercase text-zinc-700 tracking-wider">
                  Trạng thái liên kết Sheet ID
                </h4>
                
                <div className="space-y-2 text-xs">
                  <p className="text-zinc-600 flex justify-between">
                    <span>Mã định danh Workbook (ID):</span>
                    <strong className="font-mono text-zinc-800 break-all pl-4 text-right">{SPREADSHEET_ID}</strong>
                  </p>
                  <p className="text-zinc-600 flex justify-between">
                    <span>Đường dẫn Sheet liên kết:</span>
                    <a 
                      href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      Bấm để mở trang Sheet ↗
                    </a>
                  </p>
                  <p className="text-zinc-600 flex justify-between">
                    <span>Quyền hạn ghi đè live:</span>
                    <strong className={googleToken ? 'text-green-600' : 'text-red-500'}>
                      {googleToken ? '✓ Có (Đã kết nối OAuth)' : '✗ Đang offline (Yêu cầu login Google)'}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xs space-y-4">
                <h4 className="font-display text-xs font-extrabold uppercase text-zinc-700 tracking-wider">
                  Thao tác Khởi Tạo / Cứu Hộ Spreadsheet
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Nếu file Google Sheet của bạn đang trống chưa được cấu trúc bảng biểu, nhấn nút bên dưới để tự động tạo 4 trang biểu <strong>(Products, Quotes, Admins, Documents)</strong> với các tiêu đề chuẩn công nghệ của T&amp;T.
                </p>

                <button 
                  onClick={handleSyncAllToGoogleSheet}
                  disabled={isInitializingSheets}
                  className="w-full py-3 bg-[#00478d] hover:bg-primary-container text-white text-xs font-display font-bold uppercase tracking-wide rounded-xs shadow transition-colors block cursor-pointer text-center"
                >
                  {isInitializingSheets ? 'Đang Thiết Lập Cấu Trúc Sheet...' : 'Khởi tạo cấu trúc & Seeding dữ liệu mẫu'}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-5 rounded-xs flex gap-3.5 items-start">
              <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-sans font-bold text-amber-900 text-xs">⚠️ Hướng dẫn phân quyền quan trọng từ DEV:</h5>
                <p className="text-[11px] text-amber-800 leading-relaxed font-light">
                  Để đảm bảo tính độc lập nhất cho Sales và HR tự quản lý trực tuyến, hãy chắc chắn rằng file Google Sheet trên đã được cấu hình chỉnh sửa (Share: <strong>"Anyone with the link can view / editor"</strong>) để tất cả khách hàng truy cập landing page có thể xem được, và sales team có thể cập nhât thông tin từ xa.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ----------------- Modal Slide Drawer: Create Product ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden animate-slide-in border border-zinc-200">
            <div className="bg-[#00478d] p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-display text-sm font-extrabold uppercase tracking-tight flex items-center gap-2">
                  <Plus className="h-4.5 w-4.5 text-amber-400" />
                  Khai báo hồ sơ Sản phẩm mới
                </h3>
                <p className="text-[10px] text-zinc-300 mt-0.5">Liên kết trực tiếp tới tài nguyên PDF catalog / Excel / Word</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-amber-400 p-1 rounded-full border border-white/10 transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Tên Sản phẩm *</label>
                <input 
                  type="text" required placeholder="Trạm sấy linh kiện nâng cao T&T-99"
                  value={newProductName} onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Mã SKU / Model *</label>
                  <input 
                    type="text" required placeholder="TT-SMT-99"
                    value={newProductSku} onChange={(e) => setNewProductSku(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Số lượng trong kho</label>
                  <input 
                    type="number" placeholder="50"
                    value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Thương hiệu</label>
                  <select 
                    value={newProductBrand} onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full px-2 py-2 border border-zinc-200 rounded text-xs text-zinc-650 focus:outline-hidden font-medium bg-zinc-50"
                  >
                    <option>Hakko</option>
                    <option>Sudong</option>
                    <option>Quick</option>
                    <option>HIOS</option>
                    <option>WELLER</option>
                    <option>LOCTITE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Phân loại danh mục</label>
                  <select 
                    value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-2 py-2 border border-zinc-200 rounded text-xs text-zinc-650 focus:outline-hidden font-medium bg-zinc-50"
                  >
                    <option value="robot">Robot &amp; Tự động hóa</option>
                    <option value="han">Hàn &amp; Khử tĩnh điện</option>
                    <option value="keo">Keo &amp; Vật tư tiêu hao</option>
                    <option value="van-vit">Dụng cụ vặn vít</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Nhập Link Ảnh (Minh Họa)</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProductImage} 
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Nhập Link tài nguyên PDF (Catalog)</label>
                <input 
                  type="text" 
                  placeholder="https://gdrive.com/share/catalog.pdf"
                  value={newProductPdf} 
                  onChange={(e) => setNewProductPdf(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Nhập Link tài liệu Excel/Word (Bản vẽ, HDSD)</label>
                <input 
                  type="text" 
                  placeholder="https://gdrive.com/share/datasheet.xlsx"
                  value={newProductDoc} 
                  onChange={(e) => setNewProductDoc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Mô tả tóm tắt kỹ thuật</label>
                <textarea 
                  rows={3} placeholder="Thiết bị nạp mạch dán ổn định thiết lập mốt thông số dải rung..."
                  value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-display font-bold uppercase text-xs tracking-wider rounded transition-colors text-center cursor-pointer border border-zinc-200"
                >
                  Bỏ qua
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-display font-bold uppercase text-xs tracking-wider rounded shadow transition-colors text-center cursor-pointer"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- Modal Slide Drawer: Edit Product ----------------- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden border border-zinc-200 animate-slide-in">
            <div className="bg-[#00478d] p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-display text-sm font-extrabold uppercase tracking-tight flex items-center gap-2">
                  <Edit className="h-4.5 w-4.5 text-amber-400" />
                  Hiệu chỉnh hồ sơ sản phẩm
                </h3>
                <p className="text-[10px] text-zinc-300 mt-0.5">Thay đổi thông tin kỹ thuật & tài nguyên đính kèm</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)} 
                className="text-white hover:text-amber-400 p-1 rounded-full border border-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditProductSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Tên Sản phẩm *</label>
                <input 
                  type="text" required placeholder="Trạm sấy linh kiện nâng cao T&T-99"
                  value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Mã SKU / Model *</label>
                  <input 
                    type="text" required placeholder="TT-SMT-99"
                    value={editSku} onChange={(e) => setEditSku(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Số lượng trong kho</label>
                  <input 
                    type="number" placeholder="50"
                    value={editStock} onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Thương hiệu</label>
                  <select 
                    value={editBrand} onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-2 py-2 border border-zinc-200 rounded text-xs text-zinc-650 focus:outline-hidden font-medium bg-zinc-50"
                  >
                    <option>Hakko</option>
                    <option>Sudong</option>
                    <option>Quick</option>
                    <option>HIOS</option>
                    <option>WELLER</option>
                    <option>LOCTITE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Phân loại danh mục</label>
                  <select 
                    value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-2 py-2 border border-zinc-200 rounded text-xs text-zinc-650 focus:outline-hidden font-medium bg-zinc-50"
                  >
                    <option value="robot">Robot &amp; Tự động hóa</option>
                    <option value="han">Hàn &amp; Khử tĩnh điện</option>
                    <option value="keo">Keo &amp; Vật tư tiêu hao</option>
                    <option value="van-vit">Dụng cụ vặn vít</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Nhập Link Ảnh (Minh Họa)</label>
                <input 
                  type="text" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={editImage} 
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Nhập Link tài nguyên PDF (Catalog)</label>
                <input 
                  type="text" 
                  placeholder="https://gdrive.com/share/catalog.pdf"
                  value={editPdf} 
                  onChange={(e) => setEditPdf(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Nhập Link tài liệu Excel/Word (Bản vẽ, HDSD)</label>
                <input 
                  type="text" 
                  placeholder="https://gdrive.com/share/datasheet.xlsx"
                  value={editDoc} 
                  onChange={(e) => setEditDoc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Mô tả tóm tắt kỹ thuật</label>
                <textarea 
                  rows={3} placeholder="Thiết bị nạp mạch dán ổn định thiết lập mốt thông số dải rung..."
                  value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-zinc-50"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-display font-bold uppercase text-xs tracking-wider rounded transition-colors text-center cursor-pointer border border-zinc-200"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#00478d] hover:bg-primary-container text-white font-display font-bold uppercase text-xs tracking-wider rounded shadow transition-colors text-center cursor-pointer"
                >
                  Xác nhận sửa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- Modal: Custom Delete Confirmation (Safe in Iframes) ----------------- */}
      {productToDelete && (
        <div className="fixed inset-0 bg-zinc-950/75 backdrop-blur-xs z-[160] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-md w-full max-w-sm shadow-2xl overflow-hidden border border-zinc-200 animate-slide-in">
            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-white shrink-0" />
                {currentLang.code === 'VI' ? 'Xác nhận xóa linh kiện' : 'Confirm deletion'}
              </h3>
              <button 
                onClick={() => setProductToDelete(null)} 
                className="text-white hover:text-red-200 p-1 rounded-full transition-colors font-bold text-xs"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <p className="text-zinc-600 leading-relaxed">
                {currentLang.code === 'VI' 
                  ? 'Bạn có chắc chắn muốn gỡ bỏ hoàn toàn sản phẩm sau đây khỏi hệ thống?' 
                  : 'Are you sure you want to completely remove this product from the database catalog?'}
              </p>
              
              <div className="p-3 bg-red-50 rounded border border-red-100 flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-white overflow-hidden border border-red-100 shrink-0">
                  <img 
                    src={productToDelete.image} 
                    alt={productToDelete.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-zinc-900 truncate">{productToDelete.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">SKU: {productToDelete.sku}</p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-display font-bold uppercase text-[10px] tracking-wider rounded transition-colors text-center cursor-pointer border border-zinc-200"
                >
                  {currentLang.code === 'VI' ? 'Hủy bỏ' : 'Cancel'}
                </button>
                <button 
                  type="button"
                  onClick={handleConfirmDeleteProduct}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-display font-bold uppercase text-[10px] tracking-wider rounded shadow transition-colors text-center cursor-pointer"
                >
                  {currentLang.code === 'VI' ? 'Xác nhận xóa' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Action Feedback Toast Alert ----------------- */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#1e293b] text-white px-5 py-4 border-l-4 border-amber-500 rounded shadow-2xl flex items-center gap-3 animate-slide-in">
          <CheckCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <div className="text-sm font-semibold text-zinc-100">{actionSuccessMessage}</div>
          <button 
            onClick={() => setActionSuccessMessage(null)} 
            className="ml-3 text-zinc-400 hover:text-white font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

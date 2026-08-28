import React, { useState } from 'react';
import { Product } from '../types';
import { 
  PlusCircle, Search, TrendingUp, AlertTriangle, Globe, Inbox, Filter, Edit, 
  Trash2, RefreshCw, Upload, CloudLightning, LogOut, CheckCircle, Bell, User, 
  ChevronLeft, ChevronRight, X, FileImage, ShieldAlert
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export default function AdminDashboard({ products, onAddProduct, onDeleteProduct, onNavigate }: AdminDashboardProps) {
  // Local state for table & filters
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tất cả danh mục');
  const [filterBrand, setFilterBrand] = useState('Tất cả thương hiệu');

  // Interactive control modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  
  // Spinning indicator for rows being synchronised
  const [syncingRows, setSyncingRows] = useState<Record<string, 'syncing' | 'synced' | null>>({});

  // Local state for bulk upload drag are
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string }>>([]);

  // Add Product form fields
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('Hakko');
  const [newProductCategory, setNewProductCategory] = useState('Trạm hàn');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductDesc, setNewProductDesc] = useState('');

  // Handle addition
  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(newProductStock) || 0;
    const newP: Product = {
      id: `custom-${Date.now()}`,
      name: newProductName,
      sku: newProductSku || `HK-NEW-${Math.floor(100+Math.random()*900)}`,
      brand: newProductBrand,
      category: newProductCategory,
      image: 'https://images.unsplash.com/photo-1581092162384-8987c1796715?auto=format&fit=crop&q=80&w=300',
      stock: stockNum,
      status: stockNum > 20 ? 'In Stock' : (stockNum > 0 ? 'Low Stock' : 'Out of Stock'),
      price: 'Báo giá',
      shortDesc: newProductDesc || 'Sản phẩm mới cập nhật trong hệ thống.'
    };
    onAddProduct(newP);
    setShowAddModal(false);
    
    // Clear inputs
    setNewProductName('');
    setNewProductSku('');
    setNewProductDesc('');
  };

  // Row sync simulation
  const handleSyncRow = (id: string) => {
    setSyncingRows(prev => ({ ...prev, [id]: 'syncing' }));
    
    setTimeout(() => {
      setSyncingRows(prev => ({ ...prev, [id]: 'synced' }));
      setTimeout(() => {
        setSyncingRows(prev => ({ ...prev, [id]: null }));
      }, 2500);
    }, 1500);
  };

  // Bulk media drag trigger
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArr = Array.from(e.dataTransfer.files).map((f: any) => ({
        name: f.name as string,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`
      }));
      setUploadedFiles(prev => [...prev, ...filesArr]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArr = Array.from(e.target.files).map((f: any) => ({
        name: f.name as string,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`
      }));
      setUploadedFiles(prev => [...prev, ...filesArr]);
    }
  };

  // Calculate filtered totals
  const filteredList = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         p.sku.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = filterCategory === 'Tất cả danh mục' || p.category.includes(filterCategory);
    const matchesBrand = filterBrand === 'Tất cả thương hiệu' || p.brand.toLowerCase() === filterBrand.toLowerCase();
    
    return matchesQuery && matchesCat && matchesBrand;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-zinc-50 font-sans">
      
      {/* ----------------- Sub-Sidebar matching the Admin Layout Pictured ----------------- */}
      <aside className="w-full md:w-64 bg-zinc-100 border-r border-zinc-200/80 flex flex-col p-6 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#00478d]">T&amp;T Vina</h1>
          <p className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#545f72] mt-1">
            Industrial Equipment
          </p>
        </div>

        <nav className="flex-1 space-y-1.5 text-xs font-display font-bold uppercase tracking-wider">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-200/60 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-500">dashboard</span>
            <span>Dashboard</span>
          </button>
          
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#d5e0f7] text-primary rounded-md border-l-4 border-primary transition-colors font-extrabold"
          >
            <span className="material-symbols-outlined text-primary">inventory_2</span>
            <span>Products</span>
          </button>

          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-200/60 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-500">category</span>
            <span>Categories</span>
          </button>

          <button 
            onClick={() => setShowSyncModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-200/60 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-500">perm_media</span>
            <span>Media Library</span>
          </button>

          <button 
            onClick={() => onNavigate('cart')}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-200/60 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-500">shopping_cart</span>
            <span>Orders</span>
          </button>
        </nav>

        {/* Sidebar bottom action */}
        <div className="pt-6 border-t border-zinc-200 space-y-4">
          <button 
            onClick={() => {
              setUploadedFiles([]);
              setShowSyncModal(true);
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#00478d] hover:bg-primary-container text-white py-3 rounded-md font-display font-extrabold text-xs uppercase tracking-wider shift-y transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Product</span>
          </button>

          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-md font-display font-medium text-xs uppercase transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------- Content Workspace area (Scrollable) ----------------- */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Top Header navbar of Workspace */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00478d]">Quản lý sản phẩm</h2>
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span className="text-zinc-600 font-bold">Products</span>
            </nav>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* Inline search bar */}
            <div className="relative group max-w-xs">
              <input
                type="text"
                placeholder="Tìm sản phẩm, SKU..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-56 pl-9 pr-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded-full text-xs focus:ring-1 focus:ring-primary focus:outline-hidden focus:border-primary transition-all font-sans"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            </div>

            <div className="relative cursor-pointer hover:bg-zinc-200/50 p-1.5 rounded-full transition-colors">
              <Bell className="h-4 w-4 text-zinc-500" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-600 rounded-full" />
            </div>

            <div className="h-5 w-px bg-zinc-200" />

            {/* Profile badge styled */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold text-zinc-700 font-display uppercase tracking-wider leading-none">Admin User</p>
                <p className="text-[9px] text-zinc-400 font-sans mt-0.5">Super Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-xs text-primary bg-primary-container/25 border border-primary/20">
                A
              </div>
            </div>
          </div>
        </div>

        {/* Action Header Button matching picture top-right amber block */}
        <div className="flex justify-between items-center bg-white p-6 border border-zinc-200 rounded-sm shadow-xs">
          <div>
            <h3 className="font-display text-base font-extrabold text-zinc-700 uppercase tracking-wide">Cập nhật danh mục</h3>
            <p className="text-xs text-zinc-400 mt-1">Đồng bộ cơ sở dữ liệu kho bãi và hiển thị công khai trên cổng tin.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 rounded-md font-display font-extrabold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>

        {/* Bento Stats Widgets matching row stats grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats 1 */}
          <div className="bg-white border border-zinc-200 rounded-sm p-5 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-display font-extrabold tracking-widest uppercase block">Tổng sản phẩm</span>
              <span className="font-display font-black text-[#00478d] text-2xl sm:text-3xl block">1,482</span>
              <span className="text-[10px] text-emerald-600 font-bold inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs tháng trước
              </span>
            </div>
            <div className="h-12 w-12 rounded-md bg-primary-container/10 flex items-center justify-center text-[#005eb8]">
              <span className="material-symbols-outlined text-2xl">inventory</span>
            </div>
          </div>

          {/* Stats 2 */}
          <div className="bg-white border border-zinc-200 rounded-sm p-5 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-display font-extrabold tracking-widest uppercase block">Sắp hết hàng</span>
              <span className="font-display font-black text-amber-500 text-2xl sm:text-3xl block">24</span>
              <span className="text-[10px] text-amber-600 font-bold inline-flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Yêu cầu nhập kho ngay
              </span>
            </div>
            <div className="h-12 w-12 rounded-md bg-amber-50 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined text-2xl">production_quantity_limits</span>
            </div>
          </div>

          {/* Stats 3 */}
          <div className="bg-white border border-zinc-200 rounded-sm p-5 flex justify-between items-center shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-400 font-display font-extrabold tracking-widest uppercase block">Đang hiển thị</span>
              <span className="font-display font-black text-zinc-700 text-2xl sm:text-3xl block">1,340</span>
              <span className="text-[10px] text-zinc-400 font-bold inline-flex items-center gap-1">
                <Globe className="h-3 w-3 text-primary" />
                Trạng thái công khai
              </span>
            </div>
            <div className="h-12 w-12 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-500">
              <span className="material-symbols-outlined text-2xl">public</span>
            </div>
          </div>
        </div>

        {/* Filters Box layout block */}
        <div className="bg-white border border-zinc-200 rounded-sm p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                Tìm theo SKU / Tên
              </label>
              <input 
                type="text"
                placeholder="HAKKO-FX888D..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                Danh mục
              </label>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-2 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-primary focus:outline-hidden font-medium text-zinc-600"
              >
                <option>Tất cả danh mục</option>
                <option>Trạm hàn</option>
                <option>Mũi hàn</option>
                <option>Dụng cụ vặn vít</option>
                <option>Khỏ nhiệt</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-display font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                Thương hiệu
              </label>
              <select 
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full px-2 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs focus:ring-1 focus:ring-primary focus:outline-hidden font-medium text-zinc-600"
              >
                <option>Tất cả thương hiệu</option>
                <option>Hakko</option>
                <option>Quick</option>
                <option>HIOS</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setFilterQuery('');
                setFilterCategory('Tất cả danh mục');
                setFilterBrand('Tất cả thương hiệu');
              }}
              className="bg-zinc-100 hover:bg-zinc-200/85 text-zinc-700 py-2.5 px-4 rounded-md font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 select-none"
            >
              <Filter className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>

        {/* -------------------- Main data Table -------------------- */}
        <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#00478d] text-white font-display text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4 text-center">Tồn kho</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredList.map((product) => {
                  const syncState = syncingRows[product.id];
                  return (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-50 border border-zinc-200/80 rounded overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-800 text-xs sm:text-sm font-sans line-clamp-1">{product.name}</p>
                            <span className="text-[10px] text-primary font-bold">Brand: {product.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-500">{product.sku}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#d5e0f7] text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.stock > 20 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-pulse" />
                            Còn hàng ({product.stock})
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                            Sắp hết ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                            💥 Hết hàng
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-1">
                          
                          {/* Edit */}
                          <button 
                            onClick={() => alert(`Chỉnh sửa ${product.name}`)}
                            className="p-1 px-2 hover:bg-zinc-100 text-[#005eb8] rounded transition-colors"
                            title="Chỉnh sửa cấu hình"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Sync dynamic spinner */}
                          <button 
                            onClick={() => handleSyncRow(product.id)}
                            className={`p-1 px-2 rounded transition-colors ${
                              syncState === 'synced' ? 'text-emerald-600' : 'text-amber-600 hover:bg-zinc-100'
                            }`}
                            title="Sync to Production website"
                          >
                            <RefreshCw className={`h-4 w-4 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Delete */}
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1 px-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                            title="Xóa linh kiện"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table pagination */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-3">
            <p>Hiển thị 1 - {filteredList.length} của {products.length} sản phẩm</p>
            <div className="flex gap-1">
              <button className="w-7 h-7 flex items-center justify-center border border-zinc-200 rounded text-zinc-400 hover:bg-zinc-100">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-[#00478d] bg-[#00478d] text-white rounded font-bold text-xs">
                1
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-zinc-200 text-zinc-600 hover:bg-zinc-100 rounded text-xs">
                2
              </button>
              <button className="w-7 h-7 flex items-center justify-center border border-zinc-200 rounded text-zinc-400 hover:bg-zinc-100">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* -------------------- Floating Sync FAB bottom right matching custom design -------------------- */}
      <button 
        onClick={() => {
          setUploadedFiles([]);
          setShowSyncModal(true);
        }}
        className="fixed bottom-6 right-6 h-14 w-14 bg-amber-500 text-zinc-950 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-100 border border-amber-600 cursor-pointer"
        title="Đồng bộ hệ thống"
      >
        <span className="material-symbols-outlined text-3xl animate-pulse">cloud_sync</span>
      </button>

      {/* ----------------- Slide Drawer/Modal: Add New Product ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-sm w-full max-w-lg shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-[#00478d] p-5 text-white flex justify-between items-center">
              <h3 className="font-display text-lg font-extrabold uppercase tracking-tight">Thêm sản phẩm mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-amber-400 p-1 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddNewProductSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Tên sản phẩm *</label>
                <input 
                  type="text" required placeholder="Hakko T12 Mũi hàn dẹp..."
                  value={newProductName} onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-sm text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Mã SKU / Model</label>
                  <input 
                    type="text" placeholder="HK-T12"
                    value={newProductSku} onChange={(e) => setNewProductSku(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-sm text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Số lượng kho</label>
                  <input 
                    type="number" placeholder="50"
                    value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-sm text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Thương hiệu</label>
                  <select 
                    value={newProductBrand} onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full px-2 py-2 border border-zinc-200 rounded-sm text-xs focus:ring-1 focus:ring-primary font-medium text-zinc-600"
                  >
                    <option>Hakko</option>
                    <option>Quick</option>
                    <option>HIOS</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Phân loại danh mục</label>
                  <select 
                    value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full px-2 py-2 border border-zinc-200 rounded-sm text-xs focus:ring-1 focus:ring-primary font-medium text-zinc-600"
                  >
                    <option>Trạm hàn</option>
                    <option>Mũi hàn</option>
                    <option>Dụng cụ vặn vít</option>
                    <option>Khỏ nhiệt</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-zinc-400">Mô tả sản phẩm</label>
                <textarea 
                  rows={3} placeholder="Thiết kế đặc trưng bọc phủ nhiệt cao cấp..."
                  value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-sm text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#00478d] hover:bg-primary-container text-white font-display font-bold uppercase text-xs tracking-wider rounded-sm shadow-xs transition-colors cursor-pointer"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- Sync Hub Modal Pictured ----------------- */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-xs shadow-2xl w-full max-w-xl overflow-hidden border border-zinc-200 relative animate-slide-in">
            
            {/* Modal head */}
            <div className="bg-[#00478d] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-tight">Upload &amp; Sync Hub</h3>
                <p className="text-[10px] text-zinc-200 font-display font-bold uppercase tracking-widest mt-1">
                  Pushing updates to tt-vina.com.vn
                </p>
              </div>
              <button 
                onClick={() => setShowSyncModal(false)}
                className="text-white hover:text-amber-400 p-1.5 rounded-full border border-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Drag drop region styled */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center hover:bg-zinc-50 transition-colors cursor-pointer group text-center ${
                  dragActive ? 'border-[#005eb8] bg-[#d5e0f7]/10' : 'border-zinc-200 bg-zinc-50/50'
                }`}
              >
                <input 
                  type="file" multiple id="bulkImageFileInput" className="hidden" 
                  onChange={handleFileSelect} accept="image/*"
                />
                <label htmlFor="bulkImageFileInput" className="cursor-pointer space-y-3 block">
                  <div className="mx-auto w-12 h-12 bg-zinc-100 group-hover:bg-[#d5e0f7]/20 flex items-center justify-center rounded-full text-zinc-400 group-hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                  </div>
                  <p className="font-bold text-zinc-700 text-xs sm:text-sm font-sans">Kéo thả hình ảnh hoặc chọn tệp</p>
                  <p className="text-[10px] text-zinc-400">Hỗ trợ định dạng .jpg, .png lên đến 5MB mỗi ảnh</p>
                </label>
              </div>

              {/* Uploaded Files status list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <h4 className="text-[10px] font-display font-bold text-zinc-400 uppercase tracking-wider">Tệp đã chọn</h4>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-zinc-50 border border-zinc-200 rounded text-xs text-zinc-600">
                      <div className="flex items-center gap-2 truncate">
                        <FileImage className="h-4 w-4 text-[#005eb8] flex-none" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="font-mono text-[10px] flex-none ml-2 text-zinc-400">{file.size}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sync History list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-display font-bold text-zinc-400 uppercase tracking-wider">Lịch sử đồng bộ gần nhất</h4>
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded text-xs select-none">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-none" />
                    <span className="text-zinc-700 font-medium">Cập nhật giá 24 mặt hàng Hakko</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">10:42 AM - Today</span>
                </div>
              </div>

              {/* Sync command submission */}
              <button 
                onClick={() => {
                  alert('Đang đẩy dữ liệu lên cơ sở dữ liệu cloud...');
                  setShowSyncModal(false);
                }}
                className="w-full py-4 bg-[#00478d] hover:bg-primary-container text-white font-display font-extrabold text-xs uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CloudLightning className="h-4 w-4" />
                <span>Bắt đầu đồng bộ dữ liệu</span>
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

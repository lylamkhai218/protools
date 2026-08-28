import React, { useState } from 'react';
import { Search, Globe, FileText, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onSearch?: (query: string) => void;
}

export default function Header({ currentTab, onTabChange, cartCount, onSearch }: HeaderProps) {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    }
  };

  const menuItems = [
    { key: 'home', label: 'Trang chủ' },
    { key: 'robot', label: 'Robot' },
    { key: 'han', label: 'Hàn' },
    { key: 'keo', label: 'Keo' },
    { key: 'van-vit', label: 'Vặn vít' },
    { key: 'murrplastik', label: 'Murrplastik' },
    { key: 'document-center', label: 'Trung tâm kỹ thuật' },
    { key: 'admin', label: 'Quản trị Admin' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-surface-container-high shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => onTabChange('home')} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="font-display text-2xl font-extrabold text-[#00478d] tracking-tight">
              T&T Vina
            </span>
            <div className="hidden md:flex flex-col border-l border-surface-container-highest pl-2">
              <span className="text-[10px] text-zinc-400 font-display font-medium uppercase tracking-wider leading-none">
                Industrial Precision
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {menuItems.map((item) => {
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'murrplastik') {
                      window.location.href = '/murrplastik/';
                    } else {
                      onTabChange(item.key);
                    }
                  }}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md relative ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-zinc-600 hover:text-primary hover:bg-zinc-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Elements (Search, Language, Quote Action) */}
          <div className="flex items-center gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-56 lg:w-64 pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </form>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 border border-zinc-200 px-2.5 py-1.5 rounded-md hover:bg-zinc-50 cursor-pointer select-none">
              <Globe className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-medium">VN / EN</span>
            </div>

            {/* Quote Cart Button */}
            <button
              id="headerQuoteBtn"
              onClick={() => onTabChange('cart')}
              className="flex items-center gap-2 bg-[#005eb8] text-white px-4 py-2.5 rounded-xs font-display text-xs font-semibold uppercase tracking-wider hover:bg-primary hover:shadow-md transition-all relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Báo giá nhanh</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-tertiary text-zinc-950 font-sans font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}

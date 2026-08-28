import { Share2, Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-100 border-t border-zinc-200 pt-16 pb-8 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-primary">T&T Vina</h3>
            <p className="text-sm font-light text-zinc-500 max-w-xs leading-relaxed">
              Leading industrial solutions provider in Vietnam specializing in precision assembly and automation.
            </p>
            <div className="flex gap-3 text-zinc-400">
              <button className="p-2 hover:bg-zinc-200 rounded-full transition-colors" title="Share">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-zinc-200 rounded-full transition-colors" title="Global Portal">
                <Globe className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Column 1: main products */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold tracking-wider text-zinc-800 uppercase">
              Sản phẩm chính
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary hover:underline transition-all">
                  Thiết bị hàn Hakko
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline transition-all">
                  Tô vít điện Hios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline transition-all">
                  Robot tự động hóa
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: support */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold tracking-wider text-zinc-800 uppercase">
              Hỗ trợ
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary hover:underline transition-all">
                  Technical Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline transition-all">
                  Warehouse Locations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline transition-all">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: certification */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-bold tracking-wider text-zinc-800 uppercase">
              Chứng nhận
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-zinc-700">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">ISO 9001:2015 Certified</span>
              </div>
              <p className="text-xs text-zinc-400 pl-6">
                Chất lượng quản lý vận hành đạt chuẩn quốc tế.
              </p>
              <div className="flex items-center gap-2 text-zinc-700 mt-2">
                <ShieldCheck className="h-4 w-4 text-tertiary" />
                <span className="font-medium">Hakko Authorized Dealer</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom footer */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400">
          <p>© 2026 T&T Vina. Industrial Solutions Provider.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-primary transition-colors cursor-pointer">VN/EN</span>
            <span>•</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Hotline: 1900 xxxx</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

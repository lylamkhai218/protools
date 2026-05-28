import { MapPin, Phone, Mail, Globe, Rss, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Footer() {
  const { currentLang, t } = useLanguage();

  const isVi = currentLang.code === 'VI';

  return (
    <footer className="bg-[#001530] text-zinc-300 border-t border-[#002244] font-sans">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Authorization Segment */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-extrabold text-white tracking-widest uppercase">
                T&T Vina
              </h3>
              <p className="text-sm font-normal text-zinc-400 leading-relaxed">
                {isVi 
                  ? 'Đơn vị ủy quyền chính thức từ các tập đoàn thiết bị hàng đầu thế giới. Cam kết chất lượng và hỗ trợ kỹ thuật trọn đời.'
                  : 'Official authorized distributor from leading global engineering groups. Committed to lifetime quality and technical support.'}
              </p>
            </div>
            
            {/* Badges / Micro Certificates */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1.5 border border-white/20 bg-white/5 rounded-xs font-display text-[10px] font-bold text-white tracking-wider uppercase select-none">
                ISO 9001:2015
              </span>
              <span className="px-3 py-1.5 border border-white/20 bg-white/5 rounded-xs font-display text-[10px] font-bold text-white tracking-wider uppercase select-none">
                {isVi ? 'ỦY QUYỀN HAKKO' : 'HAKKO AUTHORIZED'}
              </span>
            </div>
          </div>

          {/* Column 2: THÔNG TIN CTY */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-extrabold tracking-wider text-white uppercase pb-2 border-b border-white/10">
              {isVi ? 'THÔNG TIN CTY' : 'COMPANY INFO'}
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400 font-medium">
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Thông tin công ty' : 'About T&T Vina'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Chứng nhận đại lý' : 'Agency Certifications'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Bản đồ kho hàng' : 'Warehouse Inventory Locations'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Trung tâm kỹ thuật' : 'Technical Solution Hub'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: HỖ TRỢ KHÁCH HÀNG */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-extrabold tracking-wider text-white uppercase pb-2 border-b border-white/10">
              {isVi ? 'HỖ TRỢ KHÁCH HÀNG' : 'CUSTOMER SUPPORT'}
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400 font-medium">
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Liên hệ hỗ trợ' : 'Contact Support'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Chính sách bảo hành' : 'Warranty Policies'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Hỗ trợ kỹ thuật 24/7' : '24/7 Engineering Line'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline transition-all">
                  {isVi ? 'Chính sách bảo mật' : 'Privacy Policies'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: THÔNG TIN LIÊN HỆ & MAP */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-extrabold tracking-wider text-white uppercase pb-2 border-b border-white/10">
              {isVi ? 'THÔNG TIN LIÊN HỆ' : 'CONTACT INFO'}
            </h4>
            
            <div className="space-y-3.5 text-sm">
              {/* Address */}
              <div className="flex gap-2.5 items-start">
                <MapPin className="h-4 w-4 text-[#e8a020] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white text-xs uppercase tracking-wide">
                    {isVi ? 'Tổng kho Miền Bắc' : 'Northern Vietnam Main Depot'}
                  </h5>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Lĩnh Nam, Hoàng Mai, Hà Nội
                  </p>
                </div>
              </div>

              {/* Tel / Hotline */}
              <div className="flex gap-2.5 items-start">
                <Phone className="h-4 w-4 text-[#e8a020] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white text-xs uppercase tracking-wide">
                    Hotline & Zalo
                  </h5>
                  <p className="text-[#e8a020] font-black text-xs md:text-sm tracking-normal mt-0.5 select-all">
                    0983.794.782 - 0915.168.824
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-2.5 items-start">
                <Mail className="h-4 w-4 text-[#e8a020] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white text-xs uppercase tracking-wide">
                    Email
                  </h5>
                  <p className="text-zinc-300 font-semibold text-xs mt-0.5 select-all">
                    t2t.vina@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Live Google Map iframe */}
            <div className="mt-4 rounded bg-zinc-900 border border-white/10 overflow-hidden h-36 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.247087634634!2d105.88000537596898!3d20.982730289356585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af403f911f35%3A0x3f76ca4d5d07f6c5!2sC%C3%B4ng%20ty%20TTPC!5e0!3m2!1svi!2s!4v1779787500261!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TTPC Google Map"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Legal Bar */}
      <div className="bg-[#001026] border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-medium">
          <p className="text-zinc-500 hover:text-zinc-400 transition-colors">
            {isVi 
              ? '© 2026 protools.com.vn - Giải pháp thiết bị công nghiệp B2B chuyên nghiệp'
              : '© 2026 protools.com.vn - Professional Industrial B2B Solution Provider'}
          </p>
          <div className="flex gap-4 items-center">
            <a href="#" className="hover:text-white transition-colors">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Mail className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Rss className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

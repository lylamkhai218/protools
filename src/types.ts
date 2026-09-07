export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  categorySlug: string;
  origin: string;
  image: string;
  images?: string[];
  stock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Contact Order';
  stockLocation?: string; // e.g. "Kho Bắc Ninh (Sẵn 15 bộ)", "Kho TP.HCM (Sẵn 8 bộ)"
  price?: string; // e.g. "2.450.000 đ" or "Liên hệ báo giá dự án"
  shortDesc: string;
  highlights?: string[];
  specs: Record<string, string>;
  features?: string[];
  applications?: Array<{ name: string; desc: string; icon?: string }>;
  documents?: Array<{ name: string; type: string; size: string; url?: string }>;
  includedAccessories?: string[];
}

export interface Document {
  id: string;
  title: string;
  sku: string;
  brand: string;
  size: string;
  category: string;
  type: 'PDF' | 'CAD' | '3D STEP' | 'Cert';
  updatedAt: string;
  downloadCount: number;
  url?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  projectNote?: string;
}

export interface Partner {
  name: string;
  logoText: string;
  country: string;
  category: string;
  description: string;
  url?: string;
  brandColor?: string;
  hoverBorderClass?: string;
  hoverBgClass?: string;
  hoverTextClass?: string;
  categorySlug?: string;
}

export interface Solution {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  iconName: string;
  tag: string;
  badge: string;
  bgGradient: string;
  featuredProductsCount: number;
  standards: string[];
}

export interface IndustryApplication {
  id: string;
  name: string;
  enName: string;
  iconName: string;
  desc: string;
  typicalTools: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price?: string; // e.g. "245.000 VND" or "Báo giá"
  shortDesc?: string;
  specs?: Record<string, string>;
  applications?: Array<{ name: string; desc: string; icon: string }>;
  documents?: Array<{ name: string; type: string; size: string; url?: string }>;
  activeStatus?: number; // 1 = active, 0 = deactive
  create_at?: string;
  update_at?: string;
}

export interface Document {
  id: string;
  title: string;
  sku: string;
  size: string;
  category: string;
  updatedAt: string;
  downloadCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Partner {
  name: string;
  logo: string;
}

export interface Solution {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
}

# DATA MODEL & TYPESCRIPT DEFINITIONS

## 1. TYPESCRIPT CORE INTERFACES (DATA CONTRACT)

```typescript
// Danh mục thiết bị
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  sortOrder: number;
}

// Thương hiệu
export interface Brand {
  id: string;
  name: string;
  slug: string;
  originCountry: string;
  logoUrl?: string;
}

// Sản phẩm cha (Dòng thiết bị)
export interface Product {
  id: string;
  categoryId: string;
  brandId: string;
  name: string;
  slug: string;
  material: string;
  coating?: string;
  helixAngle?: number;
  workpieceHardnessMax?: number; // Ví dụ: 55 HRC
  applicableMaterials: string[]; // ['Thép carbon', 'Thép hợp kim', 'Inox', 'Nhôm']
  description: string;
  imageUrl: string;
  datasheetUrl?: string;
  variants: ProductVariant[];
}

// Biến thể kỹ thuật (Dòng trong bảng Spec-sheet)
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  diameter_D: number;         // Đường kính cắt (mm)
  shankDiameter_d: number;    // Đường kính cán (mm)
  fluteLength_l: number;       // Chiều dài me cắt (mm)
  overallLength_L: number;     // Tổng chiều dài (mm)
  fluteCount: number;          // Số me cắt (ví dụ: 2, 4)
  cornerRadius_R?: number;     // Bán kính góc bo R (mm)
  price?: number;              // Giá tham khảo (0 nếu liên hệ)
  stockStatus: 'in_stock' | 'low_stock' | 'pre_order';
  moq: number;                 // Số lượng đặt tối thiểu
}

// Giỏ hàng báo giá RFQ
export interface RFQCartItem {
  variant: ProductVariant;
  product: Product;
  quantity: number;
  note?: string;
}

// Đơn yêu cầu báo giá
export interface RFQSubmission {
  companyName: string;
  taxCode?: string;
  contactName: string;
  phone: string;
  email: string;
  projectName?: string;
  notes?: string;
  items: Array<{
    variantId: string;
    sku: string;
    quantity: number;
    note?: string;
  }>;
}
```

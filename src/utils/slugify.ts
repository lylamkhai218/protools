/**
 * SEO SLUGIFY UTILITY
 * T&T Vina Industrial (Protools.com.vn)
 * Chuẩn hóa URL Semantic Slugs tiếng Việt không dấu & Trích xuất mã SKU
 */

export function toSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, ' ') // Thay ký tự đặc biệt bằng khoảng trắng
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-'); // Bỏ dấu gạch ngang liên tiếp
}

export function createProductSlug(name: string, sku: string): string {
  const nameSlug = toSlug(name || 'san-pham');
  const skuSlug = toSlug(sku || '');
  if (!skuSlug) return nameSlug;
  // Tránh lặp nếu tên đã chứa sku
  if (nameSlug.endsWith(skuSlug)) return nameSlug;
  return `${nameSlug}-${skuSlug}`;
}

export function getProductPath(product: { name: string; sku?: string; id?: string }): string {
  if (!product) return '/';
  const sku = product.sku || product.id || '';
  const slug = createProductSlug(product.name, sku);
  return `/san-pham/${slug}`;
}

export function getCategoryPath(categorySlug: string): string {
  if (!categorySlug || categorySlug === 'all') return '/';
  return `/danh-muc/${categorySlug}`;
}

/**
 * Trích xuất SKU từ URL slug (chuẩn: ...-sku)
 * Hỗ trợ các định dạng SKU như TTPC-0289, PVN10465, MP-1081, HK-801, CL-4000
 */
export function extractSkuFromSlug(slug: string): string | null {
  if (!slug) return null;
  const clean = slug.trim().replace(/^\/san-pham\//, '').replace(/\/$/, '');
  
  // Trường hợp slug chính là SKU (VD: PVN10465 hoặc TTPC-0289)
  if (/^[a-zA-Z0-9_-]+$/.test(clean) && clean.length <= 20 && !clean.includes(' ')) {
    return clean;
  }
  
  // Trích xuất phần đuôi sau dấu gạch ngang cuối cùng
  const parts = clean.split('-');
  if (parts.length >= 2) {
    // Thử ghép 2 phần cuối nếu SKU có gạch nối (VD: ttpc-0289 hoặc mp-1081)
    const lastTwo = `${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
    return lastTwo;
  }
  
  return parts[parts.length - 1] || null;
}

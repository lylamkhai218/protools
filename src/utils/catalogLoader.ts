import { Product } from '../types';
import { PRODUCTS } from '../data';

let cachedCatalog: Product[] | null = null;
let catalogPromise: Promise<Product[]> | null = null;

/**
 * Asynchronously loads the 7,500+ SKU catalog index from /data/catalog_index.json.
 * Deduplicates and caches the merged array in memory for instant reuse across components.
 */
export async function loadCatalogIndex(): Promise<Product[]> {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  if (catalogPromise) {
    return catalogPromise;
  }

  catalogPromise = (async () => {
    try {
      const res = await fetch('/data/catalog_index.json');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load catalog_index.json`);
      }
      const data: Product[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const flagshipSkus = new Set(PRODUCTS.map(p => p.sku.toLowerCase()));
        const extraProducts = data.filter(p => !flagshipSkus.has(p.sku.toLowerCase()));
        cachedCatalog = [...PRODUCTS, ...extraProducts];
        return cachedCatalog;
      }
    } catch (err) {
      console.warn('Could not load /data/catalog_index.json, falling back to flagship catalog:', err);
    }
    cachedCatalog = PRODUCTS;
    return cachedCatalog;
  })();

  return catalogPromise;
}

/**
 * Synchronous getter: returns cached catalog if already loaded, otherwise fallback PRODUCTS.
 */
export function getCachedCatalog(): Product[] {
  return cachedCatalog || PRODUCTS;
}

/**
 * Returns true if the full 7,500+ SKU index is already cached in memory.
 */
export function isCatalogLoaded(): boolean {
  return cachedCatalog !== null && cachedCatalog.length > PRODUCTS.length;
}

export interface SearchResultItem {
  product: Product;
  score: number;
}

/**
 * High-performance multi-term fuzzy search across the catalog.
 * Supports searching by SKU, Model, Name, Brand, Category, and Technical Tags.
 */
export function searchCatalog(query: string, limit = 8): { results: Product[]; totalMatches: number } {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { results: [], totalMatches: 0 };
  }

  const catalog = getCachedCatalog();
  const tokens = q.split(/\s+/).filter(Boolean);

  const matched: SearchResultItem[] = [];

  for (let i = 0; i < catalog.length; i++) {
    const p = catalog[i];
    const sku = (p.sku || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const tags = (p.tags || '').toLowerCase();

    const cleanSku = sku.replace(/[-_.\s]/g, '');

    // All tokens must match at least one attribute
    let allTokensMatch = true;
    for (const token of tokens) {
      const cleanToken = token.replace(/[-_.\s]/g, '');
      const matchSku = sku.includes(token) || (cleanToken.length >= 2 && cleanSku.includes(cleanToken));
      if (
        !matchSku &&
        !name.includes(token) &&
        !brand.includes(token) &&
        !cat.includes(token) &&
        !tags.includes(token)
      ) {
        allTokensMatch = false;
        break;
      }
    }

    if (!allTokensMatch) continue;

    // Relevance scoring
    let score = 0;
    const cleanQ = q.replace(/[-_.\s]/g, '');
    if (sku === q || (cleanQ.length >= 2 && cleanSku === cleanQ)) {
      score += 200;
    } else if (sku.startsWith(q) || (cleanQ.length >= 2 && cleanSku.startsWith(cleanQ))) {
      score += 120;
    } else if (sku.includes(q) || (cleanQ.length >= 2 && cleanSku.includes(cleanQ))) {
      score += 80;
    }

    if (name.startsWith(q)) {
      score += 60;
    } else if (name.includes(q)) {
      score += 40;
    }

    if (brand.includes(q)) {
      score += 30;
    }

    if (cat.includes(q)) {
      score += 20;
    }

    matched.push({ product: p, score });
  }

  // Sort descending by score
  matched.sort((a, b) => b.score - a.score);

  return {
    results: matched.slice(0, limit).map(m => m.product),
    totalMatches: matched.length
  };
}

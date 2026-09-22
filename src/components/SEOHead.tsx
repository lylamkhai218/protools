import { useEffect } from 'react';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { generateProductSEODescription } from '../utils/seoDescription';
import { getProductPath, getCategoryPath } from '../utils/slugify';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  product?: Product | null;
  categoryName?: string;
  categorySlug?: string;
  ogType?: 'website' | 'product' | 'article';
}

const BASE_URL = 'https://protools.com.vn';
const DEFAULT_IMAGE = 'https://protools.com.vn/logos/TTV_LOGO_Color_Master.png';
const COMPANY_NAME = 'T&T VINA INDUSTRIAL CO., LTD';

export default function SEOHead({
  title: propTitle,
  description: propDescription,
  canonicalUrl: propCanonicalUrl,
  product,
  categoryName,
  categorySlug,
  ogType = 'website'
}: SEOHeadProps) {
  const { locale } = useTranslation();

  useEffect(() => {
    // 1. Synchronize HTML lang attribute
    document.documentElement.lang = locale || 'vi';

    // 2. Compute dynamic title, description, image, and canonical URL
    let pageTitle = 'T&T VINA INDUSTRIAL CO., LTD | Thiết Bị Công Nghiệp & Tự Động Hóa (Protools)';
    let pageDesc = 'T&T Vina Industrial - Nhà phân phối chính hãng thiết bị công nghiệp, robot tự động hóa, vật tư phòng sạch ESD, phụ kiện Murrplastik Đức, Hakko, Quick, Hios tại Việt Nam. Kho sẵn tại Hà Nội & Hưng Yên.';
    let pageImage = DEFAULT_IMAGE;
    let pageCanonical = `${BASE_URL}/`;
    let isProductView = false;

    if (product) {
      isProductView = true;
      const sku = product.sku || product.id || '';
      const brand = product.brand ? `[${product.brand}] ` : '';
      pageTitle = `${product.name} ${sku ? `(${sku})` : ''} ${brand}| T&T VINA Industrial`;
      
      const { metaDescription } = generateProductSEODescription(product);
      pageDesc = product.shortDesc || metaDescription;

      const rawImg = product.image || (product.images && product.images[0]) || '';
      if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
        pageImage = rawImg;
      } else if (rawImg.startsWith('/')) {
        pageImage = `${BASE_URL}${rawImg}`;
      }

      pageCanonical = `${BASE_URL}${getProductPath(product)}`;
    } else if (categorySlug && categorySlug !== 'all') {
      const catTitle = categoryName || categorySlug;
      pageTitle = `${catTitle} Chính Hãng | Báo Giá & Thông Số Kỹ Thuật - T&T VINA`;
      pageDesc = `Danh mục ${catTitle} phân phối chính hãng bởi T&T Vina Industrial. Đầy đủ chứng chỉ CO/CQ, bảng báo giá B2B số lượng lớn, giao hàng nhanh 24h.`;
      pageCanonical = `${BASE_URL}${getCategoryPath(categorySlug)}`;
    } else if (propTitle) {
      pageTitle = propTitle;
      if (propDescription) pageDesc = propDescription;
      if (propCanonicalUrl) pageCanonical = propCanonicalUrl;
    }

    // 3. Update Document Title
    document.title = pageTitle;

    // Helper to safely set or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    // Helper to set or create link tags
    const setLinkTag = (rel: string, href: string, extraAttrs?: Record<string, string>) => {
      let selector = `link[rel="${rel}"]`;
      if (extraAttrs?.hreflang) {
        selector += `[hreflang="${extraAttrs.hreflang}"]`;
      }
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (extraAttrs) {
          Object.entries(extraAttrs).forEach(([k, v]) => el?.setAttribute(k, v));
        }
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 4. Set Standard & GEO Meta Tags
    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'author', COMPANY_NAME);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow');

    // Geolocation & GEO (Generative Engine Optimization) Meta Tags
    setMetaTag('name', 'geo.region', 'VN-HN');
    setMetaTag('name', 'geo.placename', 'Hà Nội, Hưng Yên, Việt Nam');
    setMetaTag('name', 'geo.position', '20.982887;105.881468');
    setMetaTag('name', 'ICBM', '20.982887, 105.881468');

    // 5. Set Canonical Link
    setLinkTag('canonical', pageCanonical);

    // 6. Set International hreflang Links
    setLinkTag('alternate', pageCanonical, { hreflang: 'vi' });
    setLinkTag('alternate', pageCanonical, { hreflang: 'en' });
    setLinkTag('alternate', pageCanonical, { hreflang: 'x-default' });

    // 7. Set Open Graph Meta Tags (Zalo, Facebook, LinkedIn)
    setMetaTag('property', 'og:type', isProductView ? 'product' : ogType);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', pageCanonical);
    setMetaTag('property', 'og:site_name', 'Protools T&T VINA Industrial');
    setMetaTag('property', 'og:locale', locale === 'vi' ? 'vi_VN' : 'en_US');

    // 8. Set Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', pageImage);

    // 9. Inject or Update Schema.org JSON-LD
    let scriptTag = document.getElementById('protools-dynamic-seo-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'protools-dynamic-seo-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (isProductView && product) {
      const sku = product.sku || product.id || 'N/A';
      const productSchema = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': product.name,
        'image': [pageImage],
        'description': pageDesc,
        'sku': sku,
        'mpn': sku,
        'brand': {
          '@type': 'Brand',
          'name': product.brand || 'T&T VINA Industrial'
        },
        'category': product.category || 'Thiết bị công nghiệp',
        'offers': {
          '@type': 'Offer',
          'url': pageCanonical,
          'priceCurrency': 'VND',
          'price': '0', // B2B Request For Quote
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': (product.stock ?? 1) > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/PreOrder',
          'seller': {
            '@type': ['WholesaleStore', 'LocalBusiness', 'Organization'],
            'name': COMPANY_NAME,
            'url': BASE_URL,
            'telephone': '+84-915-168-824',
            'email': 't2t.vina@gmail.com',
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam',
              'addressLocality': 'Quận Hoàng Mai',
              'addressRegion': 'Hà Nội',
              'postalCode': '100000',
              'addressCountry': 'VN'
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': 20.982887,
              'longitude': 105.881468
            },
            'hasMap': 'https://maps.app.goo.gl/cMn6HEe4KqVGCpPV7',
            'areaServed': [
              'VN', 'Hà Nội', 'Hưng Yên', 'Bắc Ninh', 'Bắc Giang', 'Hải Phòng', 'Vĩnh Phúc', 'Hải Dương', 'Hà Nam', 'Thái Nguyên'
            ]
          },
          'hasMerchantReturnPolicy': {
            '@type': 'MerchantReturnPolicy',
            'applicableCountry': 'VN',
            'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
            'merchantReturnDays': 30
          }
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Trang Chủ',
              'item': BASE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': product.category || 'Danh Mục',
              'item': `${BASE_URL}${getCategoryPath(product.categorySlug || 'all')}`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': product.name,
              'item': pageCanonical
            }
          ]
        }
      };
      scriptTag.textContent = JSON.stringify(productSchema);
    } else {
      // Organization / LocalBusiness + WebSite Schema Graph
      const websiteSchema = {
        '@context': 'https://schema.org/',
        '@graph': [
          {
            '@type': ['WholesaleStore', 'LocalBusiness', 'Corporation'],
            '@id': `${BASE_URL}/#organization`,
            'name': COMPANY_NAME,
            'alternateName': ['T&T VINA INDUSTRIAL CO., LTD', 'Protools Việt Nam', 'Protools.com.vn'],
            'url': BASE_URL,
            'logo': `${BASE_URL}/logos/TTV_LOGO_Color_Master.png`,
            'image': `${BASE_URL}/logos/TTV_LOGO_Color_Master.png`,
            'telephone': '+84-915-168-824',
            'email': 't2t.vina@gmail.com',
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Số 11/68/467 Lĩnh Nam, Phường Lĩnh Nam',
              'addressLocality': 'Quận Hoàng Mai',
              'addressRegion': 'Hà Nội',
              'postalCode': '100000',
              'addressCountry': 'VN'
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': 20.982887,
              'longitude': 105.881468
            },
            'hasMap': 'https://maps.app.goo.gl/cMn6HEe4KqVGCpPV7',
            'openingHoursSpecification': [
              {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'opens': '08:00',
                'closes': '17:30'
              }
            ],
            'areaServed': [
              'VN', 'Hà Nội', 'Hưng Yên', 'Bắc Ninh', 'Bắc Giang', 'Hải Phòng', 'Vĩnh Phúc', 'Hải Dương', 'Hà Nam', 'Thái Nguyên', 'Quảng Ninh'
            ],
            'department': [
              {
                '@type': 'LocalBusiness',
                'name': 'T&T Vina Industrial - Trụ Sở & Kho Hưng Yên',
                'address': {
                  '@type': 'PostalAddress',
                  'streetAddress': 'Thôn Trà Hồi, Xã Thái Thụy',
                  'addressLocality': 'Huyện Thái Thụy',
                  'addressRegion': 'Hưng Yên',
                  'addressCountry': 'VN'
                },
                'description': 'Kho hàng & giải pháp phụ trợ KCN Liên Hà Thái'
              }
            ],
            'knowsAbout': [
              'Robotics Cable Management & Dress Packs',
              'Murrplastik Systemtechnik Germany',
              'ESD Cleanroom Ionizing Equipment',
              'Hakko Lead-Free Soldering Stations',
              'HIOS Precision Electric Screwdrivers',
              'Quick High-Frequency Soldering 150W',
              'Factory Automation & Pneumatics',
              'VinFast Body Shop Robot Dresspack Solutions'
            ],
            'contactPoint': [
              {
                '@type': 'ContactPoint',
                'telephone': '+84-915-168-824',
                'contactType': 'customer service',
                'areaServed': 'VN',
                'availableLanguage': ['Vietnamese', 'English', 'Chinese', 'Korean', 'Japanese', 'German']
              }
            ]
          },
          {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            'name': 'Protools - T&T VINA Industrial',
            'url': BASE_URL,
            'publisher': {
              '@id': `${BASE_URL}/#organization`
            },
            'potentialAction': {
              '@type': 'SearchAction',
              'target': `${BASE_URL}/?search={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }
        ]
      };
      scriptTag.textContent = JSON.stringify(websiteSchema);
    }
  }, [product?.id, product?.sku, categorySlug, categoryName, propTitle, propDescription, propCanonicalUrl, locale]);

  return null;
}

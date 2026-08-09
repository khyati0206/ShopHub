/** Fallback when a product image fails to load */
export const FALLBACK_PRODUCT_IMAGE =
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop';

/**
 * Resolve an image path from seed data.
 * Supports absolute URLs (Unsplash) and local paths (/assets/products/...).
 */
export const resolveImageUrl = (src) => {
  if (!src) return FALLBACK_PRODUCT_IMAGE;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('/')) return src;
  return `/assets/products/${src}`;
};

/** Append crop params if missing (for consistent 800×800 squares). */
export const withSquareCrop = (url) => {
  if (!url) return url;
  if (url.includes('w=800') || url.includes('h=800')) return url;
  if (url.includes('images.unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&w=800&h=800&q=80`;
  }
  if (url.includes('images.pexels.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`;
  }
  return url;
};

export const getProductImage = (product, index = 0) => {
  const src = product?.images?.[index] || product?.images?.[0];
  return withSquareCrop(resolveImageUrl(src));
};

export const getProductImages = (product) => {
  const imgs = product?.images?.length ? product.images : [FALLBACK_PRODUCT_IMAGE];
  return imgs.map((src) => withSquareCrop(resolveImageUrl(src)));
};

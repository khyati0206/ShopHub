import { useState } from 'react';
import { FALLBACK_PRODUCT_IMAGE, withSquareCrop, resolveImageUrl } from '../utils/images';

const ProductImage = ({
  src,
  alt = 'Product',
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  square = true,
}) => {
  const [imgSrc, setImgSrc] = useState(() => {
    const resolved = resolveImageUrl(src);
    return square ? withSquareCrop(resolved) : resolved;
  });
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_PRODUCT_IMAGE);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      decoding="async"
    />
  );
};

export default ProductImage;

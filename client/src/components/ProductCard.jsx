import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import ProductImage from './ProductImage';
import { formatPrice, calculateDiscount, calculateSavings } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const discount = calculateDiscount(product.price, product.originalPrice);
  const savings = calculateSavings(product.price, product.originalPrice);

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded bg-gray-50">
        <ProductImage
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <h3 className="text-sm text-gray-900 line-clamp-2 mb-1 flex-grow">{product.title}</h3>

      <StarRating rating={product.rating} reviewCount={product.reviewCount} />

      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {savings && (
        <p className="text-xs text-green-700 mt-0.5">You save {formatPrice(savings)}</p>
      )}

      {product.badges?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {product.badges.includes('Prime') && (
            <span className="text-xs bg-sky-700 text-white px-1.5 py-0.5 rounded font-medium">
              Prime
            </span>
          )}
          {product.badges.includes('Best Seller') && (
            <span className="text-xs bg-orange-600 text-white px-1.5 py-0.5 rounded font-medium">
              Best Seller
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default ProductCard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { formatPrice, calculateDiscount, calculateSavings } from '../utils/helpers';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, relatedRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/related`),
        ]);
        setProduct(productRes.data);
        setRelated(relatedRes.data);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    setMessage('');
    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch (err) {
      setMessage(err.message || 'Failed to proceed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const savings = calculateSavings(product.price, product.originalPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square mb-4 overflow-hidden rounded-lg border bg-gray-50">
              <ProductImage
                src={product.images[selectedImage] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 shrink-0 rounded border-2 overflow-hidden bg-gray-50 ${
                      selectedImage === i ? 'border-amazon-orange' : 'border-gray-200'
                    }`}
                  >
                    <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="lg" />

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-700">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="text-sm text-red-600 font-medium">-{discount}%</span>
                  )}
                </>
              )}
            </div>

            {savings && (
              <p className="mt-2 text-sm text-green-700 font-medium">
                You save {formatPrice(savings)} ({discount}% off)
              </p>
            )}

            {product.badges?.length > 0 && (
              <div className="mt-3 flex gap-2">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      badge === 'Prime' ? 'bg-sky-700 text-white' : 'bg-orange-600 text-white'
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm font-medium">Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input-field w-20"
              >
                {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-sm text-green-700">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="btn-primary flex-1 py-3 text-center disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-secondary flex-1 py-3 text-center disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {message && (
              <p className={`mt-3 text-sm ${message.includes('Added') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

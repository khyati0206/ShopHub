import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';
import { formatPrice, getCartTotals, FREE_SHIPPING_THRESHOLD } from '../utils/helpers';

const CartPage = () => {
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const items = cart.items || [];
  const totals = getCartTotals(items);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amazon-orange" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Sign in to view your cart</h2>
        <p className="text-gray-600 mb-6">Your cart is saved when you&apos;re signed in</p>
        <Link to="/login" className="btn-primary inline-block mr-4">Sign In</Link>
        <Link to="/register" className="btn-secondary inline-block">Create Account</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Your ShopHub Cart is empty</h2>
        <p className="text-gray-600 mb-6">Add items to get started</p>
        <Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.productId;
            if (!product) return null;
            return (
              <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
                <Link to={`/products/${product._id}`} className="shrink-0">
                  <ProductImage
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${product._id}`} className="font-medium hover:text-orange-700 line-clamp-2">
                    {product.title}
                  </Link>
                  <p className="text-sm text-green-700 mt-1">In Stock</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-sm text-blue-600 hover:text-orange-700 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatPrice(product.price * item.quantity)}</p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-gray-500">{formatPrice(product.price)} each</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-32">
            <p className="text-lg mb-2">
              Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):{' '}
              <span className="font-bold">{formatPrice(totals.subtotal)}</span>
            </p>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</span>
              </div>
              {totals.subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-green-700">Add {formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} for free shipping</p>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                <span>Order Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary block text-center py-3 w-full">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

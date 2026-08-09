import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import ProductImage from '../components/ProductImage';
import { formatPrice } from '../utils/helpers';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-orange" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-600">Order not found</p>
        <Link to="/" className="btn-primary inline-block mt-4">Go Home</Link>
      </div>
    );
  }

  const paymentLabel = {
    card: 'Credit / Debit Card',
    upi: 'UPI',
    wallet: 'Digital Wallet',
    mock: 'Demo Payment',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-amazon-light py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-10 text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-emerald-100">Your order has been confirmed and is being processed.</p>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-4 border-b border-gray-100">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
              <p className="font-mono text-sm font-medium text-gray-800 truncate">{order._id}</p>
            </div>
            {order.transactionId && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Transaction ID</p>
                <p className="font-mono text-sm font-medium text-gray-800">{order.transactionId}</p>
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
              <p className="text-sm font-medium text-gray-800">
                {paymentLabel[order.paymentMethod] || 'Demo Payment'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-bold text-lg mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <ProductImage
                    src={item.image || item.productId?.images?.[0]}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-3 border-t">
                <span>Total Paid</span>
                <span className="text-red-700">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-amazon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Delivery Address
            </h2>
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-secondary text-center py-3 px-8 rounded-xl">
            View All Orders
          </Link>
          <Link to="/products" className="btn-primary text-center py-3 px-8 rounded-xl">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

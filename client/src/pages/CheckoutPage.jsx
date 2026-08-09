import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MockPaymentForm, ProcessingOverlay } from '../components/MockPaymentForm';
import ProductImage from '../components/ProductImage';
import { formatPrice, getCartTotals, FREE_SHIPPING_THRESHOLD } from '../utils/helpers';

const STEPS = ['Shipping', 'Payment', 'Review'];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {STEPS.map((label, i) => (
      <div key={label} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < currentStep
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                : i === currentStep
                ? 'bg-amazon-orange text-gray-900 shadow-lg shadow-orange-200 scale-110'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i < currentStep ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={`text-xs mt-2 font-medium ${
              i <= currentStep ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`w-16 sm:w-24 h-0.5 mx-2 mb-6 transition-colors duration-300 ${
              i < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [totals, setTotals] = useState(null);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
  });

  const items = cart.items || [];
  const cartTotals = getCartTotals(items);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress((prev) => ({
        ...prev,
        ...defaultAddr,
        fullName: defaultAddr.fullName || user.name,
      }));
    }
  }, [user]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setTotals(cartTotals);
    setStep(1);
  };

  const handlePayment = async (paymentMethod) => {
    setProcessing(true);
    setProcessingStep(0);

    const interval = setInterval(() => {
      setProcessingStep((s) => (s < 2 ? s + 1 : s));
    }, 600);

    try {
      const { data } = await api.post('/orders/place-mock-order', {
        shippingAddress: address,
        paymentMethod,
      });
      clearInterval(interval);
      setProcessingStep(2);
      await new Promise((r) => setTimeout(r, 400));
      await fetchCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      clearInterval(interval);
      alert(err.response?.data?.message || 'Order failed. Please try again.');
      setProcessing(false);
    }
  };

  if (items.length === 0 && step === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg">Your cart is empty</p>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">
          Continue Shopping
        </button>
      </div>
    );
  }

  const activeTotals = totals || cartTotals;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amazon-light">
      {processing && <ProcessingOverlay step={processingStep} />}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your order in a few simple steps</p>
        </div>

        <StepIndicator currentStep={step} />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amazon-navy to-amazon-dark px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </h2>
                </div>
                <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: 'fullName', label: 'Full Name', required: true },
                      { key: 'phone', label: 'Phone Number', required: false },
                    ].map(({ key, label, required }) => (
                      <div key={key} className={key === 'fullName' ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                        <input
                          type="text"
                          value={address[key]}
                          onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                          required={required}
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                      className="input-field"
                      placeholder="House no., building, street"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {['city', 'state', 'zipCode'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">
                          {field === 'zipCode' ? 'PIN Code' : field}
                        </label>
                        <input
                          type="text"
                          value={address[field]}
                          onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amazon-navy hover:bg-amazon-dark text-white font-semibold transition-colors mt-2"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amazon-navy to-amazon-dark px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Method
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-sm text-amazon-orange hover:underline"
                  >
                    ← Edit address
                  </button>
                </div>
                <div className="p-6">
                  <MockPaymentForm
                    totals={activeTotals}
                    onSubmit={handlePayment}
                    processing={processing}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-28">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amazon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h3>

              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 text-sm group">
                    <div className="relative shrink-0">
                      <ProductImage
                        src={item.productId?.images?.[0]}
                        alt=""
                        className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amazon-navy text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 text-gray-800 group-hover:text-orange-700 transition-colors">
                        {item.productId?.title}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 shrink-0">
                      {formatPrice((item.productId?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(activeTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(activeTotals.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={activeTotals.shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {activeTotals.shipping === 0 ? 'FREE' : formatPrice(activeTotals.shipping)}
                  </span>
                </div>
                {activeTotals.subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - activeTotals.subtotal)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-bold text-xl pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-red-700">{formatPrice(activeTotals.total)}</span>
                </div>
              </div>

              {step === 0 && address.fullName && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">
                  <p className="font-medium text-gray-700 mb-1">Delivering to</p>
                  <p className="text-gray-600">{address.fullName}</p>
                  {address.city && (
                    <p className="text-gray-500 text-xs">
                      {address.city}{address.state ? `, ${address.state}` : ''}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

import { useState } from 'react';
import { FaCreditCard, FaMobileAlt, FaLock, FaShieldAlt, FaAmazonPay } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { formatPrice } from '../utils/helpers';

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

const detectCardBrand = (number) => {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'generic';
};

const CardPreview = ({ cardNumber, cardName, expiry, brand }) => (
  <div className="relative w-full max-w-sm mx-auto mb-8 perspective-1000">
    <div className="relative h-52 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex flex-col justify-between">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amazon-orange blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-blue-500 blur-3xl" />
      </div>
      <div className="relative flex justify-between items-start">
        <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90" />
        {brand === 'visa' && (
          <span className="text-xl font-bold italic tracking-wider">VISA</span>
        )}
        {brand === 'mastercard' && (
          <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full bg-red-500 opacity-90" />
            <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-90" />
          </div>
        )}
        {brand === 'amex' && (
          <span className="text-lg font-bold text-blue-300">AMEX</span>
        )}
        {brand === 'generic' && (
          <div className="w-10 h-7 rounded border border-white/30" />
        )}
      </div>
      <div className="relative">
        <p className="font-mono text-xl tracking-[0.2em] mb-4">
          {cardNumber || '•••• •••• •••• ••••'}
        </p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Card Holder</p>
            <p className="text-sm font-medium uppercase tracking-wide truncate max-w-[180px]">
              {cardName || 'YOUR NAME'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Expires</p>
            <p className="text-sm font-mono">{expiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PaymentMethodTab = ({ label, icon: Icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
      active
        ? 'border-amazon-orange bg-orange-50 shadow-md scale-[1.02]'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <Icon className={`text-2xl ${active ? 'text-amazon-orange' : 'text-gray-600'}`} />
    <span className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-600'}`}>
      {label}
    </span>
  </button>
);

const ProcessingOverlay = ({ step }) => {
  const steps = ['Validating payment', 'Securing transaction', 'Confirming order'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-amazon-orange border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FaLock className="w-6 h-6 text-amazon-orange" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-sm text-gray-500 mb-4">{steps[step] || steps[0]}...</p>
        <div className="flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? 'w-8 bg-amazon-orange' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MockPaymentForm = ({ totals, onSubmit, processing }) => {
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const brand = detectCardBrand(cardNumber);
  const displayNumber = cardNumber || '•••• •••• •••• ••••';

  const validate = () => {
    if (method === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length < 16) return 'Enter a valid 16-digit card number';
      if (!cardName.trim()) return 'Enter the name on card';
      if (expiry.length < 5) return 'Enter a valid expiry date';
      if (cvv.length < 3) return 'Enter a valid CVV';
    }
    if (method === 'upi' && !upiId.includes('@')) {
      return 'Enter a valid UPI ID (e.g. name@upi)';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onSubmit(method);
  };

  const fillDemoCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardName('DEMO USER');
    setExpiry('12/28');
    setCvv('123');
    setError('');
  };

  const wallets = [
    { name: 'ShopHub Pay', balance: '₹1,04,250', icon: FaAmazonPay, color: 'from-orange-400 to-yellow-500' },
    { name: 'Google Pay', balance: 'Connected', icon: SiGooglepay, color: 'from-blue-500 to-green-500' },
    { name: 'PhonePe', balance: 'Ready', icon: SiPhonepe, color: 'from-purple-600 to-indigo-700' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
        <FaShieldAlt className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-medium text-emerald-800">Demo Checkout — Secure Simulation</p>
          <p className="text-xs text-emerald-600">No real payment. For portfolio demonstration only.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <PaymentMethodTab label="Card" icon={FaCreditCard} active={method === 'card'} onClick={() => setMethod('card')} />
        <PaymentMethodTab label="UPI" icon={FaMobileAlt} active={method === 'upi'} onClick={() => setMethod('upi')} />
        <PaymentMethodTab label="Wallet" icon={MdAccountBalanceWallet} active={method === 'wallet'} onClick={() => setMethod('wallet')} />
      </div>

      {method === 'card' && (
        <>
          <CardPreview
            cardNumber={displayNumber}
            cardName={cardName}
            expiry={expiry}
            brand={brand}
          />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  className="input-field pl-10 font-mono tracking-wider"
                />
                <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="JOHN DOE"
                className="input-field uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className="input-field font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  className="input-field font-mono"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemoCard}
              className="text-sm text-blue-600 hover:text-orange-700 hover:underline"
            >
              Auto-fill demo card details
            </button>
          </div>
        </>
      )}

      {method === 'upi' && (
        <div className="space-y-4 py-4">
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FaMobileAlt className="text-4xl text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Pay with UPI</h3>
            <p className="text-sm text-gray-500">Enter any UPI ID for demo</p>
            <div className="flex justify-center gap-4 mt-4">
              <SiGooglepay className="text-3xl text-gray-700" title="Google Pay" />
              <SiPhonepe className="text-3xl text-purple-600" title="PhonePe" />
              <SiPaytm className="text-3xl text-blue-600" title="Paytm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="input-field"
            />
          </div>
          <button
            type="button"
            onClick={() => setUpiId('demo@shophub')}
            className="text-sm text-blue-600 hover:underline"
          >
            Use demo UPI: demo@shophub
          </button>
        </div>
      )}

      {method === 'wallet' && (
        <div className="py-4 space-y-3">
          <p className="text-sm text-gray-600 mb-4">Select a demo wallet</p>
          {wallets.map((wallet) => {
            const WalletIcon = wallet.icon;
            return (
              <label
                key={wallet.name}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-amazon-orange cursor-pointer transition-colors has-[:checked]:border-amazon-orange has-[:checked]:bg-orange-50"
              >
                <input
                  type="radio"
                  name="wallet"
                  defaultChecked={wallet.name === 'ShopHub Pay'}
                  className="text-amazon-orange"
                />
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center text-white`}>
                  <WalletIcon className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{wallet.name}</p>
                  <p className="text-xs text-gray-500">{wallet.balance}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={processing}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-amazon-yellow to-amazon-orange hover:from-amazon-orange hover:to-amazon-yellow text-gray-900 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <FaLock className="w-5 h-5" />
            Pay {totals ? formatPrice(totals.total) : ''}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 pt-2 opacity-60">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FaShieldAlt className="w-3 h-3" /> 256-bit SSL
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-500">PCI Compliant</span>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-500">Demo Mode</span>
      </div>
    </form>
  );
};

export { MockPaymentForm, ProcessingOverlay };

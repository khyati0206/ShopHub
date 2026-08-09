export const formatPrice = (price) => {
  const amount = Number(price) || 0;
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export const calculateSavings = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((originalPrice - price) * 100) / 100;
};

export const FREE_SHIPPING_THRESHOLD = 1999;

export const getCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.productId?.price || item.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;
  return { subtotal, tax, shipping, total };
};

export const getCartItemCount = (items) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

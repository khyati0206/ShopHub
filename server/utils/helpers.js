import jwt from 'jsonwebtoken';

export const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal >= 1999 ? 0 : 99;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  return { subtotal, tax, shipping, total };
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

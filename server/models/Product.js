import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Books', 'Home & Kitchen', 'Fashion'],
    },
    slug: { type: String, trim: true, index: true },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 100, min: 0 },
    badges: [{ type: String, enum: ['Best Seller', 'Prime'] }],
    tags: [{ type: String }],
    featured: { type: String, enum: ['deals', 'recommended', 'bestseller', null], default: null },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });

export default mongoose.model('Product', productSchema);

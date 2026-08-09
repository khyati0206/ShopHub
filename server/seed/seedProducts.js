import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import catalog from './productsCatalog.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shophub');
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Strip seed-only fields before insert (slug is kept in DB for custom image lookups)
    const products = catalog.map(({ useLocalImages, ...product }) => product);

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedProducts();

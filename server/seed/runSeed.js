import Product from '../models/Product.js';
import catalog from './productsCatalog.js';

/**
 * Seed all products into MongoDB.
 * @param {{ force?: boolean }} options - force=true clears and re-seeds
 */
export const seedProducts = async ({ force = false } = {}) => {
  const existing = await Product.countDocuments();

  if (existing > 0 && !force) {
    console.log(`Database already has ${existing} products — skipping seed.`);
    return { seeded: false, count: existing };
  }

  if (force && existing > 0) {
    await Product.deleteMany({});
    console.log('Cleared existing products');
  }

  const products = catalog.map(({ useLocalImages, ...product }) => product);
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products into MongoDB`);

  return { seeded: true, count: products.length };
};

export default seedProducts;

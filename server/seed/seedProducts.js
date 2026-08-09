import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { seedProducts } from './runSeed.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const result = await seedProducts({ force: true });
    console.log(result.seeded ? 'Seed complete.' : 'Nothing to seed.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

run();

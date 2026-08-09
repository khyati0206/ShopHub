import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getRelatedProducts,
  getCategories,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);

export default router;

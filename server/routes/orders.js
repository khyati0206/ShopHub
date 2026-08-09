import { Router } from 'express';
import {
  placeMockOrder,
  getCheckoutPreview,
  getOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/checkout-preview', getCheckoutPreview);
router.post('/place-mock-order', placeMockOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;

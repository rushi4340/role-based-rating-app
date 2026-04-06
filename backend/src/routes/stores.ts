import { Router } from 'express';
import { getStores, getMyStores, createStore } from '../controllers/storeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Publicly available to all authenticated users
router.get('/', authenticate, getStores);

// Store owner specific
router.get('/my-stores', authenticate, authorize(['ADMIN', 'STORE_OWNER']), getMyStores);
router.post('/', authenticate, authorize(['ADMIN', 'STORE_OWNER']), createStore);

export default router;

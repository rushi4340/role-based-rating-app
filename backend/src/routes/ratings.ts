import { Router } from 'express';
import { submitRating } from '../controllers/ratingController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Normal users (and maybe others) can rate stores
router.post('/', authenticate, authorize(['ADMIN', 'USER', 'STORE_OWNER']), submitRating);

export default router;

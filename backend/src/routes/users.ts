import { Router } from 'express';
import { getUsers, getDashboardStats } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Only ADMIN can see all users and overall stats
router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/dashboard', authenticate, authorize(['ADMIN']), getDashboardStats);

export default router;

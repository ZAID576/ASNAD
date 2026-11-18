import { Router } from 'express';
import { getSummary, getRecent } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', getSummary);
router.get('/recent', getRecent);

export default router;

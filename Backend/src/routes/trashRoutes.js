import { Router } from 'express';
import { list, restore, permanentDelete } from '../controllers/trashController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.post('/:id/restore', restore);
router.delete('/:id/permanent', permanentDelete);

export default router;

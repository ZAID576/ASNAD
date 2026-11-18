import { Router } from 'express';
import {
  list,
  create,
  update,
  deleteCat,
  categorySchema,
  deleteCategorySchema,
} from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.post('/', validateRequest(categorySchema), create);
router.patch('/:id', validateRequest(categorySchema), update);
router.delete('/:id', validateRequest(deleteCategorySchema), deleteCat);

export default router;

import express from 'express';
import * as catController from '../controllers/category.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', catController.list);
router.post('/', catController.create);
router.patch('/:id', catController.update);
router.delete('/:id', catController.remove);

export default router;


import express from 'express';
import * as docController from '../controllers/document.controller.js';
import { requireAuth, requireGoogleDrive } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', docController.list);
router.post('/upload', requireGoogleDrive, docController.uploadMiddleware.single('file'), docController.upload);
router.get('/:id', docController.getById);
router.patch('/:id', docController.update);
router.get('/:id/download', requireGoogleDrive, docController.download);
router.post('/:id/trash', docController.trash);
router.post('/:id/restore', docController.restore);
router.delete('/:id/permanent', docController.permanentDelete);
router.post('/:id/favorite', docController.toggleFavorite);

export default router;


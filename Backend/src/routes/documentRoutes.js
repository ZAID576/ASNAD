import { Router } from 'express';
import {
  initiateUpload,
  completeUpload,
  upload,
  importFromDrive,
  list,
  getById,
  update,
  favorite,
  deleteDoc,
  restoreDoc,
  permanentDeleteDoc,
  download,
  viewFile,
  importSchema,
  updateDocSchema,
} from '../controllers/documentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { handleSingleUpload } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.post('/initiate-upload', initiateUpload);
router.post('/complete-upload', completeUpload);
router.post('/upload', handleSingleUpload, upload);
router.post('/import', validateRequest(importSchema), importFromDrive);
router.get('/:id', getById);
router.patch('/:id', validateRequest(updateDocSchema), update);
router.delete('/:id', deleteDoc);
router.post('/:id/restore', restoreDoc);
router.delete('/:id/permanent', permanentDeleteDoc);
router.post('/:id/favorite', favorite);
router.get('/:id/download', download);
router.get('/:id/view', viewFile);
router.get('/:id/preview', viewFile);

export default router;

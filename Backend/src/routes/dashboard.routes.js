import express from 'express';
import * as dashController from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/summary', dashController.getSummary);

export default router;


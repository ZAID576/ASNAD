import { Router } from 'express';
import authRoutes from './authRoutes.js';
import googleDriveRoutes from './googleDriveRoutes.js';
import documentRoutes from './documentRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import trashRoutes from './trashRoutes.js';
import { successResponse } from '../utils/response.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return successResponse(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Asnad Document Vault API',
    version: '1.0.0',
  }, 'Service is operational');
});

// Modular v1 routes
router.use('/auth', authRoutes);
router.use('/google-drive', googleDriveRoutes);
router.use('/documents', documentRoutes);
router.use('/categories', categoryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/trash', trashRoutes);

export default router;

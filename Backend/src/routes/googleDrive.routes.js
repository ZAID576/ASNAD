import express from 'express';
import * as driveController from '../controllers/googleDrive.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', requireAuth, driveController.getStatus);
router.get('/connect', requireAuth, driveController.getConnectUrl);
router.get('/callback', driveController.handleCallback); // Public callback invoked by Google OAuth redirect
router.get('/picker-config', requireAuth, driveController.getPickerToken);
router.post('/import', requireAuth, driveController.importPickerDoc);
router.post('/disconnect', requireAuth, driveController.disconnect);

export default router;


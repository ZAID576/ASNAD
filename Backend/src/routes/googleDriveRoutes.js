import { Router } from 'express';
import {
  getStatus,
  connect,
  callback,
  getToken,
  disconnect,
} from '../controllers/googleDriveController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { tokenLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Callback does not require auth middleware because user is redirected back from Google
router.get('/callback', callback);

// Protected routes
router.get('/status', requireAuth, getStatus);
router.get('/connect', requireAuth, connect);
router.post('/connect', requireAuth, connect);
router.get('/token', requireAuth, tokenLimiter, getToken);
router.post('/disconnect', requireAuth, disconnect);

export default router;

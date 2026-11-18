import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import v1Routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorResponse, successResponse } from './utils/response.js';

const app = express();

// Security headers with relaxed cross-origin opener policy for OAuth popups
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging in development
if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// General API Rate Limiting
app.use('/api', apiLimiter);

// Root health & info
app.get('/health', (req, res) => {
  return successResponse(res, { status: 'healthy', uptime: process.uptime() }, 'Asnad API operational');
});

// Mount V1 API
app.use('/api/v1', v1Routes);

// 404 Not Found handler
app.use((req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND', 404);
});

// Centralized error handler
app.use(errorHandler);

export default app;

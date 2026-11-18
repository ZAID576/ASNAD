import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { connectDB } from './lib/db.js';
import { logger } from './lib/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import v1Routes from './routes/index.js';

const app = express();

// Ensure DB connection is established on all requests (crucial for Vercel serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    logger.error('Database connection error in request lifecycle:', err);
    next(err);
  }
});

// Security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Flexible CORS for Localhost & Vercel Deployments
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin serverless)
      if (!origin) return callback(null, true);

      // Allow localhost, 127.0.0.1, or any vercel.app deployment
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        (env.CLIENT_URL && origin === env.CLIENT_URL)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Request logger (in development)
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API rate limiter
app.use('/api', apiLimiter);

// API status endpoints
app.get(['/', '/api', '/api/v1'], (req, res) => {
  res.json({
    name: 'Asnad API',
    version: '1.0.0',
    description: 'Personal Document Management & Cloud Storage SaaS Backend',
    status: 'online',
    healthCheck: '/api/v1/health',
    timestamp: new Date().toISOString(),
  });
});

// Mount API v1 routes
app.use('/api/v1', v1Routes);

// Centralized 404 and Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Standalone Node.js listener (disabled automatically on Vercel Serverless)
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      logger.info(`Asnad Backend Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API Base URL: http://localhost:${env.PORT}/api/v1`);
      logger.info(`Frontend Origin: ${env.CLIENT_URL}`);
    });

    const gracefulShutdown = () => {
      logger.info('Received shutdown signal. Closing server...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// If running in standalone Node environment (not Vercel serverless and not testing)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export default app;

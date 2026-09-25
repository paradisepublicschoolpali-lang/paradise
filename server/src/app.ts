import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { authRouter } from './routes/authRoutes';
import { apiRouter } from './routes/apiRoutes';

export const app = express();

// Security & Parsing Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (config.corsOrigins.includes(origin) || config.nodeEnv === 'development') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    school: 'Paradise Public School',
    service: 'School Management ERP Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api', apiRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.path}` });
});

// Central Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

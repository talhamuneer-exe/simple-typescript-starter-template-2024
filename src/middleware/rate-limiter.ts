import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { environment } from '../config/config';
import { rateLimitHits } from './metrics';
import { logRateLimit } from './security-logger';

/**
 * General API Rate Limiter
 * Limits requests per IP address
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: environment === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Too many requests from this IP, please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    const metadata = (
      req as Request & { metadata?: { ip?: string; path?: string } }
    ).metadata;
    const endpoint = metadata?.path || req.path || 'unknown';
    const ip = metadata?.ip || req.ip || 'unknown';

    // Track rate limit metric
    rateLimitHits.labels(endpoint, ip).inc();
    logRateLimit(req, endpoint);

    res.status(429).json({
      requestId: (req as Request & { id?: string }).id,
      message: 'Too many requests from this IP, please try again later.',
      errorCode: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Strict Rate Limiter for Authentication Endpoints
 * More restrictive limits for login/auth endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      requestId: (req as Request & { id?: string }).id,
      message: 'Too many authentication attempts, please try again later.',
      errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Strict Rate Limiter for Password Reset
 * Very restrictive limits for password reset endpoints
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    errorCode: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      requestId: (req as Request & { id?: string }).id,
      message: 'Too many password reset attempts, please try again later.',
      errorCode: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
    });
  },
});

/**
 * Create custom rate limiter
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  errorCode?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      error: options.message || 'Too many requests, please try again later.',
      errorCode: options.errorCode || 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

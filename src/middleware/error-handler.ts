import {
  // NextFunction,
  Request,
  Response,
} from 'express';

import { AppError, InternalError, logger } from '../utils';
import { httpErrorsTotal } from './metrics';

declare interface ErrorWithRequestId extends Error {
  requestId?: string | number;
}

/**
 * Global Error Handler Middleware
 * Handles all errors in the application and sends appropriate responses
 */
export const errorHandler = (
  error: ErrorWithRequestId,
  req: Request,
  res: Response,
  // _next: NextFunction,
): void => {
  const metadata = (
    req as Request & {
      metadata?: {
        requestId?: string;
        correlationId?: string;
        traceId?: string;
        path?: string;
        method?: string;
        ip?: string;
        userAgent?: string;
        userId?: string;
      };
    }
  ).metadata;
  const requestId =
    (req as Request & { id?: string }).id || metadata?.requestId || 'unknown';

  // If it's an AppError, use its built-in handling
  if (error instanceof AppError) {
    // Log error details with enhanced context
    logger.error('APP_ERROR', {
      code: error.code,
      type: error.type,
      prefix: error.prefix,
      message: error.message,
      requestId,
      correlationId: metadata?.correlationId,
      traceId: metadata?.traceId,
      endpoint: metadata?.path,
      method: metadata?.method,
      ip: metadata?.ip,
      userAgent: metadata?.userAgent,
      userId: metadata?.userId,
      timestamp: error.timestamp,
      isOperational: error.isOperational,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
    });

    // Track error metrics
    const route = metadata?.path || 'unknown';
    const method = metadata?.method || req.method || 'unknown';
    httpErrorsTotal.labels(method, route, error.code).inc();

    // Store error code in response locals for metrics middleware
    res.locals.errorCode = error.code;

    AppError.handle(error, res);
    return;
  }

  // Handle unknown errors
  error.requestId = requestId;

  logger.error('UNKNOWN_ERROR', {
    message: error.message,
    name: error.name,
    requestId,
    correlationId: metadata?.correlationId,
    traceId: metadata?.traceId,
    endpoint: metadata?.path,
    method: metadata?.method,
    ip: metadata?.ip,
    userAgent: metadata?.userAgent,
    userId: metadata?.userId,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });

  // Convert unknown errors to InternalError
  const internalError = new InternalError(
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message,
  );

  // Track error metrics for unknown errors
  const route = metadata?.path || 'unknown';
  const method = metadata?.method || req.method || 'unknown';
  httpErrorsTotal.labels(method, route, internalError.code).inc();

  // Store error code in response locals for metrics middleware
  res.locals.errorCode = internalError.code;

  AppError.handle(internalError, res);
  return;
};

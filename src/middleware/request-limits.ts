import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ErrorCode } from '../utils';

/**
 * Request Size Limits
 * Prevents DoS attacks through large payloads
 */
export const requestSizeLimits = {
  // JSON body size limit (default: 10MB)
  json: 10 * 1024 * 1024, // 10MB

  // URL-encoded body size limit (default: 1MB)
  urlencoded: 1 * 1024 * 1024, // 1MB

  // Maximum number of parameters
  parameterLimit: 1000,
};

/**
 * Request Timeout Middleware
 * Kills requests that take too long
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          requestId: (req as Request & { id?: string }).id,
          message: 'Request timeout',
          errorCode: 'REQUEST_TIMEOUT',
          timestamp: new Date().toISOString(),
        });
      }
    }, timeoutMs);

    // Clear timeout when response is sent
    res.on('finish', () => {
      clearTimeout(timeout);
    });

    res.on('close', () => {
      clearTimeout(timeout);
    });

    next();
  };
};

/**
 * Content-Type Validation Middleware
 * Ensures requests have valid Content-Type headers
 */
export const contentTypeValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // Skip for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }

  // Skip if no body
  if (!req.body || Object.keys(req.body).length === 0) {
    next();
    return;
  }

  const contentType = req.headers['content-type'];

  // Allow JSON and URL-encoded
  if (
    contentType &&
    (contentType.includes('application/json') ||
      contentType.includes('application/x-www-form-urlencoded'))
  ) {
    next();
    return;
  }

  // Reject invalid content types
  throw new BadRequestError(
    'Invalid Content-Type. Expected application/json or application/x-www-form-urlencoded',
    ErrorCode.VAL_001,
  );
};

/**
 * Request Parameter Limit Middleware
 * Prevents parameter pollution attacks
 */
export const parameterLimit = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // Parameter limit is already enforced by express.urlencoded
  // This is an additional check
  const totalParams =
    Object.keys(req.query).length +
    Object.keys(req.params).length +
    (req.body ? Object.keys(req.body).length : 0);

  if (totalParams > requestSizeLimits.parameterLimit) {
    throw new BadRequestError(
      `Too many parameters. Maximum allowed: ${requestSizeLimits.parameterLimit}`,
      ErrorCode.VAL_005,
    );
  }

  next();
};

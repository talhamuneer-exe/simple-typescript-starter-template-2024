/// <reference path="../types/index.d.ts" />
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { RequestMetadata } from '../types';

/**
 * Request Metadata Middleware
 * Captures comprehensive request metadata for tracking and debugging
 */
export const requestMetadata = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = uuidV4();
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidV4();
  const traceId = (req.headers['x-trace-id'] as string) || uuidV4();

  // Get client IP (handles proxies)
  const getClientIp = (): string => {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  };

  // Type assertions for extended request properties
  const reqWithUser = req as Request & { user?: { id?: string }; sessionID?: string };

  // Create request metadata
  const metadata: RequestMetadata = {
    requestId,
    correlationId,
    traceId,
    requestTimestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    ip: getClientIp(),
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length']
      ? parseInt(req.headers['content-length'], 10)
      : undefined,
    queryParams: Object.keys(req.query).length > 0 ? req.query : undefined,
    userId: reqWithUser.user?.id,
    sessionId: reqWithUser.sessionID,
  };

  // Attach to request and response with type assertions
  const reqExtended = req as Request & { metadata: RequestMetadata; id: string };
  const resExtended = res as Response & { id: string; metadata: RequestMetadata; locals: { startTime?: number } };

  reqExtended.metadata = metadata;
  reqExtended.id = requestId;
  resExtended.id = requestId;
  resExtended.metadata = metadata;

  // Set correlation and trace IDs in response headers for distributed tracing
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Trace-ID', traceId);

  // Store start time for performance tracking
  resExtended.locals.startTime = Date.now();

  next();
};

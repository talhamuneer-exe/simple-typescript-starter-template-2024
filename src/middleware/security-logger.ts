import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';
import { securityConfig } from '../config/security-config';

/**
 * Security Event Logger
 * Logs security-related events for monitoring and auditing
 */

export interface SecurityEvent {
  type: 'AUTH_FAILURE' | 'RATE_LIMIT' | 'INJECTION_ATTEMPT' | 'SUSPICIOUS_ACTIVITY' | 'VALIDATION_FAILURE';
  message: string;
  requestId?: string;
  ip?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
  details?: Record<string, unknown>;
}

/**
 * Log security events
 */
export function logSecurityEvent(event: SecurityEvent): void {
  if (!securityConfig.logging.logSecurityEvents) {
    return;
  }

  logger.error('SECURITY_EVENT', {
    type: event.type,
    message: event.message,
    requestId: event.requestId,
    ip: event.ip,
    endpoint: event.endpoint,
    method: event.method,
    userId: event.userId,
    timestamp: new Date().toISOString(),
    ...event.details,
  });
}

/**
 * Security Logger Middleware
 * Logs security-related events automatically
 */
export const securityLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const metadata = (req as Request & { metadata?: { ip?: string; path?: string; method?: string; userId?: string; requestId?: string } }).metadata;
  
  // Log suspicious patterns
  if (metadata) {
    // Check for suspicious user agents
    const userAgent = req.headers['user-agent'] || '';
    const suspiciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /masscan/i,
      /scanner/i,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
      logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        message: 'Suspicious user agent detected',
        requestId: metadata.requestId,
        ip: metadata.ip,
        endpoint: metadata.path,
        method: metadata.method,
        details: { userAgent },
      });
    }

    // Check for suspicious query parameters
    const queryString = JSON.stringify(req.query);
    if (queryString.length > 10000) {
      logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        message: 'Unusually large query string',
        requestId: metadata.requestId,
        ip: metadata.ip,
        endpoint: metadata.path,
        method: metadata.method,
      });
    }
  }

  next();
};

/**
 * Log authentication failure
 */
export function logAuthFailure(
  req: Request,
  reason: string,
  userId?: string,
): void {
  if (!securityConfig.logging.logFailedAuthAttempts) {
    return;
  }

  const metadata = (req as Request & { metadata?: { ip?: string; path?: string; method?: string; requestId?: string } }).metadata;

  logSecurityEvent({
    type: 'AUTH_FAILURE',
    message: `Authentication failure: ${reason}`,
    requestId: metadata?.requestId,
    ip: metadata?.ip,
    endpoint: metadata?.path,
    method: metadata?.method,
    userId,
  });
}

/**
 * Log rate limit event
 */
export function logRateLimit(req: Request, endpoint: string): void {
  const metadata = (req as Request & { metadata?: { ip?: string; requestId?: string } }).metadata;

  logSecurityEvent({
    type: 'RATE_LIMIT',
    message: 'Rate limit exceeded',
    requestId: metadata?.requestId,
    ip: metadata?.ip,
    endpoint,
  });
}

/**
 * Log injection attempt
 */
export function logInjectionAttempt(
  req: Request,
  type: 'SQL' | 'NoSQL' | 'XSS',
  details?: Record<string, unknown>,
): void {
  const metadata = (req as Request & { metadata?: { ip?: string; path?: string; method?: string; requestId?: string } }).metadata;

  logSecurityEvent({
    type: 'INJECTION_ATTEMPT',
    message: `${type} injection attempt detected`,
    requestId: metadata?.requestId,
    ip: metadata?.ip,
    endpoint: metadata?.path,
    method: metadata?.method,
    details,
  });
}


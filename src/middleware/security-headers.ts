import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

/**
 * Security Headers Middleware
 * Configures Helmet.js with security best practices
 */
export const securityHeaders = helmet({
  // Prevent clickjacking
  frameguard: {
    action: 'deny',
  },
  
  // Prevent MIME type sniffing
  noSniff: true,
  
  // Enable XSS protection
  xssFilter: true,
  
  // Remove X-Powered-By header
  hidePoweredBy: true,
  
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  
  // HTTP Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // Referrer Policy
  referrerPolicy: {
    policy: 'no-referrer',
  },
  
});

/**
 * Custom security headers middleware
 * Adds additional security headers not covered by Helmet
 */
export const customSecurityHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Prevent caching of sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options (additional to Helmet)
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection (for older browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};


import { environment } from './config';

/**
 * Security Configuration
 * Centralized security settings
 */
export const securityConfig = {
  // CORS Configuration
  cors: {
    origin:
      environment === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || []
        : [
            'http://localhost:5001',
            'http://localhost:3001',
            'http://localhost:5173',
          ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-Correlation-ID',
    ],
    exposedHeaders: ['X-Request-ID', 'X-Correlation-ID', 'X-Trace-ID'],
    maxAge: 86400, // 24 hours
  },

  // Rate Limiting Configuration
  rateLimit: {
    // General API rate limit
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: environment === 'production' ? 100 : 1000,
    },
    // Authentication rate limit
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
    },
    // Password reset rate limit
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,
    },
  },

  // Request Limits
  requestLimits: {
    json: parseInt(process.env.MAX_JSON_SIZE || '10485760', 10), // 10MB default
    urlencoded: parseInt(process.env.MAX_URLENCODED_SIZE || '1048576', 10), // 1MB default
    parameterLimit: parseInt(process.env.MAX_PARAMETERS || '1000', 10),
    timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10), // 30 seconds default
  },

  // Security Headers
  headers: {
    // Content Security Policy
    csp: {
      enabled: environment === 'production',
      reportOnly: false,
    },
    // HSTS
    hsts: {
      enabled: environment === 'production',
      maxAge: 31536000, // 1 year
    },
  },

  // Input Validation
  validation: {
    maxStringLength: 10000,
    maxArrayLength: 1000,
    maxObjectDepth: 10,
  },

  // Security Logging
  logging: {
    logSecurityEvents: true,
    logFailedAuthAttempts: true,
    logSuspiciousActivity: true,
  },
};

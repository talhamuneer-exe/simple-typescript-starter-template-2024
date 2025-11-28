import { Request, Response, NextFunction } from 'express';
import hpp from 'hpp';
import { body, validationResult } from 'express-validator';

/**
 * Sanitize object to prevent MongoDB injection
 * Removes any keys that start with $ or contain . from user input
 */
const sanitizeMongoObject = (obj: unknown, replaceWith = '_'): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeMongoObject(item, replaceWith));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Check for MongoDB operators ($, .)
      if (key.startsWith('$') || key.includes('.')) {
        // Log potential injection attempts
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[SECURITY] Potential MongoDB injection attempt detected: ${key}`,
          );
        }
        // Replace dangerous keys
        const safeKey = key
          .replace(/^\$/, replaceWith)
          .replace(/\./g, replaceWith);
        sanitized[safeKey] = sanitizeMongoObject(value, replaceWith);
      } else {
        sanitized[key] = sanitizeMongoObject(value, replaceWith);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * MongoDB Injection Prevention
 * Removes any keys that start with $ or contain . from user input
 * Custom implementation that works with read-only req.query
 */
export const mongoSanitization = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeMongoObject(req.body) as typeof req.body;
  }

  // Check query parameters for MongoDB injection attempts (but don't mutate since it's read-only)
  if (req.query && typeof req.query === 'object') {
    const dangerousKeys: string[] = [];
    for (const key of Object.keys(req.query)) {
      if (key.startsWith('$') || key.includes('.')) {
        dangerousKeys.push(key);
        // Log potential injection attempts
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[SECURITY] Potential MongoDB injection attempt detected in query: ${key}`,
          );
        }
      }
    }
    // If dangerous keys found, reject the request
    if (dangerousKeys.length > 0) {
      _res.status(400).json({
        requestId: (req as Request & { id?: string }).id,
        message:
          'Invalid query parameters detected. MongoDB injection attempt blocked.',
        errorCode: 'VAL-001',
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  // Sanitize params
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeMongoObject(req.params) as typeof req.params;
  }

  next();
};

/**
 * HTTP Parameter Pollution Prevention
 * Prevents parameter pollution attacks
 */
export const httpParameterPollution = hpp({
  whitelist: [
    // Add whitelisted parameters that can have multiple values
    'filter',
    'sort',
  ],
});

/**
 * XSS Prevention - Sanitize HTML in input
 */
export const xssSanitization = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  // Sanitize common XSS patterns in string inputs
  const sanitizeString = (str: string): string => {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const sanitizeObject = (obj: unknown): unknown => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body) as typeof req.body;
  }

  // Check query parameters for XSS (but don't mutate since it's read-only)
  // XSS in query params is less critical as they're URL-encoded by browsers
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        // Check for potential XSS patterns (log warning but don't block)
        const xssPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i];
        if (xssPatterns.some((pattern) => pattern.test(value))) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `[SECURITY] Potential XSS attempt detected in query parameter: ${key}`,
            );
          }
        }
      }
    }
  }

  next();
};

/**
 * Validation Result Handler
 * Handles validation errors from express-validator
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      requestId: (req as Request & { id?: string }).id,
      message: 'Validation failed',
      errors: errors.array(),
      timestamp: new Date().toISOString(),
    });
    return;
  }
  next();
};

/**
 * Common validation rules
 */
export const commonValidations = {
  // Email validation
  email: body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  // Password validation
  password: body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),

  // String sanitization
  sanitizeString: (field: string) =>
    body(field)
      .optional()
      .trim()
      .escape()
      .isLength({ max: 1000 })
      .withMessage(`${field} must be less than 1000 characters`),

  // ID validation
  mongoId: (field: string) =>
    body(field).optional().isMongoId().withMessage(`Invalid ${field} format`),

  // URL validation
  url: (field: string) =>
    body(field).optional().isURL().withMessage(`Invalid ${field} URL format`),
};

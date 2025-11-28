import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { body, validationResult } from 'express-validator';

/**
 * MongoDB Injection Prevention
 * Removes any keys that start with $ or contain . from user input
 */
export const mongoSanitization = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ key }) => {
    // Log potential injection attempts
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[SECURITY] Potential MongoDB injection attempt detected: ${key}`,
      );
    }
  },
});

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

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query) as typeof req.query;
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

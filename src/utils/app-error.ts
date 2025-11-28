import { Response } from 'express';

import { environment } from '../config/config';

import {
  BadRequestResponse,
  InternalErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ConflictResponse,
} from './app-response';
import { ErrorCode, ErrorMessages } from './error-codes';
import { ErrorType, ErrorTypeToHttpStatus } from './error-types';

/**
 * Base Application Error Class
 * Provides systematic error handling with codes, messages, and prefixes
 */
export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly type: ErrorType;
  public readonly prefix: string;
  public readonly statusCode: number;
  public readonly timestamp: Date;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    type: ErrorType,
    message?: string,
    isOperational = true,
  ) {
    const errorMessage = message || ErrorMessages[code] || 'An error occurred';
    super(errorMessage);

    this.name = this.constructor.name;
    this.code = code;
    this.type = type;
    this.prefix = code.split('-')[0];
    this.statusCode = ErrorTypeToHttpStatus[type];
    this.timestamp = new Date();
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Handle error and send appropriate response
   */
  public static handle(err: AppError, res: Response): void {
    const errorMessage =
      environment === 'production' && !err.isOperational
        ? 'Something went wrong.'
        : err.message;

    switch (err.type) {
      case ErrorType.NOT_FOUND:
        new NotFoundResponse(res, errorMessage, err.code).send();
        break;

      case ErrorType.BAD_REQUEST:
      case ErrorType.VALIDATION:
        new BadRequestResponse(res, errorMessage, err.code).send();
        break;

      case ErrorType.UNAUTHORIZED:
      case ErrorType.AUTHENTICATION:
        new UnauthorizedResponse(res, errorMessage, err.code).send();
        break;

      case ErrorType.FORBIDDEN:
      case ErrorType.AUTHORIZATION:
        new ForbiddenResponse(res, errorMessage, err.code).send();
        break;

      case ErrorType.CONFLICT:
      case ErrorType.BUSINESS_LOGIC:
        new ConflictResponse(res, errorMessage, err.code).send();
        break;

      default:
        new InternalErrorResponse(res, errorMessage, err.code).send();
    }
  }

  /**
   * Convert error to JSON format
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      type: this.type,
      prefix: this.prefix,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      isOperational: this.isOperational,
      ...(process.env.NODE_ENV !== 'production' && { stack: this.stack }),
    };
  }
}

// Application Errors
export class InternalError extends AppError {
  constructor(message?: string, code: ErrorCode = ErrorCode.APP_001) {
    super(code, ErrorType.INTERNAL, message);
  }
}

export class ValidationError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.VAL_000,
  ) {
    super(code, ErrorType.VALIDATION, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message?: string, code: ErrorCode = ErrorCode.VAL_000) {
    super(code, ErrorType.BAD_REQUEST, message);
  }
}

// Authentication Errors
export class AuthenticationError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.AUT_000,
  ) {
    super(code, ErrorType.AUTHENTICATION, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.AUT_005,
  ) {
    super(code, ErrorType.UNAUTHORIZED, message);
  }
}

// Authorization Errors
export class AuthorizationError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.AUTZ_000,
  ) {
    super(code, ErrorType.AUTHORIZATION, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.AUTZ_002,
  ) {
    super(code, ErrorType.FORBIDDEN, message);
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message?: string, code: ErrorCode = ErrorCode.DB_000) {
    super(code, ErrorType.DATABASE, message, false);
  }
}

// External Service Errors
export class ExternalServiceError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.EXT_000,
  ) {
    super(code, ErrorType.EXTERNAL, message);
  }
}

// Not Found Errors
export class NotFoundError extends AppError {
  constructor(message?: string, code: ErrorCode = ErrorCode.NF_001) {
    super(code, ErrorType.NOT_FOUND, message);
  }
}

// Business Logic Errors
export class BusinessLogicError extends AppError {
  constructor(
    message?: string,
    code: ErrorCode = ErrorCode.BL_000,
  ) {
    super(code, ErrorType.BUSINESS_LOGIC, message);
  }
}

export class ConflictError extends AppError {
  constructor(message?: string, code: ErrorCode = ErrorCode.BL_003) {
    super(code, ErrorType.CONFLICT, message);
  }
}

// System Errors
export class SystemError extends AppError {
  constructor(message?: string, code: ErrorCode = ErrorCode.SYS_000) {
    super(code, ErrorType.SYSTEM, message, false);
  }
}

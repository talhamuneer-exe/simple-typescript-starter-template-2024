/// <reference path="../types/index.d.ts" />
import { Response } from 'express';

import { ErrorCode } from './error-codes';

export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  NO_CONTENT = 201,
  CONFLICT = 409,
  GONE = 410,
}

interface ApiResponseData {
  // Request Tracking
  requestId: string;
  correlationId?: string; // For distributed tracing
  traceId?: string; // For request tracing
  
  // Response Data
  data?: unknown;
  message: string | Record<string, unknown>;
  
  // Error Information
  errorCode?: ErrorCode;
  responseCode?: string; // Route-specific response code (for success/error)
  
  // Timestamps
  timestamp: string; // Response timestamp in UTC
  requestTimestamp?: string; // When request was received (UTC)
  
  // Performance Metrics
  processingTime?: number; // Response time in milliseconds
  
  // Request Context (for debugging)
  endpoint?: string; // API endpoint path
  method?: string; // HTTP method
  
  // Additional Metadata (only in non-production)
  metadata?: {
    ip?: string;
    userAgent?: string;
    userId?: string;
  };
}

/**
 * Get current UTC timestamp in ISO 8601 format
 */
function getUTCTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Calculate processing time in milliseconds
 */
function getProcessingTime(startTime?: number): number | undefined {
  if (!startTime) return undefined;
  return Date.now() - startTime;
}

abstract class ApiResponse {
  constructor(
    protected res: Response,
    protected statusCode: ResponseStatus,
    protected message: string | Record<string, unknown>,
    protected data: unknown | null = null,
    protected errorCode?: ErrorCode,
    protected responseCode?: string, // Route-specific code
  ) {}

  public send(): void {
    const metadata = (this.res as Response & { metadata?: { requestId?: string; correlationId?: string; traceId?: string; requestTimestamp?: string; path?: string; method?: string; ip?: string; userAgent?: string; userId?: string } }).metadata;
    const startTime = this.res.locals.startTime;
    const isProduction = process.env.NODE_ENV === 'production';
    const resId = (this.res as Response & { id?: string }).id;

    const response: ApiResponseData = {
      requestId: resId || metadata?.requestId || 'unknown',
      message: this.message,
      timestamp: getUTCTimestamp(), // Response timestamp (UTC)
    };

    // Add correlation and trace IDs for distributed tracing
    if (metadata?.correlationId) {
      response.correlationId = metadata.correlationId;
    }
    if (metadata?.traceId) {
      response.traceId = metadata.traceId;
    }

    // Add request timestamp
    if (metadata?.requestTimestamp) {
      response.requestTimestamp = metadata.requestTimestamp;
    }

    // Add processing time
    const processingTime = getProcessingTime(startTime);
    if (processingTime !== undefined) {
      response.processingTime = processingTime;
    }

    // Add endpoint and method for context
    if (metadata?.path) {
      response.endpoint = metadata.path;
    }
    if (metadata?.method) {
      response.method = metadata.method;
    }

    // Add data if present
    if (this.data !== null) {
      response.data = this.data;
    }

    // Include error code for error responses
    if (this.errorCode) {
      response.errorCode = this.errorCode;
    }

    // Include response code for route-specific codes (success or error)
    if (this.responseCode) {
      response.responseCode = this.responseCode;
    }

    // Add additional metadata in non-production environments
    if (!isProduction && metadata) {
      response.metadata = {
        ip: metadata.ip,
        userAgent: metadata.userAgent,
        userId: metadata.userId,
      };
    }

    this.res.status(this.statusCode).json(response);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(
    res: Response,
    message = 'Not Found',
    errorCode?: ErrorCode,
    responseCode?: string, // Route-specific error code
  ) {
    super(res, ResponseStatus.NOT_FOUND, message, null, errorCode, responseCode);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(
    res: Response,
    message = 'Unknown error occurred',
    errorCode?: ErrorCode,
    responseCode?: string, // Route-specific error code
  ) {
    super(res, ResponseStatus.INTERNAL_ERROR, message, null, errorCode, responseCode);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(
    res: Response,
    message: string,
    errorCode?: ErrorCode,
    responseCode?: string, // Route-specific error code
  ) {
    super(res, ResponseStatus.BAD_REQUEST, message, null, errorCode, responseCode);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(
    res: Response,
    message: string,
    data?: unknown,
    responseCode?: string, // Route-specific success code
  ) {
    super(res, ResponseStatus.SUCCESS, message, data, undefined, responseCode);
  }
}

export class NoContentResponse extends ApiResponse {
  constructor(
    res: Response,
    message: string,
    responseCode?: string, // Route-specific success code
  ) {
    super(res, ResponseStatus.NO_CONTENT, message, null, undefined, responseCode);
  }
}

export class UnauthorizedResponse extends ApiResponse {
  constructor(
    res: Response,
    message: string | Record<string, unknown>,
    errorCode?: ErrorCode,
    responseCode?: string, // Route-specific error code
  ) {
    super(res, ResponseStatus.UNAUTHORIZED, message, null, errorCode, responseCode);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(
    res: Response,
    message: string,
    errorCode?: ErrorCode,
    responseCode?: string, // Route-specific error code
  ) {
    super(res, ResponseStatus.FORBIDDEN, message, null, errorCode, responseCode);
  }
}

export class ConflictResponse extends ApiResponse {
  constructor(
    res: Response,
    message: string,
    errorCode?: ErrorCode,
    responseCode?: string, // Route-specific error code
  ) {
    super(res, ResponseStatus.CONFLICT, message, null, errorCode, responseCode);
  }
}
